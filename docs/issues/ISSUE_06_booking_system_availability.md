# Issue #6: Booking System and Availability Management

## Title
`[BOOKING] Reservation Workflow, Overlap Conflict Prevention, Server Pricing, and Demo Payment`

## Assignee
- **Primary Owner:** Member 4 (Booking and Integration Developer)
- **Supporting Contributors:** Member 3 (Backend Developer)
- **Branch:** `feature/booking-system`
- **Linked PR:** PR #6 (`feature/booking-system` -> `main`)

---

## 1. Description & Objective
Implement the hostel bed allocation engine. Validate semester session dates, verify bed capacity limits, enforce server-side semester and mess plan fee calculations, prevent overcapacity allocations (`409 Conflict`), generate student reference numbers (`HST-2026-XXXXXX`), and simulate instant university bursar fee confirmation.

---

## 2. Detailed Scope
- [x] Implement `POST /api/bookings` with:
  - Check-in and check-out dates representing the academic semester session.
  - Active bed capacity checks preventing over-allocation.
  - Server calculates room semester fee, mess plan subscription fee, and refundable caution deposit ($100).
  - Generates unique reference (e.g. `HST-2026-XXXXXX`).
  - Strict conflict check returning `409 Conflict` if no beds remain in the room.
- [x] Build multi-step `BookingPage.jsx` with academic year, semester term, mess plan selector, and demo fee payment simulator.
- [x] Display instant confirmation voucher displaying allocation reference, dorm block, room number, semester, and total fee.
- [x] Implement `PATCH /api/bookings/:id/cancel` enabling student room vacating requests.

---

## 3. Acceptance Criteria
- [x] Bookings with invalid or inverted dates are rejected on the server.
- [x] Bookings exceeding room capacity are rejected.
- [x] Double booking attempts for overlapping dates return `409 Conflict`.
- [x] Price calculations are computed exclusively on the backend.
- [x] Successful reservations produce a voucher and record under the authenticated user.
- [x] Demo payment clearly displays an academic simulation disclaimer.

---

## 4. Verification Command
```bash
# Verify booking creation
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <GUEST_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"roomId":"<ROOM_ID>","checkIn":"2026-11-01","checkOut":"2026-11-05","guests":2,"paymentMethod":"Demo Visa"}'
```
