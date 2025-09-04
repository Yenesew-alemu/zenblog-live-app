// /server/index.js (Production Version for 'deploy' branch)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- 1. Import all your route files ---
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const utilRoutes = require('./routes/utils');

const app = express();

// --- 2. Advanced CORS Configuration ---
// This is the "guest list" of URLs that are allowed to make requests to our API.
const allowedOrigins = [
  // IMPORTANT: You will replace this placeholder with your actual live frontend URL from Render.
  'https://zenblog-live-client.onrender.com/', 
  
  // It's good practice to also include your local development URL for testing.
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // The '!origin' check allows requests from tools like Postman that don't have an origin.
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request.
    } else {
      callback(new Error('This origin is not allowed by the CORS policy.')); // Block the request.
    }
  },
  optionsSuccessStatus: 200
};

// Use the advanced CORS options.
app.use(cors(corsOptions));

// --- 3. Standard Middleware ---
// This line is crucial for parsing JSON bodies from requests.
app.use(express.json());


// --- 4. API Route Setup ---
// The "switchboard" that directs traffic to your route files.
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api', utilRoutes);


// --- 5. Root Test Route ---
// A simple route to confirm the server is running.
app.get('/', (req, res) => {
  res.send('Hello from the ZenBlog API!');
});


// --- 6. Server Start Logic ---
// Render will provide the PORT via its own environment variable.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});