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
  BedDouble,
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
      alert(err.friendlyMessage || 'Failed to update status.');
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
      alert(err.friendlyMessage || 'Failed to update payment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const refMatch = b.bookingReference?.toLowerCase().includes(search.toLowerCase());
    const userMatch = b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                      b.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && (refMatch || userMatch);
  });

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Reservation Ledger</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review, modify, and audit all guest reservations across all resort wings.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Reference ID or Guest Name..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
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
                <th>Booking Ref</th>
                <th>Guest Details</th>
                <th>Suite Reserved</th>
                <th>Stay Period</th>
                <th>Amount</th>
                <th>Reservation Status</th>
                <th>Payment Status</th>
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
                      <div style={{ fontWeight: 600 }}>{b.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                    </td>
                    <td>
                      <div>{b.room?.name || 'Suite'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        #{b.room?.roomNumber} • {b.guests} Guests
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {b.numberOfNights} Nights
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
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
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
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No bookings found matching filters.
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
                <span className="badge badge-primary" style={{ marginBottom: '4px' }}>Reservation Voucher</span>
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
                  <span style={{ color: 'var(--text-muted)' }}>Guest Name:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.user?.name}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Guest Email:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.user?.email}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Suite:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.room?.name} (#{selectedBooking.room?.roomNumber})</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Guests:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.guests} Guests</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Check-In:</span>
                  <div style={{ fontWeight: 600 }}>{new Date(selectedBooking.checkIn).toLocaleDateString()}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Check-Out:</span>
                  <div style={{ fontWeight: 600 }}>{new Date(selectedBooking.checkOut).toLocaleDateString()}</div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Special Requests:</span>
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
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Amount Charged:</span>
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
