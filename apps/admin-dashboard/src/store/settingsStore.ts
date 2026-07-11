import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type SettingsState = {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  sidebarCollapsed: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  devtools(
    (set) => ({
      theme: 'system',
      notificationsEnabled: true,
      emailNotifications: true,
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    { name: 'SettingsStore' }
  )
);