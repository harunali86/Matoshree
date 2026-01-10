import React, { useState } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';
import { CouponInput } from '../components/checkout/CouponInput';

export default function CheckoutScreen() {
    const router = useRouter();
    const { total, items, clearCart, discount, couponCode } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    const [address, setAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        zip: '',
        phone: ''
    });

    const handlePayment = async () => {
        if (!address.fullName || !address.street || !address.zip) {
            Alert.alert('Missing Info', 'Please fill in address details.');
            return;
        }

        setIsLoading(true);

        try {
            // Use total from store which includes discount
            const finalAmount = total;

            // 2. Insert into 'orders' table
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: '00000000-0000-0000-0000-000000000000', // Guest (should be dynamic)
                    tenant_id: '44bec768-506e-4477-bbe0-1394d073382e', // Hardcoded for now
                    total_amount: finalAmount,
                    status: 'pending',
                    shipping_address: address,
                    metadata: {
                        type: 'guest_checkout',
                        coupon_code: couponCode,
                        discount_amount: discount
                    }
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 3. Insert 'order_items'
            const orderItems = items.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                image: item.image
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Success
            clearCart();
            Alert.alert('Order Placed!', `Your order ID is #${orderData.id.slice(0, 8).toUpperCase()}`, [
                { text: 'OK', onPress: () => router.replace('/') }
            ]);

        } catch (error: any) {
            console.error('Checkout Error:', error);
            Alert.alert('Error', error.message || 'Something went wrong processing your order.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container safeArea className="bg-white">
            {/* Header */}
            <View className="px-6 py-4 border-b border-gray-100 flex-row items-center">
                <Typography variant="h3">Checkout</Typography>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>

                {/* Coupon Input */}
                <CouponInput />

                {/* Order Summary */}
                <View className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <Typography variant="h3" className="mb-2">Order Summary</Typography>
                    <View className="flex-row justify-between mb-1">
                        <Typography variant="body" color="muted">Subtotal</Typography>
                        <Typography variant="body" className="font-medium">
                            ₹{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                        </Typography>
                    </View>
                    <View className="flex-row justify-between mb-1">
                        <Typography variant="body" color="muted">Shipping</Typography>
                        <Typography variant="body" className="font-medium">Free</Typography>
                    </View>

                    {discount > 0 && (
                        <View className="flex-row justify-between mb-1">
                            <Typography variant="body" className="text-green-600">Discount</Typography>
                            <Typography variant="body" className="font-medium text-green-600">
                                -₹{discount.toLocaleString()}
                            </Typography>
                        </View>
                    )}

                    <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
                        <Typography variant="h3">Total</Typography>
                        <Typography variant="h3">₹{total.toLocaleString()}</Typography>
                    </View>
                </View>

                {/* Shipping Address */}
                <Typography variant="h3" className="mb-4">Shipping Address</Typography>
                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    className="mb-4"
                    value={address.fullName}
                    onChangeText={(t) => setAddress({ ...address, fullName: t })}
                />
                <Input
                    label="Address"
                    placeholder="Street address"
                    className="mb-4"
                    value={address.street}
                    onChangeText={(t) => setAddress({ ...address, street: t })}
                />
                <View className="flex-row gap-4 mb-4">
                    <View className="flex-1">
                        <Input
                            label="City"
                            placeholder="City"
                            value={address.city}
                            onChangeText={(t) => setAddress({ ...address, city: t })}
                        />
                    </View>
                    <View className="flex-1">
                        <Input
                            label="ZIP Code"
                            placeholder="000000"
                            keyboardType="numeric"
                            value={address.zip}
                            onChangeText={(t) => setAddress({ ...address, zip: t })}
                        />
                    </View>
                </View>
                <Input
                    label="Phone Number"
                    placeholder="+91 99999 99999"
                    keyboardType="phone-pad"
                    className="mb-8"
                    value={address.phone}
                    onChangeText={(t) => setAddress({ ...address, phone: t })}
                />

                {/* Payment */}
                <Typography variant="h3" className="mb-4">Payment Method</Typography>
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 h-16 border-2 border-black rounded-lg items-center justify-center bg-gray-50">
                        <Typography variant="body" className="font-bold">Card</Typography>
                    </View>
                    <View className="flex-1 h-16 border border-gray-200 rounded-lg items-center justify-center">
                        <Typography variant="body" color="muted">UPI</Typography>
                    </View>
                    <View className="flex-1 h-16 border border-gray-200 rounded-lg items-center justify-center">
                        <Typography variant="body" color="muted">COD</Typography>
                    </View>
                </View>

            </ScrollView>

            {/* Footer */}
            <View className="p-6 border-t border-gray-100">
                <Button
                    title={isLoading ? "Processing..." : `Pay ₹${total.toLocaleString()}`}
                    onPress={handlePayment}
                    disabled={isLoading}
                    size="lg"
                />
            </View>
        </Container>
    );
}
