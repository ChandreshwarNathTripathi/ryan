import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    hostelName: 'XSHostel Campus Residencies',
    tagline: 'Smart Hostel Living, Built for Academic Success',
    wardenEmail: 'warden@xshostel.com',
    wardenHelpline: '+1 (800) 467-8350',
    campusAddress: 'University Campus Avenue, East Academic Wing, Campus Gate 3',
    curfewTime: '22:00',
    gateOpenTime: '06:00',
    cautionDeposit: '100',
    standardMessFee: '200',
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
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Hostel Policies & Curfew Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage global campus hostel identity, curfew gate timings, mess fee standards, and student deposits.
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
          <span>Hostel settings updated and broadcasted across all residential blocks (A, B, C).</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '36px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={20} color="#8B5CF6" /> Campus Identity & Warden Office Contacts
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Hostel System Name</label>
            <input
              type="text"
              className="form-input"
              value={settings.hostelName}
              onChange={(e) => setSettings({ ...settings, hostelName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Campus Motto</label>
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
            <label className="form-label">Chief Warden Email</label>
            <input
              type="email"
              className="form-input"
              value={settings.wardenEmail}
              onChange={(e) => setSettings({ ...settings, wardenEmail: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Warden Emergency Helpline</label>
            <input
              type="text"
              className="form-input"
              value={settings.wardenHelpline}
              onChange={(e) => setSettings({ ...settings, wardenHelpline: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Campus Premises & Gate Location</label>
          <input
            type="text"
            className="form-input"
            value={settings.campusAddress}
            onChange={(e) => setSettings({ ...settings, campusAddress: e.target.value })}
            required
          />
        </div>

        <h2 style={{ fontSize: '1.25rem', marginTop: '32px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={20} color="#8B5CF6" /> Curfew Timings & Standard Semester Dues
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Night Curfew (Biometrics)</label>
            <input
              type="time"
              className="form-input"
              value={settings.curfewTime}
              onChange={(e) => setSettings({ ...settings, curfewTime: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Morning Gate Open</label>
            <input
              type="time"
              className="form-input"
              value={settings.gateOpenTime}
              onChange={(e) => setSettings({ ...settings, gateOpenTime: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Caution Deposit ($)</label>
            <input
              type="number"
              className="form-input"
              value={settings.cautionDeposit}
              onChange={(e) => setSettings({ ...settings, cautionDeposit: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mess Plan Fee ($)</label>
            <input
              type="number"
              className="form-input"
              value={settings.standardMessFee}
              onChange={(e) => setSettings({ ...settings, standardMessFee: e.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> Save Hostel Policies
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
