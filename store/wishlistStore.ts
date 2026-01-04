import { create } from 'zustand';
import { Product } from '../data/products';

interface WishlistState {
    items: Product[];
    toggleWishlist: (product: Product) => void;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    items: [],
    toggleWishlist: (product) => {
        set((state) => {
            const exists = state.items.find((item) => item.id === product.id);
            if (exists) {
                return { items: state.items.filter((item) => item.id !== product.id) };
            }
            return { items: [...state.items, product] };
        });
    },
    isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
    },
}));
