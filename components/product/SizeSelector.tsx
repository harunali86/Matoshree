import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../ui/Typography';

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string;
    onSelect: (size: string) => void;
    outOfStockSizes?: string[];
}

export const SizeSelector = ({ sizes, selectedSize, onSelect, outOfStockSizes = [] }: SizeSelectorProps) => {
    if (!sizes || sizes.length === 0) return null;

    return (
        <View className="mb-6">
            <View className="flex-row flex-wrap gap-3">
                {sizes.map((size) => {
                    const isOutOfStock = outOfStockSizes.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                        <TouchableOpacity
                            key={size}
                            onPress={() => !isOutOfStock && onSelect(size)}
                            disabled={isOutOfStock}
                            className={`px-5 py-3 border rounded-lg min-w-[70px] items-center ${isSelected
                                    ? 'bg-black border-black'
                                    : isOutOfStock
                                        ? 'bg-red-50 border-red-300'
                                        : 'bg-white border-gray-300'
                                }`}
                        >
                            <Typography
                                variant="body"
                                className={`font-bold ${isSelected
                                        ? 'text-white'
                                        : isOutOfStock
                                            ? 'text-red-600 line-through'
                                            : 'text-black'
                                    }`}
                            >
                                {size}
                            </Typography>
                            {isOutOfStock && (
                                <Typography variant="caption" className="text-red-600 text-xs mt-1">
                                    Not Available
                                </Typography>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
