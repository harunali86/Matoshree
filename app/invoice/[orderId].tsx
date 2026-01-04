import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '../../components/Themed';
import { ArrowLeft, Download, Share2, Printer } from 'lucide-react-native';

export default function InvoiceScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const handleDownload = () => {
        // Simulate download
        alert('Invoice downloaded successfully! (Demo)');
    };

    const handleShare = () => {
        // Simulate share
        alert('Share options would appear here (Demo)');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between bg-white px-4 py-3 shadow-sm">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-black">Invoice</Text>
                </View>
                <View className="flex-row gap-4">
                    <TouchableOpacity onPress={handleDownload}>
                        <Download size={22} color="#2874F0" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare}>
                        <Share2 size={22} color="#2874F0" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {/* Invoice Card */}
                <View className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <View className="bg-[#2874F0] p-4">
                        <Text className="text-white font-extrabold text-2xl italic">Harun.</Text>
                        <Text className="text-blue-100 text-xs mt-1">Tax Invoice / Bill of Supply</Text>
                    </View>

                    {/* Invoice Details */}
                    <View className="p-4 border-b border-gray-100">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500 text-sm">Invoice No:</Text>
                            <Text className="text-black font-bold">INV-2024-{orderId || '001'}</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500 text-sm">Order ID:</Text>
                            <Text className="text-black font-medium">ORD-2024-{orderId || '001'}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-500 text-sm">Date:</Text>
                            <Text className="text-black font-medium">Jan 3, 2026</Text>
                        </View>
                    </View>

                    {/* Billing Address */}
                    <View className="p-4 border-b border-gray-100">
                        <Text className="text-gray-500 text-xs mb-1">BILL TO</Text>
                        <Text className="text-black font-bold">Harun Ahmed</Text>
                        <Text className="text-gray-600 text-sm">123 Main Street, Apartment 4B</Text>
                        <Text className="text-gray-600 text-sm">Mumbai, Maharashtra - 400001</Text>
                        <Text className="text-gray-600 text-sm">Phone: +91 98765 43210</Text>
                    </View>

                    {/* Items */}
                    <View className="p-4 border-b border-gray-100">
                        <Text className="text-gray-500 text-xs mb-3">ITEMS</Text>

                        <View className="flex-row justify-between py-2 border-b border-gray-50">
                            <View className="flex-1">
                                <Text className="text-black font-medium">Sony WH-1000XM5</Text>
                                <Text className="text-gray-500 text-xs">Qty: 1</Text>
                            </View>
                            <Text className="text-black font-bold">$349.00</Text>
                        </View>
                    </View>

                    {/* Summary */}
                    <View className="p-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500">Subtotal</Text>
                            <Text className="text-black">$349.00</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500">Shipping</Text>
                            <Text className="text-green-600">FREE</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500">Tax (18% GST)</Text>
                            <Text className="text-black">$62.82</Text>
                        </View>
                        <View className="flex-row justify-between pt-2 border-t border-gray-200">
                            <Text className="text-black font-bold text-lg">Total</Text>
                            <Text className="text-[#2874F0] font-bold text-lg">$411.82</Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="bg-gray-50 p-4">
                        <Text className="text-gray-500 text-xs text-center">
                            Thank you for shopping with Harun Store!
                        </Text>
                        <Text className="text-gray-400 text-xs text-center mt-1">
                            This is a computer-generated invoice and does not require a signature.
                        </Text>
                    </View>
                </View>

                {/* Download Button */}
                <TouchableOpacity
                    onPress={handleDownload}
                    className="bg-[#2874F0] py-4 rounded-lg items-center mt-4 flex-row justify-center"
                >
                    <Download size={20} color="white" />
                    <Text className="text-white font-bold ml-2">Download PDF</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
