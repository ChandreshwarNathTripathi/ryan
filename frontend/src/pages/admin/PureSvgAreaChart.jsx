import React, { useState } from "react";

// Pure SVG 6-Month Fee Collections Area & Line Chart (No External Chart Libraries)
function PureSvgAreaChart({ data = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return <div className="chart-empty">No revenue data available for the last 6 months.</div>;
  }

  // Dimensions & Padding
  const width = 800;
  const height = 300;
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max revenue for Y-axis scale
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100000);
  const yTicks = [0, maxRevenue * 0.25, maxRevenue * 0.5, maxRevenue * 0.75, maxRevenue];

  // Compute (X, Y) points dynamically
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.revenue / maxRevenue) * chartHeight;
    return { ...d, x, y };
  });

  // Build SVG path strings
  const linePath = points.reduce((path, pt, index) => {
    return index === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
  }, "");

  const areaPath = `
    ${linePath} 
    L ${points[points.length - 1].x} ${paddingTop + chartHeight} 
    L ${points[0].x} ${paddingTop + chartHeight} Z
  `;

  return (
    <div className="svg-chart-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="pure-svg-chart"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines & Y-Axis Labels */}
        {yTicks.map((tickValue, i) => {
          const y = paddingTop + chartHeight - (tickValue / maxRevenue) * chartHeight;
          return (
            <g key={i}>
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
                fontFamily="Inter, sans-serif"
              >
                ₹{(tickValue / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* Shaded Area Fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Solid Line Stroke */}
        <path
          d={linePath}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Circles, X-Axis Labels & Hover Interaction */}
        {points.map((pt, i) => (
          <g key={i}>
            {/* X-Axis Month Label */}
            <text
              x={pt.x}
              y={height - 12}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              {pt.month}
            </text>

            {/* Circular Data Point */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint === i ? 7 : 5}
              fill="#FFFFFF"
              stroke="#8B5CF6"
              strokeWidth="3"
              style={{ cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </g>
        ))}
      </svg>

      {/* Dynamic Hover Tooltip */}
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
