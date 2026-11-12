-- LexPrep Database
-- Christian Saulon - Advanced Software Project
-- Run in MySQL Workbench: File > Open SQL Script > lightning bolt.	git config --global --add safe.directory E:/LexPrepApp/LexPrep
-- Running it again rebuilds the database from scratch.

DROP DATABASE IF EXISTS lexprep;
CREATE DATABASE lexprep;
USE lexprep;

-- Admin login info
CREATE TABLE admins (
  admin_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  PRIMARY KEY (admin_id)
);

-- Subjects like Torts, Contracts, etc.
CREATE TABLE categories (
  category_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (category_id)
);

-- Legal terms
CREATE TABLE terms (
  term_id INT NOT NULL AUTO_INCREMENT,
  term_name VARCHAR(100) NOT NULL,
  definition TEXT NOT NULL,
  example TEXT,
  conflict_note TEXT,
  category_id INT NOT NULL,
  PRIMARY KEY (term_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Quiz questions (each one goes with a term)
CREATE TABLE quiz_questions (
  question_id INT NOT NULL AUTO_INCREMENT,
  question_text TEXT NOT NULL,
  explanation TEXT,
  term_id INT NOT NULL,
  PRIMARY KEY (question_id),
  FOREIGN KEY (term_id) REFERENCES terms(term_id) ON DELETE CASCADE
);

-- The 4 answer choices for each question
CREATE TABLE answer_choices (
  choice_id INT NOT NULL AUTO_INCREMENT,
  choice_text VARCHAR(255) NOT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  question_id INT NOT NULL,
  PRIMARY KEY (choice_id),
  FOREIGN KEY (question_id) REFERENCES quiz_questions(question_id) ON DELETE CASCADE
);


-- ============================================================
-- Data
-- ============================================================

INSERT INTO admins (username, password_hash) VALUES ('csaulon', 'temp_hash');

INSERT INTO categories (name) VALUES
('Torts'), ('Contracts'), ('Criminal Law'), ('Evidence'),
('Civil Procedure'), ('Constitutional Law'), ('Real Property');

-- 15 terms: 4 Torts, 4 Contracts, 4 Criminal Law, 3 Evidence
INSERT INTO terms (term_name, definition, example, conflict_note, category_id) VALUES
-- Torts (1)
('Battery', 'Intentional harmful or offensive contact with another person.', 'A shoves B in a parking lot.', NULL, 1),
('Assault', 'Intentionally causing someone to reasonably fear an immediate harmful or offensive contact.', 'A swings a bat at B, and B ducks just in time.', NULL, 1),
('Duty of Care', 'An obligation to act like a reasonable person to avoid foreseeable harm to others.', 'A driver has to drive carefully around other cars and people.', 'States disagree on what duty is owed to trespassers and other people on someone''s land.', 1),
('Negligence', 'Failing to use reasonable care, which causes harm to someone. It has four elements: duty, breach, causation, and damages.', 'A driver who is texting rear-ends another car and injures the driver.', 'Most states reduce damages when the injured person was partly at fault (comparative negligence), but a few states still bar recovery completely (contributory negligence).', 1),
-- Contracts (2)
('Offer', 'A clear promise to do something on certain terms that lets the other person create a contract by accepting.', 'A says to B, "I will sell you my bike for $100."', NULL, 2),
('Acceptance', 'Agreeing to the terms of an offer, which creates a contract.', 'B replies, "I accept. Here is the $100."', 'Under common law, an acceptance must match the offer exactly (the mirror image rule), but for sales of goods the UCC allows an acceptance that adds terms.', 2),
('Consideration', 'Something of value traded in exchange for a promise.', 'A pays B $500 to paint a fence. The painting is the consideration.', 'Courts differ on whether changing a contract needs new consideration. The UCC does not require it for sales of goods.', 2),
('Statute of Frauds', 'A rule that certain contracts must be in writing and signed to be enforced.', 'A contract to sell a house must be in writing.', NULL, 2),
-- Criminal Law (3)
('Mens Rea', 'The guilty state of mind needed for a crime.', 'Theft requires intent to keep the property for good.', 'Model Penal Code states define mental states differently from common law states.', 3),
('Actus Reus', 'The physical act, or the failure to act when there is a legal duty, that makes up a crime.', 'Taking the wallet is the actus reus of theft.', NULL, 3),
('Larceny', 'Taking and carrying away someone else''s property without consent, intending to keep it permanently.', 'A takes B''s phone off a table and keeps it.', 'Many states have combined larceny and similar crimes into one general theft crime.', 3),
('Self-Defense', 'The right to use reasonable force to protect yourself from an immediate unlawful attack.', 'A pushes away B, who is swinging a fist at A.', 'States disagree on whether you must retreat, if you safely can, before using deadly force.', 3),
-- Evidence (4)
('Hearsay', 'An out-of-court statement used to prove that the statement is true.', 'A witness says her friend told her the light was red.', NULL, 4),
('Relevance', 'Evidence is relevant if it makes a fact that matters to the case more or less likely.', 'A receipt showing the defendant bought a crowbar the day before a break-in.', NULL, 4),
('Character Evidence', 'Evidence of what a person is generally like usually cannot be used to prove they acted that way on a certain occasion.', 'The prosecution cannot show the defendant is a violent person to prove he started the fight.', NULL, 4);

-- One quiz question per term (question_id matches term_id)
INSERT INTO quiz_questions (question_text, explanation, term_id) VALUES
('Which situation is a battery?', 'Battery needs intentional contact that is harmful or offensive. Words, accidents, and future threats are not battery.', 1),
('Assault requires the victim to:', 'Assault is about reasonable fear of an immediate contact. No touching or injury is needed.', 2),
('The standard of care in negligence is usually measured by:', 'Courts ask what a reasonable person would have done in the same situation.', 3),
('Which is NOT one of the four elements of negligence?', 'Negligence is duty, breach, causation, and damages. Intent is not required.', 4),
('Which statement is most likely a valid offer?', 'An offer must be definite and show a willingness to be bound. Maybes, questions, and most ads are not offers.', 5),
('Under the common law mirror image rule, a reply that adds new terms is:', 'At common law, an acceptance must match the offer exactly. A reply with new terms is a counteroffer.', 6),
('Which is an example of consideration?', 'Consideration is a bargained-for exchange. Gifts, past favors, and duties you already owe do not count.', 7),
('Which contract generally must be in writing under the Statute of Frauds?', 'Contracts for the sale of land are covered by the Statute of Frauds. Small, short-term deals usually are not.', 8),
('Mens rea refers to:', 'Mens rea is the mental part of a crime, such as intent or recklessness.', 9),
('Which can satisfy actus reus?', 'Actus reus needs a voluntary act, or a failure to act when there is a legal duty, like a parent''s duty to feed a child.', 10),
('What intent does larceny require?', 'Larceny requires intent to permanently deprive the owner of the property.', 11),
('Self-defense generally allows:', 'Self-defense allows reasonable force against an immediate unlawful attack, not revenge or force out of proportion.', 12),
('Which one is hearsay?', 'Hearsay is an out-of-court statement offered to prove that what it says is true.', 13),
('Evidence is relevant when it:', 'Relevance only asks whether evidence makes an important fact more or less likely.', 14),
('In a fight case, can the prosecution show the defendant is generally violent to prove he threw the first punch?', 'Character evidence generally cannot be used to prove a person acted the same way on a specific occasion.', 15);

-- 4 choices per question, exactly one correct (is_correct = 1)
INSERT INTO answer_choices (choice_text, is_correct, question_id) VALUES
('A spits on B on purpose', 1, 1),
('A shouts insults at B from across the street', 0, 1),
('A carefully walks by and accidentally brushes B', 0, 1),
('A tells B, "I will hit you next week"', 0, 1),

('Reasonably fear an immediate harmful or offensive contact', 1, 2),
('Actually be touched', 0, 2),
('Be physically injured', 0, 2),
('Be threatened with harm at some future time', 0, 2),

('What a reasonable person would do in the same situation', 1, 3),
('What the defendant personally believed was safe', 0, 3),
('Whether the defendant meant to cause harm', 0, 3),
('Whatever the injured person expected', 0, 3),

('Intent to cause harm', 1, 4),
('Duty', 0, 4),
('Breach', 0, 4),
('Causation', 0, 4),

('"I will sell you my 2018 Honda for $9,000."', 1, 5),
('"I might sell my car sometime this year."', 0, 5),
('"Would you ever be interested in my car?"', 0, 5),
('A newspaper ad listing a car and its price', 0, 5),

('A counteroffer, not an acceptance', 1, 6),
('An acceptance of the original offer', 0, 6),
('An acceptance that includes the new terms', 0, 6),
('Automatically illegal', 0, 6),

('B agrees to paint A''s fence in exchange for A''s promise to pay $500', 1, 7),
('A promises to give B a birthday gift', 0, 7),
('A promises to pay B for a favor B did last year', 0, 7),
('A promises to pay B for something B already has to do by law', 0, 7),

('A contract to sell a house', 1, 8),
('A contract to mow a lawn next week', 0, 8),
('A contract to buy a $20 book', 0, 8),
('A contract to babysit tonight', 0, 8),

('The defendant''s guilty state of mind', 1, 9),
('The physical act of the crime', 0, 9),
('The harm caused to the victim', 0, 9),
('The punishment for the crime', 0, 9),

('A parent''s failure to feed their child', 1, 10),
('Thinking about robbing a bank', 0, 10),
('A movement during a seizure', 0, 10),
('Wishing harm on a neighbor', 0, 10),

('Intent to permanently deprive the owner of the property', 1, 11),
('Intent to borrow the property for an hour', 0, 11),
('Intent to damage the property', 0, 11),
('No intent is required', 0, 11),

('Reasonable force against an immediate unlawful attack', 1, 12),
('Any force against someone who insulted you', 0, 12),
('Force to get revenge for an attack last week', 0, 12),
('Deadly force to stop any minor threat', 0, 12),

('A friend''s statement repeated in court to prove it is true', 1, 13),
('Your own testimony on the stand', 0, 13),
('A question from the lawyer', 0, 13),
('A statement used only to show someone was warned', 0, 13),

('Makes a fact that matters to the case more or less likely', 1, 14),
('Proves the case beyond a reasonable doubt', 0, 14),
('Comes from an eyewitness', 0, 14),
('Is not hearsay', 0, 14),

('No, character evidence generally cannot prove he acted that way this time', 1, 15),
('Yes, character evidence always proves how someone acted', 0, 15),
('Yes, but only if the defendant has a job', 0, 15),
('Only if the victim agrees', 0, 15);


-- Check that it worked
SELECT * FROM terms;
