import React, { useState } from "react";

// Pure SVG Comparative Bar Chart: Total Beds vs Occupied Beds
function PureSvgBarChart({ data = [] }) {
  const [hoveredBlock, setHoveredBlock] = useState(null);

  if (!data || data.length === 0) {
    return <div className="chart-empty">No block capacity data available.</div>;
  }

  const width = 800;
  const height = 280;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxBeds = Math.max(...data.map((d) => d.totalBeds), 10);
  const blockWidth = chartWidth / data.length;
  const barWidth = 32;

  return (
    <div className="svg-chart-wrapper">
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color total-color"></span>
          <span>Total Campus Beds</span>
        </div>
        <div className="legend-item">
          <span className="legend-color occupied-color"></span>
          <span>Occupied Resident Beds</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="pure-svg-chart"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Horizontal Grid lines */}
        {[0, maxBeds * 0.5, maxBeds].map((val, idx) => {
          const y = paddingTop + chartHeight - (val / maxBeds) * chartHeight;
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                fill="#94A3B8"
                fontSize="11"
              >
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Grouped Comparative Bars for each Block */}
        {data.map((block, i) => {
          const groupCenterX = paddingLeft + i * blockWidth + blockWidth / 2;
          const totalHeight = (block.totalBeds / maxBeds) * chartHeight;
          const occupiedHeight = (block.occupiedBeds / maxBeds) * chartHeight;

          const totalBarX = groupCenterX - barWidth - 4;
          const occupiedBarX = groupCenterX + 4;

          const totalBarY = paddingTop + chartHeight - totalHeight;
          const occupiedBarY = paddingTop + chartHeight - occupiedHeight;

          return (
            <g
              key={block.block || i}
              onMouseEnter={() => setHoveredBlock(block)}
              onMouseLeave={() => setHoveredBlock(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Total Beds Bar */}
              <rect
                x={totalBarX}
                y={totalBarY}
                width={barWidth}
                height={totalHeight}
                rx="5"
                fill="rgba(139, 92, 246, 0.35)"
                stroke="#8B5CF6"
                strokeWidth="1.5"
              />

              {/* Occupied Beds Bar */}
              <rect
                x={occupiedBarX}
                y={occupiedBarY}
                width={barWidth}
                height={occupiedHeight}
                rx="5"
                fill="#10B981"
              />

              {/* Value labels atop bars */}
              <text
                x={totalBarX + barWidth / 2}
                y={totalBarY - 6}
                textAnchor="middle"
                fill="#8B5CF6"
                fontSize="11"
                fontWeight="600"
              >
                {block.totalBeds}
              </text>
              <text
                x={occupiedBarX + barWidth / 2}
                y={occupiedBarY - 6}
                textAnchor="middle"
                fill="#10B981"
                fontSize="11"
                fontWeight="600"
              >
                {block.occupiedBeds}
              </text>

              {/* Block Name on X-Axis */}
              <text
                x={groupCenterX}
                y={height - 12}
                textAnchor="middle"
                fill="#E2E8F0"
                fontSize="12"
                fontWeight="600"
              >
                {block.block}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Info Banner */}
      {hoveredBlock && (
        <div className="bar-hover-summary">
          <strong>{hoveredBlock.block}:</strong> {hoveredBlock.occupiedBeds} / {hoveredBlock.totalBeds} Beds Occupied ({((hoveredBlock.occupiedBeds / hoveredBlock.totalBeds) * 100).toFixed(0)}% Occupancy) • {hoveredBlock.rooms} Rooms
        </div>
      )}
    </div>
  );
}

export default PureSvgBarChart;
