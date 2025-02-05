import DashboardStats from "@/components/DashboardStats";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
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
      <h1 className="text-3xl font-bold mb-8">Hospital Dashboard</h1>
      <DashboardStats />
      
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
              {departments.map((dept) => (
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
              {bedStatus.map((ward) => (
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