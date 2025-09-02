// /server/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/users/:id - Fetch a user's public profile
router.get('/:id', async (req, res) => {
  try {
    const query = 'SELECT id, username, bio, profile_picture_url FROM users WHERE id = ?';
    const [rows] = await db.query(query, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/users/:id/posts - Fetch all posts for a specific user
router.get('/:id/posts', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id, p.title, p.slug, LEFT(p.content, 150) as excerpt,
        p.featured_image_url, p.created_at, u.username as author_name, 
        c.name as category_name 
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.author_id = ?
      ORDER BY p.created_at DESC;
    `;
    const [posts] = await db.query(query, [req.params.id]);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;