import React from 'react';

interface ClassificationHeaderProps {
  onNewClassification: () => void;
  onReturnToMap: () => void;
}

const ClassificationHeader: React.FC<ClassificationHeaderProps> = ({
  onNewClassification,
  onReturnToMap,
}) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #30363d',
      padding: '16px 32px',
      backgroundColor: 'rgba(13, 17, 23, 0.8)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
        <div style={{ width: '28px', height: '28px', color: '#2b8cee' }}>
          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.378 13.74l-9.38 5.41a4 4 0 01-4 0l-9.38-5.41a4 4 0 01-2-3.46V8.31a4 4 0 012-3.46l9.38-5.41a4 4 0 014 0l9.38 5.41a4 4 0 012 3.46v2.97a4 4 0 01-2 3.46zM3.62 7.26v6.48l8.38 4.84a2 2 0 002 0l8.38-4.84V7.26l-8.38-4.83a2 2 0 00-2 0z"></path>
          </svg>
        </div>
        <h2 style={{
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Flight Path Classifier
        </h2>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={onReturnToMap}
            style={{
              color: '#9ca3af',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Map
          </button>

          <button
            style={{
              color: '#2b8cee',
              backgroundColor: 'rgba(43, 140, 238, 0.1)',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Results
          </button>
        </div>
        

      </div>
    </header>
  );
};

export default ClassificationHeader;
