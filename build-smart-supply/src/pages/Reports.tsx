
import React, { useState } from 'react';
import { BarChart, LineChart, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart as RechartsLineChart, Line } from 'recharts';

const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    name: month,
    sales: Math.floor(Math.random() * 5000) + 2000,
    profit: Math.floor(Math.random() * 2000) + 1000,
  }));
};

const generateProductData = () => {
  const products = [
    "Power Drill XL2000", 
    "Pipe Wrench Set", 
    "Circular Saw 1200W",
    "Hammer Collection",
    "Measuring Tape 5m"
  ];
  
  return products.map(product => ({
    name: product,
    sales: Math.floor(Math.random() * 100) + 10,
    revenue: Math.floor(Math.random() * 5000) + 500,
  }));
};

const Reports = () => {
  const [selectedTab, setSelectedTab] = useState("sales");
  const monthlyData = generateMonthlyData();
  const productData = generateProductData();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View detailed analytics and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Date Range</span>
          </Button>
          <Button variant="outline" className="flex gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="sales" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>View your sales and profit data over time</CardDescription>
            </CardHeader>
            <CardContent className="p-1">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`$${value}`, '']}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sales" name="Total Sales" fill="hsl(var(--primary))" />
                    <Bar dataKey="profit" name="Profit" fill="hsl(var(--destructive))" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Data updated as of {new Date().toLocaleDateString()}
              </p>
              <Button variant="outline" size="sm" className="flex gap-1">
                <Download className="h-4 w-4" />
                <span>Download CSV</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>View your top-selling products and revenue</CardDescription>
            </CardHeader>
            <CardContent className="p-1">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={productData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--destructive))" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'sales' ? value : `$${value}`, 
                        name === 'sales' ? 'Units Sold' : 'Revenue'
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sales" name="Units Sold" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--destructive))" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Data updated as of {new Date().toLocaleDateString()}
              </p>
              <Button variant="outline" size="sm" className="flex gap-1">
                <Download className="h-4 w-4" />
                <span>Download CSV</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="text-center py-24">
          <BarChart className="h-12 w-12 mx-auto text-primary opacity-50" />
          <h2 className="mt-4 text-xl font-medium">Customer reports coming soon</h2>
          <p className="text-muted-foreground mt-2">
            This feature is under development and will be available in a future update.
          </p>
        </TabsContent>
        
        <TabsContent value="inventory" className="text-center py-24">
          <BarChart className="h-12 w-12 mx-auto text-primary opacity-50" />
          <h2 className="mt-4 text-xl font-medium">Inventory reports coming soon</h2>
          <p className="text-muted-foreground mt-2">
            This feature is under development and will be available in a future update.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
