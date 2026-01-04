import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../../components/Themed';
import { ArrowLeft, Check, Globe } from 'lucide-react-native';
import { useState } from 'react';

const LANGUAGES = [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
];

export default function LanguageScreen() {
    const router = useRouter();
    const [selectedLang, setSelectedLang] = useState('en');

    const handleSelect = (code: string) => {
        setSelectedLang(code);
        setTimeout(() => {
            alert(`Language changed to ${LANGUAGES.find(l => l.code === code)?.name}. App will restart. (Demo)`);
        }, 300);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Globe size={20} color="#2874F0" />
                <Text className="text-lg font-bold text-black ml-2">Select Language</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="bg-white mt-2">
                    {LANGUAGES.map((lang, index) => (
                        <TouchableOpacity
                            key={lang.code}
                            onPress={() => handleSelect(lang.code)}
                            className={`flex-row items-center px-4 py-4 ${index < LANGUAGES.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                        >
                            <Text className="text-2xl mr-3">{lang.flag}</Text>
                            <View className="flex-1">
                                <Text className="text-black font-medium">{lang.name}</Text>
                                <Text className="text-gray-500 text-sm">{lang.native}</Text>
                            </View>
                            {selectedLang === lang.code && (
                                <View className="w-6 h-6 bg-[#2874F0] rounded-full items-center justify-center">
                                    <Check size={14} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-gray-400 text-xs text-center p-4">
                    Changing language will restart the app
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
