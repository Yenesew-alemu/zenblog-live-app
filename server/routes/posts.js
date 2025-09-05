// /server/routes/posts.js (PostgreSQL version)
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1000;
    const categoryId = req.query.categoryId
      ? parseInt(req.query.categoryId)
      : null;
    let query = `SELECT p.id, p.title, p.slug, LEFT(p.content, 150) as excerpt, p.featured_image_url, p.created_at, u.username as author_name, c.name as category_name, c.id as category_id FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN categories c ON p.category_id = c.id`;
    const queryParams = [];
    if (categoryId) {
      query += ` WHERE p.category_id = $${queryParams.length + 1}`;
      queryParams.push(categoryId);
    }
    query += ` ORDER BY p.created_at DESC LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);
    const result = await db.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const query = `SELECT p.id, p.title, p.slug, p.content, p.featured_image_url, p.created_at, u.username as author_name, u.id as author_id, c.name as category_name, c.id as category_id FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = $1;`;
    const result = await db.query(query, [req.params.slug]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Post not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Post not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// In /server/routes/posts.js

router.post('/', authMiddleware, async (req, res) => {
  // 1. ADD the new variables here
  const { title, content, category_id, featured_image_url, featured_image_public_id } = req.body;
  
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required.' });
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  
  try {
    // 2. ADD the new columns to the query
    const query = 'INSERT INTO posts (title, slug, content, author_id, category_id, featured_image_url, featured_image_public_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
    
    // 3. ADD the new variables to the parameters array
    const result = await db.query(query, [title, slug, content, req.user.id, category_id, featured_image_url, featured_image_public_id]);
    
    res.status(201).json({ message: 'Post created successfully', postId: result.rows[0].id });
  } catch (err) {
    if (err.code === "23505")
      return res
        .status(409)
        .json({ message: "A post with this title or slug already exists." });
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// In /server/routes/posts.js

router.put('/:id', authMiddleware, async (req, res) => {
  // 1. ADD the new variables here
  const { title, content, category_id, featured_image_url, featured_image_public_id } = req.body;
  const postId = req.params.id;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  
  try {
    // 2. ADD the new columns to the query
    const query = 'UPDATE posts SET title = $1, slug = $2, content = $3, category_id = $4, featured_image_url = $5, featured_image_public_id = $6 WHERE id = $7 AND author_id = $8';
    
    // 3. ADD the new variables to the parameters array
    const result = await db.query(query, [title, slug, content, category_id, featured_image_url, featured_image_public_id, postId, req.user.id]);
    
    if (result.rowCount === 0) return res.status(404).json({ message: 'Post not found or user not authorized.' });
    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    if (err.code === "23505")
      return res
        .status(409)
        .json({ message: "A post with this title or slug already exists." });
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM posts WHERE id = $1 AND author_id = $2",
      [req.params.id, req.user.id]
    );
    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ message: "Post not found or user not authorized." });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
z;
