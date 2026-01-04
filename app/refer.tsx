import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../components/Themed';
import { ArrowLeft, Users, Copy, Share2, Gift, Check } from 'lucide-react-native';
import { useState } from 'react';

const REFERRALS = [
    { id: '1', name: 'Rahul S.', status: 'Joined', reward: 50 },
    { id: '2', name: 'Priya M.', status: 'Pending', reward: 0 },
];

export default function ReferScreen() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const referralCode = 'HARUN50';

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        alert('Share options would appear here (Demo)');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black">Refer & Earn</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Banner */}
                <View className="bg-[#2874F0] mx-4 mt-4 rounded-xl p-5">
                    <View className="flex-row items-center mb-3">
                        <Gift size={32} color="#FFD700" />
                        <View className="ml-3">
                            <Text className="text-white font-bold text-lg">Invite Friends</Text>
                            <Text className="text-blue-200">Get ₹50 for each referral</Text>
                        </View>
                    </View>
                    <Text className="text-blue-100 text-sm">
                        When your friend places their first order, you both get ₹50 in Harun Coins!
                    </Text>
                </View>

                {/* Referral Code */}
                <View className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm">
                    <Text className="text-gray-500 text-xs mb-2">YOUR REFERRAL CODE</Text>
                    <View className="flex-row items-center">
                        <View className="flex-1 bg-gray-100 border-2 border-dashed border-[#2874F0] rounded-lg px-4 py-3">
                            <Text className="text-[#2874F0] font-bold text-xl text-center tracking-widest">
                                {referralCode}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleCopy}
                            className="ml-3 bg-[#2874F0] p-3 rounded-lg"
                        >
                            {copied ? <Check size={20} color="white" /> : <Copy size={20} color="white" />}
                        </TouchableOpacity>
                    </View>
                    {copied && (
                        <Text className="text-green-600 text-xs text-center mt-2">Copied to clipboard!</Text>
                    )}
                </View>

                {/* Share Buttons */}
                <View className="flex-row mx-4 mt-4 gap-3">
                    <TouchableOpacity
                        onPress={handleShare}
                        className="flex-1 bg-[#25D366] py-3 rounded-lg flex-row items-center justify-center"
                    >
                        <Share2 size={18} color="white" />
                        <Text className="text-white font-bold ml-2">WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleShare}
                        className="flex-1 bg-gray-800 py-3 rounded-lg flex-row items-center justify-center"
                    >
                        <Share2 size={18} color="white" />
                        <Text className="text-white font-bold ml-2">More</Text>
                    </TouchableOpacity>
                </View>

                {/* How it Works */}
                <View className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm">
                    <Text className="text-black font-bold mb-3">How it works</Text>
                    <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                            <Text className="text-[#2874F0] font-bold">1</Text>
                        </View>
                        <Text className="text-gray-600 flex-1">Share your code with friends</Text>
                    </View>
                    <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                            <Text className="text-[#2874F0] font-bold">2</Text>
                        </View>
                        <Text className="text-gray-600 flex-1">Friend signs up & places an order</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                            <Text className="text-[#2874F0] font-bold">3</Text>
                        </View>
                        <Text className="text-gray-600 flex-1">You both get ₹50 Harun Coins!</Text>
                    </View>
                </View>

                {/* Your Referrals */}
                <View className="bg-white mx-4 mt-4 mb-4 rounded-lg shadow-sm">
                    <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                        <Text className="text-black font-bold">Your Referrals</Text>
                        <View className="flex-row items-center">
                            <Users size={16} color="#2874F0" />
                            <Text className="text-[#2874F0] font-bold ml-1">{REFERRALS.length}</Text>
                        </View>
                    </View>
                    {REFERRALS.map((ref) => (
                        <View key={ref.id} className="flex-row items-center px-4 py-3 border-b border-gray-50">
                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                                <Text className="text-gray-600 font-bold">{ref.name[0]}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-800">{ref.name}</Text>
                                <Text className={`text-xs ${ref.status === 'Joined' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {ref.status}
                                </Text>
                            </View>
                            {ref.reward > 0 && (
                                <Text className="text-green-600 font-bold">+₹{ref.reward}</Text>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
