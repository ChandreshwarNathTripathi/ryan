import React, { useState } from "react";

// ==============================================================================
// PureSvgAreaChart — Beginner-Friendly Pure SVG Line & Area Chart
// NO external libraries like Recharts or Chart.js are used.
// We use simple school math: (value / maximum) * height
// ==============================================================================
function PureSvgAreaChart({ data = [] }) {
  // Simple state to remember which point the user is hovering over
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // If there is no data, show a friendly empty message
  if (!data || data.length === 0) {
    return <div className="chart-empty">No revenue data available for the last 6 months.</div>;
  }

  // --- 1. SVG Canvas Dimensions ---
  const width = 800;        // Total width of the chart SVG
  const height = 300;       // Total height of the chart SVG
  const paddingLeft = 70;   // Left space for rupee labels
  const paddingRight = 30;  // Right border padding
  const paddingTop = 30;    // Top border padding
  const paddingBottom = 40; // Bottom space for month names

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // --- 2. Find the Maximum Revenue for Scaling ---
  let maxRevenue = 100000; // Default minimum scale
  for (let i = 0; i < data.length; i++) {
    if (data[i].revenue > maxRevenue) {
      maxRevenue = data[i].revenue;
    }
  }

  // Horizontal guide line values (0%, 25%, 50%, 75%, 100%)
  const yTicks = [
    0,
    maxRevenue * 0.25,
    maxRevenue * 0.5,
    maxRevenue * 0.75,
    maxRevenue,
  ];

  // --- 3. Calculate (X, Y) Position for Each Month ---
  // Simple arithmetic:
  // x = start + (index / totalSteps) * availableWidth
  // y = bottom - (revenue / maxRevenue) * availableHeight
  const points = [];
  const totalSteps = data.length > 1 ? data.length - 1 : 1;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const x = paddingLeft + (i / totalSteps) * chartWidth;
    const y = paddingTop + chartHeight - (item.revenue / maxRevenue) * chartHeight;

    points.push({
      month: item.month,
      revenue: item.revenue,
      allocations: item.allocations,
      x: x,
      y: y,
    });
  }

  // --- 4. Build the SVG Path String for the Line ---
  // In SVG:
  // "M x y" means "Move to this starting coordinate"
  // "L x y" means "Draw a straight line to this coordinate"
  let linePath = "";
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      linePath = `M ${points[i].x} ${points[i].y}`;
    } else {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  // Area Path: Connect the line down to the bottom axis and close back to start
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const bottomY = paddingTop + chartHeight;
  const areaPath = `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;

  return (
    <div className="svg-chart-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="pure-svg-chart"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Definition for smooth purple gradient underneath the line */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Draw horizontal grid lines & rupee amount labels */}
        {yTicks.map((tickValue, index) => {
          const y = paddingTop + chartHeight - (tickValue / maxRevenue) * chartHeight;
          return (
            <g key={index}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 12}
                y={y + 4}
                textAnchor="end"
                fill="#94A3B8"
                fontSize="11"
              >
                ₹{(tickValue / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* 1. Shaded Area Fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* 2. Top Connected Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Circular Points & Month Labels */}
        {points.map((pt, index) => (
          <g key={index}>
            {/* Month label below each column */}
            <text
              x={pt.x}
              y={height - 12}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="12"
            >
              {pt.month}
            </text>

            {/* Circular data point dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint === index ? 7 : 5}
              fill="#FFFFFF"
              stroke="#8B5CF6"
              strokeWidth="3"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </g>
        ))}
      </svg>

      {/* Hover Information Box */}
      {hoveredPoint !== null && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(points[hoveredPoint].x / width) * 100}%`,
            top: `${(points[hoveredPoint].y / height) * 100}%`,
          }}
        >
          <strong>{points[hoveredPoint].month}</strong>
          <div>Bursar Inflow: ₹{points[hoveredPoint].revenue.toLocaleString()}</div>
          <div>Bed Allotments: {points[hoveredPoint].allocations}</div>
        </div>
      )}
    </div>
  );
}

export default PureSvgAreaChart;
