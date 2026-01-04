import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';
import { useRouter } from 'expo-router';
import {
    ChevronRight, Box, Heart, Settings, LogOut, CreditCard, User, MapPin,
    Bell, Tag, HelpCircle, Shield, RefreshCw
} from 'lucide-react-native';
import { useNotificationStore } from '../../store/notificationStore';

export default function AccountScreen() {
    const router = useRouter();
    const unreadCount = useNotificationStore((state) => state.unreadCount);

    const MENU_SECTIONS = [
        {
            title: 'Account Settings',
            items: [
                { icon: User, label: 'Edit Profile', route: '/profile/edit' },
                { icon: MapPin, label: 'Saved Addresses', route: '/profile/addresses' },
                { icon: CreditCard, label: 'Payment Methods', route: '/payment-methods' },
                { icon: Settings, label: 'App Settings', route: '/settings' },
            ]
        },
        {
            title: 'My Activity',
            items: [
                { icon: Box, label: 'My Orders', route: '/orders' },
                { icon: Heart, label: 'My Wishlist', route: '/wishlist' },
                { icon: Tag, label: 'Coupons & Offers', route: '/coupons' },
                { icon: Bell, label: 'Notifications', route: '/notifications', badge: unreadCount },
            ]
        },
        {
            title: 'Rewards & Earnings',
            items: [
                { icon: Tag, label: 'Harun Rewards', route: '/rewards' },
                { icon: HelpCircle, label: 'Refer & Earn', route: '/refer' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help Center', route: '/help' },
                { icon: RefreshCw, label: 'Return & Refund Policy', route: '/help' },
                { icon: Shield, label: 'Privacy Policy' },
            ]
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            {/* Profile Header */}
            <View className="px-4 py-4 bg-white mb-2 shadow-sm flex-row items-center">
                <View className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center border-2 border-blue-200">
                    <Text className="text-white text-xl font-bold">H</Text>
                </View>
                <View className="ml-4 flex-1">
                    <Text className="text-black text-lg font-bold">Harun Ahmed</Text>
                    <Text className="text-gray-500 text-sm">+91 98765 43210</Text>
                    <Text className="text-gray-400 text-xs">harun@example.com</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile/edit')}>
                    <Text className="text-[#2874F0] font-bold text-sm">Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View className="flex-row bg-white py-4 mb-2 justify-evenly">
                <TouchableOpacity className="items-center" onPress={() => router.push('/orders')}>
                    <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center">
                        <Box size={22} color="#2874F0" />
                    </View>
                    <Text className="text-xs font-medium mt-2 text-gray-700">Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center" onPress={() => router.push('/wishlist')}>
                    <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center">
                        <Heart size={22} color="#ef4444" />
                    </View>
                    <Text className="text-xs font-medium mt-2 text-gray-700">Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center" onPress={() => router.push('/coupons')}>
                    <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center">
                        <Tag size={22} color="#16a34a" />
                    </View>
                    <Text className="text-xs font-medium mt-2 text-gray-700">Coupons</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center" onPress={() => router.push('/help')}>
                    <View className="w-12 h-12 bg-orange-50 rounded-full items-center justify-center">
                        <HelpCircle size={22} color="#ea580c" />
                    </View>
                    <Text className="text-xs font-medium mt-2 text-gray-700">Help</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                {MENU_SECTIONS.map((section, sIdx) => (
                    <View key={sIdx} className="bg-white mb-2 shadow-sm">
                        <Text className="px-4 py-3 text-gray-500 font-bold text-xs uppercase tracking-wide border-b border-gray-100">
                            {section.title}
                        </Text>
                        {section.items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className="flex-row items-center px-4 py-4 border-b border-gray-50 active:bg-gray-50"
                                onPress={() => item.route && router.push(item.route)}
                            >
                                <item.icon size={20} color="#2874F0" />
                                <Text className="flex-1 ml-4 text-gray-800 font-medium text-sm">{item.label}</Text>
                                {item.badge && item.badge > 0 && (
                                    <View className="bg-red-500 px-2 py-0.5 rounded-full mr-2">
                                        <Text className="text-white text-xs font-bold">{item.badge}</Text>
                                    </View>
                                )}
                                <ChevronRight size={16} color="#CCCCCC" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                <View className="bg-white mb-6 shadow-sm">
                    <TouchableOpacity
                        className="px-4 py-4 flex-row items-center justify-center"
                        onPress={() => router.replace('/login')}
                    >
                        <LogOut size={18} color="#ef4444" />
                        <Text className="text-red-500 font-bold ml-2">Log Out</Text>
                    </TouchableOpacity>
                </View>

                {/* App Version */}
                <Text className="text-center text-gray-400 text-xs mb-4">
                    Harun Store v2.0.0
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
