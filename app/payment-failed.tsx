import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { XCircle } from 'lucide-react-native';

export default function PaymentFailedScreen() {
    const router = useRouter();

    return (
        <Container safeArea className="bg-white">
            <View className="flex-1 justify-center items-center px-6">
                <View className="bg-red-50 rounded-full p-6 mb-6">
                    <XCircle size={64} color="#DC2626" />
                </View>

                <Typography variant="h1" className="text-2xl mb-2 text-center">
                    Payment Failed
                </Typography>

                <Typography variant="body" color="muted" className="text-center mb-8">
                    We couldn't process your payment.{'\n'}
                    Please try again or use a different payment method.
                </Typography>

                <Button
                    title="Retry Payment"
                    onPress={() => router.back()}
                    size="lg"
                    className="mb-4 w-full"
                />

                <Button
                    title="Go to Home"
                    variant="outline"
                    onPress={() => router.replace('/(tabs)')}
                    size="lg"
                    className="w-full"
                />
            </View>
        </Container>
    );
}
