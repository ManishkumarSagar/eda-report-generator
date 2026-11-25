const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/datasets', require('./routes/datasetRoutes'));
app.use('/api/eda', require('./routes/edaRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));         // <-- ADD KAREIN
app.use('/api/reports', require('./routes/reportRoutes')); // <-- ADD KAREIN

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});