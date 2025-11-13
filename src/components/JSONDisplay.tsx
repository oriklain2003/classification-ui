import React, { useState } from 'react';
import { FlightPoint } from '../types';

interface JSONDisplayProps {
  points: FlightPoint[];
  onExportJSON: () => string;
}

const JSONDisplay: React.FC<JSONDisplayProps> = ({ points, onExportJSON }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (points.length === 0) return null;

  const jsonData = onExportJSON();

  return (
    <div style={{ 
      marginTop: '16px', 
      border: '1px solid #424245', 
      borderRadius: '6px',
      background: '#3A3A3C'
    }}>
      <div 
        style={{ 
          padding: '12px', 
          borderBottom: isExpanded ? '1px solid #424245' : 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background-color 0.2s'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#48484A'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#f9fafb', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '18px' }}>data_object</span>
          <span>JSON Output</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>
            {points.length} points
          </span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#9ca3af', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            chevron_right
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div style={{ padding: '8px', background: '#2c2c2e', position: 'relative' }}>
          <button
            className="button secondary"
            onClick={() => {
              navigator.clipboard.writeText(jsonData).then(() => {
                alert('JSON copied to clipboard!');
              });
            }}
            style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              padding: '4px 8px', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 1
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
            <span>Copy</span>
          </button>
          <pre style={{ 
            fontSize: '12px', 
            margin: 0, 
            background: '#2c2c2e',
            padding: '48px 12px 12px 12px',
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '200px',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            color: '#d1d5db',
            border: '1px solid #424245'
          }}>
            {jsonData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JSONDisplay;
