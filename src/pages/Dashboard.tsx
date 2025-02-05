import DashboardStats from "@/components/DashboardStats";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Hospital Survey</h2>
          {/* Add chart component here later */}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Common Diseases Report</h2>
          {/* Add chart component here later */}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;