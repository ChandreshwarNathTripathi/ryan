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
Build a complete administrative console for hostel wardens. Provide real-time operational metrics, interactive Recharts visualizations (fee collections and block room inventory distribution), centralized student allocation ledger, student & staff directory, review moderation, and curfew configuration.

---

## 2. Detailed Scope
- [x] Implement backend aggregation endpoints:
  - `GET /api/admin/stats` (Total dorms, available dorms, allocations by status, total fees, active students).
  - `GET /api/admin/analytics` (6-month fee collections, category breakdown, recent student allocations).
- [x] Build `AdminLayout.jsx` with responsive warden sidebar and topbar.
- [x] Build `AdminOverview.jsx` with KPI metric cards, Recharts AreaChart, Recharts BarChart, and recent allocations table with quick status changer.
- [x] Build `AdminBookings.jsx` allocation ledger with search, filtering by status, voucher inspection modal, and status updater.
- [x] Build `AdminUsers.jsx` student directory with roll numbers, courses, guardian contacts, and account toggle.
- [x] Build `AdminReviews.jsx` moderation table with Approve, Reject, and Delete actions.
- [x] Build `AdminSettings.jsx` hostel curfew and caution deposit configuration form.

---

## 3. Acceptance Criteria
- [x] All statistics are computed directly from MongoDB aggregations.
- [x] Recharts components render cleanly without crashing or console warnings.
- [x] Changing an allocation status or student role in the dashboard persists to the database.
- [x] Regular students are strictly blocked from `/admin/*`.
- [x] Warden console is responsive on desktop, tablet, and mobile displays.

---

## 4. Verification Command
Visit `http://localhost:5173/admin` logged in as `admin@xshostel.com` (`Admin@123`).
