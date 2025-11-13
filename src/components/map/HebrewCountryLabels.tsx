import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { CountryInfo, getVisibleCountries } from '../../services/hebrewCountryNames';

interface HebrewCountryLabelsProps {
  enabled?: boolean;
}

const HebrewCountryLabels: React.FC<HebrewCountryLabelsProps> = ({ enabled = true }) => {
  const map = useMap();
  const [labels, setLabels] = useState<L.Marker[]>([]);

  const createCountryLabel = (country: CountryInfo): L.Marker => {
    const [lat, lng] = country.center;
    
    // Create custom HTML for Hebrew label
    const labelHtml = `
      <div style="
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        white-space: nowrap;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        direction: rtl;
        unicode-bidi: bidi-override;
        pointer-events: none;
        user-select: none;
      ">
        ${country.hebrewName}
      </div>
    `;

    const icon = L.divIcon({
      html: labelHtml,
      className: 'hebrew-country-label',
      iconSize: [0, 0], // Let the content determine size
      iconAnchor: [0, 0],
    });

    const marker = L.marker([lat, lng], { 
      icon,
      interactive: false, // Make labels non-interactive
      pane: 'overlayPane' // Ensure labels appear above the map but below markers
    });

    return marker;
  };

  const updateLabels = () => {
    if (!enabled) {
      // Remove all labels if disabled
      labels.forEach(label => map.removeLayer(label));
      setLabels([]);
      return;
    }

    const bounds = map.getBounds();
    const zoom = map.getZoom();
    
    // Convert Leaflet bounds to our format
    const mapBounds: [[number, number], [number, number]] = [
      [bounds.getSouth(), bounds.getWest()],
      [bounds.getNorth(), bounds.getEast()]
    ];

    // Get countries that should be visible
    const visibleCountries = getVisibleCountries(mapBounds, zoom);

    // Remove existing labels
    labels.forEach(label => map.removeLayer(label));

    // Add new labels for visible countries
    const newLabels = visibleCountries.map(country => {
      const label = createCountryLabel(country);
      label.addTo(map);
      return label;
    });

    setLabels(newLabels);
  };

  useEffect(() => {
    if (!map || !enabled) return;

    // Initial label update
    updateLabels();

    // Update labels when map moves or zooms
    const handleMapChange = () => {
      // Debounce the update to avoid too frequent updates
      setTimeout(updateLabels, 100);
    };

    map.on('moveend', handleMapChange);
    map.on('zoomend', handleMapChange);

    // Cleanup
    return () => {
      map.off('moveend', handleMapChange);
      map.off('zoomend', handleMapChange);
      labels.forEach(label => map.removeLayer(label));
    };
  }, [map, enabled]);

  // Clean up labels when component unmounts or is disabled
  useEffect(() => {
    if (!enabled) {
      labels.forEach(label => map.removeLayer(label));
      setLabels([]);
    }
  }, [enabled]);

  return null; // This component doesn't render anything directly
};

export default HebrewCountryLabels;
