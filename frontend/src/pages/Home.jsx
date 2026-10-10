import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roomService, reviewService } from '../services/api';
import {
  Building2,
  Calendar,
  Users,
  Search,
  Star,
  ShieldCheck,
  Coffee,
  Wifi,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Zap,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Search Bar Form State
  const [block, setBlock] = useState('All');
  const [category, setCategory] = useState('All');
  const [capacity, setCapacity] = useState('All');
  const [gender, setGender] = useState('All');

  useEffect(() => {
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
    if (block && block !== 'All') queryParams.append('block', block);
    if (category && category !== 'All') queryParams.append('category', category);
    if (capacity && capacity !== 'All') queryParams.append('capacity', capacity);
    if (gender && gender !== 'All') queryParams.append('gender', gender);
    navigate(`/rooms?${queryParams.toString()}`);
  };

  const amenitiesList = [
    {
      icon: Wifi,
      title: 'Gigabit Campus Wi-Fi',
      desc: 'High-speed dedicated optical fiber with coverage across dorms, study lounges, and common rooms.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Hygienic Mess & Dining',
      desc: 'Nutritious 4-meal daily dining plans with balanced diets, clean RO water, and weekend specials.',
    },
    {
      icon: ShieldCheck,
      title: '24/7 Biometric Security',
      desc: 'CCTV surveillance, automated biometric curfew attendance, and dedicated wardens on every floor.',
    },
    {
      icon: Zap,
      title: '100% Power Backup & Study Halls',
      desc: 'Uninterrupted power generator backups, quiet night study spaces, and solar water heaters.',
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
        background: 'linear-gradient(rgba(9, 13, 22, 0.72), rgba(9, 13, 22, 0.95)), url("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1050px', zIndex: 2 }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
              <Building2 size={14} /> Official Campus Student Residences
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
            fontWeight: 800,
            marginBottom: '20px',
            lineHeight: 1.15,
          }}>
            Smart Hostel Living, <span className="text-gradient">Built for Academic Success</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            margin: '0 auto 40px auto',
            lineHeight: 1.6,
          }}>
            Experience safe, modern hostel dormitories with instant bed allocation, biometric curfew check-in, 4-meal nutritious mess plans, and dedicated study facilities.
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
                  <Building2 size={14} color="#8B5CF6" /> Hostel Block
                </label>
                <select
                  className="form-select"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                >
                  <option value="All">All Blocks</option>
                  <option value="Block A (Boys)">Block A (Boys)</option>
                  <option value="Block B (Girls)">Block B (Girls)</option>
                  <option value="Block C (Scholars)">Block C (Scholars)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} color="#8B5CF6" /> Room Type
                </label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All Sharing Types</option>
                  <option value="Single Room">Single Private Room</option>
                  <option value="Double Sharing">Double Sharing (2 Beds)</option>
                  <option value="Triple Sharing">Triple Sharing (3 Beds)</option>
                  <option value="Four Bed Dorm">Four Bed Dormitory</option>
                </select>
              </div>

              <div>
                <label className="form-label">Gender Wing</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="All">All Wings</option>
                  <option value="Male">Male Residency</option>
                  <option value="Female">Female Residency</option>
                  <option value="Co-ed">Co-ed Scholars Wing</option>
                </select>
              </div>

              <div>
                <label className="form-label">Bed Capacity</label>
                <select
                  className="form-select"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                >
                  <option value="All">Any Beds</option>
                  <option value="1">1 Bed Room</option>
                  <option value="2">2 Beds Room</option>
                  <option value="3">3 Beds Room</option>
                  <option value="4">4 Beds Dorm</option>
                </select>
              </div>

              <div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }}>
                  <Search size={18} /> Search Dorms
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Hostel Story & Core Highlights */}
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
                Safe & Vibrant Community
              </span>
              <h2 style={{ fontSize: '2.4rem', marginBottom: '20px', lineHeight: 1.2 }}>
                Designed for Focus, Friendship & Wellbeing
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.05rem', lineHeight: 1.6 }}>
                XSHostel provides state-of-the-art campus accommodations for university students and research scholars. From biometric security protocols to ergonomic study desks and customized meal subscriptions, we ensure your residential life feels safe, organized, and truly like a second home.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C4B5FD' }}>500+</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Campus Beds Available</div>
                </div>
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24' }}>99.4%</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resident Parent Approval</div>
                </div>
              </div>

              <Link to="/rooms" className="btn btn-outline-primary">
                Explore Available Dorms <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
                alt="Modern hostel dorm room"
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
                <ShieldCheck size={28} color="#10B981" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>Chief Warden Verified</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Curfew, Biometrics & Emergency Protocol Ready</div>
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
                Featured Residencies
              </span>
              <h2 style={{ fontSize: '2.4rem' }}>Popular Hostel Dormitories</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                High-demand student rooms with verified bed spaces, study furniture, and attached baths.
              </p>
            </div>
            <Link to="/rooms" className="btn btn-secondary">
              View All Hostel Dorms <ArrowRight size={16} />
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
              {featuredRooms.map((room) => {
                const availableBeds = (room.capacity || 1) - (room.occupiedBeds || 0);
                return (
                  <div key={room._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                      <img
                        src={room.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
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
                        flexWrap: 'wrap',
                      }}>
                        <span className="badge badge-primary">{room.block || 'Hostel Block'}</span>
                        <span className="badge badge-secondary">{room.gender || 'Wing'}</span>
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
                        ${room.pricePerNight} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ semester</span>
                      </div>
                    </div>

                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{room.name}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Room #{room.roomNumber}</span>
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
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginBottom: '20px',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '12px',
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={14} color="#8B5CF6" /> {room.capacity} Beds Total
                        </span>
                        <span className={`badge ${availableBeds > 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                          {availableBeds > 0 ? `${availableBeds} Bed(s) Vacant` : 'Fully Allocated'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <Link to={`/rooms/${room._id}`} className="btn btn-secondary btn-sm">
                          View Details
                        </Link>
                        <Link
                          to={`/booking?roomId=${room._id}`}
                          className={`btn btn-sm ${availableBeds > 0 ? 'btn-primary' : 'btn-secondary disabled'}`}
                          style={{ pointerEvents: availableBeds > 0 ? 'auto' : 'none', opacity: availableBeds > 0 ? 1 : 0.6 }}
                        >
                          {availableBeds > 0 ? 'Apply Bed' : 'Full'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Campus Amenities Showcase */}
      <section id="amenities" style={{ padding: '80px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
              Student Facilities
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>Comprehensive Hostel Infrastructure</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Everything a collegiate scholar requires to thrive academically, maintain healthy habits, and enjoy campus life.
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

      {/* 5. Student Resident Feedback */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px auto' }}>
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
              Resident Testimonials
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>What Our Students Say</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Real reviews from resident scholars who live and study inside XSHostel halls.
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
                    {review.user?.name ? review.user.name.charAt(0) : 'S'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {review.user?.name || 'Resident Student'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Resident in {review.room?.name || 'Block A Dorm'}
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
            <Building2 size={36} color="#8B5CF6" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Apply For Your Hostel Allocation</h2>
            <p style={{
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: '0 auto 32px auto',
              fontSize: '1.05rem',
            }}>
              Join hundreds of fellow university students enjoying safe, high-speed, and well-managed residential living at XSHostel.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/rooms" className="btn btn-primary btn-lg">
                Browse Hostel Blocks & Dorms
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Register as New Student
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
