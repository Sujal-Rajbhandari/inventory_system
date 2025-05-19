
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/context/ProductsContext';
import CreateOrderDialog from '@/components/orders/CreateOrderDialog';
import OrderDetailsDialog from '@/components/orders/OrderDetailsDialog';
import OrdersTable from '@/components/orders/OrdersTable';
import { toast } from "sonner";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  type: 'Retail' | 'Wholesale';
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partially Paid';
  orderStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';
  items?: OrderItem[];
}

// Initial orders data
const INITIAL_ORDERS: Order[] = [
  { 
    id: "ORD-10042", 
    customer: "Jane Cooper", 
    date: "2025-05-19", 
    type: "Retail", 
    totalAmount: 264.00, 
    paymentStatus: "Paid", 
    orderStatus: "Delivered",
    items: [
      { productId: 1, productName: "Power Drill XL2000", quantity: 2, unitPrice: 79.99, totalPrice: 159.98 },
      { productId: 5, productName: "Measuring Tape 5m", quantity: 2, unitPrice: 12.99, totalPrice: 25.98 }
    ]
  },
  { 
    id: "ORD-10041", 
    customer: "Robert Fox", 
    date: "2025-05-18", 
    type: "Wholesale", 
    totalAmount: 1254.30, 
    paymentStatus: "Unpaid", 
    orderStatus: "Pending" ,
    items: [
      { productId: 3, productName: "Circular Saw 1200W", quantity: 5, unitPrice: 129.99, totalPrice: 649.95 },
      { productId: 6, productName: "PVC Pipe 1-inch", quantity: 20, unitPrice: 8.75, totalPrice: 175.00 }
    ]
  },
  { 
    id: "ORD-10039", 
    customer: "Wade Warren", 
    date: "2025-05-17", 
    type: "Retail", 
    totalAmount: 42.25, 
    paymentStatus: "Paid", 
    orderStatus: "Shipped",
    items: [
      { productId: 4, productName: "Hammer Collection", quantity: 1, unitPrice: 24.95, totalPrice: 24.95 },
      { productId: 5, productName: "Measuring Tape 5m", quantity: 1, unitPrice: 12.99, totalPrice: 12.99 }
    ]
  },
  { 
    id: "ORD-10038", 
    customer: "Esther Howard", 
    date: "2025-05-16", 
    type: "Retail", 
    totalAmount: 89.95, 
    paymentStatus: "Paid", 
    orderStatus: "Delivered",
    items: [
      { productId: 2, productName: "Pipe Wrench Set (10pc)", quantity: 1, unitPrice: 35.50, totalPrice: 35.50 },
      { productId: 7, productName: "LED Floodlight 50W", quantity: 1, unitPrice: 45.00, totalPrice: 45.00 }
    ]
  },
  { 
    id: "ORD-10036", 
    customer: "Building Pros Ltd", 
    date: "2025-05-15", 
    type: "Wholesale", 
    totalAmount: 4326.75, 
    paymentStatus: "Partially Paid", 
    orderStatus: "Shipped",
    items: [
      { productId: 3, productName: "Circular Saw 1200W", quantity: 15, unitPrice: 129.99, totalPrice: 1949.85 },
      { productId: 8, productName: "Drywall Sheet 4x8", quantity: 50, unitPrice: 15.25, totalPrice: 762.50 },
      { productId: 1, productName: "Power Drill XL2000", quantity: 20, unitPrice: 79.99, totalPrice: 1599.80 }
    ]
  },
  { 
    id: "ORD-10034", 
    customer: "Leslie Alexander", 
    date: "2025-05-14", 
    type: "Retail", 
    totalAmount: 128.50, 
    paymentStatus: "Unpaid", 
    orderStatus: "Canceled",
    items: [
      { productId: 7, productName: "LED Floodlight 50W", quantity: 2, unitPrice: 45.00, totalPrice: 90.00 },
      { productId: 5, productName: "Measuring Tape 5m", quantity: 1, unitPrice: 12.99, totalPrice: 12.99 }
    ]
  }
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { products } = useProducts();

  const filteredOrders = orders.filter(order => {
    return order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
           order.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewOrderDialogOpen(true);
  };

  const handleOrderCreated = (newOrder: Order) => {
    console.log("New order created:", newOrder);
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    toast.success("Order created and invoice printed successfully");
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage your customer orders</p>
        </div>
        <Button className="flex gap-1" onClick={() => setIsCreateOrderDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Create Order</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search orders..." 
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

          {/* Orders table */}
          <OrdersTable orders={filteredOrders} onViewOrder={handleViewOrder} />
        </CardContent>
      </Card>

      {/* Create Order Dialog */}
      <CreateOrderDialog 
        open={isCreateOrderDialogOpen} 
        onOpenChange={setIsCreateOrderDialogOpen} 
        onOrderCreated={handleOrderCreated}
      />

      {/* View Order / Invoice Dialog */}
      <OrderDetailsDialog 
        open={isViewOrderDialogOpen} 
        onOpenChange={setIsViewOrderDialogOpen} 
        order={currentOrder}
      />
    </div>
  );
};

export default Orders;
