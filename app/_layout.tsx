import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated, checkSession, user } = useAuthStore();

    // Check session on mount
    useEffect(() => {
        checkSession();
    }, []);

    // Listen for auth state changes (login/logout)
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                useAuthStore.setState({
                    user: {
                        id: session.user.id,
                        email: session.user.email || '',
                        full_name: session.user.user_metadata?.full_name
                    },
                    isAuthenticated: true,
                    isLoading: false
                });
            } else if (event === 'SIGNED_OUT') {
                useAuthStore.setState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="orders/[id]" />
            <Stack.Screen name="my-orders" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="order-success" />
            <Stack.Screen name="addresses" />
            <Stack.Screen name="add-address" />
            <Stack.Screen name="wishlist" />
            <Stack.Screen name="help" />
            <Stack.Screen name="about" />
            <Stack.Screen name="contact" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="terms" />
        </Stack>
    );
}
