import React, { useState } from "react";
import AdminOverview from "./AdminOverview";
import AdminRooms from "./AdminRooms";
import AdminBookings from "./AdminBookings";
import AdminUsers from "./AdminUsers";
import AdminSettings from "./AdminSettings";

function AdminLayout({ onExitToPublicSite }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Operations Overview", icon: "📊" },
    { id: "rooms", label: "Dormitories & Beds", icon: "🛏️" },
    { id: "bookings", label: "Allocations Ledger", icon: "📋" },
    { id: "users", label: "Student Directory", icon: "👥" },
    { id: "settings", label: "Curfew & Mess Settings", icon: "⚙️" },
  ];

  return (
    <div className="admin-console-layout">
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="admin-crest-section">
          <div className="admin-crest-badge">
            <span className="crest-icon">🛡️</span>
          </div>
          <div className="admin-crest-text">
            <h2>CHIEF WARDEN</h2>
            <span>Operations Console</span>
          </div>
        </div>

        <nav className="admin-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

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

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
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
