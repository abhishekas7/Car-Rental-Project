import Database from 'better-sqlite3';

export default function handler(req, res) {
  console.log("dd");
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
    const db = new Database('carrentalservices.db');
    if (req.method === 'GET') {
      const listings = db.prepare('SELECT * FROM table_listings').all();
      res.status(200).json({ success: true, data: listings });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }
  