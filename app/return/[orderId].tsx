import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '../../components/Themed';
import { ArrowLeft, Package, AlertCircle, Check } from 'lucide-react-native';
import { useState } from 'react';

const RETURN_REASONS = [
    'Product damaged during delivery',
    'Wrong item received',
    'Product not as described',
    'Quality not as expected',
    'Changed my mind',
    'Found better price elsewhere',
    'Other',
];

export default function ReturnRequestScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [comments, setComments] = useState('');

    const handleSubmit = () => {
        if (!selectedReason) {
            alert('Please select a reason for return');
            return;
        }
        alert('Return request submitted successfully! Our team will contact you within 24 hours. (Demo)');
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <View>
                    <Text className="text-lg font-bold text-black">Request Return</Text>
                    <Text className="text-gray-500 text-xs">Order #{orderId || 'ORD-2024-001'}</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Product */}
                <View className="bg-white p-4 mb-2 flex-row items-center">
                    <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center mr-3">
                        <Package size={24} color="#666" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-black font-bold">Sony WH-1000XM5</Text>
                        <Text className="text-gray-500 text-sm">$349.00 • Qty: 1</Text>
                    </View>
                </View>

                {/* Reason Selection */}
                <View className="bg-white p-4 mb-2">
                    <Text className="text-black font-bold mb-3">Why are you returning this item?</Text>
                    {RETURN_REASONS.map((reason, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedReason(reason)}
                            className={`flex-row items-center py-3 border-b border-gray-100 ${index === RETURN_REASONS.length - 1 ? 'border-b-0' : ''
                                }`}
                        >
                            <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${selectedReason === reason ? 'border-[#2874F0] bg-[#2874F0]' : 'border-gray-300'
                                }`}>
                                {selectedReason === reason && <Check size={12} color="white" />}
                            </View>
                            <Text className="text-gray-700 flex-1">{reason}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Additional Comments */}
                <View className="bg-white p-4 mb-2">
                    <Text className="text-black font-bold mb-2">Additional Comments (Optional)</Text>
                    <TextInput
                        value={comments}
                        onChangeText={setComments}
                        placeholder="Tell us more about the issue..."
                        placeholderTextColor="#999"
                        className="bg-gray-50 rounded-lg px-4 py-3 text-black h-24"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Policy Note */}
                <View className="bg-yellow-50 p-4 mb-4 flex-row">
                    <AlertCircle size={20} color="#ca8a04" />
                    <View className="ml-3 flex-1">
                        <Text className="text-yellow-800 font-bold text-sm">Return Policy</Text>
                        <Text className="text-yellow-700 text-xs mt-1">
                            Items must be returned in original packaging within 30 days of delivery.
                            Refund will be processed within 5-7 business days after pickup.
                        </Text>
                    </View>
                </View>

                {/* Submit */}
                <View className="p-4">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-[#FB641B] py-4 rounded-lg items-center"
                    >
                        <Text className="text-white font-bold text-lg">Submit Return Request</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
