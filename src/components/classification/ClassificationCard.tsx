import React from 'react';
import ProbabilityBars from './ProbabilityBars';
import FlightPathVisualization from './FlightPathVisualization';
import { PredictionResponse } from '../../services/predictionService';
import { FlightPoint } from '../../types';

interface ClassificationCardProps {
  prediction: PredictionResponse;
  points: FlightPoint[];
  onViewFullReport: () => void;
  onReturnToMap: () => void;
}

const ClassificationCard: React.FC<ClassificationCardProps> = ({
  prediction,
  points,
  onViewFullReport,
  onReturnToMap,
}) => {
  // Get the highest probability category
  const maxValue = Math.max(
    prediction.probabilities.birds,
    prediction.probabilities.uav,
    prediction.probabilities.aircraft,
    prediction.probabilities.missile
  );

  const getTopClassification = () => {
    if (prediction.probabilities.uav === maxValue) return 'Unmanned Aerial Vehicle';
    if (prediction.probabilities.aircraft === maxValue) return 'Aircraft';
    if (prediction.probabilities.missile === maxValue) return 'Missile';
    return 'Birds';
  };

  const getClassificationIcon = () => {
    const topClass = getTopClassification();
    if (topClass === 'Unmanned Aerial Vehicle') return '🚁';
    if (topClass === 'Aircraft') return '✈️';
    if (topClass === 'Missile') return '🚀';
    return '🐦';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '16px',
      backgroundColor: '#161b22',
      border: '1px solid #30363d',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      maxWidth: '768px',
      width: '100%'
    }}>
      {/* Main Content */}
      <div style={{ padding: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left Column - Classification Results */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: '500',
              margin: '0 0 4px 0'
            }}>
              Most Probable Classification
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <span style={{
                fontSize: '32px',
                color: '#2b8cee'
              }}>
                {getClassificationIcon()}
              </span>
              <p style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                {getTopClassification()}
              </p>
            </div>

            <ProbabilityBars probabilities={prediction.probabilities} />
          </div>

          {/* Right Column - Flight Path Visualization */}
          <FlightPathVisualization points={points} />
        </div>
      </div>

      {/* Analysis Reasoning Section */}
      <div style={{
        borderTop: '1px solid #30363d',
        padding: '32px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 8px 0'
        }}>
          Analysis Reasoning
        </h3>
        <p style={{
          color: '#d1d5db',
          fontSize: '14px',
          lineHeight: '1.6',
          margin: 0
        }}>
          {prediction.reasoning}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{
        borderTop: '1px solid #30363d',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
        flexWrap: 'wrap'
      }}>

        
        <button
          onClick={onReturnToMap}
          style={{
            backgroundColor: '#2b8cee',
            color: 'white',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            letterSpacing: '-0.01em',
            minWidth: '84px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(43, 140, 238, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2b8cee'}
        >
          Return to Map
        </button>
      </div>
    </div>
  );
};

export default ClassificationCard;
