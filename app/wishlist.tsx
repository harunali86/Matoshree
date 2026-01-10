import React from 'react';
import { ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { useWishlistStore } from '../store/wishlistStore';
import { useRouter } from 'expo-router';
import { Heart, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '../store/cartStore';

export default function WishlistScreen() {
    const { items, toggleItem } = useWishlistStore();
    const addToCart = useCartStore(state => state.addItem);
    const router = useRouter();

    const handleAddToCart = (item: typeof items[0]) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            size: 'UK 8', // Default size
            color: 'Default',
        });
        router.push('/(tabs)/cart');
    };

    return (
        <Container safeArea className="bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-6 border-b border-gray-100">
                    <Typography variant="h1" className="text-3xl font-black uppercase tracking-tighter mb-2">
                        Wishlist
                    </Typography>
                    <Typography variant="caption" color="muted">
                        {items.length} {items.length === 1 ? 'item' : 'items'} saved
                    </Typography>
                </View>

                {/* Empty State */}
                {items.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <Heart size={64} color="#E5E7EB" strokeWidth={1} />
                        <Typography variant="h3" className="mt-6 mb-2">Your wishlist is empty</Typography>
                        <Typography variant="body" color="muted" className="text-center mb-6 px-8">
                            Start adding items you love by tapping the heart icon
                        </Typography>
                        <Button title="Continue Shopping" onPress={() => router.push('/(tabs)/shop')} />
                    </View>
                ) : (
                    <View className="px-6 py-4">
                        {items.map((item) => (
                            <View key={item.id} className="flex-row mb-6 pb-6 border-b border-gray-100">
                                {/* Image */}
                                <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
                                    <View className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden mr-4">
                                        <Image
                                            source={{ uri: item.image }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>
                                </TouchableOpacity>

                                {/* Details */}
                                <View className="flex-1 justify-between">
                                    <View>
                                        <Typography variant="body" className="font-bold mb-1">{item.name}</Typography>
                                        <Typography variant="caption" color="muted" className="mb-2">{item.category}</Typography>
                                        <Typography variant="body" className="font-bold">₹{item.price.toLocaleString()}</Typography>
                                    </View>

                                    {/* Actions */}
                                    <View className="flex-row gap-2 mt-2">
                                        <TouchableOpacity
                                            onPress={() => handleAddToCart(item)}
                                            className="flex-row items-center bg-black px-4 py-2 rounded-lg flex-1"
                                        >
                                            <ShoppingBag size={14} color="white" />
                                            <Typography variant="caption" className="text-white ml-2 font-bold text-xs">
                                                Add to Cart
                                            </Typography>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => toggleItem(item)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg"
                                        >
                                            <Heart size={14} color="black" fill="black" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </Container>
    );
}
