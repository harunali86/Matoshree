export interface Product {
    id: string;
    name: string;
    description: string | null;
    short_description: string | null;
    price: number;
    sale_price: number | null;
    price_wholesale?: number | null; // B2B
    moq?: number | null; // B2B
    price_tiers?: PriceTier[]; // B2B Multi-tier pricing
    specifications?: Record<string, string> | null;
    is_on_sale: boolean;
    thumbnail: string | null;
    images: string[] | null;
    brand_id: string | null;
    category_id: string | null;
    rating: number;
    total_reviews: number;
    is_featured: boolean;
    is_new_arrival: boolean;
    is_bestseller: boolean;
    stock: number;
    sku: string | null;
}

export interface Banner {
    id: string;
    image_url: string;
    title: string;
    subtitle: string;
    product_id?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    parent_id: string | null;
}

export interface Brand {
    id: string;
    name: string;
    logo_url?: string;
    logo?: string; // For local static data mainly
}

export interface Collection {
    id: string;
    name: string;
    image_url?: string;
    image?: string; // For local static data mainly
    count?: number;
    description?: string;
}

export interface PriceTier {
    id: string;
    product_id: string;
    min_quantity: number;
    max_quantity: number | null;
    unit_price: number;
    tier_name: string | null;
}

export interface BusinessProfile {
    id: string;
    business_name: string;
    gst_number: string | null;
    pan_number: string | null;
    business_type: 'retailer' | 'wholesaler' | 'distributor';
    credit_limit: number;
    credit_balance: number;
    is_verified: boolean;
    verification_docs: string[];
}

export interface AppConfig {
    key: string;
    value: any;
    description: string | null;
}

export interface Quotation {
    id: string;
    items: {
        product_id: string;
        quantity: number;
        requested_price: number;
    }[];
    status: 'pending' | 'approved' | 'rejected' | 'converted_to_order';
    total_amount: number | null;
    created_at: string;
}
