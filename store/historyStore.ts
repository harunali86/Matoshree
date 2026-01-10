import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export interface ViewedProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    timestamp: number;
}

interface HistoryState {
    items: ViewedProduct[];
    addToHistory: (product: Omit<ViewedProduct, 'timestamp'>) => Promise<void>;
    clearHistory: () => void;
    syncHistory: () => Promise<void>;
    mergeGuestHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set, get) => ({
            items: [],

            addToHistory: async (product) => {
                const { items } = get();

                // Optimistic Update
                const newItems = items.filter(p => p.id !== product.id);
                newItems.unshift({ ...product, timestamp: Date.now() });

                // Limit to 10
                if (newItems.length > 10) newItems.pop();

                set({ items: newItems });

                // DB Sync
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id;

                if (userId) {
                    try {
                        const { error } = await supabase
                            .from('recently_viewed')
                            .upsert({
                                user_id: userId,
                                product_id: product.id,
                                viewed_at: new Date().toISOString()
                            }, { onConflict: 'user_id, product_id' }); // Assuming composite PK or unique constraint

                        if (error) throw error;
                    } catch (error) {
                        console.error('Error syncing history:', error);
                    }
                }
            },

            clearHistory: () => set({ items: [] }),

            syncHistory: async () => {
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id;
                if (!userId) return;

                try {
                    const { data, error } = await supabase
                        .from('recently_viewed')
                        .select(`
                            viewed_at,
                            product_id,
                            products (id, name, price, thumbnail, images)
                        `)
                        .eq('user_id', userId)
                        .order('viewed_at', { ascending: false })
                        .limit(10);

                    if (error) throw error;

                    if (data) {
                        const mappedItems: ViewedProduct[] = data.map((item: any) => ({
                            id: item.product_id,
                            name: item.products?.name || 'Unknown',
                            price: item.products?.price || 0,
                            image: item.products?.thumbnail || item.products?.images?.[0] || '',
                            timestamp: new Date(item.viewed_at).getTime()
                        }));
                        set({ items: mappedItems });
                    }
                } catch (error) {
                    console.error('Error fetching history:', error);
                }
            },

            mergeGuestHistory: async () => {
                const { items } = get();
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id;
                if (!userId || items.length === 0) return;

                try {
                    // Push all local items to DB. Recent ones first.
                    const upserts = items.map(item => ({
                        user_id: userId,
                        product_id: item.id,
                        viewed_at: new Date(item.timestamp).toISOString()
                    }));

                    const { error } = await supabase
                        .from('recently_viewed')
                        .upsert(upserts, { onConflict: 'user_id, product_id' });

                    if (error) throw error;

                    // Re-sync to get consolidated list
                    await get().syncHistory();
                } catch (error) {
                    console.error('Error merging guest history:', error);
                }
            }
        }),
        {
            name: 'history-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
