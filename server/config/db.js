// /server/config/db.js (PostgreSQL Connection String Version)
const { Pool } = require('pg');
require('dotenv').config();

// This configuration is designed to work with Render's Environment Variables
// It will look for a single DATABASE_URL string.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

module.exports = pool;