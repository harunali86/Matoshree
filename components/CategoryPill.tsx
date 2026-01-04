import { TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';

interface CategoryPillProps {
    name: string;
    image: any;
    isSelected?: boolean;
    onPress?: () => void;
}

export function CategoryPill({ name, image, isSelected, onPress }: CategoryPillProps) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push({ pathname: '/search', params: { q: name } });
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} className="mr-4 items-center">
            <View className={`w-16 h-16 rounded-full overflow-hidden mb-2 bg-[#F1F3F6] border ${isSelected ? 'border-[#2874F0]' : 'border-gray-100'}`}>
                <Image source={image} style={{ width: 64, height: 64 }} resizeMode="cover" />
            </View>
            <Text className={`text-xs ${isSelected ? 'text-[#2874F0] font-bold' : 'text-gray-700 font-medium'}`}>
                {name}
            </Text>
        </TouchableOpacity>
    );
}
