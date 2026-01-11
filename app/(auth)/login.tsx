import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Needed for web browser auth session
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const router = useRouter();
    const signIn = useAuthStore(s => s.signIn);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);
        setError('');

        const result = await signIn(email.trim().toLowerCase(), password);

        if (result.error) {
            setError(result.error);
        } else {
            router.replace('/(tabs)');
        }

        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            const redirectUrl = makeRedirectUri({
                scheme: 'matoshree',
                path: 'auth/callback'
            });

            console.log('Redirect URL:', redirectUrl);

            const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                }
            });

            if (oauthError) throw oauthError;

            if (data.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

                if (result.type === 'success' && result.url) {
                    // Parse the URL to get tokens
                    const url = result.url;
                    const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1] || '');
                    const access_token = params.get('access_token');
                    const refresh_token = params.get('refresh_token');

                    if (access_token) {
                        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token: refresh_token || '',
                        });

                        if (sessionError) throw sessionError;

                        if (sessionData.user) {
                            useAuthStore.setState({
                                user: {
                                    id: sessionData.user.id,
                                    email: sessionData.user.email || '',
                                    full_name: sessionData.user.user_metadata?.full_name || sessionData.user.user_metadata?.name
                                },
                                isAuthenticated: true,
                                isLoading: false
                            });
                            router.replace('/(tabs)');
                        }
                    } else {
                        // Check if there's a session anyway
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session) {
                            useAuthStore.setState({
                                user: {
                                    id: session.user.id,
                                    email: session.user.email || '',
                                    full_name: session.user.user_metadata?.full_name
                                },
                                isAuthenticated: true,
                                isLoading: false
                            });
                            router.replace('/(tabs)');
                        }
                    }
                }
            }
        } catch (e: any) {
            console.error('Google Sign-In Error:', e);
            setError(e.message || 'Google Sign-In failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={{ flex: 1, padding: 25, justifyContent: 'center' }}>

                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Text style={{ fontSize: 32, fontWeight: '900', letterSpacing: 3 }}>MATOSHREE</Text>
                        <Text style={{ color: '#999', letterSpacing: 2, marginTop: 5 }}>FOOTWEAR</Text>
                    </View>

                    <Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 10 }}>Welcome Back</Text>
                    <Text style={{ color: '#666', fontSize: 15, marginBottom: 30 }}>Sign in to your account</Text>

                    {error ? (
                        <View style={{ backgroundColor: '#ffebee', padding: 12, borderRadius: 8, marginBottom: 20 }}>
                            <Text style={{ color: '#c62828', textAlign: 'center' }}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' }}
                        />
                    </View>

                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        style={{
                            backgroundColor: 'black',
                            height: 56,
                            borderRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 15,
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? <ActivityIndicator color="white" /> : (
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>SIGN IN</Text>
                        )}
                    </TouchableOpacity>

                    {/* Google Sign-In Button */}
                    <TouchableOpacity
                        onPress={handleGoogleSignIn}
                        disabled={loading}
                        style={{
                            backgroundColor: 'white',
                            height: 56,
                            borderRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                            borderWidth: 1.5,
                            borderColor: '#ddd',
                            flexDirection: 'row',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <Text style={{ fontSize: 20, marginRight: 10, fontWeight: 'bold', color: '#4285F4' }}>G</Text>
                        <Text style={{ color: '#333', fontWeight: '600', fontSize: 15 }}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={{ alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ color: '#666' }}>
                            Don't have an account? <Text style={{ color: 'black', fontWeight: 'bold' }}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ color: '#999', fontSize: 14 }}>Skip for now</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
