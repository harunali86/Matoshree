import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Themed';
import { useState } from 'react';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Fake login logic
        router.replace('/(tabs)/');
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="mb-10 items-center">
                <Text className="text-[#2874F0] font-extrabold text-4xl italic">Harun<Text className="text-black">.</Text></Text>
                <Text className="text-gray-500 mt-2">Shopping Simplified.</Text>
            </View>

            <View className="w-full space-y-4">
                <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <TextInput
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        className="text-black text-base"
                        placeholderTextColor="#999"
                    />
                </View>

                <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4">
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="text-black text-base"
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    className="w-full bg-[#2874F0] py-4 rounded-lg items-center shadow-lg shadow-blue-200"
                >
                    <Text className="text-white font-bold text-lg">Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center mt-4">
                    <Text className="text-gray-500 font-bold">Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            <View className="absolute bottom-10 flex-row">
                <Text className="text-gray-500">New to Harun Store? </Text>
                <TouchableOpacity>
                    <Text className="text-[#2874F0] font-bold">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
