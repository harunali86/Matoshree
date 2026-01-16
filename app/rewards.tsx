import { View, Text, ScrollView, TouchableOpacity, Share, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Gift, Copy, Share2, Users, Star, Trophy, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import * as Clipboard from 'expo-clipboard';

export default function Rewards() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [copied, setCopied] = useState(false);

    // Mock rewards data - would come from backend
    const rewardsData = {
        points: (user as any)?.reward_points || 0,
        referralCode: (user as any)?.referral_code || `MATOSHREE${user?.id?.slice(0, 6).toUpperCase() || 'USER'}`,
        referralCount: 3,
        pendingRewards: 150,
        tier: 'Silver',
        nextTier: 'Gold',
        pointsToNextTier: 500
    };

    const copyReferralCode = async () => {
        await Clipboard.setStringAsync(rewardsData.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareReferralCode = async () => {
        try {
            await Share.share({
                message: `Shop at Matoshree and get ₹100 off! Use my referral code: ${rewardsData.referralCode}\n\nDownload: https://matoshree.com/app`,
                title: 'Join Matoshree!'
            });
        } catch (e) {
            console.error(e);
        }
    };

    const rewardHistory = [
        { id: '1', type: 'earned', points: 50, description: 'Order #A1B2C3', date: '2 days ago' },
        { id: '2', type: 'earned', points: 100, description: 'Referral Bonus', date: '1 week ago' },
        { id: '3', type: 'redeemed', points: -200, description: 'Discount Applied', date: '2 weeks ago' },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Rewards</Text>
            </View>

            <ScrollView style={{ flex: 1 }}>

                {/* Points Card */}
                <View style={{ margin: 20, backgroundColor: '#0f172a', borderRadius: 20, padding: 24, overflow: 'hidden' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <Text style={{ color: '#94a3b8', fontSize: 13, letterSpacing: 1 }}>YOUR POINTS</Text>
                            <Text style={{ color: 'white', fontSize: 42, fontWeight: '900', marginTop: 4 }}>{rewardsData.points}</Text>
                        </View>
                        <View style={{ backgroundColor: '#fbbf24', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                            <Text style={{ color: '#78350f', fontWeight: 'bold', fontSize: 12 }}>{rewardsData.tier}</Text>
                        </View>
                    </View>

                    {/* Progress to next tier */}
                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>{rewardsData.pointsToNextTier} points to {rewardsData.nextTier}</Text>
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>{rewardsData.nextTier}</Text>
                        </View>
                        <View style={{ height: 6, backgroundColor: '#334155', borderRadius: 3 }}>
                            <View style={{ height: 6, width: '60%', backgroundColor: '#fbbf24', borderRadius: 3 }} />
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <View style={{ flexDirection: 'row', marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderColor: '#334155' }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{rewardsData.referralCount}</Text>
                            <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>Referrals</Text>
                        </View>
                        <View style={{ width: 1, backgroundColor: '#334155' }} />
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: '#4ade80', fontSize: 22, fontWeight: 'bold' }}>₹{rewardsData.pendingRewards}</Text>
                            <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>Pending</Text>
                        </View>
                    </View>
                </View>

                {/* Referral Section */}
                <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Refer & Earn</Text>
                    <Text style={{ color: '#666', marginBottom: 16, lineHeight: 20 }}>
                        Share your referral code and earn ₹100 for every friend who makes their first purchase!
                    </Text>

                    {/* Referral Code Box */}
                    <View style={{ backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#666', fontSize: 11, marginBottom: 4 }}>YOUR REFERRAL CODE</Text>
                            <Text style={{ fontSize: 22, fontWeight: '900', letterSpacing: 2 }}>{rewardsData.referralCode}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={copyReferralCode}
                            style={{ padding: 12, backgroundColor: 'white', borderRadius: 10, marginLeft: 10 }}
                        >
                            <Copy size={20} color={copied ? '#10b981' : '#333'} />
                        </TouchableOpacity>
                    </View>
                    {copied && <Text style={{ color: '#10b981', fontSize: 12, marginBottom: 12 }}>Copied to clipboard!</Text>}

                    {/* Share Button */}
                    <TouchableOpacity
                        onPress={shareReferralCode}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#111',
                            padding: 16,
                            borderRadius: 12
                        }}
                    >
                        <Share2 size={20} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 10 }}>Share with Friends</Text>
                    </TouchableOpacity>
                </View>

                {/* How It Works */}
                <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>How It Works</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <Share2 size={22} color="#0284c7" />
                            </View>
                            <Text style={{ fontWeight: '600', fontSize: 13, textAlign: 'center' }}>Share Code</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <Users size={22} color="#d97706" />
                            </View>
                            <Text style={{ fontWeight: '600', fontSize: 13, textAlign: 'center' }}>Friend Signs Up</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <Gift size={22} color="#16a34a" />
                            </View>
                            <Text style={{ fontWeight: '600', fontSize: 13, textAlign: 'center' }}>Both Get ₹100</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Recent Activity</Text>
                    {rewardHistory.map(item => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 14,
                                borderBottomWidth: 1,
                                borderColor: '#f5f5f5'
                            }}
                        >
                            <View style={{
                                width: 40, height: 40, borderRadius: 20,
                                backgroundColor: item.type === 'earned' ? '#dcfce7' : '#fee2e2',
                                justifyContent: 'center', alignItems: 'center', marginRight: 14
                            }}>
                                {item.type === 'earned' ? (
                                    <Star size={18} color="#16a34a" />
                                ) : (
                                    <Gift size={18} color="#dc2626" />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: '600', fontSize: 14 }}>{item.description}</Text>
                                <Text style={{ color: '#999', fontSize: 12, marginTop: 2 }}>{item.date}</Text>
                            </View>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 15,
                                color: item.type === 'earned' ? '#16a34a' : '#dc2626'
                            }}>
                                {item.type === 'earned' ? '+' : ''}{item.points}
                            </Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
