import React, { useState, useEffect } from "react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      let url = "http://localhost:5001/api/admin/bookings";
      if (filterStatus !== "All") {
        url += `?status=${filterStatus}`;
      }

      const res = await fetch(url, {
        headers: { "x-admin-role": "warden" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load allocations ledger");

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Failed to connect to allocation service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  // Handle status update
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const res = await fetch(`http://localhost:5001/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-role": "warden",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update allocation status");

      setSuccessMsg(`Allocation status updated to "${newStatus.replace('_', ' ').toUpperCase()}"!`);
      // Refresh UI immediately
      fetchBookings();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Allocations Ledger</h1>
          <p>Official registry of room allotments, check-in statuses, and student mess configurations</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={fetchBookings}>
          🔄 Refresh Ledger
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter Tabs */}
      <div className="filter-pill-group">
        {["All", "confirmed", "checked_in", "vacated", "cancelled"].map((st) => (
          <button
            key={st}
            type="button"
            className={`filter-pill-btn ${filterStatus === st ? "active" : ""}`}
            onClick={() => setFilterStatus(st)}
          >
            {st === "All" ? "All Allotments" : st.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="admin-loading">Loading allocations registry...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state-box">
          <span className="empty-icon">📋</span>
          <h3>No Allocations Recorded</h3>
          <p>No room allotments match the selected filter category.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Resident Student</th>
                <th>Roll Number</th>
                <th>Room & Block</th>
                <th>Semester</th>
                <th>Mess Plan</th>
                <th>Total Paid</th>
                <th>Status</th>
                <th>Manage Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const isUpdating = updatingId === b._id;
                return (
                  <tr key={b._id}>
                    <td>
                      <code className="ref-tag">{b.bookingReference}</code>
                    </td>
                    <td>
                      <strong>{b.studentName}</strong>
                    </td>
                    <td>{b.studentRoll}</td>
                    <td>
                      <span className="room-highlight">{b.roomNumber}</span>
                      <small className="block-subtext">{b.block}</small>
                    </td>
                    <td>{b.semester}</td>
                    <td>
                      <span className="mess-plan-tag">{b.messPlan}</span>
                    </td>
                    <td>
                      <strong>₹{Number(b.totalFee).toLocaleString()}</strong>
                    </td>
                    <td>
                      <span className={`booking-status-badge status-${b.status}`}>
                        {b.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <select
                        disabled={isUpdating}
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                        className="status-select-control"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="checked_in">Checked In</option>
                        <option value="vacated">Vacated</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
