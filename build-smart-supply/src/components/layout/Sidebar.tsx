
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  BarChart, 
  Settings, 
  HelpCircle,
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavLink {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: ShoppingCart, label: "Orders", href: "/orders" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: BarChart, label: "Reports", href: "/reports" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <div 
      className={cn(
        "w-64 bg-white h-full flex flex-col border-r",
        "transition-all duration-300 ease-in-out",
        "z-40 fixed md:relative",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Logo and close button row */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
            SS
          </div>
          <span className="text-xl font-bold ml-2">SmartSupply</span>
        </div>
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 pt-4 overflow-y-auto scrollbar-hide">
        <ul className="px-2 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            
            return (
              <li key={link.href}>
                <Link 
                  to={link.href} 
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-lg gap-3",
                    "transition-colors duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => onClose()}
                >
                  <Icon className={cn("h-5 w-5", !isActive && "text-gray-500")} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User profile and logout */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">JD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
        <button className="mt-4 flex items-center text-gray-700 hover:text-gray-900 text-sm">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
