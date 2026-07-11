import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { userService } from '@/lib/api';

export type User = {
  id: string;
  email: string;
  role: string;
  name: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  walletBalance?: number;
};

type UserState = {
  users: User[];
  loading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  removeUser: (id: string) => void;
  fetchUsers: (params?: any) => Promise<void>;
  fetchUserDetail: (id: string) => Promise<User | null>;
  blockUser: (id: string) => Promise<void>;
  unblockUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  reset: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      users: [],
      loading: false,
      error: null,
      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, user) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
        })),
      removeUser: (id) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
      fetchUsers: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await userService.getList(params);
          set({ users: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchUserDetail: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await userService.getDetail(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      blockUser: async (id) => {
        set({ loading: true, error: null });
        try {
          await userService.blockUser(id);
          get().updateUser(id, { status: 'suspended' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      unblockUser: async (id) => {
        set({ loading: true, error: null });
        try {
          await userService.unblockUser(id);
          get().updateUser(id, { status: 'active' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deleteUser: async (id) => {
        set({ loading: true, error: null });
        try {
          await userService.deleteUser(id);
          get().removeUser(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reset: () => {
        set({
          users: [],
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'UserStore' }
  )
);