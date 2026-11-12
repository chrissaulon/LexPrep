// Quick check that everything connects.  Run with:  npm run check
// Prints the categories, the terms, and one sample quiz question.
require('dotenv').config();
const mysql = require('mysql2/promise');
const Category = require('./Category');
const TermRepository = require('./TermRepository');
const QuizRepository = require('./QuizRepository');

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log('Connected to MySQL!\n');

  // Categories
  const [catRows] = await db.query('SELECT * FROM categories');
  const categories = catRows.map(row => new Category(row.category_id, row.name));
  console.log('CATEGORIES');
  for (const c of categories) {
    console.log(`  ${c.id}. ${c.name}`);
  }

  // Terms (through TermRepository)
  const terms = await new TermRepository(db).findAll();
  console.log(`\nTERMS (${terms.length})`);
  for (const t of terms) {
    const category = categories.find(c => c.id === t.categoryId);
    const flag = t.hasConflict() ? '  (conflict note)' : '';
    console.log(`  ${t.name} - ${category.name}${flag}`);
  }

  // Sample quiz question (through QuizRepository)
  const quiz = await new QuizRepository(db).getQuizByCategory(1, 1);
  if (quiz.length > 0) {
    const q = quiz[0];
    console.log('\nSAMPLE TORTS QUIZ QUESTION');
    console.log('  ' + q.text);
    q.choices.forEach((c, i) => console.log(`    ${'ABCD'[i]}) ${c.text}`));
    console.log('  Answer: ' + q.getCorrectChoice().text);
  }

  await db.end();
}

main().catch(err => console.log('Could not connect: ' + err.message));
