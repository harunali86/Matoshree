import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../ui/Typography';

interface ColorSelectorProps {
    colors: Array<{ id: string; name: string; hex: string }>;
    selectedColor: string;
    onSelect: (colorId: string) => void;
}

export const ColorSelector = ({ colors, selectedColor, onSelect }: ColorSelectorProps) => {
    if (!colors || colors.length === 0) return null;

    return (
        <View className="mb-6">
            <Typography variant="h3" className="mb-3 text-sm font-bold uppercase text-gray-400 tracking-widest">
                Color: {colors.find(c => c.id === selectedColor)?.name || 'Select'}
            </Typography>
            <View className="flex-row gap-3">
                {colors.map((color) => (
                    <TouchableOpacity
                        key={color.id}
                        onPress={() => onSelect(color.id)}
                        className={`w-12 h-12 rounded-full border-2 items-center justify-center ${selectedColor === color.id ? 'border-black' : 'border-gray-300'
                            }`}
                    >
                        <View
                            className="w-10 h-10 rounded-full"
                            style={{ backgroundColor: color.hex }}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
