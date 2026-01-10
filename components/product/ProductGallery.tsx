import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Typography } from '../ui/Typography';

const { width } = Dimensions.get('window');

interface ProductGalleryProps {
    images: any[]; // Changed to any[] for local requires
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    // Fallback image
    const fallbackImage = 'https://via.placeholder.com/600x600/EEEEEE/333333?text=Product+Image';

    const currentImage = images[selectedIndex];
    const imageSource = typeof currentImage === 'string'
        ? { uri: imageError ? fallbackImage : currentImage }
        : currentImage;

    return (
        <View className="mb-6">
            {/* Main Image */}
            <View className="w-full aspect-square bg-gray-100 mb-4">
                <Image
                    source={imageSource}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />
            </View>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-4"
                    contentContainerStyle={{ gap: 12 }}
                >
                    {images.map((img, index) => {
                        const thumbSource = typeof img === 'string' ? { uri: img } : img;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelectedIndex(index);
                                    setImageError(false);
                                }}
                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedIndex === index ? 'border-black' : 'border-gray-300'
                                    }`}
                            >
                                <Image
                                    source={thumbSource}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                    onError={(e) => console.log('Thumb error:', img)}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            )}
        </View>
    );
};
