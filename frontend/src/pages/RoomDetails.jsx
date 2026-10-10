import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomService, reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  BedDouble,
  ShieldCheck,
  Star,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Crown,
  MessageSquare,
  Send,
  AlertCircle,
} from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reservation Widget State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  useEffect(() => {
    // Set default check-in & check-out
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const future = new Date();
    future.setDate(future.getDate() + 4);

    setCheckIn(tomorrow.toISOString().split('T')[0]);
    setCheckOut(future.toISOString().split('T')[0]);

    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await roomService.getRoomById(id);
        if (res.data?.success) {
          setRoom(res.data.data);
          if (res.data.data.capacity < 2) setGuests('1');
        }
      } catch (err) {
        setError(err.friendlyMessage || 'Unable to load room details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // Calculate live reservation estimates
  const calculatePricing = () => {
    if (!room || !checkIn || !checkOut) return { nights: 0, roomTotal: 0, taxes: 0, total: 0 };
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (isNaN(d1) || isNaN(d2) || d2 <= d1) return { nights: 0, roomTotal: 0, taxes: 0, total: 0 };

    const diff = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
    const nights = Math.max(1, diff);
    const roomTotal = nights * room.pricePerNight;
    const taxes = Math.round(roomTotal * 0.12);
    const total = roomTotal + taxes;
    return { nights, roomTotal, taxes, total };
  };

  const pricing = calculatePricing();

  const handleProceedBooking = () => {
    navigate(
      `/booking?roomId=${room._id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    setReviewMessage(null);

    try {
      const res = await reviewService.createReview({
        roomId: room._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (res.data?.success) {
        setReviewMessage({ type: 'success', text: 'Thank you! Your review has been submitted.' });
        setReviewComment('');
        // Refresh room details to display new review
        const updated = await roomService.getRoomById(id);
        if (updated.data?.success) setRoom(updated.data.data);
      }
    } catch (err) {
      setReviewMessage({ type: 'error', text: err.friendlyMessage || 'Failed to submit review.' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', color: '#FB7185' }}>Room Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {error || 'The suite you requested could not be located.'}
        </p>
        <Link to="/rooms" className="btn btn-secondary">
          <ArrowLeft size={16} /> Return to Suites Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '32px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/rooms" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}>
            <ArrowLeft size={16} /> Back to Accommodations
          </Link>
        </div>

        {/* Room Header Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">{room.category}</span>
              <span className="badge badge-gold">Suite #{room.roomNumber}</span>
              {room.status === 'available' ? (
                <span className="badge badge-success">Available for Booking</span>
              ) : (
                <span className="badge badge-warning">Currently Reserved</span>
              )}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>
              {room.name}
            </h1>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FBBF24', lineHeight: 1 }}>
              ${room.pricePerNight}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              per night • plus taxes & fees
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            height: '480px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-medium)',
          }}>
            <img
              src={room.images[selectedImage] || room.images[0]}
              alt={room.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {room.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '120px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: selectedImage === idx ? '#8B5CF6' : 'transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                    padding: 0,
                    background: 'transparent',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Layout: Details (Left) + Booking Sticky Widget (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)',
          gap: '48px',
          alignItems: 'flex-start',
        }} className="details-grid-layout">
          {/* Left Column: Description, Amenities, Specs */}
          <div>
            {/* Quick Specs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              padding: '24px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '36px',
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capacity</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={18} color="#8B5CF6" /> Up to {room.capacity} Guests
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Crown size={18} color="#F59E0B" /> {room.category}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: room.status === 'available' ? '#10B981' : '#F59E0B' }}>
                  ● {room.status === 'available' ? 'Available' : 'Reserved'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Suite Description</h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
              }}>
                {room.description}
              </p>
            </div>

            {/* Amenities List */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Exclusive Suite Amenities</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '14px',
              }}>
                {room.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <CheckCircle2 size={16} color="#8B5CF6" style={{ flexShrink: 0 }} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Reviews Section */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '40px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Verified Guest Feedback</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{room.averageRating}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      ({room.reviewCount} {room.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {room.reviews && room.reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                  {room.reviews.map((rev) => (
                    <div key={rev._id} className="card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ fontWeight: 600 }}>{rev.user?.name || 'Verified Guest'}</div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(rev.rating)].map((_, starI) => (
                            <Star key={starI} size={14} fill="#F59E0B" color="#F59E0B" />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        "{rev.comment}"
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                  Be the first to share your experience staying in this suite.
                </p>
              )}

              {/* Add a Review Form */}
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} color="#8B5CF6" /> Leave a Review
                </h3>

                {reviewMessage && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '16px',
                    background: reviewMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: reviewMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: reviewMessage.type === 'success' ? '#34D399' : '#FB7185',
                    fontSize: '0.9rem',
                  }}>
                    {reviewMessage.text}
                  </div>
                )}

                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setReviewRating(starVal)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Star
                              size={24}
                              fill={starVal <= reviewRating ? '#F59E0B' : 'transparent'}
                              color="#F59E0B"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Review Experience</label>
                      <textarea
                        className="form-textarea"
                        rows="3"
                        placeholder="Tell future guests about your stay, room comfort, hospitality..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting || !reviewComment.trim()}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Send size={14} /> Submit Feedback
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px' }}>
                      Please sign in to your guest account to write a verified review.
                    </p>
                    <Link to="/login" className="btn btn-secondary btn-sm">
                      Sign In to Review
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Reservation Calculator */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="card" style={{
              background: '#121A2C',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: 'var(--shadow-lg), 0 0 35px rgba(139, 92, 246, 0.15)',
              padding: '32px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '20px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '16px',
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24' }}>
                  ${room.pricePerNight}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>per night</div>
              </div>

              {/* Date pickers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#8B5CF6" /> Check-In Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#8B5CF6" /> Check-Out Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="#8B5CF6" /> Number of Guests
                  </label>
                  <select
                    className="form-select"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Price Breakdown */}
              {pricing.nights > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      ${room.pricePerNight} × {pricing.nights} {pricing.nights === 1 ? 'night' : 'nights'}
                    </span>
                    <span>${pricing.roomTotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Hospitality & Luxury Tax (12%)</span>
                    <span>${pricing.taxes}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}>
                    <span>Estimated Total</span>
                    <span style={{ color: '#FBBF24' }}>${pricing.total}</span>
                  </div>
                </div>
              )}

              {/* Instant Book Button */}
              <button
                onClick={handleProceedBooking}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
              >
                <Sparkles size={18} /> Reserve This Suite
              </button>

              <div style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}>
                <ShieldCheck size={14} color="#10B981" /> No immediate charge • Instant Demo Simulation
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .details-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RoomDetails;
