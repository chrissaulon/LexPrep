// All the SQL for quiz questions and answer choices lives here.
const QuizQuestion = require('./QuizQuestion');
const AnswerChoice = require('./AnswerChoice');

class QuizRepository {
  constructor(db) {
    this.db = db;
  }

  // get the 4 choices for each question and build QuizQuestion objects
  async buildQuestions(questionRows) {
    if (questionRows.length === 0) return [];

    const ids = questionRows.map(q => q.question_id);
    const [choiceRows] = await this.db.query(
      'SELECT * FROM answer_choices WHERE question_id IN (?) ORDER BY choice_id',
      [ids]
    );

    return questionRows.map(q => {
      const choices = choiceRows
        .filter(c => c.question_id === q.question_id)
        .map(c => new AnswerChoice(c.choice_id, c.choice_text, c.is_correct === 1));
      return new QuizQuestion(q.question_id, q.term_id, q.question_text, q.explanation, choices);
    });
  }

  // up to 10 random questions for one subject, choices shuffled (TC-04)
  async getQuizByCategory(categoryId, limit = 10) {
    const [rows] = await this.db.query(
      'SELECT q.* FROM quiz_questions q ' +
      'JOIN terms t ON t.term_id = q.term_id ' +
      'WHERE t.category_id = ? ORDER BY RAND() LIMIT ?',
      [Number(categoryId), Number(limit)]
    );
    const questions = await this.buildQuestions(rows);
    questions.forEach(q => q.shuffleChoices());
    return questions;
  }

  // one question with its choices, or null (used to check an answer)
  async findById(questionId) {
    const [rows] = await this.db.query('SELECT * FROM quiz_questions WHERE question_id = ?', [questionId]);
    const questions = await this.buildQuestions(rows);
    return questions.length ? questions[0] : null;
  }
}

module.exports = QuizRepository;
