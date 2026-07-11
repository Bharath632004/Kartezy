import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { deliveryService } from '@/lib/api';

export type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'inactive' | 'offline' | 'online' | 'busy';
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  licenseExpiry: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  currentOrderId?: string;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

type DriverState = {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  setDrivers: (drivers: Driver[]) => void;
  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  removeDriver: (id: string) => void;
  fetchDrivers: (params?: any) => Promise<void>;
  fetchDriverDetail: (id: string) => Promise<Driver | null>;
  approveDriver: (id: string) => Promise<void>;
  suspendDriver: (id: string) => Promise<void>;
  activateDriver: (id: string) => Promise<void>;
  getVehicleDetails: (id: string) => Promise<any>;
  getKYC: (id: string) => Promise<any>;
  getLiveLocation: (id: string) => Promise<any>;
  getRatings: (id: string) => Promise<any>;
  getEarnings: (id: string) => Promise<any>;
  getPerformance: (id: string) => Promise<any>;
  updateLocation: (id: string, location: { lat: number; lng: number }) => void;
  setAvailable: (id: string, available: boolean) => void;
  reset: () => void;
};

export const useDriverStore = create<DriverState>()(
  devtools(
    (set, get) => ({
      drivers: [],
      loading: false,
      error: null,
      setDrivers: (drivers) => set({ drivers }),
      addDriver: (driver) => set((state) => ({ drivers: [...state.drivers, driver] })),
      updateDriver: (id, driver) =>
        set((state) => ({
          drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...driver } : d)),
        })),
      removeDriver: (id) =>
        set((state) => ({ drivers: state.drivers.filter((d) => d.id !== id) })),
      fetchDrivers: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await deliveryService.getList(params);
          set({ drivers: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchDriverDetail: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await deliveryService.getDetail(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      approveDriver: async (id) => {
        set({ loading: true, error: null });
        try {
          await deliveryService.approve(id);
          get().updateDriver(id, { status: 'approved' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      suspendDriver: async (id) => {
        set({ loading: true, error: null });
        try {
          await deliveryService.suspend(id);
          get().updateDriver(id, { status: 'suspended' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      activateDriver: async (id) => {
        set({ loading: true, error: null });
        try {
          await deliveryService.activate(id);
          get().updateDriver(id, { status: 'approved' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getVehicleDetails: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await deliveryService.getVehicleDetails(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getKYC: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await deliveryService.getKYC(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getLiveLocation: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await deliveryService.getLiveLocation(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getRatings: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await deliveryService.getRatings(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getEarnings: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await deliveryService.getEarnings(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getPerformance: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await deliveryService.getPerformance(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateLocation: (id, location) => {
        set((state) => ({
          drivers: state.drivers.map((d) =>
            d.id === id ? { ...d, currentLocation: location, lastLocationUpdate: new Date().toISOString() } : d
          ),
        }));
      },
      setAvailable: (id, available) => {
        set((state) => ({
          drivers: state.drivers.map((d) =>
            d.id === id ? { ...d, isAvailable: available } : d
          ),
        }));
      },
      reset: () => {
        set({
          drivers: [],
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'DriverStore' }
  )
);