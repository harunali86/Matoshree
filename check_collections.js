const { Client } = require('pg');

const client = new Client({
    connectionString: "postgres://postgres:matoshree5673@db.cgbxhkizcwmqgckxvhau.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        await client.connect();

        console.log("--- COLLECTIONS TABLE ---");
        const resColl = await client.query("SELECT * FROM collections");
        console.log(resColl.rows);

        console.log("\n--- PRODUCTS TAGS SAMPLE ---");
        const resProd = await client.query("SELECT id, name, tags FROM products LIMIT 5");
        console.log(resProd.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

check();
