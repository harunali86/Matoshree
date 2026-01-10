import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Typography } from '../ui/Typography';
import { CATEGORIES } from '../../data/mock';
import { useRouter } from 'expo-router';

export const CategoryRail = () => {
    const router = useRouter();

    const handleCategoryPress = (categoryName: string) => {
        // Navigate to shop tab with category pre-selected
        router.push({
            pathname: '/(tabs)/shop',
            params: { category: categoryName.toLowerCase() }
        });
    };

    return (
        <View className="mt-8 mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {CATEGORIES.map((cat, index) => {
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => handleCategoryPress(cat.name)}
                            className={`mr-4 px-6 py-3 rounded-full border ${index === 0 ? 'bg-black border-black' : 'bg-transparent border-gray-300'}`}
                        >
                            <Typography
                                variant="body"
                                className={`font-medium ${index === 0 ? 'text-white' : 'text-black'}`}
                            >
                                {cat.name}
                            </Typography>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};
