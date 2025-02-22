
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, MapPin, BedDouble, Clock, Users, LineChart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Hospital {
  name: string;
  location: [number, number];
  bedAvailability: {
    total: number;
    available: number;
  };
  distance: string;
  totalPatients?: number;
  averageWaitTime?: string;
  opdQueueTrend?: number[];
  departments?: Array<{
    name: string;
    nextAvailable: string;
    queueLength: number;
  }>;
}

const HospitalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hospital = location.state?.hospital as Hospital;

  console.log("Hospital details received:", hospital);

  if (!hospital) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">No Hospital Selected</h2>
          <Button onClick={() => navigate('/', { replace: true })} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const defaultDepartments = [
    { name: "Emergency", nextAvailable: "Immediate", queueLength: 5 },
    { name: "General Medicine", nextAvailable: "30 mins", queueLength: 15 },
    { name: "Pediatrics", nextAvailable: "1 hour", queueLength: 8 }
  ];

  return (
    <div className="p-8">
      <Button 
        onClick={() => navigate('/', { replace: true })} 
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-6">{hospital.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Hospital Name</h3>
              <p className="text-gray-600">{hospital.name}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Patients</h3>
              <p className="text-gray-600">{hospital.totalPatients || "150"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Average Wait Time</h3>
              <p className="text-gray-600">{hospital.averageWaitTime || "45 mins"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <MapPin className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Distance</h3>
              <p className="text-gray-600">{hospital.distance}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <BedDouble className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Bed Availability</h3>
              <p className="text-gray-600">
                {hospital.bedAvailability.available} available out of {hospital.bedAvailability.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <LineChart className="h-8 w-8 text-indigo-500" />
            <div>
              <h3 className="text-lg font-semibold">OPD Queue Trend</h3>
              <p className="text-gray-600">Currently {hospital.opdQueueTrend?.[0] || "25"} patients</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Department Status</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Next Available</TableHead>
              <TableHead>Queue Length</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(hospital.departments || defaultDepartments).map((dept) => (
              <TableRow key={dept.name}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>{dept.nextAvailable}</TableCell>
                <TableCell>{dept.queueLength} patients</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Location Details</h2>
        <p className="text-gray-600">
          Coordinates: {hospital.location[0]}, {hospital.location[1]}
        </p>
      </Card>
    </div>
  );
};

export default HospitalDetails;

