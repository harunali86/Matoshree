import { View, Image, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const BANNERS = [
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000', // Black Friday
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000', // Fashion
    'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000', // Electronics
];

export function HeroCarousel() {
    return (
        <View className="h-48 mb-6">
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                className="w-full h-full"
            >
                {BANNERS.map((banner, index) => (
                    <View key={index} style={{ width }} className="h-full px-4">
                        <View className="w-full h-full rounded-2xl overflow-hidden">
                            <Image
                                source={{ uri: banner }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
