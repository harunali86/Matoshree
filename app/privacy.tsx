import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Privacy() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>Privacy Policy</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 25 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 10 }}>Privacy Policy</Text>
                <Text style={{ fontSize: 13, color: '#888', marginBottom: 25 }}>Last Updated: January 12, 2026</Text>

                <Section title="1. Information We Collect" text="We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us. This may include your name, email address, phone number, shipping info, and payment details." />

                <Section title="2. How We Use Information" text="We use the information we collect to provider, maintain, and improve our services, process transactions, send you notifications, and respond to your comments." />

                <Section title="3. Data Security" text="We implement reasonable security measures to protect the security of your personal information. Your payment data is encrypted and processed via secure gateways." />

                <Section title="4. Sharing of Information" text="We do not share your personal information with third parties except as described in this policy or with your consent, such as with shipping partners to deliver your orders." />

                <Section title="5. Your Rights" text="You have the right to access, correct, or delete your personal information at any time through your account settings or by contacting us." />

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function Section({ title, text }: { title: string, text: string }) {
    return (
        <View style={{ marginBottom: 25 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>{title}</Text>
            <Text style={{ fontSize: 15, lineHeight: 24, color: '#444' }}>{text}</Text>
        </View>
    );
}
