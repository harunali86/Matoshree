const { Client } = require('pg');

const connectionString = 'postgresql://postgres.cgbxhkizcwmqgckxvhau:MatoshreeDB2026@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function verifyDatabase() {
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected!\n');

        // Check tables
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' ORDER BY table_name
        `);
        console.log('📊 Tables in database:');
        tables.rows.forEach(row => console.log('  ✓', row.table_name));

        // Check counts
        console.log('\n📈 Data counts:');
        const categories = await client.query('SELECT COUNT(*) FROM categories');
        console.log('  Categories:', categories.rows[0].count);

        const brands = await client.query('SELECT COUNT(*) FROM brands');
        console.log('  Brands:', brands.rows[0].count);

        const products = await client.query('SELECT COUNT(*) FROM products');
        console.log('  Products:', products.rows[0].count);

        const banners = await client.query('SELECT COUNT(*) FROM hero_banners');
        console.log('  Hero Banners:', banners.rows[0].count);

        console.log('\n✅ MATOSHREE Footwear database is ready!');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

verifyDatabase();
