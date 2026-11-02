// Frontend (dining room): talks to the backend (kitchen) with fetch().
// Same origin as the API, so the base URL is empty: fetch('/tasks').
const API = '/tasks';

const listEl = document.getElementById('list');
const emptyEl = document.getElementById('empty');
const countEl = document.getElementById('count');
const errorEl = document.getElementById('error');
const formEl = document.getElementById('add-form');
const inputEl = document.getElementById('new-title');

let tasks = [];
let filter = 'all';
let editingId = null;

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}
function clearError() {
  errorEl.hidden = true;
}

// One helper for every request. Throws an Error with the server's message.
async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. Is it running?');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

async function loadTasks() {
  try {
    tasks = await request(API);
    clearError();
  } catch (err) {
    showError(err.message);
  }
  render();
}

async function addTask(title) {
  try {
    const created = await request(API, { method: 'POST', body: JSON.stringify({ title }) });
    tasks.unshift(created);
    clearError();
  } catch (err) {
    showError(err.message);
  }
  render();
}

async function patchTask(id, body) {
  try {
    const updated = await request(`${API}/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
    tasks = tasks.map((t) => (t.id === id ? updated : t));
    clearError();
  } catch (err) {
    showError(err.message);
  }
  editingId = null;
  render();
}

async function deleteTask(id) {
  try {
    await request(`${API}/${id}`, { method: 'DELETE' });
    tasks = tasks.filter((t) => t.id !== id);
    clearError();
  } catch (err) {
    showError(err.message);
  }
  render();
}

function button(label, className, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `btn small ${className}`.trim();
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

function renderItem(task) {
  const done = Boolean(task.completed); // MySQL returns 1 / 0
  const li = document.createElement('li');
  li.className = `item${done ? ' done' : ''}`;

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'check';
  check.checked = done;
  check.setAttribute('aria-label', `Mark "${task.title}" as ${done ? 'open' : 'done'}`);
  check.addEventListener('change', () => patchTask(task.id, { completed: check.checked }));
  li.appendChild(check);

  if (editingId === task.id) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.title;
    input.maxLength = 255;
    input.setAttribute('aria-label', 'Edit task title');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') { editingId = null; render(); }
    });
    const save = () => {
      const value = input.value.trim();
      if (!value) return showError('Title cannot be empty');
      patchTask(task.id, { title: value });
    };
    li.appendChild(input);

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.append(
      button('Save', 'primary', save),
      button('Cancel', '', () => { editingId = null; render(); })
    );
    li.appendChild(actions);
    setTimeout(() => input.focus(), 0);
  } else {
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.title; // textContent keeps user text safe (no HTML injection)
    li.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.append(
      button('Edit', '', () => { editingId = task.id; render(); }),
      button('Delete', 'danger', () => deleteTask(task.id))
    );
    li.appendChild(actions);
  }
  return li;
}

function render() {
  const open = tasks.filter((t) => !t.completed).length;
  countEl.textContent = tasks.length ? `${open} open, ${tasks.length - open} done` : '';

  const visible = tasks.filter((t) => {
    if (filter === 'open') return !t.completed;
    if (filter === 'done') return Boolean(t.completed);
    return true;
  });

  listEl.replaceChildren(...visible.map(renderItem));

  if (visible.length === 0) {
    emptyEl.hidden = false;
    emptyEl.textContent =
      tasks.length === 0 ? 'No tasks yet. Add your first one above.' : `No ${filter} tasks.`;
  } else {
    emptyEl.hidden = true;
  }
}

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();
  if (!title) return showError('Title is required');
  inputEl.value = '';
  addTask(title);
});

document.querySelectorAll('.filter').forEach((btn) => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    document.querySelectorAll('.filter').forEach((b) => b.classList.toggle('active', b === btn));
    render();
  });
});

loadTasks();
