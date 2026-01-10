import React, { useRef, useState } from 'react';
import { View, FlatList, useWindowDimensions, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'Premium Footwear',
        description: 'Discover the latest trends in high-end fashion footwear designed for comfort and style.',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '2',
        title: 'Find Your Perfect Fit',
        description: 'Our advanced size guide ensures you get the perfect fit every single time.',
        image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '3',
        title: 'Fast & Secure',
        description: 'Seamless checkout and lightning-fast delivery to your doorstep.',
        image: 'https://images.unsplash.com/photo-1560769629-975e13f0c5d6?q=80&w=1000&auto=format&fit=crop',
    },
];

export default function OnboardingScreen() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = () => {
        router.replace('/(auth)/login');
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <Container className="justify-center">
            <FlatList
                ref={flatListRef}
                data={ONBOARDING_DATA}
                renderItem={({ item }) => (
                    <View style={{ width }} className="items-center justify-center px-6">
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: width * 0.8, height: width * 0.8, resizeMode: 'contain' }}
                            className="mb-8 rounded-2xl"
                        />
                        <Typography variant="h1" className="text-center mb-4">{item.title}</Typography>
                        <Typography variant="body" color="muted" className="text-center px-4">{item.description}</Typography>
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />

            <View className="px-6 py-8">
                <View className="flex-row justify-center mb-8">
                    {ONBOARDING_DATA.map((_, i) => (
                        <View
                            key={i}
                            className={`h-2 rounded-full mx-1 ${i === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300'}`}
                        />
                    ))}
                </View>

                <Button
                    title={currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next"}
                    onPress={handleNext}
                    size="lg"
                />
                {currentIndex < ONBOARDING_DATA.length - 1 && (
                    <Button variant="ghost" title="Skip" onPress={handleSkip} className="mt-2" size="sm" />
                )}
            </View>
        </Container>
    );
}
