
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface RegionalDistributionProps {
  className?: string;
}

const REGION_DATA = [
  { name: 'East Zone', value: 35 },
  { name: 'West Zone', value: 25 },
  { name: 'North Zone', value: 20 },
  { name: 'South Zone', value: 15 },
  { name: 'Central', value: 5 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const RegionalDistribution = ({ className }: RegionalDistributionProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Regional Distribution</CardTitle>
        <CardDescription>Sales distribution by region</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={REGION_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {REGION_DATA.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Sales Percentage']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalDistribution;
