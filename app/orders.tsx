import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Package, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';

interface Order {
    id: string;
    order_number: string;
    created_at: string;
    total: number;
    status: string;
    items: any;
}

export default function OrdersScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'text-green-600';
            case 'shipped': return 'text-blue-600';
            case 'pending': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <Container safeArea className="bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-6 border-b border-gray-100">
                    <Typography variant="h1" className="text-3xl font-black uppercase tracking-tighter mb-2">
                        My Orders
                    </Typography>
                    <Typography variant="caption" color="muted">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                    </Typography>
                </View>

                {/* Loading State */}
                {loading ? (
                    <View className="h-64 items-center justify-center">
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                ) : orders.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <Package size={64} color="#E5E7EB" strokeWidth={1} />
                        <Typography variant="h3" className="mt-6 mb-2">No orders yet</Typography>
                        <Typography variant="body" color="muted" className="text-center mb-6 px-8">
                            Start shopping to see your orders here
                        </Typography>
                    </View>
                ) : (
                    <View className="px-6 py-4">
                        {orders.map((order) => (
                            <TouchableOpacity
                                key={order.id}
                                onPress={() => router.push(`/order/${order.id}`)}
                                className="mb-4 p-4 border border-gray-200 rounded-lg"
                                activeOpacity={0.7}
                            >
                                <View className="flex-row justify-between items-start mb-3">
                                    <View className="flex-1">
                                        <Typography variant="body" className="font-bold mb-1">
                                            Order #{order.id.slice(0, 8).toUpperCase()}
                                        </Typography>
                                        <Typography variant="caption" color="muted">
                                            {formatDate(order.created_at)}
                                        </Typography>
                                    </View>
                                    <ChevronRight size={20} color="#9CA3AF" />
                                </View>

                                <View className="flex-row justify-between items-center mb-3">
                                    <Typography variant="caption" className={`font-bold uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </Typography>
                                    <Typography variant="body" className="font-bold">
                                        ₹{order.total?.toLocaleString() || '0'}
                                    </Typography>
                                </View>

                                <View className="border-t border-gray-100 pt-3">
                                    <Typography variant="caption" color="muted">
                                        {Array.isArray(order.items) ? order.items.length : 0} items
                                    </Typography>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </Container>
    );
}
