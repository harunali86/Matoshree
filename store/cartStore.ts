import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export interface CartItem {
    id: string; // product_id
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    userId: string | null;
    total: number;
    discount: number;
    couponCode: string | null;

    setUserId: (id: string | null) => void;
    addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
    removeItem: (id: string, size: string, color: string) => Promise<void>;
    updateQuantity: (id: string, size: string, color: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    syncCart: () => Promise<void>;
    mergeGuestCart: () => Promise<void>;

    applyCoupon: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
    removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            userId: null,
            total: 0,
            discount: 0,
            couponCode: null,

            setUserId: (id) => set({ userId: id }),

            applyCoupon: async (code) => {
                const { total, items } = get();
                if (items.length === 0) return { success: false, message: 'Cart is empty' };

                const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

                try {
                    const { data: coupon, error } = await supabase
                        .from('coupons')
                        .select('*')
                        .eq('code', code.toUpperCase())
                        .single();

                    if (error || !coupon) {
                        return { success: false, message: 'Invalid coupon code' };
                    }

                    // Validation
                    const now = new Date();
                    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
                        return { success: false, message: 'Coupon expired' };
                    }
                    if (coupon.min_purchase && subtotal < coupon.min_purchase) {
                        return { success: false, message: `Minimum purchase of ₹${coupon.min_purchase} required` };
                    }
                    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
                        return { success: false, message: 'Coupon usage limit reached' };
                    }

                    // Calculate Discount
                    let discountAmount = 0;
                    if (coupon.discount_type === 'percentage') {
                        discountAmount = (subtotal * coupon.discount_value) / 100;
                        if (coupon.max_discount && discountAmount > coupon.max_discount) {
                            discountAmount = coupon.max_discount;
                        }
                    } else if (coupon.discount_type === 'fixed') {
                        discountAmount = coupon.discount_value;
                    }

                    // Ensure discount doesn't exceed total
                    if (discountAmount > subtotal) discountAmount = subtotal;

                    set({
                        discount: discountAmount,
                        couponCode: code.toUpperCase(),
                        total: subtotal - discountAmount
                    });

                    return { success: true, message: 'Coupon applied!', discount: discountAmount };

                } catch (err: any) {
                    return { success: false, message: err.message || 'Failed to apply coupon' };
                }
            },

            removeCoupon: () => {
                const { items } = get();
                const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                set({ discount: 0, couponCode: null, total: subtotal });
            },

            addItem: async (product) => {
                const { userId, items, couponCode } = get();

                // 1. Optimistic Update
                const existingItem = items.find(
                    (item) => item.id === product.id && item.size === product.size && item.color === product.color
                );

                let newItems;
                if (existingItem) {
                    newItems = items.map((item) =>
                        item.id === product.id && item.size === product.size && item.color === product.color
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    newItems = [...items, { ...product, quantity: 1 }];
                }

                // Recalculate Total (ignoring existing coupon momentarily or re-validating)
                // For simplicity, we just recalculate subtotal. If coupon exists, ideally should re-validate.
                // We will remove coupon on cart change to force re-validation (common e-com pattern) or keep it if valid.
                // Let's remove coupon for safety to avoid invalid state.
                const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                set({ items: newItems, total: newTotal, discount: 0, couponCode: null }); // Reset coupon on cart edit

                // 2. DB Sync
                if (userId) {
                    // ... existing logic ...
                    try {
                        const { data: existingDbItem } = await supabase
                            .from('cart_items')
                            .select('id, quantity')
                            .match({
                                user_id: userId,
                                product_id: product.id,
                                size: product.size,
                                color: product.color
                            })
                            .single();
                        if (existingDbItem) {
                            await supabase.from('cart_items').update({ quantity: existingDbItem.quantity + 1 }).eq('id', existingDbItem.id);
                        } else {
                            await supabase.from('cart_items').insert({
                                user_id: userId,
                                product_id: product.id,
                                size: product.size,
                                color: product.color,
                                quantity: 1
                            });
                        }
                    } catch (e) { console.error(e); }
                }
            },

            removeItem: async (id, size, color) => {
                const { userId, items } = get();
                const newItems = items.filter((item) => !(item.id === id && item.size === size && item.color === color));
                const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

                // Reset coupon
                set({ items: newItems, total: newTotal, discount: 0, couponCode: null });

                if (userId) {
                    try {
                        await supabase.from('cart_items').delete().match({ user_id: userId, product_id: id, size, color });
                    } catch (e) { console.error(e); }
                }
            },

            updateQuantity: async (id, size, color, quantity) => {
                const { userId, items } = get();
                if (quantity <= 0) { get().removeItem(id, size, color); return; }

                const newItems = items.map((item) =>
                    item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item
                );
                const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

                // Reset coupon
                set({ items: newItems, total: newTotal, discount: 0, couponCode: null });

                if (userId) {
                    try {
                        await supabase.from('cart_items').update({ quantity }).match({ user_id: userId, product_id: id, size, color });
                    } catch (e) { console.error(e); }
                }
            },

            clearCart: () => set({ items: [], total: 0, discount: 0, couponCode: null }),

            syncCart: async () => {
                const { userId } = get();
                if (!userId) return;

                try {
                    const { data, error } = await supabase
                        .from('cart_items')
                        .select(`quantity, size, color, product_id, products (id, name, price, thumbnail, images)`)
                        .eq('user_id', userId);

                    if (error) throw error;

                    if (data) {
                        const mappedItems: CartItem[] = data.map((item: any) => ({
                            id: item.product_id,
                            name: item.products?.name || 'Unknown Product',
                            price: item.products?.price || 0,
                            image: item.products?.thumbnail || item.products?.images?.[0] || '',
                            size: item.size,
                            color: item.color,
                            quantity: item.quantity
                        }));

                        const total = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                        set({ items: mappedItems, total, discount: 0, couponCode: null });
                    }
                } catch (error) { console.error('Error fetching cart:', error); }
            },

            mergeGuestCart: async () => {
                const { userId, items } = get();
                if (!userId || items.length === 0) return;
                try {
                    for (const item of items) {
                        const { data: existing } = await supabase.from('cart_items').select('id, quantity').match({ user_id: userId, product_id: item.id, size: item.size, color: item.color }).single();
                        if (existing) {
                            await supabase.from('cart_items').update({ quantity: existing.quantity + item.quantity }).eq('id', existing.id);
                        } else {
                            await supabase.from('cart_items').insert({ user_id: userId, product_id: item.id, size: item.size, color: item.color, quantity: item.quantity });
                        }
                    }
                    await get().syncCart();
                } catch (error) { console.error('Error merging guest cart:', error); }
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
