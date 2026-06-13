/* ==========================================================================
   Theme & font registry
   These ids map directly to the `.theme-<id>` classes in css/themes.css.
   ========================================================================== */

const THEMES = [
  { id: 'ocean', name: 'Ocean Breeze', swatches: ['#2563eb', '#06b6d4', '#f59e0b'], best: 'SaaS, tech, startups' },
  { id: 'sunset', name: 'Sunset Glow', swatches: ['#f97316', '#ec4899', '#facc15'], best: 'Creative, agency, events' },
  { id: 'forest', name: 'Forest Canopy', swatches: ['#15803d', '#84cc16', '#f59e0b'], best: 'Eco, wellness, outdoors' },
  { id: 'royal', name: 'Royal Velvet', swatches: ['#7c3aed', '#c026d3', '#fbbf24'], best: 'Premium, luxury, beauty' },
  { id: 'midnight', name: 'Midnight Pro', swatches: ['#6366f1', '#22d3ee', '#f472b6'], best: 'Dark mode, tech, portfolios' },
  { id: 'mono', name: 'Monochrome Studio', swatches: ['#111827', '#6b7280', '#ef4444'], best: 'Portfolios, photography' },
  { id: 'berry', name: 'Berry Punch', swatches: ['#db2777', '#f43f5e', '#fde047'], best: 'Bold consumer brands' },
  { id: 'corporate', name: 'Corporate Slate', swatches: ['#1e3a8a', '#475569', '#0ea5e9'], best: 'B2B, finance, consulting' },
  { id: 'pastel', name: 'Pastel Dream', swatches: ['#a78bfa', '#67e8f9', '#fda4af'], best: 'Lifestyle, baby, beauty' },
  { id: 'earth', name: 'Earth & Clay', swatches: ['#b45309', '#65a30d', '#facc15'], best: 'Food, craft, artisan' },
  { id: 'coral', name: 'Vibrant Coral', swatches: ['#fb5d5d', '#14b8a6', '#fbbf24'], best: 'Startups, apps, fitness' },
  { id: 'mint', name: 'Mint Fresh', swatches: ['#10b981', '#38bdf8', '#fb923c'], best: 'Health, wellness, clean tech' },
];

const FONT_PAIRS = [
  {
    id: 'inter',
    name: 'Inter',
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    google: 'Inter:wght@400;500;600;700;800',
  },
  {
    id: 'poppins',
    name: 'Poppins + Inter',
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    google: 'Poppins:wght@500;600;700;800&family=Inter:wght@400;500',
  },
  {
    id: 'playfair',
    name: 'Playfair + Source Sans',
    heading: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
    google: 'Playfair+Display:wght@600;700;800&family=Source+Sans+3:wght@400;500',
  },
  {
    id: 'montserrat',
    name: 'Montserrat + Open Sans',
    heading: "'Montserrat', sans-serif",
    body: "'Open Sans', sans-serif",
    google: 'Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500',
  },
  {
    id: 'slab',
    name: 'Roboto Slab + Roboto',
    heading: "'Roboto Slab', serif",
    body: "'Roboto', sans-serif",
    google: 'Roboto+Slab:wght@600;700&family=Roboto:wght@400;500',
  },
  {
    id: 'space',
    name: 'Space Grotesk + Inter',
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    google: 'Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500',
  },
  {
    id: 'lora',
    name: 'Lora + Nunito Sans',
    heading: "'Lora', serif",
    body: "'Nunito Sans', sans-serif",
    google: 'Lora:wght@600;700&family=Nunito+Sans:wght@400;500',
  },
  {
    id: 'quicksand',
    name: 'Quicksand + Mukta',
    heading: "'Quicksand', sans-serif",
    body: "'Mukta', sans-serif",
    google: 'Quicksand:wght@600;700&family=Mukta:wght@400;500',
  },
];

function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

function getFontPair(id) {
  return FONT_PAIRS.find((f) => f.id === id) || FONT_PAIRS[0];
}

function googleFontsUrl(fontPair) {
  return `https://fonts.googleapis.com/css2?family=${fontPair.google}&display=swap`;
}

if (typeof module !== 'undefined') {
  module.exports = { THEMES, FONT_PAIRS, getTheme, getFontPair, googleFontsUrl };
}
