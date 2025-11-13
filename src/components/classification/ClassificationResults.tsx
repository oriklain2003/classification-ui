import React from 'react';
import ClassificationHeader from './ClassificationHeader';
import ClassificationCard from './ClassificationCard';
import { PredictionResponse } from '../../services/predictionService';
import { FlightPoint } from '../../types';

interface ClassificationResultsProps {
  prediction: PredictionResponse | null;
  points: FlightPoint[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onNewClassification: () => void;
}

const ClassificationResults: React.FC<ClassificationResultsProps> = ({
  prediction,
  points,
  isLoading,
  error,
  onClose,
  onNewClassification,
}) => {
  if (!prediction && !isLoading && !error) return null;

  const handleViewFullReport = () => {
    // TODO: Implement full report functionality
    console.log('View full report clicked');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0d1117',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <ClassificationHeader
        onNewClassification={onNewClassification}
        onReturnToMap={onClose}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 16px 64px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '768px',
          flex: 1
        }}>
          {/* Page Title */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <h1 style={{
              color: 'white',
              fontSize: '36px',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Classification Results
            </h1>
            <p style={{
              color: '#9ca3af',
              fontSize: '18px',
              margin: 0,
              lineHeight: '1.5',
              maxWidth: '512px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Automated analysis of the submitted flight path characteristics, identifying the most probable classification.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 20px',
              gap: '20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid #30363d',
                borderTop: '3px solid #2b8cee',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#9ca3af', fontSize: '16px', margin: 0 }}>
                Analyzing flight path...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{
              backgroundColor: '#161b22',
              border: '1px solid #f85149',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
              <h3 style={{
                color: '#f85149',
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 12px 0'
              }}>
                Analysis Failed
              </h3>
              <p style={{
                color: '#d1d5db',
                fontSize: '14px',
                margin: '0 0 24px 0',
                lineHeight: '1.5'
              }}>
                {error}
              </p>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#2b8cee',
                  color: 'white',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Return to Map
              </button>
            </div>
          )}

          {/* Results */}
          {prediction && !isLoading && (
            <ClassificationCard
              prediction={prediction}
              points={points}
              onViewFullReport={handleViewFullReport}
              onReturnToMap={onClose}
            />
          )}
        </div>
      </main>

      {/* Add CSS for spin animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ClassificationResults;
