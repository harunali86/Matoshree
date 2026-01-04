import { View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../components/Themed';
import { ArrowLeft, Plus, CreditCard, Trash2, Check, Shield } from 'lucide-react-native';
import { useState } from 'react';

interface PaymentMethod {
    id: string;
    type: 'card' | 'upi' | 'wallet';
    name: string;
    last4?: string;
    isDefault: boolean;
}

const SAVED_METHODS: PaymentMethod[] = [
    { id: '1', type: 'card', name: 'Visa', last4: '4242', isDefault: true },
    { id: '2', type: 'card', name: 'Mastercard', last4: '8765', isDefault: false },
    { id: '3', type: 'upi', name: 'harun@upi', isDefault: false },
];

export default function PaymentMethodsScreen() {
    const router = useRouter();
    const [methods, setMethods] = useState(SAVED_METHODS);
    const [showAddCard, setShowAddCard] = useState(false);

    const handleDelete = (id: string) => {
        setMethods(methods.filter(m => m.id !== id));
    };

    const handleSetDefault = (id: string) => {
        setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })));
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black">Payment Methods</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Saved Methods */}
                <View className="bg-white mb-2">
                    <Text className="px-4 py-3 text-gray-500 font-bold text-xs">SAVED PAYMENT METHODS</Text>
                    {methods.map((method) => (
                        <View key={method.id} className="flex-row items-center px-4 py-4 border-t border-gray-100">
                            <View className="w-12 h-8 bg-gray-100 rounded items-center justify-center mr-3">
                                {method.type === 'card' ? (
                                    <CreditCard size={20} color="#666" />
                                ) : (
                                    <Text className="text-xs font-bold text-gray-600">UPI</Text>
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="text-black font-medium">
                                    {method.type === 'card' ? `${method.name} •••• ${method.last4}` : method.name}
                                </Text>
                                {method.isDefault && (
                                    <View className="flex-row items-center mt-1">
                                        <Check size={12} color="#16a34a" />
                                        <Text className="text-green-600 text-xs ml-1">Default</Text>
                                    </View>
                                )}
                            </View>
                            {!method.isDefault && (
                                <TouchableOpacity
                                    onPress={() => handleSetDefault(method.id)}
                                    className="mr-3"
                                >
                                    <Text className="text-[#2874F0] text-xs font-bold">Set Default</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => handleDelete(method.id)}>
                                <Trash2 size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Add New */}
                <View className="bg-white mb-2">
                    <TouchableOpacity
                        onPress={() => setShowAddCard(!showAddCard)}
                        className="flex-row items-center px-4 py-4"
                    >
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                            <Plus size={20} color="#2874F0" />
                        </View>
                        <Text className="text-[#2874F0] font-bold">Add New Card</Text>
                    </TouchableOpacity>

                    {showAddCard && (
                        <View className="px-4 pb-4">
                            <View className="bg-gray-50 rounded-lg p-4">
                                <TextInput
                                    placeholder="Card Number"
                                    placeholderTextColor="#999"
                                    className="bg-white rounded-lg px-4 py-3 text-black mb-3"
                                    keyboardType="numeric"
                                />
                                <View className="flex-row gap-3">
                                    <TextInput
                                        placeholder="MM/YY"
                                        placeholderTextColor="#999"
                                        className="flex-1 bg-white rounded-lg px-4 py-3 text-black"
                                    />
                                    <TextInput
                                        placeholder="CVV"
                                        placeholderTextColor="#999"
                                        className="flex-1 bg-white rounded-lg px-4 py-3 text-black"
                                        secureTextEntry
                                    />
                                </View>
                                <TextInput
                                    placeholder="Name on Card"
                                    placeholderTextColor="#999"
                                    className="bg-white rounded-lg px-4 py-3 text-black mt-3"
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        alert('Card added successfully! (Demo)');
                                        setShowAddCard(false);
                                    }}
                                    className="bg-[#2874F0] py-3 rounded-lg items-center mt-3"
                                >
                                    <Text className="text-white font-bold">Save Card</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                {/* Security Note */}
                <View className="bg-white p-4 flex-row items-center mb-4">
                    <Shield size={20} color="#16a34a" />
                    <Text className="text-gray-500 text-xs ml-2 flex-1">
                        Your payment info is encrypted and secure. We never store your CVV.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
