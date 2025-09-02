const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required.' });
  try {
    const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
    const [result] = await db.query(query, [name, description || null]);
    const [newCategoryRows] = await db.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json(newCategoryRows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'A category with this name already exists.' });
    console.error(err.message); res.status(500).send('Server Error');
  }
});
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
module.exports = router;