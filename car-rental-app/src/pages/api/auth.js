// pages/api/login.js
import Database from 'better-sqlite3';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;
  const db = new Database('carrentalservices.db');

  try {
    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.status(200).json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    db.close();
  }
}
