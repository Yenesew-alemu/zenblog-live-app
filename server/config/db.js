// /server/config/db.js (Correct MySQL Version for Local Development)

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,      // Should be 'localhost' from your .env
  user: process.env.DB_USER,      // Should be 'root'
  password: process.env.DB_PASSWORD, // Should be your XAMPP/MySQL password
  database: process.env.DB_NAME,    // Should be 'zenblog_db'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();