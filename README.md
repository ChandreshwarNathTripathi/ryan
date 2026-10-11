# XSHostel — Campus Hostel Management System

XSHostel is a simple and modern college hostel management system designed to manage student rooms, hostel facilities, and campus accommodations.

---

## Technologies

### Frontend
- **React**: Library for building user interfaces
- **Vite**: Super fast frontend build tool and local dev server
- **CSS**: Pure vanilla CSS styling with dark navy theme

### Backend
- **Node.js**: JavaScript runtime environment for executing code outside the browser
- **Express**: Fast, minimalist web framework for building REST APIs

### Future Database
- **MongoDB**: NoSQL database for storing user and hostel data
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js

---

## Project Structure

The project is organized as a beginner-friendly monorepo:

```text
ryan/
│
├── backend/                  # Backend REST API (Node.js + Express)
│   ├── src/
│   │   ├── config/           # Database and application configuration
│   │   ├── controllers/      # Functions that handle API requests
│   │   ├── middleware/       # Middleware functions (auth, validation)
│   │   ├── models/           # Database models (Mongoose schemas)
│   │   ├── routes/           # API route definitions
│   │   ├── utils/            # Helper functions and utilities
│   │   ├── app.js            # Express app configuration and middleware
│   │   └── server.js         # Starts the HTTP server on port 5000
│   │
│   ├── .env.example          # Template for environment variables
│   ├── .gitignore            # Ignores node_modules and .env
│   └── package.json          # Backend dependencies and scripts
│
├── frontend/                 # Frontend User Interface (React + Vite)
│   ├── public/               # Public static files
│   ├── src/
│   │   ├── assets/           # Images, logos, and icons
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React Context for global state
│   │   ├── pages/            # Student and public pages
│   │   │   └── admin/        # Admin and warden pages
│   │   ├── App.jsx           # Main React component
│   │   ├── index.css         # Global CSS styles (dark navy theme)
│   │   └── main.jsx          # React DOM entry point
│   │
│   ├── index.html            # HTML5 template with Google Fonts (Inter, Outfit)
│   ├── vite.config.js        # Vite configuration file
│   └── package.json          # Frontend dependencies and scripts
│
├── docs/                     # Project documentation and issue trackers
│   ├── issues/               # Development issues
│   └── team_distribution.md  # Team task distribution
│
├── .gitignore                # Root gitignore file
└── README.md                 # Project documentation
```

---

## How to Run Backend

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

- The backend will start on: **http://localhost:5000**
- Test the Health Check API in your browser or terminal:
  **http://localhost:5000/api/health**

---

## How to Run Frontend

1. Open a **new terminal window** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

- The frontend will start on: **http://localhost:5173**
- Open your browser at **http://localhost:5173** to see the welcome page.

---

## Health API Verification

When you visit `http://localhost:5000/api/health`, you should see:

```json
{
  "status": "OK",
  "service": "XSHostel REST API",
  "version": "1.0.0"
}
```
