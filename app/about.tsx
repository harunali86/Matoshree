import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Footer } from '../components/layout/Footer';
import { Package, Users, Award } from 'lucide-react-native';

export default function AboutScreen() {
    return (
        <Container safeArea className="bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-8">
                    <Typography variant="h1" className="text-3xl font-black uppercase tracking-tighter mb-4">
                        About Us
                    </Typography>
                    <Typography variant="body" className="leading-relaxed text-gray-600 mb-6">
                        Matoshri Foot Wear is your trusted footwear destination in Chikhali, Pimpri Chinchwad.
                        Located near Saini Police Station, we offer a wide range of shoes for men, women, and children.
                        Quality products at affordable prices - that's our promise.
                    </Typography>
                </View>

                {/* Stats */}
                <View className="px-6 py-8 bg-gray-50">
                    <View className="flex-row justify-between mb-8">
                        <View className="items-center flex-1">
                            <Package size={32} color="#000" strokeWidth={1.5} />
                            <Typography variant="h2" className="font-black text-2xl mt-3">10K+</Typography>
                            <Typography variant="caption" color="muted">Orders Delivered</Typography>
                        </View>
                        <View className="items-center flex-1">
                            <Users size={32} color="#000" strokeWidth={1.5} />
                            <Typography variant="h2" className="font-black text-2xl mt-3">5K+</Typography>
                            <Typography variant="caption" color="muted">Happy Customers</Typography>
                        </View>
                        <View className="items-center flex-1">
                            <Award size={32} color="#000" strokeWidth={1.5} />
                            <Typography variant="h2" className="font-black text-2xl mt-3">14+</Typography>
                            <Typography variant="caption" color="muted">Years Experience</Typography>
                        </View>
                    </View>
                </View>

                {/* Mission */}
                <View className="px-6 py-8">
                    <Typography variant="h3" className="font-bold text-xl mb-4">Our Mission</Typography>
                    <Typography variant="body" className="leading-relaxed text-gray-600 mb-6">
                        To provide high-quality, comfortable footwear that enhances your lifestyle.
                        We source the best materials and work with skilled craftsmen to ensure every
                        pair meets our rigorous standards.
                    </Typography>

                    <Typography variant="h3" className="font-bold text-xl mb-4">Why Choose Us?</Typography>
                    <View className="space-y-3">
                        <View className="flex-row items-start mb-3">
                            <View className="w-2 h-2 bg-black rounded-full mt-2 mr-3" />
                            <Typography variant="body" className="flex-1 text-gray-600">
                                <Typography variant="body" className="font-bold">Authentic Products:</Typography> 100% genuine brands
                            </Typography>
                        </View>
                        <View className="flex-row items-start mb-3">
                            <View className="w-2 h-2 bg-black rounded-full mt-2 mr-3" />
                            <Typography variant="body" className="flex-1 text-gray-600">
                                <Typography variant="body" className="font-bold">Quality Assurance:</Typography> Every item is inspected
                            </Typography>
                        </View>
                        <View className="flex-row items-start mb-3">
                            <View className="w-2 h-2 bg-black rounded-full mt-2 mr-3" />
                            <Typography variant="body" className="flex-1 text-gray-600">
                                <Typography variant="body" className="font-bold">Easy Returns:</Typography> 7-day hassle-free returns
                            </Typography>
                        </View>
                        <View className="flex-row items-start">
                            <View className="w-2 h-2 bg-black rounded-full mt-2 mr-3" />
                            <Typography variant="body" className="flex-1 text-gray-600">
                                <Typography variant="body" className="font-bold">Fast Delivery:</Typography> Free shipping on orders above ₹999
                            </Typography>
                        </View>
                    </View>
                </View>

                <Footer />
            </ScrollView>
        </Container>
    );
}
