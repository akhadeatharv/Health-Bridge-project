import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type AppointmentFormData = {
  patientName: string;
  department: string;
  doctor: string;
  phone: string;
};

const departments = [
  { id: "cardiology", name: "Cardiology", doctors: ["Dr. Smith", "Dr. Johnson"] },
  { id: "orthopedics", name: "Orthopedics", doctors: ["Dr. Williams", "Dr. Brown"] },
  { id: "pediatrics", name: "Pediatrics", doctors: ["Dr. Davis", "Dr. Miller"] },
];

const AppointmentBookingForm = () => {
  const [date, setDate] = useState<Date>();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  const form = useForm<AppointmentFormData>();
  
  const handleSubmit = (data: AppointmentFormData) => {
    if (!date) {
      toast.error("Please select an appointment date");
      return;
    }
    
    // Here you would typically make an API call to save the appointment
    console.log({ ...data, appointmentDate: date });
    
    toast.success("Appointment booked successfully!");
    form.reset();
    setDate(undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedDepartment(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doctor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedDepartment}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments
                    .find((d) => d.id === selectedDepartment)
                    ?.doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Appointment Date</FormLabel>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => date < new Date() || date.getDay() === 0}
          />
        </div>

        <Button type="submit" className="w-full">
          Book Appointment
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentBookingForm;