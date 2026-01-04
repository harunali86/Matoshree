import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../components/Themed';
import { ArrowLeft, Tag, Copy, Check, Percent } from 'lucide-react-native';
import { useState } from 'react';

const COUPONS = [
    {
        id: '1',
        code: 'NEWYEAR2024',
        title: 'New Year Special',
        discount: '15% OFF',
        description: 'Get 15% off on orders above $100',
        minOrder: 100,
        maxDiscount: 50,
        validTill: 'Jan 31, 2026',
        isActive: true,
    },
    {
        id: '2',
        code: 'FIRST50',
        title: 'First Order Discount',
        discount: '$50 OFF',
        description: 'Flat $50 off on your first order',
        minOrder: 200,
        maxDiscount: 50,
        validTill: 'Dec 31, 2026',
        isActive: true,
    },
    {
        id: '3',
        code: 'ELECTRONICS20',
        title: 'Electronics Sale',
        discount: '20% OFF',
        description: 'Extra 20% off on Electronics category',
        minOrder: 150,
        maxDiscount: 100,
        validTill: 'Jan 15, 2026',
        isActive: true,
    },
    {
        id: '4',
        code: 'FREESHIP',
        title: 'Free Shipping',
        discount: 'FREE DELIVERY',
        description: 'Free shipping on all orders',
        minOrder: 50,
        maxDiscount: 10,
        validTill: 'Feb 28, 2026',
        isActive: true,
    },
];

export default function CouponsScreen() {
    const router = useRouter();
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [inputCode, setInputCode] = useState('');

    const handleCopy = (code: string) => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleApply = () => {
        if (inputCode.trim()) {
            alert(`Coupon "${inputCode}" applied! (Demo)`);
            setInputCode('');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black">Coupons & Offers</Text>
            </View>

            {/* Apply Coupon Input */}
            <View className="bg-white p-4 mb-2 flex-row items-center">
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mr-3">
                    <Tag size={18} color="#666" />
                    <TextInput
                        value={inputCode}
                        onChangeText={setInputCode}
                        placeholder="Enter coupon code"
                        placeholderTextColor="#999"
                        className="flex-1 ml-2 text-black"
                        autoCapitalize="characters"
                    />
                </View>
                <TouchableOpacity
                    onPress={handleApply}
                    className="bg-[#2874F0] px-4 py-2.5 rounded-lg"
                >
                    <Text className="text-white font-bold">Apply</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                <Text className="text-gray-500 font-bold text-xs mb-3">AVAILABLE COUPONS</Text>

                {COUPONS.map((coupon) => (
                    <View key={coupon.id} className="bg-white rounded-lg mb-3 overflow-hidden shadow-sm">
                        <View className="flex-row">
                            {/* Left colored strip */}
                            <View className="w-2 bg-[#2874F0]" />

                            <View className="flex-1 p-4">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-row items-center">
                                        <Percent size={16} color="#16a34a" />
                                        <Text className="text-green-600 font-bold ml-1">{coupon.discount}</Text>
                                    </View>
                                    <View className="bg-gray-100 px-2 py-1 rounded border border-dashed border-gray-300">
                                        <Text className="text-black font-mono font-bold text-xs">{coupon.code}</Text>
                                    </View>
                                </View>

                                <Text className="text-black font-bold mb-1">{coupon.title}</Text>
                                <Text className="text-gray-500 text-sm mb-2">{coupon.description}</Text>

                                <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
                                    <Text className="text-gray-400 text-xs">Valid till {coupon.validTill}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleCopy(coupon.code)}
                                        className="flex-row items-center"
                                    >
                                        {copiedCode === coupon.code ? (
                                            <>
                                                <Check size={14} color="#16a34a" />
                                                <Text className="text-green-600 font-bold text-xs ml-1">Copied!</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} color="#2874F0" />
                                                <Text className="text-[#2874F0] font-bold text-xs ml-1">Copy Code</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
