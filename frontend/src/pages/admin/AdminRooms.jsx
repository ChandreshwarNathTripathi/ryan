import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Building2,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  BedDouble,
} from 'lucide-react';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete State
  const [deletingRoom, setDeletingRoom] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    block: 'Block A (Boys)',
    gender: 'Male',
    floor: 1,
    category: 'Double Sharing',
    description: '',
    pricePerNight: 750,
    capacity: 2,
    amenities: 'Attached Bathroom, High-Speed Wi-Fi, Ergonomic Study Desks, Wardrobes with Lock',
    images: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    status: 'available',
    featured: false,
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomService.getRooms({ limit: 50 });
      if (res.data?.success) setRooms(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAddModal = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      roomNumber: '',
      block: 'Block A (Boys)',
      gender: 'Male',
      floor: 1,
      category: 'Double Sharing',
      description: '',
      pricePerNight: 750,
      capacity: 2,
      amenities: 'Attached Bathroom, High-Speed Wi-Fi, Ergonomic Study Desks, Wardrobes with Lock',
      images: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      status: 'available',
      featured: false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      roomNumber: room.roomNumber,
      block: room.block || 'Block A (Boys)',
      gender: room.gender || 'Male',
      floor: room.floor || 1,
      category: room.category,
      description: room.description,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      amenities: room.amenities?.join(', ') || '',
      images: room.images?.join(', ') || '',
      status: room.status,
      featured: room.featured || false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        roomNumber: formData.roomNumber.trim().toUpperCase(),
        block: formData.block,
        gender: formData.gender,
        floor: Number(formData.floor),
        category: formData.category,
        description: formData.description.trim(),
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        amenities: formData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        images: formData.images
          .split(',')
          .map((img) => img.trim())
          .filter(Boolean),
        status: formData.status,
        featured: Boolean(formData.featured),
      };

      if (editingRoom) {
        await roomService.updateRoom(editingRoom._id, payload);
      } else {
        await roomService.createRoom(payload);
      }

      setIsModalOpen(false);
      fetchRooms();
    } catch (err) {
      setFormError(err.friendlyMessage || 'Failed to save hostel dorm details.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRoom) return;
    setDeleteLoading(true);
    try {
      await roomService.deleteRoom(deletingRoom._id);
      setDeletingRoom(null);
      fetchRooms();
    } catch (err) {
      alert(err.friendlyMessage || 'Failed to delete hostel dorm.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesBlock = blockFilter === 'All' || r.block === blockFilter;
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(search.toLowerCase());
    return matchesBlock && matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Hostel Dormitories & Beds</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Configure hostel blocks, floor levels, bed capacities, semester fees, and active bed vacancy records.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add New Dorm Room
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by dorm title or room number (e.g. A-101)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '200px' }}>
            <select
              className="form-select"
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
            >
              <option value="All">All Blocks</option>
              <option value="Block A (Boys)">Block A (Boys)</option>
              <option value="Block B (Girls)">Block B (Girls)</option>
              <option value="Block C (Scholars)">Block C (Scholars)</option>
            </select>
          </div>

          <div style={{ width: '200px' }}>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Sharing Types</option>
              <option value="Single Room">Single Room</option>
              <option value="Double Sharing">Double Sharing</option>
              <option value="Triple Sharing">Triple Sharing</option>
              <option value="Four Bed Dorm">Four Bed Dorm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Dorm & Room #</th>
                <th>Block & Floor</th>
                <th>Sharing Type</th>
                <th>Semester Fee</th>
                <th>Bed Allocation</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => {
                  const availableBeds = (room.capacity || 1) - (room.occupiedBeds || 0);
                  return (
                    <tr key={room._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80'}
                            alt=""
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{room.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 600 }}>Room #{room.roomNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{room.block || 'Block A'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Floor {room.floor || 1} • {room.gender || 'Male'}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">{room.category}</span>
                      </td>
                      <td>
                        <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>${room.pricePerNight}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ semester</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <Users size={14} color="#8B5CF6" style={{ display: 'inline', marginRight: '4px' }} />
                          {room.occupiedBeds || 0} / {room.capacity} Beds
                        </div>
                        <div style={{ fontSize: '0.75rem', color: availableBeds > 0 ? '#10B981' : '#FB7185' }}>
                          {availableBeds > 0 ? `${availableBeds} Free` : 'Full'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          availableBeds > 0 ? 'badge-success' : 'badge-danger'
                        }`}>
                          {availableBeds > 0 ? 'Vacant' : 'Full'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => openEditModal(room)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 12px' }}
                            title="Edit Dorm"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingRoom(room)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '6px 12px' }}
                            title="Delete Dorm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No hostel dorms match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {editingRoom ? `Edit Dorm Room #${editingRoom.roomNumber}` : 'Create New Hostel Dorm Room'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#FB7185',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Dorm Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Block A Deluxe Double Room"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. A-101"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Hostel Block</label>
                  <select
                    className="form-select"
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  >
                    <option value="Block A (Boys)">Block A (Boys)</option>
                    <option value="Block B (Girls)">Block B (Girls)</option>
                    <option value="Block C (Scholars)">Block C (Scholars)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender Wing</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male Wing</option>
                    <option value="Female">Female Wing</option>
                    <option value="Co-ed">Co-ed Scholars Wing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Floor Number</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    required
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Sharing Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Single Room">Single Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                    <option value="Four Bed Dorm">Four Bed Dorm</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester Fee ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    required
                    min="100"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Beds (Capacity)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    min="1"
                    max="6"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amenities (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs (Comma separated)</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="available">Available</option>
                    <option value="booked">Fully Allocated</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div style={{ paddingTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#8B5CF6' }}
                    />
                    <span>Highlight as Featured Campus Dorm</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Saving...' : editingRoom ? 'Update Dorm' : 'Create Dorm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRoom && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}>
              <AlertCircle size={28} color="#FB7185" />
            </div>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              Permanently Delete Hostel Dorm?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Are you sure you want to remove <strong>{deletingRoom.name} (#{deletingRoom.roomNumber})</strong>? This action will permanently remove it from the hostel room inventory.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeletingRoom(null)}
                className="btn btn-secondary"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="btn btn-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Dorm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
