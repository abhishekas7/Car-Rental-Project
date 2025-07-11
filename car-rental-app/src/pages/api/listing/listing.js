import Database from 'better-sqlite3';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const db = new Database('carrentalservices.db');

  try {
const { page = 1, limit = 10, status = 'all' } = req.query;
const offset = (page - 1) * limit;

let query = 'SELECT * FROM table_listings';
let countQuery = 'SELECT COUNT(*) as count FROM table_listings';
const params = [];

if (status !== 'all') {
  query += ' WHERE status = ?';
  countQuery += ' WHERE status = ?';
  params.push(status);
}

query += ' LIMIT ? OFFSET ?';
params.push(Number(limit), Number(offset));

const listings = db.prepare(query).all(...params);
const total = db.prepare(countQuery).get(...params.slice(0, params.length - 2)).count;

return res.status(200).json({
  success: true,
  data: listings,
  pagination: {
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  },
});

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    db.close();
  }
}
