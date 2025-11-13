import React, { useState, useRef, useEffect } from 'react';
import { FlightPoint } from '../types';
import PointDetails from './point-details/PointDetails';
import JSONDisplay from './JSONDisplay';
import LoadTrackModal from './LoadTrackModal';

interface SidebarProps {
  points: FlightPoint[];
  selectedPointId: string | null;
  onPointSelect: (pointId: string) => void;
  onPointUpdate: (pointId: string, updates: Partial<FlightPoint>) => void;
  onPointDelete: (pointId: string) => void;
  onClearAll: () => void;
  onExportJSON: () => string;
  onPredict: () => Promise<void>;
  onLoadTrack: (trackData: Array<{lat: number, lon: number, alt: number, speed: number, heading: number}>) => void;
  onViewSavedResults: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  points,
  selectedPointId,
  onPointSelect,
  onPointUpdate,
  onPointDelete,
  onClearAll,
  onExportJSON,
  onPredict,
  onLoadTrack,
  onViewSavedResults,
}) => {
  const selectedPoint = points.find(p => p.id === selectedPointId);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [hasSavedResults, setHasSavedResults] = useState(false);

  // Check for saved results on component mount
  useEffect(() => {
    const saved = localStorage.getItem('lastClassificationResult');
    setHasSavedResults(!!saved);
  }, []);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      
      const newWidth = e.clientX;
      const minWidth = 300;
      const maxWidth = 600;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        sidebarRef.current.style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };


  return (
    <div ref={sidebarRef} className={`sidebar ${isResizing ? 'resizing' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '24px' }}>route</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', color: '#f9fafb', fontWeight: '600' }}>Flight Path</h1>
            </div>
          </div>
          {hasSavedResults && (
            <button
              onClick={onViewSavedResults}
              style={{
                backgroundColor: 'transparent',
                color: '#007AFF',
                border: '1px solid #007AFF',
                fontSize: '11px',
                fontWeight: '500',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#007AFF';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#007AFF';
              }}
            >
              Go to Classification Site
            </button>
          )}
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#9ca3af' }}>
          {points.length} point{points.length !== 1 ? 's' : ''}
        </p>
        
        {/* Load Track Button - Always visible */}
        <div style={{ marginTop: '8px' }}>
          <button
            className="button secondary"
            onClick={() => setShowLoadModal(true)}
            style={{ width: '100%', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload_file</span>
            <span>Load Track Data</span>
          </button>
        </div>

        {points.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className="button"
              onClick={() => onPredict()}
              style={{ width: '100%', backgroundColor: '#007AFF', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>auto_awesome</span>
              <span>Predict Object Type</span>
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>

              <button
                className="button danger"
                onClick={onClearAll}
                style={{ flex: 1, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_sweep</span>
                <span>Clear All</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="sidebar-content">
        {points.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '40px' }}>
            <p style={{ color: '#f9fafb' }}>No flight path loaded</p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#9ca3af' }}>
              Click on the map to add points manually<br/>
              or use "Load Track Data" to import JSON
            </p>
          </div>
        ) : (
          <>
            {/* Point List */}
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', color: '#f9fafb', marginBottom: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '20px' }}>pin_drop</span>
                <span>Points</span>
              </h2>
              {points.map((point, index) => (
                <div
                  key={point.id}
                  className={`point-item ${selectedPointId === point.id ? 'selected' : ''}`}
                  onClick={() => onPointSelect(point.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500', color: '#f9fafb' }}>
                      {index === 0 ? 'Start' : index === points.length - 1 ? 'End' : `Point ${index + 1}`}
                    </span>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                      {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', margin: '4px 0 0 0' }}>
                    Alt: {point.alt}m | Speed: {point.speed}km/h | Heading: {point.heading}°
                  </p>
                </div>
              ))}
            </div>

            {/* Selected Point Details */}
            {selectedPoint && (
              <div style={{ 
                borderTop: '1px solid #424245', 
                paddingTop: '16px',
                marginTop: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '18px', color: '#f9fafb', margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: '20px' }}>edit_location_alt</span>
                    <span>Point Details</span>
                  </h2>
                  <button
                    className="button danger"
                    onClick={() => onPointDelete(selectedPoint.id)}
                    style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                    <span>Delete</span>
                  </button>
                </div>
                <PointDetails
                  point={selectedPoint}
                  onUpdate={onPointUpdate}
                  onDelete={onPointDelete}
                />
              </div>
            )}

            {/* JSON Display */}
            <JSONDisplay
              points={points}
              onExportJSON={onExportJSON}
            />
          </>
        )}
      </div>
      
      {/* Load Track Modal */}
      <LoadTrackModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onLoadTrack={(trackData) => {
          onLoadTrack(trackData);
          setShowLoadModal(false);
        }}
      />
      
      {/* Resize Handle */}
      <div 
        className="sidebar-resize-handle"
        onMouseDown={handleResizeStart}
        title="Drag to resize sidebar"
      />
    </div>
  );
};

export default Sidebar;
