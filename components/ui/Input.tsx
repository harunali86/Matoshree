import React from 'react';
import { TextInput, View, TextInputProps } from 'react-native';
import { Typography } from './Typography';
import { cn } from '../../lib/utils';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export const Input = ({
    label,
    error,
    className,
    containerClassName,
    ...props
}: InputProps) => {
    return (
        <View className={cn("mb-4", containerClassName)}>
            {label && (
                <Typography variant="label" className="mb-2 text-text-muted">
                    {label}
                </Typography>
            )}
            <TextInput
                placeholderTextColor="#9ca3af"
                className={cn(
                    "w-full bg-surface px-4 py-3 rounded-xl border border-border text-base text-text",
                    "focus:border-primary focus:border-2",
                    error && "border-error focus:border-error",
                    className
                )}
                {...props}
            />
            {error && (
                <Typography variant="caption" className="mt-1 text-error">
                    {error}
                </Typography>
            )}
        </View>
    );
};
