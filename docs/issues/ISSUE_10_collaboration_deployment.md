# Issue #10: GitHub Collaboration, Cloud Deployment & Capstone Delivery

## Metadata
- **Issue ID:** #10
- **Branch Name:** `feature/collaboration-deployment`
- **Assigned Developer:** **Syed Rayyan (Team Leader)**
- **Supporting Developers:** Member 2, Member 3, Member 4 (All Team Members)
- **Target PR:** `PR #10: Cloud Deployment Architecture & Final Capstone Delivery -> main`
- **Prerequisite:** Issues #1 through #9 merged into `main`
- **Estimated Effort:** 6 Hours | **Difficulty:** Intermediate

---

## 1. Objective & Goal
Coordinate the final phase of the project:
1. Ensure all 10 feature branches are cleanly committed, peer-reviewed, and synchronized with GitHub repository `https://github.com/syedryaaan/ryan.git`.
2. Provide cloud deployment guidelines (Vercel for React Frontend, Render/Railway for Express Backend, MongoDB Atlas for Cloud Database).
3. Finalize complete documentation (`README.md`, `docs/team_distribution.md`, `docs/TEAM_DEVELOPMENT_GUIDE.md`).
4. Prepare the 4-member team for technical viva and live demonstration.

---

## 2. Cloud Deployment Architecture

```
                                  ┌─────────────────────────────┐
                                  │       Student Browser       │
                                  └──────────────┬──────────────┘
                                                 │
                                                 │ HTTPS
                                                 ▼
┌─────────────────────────────┐          ┌─────────────────────────────┐
│       Cloud MongoDB         │          │       Vercel Hosting        │
│       (MongoDB Atlas)       │◄─────────│       (React.js + Vite)     │
└──────────────┬──────────────┘          └──────────────┬──────────────┘
               │                                        │
               │ Mongoose TLS                           │ REST API (JSON)
               ▼                                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Render / Railway Cloud Backend                    │
│                      (Node.js + Express REST API)                    │
└──────────────────────────────────────────────────────────────────────┘
```

### Production Environment Variables:

#### Backend (Render / Railway):
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/xshostel?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_xshostel_production_2026
JWT_EXPIRE=30d
CLIENT_URL=https://xshostel.vercel.app
```

#### Frontend (Vercel):
```env
VITE_API_URL=https://xshostel-api.onrender.com/api
```

---

## 3. Deployment Steps

### Step 1: Deploy MongoDB Atlas
1. Create a free M0 cluster on MongoDB Atlas.
2. Under Network Access, allow IP access `0.0.0.0/0`.
3. Under Database Access, create a database user with read/write privileges.
4. Copy the connection string into the backend environment variables.
5. Run `npm run seed` once to seed production accounts and dorm rooms.

### Step 2: Deploy Backend to Render / Railway
1. Connect GitHub repository `https://github.com/syedryaaan/ryan.git`.
2. Set Root Directory: `backend`.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Add backend environment variables listed above.

### Step 3: Deploy Frontend to Vercel
1. Connect GitHub repository.
2. Set Root Directory: `frontend`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add `VITE_API_URL` pointing to the deployed backend URL.

---

## 4. Team Capstone Presentation & Viva Roles

| Team Member | Presentation Segment | Live Demonstration Checklist |
| :--- | :--- | :--- |
| **Syed Rayyan** (Leader) | System Architecture & Security | • Project motivation & design principles<br>• JWT authentication & RBAC security<br>• Chief Warden analytics console demonstration<br>• GitHub branching & PR review workflow |
| **Member 2** | UI/UX & Public Experience | • Responsive dark theme & CSS design system<br>• Live dorm search & filter widget<br>• Dormitory specifications & image galleries<br>• Responsive mobile navigation |
| **Member 3** | Backend & Database Engineering | • MongoDB Atlas Mongoose schemas & indexes<br>• Dorm CRUD REST API endpoints<br>• Error handling & data validation<br>• 18 automated API test execution |
| **Member 4** | Allocation Engine & Portals | • Bed allocation application flow<br>• 409 Conflict date & overcapacity prevention<br>• Mess meal plan & bursar fee calculation<br>• Student portal & room vacating workflow |

---

## 5. Acceptance Criteria & Definition of Done
- [ ] All 10 feature branches exist on remote: `git branch -r`.
- [ ] Automated test suite returns 18 PASSED on both local and production environments.
- [ ] Production build succeeds without errors: `npm run build`.
- [ ] Team Leader Syed Rayyan verifies all documentation and closes Issue #10.
