import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

export interface CartItem extends Product {
    quantity: number;
    size: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, size: number, quantity?: number) => void;
    removeItem: (productId: string, size: number) => void;
    updateQuantity: (productId: string, size: number, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, size, qty = 1) => {
                set((state) => {
                    const exists = state.items.find(i => i.id === product.id && i.size === size);
                    if (exists) {
                        return { items: state.items.map(i => i.id === product.id && i.size === size ? { ...i, quantity: i.quantity + qty } : i) };
                    }
                    return { items: [...state.items, { ...product, quantity: qty, size }] };
                });
            },
            removeItem: (id, size) => set(s => ({ items: s.items.filter(i => !(i.id === id && i.size === size)) })),
            updateQuantity: (id, size, q) => set(s => ({ items: s.items.map(i => i.id === id && i.size === size ? { ...i, quantity: Math.max(0, q) } : i).filter(i => i.quantity > 0) })),
            clearCart: () => set({ items: [] }),
            getTotalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        }),
        { name: 'cart-storage', storage: createJSONStorage(() => AsyncStorage) }
    )
);
