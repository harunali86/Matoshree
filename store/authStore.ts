import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
    role?: 'retail' | 'wholesale';
    is_verified?: boolean;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,

            signIn: async (email, password) => {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) return { error: error.message };

                if (data.user) {
                    // Fetch comprehensive profile data
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    set({
                        user: {
                            id: data.user.id,
                            email: data.user.email || '',
                            full_name: profile?.full_name || data.user.user_metadata?.full_name,
                            role: profile?.role || 'retail',
                            is_verified: profile?.is_verified ?? false
                        },
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
                return { error: null };
            },

            signUp: async (email, password, fullName) => {
                // SignUp is handled by component, but this updates store if auto-login succeeds
                // Note: The UI component calls this, but usually calls supabase.auth.signUp directly for custom metadata
                // We'll keep this simple or unused if the UI does it manually.
                // But for store completeness:
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } }
                });
                if (error) return { error: error.message };

                if (data.user) {
                    // Initial signup - profile might be creating via trigger. Use metadata fallback.
                    set({
                        user: {
                            id: data.user.id,
                            email: data.user.email || '',
                            full_name: fullName,
                            role: 'retail', // Default
                            is_verified: true // Retail default
                        },
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
                return { error: null };
            },

            signOut: async () => {
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false, isLoading: false });
            },

            checkSession: async () => {
                set({ isLoading: true });
                const { data } = await supabase.auth.getSession();
                if (data.session?.user) {
                    // Fetch fresh profile data on session check
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.session.user.id)
                        .single();

                    set({
                        user: {
                            id: data.session.user.id,
                            email: data.session.user.email || '',
                            full_name: profile?.full_name || data.session.user.user_metadata?.full_name,
                            role: profile?.role || 'retail',
                            is_verified: profile?.is_verified ?? false
                        },
                        isAuthenticated: true,
                        isLoading: false
                    });
                } else {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },
        }),
        { name: 'auth-storage', storage: createJSONStorage(() => AsyncStorage) }
    )
);
