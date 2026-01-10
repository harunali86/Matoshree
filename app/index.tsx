import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }

    // Allow guest browsing - users can browse without login
    // Profile, Orders, and Checkout will prompt for login when needed
    return <Redirect href="/(tabs)" />;
}
