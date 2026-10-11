import React, { useState } from "react";
import AdminOverview from "./AdminOverview";
import AdminRooms from "./AdminRooms";
import AdminBookings from "./AdminBookings";
import AdminUsers from "./AdminUsers";
import AdminSettings from "./AdminSettings";

// ==============================================================================
// AdminLayout — Beginner-Friendly Chief Warden Console Shell
// Contains the sidebar navigation menu, top bar status, and active tab view.
// ==============================================================================
function AdminLayout({ onExitToPublicSite }) {
  // Simple state to remember which menu item is selected
  const [activeTab, setActiveTab] = useState("overview");
  // Simple state for opening/closing mobile sidebar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // List of navigation tabs
  const navItems = [
    { id: "overview", label: "Operations Overview", icon: "📊" },
    { id: "rooms", label: "Dormitories & Beds", icon: "🛏️" },
    { id: "bookings", label: "Allocations Ledger", icon: "📋" },
    { id: "users", label: "Student Directory", icon: "👥" },
    { id: "settings", label: "Curfew & Mess Settings", icon: "⚙️" },
  ];

  return (
    <div className="admin-console-layout">
      {/* 1. Sidebar Navigation */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Chief Warden Crest Header */}
        <div className="admin-crest-section">
          <div className="admin-crest-badge">
            <span className="crest-icon">🛡️</span>
          </div>
          <div className="admin-crest-text">
            <h2>CHIEF WARDEN</h2>
            <span>Operations Console</span>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav className="admin-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false); // Close mobile drawer when clicked
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer with Link back to Student Portal */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="btn-switch-portal"
            onClick={onExitToPublicSite}
          >
            🏛️ Public Student Site
          </button>
          <div className="admin-warden-card">
            <div className="warden-avatar">CW</div>
            <div className="warden-meta">
              <strong>Dr. Alok Verma</strong>
              <span>Chief Hostel Warden</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Top Bar Header */}
        <header className="admin-topbar">
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
          <div className="topbar-status">
            <span className="status-live-indicator"></span>
            <span>Campus Network: Online & Synced</span>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onExitToPublicSite}
            >
              ← Back to Student View
            </button>
          </div>
        </header>

        {/* Dynamic Body: Renders whichever tab is selected */}
        <main className="admin-content-body">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "rooms" && <AdminRooms />}
          {activeTab === "bookings" && <AdminBookings />}
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "settings" && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
