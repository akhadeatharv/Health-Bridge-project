
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

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

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
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

      setIsMapInitialized(true);
      toast({
        title: "Map Initialized",
        description: "You can now click on the map to select your location.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid Mapbox token. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapboxToken) {
      toast({
        title: "Error",
        description: "Please enter a Mapbox token",
        variant: "destructive",
      });
      return;
    }
    initializeMap();
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]): string => {
    // Simple distance calculation (this should be replaced with actual distance calculation)
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return (Math.sqrt(dx * dx + dy * dy) * 100).toFixed(1);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isMapInitialized) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Please enter your Mapbox token to initialize the map. You can get one from{' '}
          <a 
            href="https://www.mapbox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </div>
        <form onSubmit={handleTokenSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your Mapbox token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Initialize Map</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default LocationMap;
