
import DashboardStats from "@/components/DashboardStats";
import LocationMap from "@/components/LocationMap";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Hospital {
  name: string;
  location: [number, number];
  bedAvailability: {
    total: number;
    available: number;
  };
  distance: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  
  const departments = [{
    name: "Cardiology",
    nextAvailable: "2 days",
    queueLength: 15
  }, {
    name: "Orthopedics",
    nextAvailable: "3 days",
    queueLength: 12
  }, {
    name: "Pediatrics",
    nextAvailable: "1 day",
    queueLength: 8
  }];
  
  const bedStatus = [{
    ward: "General Ward",
    total: 100,
    occupied: 75,
    available: 25
  }, {
    ward: "ICU",
    total: 20,
    occupied: 18,
    available: 2
  }, {
    ward: "Maternity",
    total: 30,
    occupied: 22,
    available: 8
  }];

  const handleLocationSelect = (hospitals: Hospital[]) => {
    setNearbyHospitals(hospitals);
  };

  const handleHospitalClick = (hospital: Hospital) => {
    navigate('/hospital-details', { 
      state: { hospital }
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Hospital Dashboard</h1>
      <DashboardStats />
      
      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Find Nearby Hospitals</h2>
          <p className="text-gray-500 mb-4">Click on the map to select your location and view nearby hospitals.</p>
          <LocationMap onLocationSelect={handleLocationSelect} />
          
          {nearbyHospitals.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Nearby Hospitals</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital Name</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Total Beds</TableHead>
                    <TableHead>Available Beds</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nearbyHospitals.map(hospital => (
                    <TableRow 
                      key={hospital.name}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleHospitalClick(hospital)}
                    >
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.distance}</TableCell>
                      <TableCell>{hospital.bedAvailability.total}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          hospital.bedAvailability.available > 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {hospital.bedAvailability.available}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Department Queue Status</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Next Available</TableHead>
                <TableHead>Queue Length</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map(dept => (
                <TableRow key={dept.name}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{dept.nextAvailable}</TableCell>
                  <TableCell>{dept.queueLength} patients</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Bed Availability</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward</TableHead>
                <TableHead>Total Beds</TableHead>
                <TableHead>Occupied</TableHead>
                <TableHead>Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bedStatus.map(ward => (
                <TableRow key={ward.ward}>
                  <TableCell className="font-medium">{ward.ward}</TableCell>
                  <TableCell>{ward.total}</TableCell>
                  <TableCell>{ward.occupied}</TableCell>
                  <TableCell>{ward.available}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
