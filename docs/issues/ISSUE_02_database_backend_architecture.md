# Issue #2: Database Setup, Mongoose Schema Architecture & Hostel Seeder

## Metadata
- **Issue ID:** #2
- **Branch Name:** `feature/database-architecture`
- **Assigned Developer:** **Member 3 (Backend & Database Developer)**
- **Lead Reviewer:** **Syed Rayyan (Team Leader)**
- **Target PR:** `PR #2: MongoDB Mongoose Schemas & Hostel Seeder -> main`
- **Prerequisite:** Issue #1 completed and merged
- **Estimated Effort:** 6 Hours | **Difficulty:** Intermediate

---

## 1. Objective & Goal
Establish the MongoDB database connection with Mongoose ODM, design the 4 core Hostel domain models (`User`, `Room`, `Booking`, `Review`), configure centralized Express error middleware, and create an idempotent database seeder that populates demo Chief Warden, demo Student, and 8 hostel dormitories across Blocks A, B, and C.

---

## 2. Files to Create in `backend/`
- `src/config/db.js` (MongoDB connection logic with Atlas/Local fallback)
- `src/models/User.js` (Student & Warden authentication model)
- `src/models/Room.js` (Hostel dormitories, bed capacity, blocks, floor)
- `src/models/Booking.js` (Semester allocations, mess plans, bursar fees)
- `src/models/Review.js` (Student feedback & ratings)
- `src/middleware/errorMiddleware.js` (Centralized 404 & error handlers)
- `src/utils/seeder.js` (Seed data script)

---

## 3. Detailed Data Models Specification

### Model 1: `User.js` (`src/models/User.js`)
Fields to implement:
- `name`: String, required, trim.
- `email`: String, required, unique, lowercase, trim.
- `passwordHash`: String, required, excluded by default (`select: false`).
- `role`: String, enum: `['student', 'admin']`, default: `'student'`.
- `studentId`: String, uppercase, trim (e.g., `STU-2026-0891`).
- `course`: String, default: `'Computer Science & Engineering'`.
- `gender`: String, enum: `['Male', 'Female', 'Other']`.
- `phone`: String, required.
- `guardianName`: String.
- `guardianPhone`: String.
- `isActive`: Boolean, default: `true`.
- **Pre-save hook:** Hash password with `bcrypt.hash(password, 10)` when modified.
- **Method:** `matchPassword(enteredPassword)` returns `bcrypt.compare`.

### Model 2: `Room.js` (`src/models/Room.js`)
Fields to implement:
- `name`: String, required, trim (e.g., `"Block A Double Sharing Study Dorm"`).
- `roomNumber`: String, required, unique, uppercase (e.g., `"A-101"`, `"B-204"`, `"C-305"`).
- `block`: String, required, enum: `['Block A (Boys)', 'Block B (Girls)', 'Block C (Scholars)']`.
- `category`: String, required, enum: `['Single Scholar', 'Double Sharing', 'Triple Sharing', 'Quad Sharing']`.
- `gender`: String, required, enum: `['Boys', 'Girls', 'Co-ed']`.
- `floor`: Number, required, min: 1, max: 8.
- `capacity`: Number, required, min: 1, max: 4 (Total beds).
- `occupiedBeds`: Number, default: 0 (Live occupied beds counter).
- `pricePerSemester`: Number, required (Base semester fee in INR).
- `amenities`: `[String]`, e.g. `["High-Speed Gigabit Wi-Fi", "Study Desk with Lamp", "Attached Bath", "Individual Locker"]`.
- `images`: `[String]`, array of image URLs.
- `curfewTime`: String, default: `"10:00 PM"`.
- `status`: String, enum: `['available', 'occupied', 'maintenance']`, default: `'available'`.
- **Virtual Field:** `availableBeds` = `capacity - occupiedBeds`.

### Model 3: `Booking.js` (`src/models/Booking.js`)
Fields to implement:
- `bookingReference`: String, required, unique (Format: `HST-2026-XXXXXX`).
- `user`: ObjectId, ref: `'User'`, required.
- `room`: ObjectId, ref: `'Room'`, required.
- `startDate`: Date, required (Semester start date).
- `endDate`: Date, required (Semester end date).
- `academicYear`: String, default: `"2026-2027"`.
- `semester`: String, enum: `['Fall Semester', 'Spring Semester', 'Summer Term']`, default: `'Fall Semester'`.
- `messPlan`: String, enum: `['Standard 4-Meal', 'Special Diet', 'Room Only']`, default: `'Standard 4-Meal'`.
- `baseSemesterFee`: Number, required.
- `messFee`: Number, default: 18000.
- `cautionDeposit`: Number, default: 5000 (Refundable).
- `totalFee`: Number, required (`baseSemesterFee + messFee + cautionDeposit`).
- `status`: String, enum: `['pending', 'confirmed', 'checked_in', 'vacated', 'cancelled']`, default: `'confirmed'`.
- `paymentStatus`: String, enum: `['unpaid', 'paid', 'refunded']`, default: `'paid'`.
- `emergencyContact`: Object (`name`, `phone`, `relationship`).

### Model 4: `Review.js` (`src/models/Review.js`)
Fields:
- `user`: ObjectId, ref: `'User'`, required.
- `room`: ObjectId, ref: `'Room'`, required.
- `rating`: Number, required, min: 1, max: 5.
- `comment`: String, required, trim, minlength: 5.
- `isApproved`: Boolean, default: `true`.

---

## 4. Seeder Script Requirements (`backend/src/utils/seeder.js`)
When running `npm run seed`:
1. Connects to MongoDB, wipes existing collections safely.
2. Seeds **Chief Warden Admin**:
   - Email: `admin@xshostel.com`, Password: `Admin@123`, Role: `admin`.
3. Seeds **Student**:
   - Email: `student@xshostel.com`, Password: `Student@123`, Role: `student`, StudentID: `STU-2026-1042`.
4. Seeds **8 Dormitory Rooms**:
   - `A-101`: Block A (Boys), Double Sharing, Capacity: 2, Beds: 2, Price: ₹32,000.
   - `A-102`: Block A (Boys), Triple Sharing, Capacity: 3, Beds: 3, Price: ₹24,000.
   - `A-201`: Block A (Boys), Single Scholar, Capacity: 1, Beds: 1, Price: ₹48,000.
   - `B-101`: Block B (Girls), Double Sharing, Capacity: 2, Beds: 2, Price: ₹34,000.
   - `B-102`: Block B (Girls), Quad Sharing, Capacity: 4, Beds: 4, Price: ₹21,000.
   - `B-201`: Block B (Girls), Single Scholar, Capacity: 1, Beds: 1, Price: ₹50,000.
   - `C-101`: Block C (Scholars), Single Scholar, Capacity: 1, Beds: 1, Price: ₹55,000.
   - `C-201`: Block C (Scholars), Double Sharing, Capacity: 2, Beds: 2, Price: ₹38,000.
5. Populates 2 sample active allocations and 3 student reviews.

---

## 5. Acceptance Criteria & Definition of Done
- [ ] Running `npm run seed` logs: `MongoDB Connected`, `Data Destroyed...`, `Data Imported Successfully!`.
- [ ] All unique indexes are created (`User.email`, `Room.roomNumber`, `Booking.bookingReference`).
- [ ] Centralized error handler properly catches 404 routes and returns formatted JSON errors (`{ success: false, message: "..." }`).
- [ ] Member 3 pushes to `feature/database-architecture` and opens PR #2 for Syed Rayyan.
