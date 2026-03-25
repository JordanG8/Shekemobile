import { neon } from '@neondatabase/serverless';

// Returns a Neon SQL client using the POSTGRES_URL env var
// On Vercel: connect a Neon Postgres store to the project via
// Dashboard → Storage → select store → Connect to Project
export function getDb() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not set. Add your Vercel Postgres connection string.');
  }
  return neon(process.env.POSTGRES_URL);
}

// Creates the necessary tables if they don't exist yet
export async function initDb() {
  const sql = getDb();
  
  // Products table
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id       SERIAL PRIMARY KEY,
      name     TEXT NOT NULL,
      price    NUMERIC(10,2) NOT NULL,
      category TEXT NOT NULL,
      active   BOOLEAN DEFAULT TRUE
    );
  `;

  // Trips table
  await sql`
    CREATE TABLE IF NOT EXISTS trips (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      start_time TIMESTAMPTZ DEFAULT NOW(),
      end_time   TIMESTAMPTZ,
      status     TEXT DEFAULT 'active' -- 'active' or 'closed'
    );
  `;

  // Orders table with trip_id
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id         SERIAL PRIMARY KEY,
      trip_id    INTEGER REFERENCES trips(id),
      items      JSONB        NOT NULL,
      total      NUMERIC(10,2) NOT NULL,
      note       TEXT         DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}
