import React, { useState, useEffect } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Confirmation modal state
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [toggling, setToggling] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      let url = "http://localhost:5001/api/admin/users?";
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;
      if (roleFilter !== "All") url += `role=${encodeURIComponent(roleFilter)}`;

      const res = await fetch(url, {
        headers: { "x-admin-role": "warden" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load directory");

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Failed to load directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  // Trigger Confirmation
  const handlePromptToggle = (user) => {
    if (user.status === "active") {
      setConfirmTarget(user);
    } else {
      // Direct restore without scary prompt
      executeToggle(user);
    }
  };

  // Execute Toggle Status
  const executeToggle = async (user) => {
    try {
      setToggling(true);
      const res = await fetch(`http://localhost:5001/api/admin/users/${user._id}/toggle-status`, {
        method: "PATCH",
        headers: { "x-admin-role": "warden" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user account status");

      const newStatus = data.user.status;
      setSuccessMsg(
        newStatus === "suspended"
          ? `Account for ${user.name} has been suspended.`
          : `Account access restored for ${user.name}.`
      );

      setConfirmTarget(null);
      fetchUsers();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Student & Staff Directory</h1>
          <p>Campus resident profiles, academic departments, guardian contacts, and disciplinary access</p>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="user-role-filter">Filter by Role:</label>
          <select
            id="user-role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All Roles</option>
            <option value="student">Students Only</option>
            <option value="warden">Hostel Wardens / Staff</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="admin-loading">Loading directory records...</div>
      ) : users.length === 0 ? (
        <div className="empty-state-box">
          <span className="empty-icon">👥</span>
          <h3>No Records Found</h3>
          <p>No students match your query criteria.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student / Member</th>
                <th>Roll Number</th>
                <th>Email Address</th>
                <th>Degree / Course</th>
                <th>Emergency / Guardian Phone</th>
                <th>Role</th>
                <th>Account Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSuspended = u.status === "suspended";
                return (
                  <tr key={u._id} className={isSuspended ? "row-suspended" : ""}>
                    <td>
                      <div className="user-cell-meta">
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="roll-badge">{u.studentId || "N/A"}</span>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.course || "Not Specified"}</td>
                    <td>
                      <div>📞 {u.phone}</div>
                      {u.guardianPhone && u.guardianPhone !== "N/A" && (
                        <small className="guardian-contact">Guardian: {u.guardianPhone}</small>
                      )}
                    </td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>
                        {u.role ? u.role.toUpperCase() : "STUDENT"}
                      </span>
                    </td>
                    <td>
                      <span className={`account-status-badge ${isSuspended ? "status-suspended" : "status-active"}`}>
                        {isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td>
                      {u.role === "warden" ? (
                        <span className="protected-admin-tag">Admin Protected</span>
                      ) : (
                        <button
                          type="button"
                          className={`btn-action ${isSuspended ? "btn-restore" : "btn-suspend"}`}
                          onClick={() => handlePromptToggle(u)}
                        >
                          {isSuspended ? "🔓 Restore Access" : "🔒 Suspend Access"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Suspension Confirmation Modal */}
      {confirmTarget && (
        <div className="modal-backdrop">
          <div className="modal-card modal-confirm">
            <div className="modal-header">
              <h2>Confirm Account Suspension</h2>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setConfirmTarget(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body-content">
              <p>
                Are you sure you want to suspend access for student <strong>{confirmTarget.name}</strong> (
                {confirmTarget.studentId})?
              </p>
              <div className="alert alert-warning">
                ⚠️ While suspended, the student will be barred from making bed requests or booking hostel services.
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setConfirmTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={toggling}
                className="btn btn-danger"
                onClick={() => executeToggle(confirmTarget)}
              >
                {toggling ? "Suspending..." : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
