import Database from 'better-sqlite3';

export default function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, status } = req.body;

  if (!id || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  console.log('Received request to update listing status:', { id, status });

  const db = new Database('carrentalservices.db');

  try {
    const stmt = db.prepare(`UPDATE table_listings SET status = ? WHERE id = ?`);
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    return res.status(200).json({ success: true, message: `Status updated to ${status}` });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    db.close();
  }
}
