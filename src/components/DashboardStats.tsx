import { Card } from "@/components/ui/card";
import { Users, BedDouble, Clock, Ambulance, Hospital, UserCheck } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
}

const StatCard = ({ title, value, icon, description, trend }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
        {trend !== undefined && (
          <p className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last week
          </p>
        )}
      </div>
    </div>
  </Card>
);

const queueData = [
  { time: '9:00', patients: 15 },
  { time: '10:00', patients: 25 },
  { time: '11:00', patients: 42 },
  { time: '12:00', patients: 35 },
  { time: '13:00', patients: 28 },
  { time: '14:00', patients: 30 },
];

const DashboardStats = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Patients"
          value={248}
          description="Active patients today"
          icon={<Users className="w-6 h-6 text-primary" />}
          trend={12}
        />
        <StatCard
          title="Bed Availability"
          value="75%"
          description="General ward occupancy"
          icon={<BedDouble className="w-6 h-6 text-primary" />}
          trend={-5}
        />
        <StatCard
          title="Average Wait Time"
          value="28 min"
          description="Current OPD wait time"
          icon={<Clock className="w-6 h-6 text-primary" />}
          trend={-15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">OPD Queue Trend</h3>
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
          <h3 className="text-lg font-semibold mb-4">Department Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Hospital className="w-5 h-5 text-primary" />
                <span>Cardiology</span>
              </div>
              <span className="text-sm font-medium">Next available: 2 days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-primary" />
                <span>Orthopedics</span>
              </div>
              <span className="text-sm font-medium">Next available: 3 days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Ambulance className="w-5 h-5 text-primary" />
                <span>Emergency</span>
              </div>
              <span className="text-sm font-medium text-red-500">High occupancy</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;