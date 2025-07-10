import Database from 'better-sqlite3';
import path from 'path';

export default function handler(req, res) {
  const db = new Database(path.resolve(process.cwd(), 'carrentalservices.db'));
  const { id } = req.query;
  if (req.method === 'PUT') {
    try {
      const { status, title, description, location } = req.body;
      console.log(req.body);
      const stmt = db.prepare(`
        UPDATE table_listings SET 
          status = COALESCE(?, status),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          location = COALESCE(?, location)
        WHERE id = ?
      `);
      const result = stmt.run(status, title, description, location, id);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'Listing not found or no changes made' });
      }

      return res.status(200).json({ message: 'Listing updated successfully' });
    } catch (err) {
      console.error('Error happened', err);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      db.close();
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
