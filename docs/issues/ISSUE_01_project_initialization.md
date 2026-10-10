# Issue #1: Project Initialization & Monorepo Development Environment

## Metadata
- **Issue ID:** #1
- **Branch Name:** `feature/project-setup`
- **Assigned Developer:** **Syed Rayyan (Team Leader)**
- **Supporting Developers:** Member 2 (Frontend Specialist), Member 3 (Backend Specialist)
- **Target PR:** `PR #1: Monorepo Architecture & Environment Setup -> main`
- **Estimated Effort:** 4 Hours | **Difficulty:** Beginner/Intermediate

---

## 1. Objective & Goal
Establish the clean full-stack monorepo foundation for **XSHostel (Campus Hostel Management System)**. Set up the Node.js/Express backend, the React.js + Vite frontend, folder hierarchies, configuration files, environment variable templates, and a healthy service ping endpoint.

---

## 2. Directory Structure to Create
Your repository must strictly follow this folder hierarchy:

```
ryan/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & third-party configs
│   │   ├── controllers/     # Route logic controllers
│   │   ├── middleware/      # Auth & error handling middlewares
│   │   ├── models/          # Mongoose database models
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # Seeders & testing utilities
│   │   ├── app.js           # Express app setup & middleware
│   │   └── server.js        # Server listener entry point
│   ├── .env.example         # Template for environment variables
│   ├── .gitignore           # Ignores node_modules, .env
│   └── package.json         # Backend dependencies & scripts
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images, logos, branding
│   │   ├── components/      # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── context/         # AuthContext & global state
│   │   ├── pages/           # Student & Public page views
│   │   │   └── admin/       # Chief Warden Admin consoles
│   │   ├── App.jsx          # Router & layout provider
│   │   ├── index.css        # Global CSS design tokens
│   │   └── main.jsx         # React DOM entry point
│   ├── index.html           # HTML5 template with Google Fonts
│   ├── vite.config.js       # Vite bundler configuration
│   └── package.json         # Frontend dependencies & scripts
├── docs/
│   ├── issues/              # 10 Detailed GitHub Issues
│   └── team_distribution.md # 4-Member Collaboration Matrix
├── .gitignore
└── README.md
```

---

## 3. Step-by-Step Implementation Guide

### Step 1: Initialize Backend (`backend/`)
1. Create `backend/package.json` with the following configuration:
```json
{
  "name": "xshostel-backend",
  "version": "1.0.0",
  "description": "Backend REST API for XSHostel Management System",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "seed": "node src/utils/seeder.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```
2. Create `backend/.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/xshotel
JWT_SECRET=supersecretjwtkey_xshostel_2026_capstone
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```
3. Create `backend/src/app.js` configuring CORS, JSON body parser, and the health check endpoint:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'XSHostel REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = app;
```
4. Create `backend/src/server.js` to listen on `process.env.PORT || 5000`.

### Step 2: Initialize Frontend (`frontend/`)
1. Create `frontend/package.json`:
```json
{
  "name": "xshostel-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.8"
  }
}
```
2. In `frontend/index.html`, add Google Fonts: `Inter` and `Outfit`.
3. Set up `frontend/src/index.css` with CSS custom variables for dark navy theme (`--bg-primary: #0A0F1D`, `--card-bg: #121A2D`, `--accent-violet: #8B5CF6`).

---

## 4. Acceptance Criteria & Definition of Done
- [ ] Backend starts with `npm run dev` on `http://localhost:5000`.
- [ ] Frontend starts with `npm run dev` on `http://localhost:5173`.
- [ ] `curl http://localhost:5000/api/health` returns `status: "OK"` and `service: "XSHostel REST API"`.
- [ ] `.gitignore` prevents `.env` and `node_modules` from being committed.
- [ ] Team Leader reviews PR #1 and merges into `main`.
