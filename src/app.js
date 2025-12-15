const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'myapp',
  password: process.env.DB_PASSWORD || 'postgres123',
  port: process.env.DB_PORT || 5432,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

if (process.env.NODE_ENV !== 'test') {
  initDB().then(() => console.log('✅ DB inicializada')).catch(console.error);
}

app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'test') {
    return res.status(200).json({ message: 'Bienvenido a la API' });
  }
  res.sendFile('index.html', { root: 'public' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
