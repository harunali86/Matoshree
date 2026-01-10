import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Typography } from '../ui/Typography';
import { SIZES } from '../../data/mock';

export const ShopBySize = () => {
    return (
        <View className="mt-8 mb-8">
            <View className="flex-row justify-between items-center px-6 mb-4">
                <Typography variant="h3">Shop by Size</Typography>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {SIZES.map((size) => (
                    <TouchableOpacity
                        key={size}
                        className="mr-3 w-16 h-16 bg-white border border-gray-200 rounded-full items-center justify-center active:bg-black active:border-black"
                    >
                        <Typography variant="body" className="font-medium">{size.replace('UK ', '')}</Typography>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
