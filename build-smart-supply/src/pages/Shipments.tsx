
import React from 'react';
import { Truck, PackageCheck, Compass, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShipmentItem {
  id: string;
  customer: string;
  address: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  estimatedDelivery: string;
  items: number;
  trackingId: string;
  progress: number;
}

const shipments: ShipmentItem[] = [
  {
    id: "SHP-1001",
    customer: "John Smith",
    address: "123 Main St, Springfield, IL",
    status: "in-transit",
    estimatedDelivery: "May 21, 2025",
    items: 3,
    trackingId: "TRK-7834291",
    progress: 65,
  },
  {
    id: "SHP-1002",
    customer: "Sarah Johnson",
    address: "456 Oak Ave, Burlington, VT",
    status: "pending",
    estimatedDelivery: "May 23, 2025",
    items: 1,
    trackingId: "TRK-6723481",
    progress: 10,
  },
  {
    id: "SHP-1003",
    customer: "Robert Davis",
    address: "789 Pine Rd, Portland, OR",
    status: "delivered",
    estimatedDelivery: "May 18, 2025",
    items: 5,
    trackingId: "TRK-9823471",
    progress: 100,
  },
  {
    id: "SHP-1004",
    customer: "Emma Wilson",
    address: "321 Elm Blvd, Austin, TX",
    status: "delayed",
    estimatedDelivery: "May 22, 2025",
    items: 2,
    trackingId: "TRK-5437821",
    progress: 30,
  },
];

const statusIcons = {
  'pending': <PackageCheck className="h-4 w-4" />,
  'in-transit': <Truck className="h-4 w-4" />,
  'delivered': <Compass className="h-4 w-4" />,
  'delayed': <AlertTriangle className="h-4 w-4" />,
};

const statusColors = {
  'pending': "bg-blue-100 text-blue-800",
  'in-transit': "bg-yellow-100 text-yellow-800",
  'delivered': "bg-green-100 text-green-800",
  'delayed': "bg-red-100 text-red-800",
};

const Shipments = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">Track and manage your deliveries</p>
        </div>
        <Button className="flex gap-1">
          <Truck className="h-4 w-4" />
          <span className={isMobile ? "" : "ml-1"}>New Shipment</span>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.length}</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              In Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter(s => s.status === 'in-transit').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently on the way
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Delivered This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter(s => s.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +1 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm">
                  <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                  {!isMobile && <th className="text-left p-3 font-medium text-muted-foreground">Address</th>}
                  <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                  {!isMobile && <th className="text-left p-3 font-medium text-muted-foreground">Items</th>}
                  {!isMobile && <th className="text-left p-3 font-medium text-muted-foreground">Tracking</th>}
                  <th className="text-right p-3 font-medium text-muted-foreground">Progress</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{shipment.id}</td>
                    <td className="p-3">{shipment.customer}</td>
                    {!isMobile && <td className="p-3 max-w-[200px] truncate">{shipment.address}</td>}
                    <td className="p-3 text-center">
                      <Badge 
                        variant="outline" 
                        className={cn("flex items-center gap-1 justify-center", 
                          statusColors[shipment.status])}
                      >
                        {statusIcons[shipment.status]}
                        <span className="capitalize">{shipment.status.replace('-', ' ')}</span>
                      </Badge>
                    </td>
                    {!isMobile && <td className="p-3">{shipment.items}</td>}
                    {!isMobile && <td className="p-3">{shipment.trackingId}</td>}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={shipment.progress} className="h-2" />
                        <span className="text-xs font-medium">{shipment.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shipments;
