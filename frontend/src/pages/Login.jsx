import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from '../router';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield, User } from '../components/Icons';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofillWarden = () => {
    setEmail('admin@xshostel.com');
    setPassword('Admin@123');
    setError(null);
  };

  const autofillStudent = () => {
    setEmail('student@xshostel.com');
    setPassword('Student@123');
    setError(null);
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className="card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '40px 32px',
        boxShadow: 'var(--shadow-lg), 0 0 40px rgba(139, 92, 246, 0.15)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
      }}>
        {/* Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
          }}>
            <Building2 size={26} color="#FFFFFF" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome to XSHostel</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Sign in to manage your room allocation, mess subscription, and residential life.
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
            QUICK DEMO ONE-CLICK CREDENTIALS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={autofillWarden}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Shield size={14} color="#8B5CF6" /> Chief Warden
            </button>
            <button
              type="button"
              onClick={autofillStudent}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <User size={14} color="#10B981" /> Student Demo
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#FB7185',
            fontSize: '0.875rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#8B5CF6" /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. student@xshostel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} color="#8B5CF6" /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', marginTop: '8px' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }} />
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Sign In to Hostel Portal <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
        }}>
          New resident student?{' '}
          <Link to="/register" style={{ color: '#8B5CF6', fontWeight: 600 }}>
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
