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
Implement the hotel reservation engine. Validate check-in and check-out dates, verify guest capacity, enforce server-side price calculation (preventing client manipulation), prevent overlapping reservations, generate human-readable reference numbers, and simulate instant demo payment confirmation.

---

## 2. Detailed Scope
- [x] Implement `POST /api/bookings` with:
  - Check-in must be present or future date; check-out must be strictly greater than check-in.
  - Guest count cannot exceed room capacity.
  - Server calculates duration of nights, room subtotal, 12% luxury tax, and final amount.
  - Generates unique reference (e.g. `XSH-2026-XXXXXX`).
  - Strict date overlap check preventing double bookings on confirmed/pending reservations.
- [x] Build multi-step `BookingPage.jsx` with date pickers, capacity limit, special requests, and demo payment instrument simulator.
- [x] Display instant confirmation voucher displaying reference code, room thumbnail, dates, and total amount.
- [x] Implement `PATCH /api/bookings/:id/cancel` enabling guest cancellations for upcoming eligible reservations.

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
