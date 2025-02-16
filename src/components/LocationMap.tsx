
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

  const initializeMap = () => {
    if (!mapContainer.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Initialize map centered on the first hospital
    const centerHospital = hospitals[0];
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([centerHospital.location[0], centerHospital.location[1]], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.current);
    }

    // Add hospital markers
    hospitals.forEach(hospital => {
      const customIcon = L.divIcon({
        className: 'bg-blue-500 w-4 h-4 rounded-full border-2 border-white cursor-pointer',
        iconSize: [16, 16],
        html: '<div class="w-full h-full bg-blue-500 rounded-full border-2 border-white"></div>'
      });

      const hospitalMarker = L.marker([hospital.location[0], hospital.location[1]], {
        icon: customIcon
      }).addTo(map.current!);

      // Create a custom popup with a select button
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div class="p-2">
          <h3 class="font-bold">${hospital.name}</h3>
          <p>Available beds: ${hospital.bedAvailability.available}/${hospital.bedAvailability.total}</p>
          <p>Distance: ${hospital.distance}</p>
          <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Select Hospital</button>
        </div>
      `;

      const popup = L.popup().setContent(popupContent);
      hospitalMarker.bindPopup(popup);

      // Add click handler for the select button
      const selectButton = popupContent.querySelector('button');
      if (selectButton) {
        selectButton.addEventListener('click', () => {
          onHospitalSelect(hospital);
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

  useEffect(() => {
    initializeMap();
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
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
