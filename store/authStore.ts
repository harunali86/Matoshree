import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
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
                    set({
                        user: { id: data.user.id, email: data.user.email || '', full_name: data.user.user_metadata?.full_name },
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
                return { error: null };
            },

            signUp: async (email, password, fullName) => {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } }
                });
                if (error) return { error: error.message };
                if (data.user) {
                    set({
                        user: { id: data.user.id, email: data.user.email || '', full_name: fullName },
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
                    set({
                        user: {
                            id: data.session.user.id,
                            email: data.session.user.email || '',
                            full_name: data.session.user.user_metadata?.full_name
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
