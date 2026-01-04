import { ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '../../components/Themed';
import { SearchBar } from '../../components/SearchBar';
import { HeroCarousel } from '../../components/HeroCarousel';
import { CategoryPill } from '../../components/CategoryPill';
import { ProductCard } from '../../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { Bell } from 'lucide-react-native';
import { useNotificationStore } from '../../store/notificationStore';

export default function HomeScreen() {
  const router = useRouter();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header with Notification Bell */}
      <View className="px-5 py-4 bg-white flex-row justify-between items-center shadow-sm z-10">
        <View>
          <Text className="text-black font-extrabold text-2xl tracking-tighter">
            Harun<Text className="text-[#2874F0]">.</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          className="relative"
        >
          <Bell size={24} color="#333" />
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <SearchBar />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View className="bg-white py-4 mb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.id} name={cat.name} image={cat.image} />
            ))}
          </ScrollView>
        </View>

        <View>
          <HeroCarousel />
        </View>

        {/* Best Sellers */}
        <View className="bg-white py-4 px-2 mb-4">
          <View className="flex-row justify-between items-center mb-4 px-2">
            <Text className="text-black text-xl font-bold tracking-tight">Best Sellers</Text>
            <TouchableOpacity
              onPress={() => router.push('/search')}
              className="bg-black px-3 py-1 rounded-full"
            >
              <Text className="text-white text-xs font-bold">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between px-2">
            {PRODUCTS.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
