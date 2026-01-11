
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const SAMPLE_PRODUCTS = [
    {
        name: "Nike Air Max 270",
        description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
        sale_price: 11995,
        price: 13995,
        thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        category: "Men",
        is_new_arrival: true,
        is_bestseller: true
    },
    {
        name: "Adidas Ultraboost Light",
        description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of adidas BOOST.",
        sale_price: 14999,
        price: 16999,
        thumbnail: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
        category: "Sports",
        is_new_arrival: true,
        is_bestseller: false
    },
    {
        name: "Puma RS-X Geek",
        description: "The RS-X is back. The silhouette of this sneaker is a classic, but the update is modern. With a mix of materials and a bold colourway.",
        sale_price: 8999,
        price: 9999,
        thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
        category: "Men",
        is_new_arrival: false,
        is_bestseller: true
    },
    {
        name: "New Balance 550",
        description: "The 550 debuted in 1989 and made its mark on basketball courts from coast to coast. After its initial run, the 550 was filed away in the archives, before being reintroduced in limited-edition releases in late 2020.",
        sale_price: null,
        price: 10999,
        thumbnail: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
        category: "Women",
        is_new_arrival: true,
        is_bestseller: true
    },
    {
        name: "Converse Chuck 70",
        description: "By 1970, the Chuck made its mark as one of the best basketball sneakers, ever. The Chuck 70 celebrates that heritage by bringing together archival-inspired details with modern comfort updates.",
        sale_price: 4999,
        price: 5999,
        thumbnail: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800",
        category: "Sneakers",
        is_new_arrival: false,
        is_bestseller: false
    },
    {
        name: "Vans Old Skool",
        description: "The Old Skool was our first footwear design to showcase the famous Vans Sidestripe—although back then, it was just a simple doodle drawn by founder Paul Van Doren.",
        sale_price: null,
        price: 5499,
        thumbnail: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
        category: "Kids",
        is_new_arrival: false,
        is_bestseller: true
    },
    {
        name: "Nike Dunk Low Retro",
        description: "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with perfectly sheened overlays and original university colors.",
        sale_price: null,
        price: 8695,
        thumbnail: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
        category: "Men",
        is_new_arrival: true,
        is_bestseller: true
    },
    {
        name: "Adidas Forum Low",
        description: "More than just a shoe, it's a statement. The adidas Forum hit the scene in '84 and gained major love on both the hardwood and in the music biz.",
        sale_price: 7999,
        price: 9999,
        thumbnail: "https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?w=800",
        category: "Women",
        is_new_arrival: false,
        is_bestseller: false
    },
    {
        name: "Reebok Club C 85",
        description: "Clean, minimalist design keeps your look fresh. These men's shoes offer a vintage style with a full grain leather upper.",
        sale_price: 5599,
        price: 6999,
        thumbnail: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800",
        category: "Sneakers",
        is_new_arrival: false,
        is_bestseller: true
    },
    {
        name: "Nike Air Force 1 '07",
        description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
        sale_price: null,
        price: 8195,
        thumbnail: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
        category: "Men",
        is_new_arrival: false,
        is_bestseller: true
    },
    {
        name: "Puma Palermo",
        description: "Direct from the archives, it's the Palermo. This classic terrace shoe is revived today with its signature T-toe construction, plus extra-bold colorblocking and plush materials.",
        sale_price: 6999,
        price: 7999,
        thumbnail: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800",
        category: "Women",
        is_new_arrival: true,
        is_bestseller: false
    },
    {
        name: "Adidas Samba OG",
        description: "Born on the pitch, the Samba is a timeless icon of street style. This silhouette stays true to its legacy with a tasteful, low-profile, soft leather upper, suede overlays and gum sole.",
        sale_price: null,
        price: 10999,
        thumbnail: "https://images.unsplash.com/photo-1518002171953-a080ee32280d?w=800",
        category: "Sneakers",
        is_new_arrival: true,
        is_bestseller: true
    }
];

async function seed() {
    console.log('Fetching categories...');
    const { data: categories, error: catError } = await supabase.from('categories').select('*');

    if (catError || !categories) {
        console.error('Error fetching categories:', catError);
        return;
    }

    const categoryMap: { [key: string]: string } = {};
    categories.forEach(c => {
        categoryMap[c.name] = c.id;
    });

    console.log('Seeding products...');
    for (const p of SAMPLE_PRODUCTS) {
        const catId = categoryMap[p.category] || categoryMap['Sneakers'] || categories[0].id;

        // Check if product exists to avoid duplicates
        const { data: existing } = await supabase.from('products').select('id').eq('name', p.name).single();

        if (!existing) {
            const { error } = await supabase.from('products').insert({
                name: p.name,
                description: p.description,
                price: p.price,
                sale_price: p.sale_price,
                is_on_sale: !!p.sale_price,
                thumbnail: p.thumbnail,
                images: [p.thumbnail, p.thumbnail, p.thumbnail, p.thumbnail], // Mocking multiple images with same URL for now
                category_id: catId,
                is_new_arrival: p.is_new_arrival,
                is_bestseller: p.is_bestseller,
                is_active: true,
                stock: 50,
                rating: 4.5,
                total_reviews: Math.floor(Math.random() * 100)
            });

            if (error) console.error(`Error inserting ${p.name}:`, error);
            else console.log(`Inserted ${p.name}`);
        } else {
            console.log(`Skipping ${p.name} (already exists)`);
        }
    }

    // Seed Coupons
    console.log('\nSeeding coupons...');
    const COUPONS = [
        { code: 'FIRST10', discount_value: 10, discount_type: 'percent', min_order: 500, max_discount: 500 },
        { code: 'FLAT100', discount_value: 100, discount_type: 'flat', min_order: 999, max_discount: 100 },
        { code: 'SAVE20', discount_value: 20, discount_type: 'percent', min_order: 2000, max_discount: 1000 },
        { code: 'MEGA50', discount_value: 50, discount_type: 'percent', min_order: 5000, max_discount: 2500 },
        { code: 'WELCOME', discount_value: 15, discount_type: 'percent', min_order: 0, max_discount: 300 },
    ];

    for (const coupon of COUPONS) {
        const { data: existing } = await supabase.from('coupons').select('id').eq('code', coupon.code).single();
        if (!existing) {
            const { error } = await supabase.from('coupons').insert({
                ...coupon,
                is_active: true,
                expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
            });
            if (error) console.error(`Error inserting coupon ${coupon.code}:`, error);
            else console.log(`Inserted coupon: ${coupon.code}`);
        } else {
            console.log(`Skipping coupon ${coupon.code} (already exists)`);
        }
    }

    // Seed Reviews
    console.log('\nSeeding reviews...');
    const { data: products } = await supabase.from('products').select('id, name').limit(6);

    const SAMPLE_REVIEWS = [
        { user_name: 'Rahul Sharma', rating: 5, comment: 'Absolutely love these! The fit is perfect and they look even better in person.', is_verified: true },
        { user_name: 'Priya Patel', rating: 4, comment: 'Comfortable for running, but I suggest buying one size larger.', is_verified: true },
        { user_name: 'Amit Singh', rating: 5, comment: 'Premium quality materials. Delivery was super fast.', is_verified: true },
        { user_name: 'Neha Gupta', rating: 5, comment: 'Best shoes I have ever bought. Worth every rupee!', is_verified: true },
        { user_name: 'Vikram Joshi', rating: 4, comment: 'Good quality but colour was slightly different from images.', is_verified: false },
        { user_name: 'Ananya Rao', rating: 5, comment: 'My son loves these shoes! Great for daily wear.', is_verified: true },
    ];

    if (products && products.length > 0) {
        for (const product of products) {
            // Add 2-3 reviews per product
            const reviewCount = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < reviewCount; i++) {
                const review = SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)];
                const { error } = await supabase.from('reviews').insert({
                    product_id: product.id,
                    user_name: review.user_name,
                    rating: review.rating,
                    comment: review.comment,
                    is_verified: review.is_verified
                });
                if (error && !error.message.includes('duplicate')) {
                    console.error(`Error inserting review for ${product.name}:`, error);
                }
            }
            console.log(`Added reviews for: ${product.name}`);
        }
    }

    console.log('\n✅ Seeding complete!');
}

seed();

