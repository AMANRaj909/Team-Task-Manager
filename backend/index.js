const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

console.log('🎬 Starting server process...');
console.log('Environment PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/projects', require('./routes/projects'));
app.use('/tasks', require('./routes/tasks'));
app.use('/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => {
  res.json({ message: 'Team Task Manager API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server successfully started on port ${PORT}`);
  console.log(`📡 Listening on 0.0.0.0:${PORT}`);
});
