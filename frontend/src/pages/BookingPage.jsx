import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from '../router';
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
  Building2,
  FileText,
  Lock,
  UtensilsCrossed,
} from '../components/Icons';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const roomId = searchParams.get('roomId');
  const initialAcademicYear = searchParams.get('academicYear') || '2026-2027';
  const initialSemester = searchParams.get('semester') || 'Fall 2026';
  const initialMessPlan = searchParams.get('messPlan') || 'Standard 4-Meal Plan';

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [academicYear, setAcademicYear] = useState(initialAcademicYear);
  const [semester, setSemester] = useState(initialSemester);
  const [messPlan, setMessPlan] = useState(initialMessPlan);
  const [checkIn, setCheckIn] = useState('2026-08-01');
  const [checkOut, setCheckOut] = useState('2026-12-20');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('University Fee Portal Simulator');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/booking', search: searchParams.toString() } } });
      return;
    }

    if (!roomId) {
      setError('Please select a hostel room to apply for bed allocation.');
      setLoadingRoom(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await roomService.getRoomById(roomId);
        if (res.data?.success) {
          setRoom(res.data.data);
        }
      } catch (err) {
        setError(err.friendlyMessage || 'Hostel room not found.');
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchRoom();
  }, [roomId, isAuthenticated]);

  // Fee calculation
  const calculateFees = () => {
    if (!room) return { roomFee: 0, messFee: 0, cautionDeposit: 100, total: 100 };
    const roomFee = room.pricePerNight || 750;
    const messFee = messPlan === 'Standard 4-Meal Plan' ? 200 : messPlan === 'Special Diet / Non-Veg' ? 300 : 0;
    const cautionDeposit = 100;
    const total = roomFee + messFee + cautionDeposit;
    return { roomFee, messFee, cautionDeposit, total };
  };

  const fees = calculateFees();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        roomId: room._id,
        academicYear,
        semester,
        messPlan,
        checkIn,
        checkOut,
        specialRequests: specialRequests.trim(),
        paymentMethod,
      };

      const res = await bookingService.createBooking(payload);
      if (res.data?.success) {
        setBookingConfirmed(res.data.data);
      }
    } catch (err) {
      setError(err.friendlyMessage || 'Bed allocation application could not be processed.');
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
              Hostel Allocation Confirmed
            </span>

            <h1 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>
              Bed Successfully Allocated!
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px' }}>
              Your hostel room and bed allocation voucher has been officially issued by the Chief Warden Office.
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Allocation Reference</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FBBF24', letterSpacing: '0.05em' }}>
                    {bookingConfirmed.bookingReference}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admission Status</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34D399' }}>
                    ● Approved / Active Resident
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Dorm:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{room.name} (#{room.roomNumber})</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Hostel Block:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{room.block}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Term & Session:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{bookingConfirmed.semester || semester} ({bookingConfirmed.academicYear || academicYear})</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Mess Plan:</span>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{bookingConfirmed.messPlan || messPlan}</div>
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
                <span>Total Semester Fee Paid:</span>
                <span style={{ color: '#FBBF24' }}>${bookingConfirmed.totalAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/my-bookings" className="btn btn-primary">
                View in My Hostel Allocations
              </Link>
              <Link to="/rooms" className="btn btn-secondary">
                Explore Other Dorms
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableBeds = room ? (room.capacity - (room.occupiedBeds || 0)) : 0;

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Title */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
            Hostel Admission Portal
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Student Bed Allocation Application</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Confirm your academic semester, choose dining preferences, and submit your hostel admission with instant verification.
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
              <Building2 size={20} color="#8B5CF6" /> 1. Academic Term & Residency Period
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Academic Year</label>
                <select
                  className="form-select"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  <option value="2026-2027">2026 - 2027</option>
                  <option value="2027-2028">2027 - 2028</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Semester Term</label>
                <select
                  className="form-select"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="Fall 2026">Fall Semester 2026</option>
                  <option value="Spring 2027">Spring Semester 2027</option>
                  <option value="Summer 2027">Summer Immersion 2027</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Hostel Check-In Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Hostel Check-Out Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>
            </div>

            <h2 style={{ fontSize: '1.3rem', marginTop: '28px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UtensilsCrossed size={20} color="#8B5CF6" /> 2. Mess Plan & Medical Notes
            </h2>

            <div className="form-group">
              <label className="form-label">Campus Mess Subscription</label>
              <select
                className="form-select"
                value={messPlan}
                onChange={(e) => setMessPlan(e.target.value)}
              >
                <option value="Standard 4-Meal Plan">Standard 4-Meal Buffet (+$200/sem)</option>
                <option value="Special Diet / Non-Veg">Special Diet & Non-Veg (+$300/sem)</option>
                <option value="No Mess Plan">Room Only (Self Managed / No Mess)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Medical Conditions / Roommate Preference (Optional)</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="e.g. Lower bunk preference, asthma, dust allergies, study-focused roommate..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="#8B5CF6" /> 3. Fee Payment Simulation
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
                <strong>Academic Demo Simulation:</strong> This fee checkout simulates the university student bursar gateway. Select a demo payment mode below to process immediate confirmation.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Channel</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="University Fee Portal Simulator">University Fee Portal Simulator (Direct Student Account)</option>
                <option value="Demo NetBanking / UPI">Demo NetBanking / UPI Campus Pay</option>
                <option value="Demo Scholarship Waiver">Demo Merit Scholarship Fee Waiver</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || availableBeds <= 0}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '16px' }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px' }} />
                  Allocating Bed...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} /> Confirm Bed Allocation (${fees.total})
                </span>
              )}
            </button>
          </form>

          {/* Right: Dorm Summary Card */}
          {room && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Hostel Dorm Summary</h3>
              <div style={{
                height: '180px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '16px',
              }}>
                <img
                  src={room.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                  alt={room.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '1.15rem' }}>{room.name}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Room #{room.roomNumber}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span className="badge badge-primary">{room.block}</span>
                <span className="badge badge-secondary">{room.gender} Wing</span>
              </div>

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
                  <span style={{ color: 'var(--text-secondary)' }}>Semester Room Fee</span>
                  <span>${fees.roomFee}</span>
                </div>
                {fees.messFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Mess Plan Subscription</span>
                    <span>${fees.messFee}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Refundable Caution Deposit</span>
                  <span>${fees.cautionDeposit}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}>
                  <span>Total Semester Fee</span>
                  <span style={{ color: '#FBBF24' }}>${fees.total}</span>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontWeight: 600, color: '#C4B5FD', marginBottom: '4px' }}>Warden Rule:</div>
                Vacating or bed exchange requests must be filed with the hostel warden office at least 15 days in advance.
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
