import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'order' | 'promo' | 'system';
    data?: any; // e.g., { order_id: 'xxx' }
    is_read: boolean;
    created_at: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: (userId: string) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: (userId: string) => Promise<void>;
    addLocalNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async (userId: string) => {
        set({ loading: true });
        try {
            const { data, error } = await supabase
                .from('user_notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) {
                set({
                    notifications: data,
                    unreadCount: data.filter(n => !n.is_read).length
                });
            }
        } catch (e) {
            console.error('Error fetching notifications:', e);
        } finally {
            set({ loading: false });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await supabase
                .from('user_notifications')
                .update({ is_read: true })
                .eq('id', id);

            set(state => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, is_read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (e) {
            console.error('Error marking as read:', e);
        }
    },

    markAllAsRead: async (userId: string) => {
        try {
            await supabase
                .from('user_notifications')
                .update({ is_read: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, is_read: true })),
                unreadCount: 0
            }));
        } catch (e) {
            console.error('Error marking all as read:', e);
        }
    },

    // For local push notifications that haven't been synced yet
    addLocalNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: `local-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        set(state => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    }
}));
