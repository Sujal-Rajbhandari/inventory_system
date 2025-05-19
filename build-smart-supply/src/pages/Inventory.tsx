
import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  stock: number;
  price: number;
  reorderLevel: number;
  image: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Power Drill XL2000", category: "Power Tools", brand: "DeWalt", stock: 35, price: 79.99, reorderLevel: 10, image: "placeholder.svg" },
  { id: 2, name: "Pipe Wrench Set (10pc)", category: "Hand Tools", brand: "Stanley", stock: 22, price: 35.50, reorderLevel: 8, image: "placeholder.svg" },
  { id: 3, name: "Circular Saw 1200W", category: "Power Tools", brand: "Makita", stock: 12, price: 129.99, reorderLevel: 5, image: "placeholder.svg" },
  { id: 4, name: "Hammer Collection", category: "Hand Tools", brand: "Stanley", stock: 45, price: 24.95, reorderLevel: 15, image: "placeholder.svg" },
  { id: 5, name: "Measuring Tape 5m", category: "Measuring", brand: "Komelon", stock: 7, price: 12.99, reorderLevel: 10, image: "placeholder.svg" },
  { id: 6, name: "PVC Pipe 1-inch", category: "Plumbing", brand: "Genova", stock: 56, price: 8.75, reorderLevel: 20, image: "placeholder.svg" },
  { id: 7, name: "LED Floodlight 50W", category: "Electrical", brand: "Philips", stock: 18, price: 45.00, reorderLevel: 8, image: "placeholder.svg" },
  { id: 8, name: "Drywall Sheet 4x8", category: "Building Materials", brand: "USG", stock: 9, price: 15.25, reorderLevel: 15, image: "placeholder.svg" },
];

const CATEGORIES = ["All", "Power Tools", "Hand Tools", "Plumbing", "Electrical", "Building Materials", "Measuring"];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});
  const [newProductData, setNewProductData] = useState<Partial<Product>>({
    name: '',
    category: 'Hand Tools',
    brand: '',
    stock: 0,
    price: 0,
    reorderLevel: 0,
    image: 'placeholder.svg'
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData(product);
    setIsEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isNewProduct: boolean = false) => {
    const { name, value } = e.target;
    
    // Convert numeric fields from string to number
    const parsedValue = ['stock', 'price', 'reorderLevel'].includes(name) 
      ? parseFloat(value) 
      : value;
    
    if (isNewProduct) {
      setNewProductData({
        ...newProductData,
        [name]: parsedValue
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: parsedValue
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, isNewProduct: boolean = false) => {
    const { name, value } = e.target;
    
    if (isNewProduct) {
      setNewProductData({
        ...newProductData,
        [name]: value
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    // Update the product in the products array
    const updatedProducts = products.map(product => 
      product.id === selectedProduct.id ? { ...product, ...editFormData } : product
    );
    
    setProducts(updatedProducts);
    toast("Product updated successfully");
    setIsEditDialogOpen(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new product with a unique ID
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const newProduct = {
      id: newId,
      name: newProductData.name || '',
      category: newProductData.category || 'Hand Tools',
      brand: newProductData.brand || '',
      stock: newProductData.stock || 0,
      price: newProductData.price || 0,
      reorderLevel: newProductData.reorderLevel || 0,
      image: 'placeholder.svg'
    };
    
    setProducts([...products, newProduct]);
    toast("Product added successfully");
    setIsAddDialogOpen(false);
    
    // Reset the new product form
    setNewProductData({
      name: '',
      category: 'Hand Tools',
      brand: '',
      stock: 0,
      price: 0,
      reorderLevel: 0,
      image: 'placeholder.svg'
    });
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button className="flex gap-1" onClick={handleAddClick}>
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {CATEGORIES.map(category => (
                <Badge 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Products table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      Product <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Brand</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Stock</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Price</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">{product.brand}</td>
                    <td className="p-3 text-right">
                      <Badge 
                        variant={product.stock <= product.reorderLevel ? "destructive" : "outline"}
                      >
                        {product.stock}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">${product.price.toFixed(2)}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={editFormData.category || ''}
                  onChange={handleSelectChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brand" className="text-right">
                  Brand
                </Label>
                <Input
                  id="brand"
                  name="brand"
                  value={editFormData.brand || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={editFormData.stock || 0}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editFormData.price || 0}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reorderLevel" className="text-right">
                  Reorder Level
                </Label>
                <Input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  min="0"
                  value={editFormData.reorderLevel || 0}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddProduct} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="new-name"
                  name="name"
                  value={newProductData.name || ''}
                  onChange={(e) => handleInputChange(e, true)}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-category" className="text-right">
                  Category
                </Label>
                <select
                  id="new-category"
                  name="category"
                  value={newProductData.category || 'Hand Tools'}
                  onChange={(e) => handleSelectChange(e, true)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-brand" className="text-right">
                  Brand
                </Label>
                <Input
                  id="new-brand"
                  name="brand"
                  value={newProductData.brand || ''}
                  onChange={(e) => handleInputChange(e, true)}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="new-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={newProductData.stock || 0}
                  onChange={(e) => handleInputChange(e, true)}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="new-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProductData.price || 0}
                  onChange={(e) => handleInputChange(e, true)}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-reorderLevel" className="text-right">
                  Reorder Level
                </Label>
                <Input
                  id="new-reorderLevel"
                  name="reorderLevel"
                  type="number"
                  min="0"
                  value={newProductData.reorderLevel || 0}
                  onChange={(e) => handleInputChange(e, true)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
