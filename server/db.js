const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function fileFor(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function load(name) {
  const file = fileFor(name);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]');
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function save(name, data) {
  fs.writeFileSync(fileFor(name), JSON.stringify(data, null, 2));
}

// Minimal helpers used across routes
const db = {
  getAll(name) {
    return load(name);
  },
  find(name, predicate) {
    return load(name).find(predicate);
  },
  filter(name, predicate) {
    return load(name).filter(predicate);
  },
  insert(name, record) {
    const items = load(name);
    items.push(record);
    save(name, items);
    return record;
  },
  update(name, id, updates) {
    const items = load(name);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
    save(name, items);
    return items[idx];
  },
  remove(name, id) {
    const items = load(name);
    const next = items.filter((i) => i.id !== id);
    save(name, next);
    return next.length !== items.length;
  },
};

module.exports = db;
