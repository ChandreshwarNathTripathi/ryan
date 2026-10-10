# Issue #4: Smart Campus UI Design System, Layout, Navbar, Footer & Home Page

## Metadata
- **Issue ID:** #4
- **Branch Name:** `feature/public-ui`
- **Assigned Developer:** **Member 2 (Frontend UI/UX Developer)**
- **Lead Reviewer:** **Syed Rayyan (Team Leader)**
- **Target PR:** `PR #4: Smart Campus UI Design System & Public Pages -> main`
- **Prerequisite:** Issues #1, #2, and #3 merged
- **Estimated Effort:** 8 Hours | **Difficulty:** Intermediate

---

## 1. Objective & Goal
Build the modern, responsive user interface design system for **XSHostel**. Design a sleek dark navy aesthetic (`#0A0F1D`) with electric violet (`#8B5CF6`) and cyan accents, implement global layouts, create the sticky responsive `Navbar.jsx` and `Footer.jsx`, and assemble the high-impact `Home.jsx` landing page featuring a live dorm search widget, key campus amenities, statistics counters, and resident student testimonials.

---

## 2. Files to Create in `frontend/`
- `src/index.css` (Design system tokens, utilities, animations, dark mode)
- `src/components/Navbar.jsx` (Header with logo, navigation links, auth buttons, user dropdown)
- `src/components/Footer.jsx` (Hostel blocks, emergency contact numbers, chief warden helpline)
- `src/pages/Home.jsx` (Hero banner, quick search widget, amenities, testimonials)
- `src/pages/NotFound.jsx` (Branded campus 404 page)

---

## 3. UI Design Tokens & Theme Specification (`src/index.css`)
Configure the following CSS variables in `:root`:
```css
:root {
  --bg-primary: #0A0F1D;
  --bg-secondary: #0F172A;
  --card-bg: #121A2D;
  --card-border: rgba(255, 255, 255, 0.08);
  --text-primary: #F8FAFC;
  --text-muted: #94A3B8;
  --accent-violet: #8B5CF6;
  --accent-violet-hover: #7C3AED;
  --accent-cyan: #06B6D4;
  --accent-amber: #F59E0B;
  --accent-emerald: #10B981;
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

---

## 4. Component Implementation Guide

### A. Navigation Bar (`src/components/Navbar.jsx`)
- **Logo:** `Building2` SVG icon component + text **XSHostel** with a subtle violet gradient.
- **Navigation Links:**
  - `Home` (`/`)
  - `Hostel Dorms` (`/rooms`)
  - `Block A (Boys)` (`/rooms?block=Block+A+(Boys)`)
  - `Block B (Girls)` (`/rooms?block=Block+B+(Girls)`)
  - `Block C (Scholars)` (`/rooms?block=Block+C+(Scholars)`)
- **Authenticated State:**
  - Displays user name, role badge (`Student` or `Chief Warden`), and dropdown menu with:
    - `/my-bookings` (My Allocations)
    - `/profile` (Student Profile)
    - `/admin` (Chief Warden Dashboard — only visible if `user.role === 'admin'`)
    - `Logout` button
- **Unauthenticated State:**
  - `Sign In` (`/login`) button and `Register` (`/register`) button.
- **Mobile Support:** Hamburger toggle button opening a smooth sliding mobile navigation drawer.

### B. Landing Page (`src/pages/Home.jsx`)
The page consists of 5 main sections:
1. **Hero Section:**
   - Headline: *"Smart Campus Living & Modern Hostel Accommodation"*.
   - Subtitle: Highlighting high-speed Gigabit Wi-Fi, hygienic 4-meal mess, biometric security, and dedicated quiet study floors.
   - Quick CTA: *"Explore Dorms"* and *"Apply for Bed"*.
2. **Interactive Search & Filter Widget:**
   - Dropdown for **Block** (All, Block A Boys, Block B Girls, Block C Scholars).
   - Dropdown for **Sharing Type** (Single Scholar, Double Sharing, Triple Sharing, Quad Sharing).
   - Search input for room number or keyword.
   - *"Check Bed Vacancy"* button navigating to `/rooms` with query params.
3. **Campus Infrastructure Highlights Grid:**
   - 6 Feature cards with icons: Gigabit Mesh Wi-Fi (`Wifi`), 4-Meal Hygienic Dining (`UtensilsCrossed`), Biometric Turnstiles & 24/7 Guards (`ShieldCheck`), Air-Conditioned Study Lounges (`BookOpen`), On-Campus Laundromat (`Sparkles`), Sports & Recreation Court (`Activity`).
4. **Featured Dormitories Preview:**
   - Fetches `/api/rooms?limit=3` and displays cards with images, block, sharing type, price per semester, and vacant bed badges.
5. **Resident Student Testimonials & FAQ:**
   - Testimonials from undergraduate and research scholar residents.
   - Campus curfew guidelines and mess dining schedules.

### C. Footer Component (`src/components/Footer.jsx`)
- Columns:
  - Brand information and campus address (e.g., North Campus Academic Ridge).
  - Quick links to Blocks A, B, C and campus rules.
  - Emergency contacts: Chief Warden Desk (`+91 98765 43210`), Campus Security & Ambulance.

---

## 5. Acceptance Criteria & Definition of Done
- [ ] Navbar and Footer render seamlessly on all screen widths (Mobile, Tablet, Desktop).
- [ ] Clicking block links from Navbar filters the dorm catalog correctly.
- [ ] Interactive search widget passes selected query parameters to `/rooms`.
- [ ] Dark theme colors, gradients, and font families load properly.
- [ ] Member 2 opens PR #4 for Syed Rayyan's review.
