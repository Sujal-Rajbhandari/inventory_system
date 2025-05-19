
import React, { useState } from 'react';
import { 
  BarChart, 
  ShoppingCart, 
  Truck, 
  Clock, 
  DollarSign, 
  Package
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import SalesChart from '@/components/dashboard/SalesChart';
import TopProducts from '@/components/dashboard/TopProducts';
import LowStockAlerts from '@/components/dashboard/LowStockAlerts';
import RegionalDistribution from '@/components/dashboard/RegionalDistribution';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type TimePeriod = 'today' | 'week' | 'month' | 'year';

interface DashboardData {
  [key: string]: {
    revenue: string;
    revenueChange: { value: string; positive: boolean };
    orders: string;
    ordersChange: { value: string; positive: boolean };
    shipments: string;
    shipmentsChange: { value: string; positive: boolean };
    avgDeliveryTime: string;
    avgDeliveryTimeChange: { value: string; positive: boolean };
  }
}

const dashboardData: DashboardData = {
  today: {
    revenue: '$1,234.56',
    revenueChange: { value: "8%", positive: true },
    orders: '24',
    ordersChange: { value: "4%", positive: true },
    shipments: '6',
    shipmentsChange: { value: "2%", positive: false },
    avgDeliveryTime: '2.8 days',
    avgDeliveryTimeChange: { value: "0.3 days", positive: true },
  },
  week: {
    revenue: '$8,975.40',
    revenueChange: { value: "12%", positive: true },
    orders: '156',
    ordersChange: { value: "5%", positive: true },
    shipments: '42',
    shipmentsChange: { value: "2%", positive: false },
    avgDeliveryTime: '2.4 days',
    avgDeliveryTimeChange: { value: "0.5 days", positive: true },
  },
  month: {
    revenue: '$45,231.89',
    revenueChange: { value: "15%", positive: true },
    orders: '356',
    ordersChange: { value: "8%", positive: true },
    shipments: '91',
    shipmentsChange: { value: "3%", positive: true },
    avgDeliveryTime: '2.2 days',
    avgDeliveryTimeChange: { value: "0.7 days", positive: true },
  },
  year: {
    revenue: '$542,786.12',
    revenueChange: { value: "22%", positive: true },
    orders: '4,253',
    ordersChange: { value: "18%", positive: true },
    shipments: '1,108',
    shipmentsChange: { value: "15%", positive: true },
    avgDeliveryTime: '2.5 days',
    avgDeliveryTimeChange: { value: "0.4 days", positive: true },
  }
};

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');
  const currentData = dashboardData[selectedPeriod];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your hardware store performance.</p>
        </div>
        <div className="inline-flex items-center rounded-lg bg-muted p-1.5 text-muted-foreground w-full md:w-auto">
          {(["today", "week", "month", "year"] as TimePeriod[]).map((period) => (
            <Button
              key={period}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium md:flex-none",
                selectedPeriod === period 
                  ? "bg-white text-foreground shadow-sm" 
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
              variant="ghost"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total Revenue" 
          value={currentData.revenue} 
          icon={<DollarSign className="h-5 w-5" />} 
          change={currentData.revenueChange}
        />
        <StatsCard 
          title="Orders" 
          value={currentData.orders} 
          icon={<ShoppingCart className="h-5 w-5" />} 
          change={currentData.ordersChange}
        />
        <StatsCard 
          title="Shipments" 
          value={currentData.shipments} 
          icon={<Truck className="h-5 w-5" />} 
          change={currentData.shipmentsChange}
        />
        <StatsCard 
          title="Avg. Delivery Time" 
          value={currentData.avgDeliveryTime} 
          icon={<Clock className="h-5 w-5" />} 
          change={currentData.avgDeliveryTimeChange}
        />
      </div>
      
      {/* Charts and Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SalesChart className="md:col-span-2" initialPeriod={selectedPeriod as 'daily' | 'weekly' | 'monthly'} />
        <RegionalDistribution />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TopProducts />
        <LowStockAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
