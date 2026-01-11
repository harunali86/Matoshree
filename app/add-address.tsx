import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, MapPin, Navigation, Check } from 'lucide-react-native';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export default function AddAddress() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine, setAddressLine] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const detectLocation = async () => {
        setDetectingLocation(true);
        try {
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please enable location access in settings');
                return;
            }

            // Get current location with high accuracy
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            // Reverse geocode to get address
            const [address] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (address) {
                // Auto-fill form fields
                setAddressLine(
                    [address.streetNumber, address.street, address.district]
                        .filter(Boolean)
                        .join(', ') || ''
                );
                setCity(address.city || address.subregion || '');
                setState(address.region || '');
                setPincode(address.postalCode || '');

                Alert.alert('Location Detected!', 'Address fields have been auto-filled. Please verify and add more details.');
            }
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to detect location');
        } finally {
            setDetectingLocation(false);
        }
    };

    const saveAddress = async () => {
        // Validation
        if (!name || !phone || !addressLine || !city || !state || !pincode) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (phone.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        // Need user to be logged in to save address
        if (!user?.id) {
            Alert.alert('Login Required', 'Please login to save addresses', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => router.push('/(auth)/login') }
            ]);
            return;
        }

        setLoading(true);
        try {
            // If setting as default, unset other defaults first
            if (isDefault && user?.id) {
                await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
            }

            const { error } = await supabase.from('addresses').insert({
                user_id: user.id,
                full_name: name,
                phone,
                address_line1: addressLine,
                address_line2: landmark || null,
                city,
                state,
                pincode,
                is_default: isDefault,
            });

            if (error) throw error;

            Alert.alert('Success', 'Address saved successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Add New Address</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

                    {/* Detect Location Button */}
                    <TouchableOpacity
                        onPress={detectLocation}
                        disabled={detectingLocation}
                        style={{
                            backgroundColor: '#e3f2fd',
                            padding: 16,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 25,
                            borderWidth: 1,
                            borderColor: '#2196f3',
                            opacity: detectingLocation ? 0.7 : 1
                        }}
                    >
                        {detectingLocation ? (
                            <ActivityIndicator color="#2196f3" />
                        ) : (
                            <Navigation size={24} color="#2196f3" />
                        )}
                        <View style={{ marginLeft: 15, flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', color: '#1976d2' }}>Use Current Location</Text>
                            <Text style={{ color: '#64b5f6', fontSize: 12, marginTop: 2 }}>Auto-detect & fill address</Text>
                        </View>
                        <MapPin size={20} color="#2196f3" />
                    </TouchableOpacity>

                    {/* Form Fields */}
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 15, letterSpacing: 1 }}>PERSONAL DETAILS</Text>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Full Name *</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter full name"
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16 }}
                        />
                    </View>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Phone Number *</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="10-digit mobile number"
                            keyboardType="phone-pad"
                            maxLength={10}
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16 }}
                        />
                    </View>

                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 15, marginTop: 10, letterSpacing: 1 }}>ADDRESS DETAILS</Text>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Address Line *</Text>
                        <TextInput
                            value={addressLine}
                            onChangeText={setAddressLine}
                            placeholder="House/Flat No., Building, Street"
                            multiline
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, minHeight: 80, textAlignVertical: 'top' }}
                        />
                    </View>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Landmark (Optional)</Text>
                        <TextInput
                            value={landmark}
                            onChangeText={setLandmark}
                            placeholder="Near hospital, school, etc."
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16 }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>City *</Text>
                            <TextInput
                                value={city}
                                onChangeText={setCity}
                                placeholder="City"
                                style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16 }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Pincode *</Text>
                            <TextInput
                                value={pincode}
                                onChangeText={setPincode}
                                placeholder="6-digit"
                                keyboardType="numeric"
                                maxLength={6}
                                style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16 }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>State *</Text>
                        <TextInput
                            value={state}
                            onChangeText={setState}
                            placeholder="State"
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16 }}
                        />
                    </View>

                    {/* Set as Default */}
                    <TouchableOpacity
                        onPress={() => setIsDefault(!isDefault)}
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}
                    >
                        <View style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            borderWidth: 2,
                            borderColor: isDefault ? 'black' : '#ccc',
                            backgroundColor: isDefault ? 'black' : 'white',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {isDefault && <Check size={14} color="white" />}
                        </View>
                        <Text style={{ marginLeft: 12, fontSize: 15 }}>Set as default address</Text>
                    </TouchableOpacity>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={saveAddress}
                        disabled={loading}
                        style={{
                            backgroundColor: 'black',
                            height: 56,
                            borderRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>SAVE ADDRESS</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 50 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
