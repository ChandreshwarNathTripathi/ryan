import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Compass, Home, BedDouble } from 'lucide-react';

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
          404 Error • Page Not Found
        </span>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Hostel Page Not Found</h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          The dormitory hall, room record, or portal page you are looking for does not exist or has been relocated by the warden office.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/rooms" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={16} /> Explore Hostel Dorms
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
