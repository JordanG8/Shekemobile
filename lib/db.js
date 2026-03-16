import { neon } from '@neondatabase/serverless';

// In-memory fallback store used when POSTGRES_URL is not configured
const memStore = {
  orders: [],
  nextId: 1,
};

// Returns true when a real Postgres connection is available
export function hasDb() {
  return Boolean(process.env.POSTGRES_URL);
}

// Returns a Neon SQL client using the POSTGRES_URL env var
export function getDb() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not set. Add your Vercel Postgres connection string.');
  }
  return neon(process.env.POSTGRES_URL);
}

// Creates the orders table if it doesn't exist yet (no-op for in-memory store)
export async function initDb() {
  if (!hasDb()) return; // use in-memory fallback — nothing to init
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

// ── In-memory CRUD helpers ────────────────────────────────────────────────────

export function memGetOrders() {
  return [...memStore.orders].reverse();
}

export function memAddOrder({ items, total, note = '' }) {
  const order = {
    id: memStore.nextId++,
    items,
    total: Number(total),
    note,
    created_at: new Date().toISOString(),
  };
  memStore.orders.push(order);
  return order;
}

export function memUpdateOrder(id, { note, items, total }) {
  const order = memStore.orders.find((o) => o.id === Number(id));
  if (!order) return null;
  if (note  != null) order.note  = note;
  if (items != null) order.items = items;
  if (total != null) order.total = Number(total);
  return order;
}

export function memDeleteOrder(id) {
  const idx = memStore.orders.findIndex((o) => o.id === Number(id));
  if (idx === -1) return false;
  memStore.orders.splice(idx, 1);
  return true;
}
