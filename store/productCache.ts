import { create } from 'zustand';

interface ProductCache {
    id: string;
    data: any;
    timestamp: number;
}

interface ProductCacheState {
    cache: Map<string, ProductCache>;
    getProduct: (id: string) => any | null;
    setProduct: (id: string, data: any) => void;
    isStale: (id: string) => boolean;
    clearCache: () => void;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useProductCache = create<ProductCacheState>((set, get) => ({
    cache: new Map(),

    getProduct: (id: string) => {
        const cached = get().cache.get(id);
        if (!cached) return null;

        // Check if stale
        if (Date.now() - cached.timestamp > CACHE_TTL) {
            return null;
        }
        return cached.data;
    },

    setProduct: (id: string, data: any) => {
        set((state) => {
            const newCache = new Map(state.cache);
            newCache.set(id, {
                id,
                data,
                timestamp: Date.now()
            });
            return { cache: newCache };
        });
    },

    isStale: (id: string) => {
        const cached = get().cache.get(id);
        if (!cached) return true;
        return Date.now() - cached.timestamp > CACHE_TTL;
    },

    clearCache: () => set({ cache: new Map() })
}));
