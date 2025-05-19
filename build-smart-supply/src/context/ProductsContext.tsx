
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  stock: number;
  price: number;
  reorderLevel: number;
  image: string;
}

// Initial product data that will be shared between components
export const PRODUCTS: Product[] = [
  { id: 1, name: "Power Drill XL2000", category: "Power Tools", brand: "DeWalt", stock: 35, price: 79.99, reorderLevel: 10, image: "placeholder.svg" },
  { id: 2, name: "Pipe Wrench Set (10pc)", category: "Hand Tools", brand: "Stanley", stock: 22, price: 35.50, reorderLevel: 8, image: "placeholder.svg" },
  { id: 3, name: "Circular Saw 1200W", category: "Power Tools", brand: "Makita", stock: 12, price: 129.99, reorderLevel: 5, image: "placeholder.svg" },
  { id: 4, name: "Hammer Collection", category: "Hand Tools", brand: "Stanley", stock: 45, price: 24.95, reorderLevel: 15, image: "placeholder.svg" },
  { id: 5, name: "Measuring Tape 5m", category: "Measuring", brand: "Komelon", stock: 7, price: 12.99, reorderLevel: 10, image: "placeholder.svg" },
  { id: 6, name: "PVC Pipe 1-inch", category: "Plumbing", brand: "Genova", stock: 56, price: 8.75, reorderLevel: 20, image: "placeholder.svg" },
  { id: 7, name: "LED Floodlight 50W", category: "Electrical", brand: "Philips", stock: 18, price: 45.00, reorderLevel: 8, image: "placeholder.svg" },
  { id: 8, name: "Drywall Sheet 4x8", category: "Building Materials", brand: "USG", stock: 9, price: 15.25, reorderLevel: 15, image: "placeholder.svg" },
];

// Attaching products to window for global access between components when we don't use context properly
declare global {
  interface Window {
    PRODUCTS: Product[];
  }
}

// Set initial products to window for components that don't use context
if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
}

interface ProductsContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProductStock: (productId: number, quantity: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Update window.PRODUCTS whenever products state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.PRODUCTS = [...products];
    }
  }, [products]);

  const updateProductStock = (productId: number, quantity: number) => {
    console.log(`Updating product ${productId} stock by ${quantity}`);
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, stock: Math.max(0, product.stock - quantity) } 
          : product
      )
    );
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    // Generate a new ID (simple implementation)
    const newId = Math.max(0, ...products.map(p => p.id)) + 1;
    
    const newProduct: Product = { 
      id: newId,
      ...product 
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const editProduct = (product: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === product.id ? product : p)
    );
  };

  const deleteProduct = (productId: number) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      setProducts, 
      updateProductStock,
      addProduct,
      editProduct,
      deleteProduct 
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
