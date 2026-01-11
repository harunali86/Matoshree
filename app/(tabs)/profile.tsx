import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Bell, CreditCard, HelpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

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
    const [loading, setLoading] = useState(false); // Local loading state for initial check only if needed

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

    const menuItems = [
        { icon: Package, label: 'My Orders', route: '/my-orders', requiresAuth: true },
        { icon: MapPin, label: 'Saved Addresses', route: '/addresses', requiresAuth: true },
        { icon: Heart, label: 'Wishlist', route: '/wishlist', requiresAuth: true },
        { icon: CreditCard, label: 'Payment Methods', route: '/payments', requiresAuth: true },
        { icon: Bell, label: 'Notifications', route: '/notifications', requiresAuth: false },
        { icon: HelpCircle, label: 'Help & Support', route: '/help', requiresAuth: false },
        { icon: Settings, label: 'Settings', route: '/settings', requiresAuth: false },
    ];

    const handleMenuPress = (item: typeof menuItems[0]) => {
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
