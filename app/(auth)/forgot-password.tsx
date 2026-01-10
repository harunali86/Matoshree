import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react-native';

interface ToastState {
    visible: boolean;
    message: string;
    type: 'success' | 'error';
}

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'error' });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ visible: true, message, type });
        if (type === 'success') {
            setTimeout(() => {
                setToast({ visible: false, message: '', type: 'error' });
                router.back();
            }, 2000);
        } else {
            setTimeout(() => setToast({ visible: false, message: '', type: 'error' }), 3000);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            showToast('Please enter your email', 'error');
            return;
        }

        setLoading(true);
        const { error } = await resetPassword(email);
        setLoading(false);

        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Password reset link sent to your email!', 'success');
        }
    };

    return (
        <Container safeArea className="bg-white">
            {/* Inbuilt Toast */}
            {toast.visible && (
                <View style={[
                    styles.toast,
                    {
                        backgroundColor: toast.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                        borderColor: toast.type === 'success' ? '#A7F3D0' : '#FECACA',
                    }
                ]}>
                    {toast.type === 'success' ? (
                        <CheckCircle size={20} color="#10B981" />
                    ) : (
                        <XCircle size={20} color="#EF4444" />
                    )}
                    <Text style={styles.toastText}>{toast.message}</Text>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backBtn}
                    >
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="mt-4 mb-8">
                        <Typography variant="h1" className="text-3xl mb-2">
                            Forgot Password?
                        </Typography>
                        <Typography variant="body" color="muted">
                            Enter your email and we'll send you a reset link
                        </Typography>
                    </View>

                    {/* Email Input */}
                    <View className="mb-6">
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    {/* Reset Button */}
                    <TouchableOpacity
                        onPress={handleResetPassword}
                        disabled={loading}
                        style={[styles.submitBtn, loading && { opacity: 0.5 }]}
                    >
                        <Text style={styles.submitBtnText}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Text>
                    </TouchableOpacity>

                    {/* Back to Login */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backToLogin}
                    >
                        <Text style={styles.backToLoginText}>Back to Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        zIndex: 9999,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    toastText: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        flex: 1,
    },
    backBtn: {
        marginTop: 16,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtn: {
        backgroundColor: '#000',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    backToLogin: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    backToLoginText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
});
