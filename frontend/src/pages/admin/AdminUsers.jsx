import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import { Users, Search, Shield, UserCheck, UserX, AlertCircle, BookOpen, Phone } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({ limit: 50 });
      if (res.data?.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    setUpdatingId(user._id);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await userService.updateUser(user._id, { status: newStatus });
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      alert(err.friendlyMessage || 'Failed to update resident status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    setUpdatingId(user._id);
    try {
      const res = await userService.updateUser(user._id, { role: newRole });
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert(err.friendlyMessage || 'Failed to update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      u.course?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Student & Staff Directory</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage resident student records, roll numbers, degree courses, guardian contacts, and warden administrative privileges.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name, roll #, email, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '200px' }}>
            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="user">Resident Students</option>
              <option value="admin">Wardens & Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Resident / Member</th>
                <th>Academic Course</th>
                <th>Contact & Guardian</th>
                <th>System Role</th>
                <th>Account Status</th>
                <th>Bed Allotments</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: u.role === 'admin' ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)' : '#1F293D',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: '#FFFFFF',
                        }}>
                          {u.name ? u.name.charAt(0) : 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {u.studentId ? `Roll: ${u.studentId} • ` : ''}{u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {u.course || 'Undergraduate'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{u.phone || 'No phone'}</div>
                      {u.guardianPhone && (
                        <div style={{ fontSize: '0.75rem', color: '#FBBF24' }}>
                          Guardian: {u.guardianPhone}
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        disabled={updatingId === u._id}
                        className="form-select"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="user">Student Resident</option>
                        <option value="admin">Hostel Warden</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {u.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td>
                      <strong>{u.bookingCount || 0} Terms</strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={updatingId === u._id}
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No students or staff found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
