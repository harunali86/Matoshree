import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../../store/cartStore';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';

export default function Cart() {
    const router = useRouter();
    const { items, removeItem, getTotalPrice, clearCart } = useCartStore();
    const total = getTotalPrice();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text style={{ fontSize: 24, fontWeight: '900', letterSpacing: -1 }}>MY BAG</Text>
                <Text style={{ color: '#666' }}>{items.length} Items</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id + item.size}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <View style={{ width: 100, height: 100, backgroundColor: '#f9f9f9', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={{ uri: item.thumbnail || undefined }} style={{ width: '80%', height: '80%' }} resizeMode="contain" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 15, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                            <Text style={{ color: '#666', marginTop: 4 }}>Size: UK {item.size}</Text>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 10 }}>₹{item.price}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(item.id, item.size)} style={{ justifyContent: 'center', padding: 10 }}>
                            <Trash2 size={20} color="#ff3b30" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, color: '#ccc', fontWeight: 'bold' }}>Your bag is empty.</Text>
                    </View>
                }
            />

            {items.length > 0 && (
                <View style={{ padding: 20, borderTopWidth: 1, borderColor: '#eee' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, color: '#666' }}>Total</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>₹{total}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/checkout')}
                        style={{ backgroundColor: 'black', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}>CHECKOUT</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

