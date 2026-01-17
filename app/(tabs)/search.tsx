import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES = ['All', 'Running', 'Casual', 'Sports', 'Formal', 'Sandals'];

export default function Search() {
    const router = useRouter();
    const { q: paramQ, category: paramCat, brand: paramBrand, collection: paramCollection } = useLocalSearchParams();
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

    // Get Categories from Supabase (Dynamic)
    const [categories, setCategories] = useState<string[]>(['All']);

    useEffect(() => {
        // Fetch valid categories
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('name').eq('is_active', true);
            if (data) {
                const dbCats = data.map(c => c.name).filter(name => name !== 'All');
                setCategories(['All', ...dbCats]);
            }
        };
        fetchCategories();
    }, []);

    // Initial Params Handling
    useEffect(() => {
        if (paramQ) setQuery(paramQ.toString());
        if (paramCat) setSelectedCategory(paramCat.toString());
        if (paramBrand) setSelectedBrand(paramBrand.toString());

        // Trigger fetch based on params
        fetchProducts(
            paramQ?.toString() || '',
            paramCat?.toString() || 'All',
            paramBrand?.toString() || null,
            paramCollection?.toString() || null
        );
    }, [paramQ, paramCat, paramBrand, paramCollection]);

    const fetchProducts = async (searchQuery?: string, category?: string, brand?: string | null, collection?: string | null) => {
        setLoading(true);
        try {
            let q = supabase.from('products').select('*, category:categories(name), brand:brands(name)');

            // Search Query Filter
            if (searchQuery && searchQuery.trim().length > 0) {
                q = q.ilike('name', `%${searchQuery.trim()}%`);
            }

            // Category Filter
            if (category && category !== 'All') {
                const { data: catData } = await supabase.from('categories').select('id').eq('name', category).single();
                if (catData) {
                    q = q.eq('category_id', catData.id);
                }
            }

            // Brand Filter
            if (brand) {
                const { data: brandData } = await supabase.from('brands').select('id').eq('name', brand).single();
                // Or try ID check if brand is ID? Assuming Name for now from URL
                if (brandData) {
                    q = q.eq('brand_id', brandData.id);
                } else {
                    // Try as ID directly
                    q = q.eq('brand_id', brand);
                }
            }

            // Collection Filter (Using Tags as proxy)
            if (collection) {
                // 'tags' is a text[] array, so we must use array operators like .contains
                q = q.contains('tags', [collection]);
            }

            const { data, error } = await q.limit(50);

            if (error) {
                console.error('Fetch error:', error);
                setProducts([]);
            } else {
                setProducts(data || []);
            }
        } catch (e) {
            console.error(e);
            setProducts([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Effect for local state changes (manual interactions)
        // Avoid double fetch if params just loaded, but simple approach:
        // Only trigger if we are NOT in initial mount? No, safely triggers.
        // We rely on handleSearch for query, but category buttons trigger this.
        if (selectedCategory !== (paramCat?.toString() || 'All')) {
            fetchProducts(query, selectedCategory, selectedBrand);
        }
    }, [selectedCategory]);


    const handleSearch = () => {
        fetchProducts(query, selectedCategory);
    };

    const clearSearch = () => {
        setQuery('');
        fetchProducts('', selectedCategory);
    };

    const getProductImage = (product: Product) => {
        if (product.thumbnail && product.thumbnail.startsWith('http')) return product.thumbnail;
        if (product.images && product.images.length > 0 && product.images[0].startsWith('http')) return product.images[0];

        // Consistent placeholder
        const randomId = product.id.charCodeAt(0) % 5;
        const placeholders = [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400',
            'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
            'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=400'
        ];
        return placeholders[randomId] || placeholders[0];
    };

    const { user } = useAuthStore();
    const isWholesaleUser = user?.role === 'wholesale' && user?.is_verified;

    const renderProduct = ({ item }: { item: Product }) => {
        const displayPrice = isWholesaleUser && item.price_wholesale ? item.price_wholesale : (item.sale_price || item.price);
        const showSaleTag = !isWholesaleUser && item.is_on_sale;

        return (
            <TouchableOpacity
                style={{
                    width: '48%',
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 15,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2
                }}
                onPress={() => router.push(`/product/${item.id}`)}
            >
                <View style={{
                    aspectRatio: 1,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 12,
                    marginBottom: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    <Image
                        source={{ uri: getProductImage(item) }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                    />
                    {showSaleTag && (
                        <View style={{ position: 'absolute', top: 6, left: 6, backgroundColor: '#ff3b30', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                            <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>SALE</Text>
                        </View>
                    )}
                    {isWholesaleUser && (
                        <View style={{ position: 'absolute', top: 6, left: 6, backgroundColor: '#0284c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                            <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>B2B</Text>
                        </View>
                    )}
                </View>
                <Text style={{ fontWeight: '600', fontSize: 13, marginBottom: 4, height: 32 }} numberOfLines={2}>{item.name || 'Product'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>₹{displayPrice?.toLocaleString()}</Text>
                    {!isWholesaleUser && item.is_on_sale && item.sale_price && (
                        <Text style={{ color: '#999', fontSize: 11, textDecorationLine: 'line-through' }}>₹{item.price}</Text>
                    )}
                    {isWholesaleUser && (
                        <Text style={{ color: '#0284c7', fontSize: 10, fontWeight: 'bold' }}>/ pair</Text>
                    )}
                </View>
                {isWholesaleUser && item.moq && item.moq > 1 && (
                    <Text style={{ color: '#666', fontSize: 10 }}>Min: {item.moq} pairs</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            {/* Search Bar */}
            <View style={{ padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 12,
                    paddingHorizontal: 15,
                    height: 50
                }}>
                    <SearchIcon size={20} color="#888" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearch}
                        placeholder="Search for shoes..."
                        style={{ flex: 1, marginLeft: 10, fontSize: 16, color: '#333' }}
                        placeholderTextColor="#999"
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={clearSearch}>
                            <X size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Categories */}
            <View style={{ backgroundColor: 'white', paddingVertical: 12 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((cat, i) => (
                        <TouchableOpacity
                            key={`cat-${i}`}
                            onPress={() => setSelectedCategory(cat)}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                marginLeft: i === 0 ? 15 : 8,
                                marginRight: i === categories.length - 1 ? 15 : 0,
                                backgroundColor: selectedCategory === cat ? 'black' : '#f0f0f0',
                                borderRadius: 25
                            }}
                        >
                            <Text style={{
                                color: selectedCategory === cat ? 'white' : '#333',
                                fontWeight: '600',
                                fontSize: 13
                            }}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Results */}
            <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                        {loading ? 'Searching...' : `${products.length} Products Found`}
                    </Text>
                    {selectedCategory !== 'All' && (
                        <Text style={{ fontSize: 13, color: '#666' }}>in {selectedCategory}</Text>
                    )}
                </View>

                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="black" />
                    </View>
                ) : products.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#999', fontSize: 16 }}>No products found</Text>
                        <Text style={{ color: '#aaa', fontSize: 13, marginTop: 5 }}>Try a different search or category</Text>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        renderItem={renderProduct}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
