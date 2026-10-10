# Issue #4: Premium Website UI and Public Pages

## Title
`[FRONTEND] Luxury Design System, Navigation, Hero Section, Catalog, and Room Details`

## Assignee
- **Primary Owner:** Member 2 (Frontend Developer)
- **Supporting Contributors:** Syed Rayyan (Team Leader)
- **Branch:** `feature/public-ui`
- **Linked PR:** PR #4 (`feature/public-ui` -> `main`)

---

## 1. Description & Objective
Design and implement a responsive, modern web interface reflecting the XSHostel brand aesthetic—dark navy backgrounds, electric violet accents, soft content surfaces, glassmorphic panels, and high-definition campus hostel imagery.

---

## 2. Detailed Scope
- [x] Create the global CSS design tokens in `frontend/src/styles/index.css` (variables, typography, cards, buttons, badges, tables, glass panels).
- [x] Build modern `Navbar.jsx` with mobile hamburger drawer and authenticated profile dropdown.
- [x] Build comprehensive `Footer.jsx` with hostel block links, warden emergency helpline, and academic project credits.
- [x] Build `Home.jsx` featuring campus hero banner, live bed availability search widget, hostel story highlights, featured dorms showcase, student amenities grid, resident testimonials, and call-to-action banner.
- [x] Build `Rooms.jsx` catalog with block & sharing filter chips, search input, bed capacity filter, fee sorting, room cards with bed vacancy badges, and pagination.
- [x] Build `RoomDetails.jsx` with multi-image gallery, block specifications, full amenities checklist, sticky live allocation calculator with mess plans, and resident student feedback list.
- [x] Build custom `NotFound.jsx` 404 page.

---

## 3. Acceptance Criteria
- [x] Navigation flows smoothly between Home, Rooms, Room Details, and Login.
- [x] Layout is fully responsive across desktop, tablet, and mobile viewports.
- [x] Catalog and home featured rooms populate dynamically from `/api/rooms` rather than hardcoded mock strings.
- [x] Search, category filters, and price sorting work in real time.
- [x] All buttons execute valid routing and actions.

---

## 4. Verification
Visit `http://localhost:5173/` and `http://localhost:5173/rooms` in any modern web browser.
