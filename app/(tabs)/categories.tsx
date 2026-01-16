import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

interface Category {
    id: string;
    name: string;
    image_url?: string;
    product_count?: number;
}

// Fallback images for categories (Unsplash - footwear themed)
const CATEGORY_IMAGES: { [key: string]: string } = {
    'Men': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    'Women': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    'Kids': 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=400&h=400&fit=crop',
    'Sports': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    'Sneakers': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
    'Formal': 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop',
    'Sandals': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
    'default': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop'
};

export default function Categories() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (data) {
                const categoriesWithCounts = await Promise.all(
                    data.map(async (cat) => {
                        const { count } = await supabase
                            .from('products')
                            .select('*', { count: 'exact', head: true })
                            .eq('category_id', cat.id);
                        return { ...cat, product_count: count || 0 };
                    })
                );
                setCategories(categoriesWithCounts);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryImage = (category: Category) => {
        if (category.image_url) return category.image_url;
        return CATEGORY_IMAGES[category.name] || CATEGORY_IMAGES['default'];
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="black" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Header */}
            <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <Text style={{ fontSize: 26, fontWeight: '900', letterSpacing: -0.5 }}>Shop by Category</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Category Grid - Image Cards */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => router.push(`/category/${category.id}` as any)}
                            style={{
                                width: '48%',
                                marginBottom: 16,
                                borderRadius: 16,
                                overflow: 'hidden',
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            {/* Category Image */}
                            <Image
                                source={{ uri: CATEGORY_IMAGES[category.name] || CATEGORY_IMAGES['default'] }}
                                style={{ width: '100%', height: 140 }}
                                contentFit="cover"
                                transition={500}
                            />
                            {/* Overlay with Name */}
                            <View style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                paddingVertical: 12, paddingHorizontal: 14
                            }}>
                                <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
                                    {category.name}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>
                                    {category.product_count} items
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* All Products Button */}
                <TouchableOpacity
                    onPress={() => router.push('/search')}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#111',
                        padding: 18,
                        borderRadius: 14,
                        marginTop: 8
                    }}
                >
                    <View>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>View All Products</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>Browse entire collection</Text>
                    </View>
                    <ChevronRight size={22} color="white" />
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
