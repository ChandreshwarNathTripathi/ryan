# Issue #7: User Profiles, Booking History, and Reviews

## Title
`[GUEST-SERVICES] Guest Portal, Reservation History, Eligible Cancellation, and Room Reviews`

## Assignee
- **Primary Owner:** Member 4 (Booking and Integration Developer)
- **Supporting Contributors:** Member 2 (Frontend Developer)
- **Branch:** `feature/profiles-reviews`
- **Linked PR:** PR #7 (`feature/profiles-reviews` -> `main`)

---

## 1. Description & Objective
Deliver the authenticated guest services portal: viewing and updating personal profile details, reviewing reservation history in "My Bookings", cancelling eligible upcoming stays with simulated refunds, and submitting room reviews with star ratings.

---

## 2. Detailed Scope
- [x] Build `GET /api/bookings/my` ensuring guests only retrieve their own reservations.
- [x] Build `MyBookings.jsx` showing reservation list, status badges, details, and "Cancel Reservation" modal.
- [x] Enforce cancellation policy: past or already cancelled bookings cannot be cancelled.
- [x] Build `Profile.jsx` allowing users to edit full name, phone number, and change passwords.
- [x] Implement room reviews system:
  - `GET /api/reviews` (fetch approved reviews).
  - `POST /api/reviews` (submit review with 1-5 star rating and comment).
  - Average rating calculation displayed on room cards and room detail pages.

---

## 3. Acceptance Criteria
- [x] Guests cannot access or cancel reservations belonging to other users.
- [x] Cancelled reservations update their status to `cancelled` and payment status to `refunded`.
- [x] Profile updates immediately reflect in session state and MongoDB.
- [x] Guest reviews display with user name and verified star rating.

---

## 4. Verification
Log in as `guest@xshotel.com` (`Guest@123`), navigate to `/my-bookings` to view bookings and test cancellation.
