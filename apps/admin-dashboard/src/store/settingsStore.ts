import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type SettingsState = {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  sidebarCollapsed: boolean;
  // Additional enterprise settings
  compactMode: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  defaultDateRange: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month' | 'this_quarter' | 'this_year';
  rowsPerPage: number;
  enableAnimations: boolean;
  enableSound: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  currency: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  setReduceMotion: (reduce: boolean) => void;
  setHighContrast: (high: boolean) => void;
  setDefaultDateRange: (range: SettingsState['defaultDateRange']) => void;
  setRowsPerPage: (rows: number) => void;
  setEnableAnimations: (enable: boolean) => void;
  setEnableSound: (enable: boolean) => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  setDateFormat: (format: string) => void;
  setTimeFormat: (format: string) => void;
  setNumberFormat: (format: string) => void;
  setCurrency: (currency: string) => void;
  reset: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  devtools(
    (set) => ({
      theme: 'system',
      notificationsEnabled: true,
      emailNotifications: true,
      sidebarCollapsed: false,
      compactMode: false,
      reduceMotion: false,
      highContrast: false,
      defaultDateRange: 'last_7_days',
      rowsPerPage: 50,
      enableAnimations: true,
      enableSound: true,
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/dd/yyyy',
      timeFormat: 'hh:mm aa',
      numberFormat: 'standard',
      currency: 'USD',
      setTheme: (theme) => set({ theme }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCompactMode: (compact) => set({ compactMode: compact }),
      setReduceMotion: (reduce) => set({ reduceMotion: reduce }),
      setHighContrast: (high) => set({ highContrast: high }),
      setDefaultDateRange: (range) => set({ defaultDateRange: range }),
      setRowsPerPage: (rows) => set({ rowsPerPage: rows }),
      setEnableAnimations: (enable) => set({ enableAnimations: enable }),
      setEnableSound: (enable) => set({ enableSound: enable }),
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
      setDateFormat: (format) => set({ dateFormat: format }),
      setTimeFormat: (format) => set({ timeFormat: format }),
      setNumberFormat: (format) => set({ numberFormat: format }),
      setCurrency: (currency) => set({ currency }),
      reset: () => {
        set({
          theme: 'system',
          notificationsEnabled: true,
          emailNotifications: true,
          sidebarCollapsed: false,
          compactMode: false,
          reduceMotion: false,
          highContrast: false,
          defaultDateRange: 'last_7_days',
          rowsPerPage: 50,
          enableAnimations: true,
          enableSound: true,
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/dd/yyyy',
          timeFormat: 'hh:mm aa',
          numberFormat: 'standard',
          currency: 'USD',
        });
      },
    }),
    { name: 'SettingsStore' }
  )
);