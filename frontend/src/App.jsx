import React, { useState } from "react";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

function App() {
  const [currentTab, setCurrentTab] = useState("bookings");

  return (
    <div className="app-layout">
      {/* Top Navigation Bar */}
      <nav className="navbar no-print">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-logo">🏛</span>
            <div>
              <span className="brand-title">XSHostel</span>
              <span className="brand-subtitle">Student Resident Portal</span>
            </div>
          </div>

          <div className="nav-tabs">
            <button
              type="button"
              className={`nav-tab-btn ${currentTab === "bookings" ? "active" : ""}`}
              onClick={() => setCurrentTab("bookings")}
            >
              My Allocations
            </button>

            <button
              type="button"
              className={`nav-tab-btn ${currentTab === "profile" ? "active" : ""}`}
              onClick={() => setCurrentTab("profile")}
            >
              Student Profile
            </button>
          </div>

          <div className="student-badge">
            <span className="student-avatar">CT</span>
            <div className="student-meta">
              <span className="student-name">Chandra Tripathi</span>
              <span className="student-roll">STU-2026-1042</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {currentTab === "bookings" && <MyBookings />}
        {currentTab === "profile" && <Profile />}
      </main>

      {/* Footer */}
      <footer className="footer no-print">
        <p>XSHostel — Campus Hostel Management System • Issue #7: Student Portal & Profile</p>
      </footer>
    </div>
  );
}

export default App;
