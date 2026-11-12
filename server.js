// The LexPrep web server.  Run with:  npm start
// Then open http://localhost:3000 in your browser.
require('dotenv').config();
const path = require('path');
const express = require('express');
const mysql = require('mysql2/promise');
const Category = require('./Category');
const TermRepository = require('./TermRepository');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const terms = new TermRepository(db);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));   // the front end pages live in /public

// All 7 subjects
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY category_id');
    res.json(rows.map(row => new Category(row.category_id, row.name)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Terms:  /api/terms              -> all terms
//         /api/terms?search=hear  -> search by keyword  (TC-01)
//         /api/terms?category=1   -> one subject         (TC-02)
app.get('/api/terms', async (req, res) => {
  try {
    let list;
    if (req.query.search) {
      list = await terms.search(req.query.search);
    } else if (req.query.category) {
      list = await terms.findByCategory(req.query.category);
    } else {
      list = await terms.findAll();
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// One term's full detail:  /api/terms/4   (TC-03)
app.get('/api/terms/:id', async (req, res) => {
  try {
    const term = await terms.findById(req.params.id);
    if (term === null) {
      return res.status(404).json({ error: 'Term not found' });
    }
    res.json(term);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('LexPrep running at http://localhost:' + PORT);
});
