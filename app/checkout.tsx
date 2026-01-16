import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { MapPin, CreditCard, Banknote, ChevronRight, Check, Tag } from 'lucide-react-native';

interface Address {
    id: string;
    name: string;
    phone: string;
    address_line: string;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
}

const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
    { id: 'upi', name: 'UPI', icon: CreditCard, description: 'GPay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard' },
];

export default function Checkout() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const total = getTotalPrice();
    const deliveryFee = total > 999 ? 0 : 99;
    const grandTotal = total + deliveryFee - couponDiscount;

    const applyCoupon = async () => {
        const code = couponCode.toUpperCase().trim();
        if (!code) {
            Alert.alert('Error', 'Please enter a coupon code');
            return;
        }

        setApplyingCoupon(true);
        try {
            // Fetch coupon from Supabase database
            const { data: coupon, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', code)
                .eq('is_active', true)
                .single();

            if (error || !coupon) {
                Alert.alert('Invalid Coupon', 'This coupon code is not valid or has expired');
                return;
            }

            // Check minimum order
            if (total < (coupon.min_order || 0)) {
                Alert.alert('Minimum Order', `This coupon requires minimum order of ₹${coupon.min_order}`);
                return;
            }

            // Check expiry
            if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
                Alert.alert('Expired', 'This coupon has expired');
                return;
            }

            // Calculate discount
            const discount = coupon.discount_type === 'percent'
                ? Math.min(Math.round(total * coupon.discount_value / 100), coupon.max_discount || 99999)
                : coupon.discount_value;

            setCouponDiscount(discount);
            setAppliedCoupon(code);
            Alert.alert('Coupon Applied!', `You saved ₹${discount}`);
        } catch (e: any) {
            Alert.alert('Error', 'Failed to apply coupon');
        } finally {
            setApplyingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setCouponCode('');
        setAppliedCoupon(null);
        setCouponDiscount(0);
    };

    useFocusEffect(
        useCallback(() => {
            fetchAddresses();
        }, [user?.id])
    );

    const fetchAddresses = async () => {
        try {
            const { data } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user?.id)
                .order('is_default', { ascending: false });

            if (data && data.length > 0) {
                setAddresses(data);
                setSelectedAddress(data.find(a => a.is_default) || data[0]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const placeOrder = async () => {
        if (!selectedAddress) {
            Alert.alert('Error', 'Please select a delivery address');
            return;
        }

        setLoading(true);
        try {
            // Prepare items for RPC
            const orderItems = items.map(i => ({
                product_id: i.id,
                quantity: i.quantity,
                price: i.price,
                size: i.size
            }));

            // Call Transactional Place Order Function
            // This handles Stock Deduction and Invoice Generation
            const { data, error } = await supabase.rpc('place_order', {
                p_user_id: user?.id || null, // Null for Guest
                p_address_id: selectedAddress.id,
                p_total_amount: grandTotal,
                p_items: orderItems,
                p_payment_method: selectedPayment
            });

            if (error) throw error;
            if (data && !data.success) throw new Error(data.error || 'Order failed');

            // Clear cart
            clearCart();

            // Navigate to success
            router.replace(`/order-success?orderId=${data.order_id}`);
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#999' }}>Your cart is empty</Text>
                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)')}
                    style={{ marginTop: 20, backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>SHOP NOW</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <View style={{ backgroundColor: 'white', padding: 20, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text style={{ fontSize: 24, fontWeight: '900' }}>CHECKOUT</Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
                {/* Delivery Address */}
                <View style={{ backgroundColor: 'white', margin: 15, borderRadius: 12, padding: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <MapPin size={20} color="#333" />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Delivery Address</Text>
                    </View>

                    {loadingAddresses ? (
                        <ActivityIndicator />
                    ) : addresses.length === 0 ? (
                        <TouchableOpacity
                            onPress={() => router.push('/addresses')}
                            style={{ padding: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, borderStyle: 'dashed', alignItems: 'center' }}
                        >
                            <Text style={{ color: '#666' }}>+ Add New Address</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            {addresses.map(addr => (
                                <View
                                    key={addr.id}
                                    style={{
                                        marginBottom: 10,
                                        borderRadius: 10,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => setSelectedAddress(addr)}
                                        style={{
                                            padding: 15,
                                            borderWidth: selectedAddress?.id === addr.id ? 2 : 1,
                                            borderColor: selectedAddress?.id === addr.id ? 'black' : '#eee',
                                            borderRadius: 10,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{addr.name}</Text>
                                                <TouchableOpacity
                                                    onPress={() => router.push(`/add-address?id=${addr.id}` as any)}
                                                    style={{ padding: 5, marginRight: 5 }}
                                                >
                                                    <Text style={{ color: '#666', fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' }}>EDIT</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={{ color: '#666', marginTop: 0 }}>{addr.address_line}</Text>
                                            <Text style={{ color: '#666' }}>{addr.city}, {addr.state} - {addr.pincode}</Text>
                                            <Text style={{ color: '#666', marginTop: 3 }}>📞 {addr.phone}</Text>
                                        </View>
                                        {selectedAddress?.id === addr.id && (
                                            <View style={{ width: 24, height: 24, backgroundColor: 'black', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                                <Check size={14} color="white" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </>
                    )}
                </View>

                {/* Payment Method */}
                <View style={{ backgroundColor: 'white', margin: 15, marginTop: 0, borderRadius: 12, padding: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <CreditCard size={20} color="#333" />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Payment Method</Text>
                    </View>

                    {paymentMethods.map(method => (
                        <TouchableOpacity
                            key={method.id}
                            onPress={() => setSelectedPayment(method.id)}
                            style={{
                                padding: 15,
                                borderWidth: selectedPayment === method.id ? 2 : 1,
                                borderColor: selectedPayment === method.id ? 'black' : '#eee',
                                borderRadius: 10,
                                marginBottom: 10,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <method.icon size={24} color="#333" />
                            <View style={{ flex: 1, marginLeft: 15 }}>
                                <Text style={{ fontWeight: '600' }}>{method.name}</Text>
                                <Text style={{ color: '#999', fontSize: 12 }}>{method.description}</Text>
                            </View>
                            {selectedPayment === method.id && (
                                <View style={{ width: 24, height: 24, backgroundColor: 'black', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                                    <Check size={14} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Coupon Code */}
                <View style={{ backgroundColor: 'white', margin: 15, marginTop: 0, borderRadius: 12, padding: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Tag size={20} color="#333" />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Coupon Code</Text>
                    </View>

                    {appliedCoupon ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Check size={18} color="#2e7d32" />
                                <Text style={{ marginLeft: 8, fontWeight: 'bold', color: '#2e7d32' }}>{appliedCoupon}</Text>
                                <Text style={{ marginLeft: 8, color: '#2e7d32' }}>-₹{couponDiscount}</Text>
                            </View>
                            <TouchableOpacity onPress={removeCoupon}>
                                <Text style={{ color: '#d32f2f', fontWeight: '600' }}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                value={couponCode}
                                onChangeText={setCouponCode}
                                placeholder="Enter coupon code"
                                autoCapitalize="characters"
                                style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 14, borderRadius: 8, fontSize: 15 }}
                            />
                            <TouchableOpacity
                                onPress={applyCoupon}
                                style={{ backgroundColor: 'black', paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Text style={{ color: '#999', fontSize: 12, marginTop: 10 }}>Try: FIRST10, FLAT100, SAVE20</Text>
                </View>

                {/* Order Summary */}
                <View style={{ backgroundColor: 'white', margin: 15, marginTop: 0, borderRadius: 12, padding: 15 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Order Summary</Text>

                    {items.map((item, i) => {
                        // Calculate effective price for display consistency
                        let displayPrice = item.price;
                        if (item.price_wholesale) displayPrice = item.price_wholesale;
                        else if (item.price_tiers && item.price_tiers.length > 0) {
                            const tier = item.price_tiers.find((t: any) => item.quantity >= t.min_quantity && (!t.max_quantity || item.quantity <= t.max_quantity));
                            if (tier) displayPrice = tier.unit_price;
                        } else if (item.sale_price) displayPrice = item.sale_price;

                        return (
                            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f9f9f9', paddingBottom: 8 }}>
                                <View style={{ flex: 1, paddingRight: 10 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 14, color: '#333' }} numberOfLines={1}>{item.name}</Text>
                                    <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Size: {item.size}  •  Qty: {item.quantity}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>₹{(displayPrice * item.quantity).toLocaleString()}</Text>
                                    <Text style={{ fontSize: 11, color: '#999' }}>₹{displayPrice.toLocaleString()}/ea</Text>
                                </View>
                            </View>
                        );
                    })}

                    <View style={{ borderTopWidth: 1, borderColor: '#eee', paddingTop: 10, marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ color: '#666' }}>Subtotal</Text>
                            <Text>₹{total}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ color: '#666' }}>Delivery</Text>
                            <Text style={{ color: deliveryFee === 0 ? 'green' : 'black' }}>
                                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: '#eee' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>₹{grandTotal}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Place Order Button */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderColor: '#eee' }}>
                <TouchableOpacity
                    onPress={placeOrder}
                    disabled={loading}
                    style={{
                        backgroundColor: 'black',
                        height: 56,
                        borderRadius: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>PLACE ORDER • ₹{grandTotal}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
