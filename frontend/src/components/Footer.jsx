import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Compass, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#070A12',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '64px',
      paddingBottom: '32px',
      marginTop: '80px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand & Narrative */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Crown size={20} color="#FFFFFF" />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#FFFFFF',
              }}>
                XSH<span style={{ color: '#8B5CF6' }}>OTEL</span>
              </span>
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}>
              Where architectural grandeur converges with uncompromising hospitality.
              Indulge in bespoke luxury, world-renowned culinary excellence, and rejuvenating oceanfront tranquility.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-gold">
                <Crown size={12} /> 5-Star Luxury Certified
              </span>
              <span className="badge badge-primary">
                <ShieldCheck size={12} /> Secure Booking
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '18px', fontWeight: 600 }}>
              Discover Suites
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/rooms?category=Presidential%20Suite" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Presidential Penthouse</Link></li>
              <li><Link to="/rooms?category=Ocean%20Villa" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Oceanfront Infinity Villas</Link></li>
              <li><Link to="/rooms?category=Executive%20Suite" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Executive Horizon Suites</Link></li>
              <li><Link to="/rooms?category=Deluxe" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Opulent Deluxe King</Link></li>
              <li><Link to="/rooms?category=Family%20Suite" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Prestige Family Residences</Link></li>
            </ul>
          </div>

          {/* Concierge & Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '18px', fontWeight: 600 }}>
              Private Concierge
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={18} color="#8B5CF6" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>100 Azure Bay Promenade, Grand Marina Peninsula</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={18} color="#8B5CF6" style={{ flexShrink: 0 }} />
                <span>+1 (800) 874-9000 (24/7 Butler Service)</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={18} color="#8B5CF6" style={{ flexShrink: 0 }} />
                <span>reservations@xshotel.com</span>
              </div>
            </div>
          </div>

          {/* College Project Credit */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '18px', fontWeight: 600 }}>
              Academic Project Info
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '12px' }}>
              Developed as a collegiate full-stack engineering capstone by <strong>Syed Rayyan (Team Leader)</strong> and four-member team.
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <div>Stack: <strong>React, Node, Express, MongoDB</strong></div>
              <div>Issue Tracking: <strong>10 GitHub Issues</strong></div>
              <div style={{ color: '#C4B5FD', marginTop: '4px' }}>Demo System Ready for Deployment</div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} XShotel Luxury Hospitality Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Guest Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
