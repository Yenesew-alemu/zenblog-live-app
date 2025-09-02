// /server/routes/utils.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/search?q=... - Search for posts
router.get('/search', async (req, res) => {
  const queryTerm = req.query.q;
  if (!queryTerm) {
    return res.status(400).json({ message: 'Search query is required.' });
  }
  try {
    // Note: MySQL's default behavior for LIKE is often case-insensitive.
    const query = `
      SELECT 
        p.id, p.title, p.slug, LEFT(p.content, 150) as excerpt,
        p.created_at, u.username as author_name, c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.title LIKE ? OR p.content LIKE ?
      ORDER BY p.created_at DESC;
    `;
    const searchTerm = `%${queryTerm}%`;
    const [posts] = await db.query(query, [searchTerm, searchTerm]);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/contact - Handle contact form submission
// This route does not interact with the database, so its code is the same for both MySQL and PostgreSQL.
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  
  console.log('--- New Contact Form Submission ---');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log('---------------------------------');

  res.status(200).json({ message: 'Thank you for your message. We will get back to you soon!' });
});

module.exports = router;