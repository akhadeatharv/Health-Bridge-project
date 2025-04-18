
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from './ui/button';
import { Navigation } from 'lucide-react';
import { Hospital } from '@/types/hospital';

interface HospitalSelectorProps {
  hospitals: Hospital[];
  selectedHospital: string | undefined;
  userLocation: [number, number] | null;
  onHospitalSelect: (hospitalName: string) => void;
  onGetDirections: (hospital: Hospital) => void;
}

const HospitalSelector = ({
  hospitals,
  selectedHospital,
  userLocation,
  onHospitalSelect,
  onGetDirections
}: HospitalSelectorProps) => {
  return (
    <Select onValueChange={onHospitalSelect} value={selectedHospital}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a hospital" />
      </SelectTrigger>
      <SelectContent className="z-[1000] bg-white">
        {hospitals.map((hospital) => (
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
                onGetDirections(hospital);
              }}
              disabled={!userLocation}
              className="ml-2"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default HospitalSelector;
