import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Bell, Package, Tag, Info, CheckCheck } from 'lucide-react-native';
import { useNotificationStore, Notification } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'order': return Package;
        case 'promo': return Tag;
        default: return Info;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case 'order': return '#3b82f6';
        case 'promo': return '#f59e0b';
        default: return '#6b7280';
    }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

export default function Notifications() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchNotifications(user.id);
        }
    }, [user?.id]);

    const onRefresh = useCallback(async () => {
        if (user?.id) {
            setRefreshing(true);
            await fetchNotifications(user.id);
            setRefreshing(false);
        }
    }, [user?.id]);

    const handleNotificationPress = async (notification: Notification) => {
        // Mark as read
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }

        // Navigate based on type
        if (notification.type === 'order' && notification.data?.order_id) {
            router.push(`/orders/${notification.data.order_id}`);
        }
    };

    const handleMarkAllAsRead = () => {
        if (user?.id) {
            markAllAsRead(user.id);
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => {
        const Icon = getNotificationIcon(item.type);
        const color = getNotificationColor(item.type);

        return (
            <TouchableOpacity
                onPress={() => handleNotificationPress(item)}
                style={{
                    flexDirection: 'row',
                    padding: 16,
                    backgroundColor: item.is_read ? 'white' : '#f0f9ff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0'
                }}
            >
                <View style={{
                    width: 44, height: 44, borderRadius: 22,
                    backgroundColor: `${color}20`,
                    justifyContent: 'center', alignItems: 'center', marginRight: 12
                }}>
                    <Icon size={22} color={color} />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{ fontWeight: item.is_read ? '500' : '700', fontSize: 15, flex: 1, marginRight: 8 }}>
                            {item.title}
                        </Text>
                        {!item.is_read && (
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6', marginTop: 6 }} />
                        )}
                    </View>
                    <Text style={{ color: '#666', fontSize: 13, marginTop: 4, lineHeight: 18 }} numberOfLines={2}>
                        {item.message}
                    </Text>
                    <Text style={{ color: '#999', fontSize: 11, marginTop: 6 }}>
                        {formatTimeAgo(item.created_at)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && notifications.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="black" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15, flex: 1 }}>Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllAsRead} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckCheck size={18} color="#3b82f6" />
                        <Text style={{ color: '#3b82f6', fontWeight: '600', fontSize: 13, marginLeft: 4 }}>Read All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {notifications.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <Bell size={32} color="#ccc" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>No Notifications</Text>
                    <Text style={{ color: '#999', marginTop: 8, textAlign: 'center' }}>
                        You're all caught up! New notifications will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNotification}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </SafeAreaView>
    );
}
