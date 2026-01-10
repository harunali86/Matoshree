// Re-bundling fix
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export interface WishlistItem {
    id: string; // product_id
    name: string;
    price: number;
    image: string;
    category: string;
}

interface WishlistState {
    items: WishlistItem[];
    userId: string | null;

    setUserId: (id: string | null) => void;
    toggleItem: (product: WishlistItem) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    syncWishlist: () => Promise<void>;
    mergeGuestWishlist: () => Promise<void>;
}


export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            userId: null,

            setUserId: (id) => set({ userId: id }),

            toggleItem: async (product) => {
                const { userId, items } = get();
                const exists = items.some((item) => item.id === product.id);

                // 1. Optimistic Update
                if (exists) {
                    set({ items: items.filter((item) => item.id !== product.id) });
                } else {
                    set({ items: [...items, product] });
                }

                // 2. DB Sync
                if (userId) {
                    try {
                        if (exists) {
                            // Remove from DB
                            await supabase
                                .from('wishlist')
                                .delete()
                                .match({ user_id: userId, product_id: product.id });
                        } else {
                            // Add to DB
                            await supabase
                                .from('wishlist')
                                .insert({
                                    user_id: userId,
                                    product_id: product.id
                                });
                        }
                    } catch (error) {
                        console.error('Error syncing wishlist to DB:', error);
                    }
                }
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.id === productId);
            },

            syncWishlist: async () => {
                const { userId } = get();
                if (!userId) return;

                try {
                    const { data, error } = await supabase
                        .from('wishlist')
                        .select(`
                            product_id,
                            products (
                                id,
                                name,
                                price,
                                thumbnail,
                                images,
                                category_id,
                                categories (name)
                            )
                        `)
                        .eq('user_id', userId);

                    if (error) throw error;

                    if (data) {
                        const mappedItems: WishlistItem[] = data.map((item: any) => ({
                            id: item.product_id,
                            name: item.products?.name || 'Unknown Product',
                            price: item.products?.price || 0,
                            image: item.products?.thumbnail || item.products?.images?.[0] || '',
                            category: item.products?.categories?.name || 'General'
                        }));
                        set({ items: mappedItems });
                    }
                } catch (error) {
                    console.error('Error fetching wishlist from DB:', error);
                }
            },

            mergeGuestWishlist: async () => {
                const { userId, items } = get();
                if (!userId || items.length === 0) return;

                try {
                    // Batch upsert (more efficient and correct syntax)
                    const itemsToInsert = items.map(item => ({
                        user_id: userId,
                        product_id: item.id
                    }));

                    const { error } = await supabase
                        .from('wishlist')
                        .upsert(itemsToInsert, { onConflict: 'user_id, product_id', ignoreDuplicates: true });

                    if (error) console.error('Error merging wishlist:', error);

                    // Re-sync to get official state
                    await get().syncWishlist();

                } catch (error) {
                    console.error('Error merging wishlist:', error);
                }
            }
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
