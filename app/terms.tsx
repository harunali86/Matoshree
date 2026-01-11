import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function Terms() {
    const router = useRouter();

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: `By accessing and using the Matoshree Footwear app, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.`
        },
        {
            title: '2. Products & Pricing',
            content: `• All products are subject to availability
• Prices are in Indian Rupees (₹) and include GST
• We reserve the right to modify prices without prior notice
• Product images are for reference; actual colors may vary slightly
• We sell only genuine, authentic branded products`
        },
        {
            title: '3. Orders & Payment',
            content: `• Orders are confirmed only after successful payment
• We accept COD, UPI, Credit/Debit Cards
• COD is available for orders below ₹10,000
• Order cancellation is allowed before shipping
• Refunds are processed within 5-7 business days`
        },
        {
            title: '4. Shipping & Delivery',
            content: `• Free delivery on orders above ₹999
• Standard delivery: 3-7 business days
• Express delivery available in select areas
• Delivery timelines may vary due to unforeseen circumstances
• Risk of loss passes to you upon delivery`
        },
        {
            title: '5. Returns & Refunds',
            content: `• 7-day return policy from date of delivery
• Products must be unused with original tags
• Return shipping is free for defective items
• Refunds are credited to original payment method
• Exchange is subject to product availability`
        },
        {
            title: '6. User Account',
            content: `• You are responsible for maintaining account security
• Provide accurate and complete information
• One account per person
• We reserve the right to suspend accounts for violations
• Account data is governed by our Privacy Policy`
        },
        {
            title: '7. Intellectual Property',
            content: `• All content, logos, and designs are property of Matoshree Footwear
• Brand names and logos belong to their respective owners
• You may not copy, modify, or distribute our content
• User-generated content grants us usage rights`
        },
        {
            title: '8. Limitation of Liability',
            content: `• We are not liable for indirect or consequential damages
• Maximum liability is limited to the order value
• We do not guarantee uninterrupted service
• Force majeure events excuse performance delays`
        },
        {
            title: '9. Governing Law',
            content: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Pune, Maharashtra.`
        },
        {
            title: '10. Contact',
            content: `For questions about these terms:
Email: legal@matoshree.com
Phone: +91 83293 20708`
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Terms & Conditions</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                <Text style={{ color: '#666', marginBottom: 20 }}>Last updated: January 2026</Text>

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
