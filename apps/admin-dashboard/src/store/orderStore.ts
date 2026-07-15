import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { orderService } from '@/lib/api';

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  merchantId: string;
  merchantName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'cod' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    lat?: number;
    lng?: number;
  };
  assignedDriverId?: string;
  assignedDriverName?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type OrderState = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  fetchOrders: (params?: any) => Promise<void>;
  fetchOrderDetail: (id: string) => Promise<Order | null>;
  assignDriver: (orderId: string, driverId: string) => Promise<void>;
  reassignDriver: (orderId: string, driverId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  refundOrder: (orderId: string) => Promise<void>;
  returnOrder: (orderId: string) => Promise<void>;
  replacementOrder: (orderId: string) => Promise<void>;
  getInvoice: (orderId: string) => Promise<any>;
  getPaymentStatus: (orderId: string) => Promise<any>;
  reset: () => void;
};

export const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
      orders: [],
      loading: false,
      error: null,
      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      updateOrder: (id, order) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...order } : o)),
        })),
      removeOrder: (id) =>
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),
      fetchOrders: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await orderService.getList(params);
          set({ orders: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchOrderDetail: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await orderService.getDetail(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      assignDriver: async (orderId, driverId) => {
        set({ loading: true, error: null });
        try {
          await orderService.assignDriver(orderId, driverId);
          get().updateOrder(orderId, { status: 'assigned' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reassignDriver: async (orderId, driverId) => {
        set({ loading: true, error: null });
        try {
          await orderService.reassignDriver(orderId, driverId);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      cancelOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
          await orderService.cancelOrder(orderId);
          get().updateOrder(orderId, { orderStatus: 'cancelled' });
          set({ loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      refundOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
          await orderService.refundOrder(orderId);
          get().updateOrder(orderId, { paymentStatus: 'refunded', orderStatus: 'refunded' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      returnOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
          await orderService.returnOrder(orderId);
          get().updateOrder(orderId, { orderStatus: 'returned' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      replacementOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
          await orderService.replacementOrder(orderId);
          get().updateOrder(orderId, { orderStatus: 'replaced' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getInvoice: async (orderId) => {
        set({ loading: true, error: null });
        try {
          const response = await orderService.getInvoice(orderId);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getPaymentStatus: async (orderId) => {
        set({ loading: true, error: null });
        try {
          const response = await orderService.getPaymentStatus(orderId);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reset: () => {
        set({
          orders: [],
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'OrderStore' }
  )
);