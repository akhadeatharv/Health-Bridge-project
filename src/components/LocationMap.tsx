import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Locate } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance } from '@/utils/distance';
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
  const googleMap = useRef<google.maps.Map | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const { userLocation, isLoading, error, getCurrentLocation } = useLocation();
  const googleMarkersRef = useRef<google.maps.Marker[]>([]);
  const leafletMarkersRef = useRef<L.Marker[]>([]);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  
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

  const initializeGoogleMap = async (center: [number, number]) => {
    console.log("Trying to initialize Google Maps with center:", center);
    
    if (!mapContainer.current) {
      console.error("Map container ref is null");
      return false;
    }

    // Clear existing markers
    googleMarkersRef.current.forEach(marker => marker.setMap(null));
    googleMarkersRef.current = [];
    
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
      
      googleMap.current = new google.maps.Map(mapContainer.current, {
        center: { lat: center[0], lng: center[1] },
        zoom: 13,
      });

      console.log("Google Maps initialized successfully");

      // Add user marker
      const userMarker = new google.maps.Marker({
        position: { lat: center[0], lng: center[1] },
        map: googleMap.current,
        title: "You are here",
      });

      const userInfoWindow = new google.maps.InfoWindow({
        content: "You are here"
      });
      userInfoWindow.open(googleMap.current, userMarker);
      googleMarkersRef.current.push(userMarker);

      if (selectedHospital) {
        // Add hospital marker
        const hospitalMarker = new google.maps.Marker({
          position: { lat: selectedHospital.location[0], lng: selectedHospital.location[1] },
          map: googleMap.current,
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
          hospitalInfoWindow.open(googleMap.current, hospitalMarker);
        });
        hospitalInfoWindow.open(googleMap.current, hospitalMarker);
        googleMarkersRef.current.push(hospitalMarker);
        
        // Create directions between user location and hospital
        directionsRenderer.current = new google.maps.DirectionsRenderer({
          suppressMarkers: true // We already have custom markers
        });
        directionsRenderer.current.setMap(googleMap.current);
        
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
        googleMap.current.fitBounds(bounds);
      } else {
        // Add all hospital markers
        nearbyHospitals_.forEach(hospital => {
          const hospitalMarker = new google.maps.Marker({
            position: { lat: hospital.location[0], lng: hospital.location[1] },
            map: googleMap.current,
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
            infoWindow.open(googleMap.current, hospitalMarker);
          });
          
          googleMarkersRef.current.push(hospitalMarker);
        });
      }
      
      setMapError(null);
      return true;
    } catch (err) {
      console.error("Google Maps initialization failed:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('BillingNotEnabledMapError') || errorMessage.includes('billing')) {
        setMapError("Google Maps requires billing to be enabled. Using OpenStreetMap as fallback.");
        toast({
          title: "Google Maps Billing Required",
          description: "Enable billing in Google Cloud Console to use Google Maps. Using OpenStreetMap instead.",
          variant: "destructive",
        });
      } else {
        setMapError("Google Maps failed to load. Using OpenStreetMap as fallback.");
        toast({
          title: "Google Maps Error",
          description: "Failed to load Google Maps. Using OpenStreetMap instead.",
          variant: "destructive",
        });
      }
      
      return false;
    }
  };

  const initializeLeafletMap = (center: [number, number]) => {
    console.log("Initializing Leaflet map with center:", center);
    
    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
    }
    
    if (!mapContainer.current) {
      console.error("Map container ref is null");
      return;
    }

    leafletMarkersRef.current.forEach(marker => marker.remove());
    leafletMarkersRef.current = [];

    try {
      leafletMap.current = L.map(mapContainer.current).setView(center, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMap.current);

      console.log("Leaflet map initialized successfully");

      const userMarker = L.marker(center).addTo(leafletMap.current);
      userMarker.bindPopup("You are here").openPopup();
      leafletMarkersRef.current.push(userMarker);

      if (selectedHospital) {
        const hospitalMarker = L.marker(selectedHospital.location)
          .bindPopup(`
            <h3 class="font-bold">${selectedHospital.name}</h3>
            <p>Available beds: ${selectedHospital.bedAvailability.available}/${selectedHospital.bedAvailability.total}</p>
            <p>Distance: ${selectedHospital.distance}</p>
          `)
          .addTo(leafletMap.current);
        hospitalMarker.openPopup();
        leafletMarkersRef.current.push(hospitalMarker);
        
        // Create a line between user location and hospital
        const polyline = L.polyline([center, selectedHospital.location], {
          color: 'blue',
          weight: 3,
          opacity: 0.7
        }).addTo(leafletMap.current);
        
        // Fit bounds to show both markers
        const bounds = L.latLngBounds([center, selectedHospital.location]);
        leafletMap.current.fitBounds(bounds, { padding: [50, 50] });
      } else {
        nearbyHospitals_.forEach(hospital => {
          const hospitalMarker = L.marker(hospital.location)
            .bindPopup(`
              <h3 class="font-bold">${hospital.name}</h3>
              <p>Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}</p>
              <p>Distance: ${hospital.distance}</p>
            `)
            .addTo(leafletMap.current!);
          leafletMarkersRef.current.push(hospitalMarker);
        });
      }
    } catch (err) {
      console.error("Error initializing Leaflet map:", err);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please try again.",
        variant: "destructive",
      });
    }
  };

  const initializeMap = async (center: [number, number]) => {
    if (useGoogleMaps) {
      const googleSuccess = await initializeGoogleMap(center);
      if (!googleSuccess) {
        setUseGoogleMaps(false);
        initializeLeafletMap(center);
      }
    } else {
      initializeLeafletMap(center);
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
      googleMarkersRef.current.forEach(marker => marker.setMap(null));
      googleMarkersRef.current = [];
      leafletMarkersRef.current.forEach(marker => marker.remove());
      leafletMarkersRef.current = [];
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
      }
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
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

      {mapError && (
        <Alert variant="destructive">
          <AlertDescription>
            {mapError}
            <br />
            <a 
              href="https://console.cloud.google.com/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Enable billing in Google Cloud Console
            </a> to use Google Maps.
          </AlertDescription>
        </Alert>
      )}

      <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default LocationMap;
