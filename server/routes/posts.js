// /server/routes/posts.js (FINAL, CORRECTED MySQL Version)
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/posts - Fetch all posts with optional filtering
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : null;

    let query = `
      SELECT 
        p.id, p.title, p.slug, LEFT(p.content, 150) as excerpt, 
        p.featured_image_url, p.created_at, u.username as author_name, 
        c.name as category_name, c.id as category_id
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const queryParams = [];

    if (categoryId) {
      query += ' WHERE p.category_id = ?';
      queryParams.push(categoryId);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ?';
    queryParams.push(limit);

    const [posts] = await db.query(query, queryParams);
    res.json(posts);
  } catch (err) {
    console.error(`Error fetching posts: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// GET /api/posts/:slug - Fetch a single post by its unique slug
router.get('/:slug', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id, p.title, p.slug, p.content, p.featured_image_url, 
        p.created_at, u.username as author_name, u.id as author_id,
        c.name as category_name, c.id as category_id
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?;
    `;
    const [rows] = await db.query(query, [req.params.slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching single post by slug: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// GET /api/posts/id/:id - Fetch a single post by its Primary Key ID
router.get('/id/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching single post by ID: ${err.message}`);
    res.status(500).send('Server error');
  }
});

// --- All the protected routes (POST, PUT, DELETE) remain the same ---
// (The code for these is below, you can include them to be complete)

router.post('/', authMiddleware, async (req, res) => {
  const { title, content, category_id, featured_image_url, featured_image_public_id } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required.' });
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  try {
    const query = 'INSERT INTO posts (title, slug, content, author_id, category_id, featured_image_url, featured_image_public_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [title, slug, content, req.user.id, category_id, featured_image_url, featured_image_public_id]);
    res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'A post with this title or slug already exists.' });
    console.error(err.message); res.status(500).send('Server error');
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content, category_id, featured_image_url, featured_image_public_id } = req.body;
  const postId = req.params.id;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  try {
    const query = 'UPDATE posts SET title = ?, slug = ?, content = ?, category_id = ?, featured_image_url = ?, featured_image_public_id = ? WHERE id = ? AND author_id = ?';
    const [result] = await db.query(query, [title, slug, content, category_id, featured_image_url, featured_image_public_id, postId, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found or user not authorized.' });
    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'A post with this title or slug already exists.' });
    console.error(err.message); res.status(500).send('Server error');
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM posts WHERE id = ? AND author_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found or user not authorized.' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) { console.error(err.message); res.status(500).send('Server error'); }
});


module.exports = router;