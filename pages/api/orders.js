import { getDb, initDb } from '../../lib/db';

export default async function handler(req, res) {
  try {
    await initDb(); // ensures table exists on first request
    const sql = getDb();

    // GET /api/orders — return all orders sorted newest first
    if (req.method === 'GET') {
      const { trip_id } = req.query;
      let query;
      if (trip_id) {
        query = sql`SELECT id, trip_id, items, total, note, created_at FROM orders WHERE trip_id = ${trip_id} ORDER BY created_at DESC;`;
      } else {
        query = sql`SELECT id, trip_id, items, total, note, created_at FROM orders ORDER BY created_at DESC LIMIT 200;`;
      }
      const rows = await query;
      return res.status(200).json(rows);
    }

    // POST /api/orders — save a new completed order
    if (req.method === 'POST') {
      const { items, total, note, trip_id } = req.body;
      if (!items || total == null) {
        return res.status(400).json({ error: 'Missing items or total' });
      }
      
      // If trip_id is missing, try to find active trip
      let finalTripId = trip_id;
      if (!finalTripId) {
        const [activeTrip] = await sql`SELECT id FROM trips WHERE status = 'active' ORDER BY start_time DESC LIMIT 1;`;
        finalTripId = activeTrip?.id || null;
      }

      const [row] = await sql`
        INSERT INTO orders (items, total, note, trip_id)
        VALUES (${JSON.stringify(items)}, ${total}, ${note || ''}, ${finalTripId})
        RETURNING id, trip_id, items, total, note, created_at;
      `;

      // Fire-and-forget webhook to Google Sheets
      if (process.env.SHEETS_WEBHOOK_URL) {
        fetch(process.env.SHEETS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...row, items: Array.isArray(row.items) ? row.items : JSON.parse(row.items) }),
        }).catch(err => console.error('Sheets webhook error:', err));
      }

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
