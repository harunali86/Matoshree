import RazorpayCheckout from 'react-native-razorpay';
import { Alert } from 'react-native';

interface PaymentOptions {
    description: string;
    image?: string;
    currency: string;
    amount: number; // in paise
    key: string;
    email: string;
    contact: string;
    order_id?: string;
    name: string;
}

export const RazorpayService = {
    open: async (options: PaymentOptions) => {
        try {
            const data = await RazorpayCheckout.open(options);
            return { success: true, data };
        } catch (error: any) {
            console.log('Payment Error:', error);
            // Error code 0 usually means cancelled by user
            if (error.code && error.code !== 0) {
                Alert.alert('Payment Failed', error.description || 'Something went wrong');
            }
            return { success: false, error };
        }
    }
};
