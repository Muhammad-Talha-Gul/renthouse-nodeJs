require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/routes/api');
const db = require('./src/config/db');
const cookieParser = require('cookie-parser');
const initializeDatabase = require("./src/Models/initializeDatabase");

const app = express();
app.use(cookieParser());
// Server port from .env or fallback to 5000
const PORT = process.env.PORT || 5000;

// Frontend URL for CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- Middleware ---
app.use(express.json());
app.use(cors({
    origin: FRONTEND_URL,          // Allow your frontend only
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,             // Allow cookies
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach the DB pool to each request so controllers can use `req.db.query(...)`
app.use((req, res, next) => {
    req.db = db;
    next();
});

initializeDatabase();

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Test Route ---
app.get('/', (req, res) => {
    res.send('🚀 Node.js Server is Running Successfully!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
