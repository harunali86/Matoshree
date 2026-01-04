import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Themed';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, CheckCircle, CreditCard, Home as HomeIcon } from 'lucide-react-native';
import { useState } from 'react';

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const total = getTotal();
    const [success, setSuccess] = useState(false);

    const handlePayment = () => {
        setSuccess(true);
        setTimeout(() => {
            clearCart();
            router.replace('/(tabs)/');
        }, 2000);
    };

    if (success) {
        return (
            <View className="flex-1 bg-[#2874F0] items-center justify-center">
                <Stack.Screen options={{ headerShown: false }} />
                <CheckCircle size={80} color="white" />
                <Text className="text-white text-2xl font-bold mt-4">Order Placed!</Text>
                <Text className="text-white/80 mt-2">Redirecting to home...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="px-4 py-3 bg-white flex-row items-center shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black">Order Summary</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Address Step */}
                <View className="bg-white p-4 mb-2">
                    <View className="flex-row items-center mb-3">
                        <View className="w-6 h-6 rounded-full bg-[#2874F0] items-center justify-center mr-2"><Text className="text-white text-xs font-bold">1</Text></View>
                        <Text className="text-black font-bold">Deliver to:</Text>
                    </View>
                    <Text className="text-black font-bold ml-8">Harun User</Text>
                    <Text className="text-gray-600 text-sm ml-8">123, Main Street, Tech Park, Bangalore - 560001</Text>
                    <TouchableOpacity className="ml-8 mt-2 bg-gray-100 self-start px-4 py-1 rounded-sm border border-gray-200">
                        <Text className="text-[#2874F0] text-sm font-bold">Change</Text>
                    </TouchableOpacity>
                </View>

                {/* Items Step */}
                <View className="bg-white p-4 mb-2">
                    <View className="flex-row items-center mb-3">
                        <View className="w-6 h-6 rounded-full bg-[#2874F0] items-center justify-center mr-2"><Text className="text-white text-xs font-bold">2</Text></View>
                        <Text className="text-black font-bold">Order Items ({items.length})</Text>
                    </View>
                    {items.map(item => (
                        <View key={item.id} className="ml-8 mb-2 flex-row justify-between">
                            <Text className="text-gray-800 flex-1">{item.name} <Text className="text-gray-400">x{item.quantity}</Text></Text>
                            <Text className="text-black font-bold">${item.price * item.quantity}</Text>
                        </View>
                    ))}
                </View>

                {/* Price Details */}
                <View className="bg-white p-4 mb-20">
                    <Text className="text-gray-500 font-bold uppercase text-xs mb-4">Price Details</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-800">Price ({items.length} items)</Text>
                        <Text className="text-black">${total}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-800">Delivery Charges</Text>
                        <Text className="text-green-700">FREE</Text>
                    </View>
                    <View className="flex-row justify-between mb-4 border-t border-gray-100 pt-4">
                        <Text className="text-black font-bold text-lg">Total Amount</Text>
                        <Text className="text-black font-bold text-lg">${total}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex-row items-center px-4 justify-between">
                <Text className="text-black font-bold text-xl">${total}</Text>
                <TouchableOpacity onPress={handlePayment} className="bg-[#FB641B] px-8 py-3 rounded-sm">
                    <Text className="text-white font-bold text-base uppercase">Place Order</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
