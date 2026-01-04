import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export function SearchBar() {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push('/search')}
            activeOpacity={0.9}
            className="flex-row items-center bg-white rounded-lg px-3 py-2.5 mx-4 mb-4 mt-2 shadow-sm"
        >
            <Search size={20} color="#2874F0" />
            <View className="flex-1 ml-2">
                <TextInput
                    placeholder="Search for products, brands and more"
                    placeholderTextColor="#999"
                    className="text-black"
                    editable={false}
                    pointerEvents="none"
                />
            </View>
            <TouchableOpacity onPress={() => { }}>
                <Mic size={20} color="#666" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
