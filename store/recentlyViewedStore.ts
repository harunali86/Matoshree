import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Product } from '../types';

interface RecentlyViewedProduct extends Product {
    viewedAt?: number;
}

interface RecentlyViewedState {
    products: RecentlyViewedProduct[];
    addProduct: (product: RecentlyViewedProduct) => void;
    clearHistory: () => void;
}

const MAX_ITEMS = 10;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set, get) => ({
            products: [],
            addProduct: (product) => {
                set((state) => {
                    // Remove if already exists
                    const filtered = state.products.filter(p => p.id !== product.id);
                    // Add to front with current timestamp
                    const updated = [
                        { ...product, viewedAt: Date.now() },
                        ...filtered
                    ].slice(0, MAX_ITEMS); // Keep only last 10
                    return { products: updated };
                });
            },
            clearHistory: () => set({ products: [] })
        }),
        {
            name: 'recently-viewed-storage',
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);
