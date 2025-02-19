
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { MapPin } from 'lucide-react';
import { Card } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Sample hospital data - in a real app, this would come from an API
  const allHospitals: Hospital[] = [
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
    },
    {
      name: "Metro Hospital",
      location: [28.6300, 77.2200],
      bedAvailability: { total: 120, available: 30 },
      distance: "4.2 km"
    }
  ];

  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const initializeMap = (center: [number, number]) => {
    if (!mapContainer.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Initialize or update map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([center[0], center[1]], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.current);
    } else {
      map.current.setView([center[0], center[1]], 13);
    }

    // Add user location marker
    const userMarker = L.marker([center[0], center[1]], {
      icon: L.divIcon({
        className: 'bg-red-500 w-4 h-4 rounded-full border-2 border-white',
        iconSize: [16, 16],
      })
    }).addTo(map.current);
    markersRef.current.push(userMarker);

    // Filter and add hospital markers within 25km radius
    const hospitalsWithinRadius = allHospitals.map(hospital => {
      const distance = calculateDistance(center, hospital.location);
      return {
        ...hospital,
        distance: distance.toFixed(1) + " km"
      };
    }).filter(hospital => parseFloat(hospital.distance) <= 25);

    hospitalsWithinRadius.forEach(hospital => {
      const hospitalMarker = L.marker([hospital.location[0], hospital.location[1]], {
        icon: L.divIcon({
          className: 'bg-blue-500 w-4 h-4 rounded-full border-2 border-white',
          iconSize: [16, 16],
        })
      })
        .bindPopup(`
          <h3 class="font-bold">${hospital.name}</h3>
          <p>Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}</p>
          <p>Distance: ${hospital.distance}</p>
        `)
        .addTo(map.current!);
      markersRef.current.push(hospitalMarker);
    });

    setNearbyHospitals(hospitalsWithinRadius);
    onLocationSelect(hospitalsWithinRadius);
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          initializeMap([latitude, longitude]);
          
          toast({
            title: "Location Found",
            description: "Showing hospitals within 25km radius.",
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

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
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
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Hospitals within 25km radius</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Available Beds</TableHead>
                <TableHead>Total Beds</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nearbyHospitals
                .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
                .map((hospital) => (
                  <TableRow key={hospital.name}>
                    <TableCell className="font-medium">{hospital.name}</TableCell>
                    <TableCell>{hospital.distance}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        hospital.bedAvailability.available > 10 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {hospital.bedAvailability.available}
                      </span>
                    </TableCell>
                    <TableCell>{hospital.bedAvailability.total}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default LocationMap;
