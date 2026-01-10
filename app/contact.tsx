import React, { useState } from 'react';
import { ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { MapPin, Phone, Mail, Clock } from 'lucide-react-native';

export default function ContactScreen() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = () => {
        // Handle form submission
        alert('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <Container safeArea className="bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-8">
                    <Typography variant="h1" className="text-3xl font-black uppercase tracking-tighter mb-4">
                        Contact Us
                    </Typography>
                    <Typography variant="body" className="text-gray-600">
                        Have questions? We're here to help!
                    </Typography>
                </View>

                {/* Contact Info */}
                <View className="px-6 py-4">
                    <View className="bg-gray-50 p-6 rounded-lg mb-6">
                        <View className="flex-row items-start mb-4">
                            <MapPin size={20} color="#000" className="mt-1" />
                            <View className="ml-4 flex-1">
                                <Typography variant="body" className="font-bold mb-1">Visit Our Store</Typography>
                                <Typography variant="caption" color="muted">
                                    Matoshri Foot Wear{'\n'}
                                    Jay Shiv Shankar Housing Society, J,{'\n'}
                                    Mhare Wasti Rd, near Saini Police Station,{'\n'}
                                    Pratnabad Housing Society,{'\n'}
                                    Chikhali, Pimpri Chinchwad,{'\n'}
                                    Maharashtra 411062
                                </Typography>
                            </View>
                        </View>

                        <View className="flex-row items-start mb-4">
                            <Phone size={20} color="#000" className="mt-1" />
                            <View className="ml-4 flex-1">
                                <Typography variant="body" className="font-bold mb-1">Call Us</Typography>
                                <Typography variant="caption" color="muted">
                                    089978 11030
                                </Typography>
                            </View>
                        </View>

                        <View className="flex-row items-start mb-4">
                            <Mail size={20} color="#000" className="mt-1" />
                            <View className="ml-4 flex-1">
                                <Typography variant="body" className="font-bold mb-1">Email Us</Typography>
                                <Typography variant="caption" color="muted">
                                    contact@matoshreefootwear.com
                                </Typography>
                            </View>
                        </View>

                        <View className="flex-row items-start">
                            <Clock size={20} color="#000" className="mt-1" />
                            <View className="ml-4 flex-1">
                                <Typography variant="body" className="font-bold mb-1">Store Hours</Typography>
                                <Typography variant="caption" color="muted">
                                    Open Daily{'\n'}
                                    Closes at 10:00 PM
                                </Typography>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Contact Form */}
                <View className="px-6 py-4">
                    <Typography variant="h3" className="font-bold text-xl mb-4">Send us a Message</Typography>

                    <View className="mb-4">
                        <Typography variant="body" className="font-medium mb-2">Name</Typography>
                        <TextInput
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Your name"
                            className="border border-gray-300 rounded-lg p-4 text-base"
                        />
                    </View>

                    <View className="mb-4">
                        <Typography variant="body" className="font-medium mb-2">Email</Typography>
                        <TextInput
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            placeholder="your@email.com"
                            keyboardType="email-address"
                            className="border border-gray-300 rounded-lg p-4 text-base"
                        />
                    </View>

                    <View className="mb-6">
                        <Typography variant="body" className="font-medium mb-2">Message</Typography>
                        <TextInput
                            value={formData.message}
                            onChangeText={(text) => setFormData({ ...formData, message: text })}
                            placeholder="How can we help you?"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="border border-gray-300 rounded-lg p-4 text-base"
                        />
                    </View>

                    <Button
                        title="Send Message"
                        onPress={handleSubmit}
                        size="lg"
                    />
                </View>

                <Footer />
            </ScrollView>
        </Container>
    );
}
