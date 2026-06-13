/* ==========================================================================
   Landing page: render template/theme showcases & adjust CTAs for logged-in users.
   ========================================================================== */

(function () {
  if (isLoggedIn()) {
    document.querySelectorAll('[data-cta="start"]').forEach((a) => {
      a.href = '/dashboard.html';
      a.textContent = 'Go to dashboard';
    });
    document.querySelectorAll('[data-cta="login"]').forEach((a) => {
      a.style.display = 'none';
    });
  }

  const templateGrid = document.getElementById('templateGrid');
  if (templateGrid) {
    templateGrid.innerHTML = TEMPLATES.filter((t) => t.id !== 'blank').map((t) => {
      const theme = getTheme(t.theme);
      return `<div class="template-card">
        <div class="swatch">${theme.swatches.map((c) => `<span style="background:${c}"></span>`).join('')}</div>
        <div class="info">
          <h4>${escapeHtml(t.name)}</h4>
          <p>${escapeHtml(t.description)}</p>
          <span class="tag">${escapeHtml(t.category)}</span>
        </div>
      </div>`;
    }).join('');
  }

  const themeStrip = document.getElementById('themeStrip');
  if (themeStrip) {
    themeStrip.innerHTML = THEMES.map((t) => `<div class="theme-pill">
      <span class="dots">${t.swatches.map((c) => `<span style="background:${c}"></span>`).join('')}</span>
      ${escapeHtml(t.name)}
    </div>`).join('');
  }
})();
