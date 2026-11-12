// All the SQL for the terms table lives here.
// server.js asks this class for terms instead of writing SQL itself.
const Term = require('./Term');

class TermRepository {
  constructor(db) {
    this.db = db;
  }

  // turn a database row into a Term object
  toTerm(row) {
    return new Term(row.term_id, row.term_name, row.definition, row.example, row.conflict_note, row.category_id);
  }

  // every term, A to Z
  async findAll() {
    const [rows] = await this.db.query('SELECT * FROM terms ORDER BY term_name');
    return rows.map(row => this.toTerm(row));
  }

  // terms whose name or definition contains the keyword (TC-01)
  async search(keyword) {
    const like = '%' + keyword + '%';
    const [rows] = await this.db.query(
      'SELECT * FROM terms WHERE term_name LIKE ? OR definition LIKE ? ORDER BY term_name',
      [like, like]
    );
    return rows.map(row => this.toTerm(row));
  }

  // terms in one category (TC-02)
  async findByCategory(categoryId) {
    const [rows] = await this.db.query(
      'SELECT * FROM terms WHERE category_id = ? ORDER BY term_name',
      [categoryId]
    );
    return rows.map(row => this.toTerm(row));
  }

  // one term, or null if that id doesn't exist (TC-03)
  async findById(id) {
    const [rows] = await this.db.query('SELECT * FROM terms WHERE term_id = ?', [id]);
    if (rows.length === 0) return null;
    return this.toTerm(rows[0]);
  }
}

module.exports = TermRepository;
