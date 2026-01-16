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
    getTotalPrice: (isWholesaleUser?: boolean) => number;
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
            getTotalPrice: (isWholesaleUser: boolean = false) => {
                const { items } = get();
                return items.reduce((acc, item) => {
                    let unitPrice = item.price;

                    // Wholesale / B2B Logic - ONLY if user is authorized
                    if (isWholesaleUser && item.price_wholesale) {
                        unitPrice = item.price_wholesale;
                    }

                    // Check for Tiered Pricing - ONLY if wholesale logic applies (usually)
                    // Or if we want tiered pricing for retail too? Assuming B2B tiers for now.
                    if (isWholesaleUser && item.price_tiers && item.price_tiers.length > 0) {
                        // Find applicable tier
                        const applicableTier = item.price_tiers.find(tier =>
                            item.quantity >= tier.min_quantity &&
                            (!tier.max_quantity || item.quantity <= tier.max_quantity)
                        );
                        if (applicableTier) {
                            unitPrice = applicableTier.unit_price;
                        }
                    } else if (!isWholesaleUser && item.is_on_sale && item.sale_price) {
                        // Retail Sale Price (only if not wholesale override)
                        unitPrice = item.sale_price;
                    }

                    return acc + (unitPrice * item.quantity);
                }, 0);
            },
        }),
        { name: 'cart-storage', storage: createJSONStorage(() => AsyncStorage) }
    )
);
