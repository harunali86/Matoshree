import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Typography } from '../ui/Typography';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

import { useWishlistStore } from '../../store/wishlistStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with spacing

export const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
    const router = useRouter();
    const { isInWishlist, toggleItem } = useWishlistStore();
    const inWishlist = isInWishlist(id);

    const handleWishlistToggle = (e: any) => {
        e.stopPropagation(); // Prevent navigation
        toggleItem({ id, name, price, image, category });
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(100).duration(600).springify()}
            className="mb-8"
            style={{ width: CARD_WIDTH }}
        >
            <TouchableOpacity
                onPress={() => router.push(`/product/${id}`)}
                activeOpacity={0.9}
            >
                <View className="aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden mb-3 relative">
                    <Image
                        source={{ uri: image }}
                        className="w-full h-full"
                        resizeMode="cover"
                        defaultSource={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000' }}
                    />
                    {/* Wishlist Button Overlay */}
                    <TouchableOpacity
                        onPress={handleWishlistToggle}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm shadow-sm"
                        activeOpacity={0.7}
                    >
                        <Heart
                            size={16}
                            color="black"
                            fill={inWishlist ? 'black' : 'none'}
                        />
                    </TouchableOpacity>
                </View>
                <View className="px-1">
                    <Typography variant="body" className="font-bold mb-1 leading-tight text-sm uppercase">{name}</Typography>
                    <Typography variant="caption" color="muted" className="mb-1 text-xs">{category}</Typography>
                    <Typography variant="body" className="font-medium">₹{price.toLocaleString()}</Typography>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};
