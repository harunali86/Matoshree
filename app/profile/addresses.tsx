import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';
import { ArrowLeft, Plus } from 'lucide-react-native';

export default function AddressesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="px-4 py-3 bg-white flex-row items-center shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black">Saved Addresses</Text>
            </View>

            <TouchableOpacity className="bg-white p-4 mt-2 flex-row items-center">
                <Plus size={20} color="#2874F0" />
                <Text className="text-[#2874F0] font-bold ml-2">Add a new address</Text>
            </TouchableOpacity>

            <ScrollView className="mt-2">
                <View className="bg-white p-4 mb-2">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-black font-bold">Home</Text>
                        <View className="bg-gray-100 px-2 py-0.5 rounded-sm">
                            <Text className="text-xs text-gray-600">DEFAULT</Text>
                        </View>
                    </View>
                    <Text className="text-gray-800 font-bold mb-1">Harun User</Text>
                    <Text className="text-gray-600">123, Main Street, Tech Park, Bangalore, Karnataka - 560001</Text>
                    <Text className="text-gray-600 mt-1">Phone: +91 98765 43210</Text>

                    <View className="flex-row mt-3 pt-3 border-t border-gray-100">
                        <TouchableOpacity className="flex-1 items-center border-r border-gray-200">
                            <Text className="text-[#2874F0] font-bold text-sm">EDIT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 items-center">
                            <Text className="text-[#2874F0] font-bold text-sm">REMOVE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
