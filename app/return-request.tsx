import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Check, Camera, Package, AlertCircle } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const RETURN_REASONS = [
    { id: 'size', label: 'Size Issue', icon: '📏' },
    { id: 'defective', label: 'Defective/Damaged', icon: '🔧' },
    { id: 'wrong', label: 'Wrong Item Received', icon: '❌' },
    { id: 'quality', label: 'Quality Not as Expected', icon: '⭐' },
    { id: 'other', label: 'Other', icon: '📝' },
];

interface OrderItem {
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    size?: number;
    thumbnail?: string;
}

export default function ReturnRequest() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams();
    const { user } = useAuthStore();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [actionType, setActionType] = useState<'return' | 'exchange'>('return');

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('id', orderId)
                .single();

            if (data) {
                setOrder(data);
                // Pre-select all items
                if (data.order_items) {
                    setSelectedItems(data.order_items.map((item: any) => item.product_id));
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleItemSelection = (productId: string) => {
        setSelectedItems(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) {
            Alert.alert('Error', 'Please select at least one item to return');
            return;
        }
        if (!selectedReason) {
            Alert.alert('Error', 'Please select a reason for return');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.from('returns').insert({
                user_id: user?.id,
                order_id: orderId,
                items: selectedItems,
                reason: selectedReason,
                description: description || null,
                action_type: actionType,
                status: 'Pending'
            });

            if (error) throw error;

            Alert.alert(
                'Request Submitted! ✅',
                `Your ${actionType} request has been submitted. We'll review it within 24-48 hours.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="black" />
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 20 }}>
                <AlertCircle size={48} color="#999" />
                <Text style={{ marginTop: 16, color: '#666' }}>Order not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#007AFF' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Return/Exchange</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

                {/* Action Type Toggle */}
                <View style={{ flexDirection: 'row', marginBottom: 24, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 4 }}>
                    <TouchableOpacity
                        onPress={() => setActionType('return')}
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: 10,
                            backgroundColor: actionType === 'return' ? 'white' : 'transparent',
                            alignItems: 'center',
                            shadowColor: actionType === 'return' ? '#000' : 'transparent',
                            shadowOpacity: 0.1,
                            elevation: actionType === 'return' ? 2 : 0
                        }}
                    >
                        <Text style={{ fontWeight: actionType === 'return' ? '700' : '500', color: actionType === 'return' ? '#111' : '#666' }}>
                            Return & Refund
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActionType('exchange')}
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: 10,
                            backgroundColor: actionType === 'exchange' ? 'white' : 'transparent',
                            alignItems: 'center',
                            shadowColor: actionType === 'exchange' ? '#000' : 'transparent',
                            shadowOpacity: 0.1,
                            elevation: actionType === 'exchange' ? 2 : 0
                        }}
                    >
                        <Text style={{ fontWeight: actionType === 'exchange' ? '700' : '500', color: actionType === 'exchange' ? '#111' : '#666' }}>
                            Exchange
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Select Items */}
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Select Items</Text>
                <View style={{ marginBottom: 24 }}>
                    {order.order_items?.map((item: any) => (
                        <TouchableOpacity
                            key={item.product_id}
                            onPress={() => toggleItemSelection(item.product_id)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 12,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: selectedItems.includes(item.product_id) ? '#111' : '#eee',
                                borderRadius: 12,
                                backgroundColor: selectedItems.includes(item.product_id) ? '#f8f8f8' : 'white'
                            }}
                        >
                            <View style={{
                                width: 24, height: 24, borderRadius: 6,
                                borderWidth: 2,
                                borderColor: selectedItems.includes(item.product_id) ? '#111' : '#ccc',
                                backgroundColor: selectedItems.includes(item.product_id) ? '#111' : 'white',
                                justifyContent: 'center', alignItems: 'center', marginRight: 12
                            }}>
                                {selectedItems.includes(item.product_id) && <Check size={14} color="white" />}
                            </View>

                            <View style={{ width: 50, height: 50, backgroundColor: '#f0f0f0', borderRadius: 8, marginRight: 12, justifyContent: 'center', alignItems: 'center' }}>
                                {item.thumbnail ? (
                                    <Image source={{ uri: item.thumbnail }} style={{ width: 50, height: 50, borderRadius: 8 }} />
                                ) : (
                                    <Package size={24} color="#999" />
                                )}
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: '600', fontSize: 14 }} numberOfLines={1}>{item.name || 'Product'}</Text>
                                <Text style={{ color: '#666', fontSize: 12 }}>Qty: {item.quantity} • Size: {item.size || 'N/A'}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Reason Selection */}
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Reason for {actionType === 'return' ? 'Return' : 'Exchange'}</Text>
                <View style={{ marginBottom: 24 }}>
                    {RETURN_REASONS.map(reason => (
                        <TouchableOpacity
                            key={reason.id}
                            onPress={() => setSelectedReason(reason.id)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 14,
                                marginBottom: 8,
                                borderWidth: 1,
                                borderColor: selectedReason === reason.id ? '#111' : '#eee',
                                borderRadius: 10,
                                backgroundColor: selectedReason === reason.id ? '#f8f8f8' : 'white'
                            }}
                        >
                            <Text style={{ fontSize: 18, marginRight: 12 }}>{reason.icon}</Text>
                            <Text style={{ flex: 1, fontWeight: selectedReason === reason.id ? '600' : '400' }}>{reason.label}</Text>
                            {selectedReason === reason.id && (
                                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
                                    <Check size={12} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Description */}
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Additional Details (Optional)</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe the issue in detail..."
                    multiline
                    numberOfLines={4}
                    style={{
                        backgroundColor: '#f5f5f5',
                        padding: 16,
                        borderRadius: 12,
                        fontSize: 15,
                        minHeight: 100,
                        textAlignVertical: 'top',
                        marginBottom: 30
                    }}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={{
                        backgroundColor: '#111',
                        height: 56,
                        borderRadius: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: submitting ? 0.7 : 1,
                        marginBottom: 40
                    }}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                            Submit {actionType === 'return' ? 'Return' : 'Exchange'} Request
                        </Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
