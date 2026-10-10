# XSHostel — Complete Full-Stack Hostel Management System

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](./backend)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20bcryptjs-F7DF1E?logo=jsonwebtokens&logoColor=black)](./backend/src/middleware/auth.js)
[![Tests](https://img.shields.io/badge/Automated%20Tests-18%2F18%20Passing-10B981)](#-automated-testing--verification)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> **"Smart Hostel Living, Built for Academic Success."**  
> An enterprise-grade, full-stack Hostel Management System developed by **Syed Rayyan (Team Leader)** and an engineering team of four. Built with React.js (Vite), Node.js, Express.js, and MongoDB Atlas with end-to-end authentication, role-based access control (Warden / Student RBAC), dorm room CRUD operations, conflict-free bed allocation engine with mess subscription, and interactive Chief Warden analytics.

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

XSHostel delivers a dual-interface architecture:
1. **Public Student Resident Portal**: High-tech campus website showcasing hostel blocks (Block A Boys, Block B Girls, Block C Scholars), real-time bed vacancy search, transparent semester fee & mess plan calculation, verified resident feedback, step-by-step bed allocation application, and student room management.
2. **Protected Chief Warden Administration Console**: Operations analytics dashboard with Recharts visualizations (6-month fee collections and dorm block distribution), dorm catalog management (CRUD), bed allocation status ledger, student & staff directory with roll numbers and guardian contacts, review moderation, and hostel curfew policies.

```mermaid
graph TD
    Client[React.js + Vite Client Application] -->|HTTP / REST API| Server[Node.js + Express.js API Server]
    Server -->|JWT Verification & RBAC| AuthMiddleware[Authentication Middleware]
    Server -->|Mongoose ODM| DB[(MongoDB Atlas / Database)]
    Server -->|Seeder Utility| Seed[Hostel Database Seeder]
    
    subgraph Frontend [Client Layer - Port 5173]
        PublicPages[Home, Rooms, RoomDetails]
        StudentPages[Booking, MyBookings, Profile]
        WardenPages[Overview, Dorm CRUD, Allocations, Student Directory, Reviews, Curfew Settings]
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
- **Icons:** Lucide React icons (`Building2`, `Users`, `ShieldCheck`, `UtensilsCrossed`, `Zap`, `Wifi`, etc.)
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
xshostel/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Icons and static brand assets
│   │   ├── components/          # Reusable components (Navbar, Footer, ProtectedRoute)
│   │   ├── context/             # AuthContext (state & session management)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── layouts/             # MainLayout and AdminLayout (Warden sidebar)
│   │   ├── pages/               # Public and student pages
│   │   │   ├── admin/           # AdminOverview, AdminRooms, AdminBookings, AdminUsers, AdminReviews, AdminSettings
│   │   │   ├── Home.jsx         # Hero, search bar, featured dorms, campus amenities, testimonials
│   │   │   ├── Rooms.jsx        # Dorms catalog, block filter, sharing type, gender wing, bed vacancies
│   │   │   ├── RoomDetails.jsx  # Dorm photos, bed counts, amenities, mess calculator, resident reviews
│   │   │   ├── BookingPage.jsx  # Bed allocation application, academic year, mess plan, fee simulation
│   │   │   ├── Login.jsx        # Login card with 1-click Warden and Student autofill
│   │   │   ├── Register.jsx     # Student registration form with roll ID & degree course
│   │   │   ├── MyBookings.jsx   # My Hostel Allocations ledger & room vacating request
│   │   │   ├── Profile.jsx      # Student profile, roll ID, degree course, guardian contacts
│   │   │   └── NotFound.jsx     # Campus branded 404 page
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
│   ├── TEAM_DEVELOPMENT_GUIDE.md # Comprehensive 4-member step-by-step developer manual
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
| **4** | Smart Campus UI & Public Pages | **Member 2** | Global design system, Navbar, Footer, Home, Rooms catalog, RoomDetails, 404 page, responsive layout. | [ISSUE #4](./docs/issues/ISSUE_04_public_website_ui.md) |
| **5** | Hostel Dormitory Management & Bed CRUD | **Member 3** | Dorm CRUD REST APIs, duplicate room check, warden dorms UI, Add/Edit modals, bed capacity limits. | [ISSUE #5](./docs/issues/ISSUE_05_room_management_crud.md) |
| **6** | Bed Allocation Engine & Conflict Prevention | **Member 4** | Server-side pricing, overlap & bed capacity conflict detection (`409 Conflict`), mess plan subscription. | [ISSUE #6](./docs/issues/ISSUE_06_booking_system_availability.md) |
| **7** | Student Profiles, History & Reviews | **Member 4** | Student profile editing with roll ID & guardian contact, My Allocations history, room vacating request, reviews. | [ISSUE #7](./docs/issues/ISSUE_07_user_profiles_history_reviews.md) |
| **8** | Warden Dashboard & Bed Occupancy Analytics | **Syed Rayyan** | Recharts AreaChart & BarChart, KPI cards, recent allocations, allocation status updater, student directory. | [ISSUE #8](./docs/issues/ISSUE_08_admin_dashboard_analytics.md) |
| **9** | Testing, Security & Complete Documentation | **Member 3** | 18-point automated API test suite, security audit (hash exclusion, ownership checks), comprehensive documentation. | [ISSUE #9](./docs/issues/ISSUE_09_testing_security_documentation.md) |
| **10** | GitHub Collaboration & Deployment | **Syed Rayyan** | 4-member Git feature branch strategy, pull request workflow, Vercel & Render deployment guides. | [ISSUE #10](./docs/issues/ISSUE_10_collaboration_deployment.md) |

---

## 👥 Four-Member Team Collaboration & Roles

| Team Member | Official Role | Key Modules Owned | Merged Feature Branches |
| :--- | :--- | :--- | :--- |
| **Syed Rayyan** | **Team Leader & Full-Stack Security Lead** | Architecture, JWT/RBAC security, Chief Warden console, PR review & merge, release coordination. | `feature/project-setup`, `feature/authentication`, `feature/admin-dashboard`, `feature/collaboration-deployment` |
| **Member 2** | **Frontend UI/UX Developer** | Global design tokens, responsive components, Home page, Rooms catalog, RoomDetails page. | `feature/public-ui` (collaborated on `feature/admin-dashboard`) |
| **Member 3** | **Backend & Database Developer** | MongoDB Mongoose schemas, Dorm CRUD APIs, error middleware, automated test suite. | `feature/database-architecture`, `feature/room-crud`, `feature/testing-documentation` |
| **Member 4** | **Hostel Allocation Developer** | Bed allotment engine, capacity check, semester fees, student portal, resident review system. | `feature/booking-system`, `feature/profiles-reviews` |

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
| `POST` | `/api/auth/register` | Public | Register new student resident account (Role strictly defaults to `user`) |
| `POST` | `/api/auth/login` | Public | Validate email/password and issue signed JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated student profile with roll number & course |
| `PATCH` | `/api/auth/profile` | Private | Update student name, phone, course, guardian contacts, or change password |

### 3. Hostel Dorms & Rooms
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Public | List dorms with block, category, search, capacity, sort, and pagination |
| `GET` | `/api/rooms/:id` | Public | Fetch dorm details, occupied bed count, approved reviews, and average rating |
| `POST` | `/api/rooms` | Warden Only | Create new dorm room with block, floor, gender wing, and bed capacity |
| `PUT` | `/api/rooms/:id` | Warden Only | Modify existing dorm room details, fees, and imagery |
| `DELETE` | `/api/rooms/:id` | Warden Only | Delete room (Blocked if active student allocations exist) |

### 4. Bed Allocations & Admissions
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Apply for bed allocation with academic year, semester, mess plan, and conflict check |
| `GET` | `/api/bookings/my` | Private | List current student's allocation history |
| `GET` | `/api/bookings/:id` | Private | Inspect allocation voucher (Owner or Warden only) |
| `PATCH` | `/api/bookings/:id/cancel` | Private | Vacate room allocation and release bed space |
| `GET` | `/api/bookings` | Warden Only | List all campus bed allocations with search and filters |
| `PATCH` | `/api/bookings/:id/status` | Warden Only | Update allocation status (`confirmed`, `pending`, `cancelled`, `completed`) |

### 5. Resident Student Reviews
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews` | Public | Fetch verified approved resident reviews |
| `POST` | `/api/reviews` | Private | Submit 1–5 star rating and feedback for a dorm room |
| `PATCH` | `/api/reviews/:id` | Warden Only | Moderate review status (`approved`, `rejected`) |
| `DELETE` | `/api/reviews/:id` | Private / Warden | Remove review (Author or Warden) |

### 6. Warden Analytics & Student Directory
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Warden Only | Aggregated metrics (Fee collections, beds, allocation counts, students) |
| `GET` | `/api/admin/analytics` | Warden Only | 6-month fee collections and room category distribution for Recharts |
| `GET` | `/api/users` | Warden Only | List registered students with roll numbers and allocation counts |
| `GET` | `/api/users/:id` | Warden / Self | Inspect student details |
| `PATCH` | `/api/users/:id` | Warden Only | Toggle active resident status or assign warden role |

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
git clone https://github.com/syedryaaan/ryan.git xshostel
cd xshostel
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Configure your MONGO_URI in .env (or use mongodb://127.0.0.1:27017/xshotel)
# Run the database seeder to populate sample hostel dorms, wardens, and students
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
- **Chief Warden Admin:**  
  Email: `admin@xshostel.com`  
  Password: `Admin@123`
- **Resident Student:**  
  Email: `student@xshostel.com`  
  Password: `Student@123`

---

## 🧪 Automated Testing & Verification

XSHostel includes an automated API verification suite that validates authentication, RBAC, CRUD, pricing calculations, date conflicts, and security isolation.

```bash
cd backend
node src/utils/testSuite.js
```

### Test Suite Execution Output
```text
====================================================
  XSHOSTEL REST API AUTOMATED VERIFICATION SUITE   
====================================================

  [PASS] Health API responds 200 OK
  [PASS] Warden Admin login succeeds with JWT
  [PASS] Student login succeeds with JWT
  [PASS] Password hash is excluded from responses
  [PASS] GET /api/auth/me returns student profile with Student ID
  [PASS] Regular student cannot access warden stats (Role-Based Access Control)
  [PASS] Warden can access hostel bed analytics and occupancy
  [PASS] GET /api/rooms returns active hostel dorm catalog
  [PASS] GET /api/rooms/:id returns single hostel dorm
  [PASS] Warden can CREATE new hostel room
  [PASS] Duplicate hostel room numbers are rejected
  [PASS] Student can apply for room allocation with semester fee & mess
  [PASS] Overlapping room allocations are prevented (Status 409 Conflict)
  [PASS] Student can view their own hostel allocation history
  [PASS] Student can cancel/vacate room allocation
  [PASS] Student can submit hostel room review and rating
  [PASS] Warden can DELETE room when no active allocations exist
  [PASS] Warden can fetch 6-month visual analytics & block distribution

====================================================
  TEST RESULTS: 18 PASSED, 0 FAILED
====================================================
```

---

## 🌐 Cloud Deployment Guide

### 1. Database Deployment (MongoDB Atlas)
1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user (e.g. `xshostel_admin`) with password.
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** > **Drivers** to obtain your connection string:
   ```text
   mongodb+srv://xshostel_admin:<password>@cluster0.mongodb.net/xshotel?retryWrites=true&w=majority
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

© 2026 XSHostel Campus Living Systems. Built for collegiate demonstration and review.
