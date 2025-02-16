
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { MapPin } from 'lucide-react';

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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const initializeMap = (center: [number, number]) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your Mapbox token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 13
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat(center)
      .addTo(map.current);

    // Add hospital markers
    nearbyHospitals.forEach(hospital => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h3 class="font-bold">${hospital.name}</h3>
          <p>Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}</p>
          <p>Distance: ${hospital.distance}</p>
        `);

      new mapboxgl.Marker({ color: '#0000FF' })
        .setLngLat(hospital.location)
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.remove();
          }
          
          initializeMap([longitude, latitude]);
          
          // Update hospital distances based on user location
          const hospitals = nearbyHospitals.map(hospital => ({
            ...hospital,
            distance: calculateDistance([longitude, latitude], hospital.location) + " km"
          }));
          
          onLocationSelect(hospitals);
          
          toast({
            title: "Location Found",
            description: "Showing nearby hospitals with bed availability.",
          });
          setIsLoading(false);
        },
        (error) => {
          toast({
            title: "Error",
            description: "Could not get your location. Please check your GPS settings.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]): string => {
    // Simple distance calculation (this should be replaced with actual distance calculation)
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return (Math.sqrt(dx * dx + dy * dy) * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={getCurrentLocation} 
        disabled={isLoading}
        className="w-full"
      >
        <MapPin className="mr-2 h-4 w-4" />
        {isLoading ? "Getting Location..." : "Check Nearby Hospitals"}
      </Button>
      <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default LocationMap;
