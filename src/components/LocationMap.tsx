import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Locate } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance } from '@/utils/distance';
import { Hospital } from '@/types/hospital';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface LocationMapProps {
  onLocationSelect: (hospitals: Hospital[]) => void;
  selectedHospital?: Hospital;
}

const LocationMap = ({ onLocationSelect, selectedHospital }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const { userLocation, isLoading, error, getCurrentLocation } = useLocation();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  
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

  const initializeMap = async (center: [number, number]) => {
    console.log("Initializing map with center:", center);
    
    if (!mapContainer.current) {
      console.error("Map container ref is null");
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Clear existing directions
    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(null);
    }

    try {
      const loader = new Loader({
        apiKey: "AIzaSyCeKHmAC5EHlPZazIHDdalvLWjs_rx2eqo",
        version: "weekly",
        libraries: ["places"]
      });

      await loader.load();
      
      map.current = new google.maps.Map(mapContainer.current, {
        center: { lat: center[0], lng: center[1] },
        zoom: 13,
      });

      console.log("Map initialized successfully");

      // Add user marker
      const userMarker = new google.maps.Marker({
        position: { lat: center[0], lng: center[1] },
        map: map.current,
        title: "You are here",
      });

      const userInfoWindow = new google.maps.InfoWindow({
        content: "You are here"
      });
      userInfoWindow.open(map.current, userMarker);
      markersRef.current.push(userMarker);

      if (selectedHospital) {
        // Add hospital marker
        const hospitalMarker = new google.maps.Marker({
          position: { lat: selectedHospital.location[0], lng: selectedHospital.location[1] },
          map: map.current,
          title: selectedHospital.name,
        });

        const hospitalInfoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3 style="font-weight: bold; margin: 0 0 8px 0;">${selectedHospital.name}</h3>
              <p style="margin: 4px 0;">Available beds: ${selectedHospital.bedAvailability.available}/${selectedHospital.bedAvailability.total}</p>
              <p style="margin: 4px 0;">Distance: ${selectedHospital.distance}</p>
            </div>
          `
        });
        
        hospitalMarker.addListener('click', () => {
          hospitalInfoWindow.open(map.current, hospitalMarker);
        });
        hospitalInfoWindow.open(map.current, hospitalMarker);
        markersRef.current.push(hospitalMarker);
        
        // Create directions between user location and hospital
        directionsRenderer.current = new google.maps.DirectionsRenderer({
          suppressMarkers: true // We already have custom markers
        });
        directionsRenderer.current.setMap(map.current);
        
        const directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin: { lat: center[0], lng: center[1] },
          destination: { lat: selectedHospital.location[0], lng: selectedHospital.location[1] },
          travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === 'OK' && directionsRenderer.current) {
            directionsRenderer.current.setDirections(result);
          }
        });
        
        // Fit bounds to show both markers
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: center[0], lng: center[1] });
        bounds.extend({ lat: selectedHospital.location[0], lng: selectedHospital.location[1] });
        map.current.fitBounds(bounds);
      } else {
        // Add all hospital markers
        nearbyHospitals_.forEach(hospital => {
          const hospitalMarker = new google.maps.Marker({
            position: { lat: hospital.location[0], lng: hospital.location[1] },
            map: map.current,
            title: hospital.name,
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3 style="font-weight: bold; margin: 0 0 8px 0;">${hospital.name}</h3>
                <p style="margin: 4px 0;">Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}</p>
                <p style="margin: 4px 0;">Distance: ${hospital.distance}</p>
              </div>
            `
          });

          hospitalMarker.addListener('click', () => {
            infoWindow.open(map.current, hospitalMarker);
          });
          
          markersRef.current.push(hospitalMarker);
        });
      }
    } catch (err) {
      console.error("Error initializing map:", err);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please try again.",
        variant: "destructive",
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
  }, [userLocation, selectedHospital]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
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
    </div>
  );
};

export default LocationMap;
