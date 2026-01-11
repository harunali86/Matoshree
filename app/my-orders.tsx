import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Package } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface Order {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    items: any[];
}

export default function Orders() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return '#34c759';
            case 'shipped': return '#007aff';
            case 'processing': return '#ff9500';
            case 'cancelled': return '#ff3b30';
            default: return '#666';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>My Orders</Text>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="black" />
                </View>
            ) : orders.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                    <Package size={60} color="#ddd" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>No Orders Yet</Text>
                    <Text style={{ color: '#999', marginTop: 10, textAlign: 'center' }}>Start shopping to see your orders here</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)')}
                        style={{ marginTop: 30, backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>START SHOPPING</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/orders/${item.id}`)}
                            style={{
                                backgroundColor: '#f9f9f9',
                                borderRadius: 16,
                                padding: 16,
                                marginBottom: 15
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ fontWeight: '600' }}>Order #{item.id.slice(0, 8).toUpperCase()}</Text>
                                <Text style={{
                                    color: getStatusColor(item.status),
                                    fontWeight: '600',
                                    textTransform: 'capitalize'
                                }}>{item.status}</Text>
                            </View>
                            <Text style={{ color: '#666', marginBottom: 10 }}>{formatDate(item.created_at)}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: '#999' }}>View Details</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>₹{item.total_amount?.toLocaleString()}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
}
