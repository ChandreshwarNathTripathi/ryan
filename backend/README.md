# XShotel — Node.js + Express REST API

Backend API for **XShotel — Luxury Stays, Unforgettable Experiences**.

## Tech Stack
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- dotenv & cors

## Setup & Running
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Seed sample luxury suites & users
npm run seed

# 4. Start development server
npm run dev

# 5. Run automated verification suite
node src/utils/testSuite.js
```

## REST API Overview
- `GET /api/health` — System status
- `POST /api/auth/register` — Guest registration
- `POST /api/auth/login` — Authentication & JWT issue
- `GET /api/auth/me` — Authenticated profile
- `GET /api/rooms` — Filtered suite catalog
- `GET /api/rooms/:id` — Suite details & reviews
- `POST /api/rooms` — Admin create suite
- `PUT /api/rooms/:id` — Admin update suite
- `DELETE /api/rooms/:id` — Admin delete suite
- `POST /api/bookings` — Create reservation (server-side pricing & overlap prevention)
- `GET /api/bookings/my` — Guest booking history
- `PATCH /api/bookings/:id/cancel` — Eligible booking cancellation
- `GET /api/bookings` — Admin all bookings
- `PATCH /api/bookings/:id/status` — Admin update status
- `GET /api/reviews` — Approved guest reviews
- `POST /api/reviews` — Post review
- `GET /api/admin/stats` — Admin dashboard KPI stats
- `GET /api/admin/analytics` — Recharts revenue & room distribution data
- `GET /api/users` — Admin user directory
