import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { StatusBar } from 'expo-status-bar';

interface ContainerProps extends ViewProps {
    children: React.ReactNode;
    safeArea?: boolean;
    className?: string;
    translucentStatusBar?: boolean;
}

export const Container = ({
    children,
    safeArea = true,
    className,
    translucentStatusBar = true,
    style,
    ...props
}: ContainerProps) => {
    const Wrapper = safeArea ? SafeAreaView : View;

    return (
        <Wrapper
            className={cn("flex-1 bg-background", className)}
            style={style}
            {...props}
        >
            <StatusBar style="auto" translucent={translucentStatusBar} />
            {children}
        </Wrapper>
    );
};
