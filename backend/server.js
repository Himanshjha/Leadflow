// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup for frontend (Vercel)
const allowedOrigins = [
  'https://leadflow-seven.vercel.app', //  frontend
  'http://localhost:5173' //  local dev
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
  res.send('LeadFlow backend is running 🚀');
});

// MongoDB connection + server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
