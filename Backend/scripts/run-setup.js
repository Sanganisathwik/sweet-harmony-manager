import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Client } = pg;

async function runSetup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Read the SQL file
    const sqlFile = path.join(__dirname, 'setup-database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('\nRunning database setup...');
    await client.query(sql);
    
    // Verify the data
    const result = await client.query('SELECT COUNT(*) as count FROM sweets');
    console.log(`\n✅ Database setup complete!`);
    console.log(`📦 Total sweets in database: ${result.rows[0].count}`);

    // Show sample data
    const sample = await client.query('SELECT name, category, price FROM sweets LIMIT 5');
    console.log('\n📋 Sample data:');
    sample.rows.forEach(row => {
      console.log(`   - ${row.name} (${row.category}) - ₹${row.price}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('auth.users')) {
      console.log('\n⚠️  Note: Some constraints reference auth.users table.');
      console.log('   The sweets table should still be created successfully.');
    }
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed.');
  }
}

runSetup();
