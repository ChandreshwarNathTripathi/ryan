import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';
import {
  CalendarCheck2,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  CreditCard,
  User,
  Building2,
  UtensilsCrossed,
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAllBookings({ limit: 100 });
      if (res.data?.success) setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await bookingService.updateBookingStatus(id, { status: newStatus });
      if (res.data?.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? res.data.data : b))
        );
      }
    } catch (err) {
      alert(err.friendlyMessage || 'Failed to update allocation status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentChange = async (id, newPaymentStatus) => {
    setUpdatingId(id);
    try {
      const res = await bookingService.updateBookingStatus(id, { paymentStatus: newPaymentStatus });
      if (res.data?.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? res.data.data : b))
        );
      }
    } catch (err) {
      alert(err.friendlyMessage || 'Failed to update fee payment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const refMatch = b.bookingReference?.toLowerCase().includes(search.toLowerCase());
    const userMatch = b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                      b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
                      b.user?.studentId?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && (refMatch || userMatch);
  });

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Allocation Ledger</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review, approve, and manage dormitory bed allotments, academic terms, and mess plan subscriptions.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Allocation Ref, Student Name, or Roll #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '200px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="confirmed">Confirmed / Active</option>
              <option value="pending">Pending Warden Review</option>
              <option value="cancelled">Vacated / Cancelled</option>
              <option value="completed">Completed Term</option>
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
                <th>Allocation Ref</th>
                <th>Student Resident</th>
                <th>Dormitory & Block</th>
                <th>Academic Term & Mess</th>
                <th>Semester Fee</th>
                <th>Allotment Status</th>
                <th>Fee Payment</th>
                <th style={{ textAlign: 'right' }}>Voucher</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span style={{ fontWeight: 800, color: '#FBBF24', letterSpacing: '0.04em' }}>
                        {b.bookingReference}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.user?.name || 'Student'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {b.user?.studentId ? `Roll: ${b.user.studentId} • ` : ''}{b.user?.email}
                      </div>
                    </td>
                    <td>
                      <div>{b.room?.name || 'Dorm'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {b.room?.block} • Room #{b.room?.roomNumber}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {b.semester || 'Fall 2026'} ({b.academicYear || '2026-2027'})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#C4B5FD' }}>
                        {b.messPlan || '4-Meal Plan'}
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.95rem' }}>${b.totalAmount}</strong>
                    </td>
                    <td>
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        disabled={updatingId === b._id}
                        className="form-select"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="confirmed">Confirm Allotment</option>
                        <option value="pending">Pending Review</option>
                        <option value="cancelled">Vacate Bed</option>
                        <option value="completed">Complete Term</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={b.paymentStatus}
                        onChange={(e) => handlePaymentChange(b._id, e.target.value)}
                        disabled={updatingId === b._id}
                        className="form-select"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="View Allotment Voucher"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No student allocations found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Voucher Modal */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '4px' }}>Hostel Bed Allotment Voucher</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FBBF24' }}>
                  {selectedBooking.bookingReference}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Resident Student:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.user?.name}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Student Roll / ID:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.user?.studentId || 'N/A'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Dorm & Room:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.room?.name} (#{selectedBooking.room?.roomNumber})</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Hostel Block:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.room?.block}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Term & Session:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.semester} ({selectedBooking.academicYear})</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Mess Subscription:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.messPlan}</div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Resident Preferences / Medical:</span>
                  <p style={{ color: '#C4B5FD', fontStyle: 'italic', marginTop: '2px' }}>
                    "{selectedBooking.specialRequests}"
                  </p>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '16px',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Semester Fee:</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FBBF24' }}>
                  ${selectedBooking.totalAmount}
                </div>
              </div>

              <button onClick={() => setSelectedBooking(null)} className="btn btn-secondary">
                Close Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
