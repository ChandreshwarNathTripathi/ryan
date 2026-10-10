# XShotel — React + Vite Client

Client application for **XShotel — Luxury Stays, Unforgettable Experiences**.

## Tech Stack
- React.js 18 + Vite
- React Router DOM
- Axios
- Context API (Authentication)
- Lucide React
- Recharts
- Responsive Vanilla CSS

## Setup & Running
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

## Structure
- `src/components/`: Reusable navigation, footer, protected route.
- `src/context/`: AuthContext managing user session and JWT storage.
- `src/layouts/`: MainLayout (public) and AdminLayout (SaaS administration).
- `src/pages/`: Public pages (Home, Rooms, RoomDetails, Booking, Login, Register, MyBookings, Profile, NotFound).
- `src/pages/admin/`: Admin pages (AdminOverview, AdminRooms, AdminBookings, AdminUsers, AdminReviews, AdminSettings).
- `src/services/`: Axios API client.
- `src/styles/`: Luxury design tokens and styles in `index.css`.
