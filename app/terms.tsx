import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Terms() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>Terms of Service</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 25 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 10 }}>Terms & Conditions</Text>
                <Text style={{ fontSize: 13, color: '#888', marginBottom: 25 }}>Last Updated: January 12, 2026</Text>

                <Section title="1. Acceptance of Terms" text="By accessing or using our mobile application and services, you agree to be bound by these Terms of Service and all applicable laws and regulations." />

                <Section title="2. Purchases & Payments" text="All purchases are subject to availability. We reserve the right to refuse or cancel any order for any reason. Prices are subject to change without notice." />

                <Section title="3. Returns & Refunds" text="Items can be returned within 7 days of delivery if they are unworn and in original condition. Please refer to our Return Policy for detailed instructions." />

                <Section title="4. User Accounts" text="You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." />

                <Section title="5. Intellectual Property" text="All content, features, and functionality of the App, including text, graphics, logos, and images, are the exclusive property of Matoshree Footwear." />

                <Section title="6. Contact Us" text="If you have any questions about these Terms, please contact us via the Contact section in the app." />

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
