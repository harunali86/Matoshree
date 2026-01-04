export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: any; // Changed to any for require()
    category: string;
    description: string;
}

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Sony WH-1000XM5',
        price: 349,
        originalPrice: 399,
        rating: 4.8,
        reviews: 1250,
        image: { uri: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80' },
        category: 'Electronics',
        description: 'Industry-leading noise canceling.',
    },
    {
        id: '2',
        name: 'Nike Air Jordan 1',
        price: 180,
        rating: 4.9,
        reviews: 856,
        image: { uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
        category: 'Fashion',
        description: 'Premium leather sneakers.',
    },
    {
        id: '3',
        name: 'Apple Watch S9',
        price: 399,
        rating: 4.7,
        reviews: 500,
        image: { uri: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80' },
        category: 'Electronics',
        description: 'Smarter, brighter, and mightier.',
    },
    {
        id: '4',
        name: 'Ray-Ban Aviator',
        price: 163,
        originalPrice: 210,
        rating: 4.6,
        reviews: 320,
        image: { uri: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80' },
        category: 'Accessories',
        description: 'Iconic sunglasses.',
    },
    {
        id: '5',
        name: 'Dior Sauvage',
        price: 180,
        rating: 4.9,
        reviews: 900,
        image: { uri: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80' },
        category: 'Beauty',
        description: 'Concentrated fragrance.',
    },
    {
        id: '6',
        name: 'Herman Miller Chair',
        price: 1200,
        originalPrice: 1500,
        rating: 4.9,
        reviews: 200,
        image: { uri: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' },
        category: 'Furniture',
        description: 'Ergonomic office chair.',
    }
];

export const CATEGORIES = [
    { id: '1', name: 'Electronics', image: { uri: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80' } },
    { id: '2', name: 'Fashion', image: { uri: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80' } },
    { id: '3', name: 'Beauty', image: { uri: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&q=80' } },
    { id: '4', name: 'Home', image: { uri: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80' } },
    { id: '5', name: 'Sports', image: { uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80' } },
];
