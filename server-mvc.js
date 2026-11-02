// server-mvc.js — PART 3 (MVC entry point) + serves the frontend folder
require('dotenv').config();
const path = require('path');
const express = require('express');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Frontend (dining room): http://localhost:3000/
app.use(express.static(path.join(__dirname, 'frontend')));

// API health check
app.get('/api', (req, res) => {
  res.json({ message: 'Task API (MVC version) is ready!' });
});

// Every route inside taskRoutes is prefixed with /tasks
app.use('/tasks', taskRoutes);

// Global error handler — must be after all routes
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`MVC server running at http://localhost:${PORT}`);
});
