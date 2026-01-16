import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Star, Camera, X, CheckCircle2 } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import * as ImagePicker from 'expo-image-picker';

export default function WriteReview() {
    const router = useRouter();
    const { orderId, productId } = useLocalSearchParams();
    const { user } = useAuthStore();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (data) setProduct(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        if (images.length >= 3) {
            Alert.alert('Limit Reached', 'You can only upload up to 3 images');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7
        });

        if (!result.canceled && result.assets[0]) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a star rating');
            return;
        }
        if (!reviewText.trim()) {
            Alert.alert('Error', 'Please write a review');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.from('reviews').insert({
                user_id: user?.id,
                product_id: productId,
                order_id: orderId,
                rating: rating,
                comment: reviewText.trim(),
                images: images.length > 0 ? images : null,
                is_verified: true, // Verified purchaser
                user_name: user?.full_name || user?.email?.split('@')[0] || 'Customer'
            });

            if (error) throw error;

            Alert.alert(
                'Review Submitted! 🎉',
                'Thank you for your feedback!',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="black" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Write Review</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

                {/* Product Info */}
                {product && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f8f8f8', borderRadius: 12, marginBottom: 24 }}>
                        <Image
                            source={{ uri: product.thumbnail }}
                            style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#e0e0e0' }}
                        />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={{ fontWeight: '600', fontSize: 15 }} numberOfLines={2}>{product.name}</Text>
                            <Text style={{ color: '#666', fontSize: 13, marginTop: 2 }}>₹{product.price}</Text>
                        </View>
                    </View>
                )}

                {/* Star Rating */}
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 16 }}>Your Rating</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            style={{ padding: 8 }}
                        >
                            <Star
                                size={40}
                                color={star <= rating ? '#fbbf24' : '#e0e0e0'}
                                fill={star <= rating ? '#fbbf24' : 'transparent'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                {rating > 0 && (
                    <Text style={{ textAlign: 'center', color: '#666', marginBottom: 24, marginTop: -16 }}>
                        {rating === 1 ? 'Poor 😞' :
                            rating === 2 ? 'Fair 😐' :
                                rating === 3 ? 'Good 🙂' :
                                    rating === 4 ? 'Very Good 😊' : 'Excellent! 🤩'}
                    </Text>
                )}

                {/* Review Text */}
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Your Review</Text>
                <TextInput
                    value={reviewText}
                    onChangeText={setReviewText}
                    placeholder="Share your experience with this product..."
                    multiline
                    numberOfLines={6}
                    style={{
                        backgroundColor: '#f5f5f5',
                        padding: 16,
                        borderRadius: 12,
                        fontSize: 15,
                        minHeight: 120,
                        textAlignVertical: 'top',
                        marginBottom: 24
                    }}
                />

                {/* Photo Upload */}
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Add Photos (Optional)</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 }}>
                    {images.map((uri, index) => (
                        <View key={index} style={{ position: 'relative' }}>
                            <Image
                                source={{ uri }}
                                style={{ width: 80, height: 80, borderRadius: 10 }}
                            />
                            <TouchableOpacity
                                onPress={() => removeImage(index)}
                                style={{
                                    position: 'absolute', top: -8, right: -8,
                                    width: 24, height: 24, borderRadius: 12,
                                    backgroundColor: '#d32f2f', justifyContent: 'center', alignItems: 'center'
                                }}
                            >
                                <X size={14} color="white" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < 3 && (
                        <TouchableOpacity
                            onPress={pickImage}
                            style={{
                                width: 80, height: 80, borderRadius: 10,
                                borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed',
                                justifyContent: 'center', alignItems: 'center'
                            }}
                        >
                            <Camera size={24} color="#999" />
                            <Text style={{ fontSize: 10, color: '#999', marginTop: 4 }}>Add Photo</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={{
                        backgroundColor: '#111',
                        height: 56,
                        borderRadius: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: submitting ? 0.7 : 1,
                        marginBottom: 40
                    }}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckCircle2 size={20} color="white" />
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>
                                Submit Review
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
