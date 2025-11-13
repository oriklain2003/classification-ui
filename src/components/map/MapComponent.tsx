import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FlightPoint } from '../../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapComponentProps {
  points: FlightPoint[];
  onAddPoint: (lat: number, lng: number) => void;
  onPointDrag: (pointId: string, lat: number, lng: number) => void;
  selectedPointId: string | null;
  onPointSelect: (pointId: string) => void;
}

// Custom marker icons
const createCustomIcon = (color: string, isSelected: boolean = false, isFirst: boolean = false, isLast: boolean = false) => {
  const size = isSelected ? 28 : 20;
  const borderWidth = isSelected ? 4 : 3;
  const glowEffect = isSelected ? `box-shadow: 0 0 20px ${color}, 0 2px 4px rgba(0,0,0,0.3);` : `box-shadow: 0 2px 4px rgba(0,0,0,0.3);`;
  
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: ${borderWidth}px solid white;
      ${glowEffect}
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${isSelected ? 12 : 10}px;
      color: white;
      transition: all 0.3s ease;
      animation: ${isSelected ? 'pulse 2s infinite' : 'none'};
    ">
      ${isFirst ? 'S' : isLast ? 'E' : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to handle map clicks
const MapClickHandler: React.FC<{ onAddPoint: (lat: number, lng: number) => void }> = ({ onAddPoint }) => {
  useMapEvents({
    click: (e) => {
      onAddPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Draggable marker component
const DraggableMarker: React.FC<{
  point: FlightPoint;
  onDrag: (pointId: string, lat: number, lng: number) => void;
  onSelect: (pointId: string) => void;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
}> = ({ point, onDrag, onSelect, isSelected, isFirst, isLast }) => {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = {
    dragstart: () => {
      // Prevent map interactions during drag
      if (markerRef.current) {
        const map = (markerRef.current as any)._map;
        if (map) {
          map.dragging.disable();
          map.touchZoom.disable();
          map.doubleClickZoom.disable();
          map.scrollWheelZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();
        }
      }
    },
    dragend: () => {
      const marker = markerRef.current;
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        onDrag(point.id, lat, lng);
        
        // Re-enable map interactions
        const map = (marker as any)._map;
        if (map) {
          map.dragging.enable();
          map.touchZoom.enable();
          map.doubleClickZoom.enable();
          map.scrollWheelZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();
        }
      }
    },
    click: () => onSelect(point.id),
  };

  const iconColor = '#1890ff';
  const icon = createCustomIcon(iconColor, isSelected, isFirst, isLast);

  return (
    <Marker
      ref={markerRef}
      position={[point.lat, point.lng]}
      icon={icon}
      draggable={true}
      eventHandlers={eventHandlers}
    />
  );
};

const MapComponent: React.FC<MapComponentProps> = ({
  points,
  onAddPoint,
  onPointDrag,
  selectedPointId,
  onPointSelect,
}) => {
  const mapCenter: [number, number] = [32.0853, 34.7818]; // Default center (Israel)
  const mapZoom = 10;

  // Create polyline path from points
  const pathPositions: [number, number][] = points.map(point => [point.lat, point.lng]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onAddPoint={onAddPoint} />

        {/* Render markers */}
        {points.map((point, index) => (
          <DraggableMarker
            key={point.id}
            point={point}
            onDrag={onPointDrag}
            onSelect={onPointSelect}
            isSelected={selectedPointId === point.id}
            isFirst={index === 0}
            isLast={index === points.length - 1}
          />
        ))}

        {/* Render path line */}
        {pathPositions.length > 1 && (
          <Polyline
            positions={pathPositions}
            pathOptions={{
              color: '#1890ff',
              weight: 3,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>
      
      {/* Add CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
