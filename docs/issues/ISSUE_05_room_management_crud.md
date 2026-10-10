# Issue #5: Complete Room Management CRUD

## Title
`[ADMIN-CRUD] Full Suite Catalog Management, Endpoints, Modals, and Validation`

## Assignee
- **Primary Owner:** Member 3 (Backend Developer)
- **Supporting Contributors:** Member 2 (Frontend Developer)
- **Branch:** `feature/room-crud`
- **Linked PR:** PR #5 (`feature/room-crud` -> `main`)

---

## 1. Description & Objective
Build complete CRUD capabilities for hotel rooms and luxury suites. Administrators can create, review, edit, and delete rooms with full validation and duplicate checks; non-admin users have read-only access.

---

## 2. Detailed Scope
- [x] Implement backend room endpoints:
  - `GET /api/rooms` (Public filtering, searching, pagination)
  - `GET /api/rooms/:id` (Public detail)
  - `POST /api/rooms` (Admin only)
  - `PUT /api/rooms/:id` (Admin only)
  - `DELETE /api/rooms/:id` (Admin only)
- [x] Validate uniqueness of `roomNumber` and check positive rates and capacities.
- [x] Prevent room deletion if active upcoming bookings are associated with that room.
- [x] Build admin UI in `AdminRooms.jsx` featuring:
  - Room table with thumbnails, categories, rates, statuses, and quick action buttons.
  - "Add New Suite" modal with complete validation.
  - "Edit Suite" modal with prefilled data.
  - "Delete Suite" confirmation dialog.

---

## 3. Acceptance Criteria
- [x] Admin can add a new room with custom name, number, category, price, capacity, and imagery.
- [x] Attempting to create duplicate room numbers returns `400 Bad Request`.
- [x] Non-authenticated or non-admin requests to POST/PUT/DELETE return `401` or `403`.
- [x] Deleted rooms are removed from MongoDB and no longer appear in the catalog.
- [x] Edits immediately reflect in public and admin views.

---

## 4. Verification Command
```bash
# Verify room creation via admin token
curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Grand Villa","roomNumber":"GV-99","category":"Ocean Villa","description":"Test","pricePerNight":800,"capacity":4,"amenities":["Pool"],"images":["https://example.com/img.jpg"]}'
```
