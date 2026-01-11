import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function Signup() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async () => {
        if (!fullName || !email || !password) {
            setError('Please fill all required fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                    }
                }
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            if (authData.user) {
                // Update auth store
                useAuthStore.setState({
                    user: {
                        id: authData.user.id,
                        email: authData.user.email || '',
                        full_name: fullName
                    },
                    isAuthenticated: true,
                    isLoading: false
                });

                if (authData.session) {
                    // No email confirmation - direct login
                    Alert.alert('Success!', 'Account created!', [
                        { text: 'OK', onPress: () => router.replace('/(tabs)') }
                    ]);
                } else {
                    // Email confirmation required
                    Alert.alert(
                        'Check Email',
                        'Please verify your email, then log in.',
                        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
                    );
                }
            }
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 25, paddingTop: 40 }}>
                    <View style={{ alignItems: 'center', marginBottom: 30 }}>
                        <Text style={{ fontSize: 28, fontWeight: '900', letterSpacing: 3 }}>MATOSHREE</Text>
                    </View>

                    <Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 10 }}>Create Account</Text>
                    <Text style={{ color: '#666', fontSize: 15, marginBottom: 30 }}>Join us for exclusive offers</Text>

                    {error ? (
                        <View style={{ backgroundColor: '#ffebee', padding: 12, borderRadius: 8, marginBottom: 20 }}>
                            <Text style={{ color: '#c62828', textAlign: 'center' }}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={{ marginBottom: 18 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Full Name *</Text>
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' }}
                        />
                    </View>

                    <View style={{ marginBottom: 18 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Email *</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' }}
                        />
                    </View>

                    <View style={{ marginBottom: 18 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Phone</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' }}
                        />
                    </View>

                    <View style={{ marginBottom: 18 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Password *</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Min 6 characters"
                            secureTextEntry
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' }}
                        />
                    </View>

                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Confirm Password *</Text>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm password"
                            secureTextEntry
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSignup}
                        disabled={loading}
                        style={{
                            backgroundColor: 'black',
                            height: 56,
                            borderRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? <ActivityIndicator color="white" /> : (
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>CREATE ACCOUNT</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={{ alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>
                            Already have an account? <Text style={{ color: 'black', fontWeight: 'bold' }}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>

                    <View style={{ height: 50 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
