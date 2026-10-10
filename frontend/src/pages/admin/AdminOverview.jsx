import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, bookingService } from '../../services/api';
import {
  BedDouble,
  CalendarCheck2,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

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
      setError(err.friendlyMessage || 'Failed to load dashboard metrics.');
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
      alert(err.friendlyMessage || 'Failed to update booking status.');
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
      label: 'Total Revenue',
      value: `$${stats?.financials?.totalRevenue?.toLocaleString() || 0}`,
      sub: 'From verified bookings',
      icon: DollarSign,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.15)',
    },
    {
      label: 'Total Bookings',
      value: stats?.bookings?.total || 0,
      sub: `${stats?.bookings?.confirmed || 0} Confirmed • ${stats?.bookings?.pending || 0} Pending`,
      icon: CalendarCheck2,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.15)',
    },
    {
      label: 'Room Inventory',
      value: `${stats?.rooms?.available || 0} / ${stats?.rooms?.total || 0}`,
      sub: 'Suites available now',
      icon: BedDouble,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      label: 'Registered Guests',
      value: stats?.users?.total || 0,
      sub: 'Active user accounts',
      icon: Users,
      color: '#38BDF8',
      bgColor: 'rgba(56, 189, 248, 0.15)',
    },
  ];

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Executive Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time hospitality operations, revenue flow, and reservation logistics.
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
        {/* Monthly Revenue Trend */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Revenue Analytics (Last 6 Months)</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aggregated revenue from simulated bookings</p>
            </div>
            <span className="badge badge-primary"><TrendingUp size={12} /> Revenue Flow</span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                  }}
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Category Distribution */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Suites by Category</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Inventory counts per suite category</p>
            </div>
            <span className="badge badge-gold"><BedDouble size={12} /> Inventory</span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.roomCategories || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} interval={0} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                  }}
                  formatter={(val) => [`${val} Suites`, 'Inventory']}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Reservations</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest guest bookings submitted across all wings</p>
          </div>
          <Link to="/admin/bookings" className="btn btn-secondary btn-sm">
            View All Reservations <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Guest</th>
                <th>Suite</th>
                <th>Check-In / Out</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Quick Action</th>
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
                      <div style={{ fontWeight: 600 }}>{b.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                    </td>
                    <td>
                      <div>{b.room?.name || 'Suite'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{b.room?.roomNumber}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.numberOfNights} nights</div>
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
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={b.status}
                        onChange={(e) => handleQuickStatusChange(b._id, e.target.value)}
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No recent bookings found.
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
