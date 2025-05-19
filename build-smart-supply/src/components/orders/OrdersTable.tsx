
import React from 'react';
import { Eye, FileText, ArrowUpDown, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onViewOrder }) => {
  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'Unpaid': return 'bg-red-50 text-red-700 border-red-200';
      case 'Partially Paid': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return '';
    }
  };

  const getOrderStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Canceled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return '';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
        <h3 className="mt-4 text-lg font-medium">No orders found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your search or create a new order
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium text-muted-foreground">
              <div className="flex items-center gap-1">
                Order ID <ArrowUpDown className="h-3 w-3" />
              </div>
            </th>
            <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
            <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Payment</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/50">
              <td className="p-3 font-medium">{order.id}</td>
              <td className="p-3">{order.customer}</td>
              <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
              <td className="p-3">
                <Badge variant="outline" className={order.type === 'Wholesale' ? 'bg-blue-50 border-blue-200' : ''}>
                  {order.type}
                </Badge>
              </td>
              <td className="p-3 text-right">${order.totalAmount.toFixed(2)}</td>
              <td className="p-3 text-center">
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full border",
                  getPaymentStatusColor(order.paymentStatus)
                )}>
                  {order.paymentStatus}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full border",
                  getOrderStatusColor(order.orderStatus)
                )}>
                  {order.orderStatus}
                </span>
              </td>
              <td className="p-3">
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => onViewOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
