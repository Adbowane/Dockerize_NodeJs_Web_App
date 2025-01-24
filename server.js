const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || '34.38.121.61',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fast_food_kiosk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
// Route pour récupérer les catégories
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE is_active = true');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route pour récupérer les produits
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE stock_quantity > 0');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route pour récupérer les produits par catégorie
app.get('/api/products/category/:categoryId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE category_id = ? AND stock_quantity > 0',
      [req.params.categoryId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
