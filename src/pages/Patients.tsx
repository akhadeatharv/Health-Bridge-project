
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
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddPatientForm } from "@/components/AddPatientForm";
import { useState } from "react";

const Patients = () => {
  const [open, setOpen] = useState(false);
  const patients = [
    {
      id: "P001",
      name: "John Doe",
      age: 45,
      department: "Cardiology",
      status: "Admitted",
      room: "301"
    },
    {
      id: "P002",
      name: "Jane Smith",
      age: 32,
      department: "Orthopedics",
      status: "OPD",
      room: "-"
    },
    {
      id: "P003",
      name: "Robert Johnson",
      age: 28,
      department: "Emergency",
      status: "Critical",
      room: "ICU-2"
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-gray-500 mt-1">Manage patient records and admissions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Fill in the patient details below to register them in the system.
              </DialogDescription>
            </DialogHeader>
            <AddPatientForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            Filter
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Room/Ward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.department}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    patient.status === "Admitted" ? "bg-blue-100 text-blue-800" :
                    patient.status === "Critical" ? "bg-red-100 text-red-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell>{patient.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Patients;
