import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react-native';

export default function About() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>About Us</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {/* Logo & Brand */}
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Text style={{ fontSize: 32, fontWeight: '900', letterSpacing: 3 }}>MATOSHREE</Text>
                    <Text style={{ color: '#666', marginTop: 5 }}>Premium Footwear Since 2010</Text>
                </View>

                {/* Story */}
                <View style={{ marginBottom: 25 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Our Story</Text>
                    <Text style={{ color: '#444', lineHeight: 24 }}>
                        Matoshree Footwear started as a small family-owned shop in Pune, Maharashtra.
                        Over the years, we have grown into a trusted destination for premium quality footwear.
                        Our commitment to quality, comfort, and style has made us a favorite among customers across India.
                    </Text>
                </View>

                {/* Mission */}
                <View style={{ marginBottom: 25 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Our Mission</Text>
                    <Text style={{ color: '#444', lineHeight: 24 }}>
                        To provide high-quality, comfortable, and stylish footwear at affordable prices.
                        We believe everyone deserves to walk in comfort without breaking the bank.
                    </Text>
                </View>

                {/* Why Choose Us */}
                <View style={{ marginBottom: 25 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Why Choose Us?</Text>

                    <View style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, marginBottom: 10 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 5 }}>✅ 100% Genuine Products</Text>
                        <Text style={{ color: '#666', fontSize: 13 }}>All brands are authentic with manufacturer warranty</Text>
                    </View>

                    <View style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, marginBottom: 10 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 5 }}>🚚 Fast Delivery</Text>
                        <Text style={{ color: '#666', fontSize: 13 }}>Free delivery on orders above ₹999</Text>
                    </View>

                    <View style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, marginBottom: 10 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 5 }}>↩️ Easy Returns</Text>
                        <Text style={{ color: '#666', fontSize: 13 }}>7-day hassle-free return policy</Text>
                    </View>

                    <View style={{ backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 5 }}>💬 24/7 Support</Text>
                        <Text style={{ color: '#666', fontSize: 13 }}>Dedicated customer support via WhatsApp</Text>
                    </View>
                </View>

                {/* Store Location */}
                <View style={{ marginBottom: 25 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Visit Our Store</Text>
                    <View style={{ backgroundColor: '#f0f4ff', padding: 20, borderRadius: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                            <MapPin size={20} color="#333" />
                            <Text style={{ marginLeft: 12, flex: 1, color: '#333' }}>
                                Shop No. 5, Shivkrupa Society,{'\n'}
                                Chikhali Road, Talwade,{'\n'}
                                Pune, Maharashtra - 411062
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Clock size={20} color="#333" />
                            <Text style={{ marginLeft: 12, color: '#333' }}>Mon - Sun: 10:00 AM - 9:00 PM</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Phone size={20} color="#333" />
                            <Text style={{ marginLeft: 12, color: '#333' }}>+91 83293 20708</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
