import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../../store/cartStore';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

export default function Cart() {
    const router = useRouter();

    // Correctly accessing the store
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const getTotalPrice = useCartStore((state) => state.getTotalPrice);

    const { user } = useAuthStore();
    const isWholesaleUser = user?.role === 'wholesale' && user?.is_verified;

    const total = getTotalPrice(isWholesaleUser);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text style={{ fontSize: 24, fontWeight: '900', letterSpacing: -1 }}>MY BAG</Text>
                <Text style={{ color: '#666' }}>{items.reduce((acc, i) => acc + i.quantity, 0)} Items</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id + item.size}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => {
                    // Determine effective unit price for display
                    let displayPrice = item.price;
                    if (isWholesaleUser && item.price_wholesale) displayPrice = item.price_wholesale;

                    if (isWholesaleUser && item.price_tiers && item.price_tiers.length > 0) {
                        const tier = item.price_tiers.find((t: any) => item.quantity >= t.min_quantity && (!t.max_quantity || item.quantity <= t.max_quantity));
                        if (tier) displayPrice = tier.unit_price;
                    } else if (!isWholesaleUser && item.sale_price) {
                        // Retail Sale Price
                        displayPrice = item.sale_price;
                    }

                    return (
                        <View style={{ flexDirection: 'row', marginBottom: 20, backgroundColor: 'white' }}>
                            <View style={{ width: 100, height: 100, backgroundColor: '#f9f9f9', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: item.thumbnail || undefined }} style={{ width: '80%', height: '80%' }} resizeMode="contain" />
                            </View>

                            <View style={{ flex: 1, marginLeft: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>{item.name}</Text>
                                        <Text style={{ color: '#666', marginTop: 4, fontSize: 13 }}>Size: UK {item.size}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeItem(item.id, item.size)} style={{ padding: 5 }}>
                                        <Trash2 size={18} color="#ff3b30" />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700' }}>₹{displayPrice.toLocaleString()}</Text>

                                    {/* Quantity Selector */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 4 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                let newQty = item.quantity - 1;
                                                const moq = (isWholesaleUser && item.moq) ? item.moq : 1;
                                                if (newQty < moq) {
                                                    // Optionally alert user or just clamp
                                                    if (newQty > 0) newQty = moq;
                                                    // If newQty becomes 0, allow removal or clamp to MOQ? usually remove is separate button.
                                                    // Here it's quantity update. If < 1 usually means remove, but let's stick to updateQuantity logic.
                                                    // Actually if newQty < moq, we should probably stop or set to moq.
                                                    // But user might want to remove item. The Trash button is separate.
                                                    // So we treat this as decrement.
                                                    // If current is MOQ, do nothing or show toast.
                                                    return;
                                                }
                                                updateQuantity(item.id, item.size, newQty);
                                            }}
                                            style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <Text style={{ fontSize: 18, fontWeight: '600' }}>-</Text>
                                        </TouchableOpacity>

                                        <Text style={{ marginHorizontal: 8, fontWeight: '600', minWidth: 20, textAlign: 'center' }}>{item.quantity}</Text>

                                        <TouchableOpacity
                                            onPress={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                            style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <Text style={{ fontSize: 18, fontWeight: '600' }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, color: '#ccc', fontWeight: 'bold' }}>Your bag is empty.</Text>
                    </View>
                }
            />

            {items.length > 0 && (
                <View style={{ padding: 20, borderTopWidth: 1, borderColor: '#eee' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, color: '#666' }}>Total Amount</Text>
                        <Text style={{ fontSize: 22, fontWeight: '900' }}>₹{total.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/checkout')}
                        style={{ backgroundColor: 'black', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}>CHECKOUT SECURELY</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

