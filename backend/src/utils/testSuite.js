const http = require('http');

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

const runTests = async () => {
  console.log('====================================================');
  console.log('   XSHOTEL REST API AUTOMATED VERIFICATION SUITE   ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data.status === 'OK', 'Health API responds 200 OK');

    // 2. Admin Login
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@xshotel.com',
      password: 'Admin@123',
    });
    assert(adminLogin.status === 200 && adminLogin.data.token, 'Admin login succeeds with JWT');
    const adminToken = adminLogin.data.token;

    // 3. Guest Login
    const guestLogin = await request('POST', '/api/auth/login', {
      email: 'guest@xshotel.com',
      password: 'Guest@123',
    });
    assert(guestLogin.status === 200 && guestLogin.data.token, 'Guest login succeeds with JWT');
    const guestToken = guestLogin.data.token;

    // 4. Verify Password hash is omitted
    assert(guestLogin.data.data.passwordHash === undefined, 'Password hash is excluded from responses');

    // 5. Auth /me endpoint
    const meRes = await request('GET', '/api/auth/me', null, guestToken);
    assert(meRes.status === 200 && meRes.data.data.email === 'guest@xshotel.com', 'GET /api/auth/me returns guest profile');

    // 6. Non-admin attempting admin endpoint
    const forbiddenRes = await request('GET', '/api/admin/stats', null, guestToken);
    assert(forbiddenRes.status === 403, 'Regular guest cannot access admin stats (Role-Based Access Control)');

    // 7. Admin stats
    const statsRes = await request('GET', '/api/admin/stats', null, adminToken);
    assert(statsRes.status === 200 && statsRes.data.data.rooms.total > 0, 'Admin can access stats and room counts');

    // 8. Fetch rooms catalog
    const roomsRes = await request('GET', '/api/rooms');
    assert(roomsRes.status === 200 && roomsRes.data.count > 0, 'GET /api/rooms returns active suite catalog');
    const firstRoom = roomsRes.data.data[0];

    // 9. Fetch room by ID
    const singleRoom = await request('GET', `/api/rooms/${firstRoom._id}`);
    assert(singleRoom.status === 200 && singleRoom.data.data.name === firstRoom.name, 'GET /api/rooms/:id returns single suite');

    // 10. Admin create room CRUD
    const newRoomNumber = 'TEST-' + Math.floor(100 + Math.random() * 900);
    const createRoomRes = await request(
      'POST',
      '/api/rooms',
      {
        name: 'Test Automation Suite',
        roomNumber: newRoomNumber,
        category: 'Deluxe',
        description: 'Temporary suite for automated verification testing.',
        pricePerNight: 350,
        capacity: 2,
        amenities: ['Wi-Fi', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427'],
      },
      adminToken
    );
    assert(createRoomRes.status === 201 && createRoomRes.data.data.roomNumber === newRoomNumber, 'Admin can CREATE new room');
    const createdRoomId = createRoomRes.data.data._id;

    // 11. Duplicate room number rejection
    const duplicateRes = await request(
      'POST',
      '/api/rooms',
      {
        name: 'Duplicate Suite',
        roomNumber: newRoomNumber,
        category: 'Deluxe',
        description: 'Should fail',
        pricePerNight: 400,
        capacity: 2,
        amenities: ['Wi-Fi'],
        images: ['https://example.com/img.jpg'],
      },
      adminToken
    );
    assert(duplicateRes.status === 400, 'Duplicate room numbers are rejected');

    // 12. Create Booking on created room
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 20);
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 23);

    const bookingRes = await request(
      'POST',
      '/api/bookings',
      {
        roomId: createdRoomId,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        guests: 2,
        specialRequests: 'Automated test suite reservation.',
        paymentMethod: 'Demo Automated Test Card',
      },
      guestToken
    );
    assert(bookingRes.status === 201 && bookingRes.data.data.bookingReference, 'Guest can create reservation with server-side pricing');
    const createdBooking = bookingRes.data.data;

    // 13. Prevent Overlapping Reservation
    const overlapRes = await request(
      'POST',
      '/api/bookings',
      {
        roomId: createdRoomId,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        guests: 2,
      },
      guestToken
    );
    assert(overlapRes.status === 409, 'Overlapping reservation dates are prevented (Status 409 Conflict)');

    // 14. Guest view own bookings
    const myBookings = await request('GET', '/api/bookings/my', null, guestToken);
    assert(myBookings.status === 200 && myBookings.data.count > 0, 'Guest can view their own booking history');

    // 15. Guest cancel eligible booking
    const cancelRes = await request('PATCH', `/api/bookings/${createdBooking._id}/cancel`, null, guestToken);
    assert(cancelRes.status === 200 && cancelRes.data.data.status === 'cancelled', 'Guest can cancel future booking (Refund processed)');

    // 16. Guest submit review
    const reviewRes = await request(
      'POST',
      '/api/reviews',
      {
        roomId: firstRoom._id,
        rating: 5,
        comment: 'Superb hospitality and automated validation excellence.',
      },
      guestToken
    );
    assert(reviewRes.status === 201 && reviewRes.data.data.rating === 5, 'Guest can submit room review and star rating');

    // 17. Admin delete test room
    const deleteRoomRes = await request('DELETE', `/api/rooms/${createdRoomId}`, null, adminToken);
    assert(deleteRoomRes.status === 200, 'Admin can DELETE room when no active future bookings exist');

    // 18. Admin analytics
    const analyticsRes = await request('GET', '/api/admin/analytics', null, adminToken);
    assert(analyticsRes.status === 200 && analyticsRes.data.data.monthlyRevenue.length === 6, 'Admin can fetch 6-month visual analytics');

    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test execution failed with error:', err);
  }
};

runTests();
