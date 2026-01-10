import { supabase } from '../lib/supabase';

export interface HeroBanner {
    id: string;
    title: string;
    subtitle: string | null;
    image_url: string;
    cta_text: string;
    cta_link: string | null;
    display_order: number;
    is_active: boolean;
}

/**
 * Fetch all active hero banners from Supabase
 * Sorted by display_order
 */
export async function getHeroBanners(): Promise<HeroBanner[]> {
    const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching hero banners:', error);
        return [];
    }

    // Map database fields to match existing component expectations
    return (data || []).map(banner => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image_url, // Map image_url to image for compatibility
        cta_text: banner.cta_text,
        cta_link: banner.cta_link,
        display_order: banner.display_order,
        is_active: banner.is_active,
    })) as any;
}

/**
 * Subscribe to real-time hero banner changes
 * This will auto-update the app when admin makes changes
 */
export function subscribeToHeroBanners(callback: (banners: HeroBanner[]) => void) {
    const channel = supabase
        .channel('hero_banners_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'hero_banners',
            },
            async () => {
                const banners = await getHeroBanners();
                callback(banners);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
