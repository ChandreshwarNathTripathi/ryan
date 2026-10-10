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
  console.log('  XSHOSTEL REST API AUTOMATED VERIFICATION SUITE   ');
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

    // 2. Warden Admin Login
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@xshostel.com',
      password: 'Admin@123',
    });
    assert(adminLogin.status === 200 && adminLogin.data.token, 'Warden Admin login succeeds with JWT');
    const adminToken = adminLogin.data.token;

    // 3. Student Login
    const studentLogin = await request('POST', '/api/auth/login', {
      email: 'student@xshostel.com',
      password: 'Student@123',
    });
    assert(studentLogin.status === 200 && studentLogin.data.token, 'Student login succeeds with JWT');
    const studentToken = studentLogin.data.token;

    // 4. Verify Password hash is omitted
    assert(studentLogin.data.data.passwordHash === undefined, 'Password hash is excluded from responses');

    // 5. Auth /me endpoint
    const meRes = await request('GET', '/api/auth/me', null, studentToken);
    assert(meRes.status === 200 && meRes.data.data.email === 'student@xshostel.com', 'GET /api/auth/me returns student profile with Student ID');

    // 6. Non-admin attempting admin endpoint
    const forbiddenRes = await request('GET', '/api/admin/stats', null, studentToken);
    assert(forbiddenRes.status === 403, 'Regular student cannot access warden stats (Role-Based Access Control)');

    // 7. Warden stats
    const statsRes = await request('GET', '/api/admin/stats', null, adminToken);
    assert(statsRes.status === 200 && statsRes.data.data.rooms.totalBeds > 0, 'Warden can access hostel bed analytics and occupancy');

    // 8. Fetch hostel rooms catalog
    const roomsRes = await request('GET', '/api/rooms');
    assert(roomsRes.status === 200 && roomsRes.data.count > 0, 'GET /api/rooms returns active hostel dorm catalog');
    const firstRoom = roomsRes.data.data[0];

    // 9. Fetch hostel room by ID
    const singleRoom = await request('GET', `/api/rooms/${firstRoom._id}`);
    assert(singleRoom.status === 200 && singleRoom.data.data.name === firstRoom.name, 'GET /api/rooms/:id returns single hostel dorm');

    // 10. Warden create hostel room CRUD
    const newRoomNumber = 'DORM-' + Math.floor(100 + Math.random() * 900);
    const createRoomRes = await request(
      'POST',
      '/api/rooms',
      {
        name: 'Block A Automated Test Dorm',
        roomNumber: newRoomNumber,
        block: 'Block A (Boys)',
        category: 'Double Sharing',
        gender: 'Boys',
        floor: 1,
        description: 'Temporary dormitory for automated verification testing.',
        pricePerNight: 280,
        capacity: 2,
        amenities: ['Study Desk', 'Campus Wi-Fi', 'Locker'],
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5'],
      },
      adminToken
    );
    assert(createRoomRes.status === 201 && createRoomRes.data.data.roomNumber === newRoomNumber, 'Warden can CREATE new hostel room');
    const createdRoomId = createRoomRes.data.data._id;

    // 11. Duplicate room number rejection
    const duplicateRes = await request(
      'POST',
      '/api/rooms',
      {
        name: 'Duplicate Dorm',
        roomNumber: newRoomNumber,
        block: 'Block A (Boys)',
        category: 'Double Sharing',
        description: 'Should fail',
        pricePerNight: 300,
        capacity: 2,
        amenities: ['Wi-Fi'],
        images: ['https://example.com/img.jpg'],
      },
      adminToken
    );
    assert(duplicateRes.status === 400, 'Duplicate hostel room numbers are rejected');

    // 12. Create Hostel Bed Allocation
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 20);
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 180);

    const bookingRes = await request(
      'POST',
      '/api/bookings',
      {
        roomId: createdRoomId,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        guests: 1,
        messPlan: 'Standard Veg Mess',
        specialRequests: 'Automated test suite room allocation.',
        paymentMethod: 'Demo Student Wallet Pay',
      },
      studentToken
    );
    assert(bookingRes.status === 201 && bookingRes.data.data.bookingReference, 'Student can apply for room allocation with semester fee & mess');
    const createdBooking = bookingRes.data.data;

    // 13. Prevent Overlapping Reservation
    const overlapRes = await request(
      'POST',
      '/api/bookings',
      {
        roomId: createdRoomId,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        guests: 1,
      },
      studentToken
    );
    assert(overlapRes.status === 409, 'Overlapping room allocations are prevented (Status 409 Conflict)');

    // 14. Student view own allocations
    const myBookings = await request('GET', '/api/bookings/my', null, studentToken);
    assert(myBookings.status === 200 && myBookings.data.count > 0, 'Student can view their own hostel allocation history');

    // 15. Student cancel / vacate eligible allocation
    const cancelRes = await request('PATCH', `/api/bookings/${createdBooking._id}/cancel`, null, studentToken);
    assert(cancelRes.status === 200 && cancelRes.data.data.status === 'cancelled', 'Student can cancel/vacate room allocation');

    // 16. Student submit review
    const reviewRes = await request(
      'POST',
      '/api/reviews',
      {
        roomId: firstRoom._id,
        rating: 5,
        comment: 'Excellent student accommodation with modern facilities and study tables.',
      },
      studentToken
    );
    assert(reviewRes.status === 201 && reviewRes.data.data.rating === 5, 'Student can submit hostel room review and rating');

    // 17. Warden delete test room
    const deleteRoomRes = await request('DELETE', `/api/rooms/${createdRoomId}`, null, adminToken);
    assert(deleteRoomRes.status === 200, 'Warden can DELETE room when no active allocations exist');

    // 18. Warden analytics
    const analyticsRes = await request('GET', '/api/admin/analytics', null, adminToken);
    assert(analyticsRes.status === 200 && analyticsRes.data.data.monthlyRevenue.length === 6, 'Warden can fetch 6-month visual analytics & block distribution');

    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test execution failed with error:', err);
  }
};

runTests();
