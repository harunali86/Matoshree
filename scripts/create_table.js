const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_EzU2IJVOhF0K@ep-misty-field-a1e09vzj.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const client = new Client({
    connectionString: DATABASE_URL,
});

async function createTables() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // 1. Create 'orders' table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        user_id UUID NOT NULL,
        tenant_id UUID NOT NULL,
        status TEXT DEFAULT 'pending',
        total_amount NUMERIC NOT NULL,
        shipping_address JSONB,
        metadata JSONB
      );
    `);
        console.log('Created orders table.');

        // 2. Create 'order_items' table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.order_items (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
        product_id UUID NOT NULL, -- references products(id) but might be loose if products are in another schema? No, same schema.
        product_name TEXT,
        quantity INTEGER NOT NULL,
        price NUMERIC NOT NULL,
        size TEXT,
        color TEXT,
        image TEXT
      );
    `);
        console.log('Created order_items table.');

        // 3. Enable RLS (Security) - Optional for now but good practice
        // await client.query(`ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;`);
        // await client.query(`ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;`);

    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await client.end();
    }
}

createTables();
