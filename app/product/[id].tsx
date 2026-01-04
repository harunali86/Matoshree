import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';
import { PRODUCTS } from '../../data/products';
import { useCartStore } from '../../store/cartStore';
import { ArrowLeft, Heart, ShoppingCart, Star, Share2 } from 'lucide-react-native';
import { useWishlistStore } from '../../store/wishlistStore';

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const product = PRODUCTS.find((p) => p.id === id);
    const addItem = useCartStore((state) => state.addItem);
    const { toggleWishlist, isInWishlist } = useWishlistStore();

    if (!product) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-black">Product not found</Text>
            </SafeAreaView>
        );
    }

    const isLiked = isInWishlist(product.id);

    return (
        <View className="flex-1 bg-[#F1F3F6]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View className="absolute top-0 left-0 right-0 z-10 px-4 pt-12 pb-2 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-white shadow-sm rounded-full items-center justify-center"
                >
                    <ArrowLeft size={20} color="#555" />
                </TouchableOpacity>

                <View className="flex-row gap-3">
                    <TouchableOpacity className="w-10 h-10 bg-white shadow-sm rounded-full items-center justify-center">
                        <Share2 size={20} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/cart')}
                        className="w-10 h-10 bg-white shadow-sm rounded-full items-center justify-center"
                    >
                        <ShoppingCart size={20} color="#555" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 pb-20" showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View className="bg-white border-b border-gray-200 pb-4 relative">
                    <View className="w-full h-[400px] items-center justify-center p-8">
                        <Image
                            source={product.image}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => toggleWishlist(product)}
                        className="absolute top-[380px] right-4 w-12 h-12 bg-white shadow-md rounded-full items-center justify-center elevation-5"
                    >
                        <Heart
                            size={24}
                            color={isLiked ? "#FF4343" : "#C2C2C2"}
                            fill={isLiked ? "#FF4343" : "transparent"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Product Info */}
                <View className="bg-white p-4 mb-2 shadow-sm">
                    <Text className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-1">{product.category}</Text>
                    <Text className="text-black text-lg font-medium mb-2 leading-6">{product.name}</Text>

                    <View className="flex-row items-center mb-4">
                        <View className="flex-row items-center bg-green-700 px-2 py-0.5 rounded-[4px] mr-2">
                            <Text className="text-white text-xs font-bold mr-1">{product.rating}</Text>
                            <Star size={10} color="white" fill="white" />
                        </View>
                        <Text className="text-gray-500 text-xs">({product.reviews} ratings)</Text>
                    </View>

                    <View className="flex-row items-baseline mb-2">
                        <Text className="text-black text-2xl font-bold mr-3">${product.price}</Text>
                        {product.originalPrice && (
                            <Text className="text-gray-500 text-sm line-through">${product.originalPrice}</Text>
                        )}
                        <Text className="text-green-700 font-bold ml-2 text-sm">20% off</Text>
                    </View>
                </View>

                {/* Offers */}
                <View className="bg-white p-4 mb-2 shadow-sm">
                    <Text className="font-bold text-black mb-2">Available Offers</Text>
                    <View className="flex-row items-center mb-2">
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/879/879859.png' }} className="w-4 h-4 mr-2" />
                        <Text className="text-gray-800 text-xs flex-1">Bank Offer: 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/879/879859.png' }} className="w-4 h-4 mr-2" />
                        <Text className="text-gray-800 text-xs flex-1">Special Price: Get extra 10% off (price inclusive of discount)</Text>
                    </View>
                </View>

                {/* Details */}
                <View className="bg-white p-4 mb-2 shadow-sm">
                    <View className="flex-row justify-between mb-4">
                        <Text className="font-bold text-black text-base">Product Details</Text>
                    </View>
                    <Text className="text-gray-600 leading-5 text-sm">{product.description}</Text>

                    <View className="flex-row mt-6 border-t border-gray-100 pt-4">
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs mb-1">Warranty</Text>
                            <Text className="text-black text-sm">1 Year Manufacturer Warranty</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs mb-1">Seller</Text>
                            <Text className="text-[#2874F0] font-bold text-sm">SuperComNet</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Buttons */}
            <View className="absolute bottom-0 left-0 right-0 flex-row h-16 bg-white elevation-10 shadow-top z-50">
                <TouchableOpacity
                    onPress={() => {
                        addItem(product);
                        router.push('/(tabs)/cart');
                    }}
                    className="flex-1 bg-white items-center justify-center border-t border-gray-200"
                >
                    <Text className="text-black font-bold text-base">Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        addItem(product);
                        router.push('/checkout');
                    }}
                    className="flex-1 bg-[#FB641B] items-center justify-center"
                >
                    <Text className="text-white font-bold text-base">Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
