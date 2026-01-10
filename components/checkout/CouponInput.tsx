import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Typography } from '../ui/Typography';
import { useCartStore } from '../../store/cartStore';
import { Tag, X } from 'lucide-react-native';
import { Toast } from '../ui/Toast';

export const CouponInput = () => {
    const { applyCoupon, removeCoupon, couponCode, discount } = useCartStore();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
        visible: false, message: '', type: 'error'
    });

    const handleApply = async () => {
        if (!code.trim()) return;
        setLoading(true);
        const result = await applyCoupon(code);
        setLoading(false);

        setToast({ visible: true, message: result.message, type: result.success ? 'success' : 'error' });
    };

    const handleRemove = () => {
        removeCoupon();
        setCode('');
        setToast({ visible: true, message: 'Coupon removed', type: 'error' });
    };

    return (
        <View className="mb-6">
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onDismiss={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <Typography variant="h3" className="mb-3 text-sm font-bold uppercase text-gray-400 tracking-widest">
                Promo Code
            </Typography>

            {couponCode ? (
                <View className="bg-green-50 border border-green-200 p-4 rounded-xl flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Tag size={20} color="#059669" className="mr-2" />
                        <View>
                            <Typography variant="body" className="font-bold text-green-800 uppercase">{couponCode}</Typography>
                            <Typography variant="caption" className="text-green-600">
                                ₹{discount.toLocaleString()} savings applied
                            </Typography>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleRemove} className="bg-white p-2 rounded-full">
                        <X size={16} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="flex-row">
                    <View className="flex-1 bg-gray-50 rounded-xl mr-3 flex-row items-center px-4 border border-gray-100">
                        <Tag size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Enter coupon code"
                            value={code}
                            onChangeText={setCode}
                            className="flex-1 ml-3 py-4 font-medium text-base"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="characters"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleApply}
                        disabled={loading || !code}
                        className={`justify-center px-6 rounded-xl ${!code ? 'bg-gray-200' : 'bg-black'}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Typography variant="body" className={`font-bold ${!code ? 'text-gray-400' : 'text-white'}`}>
                                Apply
                            </Typography>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
