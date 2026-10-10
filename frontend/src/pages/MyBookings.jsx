import React, { useState, useEffect } from 'react';
import { Link } from '../router';
import { bookingService } from '../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Building2,
  BedDouble,
  DollarSign,
  UtensilsCrossed,
} from '../components/Icons';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // Cancel / Vacate Modal State
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      if (res.data?.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      setError(err.friendlyMessage || 'Unable to retrieve hostel allocations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    setCancellingBooking(booking);
    setCancelMessage(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      const res = await bookingService.cancelBooking(cancellingBooking._id);
      if (res.data?.success) {
        // Update local booking state
        setBookings((prev) =>
          prev.map((b) => (b._id === cancellingBooking._id ? res.data.data : b))
        );
        setCancellingBooking(null);
      }
    } catch (err) {
      setCancelMessage(err.friendlyMessage || 'Failed to vacate bed allocation.');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'All') return true;
    return b.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Active Resident</span>;
      case 'pending':
        return <span className="badge badge-warning"><Clock size={12} /> Pending Warden Review</span>;
      case 'cancelled':
        return <span className="badge badge-danger"><XCircle size={12} /> Vacated / Cancelled</span>;
      case 'completed':
        return <span className="badge badge-neutral">Completed Term</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
              Student Portal
            </span>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>My Hostel Allocations</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Track your active hostel room allotment, academic term, mess plan, and room vacating requests.
            </p>
          </div>

          <Link to="/rooms" className="btn btn-primary btn-sm">
            Apply For Room Allocation
          </Link>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid',
                background: filterStatus === st ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: filterStatus === st ? '#8B5CF6' : 'rgba(255, 255, 255, 0.08)',
                color: filterStatus === st ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner" />
          </div>
        ) : error ? (
          <div style={{
            padding: '24px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            color: '#FB7185',
          }}>
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <Building2 size={48} color="#8B5CF6" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No hostel allocations found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto' }}>
              You do not have any {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} room allotments recorded. Browse our hostel blocks to apply for a bed.
            </p>
            <Link to="/rooms" className="btn btn-primary">
              Browse Hostel Dorms
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredBookings.map((b) => (
              <div key={b._id} className="card" style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '16px',
                  marginBottom: '20px',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FBBF24', letterSpacing: '0.05em' }}>
                        {b.bookingReference}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Allotted on {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                      ${b.totalAmount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: b.paymentStatus === 'paid' ? '#34D399' : '#FB7185' }}>
                      ● Fee Status: {b.paymentStatus.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto',
                  gap: '24px',
                  alignItems: 'center',
                }} className="booking-card-row">
                  {/* Thumbnail */}
                  <div style={{
                    height: '84px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: '#1F293D',
                  }}>
                    {b.room?.images && b.room.images[0] ? (
                      <img
                        src={b.room.images[0]}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Building2 size={24} color="var(--text-muted)" />
                      </div>
                    )}
                  </div>

                  {/* Room & Allocation Details */}
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                      {b.room?.name || 'Campus Dorm Room'}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {b.room?.block || 'Block A'} • Room #{b.room?.roomNumber} • {b.room?.category}
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      flexWrap: 'wrap',
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Term: </span>
                        <strong>{b.semester || 'Fall 2026'} ({b.academicYear || '2026-2027'})</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Mess Plan: </span>
                        <strong>{b.messPlan || 'Standard 4-Meal Plan'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Check-In: </span>
                        <strong>{new Date(b.checkIn).toLocaleDateString()}</strong>
                      </div>
                    </div>

                    {b.specialRequests && (
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginTop: '8px',
                        fontStyle: 'italic',
                      }}>
                        Preferences: "{b.specialRequests}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div>
                    {b.status !== 'cancelled' ? (
                      <button
                        onClick={() => handleCancelClick(b)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#FB7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                      >
                        Vacate Room
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Vacated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingBooking && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}>
                <ShieldAlert size={28} color="#FB7185" />
              </div>

              <h2 style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '8px' }}>
                Vacate Hostel Dorm?
              </h2>

              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '24px' }}>
                Are you sure you want to vacate room <strong>#{cancellingBooking.room?.roomNumber}</strong> ({cancellingBooking.bookingReference})? This will immediately release your bed for other students.
              </p>

              {cancelMessage && (
                <div style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#FB7185',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}>
                  {cancelMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setCancellingBooking(null)}
                  disabled={cancelLoading}
                  className="btn btn-secondary"
                >
                  Keep Room
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancelLoading}
                  className="btn btn-danger"
                >
                  {cancelLoading ? 'Processing...' : 'Confirm Vacate'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 650px) {
          .booking-card-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
