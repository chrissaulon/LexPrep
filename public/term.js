// Term Detail screen
// Reads the id from the address (term.html?id=4) and shows that term.

const detail = document.getElementById('detail');

// Add one titled section (Definition, Example, Conflict Note)
function addSection(title, text) {
  const box = document.createElement('div');
  box.className = 'section';

  const h = document.createElement('h3');
  h.textContent = title;

  const p = document.createElement('p');
  p.textContent = text;

  box.appendChild(h);
  box.appendChild(p);
  detail.appendChild(box);
}

function showMessage(text) {
  detail.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'message';
  p.textContent = text;
  detail.appendChild(p);
}

async function start() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    showMessage('No term selected.');
    return;
  }

  try {
    // Get the term and the categories at the same time
    const [termRes, catRes] = await Promise.all([
      fetch('/api/terms/' + encodeURIComponent(id)),
      fetch('/api/categories'),
    ]);

    if (termRes.status === 404) {
      showMessage('That term was not found.');
      return;
    }

    const term = await termRes.json();
    const categories = await catRes.json();
    const category = categories.find(c => c.id === term.categoryId);

    document.title = 'LexPrep - ' + term.name;

    // Title + category tag
    const titleRow = document.createElement('div');
    titleRow.className = 'detail-title';
    const h2 = document.createElement('h2');
    h2.textContent = term.name;
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = category ? category.name : '';
    titleRow.appendChild(h2);
    titleRow.appendChild(tag);
    detail.appendChild(titleRow);

    // The three sections from the concept screen
    addSection('DEFINITION', term.definition);
    addSection('EXAMPLE', term.example || 'No example yet.');
    addSection('CONFLICT NOTE', term.conflictNote || 'No known conflict — courts generally agree on this rule.');

    // Quiz button (the quiz is built later in the project plan)
    const quiz = document.createElement('button');
    quiz.className = 'quiz-button';
    quiz.textContent = 'Quiz Me on This Subject (coming soon)';
    quiz.disabled = true;
    detail.appendChild(quiz);
  } catch (err) {
    showMessage('Could not reach the server.');
  }
}

start();
