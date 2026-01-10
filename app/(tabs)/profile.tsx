import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal, Text, StyleSheet, Platform } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { useRouter } from 'expo-router';
import { ChevronRight, Package, MapPin, Heart, LogOut, User, HelpCircle, X } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';

const MenuItem = ({ icon: Icon, title, onPress, isDestructive = false }: any) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center py-5 border-b border-gray-100"
    >
        <Icon size={20} color={isDestructive ? "#EF4444" : "#000"} />
        <Typography
            variant="body"
            className={`flex-1 ml-4 font-medium ${isDestructive ? 'text-red-500' : 'text-black'}`}
        >
            {title}
        </Typography>
        <ChevronRight size={16} color="#ccc" />
    </TouchableOpacity>
);

// Inbuilt Confirmation Modal
interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({
    visible, title, message, confirmText = 'Confirm', cancelText = 'Cancel',
    isDestructive = false, onConfirm, onCancel
}: ConfirmModalProps) => (
    <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{title}</Text>
                <Text style={styles.modalMessage}>{message}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                        <Text style={styles.cancelBtnText}>{cancelText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onConfirm}
                        style={[styles.confirmBtn, isDestructive && styles.destructiveBtn]}
                    >
                        <Text style={[styles.confirmBtnText, isDestructive && styles.destructiveText]}>
                            {confirmText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut, isAuthenticated } = useAuth();
    const [logoutModal, setLogoutModal] = useState(false);
    const [signInModal, setSignInModal] = useState({ visible: false, actionName: '', route: '' });

    const handleProtectedAction = (route: string, actionName: string) => {
        if (!isAuthenticated) {
            setSignInModal({ visible: true, actionName, route });
        } else {
            router.push(route as any);
        }
    };

    const handleLogout = async () => {
        if (!isAuthenticated) {
            router.push('/(auth)/login');
            return;
        }
        setLogoutModal(true);
    };

    const confirmLogout = async () => {
        setLogoutModal(false);
        await signOut();
        // Force page reload on web to clear all state
        if (Platform.OS === 'web') {
            window.location.href = '/';
        } else {
            router.replace('/(tabs)');
        }
    };

    const confirmSignIn = () => {
        setSignInModal({ visible: false, actionName: '', route: '' });
        router.push('/(auth)/login');
    };

    return (
        <Container safeArea className="bg-white">
            {/* Logout Confirmation Modal */}
            <ConfirmModal
                visible={logoutModal}
                title="Logout"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                isDestructive
                onConfirm={confirmLogout}
                onCancel={() => setLogoutModal(false)}
            />

            {/* Sign In Required Modal */}
            <ConfirmModal
                visible={signInModal.visible}
                title="Sign In Required"
                message={`Please sign in to view ${signInModal.actionName}`}
                confirmText="Sign In"
                cancelText="Cancel"
                onConfirm={confirmSignIn}
                onCancel={() => setSignInModal({ visible: false, actionName: '', route: '' })}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
                <Typography variant="h1" className="mb-1">ACCOUNT</Typography>

                {/* User Info */}
                <View className="mb-10 mt-2">
                    {isAuthenticated ? (
                        <>
                            <Typography variant="body" color="muted">Logged in as</Typography>
                            <Typography variant="h3" className="mt-1">{user?.email}</Typography>
                            {user?.user_metadata?.full_name && (
                                <Typography variant="body" className="mt-1">{user.user_metadata.full_name}</Typography>
                            )}
                        </>
                    ) : (
                        <>
                            <Typography variant="h3" className="mt-1">Guest User</Typography>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="mt-3">
                                <View className="bg-black rounded-full py-3 px-6 self-start">
                                    <Typography variant="body" className="text-white font-semibold">Sign In</Typography>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Menu Items */}
                <MenuItem
                    icon={User}
                    title="Edit Profile"
                    onPress={() => handleProtectedAction('/edit-profile', 'profile')}
                />

                <MenuItem
                    icon={MapPin}
                    title="My Addresses"
                    onPress={() => handleProtectedAction('/addresses', 'addresses')}
                />

                <MenuItem
                    icon={Package}
                    title="My Orders"
                    onPress={() => handleProtectedAction('/orders', 'orders')}
                />

                <MenuItem
                    icon={Heart}
                    title="Wishlist"
                    onPress={() => router.push('/wishlist')}
                />

                <MenuItem
                    icon={HelpCircle}
                    title="Help & Support"
                    onPress={() => router.push('/help')}
                />

                {isAuthenticated && (
                    <MenuItem
                        icon={LogOut}
                        title="Logout"
                        onPress={handleLogout}
                        isDestructive
                    />
                )}
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 340,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 15,
        color: '#666',
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    confirmBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    destructiveBtn: {
        backgroundColor: '#EF4444',
    },
    destructiveText: {
        color: '#fff',
    },
});
