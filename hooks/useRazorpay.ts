import { useState } from 'react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
}

export const useRazorpay = () => {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const initiatePayment = async (options: {
        amount: number;
        orderId: string;
        customerName?: string;
        customerEmail?: string;
        customerPhone?: string;
        onSuccess: (response: any) => void;
        onFailure: (error: any) => void;
    }) => {
        setLoading(true);

        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            options.onFailure({ error: 'Razorpay SDK failed to load' });
            setLoading(false);
            return;
        }

        const razorpayOptions: RazorpayOptions = {
            key: process.env.EXPO_PUBLIC_RAZORPAY_KEY || 'rzp_test_DUMMY_KEY', // Replace with actual key
            amount: options.amount * 100, // Convert to paise
            currency: 'INR',
            name: 'Matoshri Foot Wear',
            description: `Order #${options.orderId}`,
            order_id: options.orderId,
            handler: (response) => {
                setLoading(false);
                options.onSuccess(response);
            },
            prefill: {
                name: options.customerName,
                email: options.customerEmail,
                contact: options.customerPhone,
            },
            theme: {
                color: '#000000',
            },
        };

        const razorpay = new window.Razorpay(razorpayOptions);

        razorpay.on('payment.failed', (response: any) => {
            setLoading(false);
            options.onFailure(response.error);
        });

        razorpay.open();
    };

    return {
        initiatePayment,
        loading,
    };
};
