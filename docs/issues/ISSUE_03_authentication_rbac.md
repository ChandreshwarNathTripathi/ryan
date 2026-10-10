# Issue #3: Authentication and Role-Based Authorization

## Title
`[SECURITY] JWT Authentication, Password Hashing, RBAC Middleware, and Auth Pages`

## Assignee
- **Primary Owner:** Syed Rayyan (Team Leader)
- **Supporting Contributors:** Member 2 (Frontend Developer)
- **Branch:** `feature/authentication`
- **Linked PR:** PR #3 (`feature/authentication` -> `main`)

---

## 1. Description & Objective
Implement end-to-end security, including password hashing via bcryptjs, JWT token generation and verification, authorization middleware distinguishing between guest and admin roles, and client-side authentication persistence via React Context API.

---

## 2. Detailed Scope
- [x] Implement `POST /api/auth/register` ensuring role defaults to `'user'` (preventing privilege self-escalation).
- [x] Implement `POST /api/auth/login` validating email/password and issuing signed 30-day JWT tokens.
- [x] Implement `GET /api/auth/me` and `PATCH /api/auth/profile` for authenticated users.
- [x] Build `protect` and `admin` middleware in `backend/src/middleware/auth.js`.
- [x] Build `AuthContext.jsx` in frontend providing `login`, `register`, `logout`, `user`, `token`, `isAuthenticated`, and `isAdmin`.
- [x] Build branded `Login.jsx` and `Register.jsx` pages with 1-click demo credential autofill.
- [x] Build `ProtectedRoute.jsx` guarding user and admin routes.

---

## 3. Acceptance Criteria
- [x] Registration and login workflows return JWT tokens upon valid credentials and reject invalid inputs.
- [x] Unauthorized or expired tokens return `401 Unauthorized`.
- [x] Non-admin tokens are strictly barred from `/api/admin/*` and administrative room mutations (`403 Forbidden`).
- [x] `passwordHash` is never exposed in API responses or serialized objects.
- [x] Client preserves session in `localStorage` across page refreshes.

---

## 4. Verification Command
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@xshotel.com","password":"Admin@123"}'
```
