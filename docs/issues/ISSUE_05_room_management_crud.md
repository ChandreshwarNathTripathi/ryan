# Issue #5: Hostel Dormitories Management & Bed Inventory CRUD

## Metadata
- **Issue ID:** #5
- **Branch Name:** `feature/room-crud`
- **Assigned Developers:** **Member 3 (Backend Developer)** & **Member 2 (Frontend Developer)**
- **Lead Reviewer:** **Syed Rayyan (Team Leader)**
- **Target PR:** `PR #5: Dormitory CRUD Endpoints & Student Catalog -> main`
- **Prerequisite:** Issues #1 through #4 merged
- **Estimated Effort:** 9 Hours | **Difficulty:** Intermediate

---

## 1. Objective & Goal
Implement complete CRUD operations for hostel dormitories and beds:
1. **Backend (Member 3):** REST API endpoints to fetch, create, edit, filter, and delete hostel rooms, supporting filters by Block, Category/Sharing, Gender wing, floor, price range, and search keyword.
2. **Frontend (Member 2):** Build the public student dorm catalog page (`Rooms.jsx`) with live filtering and bed vacancy badges (`X Bed(s) Free`), and the comprehensive dormitory detail page (`RoomDetails.jsx`) with image galleries, specifications, amenities, and resident reviews.

---

## 2. API Endpoints Specification (Backend)

Mounted under `/api/rooms`:

| Method | Endpoint | Access | Description & Request Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/rooms` | Public | List dorms with query filtering: `?block=&category=&gender=&search=&minPrice=&maxPrice=&page=1&limit=9` |
| **GET** | `/api/rooms/:id` | Public | Get single dorm details with populated reviews and bed occupancy data |
| **POST** | `/api/rooms` | Warden (`admin`) | Create a new hostel room. Body: `{ name, roomNumber, block, category, gender, floor, capacity, pricePerSemester, amenities, images, curfewTime }` |
| **PUT** | `/api/rooms/:id` | Warden (`admin`) | Update dorm details, bed capacity, amenities, or status |
| **DELETE** | `/api/rooms/:id` | Warden (`admin`) | Delete dorm (Must check that no active allocations exist; otherwise return `400 Bad Request`) |
| **POST** | `/api/rooms/:id/reviews` | Student (`protect`) | Submit student review: `{ rating, comment }` |

### Backend Controller Logic (`backend/src/controllers/roomController.js`)
- **Query Filter Logic:**
  ```javascript
  const filter = {};
  if (req.query.block) filter.block = req.query.block;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.gender) filter.gender = req.query.gender;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { roomNumber: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.pricePerSemester = {};
    if (req.query.minPrice) filter.pricePerSemester.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.pricePerSemester.$lte = Number(req.query.maxPrice);
  }
  ```
- **Safety check on delete:**
  Query `Booking.findOne({ room: req.params.id, status: { $in: ['confirmed', 'checked_in'] } })`. If found, prevent deletion and return error.

---

## 3. Frontend Implementation Guide

### A. Dorm Catalog View (`src/pages/Rooms.jsx`)
- **Filter Toolbar:**
  - Search input for Room Number or Keyword.
  - Block Pills: `All`, `Block A (Boys)`, `Block B (Girls)`, `Block C (Scholars)`.
  - Sharing Type Dropdown: `All`, `Single Scholar`, `Double Sharing`, `Triple Sharing`, `Quad Sharing`.
  - Gender Filter: `All`, `Boys`, `Girls`, `Co-ed`.
  - Price Range Slider / Inputs: Min & Max semester fee.
- **Dormitory Card Item:**
  - Room image with block tag overlay (e.g., `Block A - Floor 2`).
  - Room Number badge (e.g., `Room A-101`).
  - Title and capacity indicator (e.g., `2 Beds Capacity`).
  - **Live Bed Vacancy Indicator:**
    - Green badge: `2 Beds Free` (if vacant).
    - Amber badge: `1 Bed Free` (if partially occupied).
    - Red badge: `Fully Allocated` (if full).
  - Price per semester (e.g., `₹32,000 / semester`).
  - *"View Details & Apply"* button navigating to `/rooms/:id`.

### B. Room Details View (`src/pages/RoomDetails.jsx`)
- **Top Section:** Multi-image gallery with main preview and thumbnail strip.
- **Specifications Table:** Block, Floor Number, Sharing Category, Gender Wing, Total Beds, Available Beds, Gate Curfew Time (`10:00 PM`).
- **Amenities Grid:** Badges with icons for Wi-Fi, Attached Washroom, Study Lamp, Ergonomic Chair, Wardrobe.
- **Live Fee Calculator:**
  - Select Mess Plan (`Standard 4-Meal`, `Special Diet`, `Room Only`).
  - Displays dynamic breakdown: Base Semester Fee + Mess Fee + Caution Deposit = Total Due.
  - *"Proceed to Allocation"* button navigating to `/book/:id`.
- **Resident Reviews Section:** List of approved student reviews with star ratings, timestamp, and review submission form for authenticated students.

---

## 4. Acceptance Criteria & Definition of Done
- [ ] `GET /api/rooms` returns filtered list and pagination metadata.
- [ ] Duplicate room number returns error `Room number already exists`.
- [ ] Catalog filters update URL params and re-fetch without full page reload.
- [ ] Bed vacancy badge accurately calculates free beds (`capacity - occupiedBeds`).
- [ ] Review form sends POST to `/api/rooms/:id/reviews` and updates display.
