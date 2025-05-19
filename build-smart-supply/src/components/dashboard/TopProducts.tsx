
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

const PRODUCTS = [
  { id: 1, name: "Power Drill XL2000", sales: 146, revenue: 10220, image: "placeholder.svg" },
  { id: 2, name: "Pipe Wrench Set (10pc)", sales: 132, revenue: 5280, image: "placeholder.svg" },
  { id: 3, name: "Circular Saw 1200W", sales: 97, revenue: 8730, image: "placeholder.svg" },
  { id: 4, name: "Hammer Collection", sales: 89, revenue: 1780, image: "placeholder.svg" },
  { id: 5, name: "Measuring Tape 5m", sales: 76, revenue: 912, image: "placeholder.svg" },
];

interface TopProductsProps {
  className?: string;
}

const TopProducts = ({ className }: TopProductsProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Your best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {PRODUCTS.map((product) => (
            <div 
              key={product.id} 
              className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{product.name}</h4>
                <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${product.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
