import React, { useState } from 'react';

interface LoadTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTrack: (trackData: Array<{lat: number, lon: number, alt: number, speed: number, heading: number}>) => void;
}

const LoadTrackModal: React.FC<LoadTrackModalProps> = ({ isOpen, onClose, onLoadTrack }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoad = () => {
    try {
      setError(null);
      
      // Parse the JSON
      const parsedData = JSON.parse(jsonInput.trim());
      
      // Validate the data structure
      if (!Array.isArray(parsedData)) {
        throw new Error('Data must be an array of points');
      }
      
      if (parsedData.length === 0) {
        throw new Error('Array cannot be empty');
      }
      
      // Validate each point
      for (let i = 0; i < parsedData.length; i++) {
        const point = parsedData[i];
        if (typeof point !== 'object' || point === null) {
          throw new Error(`Point ${i + 1} must be an object`);
        }
        
        const requiredFields = ['lat', 'lon', 'alt', 'speed', 'heading'];
        for (const field of requiredFields) {
          if (!(field in point)) {
            throw new Error(`Point ${i + 1} is missing required field: ${field}`);
          }
          if (typeof point[field] !== 'number') {
            throw new Error(`Point ${i + 1}: ${field} must be a number`);
          }
        }
        
        // Validate ranges
        if (point.lat < -90 || point.lat > 90) {
          throw new Error(`Point ${i + 1}: latitude must be between -90 and 90`);
        }
        if (point.lon < -180 || point.lon > 180) {
          throw new Error(`Point ${i + 1}: longitude must be between -180 and 180`);
        }
        if (point.alt < 0) {
          throw new Error(`Point ${i + 1}: altitude must be non-negative`);
        }
        if (point.speed < 0) {
          throw new Error(`Point ${i + 1}: speed must be non-negative`);
        }
        if (point.heading < 0 || point.heading >= 360) {
          throw new Error(`Point ${i + 1}: heading must be between 0 and 359`);
        }
      }
      
      // Load the track
      onLoadTrack(parsedData);
      setJsonInput('');
      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setError(null);
  };

  const loadSampleData = () => {
    const sampleData = [
      { "lat": 33.177790, "lon": 35.386963, "alt": 5000, "speed": 100, "heading": 180 },
      { "lat": 33.122026, "lon": 35.390396, "alt": 5000, "speed": 100, "heading": 180 },
      { "lat": 33.063349, "lon": 35.397949, "alt": 5000, "speed": 100, "heading": 180 }
    ];
    setJsonInput(JSON.stringify(sampleData, null, 2));
    setError(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>
            📥 Load Track Data
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
            Paste your JSON track data below. Each point should have: lat, lon, alt, speed, heading
          </p>
          <button
            onClick={loadSampleData}
            className="button secondary"
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            Load Sample Data
          </button>
        </div>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`Paste JSON data here, for example:
[
  { "lat": 33.177790, "lon": 35.386963, "alt": 5000, "speed": 100, "heading": 180 },
  { "lat": 33.122026, "lon": 35.390396, "alt": 5000, "speed": 100, "heading": 180 },
  { "lat": 33.063349, "lon": 35.397949, "alt": 5000, "speed": 100, "heading": 180 }
]`}
          style={{
            width: '100%',
            height: '200px',
            padding: '12px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            resize: 'vertical',
            marginBottom: '16px',
          }}
        />

        {error && (
          <div style={{
            backgroundColor: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            color: '#a8071a',
            fontSize: '14px',
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClear}
            className="button secondary"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="button secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            className="button"
            disabled={!jsonInput.trim()}
            style={{
              opacity: jsonInput.trim() ? 1 : 0.5,
              cursor: jsonInput.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Load Track
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadTrackModal;
