import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View style={styles.container} pointerEvents="none">
                {toasts.map((toast, index) => (
                    <ToastItem key={toast.id} toast={toast} index={index} />
                ))}
            </View>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: Toast; index: number }> = ({ toast, index }) => {
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const getIcon = () => {
        const iconSize = 20;
        switch (toast.type) {
            case 'success':
                return <CheckCircle size={iconSize} color="#22C55E" />;
            case 'error':
                return <XCircle size={iconSize} color="#EF4444" />;
            case 'warning':
                return <AlertCircle size={iconSize} color="#F59E0B" />;
            default:
                return <Info size={iconSize} color="#3B82F6" />;
        }
    };

    const getBackgroundColor = () => {
        switch (toast.type) {
            case 'success': return '#F0FDF4';
            case 'error': return '#FEF2F2';
            case 'warning': return '#FFFBEB';
            default: return '#EFF6FF';
        }
    };

    const getBorderColor = () => {
        switch (toast.type) {
            case 'success': return '#86EFAC';
            case 'error': return '#FECACA';
            case 'warning': return '#FDE68A';
            default: return '#BFDBFE';
        }
    };

    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    opacity,
                    transform: [{ translateY }],
                    top: 60 + (index * 70),
                },
            ]}
        >
            {getIcon()}
            <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        // Fallback for when not in provider
        return {
            showToast: (message: string, type?: ToastType) => {
                if (Platform.OS === 'web') {
                    console.log(`[${type || 'info'}] ${message}`);
                }
            }
        };
    }
    return context;
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    toast: {
        position: 'absolute',
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    toastText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
});

// Standalone Toast Component
interface ToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    onDismiss?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ visible, message, type = 'info', onDismiss }) => {
    if (!visible) return null;

    const getIcon = () => {
        const iconSize = 20;
        switch (type) {
            case 'success':
                return <CheckCircle size={iconSize} color="#22C55E" />;
            case 'error':
                return <XCircle size={iconSize} color="#EF4444" />;
            case 'warning':
                return <AlertCircle size={iconSize} color="#F59E0B" />;
            default:
                return <Info size={iconSize} color="#3B82F6" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return '#F0FDF4';
            case 'error': return '#FEF2F2';
            case 'warning': return '#FFFBEB';
            default: return '#EFF6FF';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return '#86EFAC';
            case 'error': return '#FECACA';
            case 'warning': return '#FDE68A';
            default: return '#BFDBFE';
        }
    };

    return (
        <View style={{
            position: 'absolute',
            top: 60,
            left: 16,
            right: 16,
            zIndex: 9999,
            backgroundColor: getBackgroundColor(),
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: getBorderColor(),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        }}>
            {getIcon()}
            <Text style={{ marginLeft: 12, fontSize: 14, fontWeight: '500', color: '#1F2937', flex: 1 }}>
                {message}
            </Text>
        </View>
    );
};

