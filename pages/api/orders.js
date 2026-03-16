import {
  getDb,
  hasDb,
  initDb,
  memAddOrder,
  memDeleteOrder,
  memGetOrders,
  memUpdateOrder,
} from '../../lib/db';

export default async function handler(req, res) {
  try {
    await initDb(); // no-op when POSTGRES_URL is not set

    // ── In-memory fallback (no POSTGRES_URL configured) ──────────────────────
    if (!hasDb()) {
      if (req.method === 'GET') {
        return res.status(200).json(memGetOrders());
      }
      if (req.method === 'POST') {
        const { items, total, note } = req.body;
        if (!items || total == null) {
          return res.status(400).json({ error: 'Missing items or total' });
        }
        return res.status(201).json(memAddOrder({ items, total, note }));
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Missing id' });
        const row = memUpdateOrder(id, req.body);
        if (!row) return res.status(404).json({ error: 'Order not found' });
        return res.status(200).json(row);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Missing id' });
        const ok = memDeleteOrder(id);
        if (!ok) return res.status(404).json({ error: 'Order not found' });
        return res.status(200).json({ success: true });
      }
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // ── Postgres path ─────────────────────────────────────────────────────────
    const sql = getDb();

    // GET /api/orders — return all orders sorted newest first
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, items, total, note, created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 200;
      `;
      return res.status(200).json(rows);
    }

    // POST /api/orders — save a new completed order
    if (req.method === 'POST') {
      const { items, total, note } = req.body;
      if (!items || total == null) {
        return res.status(400).json({ error: 'Missing items or total' });
      }
      const [row] = await sql`
        INSERT INTO orders (items, total, note)
        VALUES (${JSON.stringify(items)}, ${total}, ${note || ''})
        RETURNING id, items, total, note, created_at;
      `;
      return res.status(201).json(row);
    }

    // PUT /api/orders?id=X — update an order's note (or items if needed)
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { note, items, total } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const [row] = await sql`
        UPDATE orders
        SET
          note  = COALESCE(${note ?? null}, note),
          items = COALESCE(${items ? JSON.stringify(items) : null}::jsonb, items),
          total = COALESCE(${total ?? null}, total)
        WHERE id = ${id}
        RETURNING id, items, total, note, created_at;
      `;
      if (!row) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json(row);
    }

    // DELETE /api/orders?id=X — delete an order
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      await sql`DELETE FROM orders WHERE id = ${id};`;
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: err.message });
  }
}
