# Issue #1: Project Initialization and Development Environment

## Title
`[INIT] Project Initialization and Development Environment Setup`

## Assignee
- **Primary Owner:** Syed Rayyan (Team Leader)
- **Supporting Contributors:** Member 2 (Frontend), Member 3 (Backend)
- **Branch:** `feature/project-setup`
- **Linked PR:** PR #1 (`feature/project-setup` -> `main`)

---

## 1. Description & Objective
Establish the foundational mono-repository architecture for **XSHostel**, initializing both the React + Vite frontend and the Node.js + Express backend with modular folder structures, dependencies, scripts, environment variables templates, and strict `.gitignore` configurations.

---

## 2. Detailed Scope
- [x] Create project repository structure (`frontend/`, `backend/`, `docs/`).
- [x] Initialize React.js + Vite with required dependencies (`react-router-dom`, `axios`, `lucide-react`, `recharts`).
- [x] Initialize Node.js + Express.js backend with required dependencies (`express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`, `nodemon`).
- [x] Configure npm scripts for development (`npm run dev`), production start (`npm start`), and database seeding (`npm run seed`).
- [x] Configure `.env.example` templates for both applications.
- [x] Ensure sensitive credentials (`.env`, `node_modules/`, logs) are excluded from git tracking.
- [x] Implement the centralized health check endpoint `GET /api/health`.

---

## 3. Acceptance Criteria
- [x] Frontend successfully boots via `npm run dev` at `http://localhost:5173`.
- [x] Backend successfully boots via `npm run dev` or `npm start` at `http://localhost:5000`.
- [x] Both `package.json` manifests are valid and dependencies install cleanly with zero errors.
- [x] The health check endpoint `http://localhost:5000/api/health` returns status `200 OK` with database connection state.
- [x] No sensitive API keys or database passwords exist in the committed git tree.

---

## 4. Verification Command
```bash
cd backend && npm start &
cd frontend && npm run dev &
curl http://localhost:5000/api/health
```
