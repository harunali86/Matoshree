import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../components/Themed';
import { ArrowLeft, Wallet, Gift, Star, Trophy, ChevronRight, Coins } from 'lucide-react-native';

const REWARDS = [
    { id: '1', title: 'Welcome Bonus', points: 100, type: 'earned', date: 'Dec 15, 2025' },
    { id: '2', title: 'First Purchase Reward', points: 50, type: 'earned', date: 'Dec 20, 2025' },
    { id: '3', title: 'Redeemed for Discount', points: -200, type: 'redeemed', date: 'Jan 1, 2026' },
    { id: '4', title: 'Order Completed', points: 35, type: 'earned', date: 'Jan 3, 2026' },
];

export default function RewardsScreen() {
    const router = useRouter();
    const totalPoints = 485;

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-[#2874F0] px-4 py-3">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-white">Harun Rewards</Text>
            </View>

            {/* Points Card */}
            <View className="bg-gradient-to-r from-[#2874F0] to-[#1a5dc9] mx-4 mt-4 rounded-xl p-5 shadow-lg">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-blue-200 text-sm">Available Points</Text>
                        <View className="flex-row items-center mt-1">
                            <Coins size={28} color="#FFD700" />
                            <Text className="text-white font-bold text-3xl ml-2">{totalPoints}</Text>
                        </View>
                        <Text className="text-blue-200 text-xs mt-2">= ₹{(totalPoints * 0.25).toFixed(0)} value</Text>
                    </View>
                    <View className="items-center">
                        <Trophy size={40} color="#FFD700" />
                        <Text className="text-yellow-300 text-xs font-bold mt-1">Gold Member</Text>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <View className="flex-row justify-between mx-4 mt-4">
                <TouchableOpacity className="bg-white flex-1 mr-2 p-4 rounded-lg items-center shadow-sm">
                    <Gift size={24} color="#2874F0" />
                    <Text className="text-gray-700 text-xs font-medium mt-2">Redeem</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white flex-1 mx-2 p-4 rounded-lg items-center shadow-sm">
                    <Star size={24} color="#FB641B" />
                    <Text className="text-gray-700 text-xs font-medium mt-2">Earn More</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white flex-1 ml-2 p-4 rounded-lg items-center shadow-sm">
                    <Wallet size={24} color="#16a34a" />
                    <Text className="text-gray-700 text-xs font-medium mt-2">Transfer</Text>
                </TouchableOpacity>
            </View>

            {/* How to Earn */}
            <View className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm">
                <Text className="text-black font-bold mb-3">How to Earn Points</Text>
                <View className="flex-row items-center mb-2">
                    <View className="w-2 h-2 bg-[#2874F0] rounded-full mr-2" />
                    <Text className="text-gray-600 text-sm flex-1">₹100 spent = 10 points</Text>
                </View>
                <View className="flex-row items-center mb-2">
                    <View className="w-2 h-2 bg-[#2874F0] rounded-full mr-2" />
                    <Text className="text-gray-600 text-sm flex-1">Write a review = 5 points</Text>
                </View>
                <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-[#2874F0] rounded-full mr-2" />
                    <Text className="text-gray-600 text-sm flex-1">Refer a friend = 50 points</Text>
                </View>
            </View>

            {/* History */}
            <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm flex-1">
                <Text className="text-black font-bold p-4 border-b border-gray-100">Points History</Text>
                <ScrollView>
                    {REWARDS.map((reward) => (
                        <View key={reward.id} className="flex-row items-center px-4 py-3 border-b border-gray-50">
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                                reward.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                                {reward.type === 'earned' ? (
                                    <Star size={18} color="#16a34a" />
                                ) : (
                                    <Gift size={18} color="#ef4444" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-800 font-medium">{reward.title}</Text>
                                <Text className="text-gray-400 text-xs">{reward.date}</Text>
                            </View>
                            <Text className={`font-bold ${reward.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {reward.points > 0 ? '+' : ''}{reward.points}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
