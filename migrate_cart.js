const { Client } = require('pg');

const connectionString = 'postgresql://postgres.cgbxhkizcwmqgckxvhau:MatoshreeDB2026@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function migrateCart() {
    try {
        console.log('Connecting to Supabase...');
        await client.connect();
        console.log('Connected!');

        console.log('Creating cart_items table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID,
                product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                quantity INT DEFAULT 1,
                size TEXT,
                color TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, product_id, size, color)
            );
        `);
        // Enable RLS
        await client.query(`ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;`);
        // Policy: Users leverage their own cart
        // Note: We need auth.uid() function which relies on Supabase Auth context.
        // For admin connection, we can create policies but they check against auth.uid().

        await client.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users manage own cart'
                ) THEN
                    CREATE POLICY "Users manage own cart" ON cart_items 
                    FOR ALL 
                    USING (auth.uid() = user_id);
                END IF;
            END $$;
        `);

        console.log('cart_items table created with RLS!');

        console.log('Creating recently_viewed table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS recently_viewed (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID, 
                product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                viewed_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, product_id)
            );
        `);
        await client.query(`ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;`);
        await client.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies WHERE tablename = 'recently_viewed' AND policyname = 'Users manage own history'
                ) THEN
                    CREATE POLICY "Users manage own history" ON recently_viewed 
                    FOR ALL 
                    USING (auth.uid() = user_id);
                END IF;
            END $$;
        `);
        console.log('recently_viewed table created with RLS!');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

migrateCart();
