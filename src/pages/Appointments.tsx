import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Appointments = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Calendar className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-8 text-gray-500">
          No appointments scheduled
        </div>
      </Card>
    </div>
  );
};

export default Appointments;