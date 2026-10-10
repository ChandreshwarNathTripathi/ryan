import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roomService, reviewService } from '../services/api';
import {
  Sparkles,
  Calendar,
  Users,
  Search,
  Star,
  ShieldCheck,
  Coffee,
  Waves,
  UtensilsCrossed,
  Sparkle,
  ArrowRight,
  CheckCircle2,
  Crown,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Search Bar Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    // Set default check-in tomorrow, check-out in 4 days
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const future = new Date();
    future.setDate(future.getDate() + 4);

    setCheckIn(tomorrow.toISOString().split('T')[0]);
    setCheckOut(future.toISOString().split('T')[0]);

    const fetchHomeData = async () => {
      try {
        const [roomsRes, reviewsRes] = await Promise.all([
          roomService.getRooms({ featured: 'true', limit: 4 }),
          reviewService.getReviews({ limit: 3 }),
        ]);

        if (roomsRes.data?.success) {
          setFeaturedRooms(roomsRes.data.data);
        }
        if (reviewsRes.data?.success) {
          setTestimonials(reviewsRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (category && category !== 'All') queryParams.append('category', category);
    if (guests) queryParams.append('capacity', guests);
    navigate(`/rooms?${queryParams.toString()}`);
  };

  const amenitiesList = [
    {
      icon: Waves,
      title: 'Oceanfront Infinity Pools',
      desc: 'Heated saltwater pools offering uninterrupted sunset horizons and VIP poolside cabanas.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Michelin-Starred Dining',
      desc: 'Three signature restaurants curated by world-renowned executive chefs with wine pairings.',
    },
    {
      icon: Sparkle,
      title: 'Holistic Sanctuary & Spa',
      desc: 'Deep restorative hydrotherapy, Himalayan salt sauna, and bespoke botanical rituals.',
    },
    {
      icon: Crown,
      title: '24/7 Dedicated Butler Service',
      desc: 'Impeccable personal concierge catering to packing, private dining, and excursion planning.',
    },
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(rgba(9, 13, 22, 0.65), rgba(9, 13, 22, 0.95)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1000px', zIndex: 2 }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
              <Crown size={14} /> The Ultimate Sanctuary of Luxury
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
            fontWeight: 800,
            marginBottom: '20px',
            lineHeight: 1.15,
          }}>
            Luxury Stays, <span className="text-gradient">Unforgettable Experiences</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 40px auto',
            lineHeight: 1.6,
          }}>
            Immerse yourself in world-class architecture, bespoke concierge service, and breathtaking coastal horizons. Your private escape awaits.
          </p>

          {/* Availability Search Bar Widget */}
          <div className="glass-panel" style={{
            padding: '24px',
            boxShadow: 'var(--shadow-lg), 0 0 30px rgba(139, 92, 246, 0.2)',
            textAlign: 'left',
          }}>
            <form onSubmit={handleSearchSubmit} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              alignItems: 'flex-end',
            }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#8B5CF6" /> Check-In Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
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
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} color="#8B5CF6" /> Guests
                </label>
                <select
                  className="form-select"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6+ Guests (Villa)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All Suites & Villas</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                  <option value="Ocean Villa">Ocean Villa</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Deluxe">Deluxe King</option>
                  <option value="Family Suite">Family Villa</option>
                </select>
              </div>

              <div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }}>
                  <Search size={18} /> Check Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Hotel Story & Core Highlights */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '14px' }}>
                Unrivaled Excellence
              </span>
              <h2 style={{ fontSize: '2.4rem', marginBottom: '20px', lineHeight: 1.2 }}>
                Crafted for Discerning Connoisseurs of Travel
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.05rem' }}>
                XShotel stands as an architectural triumph situated in an exclusive private peninsula. From hand-crafted Italian marble finishes to customized room climate profiles, every nuance of your visit is flawlessly curated.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C4B5FD' }}>98.6%</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Guest Satisfaction</div>
                </div>
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24' }}>5-Star</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Luxury Hospitality Rating</div>
                </div>
              </div>

              <Link to="/rooms" className="btn btn-outline-primary">
                Explore All Suites <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury resort aerial"
                style={{
                  width: '100%',
                  height: '440px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-medium)',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
                background: 'rgba(13, 19, 34, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '16px 24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <Crown size={28} color="#F59E0B" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>World Luxury Hotel Award</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Best Oceanfront Resort 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Rooms Showcase */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
                Signature Collections
              </span>
              <h2 style={{ fontSize: '2.4rem' }}>Featured Luxury Suites</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                Handpicked suites offering panoramic views, bespoke appointments, and unprecedented comfort.
              </p>
            </div>
            <Link to="/rooms" className="btn btn-secondary">
              View All Accommodations <ArrowRight size={16} />
            </Link>
          </div>

          {loadingRooms ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
            }}>
              {featuredRooms.map((room) => (
                <div key={room._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      display: 'flex',
                      gap: '8px',
                    }}>
                      <span className="badge badge-primary">{room.category}</span>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      background: 'rgba(9, 13, 22, 0.85)',
                      backdropFilter: 'blur(8px)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#FBBF24',
                    }}>
                      ${room.pricePerNight} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ night</span>
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{room.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{room.roomNumber}</span>
                    </div>

                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {room.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '20px',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '12px',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} color="#8B5CF6" /> Up to {room.capacity} Guests
                      </span>
                      <span>•</span>
                      <span>{room.amenities[0] || 'Luxury King Bed'}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <Link to={`/rooms/${room._id}`} className="btn btn-secondary btn-sm">
                        Details
                      </Link>
                      <Link to={`/booking?roomId=${room._id}`} className="btn btn-primary btn-sm">
                        Reserve Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Luxury Amenities Showcase */}
      <section id="amenities" style={{ padding: '80px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
              Curated Indulgence
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>World-Class Resort Amenities</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              From Michelin-caliber gastronomical journeys to serene infinity pools, everything is designed for pure tranquility.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {amenitiesList.map((amenity, idx) => {
              const Icon = amenity.icon;
              return (
                <div key={idx} className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(139, 92, 246, 0.12)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                  }}>
                    <Icon size={28} color="#C4B5FD" />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{amenity.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {amenity.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Guest Testimonials */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px auto' }}>
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
              Guest Impressions
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>What Our Guests Say</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Real experiences from guests who made XShotel their premier destination of choice.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
          }}>
            {testimonials.map((review, i) => (
              <div key={review._id || i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(review.rating || 5)].map((_, starIdx) => (
                    <Star key={starIdx} size={18} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                  flex: 1,
                }}>
                  "{review.comment}"
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}>
                    {review.user?.name ? review.user.name.charAt(0) : 'G'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {review.user?.name || 'Verified Luxury Guest'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Stayed in {review.room?.name || 'Grand Suite'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #161F35 0%, #0F172A 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg), 0 0 50px rgba(139, 92, 246, 0.15)',
          }}>
            <Crown size={36} color="#F59E0B" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Reserve Your Extraordinary Stay</h2>
            <p style={{
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              fontSize: '1.05rem',
            }}>
              Discover bespoke packages, exclusive chef-table dining reservations, and complimentary airport chauffeur services today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/rooms" className="btn btn-primary btn-lg">
                Browse Suites & Villas
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Guest Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
