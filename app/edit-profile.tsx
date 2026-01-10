import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle } from 'lucide-react-native';

// Inline toast state
interface ToastState {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'info' });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: '', type: 'info' }), 3000);
    };

    const handleSave = async () => {
        if (!fullName) {
            showToast('Please enter your name', 'error');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: fullName,
                phone: phone
            }
        });
        setLoading(false);

        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Profile updated successfully!', 'success');
            setTimeout(() => router.back(), 1500);
        }
    };

    return (
        <Container safeArea className="bg-white">
            {/* Inbuilt Toast */}
            {toast.visible && (
                <View style={[
                    styles.toast,
                    {
                        backgroundColor: toast.type === 'success' ? '#ECFDF5' : toast.type === 'error' ? '#FEF2F2' : '#EFF6FF',
                        borderColor: toast.type === 'success' ? '#A7F3D0' : toast.type === 'error' ? '#FECACA' : '#BFDBFE',
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
                    {/* Header */}
                    <View className="mt-12 mb-8">
                        <Typography variant="h1" className="text-3xl mb-2">
                            Edit Profile
                        </Typography>
                        <Typography variant="body" color="muted">
                            Update your personal information
                        </Typography>
                    </View>

                    {/* Form */}
                    <View className="mb-6">
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View className="mb-6">
                        <Input
                            label="Email"
                            placeholder="Email"
                            value={user?.email || ''}
                            editable={false}
                            className="bg-gray-100"
                        />
                        <Typography variant="caption" color="muted" className="mt-1">
                            Email cannot be changed
                        </Typography>
                    </View>

                    <View className="mb-6">
                        <Input
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        style={[styles.saveBtn, loading && { opacity: 0.5 }]}
                    >
                        <Text style={styles.saveBtnText}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.cancelBtn}
                    >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
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
    saveBtn: {
        backgroundColor: '#000',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        marginBottom: 16,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    cancelBtn: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
