import { Text, TextProps } from 'react-native';
import { cn } from '../../lib/utils'; // We need to create this utility
import React from 'react';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
    className?: string;
    color?: 'default' | 'muted' | 'inverted' | 'primary' | 'error';
}

export const Typography = ({
    variant = 'body',
    className,
    color = 'default',
    style,
    ...props
}: TypographyProps) => {
    const baseStyles = "font-sans";

    const variants = {
        h1: "text-3xl font-bold tracking-tight",
        h2: "text-2xl font-semibold tracking-tight",
        h3: "text-xl font-semibold",
        body: "text-base font-normal",
        caption: "text-sm text-text-muted",
        label: "text-xs font-medium uppercase tracking-wider",
    };

    const colors = {
        default: "text-text",
        muted: "text-text-muted",
        inverted: "text-text-inverted",
        primary: "text-primary",
        error: "text-error",
    };

    return (
        <Text
            className={cn(baseStyles, variants[variant], colors[color], className)}
            style={style}
            {...props}
        />
    );
};
