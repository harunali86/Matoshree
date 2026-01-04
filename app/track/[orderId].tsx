import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '../../components/Themed';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Download, Share2 } from 'lucide-react-native';

const TRACKING_STEPS = [
    { id: 1, status: 'Order Placed', date: 'Jan 1, 2026 - 10:30 AM', completed: true, icon: Package },
    { id: 2, status: 'Order Confirmed', date: 'Jan 1, 2026 - 11:00 AM', completed: true, icon: CheckCircle },
    { id: 3, status: 'Shipped', date: 'Jan 2, 2026 - 09:15 AM', completed: true, icon: Truck },
    { id: 4, status: 'Out for Delivery', date: 'Jan 3, 2026 - 08:00 AM', completed: true, icon: Truck },
    { id: 5, status: 'Delivered', date: 'Jan 3, 2026 - 02:30 PM', completed: false, icon: MapPin },
];

export default function TrackOrderScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-lg font-bold text-black">Track Order</Text>
                    <Text className="text-gray-500 text-xs">Order #{orderId || 'ORD-2024-001'}</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Delivery Info */}
                <View className="bg-white p-4 mb-2">
                    <View className="flex-row items-center mb-3">
                        <Truck size={20} color="#16a34a" />
                        <Text className="text-green-600 font-bold ml-2">Expected Delivery: Today by 6 PM</Text>
                    </View>
                    <View className="flex-row items-start">
                        <MapPin size={16} color="#666" />
                        <View className="ml-2 flex-1">
                            <Text className="text-gray-800 font-medium">Harun Ahmed</Text>
                            <Text className="text-gray-500 text-sm">123 Main Street, Apartment 4B, Mumbai, Maharashtra - 400001</Text>
                        </View>
                    </View>
                </View>

                {/* Timeline */}
                <View className="bg-white p-4 mb-2">
                    <Text className="text-black font-bold mb-4">Shipment Progress</Text>
                    {TRACKING_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isLast = index === TRACKING_STEPS.length - 1;
                        return (
                            <View key={step.id} className="flex-row">
                                <View className="items-center mr-4">
                                    <View className={`w-8 h-8 rounded-full items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-200'
                                        }`}>
                                        <Icon size={16} color={step.completed ? 'white' : '#999'} />
                                    </View>
                                    {!isLast && (
                                        <View className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                                    )}
                                </View>
                                <View className="flex-1 pb-6">
                                    <Text className={`font-bold ${step.completed ? 'text-black' : 'text-gray-400'}`}>
                                        {step.status}
                                    </Text>
                                    <Text className="text-gray-500 text-xs">{step.date}</Text>
                                    {step.id === 3 && (
                                        <Text className="text-[#2874F0] text-xs mt-1">Tracking: AWB123456789</Text>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Actions */}
                <View className="flex-row p-4 gap-4">
                    <TouchableOpacity className="flex-1 bg-white py-3 rounded-lg items-center flex-row justify-center shadow-sm">
                        <Download size={18} color="#2874F0" />
                        <Text className="text-[#2874F0] font-bold ml-2">Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white py-3 rounded-lg items-center flex-row justify-center shadow-sm">
                        <Share2 size={18} color="#2874F0" />
                        <Text className="text-[#2874F0] font-bold ml-2">Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Support */}
                <View className="bg-white p-4 mb-4">
                    <Text className="text-black font-bold mb-2">Need Help?</Text>
                    <TouchableOpacity onPress={() => router.push('/support/chat')} className="bg-[#2874F0] py-3 rounded-lg items-center">
                        <Text className="text-white font-bold">Chat with Support</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
