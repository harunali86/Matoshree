import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../components/Themed';
import { useNotificationStore } from '../store/notificationStore';
import { ArrowLeft, Bell, Package, Tag, Truck, Info, Check } from 'lucide-react-native';

const getIcon = (type: string) => {
    switch (type) {
        case 'order': return Package;
        case 'offer': return Tag;
        case 'delivery': return Truck;
        default: return Info;
    }
};

const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between bg-white px-4 py-3 shadow-sm">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-black">Notifications</Text>
                    {unreadCount > 0 && (
                        <View className="bg-red-500 px-2 py-0.5 rounded-full ml-2">
                            <Text className="text-white text-xs font-bold">{unreadCount}</Text>
                        </View>
                    )}
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead}>
                        <Text className="text-[#2874F0] font-bold text-sm">Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {notifications.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <Bell size={48} color="#ccc" />
                        <Text className="text-gray-400 mt-4">No notifications yet</Text>
                    </View>
                ) : (
                    notifications.map((notification) => {
                        const Icon = getIcon(notification.type);
                        return (
                            <TouchableOpacity
                                key={notification.id}
                                onPress={() => markAsRead(notification.id)}
                                className={`flex-row p-4 bg-white border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                            >
                                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${notification.type === 'offer' ? 'bg-green-100' :
                                        notification.type === 'delivery' ? 'bg-blue-100' :
                                            notification.type === 'order' ? 'bg-orange-100' : 'bg-gray-100'
                                    }`}>
                                    <Icon size={20} color={
                                        notification.type === 'offer' ? '#16a34a' :
                                            notification.type === 'delivery' ? '#2874F0' :
                                                notification.type === 'order' ? '#ea580c' : '#666'
                                    } />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <Text className={`font-bold text-black flex-1 ${!notification.read ? 'text-[#2874F0]' : ''}`}>
                                            {notification.title}
                                        </Text>
                                        <Text className="text-gray-400 text-xs ml-2">{getTimeAgo(notification.timestamp)}</Text>
                                    </View>
                                    <Text className="text-gray-600 text-sm mt-1">{notification.message}</Text>
                                </View>
                                {!notification.read && (
                                    <View className="w-2 h-2 bg-[#2874F0] rounded-full ml-2 mt-2" />
                                )}
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
