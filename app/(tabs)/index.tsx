import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Menu, Search, ShoppingBag, Heart, Clock, Zap, TrendingUp, ChevronRight } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Product, Banner, Category, Brand, Collection } from '../../types';
import { useCartStore } from '../../store/cartStore';

const { width, height } = Dimensions.get('window');

// Real Brand Logos (CDN URLs that work) - Fallback
const defaultBrands: Brand[] = [
    { id: '1', name: 'Nike', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-nike-1-202653.png' },
    { id: '2', name: 'Adidas', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-adidas-3-202636.png' },
    { id: '3', name: 'Puma', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-puma-2-202652.png' },
    { id: '4', name: 'Reebok', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-reebok-2-202654.png' },
    { id: '5', name: 'New Balance', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-new-balance-202649.png' },
    { id: '6', name: 'Converse', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-converse-202641.png' },
    { id: '7', name: 'Vans', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-vans-202660.png' },
    { id: '8', name: 'Fila', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-fila-202644.png' },
];

const CATEGORY_IMAGES: { [key: string]: string } = {
    'men': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    'women': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop',
    'kids': 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=200&h=200&fit=crop',
    'sandals': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=200&fit=crop',
    'sports': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop',
    'sneakers': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=200&h=200&fit=crop',
    'formal': 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=200&h=200&fit=crop',
};

// Collections - Fallback
const defaultCollections: Collection[] = [
    { id: '1', name: 'Summer Vibes', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400', count: 45 },
    { id: '2', name: 'Office Wear', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400', count: 32 },
    { id: '3', name: 'Sports Pro', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', count: 28 },
];

export default function Home() {
    const router = useRouter();
    const cartItems = useCartStore(s => s.items);
    const [products, setProducts] = useState<Product[]>([]);
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);

    const flatListRef = useRef<FlatList>(null);

    const fetchData = async () => {
        try {
            const [productsRes, bannersRes, categoriesRes, saleRes, brandsRes, collectionsRes] = await Promise.all([
                supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(20),
                supabase.from('hero_slides').select('*').eq('is_active', true).order('display_order'),
                supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
                supabase.from('products').select('*').eq('is_on_sale', true).eq('is_active', true).limit(10),
                supabase.from('brands').select('*').order('name'),
                supabase.from('collections').select('*').eq('is_active', true).order('name')
            ]);

            if (productsRes.data) setProducts(productsRes.data);
            if (bannersRes.data) setBanners(bannersRes.data);
            if (categoriesRes.data) setCategories(categoriesRes.data);
            if (saleRes.data) setSaleProducts(saleRes.data);
            if (brandsRes.data) setBrands(brandsRes.data);
            if (collectionsRes.data) setCollections(collectionsRes.data);
        } catch (error) {
            console.log('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Helper for Banners
    const defaultBanners: Banner[] = [
        { id: '1', title: 'NEW ARRIVALS', subtitle: 'Spring Collection 2026', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
        { id: '2', title: 'UPTO 50% OFF', subtitle: 'Limited Time Offer', image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800' },
    ];
    const displayBanners = banners.length > 0 ? banners : defaultBanners;

    // Helper for Brands & Collections
    const displayBrands = brands.length > 0 ? brands : defaultBrands;
    const displayCollections = collections.length > 0 ? collections : defaultCollections;

    // Auto-scroll hero
    useEffect(() => {
        if (displayBanners.length <= 1) return;
        const timer = setInterval(() => {
            const nextIndex = (activeSlide + 1) % displayBanners.length;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setActiveSlide(nextIndex);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeSlide, displayBanners.length]);

    const getProductImage = (product: Product) => {
        if (product.thumbnail && product.thumbnail.startsWith('http')) return product.thumbnail;
        if (product.images && product.images.length > 0 && product.images[0].startsWith('http')) return product.images[0];
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

    const renderHeroBanner = ({ item }: { item: Banner }) => (
        <View style={{ width, height: height * 0.48 }}>
            <Image source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25, paddingBottom: 40, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: 3, marginBottom: 8 }}>{item.subtitle || 'PREMIUM FOOTWEAR'}</Text>
                <Text style={{ color: 'white', fontSize: 34, fontWeight: '900', letterSpacing: -1, marginBottom: 18 }}>{item.title || 'DISCOVER STYLE'}</Text>
                <TouchableOpacity onPress={() => item.product_id ? router.push(`/product/${item.product_id}`) : router.push('/(tabs)/search')} style={{ backgroundColor: 'white', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 25, alignSelf: 'flex-start' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13 }}>SHOP NOW</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderProductCard = ({ item }: { item: Product }) => (
        <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)} style={{ width: 155, marginRight: 12 }}>
            <View style={{ width: 155, height: 175, backgroundColor: '#f5f5f5', borderRadius: 14, overflow: 'hidden', marginBottom: 10 }}>
                <Image source={{ uri: getProductImage(item) }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                {item.is_on_sale && (
                    <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#ff3b30', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 }}>
                        <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>SALE</Text>
                    </View>
                )}
                <TouchableOpacity style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, backgroundColor: 'white', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <Heart size={14} color="#333" />
                </TouchableOpacity>
            </View>
            <Text style={{ fontWeight: '600', fontSize: 13, marginBottom: 3 }} numberOfLines={1}>{item.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>₹{(item.sale_price || item.price)?.toLocaleString()}</Text>
                {item.is_on_sale && item.sale_price && (
                    <Text style={{ color: '#999', fontSize: 11, textDecorationLine: 'line-through' }}>₹{item.price}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderCategory = ({ item }: { item: Category }) => {
        const catImage = CATEGORY_IMAGES[item.name.toLowerCase()] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200';
        return (
            <TouchableOpacity onPress={() => router.push(`/(tabs)/search?category=${encodeURIComponent(item.name)}`)} style={{ alignItems: 'center', marginRight: 16 }}>
                <View style={{ width: 70, height: 70, backgroundColor: '#f0f0f0', borderRadius: 35, overflow: 'hidden', marginBottom: 8, borderWidth: 2, borderColor: '#eee' }}>
                    <Image source={{ uri: catImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>
                <Text style={{ fontWeight: '600', fontSize: 12, color: '#333' }}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderBrand = ({ item }: { item: Brand }) => {
        const logo = item.logo_url || item.logo || 'https://via.placeholder.com/100';
        return (
            <TouchableOpacity
                onPress={() => router.push(`/(tabs)/search?brand=${encodeURIComponent(item.name)}`)}
                style={{ alignItems: 'center', marginRight: 14 }}
            >
                <View style={{ width: 70, height: 70, backgroundColor: 'white', borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 6, borderWidth: 1.5, borderColor: '#eee', padding: 14 }}>
                    <Image source={{ uri: logo }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                <Text style={{ fontWeight: '600', fontSize: 11, color: '#333' }}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="light-content" />

            {/* Floating Header */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, paddingTop: 48, paddingHorizontal: 18, paddingBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={{ width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 21, justifyContent: 'center', alignItems: 'center' }}>
                        <Menu size={20} color="#000" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: 'white', letterSpacing: 2 }}>MATOSHREE</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/search')} style={{ width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 21, justifyContent: 'center', alignItems: 'center' }}>
                            <Search size={18} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={{ width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 21, justifyContent: 'center', alignItems: 'center' }}>
                            <ShoppingBag size={18} color="#000" />
                            {cartItems.length > 0 && (
                                <View style={{ position: 'absolute', top: -2, right: -2, backgroundColor: '#ff3b30', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>{cartItems.length}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Hero Carousel */}
                <View>
                    <FlatList ref={flatListRef} data={displayBanners} renderItem={renderHeroBanner} keyExtractor={(item) => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))} />
                    <View style={{ position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
                        {displayBanners.map((_, i) => (<View key={i} style={{ width: activeSlide === i ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: activeSlide === i ? 'white' : 'rgba(255,255,255,0.5)' }} />))}
                    </View>
                </View>

                {/* Categories with Icons */}
                <View style={{ paddingVertical: 22 }}>
                    <Text style={{ fontSize: 17, fontWeight: '700', marginBottom: 14, paddingHorizontal: 18 }}>Shop by Category</Text>
                    <FlatList
                        data={categories.filter(c => c.name !== 'All')}
                        renderItem={renderCategory}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 18 }}
                    />
                </View>

                {/* ⚡ Flash Sale */}
                {(saleProducts.length > 0 || products.length > 0) && (
                    <View style={{ backgroundColor: '#fff8e1', paddingVertical: 20, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginBottom: 14 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Zap size={20} color="#f57c00" fill="#f57c00" />
                                <Text style={{ fontSize: 17, fontWeight: '800', color: '#e65100' }}>Flash Sale</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Clock size={14} color="#666" />
                                <Text style={{ color: '#666', fontSize: 12 }}>Ends in 23:45:12</Text>
                            </View>
                        </View>
                        <FlatList data={saleProducts.length > 0 ? saleProducts : products.slice(0, 5)} renderItem={renderProductCard} keyExtractor={(item) => item.id + '_sale'} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }} />
                    </View>
                )}

                {/* 🏷️ Shop by Brand - Real Logos */}
                <View style={{ paddingVertical: 20 }}>
                    <Text style={{ fontSize: 17, fontWeight: '700', marginBottom: 14, paddingHorizontal: 18 }}>Shop by Brand</Text>
                    <FlatList
                        data={displayBrands}
                        renderItem={renderBrand}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 18 }}
                    />
                </View>

                {/* 🔥 Trending Hashtags */}
                <View style={{ paddingHorizontal: 18, paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <TrendingUp size={18} color="#333" />
                        <Text style={{ fontSize: 17, fontWeight: '700' }}>Trending</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {['SummerStyle', 'RunningShoes', 'CasualWear', 'OfficeLook', 'Sneakerhead', 'ComfortFirst'].map((tag, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => router.push(`/(tabs)/search?q=${tag}`)}
                                style={{ backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10 }}
                            >
                                <Text style={{ fontWeight: '600', color: '#333' }}>#{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* New Arrivals */}
                <View style={{ paddingBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingHorizontal: 18 }}>
                        <Text style={{ fontSize: 17, fontWeight: '700' }}>New Arrivals</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/search')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#666', fontWeight: '600', fontSize: 13 }}>See All</Text>
                            <ChevronRight size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color="black" style={{ marginVertical: 30 }} />
                    ) : (
                        <FlatList data={products.filter(p => p.is_new_arrival).length > 0 ? products.filter(p => p.is_new_arrival) : products.slice(0, 6)} renderItem={renderProductCard} keyExtractor={(item) => item.id + '_new'} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }} />
                    )}
                </View>

                {/* 🎨 Shop by Collection */}
                <View style={{ paddingVertical: 20 }}>
                    <Text style={{ fontSize: 17, fontWeight: '700', marginBottom: 14, paddingHorizontal: 18 }}>Shop by Collection</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }}>
                        {displayCollections.map((col) => (
                            <TouchableOpacity key={col.id} style={{ width: 150, marginRight: 12 }}>
                                <View style={{ width: 150, height: 180, borderRadius: 14, overflow: 'hidden', marginBottom: 8 }}>
                                    <Image source={{ uri: col.image_url || col.image || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400' }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>{col.name}</Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>{col.count || 0} items</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Member Banner */}
                <TouchableOpacity style={{ marginHorizontal: 18, marginBottom: 25, height: 130, backgroundColor: '#111', borderRadius: 18, flexDirection: 'row', overflow: 'hidden' }}>
                    <View style={{ flex: 1, padding: 18, justifyContent: 'center' }}>
                        <Text style={{ color: '#888', fontSize: 10, letterSpacing: 2, marginBottom: 4 }}>MEMBER EXCLUSIVE</Text>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '900', marginBottom: 8 }}>GET 20% OFF</Text>
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>Join Free →</Text>
                    </View>
                    <View style={{ width: 110, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 40 }}>🎁</Text>
                    </View>
                </TouchableOpacity>

                {/* Best Sellers */}
                <View style={{ paddingVertical: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingHorizontal: 18 }}>
                        <Text style={{ fontSize: 17, fontWeight: '700' }}>Best Sellers</Text>
                        <TouchableOpacity><Text style={{ color: '#666', fontWeight: '600', fontSize: 13 }}>See All</Text></TouchableOpacity>
                    </View>
                    <FlatList data={products.slice(0, 8)} renderItem={renderProductCard} keyExtractor={(item) => item.id + '_best'} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }} />
                </View>

                {/* Footer */}
                {/* Footer */}
                <View style={{ paddingVertical: 35, paddingHorizontal: 20, backgroundColor: '#0a0a0a', marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', letterSpacing: 5, color: 'white', marginBottom: 5 }}>MATOSHREE</Text>
                    <Text style={{ color: '#666', fontSize: 10, letterSpacing: 2, marginBottom: 25, textTransform: 'uppercase' }}>Est. 1999 • Premium Footwear</Text>

                    <View style={{ width: 40, height: 1, backgroundColor: '#333', marginBottom: 25 }} />

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', rowGap: 15, columnGap: 25, marginBottom: 30 }}>
                        <TouchableOpacity onPress={() => router.push('/about')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>About Us</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/contact')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>Contact</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/privacy')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>Privacy Policy</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/terms')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>Terms used</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/help')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>Help Center</Text></TouchableOpacity>
                    </View>

                    <Text style={{ color: '#333', fontSize: 9, letterSpacing: 1 }}>© 2026 MATOSHREE. INC. ALL RIGHTS RESERVED.</Text>
                </View>
            </ScrollView>
        </View>
    );
}
