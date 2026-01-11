import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, MapPin, Plus, Trash2, Check } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface Address {
    id: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
}

export default function Addresses() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchAddresses();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const fetchAddresses = async () => {
        const { data } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user?.id)
            .order('is_default', { ascending: false });

        if (data) setAddresses(data);
        setLoading(false);
    };

    const deleteAddress = async (id: string) => {
        Alert.alert('Delete Address', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await supabase.from('addresses').delete().eq('id', id);
                    fetchAddresses();
                }
            }
        ]);
    };

    const setDefault = async (id: string) => {
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', user?.id);
        await supabase.from('addresses').update({ is_default: true }).eq('id', id);
        fetchAddresses();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15, flex: 1 }}>Saved Addresses</Text>
                <TouchableOpacity onPress={() => router.push('/add-address' as any)}>
                    <Plus size={24} color="black" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="black" />
                </View>
            ) : addresses.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                    <MapPin size={60} color="#ddd" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>No Addresses Saved</Text>
                    <Text style={{ color: '#999', marginTop: 10, textAlign: 'center' }}>Add an address for faster checkout</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/add-address' as any)}
                        style={{ marginTop: 30, backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>ADD ADDRESS</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => (
                        <View style={{
                            backgroundColor: item.is_default ? '#f8fff8' : '#f9f9f9',
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 15,
                            borderWidth: item.is_default ? 2 : 0,
                            borderColor: '#34c759'
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.full_name}</Text>
                                {item.is_default && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Check size={14} color="#34c759" />
                                        <Text style={{ color: '#34c759', fontWeight: '600', marginLeft: 4, fontSize: 12 }}>Default</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={{ color: '#666' }}>{item.phone}</Text>
                            <Text style={{ color: '#666', marginTop: 5 }}>{item.address_line1}</Text>
                            {item.address_line2 && <Text style={{ color: '#666' }}>{item.address_line2}</Text>}
                            <Text style={{ color: '#666' }}>{item.city}, {item.state} - {item.pincode}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 15, gap: 10 }}>
                                {!item.is_default && (
                                    <TouchableOpacity
                                        onPress={() => setDefault(item.id)}
                                        style={{ backgroundColor: '#f0f0f0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 }}
                                    >
                                        <Text style={{ fontWeight: '600' }}>Set as Default</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => deleteAddress(item.id)}>
                                    <Trash2 size={20} color="#ff3b30" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}
