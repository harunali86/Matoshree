import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: 999999 },
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: 'Above ₹2000', min: 2000, max: 999999 },
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Popular', value: 'popular' },
];

export default function CategoryProducts() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
    const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);

    useEffect(() => {
        fetchCategoryProducts();
    }, [id]);

    useEffect(() => {
        applyFilters();
    }, [products, selectedPriceRange, selectedSort]);

    const fetchCategoryProducts = async () => {
        try {
            // Fetch category info
            const { data: catData } = await supabase
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();

            if (catData) setCategory(catData);

            // Fetch products
            const { data: prodData } = await supabase
                .from('products')
                .select('*')
                .eq('category_id', id)
                .eq('is_active', true);

            if (prodData) setProducts(prodData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...products];

        // Price Filter
        result = result.filter(p =>
            p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
        );

        // Sort
        switch (selectedSort.value) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
                break;
            case 'popular':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
        }

        setFilteredProducts(result);
    };

    const resetFilters = () => {
        setSelectedPriceRange(PRICE_RANGES[0]);
        setSelectedSort(SORT_OPTIONS[0]);
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            onPress={() => router.push(`/product/${item.id}`)}
            style={{
                width: CARD_WIDTH,
                marginBottom: 16,
                backgroundColor: 'white',
                borderRadius: 12,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2
            }}
        >
            <Image
                source={{ uri: item.thumbnail || undefined }}
                style={{ width: '100%', height: CARD_WIDTH * 1.2, backgroundColor: '#f0f0f0' }}
            />
            <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }} numberOfLines={2}>
                    {item.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>₹{item.price}</Text>
                    {item.sale_price && item.sale_price < item.price && (
                        <Text style={{ fontSize: 12, color: '#999', textDecorationLine: 'line-through' }}>
                            ₹{item.sale_price}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="black" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{category?.name || 'Products'}</Text>
                    <Text style={{ fontSize: 12, color: '#999' }}>{filteredProducts.length} Products</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setShowFilters(true)}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}
                >
                    <SlidersHorizontal size={16} color="#333" />
                    <Text style={{ marginLeft: 6, fontWeight: '600', fontSize: 13 }}>Filter</Text>
                </TouchableOpacity>
            </View>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>No Products Found</Text>
                    <Text style={{ color: '#999', marginTop: 8, textAlign: 'center' }}>
                        Try adjusting your filters
                    </Text>
                    <TouchableOpacity onPress={resetFilters} style={{ marginTop: 20 }}>
                        <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Reset Filters</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 16 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={renderProduct}
                />
            )}

            {/* Filter Modal */}
            <Modal visible={showFilters} animationType="slide" transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' }}>
                        {/* Modal Header */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Filters</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <X size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 20 }}>
                            {/* Price Range */}
                            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Price Range</Text>
                            <View style={{ marginBottom: 24 }}>
                                {PRICE_RANGES.map((range) => (
                                    <TouchableOpacity
                                        key={range.label}
                                        onPress={() => setSelectedPriceRange(range)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingVertical: 14,
                                            borderBottomWidth: 1,
                                            borderColor: '#f5f5f5'
                                        }}
                                    >
                                        <Text style={{ fontSize: 15, color: selectedPriceRange.label === range.label ? '#111' : '#666' }}>
                                            {range.label}
                                        </Text>
                                        {selectedPriceRange.label === range.label && (
                                            <Check size={20} color="#10b981" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Sort By */}
                            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Sort By</Text>
                            <View style={{ marginBottom: 24 }}>
                                {SORT_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => setSelectedSort(option)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingVertical: 14,
                                            borderBottomWidth: 1,
                                            borderColor: '#f5f5f5'
                                        }}
                                    >
                                        <Text style={{ fontSize: 15, color: selectedSort.value === option.value ? '#111' : '#666' }}>
                                            {option.label}
                                        </Text>
                                        {selectedSort.value === option.value && (
                                            <Check size={20} color="#10b981" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Apply Button */}
                        <View style={{ padding: 20, borderTopWidth: 1, borderColor: '#f0f0f0' }}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity
                                    onPress={resetFilters}
                                    style={{ flex: 1, backgroundColor: '#f5f5f5', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Text style={{ fontWeight: '600' }}>Reset</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setShowFilters(false)}
                                    style={{ flex: 2, backgroundColor: 'black', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Apply Filters</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
