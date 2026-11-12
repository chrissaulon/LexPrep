// One answer option for a quiz question (matches the answer_choices table)
class AnswerChoice {
  constructor(id, text, isCorrect) {
    this.id = id;
    this.text = text;
    this.isCorrect = isCorrect;
  }

  // What the browser is allowed to see: no isCorrect,
  // so a student can't find the answer by looking at the data
  toPublic() {
    return { id: this.id, text: this.text };
  }
}

module.exports = AnswerChoice;
