import { getDb, initDb } from '../../lib/db';

export default async function handler(req, res) {
  try {
    await initDb();
    const sql = getDb();

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM products WHERE active = true ORDER BY category, name ASC;`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, price, category } = req.body;
      const [row] = await sql`
        INSERT INTO products (name, price, category)
        VALUES (${name}, ${price}, ${category})
        RETURNING *;
      `;
      return res.status(201).json(row);
    }

    if (req.method === 'PUT') {
      const { id, name, price, category, active } = req.body;
      const [row] = await sql`
        UPDATE products
        SET
          name = COALESCE(${name}, name),
          price = COALESCE(${price}, price),
          category = COALESCE(${category}, category),
          active = COALESCE(${active}, active)
        WHERE id = ${id}
        RETURNING *;
      `;
      return res.status(200).json(row);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`UPDATE products SET active = false WHERE id = ${id};`;
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: err.message });
  }
}
