import React from 'react';
import { FlightPoint } from '../../types';

interface FlightPathVisualizationProps {
  points: FlightPoint[];
}

const FlightPathVisualization: React.FC<FlightPathVisualizationProps> = ({ points }) => {
  if (points.length === 0) {
    return (
      <div style={{
        width: '100%',
        aspectRatio: '1',
        backgroundColor: '#0d1117',
        borderRadius: '8px',
        backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 1,
          color: '#2b8cee',
          fontSize: '48px',
          opacity: 0.7
        }}>
          🗺️
        </div>
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          color: '#6b7280',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          No Flight Path
        </div>
      </div>
    );
  }

  // Calculate bounds for the flight path
  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Normalize coordinates to fit in the visualization
  const normalizePoint = (point: FlightPoint) => {
    const x = ((point.lng - minLng) / (maxLng - minLng)) * 80 + 10; // 10% padding
    const y = ((maxLat - point.lat) / (maxLat - minLat)) * 80 + 10; // Flip Y axis, 10% padding
    return { x: `${x}%`, y: `${y}%` };
  };

  const normalizedPoints = points.map(normalizePoint);

  // Create SVG path
  const pathData = normalizedPoints.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  return (
    <div style={{
      width: '100%',
      aspectRatio: '1',
      backgroundColor: '#0d1117',
      borderRadius: '8px',
      backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid pattern background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(43, 140, 238, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(43, 140, 238, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        opacity: 0.3
      }} />

      {/* Flight path visualization */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Flight path line */}
        <path
          d={pathData}
          stroke="#2b8cee"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 2px rgba(43, 140, 238, 0.5))'
          }}
        />
        
        {/* Start point */}
        {normalizedPoints.length > 0 && (
          <circle
            cx={normalizedPoints[0].x}
            cy={normalizedPoints[0].y}
            r="1.2"
            fill="#52c41a"
            stroke="white"
            strokeWidth="0.3"
          />
        )}
        
        {/* End point */}
        {normalizedPoints.length > 1 && (
          <circle
            cx={normalizedPoints[normalizedPoints.length - 1].x}
            cy={normalizedPoints[normalizedPoints.length - 1].y}
            r="1.2"
            fill="#f5222d"
            stroke="white"
            strokeWidth="0.3"
          />
        )}
        
        {/* Intermediate points */}
        {normalizedPoints.slice(1, -1).map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="0.6"
            fill="#2b8cee"
            opacity="0.8"
          />
        ))}
      </svg>

      {/* Info overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        color: '#6b7280',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {points.length} Points
      </div>
    </div>
  );
};

export default FlightPathVisualization;
