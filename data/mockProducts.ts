
const SIZES = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12', 'US 13'];

// 6 DISTINCT shoe images from Unsplash (REMOTE URLs - guaranteed to work)
const PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', // Red Nike
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80', // White Sneaker
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80', // Black/White
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', // Green
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', // Colorful
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80', // Blue
];

// Color info for swatches
const IMAGE_COLORS = [
    { name: 'University Red', hex: '#CE2029' },
    { name: 'Cloud White', hex: '#F8F8F8' },
    { name: 'Midnight Black', hex: '#111111' },
    { name: 'Electric Green', hex: '#39FF14' },
    { name: 'Rainbow', hex: '#FF69B4' },
    { name: 'Royal Blue', hex: '#4169E1' }
];

export interface ColorVariant {
    id: string;
    name: string;
    hex: string;
    images: string[];
}

export interface MockProduct {
    id: string;
    name: string;
    brand: 'Nike' | 'Adidas' | 'Puma' | 'Jordan' | 'New Balance' | 'Reebok';
    price: number;
    originalPrice?: number;
    description: string;
    category: string;
    subCategory?: string;
    rating: number;
    reviews: number;
    sizes: string[];
    colors: ColorVariant[];
    image: string;
    metadata: {
        category: string;
        subcategory: string;
        [key: string]: any;
    };
}

const createVariant = (colorIdx: number) => {
    const safeIdx = colorIdx % PRODUCT_IMAGES.length;
    const info = IMAGE_COLORS[safeIdx];
    const imgUrl = PRODUCT_IMAGES[safeIdx];

    return {
        id: info.name.toLowerCase().replace(' ', '-'),
        name: info.name,
        hex: info.hex,
        images: [imgUrl, imgUrl, imgUrl]
    };
};

const BRANDS: Array<'Nike' | 'Adidas' | 'Puma' | 'Jordan' | 'New Balance' | 'Reebok'> = ['Nike', 'Adidas', 'Puma', 'Jordan', 'New Balance', 'Reebok'];

const generateProducts = () => {
    const products: MockProduct[] = [];
    const GENDERS = ['Men', 'Women', 'Kids'];

    // 1. RUNNING (30 items)
    for (let i = 1; i <= 30; i++) {
        const imgIdx = i % PRODUCT_IMAGES.length; // Cycles 0-5
        const gender = GENDERS[i % 3];

        products.push({
            id: `run-${i}`,
            name: `${BRANDS[i % BRANDS.length]} Air Zoom ${38 + (i % 5)}`,
            brand: BRANDS[i % BRANDS.length],
            price: 120 + (i * 2),
            originalPrice: i % 3 === 0 ? 160 + (i * 2) : undefined,
            description: 'Engineered for speed and comfort.',
            category: gender,
            subCategory: 'Running',
            metadata: { category: gender, subcategory: 'Running' },
            rating: 4.5 + (0.1 * (i % 5)),
            reviews: 50 + (i * 10),
            sizes: SIZES,
            image: PRODUCT_IMAGES[imgIdx],
            colors: [
                createVariant(imgIdx),
                createVariant((imgIdx + 1) % PRODUCT_IMAGES.length)
            ]
        });
    }

    // 2. LIFESTYLE (Sneakers)
    for (let i = 1; i <= 30; i++) {
        const imgIdx = (i + 2) % PRODUCT_IMAGES.length;
        const gender = GENDERS[(i + 1) % 3];

        products.push({
            id: `life-${i}`,
            name: `${BRANDS[(i + 1) % BRANDS.length]} Force ${i}`,
            brand: BRANDS[(i + 1) % BRANDS.length],
            price: 110 + (i * 5),
            description: 'Classic style meets modern comfort.',
            category: gender,
            subCategory: 'Sneakers',
            metadata: { category: gender, subcategory: 'Sneakers' },
            rating: 4.8,
            reviews: 100 + (i * 20),
            sizes: SIZES,
            image: PRODUCT_IMAGES[imgIdx],
            colors: [
                createVariant(imgIdx),
                createVariant((imgIdx + 3) % PRODUCT_IMAGES.length)
            ]
        });
    }

    // 3. FORMAL
    for (let i = 1; i <= 10; i++) {
        const imgIdx = (i + 4) % PRODUCT_IMAGES.length;
        products.push({
            id: `formal-${i}`,
            name: `Oxford Derby ${i}`,
            brand: 'New Balance',
            price: 150 + (i * 10),
            description: 'Modern comfort meets classic formal style.',
            category: 'Men',
            subCategory: 'Formal',
            metadata: { category: 'Men', subcategory: 'Formal' },
            rating: 4.7,
            reviews: 30 + (i * 5),
            sizes: SIZES,
            image: PRODUCT_IMAGES[imgIdx],
            colors: [
                createVariant(imgIdx)
            ]
        });
    }

    // 4. BASKETBALL
    for (let i = 1; i <= 20; i++) {
        const imgIdx = (i + 1) % PRODUCT_IMAGES.length;
        products.push({
            id: `bball-${i}`,
            name: `Jordan Retro ${1 + (i % 12)}`,
            brand: 'Jordan',
            price: 190 + (i * 10),
            description: 'Legendary style, unmatched performance.',
            category: 'Men',
            subCategory: 'Sneakers',
            metadata: { category: 'Men', subcategory: 'Sneakers' },
            rating: 4.9,
            reviews: 200 + (i * 15),
            sizes: SIZES,
            image: PRODUCT_IMAGES[imgIdx],
            colors: [
                createVariant(imgIdx),
                createVariant((imgIdx + 2) % PRODUCT_IMAGES.length)
            ]
        });
    }

    return products;
};

export const MOCK_PRODUCTS = generateProducts();
