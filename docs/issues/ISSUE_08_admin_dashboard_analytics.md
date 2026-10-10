# Issue #8: Chief Warden Operations Console & Pure SVG Visual Analytics

## Metadata
- **Issue ID:** #8
- **Branch Name:** `feature/admin-dashboard`
- **Assigned Developer:** **Syed Rayyan (Team Leader)**
- **Supporting Developers:** **Member 2 (Frontend Visual Analytics)** & **Member 3 (Backend Aggregations)**
- **Target PR:** `PR #8: Chief Warden Console & Pure SVG Visual Analytics -> main`
- **Prerequisite:** Issues #1 through #7 merged
- **Estimated Effort:** 10 Hours | **Difficulty:** Advanced

---

## 1. Objective & Goal
Build the Chief Warden Administrative Console (`/admin`):
1. **Backend:** Aggregation APIs for hostel metrics, 6-month fee collections, block room distributions, student directory, and disciplinary account suspension.
2. **Frontend:** Comprehensive admin layout with pure SVG & CSS interactive charts (6-Month Bursar Fee Collections Area Graph, Block Bed Distribution Bars), Room CRUD modal manager, Allocations ledger, Student Directory, and Hostel Curfew Settings.

---

## 2. API Endpoints Specification (Backend)

Mounted under `/api/admin` (Enforces `protect` and `admin` middlewares):

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/stats` | Warden Only | Returns metric cards: Total Rooms, Total Beds, Occupied Beds, Vacant Beds, Occupancy Rate (%), Active Students, Total Revenue |
| **GET** | `/api/admin/analytics` | Warden Only | Returns 6-month monthly revenue array and block distribution array for SVG charts |
| **GET** | `/api/admin/users` | Warden Only | List all students and staff with search and role filters |
| **PATCH** | `/api/admin/users/:id/toggle-status` | Warden Only | Toggle student account active/suspended status |

### MongoDB Aggregation Pipeline for Analytics (`backend/src/controllers/adminController.js`)
```javascript
// 6-Month Fee Collection Aggregation
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

const monthlyRevenue = await Booking.aggregate([
  { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'paid' } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      revenue: { $sum: '$totalFee' },
      allocations: { $sum: 1 }
    }
  },
  { $sort: { '_id': 1 } }
]);

// Block Distribution Aggregation
const blockStats = await Room.aggregate([
  {
    $group: {
      _id: '$block',
      rooms: { $sum: 1 },
      totalBeds: { $sum: '$capacity' },
      occupiedBeds: { $sum: '$occupiedBeds' }
    }
  }
]);
```

---

## 3. Frontend Admin Console Implementation Guide

### A. Admin Navigation & Layout (`src/pages/admin/AdminLayout.jsx`)
- Sidebar containing:
  - Header with Chief Warden Crest & Title.
  - Links: `Overview` (`/admin`), `Dormitories & Beds` (`/admin/rooms`), `Allocations Ledger` (`/admin/bookings`), `Student Directory` (`/admin/users`), `Resident Feedback` (`/admin/reviews`), `Curfew & Mess Settings` (`/admin/settings`).
  - Quick link to Public Site and Logout.

### B. Admin Overview & Visual Analytics (`src/pages/admin/AdminOverview.jsx`)
- **Metric Stat Cards:**
  - Total Campus Beds (`Bed` icon)
  - Current Occupancy Rate `%` (`TrendingUp` icon)
  - Active Resident Students (`Users` icon)
  - Total Semester Fees Collected (`IndianRupee` icon)
- **Pure SVG Area Chart (AreaGraph):**
  - **Title:** *"6-Month Fee Collections & Bursar Inflow"*
  - Displays gradient violet area graph with SVG coordinates, dynamic points, and monthly values.
- **Pure CSS/SVG Bar Chart (BarGraph):**
  - **Title:** *"Hostel Block Capacity & Bed Utilization"*
  - Displays grouped bars comparing Total Beds vs Occupied Beds across Block A, Block B, Block C.

### C. Dormitories CRUD Manager (`src/pages/admin/AdminRooms.jsx`)
- Filter by Block (A, B, C) and search room number.
- Table listing: Room Number, Block, Category, Floor, Beds (Occupied/Total), Status, Actions.
- **"Add New Dormitory" Modal:**
  - Form fields: Room Number, Block dropdown, Sharing Category, Floor, Total Bed Capacity, Price Per Semester, Amenities check-list, Curfew Time, Image URLs.
  - Submits to `POST /api/rooms` and refreshes table.
- Edit and Delete action buttons.

### D. Allocations Ledger (`src/pages/admin/AdminBookings.jsx`)
- Filter by Status (`confirmed`, `checked_in`, `vacated`, `cancelled`).
- Table displaying: Reference ID, Student Name, Roll Number, Room Number, Semester, Mess Plan, Total Paid, Status dropdown.
- Allows Warden to update status to `checked_in` or `vacated`.

### E. Student Directory (`src/pages/admin/AdminUsers.jsx`)
- Search by Student Name, Email, or Roll Number.
- Shows Degree Course, Emergency Phone, Role, and Account Status (`Active` / `Suspended`).
- Disciplinary toggle: *"Suspend Access"* / *"Restore Access"*.

### F. Hostel Settings (`src/pages/admin/AdminSettings.jsx`)
- Form to configure campus rules: Gate Curfew Hours (`10:00 PM`), Standard Mess Monthly Rate, Caution Deposit Amount, Emergency Desk Contact.

---

## 4. Acceptance Criteria & Definition of Done
- [ ] Non-admin students navigating to `/admin` are redirected to `/` with error notification.
- [ ] Pure SVG and CSS visual charts render dynamically without third-party chart dependencies.
- [ ] Warden can create a new dormitory room and immediately view it in the catalog.
- [ ] Updating allocation status immediately updates the database.
- [ ] Syed Rayyan reviews and merges PR #8.
