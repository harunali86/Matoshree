import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../data/products';

interface RecentStore {
    recentlyViewed: Product[];
    addToRecent: (product: Product) => void;
    clearRecent: () => void;
}

export const useRecentStore = create<RecentStore>()(
    persist(
        (set, get) => ({
            recentlyViewed: [],

            addToRecent: (product: Product) => {
                const current = get().recentlyViewed;
                // Remove if already exists, then add to front
                const filtered = current.filter(p => p.id !== product.id);
                const updated = [product, ...filtered].slice(0, 10); // Keep max 10
                set({ recentlyViewed: updated });
            },

            clearRecent: () => set({ recentlyViewed: [] }),
        }),
        {
            name: 'harun-recent-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
