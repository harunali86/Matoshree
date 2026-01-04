import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '../../components/Themed';
import { ArrowLeft, Send, Bot, User } from 'lucide-react-native';
import { useState } from 'react';

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        text: 'Hello! 👋 I\'m your Harun Store assistant. How can I help you today?',
        isBot: true,
        timestamp: new Date(),
    },
];

const BOT_RESPONSES = [
    'I understand your concern. Let me look into this for you.',
    'Thank you for reaching out! Our team will assist you shortly.',
    'I can help you with that. Could you provide more details?',
    'Your satisfaction is our priority. We\'ll resolve this right away.',
    'I\'ve noted your request. Is there anything else I can help with?',
];

export default function SupportChatScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isBot: false,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
                isBot: true,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center bg-[#2874F0] px-4 py-3">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                    <Bot size={20} color="#2874F0" />
                </View>
                <View>
                    <Text className="text-white font-bold">Harun Support</Text>
                    <Text className="text-blue-200 text-xs">Online • Typically replies instantly</Text>
                </View>
            </View>

            {/* Messages */}
            <ScrollView
                className="flex-1 p-4"
                showsVerticalScrollIndicator={false}
            >
                {messages.map((message) => (
                    <View
                        key={message.id}
                        className={`flex-row mb-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                        {message.isBot && (
                            <View className="w-8 h-8 bg-[#2874F0] rounded-full items-center justify-center mr-2">
                                <Bot size={16} color="white" />
                            </View>
                        )}
                        <View
                            className={`max-w-[75%] px-4 py-3 rounded-2xl ${message.isBot
                                    ? 'bg-white rounded-tl-none'
                                    : 'bg-[#2874F0] rounded-tr-none'
                                }`}
                        >
                            <Text className={message.isBot ? 'text-black' : 'text-white'}>
                                {message.text}
                            </Text>
                            <Text className={`text-xs mt-1 ${message.isBot ? 'text-gray-400' : 'text-blue-200'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                        {!message.isBot && (
                            <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center ml-2">
                                <User size={16} color="#666" />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View className="flex-row items-center bg-white px-4 py-3 border-t border-gray-200">
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-3 text-black"
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        className="w-10 h-10 bg-[#2874F0] rounded-full items-center justify-center"
                    >
                        <Send size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
