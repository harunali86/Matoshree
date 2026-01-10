import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Typography } from '../ui/Typography';
import { Tag, X, CheckCircle } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

interface PromoCodeInputProps {
    onApply: (code: string, discount: number) => void;
    subtotal: number;
}

export const PromoCodeInput = ({ onApply, subtotal }: PromoCodeInputProps) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);
    const [error, setError] = useState('');

    const validatePromoCode = async () => {
        if (!code) {
            setError('Please enter a promo code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data, error: dbError } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', code.toUpperCase())
                .eq('active', true)
                .single();

            if (dbError || !data) {
                setError('Invalid promo code');
                setLoading(false);
                return;
            }

            // Check validity dates
            const now = new Date();
            if (data.valid_from && new Date(data.valid_from) > now) {
                setError('This promo code is not yet valid');
                setLoading(false);
                return;
            }

            if (data.valid_until && new Date(data.valid_until) < now) {
                setError('This promo code has expired');
                setLoading(false);
                return;
            }

            // Check minimum order value
            if (data.min_order_value && subtotal < data.min_order_value) {
                setError(`Minimum order value ₹${data.min_order_value} required`);
                setLoading(false);
                return;
            }

            // Check usage limit
            if (data.usage_limit && data.times_used >= data.usage_limit) {
                setError('This promo code has reached its usage limit');
                setLoading(false);
                return;
            }

            // Calculate discount
            let discountAmount = 0;
            if (data.discount_type === 'percentage') {
                discountAmount = (subtotal * data.discount_value) / 100;
                if (data.max_discount && discountAmount > data.max_discount) {
                    discountAmount = data.max_discount;
                }
            } else {
                discountAmount = data.discount_value;
            }

            setAppliedCode(code.toUpperCase());
            setDiscount(discountAmount);
            onApply(code.toUpperCase(), discountAmount);
            setLoading(false);
        } catch (err) {
            setError('Failed to validate promo code');
            setLoading(false);
        }
    };

    const removePromoCode = () => {
        setAppliedCode(null);
        setDiscount(0);
        setCode('');
        setError('');
        onApply('', 0);
    };

    if (appliedCode) {
        return (
            <View className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <CheckCircle size={20} color="#16A34A" />
                        <View className="ml-3 flex-1">
                            <Typography variant="body" className="font-bold text-green-700">
                                {appliedCode} Applied
                            </Typography>
                            <Typography variant="caption" className="text-green-600">
                                You saved ₹{discount.toFixed(2)}
                            </Typography>
                        </View>
                    </View>
                    <TouchableOpacity onPress={removePromoCode}>
                        <X size={20} color="#16A34A" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="mb-4">
            <View className="flex-row items-center gap-2">
                <View className="flex-1 flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                    <Tag size={18} color="#666" />
                    <TextInput
                        value={code}
                        onChangeText={(text) => {
                            setCode(text.toUpperCase());
                            setError('');
                        }}
                        placeholder="Enter promo code"
                        className="flex-1 ml-2 text-base"
                        autoCapitalize="characters"
                        editable={!loading}
                    />
                </View>
                <TouchableOpacity
                    onPress={validatePromoCode}
                    disabled={loading}
                    className="bg-black px-6 py-3 rounded-lg"
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Typography variant="body" className="text-white font-bold">
                            Apply
                        </Typography>
                    )}
                </TouchableOpacity>
            </View>
            {error ? (
                <Typography variant="caption" className="text-red-600 mt-2">
                    {error}
                </Typography>
            ) : null}
        </View>
    );
};
