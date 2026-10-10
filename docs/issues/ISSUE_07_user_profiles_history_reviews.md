# Issue #7: Student Portal, Roll Number Profile & Room Vacating System

## Metadata
- **Issue ID:** #7
- **Branch Name:** `feature/profiles-reviews`
- **Assigned Developers:** **Member 4 (Hostel Allocations Developer)** & **Member 2 (Frontend UI/UX)**
- **Lead Reviewer:** **Syed Rayyan (Team Leader)**
- **Target PR:** `PR #7: Student Allocation Portal & Profile Management -> main`
- **Prerequisite:** Issues #1 through #6 merged
- **Estimated Effort:** 7 Hours | **Difficulty:** Intermediate

---

## 1. Objective & Goal
Build the authenticated Student Portal:
1. **My Allocations Ledger (`MyBookings.jsx`):** View all active and past hostel bed allotments, inspection of mess meal plans, fee breakdowns, printable bursar clearance receipts, and room vacating / clearance requests.
2. **Student Profile (`Profile.jsx`):** Manage Student Roll Number, enrolled Degree Course, Emergency Guardian Contact, Phone, and password change.
3. **Backend Endpoints:** User profile retrieval and updating endpoints under `/api/users`.

---

## 2. API Endpoints Specification (Backend)

Mounted under `/api/users`:

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users/profile` | Student (`protect`) | Fetch student's profile data with enrolled degree and guardian details |
| **PUT** | `/api/users/profile` | Student (`protect`) | Update profile: `{ phone, guardianName, guardianPhone, course }` |
| **PUT** | `/api/users/change-password` | Student (`protect`) | Update password: `{ currentPassword, newPassword }` |

---

## 3. Frontend Implementation Guide

### A. My Allocations Ledger (`src/pages/MyBookings.jsx`)
- **Top Section:** Overview stats: Total Semesters Stayed, Active Allotment Badge, Total Fees Paid.
- **Allocation Card Layout:**
  - Header: Allocation Reference (e.g. `HST-2026-A10101`) + Status badge (`Confirmed`, `Checked In`, `Vacated`).
  - Dorm Info: Room Number (`A-101`), Block (`Block A (Boys)`), Sharing Category (`Double Sharing`).
  - Term Dates: Academic Year (`2026-2027`), Semester (`Fall Semester`), Start Date to End Date.
  - Mess Plan Pill: e.g., `Standard 4-Meal Plan`.
  - Financials: Total Fee Paid (`₹55,000`), caution deposit note (`₹5,000 Refundable upon exit clearance`).
- **Action Buttons:**
  - *"Print Bursar Receipt"*: Generates formatted clearance slip or invokes `window.print()`.
  - *"Request Room Vacate"*: Opens confirmation modal to vacate bed early.
- **Vacating Modal:**
  - Asks student for vacating date and reason (e.g., Semester completed, Internship relocation).
  - Triggers `PATCH /api/bookings/:id/cancel`.

### B. Student Profile View (`src/pages/Profile.jsx`)
- **Card 1: Academic Identity:**
  - Full Name
  - University Email (read-only)
  - Student Roll Number (e.g. `STU-2026-1042`)
  - Enrolled Degree Course (e.g. `B.Tech Computer Science & Engineering`)
- **Card 2: Emergency Contact & Residence:**
  - Mobile Phone Number
  - Guardian / Parent Name
  - Guardian Emergency Phone Number
  - Permanent Home Address
  - *"Save Changes"* button sending `PUT /api/users/profile`.
- **Card 3: Security & Credentials:**
  - Current Password input.
  - New Password input (min. 6 characters).
  - Confirm New Password input.
  - *"Update Password"* button sending `PUT /api/users/change-password`.

---

## 4. Acceptance Criteria & Definition of Done
- [ ] Student can view their list of allocations sorted by date descending.
- [ ] Vacating a room updates status to `'vacated'` and recalculates vacant beds in the dorm.
- [ ] Updating profile successfully updates phone and guardian info in MongoDB.
- [ ] Changing password verifies current password before replacing with new bcrypt hash.
- [ ] Member 4 and Member 2 open PR #7 for Syed Rayyan's review.
