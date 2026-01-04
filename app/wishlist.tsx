import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Themed';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react-native';

export default function WishlistScreen() {
    const router = useRouter();
    const { items, toggleWishlist } = useWishlistStore();
    const addItem = useCartStore((state) => state.addItem);

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="px-4 py-3 bg-white flex-row items-center shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black">My Wishlist ({items.length})</Text>
            </View>

            <ScrollView className="flex-1 px-2 pt-2">
                {items.length === 0 ? (
                    <View className="items-center justify-center mt-32">
                        <Text className="text-gray-400 text-lg">Your wishlist is empty</Text>
                    </View>
                ) : items.map((product) => (
                    <View key={product.id} className="bg-white mb-2 p-3 flex-row rounded-lg shadow-sm border border-gray-100">
                        <View className="w-24 h-24 bg-gray-50 items-center justify-center rounded-md">
                            <Image source={product.image} className="w-20 h-20" resizeMode="contain" />
                        </View>
                        <View className="flex-1 ml-3 justify-between py-1">
                            <View>
                                <Text className="text-gray-900 font-medium text-sm" numberOfLines={2}>{product.name}</Text>
                                <View className="flex-row items-center mt-1">
                                    <Text className="text-black font-bold text-base mr-2">${product.price}</Text>
                                    <Text className="text-gray-400 text-xs line-through">${product.originalPrice || product.price + 50}</Text>
                                    <Text className="text-green-700 text-xs font-bold ml-2">20% off</Text>
                                </View>
                            </View>

                            <View className="flex-row gap-3 mt-2">
                                <TouchableOpacity
                                    onPress={() => {
                                        addItem(product);
                                        toggleWishlist(product); // Remove from wishlist after adding
                                    }}
                                    className="flex-1 border border-[#2874F0] py-2 rounded-sm items-center justify-center"
                                >
                                    <Text className="text-[#2874F0] text-xs font-bold uppercase">Move to Cart</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => toggleWishlist(product)}
                                    className="w-10 items-center justify-center"
                                >
                                    <Trash2 size={20} color="#999" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
