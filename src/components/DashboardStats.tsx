import { Card } from "@/components/ui/card";
import { Users, BedDouble, Clock, Ambulance } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  </Card>
);

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="OPD Queue"
        value={42}
        description="Current waiting patients"
        icon={<Users className="w-6 h-6 text-primary" />}
      />
      <StatCard
        title="Bed Availability"
        value="75%"
        description="General ward occupancy"
        icon={<BedDouble className="w-6 h-6 text-primary" />}
      />
      <StatCard
        title="Average Wait Time"
        value="28 min"
        description="Current OPD wait time"
        icon={<Clock className="w-6 h-6 text-primary" />}
      />
      <StatCard
        title="Emergency Cases"
        value={12}
        description="Active emergency cases"
        icon={<Ambulance className="w-6 h-6 text-primary" />}
      />
    </div>
  );
};

export default DashboardStats;