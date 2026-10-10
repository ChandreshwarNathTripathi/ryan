import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomService, reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  BedDouble,
  Building2,
  ShieldCheck,
  Star,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  Send,
  AlertCircle,
  UtensilsCrossed,
} from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Allocation Widget State
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [semester, setSemester] = useState('Fall 2026');
  const [messPlan, setMessPlan] = useState('Standard 4-Meal Plan');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await roomService.getRoomById(id);
        if (res.data?.success) {
          setRoom(res.data.data);
        }
      } catch (err) {
        setError(err.friendlyMessage || 'Unable to load hostel dorm details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleProceedBooking = () => {
    navigate(
      `/booking?roomId=${room._id}&academicYear=${encodeURIComponent(academicYear)}&semester=${encodeURIComponent(semester)}&messPlan=${encodeURIComponent(messPlan)}`
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
        setReviewMessage({ type: 'success', text: 'Thank you! Your resident review has been submitted.' });
        setReviewComment('');
        // Refresh room details
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
        <h2 style={{ marginBottom: '16px', color: '#FB7185' }}>Hostel Dorm Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {error || 'The requested hostel room could not be located.'}
        </p>
        <Link to="/rooms" className="btn btn-secondary">
          <ArrowLeft size={16} /> Return to Dorms Catalog
        </Link>
      </div>
    );
  }

  const availableBeds = (room.capacity || 1) - (room.occupiedBeds || 0);
  const cautionDeposit = 100;
  const messAddon = messPlan === 'Standard 4-Meal Plan' ? 200 : messPlan === 'Special Diet / Non-Veg' ? 300 : 0;
  const totalEstimated = room.pricePerNight + messAddon + cautionDeposit;

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
            <ArrowLeft size={16} /> Back to Hostel Dorms
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{room.block || 'Hostel Block'}</span>
              <span className="badge badge-gold">Room #{room.roomNumber}</span>
              <span className="badge badge-secondary">{room.gender || 'Wing'}</span>
              {availableBeds > 0 ? (
                <span className="badge badge-success">{availableBeds} of {room.capacity} Bed(s) Available</span>
              ) : (
                <span className="badge badge-danger">Fully Occupied</span>
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
              per semester fee • includes utilities & Wi-Fi
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            height: '460px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-medium)',
          }}>
            <img
              src={room.images?.[selectedImage] || room.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'}
              alt={room.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {room.images && room.images.length > 1 && (
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

        {/* Content Layout: Details (Left) + Allocation Sticky Widget (Right) */}
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
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hostel Block</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={18} color="#8B5CF6" /> {room.block || 'Block A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bed Capacity</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={18} color="#F59E0B" /> {room.capacity} Beds ({room.occupiedBeds || 0} Occupied)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Floor Level</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  Floor {room.floor || 1}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gender Wing</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#C4B5FD' }}>
                  {room.gender || 'Co-ed'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Dormitory Description</h2>
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
              <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Hostel Room & Hall Facilities</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '14px',
              }}>
                {room.amenities?.map((amenity, idx) => (
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

            {/* Resident Reviews Section */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '40px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Resident Student Feedback</h2>
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
                        <div style={{ fontWeight: 600 }}>{rev.user?.name || 'Resident Student'}</div>
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
                  No resident reviews posted yet for this room.
                </p>
              )}

              {/* Add a Review Form */}
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} color="#8B5CF6" /> Leave Resident Feedback
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
                      <label className="form-label">Rating</label>
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
                      <label className="form-label">Review Comment</label>
                      <textarea
                        className="form-textarea"
                        rows="3"
                        placeholder="Tell fellow residents about study comfort, room ventilation, warden support..."
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
                      Please sign in as a resident student to write feedback.
                    </p>
                    <Link to="/login" className="btn btn-secondary btn-sm">
                      Sign In to Review
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Bed Allocation Widget */}
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
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>per semester</div>
              </div>

              {/* Form Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#8B5CF6" /> Academic Year
                  </label>
                  <select
                    className="form-select"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                  >
                    <option value="2026-2027">2026 - 2027</option>
                    <option value="2027-2028">2027 - 2028</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#8B5CF6" /> Semester Session
                  </label>
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

                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UtensilsCrossed size={14} color="#8B5CF6" /> Mess Plan Subscription
                  </label>
                  <select
                    className="form-select"
                    value={messPlan}
                    onChange={(e) => setMessPlan(e.target.value)}
                  >
                    <option value="Standard 4-Meal Plan">Standard 4-Meal Buffet (+$200)</option>
                    <option value="Special Diet / Non-Veg">Special Diet & Non-Veg (+$300)</option>
                    <option value="No Mess Plan">Room Only (Self Managed)</option>
                  </select>
                </div>
              </div>

              {/* Live Fee Breakdown */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Hostel Semester Room Fee</span>
                  <span>${room.pricePerNight}</span>
                </div>
                {messAddon > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Mess Plan Addon</span>
                    <span>${messAddon}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Caution Deposit (Refundable)</span>
                  <span>${cautionDeposit}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}>
                  <span>Total Due</span>
                  <span style={{ color: '#FBBF24' }}>${totalEstimated}</span>
                </div>
              </div>

              {/* Action Button */}
              {availableBeds > 0 ? (
                <button
                  onClick={handleProceedBooking}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
                >
                  <Sparkles size={18} /> Apply for Bed Allocation
                </button>
              ) : (
                <button
                  disabled
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '16px', fontSize: '1rem', cursor: 'not-allowed', opacity: 0.6 }}
                >
                  Dormitory Fully Allocated
                </button>
              )}

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
                <ShieldCheck size={14} color="#10B981" /> Verified Campus Warden Allocation Workflow
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
