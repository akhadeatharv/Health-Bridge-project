
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { MapPin } from 'lucide-react';

export interface Hospital {
  id: string;
  name: string;
  location: [number, number];
  bedAvailability: {
    total: number;
    available: number;
  };
  distance: string;
  stats: {
    totalPatients: number;
    averageWaitTime: string;
    bedOccupancy: number;
    patientTrend: number;
    departments: {
      name: string;
      nextAvailable: string;
      queueLength: number;
    }[];
    queueData: {
      time: string;
      patients: number;
    }[];
    bedStatus: {
      ward: string;
      total: number;
      occupied: number;
      available: number;
    }[];
  };
}

interface LocationMapProps {
  onHospitalSelect: (hospital: Hospital) => void;
}

const LocationMap = ({ onHospitalSelect }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Sample hospital data with extended information
  const hospitals: Hospital[] = [
    {
      id: "1",
      name: "Central Hospital",
      location: [28.6139, 77.2090],
      bedAvailability: { total: 100, available: 25 },
      distance: "2.5 km",
      stats: {
        totalPatients: 248,
        averageWaitTime: "28 min",
        bedOccupancy: 75,
        patientTrend: 12,
        departments: [
          { name: "Cardiology", nextAvailable: "2 days", queueLength: 15 },
          { name: "Orthopedics", nextAvailable: "3 days", queueLength: 12 },
          { name: "Pediatrics", nextAvailable: "1 day", queueLength: 8 }
        ],
        queueData: [
          { time: '9:00', patients: 15 },
          { time: '10:00', patients: 25 },
          { time: '11:00', patients: 42 },
          { time: '12:00', patients: 35 },
          { time: '13:00', patients: 28 },
          { time: '14:00', patients: 30 }
        ],
        bedStatus: [
          { ward: "General Ward", total: 100, occupied: 75, available: 25 },
          { ward: "ICU", total: 20, occupied: 18, available: 2 },
          { ward: "Maternity", total: 30, occupied: 22, available: 8 }
        ]
      }
    },
    {
      id: "2",
      name: "City Medical Center",
      location: [28.6200, 77.2000],
      bedAvailability: { total: 150, available: 40 },
      distance: "3.1 km",
      stats: {
        totalPatients: 312,
        averageWaitTime: "35 min",
        bedOccupancy: 80,
        patientTrend: -5,
        departments: [
          { name: "Cardiology", nextAvailable: "1 day", queueLength: 10 },
          { name: "Orthopedics", nextAvailable: "2 days", queueLength: 8 },
          { name: "Pediatrics", nextAvailable: "same day", queueLength: 5 }
        ],
        queueData: [
          { time: '9:00', patients: 20 },
          { time: '10:00', patients: 30 },
          { time: '11:00', patients: 45 },
          { time: '12:00', patients: 40 },
          { time: '13:00', patients: 35 },
          { time: '14:00', patients: 25 }
        ],
        bedStatus: [
          { ward: "General Ward", total: 150, occupied: 110, available: 40 },
          { ward: "ICU", total: 25, occupied: 20, available: 5 },
          { ward: "Maternity", total: 35, occupied: 25, available: 10 }
        ]
      }
    }
  ];

  const calculateDistance = (point1: [number, number], point2: [number, number]): string => {
    const R = 6371; // Earth's radius in kilometers
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

  const initializeMap = (center: [number, number]) => {
    if (!mapContainer.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Initialize or update map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(center, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.current);
    } else {
      map.current.setView(center, 13);
    }

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'bg-red-500 w-4 h-4 rounded-full border-2 border-white',
        iconSize: [16, 16],
        html: '<div class="w-full h-full bg-red-500 rounded-full border-2 border-white"></div>'
      });

      const userMarker = L.marker(userLocation, { icon: userIcon })
        .addTo(map.current)
        .bindPopup('Your Location')
        .openPopup();
      markersRef.current.push(userMarker);
    }

    // Add hospital markers
    hospitals.forEach(hospital => {
      const distance = userLocation ? 
        `${calculateDistance(userLocation, hospital.location)} km` : 
        hospital.distance;

      const hospitalIcon = L.divIcon({
        className: 'bg-blue-500 w-4 h-4 rounded-full border-2 border-white cursor-pointer',
        iconSize: [16, 16],
        html: '<div class="w-full h-full bg-blue-500 rounded-full border-2 border-white"></div>'
      });

      const hospitalMarker = L.marker(hospital.location, {
        icon: hospitalIcon
      }).addTo(map.current!);

      const popupContent = document.createElement('div');
      popupContent.className = 'hospital-popup';
      popupContent.innerHTML = `
        <div class="p-2">
          <h3 class="font-bold text-lg mb-2">${hospital.name}</h3>
          <p class="mb-1">Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}</p>
          <p class="mb-2">Distance: ${distance}</p>
          <button class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Select Hospital
          </button>
        </div>
      `;

      const popup = L.popup({
        maxWidth: 300,
        className: 'hospital-popup'
      }).setContent(popupContent);

      hospitalMarker.bindPopup(popup);

      const selectButton = popupContent.querySelector('button');
      if (selectButton) {
        selectButton.addEventListener('click', () => {
          const updatedHospital = {
            ...hospital,
            distance
          };
          onHospitalSelect(updatedHospital);
          hospitalMarker.closePopup();
          toast({
            title: "Hospital Selected",
            description: `You've selected ${hospital.name}`,
          });
        });
      }

      markersRef.current.push(hospitalMarker);
    });
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation: [number, number] = [latitude, longitude];
          setUserLocation(newLocation);
          initializeMap(newLocation);
          setIsLoading(false);
          toast({
            title: "Location Found",
            description: "Showing nearby hospitals",
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Could not get your location. Using default view.",
            variant: "destructive",
          });
          initializeMap(hospitals[0].location);
          setIsLoading(false);
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      initializeMap(hospitals[0].location);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize with first hospital's location
    initializeMap(hospitals[0].location);

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
        {isLoading ? "Getting Location..." : "Find Nearby Hospitals"}
      </Button>
      <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Click on a hospital marker to view details and select it
      </p>
    </div>
  );
};

export default LocationMap;
