import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../components/Themed';
import { ArrowLeft, Bell, Moon, Lock, Shield, Smartphone, Trash2, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [biometric, setBiometric] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black">Settings</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Notifications */}
                <View className="bg-white mt-2">
                    <Text className="px-4 py-3 text-gray-500 font-bold text-xs">NOTIFICATIONS</Text>
                    <TouchableOpacity
                        onPress={() => setNotifications(!notifications)}
                        className="flex-row items-center px-4 py-4 border-t border-gray-100"
                    >
                        <Bell size={20} color="#2874F0" />
                        <Text className="flex-1 ml-4 text-gray-800">Push Notifications</Text>
                        {notifications ? (
                            <ToggleRight size={28} color="#2874F0" />
                        ) : (
                            <ToggleLeft size={28} color="#ccc" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Appearance */}
                <View className="bg-white mt-2">
                    <Text className="px-4 py-3 text-gray-500 font-bold text-xs">APPEARANCE</Text>
                    <TouchableOpacity
                        onPress={() => setDarkMode(!darkMode)}
                        className="flex-row items-center px-4 py-4 border-t border-gray-100"
                    >
                        <Moon size={20} color="#2874F0" />
                        <Text className="flex-1 ml-4 text-gray-800">Dark Mode</Text>
                        {darkMode ? (
                            <ToggleRight size={28} color="#2874F0" />
                        ) : (
                            <ToggleLeft size={28} color="#ccc" />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/settings/language')}
                        className="flex-row items-center px-4 py-4 border-t border-gray-100"
                    >
                        <Smartphone size={20} color="#2874F0" />
                        <Text className="flex-1 ml-4 text-gray-800">Language</Text>
                        <Text className="text-gray-400 mr-2">English</Text>
                        <ChevronRight size={16} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {/* Security */}
                <View className="bg-white mt-2">
                    <Text className="px-4 py-3 text-gray-500 font-bold text-xs">SECURITY</Text>
                    <TouchableOpacity className="flex-row items-center px-4 py-4 border-t border-gray-100">
                        <Lock size={20} color="#2874F0" />
                        <Text className="flex-1 ml-4 text-gray-800">Change Password</Text>
                        <ChevronRight size={16} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setBiometric(!biometric)}
                        className="flex-row items-center px-4 py-4 border-t border-gray-100"
                    >
                        <Shield size={20} color="#2874F0" />
                        <Text className="flex-1 ml-4 text-gray-800">Biometric Login</Text>
                        {biometric ? (
                            <ToggleRight size={28} color="#2874F0" />
                        ) : (
                            <ToggleLeft size={28} color="#ccc" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Data */}
                <View className="bg-white mt-2 mb-4">
                    <Text className="px-4 py-3 text-gray-500 font-bold text-xs">DATA</Text>
                    <TouchableOpacity className="flex-row items-center px-4 py-4 border-t border-gray-100">
                        <Trash2 size={20} color="#ef4444" />
                        <Text className="flex-1 ml-4 text-red-500">Clear Cache</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-4 py-4 border-t border-gray-100">
                        <Trash2 size={20} color="#ef4444" />
                        <Text className="flex-1 ml-4 text-red-500">Delete Account</Text>
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <View className="items-center py-4">
                    <Text className="text-gray-400 text-xs">Harun Store v2.0.0</Text>
                    <Text className="text-gray-400 text-xs mt-1">Made with ❤️ in India</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
