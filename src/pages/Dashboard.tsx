
import { useState } from "react";
import DashboardStats from "@/components/DashboardStats";
import LocationMap from "@/components/LocationMap";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Hospital } from "@/components/LocationMap";

const Dashboard = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Hospital Dashboard</h1>
      
      <div className="mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select a Hospital</h2>
          <p className="text-gray-500 mb-4">Click on a hospital marker on the map to view its detailed information.</p>
          <LocationMap onHospitalSelect={handleHospitalSelect} />
        </Card>
      </div>

      {selectedHospital && (
        <>
          <h2 className="text-2xl font-semibold mb-6">{selectedHospital.name} Statistics</h2>
          <DashboardStats
            totalPatients={selectedHospital.stats.totalPatients}
            bedOccupancy={selectedHospital.stats.bedOccupancy}
            averageWaitTime={selectedHospital.stats.averageWaitTime}
            patientTrend={selectedHospital.stats.patientTrend}
            queueData={selectedHospital.stats.queueData}
            departments={selectedHospital.stats.departments}
          />
          
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
                  {selectedHospital.stats.departments.map((dept) => (
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
                  {selectedHospital.stats.bedStatus.map((ward) => (
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
