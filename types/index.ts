export interface Product {
    id: string;
    name: string;
    description: string | null;
    short_description: string | null;
    price: number;
    sale_price: number | null;
    price_wholesale?: number | null; // B2B
    moq?: number | null; // B2B
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
