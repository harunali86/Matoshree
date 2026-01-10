import React from 'react';
import { Pressable, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { cn } from '../../lib/utils';

interface ButtonProps {
    onPress?: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className,
    icon,
}: ButtonProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        if (disabled || isLoading) return;
        scale.value = withSpring(0.97, { damping: 10, stiffness: 300 });
    };

    const handlePressOut = () => {
        if (disabled || isLoading) return;
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    };

    const baseStyles = "flex-row items-center justify-center rounded-full";

    const variants = {
        primary: "bg-black",
        secondary: "bg-gray-800",
        outline: "border border-gray-300 bg-transparent",
        ghost: "bg-transparent",
    };

    const sizes = {
        sm: "px-4 py-2",
        md: "px-6 py-3",
        lg: "px-8 py-4 w-full",
        icon: "p-3",
    };

    // Text color based on variant
    const getTextStyle = () => {
        const baseTextStyle = {
            fontWeight: '700' as const,
            textAlign: 'center' as const,
        };

        if (variant === 'primary' || variant === 'secondary') {
            return { ...baseTextStyle, color: '#FFFFFF', fontSize: size === 'sm' ? 14 : 16 };
        }
        return { ...baseTextStyle, color: '#000000', fontSize: size === 'sm' ? 14 : 16 };
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || isLoading}
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                disabled && "opacity-50",
                className
            )}
            style={animatedStyle}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : 'black'} />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    {title && (
                        <Text style={getTextStyle()}>
                            {title}
                        </Text>
                    )}
                </>
            )}
        </AnimatedPressable>
    );
};
