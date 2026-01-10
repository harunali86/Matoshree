import { TouchableOpacity, Image, Pressable, Dimensions, View as RNView } from 'react-native';
import { Link } from 'expo-router';
import { Product } from '../data/products';
import { Text, View } from './Themed';
import { useCartStore } from '../store/cartStore';
import { Heart } from 'lucide-react-native';
import { useWishlistStore } from '../store/wishlistStore';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');
// Calculate width to fit 2 columns with padding
const CARD_WIDTH = (width / 2) - 20;

export function ProductCard({ product, index }: { product: any, index?: number }) {
    const addItem = useCartStore((state) => state.addItem);
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const isLiked = isInWishlist(product.id);
    const [activeImage, setActiveImage] = useState(product.image);

    // Sync state if product image changes (fixes HMR/Async loading issues)
    useEffect(() => {
        setActiveImage(product.image);
    }, [product.image]);

    // Get colors if available
    const colors = product.colors || [];

    return (
        <Link href={`/product/${product.id}`} asChild>
            <TouchableOpacity
                className="mb-3 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm"
                style={{ width: CARD_WIDTH }}
                activeOpacity={0.9}
            >
                <View className="h-44 relative items-center justify-center p-4">
                    <Image
                        key={`${product.id}-${typeof activeImage === 'number' ? activeImage : activeImage}`}
                        source={typeof activeImage === 'string' ? { uri: activeImage } : activeImage}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="contain"
                    />
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        className="absolute top-2 right-2 rounded-full p-1.5"
                        style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                    >
                        <Heart size={16} color={isLiked ? "#FF4343" : "#C2C2C2"} fill={isLiked ? "#FF4343" : "transparent"} />
                    </Pressable>
                </View>

                <View className="p-3 bg-white">
                    <Text className="text-gray-500 text-[10px] uppercase tracking-wide font-bold mb-0.5">{product.category}</Text>
                    <Text className="text-gray-900 font-medium text-xs leading-4 mb-1 h-8" numberOfLines={2}>{product.name}</Text>

                    <View className="flex-row items-center mt-1 mb-2">
                        <Text className="text-black font-bold text-base mr-2">${product.price}</Text>
                        {product.originalPrice && (
                            <Text className="text-gray-400 text-xs line-through">${product.originalPrice}</Text>
                        )}
                        <Text className="text-green-700 text-[10px] font-bold ml-auto">{product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 20}% off</Text>
                    </View>

                    {/* Color Swatches */}
                    {colors.length > 0 && (
                        <View className="flex-row flex-wrap gap-1 mt-1">
                            {colors.slice(0, 4).map((color: any) => (
                                <Pressable
                                    key={color.id}
                                    onPress={(e) => {
                                        e.preventDefault(); // Prevent navigation
                                        if (color.images && color.images.length > 0) {
                                            setActiveImage(color.images[0]);
                                        }
                                    }}
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: color.hex,
                                        borderWidth: 1,
                                        borderColor: '#e5e7eb',
                                        marginRight: 4
                                    }}
                                />
                            ))}
                            {colors.length > 4 && (
                                <Text className="text-[9px] text-gray-400">+{colors.length - 4}</Text>
                            )}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Link>
    );
}
