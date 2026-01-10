import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { CheckCircle } from 'lucide-react-native';

export default function PaymentSuccessScreen() {
    const router = useRouter();

    return (
        <Container safeArea className="bg-white">
            <View className="flex-1 justify-center items-center px-6">
                <View className="bg-green-50 rounded-full p-6 mb-6">
                    <CheckCircle size={64} color="#16A34A" />
                </View>

                <Typography variant="h1" className="text-2xl mb-2 text-center">
                    Payment Successful!
                </Typography>

                <Typography variant="body" color="muted" className="text-center mb-8">
                    Your order has been placed successfully.{'\n'}
                    You will receive a confirmation email shortly.
                </Typography>

                <Button
                    title="View Orders"
                    onPress={() => router.replace('/orders')}
                    size="lg"
                    className="mb-4 w-full"
                />

                <Button
                    title="Continue Shopping"
                    variant="outline"
                    onPress={() => router.replace('/(tabs)')}
                    size="lg"
                    className="w-full"
                />
            </View>
        </Container>
    );
}
