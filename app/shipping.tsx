import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Footer } from '../components/layout/Footer';
import { Truck, RotateCcw, Shield } from 'lucide-react-native';

export default function ShippingScreen() {
    return (
        <Container safeArea className="bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-8">
                    <Typography variant="h1" className="text-3xl font-black uppercase tracking-tighter mb-4">
                        Shipping & Returns
                    </Typography>
                </View>

                {/* Shipping Policy */}
                <View className="px-6 py-4">
                    <View className="flex-row items-center mb-4">
                        <Truck size={24} color="#000" />
                        <Typography variant="h3" className="font-bold text-xl ml-3">Shipping Policy</Typography>
                    </View>

                    <Typography variant="body" className="leading-relaxed text-gray-600 mb-4">
                        We offer fast and reliable shipping across India.
                    </Typography>

                    <View className="bg-gray-50 p-4 rounded-lg mb-6">
                        <View className="flex-row justify-between mb-3 pb-3 border-b border-gray-200">
                            <Typography variant="body" className="font-bold">Standard Delivery</Typography>
                            <Typography variant="body">5-7 business days</Typography>
                        </View>
                        <View className="flex-row justify-between mb-3 pb-3 border-b border-gray-200">
                            <Typography variant="body" className="font-bold">Express Delivery</Typography>
                            <Typography variant="body">2-3 business days</Typography>
                        </View>
                        <View className="flex-row justify-between">
                            <Typography variant="body" className="font-bold text-green-700">Free Shipping</Typography>
                            <Typography variant="body" className="text-green-700">On orders above ₹999</Typography>
                        </View>
                    </View>

                    <Typography variant="caption" color="muted" className="mb-2">
                        • Orders placed before 2 PM are processed the same day
                    </Typography>
                    <Typography variant="caption" color="muted" className="mb-2">
                        • You'll receive a tracking number via SMS and email
                    </Typography>
                    <Typography variant="caption" color="muted">
                        • COD available for orders under ₹5000
                    </Typography>
                </View>

                {/* Returns Policy */}
                <View className="px-6 py-8 border-t border-gray-100">
                    <View className="flex-row items-center mb-4">
                        <RotateCcw size={24} color="#000" />
                        <Typography variant="h3" className="font-bold text-xl ml-3">Return Policy</Typography>
                    </View>

                    <Typography variant="body" className="leading-relaxed text-gray-600 mb-4">
                        We want you to be 100% satisfied with your purchase. If you're not happy,
                        you can return your order within 7 days of delivery.
                    </Typography>

                    <View className="bg-blue-50 p-4 rounded-lg mb-4">
                        <Typography variant="body" className="font-bold mb-2">Return Conditions:</Typography>
                        <Typography variant="caption" className="text-gray-700 mb-1">
                            ✓ Product must be unused and in original packaging
                        </Typography>
                        <Typography variant="caption" className="text-gray-700 mb-1">
                            ✓ Tags and labels must be intact
                        </Typography>
                        <Typography variant="caption" className="text-gray-700 mb-1">
                            ✓ No signs of wear or damage
                        </Typography>
                        <Typography variant="caption" className="text-gray-700">
                            ✓ Original invoice must be included
                        </Typography>
                    </View>

                    <Typography variant="body" className="font-bold mb-2">How to Return:</Typography>
                    <Typography variant="caption" color="muted" className="mb-2">
                        1. Go to "My Orders" and select the item to return
                    </Typography>
                    <Typography variant="caption" color="muted" className="mb-2">
                        2. Choose reason for return
                    </Typography>
                    <Typography variant="caption" color="muted" className="mb-2">
                        3. Our pickup partner will collect the package
                    </Typography>
                    <Typography variant="caption" color="muted">
                        4. Refund will be processed within 5-7 working days
                    </Typography>
                </View>

                {/* Guarantee */}
                <View className="px-6 py-8 bg-gray-50">
                    <View className="flex-row items-center mb-4">
                        <Shield size={24} color="#000" />
                        <Typography variant="h3" className="font-bold text-xl ml-3">Our Guarantee</Typography>
                    </View>
                    <Typography variant="body" className="text-gray-600">
                        Every product sold on Matoshree Footwear comes with our quality guarantee.
                        We stand behind everything we sell.
                    </Typography>
                </View>

                <Footer />
            </ScrollView>
        </Container>
    );
}
