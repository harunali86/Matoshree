import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: any; // derived (string | number)
    images: any[];
    metadata: {
        category?: string;
        subcategory?: string;
        sizes?: string[];
        color?: string;
        reviews?: number;
        rating?: number;
    };
    category: string; // Enforced string
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // SIMULATING API CALL
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake network delay for realism

            // Use the rich mock data
            setProducts(MOCK_PRODUCTS as unknown as Product[]);

        } catch (e) {
            console.error('Exception fetching products:', e);
        } finally {
            setLoading(false);
        }
    };

    return { products, loading, refetch: fetchProducts };
}
