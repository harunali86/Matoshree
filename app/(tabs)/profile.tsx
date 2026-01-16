import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Bell, CreditCard, HelpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';

interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
}

export default function Profile() {
    const router = useRouter();
    // Use Store for Global State
    const { user, signOut, isAuthenticated } = useAuthStore();
    const { unreadCount, fetchNotifications } = useNotificationStore();
    const [loading, setLoading] = useState(false); // Local loading state for initial check only if needed

    // Fetch notifications when user is available
    useEffect(() => {
        if (user?.id) {
            fetchNotifications(user.id);
        }
    }, [user?.id]);

    // No need for local useEffect listener if store handles it, 
    // but store persistence might take a ms to rehydrate.
    // We trust the store's state.

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/(auth)/login');
                    }
                }
            ]
        );
    };

    const baseMenuItems = [
        { icon: Package, label: 'My Orders', route: '/my-orders', requiresAuth: true },
        { icon: MapPin, label: 'Saved Addresses', route: '/addresses', requiresAuth: true },
        { icon: Heart, label: 'Wishlist', route: '/wishlist', requiresAuth: true },
        { icon: CreditCard, label: 'Payment Methods', route: '/payment-methods', requiresAuth: true },
    ];

    const b2bMenuItems = user?.role === 'wholesale' ? [
        { icon: CreditCard, label: 'My Quotations', route: '/b2b/quotations', requiresAuth: true },
    ] : [];

    const rewardsItems = [
        { icon: Heart, label: 'Rewards & Referrals', route: '/rewards', requiresAuth: true },
    ];

    const otherMenuItems = [
        { icon: HelpCircle, label: 'Help & Support', route: '/help', requiresAuth: false },
        { icon: Settings, label: 'Settings', route: '/settings', requiresAuth: false },
    ];

    const menuItems = [...baseMenuItems, ...rewardsItems, ...b2bMenuItems, ...otherMenuItems];

    const handleMenuPress = (item: any) => {
        if (item.requiresAuth && !user) {
            Alert.alert('Sign In Required', 'Please sign in to access this feature', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign In', onPress: () => router.push('/(auth)/login') }
            ]);
        } else {
            router.push(item.route as any);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="black" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                {/* Header */}
                <View style={{ padding: 25, alignItems: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                    {/* Notification Bell */}
                    {user && (
                        <TouchableOpacity
                            onPress={() => router.push('/notifications')}
                            style={{ position: 'absolute', top: 20, right: 20 }}
                        >
                            <Bell size={24} color="#333" />
                            {unreadCount > 0 && (
                                <View style={{
                                    position: 'absolute', top: -5, right: -5,
                                    backgroundColor: '#ef4444', width: 18, height: 18,
                                    borderRadius: 9, justifyContent: 'center', alignItems: 'center',
                                    borderWidth: 2, borderColor: 'white'
                                }}>
                                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    <View style={{
                        width: 90,
                        height: 90,
                        backgroundColor: user ? '#000' : '#f0f0f0',
                        borderRadius: 45,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 15
                    }}>
                        {user ? (
                            <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold' }}>
                                {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        ) : (
                            <User size={40} color="#999" />
                        )}
                    </View>

                    {user ? (
                        <>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{user.full_name || 'User'}</Text>
                            <Text style={{ color: '#666', marginTop: 5 }}>{user.email}</Text>
                            {user.phone && <Text style={{ color: '#999', marginTop: 3 }}>{user.phone}</Text>}
                        </>
                    ) : (
                        <>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>Welcome!</Text>
                            <Text style={{ color: '#666', marginBottom: 20, textAlign: 'center' }}>
                                Sign in to access orders, wishlist & more
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity
                                    onPress={() => router.push('/(auth)/login')}
                                    style={{ backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 }}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>SIGN IN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => router.push('/(auth)/signup')}
                                    style={{ backgroundColor: '#f0f0f0', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 }}
                                >
                                    <Text style={{ fontWeight: 'bold' }}>REGISTER</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>

                {/* Validated Business Profile (B2B Only) */}
                {user?.role === 'wholesale' && user?.is_verified && (
                    <View style={{ marginHorizontal: 20, marginTop: 20, padding: 20, backgroundColor: '#0f172a', borderRadius: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Business Profile</Text>
                            <View style={{ backgroundColor: '#0ea5e9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>VERIFIED B2B</Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 2 }}>BUSINESS NAME</Text>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>{user.business_name || 'N/A'}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 2 }}>GSTIN</Text>
                                <Text style={{ color: 'white', fontSize: 14 }}>{user.gst_number || 'N/A'}</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 2, textAlign: 'right' }}>CREDIT BALANCE</Text>
                                <Text style={{ color: '#4ade80', fontSize: 16, fontWeight: 'bold', textAlign: 'right' }}>₹{user.credit_balance?.toLocaleString() || '0'}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Verification Pending Banner */}
                {user?.role === 'wholesale' && !user?.is_verified && (
                    <View style={{ margin: 20, padding: 20, backgroundColor: '#fff7ed', borderRadius: 12, borderWidth: 1, borderColor: '#fdba74' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#c2410c', marginBottom: 5 }}>Verification Pending</Text>
                        <Text style={{ color: '#9a3412', fontSize: 14 }}>
                            Your business details are under review. You will be notified once your account is approved for wholesale pricing.
                        </Text>
                    </View>
                )}

                {/* Become a Wholesaler Banner (Retail Only) */}
                {user && user.role === 'retail' && (
                    <TouchableOpacity
                        onPress={() => router.push('/b2b/register')}
                        style={{ margin: 20, padding: 20, backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 5 }}>Are you a Wholesaler?</Text>
                            <Text style={{ color: '#1e40af', fontSize: 13 }}>Register your business to unlock bulk pricing and exclusive catalogs.</Text>
                        </View>
                        <View style={{ width: 40, height: 40, backgroundColor: '#dbeafe', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <ChevronRight size={24} color="#1e40af" />
                        </View>
                    </TouchableOpacity>
                )}

                {/* Menu Items */}
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 15, letterSpacing: 1 }}>MY ACCOUNT</Text>

                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleMenuPress(item)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 16,
                                borderBottomWidth: 1,
                                borderColor: '#f5f5f5'
                            }}
                        >
                            <View style={{ width: 42, height: 42, backgroundColor: '#f8f8f8', borderRadius: 21, justifyContent: 'center', alignItems: 'center' }}>
                                <item.icon size={20} color="#333" />
                            </View>
                            <Text style={{ flex: 1, marginLeft: 15, fontSize: 15, color: '#333' }}>{item.label}</Text>
                            <ChevronRight size={20} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                {user && (
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 10 }}
                    >
                        <View style={{ width: 42, height: 42, backgroundColor: '#ffebee', borderRadius: 21, justifyContent: 'center', alignItems: 'center' }}>
                            <LogOut size={20} color="#c62828" />
                        </View>
                        <Text style={{ marginLeft: 15, fontSize: 15, color: '#c62828', fontWeight: '500' }}>Log Out</Text>
                    </TouchableOpacity>
                )}

                {/* App Info */}
                <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                    <Text style={{ color: '#ccc', fontSize: 12 }}>Matoshree Footwear v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
