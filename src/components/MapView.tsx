import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Star, Clock } from 'lucide-react';
import type { Bar } from '../types/bar';

// Fix for default markers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  bars: Bar[];
  selectedBar: Bar | null;
  onBarSelect: (bar: Bar) => void;
  center: [number, number];
  zoom: number;
}

// Custom cocktail bar icon
const createCustomIcon = (isSelected: boolean) => {
  const color = isSelected ? '#ef4444' : '#3b82f6'; // red for selected, blue for default
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">🍸</div>
      </div>
    `,
    className: 'custom-cocktail-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

function MapController({ selectedBar }: { selectedBar: Bar | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedBar) {
      map.setView([selectedBar.lat, selectedBar.lng], 16, {
        animate: true,
        duration: 0.5
      });
    }
  }, [selectedBar, map]);

  return null;
}

const MapView: React.FC<MapViewProps> = ({ 
  bars, 
  selectedBar, 
  onBarSelect, 
  center, 
  zoom 
}) => {
  const formatPriceRange = (priceLevel: number) => {
    return '$'.repeat(priceLevel);
  };

  const formatHours = (hours: Bar['hours']) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayKey = (today.charAt(0).toUpperCase() + today.slice(1).substring(0, 2)) as keyof Bar['hours']; // Convert to Mon, Tue, etc.
    const todayHours = hours[todayKey];

    if (!todayHours || todayHours.length === 0) {
      return 'Closed today';
    }

    const firstHours = todayHours[0];
    return `Today: ${firstHours.open} - ${firstHours.close}`;
  };

  const isOpenNow = (hours: Bar['hours']): boolean => {
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayKey = (today.charAt(0).toUpperCase() + today.slice(1).substring(0, 2)) as keyof Bar['hours']; // Convert to Mon, Tue, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = hours[todayKey];
    if (!todayHours || todayHours.length === 0) return false;

    const firstHours = todayHours[0];
    const openTime = parseInt(firstHours.open.replace(':', ''));
    const closeTime = parseInt(firstHours.close.replace(':', ''));

    if (closeTime < openTime) {
      return currentTime >= openTime || currentTime <= closeTime;
    }

    return currentTime >= openTime && currentTime <= closeTime;
  };

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController selectedBar={selectedBar} />
        
        {bars.map((bar) => (
          <Marker
            key={bar.id}
            position={[bar.lat, bar.lng]}
            icon={createCustomIcon(selectedBar?.id === bar.id)}
            eventHandlers={{
              click: () => onBarSelect(bar)
            }}
          >
            <Popup
              className="custom-popup"
              maxWidth={300}
              closeButton={false}
            >
              <div className="p-4 min-w-[280px]">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-xl text-gray-900 leading-tight">{bar.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isOpenNow(bar.hours)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isOpenNow(bar.hours) ? 'OPEN' : 'CLOSED'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">{bar.address}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">{bar.rating}</span>
                      <span className="text-sm text-gray-500">({bar.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-green-600">{formatPriceRange(bar.priceLevel)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{formatHours(bar.hours)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">SPECIALTIES</p>
                    <div className="flex flex-wrap gap-1">
                      {bar.tags.cocktails.slice(0, 4).map((cocktail, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {cocktail}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-3">
                      {bar.phone && (
                        <a
                          href={`tel:${bar.phone}`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-full hover:bg-blue-600 transition-colors"
                        >
                          📞 Call
                        </a>
                      )}
                      {bar.website && (
                        <a
                          href={bar.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-xs font-medium rounded-full hover:bg-gray-600 transition-colors"
                        >
                          🌐 Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Custom zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          onClick={() => {
            // Map zoom in functionality would go here
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => {
            // Map zoom out functionality would go here
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          −
        </button>
      </div>
    </div>
  );
};

export default MapView;