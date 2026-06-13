/* ==========================================================================
   Component library
   Each entry describes one draggable section type: its palette metadata,
   default style (background/padding/alignment), default editable content,
   and a render(data) function that returns the INNER html for the section
   (the <section> wrapper itself is added by builder.js / export.js).

   Editable text fields use contenteditable + data-edit="<field>".
   Editable images use <img data-edit="<field>"> and are swapped via the
   image picker.
   ========================================================================== */

function ed(tag, field, value, cls) {
  const c = cls ? ` class="${cls}"` : '';
  return `<${tag}${c} data-edit="${field}" contenteditable="true">${value}</${tag}>`;
}

function edImg(field, src, cls) {
  const c = cls ? ` class="${cls}"` : '';
  return `<img${c} data-edit="${field}" src="${src}" alt="">`;
}

function sectionHead(data) {
  return `
    <div class="section-head">
      ${ed('span', 'eyebrow', data.eyebrow, 'eyebrow')}
      ${ed('h2', 'heading', data.heading)}
      ${ed('p', 'subheading', data.subheading)}
    </div>`;
}

const COMPONENTS = [
  /* ------------------------------------------------------------------ */
  {
    type: 'navbar',
    label: 'Navigation Bar',
    category: 'Structure',
    icon: '☰',
    sectionClass: 'navbar-section',
    defaultStyle: { bg: 'bg', pad: 'sm', align: 'left' },
    defaultData: {
      brand: 'Brandly',
      link1: 'Home',
      link2: 'About',
      link3: 'Services',
      link4: 'Contact',
      cta: 'Get Started',
    },
    render(d) {
      return `
        <div class="container navbar">
          ${ed('div', 'brand', d.brand, 'navbar-brand')}
          <nav class="navbar-links">
            ${ed('a', 'link1', d.link1)}
            ${ed('a', 'link2', d.link2)}
            ${ed('a', 'link3', d.link3)}
            ${ed('a', 'link4', d.link4)}
          </nav>
          ${ed('a', 'cta', d.cta, 'btn btn-primary')}
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'hero',
    label: 'Hero (Centered)',
    category: 'Headers',
    icon: '✨',
    sectionClass: 'hero hero-center',
    defaultStyle: { bg: 'bg', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'New · Just launched',
      heading: 'Build a beautiful website in minutes',
      subheading:
        'Drag and drop ready-made sections, pick a color theme, and customize every word and image — no code required.',
      cta1: 'Start building free',
      cta2: 'Browse templates',
      image: typeof img === 'function' ? img('tech-laptop-1', 1600, 1000) : '',
    },
    render(d) {
      return `
        <div class="container hero-content">
          ${ed('span', 'eyebrow', d.eyebrow, 'eyebrow')}
          ${ed('h1', 'heading', d.heading)}
          ${ed('p', 'subheading', d.subheading, 'lead')}
          <div class="hero-actions">
            ${ed('a', 'cta1', d.cta1, 'btn btn-primary')}
            ${ed('a', 'cta2', d.cta2, 'btn btn-outline')}
          </div>
          ${edImg('image', d.image, 'hero-image')}
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'hero-split',
    label: 'Hero (Split)',
    category: 'Headers',
    icon: '⧉',
    sectionClass: 'hero-split',
    defaultStyle: { bg: 'bg', pad: 'lg', align: 'left' },
    defaultData: {
      eyebrow: 'Welcome to Brandly',
      heading: 'Design, launch and grow your online presence',
      subheading:
        'A complete toolkit for small businesses and creators to build a professional site that converts visitors into customers.',
      cta1: 'Get Started',
      cta2: 'Watch demo',
      image: typeof img === 'function' ? img('biz-desk-1', 1200, 900) : '',
    },
    render(d) {
      return `
        <div class="container split-grid">
          <div class="split-text">
            ${ed('span', 'eyebrow', d.eyebrow, 'eyebrow')}
            ${ed('h1', 'heading', d.heading)}
            ${ed('p', 'subheading', d.subheading, 'lead')}
            <div class="hero-actions">
              ${ed('a', 'cta1', d.cta1, 'btn btn-primary')}
              ${ed('a', 'cta2', d.cta2, 'btn btn-outline')}
            </div>
          </div>
          <div class="split-media">
            ${edImg('image', d.image)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'about',
    label: 'About / Image + Text',
    category: 'Content',
    icon: '▤',
    sectionClass: 'hero-split about-section',
    defaultStyle: { bg: 'bg', pad: 'lg', align: 'left' },
    defaultData: {
      eyebrow: 'About us',
      heading: 'Crafting digital experiences since 2015',
      subheading:
        'We are a team of designers, developers and strategists who help ambitious brands tell their story online. Our process blends thoughtful design with measurable results.',
      stat1num: '120+',
      stat1label: 'Projects delivered',
      stat2num: '98%',
      stat2label: 'Client satisfaction',
      image: typeof img === 'function' ? img('team-group-1', 1200, 900) : '',
    },
    render(d) {
      return `
        <div class="container split-grid">
          <div class="split-text">
            ${ed('span', 'eyebrow', d.eyebrow, 'eyebrow')}
            ${ed('h2', 'heading', d.heading)}
            ${ed('p', 'subheading', d.subheading, 'lead')}
            <div class="about-stats">
              <div><div class="stat-number" data-edit="stat1num" contenteditable="true">${d.stat1num}</div><div class="stat-label" data-edit="stat1label" contenteditable="true">${d.stat1label}</div></div>
              <div><div class="stat-number" data-edit="stat2num" contenteditable="true">${d.stat2num}</div><div class="stat-label" data-edit="stat2label" contenteditable="true">${d.stat2label}</div></div>
            </div>
          </div>
          <div class="split-media">
            ${edImg('image', d.image)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'features',
    label: 'Feature Grid',
    category: 'Content',
    icon: '⬚',
    sectionClass: 'features',
    defaultStyle: { bg: 'surface', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'Features',
      heading: 'Everything you need to launch',
      subheading: 'A complete set of tools designed to help you move from idea to live website, fast.',
      icon1: '⚡', title1: 'Lightning fast', text1: 'Optimized output that loads instantly on any device.',
      icon2: '🎨', title2: 'Fully customizable', text2: 'Change colors, fonts, images and copy in a click.',
      icon3: '📱', title3: 'Mobile ready', text3: 'Every section automatically adapts to any screen size.',
      icon4: '🔒', title4: 'Secure by default', text4: 'Modern best practices baked into every export.',
    },
    render(d) {
      const card = (i) => `
        <div class="card feature-card">
          ${ed('div', `icon${i}`, d[`icon${i}`], 'icon-badge')}
          ${ed('h3', `title${i}`, d[`title${i}`])}
          ${ed('p', `text${i}`, d[`text${i}`])}
        </div>`;
      return `
        <div class="container">
          ${sectionHead(d)}
          <div class="grid grid-4">
            ${card(1)}${card(2)}${card(3)}${card(4)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'stats',
    label: 'Stats Strip',
    category: 'Content',
    icon: '📊',
    sectionClass: 'stats',
    defaultStyle: { bg: 'primary', pad: 'md', align: 'center' },
    defaultData: {
      num1: '10K+', label1: 'Active users',
      num2: '4.9/5', label2: 'Average rating',
      num3: '38', label3: 'Countries served',
      num4: '99.9%', label4: 'Uptime',
    },
    render(d) {
      const stat = (i) => `
        <div class="stat">
          ${ed('div', `num${i}`, d[`num${i}`], 'stat-number')}
          ${ed('div', `label${i}`, d[`label${i}`], 'stat-label')}
        </div>`;
      return `
        <div class="container grid grid-4 stats-grid">
          ${stat(1)}${stat(2)}${stat(3)}${stat(4)}
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'testimonials',
    label: 'Testimonials',
    category: 'Social Proof',
    icon: '“',
    sectionClass: 'testimonials',
    defaultStyle: { bg: 'bg', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'Testimonials',
      heading: 'Loved by teams everywhere',
      subheading: 'Here’s what people are saying about working with us.',
      quote1: '“The entire site went from concept to live in an afternoon. Genuinely impressive.”',
      name1: 'Amara Cole', role1: 'Founder, Studio Lane',
      avatar1: typeof img === 'function' ? img('team-person-1', 200, 200) : '',
      quote2: '“Our conversion rate improved within the first week of switching designs.”',
      name2: 'Devon Price', role2: 'Marketing Lead, Northwind',
      avatar2: typeof img === 'function' ? img('team-person-2', 200, 200) : '',
      quote3: '“Flexible, fast, and the support team actually responds. Highly recommend.”',
      name3: 'Priya Shah', role3: 'Operations, Glow & Co',
      avatar3: typeof img === 'function' ? img('team-person-3', 200, 200) : '',
    },
    render(d) {
      const card = (i) => `
        <div class="card testimonial-card">
          ${ed('p', `quote${i}`, d[`quote${i}`], 'quote')}
          <div class="testimonial-author">
            ${edImg(`avatar${i}`, d[`avatar${i}`], 'avatar')}
            <div>
              ${ed('div', `name${i}`, d[`name${i}`], 'author-name')}
              ${ed('div', `role${i}`, d[`role${i}`], 'author-role')}
            </div>
          </div>
        </div>`;
      return `
        <div class="container">
          ${sectionHead(d)}
          <div class="grid grid-3">
            ${card(1)}${card(2)}${card(3)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'pricing',
    label: 'Pricing Table',
    category: 'Conversion',
    icon: '💳',
    sectionClass: 'pricing',
    defaultStyle: { bg: 'surface', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'Pricing',
      heading: 'Simple, transparent pricing',
      subheading: 'Choose the plan that fits your business. Upgrade or cancel anytime.',
      plan1name: 'Starter', plan1price: '$9', plan1period: '/month',
      plan1f1: '1 website', plan1f2: '5 pages', plan1f3: 'Basic templates', plan1f4: 'Email support',
      plan1cta: 'Choose Starter',
      plan2name: 'Pro', plan2price: '$29', plan2period: '/month',
      plan2f1: '5 websites', plan2f2: 'Unlimited pages', plan2f3: 'All templates & themes', plan2f4: 'Priority support',
      plan2cta: 'Choose Pro',
      plan3name: 'Business', plan3price: '$79', plan3period: '/month',
      plan3f1: 'Unlimited websites', plan3f2: 'Custom domains', plan3f3: 'Team accounts', plan3f4: 'Dedicated support',
      plan3cta: 'Choose Business',
    },
    render(d) {
      const plan = (i, featured) => `
        <div class="card pricing-card${featured ? ' pricing-card--featured' : ''}">
          ${ed('h3', `plan${i}name`, d[`plan${i}name`])}
          <div class="price">${ed('span', `plan${i}price`, d[`plan${i}price`])}<small>${ed('span', `plan${i}period`, d[`plan${i}period`])}</small></div>
          <ul class="pricing-features">
            <li data-edit="plan${i}f1" contenteditable="true">${d[`plan${i}f1`]}</li>
            <li data-edit="plan${i}f2" contenteditable="true">${d[`plan${i}f2`]}</li>
            <li data-edit="plan${i}f3" contenteditable="true">${d[`plan${i}f3`]}</li>
            <li data-edit="plan${i}f4" contenteditable="true">${d[`plan${i}f4`]}</li>
          </ul>
          ${ed('a', `plan${i}cta`, d[`plan${i}cta`], 'btn ' + (featured ? 'btn-primary' : 'btn-outline'))}
        </div>`;
      return `
        <div class="container">
          ${sectionHead(d)}
          <div class="grid grid-3 pricing-grid">
            ${plan(1, false)}${plan(2, true)}${plan(3, false)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'team',
    label: 'Team Grid',
    category: 'Social Proof',
    icon: '🧑‍🤝‍🧑',
    sectionClass: 'team',
    defaultStyle: { bg: 'bg', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'Our Team',
      heading: 'Meet the people behind it',
      subheading: 'A small, dedicated team focused on building great products.',
      photo1: typeof img === 'function' ? img('team-person-1', 500, 500) : '', name1: 'Jordan Lee', role1: 'CEO & Founder',
      photo2: typeof img === 'function' ? img('team-person-2', 500, 500) : '', name2: 'Maya Chen', role2: 'Head of Design',
      photo3: typeof img === 'function' ? img('team-person-3', 500, 500) : '', name3: 'Sam Carter', role3: 'Lead Engineer',
      photo4: typeof img === 'function' ? img('team-person-4', 500, 500) : '', name4: 'Riley Brooks', role4: 'Marketing',
    },
    render(d) {
      const member = (i) => `
        <div class="team-card">
          ${edImg(`photo${i}`, d[`photo${i}`])}
          ${ed('h4', `name${i}`, d[`name${i}`])}
          ${ed('p', `role${i}`, d[`role${i}`])}
        </div>`;
      return `
        <div class="container">
          ${sectionHead(d)}
          <div class="grid grid-4">
            ${member(1)}${member(2)}${member(3)}${member(4)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'gallery',
    label: 'Image Gallery',
    category: 'Content',
    icon: '🖼️',
    sectionClass: 'gallery',
    defaultStyle: { bg: 'bg', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'Gallery',
      heading: 'Our recent work',
      subheading: 'A look at projects we’re proud of.',
      img1: typeof img === 'function' ? img('arch-interior-1', 900, 1200) : '',
      img2: typeof img === 'function' ? img('arch-building-1', 900, 600) : '',
      img3: typeof img === 'function' ? img('travel-city-1', 900, 600) : '',
      img4: typeof img === 'function' ? img('fashion-studio-1', 900, 600) : '',
      img5: typeof img === 'function' ? img('arch-house-1', 900, 600) : '',
      img6: typeof img === 'function' ? img('abstract-1', 900, 600) : '',
    },
    render(d) {
      return `
        <div class="container">
          ${sectionHead(d)}
          <div class="gallery-grid">
            ${edImg('img1', d.img1)}${edImg('img2', d.img2)}${edImg('img3', d.img3)}
            ${edImg('img4', d.img4)}${edImg('img5', d.img5)}${edImg('img6', d.img6)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'cta',
    label: 'Call To Action',
    category: 'Conversion',
    icon: '📣',
    sectionClass: 'cta-banner',
    defaultStyle: { bg: 'gradient', pad: 'lg', align: 'center' },
    defaultData: {
      heading: 'Ready to build your website?',
      text: 'Join thousands of businesses creating their online presence today — no coding required.',
      cta: 'Get Started Free',
    },
    render(d) {
      return `
        <div class="container cta-content">
          ${ed('h2', 'heading', d.heading)}
          ${ed('p', 'text', d.text)}
          ${ed('a', 'cta', d.cta, 'btn btn-light')}
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'faq',
    label: 'FAQ Accordion',
    category: 'Content',
    icon: '❓',
    sectionClass: 'faq',
    defaultStyle: { bg: 'surface', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'FAQ',
      heading: 'Frequently asked questions',
      subheading: 'Everything you need to know before getting started.',
      q1: 'Can I use my own domain name?', a1: 'Yes, every plan supports connecting a custom domain you already own or purchasing a new one.',
      q2: 'Do I need any design experience?', a2: 'No. Pick a template, drag in the sections you want, and edit text and images directly on the page.',
      q3: 'Can I export the final website?', a3: 'Yes — once you complete the one-time payment, you can download a clean, ready-to-host HTML version of your site.',
      q4: 'Is there a free trial?', a4: 'You can design and preview your site for free. Payment is only required when you’re ready to download.',
    },
    render(d) {
      const item = (i) => `
        <details class="faq-item">
          <summary data-edit="q${i}" contenteditable="true">${d[`q${i}`]}</summary>
          <p data-edit="a${i}" contenteditable="true">${d[`a${i}`]}</p>
        </details>`;
      return `
        <div class="container">
          ${sectionHead(d)}
          <div class="faq-list">
            ${item(1)}${item(2)}${item(3)}${item(4)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'contact',
    label: 'Contact Form',
    category: 'Conversion',
    icon: '✉️',
    sectionClass: 'contact',
    defaultStyle: { bg: 'bg', pad: 'lg', align: 'left' },
    defaultData: {
      heading: 'Get in touch',
      text: 'Have a question or want to work together? Send us a message and we’ll get back to you within one business day.',
      email: 'hello@yourbrand.com',
      phone: '+1 (555) 123-4567',
      address: '123 Market Street, San Francisco, CA',
      cta: 'Send Message',
    },
    render(d) {
      return `
        <div class="container split-grid">
          <div class="split-text">
            ${ed('h2', 'heading', d.heading)}
            ${ed('p', 'text', d.text, 'lead')}
            <ul class="contact-info">
              <li data-edit="email" contenteditable="true">${d.email}</li>
              <li data-edit="phone" contenteditable="true">${d.phone}</li>
              <li data-edit="address" contenteditable="true">${d.address}</li>
            </ul>
          </div>
          <form class="contact-form" onsubmit="return false;">
            <input type="text" placeholder="Your name">
            <input type="email" placeholder="Your email">
            <textarea placeholder="Your message"></textarea>
            ${ed('button', 'cta', d.cta, 'btn btn-primary')}
          </form>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'newsletter',
    label: 'Newsletter Signup',
    category: 'Conversion',
    icon: '📩',
    sectionClass: 'newsletter',
    defaultStyle: { bg: 'surface', pad: 'md', align: 'center' },
    defaultData: {
      heading: 'Stay in the loop',
      text: 'Subscribe to get product updates, design tips and exclusive offers.',
      cta: 'Subscribe',
    },
    render(d) {
      return `
        <div class="container newsletter-content">
          ${ed('h2', 'heading', d.heading)}
          ${ed('p', 'text', d.text)}
          <form class="newsletter-form" onsubmit="return false;">
            <input type="email" placeholder="Enter your email">
            ${ed('button', 'cta', d.cta, 'btn btn-primary')}
          </form>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'logos',
    label: 'Logo Cloud',
    category: 'Social Proof',
    icon: '◈',
    sectionClass: 'logos',
    defaultStyle: { bg: 'bg', pad: 'sm', align: 'center' },
    defaultData: {
      label: 'Trusted by teams at',
      logo1: 'Acme', logo2: 'Northwind', logo3: 'Globex', logo4: 'Initech', logo5: 'Umbra',
    },
    render(d) {
      return `
        <div class="container">
          ${ed('p', 'label', d.label, 'logos-label')}
          <div class="logos-row">
            ${ed('div', 'logo1', d.logo1, 'logo-item')}
            ${ed('div', 'logo2', d.logo2, 'logo-item')}
            ${ed('div', 'logo3', d.logo3, 'logo-item')}
            ${ed('div', 'logo4', d.logo4, 'logo-item')}
            ${ed('div', 'logo5', d.logo5, 'logo-item')}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'blog',
    label: 'Blog / Articles',
    category: 'Content',
    icon: '📝',
    sectionClass: 'blog',
    defaultStyle: { bg: 'bg', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'From the blog',
      heading: 'Latest articles & insights',
      subheading: 'Tips, guides and updates from our team.',
      img1: typeof img === 'function' ? img('tech-code-1', 800, 500) : '',
      tag1: 'Design', title1: '5 tips for a better landing page', excerpt1: 'Simple changes that make a big difference in conversion rates.', link1: 'Read more →',
      img2: typeof img === 'function' ? img('biz-meeting-1', 800, 500) : '',
      tag2: 'Strategy', title2: 'How to plan your website in a weekend', excerpt2: 'A step-by-step framework for getting from idea to live site.', link2: 'Read more →',
      img3: typeof img === 'function' ? img('tech-device-1', 800, 500) : '',
      tag3: 'Tech', title3: 'Choosing the right color palette', excerpt3: 'How color affects trust, mood and brand perception.', link3: 'Read more →',
    },
    render(d) {
      const post = (i) => `
        <article class="blog-card">
          ${edImg(`img${i}`, d[`img${i}`])}
          <div class="blog-card-body">
            ${ed('span', `tag${i}`, d[`tag${i}`], 'blog-tag')}
            ${ed('h3', `title${i}`, d[`title${i}`])}
            ${ed('p', `excerpt${i}`, d[`excerpt${i}`])}
            ${ed('a', `link${i}`, d[`link${i}`], 'link-arrow')}
          </div>
        </article>`;
      return `
        <div class="container">
          ${sectionHead(d)}
          <div class="grid grid-3">
            ${post(1)}${post(2)}${post(3)}
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'video',
    label: 'Video Showcase',
    category: 'Content',
    icon: '▶️',
    sectionClass: 'video',
    defaultStyle: { bg: 'surface', pad: 'lg', align: 'center' },
    defaultData: {
      eyebrow: 'See it in action',
      heading: 'Watch the product walkthrough',
      subheading: 'A quick 2-minute tour of everything you can build.',
      poster: typeof img === 'function' ? img('tech-abstract-1', 1280, 720) : '',
    },
    render(d) {
      return `
        <div class="container">
          ${sectionHead(d)}
          <div class="video-frame">
            ${edImg('poster', d.poster)}
            <div class="play-button">▶</div>
          </div>
        </div>`;
    },
  },

  /* ------------------------------------------------------------------ */
  {
    type: 'footer',
    label: 'Footer',
    category: 'Structure',
    icon: '▇',
    sectionClass: 'footer',
    defaultStyle: { bg: 'dark', pad: 'lg', align: 'left' },
    defaultData: {
      brand: 'Brandly',
      tagline: 'Building beautiful websites made simple. Design, customize and launch in minutes.',
      social1: '𝕏', social2: 'in', social3: '◎',
      col1title: 'Product', col1l1: 'Features', col1l2: 'Templates', col1l3: 'Pricing',
      col2title: 'Company', col2l1: 'About', col2l2: 'Careers', col2l3: 'Contact',
      col3title: 'Legal', col3l1: 'Privacy Policy', col3l2: 'Terms of Service',
      copyright: '© 2026 Brandly. All rights reserved.',
    },
    render(d) {
      return `
        <div class="container footer-grid">
          <div class="footer-brand">
            ${ed('div', 'brand', d.brand, 'navbar-brand')}
            ${ed('p', 'tagline', d.tagline)}
            <div class="social-row">
              ${ed('span', 'social1', d.social1)}
              ${ed('span', 'social2', d.social2)}
              ${ed('span', 'social3', d.social3)}
            </div>
          </div>
          <div class="footer-col">
            ${ed('h4', 'col1title', d.col1title)}
            ${ed('a', 'col1l1', d.col1l1)}
            ${ed('a', 'col1l2', d.col1l2)}
            ${ed('a', 'col1l3', d.col1l3)}
          </div>
          <div class="footer-col">
            ${ed('h4', 'col2title', d.col2title)}
            ${ed('a', 'col2l1', d.col2l1)}
            ${ed('a', 'col2l2', d.col2l2)}
            ${ed('a', 'col2l3', d.col2l3)}
          </div>
          <div class="footer-col">
            ${ed('h4', 'col3title', d.col3title)}
            ${ed('a', 'col3l1', d.col3l1)}
            ${ed('a', 'col3l2', d.col3l2)}
          </div>
        </div>
        <div class="container footer-bottom">
          ${ed('p', 'copyright', d.copyright)}
        </div>`;
    },
  },
];

function getComponent(type) {
  return COMPONENTS.find((c) => c.type === type);
}

if (typeof module !== 'undefined') {
  module.exports = { COMPONENTS, getComponent, ed, edImg, sectionHead };
}
