import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Themed';
import { ArrowLeft, Package, ChevronRight, Truck, FileText, RefreshCw, Star } from 'lucide-react-native';

export default function OrdersScreen() {
    const router = useRouter();

    const orders = [
        {
            id: '001',
            date: 'Jan 3, 2026',
            status: 'Out for Delivery',
            statusColor: 'text-blue-600',
            item: 'Sony WH-1000XM5',
            price: 349,
            image: { uri: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&q=80' }
        },
        {
            id: '002',
            date: 'Dec 28, 2025',
            status: 'Delivered',
            statusColor: 'text-green-600',
            item: 'Nike Air Jordan 1',
            price: 180,
            image: { uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' }
        },
        {
            id: '003',
            date: 'Dec 15, 2025',
            status: 'Delivered',
            statusColor: 'text-green-600',
            item: 'Apple Watch S9',
            price: 399,
            image: { uri: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80' }
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="px-4 py-3 bg-white flex-row items-center shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black">My Orders</Text>
            </View>

            <ScrollView className="flex-1 px-2 pt-2">
                {orders.map((order) => (
                    <View key={order.id} className="bg-white mb-3 rounded-lg shadow-sm overflow-hidden">
                        {/* Order Header */}
                        <View className="flex-row items-center px-4 py-2 bg-gray-50 border-b border-gray-100">
                            <Text className="text-gray-500 text-xs flex-1">Order #{order.id}</Text>
                            <Text className="text-gray-500 text-xs">{order.date}</Text>
                        </View>

                        {/* Order Content */}
                        <View className="p-4 flex-row">
                            <Image
                                source={order.image}
                                className="w-20 h-20 rounded-lg bg-gray-100"
                                style={{ width: 80, height: 80 }}
                                resizeMode="cover"
                            />
                            <View className="ml-4 flex-1">
                                <Text className={`font-bold text-sm mb-1 ${order.statusColor}`}>{order.status}</Text>
                                <Text className="text-gray-900 text-sm mb-1">{order.item}</Text>
                                <Text className="text-black font-bold">${order.price}</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row border-t border-gray-100">
                            <TouchableOpacity
                                onPress={() => router.push(`/track/${order.id}`)}
                                className="flex-1 flex-row items-center justify-center py-3 border-r border-gray-100"
                            >
                                <Truck size={16} color="#2874F0" />
                                <Text className="text-[#2874F0] font-bold text-xs ml-1">Track</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push(`/invoice/${order.id}`)}
                                className="flex-1 flex-row items-center justify-center py-3 border-r border-gray-100"
                            >
                                <FileText size={16} color="#2874F0" />
                                <Text className="text-[#2874F0] font-bold text-xs ml-1">Invoice</Text>
                            </TouchableOpacity>
                            {order.status === 'Delivered' ? (
                                <>
                                    <TouchableOpacity
                                        onPress={() => router.push(`/review/1`)}
                                        className="flex-1 flex-row items-center justify-center py-3 border-r border-gray-100"
                                    >
                                        <Star size={16} color="#FB641B" />
                                        <Text className="text-[#FB641B] font-bold text-xs ml-1">Review</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => router.push(`/return/${order.id}`)}
                                        className="flex-1 flex-row items-center justify-center py-3"
                                    >
                                        <RefreshCw size={16} color="#666" />
                                        <Text className="text-gray-600 font-bold text-xs ml-1">Return</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3">
                                    <Text className="text-gray-400 font-bold text-xs">Cancel</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
