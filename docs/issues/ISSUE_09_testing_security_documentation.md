# Issue #9: Automated Testing Suite, Security Audit & API Documentation

## Metadata
- **Issue ID:** #9
- **Branch Name:** `feature/testing-documentation`
- **Assigned Developer:** **Member 3 (Backend Developer)** & **Syed Rayyan (Team Leader)**
- **Supporting Developers:** Member 2 & Member 4
- **Target PR:** `PR #9: 18-Point Automated API Test Suite & Security Hardening -> main`
- **Prerequisite:** Issues #1 through #8 merged
- **Estimated Effort:** 8 Hours | **Difficulty:** Intermediate

---

## 1. Objective & Goal
Build a standalone automated end-to-end API verification suite (`backend/src/utils/testSuite.js`) that executes 18 comprehensive tests verifying authentication, role-based security, dorm CRUD, bed allocations, conflict prevention, reviews, and admin aggregations. Perform a security hardening pass ensuring zero password leaks and safe input handling.

---

## 2. 18 Automated Test Cases Specification (`src/utils/testSuite.js`)

The test script must execute against `http://localhost:5000` using native Node.js HTTP/Fetch:

1. **Test 1: Health Check Ping** — `GET /api/health` returns HTTP 200 with `status: "OK"` and `service: "XSHostel REST API"`.
2. **Test 2: Chief Warden Admin Login** — `POST /api/auth/login` with `admin@xshostel.com` returns HTTP 200 and valid JWT token.
3. **Test 3: Student Login** — `POST /api/auth/login` with `student@xshostel.com` returns HTTP 200 and valid JWT token.
4. **Test 4: Password Hash Exclusion** — Asserts that neither login nor profile responses expose `passwordHash` or `password`.
5. **Test 5: Student Profile Verification** — `GET /api/auth/me` with student token returns student roll number and enrolled course.
6. **Test 6: RBAC Unauthorized Access Guard** — Student token attempting to call `GET /api/admin/stats` is blocked with HTTP 403 Forbidden.
7. **Test 7: Warden Bed Analytics Access** — Warden token calling `GET /api/admin/stats` receives HTTP 200 and total bed statistics.
8. **Test 8: Public Dorms Catalog** — `GET /api/rooms` returns list of active dorms across blocks.
9. **Test 9: Single Dorm Lookup** — `GET /api/rooms/:id` returns dorm details, capacity, and amenities.
10. **Test 10: Warden Creates New Dorm** — `POST /api/rooms` with unique room number `TEST-901` creates dorm successfully (HTTP 201).
11. **Test 11: Duplicate Room Number Rejection** — `POST /api/rooms` with existing room number returns HTTP 400 Bad Request.
12. **Test 12: Bed Allocation Application** — Student creates semester allocation with mess plan; returns HTTP 201 and reference ID.
13. **Test 13: Overlapping Allocation Prevention** — Duplicate allocation attempt for same semester returns HTTP 409 Conflict.
14. **Test 14: Student Allocation History** — `GET /api/bookings/my-bookings` returns logged-in student's allocation list.
15. **Test 15: Bed Vacating / Cancellation** — `PATCH /api/bookings/:id/cancel` marks allocation vacated and releases bed counter.
16. **Test 16: Student Room Review** — `POST /api/rooms/:id/reviews` submits rating and comment (HTTP 201).
17. **Test 17: Safe Dormitory Deletion** — `DELETE /api/rooms/:id` removes test room when no active allocations exist (HTTP 200).
18. **Test 18: Warden 6-Month Visual Analytics** — `GET /api/admin/analytics` returns monthly fee collection array for Recharts.

---

## 3. Security Audit & Hardening Checklist
- [x] **No Plaintext Passwords:** Mongoose schema sets `select: false` on `passwordHash`.
- [x] **Role Self-Escalation Blocked:** `POST /api/auth/register` explicitly forces `role = 'student'`, ignoring any client-sent role.
- [x] **CORS Whitelist:** Restricts allowed origins to `CLIENT_URL` (default `http://localhost:5173`).
- [x] **JWT Expiration:** Tokens are strictly verified and signed with configured expiration (`30d`).
- [x] **Centralized Error Sanitation:** Stack traces are hidden in production mode (`process.env.NODE_ENV === 'production'`).

---

## 4. Test Execution Command
To run the automated suite:
```bash
node backend/src/utils/testSuite.js
```

Expected Output:
```
====================================================
  XSHOSTEL REST API AUTOMATED VERIFICATION SUITE   
====================================================
  [PASS] Health API responds 200 OK
  [PASS] Warden Admin login succeeds with JWT
  [PASS] Student login succeeds with JWT
  ...
====================================================
  TEST RESULTS: 18 PASSED, 0 FAILED
====================================================
```

---

## 5. Acceptance Criteria & Definition of Done
- [ ] Running `node backend/src/utils/testSuite.js` results in **18 PASSED, 0 FAILED**.
- [ ] Running `npm run build` in `frontend/` builds in under 3 seconds with zero lint errors.
- [ ] Member 3 and Syed Rayyan sign off and merge PR #9 into `main`.
