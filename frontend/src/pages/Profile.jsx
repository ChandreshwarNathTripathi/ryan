import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { User, Phone, Mail, Lock, Shield, CheckCircle2, AlertCircle, Save, BookOpen, Users } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [course, setCourse] = useState(user?.course || '');
  const [guardianName, setGuardianName] = useState(user?.guardianName || '');
  const [guardianPhone, setGuardianPhone] = useState(user?.guardianPhone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        studentId: studentId.trim(),
        course: course.trim(),
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authService.updateProfile(payload);
      if (res.data?.success) {
        updateUser(res.data.data);
        setFeedback({ type: 'success', message: 'Hostel profile and guardian details updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.friendlyMessage || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
            Hostel Resident Directory
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Student & Resident Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Maintain your student credentials, academic registration, emergency contacts, and account security.
          </p>
        </div>

        {feedback && (
          <div style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: feedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: feedback.type === 'success' ? '#34D399' : '#FB7185',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
            fontSize: '0.9rem',
          }}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '36px' }}>
          {/* Identity Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            paddingBottom: '24px',
            marginBottom: '28px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-md)',
            }}>
              {user?.name ? user.name.charAt(0) : 'S'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span className={user?.role === 'admin' ? 'badge badge-primary' : 'badge badge-gold'}>
                  <Shield size={12} /> {user?.role === 'admin' ? 'CHIEF WARDEN' : 'STUDENT RESIDENT'}
                </span>
                {user?.studentId && (
                  <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                    ID: {user.studentId}
                  </span>
                )}
                {user?.course && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    • {user.course}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Readonly Email */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#8B5CF6" /> University Email (Permanent)
            </label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.65, cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Hostel allocations and biometric attendance notices are sent here.
            </span>
          </div>

          {/* Editable Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="#8B5CF6" /> Student Full Name
              </label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#8B5CF6" /> Student Mobile Phone
              </label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Academic Info: Student ID & Course */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} color="#8B5CF6" /> Student Roll / ID
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. STU-2026-089"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} color="#8B5CF6" /> Department / Degree
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. B.Tech Computer Science"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>
          </div>

          {/* Guardian / Emergency Contact */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} color="#8B5CF6" /> Parent / Guardian Emergency Contact
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Hostel wardens contact this number for night gate curfew alerts and medical emergencies.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Guardian Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Robert Smith"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Guardian Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. +1 555-0199"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Optional Password Update */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} color="#8B5CF6" /> Change Password (Optional)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Leave blank if you do not wish to update your login credentials.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Verify existing password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', marginTop: '16px' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }} />
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={16} /> Save Profile Changes
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
