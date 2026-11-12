// Home / Search screen
// Loads the categories and terms from the server and shows them.

const searchBox = document.getElementById('search');
const categoryArea = document.getElementById('categories');
const results = document.getElementById('results');

let categories = [];     // filled in from /api/categories
let selectedCategory = null;   // null means "All"

// Look up a category name by its id
function categoryName(id) {
  const c = categories.find(c => c.id === id);
  return c ? c.name : '';
}

// Show a list of terms (or a message if there are none)
function showTerms(terms, emptyMessage) {
  results.innerHTML = '';

  if (terms.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'message';
    msg.textContent = emptyMessage;
    results.appendChild(msg);
    return;
  }

  for (const term of terms) {
    const card = document.createElement('a');
    card.className = 'term-card';
    card.href = 'term.html?id=' + term.id;

    const name = document.createElement('span');
    name.className = 'term-name';
    name.textContent = term.name;

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = categoryName(term.categoryId);

    card.appendChild(name);
    card.appendChild(tag);
    results.appendChild(card);
  }
}

// Get terms from the server and show them
async function loadTerms() {
  const keyword = searchBox.value.trim();
  let url = '/api/terms';
  let emptyMessage = 'No terms yet.';

  if (keyword !== '') {
    url = '/api/terms?search=' + encodeURIComponent(keyword);
    emptyMessage = 'No terms found for "' + keyword + '".';          // TC-11
  } else if (selectedCategory !== null) {
    url = '/api/terms?category=' + selectedCategory;
    emptyMessage = 'No terms in ' + categoryName(selectedCategory) + ' yet.';   // TC-13
  }

  try {
    const res = await fetch(url);
    const terms = await res.json();
    showTerms(terms, emptyMessage);
  } catch (err) {
    showTerms([], 'Could not reach the server.');
  }
}

// Make one category button
function makeChip(label, id) {
  const chip = document.createElement('button');
  chip.className = 'chip';
  chip.textContent = label;
  if (id === selectedCategory) chip.classList.add('active');

  chip.addEventListener('click', () => {
    selectedCategory = id;
    searchBox.value = '';     // picking a subject clears the search
    drawChips();
    loadTerms();
  });
  return chip;
}

// Draw the "All" button plus one button per category
function drawChips() {
  categoryArea.innerHTML = '';
  categoryArea.appendChild(makeChip('All', null));
  for (const c of categories) {
    categoryArea.appendChild(makeChip(c.name, c.id));
  }
}

// Typing in the search box searches all subjects
searchBox.addEventListener('input', () => {
  selectedCategory = null;
  drawChips();
  loadTerms();
});

// Start: load the categories, then the terms
async function start() {
  try {
    const res = await fetch('/api/categories');
    categories = await res.json();
  } catch (err) {
    categories = [];
  }
  drawChips();
  loadTerms();
}

start();
