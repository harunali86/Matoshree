import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Package, Home } from 'lucide-react-native';

export default function OrderSuccess() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
            {/* Success Icon */}
            <View style={{
                width: 120,
                height: 120,
                backgroundColor: '#e8f5e9',
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 30
            }}>
                <CheckCircle size={60} color="#4caf50" />
            </View>

            <Text style={{ fontSize: 28, fontWeight: '900', marginBottom: 10 }}>Order Placed!</Text>
            <Text style={{ color: '#666', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
                Thank you for your order
            </Text>

            {orderId && (
                <View style={{
                    backgroundColor: '#f5f5f5',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                    marginBottom: 30
                }}>
                    <Text style={{ color: '#666', fontSize: 14 }}>
                        Order ID: <Text style={{ fontWeight: 'bold', color: '#333' }}>{orderId.slice(0, 8).toUpperCase()}</Text>
                    </Text>
                </View>
            )}

            <Text style={{ color: '#999', textAlign: 'center', marginBottom: 40, lineHeight: 22 }}>
                We'll send you a confirmation email with your order details and tracking information.
            </Text>

            {/* Track Order Button */}
            <TouchableOpacity
                onPress={() => router.push(`/orders/${orderId}`)}
                style={{
                    backgroundColor: 'black',
                    paddingHorizontal: 40,
                    paddingVertical: 18,
                    borderRadius: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                    width: '100%',
                    justifyContent: 'center'
                }}
            >
                <Package size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>TRACK ORDER</Text>
            </TouchableOpacity>

            {/* Continue Shopping Button */}
            <TouchableOpacity
                onPress={() => router.replace('/(tabs)')}
                style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 40,
                    paddingVertical: 18,
                    borderRadius: 30,
                    borderWidth: 1.5,
                    borderColor: '#ddd',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'center'
                }}
            >
                <Home size={20} color="#333" />
                <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>CONTINUE SHOPPING</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
