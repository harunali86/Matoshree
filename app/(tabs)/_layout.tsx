import { Tabs } from 'expo-router';
import { Home, Search, ShoppingBag, User } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';

export default function TabsLayout() {
    const items = useCartStore((state) => state.items);

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: { height: 65, paddingBottom: 10, paddingTop: 10, borderTopWidth: 0, elevation: 10, shadowOpacity: 0.1 }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, size }) => <Home strokeWidth={2} color={color} size={22} />,
                    title: 'Home',
                    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: ({ color, size }) => <Search strokeWidth={2} color={color} size={22} />,
                    title: 'Shop',
                    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    tabBarIcon: ({ color, size }) => <ShoppingBag strokeWidth={2} color={color} size={22} />,
                    title: 'Bag',
                    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                    tabBarBadge: items.length > 0 ? items.length : undefined,
                    tabBarBadgeStyle: { backgroundColor: '#ff3b30', fontSize: 10, fontWeight: 'bold' }
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, size }) => <User strokeWidth={2} color={color} size={22} />,
                    title: 'Account',
                    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }
                }}
            />
        </Tabs>
    );
}
