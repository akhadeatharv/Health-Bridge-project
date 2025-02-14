
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from './ui/use-toast';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Hospital {
  name: string;
  location: [number, number];
  bedAvailability: {
    total: number;
    available: number;
  };
  distance: string;
}

interface LocationMapProps {
  onLocationSelect: (hospitals: Hospital[]) => void;
}

// Component to handle map clicks
const MapEvents = ({ onLocationSelect }: { onLocationSelect: (hospitals: Hospital[]) => void }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      // Sample hospital data - in a real app, this would come from an API
      const nearbyHospitals: Hospital[] = [
        {
          name: "Central Hospital",
          location: [77.2090, 28.6139],
          bedAvailability: { total: 100, available: 25 },
          distance: "2.5 km"
        },
        {
          name: "City Medical Center",
          location: [77.2000, 28.6200],
          bedAvailability: { total: 150, available: 40 },
          distance: "3.1 km"
        },
        {
          name: "Community Health Center",
          location: [77.2150, 28.6100],
          bedAvailability: { total: 80, available: 15 },
          distance: "1.8 km"
        }
      ];

      // Calculate distances and update markers
      const hospitalsWithDistance = nearbyHospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance([lng, lat], hospital.location) + " km"
      }));

      // Update markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add user location marker
      L.marker([lat, lng]).addTo(map);

      // Add hospital markers
      hospitalsWithDistance.forEach(hospital => {
        L.marker(hospital.location)
          .bindPopup(`
            <b>${hospital.name}</b><br/>
            Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}
          `)
          .addTo(map);
      });

      onLocationSelect(hospitalsWithDistance);
      
      toast({
        title: "Location Selected",
        description: "Showing nearby hospitals with bed availability.",
      });
    },
  });

  return null;
};

const calculateDistance = (point1: [number, number], point2: [number, number]): string => {
  // Simple distance calculation (this should be replaced with actual distance calculation)
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];
  return (Math.sqrt(dx * dx + dy * dy) * 100).toFixed(1);
};

const LocationMap = ({ onLocationSelect }: LocationMapProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[28.6139, 77.2090]} // Default center (New Delhi)
        zoom={12}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;
