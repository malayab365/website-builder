/* ==========================================================================
   Export the current project to a standalone, self-contained HTML file.
   The exported file embeds the theme + component stylesheets directly so
   it can be hosted anywhere with zero build step.
   ========================================================================== */

let _cssCache = null;

async function loadComponentStyles() {
  if (_cssCache) return _cssCache;
  const [themes, components] = await Promise.all([
    fetch('/css/themes.css').then((r) => r.text()),
    fetch('/css/components.css').then((r) => r.text()),
  ]);
  _cssCache = { themes, components };
  return _cssCache;
}

function renderSectionHTML(section) {
  const comp = getComponent(section.type);
  const style = section.style || {};
  let styleAttr = '';
  if (style.bg === 'custom' && style.customColor) {
    styleAttr = ` style="--section-bg-custom: ${style.customColor};"`;
  }
  const inner = comp.render(section.data || {});
  return `<section class="section ${comp.sectionClass}" data-type="${section.type}" data-bg="${style.bg || 'bg'}" data-pad="${style.pad || 'md'}" data-align="${style.align || 'left'}"${styleAttr}>
${inner}
</section>`;
}

// Strip builder-only attributes (contenteditable, data-edit, data-section-id)
// so the exported file is a plain static site.
function stripEditingAttributes(html) {
  return html
    .replace(/\s+contenteditable="true"/g, '')
    .replace(/\s+data-edit="[^"]*"/g, '');
}

async function generateSiteHTML(project) {
  const theme = getTheme(project.themeId);
  const font = getFontPair(project.fontId);
  const css = await loadComponentStyles();

  const sectionsHtml = project.sections.map(renderSectionHTML).join('\n');
  const cleanSections = stripEditingAttributes(sectionsHtml);

  const title = escapeHtml(project.name || 'My Website');

  return `<!DOCTYPE html>
<html lang="en" class="theme-${theme.id}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="generator" content="Website Builder Studio">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${googleFontsUrl(font)}" rel="stylesheet">
<style>
${css.themes}

${css.components}

:root {
  --font-heading: ${font.heading};
  --font-body: ${font.body};
}
</style>
</head>
<body class="site theme-${theme.id}">
${cleanSections}
</body>
</html>
`;
}

function slugify(text) {
  return (text || 'website')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'website';
}

async function downloadSiteHTML(project) {
  const html = await generateSiteHTML(project);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(project.name)}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function previewSiteHTML(project) {
  const html = await generateSiteHTML(project);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
