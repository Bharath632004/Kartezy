import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { notificationService } from '@/lib/api';

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  fetchNotifications: () => Promise<void>;
};

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications: Notification[]) => {
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({ notifications, unreadCount });
      },
      addNotification: (notification: Notification) => {
        const newNotifications = [notification, ...get().notifications];
        const unreadCount = newNotifications.filter((n) => !n.read).length;
        set({ notifications: newNotifications, unreadCount });
      },
      markAsRead: (id: string) => {
        const notifications = get().notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({ notifications, unreadCount });
      },
      markAllAsRead: () => {
        const notifications = get().notifications.map((n) => ({ ...n, read: true }));
        set({ notifications, unreadCount: 0 });
      },
      removeNotification: (id: string) => {
        const notifications = get().notifications.filter((n) => n.id !== id);
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({ notifications, unreadCount });
      },
      fetchNotifications: async () => {
        try {
          const response = await notificationService.getNotifications({});
          get().setNotifications(response.data);
        } catch (error) {
          console.error('Failed to fetch notifications', error);
        }
      },
    }),
    { name: 'NotificationStore' }
  )
);