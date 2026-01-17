import { View, Text, ScrollView, Image as RNImage, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Menu, Search, ShoppingBag, Heart, Clock, Zap, TrendingUp, ChevronRight } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Product, Banner, Category, Brand, Collection } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useRecentlyViewedStore } from '../../store/recentlyViewedStore';

const { width, height } = Dimensions.get('window');

// --- PREMIUM COMPONENTS (Nike/SNKRS Style) ---

const MemoizedProductCard = React.memo(({ item, isWholesaleUser, router, variant = 'standard' }: { item: Product, isWholesaleUser: boolean, router: any, variant?: 'standard' | 'grid' }) => {
    const displayPrice = isWholesaleUser && item.price_wholesale ? item.price_wholesale : (item.sale_price || item.price);
    const showSaleTag = !isWholesaleUser && item.is_on_sale;

    // Grid Variant (Big, 2-Column)
    const cardWidth = variant === 'grid' ? (width / 2) - 24 : 160;
    const cardHeight = variant === 'grid' ? 260 : 220;

    const getProductImage = (product: Product) => {
        if (product.thumbnail && product.thumbnail.startsWith('http')) return product.thumbnail;
        if (product.images && product.images.length > 0 && product.images[0].startsWith('http')) return product.images[0];
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
    };

    return (
        <TouchableOpacity
            onPress={() => router.push(`/product/${item.id}`)}
            style={{
                width: cardWidth,
                marginBottom: variant === 'grid' ? 24 : 0,
                marginRight: variant === 'grid' ? 0 : 16
            }}
        >
            <View style={{
                width: '100%',
                height: cardHeight * 0.75,
                backgroundColor: '#f6f6f6', // Premium Light Grey
                borderRadius: 4, // Sharper corners like Nike
                overflow: 'hidden',
                marginBottom: 10
            }}>
                <Image
                    source={{ uri: getProductImage(item) }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                    transition={300}
                    cachePolicy="memory-disk"
                />

                {showSaleTag && (
                    <View style={{ position: 'absolute', top: 10, left: 10 }}>
                        <Text style={{ color: '#ff3b30', fontSize: 10, fontWeight: '900', letterSpacing: 1 }}>SALE</Text>
                    </View>
                )}
            </View>

            <Text style={{ fontWeight: '800', fontSize: 14, color: '#111', textTransform: 'uppercase', letterSpacing: 0.5 }} numberOfLines={1}>
                {item.name}
            </Text>

            <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                {item.category?.name || 'Running'}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 }}>
                <Text style={{ fontWeight: '700', fontSize: 14 }}>₹{displayPrice?.toLocaleString()}</Text>
                {!isWholesaleUser && item.is_on_sale && item.sale_price && (
                    <Text style={{ color: '#999', fontSize: 12, textDecorationLine: 'line-through' }}>₹{item.price}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
});

// Category Images Map (Premium Retail Assets)
const CATEGORY_IMAGES: Record<string, string> = {
    'Men': 'https://images.unsplash.com/photo-1550246140-5119980d0d8f?w=600&q=80',
    'Women': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    'Kids': 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=80',
    'Sports': 'https://images.unsplash.com/photo-1518002171953-a080ee32280d?w=600&q=80',
    'Sneakers': 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
    'Formal': 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80',
    'Casual': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
    'Sandals': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80',
    'default': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80'
};

// Category "Story" Circles
const renderCategory = ({ item, router }: { item: Category, router: any }) => {
    // Priority: DB Image -> Static Map (Case Insensitive) -> Fallback
    const nameKey = Object.keys(CATEGORY_IMAGES).find(k => k.toLowerCase() === item.name.toLowerCase()) || 'default';
    const catImage = item.image_url || CATEGORY_IMAGES[nameKey] || CATEGORY_IMAGES['default'];

    return (
        <TouchableOpacity onPress={() => router.push(`/(tabs)/search?category=${encodeURIComponent(item.name)}`)} style={{ alignItems: 'center', marginRight: 18 }}>
            <View style={{
                width: 76, height: 76,
                borderRadius: 38,
                padding: 3,
                borderWidth: 2,
                borderColor: '#e5e5e5',
                marginBottom: 8
            }}>
                <View style={{ width: '100%', height: '100%', borderRadius: 38, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                    <Image source={{ uri: catImage }} style={{ width: '100%', height: '100%' }} contentFit="cover" cachePolicy="memory-disk" />
                </View>
            </View>
            <Text style={{ fontWeight: '600', fontSize: 10, color: '#111', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.name}</Text>
        </TouchableOpacity>
    );
};

// Minimal Brand Pills
const renderBrand = ({ item, router }: { item: Brand, router: any }) => {
    // Fallback for known brands if DB image is missing
    let logo = item.logo_url || item.logo;
    if (!logo || logo.length < 10) {
        if (item.name.toLowerCase().includes('nike')) logo = 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg';
        else if (item.name.toLowerCase().includes('adidas') || item.name.toLowerCase().includes('addida')) logo = 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg';
        else if (item.name.toLowerCase().includes('puma')) logo = 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_Logo.png';
        else logo = 'https://cdn-icons-png.flaticon.com/512/1598/1598822.png'; // Generic sneaker icon
    }

    return (
        <TouchableOpacity
            onPress={() => router.push(`/(tabs)/search?brand=${encodeURIComponent(item.name)}`)}
            style={{ alignItems: 'center', marginRight: 24 }}
        >
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Image source={{ uri: logo }} style={{ width: 35, height: 35 }} contentFit="contain" cachePolicy="memory-disk" />
            </View>
            <Text style={{ fontWeight: '700', fontSize: 10, color: '#111', letterSpacing: 0.5 }}>{item.name}</Text>
        </TouchableOpacity>
    );
};

// Immersive Hero
const renderHeroBanner = ({ item, router }: { item: Banner, router: any }) => (
    <View style={{ width, height: height * 0.55 }}>
        <Image
            source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
        />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'transparent' }} />

        <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 8, textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 10 }}>{item.subtitle || 'EXCLUSIVE DROP'}</Text>
            <Text style={{ color: 'white', fontSize: 42, fontWeight: '900', letterSpacing: -1, lineHeight: 42, marginBottom: 20, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 10 }}>
                {item.title || 'FUTURE\nREADY'}
            </Text>

            <TouchableOpacity onPress={() => item.product_id ? router.push(`/product/${item.product_id}`) : router.push('/(tabs)/search')}
                style={{ backgroundColor: 'white', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, alignSelf: 'flex-start' }}
            >
                <Text style={{ fontWeight: '900', fontSize: 14, color: 'black' }}>SHOP NOW</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// Collections - Fallback
const defaultCollections: Collection[] = [
    { id: '1', name: 'Summer Vibes', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400', count: 45 },
    { id: '2', name: 'Office Wear', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400', count: 32 },
    { id: '3', name: 'Sports Pro', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', count: 28 },
];

export default function Home() {
    const router = useRouter();
    const cartItems = useCartStore(s => s.items);
    const { user } = useAuthStore();
    const isWholesaleUser = user?.role === 'wholesale' && user?.is_verified;

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const [layout, setLayout] = useState<any[]>([]);
    const [marqueeConfig, setMarqueeConfig] = useState<any>(null);

    const flatListRef = useRef<FlatList>(null);

    // Fetch Data
    const fetchData = async () => {
        try {
            const [productsRes, bannersRes, categoriesRes, saleRes, brandsRes, collectionsRes, layoutRes, marqueeRes] = await Promise.all([
                supabase.from('products').select('id, name, price, sale_price, thumbnail, images, category(name), is_on_sale, is_new_arrival, price_wholesale, moq').eq('is_active', true).order('created_at', { ascending: false }).limit(20),
                supabase.from('hero_slides').select('*').eq('is_active', true).order('display_order'),
                supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
                supabase.from('products').select('id, name, price, sale_price, thumbnail, images, category(name), is_on_sale, is_new_arrival, price_wholesale, moq').eq('is_on_sale', true).eq('is_active', true).limit(10),
                supabase.from('brands').select('*').order('name'),
                supabase.from('collections').select('*').eq('is_active', true).order('name'),
                supabase.from('app_config').select('value').eq('key', 'home_layout').single(),
                supabase.from('app_config').select('value').eq('key', 'marquee_settings').single()
            ]);

            if (productsRes.data) setProducts(productsRes.data as any);
            if (bannersRes.data) setBanners(bannersRes.data);
            if (categoriesRes.data) setCategories(categoriesRes.data);
            if (saleRes.data) setSaleProducts(saleRes.data as any);
            if (brandsRes.data) setBrands(brandsRes.data);
            if (collectionsRes.data) setCollections(collectionsRes.data);
            if (marqueeRes.data?.value) setMarqueeConfig(marqueeRes.data.value);

            if (layoutRes.data?.value?.sections) {
                const sortedSections = layoutRes.data.value.sections
                    .filter((s: any) => s.visible)
                    .sort((a: any, b: any) => a.order - b.order);
                setLayout(sortedSections);
            } else setLayout([
                { id: 'marquee', visible: true, order: 0 },
                { id: 'hero_banner', visible: true, order: 1 },
                { id: 'categories', visible: true, order: 2 },
                { id: 'featured_drop', visible: true, order: 3 },
                { id: 'trending', visible: true, order: 4 },
                { id: 'new_arrivals', visible: true, order: 5 },
                { id: 'lookbook', visible: true, order: 6 },
                { id: 'member_unlock', visible: true, order: 7 },
                { id: 'brands', visible: true, order: 8 },
                { id: 'collections', visible: true, order: 9 },
                { id: 'recently_viewed', visible: true, order: 10 },
                { id: 'best_sellers', visible: true, order: 11 }
            ]);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Derived Data
    const defaultBanners: Banner[] = [
        { id: '1', title: 'NEW ARRIVALS', subtitle: 'Spring Collection 2026', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
        { id: '2', title: 'UPTO 50% OFF', subtitle: 'Limited Time Offer', image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800' },
    ];
    const displayBanners = banners.length > 0 ? banners : defaultBanners;
    const displayBrands = brands.length > 0 ? brands : [];
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


    const renderProductItem = React.useCallback(({ item }: { item: Product }) => (
        <MemoizedProductCard item={item} isWholesaleUser={!!isWholesaleUser} router={router} />
    ), [isWholesaleUser, router]);


    // --- Dynamic Section Renderers (Premium Layouts) ---
    const SectionRenderers: { [key: string]: () => React.ReactNode } = {
        'hero_banner': () => (
            <View>
                <FlatList ref={flatListRef} data={displayBanners} renderItem={({ item }) => renderHeroBanner({ item, router })} keyExtractor={(item) => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))} />
                {/* Clean, Thin Pagination Dots */}
                <View style={{ position: 'absolute', bottom: 15, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                    {displayBanners.map((_, i) => (<View key={i} style={{ width: activeSlide === i ? 20 : 6, height: 2, backgroundColor: activeSlide === i ? 'white' : 'rgba(255,255,255,0.4)' }} />))}
                </View>
            </View>
        ),
        'categories': () => (
            <View style={{ paddingVertical: 24, paddingLeft: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 16, paddingHorizontal: 4, letterSpacing: 0.5 }}>SHOP BY CATEGORY</Text>
                <FlatList data={categories.filter(c => c.name !== 'All')} renderItem={({ item }) => renderCategory({ item, router })} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }} />
            </View>
        ),
        'flash_sale': () => (saleProducts.length > 0) ? (
            <View style={{ backgroundColor: '#fff', paddingVertical: 20, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', letterSpacing: 0.5, color: '#ff3b30' }}>FLASH SALE ⚡</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                        <Clock size={12} color="#ff3b30" />
                        <Text style={{ color: '#ff3b30', fontSize: 10, fontWeight: 'bold' }}>Ends in 23:45:12</Text>
                    </View>
                </View>
                <FlatList
                    data={saleProducts}
                    renderItem={({ item }) => <MemoizedProductCard item={item} isWholesaleUser={!!isWholesaleUser} router={router} />}
                    keyExtractor={(item) => item.id + '_sale'}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </View>
        ) : null,
        'brands': () => (
            <View style={{ paddingVertical: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 16, paddingHorizontal: 20, letterSpacing: 0.5 }}>FEATURED BRANDS</Text>
                <FlatList data={displayBrands} renderItem={({ item }) => renderBrand({ item, router })} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }} />
            </View>
        ),
        'trending': () => {
            const vibes = [
                { id: '1', label: 'Retro Run', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
                { id: '2', label: 'Street', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400' },
                { id: '3', label: 'Minimal', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400' },
                { id: '4', label: 'Court', image: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=400' },
                { id: '5', label: 'Slides', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
            ];

            return (
                <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 16, letterSpacing: 0.5 }}>SHOP BY VIBE</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {vibes.map((vibe) => (
                            <TouchableOpacity key={vibe.id} onPress={() => router.push(`/(tabs)/search?q=${vibe.label}`)} style={{ width: 110, height: 110, marginRight: 12, borderRadius: 55, overflow: 'hidden', backgroundColor: '#f0f0f0', position: 'relative' }}>
                                <Image source={{ uri: vibe.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: '900', fontSize: 13, color: 'white', letterSpacing: 1, textTransform: 'uppercase' }}>{vibe.label}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            );
        },
        'featured_drop': () => {
            // Pick a "Drop" product (e.g., first new arrival)
            const dropProduct = products.find(p => p.is_new_arrival) || products[0];
            if (!dropProduct) return null;

            return (
                <View style={{ marginBottom: 30 }}>
                    <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#111', letterSpacing: 1 }}>THE LATEST DROP</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/product/${dropProduct.id}`)}>
                        <View style={{ width: width, height: 450 }}>
                            <Image
                                source={{ uri: dropProduct.images?.[0] || dropProduct.thumbnail || 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800' }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                            />
                            <View style={{ position: 'absolute', bottom: 30, left: 20 }}>
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10, overflow: 'hidden' }}>JUST LANDED</Text>
                                <Text style={{ color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: -1, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 10 }}>{dropProduct.name}</Text>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginTop: 8 }}>Shop Now →</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        },
        'lookbook': () => (
            <View style={{ marginBottom: 40 }}>
                <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', letterSpacing: -1, lineHeight: 28 }}>SEASON'S BEST</Text>
                    <Text style={{ color: '#666', fontSize: 14 }}>Curated styles for the urban explorer.</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {[
                        { id: 1, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', title: 'Street Tech', link: 'Street' },
                        { id: 2, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', title: 'Urban Minimal', link: 'Minimal' },
                        { id: 3, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800', title: 'Speed Defined', link: 'Running' }
                    ].map((look, i) => (
                        <View key={i} style={{ marginRight: 16, width: 280 }}>
                            <View style={{ height: 400, width: '100%', backgroundColor: '#eee', borderRadius: 0, overflow: 'hidden', marginBottom: 12 }}>
                                <Image source={{ uri: look.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 4 }}>{look.title}</Text>
                            <TouchableOpacity onPress={() => router.push(`/(tabs)/search?q=${look.link}`)}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', textDecorationLine: 'underline' }}>SHOP THE LOOK</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        ),
        'marquee': () => {
            if (!marqueeConfig || !marqueeConfig.visible) return null;
            const text = marqueeConfig.text || 'FREE SHIPPING ON ORDERS OVER ₹5000 • NEW B2B RATES LIVE • ';
            const bg = marqueeConfig?.background_color || '#111';
            const color = marqueeConfig?.text_color || '#fff';

            return (
                <View style={{ backgroundColor: bg, paddingVertical: 12, overflow: 'hidden', marginBottom: 20 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {Array(5).fill(text + '   •   ').map((t, i) => (
                                <Text key={i} style={{ color: color, fontWeight: 'bold', fontSize: 12, marginRight: 20 }}>{t}</Text>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            );
        },
        'new_arrivals': () => (
            <View style={{ paddingBottom: 20 }}>
                {/* Integration of Featured Drop before Grid if desired, or keep separate via layout order */}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: '900', letterSpacing: 0.5 }}>JUST DROPPED</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/search')}><Text style={{ color: '#111', fontWeight: '700', fontSize: 12 }}>VIEW ALL</Text></TouchableOpacity>
                </View>

                {/* 2-COLUMN GRID (Flex Wrap) */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between' }}>
                    {loading ? <ActivityIndicator size="large" color="black" /> : (
                        (products.filter(p => p.is_new_arrival).length > 0 ? products.filter(p => p.is_new_arrival) : products.slice(0, 6)).map((item) => (
                            <MemoizedProductCard key={item.id + '_grid'} item={item} isWholesaleUser={!!isWholesaleUser} router={router} variant="grid" />
                        ))
                    )}
                </View>
            </View>
        ),
        'collections': () => (
            <View style={{ paddingVertical: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 16, paddingHorizontal: 16, letterSpacing: 0.5 }}>CURATED COLLECTIONS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {displayCollections.map((col) => (
                        <TouchableOpacity key={col.id} onPress={() => router.push(`/(tabs)/search?collection=${encodeURIComponent(col.name)}`)} style={{ width: 220, marginRight: 12 }}>
                            <View style={{ width: 220, height: 280, borderRadius: 4, overflow: 'hidden', marginBottom: 8, backgroundColor: '#eee' }}>
                                <Image source={{ uri: col.image_url || col.image || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400' }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={500} />
                                <View style={{ position: 'absolute', bottom: 20, left: 20 }}>
                                    <Text style={{ color: 'white', fontWeight: '900', fontSize: 24, letterSpacing: -1, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 5 }}>{col.name}</Text>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, marginTop: 4 }}>SHOP COLLECTION →</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        ),
        'member_banner': () => (
            <TouchableOpacity style={{ marginHorizontal: 16, marginBottom: 30, height: 160, backgroundColor: '#111', flexDirection: 'row', overflow: 'hidden' }}>
                <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 }}>MEMBER ACCESS</Text>
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: '900', lineHeight: 28, marginBottom: 12 }}>UNLOCK THE\nBEST OF NIKE</Text>
                    <View style={{ backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>JOIN US</Text>
                    </View>
                </View>
                <View style={{ width: 120, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 50, opacity: 0.2 }}>⚡</Text>
                </View>
            </TouchableOpacity>
        ),
        'best_sellers': () => (
            <View style={{ paddingVertical: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 16, paddingHorizontal: 16, letterSpacing: 0.5 }}>BEST SELLERS</Text>
                <FlatList
                    data={products.slice(0, 8)}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id + '_best'}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </View>
        ),
        'recently_viewed': () => {
            const recentProducts = useRecentlyViewedStore.getState().products;
            if (recentProducts.length === 0) return null;
            return (
                <View style={{ paddingVertical: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 16, paddingHorizontal: 16, letterSpacing: 0.5 }}>RECENTLY VIEWED</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {recentProducts.map((item) => (
                            <MemoizedProductCard key={item.id + '_recent'} item={item} isWholesaleUser={!!isWholesaleUser} router={router} />
                        ))}
                    </ScrollView>
                </View>
            );
        },
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

            {/* Full-Screen Loading Overlay */}
            {loading && (
                <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'white',
                    justifyContent: 'center', alignItems: 'center', zIndex: 200
                }}>
                    <Text style={{ fontSize: 28, fontWeight: '900', letterSpacing: 4, color: '#111', marginBottom: 20 }}>MATOSHREE</Text>
                    <ActivityIndicator size="large" color="black" />
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {layout.map((section, index) => {
                    if (!section.visible) return null;
                    const Renderer = SectionRenderers[section.id];
                    return Renderer ? <View key={index}>{Renderer()}</View> : null;
                })}

                {/* Footer - Only show when not loading */}
                {!loading && (
                    <View style={{ paddingVertical: 35, paddingHorizontal: 20, backgroundColor: '#0a0a0a', marginTop: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: '900', letterSpacing: 5, color: 'white', marginBottom: 5 }}>MATOSHREE</Text>
                        <Text style={{ color: '#666', fontSize: 10, letterSpacing: 2, marginBottom: 25, textTransform: 'uppercase' }}>Est. 1999 • Premium Footwear</Text>

                        <View style={{ width: 40, height: 1, backgroundColor: '#333', marginBottom: 25 }} />

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', rowGap: 15, columnGap: 25, marginBottom: 30 }}>
                            <TouchableOpacity onPress={() => router.push('/about')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>About Us</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/contact')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>Contact</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/privacy')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>Privacy Policy</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/terms')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>Terms</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/help')}><Text style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>Help Center</Text></TouchableOpacity>
                        </View>

                        <Text style={{ color: '#333', fontSize: 9, letterSpacing: 1 }}>© 2026 MATOSHREE. INC. ALL RIGHTS RESERVED.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
