import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { roomService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Crown,
  FileText,
  Lock,
} from 'lucide-react';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const roomId = searchParams.get('roomId');
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialGuests = searchParams.get('guests') || '2';

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Demo Visa Infinite');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  useEffect(() => {
    // If not authenticated, redirect to login with callback state
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/booking', search: searchParams.toString() } } });
      return;
    }

    if (!roomId) {
      setError('Please select a room to reserve.');
      setLoadingRoom(false);
      return;
    }

    // Set fallback dates if not set
    if (!checkIn || !checkOut) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const future = new Date();
      future.setDate(future.getDate() + 4);
      if (!checkIn) setCheckIn(tomorrow.toISOString().split('T')[0]);
      if (!checkOut) setCheckOut(future.toISOString().split('T')[0]);
    }

    const fetchRoom = async () => {
      try {
        const res = await roomService.getRoomById(roomId);
        if (res.data?.success) {
          setRoom(res.data.data);
          if (res.data.data.capacity < Number(guests)) {
            setGuests(String(res.data.data.capacity));
          }
        }
      } catch (err) {
        setError(err.friendlyMessage || 'Room not found.');
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchRoom();
  }, [roomId, isAuthenticated]);

  // Live calculation
  const calculatePricing = () => {
    if (!room || !checkIn || !checkOut) return { nights: 0, roomPrice: 0, taxes: 0, total: 0 };
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (isNaN(d1) || isNaN(d2) || d2 <= d1) return { nights: 0, roomPrice: 0, taxes: 0, total: 0 };

    const diff = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
    const nights = Math.max(1, diff);
    const roomPrice = nights * room.pricePerNight;
    const taxes = Math.round(roomPrice * 0.12);
    const total = roomPrice + taxes;
    return { nights, roomPrice, taxes, total };
  };

  const pricing = calculatePricing();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        roomId: room._id,
        checkIn,
        checkOut,
        guests: Number(guests),
        specialRequests: specialRequests.trim(),
        paymentMethod,
      };

      const res = await bookingService.createBooking(payload);
      if (res.data?.success) {
        setBookingConfirmed(res.data.data);
      }
    } catch (err) {
      setError(err.friendlyMessage || 'Reservation could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingRoom) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  // Confirmation Screen
  if (bookingConfirmed) {
    return (
      <div style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="card" style={{
            background: '#111827',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: 'var(--shadow-lg), 0 0 50px rgba(16, 185, 129, 0.15)',
            padding: '48px 40px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
            }}>
              <CheckCircle2 size={36} color="#10B981" />
            </div>

            <span className="badge badge-success" style={{ marginBottom: '12px' }}>
              Reservation Confirmed
            </span>

            <h1 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>
              We Look Forward to Welcoming You
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px' }}>
              Your reservation voucher has been created. A confirmation summary is linked to your guest account.
            </p>

            {/* Voucher Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-medium)',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '36px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '16px',
                marginBottom: '16px',
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Booking Reference</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FBBF24', letterSpacing: '0.05em' }}>
                    {bookingConfirmed.bookingReference}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Payment Status</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34D399' }}>
                    ● Paid (Demo Simulation)
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Reserved Suite:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{room.name} (#{room.roomNumber})</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Guests:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{bookingConfirmed.guests} Guests</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Check-In:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{new Date(bookingConfirmed.checkIn).toLocaleDateString()}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Check-Out:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{new Date(bookingConfirmed.checkOut).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}>
                <span>Total Amount Charged:</span>
                <span style={{ color: '#FBBF24' }}>${bookingConfirmed.totalAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/my-bookings" className="btn btn-primary">
                View in My Bookings
              </Link>
              <Link to="/rooms" className="btn btn-secondary">
                Explore More Suites
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Title */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
            Secure Reservation
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Complete Your Reservation</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Confirm your dates, personalize your stay, and simulate instant booking confirmation.
          </p>
        </div>

        {error && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#FB7185',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)',
          gap: '40px',
          alignItems: 'flex-start',
        }} className="booking-layout">
          {/* Left: Form */}
          <form onSubmit={handleBookingSubmit} className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#8B5CF6" /> 1. Select Stay Dates
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Check-In Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Check-Out Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Guests (Capacity: {room?.capacity || 2} Max)</label>
              <select
                className="form-select"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                {[...Array(room?.capacity || 2)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Special Requests & In-Room Amenities (Optional)</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="e.g. Airport chauffeur arrival time, feather pillows, chilled champagne..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="#8B5CF6" /> 2. Demo Payment Simulation
            </h2>

            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              fontSize: '0.85rem',
              color: '#FCD34D',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
            }}>
              <Lock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Academic Demo Environment:</strong> No real credit cards or financial transactions are processed. Select a demo instrument below to simulate instant payment authorization.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Simulated Payment Method</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Demo Visa Infinite">Demo Visa Infinite (Ending in •••• 4242)</option>
                <option value="Demo Mastercard World Elite">Demo Mastercard World Elite (Ending in •••• 5555)</option>
                <option value="Demo Amex Centurion">Demo American Express Centurion</option>
                <option value="Demo Instant UPI Pay">Demo Instant UPI Simulator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || pricing.nights <= 0}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '16px' }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px' }} />
                  Processing Reservation...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} /> Confirm Reservation (${pricing.total})
                </span>
              )}
            </button>
          </form>

          {/* Right: Suite Summary Card */}
          {room && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Reservation Summary</h3>
              <div style={{
                height: '180px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '16px',
              }}>
                <img
                  src={room.images[0]}
                  alt={room.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '1.15rem' }}>{room.name}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>#{room.roomNumber}</span>
              </div>
              <span className="badge badge-primary" style={{ marginBottom: '16px' }}>{room.category}</span>

              {/* Price Details */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '0.9rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Rate per night</span>
                  <span>${room.pricePerNight}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Duration of stay</span>
                  <span>{pricing.nights} {pricing.nights === 1 ? 'Night' : 'Nights'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Room Subtotal</span>
                  <span>${pricing.roomPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Luxury Tax & Fees (12%)</span>
                  <span>${pricing.taxes}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}>
                  <span>Total Amount</span>
                  <span style={{ color: '#FBBF24' }}>${pricing.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .booking-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
