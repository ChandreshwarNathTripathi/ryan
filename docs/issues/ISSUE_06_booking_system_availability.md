# Issue #6: Bed Allocation Engine, Mess Plan Selection & Conflict Prevention

## Metadata
- **Issue ID:** #6
- **Branch Name:** `feature/booking-system`
- **Assigned Developer:** **Member 4 (Hostel Allocations & Logic Specialist)**
- **Lead Reviewer:** **Syed Rayyan (Team Leader)**
- **Target PR:** `PR #6: Bed Allocation Engine & Conflict Prevention -> main`
- **Prerequisite:** Issues #1 through #5 merged
- **Estimated Effort:** 9 Hours | **Difficulty:** Advanced

---

## 1. Objective & Goal
Implement the core Hostel Bed Allocation Engine.
1. Prevent over-allocation and overlapping semester dates for the same student or overcapacity for the dorm (`409 Conflict`).
2. Calculate total semester bursar fees based on room category, selected Mess meal plan (`Standard 4-Meal`, `Special Diet`, `Room Only`), and refundable caution deposit (`₹5,000`).
3. Generate human-readable hostel allocation IDs (e.g., `HST-2026-A10101`).
4. Build the student allocation application page (`BookingPage.jsx`) with live pricing preview.

---

## 2. API Endpoints Specification (Backend)

Mounted under `/api/bookings`:

| Method | Endpoint | Access | Description & Request Parameters |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/bookings` | Student (`protect`) | Apply for bed allocation: `{ roomId, startDate, endDate, academicYear, semester, messPlan, emergencyContact }` |
| **GET** | `/api/bookings/my-bookings` | Student (`protect`) | Fetch logged-in student's allocation history |
| **GET** | `/api/bookings/:id` | Student / Warden | Get allocation details by ID |
| **PATCH** | `/api/bookings/:id/cancel` | Student / Warden | Vacate bed allocation / request release |

---

## 3. Allocation Engine Business Logic (`bookingController.js`)

### Step 1: Overlap & Capacity Conflict Detection
Before saving an allocation, run conflict validation:
```javascript
// 1. Check if the student already has an active allocation for the same period
const studentConflict = await Booking.findOne({
  user: req.user._id,
  status: { $in: ['confirmed', 'checked_in'] },
  $or: [
    { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
  ]
});

if (studentConflict) {
  return res.status(409).json({
    success: false,
    message: 'Conflict: You already hold an active hostel bed allocation for this semester term.'
  });
}

// 2. Check bed capacity limit for this specific room
const activeAllocations = await Booking.countDocuments({
  room: roomId,
  status: { $in: ['confirmed', 'checked_in'] },
  $or: [
    { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
  ]
});

if (activeAllocations >= room.capacity) {
  return res.status(409).json({
    success: false,
    message: `Conflict: Room ${room.roomNumber} is fully occupied for the selected term. All ${room.capacity} beds are allocated.`
  });
}
```

### Step 2: Bursar Fee Calculation
```javascript
const baseSemesterFee = room.pricePerSemester;
let messFee = 18000; // Default: Standard 4-Meal
if (messPlan === 'Special Diet') messFee = 24000;
if (messPlan === 'Room Only') messFee = 0;

const cautionDeposit = 5000; // Fixed refundable caution deposit
const totalFee = baseSemesterFee + messFee + cautionDeposit;
```

### Step 3: Atomic Bed Counter Update
Upon successful allocation creation, increment `room.occupiedBeds`:
```javascript
room.occupiedBeds = Math.min(room.capacity, room.occupiedBeds + 1);
if (room.occupiedBeds >= room.capacity) {
  room.status = 'occupied';
}
await room.save();
```

---

## 4. Frontend Application Page (`src/pages/BookingPage.jsx`)

### Form Structure & State:
1. **Dorm Summary Card:** Shows selected room number, block, floor, and sharing category.
2. **Academic Term & Dates:**
   - Academic Year (e.g. `2026-2027`).
   - Term Select (`Fall Semester`, `Spring Semester`, `Summer Term`).
   - Check-in Date (Semester Start) and Check-out Date (Semester End).
3. **Mess Dining Plan Selector:**
   - 3 Interactive Radio Cards:
     - **Standard 4-Meal Plan (₹18,000):** Breakfast, Lunch, High Tea, Dinner.
     - **Special Dietary Plan (₹24,000):** Protein rich, fresh fruits, customized meals.
     - **Room Only (₹0):** No mess dining subscription.
4. **Emergency Guardian Verification:**
   - Name, Emergency Phone, Relationship (Parent/Guardian).
5. **Live Bursar Fee Summary Table:**
   - Base Semester Dormitory Fee: `₹XX,XXX`
   - Mess Plan Subscription: `₹XX,XXX`
   - Refundable Caution Deposit: `₹5,000`
   - **Total Payable Amount: `₹XX,XXX`**
6. **Submit Button:** *"Confirm Bed Allocation"* with spinner and error display for `409 Conflict`.

---

## 5. Acceptance Criteria & Definition of Done
- [ ] Attempting to double-allocate the same student returns `409 Conflict`.
- [ ] Booking when room reaches `capacity` returns `409 Conflict: Room is fully occupied`.
- [ ] Allocation generates clean reference (e.g. `HST-2026-894102`).
- [ ] Vacating an allocation decrements `room.occupiedBeds` and updates status back to `available`.
- [ ] Member 4 opens PR #6 for Syed Rayyan's review.
