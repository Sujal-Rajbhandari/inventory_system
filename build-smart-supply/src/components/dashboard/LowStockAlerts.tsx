
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface StockItem {
  id: number;
  name: string;
  currentStock: number;
  minRequired: number;
  category: string;
}

const LOW_STOCK_ITEMS: StockItem[] = [
  { id: 1, name: "Paint Brushes (Fine)", currentStock: 5, minRequired: 20, category: "Painting" },
  { id: 2, name: "Copper Pipe 15mm", currentStock: 8, minRequired: 30, category: "Plumbing" },
  { id: 3, name: "Electric Cable 2.5mm", currentStock: 12, minRequired: 50, category: "Electrical" },
  { id: 4, name: "Door Hinges 4\"", currentStock: 7, minRequired: 25, category: "Hardware" },
];

interface LowStockAlertsProps {
  className?: string;
}

const LowStockAlerts = ({ className }: LowStockAlertsProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Package className="h-5 w-5" /> Low Stock Alerts
          </CardTitle>
          <CardDescription>Items that need reordering</CardDescription>
        </div>
        <Badge variant="destructive" className="px-3">{LOW_STOCK_ITEMS.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {LOW_STOCK_ITEMS.map((item) => (
            <div 
              key={item.id}
              className="p-3 border border-red-100 bg-red-50 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                </div>
                <Badge variant="outline" className="bg-white">
                  {item.currentStock}/{item.minRequired}
                </Badge>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-red-500 h-1.5 rounded-full" 
                  style={{ width: `${(item.currentStock / item.minRequired) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          Order All Items
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LowStockAlerts;
