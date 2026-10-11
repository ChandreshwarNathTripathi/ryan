import React, { useState, useEffect } from "react";
import PureSvgAreaChart from "./PureSvgAreaChart";
import PureSvgBarChart from "./PureSvgBarChart";

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, analyticsRes] = await Promise.all([
        fetch("http://localhost:5001/api/admin/stats", {
          headers: { "x-admin-role": "warden" },
        }),
        fetch("http://localhost:5001/api/admin/analytics", {
          headers: { "x-admin-role": "warden" },
        }),
      ]);

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();

      if (!statsRes.ok) throw new Error(statsData.message || "Failed to fetch stats");
      if (!analyticsRes.ok) throw new Error(analyticsData.message || "Failed to fetch analytics");

      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading Chief Warden operations console...</div>;
  }

  return (
    <div className="admin-overview-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>Operations Overview & Visual Analytics</h1>
          <p>Real-time campus accommodation status, bursar inflow & bed occupancy ledger</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={fetchDashboardData}>
          🔄 Refresh Metrics
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Top Metric Cards */}
      <div className="admin-metric-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Campus Beds</span>
            <span className="metric-icon">🛏️</span>
          </div>
          <div className="metric-number">{stats?.totalBeds || 0}</div>
          <span className="metric-subtext">Across {stats?.totalRooms || 0} dorm rooms</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Occupancy Rate</span>
            <span className="metric-icon">📈</span>
          </div>
          <div className="metric-number highlight-accent">{stats?.occupancyRate || 0}%</div>
          <span className="metric-subtext">
            {stats?.occupiedBeds || 0} Occupied • {stats?.vacantBeds || 0} Vacant
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Resident Students</span>
            <span className="metric-icon">🎓</span>
          </div>
          <div className="metric-number highlight-green">{stats?.activeStudents || 0}</div>
          <span className="metric-subtext">Verified enrolled residents</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Semester Fees Collected</span>
            <span className="metric-icon">₹</span>
          </div>
          <div className="metric-number">₹{(stats?.totalRevenue || 0).toLocaleString()}</div>
          <span className="metric-subtext">Bursar verified receipts</span>
        </div>
      </div>

      {/* Analytics Chart 1: Pure SVG Area Chart */}
      <div className="admin-chart-card">
        <div className="chart-header">
          <div>
            <h3>6-Month Fee Collections & Bursar Inflow</h3>
            <p>Aggregated semester accommodation & mess plan deposits (Pure SVG Visualization)</p>
          </div>
        </div>
        <PureSvgAreaChart data={analytics?.monthlyRevenue || []} />
      </div>

      {/* Analytics Chart 2: Pure SVG Comparative Bar Chart */}
      <div className="admin-chart-card">
        <div className="chart-header">
          <div>
            <h3>Hostel Block Capacity & Bed Utilization</h3>
            <p>Live bed capacity vs active residents across campus residential wings</p>
          </div>
        </div>
        <PureSvgBarChart data={analytics?.blockStats || []} />
      </div>
    </div>
  );
}

export default AdminOverview;
