declare module 'react-native-razorpay' {
    export interface CheckoutOptions {
        description?: string;
        image?: string;
        currency?: string;
        key?: string;
        amount?: string | number;
        name?: string;
        order_id?: string;
        prefill?: {
            email?: string;
            contact?: string;
            name?: string;
        };
        theme?: {
            color?: string;
        };
    }

    const RazorpayCheckout: {
        open: (options: CheckoutOptions) => Promise<any>;
        onExternalWalletSelection: (callback: (data: any) => void) => void;
    };

    export default RazorpayCheckout;
}
