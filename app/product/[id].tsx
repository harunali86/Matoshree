import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, Animated, FlatList, Alert, TextInput, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/cartStore';
import { ArrowLeft, Heart, Share2, Star, Truck, Shield, RefreshCw, ChevronDown, ChevronUp, ShoppingBag, MapPin, Info, CheckCircle2 } from 'lucide-react-native';
import { Product } from '../../types';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Premium Color Mapping with Specific Images (Simulated logic for demo)
const COLORS = [
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
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [pincode, setPincode] = useState('');
    const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const fetchProductData = async () => {
            // Fetch Main Product
            const { data: currentProduct } = await supabase.from('products').select('*').eq('id', id).single();
            if (currentProduct) {
                setProduct(currentProduct);
                // Fetch Similar Products (Same Category)
                if (currentProduct.category_id) {
                    const { data: similar } = await supabase
                        .from('products')
                        .select('*')
                        .eq('category_id', currentProduct.category_id)
                        .neq('id', currentProduct.id) // Exclude current product
                        .limit(6);
                    if (similar) setSimilarProducts(similar);
                }

                // Fetch Reviews from database
                const { data: productReviews } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('product_id', currentProduct.id)
                    .order('created_at', { ascending: false })
                    .limit(10);
                if (productReviews) setReviews(productReviews);
            }
            setLoading(false);
        };
        fetchProductData();
    }, [id]);

    // Dynamic Image Logic
    const getProductImages = () => {
        if (!product) return [];
        let images: string[] = [];

        if (product.thumbnail) images.push(product.thumbnail);
        if (product.images && product.images.length > 0) {
            images = [...images, ...product.images];
        }

        // Ensure we have enough images for the slider
        while (images.length < 4) {
            images.push(images[0] || 'https://via.placeholder.com/400x400?text=Product');
        }
        return images.slice(0, 5); // Limit to 5 images
    };

    const allImages = getProductImages();

    const handleAddToCart = () => {
        if (!selectedSize) {
            Alert.alert('Select a Size', 'Please choose your size to continue.');
            return;
        }
        if (product) {
            addItem(product, selectedSize);
            Alert.alert('Added to Bag', 'Ready for checkout?');
        }
    };

    const checkDelivery = () => {
        if (pincode.length === 6) {
            setDeliveryDate('Wed, 16 Jan'); // Mock delivery date
        } else {
            Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
        }
    };

    const shareProduct = async () => {
        try {
            await Share.share({
                message: `Check out ${product?.name} on Matoshree Footwear!\n\n₹${product?.sale_price || product?.price}\n\nDownload the app to buy!`,
                title: product?.name || 'Matoshree Product',
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading || !product) {
        return <View style={{ flex: 1, backgroundColor: 'white' }} />;
    }

    const avgRating = product.rating || 4.8;
    const currentPrice = product.sale_price || product.price;
    const originalPrice = product.price;
    const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />

            {/* Floating Header */}
            <Animated.View style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
                backgroundColor: scrollY.interpolate({
                    inputRange: [0, 300], outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']
                }),
                paddingTop: 50, paddingBottom: 10, paddingHorizontal: 20,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                borderBottomWidth: scrollY.interpolate({ inputRange: [0, 300], outputRange: [0, 1] }),
                borderBottomColor: '#f0f0f0'
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
                    <ArrowLeft size={24} color={scrollY.interpolate({ inputRange: [0, 300], outputRange: ['black', 'black'] })} />
                </TouchableOpacity>
                <Animated.Text style={{
                    fontSize: 18, fontWeight: 'bold',
                    opacity: scrollY.interpolate({ inputRange: [0, 300], outputRange: [0, 1] })
                }}>
                    {product.name}
                </Animated.Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={{ width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <ShoppingBag size={20} color="black" />
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
            >
                {/* Full Screen Hero Image Slider */}
                <View style={{ height: height * 0.6 }}>
                    <FlatList
                        ref={flatListRef}
                        data={allImages}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, i) => i.toString()}
                        onMomentumScrollEnd={(e) => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                        renderItem={({ item }) => (
                            <View style={{ width, height: height * 0.6 }}>
                                <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                            </View>
                        )}
                    />
                    {/* Pagination Dots */}
                    <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                        {allImages.map((_, i) => (
                            <View key={i} style={{
                                width: activeImageIndex === i ? 24 : 6, height: 6, borderRadius: 3,
                                backgroundColor: activeImageIndex === i ? '#000' : 'rgba(0,0,0,0.2)'
                            }} />
                        ))}
                    </View>
                </View>

                {/* Product Details Container */}
                <View style={{ marginTop: -25, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 30, paddingHorizontal: 20, minHeight: height * 0.5 }}>

                    {/* Title & Price */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginBottom: 8, lineHeight: 32 }}>{product.name}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>₹{currentPrice.toLocaleString()}</Text>
                                    {discount > 0 && <Text style={{ textDecorationLine: 'line-through', color: '#888', fontSize: 16 }}>₹{originalPrice.toLocaleString()}</Text>}
                                    {discount > 0 && <Text style={{ color: '#00af00', fontWeight: 'bold', fontSize: 16 }}>{discount}% OFF</Text>}
                                </View>
                                <Text style={{ fontSize: 12, color: '#666' }}>Inclusive of all taxes</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
                                    <Star size={14} color="#00af00" fill="#00af00" />
                                    <Text style={{ fontWeight: '700', marginLeft: 4, color: '#006400' }}>{avgRating}</Text>
                                </View>
                                <Text style={{ color: '#888', fontSize: 11, marginTop: 2 }}>{product.total_reviews} Ratings</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 1, backgroundColor: '#f0f0f0', marginBottom: 20 }} />

                    {/* Colors */}
                    <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 12 }}>Color: <Text style={{ fontWeight: '400' }}>{selectedColor.name}</Text></Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 25 }}>
                        {COLORS.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedColor(color)}
                                style={{ marginRight: 15, alignItems: 'center' }}
                            >
                                <View style={{
                                    width: 60, height: 60, borderRadius: 12, backgroundColor: '#f9f9f9',
                                    borderWidth: selectedColor.name === color.name ? 2 : 1, borderColor: selectedColor.name === color.name ? '#000' : '#eee',
                                    padding: 2
                                }}>
                                    <Image source={{ uri: allImages[color.imageIndex % allImages.length] }} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Sizes */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700' }}>Select Size (UK)</Text>
                        <Text style={{ color: '#e65100', fontWeight: 'bold', fontSize: 12 }}>Size Chart</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 25 }}>
                        {SIZES.map((size) => (
                            <TouchableOpacity
                                key={size}
                                onPress={() => setSelectedSize(size)}
                                style={{
                                    width: 50, height: 50, borderRadius: 25,
                                    borderWidth: 1, borderColor: selectedSize === size ? '#000' : '#e0e0e0',
                                    backgroundColor: selectedSize === size ? '#000' : 'white',
                                    justifyContent: 'center', alignItems: 'center', marginRight: 12
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: selectedSize === size ? 'white' : 'black' }}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Delivery Checker */}
                    <View style={{ marginBottom: 25 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 12 }}>Delivery Options</Text>
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, height: 48 }}>
                                <MapPin size={18} color="#666" />
                                <TextInput
                                    placeholder="Enter Pincode"
                                    keyboardType="numeric"
                                    maxLength={6}
                                    value={pincode}
                                    onChangeText={setPincode}
                                    style={{ flex: 1, marginLeft: 10, fontSize: 14 }}
                                />
                            </View>
                            <TouchableOpacity onPress={checkDelivery} style={{ paddingHorizontal: 20, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#e65100', fontWeight: 'bold' }}>Check</Text>
                            </TouchableOpacity>
                        </View>
                        {deliveryDate && (
                            <Text style={{ marginTop: 8, color: '#00af00', fontSize: 12 }}>
                                Expected delivery by <Text style={{ fontWeight: 'bold' }}>{deliveryDate}</Text>
                            </Text>
                        )}
                    </View>

                    {/* Trust Policies */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, marginBottom: 25 }}>
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
                            {product.description || "Designed for maximum comfort and style. These shoes are perfect for your daily wear, offering durability and a premium look."}
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
                        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Customer Reviews ({reviews.length || product.total_reviews})</Text>
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
