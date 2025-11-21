require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({
  // FIX: Allow both common Vite ports to prevent CORS errors
  origin: ['http://localhost:5173', 'http://localhost:3000'], 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('MERN Architect API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});