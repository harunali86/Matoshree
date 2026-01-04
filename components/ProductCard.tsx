import { TouchableOpacity, Image, Pressable, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Product } from '../data/products';
import { Text, View } from './Themed';
import { useCartStore } from '../store/cartStore';
import { Heart } from 'lucide-react-native';
import { useWishlistStore } from '../store/wishlistStore';

const { width } = Dimensions.get('window');
// Calculate width to fit 2 columns with padding
const CARD_WIDTH = (width / 2) - 20;

export function ProductCard({ product, index }: { product: Product, index?: number }) {
    const addItem = useCartStore((state) => state.addItem);
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const isLiked = isInWishlist(product.id);

    return (
        <Link href={`/product/${product.id}`} asChild>
            <TouchableOpacity
                className="mb-3 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm"
                style={{ width: CARD_WIDTH }}
                activeOpacity={0.9}
            >
                <View className="h-44 relative items-center justify-center p-4">
                    <Image
                        source={product.image}
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

                    <View className="flex-row items-center mt-1">
                        <Text className="text-black font-bold text-base mr-2">${product.price}</Text>
                        {product.originalPrice && (
                            <Text className="text-gray-400 text-xs line-through">${product.originalPrice}</Text>
                        )}
                        <Text className="text-green-700 text-[10px] font-bold ml-auto">{product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 20}% off</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
