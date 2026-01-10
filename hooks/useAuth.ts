import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useHistoryStore } from '../store/historyStore';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) {
                // Initialize User Data
                const userId = session.user.id;

                useCartStore.getState().setUserId(userId);
                useCartStore.getState().syncCart();

                // Wishlist
                useWishlistStore.getState().syncWishlist();

                // History
                useHistoryStore.getState().syncHistory();
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            if (session?.user) {
                const userId = session.user.id;
                useCartStore.getState().setUserId(userId);

                if (_event === 'SIGNED_IN') {
                    // Merge Guest Data
                    await Promise.all([
                        useCartStore.getState().mergeGuestCart(),
                        useWishlistStore.getState().mergeGuestWishlist(),
                        useHistoryStore.getState().mergeGuestHistory()
                    ]);
                }

                // Sync all
                useCartStore.getState().syncCart();
                useWishlistStore.getState().syncWishlist();
                useHistoryStore.getState().syncHistory();

            } else if (_event === 'SIGNED_OUT') {
                useCartStore.getState().setUserId(null);
                useCartStore.getState().clearCart();
                useWishlistStore.getState().clearWishlist();
                useHistoryStore.getState().clearHistory();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        // Immediately clear local state
        setUser(null);
        setSession(null);
        if (!error) {
            await AsyncStorage.multiRemove([
                'cart-storage',
                'wishlist-storage',
                'history-storage'
            ]);
            useCartStore.getState().clearCart();
            useWishlistStore.getState().clearWishlist();
            useHistoryStore.getState().clearHistory();
        }
        return { error };
    };

    const resetPassword = async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'matoshreefootwear://reset-password',
        });
        return { data, error };
    };

    const updatePassword = async (newPassword: string) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        return { data, error };
    };

    return {
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        isAuthenticated: !!user,
    };
};
