import React from 'react';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../store/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react-native';

export default function CartScreen() {
    const router = useRouter();
    const { items, total, removeItem, updateQuantity } = useCartStore();

    if (items.length === 0) {
        return (
            <Container className="justify-center items-center px-6">
                <Typography variant="h2" className="mb-2">Your Bag is Empty</Typography>
                <Typography variant="body" color="muted" className="text-center mb-8">
                    Looks like you haven't added anything yet.
                </Typography>
                <Button
                    title="Start Shopping"
                    onPress={() => router.push('/')}
                    className="w-full"
                />
            </Container>
        );
    }

    return (
        <Container safeArea className="bg-white">
            <View className="px-6 py-4 border-b border-gray-100">
                <Typography variant="h1">BAG ({items.length})</Typography>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => `${item.id}-${item.size}`}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View className="flex-row mb-8">
                        {/* Image */}
                        <View className="w-24 h-32 bg-gray-100 rounded-sm overflow-hidden mr-4">
                            <Image
                                source={{ uri: item.image }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>

                        {/* Details */}
                        <View className="flex-1 justify-between py-1">
                            <View>
                                <View className="flex-row justify-between items-start">
                                    <Typography variant="h3" className="mb-1 leading-tight flex-1 mr-2">{item.name}</Typography>
                                    <TouchableOpacity onPress={() => removeItem(item.id, item.size)}>
                                        <Trash2 size={20} color="#999" />
                                    </TouchableOpacity>
                                </View>
                                <Typography variant="caption" color="muted" className="mb-1">Size: {item.size}</Typography>
                                <Typography variant="body" className="font-semibold">₹{item.price.toLocaleString()}</Typography>
                            </View>

                            {/* Quantity */}
                            <View className="flex-row items-center mt-2">
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center"
                                >
                                    <Minus size={14} color="black" />
                                </TouchableOpacity>
                                <Typography variant="body" className="mx-4 font-medium">{item.quantity}</Typography>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center"
                                >
                                    <Plus size={14} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />

            {/* Footer */}
            <View className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-100 safe-bottom">
                <View className="flex-row justify-between items-center mb-4">
                    <Typography variant="body" color="muted">Total</Typography>
                    <Typography variant="h2">₹{total.toLocaleString()}</Typography>
                </View>
                <Button
                    title="Checkout"
                    size="lg"
                    onPress={() => router.push('/checkout')}
                />
            </View>
        </Container>
    );
}
