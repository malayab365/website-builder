/* ==========================================================================
   Builder engine: drag & drop canvas, component palette, inline editing,
   property panel, theme/font switching, save, preview & paywalled export.
   ========================================================================== */

(function () {
  requireAuth();

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('project');
  if (!projectId) {
    window.location.href = '/dashboard.html';
    return;
  }

  const state = {
    project: null,
    selectedId: null,
    saveTimer: null,
  };

  let dropIndicator = null;
  let activeImageField = null; // { sectionId, field }

  const el = {
    projectName: document.getElementById('projectNameInput'),
    saveStatus: document.getElementById('saveStatus'),
    canvas: document.getElementById('canvas'),
    panelAdd: document.getElementById('panelAdd'),
    panelTemplates: document.getElementById('panelTemplates'),
    panelDesign: document.getElementById('panelDesign'),
    propertyPanel: document.getElementById('propertyPanel'),
    accountName: document.getElementById('accountName'),
    avatarInitial: document.getElementById('avatarInitial'),
    accountDropdown: document.getElementById('accountDropdown'),
    accountPill: document.getElementById('accountPill'),
    logoutBtn: document.getElementById('logoutBtn'),
    previewBtn: document.getElementById('previewBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    toast: document.getElementById('toast'),
    imageModalOverlay: document.getElementById('imageModalOverlay'),
    imageTabs: document.getElementById('imageTabs'),
    imageGrid: document.getElementById('imageGrid'),
    imageModalClose: document.getElementById('imageModalClose'),
    paywallOverlay: document.getElementById('paywallOverlay'),
    paywallBody: document.getElementById('paywallBody'),
    paywallClose: document.getElementById('paywallClose'),
  };

  /* ---------------------------------------------------------------- init */
  async function init() {
    const user = getUser();
    if (user) {
      el.accountName.textContent = user.name;
      el.avatarInitial.textContent = (user.name || '?').charAt(0).toUpperCase();
    }

    try {
      const { project } = await apiFetch(`/projects/${projectId}`);
      state.project = project;
    } catch (e) {
      showToast('Could not load project: ' + e.message);
      setTimeout(() => { window.location.href = '/dashboard.html'; }, 1200);
      return;
    }

    el.projectName.value = state.project.name || '';

    renderSidebarAdd();
    renderSidebarTemplates();
    renderSidebarDesign();
    renderCanvas();
    renderPropertyPanel();
    bindGlobalEvents();

    if (params.get('checkout') === 'cancelled') {
      showToast('Checkout cancelled — no charge was made.');
    }
  }

  /* ---------------------------------------------------------- sidebar: Add */
  function renderSidebarAdd() {
    const categories = {};
    COMPONENTS.forEach((c) => {
      (categories[c.category] = categories[c.category] || []).push(c);
    });

    let html = `<p style="font-size:12px;color:var(--ui-text-muted);margin:0 0 14px;line-height:1.5;">
      Drag a section onto the page. Drop it between existing sections to position it.</p>`;

    Object.entries(categories).forEach(([cat, items]) => {
      html += `<h3>${cat}</h3>`;
      items.forEach((c) => {
        html += `<div class="palette-item" draggable="true" data-type="${c.type}">
          <span class="icon">${c.icon}</span><span>${c.label}</span>
        </div>`;
      });
    });

    el.panelAdd.innerHTML = html;

    el.panelAdd.querySelectorAll('.palette-item').forEach((item) => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/x-component-type', item.dataset.type);
        e.dataTransfer.effectAllowed = 'copy';
      });
    });
  }

  /* ----------------------------------------------------- sidebar: Templates */
  function renderSidebarTemplates() {
    let html = `<p style="font-size:12px;color:var(--ui-text-muted);margin:0 0 14px;line-height:1.5;">
      Choose a starting point. Applying a template replaces the current page.</p>`;

    TEMPLATES.forEach((t) => {
      const theme = getTheme(t.theme);
      html += `<div class="mini-template-card" data-template="${t.id}">
        <div class="swatch">${theme.swatches.map((c) => `<span style="background:${c}"></span>`).join('')}</div>
        <h4>${escapeHtml(t.name)}</h4>
        <p>${escapeHtml(t.description)}</p>
      </div>`;
    });

    el.panelTemplates.innerHTML = html;

    el.panelTemplates.querySelectorAll('.mini-template-card').forEach((card) => {
      card.addEventListener('click', () => {
        const tpl = getTemplate(card.dataset.template);
        const proceed = state.project.sections.length === 0 ||
          confirm(`Replace the current page with the "${tpl.name}" template? This will remove your existing sections.`);
        if (proceed) applyTemplate(tpl);
      });
    });
  }

  function applyTemplate(tpl) {
    state.project.templateId = tpl.id;
    state.project.themeId = tpl.theme;
    state.project.fontId = tpl.font;
    state.project.sections = tpl.sections.map((spec) => {
      const comp = getComponent(spec.type);
      return {
        id: 'sec_' + uid(),
        type: spec.type,
        data: { ...comp.defaultData, ...(spec.data || {}) },
        style: { ...comp.defaultStyle, ...(spec.style || {}) },
      };
    });
    state.selectedId = null;
    renderSidebarDesign();
    renderCanvas();
    renderPropertyPanel();
    scheduleSave();
    showToast(`Applied "${tpl.name}" template`);
  }

  /* -------------------------------------------------------- sidebar: Design */
  function renderSidebarDesign() {
    let html = '<h3>Color Theme</h3><div class="theme-grid">';
    THEMES.forEach((t) => {
      const selected = state.project.themeId === t.id ? ' selected' : '';
      html += `<div class="theme-option${selected}" data-theme="${t.id}">
        <div class="dots">${t.swatches.map((c) => `<span style="background:${c}"></span>`).join('')}</div>
        <div class="name">${t.name}</div>
        <div class="best">${t.best}</div>
      </div>`;
    });
    html += '</div><h3>Font Pairing</h3>';
    FONT_PAIRS.forEach((f) => {
      const selected = state.project.fontId === f.id ? ' selected' : '';
      html += `<div class="font-option${selected}" data-font="${f.id}">
        <div class="preview" style="font-family:${f.heading}">Aa — ${escapeHtml(f.name.split(' ')[0])}</div>
        <div class="name">${escapeHtml(f.name)}</div>
      </div>`;
    });

    el.panelDesign.innerHTML = html;

    el.panelDesign.querySelectorAll('.theme-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        state.project.themeId = opt.dataset.theme;
        renderSidebarDesign();
        renderCanvas();
        scheduleSave();
      });
    });
    el.panelDesign.querySelectorAll('.font-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        state.project.fontId = opt.dataset.font;
        renderSidebarDesign();
        renderCanvas();
        scheduleSave();
      });
    });
  }

  /* ----------------------------------------------------------------- canvas */
  function renderCanvas() {
    const theme = getTheme(state.project.themeId);
    const font = getFontPair(state.project.fontId);

    el.canvas.className = `canvas theme-${theme.id}`;
    el.canvas.style.setProperty('--font-heading', font.heading);
    el.canvas.style.setProperty('--font-body', font.body);
    loadGoogleFont(font);

    el.canvas.innerHTML = '';

    if (!state.project.sections.length) {
      el.canvas.innerHTML = `<div class="canvas-empty">
        <div class="icon">🧩</div>
        <p>Your page is empty.<br>Drag a section from the left, or choose a template to get started.</p>
      </div>`;
    } else {
      state.project.sections.forEach((section) => {
        el.canvas.appendChild(buildSectionElement(section));
      });
    }

    dropIndicator = document.createElement('div');
    dropIndicator.className = 'drop-indicator';
    el.canvas.appendChild(dropIndicator);
  }

  function buildSectionElement(section) {
    const comp = getComponent(section.type);
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-section' + (state.selectedId === section.id ? ' is-selected' : '');
    wrapper.dataset.id = section.id;

    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';
    toolbar.innerHTML = `
      <span class="drag-handle" draggable="true" title="Drag to reorder">⠿⠿</span>
      <span class="section-label">${comp.icon} ${comp.label}</span>
      <div class="editor-actions">
        <button data-action="up" title="Move up">↑</button>
        <button data-action="down" title="Move down">↓</button>
        <button data-action="duplicate" title="Duplicate">⧉</button>
        <button data-action="delete" title="Delete">🗑</button>
      </div>`;

    const sectionEl = document.createElement('section');
    sectionEl.className = `section ${comp.sectionClass}`;
    sectionEl.dataset.type = section.type;
    sectionEl.dataset.sectionId = section.id;
    sectionEl.dataset.bg = section.style.bg;
    sectionEl.dataset.pad = section.style.pad;
    sectionEl.dataset.align = section.style.align;
    if (section.style.bg === 'custom' && section.style.customColor) {
      sectionEl.style.setProperty('--section-bg-custom', section.style.customColor);
    }
    sectionEl.innerHTML = comp.render(section.data);

    wrapper.appendChild(toolbar);
    wrapper.appendChild(sectionEl);
    return wrapper;
  }

  function loadGoogleFont(font) {
    let link = document.getElementById('google-font-link');
    if (!link) {
      link = document.createElement('link');
      link.id = 'google-font-link';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const href = googleFontsUrl(font);
    if (link.getAttribute('href') !== href) link.setAttribute('href', href);
  }

  /* --------------------------------------------------------------- helpers */
  function findSection(id) {
    return state.project.sections.find((s) => s.id === id);
  }

  function selectSection(id) {
    state.selectedId = id;
    el.canvas.querySelectorAll('.editor-section').forEach((w) => {
      w.classList.toggle('is-selected', w.dataset.id === id);
    });
    renderPropertyPanel();
  }

  function handleAction(id, action) {
    const sections = state.project.sections;
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;

    if (action === 'up' && idx > 0) {
      [sections[idx - 1], sections[idx]] = [sections[idx], sections[idx - 1]];
    } else if (action === 'down' && idx < sections.length - 1) {
      [sections[idx + 1], sections[idx]] = [sections[idx], sections[idx + 1]];
    } else if (action === 'duplicate') {
      const clone = JSON.parse(JSON.stringify(sections[idx]));
      clone.id = 'sec_' + uid();
      sections.splice(idx + 1, 0, clone);
      state.selectedId = clone.id;
    } else if (action === 'delete') {
      if (!confirm('Delete this section?')) return;
      sections.splice(idx, 1);
      if (state.selectedId === id) state.selectedId = null;
    } else {
      return;
    }

    renderCanvas();
    renderPropertyPanel();
    scheduleSave();
  }

  function insertNewSection(type, index) {
    const comp = getComponent(type);
    const section = {
      id: 'sec_' + uid(),
      type,
      data: JSON.parse(JSON.stringify(comp.defaultData)),
      style: { ...comp.defaultStyle },
    };
    state.project.sections.splice(index, 0, section);
    state.selectedId = section.id;
    renderCanvas();
    renderPropertyPanel();
    scheduleSave();
  }

  function reorderSection(id, index) {
    const sections = state.project.sections;
    const fromIndex = sections.findIndex((s) => s.id === id);
    if (fromIndex === -1) return;
    const [section] = sections.splice(fromIndex, 1);
    sections.splice(index, 0, section);
    renderCanvas();
    renderPropertyPanel();
    scheduleSave();
  }

  function getInsertionIndex(clientY) {
    const wrappers = [...el.canvas.querySelectorAll('.editor-section')].filter((w) => !w.classList.contains('dragging'));
    for (let i = 0; i < wrappers.length; i++) {
      const rect = wrappers[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return wrappers.length;
  }

  function showDropIndicatorAt(clientY) {
    const index = getInsertionIndex(clientY);
    const wrappers = [...el.canvas.querySelectorAll('.editor-section')].filter((w) => !w.classList.contains('dragging'));
    dropIndicator.classList.add('active');
    if (index >= wrappers.length) {
      el.canvas.appendChild(dropIndicator);
    } else {
      el.canvas.insertBefore(dropIndicator, wrappers[index]);
    }
  }

  function hideDropIndicator() {
    if (dropIndicator) dropIndicator.classList.remove('active');
  }

  /* ------------------------------------------------------------ event glue */
  function bindGlobalEvents() {
    // Inline text editing
    el.canvas.addEventListener('input', (e) => {
      const target = e.target.closest && e.target.closest('[data-edit]');
      if (!target) return;
      const wrapper = target.closest('.editor-section');
      const section = findSection(wrapper.dataset.id);
      if (!section) return;
      section.data[target.dataset.edit] = target.innerHTML;
      scheduleSave();
    });

    // Clicks: toolbar actions, image swap, selection
    el.canvas.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('.editor-actions button');
      if (actionBtn) {
        const wrapper = actionBtn.closest('.editor-section');
        handleAction(wrapper.dataset.id, actionBtn.dataset.action);
        return;
      }
      const imgTarget = e.target.closest('img[data-edit]');
      if (imgTarget) {
        const wrapper = imgTarget.closest('.editor-section');
        openImagePicker(wrapper.dataset.id, imgTarget.dataset.edit);
        return;
      }
      const wrapper = e.target.closest('.editor-section');
      if (wrapper) selectSection(wrapper.dataset.id);
    });

    // Drag handle for reordering existing sections
    el.canvas.addEventListener('dragstart', (e) => {
      if (e.target.classList && e.target.classList.contains('drag-handle')) {
        const wrapper = e.target.closest('.editor-section');
        e.dataTransfer.setData('text/x-section-id', wrapper.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
        requestAnimationFrame(() => wrapper.classList.add('dragging'));
      }
    });
    el.canvas.addEventListener('dragend', () => {
      el.canvas.querySelectorAll('.editor-section.dragging').forEach((w) => w.classList.remove('dragging'));
      hideDropIndicator();
    });

    // Drag over canvas (from palette or reorder)
    el.canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!dropIndicator) return;
      showDropIndicatorAt(e.clientY);
    });
    el.canvas.addEventListener('dragleave', (e) => {
      if (e.target === el.canvas) hideDropIndicator();
    });
    el.canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      const index = getInsertionIndex(e.clientY);
      const compType = e.dataTransfer.getData('text/x-component-type');
      const reorderId = e.dataTransfer.getData('text/x-section-id');
      if (compType) {
        insertNewSection(compType, index);
      } else if (reorderId) {
        reorderSection(reorderId, index);
      }
      hideDropIndicator();
    });

    // Sidebar tabs
    document.querySelectorAll('.sidebar-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.sidebar-panel').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`.sidebar-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
      });
    });

    // Project name
    el.projectName.addEventListener('input', () => {
      state.project.name = el.projectName.value;
      scheduleSave();
    });

    // Account menu
    el.accountPill.addEventListener('click', () => el.accountDropdown.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!el.accountPill.contains(e.target) && !el.accountDropdown.contains(e.target)) {
        el.accountDropdown.classList.remove('open');
      }
    });
    el.logoutBtn.addEventListener('click', logout);

    // Preview / download
    el.previewBtn.addEventListener('click', () => previewSiteHTML(state.project));
    el.downloadBtn.addEventListener('click', handleDownloadClick);

    // Modals
    el.imageModalClose.addEventListener('click', closeImagePicker);
    el.imageModalOverlay.addEventListener('click', (e) => { if (e.target === el.imageModalOverlay) closeImagePicker(); });
    el.paywallClose.addEventListener('click', closePaywall);
    el.paywallOverlay.addEventListener('click', (e) => { if (e.target === el.paywallOverlay) closePaywall(); });

    window.addEventListener('beforeunload', () => {
      if (state.saveTimer) saveProject();
    });
  }

  /* ----------------------------------------------------------- saving --- */
  function scheduleSave() {
    el.saveStatus.textContent = 'Saving…';
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(saveProject, 700);
  }

  async function saveProject() {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
    try {
      await apiFetch(`/projects/${state.project.id}`, {
        method: 'PUT',
        body: {
          name: state.project.name,
          templateId: state.project.templateId,
          themeId: state.project.themeId,
          fontId: state.project.fontId,
          sections: state.project.sections,
        },
      });
      el.saveStatus.textContent = 'Saved';
      setTimeout(() => {
        if (el.saveStatus.textContent === 'Saved') el.saveStatus.textContent = '';
      }, 1500);
    } catch (e) {
      el.saveStatus.textContent = 'Save failed';
    }
  }

  /* ------------------------------------------------------------- property */
  function renderPropertyPanel() {
    const section = findSection(state.selectedId);
    if (!section) {
      el.propertyPanel.innerHTML = `<div class="property-empty">Select any section on the page to edit its background, spacing and alignment.<br><br>Click directly on text or images to edit them in place.</div>`;
      return;
    }
    const comp = getComponent(section.type);
    const bgOptions = ['bg', 'surface', 'primary', 'gradient', 'dark', 'custom'];
    const bgLabels = { bg: 'Default', surface: 'Surface', primary: 'Primary', gradient: 'Gradient', dark: 'Dark', custom: 'Custom' };
    const padOptions = ['sm', 'md', 'lg'];
    const alignOptions = ['left', 'center'];

    el.propertyPanel.innerHTML = `
      <h3>${comp.icon} ${escapeHtml(comp.label)}</h3>
      <div class="type-label">Section settings</div>
      <div class="property-group">
        <label>Background</label>
        <div class="button-row">
          ${bgOptions.map((o) => `<button class="option-btn ${section.style.bg === o ? 'active' : ''}" data-prop="bg" data-value="${o}">${bgLabels[o]}</button>`).join('')}
        </div>
        ${section.style.bg === 'custom' ? `<div class="color-swatch-row" style="margin-top:10px;"><input type="color" id="customColorInput" value="${section.style.customColor || '#ffffff'}"><span style="font-size:12px;color:var(--ui-text-muted);">Custom background color</span></div>` : ''}
      </div>
      <div class="property-group">
        <label>Spacing</label>
        <div class="button-row">
          ${padOptions.map((o) => `<button class="option-btn ${section.style.pad === o ? 'active' : ''}" data-prop="pad" data-value="${o}">${o.toUpperCase()}</button>`).join('')}
        </div>
      </div>
      <div class="property-group">
        <label>Alignment</label>
        <div class="button-row">
          ${alignOptions.map((o) => `<button class="option-btn ${section.style.align === o ? 'active' : ''}" data-prop="align" data-value="${o}">${o.charAt(0).toUpperCase() + o.slice(1)}</button>`).join('')}
        </div>
      </div>
      <div class="property-group">
        <label>Section</label>
        <div class="button-row">
          <button class="option-btn" data-prop="duplicate">Duplicate</button>
          <button class="option-btn" data-prop="delete" style="color:var(--ui-danger)">Delete</button>
        </div>
      </div>
    `;

    el.propertyPanel.querySelectorAll('[data-prop="bg"], [data-prop="pad"], [data-prop="align"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        section.style[btn.dataset.prop] = btn.dataset.value;
        renderCanvas();
        renderPropertyPanel();
        scheduleSave();
      });
    });

    const colorInput = document.getElementById('customColorInput');
    if (colorInput) {
      colorInput.addEventListener('input', () => {
        section.style.customColor = colorInput.value;
        const sectionEl = el.canvas.querySelector(`section[data-section-id="${section.id}"]`);
        if (sectionEl) sectionEl.style.setProperty('--section-bg-custom', colorInput.value);
        scheduleSave();
      });
    }

    const dupBtn = el.propertyPanel.querySelector('[data-prop="duplicate"]');
    if (dupBtn) dupBtn.addEventListener('click', () => handleAction(section.id, 'duplicate'));
    const delBtn = el.propertyPanel.querySelector('[data-prop="delete"]');
    if (delBtn) delBtn.addEventListener('click', () => handleAction(section.id, 'delete'));
  }

  /* ----------------------------------------------------------- image picker */
  function openImagePicker(sectionId, field) {
    activeImageField = { sectionId, field };
    renderImageTabs('business');
    el.imageModalOverlay.classList.remove('hidden');
  }
  function closeImagePicker() {
    el.imageModalOverlay.classList.add('hidden');
    activeImageField = null;
  }
  function renderImageTabs(activeCat) {
    const cats = Object.keys(IMAGE_LIBRARY);
    el.imageTabs.innerHTML = cats.map((c) => `<button class="image-tab ${c === activeCat ? 'active' : ''}" data-cat="${c}">${IMAGE_LIBRARY[c].label}</button>`).join('');
    el.imageTabs.querySelectorAll('.image-tab').forEach((tab) => {
      tab.addEventListener('click', () => renderImageTabs(tab.dataset.cat));
    });
    renderImageGrid(activeCat);
  }
  function renderImageGrid(cat) {
    const images = IMAGE_LIBRARY[cat].images;
    el.imageGrid.innerHTML = images.map((url) => `<img src="${url}" data-url="${url}" loading="lazy">`).join('');
    el.imageGrid.querySelectorAll('img').forEach((imgEl) => {
      imgEl.addEventListener('click', () => selectImage(imgEl.dataset.url));
    });
  }
  function selectImage(url) {
    if (!activeImageField) return;
    const section = findSection(activeImageField.sectionId);
    section.data[activeImageField.field] = url;
    const target = el.canvas.querySelector(
      `.editor-section[data-id="${activeImageField.sectionId}"] img[data-edit="${activeImageField.field}"]`
    );
    if (target) target.src = url;
    scheduleSave();
    closeImagePicker();
    showToast('Image updated');
  }

  /* --------------------------------------------------- download & paywall */
  async function handleDownloadClick() {
    el.downloadBtn.disabled = true;
    const original = el.downloadBtn.textContent;
    el.downloadBtn.textContent = 'Checking…';
    try {
      const status = await apiFetch(`/payments/status/${state.project.id}`);
      if (status.paid) {
        state.project.paid = true;
        await downloadSiteHTML(state.project);
        showToast('Download started');
      } else {
        openPaywall();
      }
    } catch (e) {
      showToast('Error: ' + e.message);
    } finally {
      el.downloadBtn.disabled = false;
      el.downloadBtn.textContent = original;
    }
  }

  async function openPaywall() {
    el.paywallOverlay.classList.remove('hidden');
    el.paywallBody.innerHTML = '<p>Loading…</p>';
    try {
      const config = await apiFetch('/payments/config');
      let html = `
        <div class="paywall-icon">🔒</div>
        <div class="paywall-price">${escapeHtml(config.priceLabel)}<small> one-time</small></div>
        <p style="text-align:center;color:var(--ui-text-muted);font-size:13px;">
          Unlock the ready-to-host HTML download for “${escapeHtml(state.project.name)}”.
        </p>
        <ul class="paywall-features">
          <li>Clean, responsive, standalone HTML export</li>
          <li>All your customizations, colors and images included</li>
          <li>Host it anywhere — no lock-in</li>
          <li>One-time payment, this project only</li>
        </ul>`;

      if (config.configured) {
        html += `<button class="btn btn-primary btn-block" id="checkoutBtn">Pay ${escapeHtml(config.priceLabel)} & Unlock</button>`;
      } else {
        html += `<button class="btn btn-primary btn-block" id="checkoutBtn" disabled>Pay ${escapeHtml(config.priceLabel)} & Unlock</button>
          <div class="dev-note">
            Stripe isn't configured on this server yet (add keys to <code>.env</code> to enable real payments).
            <button class="btn btn-secondary btn-block" id="devUnlockBtn" style="margin-top:10px;">Simulate payment (dev mode)</button>
          </div>`;
      }

      el.paywallBody.innerHTML = html;

      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn && config.configured) {
        checkoutBtn.addEventListener('click', startCheckout);
      }
      const devBtn = document.getElementById('devUnlockBtn');
      if (devBtn) devBtn.addEventListener('click', devMarkPaid);
    } catch (e) {
      el.paywallBody.innerHTML = `<p>Could not load payment info: ${escapeHtml(e.message)}</p>`;
    }
  }

  function closePaywall() {
    el.paywallOverlay.classList.add('hidden');
  }

  async function startCheckout() {
    try {
      const data = await apiFetch('/payments/create-checkout-session', {
        method: 'POST',
        body: { projectId: state.project.id },
      });
      if (data.alreadyPaid) {
        closePaywall();
        state.project.paid = true;
        await downloadSiteHTML(state.project);
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      showToast('Checkout error: ' + e.message);
    }
  }

  async function devMarkPaid() {
    try {
      await apiFetch('/payments/dev-mark-paid', { method: 'POST', body: { projectId: state.project.id } });
      closePaywall();
      state.project.paid = true;
      await downloadSiteHTML(state.project);
      showToast('Marked as paid (dev mode) — download started');
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  }

  /* ------------------------------------------------------------------ misc */
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('visible');
    setTimeout(() => el.toast.classList.remove('visible'), 2500);
  }

  init();
})();
