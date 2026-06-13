const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function summarize(project) {
  return {
    id: project.id,
    name: project.name,
    templateId: project.templateId,
    themeId: project.themeId,
    paid: !!project.paid,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

// GET /api/projects - list current user's projects
router.get('/', (req, res) => {
  const projects = db.filter('projects', (p) => p.userId === req.user.id);
  res.json({ projects: projects.map(summarize) });
});

// POST /api/projects - create a new project
router.post('/', (req, res) => {
  const { name, templateId, themeId, sections, fontId } = req.body || {};

  const project = {
    id: nanoid(),
    userId: req.user.id,
    name: name || 'Untitled Website',
    templateId: templateId || 'blank',
    themeId: themeId || 'ocean',
    fontId: fontId || 'inter',
    sections: Array.isArray(sections) ? sections : [],
    paid: false,
    stripeSessionId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.insert('projects', project);
  res.status(201).json({ project });
});

// GET /api/projects/:id - fetch full project (must own it)
router.get('/:id', (req, res) => {
  const project = db.find('projects', (p) => p.id === req.params.id && p.userId === req.user.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
});

// PUT /api/projects/:id - update project content (name, theme, sections, etc.)
router.put('/:id', (req, res) => {
  const project = db.find('projects', (p) => p.id === req.params.id && p.userId === req.user.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const { name, templateId, themeId, fontId, sections } = req.body || {};
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (templateId !== undefined) updates.templateId = templateId;
  if (themeId !== undefined) updates.themeId = themeId;
  if (fontId !== undefined) updates.fontId = fontId;
  if (sections !== undefined) updates.sections = sections;

  const updated = db.update('projects', project.id, updates);
  res.json({ project: updated });
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  const project = db.find('projects', (p) => p.id === req.params.id && p.userId === req.user.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  db.remove('projects', project.id);
  res.json({ ok: true });
});

module.exports = router;
