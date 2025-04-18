import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Locate } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance } from '@/utils/distance';
import HospitalsTable from './HospitalsTable';
import HospitalSelector from './HospitalSelector';
import { Hospital } from '@/types/hospital';

// Fix Leaflet's default icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  onLocationSelect: (hospitals: Hospital[]) => void;
}

const LocationMap = ({ onLocationSelect }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const { userLocation, isLoading, error, getCurrentLocation } = useLocation();
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
      toast({
        title: "Error",
        description: "Failed to initialize map. Please try again.",
        variant: "destructive",
      });
    }
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
    if (userLocation) {
      const hospitals = nearbyHospitals_.map(hospital => ({
        ...hospital,
        distance: calculateDistance(userLocation, hospital.location) + " km"
      }));
      
      initializeMap(userLocation);
      onLocationSelect(hospitals);
    }
  }, [userLocation]);

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
          <HospitalsTable 
            hospitals={nearbyHospitals}
            userLocation={userLocation}
            onGetDirections={handleGetDirections}
          />
          <HospitalSelector
            hospitals={nearbyHospitals}
            selectedHospital={selectedHospital}
            userLocation={userLocation}
            onHospitalSelect={handleHospitalSelect}
            onGetDirections={handleGetDirections}
          />
        </>
      )}
    </div>
  );
};

export default LocationMap;
