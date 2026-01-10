import React, { useState } from 'react';
import { View, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { XCircle } from 'lucide-react-native';

const CANCELLATION_REASONS = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Delivery time too long',
    'Product no longer needed',
    'Other',
];

export default function CancelOrderScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams();
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCancelOrder = async () => {
        const reason = selectedReason === 'Other' ? otherReason : selectedReason;

        if (!reason) {
            Alert.alert('Error', 'Please select a cancellation reason');
            return;
        }

        Alert.alert(
            'Confirm Cancellation',
            'Are you sure you want to cancel this order? This action cannot be undone.',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        const { error } = await supabase
                            .from('orders')
                            .update({
                                status: 'cancelled',
                                cancellation_reason: reason,
                                cancelled_at: new Date().toISOString(),
                                refund_status: 'pending',
                            })
                            .eq('id', orderId);

                        setLoading(false);

                        if (error) {
                            Alert.alert('Error', error.message);
                        } else {
                            Alert.alert(
                                'Order Cancelled',
                                'Your order has been cancelled. Refund will be processed within 5-7 business days.',
                                [{ text: 'OK', onPress: () => router.back() }]
                            );
                        }
                    },
                },
            ]
        );
    };

    return (
        <Container safeArea className="bg-white">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="mt-8 mb-6">
                    <View className="items-center mb-4">
                        <View className="bg-red-50 rounded-full p-4">
                            <XCircle size={48} color="#DC2626" />
                        </View>
                    </View>
                    <Typography variant="h1" className="text-2xl mb-2 text-center">
                        Cancel Order
                    </Typography>
                    <Typography variant="body" color="muted" className="text-center">
                        Please select a reason for cancellation
                    </Typography>
                </View>

                {/* Reasons */}
                <View className="mb-6">
                    {CANCELLATION_REASONS.map((reason) => (
                        <TouchableOpacity
                            key={reason}
                            onPress={() => setSelectedReason(reason)}
                            className={`border rounded-lg p-4 mb-3 ${selectedReason === reason
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-300'
                                }`}
                        >
                            <Typography variant="body" className="font-medium">
                                {reason}
                            </Typography>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Other Reason Input */}
                {selectedReason === 'Other' && (
                    <View className="mb-6">
                        <Typography variant="body" className="font-bold mb-2">
                            Please specify
                        </Typography>
                        <TextInput
                            value={otherReason}
                            onChangeText={setOtherReason}
                            placeholder="Enter your reason..."
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="border border-gray-300 rounded-lg p-4 text-base"
                        />
                    </View>
                )}

                {/* Buttons */}
                <Button
                    title="Cancel Order"
                    onPress={handleCancelOrder}
                    isLoading={loading}
                    size="lg"
                    className="mb-4 bg-red-600"
                />

                <Button
                    title="Go Back"
                    variant="outline"
                    onPress={() => router.back()}
                    size="lg"
                />
            </ScrollView>
        </Container>
    );
}
