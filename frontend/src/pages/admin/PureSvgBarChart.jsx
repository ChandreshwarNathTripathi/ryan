import React, { useState } from "react";

// ==============================================================================
// PureSvgBarChart — Beginner-Friendly Pure SVG Comparative Bar Chart
// Compares: Total Beds vs Occupied Beds for each campus hostel block
// Zero chart libraries used. Built with simple SVG <rect> and <text> elements.
// ==============================================================================
function PureSvgBarChart({ data = [] }) {
  // Simple state to store which block the user is currently hovering over
  const [hoveredBlock, setHoveredBlock] = useState(null);

  // If data is missing or empty, display friendly fallback message
  if (!data || data.length === 0) {
    return <div className="chart-empty">No block capacity data available.</div>;
  }

  // --- 1. SVG Canvas Dimensions ---
  const width = 800;        // Total width
  const height = 280;       // Total height
  const paddingLeft = 60;   // Left space for number ticks
  const paddingRight = 30;  // Right padding
  const paddingTop = 30;    // Top padding
  const paddingBottom = 45; // Bottom space for block names

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // --- 2. Find Maximum Bed Count for Y-Axis Scaling ---
  let maxBeds = 10;
  for (let i = 0; i < data.length; i++) {
    if (data[i].totalBeds > maxBeds) {
      maxBeds = data[i].totalBeds;
    }
  }

  // Width allocated to each block section
  const blockSlotWidth = chartWidth / data.length;
  // Width of each individual bar inside the block group
  const barWidth = 32;

  return (
    <div className="svg-chart-wrapper">
      {/* Chart Legend */}
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
        {/* Horizontal reference grid lines at 0, 50%, and 100% capacity */}
        {[0, maxBeds * 0.5, maxBeds].map((tickValue, index) => {
          const y = paddingTop + chartHeight - (tickValue / maxBeds) * chartHeight;
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
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                fill="#94A3B8"
                fontSize="11"
              >
                {Math.round(tickValue)}
              </text>
            </g>
          );
        })}

        {/* Render grouped bars for each block */}
        {data.map((block, index) => {
          // Center X position for this block group
          const centerX = paddingLeft + index * blockSlotWidth + blockSlotWidth / 2;

          // Bar heights calculated using simple percentage math: (beds / maxBeds) * chartHeight
          const totalBarHeight = (block.totalBeds / maxBeds) * chartHeight;
          const occupiedBarHeight = (block.occupiedBeds / maxBeds) * chartHeight;

          // X positions: Total bar sits slightly left of center, Occupied sits right
          const totalBarX = centerX - barWidth - 4;
          const occupiedBarX = centerX + 4;

          // SVG Y coordinates start from top, so top of bar = bottom line - barHeight
          const totalBarY = paddingTop + chartHeight - totalBarHeight;
          const occupiedBarY = paddingTop + chartHeight - occupiedBarHeight;

          return (
            <g
              key={block.block || index}
              onMouseEnter={() => setHoveredBlock(block)}
              onMouseLeave={() => setHoveredBlock(null)}
              style={{ cursor: "pointer" }}
            >
              {/* 1. Total Beds Bar (Purple Outline) */}
              <rect
                x={totalBarX}
                y={totalBarY}
                width={barWidth}
                height={totalBarHeight}
                rx="5"
                fill="rgba(139, 92, 246, 0.35)"
                stroke="#8B5CF6"
                strokeWidth="1.5"
              />

              {/* 2. Occupied Beds Bar (Solid Green) */}
              <rect
                x={occupiedBarX}
                y={occupiedBarY}
                width={barWidth}
                height={occupiedBarHeight}
                rx="5"
                fill="#10B981"
              />

              {/* 3. Value numbers displayed on top of bars */}
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

              {/* 4. Block Name label on X-axis */}
              <text
                x={centerX}
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

      {/* Hover information message */}
      {hoveredBlock && (
        <div className="bar-hover-summary">
          <strong>{hoveredBlock.block}: </strong>
          {hoveredBlock.occupiedBeds} / {hoveredBlock.totalBeds} Beds Occupied (
          {Math.round((hoveredBlock.occupiedBeds / (hoveredBlock.totalBeds || 1)) * 100)}% Occupancy) •{" "}
          {hoveredBlock.rooms} Rooms
        </div>
      )}
    </div>
  );
}

export default PureSvgBarChart;
