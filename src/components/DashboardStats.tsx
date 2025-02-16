
import { Card } from "@/components/ui/card";
import { Users, BedDouble, Clock } from "lucide-react";
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

interface DashboardStatsProps {
  totalPatients: number;
  bedOccupancy: number;
  averageWaitTime: string;
  patientTrend: number;
  queueData: Array<{ time: string; patients: number; }>;
  departments: Array<{ name: string; nextAvailable: string; queueLength: number; }>;
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

const DashboardStats = ({
  totalPatients,
  bedOccupancy,
  averageWaitTime,
  patientTrend,
  queueData
}: DashboardStatsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          description="Active patients today"
          icon={<Users className="w-6 h-6 text-primary" />}
          trend={patientTrend}
        />
        <StatCard
          title="Bed Occupancy"
          value={`${bedOccupancy}%`}
          description="General ward occupancy"
          icon={<BedDouble className="w-6 h-6 text-primary" />}
          trend={-5}
        />
        <StatCard
          title="Average Wait Time"
          value={averageWaitTime}
          description="Current OPD wait time"
          icon={<Clock className="w-6 h-6 text-primary" />}
          trend={-15}
        />
      </div>

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
    </div>
  );
};

export default DashboardStats;
