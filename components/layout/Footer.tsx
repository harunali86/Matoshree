import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Typography } from '../ui/Typography';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, Facebook, Instagram, Twitter } from 'lucide-react-native';

export const Footer = () => {
    const router = useRouter();

    const openLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <View className="bg-black px-6 py-6 mt-8">
            {/* Store Info - Compact */}
            <View className="mb-4">
                <Typography variant="h3" className="text-white font-bold mb-2 uppercase text-sm">
                    Matoshri Foot Wear
                </Typography>
                <View className="flex-row items-start mb-2">
                    <MapPin size={14} color="#9CA3AF" className="mt-0.5" />
                    <Typography variant="caption" className="text-gray-400 ml-2 flex-1">
                        Chikhali, Pimpri Chinchwad, MH 411062
                    </Typography>
                </View>
                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <Phone size={14} color="#9CA3AF" />
                        <Typography variant="caption" className="text-gray-400 ml-2">
                            089978 11030
                        </Typography>
                    </View>
                    <View className="flex-row items-center">
                        <Clock size={14} color="#9CA3AF" />
                        <Typography variant="caption" className="text-gray-400 ml-2">
                            Open Daily
                        </Typography>
                    </View>
                </View>
            </View>

            {/* Quick Links - Horizontal */}
            <View className="border-t border-gray-800 pt-4 mb-4">
                <View className="flex-row flex-wrap gap-x-4 gap-y-2">
                    <TouchableOpacity onPress={() => router.push('/about')}>
                        <Typography variant="caption" className="text-gray-400">About</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/shipping')}>
                        <Typography variant="caption" className="text-gray-400">Shipping</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/contact')}>
                        <Typography variant="caption" className="text-gray-400">Contact</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/orders')}>
                        <Typography variant="caption" className="text-gray-400">Track Order</Typography>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Social + Copyright */}
            <View className="border-t border-gray-800 pt-4 flex-row items-center justify-between">
                <View className="flex-row gap-3">
                    <TouchableOpacity onPress={() => openLink('https://facebook.com')} className="w-8 h-8 bg-gray-800 rounded-full items-center justify-center">
                        <Facebook size={16} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink('https://instagram.com')} className="w-8 h-8 bg-gray-800 rounded-full items-center justify-center">
                        <Instagram size={16} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink('https://twitter.com')} className="w-8 h-8 bg-gray-800 rounded-full items-center justify-center">
                        <Twitter size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Typography variant="caption" className="text-gray-500">
                    © 2026 Matoshri Foot Wear
                </Typography>
            </View>
        </View>
    );
};
