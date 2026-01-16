import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Dimensions, TextInput } from 'react-native';
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

    // Cancellation State
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [cancelComment, setCancelComment] = useState('');

    // Return State
    const [returnModalVisible, setReturnModalVisible] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [returning, setReturning] = useState(false);

    const submitReturnRequest = async () => {
        if (!returnReason) {
            Alert.alert('Error', 'Please select a reason for return');
            return;
        }
        setReturning(true);
        try {
            const { error } = await supabase.from('returns').insert({
                user_id: order.user_id,
                order_id: order.id,
                reason: returnReason,
                status: 'requested'
            });
            if (error) throw error;

            Alert.alert('Success', 'Return request submitted successfully.');
            setReturnModalVisible(false);
            fetchOrderDetails();
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setReturning(false);
        }
    };

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

    const toggleItemSelection = (itemId: string) => {
        setSelectedItemIds(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const submitCancellation = async () => {
        if (selectedItemIds.length === 0) {
            Alert.alert('Error', 'Please select at least one item to cancel');
            return;
        }
        if (!cancelReason.trim()) {
            Alert.alert('Error', 'Please provide a reason for cancellation');
            return;
        }

        setCancelling(true);
        try {
            const isFullCancellation = selectedItemIds.length === order.order_items.length;
            const description = `${cancelReason} - ${cancelComment}`;

            if (isFullCancellation) {
                // Full Cancellation Logic
                const { data, error } = await supabase.rpc('cancel_order', {
                    p_order_id: id,
                    p_reason: description
                });

                if (error) throw error;
                if (data && !data.success) throw new Error(data.error);
                Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
            } else {
                // Partial Cancellation (Simulated via Notes)
                const selectedNames = order.order_items.filter((i: any) => selectedItemIds.includes(i.id)).map((i: any) => i.product.name).join(', ');

                const { error } = await supabase.from('orders').update({
                    notes: `Partial Cancellation Request for: ${selectedNames}. Reason: ${description}`,
                }).eq('id', id);

                if (error) throw error;
                Alert.alert('Request Submitted', 'Your cancellation request for selected items has been received and is being processed.');
            }

            setCancelModalVisible(false);
            fetchOrderDetails();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Could not cancel order');
        } finally {
            setCancelling(false);
        }
    };

    const generateInvoice = async () => {
        setDownloading(true);
        try {
            const addr = order.shipping_address || {};

            const htmlContent = `
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <style>
                        body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
                        .invoice-title { font-size: 32px; font-weight: bold; color: #333; }
                        .details { margin-bottom: 30px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
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
                        <div class="row">
                           <div>
                                <strong>Billed To:</strong><br>
                                ${addr.name || 'Customer'}<br>
                                ${addr.address_line || ''}<br>
                                ${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}<br>
                                Phone: ${addr.phone || ''}
                           </div>
                           <div style="text-align: right;">
                                <strong>Invoice #:</strong> ${order.invoice_number || 'NA'}<br>
                                <strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}<br>
                                <strong>Status:</strong> ${order.status}
                           </div>
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
                    {order.invoice_number && <Text style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Invoice: {order.invoice_number}</Text>}
                </View>

                {/* Refund Status if Cancelled */}
                {isCancelled && (
                    <View style={{ backgroundColor: '#fff3e0', padding: 16, borderRadius: 12, marginBottom: 16 }}>
                        <Text style={{ fontWeight: 'bold', color: '#e65100', marginBottom: 4 }}>Refund Status: {order.refund_status || 'Initiated'}</Text>
                        <Text style={{ fontSize: 12, color: '#ef6c00' }}>Reason: {order.cancellation_reason}</Text>
                    </View>
                )}

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

                {/* Track Order via Shiprocket */}
                {!isCancelled && order.status === 'Shipped' && order.awb_number && (
                    <TouchableOpacity
                        onPress={() => {
                            const trackingUrl = `https://shiprocket.co/tracking/${order.awb_number}`;
                            // Open in browser
                            import('expo-linking').then(Linking => Linking.openURL(trackingUrl));
                        }}
                        style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#3b82f6', padding: 15, borderRadius: 12, marginBottom: 16
                        }}
                    >
                        <Truck size={20} color="white" />
                        <Text style={{ fontWeight: '600', marginLeft: 10, color: 'white' }}>Track Shipment (AWB: {order.awb_number})</Text>
                    </TouchableOpacity>
                )}

                {/* Actions: Invoice & Help */}
                <View style={{ gap: 12, marginBottom: 60 }}>
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
                            onPress={() => setCancelModalVisible(true)}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f0', padding: 15, borderRadius: 12 }}
                        >
                            <XCircle size={20} color="#d32f2f" />
                            <Text style={{ fontWeight: '600', marginLeft: 10, color: '#d32f2f' }}>Cancel Order</Text>
                        </TouchableOpacity>
                    )}

                    {order.status === 'Delivered' && !order.return_status && (
                        <TouchableOpacity
                            onPress={() => router.push(`/return-request?orderId=${order.id}`)}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', padding: 15, borderRadius: 12 }}
                        >
                            <Package size={20} color="white" />
                            <Text style={{ fontWeight: '600', marginLeft: 10, color: 'white' }}>Return / Exchange</Text>
                        </TouchableOpacity>
                    )}

                    {/* Write Review Button */}
                    {order.status === 'Delivered' && (
                        <TouchableOpacity
                            onPress={() => router.push(`/write-review?orderId=${order.id}&productId=${order.order_items[0]?.product_id}`)}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef3c7', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#fcd34d' }}
                        >
                            <Text style={{ fontSize: 18, marginRight: 8 }}>⭐</Text>
                            <Text style={{ fontWeight: '600', color: '#92400e' }}>Write a Review</Text>
                        </TouchableOpacity>
                    )}

                    {order.return_status && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#bae6fd' }}>
                            <Text style={{ fontWeight: '600', color: '#0284c7' }}>Return Status: {order.return_status.toUpperCase()}</Text>
                        </View>
                    )}
                </View>

            </ScrollView>

            {/* Cancel Modal */}
            {cancelModalVisible && (
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, width: '100%', maxHeight: '80%' }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Cancel Order</Text>

                            {/* Step 1: Select Items */}
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>1. Select Items to Cancel</Text>
                            <View style={{ marginBottom: 20 }}>
                                {order.order_items.map((item: any) => {
                                    const isSelected = selectedItemIds.includes(item.id);
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => toggleItemSelection(item.id)}
                                            style={{
                                                flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8,
                                                backgroundColor: isSelected ? '#f5f5f5' : 'white',
                                                borderWidth: 1, borderColor: isSelected ? 'black' : '#eee', borderRadius: 10
                                            }}
                                        >
                                            <View style={{
                                                width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                                                borderColor: isSelected ? 'black' : '#ccc',
                                                justifyContent: 'center', alignItems: 'center', marginRight: 12,
                                                backgroundColor: isSelected ? 'black' : 'transparent'
                                            }}>
                                                {isSelected && <CheckCircle2 size={14} color="white" />}
                                            </View>
                                            <Image source={{ uri: item.product.thumbnail || undefined }} style={{ width: 40, height: 40, borderRadius: 6, marginRight: 12 }} />
                                            <View style={{ flex: 1 }}>
                                                <Text numberOfLines={1} style={{ fontWeight: '600', fontSize: 14 }}>{item.product.name}</Text>
                                                <Text style={{ fontSize: 12, color: '#666' }}>Size: {item.size}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Step 2: Reason */}
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>2. Reason for Cancellation</Text>
                            <View style={{ marginBottom: 20 }}>
                                {['Found better price', 'Ordered by mistake', 'Delivery is too late', 'Other'].map(r => (
                                    <TouchableOpacity key={r} onPress={() => setCancelReason(r)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginBottom: 4 }}>
                                        <View style={{
                                            width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                                            borderColor: cancelReason === r ? 'black' : '#ccc',
                                            marginRight: 10, justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            {cancelReason === r && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'black' }} />}
                                        </View>
                                        <Text style={{ fontSize: 15, color: '#333' }}>{r}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Step 3: Comments */}
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>3. Additional Comments</Text>
                            <TextInput
                                style={{
                                    borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12,
                                    height: 100, textAlignVertical: 'top', backgroundColor: '#f9f9f9', fontSize: 15
                                }}
                                placeholder="Describe your issue here..."
                                multiline
                                value={cancelComment}
                                onChangeText={setCancelComment}
                            />

                            {/* Actions */}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, gap: 12 }}>
                                <TouchableOpacity onPress={() => setCancelModalVisible(false)} style={{ paddingVertical: 12, paddingHorizontal: 20 }}>
                                    <Text style={{ fontWeight: '600', color: '#666' }}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={submitCancellation}
                                    disabled={cancelling}
                                    style={{
                                        backgroundColor: '#d32f2f', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30,
                                        elevation: 2
                                    }}
                                >
                                    {cancelling ? <ActivityIndicator color="white" size="small" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm Cancellation</Text>}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* Return Modal */}
            {returnModalVisible && (
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, width: '100%', maxHeight: '80%' }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Return / Exchange</Text>
                            <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>If you are not satisfied with the product, you can request a return or exchange within 7 days.</Text>

                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Reason for Return</Text>
                            <View style={{ marginBottom: 20 }}>
                                {['Size issue', 'Damaged product', 'Wrong item received', 'Quality issue', 'Other'].map(r => (
                                    <TouchableOpacity key={r} onPress={() => setReturnReason(r)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                                        <View style={{
                                            width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                                            borderColor: returnReason === r ? 'black' : '#ccc',
                                            marginRight: 10, justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            {returnReason === r && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'black' }} />}
                                        </View>
                                        <Text style={{ fontSize: 15, color: '#333' }}>{r}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 12 }}>
                                <TouchableOpacity onPress={() => setReturnModalVisible(false)} style={{ paddingVertical: 12, paddingHorizontal: 20 }}>
                                    <Text style={{ fontWeight: '600', color: '#666' }}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={submitReturnRequest}
                                    disabled={returning}
                                    style={{
                                        backgroundColor: 'black', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30,
                                        elevation: 2
                                    }}
                                >
                                    {returning ? <ActivityIndicator color="white" size="small" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit Request</Text>}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );

}
