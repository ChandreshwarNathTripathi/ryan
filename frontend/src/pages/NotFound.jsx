import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Compass, Home, BedDouble } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div className="card" style={{ maxWidth: '540px', padding: '60px 40px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
        }}>
          <Compass size={36} color="#C4B5FD" />
        </div>

        <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
          404 Error • Page Uncharted
        </span>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Sanctuary Not Found</h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          The luxury experience or suite wing you are seeking has either moved or ceased to exist in our active directory.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/rooms" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BedDouble size={16} /> Explore Suites
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
