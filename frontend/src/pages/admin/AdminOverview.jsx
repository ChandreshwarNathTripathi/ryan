import React, { useState, useEffect } from 'react';
import { Link } from '../../router';
import { adminService, bookingService } from '../../services/api';
import {
  Building2,
  CalendarCheck2,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  BedDouble,
} from '../../components/Icons';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAnalytics(),
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (analyticsRes.data?.success) setAnalytics(analyticsRes.data.data);
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to load warden dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, { status: newStatus });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      alert(err.friendlyMessage || 'Failed to update allocation status.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-lg)',
        color: '#FB7185',
      }}>
        {error}
      </div>
    );
  }

  const kpis = [
    {
      label: 'Hostel Fee Collections',
      value: `$${stats?.financials?.totalRevenue?.toLocaleString() || 0}`,
      sub: 'From semester room & mess fees',
      icon: DollarSign,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.15)',
    },
    {
      label: 'Student Allocations',
      value: stats?.bookings?.total || 0,
      sub: `${stats?.bookings?.confirmed || 0} Active Residents • ${stats?.bookings?.pending || 0} Pending`,
      icon: CalendarCheck2,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.15)',
    },
    {
      label: 'Hostel Dorm Inventory',
      value: `${stats?.rooms?.available || 0} / ${stats?.rooms?.total || 0}`,
      sub: 'Dorms with vacant beds',
      icon: BedDouble,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      label: 'Registered Students',
      value: stats?.users?.total || 0,
      sub: 'Verified resident accounts',
      icon: Users,
      color: '#38BDF8',
      bgColor: 'rgba(56, 189, 248, 0.15)',
    },
  ];

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Chief Warden Operations Console</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time hostel occupancy, bed allocations, mess meal tracking, and fee collections across Blocks A, B, and C.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '36px',
      }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {kpi.label}
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: kpi.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} color={kpi.color} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '6px' }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts (Recharts) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '28px',
        marginBottom: '40px',
      }}>
        {/* Monthly Fee Collection Trend */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Hostel Fee Collections (Last 6 Months)</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aggregated revenue from semester room & mess dues</p>
            </div>
            <span className="badge badge-primary"><TrendingUp size={12} /> Fee Analytics</span>
          </div>

          <div style={{ width: '100%', height: '260px', position: 'relative' }}>
            {(!analytics?.monthlyRevenue || analytics.monthlyRevenue.length === 0) ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No revenue records available
              </div>
            ) : (() => {
              const data = analytics.monthlyRevenue;
              const maxRev = Math.max(...data.map(d => d.revenue), 1000);
              const points = data.map((d, i) => {
                const x = 40 + (i / Math.max(data.length - 1, 1)) * 420;
                const y = 210 - (d.revenue / maxRev) * 160;
                return { x, y, ...d };
              });
              const pathD = points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
              const areaD = `${pathD} L ${points[points.length - 1].x} 230 L ${points[0].x} 230 Z`;

              return (
                <svg viewBox="0 0 500 260" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="pureRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                    <line key={idx} x1="40" y1={230 - ratio * 180} x2="480" y2={230 - ratio * 180} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  ))}
                  <path d={areaD} fill="url(#pureRevGrad)" />
                  <path d={pathD} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {points.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="5" fill="#8B5CF6" stroke="#121A2D" strokeWidth="2" />
                      <text x={p.x} y="250" textAnchor="middle" fill="#94A3B8" fontSize="11">{p.month}</text>
                      <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">₹{(p.revenue / 1000).toFixed(0)}k</text>
                    </g>
                  ))}
                </svg>
              );
            })()}
          </div>
        </div>

        {/* Room Category Distribution */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Dorm Types & Sharing Categories</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room distribution across campus residential halls</p>
            </div>
            <span className="badge badge-gold"><Building2 size={12} /> Hall Inventory</span>
          </div>

          <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '16px', padding: '20px 10px 0' }}>
            {(!analytics?.roomCategories || analytics.roomCategories.length === 0) ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--text-muted)' }}>
                No category records available
              </div>
            ) : (() => {
              const maxCount = Math.max(...analytics.roomCategories.map(c => c.count), 1);
              return analytics.roomCategories.map((cat, idx) => {
                const heightPct = Math.max((cat.count / maxCount) * 100, 15);
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', marginBottom: '8px' }}>
                      {cat.count}
                    </span>
                    <div style={{
                      width: '100%',
                      maxWidth: '52px',
                      height: `${heightPct * 0.72}%`,
                      background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '10px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }} title={cat.name}>
                      {cat.name}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Recent Allocations Table */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Student Bed Allocations</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest bed allotment applications and warden approvals</p>
          </div>
          <Link to="/admin/bookings" className="btn btn-secondary btn-sm">
            View All Allocations <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Student Resident</th>
                <th>Hostel Dorm</th>
                <th>Academic Term</th>
                <th>Semester Fee</th>
                <th>Status</th>
                <th>Warden Action</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.recentBookings && analytics.recentBookings.length > 0 ? (
                analytics.recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#FBBF24' }}>{b.bookingReference}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.user?.name || 'Student'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                    </td>
                    <td>
                      <div>{b.room?.name || 'Dorm'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.room?.block} • #{b.room?.roomNumber}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {b.semester || 'Fall 2026'} ({b.academicYear || '2026-2027'})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.messPlan || '4-Meal Plan'}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>${b.totalAmount}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        b.status === 'confirmed' ? 'badge-success' :
                        b.status === 'pending' ? 'badge-warning' :
                        b.status === 'cancelled' ? 'badge-danger' : 'badge-neutral'
                      }`}>
                        {b.status === 'confirmed' ? 'Active' : b.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={b.status}
                        onChange={(e) => handleQuickStatusChange(b._id, e.target.value)}
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="confirmed">Confirm Allotment</option>
                        <option value="pending">Mark Pending</option>
                        <option value="cancelled">Vacate Bed</option>
                        <option value="completed">Complete Term</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No recent hostel bed allocations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
