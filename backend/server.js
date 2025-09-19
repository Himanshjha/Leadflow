// server.js
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // require cors in CommonJS
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // update with your auth route
const leadRoutes = require('./routes/leadRoutes'); // update with your lead route

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://leadflow-git-main-himanshu-jhas-projects-f8c5ef3c.vercel.app/', // frontend URL
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Fallback for unknown routes
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
