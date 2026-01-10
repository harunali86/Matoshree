import React, { useState } from 'react';
import { View, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Star } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { Toast } from '../ui/Toast';

interface ReviewFormProps {
    productId: string;
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, visible, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
        visible: false, message: '', type: 'success'
    });

    const handleSubmit = async () => {
        if (rating === 0) {
            setShowToast({ visible: true, message: 'Please select a rating', type: 'error' });
            return;
        }
        if (!comment.trim()) {
            setShowToast({ visible: true, message: 'Please write a comment', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('reviews').insert({
                product_id: productId,
                user_id: user?.id,
                user_name: user?.user_metadata?.full_name || 'Anonymous',
                rating,
                title,
                comment,
                is_approved: false // Default to false
            });

            if (error) throw error;

            setShowToast({ visible: true, message: 'Review submitted for approval!', type: 'success' });
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);

        } catch (error: any) {
            setShowToast({ visible: true, message: error.message || 'Failed to submit review', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <Toast
                visible={showToast.visible}
                message={showToast.message}
                type={showToast.type}
                onDismiss={() => setShowToast(prev => ({ ...prev, visible: false }))}
            />
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Typography variant="h3">Write a Review</Typography>
                        <TouchableOpacity onPress={onClose}>
                            <Typography variant="body" color="muted">Close</Typography>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Star
                                    size={32}
                                    color={star <= rating ? "#FFD700" : "#E5E7EB"}
                                    fill={star <= rating ? "#FFD700" : "none"}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        placeholder="Review Title (Optional)"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Write your review here..."
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={4}
                        style={[styles.input, styles.textArea]}
                    />

                    <Button
                        title="Submit Review"
                        onPress={handleSubmit}
                        isLoading={loading}
                        variant="primary"
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 400,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#F9FAFB',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});
