
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from "sonner";
import { useProducts } from '@/context/ProductsContext';

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

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated: (newOrder: Order) => void;
}

const CreateOrderDialog: React.FC<CreateOrderDialogProps> = ({ open, onOpenChange, onOrderCreated }) => {
  const { products, updateProductStock } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<OrderItem[]>([]);
  const [newOrderData, setNewOrderData] = useState({
    customer: '',
    type: 'Retail' as 'Retail' | 'Wholesale',
    paymentStatus: 'Unpaid' as 'Paid' | 'Unpaid' | 'Partially Paid'
  });
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOrderData({
      ...newOrderData,
      [name]: value
    });
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(Number(e.target.value));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const addItemToOrder = () => {
    if (selectedProductId === 0) {
      toast("Please select a product");
      return;
    }
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) {
      toast("Product not found");
      return;
    }
    
    if (quantity <= 0) {
      toast("Quantity must be greater than 0");
      return;
    }
    
    if (product.stock < quantity) {
      toast("Not enough stock available");
      return;
    }
    
    const existingItem = selectedProducts.find(item => item.productId === selectedProductId);
    if (existingItem) {
      const totalQuantity = existingItem.quantity + quantity;
      
      if (product.stock < totalQuantity) {
        toast("Not enough stock available for the total quantity");
        return;
      }
      
      // Update existing item
      const updatedItems = selectedProducts.map(item => {
        if (item.productId === selectedProductId) {
          return {
            ...item,
            quantity: totalQuantity,
            totalPrice: totalQuantity * item.unitPrice
          };
        }
        return item;
      });
      setSelectedProducts(updatedItems);
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        unitPrice: product.price,
        totalPrice: quantity * product.price
      };
      setSelectedProducts([...selectedProducts, newItem]);
    }
    
    setSelectedProductId(0);
    setQuantity(1);
  };

  const removeItemFromOrder = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(item => item.productId !== productId));
  };

  const calculateTotalAmount = () => {
    return selectedProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast("Please add at least one product");
      return;
    }
    
    if (!newOrderData.customer) {
      toast("Please enter customer name");
      return;
    }
    
    // Create new order
    const totalAmount = calculateTotalAmount();
    const lastOrderId = "10042"; // This would come from existing orders
    const newOrderId = `ORD-${parseInt(lastOrderId) + 1}`;
    
    const newOrder: Order = {
      id: newOrderId,
      customer: newOrderData.customer,
      date: new Date().toISOString().split('T')[0],
      type: newOrderData.type,
      paymentStatus: newOrderData.paymentStatus,
      orderStatus: 'Pending',
      totalAmount: totalAmount,
      items: [...selectedProducts]
    };
    
    // Update product stock in context
    selectedProducts.forEach(item => {
      updateProductStock(item.productId, item.quantity);
      console.log(`Updating stock for product ${item.productId}, quantity: ${item.quantity}`);
    });
    
    toast("Order created successfully");
    onOrderCreated(newOrder);
    
    // Automatically open the invoice printer
    setTimeout(() => {
      printToReceiptPrinter(newOrder);
    }, 500);
    
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedProducts([]);
    setNewOrderData({
      customer: '',
      type: 'Retail',
      paymentStatus: 'Unpaid'
    });
    setSelectedProductId(0);
    setQuantity(1);
  };
  
  const printToReceiptPrinter = (order: Order) => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${order.id}</title>
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
      printWindow.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleCreateOrder} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input 
                  id="customer"
                  name="customer"
                  value={newOrderData.customer}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Order Type</Label>
                <select
                  id="type"
                  name="type"
                  value={newOrderData.type}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={newOrderData.paymentStatus}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Add Product</Label>
                <div className="flex space-x-2">
                  <select
                    id="product"
                    value={selectedProductId}
                    onChange={handleProductSelect}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value={0}>Select a product</option>
                    {products.filter(p => p.stock > 0).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                  
                  <Input 
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-24"
                  />
                  
                  <Button type="button" onClick={addItemToOrder}>
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="font-medium mb-2">Selected Products</h4>
                {selectedProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products selected</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedProducts.map((item) => (
                      <li key={item.productId} className="flex justify-between items-center text-sm">
                        <span>
                          {item.productName} x {item.quantity} (${item.unitPrice.toFixed(2)})
                        </span>
                        <div className="flex items-center">
                          <span className="font-medium pr-2">
                            ${item.totalPrice.toFixed(2)}
                          </span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => removeItemFromOrder(item.productId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </li>
                    ))}
                    <li className="pt-2 border-t flex justify-between font-medium">
                      <span>Total</span>
                      <span>${calculateTotalAmount().toFixed(2)}</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={selectedProducts.length === 0 || !newOrderData.customer}
            >
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;
