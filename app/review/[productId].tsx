import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '../../components/Themed';
import { ArrowLeft, Star, Camera, X } from 'lucide-react-native';
import { useState } from 'react';

export default function WriteReviewScreen() {
    const router = useRouter();
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        alert('Review submitted successfully! (Demo)');
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black">Write a Review</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Rating */}
                <View className="bg-white p-4 mb-2">
                    <Text className="text-black font-bold mb-3">Rate this product</Text>
                    <View className="flex-row justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                className="p-2"
                            >
                                <Star
                                    size={36}
                                    color={star <= rating ? '#FFB800' : '#E0E0E0'}
                                    fill={star <= rating ? '#FFB800' : 'transparent'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text className="text-center text-gray-500 mt-2">
                        {rating === 0 ? 'Tap to rate' :
                            rating === 1 ? 'Poor' :
                                rating === 2 ? 'Fair' :
                                    rating === 3 ? 'Good' :
                                        rating === 4 ? 'Very Good' : 'Excellent!'}
                    </Text>
                </View>

                {/* Review Title */}
                <View className="bg-white p-4 mb-2">
                    <Text className="text-black font-bold mb-2">Review Title</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Summarize your experience"
                        placeholderTextColor="#999"
                        className="bg-gray-50 rounded-lg px-4 py-3 text-black"
                    />
                </View>

                {/* Review Body */}
                <View className="bg-white p-4 mb-2">
                    <Text className="text-black font-bold mb-2">Your Review</Text>
                    <TextInput
                        value={review}
                        onChangeText={setReview}
                        placeholder="What did you like or dislike about this product?"
                        placeholderTextColor="#999"
                        className="bg-gray-50 rounded-lg px-4 py-3 text-black h-32"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Add Photos */}
                <View className="bg-white p-4 mb-2">
                    <Text className="text-black font-bold mb-3">Add Photos (Optional)</Text>
                    <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg py-8 items-center">
                        <Camera size={32} color="#999" />
                        <Text className="text-gray-500 mt-2">Tap to add photos</Text>
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <View className="p-4">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-[#FB641B] py-4 rounded-lg items-center"
                    >
                        <Text className="text-white font-bold text-lg">Submit Review</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
