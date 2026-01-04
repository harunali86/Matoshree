import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Themed';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { useState, useMemo } from 'react';

export default function SearchScreen() {
    const { q } = useLocalSearchParams<{ q: string }>();
    const router = useRouter();
    const [query, setQuery] = useState(q || '');

    const filteredProducts = useMemo(() => {
        if (!query.trim()) return PRODUCTS;
        const lowerQuery = query.toLowerCase();
        return PRODUCTS.filter(
            (p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
        );
    }, [query]);

    return (
        <SafeAreaView className="flex-1 bg-[#F1F3F6]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Search Header */}
            <View className="flex-row items-center bg-white px-4 py-3 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                    <Search size={18} color="#888" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search products..."
                        placeholderTextColor="#999"
                        className="flex-1 ml-2 text-black"
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <X size={18} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Results */}
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {filteredProducts.length > 0 ? (
                    <>
                        <Text className="text-gray-500 text-sm mb-4">
                            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{query || 'all products'}"
                        </Text>
                        <View className="flex-row flex-wrap justify-between">
                            {filteredProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </View>
                    </>
                ) : (
                    <View className="flex-1 items-center justify-center py-20">
                        <Text className="text-gray-400 text-lg mb-2">No products found</Text>
                        <Text className="text-gray-400 text-sm">Try a different search term</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
