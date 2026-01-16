import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, FileText, MapPin, ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react-native';

export default function RegisterB2B() {
    const router = useRouter();
    const { user, checkSession } = useAuthStore();

    // Form State
    const [businessName, setBusinessName] = useState(user?.business_name || '');
    const [gstNumber, setGstNumber] = useState(user?.gst_number || '');
    const [shopAddress, setShopAddress] = useState(user?.shop_address || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!businessName || !gstNumber || !shopAddress) {
            Alert.alert('Missing Details', 'Please fill in all the business details.');
            return;
        }

        setLoading(true);
        try {
            // 1. Update Profile with "pending" wholesale status
            const { error } = await supabase
                .from('profiles')
                .update({
                    business_name: businessName,
                    gst_number: gstNumber,
                    shop_address: shopAddress,
                    role: 'wholesale',          // Requesting wholesale role
                    is_verified: false          // Pending verification
                })
                .eq('id', user?.id);

            if (error) throw error;

            // 2. Refresh Local State
            await checkSession();

            // 3. Success Feedback
            Alert.alert(
                'Application Submitted',
                'Your wholesale account request has been sent for verification. We will notify you once approved.',
                [{ text: 'OK', onPress: () => router.replace('/(tabs)/profile') }]
            );

        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message || 'Failed to submit application.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
                    <ChevronLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '700', marginLeft: 4 }}>Partner Program</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

                {/* Hero Section */}
                <View style={{ marginBottom: 32, alignItems: 'center' }}>
                    <View style={{ width: 80, height: 80, backgroundColor: '#f0f9ff', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                        <Building2 size={36} color="#0284c7" />
                    </View>
                    <Text style={{ fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>Become a Wholesaler</Text>
                    <Text style={{ fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, maxWidth: '90%' }}>
                        Join our exclusive B2B network to unlock wholesale pricing, bulk quantity discounts, and priority support.
                    </Text>
                </View>

                {/* Form */}
                <View style={{ gap: 20 }}>
                    {/* Business Name */}
                    <View>
                        <Text style={{ fontSize: 13, fontWeight: '600', marginBottom: 8, color: '#333' }}>BUSINESS NAME</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, paddingHorizontal: 14, height: 50, backgroundColor: '#fafafa' }}>
                            <Building2 size={18} color="#999" style={{ marginRight: 10 }} />
                            <TextInput
                                value={businessName}
                                onChangeText={setBusinessName}
                                placeholder="Enter your registered business name"
                                style={{ flex: 1, fontSize: 15, fontWeight: '500' }}
                            />
                        </View>
                    </View>

                    {/* GST Number */}
                    <View>
                        <Text style={{ fontSize: 13, fontWeight: '600', marginBottom: 8, color: '#333' }}>GST / ID PROOF</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, paddingHorizontal: 14, height: 50, backgroundColor: '#fafafa' }}>
                            <FileText size={18} color="#999" style={{ marginRight: 10 }} />
                            <TextInput
                                value={gstNumber}
                                onChangeText={setGstNumber}
                                placeholder="GST Number or Business ID"
                                style={{ flex: 1, fontSize: 15, fontWeight: '500' }}
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>

                    {/* Shop Address */}
                    <View>
                        <Text style={{ fontSize: 13, fontWeight: '600', marginBottom: 8, color: '#333' }}>FULL SHOP ADDRESS</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, minHeight: 100, backgroundColor: '#fafafa' }}>
                            <MapPin size={18} color="#999" style={{ marginRight: 10, marginTop: 2 }} />
                            <TextInput
                                value={shopAddress}
                                onChangeText={setShopAddress}
                                placeholder="Complete address with pincode"
                                style={{ flex: 1, fontSize: 15, fontWeight: '500', lineHeight: 20 }}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                        <Text style={{ fontSize: 11, color: '#999', marginTop: 6, marginLeft: 4 }}>We need this for delivery verification.</Text>
                    </View>
                </View>

                {/* Benefits List */}
                <View style={{ marginTop: 40, backgroundColor: '#f8fafc', padding: 20, borderRadius: 16 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 12 }}>Benefits Included</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <CheckCircle2 size={16} color="#059669" style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 13, color: '#444' }}>Up to 40% Off on Bulk Orders</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <CheckCircle2 size={16} color="#059669" style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 13, color: '#444' }}>GST Invoicing Available</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckCircle2 size={16} color="#059669" style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 13, color: '#444' }}>Priority Shipping</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Action */}
            <View style={{ padding: 20, borderTopWidth: 1, borderColor: '#f0f0f0', backgroundColor: 'white' }}>
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={{
                        backgroundColor: 'black',
                        height: 56,
                        borderRadius: 28,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginRight: 8 }}>Submit Application</Text>
                            <ArrowRight size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
