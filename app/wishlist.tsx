import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types';

interface WishlistItem {
    id: string;
    product: Product;
}

export default function Wishlist() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const addToCart = useCartStore(s => s.addItem);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const fetchWishlist = async () => {
        const { data } = await supabase
            .from('wishlist')
            .select('id, product:products(*)')
            .eq('user_id', user?.id);

        if (data) setItems(data as any);
        setLoading(false);
    };

    const removeFromWishlist = async (id: string) => {
        await supabase.from('wishlist').delete().eq('id', id);
        fetchWishlist();
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product, 8); // Default size 8
        Alert.alert('Added to Bag', `${product.name} added to your bag`);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Wishlist</Text>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="black" />
                </View>
            ) : !isAuthenticated ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                    <Heart size={60} color="#ddd" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Sign In Required</Text>
                    <Text style={{ color: '#999', marginTop: 10, textAlign: 'center' }}>Please sign in to view your wishlist</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        style={{ marginTop: 30, backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>SIGN IN</Text>
                    </TouchableOpacity>
                </View>
            ) : items.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                    <Heart size={60} color="#ddd" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Wishlist Empty</Text>
                    <Text style={{ color: '#999', marginTop: 10, textAlign: 'center' }}>Save items you love for later</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/search')}
                        style={{ marginTop: 30, backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>BROWSE PRODUCTS</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={items}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 15 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => (
                        <View style={{ width: '48%', backgroundColor: '#f9f9f9', borderRadius: 16, marginBottom: 15, overflow: 'hidden' }}>
                            <TouchableOpacity onPress={() => router.push(`/product/${item.product.id}`)}>
                                <View style={{ aspectRatio: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={{ uri: item.product.thumbnail || undefined }} style={{ width: '100%', height: '100%' }} contentFit="cover" cachePolicy="memory-disk" />
                                </View>
                            </TouchableOpacity>

                            <View style={{ padding: 12 }}>
                                <Text style={{ fontWeight: '600', marginBottom: 4 }} numberOfLines={1}>{item.product.name}</Text>
                                <Text style={{ color: '#666', marginBottom: 10 }}>₹{item.product.price}</Text>

                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <TouchableOpacity
                                        onPress={() => handleAddToCart(item.product)}
                                        style={{ flex: 1, backgroundColor: 'black', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}
                                    >
                                        <ShoppingBag size={16} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => removeFromWishlist(item.id)}
                                        style={{ width: 36, backgroundColor: '#fff0f0', paddingVertical: 8, borderRadius: 8, alignItems: 'center' }}
                                    >
                                        <Heart size={16} color="#ff3b30" fill="#ff3b30" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}
