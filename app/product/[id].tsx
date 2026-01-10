import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { ProductGallery } from '../../components/product/ProductGallery';
import { SizeSelector } from '../../components/product/SizeSelector';
import { ColorSelector } from '../../components/product/ColorSelector';
import { SizeGuideModal } from '../../components/product/SizeGuideModal';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/cartStore';
import { useHistoryStore } from '../../store/historyStore';
import { useProducts } from '../../hooks/useProducts';
import { Toast } from '../../components/ui/Toast';
import { ReviewForm } from '../../components/review/ReviewForm';
import { ReviewList } from '../../components/review/ReviewList';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { Star } from 'lucide-react-native';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const addToCart = useCartStore(state => state.addItem);
    const addToHistory = useHistoryStore(state => state.addToHistory);
    const { products } = useProducts();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(0);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        visible: false,
        message: '',
        type: 'info'
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            // 1. Try finding in Mock Data first (Priority since we switched the Feed)
            const mockItem = MOCK_PRODUCTS.find(p => p.id === id);

            if (mockItem) {
                let initialImages = [mockItem.image];
                if (mockItem.colors && mockItem.colors.length > 0 && mockItem.colors[0].images) {
                    initialImages = mockItem.colors[0].images;
                }

                setProduct({
                    ...mockItem,
                    images: initialImages,
                    metadata: {
                        colors: mockItem.colors,
                        rating: mockItem.rating,
                        reviews: mockItem.reviews,
                        subcategory: mockItem.subCategory
                    }
                });

                addToHistory({
                    id: mockItem.id,
                    name: mockItem.name,
                    price: mockItem.price,
                    image: mockItem.image
                });
            } else {
                // Fallback to Supabase
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (data) {
                    const productData = {
                        ...data,
                        image: data.images?.[0],
                        images: data.images || [],
                        sizes: data.metadata?.sizes || ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
                        category: data.metadata?.category || 'General'
                    };
                    setProduct(productData);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState<string[]>([]);

    useEffect(() => {
        if (product && product.metadata?.colors && product.metadata.colors.length > 0) {
            const defaultColor = product.metadata.colors[0].id;
            setSelectedColor(defaultColor);
            const colorImages = product.metadata.colors[0].images || product.images;
            setCurrentImages(colorImages);
        } else if (product) {
            setCurrentImages(product.images || [product.image]);
        }
    }, [product]);

    useEffect(() => {
        if (product && selectedColor && product.metadata?.colors) {
            const selectedColorData = product.metadata.colors.find((c: any) => c.id === selectedColor);
            if (selectedColorData && selectedColorData.images) {
                setCurrentImages(selectedColorData.images);
            }
        }
    }, [selectedColor, product]);

    if (loading) return <Container className="justify-center items-center"><ActivityIndicator size="large" color="#000" /></Container>;
    if (!product) return <Container className="justify-center items-center"><Typography variant="h3">Product not found</Typography></Container>;

    const colors = product.metadata?.colors || [];
    const availableSizes = product.metadata?.availableSizes || product.sizes || [];
    const outOfStockSizes = product.metadata?.outOfStockSizes || [];

    const handleAddToCart = () => {
        if (!selectedSize) {
            showToast('Please select a size before adding to cart', 'error');
            return;
        }

        if (outOfStockSizes.includes(selectedSize)) {
            showToast('This size is currently unavailable', 'error');
            return;
        }

        const selectedColorName = colors.find((c: any) => c.id === selectedColor)?.name || 'Default';

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: currentImages[0] || product.image,
            size: selectedSize,
            color: selectedColorName,
        });

        showToast(`${product.name} added to bag`, 'success');
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            showToast('Please select a size to continue', 'error');
            return;
        }

        if (outOfStockSizes.includes(selectedSize)) {
            showToast('This size is currently unavailable', 'error');
            return;
        }

        handleAddToCart();
        router.push('/checkout');
    };

    return (
        <Container safeArea translucentStatusBar className="bg-white">
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onDismiss={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProductGallery images={currentImages} />

                <View className="px-6 py-6 border-t border-gray-100 rounded-t-3xl -mt-6 bg-white">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-4">
                            <Typography variant="h1" className="mb-1 text-2xl uppercase tracking-tighter">{product.name}</Typography>
                            <View className="flex-row items-center mb-3">
                                <Typography variant="caption" color="muted" className="mr-2">{product.category} • {product.metadata?.subcategory}</Typography>
                                <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded">
                                    <Typography variant="caption" className="font-bold text-xs mr-1">★ {product.metadata?.rating || '4.5'}</Typography>
                                    <Typography variant="caption" color="muted" className="text-xs">({product.metadata?.reviews || '0'} Reviews)</Typography>
                                </View>
                            </View>
                        </View>
                        <Typography variant="h2" className="mt-1">₹{product.price.toLocaleString()}</Typography>
                    </View>

                    <Typography variant="h3" className="mb-2 text-sm font-bold uppercase text-gray-400 tracking-widest">Description</Typography>
                    <Typography variant="body" className="mb-6 leading-relaxed text-gray-800">
                        {product.description || 'Experience ultimate comfort and style with these premium shoes. Designed for modern life, they feature durable materials and advanced cushioning.'}
                    </Typography>

                    <View className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <View className="flex-row items-center mb-2">
                            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            <Typography variant="body" className="font-bold text-green-700">In Stock</Typography>
                        </View>
                        <Typography variant="caption" color="muted" className="mb-1">
                            Free delivery on orders above ₹999
                        </Typography>
                        <Typography variant="caption" className="font-bold">
                            Expected delivery by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Typography>
                    </View>

                    {colors.length > 0 && (
                        <ColorSelector
                            colors={colors}
                            selectedColor={selectedColor}
                            onSelect={setSelectedColor}
                        />
                    )}

                    <View className="flex-row justify-between items-center mb-3">
                        <Typography variant="h3" className="text-sm font-bold uppercase text-gray-400 tracking-widest">Select Size</Typography>
                        <TouchableOpacity onPress={() => setSizeGuideOpen(true)}>
                            <Typography variant="caption" className="underline font-medium">Size Guide</Typography>
                        </TouchableOpacity>
                    </View>

                    <SizeSelector
                        sizes={availableSizes}
                        selectedSize={selectedSize}
                        onSelect={setSelectedSize}
                        outOfStockSizes={outOfStockSizes}
                    />

                    {/* Ratings & Reviews Section */}
                    <View className="mb-8 border-t border-gray-100 pt-6 mt-6 px-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Typography variant="h3" className="text-lg font-bold">Ratings & Reviews</Typography>
                            <TouchableOpacity onPress={() => setReviewModalVisible(true)}>
                                <Typography variant="caption" className="text-blue-600 font-bold">Write a Review</Typography>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center mb-6 bg-gray-50 p-4 rounded-xl">
                            <View className="mr-6 items-center">
                                <Typography variant="h1" className="text-4xl font-black">{product.metadata?.rating || '4.5'}</Typography>
                                <View className="flex-row">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={12} color="#FBBF24" fill="#FBBF24" />
                                    ))}
                                </View>
                                <Typography variant="caption" color="muted" className="mt-1">{product.metadata?.reviews || '0'} Reviews</Typography>
                            </View>
                            <View className="flex-1">
                                <Typography variant="caption" className="text-gray-500 italic">
                                    Reviews are validated by admin before appearing here.
                                </Typography>
                            </View>
                        </View>

                        <ReviewList productId={product.id} refreshTrigger={refreshReviews} />
                    </View>

                    <View className="mt-8 border-t border-gray-100 pt-8">
                        <Typography variant="h3" className="mb-4 text-lg font-bold px-4">You May Also Like</Typography>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                            {products
                                .filter(p => p.id !== product.id && (p as any).metadata?.subcategory === product.metadata?.subcategory)
                                .slice(0, 6)
                                .map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => router.push(`/product/${item.id}`)}
                                        className="mr-4 w-40"
                                    >
                                        <View className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                                            <Image
                                                source={{ uri: item.image }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <Typography variant="body" className="font-bold text-sm mb-1" numberOfLines={2}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body" className="font-medium">
                                            ₹{item.price.toLocaleString()}
                                        </Typography>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                    </View>

                </View>
                <View className="h-32" />
            </ScrollView>

            <SizeGuideModal visible={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

            <ReviewForm
                productId={product.id}
                visible={reviewModalVisible}
                onClose={() => setReviewModalVisible(false)}
                onSuccess={() => {
                    setRefreshReviews(prev => prev + 1);
                }}
            />

            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#FFFFFF',
                borderTopWidth: 2,
                borderTopColor: '#E5E7EB',
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 32,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 10,
                zIndex: 999
            }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                        onPress={handleAddToCart}
                        style={{
                            flex: 1,
                            backgroundColor: '#FFFFFF',
                            borderWidth: 2,
                            borderColor: '#000000',
                            borderRadius: 50,
                            paddingVertical: 16,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h3" className="font-bold text-black">
                            Add to Cart
                        </Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleBuyNow}
                        style={{
                            flex: 1,
                            backgroundColor: '#000000',
                            borderRadius: 50,
                            paddingVertical: 16,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h3" className="font-bold text-white">
                            Buy Now
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>
        </Container>
    );
}
