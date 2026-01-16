import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { FileText, Clock, ArrowLeft, FileDigit } from 'lucide-react-native';
import { router } from 'expo-router';

export default function QuotationsScreen() {
    const { user } = useAuthStore();
    const [quotations, setQuotations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchQuotations();
    }, [user]);

    const fetchQuotations = async () => {
        const { data, error } = await supabase
            .from('quotations')
            .select('*')
            .eq('customer_id', user?.id)
            .order('created_at', { ascending: false });

        if (data) setQuotations(data);
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return '#4ade80';
            case 'pending': return '#fbbf24';
            case 'rejected': return '#f87171';
            default: return '#94a3b8';
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.quoteCard}>
            <View style={styles.quoteHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>

            <View style={styles.quoteBody}>
                <View style={styles.iconContainer}>
                    <FileText size={24} color="#6366f1" />
                </View>
                <View style={styles.details}>
                    <Text style={styles.quoteId}>Quote #{item.id.slice(0, 8)}</Text>
                    <Text style={styles.itemCount}>{item.items?.length || 0} items included</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalLabel}>Total Value</Text>
                    <Text style={styles.totalPrice}>₹{item.total_amount.toLocaleString()}</Text>
                </View>
            </View>

            {item.valid_until && (
                <View style={styles.validityContainer}>
                    <Clock size={14} color="#64748b" />
                    <Text style={styles.validityText}>Valid until: {new Date(item.valid_until).toLocaleDateString()}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Quotations</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : quotations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FileDigit size={80} color="#1e293b" />
                    <Text style={styles.emptyTitle}>No Quotations Yet</Text>
                    <Text style={styles.emptySubtitle}>Custom price quotes requested by you or sent by our admin will appear here.</Text>
                </View>
            ) : (
                <FlatList
                    data={quotations}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    listContent: {
        padding: 20,
    },
    quoteCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderBottomColor: '#334155',
    },
    quoteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
    },
    dateText: {
        fontSize: 12,
        color: '#64748b',
    },
    quoteBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    details: {
        flex: 1,
    },
    quoteId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 2,
    },
    itemCount: {
        fontSize: 12,
        color: '#94a3b8',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 10,
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4ade80',
    },
    validityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    validityText: {
        fontSize: 11,
        color: '#64748b',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
    },
});
