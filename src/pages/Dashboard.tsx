import DashboardStats from "@/components/DashboardStats";
import LocationMap from "@/components/LocationMap";
import { Card } from "@/components/ui/card";
import { Hospital } from "@/types/hospital";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HospitalsTable from "@/components/HospitalsTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    // Enhance hospitals with additional mock data
    const enhancedHospitals = hospitals.map(hospital => ({
      ...hospital,
      totalPatients: Math.floor(Math.random() * 200) + 100,
      waitTime: `${Math.floor(Math.random() * 60) + 15} minutes`,
      opdQueue: Math.floor(Math.random() * 30) + 5,
      departments: [
        {
          name: "Emergency",
          doctors: Math.floor(Math.random() * 5) + 2,
          patients: Math.floor(Math.random() * 15) + 3
        },
        {
          name: "General Medicine",
          doctors: Math.floor(Math.random() * 7) + 3,
          patients: Math.floor(Math.random() * 20) + 5
        },
        {
          name: "Pediatrics",
          doctors: Math.floor(Math.random() * 4) + 1,
          patients: Math.floor(Math.random() * 10) + 2
        }
      ]
    }));
    
    setNearbyHospitals(enhancedHospitals);
  };

  const handleGetDirections = (hospital: Hospital) => {
    if (!hospital.location) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location[0]},${hospital.location[1]}`;
    window.open(url, '_blank');
  };

  const handleHospitalClick = (hospital: Hospital) => {
    console.log("Selected hospital:", hospital);
    navigate('/hospital-details', { 
      state: { hospital },
      replace: true 
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
              <HospitalsTable 
                hospitals={nearbyHospitals}
                userLocation={null}
                onGetDirections={handleGetDirections}
              />
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
