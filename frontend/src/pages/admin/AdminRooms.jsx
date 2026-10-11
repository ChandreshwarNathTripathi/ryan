import React, { useState, useEffect } from "react";

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    block: "Block A (Boys)",
    category: "Double Sharing",
    floor: "1st Floor",
    capacity: 2,
    pricePerSemester: 55000,
    curfewTime: "10:00 PM",
    amenities: ["High-Speed Wi-Fi", "Attached Bathroom"],
    status: "Available",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const availableAmenities = [
    "High-Speed Wi-Fi",
    "Attached Bathroom",
    "Air Conditioning",
    "Study Desk",
    "Personal Wardrobe",
    "Balcony View",
    "Gigabit Ethernet",
    "Mini Refrigerator",
    "Common Bath",
    "Quiet Zone",
  ];

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      let url = "http://localhost:5001/api/admin/rooms?";
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;
      if (selectedBlock !== "All") url += `block=${encodeURIComponent(selectedBlock)}`;

      const res = await fetch(url, {
        headers: { "x-admin-role": "warden" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load dormitories");

      setRooms(data.rooms || []);
    } catch (err) {
      setError(err.message || "Network error loading dormitories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [search, selectedBlock]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: "",
      block: "Block A (Boys)",
      category: "Double Sharing",
      floor: "1st Floor",
      capacity: 2,
      pricePerSemester: 55000,
      curfewTime: "10:00 PM",
      amenities: ["High-Speed Wi-Fi", "Attached Bathroom", "Study Desk"],
      status: "Available",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      block: room.block,
      category: room.category,
      floor: room.floor,
      capacity: room.capacity,
      pricePerSemester: room.pricePerSemester,
      curfewTime: room.curfewTime || "10:00 PM",
      amenities: room.amenities || [],
      status: room.status || "Available",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Toggle Amenity Checkbox
  const handleToggleAmenity = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== item)
          : [...prev.amenities, item],
      };
    });
  };

  // Submit Room Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.roomNumber.trim()) {
      setFormError("Room number is required (e.g. A-105).");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const isEdit = Boolean(editingRoom);
      const url = isEdit
        ? `http://localhost:5001/api/admin/rooms/${editingRoom._id}`
        : "http://localhost:5001/api/admin/rooms";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-role": "warden",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save room");

      setSuccessMsg(
        isEdit
          ? `Dormitory room ${formData.roomNumber} updated successfully!`
          : `New dormitory ${formData.roomNumber} added to campus inventory!`
      );
      setIsModalOpen(false);
      fetchRooms();

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setFormError(err.message || "Failed to save room details");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Room
  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to decommission dormitory room ${roomNumber}? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/admin/rooms/${roomId}`, {
        method: "DELETE",
        headers: { "x-admin-role": "warden" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete room");

      setSuccessMsg(`Room ${roomNumber} decommissioned from database.`);
      fetchRooms();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert("Error deleting room: " + err.message);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Dormitories & Bed Inventory</h1>
          <p>Manage hostel wings, bed allotments, semester tariffs, and room amenities</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          ➕ Add New Dormitory
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Controls */}
      <div className="admin-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search room number (e.g. A-101)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="block-filter">Filter by Block:</label>
          <select
            id="block-filter"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="form-select"
          >
            <option value="All">All Campus Wings</option>
            <option value="Block A (Boys)">Block A (Boys)</option>
            <option value="Block B (Girls)">Block B (Girls)</option>
            <option value="Block C (Scholars)">Block C (Scholars)</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      {loading ? (
        <div className="admin-loading">Loading dormitory inventory...</div>
      ) : rooms.length === 0 ? (
        <div className="empty-state-box">
          <span className="empty-icon">🛏️</span>
          <h3>No Dormitories Found</h3>
          <p>No rooms match your search query or filter criteria.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Block</th>
                <th>Category</th>
                <th>Floor</th>
                <th>Beds (Occupied / Total)</th>
                <th>Tariff / Sem</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => {
                const isFullyOccupied = r.occupiedBeds >= r.capacity;
                return (
                  <tr key={r._id}>
                    <td>
                      <strong className="room-number-tag">{r.roomNumber}</strong>
                    </td>
                    <td>{r.block}</td>
                    <td>
                      <span className="category-pill">{r.category}</span>
                    </td>
                    <td>{r.floor}</td>
                    <td>
                      <div className="bed-capacity-cell">
                        <span className={`bed-ratio ${isFullyOccupied ? "full" : "available"}`}>
                          {r.occupiedBeds} / {r.capacity}
                        </span>
                        <div className="bed-bar-wrap">
                          <div
                            className="bed-bar-fill"
                            style={{
                              width: `${Math.min(100, (r.occupiedBeds / (r.capacity || 1)) * 100)}%`,
                              backgroundColor: isFullyOccupied ? "#EF4444" : "#10B981",
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>₹{Number(r.pricePerSemester).toLocaleString()}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          isFullyOccupied || r.status === "Occupied" ? "badge-occupied" : "badge-available"
                        }`}
                      >
                        {isFullyOccupied ? "Occupied" : r.status || "Available"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          onClick={() => handleOpenEdit(r)}
                          title="Edit Room Details"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteRoom(r._id, r.roomNumber)}
                          title="Decommission Room"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Dormitory Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingRoom ? `Edit Dormitory Room ${editingRoom.roomNumber}` : "Add New Dormitory"}</h2>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmitForm} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="room-number-input">Room Number *</label>
                  <input
                    id="room-number-input"
                    type="text"
                    required
                    placeholder="e.g. A-105 or B-302"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="block-select">Block / Hostel Wing *</label>
                  <select
                    id="block-select"
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="form-select"
                  >
                    <option value="Block A (Boys)">Block A (Boys)</option>
                    <option value="Block B (Girls)">Block B (Girls)</option>
                    <option value="Block C (Scholars)">Block C (Scholars)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category-select">Sharing Category</label>
                  <select
                    id="category-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Single">Single Occupancy</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="floor-select">Floor Level</label>
                  <select
                    id="floor-select"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="form-select"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="bed-capacity-input">Total Bed Capacity *</label>
                  <input
                    id="bed-capacity-input"
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price-per-sem-input">Price Per Semester (₹) *</label>
                  <input
                    id="price-per-sem-input"
                    type="number"
                    step="500"
                    min="10000"
                    required
                    value={formData.pricePerSemester}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerSemester: Number(e.target.value) })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="curfew-time-input">Wing Curfew Time</label>
                  <input
                    id="curfew-time-input"
                    type="text"
                    value={formData.curfewTime}
                    onChange={(e) => setFormData({ ...formData, curfewTime: e.target.value })}
                    placeholder="e.g. 10:00 PM"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status-select">Operating Status</label>
                  <select
                    id="status-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="Available">Available for Allotment</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Amenities Checklist */}
              <div className="form-group amenities-section">
                <label>Room Amenities & Inclusions:</label>
                <div className="amenities-checkbox-grid">
                  {availableAmenities.map((amenity) => {
                    const isChecked = formData.amenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className={`amenity-check-chip ${isChecked ? "checked" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAmenity(amenity)}
                        />
                        <span>{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? "Saving..." : editingRoom ? "Update Dormitory" : "Create Dormitory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRooms;
