// backend/src/server.js
require('dotenv').config(); // MUST be first

const express = require('express');
const cors = require('cors');
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow same-origin requests (Nginx reverse proxy)
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Fetch entries
app.get('/api/entries', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, content, created_at FROM entries ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
});

// Create entry
app.post('/api/entries', async (req, res) => {
  try {
    const content = (req.body?.content || '').trim();
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const {
      rows: [entry],
    } = await pool.query(
      'INSERT INTO entries (content) VALUES ($1) RETURNING id, content, created_at',
      [content]
    );

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create entry' });
  }
});

// Bootstrap
async function bootstrap() {
  await initDb();
  app.listen(PORT, () =>
    console.log(`Backend running on ${PORT}`)
  );
}

bootstrap();
