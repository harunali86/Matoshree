import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const inspect = async () => {
    console.log('Inspecting products...');

    // Try to selecting 1 row
    const { data, error } = await supabase.from('orders').select('*').limit(1);

    if (error) {
        console.error('Error selecting:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('Row keys:', Object.keys(data[0]));
        console.log('First Row Data:', JSON.stringify(data[0], null, 2));
    } else {
        console.log('Table is empty. Cannot deduce columns easily without metadata.');
        // Try inserting a dummy with just 'name' to see if it allows, 
        // usually it won't fail on "unknown column" if I don't provide it, 
        // but if I DO provide it and it's missing, it fails. 
        // The previous error was "Could not find ... category" which proves 'category' is missing.
    }
};

inspect();
