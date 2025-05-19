
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

type Period = 'daily' | 'weekly' | 'monthly';

interface SalesChartProps {
  className?: string;
  initialPeriod?: Period;
}

const generateRandomData = (count: number, max: number = 10000) => {
  return Array.from({ length: count }, (_, i) => ({
    name: i.toString(),
    value: Math.floor(Math.random() * max) + 1000,
  }));
};

const CHART_DATA = {
  daily: generateRandomData(7).map((item, i) => ({
    ...item,
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  })),
  weekly: generateRandomData(4).map((item, i) => ({
    ...item,
    name: `Week ${i + 1}`,
  })),
  monthly: generateRandomData(12).map((item, i) => ({
    ...item,
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  })),
};

const SalesChart = ({ className, initialPeriod = 'daily' }: SalesChartProps) => {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  
  // Update period when initialPeriod changes
  useEffect(() => {
    // Map dashboard periods to chart periods
    const periodMap: Record<string, Period> = {
      'today': 'daily',
      'week': 'weekly',
      'month': 'monthly',
      'year': 'monthly' // We'll use monthly data for yearly view too
    };
    setPeriod(periodMap[initialPeriod] || 'daily');
  }, [initialPeriod]);

  return (
    <Card className={cn("col-span-2", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Total sales by time period</CardDescription>
        </div>

        <div className="flex items-center space-x-2">
          {(['daily', 'weekly', 'monthly'] as Period[]).map((value) => (
            <button
              key={value}
              className={cn(
                "text-sm px-3 py-1 rounded-md capitalize", 
                period === value 
                  ? "bg-primary text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
              onClick={() => setPeriod(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA[period]}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis 
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
