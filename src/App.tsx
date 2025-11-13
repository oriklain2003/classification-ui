import React, { useState } from 'react';
import MapComponent from './components/map/MapComponent';
import Sidebar from './components/Sidebar';
import ClassificationResults from './components/classification/ClassificationResults';
import useFlightPathManager from './components/flight-path/FlightPathManager';
import { FlightPoint } from './types';
import { PredictionResponse } from './services/predictionService';
import 'leaflet/dist/leaflet.css';
import './styles/global.css';

function App() {
  const [points, setPoints] = useState<FlightPoint[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the flight path manager hook
  const flightPathManager = useFlightPathManager({
    points,
    onPointsChange: setPoints,
    selectedPointId,
    onPointSelect: setSelectedPointId,
  });

  // Handle prediction
  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const result = await flightPathManager.predictFlightPath();
      setPrediction(result);
      
      // Save to localStorage
      const savedResult = {
        prediction: result,
        points: points,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastClassificationResult', JSON.stringify(savedResult));
      
      // Trigger a re-render to show the button (the sidebar will check localStorage on next render)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while predicting');
    } finally {
      setIsLoading(false);
    }
  };

  // Close prediction modal
  const closePrediction = () => {
    setPrediction(null);
    setError(null);
    setIsLoading(false);
  };

  // Handle new classification
  const handleNewClassification = () => {
    setPrediction(null);
    setError(null);
    setIsLoading(false);
    // Clear current points to start fresh
    flightPathManager.clearAllPoints();
  };

  // Load saved classification results
  const handleViewSavedResults = () => {
    try {
      const saved = localStorage.getItem('lastClassificationResult');
      if (saved) {
        const { prediction: savedPrediction, points: savedPoints } = JSON.parse(saved);
        setPrediction(savedPrediction);
        setPoints(savedPoints);
        setError(null);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to load saved results:', err);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        points={points}
        selectedPointId={selectedPointId}
        onPointSelect={setSelectedPointId}
        onPointUpdate={flightPathManager.updatePoint}
        onPointDelete={flightPathManager.deletePoint}
        onClearAll={flightPathManager.clearAllPoints}
        onExportJSON={flightPathManager.exportAsJSON}
        onPredict={handlePredict}
        onLoadTrack={flightPathManager.loadTrack}
        onViewSavedResults={handleViewSavedResults}
      />
      <div className="map-container">
        <MapComponent
          points={points}
          onAddPoint={flightPathManager.addPoint}
          onPointDrag={flightPathManager.handlePointDrag}
          selectedPointId={selectedPointId}
          onPointSelect={setSelectedPointId}
          showHebrewLabels={true}
        />
      </div>
      
      {/* Classification Results */}
      <ClassificationResults
        prediction={prediction}
        points={points}
        isLoading={isLoading}
        error={error}
        onClose={closePrediction}
        onNewClassification={handleNewClassification}
      />
    </div>
  );
}

export default App;
