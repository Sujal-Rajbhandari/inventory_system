
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
}

const StatsCard = ({ title, value, icon, change, className }: StatsCardProps) => {
  return (
    <Card className={cn("stats-card card-hover", className)}>
      <div className="flex justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          
          {change && (
            <div className="flex items-center gap-1 text-sm">
              <span 
                className={
                  change.positive 
                    ? "text-green-500 bg-green-50 px-1 rounded" 
                    : "text-red-500 bg-red-50 px-1 rounded"
                }
              >
                {change.positive ? '↑' : '↓'} {change.value}
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
