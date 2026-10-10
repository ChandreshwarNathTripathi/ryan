import React from 'react';
import { Link } from '../router';
import { Building2, Mail, Phone, MapPin, ShieldCheck, Clock } from './Icons';

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
                <Building2 size={20} color="#FFFFFF" />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#FFFFFF',
              }}>
                XSH<span style={{ color: '#8B5CF6' }}>OSTEL</span>
              </span>
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}>
              Premier campus student residences. Combining dedicated study stations, 1Gbps high-speed Wi-Fi, hygienic dining mess facilities, and 24/7 biometric safety for collegiate excellence.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-gold">
                <ShieldCheck size={12} /> Campus Certified
              </span>
              <span className="badge badge-primary">
                <Clock size={12} /> 24/7 Warden Security
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '18px', fontWeight: 600 }}>
              Hostel Blocks & Wings
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/rooms?block=Block%20A%20(Boys)" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Block A (Boys Residence)</Link></li>
              <li><Link to="/rooms?block=Block%20B%20(Girls)" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Block B (Girls Residence)</Link></li>
              <li><Link to="/rooms?block=Block%20C%20(Scholars%20Wing)" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Block C (Scholars & PG Wing)</Link></li>
              <li><Link to="/rooms?category=Single%20Room" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Single Scholar Rooms</Link></li>
              <li><Link to="/rooms?category=Double%20Sharing" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Double Sharing Study Dorms</Link></li>
            </ul>
          </div>

          {/* Warden Office Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '18px', fontWeight: 600 }}>
              Warden & Support Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={18} color="#8B5CF6" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Hostel Administration Building, Central Campus Quad</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={18} color="#8B5CF6" style={{ flexShrink: 0 }} />
                <span>+1 (800) 467-8350 (24/7 Warden Helpline)</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={18} color="#8B5CF6" style={{ flexShrink: 0 }} />
                <span>warden@xshostel.com</span>
              </div>
            </div>
          </div>

          {/* Academic Capstone Project */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '18px', fontWeight: 600 }}>
              College Capstone System
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '12px' }}>
              Full-Stack Hostel Management System designed and delivered by <strong>Syed Rayyan (Team Leader)</strong> and four-member team.
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
              <div>Modules: <strong>Room CRUD, Allocations, Mess, RBAC</strong></div>
              <div style={{ color: '#C4B5FD', marginTop: '4px' }}>Demo System Ready for College Submission</div>
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
            © {new Date().getFullYear()} XSHostel Campus Living Systems. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Hostel Rules & Curfew</span>
            <span>Mess Menu Charter</span>
            <span>Anti-Ragging Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
