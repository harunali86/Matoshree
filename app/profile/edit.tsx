import { View, TextInput, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';

export default function EditProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('Harun');
    const [phone, setPhone] = useState('+91 98765 43210');
    const [email, setEmail] = useState('harun@example.com');

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="px-4 py-3 bg-white flex-row items-center shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black">Edit Profile</Text>
            </View>

            <View className="p-4 space-y-4 bg-white mt-2">
                <View>
                    <Text className="text-gray-500 mb-1 text-xs uppercase font-bold">Full Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="border border-gray-300 rounded-md p-3 text-black text-base"
                    />
                </View>
                <View>
                    <Text className="text-gray-500 mb-1 text-xs uppercase font-bold">Phone Number</Text>
                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        className="border border-gray-300 rounded-md p-3 text-black text-base"
                        keyboardType="phone-pad"
                    />
                </View>
                <View>
                    <Text className="text-gray-500 mb-1 text-xs uppercase font-bold">Email Address</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        className="border border-gray-300 rounded-md p-3 text-black text-base"
                        keyboardType="email-address"
                    />
                </View>

                <TouchableOpacity className="bg-[#2874F0] py-3 rounded-sm items-center mt-4">
                    <Text className="text-white font-bold">Save Changes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
