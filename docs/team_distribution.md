# XSHostel — Four-Member Team Collaboration & Responsibility Matrix

## Project Title: XSHostel (Complete Full-Stack Hostel Management System)
**Academic Term:** 2026 Academic Capstone  
**Repository:** [https://github.com/syedryaaan/ryan.git](https://github.com/syedryaaan/ryan.git)

---

## 1. Team Roster & Roles

| Member Name | Role | Primary Responsibilities |
| :--- | :--- | :--- |
| **Syed Rayyan** | **Team Leader & Full-Stack Security Lead** | Repository architecture, JWT/RBAC security, Chief Warden operations console, Recharts bed analytics, PR reviews, merge management, cloud deployment coordination, and final capstone submission. |
| **Member 2** | **Frontend UI/UX Developer** | Modern hostel responsive UI design system, Home page, Hostel Dorms catalog, Dorm details, bed vacancy indicators, and student portal styling. |
| **Member 3** | **Backend & Database Developer** | MongoDB Atlas integration, Mongoose schemas (Hostel Block, Bed Capacity, Student ID, Guardian Contacts), Dorm CRUD REST APIs, centralized error handling, and automated test suite. |
| **Member 4** | **Hostel Allocation & Integrations Developer** | Bed allotment engine, capacity and date conflict prevention (HTTP 409 Conflict), semester fee calculation, student mess plan subscription, and resident feedback system. |

---

## 2. Issue & Pull Request Allocation Matrix

Each team member is assigned primary ownership of distinct issues and contributes as supporting reviewer/developer on secondary issues.

| Issue # | Issue Title | Primary Owner | Supporting | Feature Branch | Linked Pull Request |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **#1** | Project Initialization & Mono-repo Setup | **Syed Rayyan** | Member 2, Member 3 | `feature/project-setup` | PR #1: Mono-repo setup & environments |
| **#2** | Database Setup & Hostel Backend Architecture | **Member 3** | Syed Rayyan | `feature/database-architecture` | PR #2: MongoDB Mongoose hostel schemas |
| **#3** | Authentication & Role-Based Authorization | **Syed Rayyan** | Member 2 | `feature/authentication` | PR #3: JWT authentication & Warden/Student RBAC |
| **#4** | Smart Campus UI & Public Pages | **Member 2** | Syed Rayyan | `feature/public-ui` | PR #4: High-tech hostel UI design system |
| **#5** | Hostel Dormitory Management & Bed CRUD | **Member 3** | Member 2 | `feature/room-crud` | PR #5: Block & bed CRUD endpoints |
| **#6** | Bed Allocation Engine & Conflict Prevention | **Member 4** | Member 3 | `feature/booking-system` | PR #6: Bed allotment & semester fee calculation |
| **#7** | Student Profiles, History & Reviews | **Member 4** | Member 2 | `feature/profiles-reviews` | PR #7: Student portal & resident reviews |
| **#8** | Warden Dashboard & Bed Occupancy Analytics | **Syed Rayyan** | Member 2, Member 4 | `feature/admin-dashboard` | PR #8: Recharts analytics & allocation ledger |
| **#9** | Automated Testing & Complete Documentation | **Member 3** | Syed Rayyan | `feature/testing-documentation` | PR #9: 18-point API verification suite & docs |
| **#10** | GitHub Collaboration & Cloud Deployment | **Syed Rayyan** | All Members | `feature/collaboration-deployment` | PR #10: Production deployment guide |

---

## 3. GitHub Workflow & Pull Request Process

```mermaid
gitGraph
   commit id: "Initial Commit"
   branch feature/project-setup
   checkout feature/project-setup
   commit id: "feat: mono-repo init (Issue #1)"
   checkout main
   merge feature/project-setup id: "PR #1 Merged"
   branch feature/database-architecture
   checkout feature/database-architecture
   commit id: "feat: hostel schemas (Issue #2)"
   checkout main
   merge feature/database-architecture id: "PR #2 Merged"
   branch feature/authentication
   checkout feature/authentication
   commit id: "feat: warden student rbac (Issue #3)"
   checkout main
   merge feature/authentication id: "PR #3 Merged"
   branch feature/public-ui
   checkout feature/public-ui
   commit id: "feat: campus hostel ui (Issue #4)"
   checkout main
   merge feature/public-ui id: "PR #4 Merged"
   branch feature/room-crud
   checkout feature/room-crud
   commit id: "feat: dorm bed crud apis (Issue #5)"
   checkout main
   merge feature/room-crud id: "PR #5 Merged"
   branch feature/booking-system
   checkout feature/booking-system
   commit id: "feat: bed allocation engine (Issue #6)"
   checkout main
   merge feature/booking-system id: "PR #6 Merged"
   branch feature/profiles-reviews
   checkout feature/profiles-reviews
   commit id: "feat: student portal (Issue #7)"
   checkout main
   merge feature/profiles-reviews id: "PR #7 Merged"
   branch feature/admin-dashboard
   checkout feature/admin-dashboard
   commit id: "feat: warden analytics (Issue #8)"
   checkout main
   merge feature/admin-dashboard id: "PR #8 Merged"
   branch feature/testing-documentation
   checkout feature/testing-documentation
   commit id: "test: 18 api tests (Issue #9)"
   checkout main
   merge feature/testing-documentation id: "PR #9 Merged"
   branch feature/collaboration-deployment
   checkout feature/collaboration-deployment
   commit id: "docs: deployment guide (Issue #10)"
   checkout main
   merge feature/collaboration-deployment id: "PR #10 Merged"
```

### Collaboration Rules:
1. **No direct pushes to `main`**: All features are engineered on dedicated `feature/<name>` branches.
2. **Issue Linking**: Commit messages and Pull Requests reference the target issue (e.g. `feat: implement bed capacity conflict prevention (Closes #6)`).
3. **Peer Review**: Before any PR is merged into `main`, Team Leader Syed Rayyan reviews functionality, security, and test verification.
4. **Clean Builds**: Production builds (`npm run build` and `node src/utils/testSuite.js`) must pass 100% prior to closing issues.
5. **Detailed Developer Manual**: Refer to [`docs/TEAM_DEVELOPMENT_GUIDE.md`](./TEAM_DEVELOPMENT_GUIDE.md) for the complete chronological execution order, code blueprints, and verification commands for Member 2, Member 3, and Member 4.
