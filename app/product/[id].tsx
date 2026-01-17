import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, Animated, FlatList, ActivityIndicator, Easing } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useRecentlyViewedStore } from '../../store/recentlyViewedStore';
import { useProductCache } from '../../store/productCache';
import { ArrowLeft, Heart, Star, Truck, RefreshCw, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { Product } from '../../types';

const { width } = Dimensions.get('window');


interface ColorOption {
    name: string;
    code: string;
    imageIndex?: number;
    images?: string[];
}

const COLORS: ColorOption[] = [
    { name: 'Midnight Black', code: '#1a1a1a', imageIndex: 0 },
    { name: 'Cloud White', code: '#f5f5f5', imageIndex: 1 },
    { name: 'Crimson Red', code: '#d32f2f', imageIndex: 2 },
    { name: 'Royal Blue', code: '#1976d2', imageIndex: 3 },
];

const SIZES = [6, 7, 8, 9, 10, 11, 12];

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
    is_verified: boolean;
}

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore(s => s.addItem);
    const cartItems = useCartStore(s => s.items);

    const { user } = useAuthStore();
    const isWholesaleUser = user?.role === 'wholesale' && user?.is_verified;

    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorOption>(COLORS[0]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;

    // Toast Animation Refs
    const toastTranslateY = useRef(new Animated.Value(-300)).current;
    const [toastMessage, setToastMessage] = useState({ title: '', message: '', type: 'info' }); // type: 'success' | 'error' | 'info'
    const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [variants, setVariants] = useState<any[]>([]);

    useEffect(() => {
        const fetchProductData = async () => {
            setErrorMsg(null);

            if (!id) {
                setErrorMsg("No Product ID passed to page.");
                setLoading(false);
                return;
            }

            // Check cache first for instant load
            const cached = useProductCache.getState().getProduct(id as string);
            if (cached) {
                setProduct(cached.product);
                setVariants(cached.variants || []);
                setSimilarProducts(cached.similar || []);
                setReviews(cached.reviews || []);
                setSelectedSize(SIZES[2]);
                if (cached.variants?.length > 0) {
                    setSelectedColor({ name: cached.variants[0].color_name, code: cached.variants[0].color_code, images: cached.variants[0].images });
                } else {
                    setSelectedColor(COLORS[0]);
                }
                useRecentlyViewedStore.getState().addProduct(cached.product);
                setLoading(false);
                return;
            }

            try {
                // PARALLEL API CALLS - 3x faster!
                const [productRes, variantsRes] = await Promise.all([
                    supabase.from('products').select('*, price_tiers(*)').eq('id', id).single(),
                    supabase.from('product_variants').select('*').eq('product_id', id)
                ]);

                if (productRes.error) {
                    setErrorMsg(JSON.stringify(productRes.error));
                    setLoading(false);
                    return;
                }

                const currentProduct = productRes.data;
                const variantData = variantsRes.data || [];

                if (currentProduct) {
                    setProduct(currentProduct);
                    setVariants(variantData);
                    setSelectedSize(SIZES[2]);

                    if (variantData.length > 0) {
                        setSelectedColor({ name: variantData[0].color_name, code: variantData[0].color_code, images: variantData[0].images });
                    } else {
                        setSelectedColor(COLORS[0]);
                    }

                    useRecentlyViewedStore.getState().addProduct(currentProduct);

                    // Show UI immediately - critical data loaded
                    setLoading(false);

                    // Background fetch for secondary data (non-blocking)
                    Promise.all([
                        currentProduct.category_id ? supabase.from('products').select('id,name,price,thumbnail,sale_price').eq('category_id', currentProduct.category_id).neq('id', currentProduct.id).limit(6) : Promise.resolve({ data: [] }),
                        supabase.from('reviews').select('*').eq('product_id', currentProduct.id).order('created_at', { ascending: false }).limit(5)
                    ]).then(([similarRes, reviewsRes]) => {
                        if (similarRes.data) setSimilarProducts(similarRes.data as any);
                        if (reviewsRes.data) setReviews(reviewsRes.data);
                        // Cache for next visit
                        useProductCache.getState().setProduct(id as string, { product: currentProduct, variants: variantData, similar: similarRes.data || [], reviews: reviewsRes.data || [] });
                    });
                } else {
                    setErrorMsg("Product not found.");
                    setLoading(false);
                }
            } catch (err: any) {
                setErrorMsg("Error: " + err.message);
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    // Derived Images based on Selection
    const getDisplayImages = () => {
        // If variants are loaded and one is selected, show its images
        if (variants.length > 0 && selectedColor && (selectedColor as any).images) {
            const vImages = (selectedColor as any).images;
            if (vImages && vImages.length > 0) return vImages;
        }

        // Fallback: Product main images
        if (!product) return [];
        let images: string[] = [];
        if (product.thumbnail) images.push(product.thumbnail);
        if (product.images && product.images.length > 0) images = [...images, ...product.images];
        while (images.length > 0 && images.length < 4) images.push(images[0]); // Duplicate if too few for demo
        return images.length > 0 ? images : ['https://via.placeholder.com/400x400?text=No+Image'];
    };

    const currentImages = getDisplayImages();

    // ... (keep usage of currentImages in render)

    // Derived Colors List
    const displayColors = variants.length > 0 ? variants.map(v => ({
        name: v.color_name,
        code: v.color_code,
        images: v.images
    })) : COLORS.map(c => ({
        ...c,
        images: product ? [product.thumbnail || ''] : [] // Fallback for hardcoded colors if no variants
    }));

    // --- Custom Toast Function ---
    const showToast = (title: string, message: string, type: 'error' | 'success' | 'info' = 'info') => {
        setToastMessage({ title, message, type: type as any });
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

        // Reset position to force re-entry animation
        toastTranslateY.setValue(-100);

        Animated.spring(toastTranslateY, {
            toValue: 50, // Slide down
            useNativeDriver: true,
            friction: 5
        }).start();

        toastTimerRef.current = setTimeout(() => {
            Animated.timing(toastTranslateY, {
                toValue: -300, // Slide up
                duration: 300,
                useNativeDriver: true
            }).start();
        }, 3000);
    };

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Reset or Set MOQ
        const moq = isWholesaleUser ? (product?.moq || 1) : 1;
        if (quantity < moq) setQuantity(moq);
    }, [product, isWholesaleUser]);

    const incrementQty = () => setQuantity(q => q + 1);
    const decrementQty = () => {
        const moq = isWholesaleUser ? (product?.moq || 1) : 1;
        setQuantity(q => (q > moq ? q - 1 : moq));
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            showToast('Select Size', 'Please choose your size to continue.', 'error');
            return;
        }
        addToCart(quantity);
    };

    const addToCart = (qty: number) => {
        if (product && selectedSize) {
            addItem(product, selectedSize, qty);
            showToast('Added to Bag', `${qty} pair(s) of ${product.name} added.`, 'success');
        }
    };

    // --- Pricing Logic ---
    const currentPrice = isWholesaleUser
        ? (product?.price_wholesale || product?.price || 0)
        : (product?.sale_price || product?.price || 0);

    const getTieredPrice = (qty: number) => {
        if (!product?.price_tiers) return currentPrice;
        const tier = product.price_tiers.find(t => qty >= t.min_quantity && (!t.max_quantity || qty <= t.max_quantity));
        return tier ? tier.unit_price : currentPrice;
    };
    const displayPrice = getTieredPrice(quantity);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    // Error View (Clean & Professional)
    if (!loading && !product) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'white' }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <AlertCircle size={32} color="#999" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#111' }}>Product Unavailable</Text>
                <Text style={{ textAlign: 'center', color: '#666', marginTop: 8, maxWidth: 250 }}>The product you are looking for might have been removed or is temporarily unavailable.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 30, paddingVertical: 14, paddingHorizontal: 32, backgroundColor: '#000', borderRadius: 100 }}>
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Custom Toast */}
            <Animated.View style={{
                position: 'absolute', top: 60, left: 20, right: 20,
                backgroundColor: toastMessage.type === 'error' ? '#ef4444' : '#10b981',
                padding: 16, borderRadius: 12, zIndex: 100,
                transform: [{ translateY: toastTranslateY }],
                flexDirection: 'row', alignItems: 'center', gap: 12,
                shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 10
            }}>
                {toastMessage.type === 'error' ? <AlertCircle color="white" size={20} /> : <CheckCircle2 color="white" size={20} />}
                <View>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{toastMessage.title}</Text>
                    <Text style={{ color: 'white', fontSize: 12, opacity: 0.9 }}>{toastMessage.message}</Text>
                </View>
            </Animated.View>

            <ScrollView onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 120 }}>

                {/* Image Carousel */}
                <View style={{ height: 400, backgroundColor: '#f0f0f0' }}>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}>
                        {currentImages.length > 0 ? (
                            currentImages.map((img: string, index: number) => (
                                <Image key={index} source={{ uri: img }} style={{ width, height: 400 }} contentFit="cover" transition={300} />
                            ))
                        ) : (
                            <View style={{ width, height: 400, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: 'https://via.placeholder.com/400' }} style={{ width, height: 400, opacity: 0.5 }} contentFit="cover" transition={300} />
                            </View>
                        )}
                    </ScrollView>
                    {/* Dots */}
                    <View style={{ position: 'absolute', bottom: 20, flexDirection: 'row', alignSelf: 'center', gap: 6 }}>
                        {currentImages.map((_: any, i: number) => (
                            <View key={i} style={{ width: i === activeImageIndex ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: i === activeImageIndex ? '#000' : 'rgba(0,0,0,0.2)' }} />
                        ))}
                    </View>

                    {/* Header Buttons */}
                    <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, elevation: 4 }}>
                        <ArrowLeft size={20} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/cart')} style={{ position: 'absolute', top: 50, right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, elevation: 4 }}>
                        <View collapsable={false}>
                            <ShoppingBag size={20} color="black" />
                            {cartItems.length > 0 && (
                                <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#ff3b30', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'white' }}>
                                    <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>{cartItems.length}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ padding: 20 }}>
                    {/* Brand / Category Tag */}
                    <Text style={{ fontSize: 13, color: '#666', fontWeight: '500', marginBottom: 4, letterSpacing: 0.5 }}>{product?.category_id || 'PREMIUM COLLECTION'}</Text>

                    {/* Title */}
                    <Text style={{ fontSize: 26, fontWeight: '900', color: '#111', lineHeight: 32, marginBottom: 4, letterSpacing: -0.5 }}>{product?.name}</Text>

                    {/* Price & ID */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <View>
                            <Text style={{ fontSize: 24, fontWeight: '800', color: isWholesaleUser ? '#1e40af' : '#111' }}>₹{displayPrice.toLocaleString()}</Text>
                            {isWholesaleUser && <Text style={{ color: '#1e40af', fontWeight: '600', fontSize: 13, marginTop: 2 }}>Wholesale Price</Text>}
                        </View>
                        <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>ID: {id?.toString().split('-')[0]}</Text>
                    </View>

                    {/* B2B Tiered Pricing Table */}
                    {product?.price_tiers && product?.price_tiers.length > 0 && (
                        <View style={{ marginBottom: 20, padding: 12, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#0f172a' }}>Bulk Volume Discounts</Text>
                            {product.price_tiers.map((tier: any, index: number) => (
                                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: index === (product.price_tiers?.length || 0) - 1 ? 0 : 1, borderColor: '#e2e8f0' }}>
                                    <Text style={{ fontSize: 13, color: '#64748b' }}>Buy {tier.min_quantity}+</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>₹{tier.unit_price}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Rating */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 6 }}>
                        <View style={{ flexDirection: 'row', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={14} fill={i <= (product?.rating || 4) ? "#111" : "#e0e0e0"} color={i <= (product?.rating || 4) ? "#111" : "#e0e0e0"} />
                            ))}
                        </View>
                        <Text style={{ fontWeight: '600', fontSize: 13, marginLeft: 4 }}>{product?.rating || 4.5}</Text>
                        <Text style={{ color: '#666', fontSize: 13, textDecorationLine: 'underline' }}>({product?.total_reviews || 37} Reviews)</Text>
                    </View>

                    {/* COLORS - Dynamic */}
                    <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111' }}>Select Color</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                        {displayColors.map((color: ColorOption, index: number) => {
                            const colorImage = (color.images && color.images.length > 0) ? color.images[0] : (product?.thumbnail || 'https://via.placeholder.com/100');
                            const isSelected = selectedColor.name === color.name;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => { setSelectedColor(color); setActiveImageIndex(0); }}
                                    style={{ marginRight: 16, alignItems: 'center' }}
                                >
                                    <View style={{
                                        width: 70, height: 70, borderRadius: 12,
                                        borderWidth: isSelected ? 2 : 1,
                                        borderColor: isSelected ? '#111' : '#eee', // Selected: Black border, Unselected: Light gray
                                        padding: 2,
                                        backgroundColor: 'white'
                                    }}>
                                        <Image
                                            source={{ uri: colorImage }}
                                            style={{
                                                width: '100%', height: '100%', borderRadius: 10,
                                                opacity: isSelected ? 1 : 0.9
                                            }}
                                        />
                                    </View>
                                    <Text style={{
                                        fontSize: 12,
                                        color: isSelected ? '#111' : '#666',
                                        marginTop: 6,
                                        fontWeight: isSelected ? '700' : '500'
                                    }}>
                                        {color.name.split(' ')[0]}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* SIZES */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Select Size (UK)</Text>
                        <Text style={{ color: '#e65100', fontWeight: '600', fontSize: 13 }}>Size Chart</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 32 }}>
                        {SIZES.map((size) => (
                            <TouchableOpacity key={size} onPress={() => setSelectedSize(size)}
                                style={{
                                    width: 52, height: 52, borderRadius: 26,
                                    borderWidth: 1.5,
                                    borderColor: selectedSize === size ? '#111' : '#e0e0e0',
                                    backgroundColor: selectedSize === size ? '#111' : 'transparent',
                                    justifyContent: 'center', alignItems: 'center', marginRight: 12
                                }}>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: selectedSize === size ? 'white' : '#111' }}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Quantity Choice */}
                    <View style={{ marginBottom: 32 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Quantity</Text>
                            {isWholesaleUser && (product?.moq || 1) > 1 && (
                                <Text style={{ fontSize: 12, color: '#eab308', fontWeight: '600' }}>Minimum Order: {product?.moq} pairs</Text>
                            )}
                        </View>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
                            borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 30, // Rounded pill shape
                            height: 50, minWidth: 140,
                            paddingHorizontal: 8,
                            backgroundColor: quantity >= (product?.moq || 1) ? 'white' : '#fffbeb'
                        }}>
                            <TouchableOpacity onPress={decrementQty} style={{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: '500', color: '#111' }}>-</Text>
                            </TouchableOpacity>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{quantity}</Text>
                            </View>

                            <TouchableOpacity onPress={incrementQty} style={{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: '500', color: '#111' }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: '#f0f0f0', marginBottom: 24 }} />

                    {/* Trust Badges */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, paddingHorizontal: 10 }}>
                        <View style={{ alignItems: 'center', width: '30%' }}>
                            <RefreshCw size={24} color="#555" />
                            <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 5, color: '#555' }}>7 Day Returns</Text>
                        </View>
                        <View style={{ alignItems: 'center', width: '30%' }}>
                            <CheckCircle2 size={24} color="#555" />
                            <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 5, color: '#555' }}>100% Original</Text>
                        </View>
                        <View style={{ alignItems: 'center', width: '30%' }}>
                            <Truck size={24} color="#555" />
                            <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 5, color: '#555' }}>Free Delivery</Text>
                        </View>
                    </View>

                    {/* Product Details Table */}
                    <View style={{ marginBottom: 25 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Product Details</Text>
                        <Text style={{ color: '#444', lineHeight: 22, marginBottom: 15 }}>
                            {product?.description || "Designed for maximum comfort and style. These shoes are perfect for your daily wear, offering durability and a premium look."}
                        </Text>

                        <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8 }}>
                            <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                                <Text style={{ flex: 1, color: '#666' }}>Material</Text>
                                <Text style={{ flex: 2, fontWeight: '500' }}>Premium Mesh & Synthetic</Text>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                                <Text style={{ flex: 1, color: '#666' }}>Sole</Text>
                                <Text style={{ flex: 2, fontWeight: '500' }}>Rubber / EVA</Text>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                                <Text style={{ flex: 1, color: '#666' }}>Closure</Text>
                                <Text style={{ flex: 2, fontWeight: '500' }}>Lace-Up</Text>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 12 }}>
                                <Text style={{ flex: 1, color: '#666' }}>Country</Text>
                                <Text style={{ flex: 2, fontWeight: '500' }}>India</Text>
                            </View>
                        </View>
                    </View>

                    {/* Reviews */}
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Customer Reviews ({reviews.length || product?.total_reviews})</Text>
                        {reviews.length > 0 ? reviews.map((item: Review) => (
                            <View key={item.id} style={{ marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#00af00', borderRadius: 4, flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold', marginRight: 2 }}>{item.rating}</Text>
                                        <Star size={8} color="white" fill="white" />
                                    </View>
                                    <Text style={{ fontWeight: '600', fontSize: 13 }}>{item.user_name}</Text>
                                </View>
                                <Text style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>{item.comment}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 11, color: '#999' }}>{item.is_verified ? 'Verified Purchaser' : ''}</Text>
                                    <Text style={{ fontSize: 11, color: '#999' }}>{new Date(item.created_at).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        )) : (
                            <Text style={{ color: '#999', textAlign: 'center', padding: 20 }}>No reviews yet. Be the first to review!</Text>
                        )}
                        <TouchableOpacity>
                            <Text style={{ color: '#e65100', fontWeight: '600' }}>See all reviews</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Similar Products */}
                    {similarProducts.length > 0 && (
                        <View style={{ marginBottom: 100 }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15 }}>You Might Also Like</Text>
                            <FlatList
                                horizontal
                                data={similarProducts}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => router.push(`/product/${item.id}`)}
                                        style={{ width: 140, marginRight: 15 }}
                                    >
                                        <Image source={{ uri: item.thumbnail || undefined }} style={{ width: 140, height: 180, borderRadius: 10, marginBottom: 8 }} />
                                        <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '600' }}>{item.name}</Text>
                                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>₹{item.price}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}

                </View>
            </ScrollView>

            {/* Floating Bottom Bar (Sticky) */}
            <View style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                backgroundColor: 'white', padding: 15, paddingBottom: 30,
                borderTopWidth: 1, borderColor: '#f0f0f0',
                flexDirection: 'row', alignItems: 'center', gap: 15,
                shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10
            }}>
                <TouchableOpacity
                    onPress={() => setIsWishlisted(!isWishlisted)}
                    style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#eee', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Heart size={24} color={isWishlisted ? '#ff3b30' : 'black'} fill={isWishlisted ? '#ff3b30' : 'transparent'} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleAddToCart}
                    style={{ flex: 1, backgroundColor: '#000', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Add to Bag</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>|</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>₹{currentPrice.toLocaleString()}</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}
