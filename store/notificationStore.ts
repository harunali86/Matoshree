import { create } from 'zustand';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'order' | 'offer' | 'delivery' | 'general';
    timestamp: Date;
    read: boolean;
}

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: '🎉 Order Delivered!',
        message: 'Your Sony WH-1000XM5 has been delivered. Enjoy your purchase!',
        type: 'delivery',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        read: false,
    },
    {
        id: '2',
        title: '🚚 Order Shipped',
        message: 'Your order #ORD-2024-001 is on the way!',
        type: 'order',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
    },
    {
        id: '3',
        title: '💰 Flash Sale Live!',
        message: 'Up to 70% off on Electronics. Limited time offer!',
        type: 'offer',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
    },
    {
        id: '4',
        title: '🎁 New Year Special',
        message: 'Use code NEWYEAR2024 for extra 15% off on your next order!',
        type: 'offer',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
    },
    {
        id: '5',
        title: '📦 Order Confirmed',
        message: 'Your order #ORD-2024-002 has been placed successfully.',
        type: 'order',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
    },
];

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: DUMMY_NOTIFICATIONS,
    unreadCount: DUMMY_NOTIFICATIONS.filter(n => !n.read).length,

    markAsRead: (id: string) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length,
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        }));
    },

    addNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false,
        };
        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },
}));
