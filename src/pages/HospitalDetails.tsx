
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Clock, Users, Bed } from "lucide-react";
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
  waitTime?: string;
  opdQueue?: number;
  departments?: Array<{
    name: string;
    doctors: number;
    patients: number;
  }>;
}

const HospitalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hospital = location.state?.hospital as Hospital | undefined;

  // Debug
  console.log("Hospital data in details page:", hospital);

  const handleBackClick = () => {
    navigate('/', { replace: true });
  };

  if (!hospital) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">No hospital selected</h2>
        <Button onClick={handleBackClick}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4" 
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{hospital.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-500" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Coordinates: {hospital.location[0].toFixed(4)}, {hospital.location[1].toFixed(4)}
            </p>
            <p className="font-medium mt-1">Distance: {hospital.distance}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bed className="h-5 w-5 mr-2 text-green-500" />
              Bed Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Total Beds:</span>
              <span className="font-medium">{hospital.bedAvailability.total}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span>Available Beds:</span>
              <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                hospital.bedAvailability.available > 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {hospital.bedAvailability.available}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-500" />
              Wait Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Current Wait:</span>
              <span className="font-medium">{hospital.waitTime || "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span>OPD Queue:</span>
              <span className="font-medium">{hospital.opdQueue || "Unknown"} patients</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {hospital.totalPatients && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              Patient Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{hospital.totalPatients}</p>
            <p className="text-gray-500">Total patients currently registered</p>
          </CardContent>
        </Card>
      )}

      {hospital.departments && hospital.departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Department Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Doctors Available</TableHead>
                  <TableHead>Patients Waiting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospital.departments.map((dept, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.doctors}</TableCell>
                    <TableCell>{dept.patients}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HospitalDetails;
