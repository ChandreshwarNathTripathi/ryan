import React, { useState, useEffect } from "react";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/AdminLayout";

// ==============================================================================
// App — Main Root Component for XSHostel
// Manages:
// 1. Role simulation (Student vs Chief Warden)
// 2. View switching (Student Resident Portal vs Chief Warden Operations Console)
// 3. Route protection for /admin routes
// ==============================================================================
function App() {
  // Current active view: "admin" or "student"
  const [currentView, setCurrentView] = useState("admin"); // Starts in admin view for Issue #8 evaluation
  // Current tab in the student portal: "bookings" or "profile"
  const [studentTab, setStudentTab] = useState("bookings");
  // Simulated user role: "warden" (admin) or "student"
  const [userRole, setUserRole] = useState("warden");
  // Toast alert message
  const [toastMessage, setToastMessage] = useState("");

  // Listen to browser navigation (back/forward button)
  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname.startsWith("/admin")) {
        attemptAccessAdmin();
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, [userRole]);

  // Route protection logic: Check if user is allowed to access /admin
  const attemptAccessAdmin = () => {
    if (userRole !== "warden") {
      // If student tries to enter admin: Block access and redirect to public homepage
      setToastMessage("⛔ Access Denied: Chief Warden authorization required to access /admin.");
      setCurrentView("student");
      window.history.replaceState(null, "", "/");
      setTimeout(() => setToastMessage(""), 5000);
      return false;
    }

    // If warden: Allow entry into admin console
    setCurrentView("admin");
    window.history.pushState(null, "", "/admin");
    return true;
  };

  // Switch back to public student site
  const handleSwitchToStudent = () => {
    setCurrentView("student");
    window.history.pushState(null, "", "/");
  };

  // Toggle user role between Student and Chief Warden
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
      {/* 1. Global Toast Alert */}
      {toastMessage && (
        <div className="global-toast-notification">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage("")}>✕</button>
        </div>
      )}

      {/* 2. Role Simulation & Quick Switch Banner */}
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

      {/* 3. Conditional Rendering: Admin Console vs Student Portal */}
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
