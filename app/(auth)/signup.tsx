import React, { useState } from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export default function SignupScreen() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, fullName);
        setLoading(false);

        if (error) {
            Alert.alert('Signup Failed', error.message);
        } else {
            Alert.alert(
                'Success!',
                'Account created successfully. Please check your email to verify your account.',
                [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
            );
        }
    };

    return (
        <Container safeArea className="bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View className="mt-12 mb-8">
                        <Typography variant="h1" className="text-3xl mb-2">
                            Create Account
                        </Typography>
                        <Typography variant="body" color="muted">
                            Join us to start shopping
                        </Typography>
                    </View>

                    {/* Signup Form */}
                    <View className="mb-6">
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View className="mb-6">
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    <View className="mb-6">
                        <Input
                            label="Password"
                            placeholder="Create a password (min 6 characters)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View className="mb-6">
                        <Input
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Terms */}
                    <Typography variant="caption" color="muted" className="mb-6 text-center">
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </Typography>

                    {/* Signup Button */}
                    <Button
                        title="Create Account"
                        onPress={handleSignup}
                        isLoading={loading}
                        size="lg"
                        className="mb-6"
                    />

                    {/* Login Link */}
                    <View className="flex-row justify-center mb-8">
                        <Typography variant="body" color="muted">
                            Already have an account?{' '}
                        </Typography>
                        <Link href="/(auth)/login" asChild>
                            <Typography variant="body" className="font-bold underline">
                                Sign In
                            </Typography>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
}
