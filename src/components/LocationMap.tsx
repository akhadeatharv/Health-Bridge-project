import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { MapPin, Locate, Navigation } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Fixing the Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon issues
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

const LocationMap = ({ onLocationSelect }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | undefined>();

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
    console.log("Initializing map with center:", center);
    
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    if (!mapContainer.current) {
      console.error("Map container ref is null");
      return;
    }

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    try {
      map.current = L.map(mapContainer.current).setView(center, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.current);

      console.log("Map initialized successfully");

      const userMarker = L.marker(center).addTo(map.current);
      userMarker.bindPopup("You are here").openPopup();
      markersRef.current.push(userMarker);

      nearbyHospitals_.forEach(hospital => {
        const hospitalMarker = L.marker(hospital.location)
          .bindPopup(`
            <h3 class="font-bold">${hospital.name}</h3>
            <p>Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}</p>
            <p>Distance: ${hospital.distance}</p>
          `)
          .addTo(map.current!);
        markersRef.current.push(hospitalMarker);
      });

      setNearbyHospitals(nearbyHospitals_);
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize map. Please try again.");
    }
  };

  const getCurrentLocation = () => {
    console.log("Get current location clicked");
    setIsLoading(true);
    setError(null);
    
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          console.error("Geolocation permission denied");
          setError("Location permission denied. Please enable GPS in your browser settings.");
          toast({
            title: "Permission Denied",
            description: "Please enable location services for this site in your browser settings.",
            variant: "destructive",
          });
          setIsLoading(false);
          
          const defaultLocation: [number, number] = [28.6139, 77.2090]; // Default to New Delhi
          setUserLocation(defaultLocation);
          initializeMap(defaultLocation);
          onLocationSelect(nearbyHospitals_);
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Location received:", latitude, longitude);
            setUserLocation([latitude, longitude]);
            
            const hospitals = nearbyHospitals_.map(hospital => ({
              ...hospital,
              distance: calculateDistance([latitude, longitude], hospital.location) + " km"
            }));
            
            initializeMap([latitude, longitude]);
            
            onLocationSelect(hospitals);
            
            toast({
              title: "Location Found",
              description: "Showing nearby hospitals with bed availability.",
            });
            setIsLoading(false);
          },
          (error) => {
            console.error("Geolocation error:", error);
            let errorMessage = "Could not get your location. ";
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += "Location permission denied. Please enable GPS in your browser settings.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                errorMessage += "Request timed out. Please try again.";
                break;
              default:
                errorMessage += "Please check your GPS settings.";
            }
            
            setError(errorMessage);
            toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
            });
            setIsLoading(false);
            
            const defaultLocation: [number, number] = [28.6139, 77.2090]; // Default to New Delhi
            setUserLocation(defaultLocation);
            initializeMap(defaultLocation);
            onLocationSelect(nearbyHospitals_);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        );
      });
    } else {
      console.error("Geolocation not supported");
      setError("Geolocation is not supported by your browser.");
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setIsLoading(false);
      
      const defaultLocation: [number, number] = [28.6139, 77.2090]; // Default to New Delhi
      setUserLocation(defaultLocation);
      initializeMap(defaultLocation);
      onLocationSelect(nearbyHospitals_);
    }
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]): string => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const handleGetDirections = (hospital: Hospital) => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to get directions.",
        variant: "destructive",
      });
      return;
    }

    const { location } = hospital;
    const url = `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${location[0]},${location[1]}`;
    window.open(url, '_blank');
  };

  const handleHospitalSelect = (hospitalName: string) => {
    setSelectedHospital(hospitalName);
    const hospital = nearbyHospitals.find(h => h.name === hospitalName);
    if (hospital && map.current) {
      map.current.setView(hospital.location, 14);
      
      markersRef.current.forEach(marker => {
        const popup = marker.getPopup();
        if (popup) {
          const content = popup.getContent();
          if (typeof content === 'string' && content.indexOf(hospital.name) !== -1) {
            marker.openPopup();
          }
        }
      });
      
      toast({
        title: "Hospital Selected",
        description: `Selected ${hospital.name}`,
      });
    }
  };

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
        <Locate className="mr-2 h-4 w-4" />
        {isLoading ? "Getting Location..." : "Check Nearby Hospitals"}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapContainer} className="w-full h-full" />
      </div>

      {nearbyHospitals.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Available Beds</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nearbyHospitals.map((hospital) => (
                <TableRow key={hospital.name}>
                  <TableCell className="font-medium">{hospital.name}</TableCell>
                  <TableCell>{hospital.distance}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      hospital.bedAvailability.available > 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {hospital.bedAvailability.available}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGetDirections(hospital)}
                      className="flex items-center gap-2"
                    >
                      <Navigation className="h-4 w-4" />
                      Get Directions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Select onValueChange={handleHospitalSelect} value={selectedHospital}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a hospital" />
            </SelectTrigger>
            <SelectContent className="z-[1000] bg-white">
              {nearbyHospitals.map((hospital) => (
                <SelectItem 
                  key={hospital.name} 
                  value={hospital.name}
                  className="flex items-center justify-between hover:bg-gray-100 pr-8"
                >
                  <div>
                    {hospital.name} - {hospital.distance} ({hospital.bedAvailability.available} beds)
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(hospital);
                    }}
                    className="ml-2"
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
};

export default LocationMap;
