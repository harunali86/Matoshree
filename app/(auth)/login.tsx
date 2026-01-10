import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet, ImageBackground, TextInput, ActivityIndicator, Text, Dimensions } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as 'success' | 'error' });

    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: '', type: 'error' }), 3000);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showToast('Please enter email and password', 'error');
            return;
        }

        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);

        if (error) {
            showToast(error.message, 'error');
        } else {
            router.replace('/(tabs)');
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: Platform.OS === 'web' ? window.location.origin : 'matoshree://',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account consent', // Force account selection + consent
                    },
                    scopes: 'openid email profile', // Request profile info
                }
            });
            if (error) {
                showToast(error.message, 'error');
            }
        } catch (e: any) {
            showToast(e.message, 'error');
        }
        setGoogleLoading(false);
    };

    return (
        <View style={styles.container}>
            {/* Split Layout */}
            <View style={styles.leftPanel}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80' }}
                    style={styles.heroImage}
                    resizeMode="cover"
                >
                    <View style={styles.heroOverlay}>
                        <View style={styles.heroContent}>
                            <Text style={styles.heroTag}>NEW COLLECTION</Text>
                            <Text style={styles.heroTitle}>STEP INTO{'\n'}STYLE</Text>
                            <Text style={styles.heroSubtitle}>Premium footwear for the modern lifestyle</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.rightPanel}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.formContainer}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Brand */}
                        <View style={styles.brandSection}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoText}>M</Text>
                            </View>
                            <Text style={styles.brandName}>MATOSHREE</Text>
                        </View>

                        {/* Welcome */}
                        <Text style={styles.welcomeTitle}>Welcome Back</Text>
                        <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>

                        {/* Email */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#aaa"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>PASSWORD</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#aaa"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        {/* Forgot */}
                        <TouchableOpacity style={styles.forgotRow}>
                            <Text style={styles.forgotText}>Forgot your password?</Text>
                        </TouchableOpacity>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.primaryBtn, loading && styles.btnDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.primaryBtnText}>SIGN IN</Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google */}
                        <TouchableOpacity
                            style={styles.googleBtn}
                            onPress={handleGoogleSignIn}
                            disabled={googleLoading}
                        >
                            <View style={styles.googleIconBox}>
                                <Text style={styles.googleIcon}>G</Text>
                            </View>
                            <Text style={styles.googleBtnText}>
                                {googleLoading ? 'Connecting...' : 'Google'}
                            </Text>
                        </TouchableOpacity>

                        {/* Sign Up */}
                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <Link href="/(auth)/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.signupLink}>Create one</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                        {/* Guest */}
                        <TouchableOpacity
                            style={styles.guestBtn}
                            onPress={() => router.replace('/(tabs)')}
                        >
                            <Text style={styles.guestText}>Continue as Guest →</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0a0a0a',
    },
    leftPanel: {
        flex: 1,
        display: Platform.OS === 'web' && width > 768 ? 'flex' : 'none',
    },
    heroImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        padding: 48,
    },
    heroContent: {},
    heroTag: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 3,
        marginBottom: 12,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 48,
        fontWeight: '900',
        lineHeight: 52,
        marginBottom: 16,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
    },
    rightPanel: {
        flex: 1,
        backgroundColor: '#fff',
        minWidth: 360,
    },
    formContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 40,
    },
    brandSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logoText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
    },
    brandName: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 2,
        color: '#000',
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 32,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#888',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#000',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    forgotRow: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    primaryBtn: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 1,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    dividerText: {
        color: '#999',
        fontSize: 12,
        marginHorizontal: 16,
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 32,
    },
    googleIconBox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    googleIcon: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4285F4',
    },
    googleBtnText: {
        color: '#333',
        fontSize: 15,
        fontWeight: '600',
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    signupText: {
        fontSize: 14,
        color: '#666',
    },
    signupLink: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
    },
    guestBtn: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    guestText: {
        color: '#999',
        fontSize: 14,
    },
});
