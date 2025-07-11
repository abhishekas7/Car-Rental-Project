import Database from 'better-sqlite3';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const db = new Database('carrentalservices.db');

  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '5');
    const offset = (page - 1) * limit;

    const listings = db
      .prepare('SELECT * FROM table_listings ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) AS count FROM table_listings').get().count;

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    db.close();
  }
}
