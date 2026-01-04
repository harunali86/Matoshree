import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '../../components/Themed';
import { useCartStore } from '../../store/cartStore';
import { Minus, Plus } from 'lucide-react-native';

export default function CartScreen() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const total = getTotal();

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <View className="px-4 py-3 bg-white shadow-sm mb-2">
                <Text className="text-xl font-bold text-black">My Cart ({items.length})</Text>
            </View>

            <ScrollView className="flex-1 px-2">
                {items.length === 0 ? (
                    <View className="items-center justify-center mt-20 bg-white p-10 rounded-lg mx-4">
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png' }}
                            className="w-32 h-32 mb-4 opacity-50"
                        />
                        <Text className="text-gray-800 text-lg font-bold mb-1">Your cart is empty</Text>
                        <Text className="text-gray-500 text-sm text-center">Add items to it now!</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/')}
                            className="mt-6 bg-[#2874F0] px-8 py-2 rounded-sm"
                        >
                            <Text className="text-white font-bold">Shop Now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        {items.map((item) => (
                            <View key={item.id} className="bg-white mb-2 p-3 flex-row shadow-sm">
                                <View className="w-20 h-20 items-center justify-center">
                                    <Image source={item.image} style={{ width: 64, height: 64 }} resizeMode="contain" />
                                </View>

                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium text-sm" numberOfLines={1}>{item.name}</Text>
                                    <Text className="text-gray-500 text-xs mt-1">{item.category}</Text>

                                    <View className="flex-row items-center mt-2 space-x-4">
                                        <Text className="text-black font-bold text-lg">${item.price * item.quantity}</Text>
                                        <Text className="text-green-700 text-xs font-bold">2 Offers Applied</Text>
                                    </View>

                                    <View className="flex-row items-center mt-3">
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                                                else removeItem(item.id);
                                            }}
                                            className="w-7 h-7 rounded-full border border-gray-300 items-center justify-center"
                                        >
                                            <Minus size={12} color="black" />
                                        </TouchableOpacity>
                                        <View className="border border-gray-200 px-3 py-1 mx-2 bg-gray-50">
                                            <Text className="text-black font-bold">{item.quantity}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-7 h-7 rounded-full border border-gray-300 items-center justify-center"
                                        >
                                            <Plus size={12} color="black" />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => removeItem(item.id)} className="ml-auto">
                                            <Text className="text-black font-bold text-xs uppercase">Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {items.length > 0 && (
                <View className="bg-white border-t border-gray-200 p-4 shadow-top">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500">Price ({items.length} items)</Text>
                        <Text className="text-black font-bold">${total}</Text>
                    </View>
                    <View className="flex-row justify-between mb-4 border-b border-gray-100 pb-4">
                        <Text className="text-gray-500">Delivery Charges</Text>
                        <Text className="text-green-700 font-bold">FREE</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-black text-xl font-bold">${total}</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/checkout')}
                            className="bg-[#FB641B] px-8 py-3 rounded-sm shadow-sm"
                        >
                            <Text className="text-white font-bold text-base uppercase">Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
