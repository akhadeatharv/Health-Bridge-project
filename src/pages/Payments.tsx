import { Card } from "@/components/ui/card";

const Payments = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Payments</h1>
      
      <Card className="p-6">
        <div className="text-center py-8 text-gray-500">
          No payment records found
        </div>
      </Card>
    </div>
  );
};

export default Payments;