import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Grid, User, ShoppingCart } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2874F0', // Flipkart Blue
        tabBarInactiveTintColor: '#878787', // Gray
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Grid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <ShoppingCart size={24} color={color} />
              {cartCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-[#FF6161] w-4 h-4 rounded-full items-center justify-center border border-white">
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
