import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, CreditCard, Plus, Trash2, Check, Smartphone } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface PaymentMethod {
    id: string;
    type: 'card' | 'upi';
    last_four?: string;
    card_brand?: string;
    upi_id?: string;
    is_default: boolean;
}

export default function PaymentMethods() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        if (!user?.id) return;
        try {
            const { data } = await supabase
                .from('saved_payment_methods')
                .select('*')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false });

            if (data) setMethods(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Remove Payment Method',
            'Are you sure you want to remove this payment method?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(id);
                        try {
                            await supabase
                                .from('saved_payment_methods')
                                .delete()
                                .eq('id', id);
                            setMethods(methods.filter(m => m.id !== id));
                        } catch (e) {
                            Alert.alert('Error', 'Failed to remove payment method');
                        } finally {
                            setDeleting(null);
                        }
                    }
                }
            ]
        );
    };

    const handleSetDefault = async (id: string) => {
        try {
            // Unset all defaults first
            await supabase
                .from('saved_payment_methods')
                .update({ is_default: false })
                .eq('user_id', user?.id);

            // Set new default
            await supabase
                .from('saved_payment_methods')
                .update({ is_default: true })
                .eq('id', id);

            setMethods(methods.map(m => ({
                ...m,
                is_default: m.id === id
            })));
        } catch (e) {
            Alert.alert('Error', 'Failed to update default');
        }
    };

    const getCardIcon = (brand?: string) => {
        // In a real app, you'd use card brand logos
        return '💳';
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="black" />
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Payment Methods</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

                {methods.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                            <CreditCard size={32} color="#ccc" />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>No Saved Methods</Text>
                        <Text style={{ color: '#999', marginTop: 8, textAlign: 'center' }}>
                            Add a card or UPI ID for faster checkout
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Cards Section */}
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 12, letterSpacing: 0.5 }}>SAVED CARDS</Text>
                        {methods.filter(m => m.type === 'card').map(method => (
                            <View
                                key={method.id}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 16,
                                    backgroundColor: method.is_default ? '#f0f9ff' : 'white',
                                    borderWidth: 1,
                                    borderColor: method.is_default ? '#3b82f6' : '#eee',
                                    borderRadius: 12,
                                    marginBottom: 12
                                }}
                            >
                                <Text style={{ fontSize: 28, marginRight: 14 }}>{getCardIcon(method.card_brand)}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 15 }}>
                                        {method.card_brand || 'Card'} •••• {method.last_four}
                                    </Text>
                                    {method.is_default && (
                                        <Text style={{ fontSize: 11, color: '#3b82f6', marginTop: 2 }}>Default</Text>
                                    )}
                                </View>
                                {!method.is_default && (
                                    <TouchableOpacity
                                        onPress={() => handleSetDefault(method.id)}
                                        style={{ padding: 8 }}
                                    >
                                        <Check size={20} color="#999" />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => handleDelete(method.id)}
                                    disabled={deleting === method.id}
                                    style={{ padding: 8 }}
                                >
                                    {deleting === method.id ? (
                                        <ActivityIndicator size="small" color="#999" />
                                    ) : (
                                        <Trash2 size={18} color="#d32f2f" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* UPI Section */}
                        {methods.filter(m => m.type === 'upi').length > 0 && (
                            <>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginTop: 20, marginBottom: 12, letterSpacing: 0.5 }}>SAVED UPI IDs</Text>
                                {methods.filter(m => m.type === 'upi').map(method => (
                                    <View
                                        key={method.id}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 16,
                                            backgroundColor: method.is_default ? '#f0f9ff' : 'white',
                                            borderWidth: 1,
                                            borderColor: method.is_default ? '#3b82f6' : '#eee',
                                            borderRadius: 12,
                                            marginBottom: 12
                                        }}
                                    >
                                        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                                            <Smartphone size={22} color="#2e7d32" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontWeight: '600', fontSize: 15 }}>{method.upi_id}</Text>
                                            {method.is_default && (
                                                <Text style={{ fontSize: 11, color: '#3b82f6', marginTop: 2 }}>Default</Text>
                                            )}
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(method.id)}
                                            disabled={deleting === method.id}
                                            style={{ padding: 8 }}
                                        >
                                            {deleting === method.id ? (
                                                <ActivityIndicator size="small" color="#999" />
                                            ) : (
                                                <Trash2 size={18} color="#d32f2f" />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </>
                        )}
                    </>
                )}

                {/* Add New Button */}
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        padding: 16,
                        borderRadius: 12,
                        marginTop: 20
                    }}
                    onPress={() => Alert.alert('Coming Soon', 'Card/UPI saving will be integrated with Razorpay')}
                >
                    <Plus size={20} color="#333" />
                    <Text style={{ fontWeight: '600', marginLeft: 8 }}>Add Payment Method</Text>
                </TouchableOpacity>

                <Text style={{ color: '#999', fontSize: 12, textAlign: 'center', marginTop: 20, lineHeight: 18 }}>
                    Your payment info is securely stored and encrypted by Razorpay
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}
