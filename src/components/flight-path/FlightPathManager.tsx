import { useState, useCallback } from 'react';
import { FlightPoint } from '../../types';
import { calculateBearing } from '../../utils/calculations';
import { PredictionService, PredictionResponse } from '../../services/predictionService';

interface FlightPathManagerProps {
  points: FlightPoint[];
  onPointsChange: (points: FlightPoint[]) => void;
  selectedPointId: string | null;
  onPointSelect: (pointId: string | null) => void;
}

const useFlightPathManager = ({
  points,
  onPointsChange,
  selectedPointId,
  onPointSelect,
}: FlightPathManagerProps) => {
  const [nextPointId, setNextPointId] = useState(1);

  // Calculate headings for all points based on their sequence
  const calculateHeadings = useCallback((pointsList: FlightPoint[]) => {
    return pointsList.map((point, index) => {
      if (index === 0) {
        // First point: calculate heading to next point if it exists
        if (pointsList.length > 1) {
          const nextPoint = pointsList[1];
          return {
            ...point,
            heading: calculateBearing(point.lat, point.lng, nextPoint.lat, nextPoint.lng)
          };
        }
        return { ...point, heading: 0 }; // No heading for single point
      } else {
        // All other points: calculate heading from previous point
        const prevPoint = pointsList[index - 1];
        return {
          ...point,
          heading: calculateBearing(prevPoint.lat, prevPoint.lng, point.lat, point.lng)
        };
      }
    });
  }, []);

  // Add a new point
  const addPoint = useCallback((lat: number, lng: number) => {
    const newPoint: FlightPoint = {
      id: `point-${nextPointId}`,
      lat,
      lng,
      alt: 100, // Default altitude
      heading: 0, // Will be calculated
      speed: 50, // Default speed
    };

    const newPoints = [...points, newPoint];
    const pointsWithHeadings = calculateHeadings(newPoints);
    onPointsChange(pointsWithHeadings);
    setNextPointId(nextPointId + 1);
    onPointSelect(newPoint.id);
  }, [points, nextPointId, onPointsChange, onPointSelect, calculateHeadings]);

  // Update a point
  const updatePoint = useCallback((pointId: string, updates: Partial<FlightPoint>) => {
    const newPoints = points.map(point =>
      point.id === pointId ? { ...point, ...updates } : point
    );
    // Recalculate headings if position changed
    if (updates.lat !== undefined || updates.lng !== undefined) {
      const pointsWithHeadings = calculateHeadings(newPoints);
      onPointsChange(pointsWithHeadings);
    } else {
      onPointsChange(newPoints);
    }
  }, [points, onPointsChange, calculateHeadings]);

  // Delete a point
  const deletePoint = useCallback((pointId: string) => {
    const newPoints = points.filter(point => point.id !== pointId);
    const pointsWithHeadings = calculateHeadings(newPoints);
    onPointsChange(pointsWithHeadings);
    if (selectedPointId === pointId) {
      onPointSelect(null);
    }
  }, [points, selectedPointId, onPointsChange, onPointSelect, calculateHeadings]);

  // Clear all points
  const clearAllPoints = useCallback(() => {
    onPointsChange([]);
    onPointSelect(null);
    setNextPointId(1);
  }, [onPointsChange, onPointSelect]);

  // Handle point drag
  const handlePointDrag = useCallback((pointId: string, lat: number, lng: number) => {
    updatePoint(pointId, { lat, lng });
  }, [updatePoint]);

  // Export points as JSON
  const exportAsJSON = useCallback(() => {
    const exportData = points.map(point => ({
      lat: parseFloat(point.lat.toFixed(6)),
      lon: parseFloat(point.lng.toFixed(6)),
      alt: point.alt,
      speed: point.speed,
      heading: point.heading
    }));
    return JSON.stringify(exportData, null, 2);
  }, [points]);

  // Predict flight path
  const predictFlightPath = useCallback(async (): Promise<PredictionResponse> => {
    if (points.length === 0) {
      throw new Error('No points to predict. Please add some points to the flight path.');
    }

    const requestData = {
      data: points.map(point => ({
        lat: parseFloat(point.lat.toFixed(6)),
        lon: parseFloat(point.lng.toFixed(6)),
        alt: point.alt,
        speed: point.speed,
        heading: point.heading
      }))
    };

    return await PredictionService.predict(requestData);
  }, [points]);

  // Load track from JSON data
  const loadTrack = useCallback((trackData: Array<{lat: number, lon: number, alt: number, speed: number, heading: number}>) => {
    const newPoints: FlightPoint[] = trackData.map((point, index) => ({
      id: `point-${index + 1}`,
      lat: point.lat,
      lng: point.lon,
      alt: point.alt,
      speed: point.speed,
      heading: point.heading
    }));

    onPointsChange(newPoints);
    setNextPointId(newPoints.length + 1);
    onPointSelect(null);
  }, [onPointsChange, onPointSelect]);

  return {
    addPoint,
    updatePoint,
    deletePoint,
    clearAllPoints,
    handlePointDrag,
    exportAsJSON,
    predictFlightPath,
    loadTrack,
  };
};

export default useFlightPathManager;
