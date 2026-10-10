# Issue #3: Authentication, Password Hashing, RBAC Middleware & Client Auth Context

## Metadata
- **Issue ID:** #3
- **Branch Name:** `feature/authentication`
- **Assigned Developer:** **Syed Rayyan (Team Leader)** & **Member 3 (Backend Developer)**
- **Supporting Developer:** **Member 2 (Frontend UI/UX)**
- **Target PR:** `PR #3: JWT Authentication & Role-Based Access Control -> main`
- **Prerequisite:** Issues #1 and #2 merged
- **Estimated Effort:** 7 Hours | **Difficulty:** Intermediate/Advanced

---

## 1. Objective & Goal
Implement secure authentication and Role-Based Access Control (RBAC).
1. **Backend:** Password hashing via bcryptjs, JWT generation, `protect` middleware, `admin` guard middleware, and `/api/auth/*` endpoints.
2. **Frontend:** React Context `AuthContext.jsx`, route protection component `ProtectedRoute.jsx`, and modern `Login.jsx` & `Register.jsx` pages equipped with 1-click demo autofill pills for both Chief Warden and Student accounts.

---

## 2. Files to Create / Implement

### Backend:
- `src/utils/generateToken.js` (Signs JWT with `userId` and `role`)
- `src/middleware/auth.js` (`protect` bearer token validator, `admin` role checker)
- `src/controllers/authController.js` (`register`, `login`, `getMe`, `updateProfile`)
- `src/routes/authRoutes.js` (Mounted at `/api/auth`)

### Frontend:
- `src/context/AuthContext.jsx` (Global auth state with localStorage sync)
- `src/components/ProtectedRoute.jsx` (Guards `/my-bookings`, `/profile`, `/admin/*`)
- `src/pages/Login.jsx` (Fast demo pills, validation, error toasts)
- `src/pages/Register.jsx` (Student registration form with Course & Student ID)

---

## 3. Detailed Technical Specifications

### A. JWT Generation (`backend/src/utils/generateToken.js`)
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = generateToken;
```

### B. Auth Middleware (`backend/src/middleware/auth.js`)
- `protect(req, res, next)`: Extracts `Bearer <token>` from `req.headers.authorization`. Verifies token via `jwt.verify`. Fetches user from DB (`User.findById(decoded.id).select('-passwordHash')`). If user not found or inactive, returns `401 Unauthorized`. Attaches `req.user`.
- `admin(req, res, next)`: Checks `req.user.role === 'admin'`. If not admin, returns `403 Forbidden: Chief Warden administrator privileges required`.

### C. Auth Controller Endpoints (`src/controllers/authController.js`)
1. **POST `/api/auth/register`**:
   - Body: `{ name, email, password, phone, studentId, course, gender, guardianName, guardianPhone }`
   - Validation: Checks if email already exists (`400 Bad Request`). Enforces `role = 'student'` to prevent self-escalation.
   - Response: `201 Created` with `{ success: true, token, user }`.
2. **POST `/api/auth/login`**:
   - Body: `{ email, password }`
   - Validation: Checks user exists (including `passwordHash`). Verifies with `user.matchPassword(password)`.
   - Response: `200 OK` with `{ success: true, token, user: { _id, name, email, role, studentId, course } }`.
3. **GET `/api/auth/me`**:
   - Headers: `Authorization: Bearer <token>`
   - Response: Returns populated profile of logged-in user.

### D. Frontend Auth Context (`frontend/src/context/AuthContext.jsx`)
Exposes state and methods via `useAuth()`:
- `user`: Currently authenticated user object (or `null`).
- `token`: JWT string (persisted in `localStorage.getItem('token')`).
- `login(email, password)`: Sends POST to `/api/auth/login`, saves token and user, sets state.
- `register(formData)`: Sends POST to `/api/auth/register`, saves token and user.
- `logout()`: Clears `localStorage` and resets state to `null`.
- `isAuthenticated`: Boolean (`!!user`).
- `isAdmin`: Boolean (`user?.role === 'admin'`).

### E. Frontend Login & Register Pages
- **Demo Autofill Buttons:**
  - `Warden Demo`: Automatically fills `admin@xshostel.com` / `Admin@123`.
  - `Student Demo`: Automatically fills `student@xshostel.com` / `Student@123`.
- Smooth input animations, error alerts, and redirect to destination URL upon success.

---

## 4. Acceptance Criteria & Definition of Done
- [ ] Attempting to login with incorrect credentials returns `401 Unauthorized: Invalid email or password`.
- [ ] Passwords stored in MongoDB are hashed with bcrypt (never plaintext).
- [ ] Regular student tokens cannot access `/api/admin/*` (`403 Forbidden`).
- [ ] Page refresh in frontend keeps user logged in.
- [ ] Logout immediately clears storage and redirects to `/login`.
