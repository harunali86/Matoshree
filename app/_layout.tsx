import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Notification Handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Helper Function
async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            // console.log('Failed to get push token for push notification!');
            return;
        }

        // Expo Go specific behavior might return null for projectId, handle gracefully
        // But basic getToken should work if signed in to Expo or using Dev Build
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        try {
            const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            return token;
        } catch (e) {
            console.log('Error fetching token:', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }
}

export default function RootLayout() {
    const { isAuthenticated, checkSession, user } = useAuthStore();
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

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

    // Register for Notifications if logged in
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            registerForPushNotificationsAsync().then((token) => {
                if (token) {
                    console.log('Push Token:', token);
                    // Save to profiles
                    supabase.from('profiles').upsert({
                        id: user.id,
                        // Only update push_token, keep other fields if they exist
                        push_token: token
                    }, { onConflict: 'id' }).then(({ error }) => {
                        if (error) console.log('Error saving push token:', error);
                    });
                }
            });
        }

        // Listeners for incoming notifications (foreground)
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        // Background / Interaction
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, [isAuthenticated, user?.id]);

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
