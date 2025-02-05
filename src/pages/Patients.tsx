import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const Patients = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-8 text-gray-500">
          No patients added yet
        </div>
      </Card>
    </div>
  );
};

export default Patients;