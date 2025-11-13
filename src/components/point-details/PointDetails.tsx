import React from 'react';
import { FlightPoint } from '../../types';

interface PointDetailsProps {
  point: FlightPoint;
  onUpdate: (pointId: string, updates: Partial<FlightPoint>) => void;
  onDelete: (pointId: string) => void;
}

const PointDetails: React.FC<PointDetailsProps> = ({ point, onUpdate, onDelete }) => {
  const handleInputChange = (field: keyof FlightPoint, value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onUpdate(point.id, { [field]: numericValue });
    }
  };

  const formatValue = (value: number, decimals: number = 6) => {
    return value.toFixed(decimals);
  };

  return (
    <div className="point-details">
        <div className="point-detail">
          <label>Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={formatValue(point.lat)}
            onChange={(e) => handleInputChange('lat', e.target.value)}
            placeholder="32.280167"
          />
        </div>
        
        <div className="point-detail">
          <label>Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={formatValue(point.lng)}
            onChange={(e) => handleInputChange('lng', e.target.value)}
            placeholder="34.491577"
          />
        </div>
        
        <div className="point-detail">
          <label>Altitude (ft)</label>
          <input
            type="number"
            step="1"
            value={point.alt}
            onChange={(e) => handleInputChange('alt', e.target.value)}
            placeholder="1000"
          />
        </div>
        
        <div className="point-detail">
          <label>Speed (kts)</label>
          <input
            type="number"
            step="1"
            min="0"
            value={point.speed}
            onChange={(e) => handleInputChange('speed', e.target.value)}
            placeholder="50"
          />
        </div>
        
        <div className="point-detail" style={{ gridColumn: 'span 2' }}>
          <label>Heading (°) - Auto Calculated</label>
          <input
            type="number"
            step="1"
            min="0"
            max="360"
            value={point.heading}
            readOnly
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            placeholder="302"
          />
        </div>
      </div>
  );
};

export default PointDetails;
