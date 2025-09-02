// /server/index.js (FINAL, CORRECTED VERSION FOR LOCAL DEVELOPMENT)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- 1. IMPORT ALL ROUTE FILES ---
// Ensure all these lines are present and the paths are correct.
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const utilRoutes = require('./routes/utils');

const app = express();

// Use simple CORS for local development.
app.use(cors());

// This line is crucial for parsing JSON bodies from requests.
app.use(express.json());

// --- 2. TELL EXPRESS TO USE THE ROUTES ---
// This is the "switchboard" that directs traffic.
// A missing line here is the most common cause of 404 errors.
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api', utilRoutes);

// A simple test route to confirm the server is running at the root.
app.get('/', (req, res) => {
  res.send('Hello from the ZenBlog API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});