import { View, Text, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        title: 'Premium Footwear',
        subtitle: 'Discover the finest collection of shoes crafted for style and comfort',
        color: '#3b82f6'
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600',
        title: 'Easy Shopping',
        subtitle: 'Browse, select and checkout in just a few taps with secure payment',
        color: '#10b981'
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
        title: 'Fast Delivery',
        subtitle: 'Get your orders delivered to your doorstep within 3-5 business days',
        color: '#f59e0b'
    }
];

export default function Onboarding() {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = async () => {
        if (currentIndex < ONBOARDING_SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            // Mark onboarding as complete
            await AsyncStorage.setItem('onboarding_complete', 'true');
            router.replace('/(tabs)');
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('onboarding_complete', 'true');
        router.replace('/(tabs)');
    };

    const renderSlide = ({ item, index }: { item: typeof ONBOARDING_SLIDES[0]; index: number }) => (
        <View style={{ width, alignItems: 'center' }}>
            {/* Image */}
            <View style={{
                width: width * 0.85,
                height: height * 0.45,
                borderRadius: 30,
                overflow: 'hidden',
                marginTop: height * 0.1,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10
            }}>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
            </View>

            {/* Content */}
            <View style={{ paddingHorizontal: 40, marginTop: 40, alignItems: 'center' }}>
                <Text style={{
                    fontSize: 32,
                    fontWeight: '900',
                    color: '#111',
                    textAlign: 'center',
                    letterSpacing: -0.5
                }}>
                    {item.title}
                </Text>
                <Text style={{
                    fontSize: 16,
                    color: '#666',
                    textAlign: 'center',
                    marginTop: 16,
                    lineHeight: 24
                }}>
                    {item.subtitle}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Skip Button */}
            <TouchableOpacity
                onPress={handleSkip}
                style={{
                    position: 'absolute',
                    top: 60,
                    right: 24,
                    zIndex: 100,
                    paddingHorizontal: 16,
                    paddingVertical: 8
                }}
            >
                <Text style={{ color: '#999', fontWeight: '600', fontSize: 15 }}>Skip</Text>
            </TouchableOpacity>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={ONBOARDING_SLIDES}
                keyExtractor={(item) => item.id}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />

            {/* Bottom Section */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 50 }}>
                {/* Dots */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
                    {ONBOARDING_SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: currentIndex === index ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: currentIndex === index ? '#111' : '#ddd',
                                marginHorizontal: 4
                            }}
                        />
                    ))}
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    style={{
                        backgroundColor: '#111',
                        height: 56,
                        borderRadius: 28,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
