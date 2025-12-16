import { db } from '@vercel/postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function setupDatabase(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // Create CollectionLogs table
    const createLogsTable = await client.sql`
      CREATE TABLE IF NOT EXISTS collection_logs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        partner_id VARCHAR(255) NOT NULL,
        incentive_paid INT,
        notes TEXT,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log(`Created "collection_logs" table`);

    // Create CollectionItems table
    const createItemsTable = await client.sql`
      CREATE TABLE IF NOT EXISTS collection_items (
        id SERIAL PRIMARY KEY,
        log_id UUID NOT NULL REFERENCES collection_logs(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        quantity INT NOT NULL,
        condition VARCHAR(50) NOT NULL
      );
    `;
    console.log(`Created "collection_items" table`);

  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await setupDatabase(client);
  await client.end();
}

main().catch((err) => {
  console.error('An error occurred while setting up the database:', err);
});