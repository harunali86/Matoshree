import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
// Using service_role key for direct DB access
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnYnhoa2l6Y3dtcWdja3h2aGF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2OTU4MSwiZXhwIjoyMDc1MTQ1NTgxfQ.3NZhpSlQI17kLR8mnWLgkIOz0qmVjiaeOWKBXR4aTy8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
    console.log('🔧 Seeding database with real data...\n');

    // Seed Coupons
    console.log('📦 Inserting coupons...');
    const COUPONS = [
        { code: 'FIRST10', discount_value: 10, discount_type: 'percent', min_order: 500, max_discount: 500, is_active: true },
        { code: 'FLAT100', discount_value: 100, discount_type: 'flat', min_order: 999, max_discount: 100, is_active: true },
        { code: 'SAVE20', discount_value: 20, discount_type: 'percent', min_order: 2000, max_discount: 1000, is_active: true },
        { code: 'MEGA50', discount_value: 50, discount_type: 'percent', min_order: 5000, max_discount: 2500, is_active: true },
        { code: 'WELCOME', discount_value: 15, discount_type: 'percent', min_order: 0, max_discount: 300, is_active: true },
    ];

    for (const coupon of COUPONS) {
        const { error } = await supabase.from('coupons').upsert(coupon, { onConflict: 'code' });
        if (error) {
            console.error(`❌ Coupon ${coupon.code}:`, error.message);
        } else {
            console.log(`✅ Coupon: ${coupon.code}`);
        }
    }

    // Seed Reviews
    console.log('\n📝 Fetching products for reviews...');
    const { data: products, error: prodError } = await supabase.from('products').select('id, name').limit(10);

    if (prodError || !products || products.length === 0) {
        console.error('❌ No products found:', prodError?.message);
        return;
    }

    console.log(`Found ${products.length} products. Adding reviews...\n`);

    const REVIEWS = [
        { user_name: 'Rahul Sharma', rating: 5, comment: 'Absolutely love these! The fit is perfect and they look even better in person.', is_verified: true },
        { user_name: 'Priya Patel', rating: 4, comment: 'Comfortable for running, but I suggest buying one size larger.', is_verified: true },
        { user_name: 'Amit Singh', rating: 5, comment: 'Premium quality materials. Delivery was super fast.', is_verified: true },
        { user_name: 'Neha Gupta', rating: 5, comment: 'Best shoes I have ever bought. Worth every rupee!', is_verified: true },
        { user_name: 'Vikram Joshi', rating: 4, comment: 'Good quality but colour was slightly different from images.', is_verified: false },
        { user_name: 'Ananya Rao', rating: 5, comment: 'My son loves these shoes! Great for daily wear.', is_verified: true },
        { user_name: 'Karan Mehta', rating: 5, comment: 'Super comfortable! Wearing these daily to office.', is_verified: true },
        { user_name: 'Sneha Das', rating: 4, comment: 'Nice design but took 2 days extra for delivery.', is_verified: true },
    ];

    for (const product of products) {
        const reviewCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < reviewCount; i++) {
            const review = REVIEWS[Math.floor(Math.random() * REVIEWS.length)];
            const { error } = await supabase.from('reviews').insert({
                product_id: product.id,
                user_name: review.user_name,
                rating: review.rating,
                comment: review.comment,
                is_verified: review.is_verified
            });
            if (error && !error.message.includes('duplicate')) {
                console.error(`❌ Review for ${product.name}:`, error.message);
            }
        }
        console.log(`✅ ${reviewCount} reviews added for: ${product.name}`);
    }

    console.log('\n🎉 Database seeding complete!');
    console.log('✅ Coupons: FIRST10, FLAT100, SAVE20, MEGA50, WELCOME');
    console.log('✅ Reviews added to all products');
}

seedDatabase();
