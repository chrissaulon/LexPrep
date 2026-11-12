// One legal term (matches the terms table)
class Term {
  constructor(id, name, definition, example, conflictNote, categoryId) {
    this.id = id;
    this.name = name;
    this.definition = definition;
    this.example = example;
    this.conflictNote = conflictNote;
    this.categoryId = categoryId;
  }

  // true if courts disagree on this term
  hasConflict() {
    return this.conflictNote != null && this.conflictNote !== '';
  }
}

module.exports = Term;
