/* ==========================================================================
   Dashboard: project list, template gallery, duplicate / delete projects.
   ========================================================================== */

(function () {
  requireAuth();

  const grid = document.getElementById('projectGrid');
  const newProjectBtn = document.getElementById('newProjectBtn');
  const templateModalOverlay = document.getElementById('templateModalOverlay');
  const templateModalClose = document.getElementById('templateModalClose');
  const templateGrid = document.getElementById('templateGrid');
  const accountPill = document.getElementById('accountPill');
  const accountDropdown = document.getElementById('accountDropdown');
  const accountName = document.getElementById('accountName');
  const avatarInitial = document.getElementById('avatarInitial');
  const logoutBtn = document.getElementById('logoutBtn');
  const toast = document.getElementById('toast');

  let projects = [];

  async function init() {
    const user = getUser();
    if (user) {
      accountName.textContent = user.name;
      avatarInitial.textContent = (user.name || '?').charAt(0).toUpperCase();
    }
    bindEvents();
    await loadProjects();
  }

  async function loadProjects() {
    try {
      const data = await apiFetch('/projects');
      projects = data.projects || [];
      renderProjects();
    } catch (e) {
      showToast('Could not load projects: ' + e.message);
    }
  }

  function renderProjects() {
    grid.querySelectorAll('.project-card').forEach((c) => c.remove());

    projects
      .slice()
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .forEach((p) => {
        const theme = getTheme(p.themeId);
        const updated = p.updatedAt
          ? new Date(p.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
          : '—';

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <div class="preview" style="background:linear-gradient(135deg, ${theme.swatches[0]}, ${theme.swatches[2] || theme.swatches[1]})">
            ${escapeHtml((p.name || 'W').trim().charAt(0).toUpperCase() || 'W')}
          </div>
          <div class="body">
            <h3>${escapeHtml(p.name || 'Untitled Website')}</h3>
            <div class="meta">${escapeHtml(theme.name)} theme · updated ${updated}</div>
            <span class="status ${p.paid ? 'paid' : 'unpaid'}">${p.paid ? 'Unlocked' : 'Not unlocked'}</span>
            <div class="actions">
              <a class="btn btn-primary btn-sm" href="/builder.html?project=${p.id}">Edit</a>
              <button class="btn btn-secondary btn-sm" data-action="duplicate" data-id="${p.id}" type="button">Duplicate</button>
              <button class="btn btn-danger btn-sm" data-action="delete" data-id="${p.id}" type="button">Delete</button>
            </div>
          </div>`;
        grid.appendChild(card);
      });
  }

  function renderTemplateGrid() {
    templateGrid.innerHTML = TEMPLATES.map((t) => {
      const theme = getTheme(t.theme);
      return `<div class="template-card" data-template="${t.id}">
        <div class="swatch">${theme.swatches.map((c) => `<span style="background:${c}"></span>`).join('')}</div>
        <div class="info">
          <h4>${escapeHtml(t.name)}</h4>
          <p>${escapeHtml(t.description)}</p>
          <span class="tag">${escapeHtml(t.category)}</span>
        </div>
      </div>`;
    }).join('');

    templateGrid.querySelectorAll('.template-card').forEach((card) => {
      card.addEventListener('click', () => createFromTemplate(card.dataset.template));
    });
  }

  async function createFromTemplate(templateId) {
    const tpl = getTemplate(templateId);
    const sections = tpl.sections.map((spec) => {
      const comp = getComponent(spec.type);
      return {
        id: 'sec_' + uid(),
        type: spec.type,
        data: { ...comp.defaultData, ...(spec.data || {}) },
        style: { ...comp.defaultStyle, ...(spec.style || {}) },
      };
    });

    try {
      const data = await apiFetch('/projects', {
        method: 'POST',
        body: {
          name: tpl.id === 'blank' ? 'Untitled Website' : tpl.name,
          templateId: tpl.id,
          themeId: tpl.theme,
          fontId: tpl.font,
          sections,
        },
      });
      window.location.href = `/builder.html?project=${data.project.id}`;
    } catch (e) {
      showToast('Could not create project: ' + e.message);
    }
  }

  function bindEvents() {
    newProjectBtn.addEventListener('click', () => {
      renderTemplateGrid();
      templateModalOverlay.classList.remove('hidden');
    });
    templateModalClose.addEventListener('click', () => templateModalOverlay.classList.add('hidden'));
    templateModalOverlay.addEventListener('click', (e) => {
      if (e.target === templateModalOverlay) templateModalOverlay.classList.add('hidden');
    });

    grid.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;

      if (btn.dataset.action === 'delete') {
        if (!confirm('Delete this project? This cannot be undone.')) return;
        try {
          await apiFetch(`/projects/${id}`, { method: 'DELETE' });
          projects = projects.filter((p) => p.id !== id);
          renderProjects();
          showToast('Project deleted');
        } catch (err) {
          showToast('Could not delete: ' + err.message);
        }
      } else if (btn.dataset.action === 'duplicate') {
        try {
          const { project } = await apiFetch(`/projects/${id}`);
          await apiFetch('/projects', {
            method: 'POST',
            body: {
              name: `${project.name} (copy)`,
              templateId: project.templateId,
              themeId: project.themeId,
              fontId: project.fontId,
              sections: project.sections,
            },
          });
          await loadProjects();
          showToast('Project duplicated');
        } catch (err) {
          showToast('Could not duplicate: ' + err.message);
        }
      }
    });

    accountPill.addEventListener('click', () => accountDropdown.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!accountPill.contains(e.target) && !accountDropdown.contains(e.target)) {
        accountDropdown.classList.remove('open');
      }
    });
    logoutBtn.addEventListener('click', logout);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
  }

  init();
})();
