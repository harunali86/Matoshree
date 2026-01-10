import React, { useState, useMemo } from 'react';
import { ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { ProductCard } from '../../components/product/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react-native';

import { ProductGridSkeleton } from '../../components/ui/Skeleton';

const CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'kids', name: 'Kids' },
    { id: 'running', name: 'Running' },
    { id: 'sneakers', name: 'Sneakers' },
    { id: 'formal', name: 'Formal' },
];

const SORT_OPTIONS = [
    { id: 'newest', label: 'Newest First' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
];

import { useLocalSearchParams } from 'expo-router';

export default function ShopScreen() {
    const { products, loading } = useProducts();
    const params = useLocalSearchParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(
        (params.category as string)?.toLowerCase() || 'all'
    );
    const [sortBy, setSortBy] = useState('newest');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({ min: 0, max: 50000 });
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => {
                const cat = p.metadata?.category?.toLowerCase() || '';
                const sub = p.metadata?.subcategory?.toLowerCase() || '';
                return cat === selectedCategory || sub === selectedCategory;
            });
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.metadata?.category || '').toLowerCase().includes(query) ||
                (p.metadata?.subcategory || '').toLowerCase().includes(query)
            );
        }

        // Apply price range filter
        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        // Apply sorting
        const sorted = [...filtered];
        switch (sortBy) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sorted.sort((a, b) =>
                    parseFloat(b.metadata?.rating || '0') - parseFloat(a.metadata?.rating || '0')
                );
                break;
            default: // newest
                break;
        }

        return sorted;
    }, [products, selectedCategory, searchQuery, sortBy]);

    return (
        <Container safeArea className="bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-4 bg-white" style={{ zIndex: 100 }}>
                    <Typography variant="h1" className="text-3xl font-black uppercase tracking-tighter mb-6">
                        Shop
                    </Typography>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search shoes..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 ml-3 text-base"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Category Filters */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 -mx-6 px-6">
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat.id)}
                                className={`mr-2 px-4 py-2 rounded-full ${selectedCategory === cat.id
                                    ? 'bg-black'
                                    : 'bg-gray-100'
                                    }`}
                            >
                                <Typography
                                    variant="body"
                                    className={`font-bold text-sm ${selectedCategory === cat.id
                                        ? 'text-white'
                                        : 'text-black'
                                        }`}
                                >
                                    {cat.name}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Sort & Filter Bar */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Typography variant="caption" color="muted">
                            {filteredProducts.length} Products
                        </Typography>

                        <View className="relative">
                            <TouchableOpacity
                                onPress={() => setShowSortMenu(!showSortMenu)}
                                className="flex-row items-center"
                            >
                                <Typography variant="body" className="font-medium mr-1">
                                    {SORT_OPTIONS.find(o => o.id === sortBy)?.label}
                                </Typography>
                                <ChevronDown size={16} color="#000" />
                            </TouchableOpacity>

                            {/* Sort Dropdown (Simple version) */}
                            {showSortMenu && (
                                <View className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px]">
                                    {SORT_OPTIONS.map(option => (
                                        <TouchableOpacity
                                            key={option.id}
                                            onPress={() => {
                                                setSortBy(option.id);
                                                setShowSortMenu(false);
                                            }}
                                            className="px-4 py-3 border-b border-gray-100"
                                        >
                                            <Typography
                                                variant="body"
                                                className={sortBy === option.id ? 'font-bold' : ''}
                                            >
                                                {option.label}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Product Grid */}
                <View className="px-4 mb-24">
                    {loading ? (
                        <ProductGridSkeleton count={8} />
                    ) : filteredProducts.length === 0 ? (
                        <View className="h-64 items-center justify-center">
                            <Typography variant="h3" className="mb-2">No products found</Typography>
                            <Typography variant="body" color="muted" className="text-center">
                                Try adjusting your filters or search
                            </Typography>
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </Container>
    );
}
