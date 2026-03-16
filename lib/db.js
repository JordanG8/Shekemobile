import { neon } from '@neondatabase/serverless';

// Returns a Neon SQL client using the POSTGRES_URL env var
// On Vercel: set this via Dashboard → Storage → Postgres → Connect
export function getDb() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not set. Add your Vercel Postgres connection string.');
  }
  return neon(process.env.POSTGRES_URL);
}

// Creates the orders table if it doesn't exist yet
export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id        SERIAL PRIMARY KEY,
      items     JSONB        NOT NULL,
      total     NUMERIC(10,2) NOT NULL,
      note      TEXT         DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}
