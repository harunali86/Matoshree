import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Plus, MapPin, Edit, Trash2, CheckCircle } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Address {
    id: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    address_type?: string;
    is_default: boolean;
}

export default function AddressesScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ visible: false, addressId: '' });

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user?.id)
            .order('is_default', { ascending: false });

        if (data) {
            setAddresses(data);
        }
        setLoading(false);
    };

    const handleSetDefault = async (addressId: string) => {
        // Unset all defaults first
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user?.id);

        // Set new default
        const { error } = await supabase
            .from('addresses')
            .update({ is_default: true })
            .eq('id', addressId);

        if (!error) {
            fetchAddresses();
        }
    };

    const confirmDelete = async () => {
        await supabase.from('addresses').delete().eq('id', deleteModal.addressId);
        setDeleteModal({ visible: false, addressId: '' });
        fetchAddresses();
    };

    if (loading) {
        return (
            <Container safeArea className="bg-white">
                <View className="flex-1 justify-center items-center">
                    <Typography variant="body">Loading addresses...</Typography>
                </View>
            </Container>
        );
    }

    return (
        <Container safeArea className="bg-white">
            {/* Delete Confirmation Modal */}
            <Modal visible={deleteModal.visible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Delete Address</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to delete this address?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setDeleteModal({ visible: false, addressId: '' })}
                                style={styles.cancelBtn}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
                                <Text style={styles.deleteBtnText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="mt-8 mb-6">
                    <Typography variant="h1" className="text-3xl mb-2">
                        My Addresses
                    </Typography>
                    <Typography variant="body" color="muted">
                        Manage your shipping addresses
                    </Typography>
                </View>

                {/* Add New Button - Compact Size */}
                <TouchableOpacity
                    onPress={() => router.push('/add-address')}
                    style={styles.addButton}
                >
                    <Plus size={18} color="#FFF" />
                    <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>

                {/* Addresses List */}
                {addresses.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-12">
                        <MapPin size={64} color="#D1D5DB" />
                        <Typography variant="h3" className="mt-4 mb-2">
                            No Addresses Yet
                        </Typography>
                        <Typography variant="body" color="muted" className="text-center">
                            Add an address to get started
                        </Typography>
                    </View>
                ) : (
                    addresses.map((address) => (
                        <View
                            key={address.id}
                            style={[
                                styles.addressCard,
                                address.is_default && styles.defaultCard
                            ]}
                        >
                            {/* Address Type & Default Badge */}
                            <View style={styles.cardHeader}>
                                {address.address_type && (
                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeText}>{address.address_type.toUpperCase()}</Text>
                                    </View>
                                )}
                                {address.is_default && (
                                    <View style={styles.defaultBadge}>
                                        <CheckCircle size={12} color="#10B981" />
                                        <Text style={styles.defaultText}>DEFAULT</Text>
                                    </View>
                                )}
                            </View>

                            {/* Address Details */}
                            <Text style={styles.addressName}>{address.full_name}</Text>
                            <Text style={styles.addressPhone}>{address.phone}</Text>
                            <Text style={styles.addressLine}>{address.address_line1}</Text>
                            {address.address_line2 && (
                                <Text style={styles.addressLine}>{address.address_line2}</Text>
                            )}
                            {address.landmark && (
                                <Text style={styles.landmark}>Near: {address.landmark}</Text>
                            )}
                            <Text style={styles.addressLine}>
                                {address.city}, {address.state} - {address.pincode}
                            </Text>

                            {/* Actions */}
                            <View style={styles.actions}>
                                {!address.is_default && (
                                    <TouchableOpacity
                                        onPress={() => handleSetDefault(address.id)}
                                        style={styles.setDefaultBtn}
                                    >
                                        <Text style={styles.setDefaultText}>Set as Default</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => setDeleteModal({ visible: true, addressId: address.id })}
                                    style={styles.deleteIconBtn}
                                >
                                    <Trash2 size={16} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}

                <View style={{ height: 32 }} />
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginBottom: 24,
        alignSelf: 'flex-start', // Compact - not full width
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    defaultCard: {
        borderColor: '#000',
        backgroundColor: '#FAFAFA',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    typeBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
    },
    defaultText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#10B981',
    },
    addressName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    addressPhone: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    addressLine: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    landmark: {
        fontSize: 13,
        color: '#9CA3AF',
        fontStyle: 'italic',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 12,
    },
    setDefaultBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
    },
    setDefaultText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },
    deleteIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Modal styles
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
        maxWidth: 320,
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
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    deleteBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#EF4444',
        alignItems: 'center',
    },
    deleteBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});
