import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Splash() {
    const router = useRouter();

    useEffect(() => {
        // 800ms branding delay
        const timer = setTimeout(() => {
            router.replace('/(tabs)');
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 40, fontWeight: '900', letterSpacing: 4, fontStyle: 'italic' }}>MATOSHREE</Text>
            <Text style={{ color: '#888', letterSpacing: 2, marginTop: 10, fontSize: 12 }}>PREMIUM FOOTWEAR</Text>
            <ActivityIndicator size="small" color="white" style={{ marginTop: 40 }} />
        </View>
    );
}
