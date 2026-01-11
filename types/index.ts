export interface Product {
    id: string;
    name: string;
    description: string | null;
    short_description: string | null;
    price: number;
    sale_price: number | null;
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
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    parent_id: string | null;
}
