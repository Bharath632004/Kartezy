import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '@/lib/api';

export type User = {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/api/auth/login', { email, password });
          const { accessToken, refreshToken, user } = response.data;
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      },
      refreshToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error('No refresh token');
        try {
          const response = await api.post('/api/auth/refresh', { refreshToken });
          const { accessToken } = response.data;
          set({ accessToken });
          localStorage.setItem('accessToken', accessToken);
        } catch (error) {
          get().logout();
          throw error;
        }
      },
      sendOtp: async (email: string) => {
        set({ isLoading: true });
        try {
          await api.post('/api/auth/send-otp', { email });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      verifyOtp: async (email: string, otp: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/api/auth/verify-otp', { email, otp });
          const { accessToken, refreshToken, user } = response.data;
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logoutAllDevices: async () => {
        set({ isLoading: true });
        try {
          await api.post('/api/auth/logout-all-devices');
          // Clear local state and redirect to login
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      fetchUser: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        try {
          const response = await api.get('/api/auth/me');
          set({ user: response.data });
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      },
    }),
    { name: 'AuthStore' }
  )
);
