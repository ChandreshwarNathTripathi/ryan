# XShotel — Complete Full-Stack Hotel Management System

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](./backend)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20bcryptjs-F7DF1E?logo=jsonwebtokens&logoColor=black)](./backend/src/middleware/auth.js)
[![Tests](https://img.shields.io/badge/Automated%20Tests-18%2F18%20Passing-10B981)](#-automated-testing--verification)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> **"Luxury Stays, Unforgettable Experiences."**  
> An enterprise-grade, full-stack Hotel Management System developed by **Syed Rayyan (Team Leader)** and an engineering team of four. Built with React.js (Vite), Node.js, Express.js, and MongoDB Atlas with end-to-end authentication, role-based access control (RBAC), room CRUD operations, intelligent conflict-free booking engine, and interactive SaaS analytics.

---

## 📑 Table of Contents
1. [Project Overview & Architecture](#-project-overview--architecture)
2. [Technology Stack](#-technology-stack)
3. [Folder Structure](#-folder-structure)
4. [Exactly 10 GitHub Issues Tracker](#-exactly-10-github-issues-tracker)
5. [Four-Member Team Collaboration & Roles](#-four-member-team-collaboration--roles)
6. [Complete REST API Reference](#-complete-rest-api-reference)
7. [Environment Configuration](#-environment-configuration)
8. [Installation & Local Execution](#-installation--local-execution)
9. [Automated Testing & Verification](#-automated-testing--verification)
10. [Cloud Deployment Guide (Vercel + Render + MongoDB Atlas)](#-cloud-deployment-guide)

---

## 🏛 Project Overview & Architecture

XShotel delivers a dual-interface architecture:
1. **Public Luxury Guest Portal**: High-touch hotel website showcasing signature suites, oceanfront villas, real-time availability search, transparent pricing calculation, verified guest reviews, step-by-step reservation workflow, and user account management.
2. **Protected SaaS Administration Console**: Executive analytics dashboard with Recharts visualizations (6-month revenue trends and room inventory breakdown), room catalog management (CRUD), reservation status ledger, user directory with role assignment, review moderation, and resort configuration.

```mermaid
graph TD
    Client[React.js + Vite Client Application] -->|HTTP / REST API| Server[Node.js + Express.js API Server]
    Server -->|JWT Verification & RBAC| AuthMiddleware[Authentication Middleware]
    Server -->|Mongoose ODM| DB[(MongoDB Atlas / Database)]
    Server -->|Seeder Utility| Seed[Sample Database Seeder]
    
    subgraph Frontend [Client Layer - Port 5173]
        PublicPages[Home, Rooms, RoomDetails]
        GuestPages[Booking, MyBookings, Profile]
        AdminPages[Overview, Room CRUD, Bookings, Users, Reviews, Settings]
    end
    
    subgraph Backend [Server Layer - Port 5000]
        AuthRoutes[/api/auth/*]
        RoomRoutes[/api/rooms/*]
        BookingRoutes[/api/bookings/*]
        UserRoutes[/api/users/*]
        ReviewRoutes[/api/reviews/*]
        AdminRoutes[/api/admin/*]
    end
```

---

## 💻 Technology Stack

### Frontend
- **Framework:** React.js 18 with Vite build tooling
- **Routing:** React Router DOM v6
- **State Management:** React Context API (`AuthContext`)
- **HTTP Client:** Axios with centralized Bearer token interceptor
- **Icons:** Lucide React icons
- **Analytics & Visualizations:** Recharts (`AreaChart`, `BarChart`, `ResponsiveContainer`)
- **Styling:** Custom Vanilla CSS with CSS Custom Properties (Dark Navy, Midnight Blue, Electric Violet accents, Glassmorphism)

### Backend
- **Runtime & Server:** Node.js v24 + Express.js v4
- **Database:** MongoDB Atlas with Mongoose ODM v8
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` password hashing (10 salt rounds)
- **CORS & Environment:** `cors` + `dotenv`
- **Architecture:** Controller-Service-Model design with centralized error middleware and request validation

---

## 📁 Folder Structure

```text
xshotel/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Icons and static brand assets
│   │   ├── components/          # Reusable components (Navbar, Footer, ProtectedRoute)
│   │   ├── context/             # AuthContext (state & session management)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── layouts/             # MainLayout and AdminLayout (SaaS sidebar)
│   │   ├── pages/               # Public and guest pages
│   │   │   ├── admin/           # AdminOverview, AdminRooms, AdminBookings, AdminUsers, AdminReviews, AdminSettings
│   │   │   ├── Home.jsx         # Hero, search bar, featured suites, amenities, testimonials
│   │   │   ├── Rooms.jsx        # Catalog, search, category filter, sorting, pagination
│   │   │   ├── RoomDetails.jsx  # Multi-photo gallery, specs, amenities, live booking calculator, reviews
│   │   │   ├── BookingPage.jsx  # Multi-step booking engine, date validation, demo payment simulator
│   │   │   ├── Login.jsx        # Login card with 1-click demo autofill
│   │   │   ├── Register.jsx     # Registration form with password verification
│   │   │   ├── MyBookings.jsx   # Guest reservations ledger & eligible cancellation
│   │   │   ├── Profile.jsx      # Account profile and password changer
│   │   │   └── NotFound.jsx     # Luxury branded 404 page
│   │   ├── services/            # Axios API client (auth, room, booking, review, user, admin)
│   │   ├── styles/              # index.css design system tokens
│   │   ├── App.jsx              # Application router hierarchy
│   │   └── main.jsx             # React entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/              # db.js MongoDB Atlas connection
│   │   ├── controllers/         # authController, roomController, bookingController, userController, reviewController, adminController
│   │   ├── middleware/          # auth.js (protect, admin), errorMiddleware.js, validate.js
│   │   ├── models/              # User.js, Room.js, Booking.js, Review.js
│   │   ├── routes/              # authRoutes, roomRoutes, bookingRoutes, userRoutes, reviewRoutes, adminRoutes
│   │   ├── utils/               # seeder.js (seed script), testSuite.js (automated API tests)
│   │   ├── app.js               # Express application configuration & CORS
│   │   └── server.js            # Server entry point
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── docs/
│   ├── issues/                  # Exactly 10 comprehensive GitHub Issue specifications
│   │   ├── ISSUE_01_project_initialization.md
│   │   ├── ISSUE_02_database_backend_architecture.md
│   │   ├── ISSUE_03_authentication_rbac.md
│   │   ├── ISSUE_04_public_website_ui.md
│   │   ├── ISSUE_05_room_management_crud.md
│   │   ├── ISSUE_06_booking_system_availability.md
│   │   ├── ISSUE_07_user_profiles_history_reviews.md
│   │   ├── ISSUE_08_admin_dashboard_analytics.md
│   │   ├── ISSUE_09_testing_security_documentation.md
│   │   └── ISSUE_10_collaboration_deployment.md
│   └── team_distribution.md     # 4-member roles and pull request matrix
├── README.md
└── .gitignore
```

---

## 📌 Exactly 10 GitHub Issues Tracker

The development lifecycle is divided into exactly **10 comprehensive GitHub Issues**, ensuring complete traceability:

| # | Issue Title | Primary Owner | Scope & Acceptance Summary | Documentation Link |
| :-: | :--- | :--- | :--- | :-: |
| **1** | Project Initialization & Development Environment | **Syed Rayyan** | Mono-repo setup, Vite + React, Express + Node, `.gitignore`, `.env.example`, health-check API. | [ISSUE #1](./docs/issues/ISSUE_01_project_initialization.md) |
| **2** | Database Setup & Backend Architecture | **Member 3** | MongoDB Atlas Mongoose connection, User, Room, Booking, Review models, centralized error handling, seeder. | [ISSUE #2](./docs/issues/ISSUE_02_database_backend_architecture.md) |
| **3** | Authentication & Role-Based Authorization | **Syed Rayyan** | Bcryptjs password hashing, JWT generation, `protect` & `admin` middleware, Login/Register pages, `AuthContext`. | [ISSUE #3](./docs/issues/ISSUE_03_authentication_rbac.md) |
| **4** | Premium Website UI & Public Pages | **Member 2** | Global design system, Navbar, Footer, Home, Rooms catalog, RoomDetails, 404 page, responsive layout. | [ISSUE #4](./docs/issues/ISSUE_04_public_website_ui.md) |
| **5** | Complete Room Management CRUD | **Member 3** | Room CRUD REST APIs, duplicate room check, admin rooms UI, Add/Edit modals, delete confirmation. | [ISSUE #5](./docs/issues/ISSUE_05_room_management_crud.md) |
| **6** | Booking System & Availability Engine | **Member 4** | Server-side pricing, overlap conflict detection (`409 Conflict`), guest capacity limits, demo payment simulator. | [ISSUE #6](./docs/issues/ISSUE_06_booking_system_availability.md) |
| **7** | User Profiles, History & Reviews | **Member 4** | Guest profile editing, My Bookings history, eligible booking cancellation, room ratings & reviews. | [ISSUE #7](./docs/issues/ISSUE_07_user_profiles_history_reviews.md) |
| **8** | Admin Dashboard & Analytics | **Syed Rayyan** | Recharts AreaChart & BarChart, KPI cards, recent reservations, reservation status updater, user management. | [ISSUE #8](./docs/issues/ISSUE_08_admin_dashboard_analytics.md) |
| **9** | Testing, Security & Complete Documentation | **Member 3** | 18-point automated API test suite, security audit (hash exclusion, ownership checks), comprehensive documentation. | [ISSUE #9](./docs/issues/ISSUE_09_testing_security_documentation.md) |
| **10** | GitHub Collaboration & Deployment | **Syed Rayyan** | 4-member Git feature branch strategy, pull request workflow, Vercel & Render deployment guides. | [ISSUE #10](./docs/issues/ISSUE_10_collaboration_deployment.md) |

---

## 👥 Four-Member Team Collaboration & Roles

| Team Member | Official Role | Key Modules Owned | Merged Feature Branches |
| :--- | :--- | :--- | :--- |
| **Syed Rayyan** | **Team Leader & Full-Stack Security Lead** | Architecture, JWT/RBAC security, Admin console, PR review & merge, release coordination. | `feature/project-setup`, `feature/authentication`, `feature/admin-dashboard`, `feature/collaboration-deployment` |
| **Member 2** | **Frontend Developer** | Global design tokens, responsive components, Home page, Rooms catalog, RoomDetails page. | `feature/public-ui` (collaborated on `feature/admin-dashboard`) |
| **Member 3** | **Backend Developer** | MongoDB Mongoose schemas, Room CRUD APIs, error middleware, automated test suite. | `feature/database-architecture`, `feature/room-crud`, `feature/testing-documentation` |
| **Member 4** | **Booking & Integration Developer** | Hotel booking engine, date overlap check, server pricing, guest portal, review system. | `feature/booking-system`, `feature/profiles-reviews` |

*For complete Pull Request descriptions, branch merges, and review policies, see [docs/team_distribution.md](./docs/team_distribution.md).*

---

## 📡 Complete REST API Reference

All endpoints return uniform JSON responses: `{ success: true|false, data: ..., message: ... }`.

### 1. System Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Returns service status, uptime timestamp, and MongoDB connection status |

### 2. Authentication & Profile
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new guest account (Role strictly defaults to `user`) |
| `POST` | `/api/auth/login` | Public | Validate email/password and issue signed JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated profile |
| `PATCH` | `/api/auth/profile` | Private | Update name, phone, or change password with verification |

### 3. Rooms & Suites
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Public | List suites with category, search, capacity, sort, and pagination |
| `GET` | `/api/rooms/:id` | Public | Fetch room details, approved reviews, and average rating |
| `POST` | `/api/rooms` | Admin Only | Create new suite with unique room number |
| `PUT` | `/api/rooms/:id` | Admin Only | Modify existing suite details, rates, and imagery |
| `DELETE` | `/api/rooms/:id` | Admin Only | Delete suite (Blocked if upcoming active reservations exist) |

### 4. Bookings & Reservations
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Create booking with server-side pricing and overlap conflict check |
| `GET` | `/api/bookings/my` | Private | List current guest's booking history |
| `GET` | `/api/bookings/:id` | Private | Inspect reservation voucher (Owner or Admin only) |
| `PATCH` | `/api/bookings/:id/cancel` | Private | Cancel eligible upcoming stay and simulate refund |
| `GET` | `/api/bookings` | Admin Only | List all resort reservations with search and filters |
| `PATCH` | `/api/bookings/:id/status` | Admin Only | Update booking status (`confirmed`, `pending`, `cancelled`, `completed`) |

### 5. Guest Reviews
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews` | Public | Fetch verified approved guest reviews |
| `POST` | `/api/reviews` | Private | Submit 1–5 star rating and comment for a room |
| `PATCH` | `/api/reviews/:id` | Admin Only | Moderate review status (`approved`, `rejected`) |
| `DELETE` | `/api/reviews/:id` | Private / Admin | Remove review (Author or Admin) |

### 6. Admin Analytics & User Directory
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin Only | Aggregated metrics (Revenue, rooms, booking counts, users) |
| `GET` | `/api/admin/analytics` | Admin Only | 6-month monthly revenue and room category distribution for Recharts |
| `GET` | `/api/users` | Admin Only | List registered users with booking counts |
| `GET` | `/api/users/:id` | Admin / Self | Inspect user details |
| `PATCH` | `/api/users/:id` | Admin Only | Toggle active status or promote/demote role |

---

## ⚙ Environment Configuration

### Frontend (`frontend/.env.example`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/xshotel?retryWrites=true&w=majority
JWT_SECRET=xshotel_super_secure_jwt_secret_key_2026_xyz
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Installation & Local Execution

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (Local instance or free MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/syedryaaan/ryan.git xshotel
cd xshotel
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Configure your MONGO_URI in .env (or use mongodb://127.0.0.1:27017/xshotel)
# Run the database seeder to populate sample luxury suites and users
npm run seed

# Start development server
npm run dev
```
Backend runs at: `http://localhost:5000`

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 4. Demo Login Credentials (One-Click in UI)
- **Lead Administrator:**  
  Email: `admin@xshotel.com`  
  Password: `Admin@123`
- **Verified Guest:**  
  Email: `guest@xshotel.com`  
  Password: `Guest@123`

---

## 🧪 Automated Testing & Verification

XShotel includes an automated API verification suite that validates authentication, RBAC, CRUD, pricing calculations, date conflicts, and security isolation.

```bash
cd backend
node src/utils/testSuite.js
```

### Test Suite Execution Output
```text
====================================================
   XSHOTEL REST API AUTOMATED VERIFICATION SUITE   
====================================================

  [PASS] Health API responds 200 OK
  [PASS] Admin login succeeds with JWT
  [PASS] Guest login succeeds with JWT
  [PASS] Password hash is excluded from responses
  [PASS] GET /api/auth/me returns guest profile
  [PASS] Regular guest cannot access admin stats (Role-Based Access Control)
  [PASS] Admin can access stats and room counts
  [PASS] GET /api/rooms returns active suite catalog
  [PASS] GET /api/rooms/:id returns single suite
  [PASS] Admin can CREATE new room
  [PASS] Duplicate room numbers are rejected
  [PASS] Guest can create reservation with server-side pricing
  [PASS] Overlapping reservation dates are prevented (Status 409 Conflict)
  [PASS] Guest can view their own booking history
  [PASS] Guest can cancel future booking (Refund processed)
  [PASS] Guest can submit room review and star rating
  [PASS] Admin can DELETE room when no active future bookings exist
  [PASS] Admin can fetch 6-month visual analytics

====================================================
  TEST RESULTS: 18 PASSED, 0 FAILED
====================================================
```

---

## 🌐 Cloud Deployment Guide

### 1. Database Deployment (MongoDB Atlas)
1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user (e.g. `xshotel_admin`) with password.
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** > **Drivers** to obtain your connection string:
   ```text
   mongodb+srv://xshotel_admin:<password>@cluster0.mongodb.net/xshotel?retryWrites=true&w=majority
   ```

### 2. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New Web Service**.
3. Connect your repository `syedryaaan/ryan`.
4. Configure service settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render default)
   - `MONGO_URI` = `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET` = `<Generate a secure 64-character secret>`
   - `FRONTEND_URL` = `<Your Vercel deployment URL>`
6. Deploy the service and verify `https://<your-render-app>.onrender.com/api/health`.

### 3. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select repository `syedryaaan/ryan`.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://<your-render-app>.onrender.com/api`
5. Click **Deploy**. Vercel will build and launch your production frontend.

---

## 📄 Academic Capstone Declaration

This project was built from scratch to fulfill all college assignment requirements:
- **Full-stack functionality:** Functional client-side rendering with real backend persistence (no static mockup).
- **Security standards:** Secure JWT authentication, salt-hashed passwords, role authorization, and ownership checks.
- **Team leadership:** Organized and directed by **Syed Rayyan (Team Leader)** with balanced four-member issue allocation.

© 2026 XShotel Hospitality Systems. Built for collegiate demonstration and review.
