import { Link, useLocation } from "react-router-dom";
import { Calendar, Users, CreditCard, LayoutDashboard } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: CreditCard, label: "Payments", path: "/payments" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/5dbf5437-51b3-43a9-88a8-b258fa00aabe.png" alt="Logo" className="w-8 h-8" />
          <span className="font-semibold text-xl">Hospital</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              location.pathname === item.path
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;