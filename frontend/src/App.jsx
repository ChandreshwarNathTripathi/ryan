import React, { useState, useEffect } from "react";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/AdminLayout";

function App() {
  // Current active view: "student" or "admin"
  const [currentView, setCurrentView] = useState("admin"); // Default to admin for review of Issue #8
  const [studentTab, setStudentTab] = useState("bookings");
  const [userRole, setUserRole] = useState("warden"); // "warden" or "student"
  const [toastMessage, setToastMessage] = useState("");

  // Handle URL changes or direct navigation
  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname.startsWith("/admin")) {
        attemptAccessAdmin();
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, [userRole]);

  // Route protection logic
  const attemptAccessAdmin = () => {
    if (userRole !== "warden") {
      // Rejection for normal student
      setToastMessage("⛔ Access Denied: Chief Warden authorization required to access /admin.");
      setCurrentView("student");
      window.history.replaceState(null, "", "/");
      setTimeout(() => setToastMessage(""), 5000);
      return false;
    }

    setCurrentView("admin");
    window.history.pushState(null, "", "/admin");
    return true;
  };

  const handleSwitchToStudent = () => {
    setCurrentView("student");
    window.history.pushState(null, "", "/");
  };

  const handleToggleRole = () => {
    if (userRole === "warden") {
      setUserRole("student");
      // If currently on admin console, student cannot remain there!
      if (currentView === "admin") {
        setCurrentView("student");
        window.history.replaceState(null, "", "/");
        setToastMessage("Switched to Student Role. Automatically exited /admin console.");
        setTimeout(() => setToastMessage(""), 5000);
      }
    } else {
      setUserRole("warden");
      setToastMessage("Switched to Chief Warden Role. Admin console unlocked.");
      setTimeout(() => setToastMessage(""), 4000);
    }
  };

  return (
    <div className="app-root-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="global-toast-notification">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage("")}>✕</button>
        </div>
      )}

      {/* Role Demonstration & Quick Switch Bar */}
      <div className="role-switcher-banner no-print">
        <div className="role-switcher-inner">
          <div className="role-status">
            <span>Current Role Simulation: </span>
            <strong className={`role-tag-pill ${userRole}`}>
              {userRole === "warden" ? "🛡️ Chief Warden (Admin)" : "🎓 Student Resident"}
            </strong>
          </div>
          <div className="role-actions">
            <button
              type="button"
              className="btn-role-toggle"
              onClick={handleToggleRole}
            >
              🔄 Switch to {userRole === "warden" ? "Student Mode" : "Chief Warden Mode"}
            </button>

            {currentView === "student" ? (
              <button
                type="button"
                className="btn-launch-admin"
                onClick={attemptAccessAdmin}
              >
                Go to Chief Warden Console (/admin) →
              </button>
            ) : (
              <button
                type="button"
                className="btn-launch-student"
                onClick={handleSwitchToStudent}
              >
                ← Return to Student Portal (/)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Admin Console vs Student Portal */}
      {currentView === "admin" && userRole === "warden" ? (
        <AdminLayout onExitToPublicSite={handleSwitchToStudent} />
      ) : (
        <div className="app-layout">
          {/* Top Navigation Bar for Student Portal */}
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
                  className={`nav-tab-btn ${studentTab === "bookings" ? "active" : ""}`}
                  onClick={() => setStudentTab("bookings")}
                >
                  My Allocations
                </button>

                <button
                  type="button"
                  className={`nav-tab-btn ${studentTab === "profile" ? "active" : ""}`}
                  onClick={() => setStudentTab("profile")}
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
            {studentTab === "bookings" && <MyBookings />}
            {studentTab === "profile" && <Profile />}
          </main>

          {/* Footer */}
          <footer className="footer no-print">
            <p>XSHostel — Campus Hostel Management System • Issue #8: Chief Warden Operations Console</p>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
