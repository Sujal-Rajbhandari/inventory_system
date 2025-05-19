
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  ArrowUpDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'Retail' | 'Wholesale';
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

const CUSTOMERS: Customer[] = [
  { 
    id: 1, 
    name: "Jane Cooper", 
    email: "jane.cooper@example.com", 
    phone: "(123) 456-7890", 
    type: "Retail", 
    orders: 5, 
    totalSpent: 345.95, 
    lastOrder: "2025-05-15" 
  },
  { 
    id: 2, 
    name: "Cody Fisher", 
    email: "cody.fisher@example.com", 
    phone: "(123) 567-8901", 
    type: "Retail", 
    orders: 2, 
    totalSpent: 165.50, 
    lastOrder: "2025-05-10" 
  },
  { 
    id: 3, 
    name: "Building Pros Ltd", 
    email: "orders@buildingpros.com", 
    phone: "(123) 789-0123", 
    type: "Wholesale", 
    orders: 12, 
    totalSpent: 8456.75, 
    lastOrder: "2025-05-18" 
  },
  { 
    id: 4, 
    name: "Esther Howard", 
    email: "esther.howard@example.com", 
    phone: "(123) 234-5678", 
    type: "Retail", 
    orders: 3, 
    totalSpent: 245.90, 
    lastOrder: "2025-05-12" 
  },
  { 
    id: 5, 
    name: "City Contractors Inc", 
    email: "purchasing@citycontractors.com", 
    phone: "(123) 345-6789", 
    type: "Wholesale", 
    orders: 7, 
    totalSpent: 6240.25, 
    lastOrder: "2025-05-17" 
  },
  { 
    id: 6, 
    name: "Leslie Alexander", 
    email: "leslie.alexander@example.com", 
    phone: "(123) 456-7891", 
    type: "Retail", 
    orders: 1, 
    totalSpent: 85.25, 
    lastOrder: "2025-05-05" 
  },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = CUSTOMERS.filter(customer => {
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer accounts</p>
        </div>
        <Button className="flex gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search customers..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          {/* Customers table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      Customer <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Orders</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Total Spent</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{customer.name}</td>
                    <td className="p-3 text-muted-foreground">{customer.email}</td>
                    <td className="p-3">{customer.phone}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={customer.type === 'Wholesale' ? 'bg-blue-50 border-blue-200' : ''}>
                        {customer.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">{customer.orders}</td>
                    <td className="p-3 text-right">${customer.totalSpent.toFixed(2)}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-medium">No customers found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or add a new customer
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
