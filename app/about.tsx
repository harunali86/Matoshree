import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function About() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>About Us</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 25 }}>
                <View style={{ marginBottom: 30, alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, fontWeight: '900', letterSpacing: 3, marginBottom: 5 }}>MATOSHREE</Text>
                    <Text style={{ fontSize: 14, color: '#666', letterSpacing: 2 }}>EST. 1999</Text>
                </View>

                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800' }}
                    style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 30 }}
                    resizeMode="cover"
                />

                <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 15 }}>Our Story</Text>

                <Text style={{ fontSize: 16, lineHeight: 26, color: '#444', marginBottom: 20 }}>
                    Established in 1999, Matoshree Footwear began as a humble endeavor with a singular vision: to bring world-class quality and timeless design to our local community. Over two decades later, that vision has evolved into a leading footwear destination.
                </Text>

                <Text style={{ fontSize: 16, lineHeight: 26, color: '#444', marginBottom: 20 }}>
                    We believe that shoes are more than just an accessory—they are the foundation of your journey. That's why every pair in our collection is curated for comfort, durability, and style.
                </Text>

                <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 15, marginTop: 10 }}>Our Promise</Text>
                <Text style={{ fontSize: 16, lineHeight: 26, color: '#444', marginBottom: 20 }}>
                    From authentic leather classics to modern streetwear, we guarantee authenticity and excellence. Thank you for walking this journey with us for over 25 years.
                </Text>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
