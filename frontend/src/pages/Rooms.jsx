import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { roomService } from '../services/api';
import {
  Search,
  Filter,
  Users,
  Sparkles,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  ShieldCheck,
} from 'lucide-react';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and sort state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [capacity, setCapacity] = useState(searchParams.get('capacity') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categories = [
    'All',
    'Presidential Suite',
    'Ocean Villa',
    'Executive Suite',
    'Deluxe',
    'Family Suite',
    'Standard',
  ];

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 9,
        sort,
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (capacity) params.capacity = capacity;

      const res = await roomService.getRooms(params);
      if (res.data?.success) {
        setRooms(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to load rooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [category, sort, capacity, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRooms();
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 40px auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            Accommodations
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '16px' }}>
            Suites & Private Villas
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Every accommodation at XShotel reflects refined architectural design, high-touch luxury amenities, and sweeping panoramic views.
          </p>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
          <form onSubmit={handleSearchSubmit} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'flex-end',
          }}>
            {/* Search Input */}
            <div style={{ gridColumn: 'span 2' }} className="search-field-span">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={14} color="#8B5CF6" /> Search by Suite Name or Feature
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ocean, Penthouse, Jacuzzi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Guest Capacity Filter */}
            <div>
              <label className="form-label">Minimum Guests</label>
              <select
                className="form-select"
                value={capacity}
                onChange={(e) => {
                  setCapacity(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Any Capacity</option>
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
                <option value="6">6+ Guests (Villas)</option>
              </select>
            </div>

            {/* Price / Ordering Sort */}
            <div>
              <label className="form-label">Sort Order</label>
              <select
                className="form-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="newest">Featured & Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="capacity_desc">Capacity: Largest First</option>
              </select>
            </div>

            <div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }}>
                <Search size={18} /> Search Suites
              </button>
            </div>
          </form>

          {/* Category Chips Bar */}
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingTop: '20px',
            marginTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: '1px solid',
                  background: category === cat ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: category === cat ? '#8B5CF6' : 'rgba(255, 255, 255, 0.1)',
                  color: category === cat ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
        }}>
          <div>
            Showing <strong style={{ color: '#FFFFFF' }}>{rooms.length}</strong> of{' '}
            <strong style={{ color: '#FFFFFF' }}>{totalCount}</strong> luxury suites
          </div>
          {category !== 'All' && (
            <span className="badge badge-primary">Filtered by: {category}</span>
          )}
        </div>

        {/* Room Catalog Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner" />
          </div>
        ) : error ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            color: '#FB7185',
          }}>
            {error}
          </div>
        ) : rooms.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <BedDouble size={48} color="#8B5CF6" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No suites match your search</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 24px auto' }}>
              We could not find suites matching your selected criteria. Try adjusting your guest capacity, category, or search keywords.
            </p>
            <button
              onClick={() => {
                setCategory('All');
                setSearch('');
                setCapacity('');
              }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '30px',
          }}>
            {rooms.map((room) => (
              <div key={room._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Photo & Badges */}
                <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
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
                    {room.featured && <span className="badge badge-gold">Featured</span>}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    background: 'rgba(9, 13, 22, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#FBBF24',
                  }}>
                    ${room.pricePerNight} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ night</span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{room.name}</h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{room.roomNumber}</span>
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {room.description}
                  </p>

                  {/* Amenities Badges */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '18px',
                  }}>
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                    marginBottom: '18px',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={16} color="#8B5CF6" /> Up to {room.capacity} Guests
                    </span>
                    <span style={{ color: room.status === 'available' ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
                      ● {room.status === 'available' ? 'Available' : 'Booked'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px' }}>
                    <Link to={`/rooms/${room._id}`} className="btn btn-secondary">
                      Suite Details
                    </Link>
                    <Link to={`/booking?roomId=${room._id}`} className="btn btn-primary">
                      Reserve Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '48px',
          }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: page === i + 1 ? '#8B5CF6' : 'rgba(255, 255, 255, 0.1)',
                  background: page === i + 1 ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'rgba(255, 255, 255, 0.05)',
                  color: page === i + 1 ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .search-field-span {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Rooms;
