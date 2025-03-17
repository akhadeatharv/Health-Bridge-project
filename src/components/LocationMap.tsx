
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  const map = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | undefined>();

  // Sample hospital data - in a real app, this would come from an API
  const nearbyHospitals_: Hospital[] = [
    {
      name: "Central Hospital",
      location: [28.6139, 77.2090],
      bedAvailability: { total: 100, available: 25 },
      distance: "2.5 km"
    },
    {
      name: "City Medical Center",
      location: [28.6200, 77.2000],
      bedAvailability: { total: 150, available: 40 },
      distance: "3.1 km"
    },
    {
      name: "Community Health Center",
      location: [28.6100, 77.2150],
      bedAvailability: { total: 80, available: 15 },
      distance: "1.8 km"
    }
  ];

  const initializeMap = (center: [number, number]) => {
    // Clear any existing map instance first
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    if (!mapContainer.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create new map instance
    map.current = L.map(mapContainer.current).setView(center, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Add user location marker
    const userMarker = L.marker(center, {
      icon: L.divIcon({
        className: 'bg-red-500 w-4 h-4 rounded-full border-2 border-white',
        iconSize: [16, 16],
      })
    }).addTo(map.current);
    markersRef.current.push(userMarker);

    // Add hospital markers
    nearbyHospitals_.forEach(hospital => {
      const hospitalMarker = L.marker(hospital.location, {
        icon: L.divIcon({
          className: `bg-blue-500 w-4 h-4 rounded-full border-2 border-white ${
            selectedHospital === hospital.name ? 'ring-2 ring-blue-600' : ''
          }`,
          iconSize: [16, 16],
        })
      })
        .bindPopup(`
          <h3 class="font-bold">${hospital.name}</h3>
          <p>Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}</p>
          <p>Distance: ${hospital.distance}</p>
        `)
        .addTo(map.current);
      markersRef.current.push(hospitalMarker);
    });

    setNearbyHospitals(nearbyHospitals_);
  };

  const getCurrentLocation = () => {
    console.log("Get current location clicked");
    setIsLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location received:", latitude, longitude);
          setUserLocation([latitude, longitude]);
          
          // Update hospital distances based on user location
          const hospitals = nearbyHospitals_.map(hospital => ({
            ...hospital,
            distance: calculateDistance([latitude, longitude], hospital.location) + " km"
          }));
          
          // Initialize the map after we have the location
          initializeMap([latitude, longitude]);
          
          // Pass the hospitals to the parent component
          onLocationSelect(hospitals);
          
          toast({
            title: "Location Found",
            description: "Showing nearby hospitals with bed availability.",
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Error",
            description: "Could not get your location. Please check your GPS settings.",
            variant: "destructive",
          });
          setIsLoading(false);
          
          // Fallback to default location
          const defaultLocation: [number, number] = [28.6139, 77.2090]; // Default to New Delhi
          setUserLocation(defaultLocation);
          initializeMap(defaultLocation);
          onLocationSelect(nearbyHospitals_);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation not supported");
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setIsLoading(false);
      
      // Fallback to default location
      const defaultLocation: [number, number] = [28.6139, 77.2090]; // Default to New Delhi
      setUserLocation(defaultLocation);
      initializeMap(defaultLocation);
      onLocationSelect(nearbyHospitals_);
    }
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]): string => {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return (Math.sqrt(dx * dx + dy * dy) * 100).toFixed(1);
  };

  const handleHospitalSelect = (hospitalName: string) => {
    setSelectedHospital(hospitalName);
    const hospital = nearbyHospitals.find(h => h.name === hospitalName);
    if (hospital && map.current) {
      map.current.setView(hospital.location, 14);
      toast({
        title: "Hospital Selected",
        description: `Selected ${hospital.name}`,
      });
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, []);

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

      {nearbyHospitals.length > 0 && (
        <Select onValueChange={handleHospitalSelect} value={selectedHospital}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a hospital" />
          </SelectTrigger>
          <SelectContent className="z-[1000] bg-white">
            {nearbyHospitals.map((hospital) => (
              <SelectItem 
                key={hospital.name} 
                value={hospital.name}
                className="hover:bg-gray-100"
              >
                {hospital.name} - {hospital.distance} ({hospital.bedAvailability.available} beds)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default LocationMap;
