import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Please check your .env file.')
}

// Custom storage adapter to handle both Web and Native correctly
const ExpoStorage = {
    getItem: (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof localStorage === 'undefined') return Promise.resolve(null)
            return Promise.resolve(localStorage.getItem(key))
        }
        return AsyncStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
        if (Platform.OS === 'web') {
            if (typeof localStorage === 'undefined') return Promise.resolve()
            localStorage.setItem(key, value)
            return Promise.resolve()
        }
        return AsyncStorage.setItem(key, value)
    },
    removeItem: (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof localStorage === 'undefined') return Promise.resolve()
            localStorage.removeItem(key)
            return Promise.resolve()
        }
        return AsyncStorage.removeItem(key)
    },
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        storage: ExpoStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web', // Must be true for web OAuth
    },
})

// AppState listener to handle token refreshes
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})
