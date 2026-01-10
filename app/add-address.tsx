import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { MapPin, Navigation, CheckCircle, XCircle } from 'lucide-react-native';

// Inline toast state
interface ToastState {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function AddAddressScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'info' });
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        addressType: 'home' as 'home' | 'work' | 'other'
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: '', type: 'info' }), 3000);
    };

    // Fetch current location using GPS
    const fetchCurrentLocation = async () => {
        setLocationLoading(true);

        try {
            if (Platform.OS === 'web') {
                if (!navigator.geolocation) {
                    showToast('Geolocation is not supported by your browser', 'error');
                    setLocationLoading(false);
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        await reverseGeocode(latitude, longitude);
                    },
                    (error) => {
                        showToast('Unable to get location. Please allow location access.', 'error');
                        setLocationLoading(false);
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                showToast('GPS location requires expo-location package for native apps', 'info');
                setLocationLoading(false);
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to get location', 'error');
            setLocationLoading(false);
        }
    };

    // Reverse geocode coordinates to address
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;
                setFormData(prev => ({
                    ...prev,
                    addressLine1: [addr.house_number, addr.road].filter(Boolean).join(', ') || addr.display_name?.split(',')[0] || '',
                    addressLine2: addr.suburb || addr.neighbourhood || addr.hamlet || '',
                    landmark: addr.amenity || addr.building || '',
                    city: addr.city || addr.town || addr.village || addr.county || '',
                    state: addr.state || '',
                    pincode: addr.postcode || ''
                }));
                showToast('Location fetched! Please verify the details.', 'success');
            } else {
                showToast('Could not fetch address for this location', 'error');
            }
        } catch (error) {
            showToast('Failed to fetch address. Check your internet.', 'error');
        }
        setLocationLoading(false);
    };

    const handleSave = async () => {
        // Validation
        if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        if (formData.phone.length !== 10) {
            showToast('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        if (formData.pincode.length !== 6) {
            showToast('Please enter a valid 6-digit pincode', 'error');
            return;
        }

        setLoading(true);
        const { error } = await supabase
            .from('addresses')
            .insert([
                {
                    user_id: user?.id,
                    full_name: formData.fullName,
                    phone: formData.phone,
                    address_line1: formData.addressLine1,
                    address_line2: formData.addressLine2 || null,
                    landmark: formData.landmark || null,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    address_type: formData.addressType,
                    is_default: false
                }
            ]);

        setLoading(false);

        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Address added successfully!', 'success');
            setTimeout(() => router.back(), 1500);
        }
    };

    return (
        <Container safeArea className="bg-white">
            {/* Inbuilt Toast */}
            {toast.visible && (
                <View style={{
                    position: 'absolute',
                    top: 60,
                    left: 16,
                    right: 16,
                    zIndex: 9999,
                    backgroundColor: toast.type === 'success' ? '#ECFDF5' : toast.type === 'error' ? '#FEF2F2' : '#EFF6FF',
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: toast.type === 'success' ? '#A7F3D0' : toast.type === 'error' ? '#FECACA' : '#BFDBFE',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                }}>
                    {toast.type === 'success' ? (
                        <CheckCircle size={20} color="#10B981" />
                    ) : toast.type === 'error' ? (
                        <XCircle size={20} color="#EF4444" />
                    ) : (
                        <MapPin size={20} color="#3B82F6" />
                    )}
                    <Text style={{ marginLeft: 12, fontSize: 14, fontWeight: '500', color: '#1F2937', flex: 1 }}>
                        {toast.message}
                    </Text>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View className="mt-8 mb-4">
                        <Typography variant="h1" className="text-3xl mb-2">
                            Add New Address
                        </Typography>
                        <Typography variant="body" color="muted">
                            Add a delivery address
                        </Typography>
                    </View>

                    {/* GPS Location Button */}
                    <TouchableOpacity
                        onPress={fetchCurrentLocation}
                        disabled={locationLoading}
                        style={{
                            backgroundColor: '#F0F9FF',
                            borderRadius: 12,
                            padding: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: '#BAE6FD',
                            borderStyle: 'dashed',
                        }}
                    >
                        {locationLoading ? (
                            <ActivityIndicator size="small" color="#0284C7" />
                        ) : (
                            <Navigation size={24} color="#0284C7" />
                        )}
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#0284C7' }}>
                                {locationLoading ? 'Fetching Location...' : 'Use Current Location'}
                            </Text>
                            <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                                Auto-fill address using GPS
                            </Text>
                        </View>
                        <MapPin size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    {/* Address Type */}
                    <View className="mb-4">
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 8, letterSpacing: 0.5 }}>
                            ADDRESS TYPE
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            {(['home', 'work', 'other'] as const).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setFormData({ ...formData, addressType: type })}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        paddingHorizontal: 16,
                                        borderRadius: 10,
                                        borderWidth: 2,
                                        borderColor: formData.addressType === type ? '#000' : '#E5E7EB',
                                        backgroundColor: formData.addressType === type ? '#F9FAFB' : '#fff',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{
                                        fontWeight: '600',
                                        color: formData.addressType === type ? '#000' : '#6B7280',
                                        textTransform: 'capitalize'
                                    }}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Contact Details */}
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 12, marginTop: 8, letterSpacing: 0.5 }}>
                        CONTACT DETAILS
                    </Text>

                    <View className="mb-4">
                        <Input
                            label="Full Name *"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                            autoCapitalize="words"
                        />
                    </View>

                    <View className="mb-4">
                        <Input
                            label="Phone Number *"
                            placeholder="10-digit mobile number"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text.replace(/[^0-9]/g, '') })}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>

                    {/* Address Details */}
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 12, marginTop: 8, letterSpacing: 0.5 }}>
                        ADDRESS DETAILS
                    </Text>

                    <View className="mb-4">
                        <Input
                            label="House / Flat / Building *"
                            placeholder="House No, Building Name"
                            value={formData.addressLine1}
                            onChangeText={(text) => setFormData({ ...formData, addressLine1: text })}
                        />
                    </View>

                    <View className="mb-4">
                        <Input
                            label="Road / Area / Colony"
                            placeholder="Road name, Area, Colony (Optional)"
                            value={formData.addressLine2}
                            onChangeText={(text) => setFormData({ ...formData, addressLine2: text })}
                        />
                    </View>

                    <View className="mb-4">
                        <Input
                            label="Landmark"
                            placeholder="Nearby landmark (Optional)"
                            value={formData.landmark}
                            onChangeText={(text) => setFormData({ ...formData, landmark: text })}
                        />
                    </View>

                    <View className="flex-row gap-3 mb-4">
                        <View className="flex-1">
                            <Input
                                label="City *"
                                placeholder="City"
                                value={formData.city}
                                onChangeText={(text) => setFormData({ ...formData, city: text })}
                                autoCapitalize="words"
                            />
                        </View>
                        <View className="flex-1">
                            <Input
                                label="State *"
                                placeholder="State"
                                value={formData.state}
                                onChangeText={(text) => setFormData({ ...formData, state: text })}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Input
                            label="Pincode *"
                            placeholder="6-digit PIN code"
                            value={formData.pincode}
                            onChangeText={(text) => setFormData({ ...formData, pincode: text.replace(/[^0-9]/g, '') })}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        style={{
                            backgroundColor: '#000',
                            borderRadius: 30,
                            paddingVertical: 18,
                            paddingHorizontal: 32,
                            alignItems: 'center',
                            marginBottom: 16,
                            opacity: loading ? 0.5 : 1,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                            {loading ? 'Saving...' : 'Save Address'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 30,
                            paddingVertical: 16,
                            paddingHorizontal: 32,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#ddd',
                            marginBottom: 32,
                        }}
                    >
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: '700' }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
}
