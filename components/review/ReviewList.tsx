import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Typography } from '../ui/Typography';
import { supabase } from '../../lib/supabase';
import { Star, User } from 'lucide-react-native';

interface Review {
    id: string;
    user_name: string;
    rating: number;
    title?: string;
    comment: string;
    created_at: string;
}

interface ReviewListProps {
    productId: string;
    refreshTrigger?: number; // Prop to foster re-fetch
}

export const ReviewList: React.FC<ReviewListProps> = ({ productId, refreshTrigger }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .eq('is_approved', true) // Only approved reviews
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId, refreshTrigger]);

    if (loading) return <ActivityIndicator size="small" color="#000" />;

    if (reviews.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Typography variant="body" color="muted">No reviews yet. Be the first to review!</Typography>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Review }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <User size={16} color="#666" />
                    </View>
                    <Typography variant="body" className="font-bold ml-2">{item.user_name || 'Anonymous'}</Typography>
                </View>
                <Typography variant="caption" color="muted">
                    {new Date(item.created_at).toLocaleDateString()}
                </Typography>
            </View>

            <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        color={star <= item.rating ? "#FFD700" : "#E5E7EB"}
                        fill={star <= item.rating ? "#FFD700" : "none"}
                    />
                ))}
            </View>

            {item.title && <Typography variant="h3" className="text-base mb-1">{item.title}</Typography>}
            <Typography variant="body" className="text-gray-600 leading-5">{item.comment}</Typography>
        </View>
    );

    return (
        <View style={styles.container}>
            {reviews.map(item => (
                <View key={item.id}>
                    {renderItem({ item })}
                    <View style={styles.separator} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    reviewItem: {
        marginBottom: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 2,
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    }
});
