
import { Button } from './ui/button';
import { Navigation } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hospital } from '@/types/hospital';

interface HospitalsTableProps {
  hospitals: Hospital[];
  userLocation: [number, number] | null;
  onGetDirections: (hospital: Hospital) => void;
}

const HospitalsTable = ({ hospitals, userLocation, onGetDirections }: HospitalsTableProps) => {
  return (
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
        {hospitals.map((hospital) => (
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
                onClick={() => onGetDirections(hospital)}
                disabled={!userLocation}
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
  );
};

export default HospitalsTable;
