
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, MapPin, BedDouble } from "lucide-react";

interface Hospital {
  name: string;
  location: [number, number];
  bedAvailability: {
    total: number;
    available: number;
  };
  distance: string;
}

const HospitalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hospital = location.state?.hospital as Hospital;

  if (!hospital) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">No Hospital Selected</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Button 
        onClick={() => navigate('/')} 
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
      </div>

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
