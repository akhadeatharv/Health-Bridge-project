
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

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
        <h1 className="text-2xl font-bold mb-4">Hospital not found</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Sample data - in a real app, this would be fetched for the specific hospital
  const queueData = [
    { time: '9:00', patients: 15 },
    { time: '10:00', patients: 25 },
    { time: '11:00', patients: 42 },
    { time: '12:00', patients: 35 },
    { time: '13:00', patients: 28 },
    { time: '14:00', patients: 30 },
  ];

  const departments = [
    { name: "Cardiology", nextAvailable: "2 days", queueLength: 15 },
    { name: "Orthopedics", nextAvailable: "3 days", queueLength: 12 },
    { name: "Pediatrics", nextAvailable: "1 day", queueLength: 8 },
  ];

  const bedStatus = [
    { ward: "General Ward", total: 100, occupied: 75, available: 25 },
    { ward: "ICU", total: 20, occupied: 18, available: 2 },
    { ward: "Maternity", total: 30, occupied: 22, available: 8 },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{hospital.name}</h1>
          <p className="text-gray-500">Distance: {hospital.distance}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600">Total Patient Count</h3>
          <p className="text-2xl font-semibold mt-2">248</p>
          <p className="text-sm text-green-500">+12% from last week</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-gray-600">Bed Availability</h3>
          <p className="text-2xl font-semibold mt-2">{hospital.bedAvailability.available}/{hospital.bedAvailability.total}</p>
          <p className="text-sm text-red-500">-5% from last week</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-gray-600">Average Wait Time</h3>
          <p className="text-2xl font-semibold mt-2">28 min</p>
          <p className="text-sm text-green-500">-15% from last week</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">OPD Queue Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={queueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

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

export default HospitalDetails;
