import React from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    useSharedValue,
    withDelay
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const ProductCardSkeleton = () => {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View className="mb-8" style={{ width: CARD_WIDTH }}>
            <Animated.View
                style={[animatedStyle]}
                className="aspect-[3/4] bg-gray-200 rounded-sm mb-3"
            />
            <Animated.View style={[animatedStyle]} className="h-4 bg-gray-200 rounded mb-2 w-4/5" />
            <Animated.View style={[animatedStyle]} className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
            <Animated.View style={[animatedStyle]} className="h-4 bg-gray-200 rounded w-1/3" />
        </View>
    );
};

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => {
    return (
        <View className="flex-row flex-wrap justify-between px-4">
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </View>
    );
};
