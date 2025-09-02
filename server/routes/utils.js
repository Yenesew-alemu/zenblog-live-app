// /server/routes/utils.js (PostgreSQL version)
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/search', async (req, res) => {
  const queryTerm = req.query.q;
  if (!queryTerm) return res.status(400).json({ message: 'Search query is required.' });
  try {
    const query = `SELECT p.id, p.title, p.slug, LEFT(p.content, 150) as excerpt, p.created_at, u.username as author_name, c.name as category_name FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.title ILIKE $1 OR p.content ILIKE $1 ORDER BY p.created_at DESC;`;
    const searchTerm = `%${queryTerm}%`;
    const result = await db.query(query, [searchTerm]);
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ message: 'All fields are required.' });
  console.log('--- New Contact Form Submission ---');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  res.status(200).json({ message: 'Thank you for your message.' });
});

module.exports = router;