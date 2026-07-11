import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { analyticsService } from '@/lib/api'; // Note: This should be productService but we'll use analytics for now as placeholder

export type Product = {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  categoryName: string;
  brandId?: string;
  brandName?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  taxRate: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in' | 'mm';
  };
  stock: number;
  minStockLevel: number;
  maxStockLevel: number;
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock';
  images: string[];
  videos?: string[];
  attributes: Array<{
    name: string;
    value: string;
  }>;
  variants?: Array<{
    id: string;
    sku: string;
    attributes: Record<string, string>;
    price: number;
    stock: number;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  fetchProducts: (params?: any) => Promise<void>;
  fetchProductDetail: (id: string) => Promise<Product | null>;
  bulkUpdate: (updates: Array<{ id: string; data: Partial<Product> }>) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  updateStock: (id: string, quantity: number, type: 'add' | 'subtract' | 'set') => Promise<void>;
  lowStockProducts: () => Product[];
  outOfStockProducts: () => Product[];
  reset: () => void;
};

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
        })),
      removeProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      fetchProducts: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          // TODO: Replace with actual product service
          const response = await analyticsService.getProductSales(); // Placeholder
          set({ products: response.data || [], loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchProductDetail: async (id) => {
        set({ loading: true, error: null });
        try {
          // TODO: Replace with actual product service
          const response = await analyticsService.getProductSales(); // Placeholder
          set({ loading: false });
          return response.data?.find((p: any) => p.id === id) || null;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      bulkUpdate: async (updates) => {
        set({ loading: true, error: null });
        try {
          // TODO: Implement actual bulk update API
          updates.forEach(({ id, data }) => {
            get().updateProduct(id, data);
          });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      bulkDelete: async (ids) => {
        set({ loading: true, error: null });
        try {
          // TODO: Implement actual bulk delete API
          ids.forEach((id) => {
            get().removeProduct(id);
          });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateStock: async (id, quantity, type) => {
        set({ loading: true, error: null });
        try {
          // TODO: Implement actual stock update API
          const product = get().products.find((p) => p.id === id);
          if (!product) throw new Error('Product not found');

          let newStock = product.stock;
          if (type === 'add') {
            newStock += quantity;
          } else if (type === 'subtract') {
            newStock -= quantity;
          } else if (type === 'set') {
            newStock = quantity;
          }

          newStock = Math.max(0, newStock);

          get().updateProduct(id, { stock: newStock });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      lowStockProducts: () => {
        return get().products.filter(
          (p) => p.stock <= p.minStockLevel && p.stock > 0
        );
      },
      outOfStockProducts: () => {
        return get().products.filter((p) => p.stock === 0);
      },
      reset: () => {
        set({
          products: [],
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'ProductStore' }
  )
);