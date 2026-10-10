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
Design and implement a responsive, modern luxury web interface reflecting the XShotel brand aesthetic—dark navy backgrounds, electric violet accents, soft content surfaces, glassmorphic panels, and high-definition hotel imagery.

---

## 2. Detailed Scope
- [x] Create the global CSS design tokens in `frontend/src/styles/index.css` (variables, typography, cards, buttons, badges, tables, glass panels).
- [x] Build luxury `Navbar.jsx` with mobile hamburger drawer and authenticated profile dropdown.
- [x] Build comprehensive `Footer.jsx` with suite links, private concierge info, and academic project credits.
- [x] Build `Home.jsx` featuring luxury hero banner, live availability search widget, resort story highlights, signature suites showcase, world-class amenities grid, guest testimonials, and call-to-action banner.
- [x] Build `Rooms.jsx` catalog with category filter chips, search input, guest capacity filter, price sorting, room cards, and pagination.
- [x] Build `RoomDetails.jsx` with multi-image gallery, room specifications, full amenities checklist, sticky live reservation calculator, and verified guest feedback list.
- [x] Build custom luxury `NotFound.jsx` 404 page.

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
