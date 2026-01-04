import { View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '../../components/Themed';
import { CATEGORIES } from '../../data/products';

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 48) / 2;

export default function CategoriesScreen() {
    const router = useRouter();

    const handleCategoryPress = (categoryName: string) => {
        router.push({ pathname: '/search', params: { q: categoryName } });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <View className="px-4 py-3 bg-white shadow-sm mb-2">
                <Text className="text-xl font-bold text-black">All Categories</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="flex-row flex-wrap justify-between">
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => handleCategoryPress(cat.name)}
                            className="bg-white mb-4 rounded-lg overflow-hidden shadow-sm"
                            style={{ width: itemWidth, height: itemWidth * 1.2 }}
                        >
                            <View className="flex-1 bg-gray-50 items-center justify-center">
                                <Image
                                    source={cat.image}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="p-3 items-center justify-center border-t border-gray-100">
                                <Text className="text-black font-bold text-sm text-center">{cat.name}</Text>
                                <Text className="text-green-600 text-xs mt-1">Up to 50% Off</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
