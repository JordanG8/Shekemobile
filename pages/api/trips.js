import { getDb, initDb } from '../../lib/db';

export default async function handler(req, res) {
  try {
    await initDb();
    const sql = getDb();

    if (req.method === 'GET') {
      const { status } = req.query;
      let query;
      if (status === 'active') {
        query = sql`SELECT * FROM trips WHERE status = 'active' ORDER BY start_time DESC LIMIT 1;`;
      } else {
        query = sql`SELECT * FROM trips ORDER BY start_time DESC;`;
      }
      const rows = await query;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, action } = req.body;
      
      if (action === 'start') {
        // Ensure no other active trip
        await sql`UPDATE trips SET status = 'closed', end_time = NOW() WHERE status = 'active';`;
        const [row] = await sql`
          INSERT INTO trips (name, status)
          VALUES (${name || 'נסיעה חדשה'}, 'active')
          RETURNING *;
        `;
        return res.status(201).json(row);
      }
      
      if (action === 'close') {
        const { id } = req.body;
        const [row] = await sql`
          UPDATE trips
          SET status = 'closed', end_time = NOW()
          WHERE id = ${id}
          RETURNING *;
        `;
        return res.status(200).json(row);
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: err.message });
  }
}
