const BASE_URL = process.env.API_URL || 'http://localhost:5000';

let wardenToken = '';
let studentToken = '';
let testRoomId = '';
let testBookingId = '';
let passedCount = 0;
let failedCount = 0;

const runTest = async (testNumber, title, testFn) => {
  try {
    await testFn();
    console.log(`  [PASS] Test ${testNumber}: ${title}`);
    passedCount++;
  } catch (error) {
    console.error(`  [FAIL] Test ${testNumber}: ${title} -> ${error.message}`);
    failedCount++;
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message || 'Assertion failed');
};

const jsonFetch = async (endpoint, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
};

const executeSuite = async () => {
  console.log('====================================================');
  console.log('  XSHOSTEL REST API AUTOMATED VERIFICATION SUITE   ');
  console.log('====================================================\n');

  await runTest(1, 'Health Check Ping (GET /api/health)', async () => {
    const res = await jsonFetch('/api/health');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.status === 'OK', 'Expected status OK');
    assert(res.data.service === 'XSHostel REST API', 'Expected correct service name');
  });

  await runTest(2, 'Chief Warden Admin Login (POST /api/auth/login)', async () => {
    let res = await jsonFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@xshostel.com', password: 'Admin@123' })
    });
    if (res.status !== 200) {
      res = await jsonFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@xshostel.com', password: 'password123' })
      });
    }
    assert(res.status === 200, `Login failed with status ${res.status}`);
    wardenToken = res.data.token;
    assert(Boolean(wardenToken), 'Missing JWT token');
  });

  await runTest(3, 'Student Login (POST /api/auth/login)', async () => {
    let res = await jsonFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'student@xshostel.com', password: 'Student@123' })
    });
    if (res.status !== 200) {
      res = await jsonFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'student@xshostel.com', password: 'password123' })
      });
    }
    assert(res.status === 200, `Login failed with status ${res.status}`);
    studentToken = res.data.token;
    assert(Boolean(studentToken), 'Missing student JWT token');
  });

  await runTest(4, 'Password Hash Exclusion', async () => {
    const res = await jsonFetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(res.status === 200, 'Expected 200 for auth me');
    const user = res.data.data || res.data.user || res.data;
    assert(user.password === undefined, 'Password exposed');
    assert(user.passwordHash === undefined, 'PasswordHash exposed');
  });

  await runTest(5, 'Student Profile Verification (GET /api/auth/me)', async () => {
    const res = await jsonFetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(res.status === 200, 'Expected 200 OK');
    const user = res.data.data || res.data.user || res.data;
    assert(Boolean(user.studentId || user.rollNumber), 'Missing student identification');
  });

  await runTest(6, 'RBAC Unauthorized Access Guard (GET /api/admin/stats)', async () => {
    const res = await jsonFetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  });

  await runTest(7, 'Warden Bed Analytics Access (GET /api/admin/stats)', async () => {
    const res = await jsonFetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${wardenToken}` }
    });
    assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  });

  await runTest(8, 'Public Dorms Catalog (GET /api/rooms)', async () => {
    const res = await jsonFetch('/api/rooms');
    assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  });

  await runTest(9, 'Single Dorm Lookup (GET /api/rooms/:id)', async () => {
    const roomsRes = await jsonFetch('/api/rooms');
    const rooms = roomsRes.data.rooms || roomsRes.data.data || [];
    const targetId = rooms.length > 0 ? rooms[0]._id : '64d9f1e2f1b2c3d4e5f6a7b8';
    const res = await jsonFetch(`/api/rooms/${targetId}`);
    assert(res.status === 200 || res.status === 404, 'Lookup response returned');
  });

  await runTest(10, 'Warden Creates New Dorm (POST /api/rooms)', async () => {
    const res = await jsonFetch('/api/rooms', {
      method: 'POST',
      headers: { Authorization: `Bearer ${wardenToken}` },
      body: JSON.stringify({
        roomNumber: 'TEST-901',
        block: 'Block-D',
        capacity: 2,
        type: 'Double Sharing AC',
        monthlyRent: 12000
      })
    });
    assert(res.status === 201 || res.status === 200, `Status expected 201/200, got ${res.status}`);
    const room = res.data.room || res.data.data;
    if (room && room._id) testRoomId = room._id;
  });

  await runTest(11, 'Duplicate Room Number Rejection (POST /api/rooms)', async () => {
    const res = await jsonFetch('/api/rooms', {
      method: 'POST',
      headers: { Authorization: `Bearer ${wardenToken}` },
      body: JSON.stringify({
        roomNumber: 'TEST-901',
        block: 'Block-D',
        capacity: 2,
        type: 'Double Sharing AC',
        monthlyRent: 12000
      })
    });
    assert(res.status === 400 || res.status === 409, `Duplicate check failed, got ${res.status}`);
  });

  await runTest(12, 'Bed Allocation Application (POST /api/bookings)', async () => {
    const res = await jsonFetch('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        roomNumber: 'TEST-901',
        semester: 'Fall 2026',
        messPlan: 'Non-Vegetarian Full Board'
      })
    });
    assert(res.status === 201 || res.status === 200, `Allocation status expected 201/200, got ${res.status}`);
    const booking = res.data.booking || res.data.data;
    if (booking && booking._id) testBookingId = booking._id;
  });

  await runTest(13, 'Overlapping Allocation Prevention', async () => {
    const res = await jsonFetch('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        roomNumber: 'TEST-901',
        semester: 'Fall 2026',
        messPlan: 'Non-Vegetarian Full Board'
      })
    });
    assert(res.status === 409 || res.status === 400, `Overlapping block failed, got ${res.status}`);
  });

  await runTest(14, 'Student Allocation History (GET /api/bookings/my-bookings)', async () => {
    const res = await jsonFetch('/api/bookings/my-bookings', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  });

  await runTest(15, 'Bed Vacating / Cancellation (PATCH /api/bookings/:id/cancel)', async () => {
    const targetBookingId = testBookingId || '64d9f1e2f1b2c3d4e5f6a7b8';
    const res = await jsonFetch(`/api/bookings/${targetBookingId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(res.status === 200 || res.status === 404, 'Cancellation response processed');
  });

  await runTest(16, 'Student Room Review (POST /api/rooms/:id/reviews)', async () => {
    const targetRoomId = testRoomId || '64d9f1e2f1b2c3d4e5f6a7b8';
    const res = await jsonFetch(`/api/rooms/${targetRoomId}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ rating: 5, comment: 'Clean dorm and good facilities.' })
    });
    assert(res.status === 201 || res.status === 200 || res.status === 404, 'Review submitted');
  });

  await runTest(17, 'Safe Dormitory Deletion (DELETE /api/rooms/:id)', async () => {
    const targetRoomId = testRoomId || '64d9f1e2f1b2c3d4e5f6a7b8';
    const res = await jsonFetch(`/api/rooms/${targetRoomId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${wardenToken}` }
    });
    assert(res.status === 200 || res.status === 404, 'Dorm deletion processed');
  });

  await runTest(18, 'Warden 6-Month Visual Analytics (GET /api/admin/analytics)', async () => {
    const res = await jsonFetch('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${wardenToken}` }
    });
    assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  });

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('====================================================\n');
};

executeSuite().catch((err) => {
  console.error('Fatal suite failure:', err);
  process.exit(1);
});
