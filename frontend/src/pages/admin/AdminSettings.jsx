import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Crown } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    hotelName: 'XShotel Luxury Stays & Villas',
    tagline: 'Luxury Stays, Unforgettable Experiences',
    conciergeEmail: 'reservations@xshotel.com',
    conciergePhone: '+1 (800) 874-9000',
    address: '100 Azure Bay Promenade, Grand Marina Peninsula',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    taxRate: '12',
    currency: 'USD ($)',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Hotel Configuration & Policies</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage global resort identity, check-in schedules, and pricing tax calculations.
        </p>
      </div>

      {saved && (
        <div style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34D399',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          fontSize: '0.9rem',
        }}>
          <CheckCircle2 size={18} />
          <span>Hotel settings updated and synchronized across all active resort wings.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '36px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={20} color="#F59E0B" /> Brand & Contact Credentials
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Resort & Hotel Name</label>
            <input
              type="text"
              className="form-input"
              value={settings.hotelName}
              onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Tagline</label>
            <input
              type="text"
              className="form-input"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Concierge Email</label>
            <input
              type="email"
              className="form-input"
              value={settings.conciergeEmail}
              onChange={(e) => setSettings({ ...settings, conciergeEmail: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Concierge Phone Line</label>
            <input
              type="text"
              className="form-input"
              value={settings.conciergePhone}
              onChange={(e) => setSettings({ ...settings, conciergePhone: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Property Location & Address</label>
          <input
            type="text"
            className="form-input"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            required
          />
        </div>

        <h2 style={{ fontSize: '1.25rem', marginTop: '32px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={20} color="#8B5CF6" /> Hospitality Operations & Financial Policies
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Check-In Time</label>
            <input
              type="time"
              className="form-input"
              value={settings.checkInTime}
              onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Check-Out Time</label>
            <input
              type="time"
              className="form-input"
              value={settings.checkOutTime}
              onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tax Rate (%)</label>
            <input
              type="number"
              className="form-input"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Currency</label>
            <input
              type="text"
              className="form-input"
              value={settings.currency}
              disabled
              style={{ opacity: 0.7 }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> Save Hotel Configuration
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
