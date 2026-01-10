import React from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Typography } from '../../components/ui/Typography';
import { HeroBanner } from '../../components/home/HeroBanner';
import { CategoryRail } from '../../components/home/CategoryRail';
import { ProductCard } from '../../components/product/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { ProductGridSkeleton } from '../../components/ui/Skeleton';
import { RecentlyViewed } from '../../components/home/RecentlyViewed';
import { Footer } from '../../components/layout/Footer';

export default function HomeScreen() {
  const { products, loading } = useProducts();
  const newArrivals = products.slice(0, 6); // Take first 6 items

  return (
    <Container safeArea translucentStatusBar className="bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-2 flex-row justify-between items-center mb-4">
          <View>
            <Typography variant="h1" className="tracking-tighter text-2xl font-black">MATOSHREE</Typography>
            <Typography variant="caption" className="tracking-widest text-xs font-bold text-gray-400">FOOTWEAR</Typography>
          </View>
          {/* Notification Icon */}
        </View>

        <HeroBanner />

        {/* Trending / Promo Banner - Adidas Style */}
        <View className="mt-6 mb-2 mx-4 h-64 bg-black rounded-lg overflow-hidden justify-center items-center relative">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=1000' }}
            className="absolute w-full h-full opacity-60"
            resizeMode="cover"
          />
          <View className="items-center z-10 w-full px-4">
            <Typography variant="h2" className="text-white uppercase font-black text-3xl mb-2 text-center">Summer Sale</Typography>
            <Typography variant="body" className="text-white mb-4 text-center font-medium">Flat 40% Off on Running Shoes</Typography>
            <View className="bg-white px-6 py-3 rounded-full">
              <Typography variant="body" className="font-bold text-black uppercase text-xs tracking-widest">Shop Now</Typography>
            </View>
          </View>
        </View>

        <CategoryRail />

        {/* New Arrivals Section */}
        <View className="mt-4 px-4 mb-24">
          <View className="flex-row justify-between items-center mb-6 px-2">
            <Typography variant="h2" className="uppercase tracking-tight text-xl">New Arrivals</Typography>
            <Typography variant="body" className="underline text-sm font-medium">See All</Typography>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </View>
        </View>

        {/* Shop by Brand Section */}
        <View className="mb-8 px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Typography variant="h2" className="text-xl font-bold uppercase">
              Shop by Brand
            </Typography>
            <Link href="/shop" asChild>
              <TouchableOpacity>
                <Typography variant="body" className="underline text-sm font-medium">
                  See All
                </Typography>
              </TouchableOpacity>
            </Link>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-6 px-6"
          >
            {[
              { id: 'nike', name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png' },
              { id: 'adidas', name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png' },
              { id: 'puma', name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg' },
              { id: 'reebok', name: 'Reebok', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Reebok_2019_logo.svg/1200px-Reebok_2019_logo.svg.png' },
              { id: 'new-balance', name: 'New Balance', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg' },
            ].map((brand) => (
              <Link key={brand.id} href={`/shop?search=${brand.name}`} asChild>
                <TouchableOpacity className="mr-6 items-center">
                  <View className="w-20 h-20 bg-white rounded-2xl items-center justify-center border-2 border-gray-100 p-4 shadow-sm">
                    <Image
                      source={{ uri: brand.logo }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </View>
                  <Typography variant="caption" className="mt-2 font-semibold text-xs">
                    {brand.name}
                  </Typography>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>

        <Footer />

      </ScrollView>
    </Container>
  );
}
