import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, HelpCircle, FileText, Shield, Truck, CreditCard, Package } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const FAQ_DATA = [
    { question: 'How do I track my order?', answer: 'Go to Profile → My Orders → Tap on your order to see real-time tracking status.', icon: Package },
    { question: 'What is the return policy?', answer: 'We offer 7-day easy returns on all products. Items must be unused with original tags.', icon: Truck },
    { question: 'How can I cancel my order?', answer: 'You can cancel orders before they are shipped. Go to My Orders → Order Details → Cancel Order.', icon: FileText },
    { question: 'What payment methods are accepted?', answer: 'We accept COD, UPI (GPay, PhonePe, Paytm), and Credit/Debit cards.', icon: CreditCard },
    { question: 'Is my payment information secure?', answer: 'Yes! All payments are processed through secure encrypted channels.', icon: Shield },
];

interface Settings {
    phone: string;
    whatsapp: string;
    email: string;
}

export default function Help() {
    const router = useRouter();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [settings, setSettings] = useState<Settings>({ phone: '+91 83293 20708', whatsapp: '+91 83293 20708', email: 'support@matoshree.com' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await supabase.from('settings').select('store').eq('id', 'main').single();
            if (data?.store) {
                setSettings({
                    phone: data.store.phone || settings.phone,
                    whatsapp: data.store.whatsapp || settings.whatsapp,
                    email: data.store.email || settings.email,
                });
            }
        } catch (e) {
            console.log('Using default settings');
        } finally {
            setLoading(false);
        }
    };

    const formatPhone = (phone: string) => phone.replace(/\s/g, '').replace('+', '');

    const contactSupport = (method: 'whatsapp' | 'phone' | 'email') => {
        switch (method) {
            case 'whatsapp':
                Linking.openURL(`whatsapp://send?phone=${formatPhone(settings.whatsapp)}&text=Hi, I need help with my order`);
                break;
            case 'phone':
                Linking.openURL(`tel:${formatPhone(settings.phone)}`);
                break;
            case 'email':
                Linking.openURL(`mailto:${settings.email}?subject=Support Request`);
                break;
        }
    };

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
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Help & Support</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {/* Contact Options */}
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Contact Us</Text>

                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 30 }}>
                    <TouchableOpacity
                        onPress={() => contactSupport('whatsapp')}
                        style={{ flex: 1, backgroundColor: '#25D366', padding: 16, borderRadius: 12, alignItems: 'center' }}
                    >
                        <MessageCircle size={24} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => contactSupport('phone')}
                        style={{ flex: 1, backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' }}
                    >
                        <Phone size={24} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Call Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => contactSupport('email')}
                        style={{ flex: 1, backgroundColor: '#FF5722', padding: 16, borderRadius: 12, alignItems: 'center' }}
                    >
                        <Mail size={24} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Email</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <HelpCircle size={20} color="#333" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>Frequently Asked Questions</Text>
                </View>

                {FAQ_DATA.map((item, index) => {
                    const isExpanded = expandedIndex === index;
                    const Icon = item.icon;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setExpandedIndex(isExpanded ? null : index)}
                            style={{
                                backgroundColor: '#f9f9f9',
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 12,
                                borderWidth: isExpanded ? 1 : 0,
                                borderColor: '#ddd'
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon size={20} color="#666" />
                                <Text style={{ flex: 1, marginLeft: 12, fontWeight: '600', fontSize: 15 }}>{item.question}</Text>
                                {isExpanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                            </View>

                            {isExpanded && (
                                <Text style={{ marginTop: 12, color: '#666', lineHeight: 22 }}>{item.answer}</Text>
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* Support Hours */}
                <View style={{ backgroundColor: '#f0f4ff', padding: 16, borderRadius: 12, marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Support Hours</Text>
                    <Text style={{ color: '#666' }}>Monday - Saturday: 9 AM - 9 PM</Text>
                    <Text style={{ color: '#666' }}>Sunday: 10 AM - 6 PM</Text>
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
