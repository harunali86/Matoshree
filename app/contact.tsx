import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

interface StoreSettings {
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
    name: 'Matoshree Footwear',
    phone: '+91 83293 20708',
    whatsapp: '+91 83293 20708',
    email: 'support@matoshree.com',
    address: 'Shop No. 5, Shivkrupa Society, Chikhali Road, Talwade, Pune - 411062',
};

export default function Contact() {
    const router = useRouter();
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await supabase.from('settings').select('store').eq('id', 'main').single();
            if (data?.store) {
                setSettings({ ...DEFAULT_SETTINGS, ...data.store });
            }
        } catch (e) {

        } finally {
            setLoading(false);
        }
    };

    const formatPhone = (phone: string) => phone.replace(/\s/g, '').replace('+', '');

    const contactMethods = [
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: settings.whatsapp,
            action: () => Linking.openURL(`whatsapp://send?phone=${formatPhone(settings.whatsapp)}&text=Hi, I have a query about my order`),
            color: '#25D366'
        },
        {
            icon: Phone,
            label: 'Call Us',
            value: settings.phone,
            action: () => Linking.openURL(`tel:${formatPhone(settings.phone)}`),
            color: '#007AFF'
        },
    ];

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Contact Us</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {/* Intro */}
                <Text style={{ fontSize: 16, color: '#444', marginBottom: 25, lineHeight: 24 }}>
                    Have a question or need help? We're here for you! Reach out through any of the channels below.
                </Text>

                {/* Contact Methods */}
                {contactMethods.map((method, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={method.action}
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 18, borderRadius: 12, marginBottom: 12 }}
                    >
                        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: method.color, justifyContent: 'center', alignItems: 'center' }}>
                            <method.icon size={24} color="white" />
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{method.label}</Text>
                            <Text style={{ color: '#666', marginTop: 3 }}>{method.value}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Store Address */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Store Address</Text>
                    <View style={{ backgroundColor: '#f0f4ff', padding: 20, borderRadius: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 }}>
                            <MapPin size={22} color="#1976d2" />
                            <Text style={{ marginLeft: 12, flex: 1, fontSize: 15, lineHeight: 22 }}>
                                {settings.name}{'\n'}
                                {settings.address}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Clock size={22} color="#1976d2" />
                            <Text style={{ marginLeft: 12, fontSize: 15 }}>Open Daily: 10 AM - 9 PM</Text>
                        </View>
                    </View>
                </View>

                {/* Response Time */}
                <View style={{ marginTop: 25, padding: 15, backgroundColor: '#e8f5e9', borderRadius: 12 }}>
                    <Text style={{ fontWeight: 'bold', color: '#2e7d32' }}>⚡ Quick Response</Text>
                    <Text style={{ color: '#388e3c', marginTop: 5 }}>We typically respond within 30 minutes during business hours</Text>
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
