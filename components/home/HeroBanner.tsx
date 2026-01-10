import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Typography } from '../ui/Typography';
import { HERO_BANNERS } from '../../data/mock';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.65;

export const HeroBanner = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Auto-scroll every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setActiveIndex((prev) => (prev === HERO_BANNERS.length - 1 ? 0 : prev + 1));
                setIsAnimating(false);
            }, 300);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const currentBanner = HERO_BANNERS[activeIndex];

    const goToSlide = (index: number) => {
        if (index !== activeIndex) {
            setIsAnimating(true);
            setTimeout(() => {
                setActiveIndex(index);
                setIsAnimating(false);
            }, 300);
        }
    };

    return (
        <View style={[styles.container, { height: BANNER_HEIGHT }]}>
            {/* Background Image with Fade */}
            <View style={[styles.imageContainer, { opacity: isAnimating ? 0 : 1 }]}>
                <Image
                    source={{ uri: currentBanner.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {/* Gradient Overlay */}
                <View style={styles.gradient} />
            </View>

            {/* Content with Animation */}
            <View style={[styles.content, { opacity: isAnimating ? 0 : 1, transform: [{ translateY: isAnimating ? 20 : 0 }] }]}>
                <Typography
                    variant="caption"
                    className="text-white/70 mb-2 uppercase tracking-widest text-xs font-semibold"
                >
                    MATOSHREE FOOTWEAR
                </Typography>

                <Typography
                    variant="h1"
                    className="text-white mb-3 uppercase tracking-tight"
                    style={{ fontSize: 42, lineHeight: 46, fontWeight: '900' }}
                >
                    {currentBanner.title}
                </Typography>

                <Typography
                    variant="body"
                    className="text-white/80 mb-8 font-medium"
                    style={{ fontSize: 18 }}
                >
                    {currentBanner.subtitle}
                </Typography>

                <TouchableOpacity style={styles.button}>
                    <Typography variant="body" className="font-bold uppercase text-xs tracking-wider">
                        Shop Now
                    </Typography>
                </TouchableOpacity>
            </View>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {HERO_BANNERS.map((_, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => goToSlide(i)}
                        style={[
                            styles.dot,
                            i === activeIndex ? styles.dotActive : styles.dotInactive
                        ]}
                    />
                ))}
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${((activeIndex + 1) / HERO_BANNERS.length) * 100}%` }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
        ...(Platform.OS === 'web' ? { transition: 'opacity 0.3s ease-in-out' } : {}),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        // Simulated gradient
    },
    content: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 32,
        paddingBottom: 48,
        ...(Platform.OS === 'web' ? { transition: 'all 0.4s ease-out' } : {}),
    },
    button: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 30,
        alignSelf: 'flex-start',
    },
    pagination: {
        position: 'absolute',
        bottom: 120,
        right: 32,
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        height: 10,
        borderRadius: 5,
    },
    dotActive: {
        width: 32,
        backgroundColor: '#fff',
    },
    dotInactive: {
        width: 10,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#fff',
        ...(Platform.OS === 'web' ? { transition: 'width 0.3s ease' } : {}),
    },
});
