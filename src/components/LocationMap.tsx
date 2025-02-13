
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

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

const LocationMap = ({ onLocationSelect }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // You'll need to replace this with your Mapbox token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.2090, 28.6139], // Default center (New Delhi)
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Click handler to set location
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setUserLocation([lng, lat]);
      
      // Update marker
      if (marker.current) {
        marker.current.remove();
      }
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Show nearby hospitals
      const hospitals = nearbyHospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance([lng, lat], hospital.location) + " km"
      }));

      onLocationSelect(hospitals);
      
      toast({
        title: "Location Selected",
        description: "Showing nearby hospitals with bed availability.",
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const calculateDistance = (point1: [number, number], point2: [number, number]): string => {
    // Simple distance calculation (this should be replaced with actual distance calculation)
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return (Math.sqrt(dx * dx + dy * dy) * 100).toFixed(1);
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default LocationMap;
