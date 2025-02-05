import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, Users } from "lucide-react";
import AppointmentBookingForm from "@/components/AppointmentBookingForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Appointments = () => {
  const departments = [
    { 
      name: "Cardiology",
      nextAvailable: "2 days",
      queueLength: 15,
      doctor: "Dr. Smith",
      status: "Active"
    },
    {
      name: "Orthopedics",
      nextAvailable: "3 days",
      queueLength: 12,
      doctor: "Dr. Johnson",
      status: "Active"
    },
    {
      name: "Pediatrics",
      nextAvailable: "1 day",
      queueLength: 8,
      doctor: "Dr. Williams",
      status: "Break"
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage department queues and appointments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <AppointmentBookingForm />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Queue</p>
              <p className="text-2xl font-semibold">35</p>
              <p className="text-sm text-gray-500">Across all departments</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Wait Time</p>
              <p className="text-2xl font-semibold">28 min</p>
              <p className="text-sm text-gray-500">Current estimate</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-semibold">42</p>
              <p className="text-sm text-gray-500">8 completed</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Department Queue Status</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Next Available</TableHead>
              <TableHead>Queue Length</TableHead>
              <TableHead>Current Doctor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.name}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>{dept.nextAvailable}</TableCell>
                <TableCell>{dept.queueLength} patients</TableCell>
                <TableCell>{dept.doctor}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    dept.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {dept.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Appointments;