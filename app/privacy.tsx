import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function Privacy() {
    const router = useRouter();

    const sections = [
        {
            title: '1. Information We Collect',
            content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:
• Name and contact details
• Shipping and billing address
• Payment information
• Order history
• Device information and location (with your permission)`
        },
        {
            title: '2. How We Use Your Information',
            content: `We use the information we collect to:
• Process and fulfill your orders
• Send order updates and delivery notifications
• Provide customer support
• Send promotional offers (with your consent)
• Improve our app and services
• Prevent fraud and ensure security`
        },
        {
            title: '3. Information Sharing',
            content: `We do not sell your personal information. We share your data only with:
• Delivery partners (to ship your orders)
• Payment processors (to process payments securely)
• Service providers (who help us run our business)
• Law enforcement (when required by law)`
        },
        {
            title: '4. Data Security',
            content: `We implement industry-standard security measures to protect your data:
• Encrypted data transmission (SSL/TLS)
• Secure payment processing
• Regular security audits
• Access controls for our team`
        },
        {
            title: '5. Your Rights',
            content: `You have the right to:
• Access your personal data
• Correct inaccurate data
• Delete your account and data
• Opt-out of marketing communications
• Request data portability`
        },
        {
            title: '6. Contact Us',
            content: `For privacy-related questions, contact us at:
Email: privacy@matoshree.com
Phone: +91 83293 20708
Address: Talwade, Pune - 411062`
        }
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Privacy Policy</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                <Text style={{ color: '#666', marginBottom: 20 }}>Last updated: January 2026</Text>

                <Text style={{ fontSize: 15, color: '#444', lineHeight: 24, marginBottom: 25 }}>
                    At Matoshree Footwear, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
                </Text>

                {sections.map((section, i) => (
                    <View key={i} style={{ marginBottom: 25 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{section.title}</Text>
                        <Text style={{ color: '#444', lineHeight: 22 }}>{section.content}</Text>
                    </View>
                ))}

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
