import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Typography } from '../ui/Typography';
import { useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';

export const RecentlyViewed = () => {
    const router = useRouter();
    const { recentProducts } = useRecentlyViewed();

    if (recentProducts.length === 0) {
        return null;
    }

    return (
        <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4 px-6">
                <View className="flex-row items-center">
                    <Clock size={20} color="#000" />
                    <Typography variant="h2" className="ml-2 font-bold text-lg">
                        Recently Viewed
                    </Typography>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                className="gap-4"
            >
                {recentProducts.map((product) => (
                    <TouchableOpacity
                        key={product.id}
                        onPress={() => router.push(`/product/${product.id}`)}
                        className="w-32 mr-4"
                    >
                        <View className="bg-gray-100 rounded-lg mb-2 aspect-square">
                            <Image
                                source={{ uri: product.image }}
                                className="w-full h-full rounded-lg"
                                resizeMode="cover"
                            />
                        </View>
                        <Typography variant="body" className="font-medium mb-1" numberOfLines={2}>
                            {product.name}
                        </Typography>
                        <Typography variant="body" className="font-bold">
                            ₹{product.price.toLocaleString()}
                        </Typography>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
