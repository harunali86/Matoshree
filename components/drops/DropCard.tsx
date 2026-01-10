import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Drop } from '@/data/drops';
import { Bell, BellOff } from 'lucide-react-native';

interface DropCardProps {
    drop: Drop;
}

export default function DropCard({ drop }: DropCardProps) {
    const [timeLeft, setTimeLeft] = useState('');
    const [notify, setNotify] = useState(drop.notifyMe);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(drop.releaseDate) - +new Date();
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                return `${days}d ${hours}h ${minutes}m`;
            } else {
                return 'Available Now';
            }
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // Update every minute to save resources

        setTimeLeft(calculateTimeLeft()); // Initial call

        return () => clearInterval(timer);
    }, [drop.releaseDate]);

    return (
        <View style={styles.card}>
            <Image source={{ uri: drop.imageUrl }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>{drop.title}</Text>
                        <Text style={styles.price}>${drop.price}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setNotify(!notify)}>
                        {notify ? <Bell size={24} color="#000" fill="#000" /> : <Bell size={24} color="#000" />}
                    </TouchableOpacity>
                </View>
                <Text style={styles.description} numberOfLines={2}>{drop.description}</Text>

                <View style={styles.footer}>
                    <Text style={styles.releaseLabel}>Releases in:</Text>
                    <Text style={styles.releaseTime}>{timeLeft}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#1a1a1a',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
    },
    releaseLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    releaseTime: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    }
});
