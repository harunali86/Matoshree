import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, CheckCircle2, Truck, Package, Download, XCircle, ChevronRight, FileText } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

// Mock Tracking Steps
const TRACKING_STEPS = [
    { status: 'Ordered', label: 'Order Placed', icon: Clock },
    { status: 'Packed', label: 'Order Packed', icon: Package },
    { status: 'Shipped', label: 'Shipped', icon: Truck },
    { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, product:products(*))')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order:', error);
            Alert.alert('Error', 'Could not fetch order details');
        } else {
            setOrder(data);
        }
        setLoading(false);
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'Pending': return 0;
            case 'Processing': return 1;
            case 'Shipped': return 2;
            case 'Out for Delivery': return 3;
            case 'Delivered': return 4;
            default: return 0;
        }
    };

    const handleCancelOrder = async () => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await supabase
                            .from('orders')
                            .update({ status: 'Cancelled' })
                            .eq('id', id);

                        if (error) Alert.alert('Error', 'Could not cancel order');
                        else {
                            Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
                            fetchOrderDetails();
                        }
                    }
                }
            ]
        );
    };

    const generateInvoice = async () => {
        setDownloading(true);
        try {
            const htmlContent = `
                <html>
                <head>
                    <style>
                        body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
                        .invoice-title { font-size: 32px; font-weight: bold; color: #333; }
                        .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        .table th { text-align: left; padding: 10px; background: #f8f8f8; border-bottom: 1px solid #ddd; }
                        .table td { padding: 10px; border-bottom: 1px solid #eee; }
                        .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; }
                        .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">MATOSHREE</div>
                        <div class="invoice-title">INVOICE</div>
                    </div>
                    
                    <div class="details">
                        <div>
                            <strong>Billed To:</strong><br>
                            ${order.shipping_address?.full_name || 'Customer'}<br>
                            ${order.shipping_address?.street || ''}, ${order.shipping_address?.city || ''}<br>
                            ${order.shipping_address?.state || ''} - ${order.shipping_address?.postal_code || ''}<br>
                            Phone: ${order.shipping_address?.phone || ''}
                        </div>
                        <div style="text-align: right;">
                            <strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}<br>
                            <strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}<br>
                            <strong>Status:</strong> ${order.status}
                        </div>
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.order_items.map((item: any) => `
                                <tr>
                                    <td>${item.product.name} ${item.size ? `(Size: ${item.size})` : ''}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${item.price}</td>
                                    <td>₹${item.price * item.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total">
                        Total Amount: ₹${order.total_amount}
                    </div>

                    <div class="footer">
                        Thank you for shopping with Matoshree!<br>
                        For support, contact support@matoshree.com
                    </div>
                </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            Alert.alert('Error', 'Could not generate invoice');
            console.error(error);
        } finally {
            setDownloading(false);
        }
    };

    if (loading || !order) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="black" />
            </SafeAreaView>
        );
    }

    const currentStepIndex = getStatusStep(order.status);
    const isCancelled = order.status === 'Cancelled';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 15 }}>Order Details</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

                {/* Order ID & Status */}
                <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ color: '#666' }}>Order ID: #{order.id.slice(0, 8).toUpperCase()}</Text>
                        <View style={{
                            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
                            backgroundColor: isCancelled ? '#ffebee' : '#e8f5e9'
                        }}>
                            <Text style={{
                                fontWeight: 'bold', fontSize: 12,
                                color: isCancelled ? '#d32f2f' : '#2e7d32'
                            }}>
                                {order.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 13, color: '#999' }}>Placed on {new Date(order.created_at).toDateString()}</Text>
                </View>

                {/* Items */}
                <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16 }}>
                    {order.order_items.map((item: any) => (
                        <View key={item.id} style={{ flexDirection: 'row', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 16 }}>
                            <Image
                                source={{ uri: item.product.thumbnail || undefined }}
                                style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#f0f0f0' }}
                            />
                            <View style={{ marginLeft: 12, flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontWeight: '600', marginBottom: 4 }}>{item.product.name}</Text>
                                <Text style={{ fontSize: 13, color: '#666' }}>Size: {item.size} • Qty: {item.quantity}</Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 4 }}>₹{item.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Tracking (Only show if not cancelled) */}
                {!isCancelled && (
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>Order Status</Text>

                        {TRACKING_STEPS.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const StepIcon = step.icon;

                            return (
                                <View key={step.status} style={{ flexDirection: 'row', height: index === TRACKING_STEPS.length - 1 ? 24 : 60 }}>
                                    <View style={{ alignItems: 'center', width: 30 }}>
                                        <View style={{
                                            width: 24, height: 24, borderRadius: 12,
                                            backgroundColor: isCompleted ? 'black' : '#e0e0e0',
                                            justifyContent: 'center', alignItems: 'center', zIndex: 2
                                        }}>
                                            <StepIcon size={12} color="white" />
                                        </View>
                                        {index !== TRACKING_STEPS.length - 1 && (
                                            <View style={{
                                                width: 2, flex: 1,
                                                backgroundColor: index < currentStepIndex ? 'black' : '#e0e0e0',
                                                marginVertical: -2
                                            }} />
                                        )}
                                    </View>
                                    <View style={{ marginLeft: 15, flex: 1 }}>
                                        <Text style={{
                                            fontWeight: isCompleted ? 'bold' : '400',
                                            color: isCompleted ? 'black' : '#999'
                                        }}>
                                            {step.label}
                                        </Text>
                                        {isCurrent && <Text style={{ fontSize: 12, color: '#00af00', marginTop: 2 }}>In Progress</Text>}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Actions: Invoice & Help */}
                <View style={{ gap: 12, marginBottom: 30 }}>
                    {!isCancelled && (
                        <TouchableOpacity
                            onPress={generateInvoice}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#ddd' }}
                        >
                            {downloading ? <ActivityIndicator size="small" color="black" /> : <Download size={20} color="black" />}
                            <Text style={{ fontWeight: '600', marginLeft: 10 }}>Download Invoice</Text>
                        </TouchableOpacity>
                    )}

                    {!isCancelled && ['Pending', 'Processing', 'Packed'].includes(order.status) && (
                        <TouchableOpacity
                            onPress={handleCancelOrder}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f0', padding: 15, borderRadius: 12 }}
                        >
                            <XCircle size={20} color="#d32f2f" />
                            <Text style={{ fontWeight: '600', marginLeft: 10, color: '#d32f2f' }}>Cancel Order</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
