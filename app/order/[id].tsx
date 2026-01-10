import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, ActivityIndicator } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Package } from 'lucide-react-native';

interface OrderDetail {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    shipping_address: any;
    order_items: Array<{
        product_name: string;
        quantity: number;
        price: number;
        size: string;
        image: string;
    }>;
}

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setOrder(data);
        } catch (error: any) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return { bg: 'bg-green-100', text: 'text-green-700' };
            case 'shipped': return { bg: 'bg-blue-100', text: 'text-blue-700' };
            case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container safeArea className="bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#000" />
            </Container>
        );
    }

    if (!order) {
        return (
            <Container safeArea className="bg-white items-center justify-center">
                <Package size={64} color="#E5E7EB" />
                <Typography variant="h3" className="mt-4">Order not found</Typography>
            </Container>
        );
    }

    const statusColors = getStatusColor(order.status);

    return (
        <Container safeArea className="bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-6 border-b border-gray-100">
                    <Typography variant="h1" className="text-2xl font-black uppercase tracking-tighter mb-1">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="muted">
                        Placed on {formatDate(order.created_at)}
                    </Typography>
                </View>

                {/* Status Banner */}
                <View className={`mx-6 mt-6 p-4 rounded-lg ${statusColors.bg}`}>
                    <Typography variant="body" className={`font-bold uppercase ${statusColors.text}`}>
                        {order.status}
                    </Typography>
                    <Typography variant="caption" className={statusColors.text}>
                        {order.status === 'pending' && 'Your order is being processed'}
                        {order.status === 'shipped' && 'Your order is on the way'}
                        {order.status === 'delivered' && 'Your order has been delivered'}
                    </Typography>
                </View>

                {/* Order Items */}
                <View className="px-6 py-6">
                    <Typography variant="h3" className="mb-4 text-lg font-bold">Order Items</Typography>
                    {order.order_items?.map((item, index) => (
                        <View key={index} className="flex-row mb-4 pb-4 border-b border-gray-100">
                            <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-4">
                                <Image
                                    source={{ uri: item.image }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="flex-1">
                                <Typography variant="body" className="font-bold mb-1">{item.product_name}</Typography>
                                <Typography variant="caption" color="muted" className="mb-2">
                                    Size: {item.size} • Qty: {item.quantity}
                                </Typography>
                                <Typography variant="body" className="font-bold">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </Typography>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shipping Address */}
                {order.shipping_address && (
                    <View className="px-6 py-6 border-t border-gray-100">
                        <Typography variant="h3" className="mb-4 text-lg font-bold">Delivery Address</Typography>
                        <View className="bg-gray-50 p-4 rounded-lg">
                            <Typography variant="body" className="font-bold mb-2">
                                {order.shipping_address.fullName || 'Customer'}
                            </Typography>
                            <Typography variant="body" color="muted" className="mb-1">
                                {order.shipping_address.address}
                            </Typography>
                            <Typography variant="body" color="muted" className="mb-1">
                                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                            </Typography>
                            {order.shipping_address.phone && (
                                <Typography variant="body" color="muted">
                                    Phone: {order.shipping_address.phone}
                                </Typography>
                            )}
                        </View>
                    </View>
                )}

                {/* Order Summary */}
                <View className="px-6 py-6 border-t border-gray-100">
                    <Typography variant="h3" className="mb-4 text-lg font-bold">Order Summary</Typography>
                    <View className="space-y-2">
                        <View className="flex-row justify-between py-2">
                            <Typography variant="body" color="muted">Subtotal</Typography>
                            <Typography variant="body">₹{order.total_amount.toLocaleString()}</Typography>
                        </View>
                        <View className="flex-row justify-between py-2">
                            <Typography variant="body" color="muted">Delivery</Typography>
                            <Typography variant="body" className="text-green-600">FREE</Typography>
                        </View>
                        <View className="flex-row justify-between py-3 border-t border-gray-200">
                            <Typography variant="body" className="font-bold text-lg">Total</Typography>
                            <Typography variant="body" className="font-bold text-lg">
                                ₹{order.total_amount.toLocaleString()}
                            </Typography>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
}
