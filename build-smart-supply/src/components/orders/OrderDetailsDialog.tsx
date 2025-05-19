
import React, { useRef } from 'react';
import { Printer, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
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

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onOpenChange, order }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!order) {
    return null;
  }

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'Unpaid': return 'bg-red-50 text-red-700 border-red-200';
      case 'Partially Paid': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return '';
    }
  };

  const handlePrintInvoice = () => {
    // Option 1: Using window.print() for printing from browser
    if (invoiceRef.current) {
      const content = invoiceRef.current;
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice - ${order?.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .invoice { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
                .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; }
                .invoice-details { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
                .summary { margin-top: 20px; text-align: right; }
              </style>
            </head>
            <body>
              ${content.innerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              </script>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        toast.success("Invoice printing initiated");
      }
    }
  };

  // Option 2: Direct print to receipt printer using browser's print API
  const handlePrintToReceiptPrinter = () => {
    if (invoiceRef.current) {
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${order?.id}</title>
              <style>
                @page { size: 80mm 200mm; margin: 0; }
                body { font-family: 'Courier New', monospace; margin: 0; padding: 10px; width: 80mm; }
                .receipt { width: 100%; }
                .header { text-align: center; margin-bottom: 10px; }
                .store-name { font-size: 16px; font-weight: bold; }
                .divider { border-top: 1px dashed #000; margin: 5px 0; }
                .item { display: flex; justify-content: space-between; font-size: 12px; }
                .summary { margin-top: 10px; text-align: right; font-weight: bold; }
                .footer { text-align: center; margin-top: 10px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <div class="header">
                  <div class="store-name">Hardware Store Inc.</div>
                  <div>123 Tool Street</div>
                  <div>Tel: (555) 123-4567</div>
                </div>
                
                <div class="divider"></div>
                
                <div>
                  <div>Receipt #: ${order.id}</div>
                  <div>Date: ${new Date(order.date).toLocaleDateString()}</div>
                  <div>Customer: ${order.customer}</div>
                  <div>Type: ${order.type}</div>
                </div>
                
                <div class="divider"></div>
                
                <div>
                  ${order.items?.map(item => `
                    <div class="item">
                      <div>${item.productName} x ${item.quantity}</div>
                      <div>$${item.totalPrice.toFixed(2)}</div>
                    </div>
                  `).join('')}
                </div>
                
                <div class="divider"></div>
                
                <div class="summary">
                  <div>Total: $${order.totalAmount.toFixed(2)}</div>
                  <div>Payment: ${order.paymentStatus}</div>
                </div>
                
                <div class="divider"></div>
                
                <div class="footer">
                  <div>Thank you for your business!</div>
                </div>
              </div>
              
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              </script>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        
        // Configure to use receipt printer (though this is dependent on browser and OS settings)
        const mediaQueryList = printWindow.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
          if (!mql.matches) {
            printWindow.close();
          }
        });
        
        printWindow.focus();
        printWindow.print();
        toast.success("Receipt printing initiated");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between">
            <span>Order Details - {order?.id}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrintInvoice} className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span>Print Invoice</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrintToReceiptPrinter} className="flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                <span>Print Receipt</span>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div ref={invoiceRef} className="invoice-container">
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-sm text-muted-foreground">Hardware Store Inc.</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Order #{order?.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Bill To:</h3>
                  <p>{order?.customer}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium mb-1">Order Type:</h3>
                  <p>{order?.type}</p>
                </div>
              </div>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Quantity</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order?.items?.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2">{item.productName}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-2">${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right py-2 font-medium">Total</td>
                  <td className="text-right py-2 font-medium">${order?.totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right py-2">Payment Status</td>
                  <td className="text-right py-2">
                    <Badge className={getPaymentStatusColor(order?.paymentStatus || 'Unpaid')}>
                      {order?.paymentStatus}
                    </Badge>
                  </td>
                </tr>
              </tfoot>
            </table>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Thank you for your business!</p>
              <p>For questions or inquiries, please contact support@hardwarestore.com</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
