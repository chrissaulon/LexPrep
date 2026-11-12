// One quiz question and its 4 answer choices (matches the quiz_questions table)
class QuizQuestion {
  constructor(id, termId, text, explanation, choices) {
    this.id = id;
    this.termId = termId;
    this.text = text;
    this.explanation = explanation;
    this.choices = choices;   // array of AnswerChoice objects
  }

  // the one choice marked correct
  getCorrectChoice() {
    return this.choices.find(c => c.isCorrect);
  }

  // true if the chosen answer is the correct one
  isCorrect(choiceId) {
    const correct = this.getCorrectChoice();
    return correct !== undefined && correct.id === Number(choiceId);
  }

  // mix up the order of the choices so the answer isn't always first
  shuffleChoices() {
    for (let i = this.choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]];
    }
  }

  // What the browser is allowed to see (no correct answer)
  toPublic() {
    return {
      id: this.id,
      termId: this.termId,
      text: this.text,
      choices: this.choices.map(c => c.toPublic()),
    };
  }
}

module.exports = QuizQuestion;
