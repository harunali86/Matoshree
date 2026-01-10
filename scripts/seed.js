import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const DESC_RUNNING = "Engineered for the driven runner. These shoes feature our latest responsive cushioning technology that returns energy with every step. The breathable mesh upper keeps your feet cool during intense workouts, while the durable rubber outsole ensures superior traction on any surface.";

const DESC_SNEAKER = "Street-ready style meets unparalleled comfort. Inspired by classic designs, this modern take features premium materials and a soft foam midsole for all-day wearability.";

// PROPER STRUCTURE: Each color has its OWN set of images (same shoe, different angles)
const PRODUCTS = [
    {
        name: 'Nike Pegasus 40',
        price: 11995,
        cat: 'Men',
        sub: 'Running',
        desc: DESC_RUNNING,
        colors: [
            {
                id: '1',
                name: 'Black/White',
                hex: '#000000',
                images: [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Black shoe angle 1
                    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', // Black shoe angle 2
                    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', // Black shoe angle 3
                ]
            },
            {
                id: '2',
                name: 'Blue/Orange',
                hex: '#2563EB',
                images: [
                    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80', // Blue shoe angle 1
                    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', // Blue shoe angle 2
                    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80', // Blue shoe angle 3
                ]
            }
        ],
        outOfStockSizes: ['UK 6', 'UK 11']
    },
    {
        name: 'Air Jordan 1 High',
        price: 12495,
        cat: 'Men',
        sub: 'Sneakers',
        desc: DESC_SNEAKER,
        colors: [
            {
                id: '1',
                name: 'Chicago Red',
                hex: '#DC2626',
                images: [
                    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80', // Red Jordan angle 1
                    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80', // Red Jordan angle 2
                    'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80', // Red Jordan angle 3
                ]
            },
            {
                id: '2',
                name: 'Royal Blue',
                hex: '#1E3A8A',
                images: [
                    'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=800&q=80', // Blue Jordan angle 1
                    'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&q=80', // Blue Jordan angle 2
                    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80', // Blue Jordan angle 3
                ]
            }
        ],
        outOfStockSizes: ['UK 10']
    },
    {
        name: 'Adidas Ultraboost 23',
        price: 18999,
        cat: 'Men',
        sub: 'Running',
        desc: DESC_RUNNING,
        colors: [
            {
                id: '1',
                name: 'Triple White',
                hex: '#FFFFFF',
                images: [
                    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80', // White angle 1
                    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', // White angle 2
                    'https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=800&q=80', // White angle 3
                ]
            },
            {
                id: '2',
                name: 'Core Black',
                hex: '#000000',
                images: [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Black angle 1
                    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', // Black angle 2
                    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', // Black angle 3
                ]
            }
        ],
        outOfStockSizes: []
    },
    {
        name: 'Nike Dunk Low',
        price: 8295,
        cat: 'Men',
        sub: 'Sneakers',
        desc: DESC_SNEAKER,
        colors: [
            {
                id: '1',
                name: 'Panda (Black/White)',
                hex: '#000000',
                images: [
                    'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=800&q=80',
                    'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&q=80',
                    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80',
                ]
            },
            {
                id: '2',
                name: 'University Blue',
                hex: '#3B82F6',
                images: [
                    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',
                    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
                ]
            }
        ],
        outOfStockSizes: ['UK 7']
    },
    {
        name: 'Adidas Stan Smith',
        price: 7999,
        cat: 'Women',
        sub: 'Sneakers',
        desc: DESC_SNEAKER,
        colors: [
            {
                id: '1',
                name: 'White/Green',
                hex: '#FFFFFF',
                images: [
                    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
                    'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&q=80',
                    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
                ]
            }
        ],
        outOfStockSizes: []
    },
    {
        name: 'Puma Suede Classic',
        price: 6999,
        cat: 'Men',
        sub: 'Sneakers',
        desc: DESC_SNEAKER,
        colors: [
            {
                id: '1',
                name: 'Navy Blue',
                hex: '#1E3A8A',
                images: [
                    'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80',
                    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
                ]
            },
            {
                id: '2',
                name: 'Burgundy',
                hex: '#991B1B',
                images: [
                    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
                    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
                ]
            }
        ],
        outOfStockSizes: ['UK 8', 'UK 9']
    },
];

const seed = async () => {
    console.log('🎨 Seeding with COLOR-SPECIFIC IMAGE SETS...');
    const TENANT_ID = '44bec768-506e-4477-bbe0-1394d073382e';

    const { error: deleteError } = await supabase.from('products').delete().eq('tenant_id', TENANT_ID);
    if (!deleteError) console.log('✅ Cleared old products');

    let count = 0;
    for (const p of PRODUCTS) {
        const rating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
        const reviewCount = Math.floor(Math.random() * 400) + 100;

        // Use first color's images as main product images
        const mainImages = p.colors[0].images;

        const { error } = await supabase.from('products').insert([
            {
                name: p.name,
                slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                status: 'active',
                price: p.price,
                description: p.desc,
                images: mainImages, // Main product images (first color)
                metadata: {
                    category: p.cat,
                    subcategory: p.sub,
                    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
                    colors: p.colors, // Each color has its own image set
                    outOfStockSizes: p.outOfStockSizes || [],
                    rating: rating,
                    reviews: reviewCount
                },
                tenant_id: TENANT_ID
            }
        ]);

        if (error) {
            console.error(`❌ ${p.name}: ${error.message}`);
        } else {
            count++;
            console.log(`✅ ${count}. ${p.name} (${p.colors.length} colors, each with ${p.colors[0].images.length} images)`);
        }
    }

    console.log(`\n🎉 SUCCESS! ${count} products with color-specific image sets`);
};

seed();
