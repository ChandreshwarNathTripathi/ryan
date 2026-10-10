# Issue #8: Admin Dashboard and Analytics

## Title
`[ADMIN-SUITE] SaaS Dashboard, KPIs, Recharts Visualizations, Ledger, User Directory & Moderation`

## Assignee
- **Primary Owner:** Syed Rayyan (Team Leader)
- **Supporting Contributors:** Member 2 (Frontend Developer), Member 4 (Integration Developer)
- **Branch:** `feature/admin-dashboard`
- **Linked PR:** PR #8 (`feature/admin-dashboard` -> `main`)

---

## 1. Description & Objective
Build a complete administrative console for hotel staff. Provide real-time operational metrics, interactive Recharts visualizations (revenue trends and room inventory distribution), centralized reservation ledger, guest user directory, review moderation, and property configuration.

---

## 2. Detailed Scope
- [x] Implement backend aggregation endpoints:
  - `GET /api/admin/stats` (Total rooms, available rooms, bookings by status, total revenue, active users).
  - `GET /api/admin/analytics` (6-month revenue trends, category breakdown, recent activity).
- [x] Build `AdminLayout.jsx` with responsive SaaS sidebar and admin topbar.
- [x] Build `AdminOverview.jsx` with KPI metric cards, Recharts AreaChart, Recharts BarChart, and recent bookings table with quick status changer.
- [x] Build `AdminBookings.jsx` ledger with search, filtering by status, voucher inspection modal, and status updater.
- [x] Build `AdminUsers.jsx` user directory with role selector and account active/deactivate toggle.
- [x] Build `AdminReviews.jsx` moderation table with Approve, Reject, and Delete actions.
- [x] Build `AdminSettings.jsx` property configuration form.

---

## 3. Acceptance Criteria
- [x] All statistics are computed directly from MongoDB aggregations.
- [x] Recharts components render cleanly without crashing or console warnings.
- [x] Changing a booking status or user role in the dashboard persists to the database.
- [x] Non-admin users are strictly blocked from `/admin/*`.
- [x] Admin console is responsive on desktop, tablet, and mobile displays.

---

## 4. Verification Command
Visit `http://localhost:5173/admin` logged in as `admin@xshotel.com` (`Admin@123`).
