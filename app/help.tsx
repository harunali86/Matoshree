import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../components/Themed';
import { ArrowLeft, ChevronRight, HelpCircle, Package, CreditCard, Truck, RefreshCw, Shield, MessageCircle, Phone, Mail } from 'lucide-react-native';

const FAQ_SECTIONS = [
    {
        title: 'Orders & Shipping',
        icon: Package,
        items: [
            { q: 'How do I track my order?', a: 'Go to My Orders and click on Track Order for real-time updates.' },
            { q: 'What are the shipping charges?', a: 'Shipping is FREE on orders above $50. Otherwise, $5 flat rate.' },
            { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is 1-2 days.' },
        ]
    },
    {
        title: 'Payments',
        icon: CreditCard,
        items: [
            { q: 'What payment methods are accepted?', a: 'We accept Credit/Debit cards, UPI, Net Banking, and Cash on Delivery.' },
            { q: 'Is my payment information secure?', a: 'Yes, all transactions are encrypted with 256-bit SSL security.' },
            { q: 'Can I pay using EMI?', a: 'Yes, EMI options are available for orders above $200.' },
        ]
    },
    {
        title: 'Returns & Refunds',
        icon: RefreshCw,
        items: [
            { q: 'What is the return policy?', a: '30-day easy returns on most items. Some categories have 7-day return window.' },
            { q: 'How do I request a return?', a: 'Go to My Orders, select the order, and click Request Return.' },
            { q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days after pickup.' },
        ]
    },
];

export default function HelpScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black">Help Center</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Quick Actions */}
                <View className="bg-white p-4 mb-2">
                    <Text className="text-gray-500 font-bold text-xs mb-3">QUICK HELP</Text>
                    <View className="flex-row justify-between">
                        <TouchableOpacity
                            onPress={() => router.push('/support/chat')}
                            className="items-center flex-1"
                        >
                            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                                <MessageCircle size={24} color="#2874F0" />
                            </View>
                            <Text className="text-xs text-gray-700">Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="items-center flex-1">
                            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                                <Phone size={24} color="#16a34a" />
                            </View>
                            <Text className="text-xs text-gray-700">Call Us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="items-center flex-1">
                            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                                <Mail size={24} color="#ea580c" />
                            </View>
                            <Text className="text-xs text-gray-700">Email</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FAQ Sections */}
                {FAQ_SECTIONS.map((section, sIdx) => {
                    const Icon = section.icon;
                    return (
                        <View key={sIdx} className="bg-white mb-2">
                            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                                <Icon size={20} color="#2874F0" />
                                <Text className="text-black font-bold ml-2">{section.title}</Text>
                            </View>
                            {section.items.map((item, qIdx) => (
                                <TouchableOpacity
                                    key={qIdx}
                                    onPress={() => alert(item.a)}
                                    className="flex-row items-center px-4 py-3 border-b border-gray-50"
                                >
                                    <HelpCircle size={16} color="#999" />
                                    <Text className="flex-1 text-gray-700 ml-3 text-sm">{item.q}</Text>
                                    <ChevronRight size={16} color="#ccc" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    );
                })}

                {/* Trust Badge */}
                <View className="bg-white p-4 mb-4 flex-row items-center">
                    <Shield size={24} color="#16a34a" />
                    <View className="ml-3">
                        <Text className="text-black font-bold">100% Safe & Secure</Text>
                        <Text className="text-gray-500 text-xs">Your data is protected with us</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
