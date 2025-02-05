import { Card } from "@/components/ui/card";
import { Users, Check, Hospital } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </Card>
);

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="OPD Today"
        value={250}
        icon={<Users className="w-6 h-6 text-primary" />}
      />
      <StatCard
        title="Relieved Today"
        value={85}
        icon={<Check className="w-6 h-6 text-primary" />}
      />
      <StatCard
        title="In Patient Today"
        value={300}
        icon={<Hospital className="w-6 h-6 text-primary" />}
      />
      <StatCard
        title="Ventilator"
        value={52}
        icon={<Hospital className="w-6 h-6 text-primary" />}
      />
    </div>
  );
};

export default DashboardStats;