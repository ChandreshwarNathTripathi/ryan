# Issue #2: Database Setup and Backend Architecture

## Title
`[BACKEND] MongoDB Atlas Integration, Schema Modeling, and Express Architecture`

## Assignee
- **Primary Owner:** Member 3 (Backend Developer)
- **Supporting Contributors:** Syed Rayyan (Team Leader)
- **Branch:** `feature/database-architecture`
- **Linked PR:** PR #2 (`feature/database-architecture` -> `main`)

---

## 1. Description & Objective
Architect the backend data layer using Mongoose ODM, connect securely to MongoDB Atlas / local MongoDB, define the four core data models (`User`, `Room`, `Booking`, `Review`), and configure centralized Express error and validation middleware.

---

## 2. Detailed Scope
- [x] Configure Mongoose connection in `backend/src/config/db.js` supporting Atlas connection string and local fallback.
- [x] Create `User` Mongoose schema with `passwordHash`, role (`user`, `admin`), active status, timestamps, and bcrypt password comparison.
- [x] Create `Room` schema with unique `roomNumber`, category enum, capacity, price, amenities array, images array, and status.
- [x] Create `Booking` schema with unique `bookingReference`, references to User and Room, dates, guest count, price breakdown, status, and paymentStatus.
- [x] Create `Review` schema with User and Room references, rating (1-5), comments, and moderation status.
- [x] Implement centralized error handler in `errorMiddleware.js` handling `CastError`, duplicate key errors (code 11000), and validation errors.
- [x] Implement database seeder in `src/utils/seeder.js` with demo Admin, demo Guest, and 8 luxury suites.

---

## 3. Acceptance Criteria
- [x] MongoDB connects successfully and logs active host and database name.
- [x] Schemas strictly validate required fields, data types, min/max bounds, and unique constraints.
- [x] Unhandled routes trigger 404 JSON response; errors return consistent `{ success: false, message: "..." }`.
- [x] `npm run seed` runs idempotently and populates clean sample records.

---

## 4. Verification Command
```bash
cd backend
npm run seed
```
