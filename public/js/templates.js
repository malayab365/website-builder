/* ==========================================================================
   Predesigned page templates
   Each template is a starting point: a recommended theme + font pairing and
   an ordered list of sections. Section `data` is merged ON TOP OF the
   component's defaultData (see components.js), so templates only need to
   override the fields that make them feel distinct.
   ========================================================================== */

const TEMPLATES = [
  {
    id: 'saas',
    name: 'SaaS / Startup',
    description: 'Landing page for a software product — hero, features, pricing & FAQ.',
    category: 'Technology',
    theme: 'ocean',
    font: 'space',
    sections: [
      { type: 'navbar', data: { brand: 'Flowly', cta: 'Start Free Trial' } },
      { type: 'hero', data: {
        eyebrow: 'Now in public beta',
        heading: 'Automate your workflow in minutes',
        subheading: 'Flowly connects your favorite tools so your team can focus on what matters — without the busywork.',
        cta1: 'Start Free Trial', cta2: 'Watch Demo',
        image: img('tech-device-1', 1600, 1000),
      }},
      { type: 'logos', data: { label: 'Trusted by fast-growing teams at' } },
      { type: 'features', data: { eyebrow: 'Why Flowly', heading: 'Everything your team needs to move faster' } },
      { type: 'stats', style: { bg: 'primary' } },
      { type: 'testimonials', data: { eyebrow: 'Customer Love', heading: 'Loved by teams everywhere' } },
      { type: 'pricing', data: { eyebrow: 'Plans', heading: 'Pricing that scales with you' } },
      { type: 'cta', data: { heading: 'Start automating today', text: 'Join 10,000+ teams already saving hours every week.', cta: 'Get Started Free' } },
      { type: 'faq' },
      { type: 'footer', data: { brand: 'Flowly', tagline: 'The easiest way to automate your team’s workflow.' } },
    ],
  },

  {
    id: 'business',
    name: 'Business / Consulting',
    description: 'Professional site for a consulting or B2B services firm.',
    category: 'Business',
    theme: 'corporate',
    font: 'montserrat',
    sections: [
      { type: 'navbar', data: { brand: 'Meridian & Co', link1: 'Home', link2: 'Services', link3: 'About', link4: 'Contact', cta: 'Book a Consultation' } },
      { type: 'hero-split', data: {
        eyebrow: 'Strategic Consulting',
        heading: 'Helping businesses grow with confidence',
        subheading: 'We partner with leaders to solve complex challenges and unlock sustainable, long-term growth.',
        cta1: 'Book a Consultation', cta2: 'Our Services',
        image: img('biz-meeting-2', 1200, 900),
      }},
      { type: 'about', data: {
        eyebrow: 'Who we are',
        heading: 'Three decades of trusted advisory experience',
        subheading: 'Our consultants have helped organizations across finance, healthcare and technology navigate change and accelerate growth.',
        stat1num: '30+', stat1label: 'Years in business',
        stat2num: '500+', stat2label: 'Clients served',
        image: img('biz-office-2', 1200, 900),
      }},
      { type: 'features', data: { eyebrow: 'Our Services', heading: 'How we help you succeed' } },
      { type: 'stats' },
      { type: 'team', data: { eyebrow: 'Leadership', heading: 'Meet our partners' } },
      { type: 'testimonials', data: { eyebrow: 'Client Stories', heading: 'Results our clients trust' } },
      { type: 'cta', data: { heading: 'Ready to discuss your strategy?', text: 'Schedule a free 30-minute consultation with our advisory team.', cta: 'Schedule a Call' } },
      { type: 'contact' },
      { type: 'footer', data: { brand: 'Meridian & Co', tagline: 'Strategic advisory for ambitious organizations.' } },
    ],
  },

  {
    id: 'portfolio',
    name: 'Personal Portfolio',
    description: 'Showcase your work as a designer, developer or freelancer.',
    category: 'Portfolio',
    theme: 'mono',
    font: 'playfair',
    sections: [
      { type: 'navbar', data: { brand: 'Alex Rivera', link1: 'Work', link2: 'About', link3: 'Services', link4: 'Contact', cta: 'Hire Me' } },
      { type: 'hero', data: {
        eyebrow: 'Product Designer & Developer',
        heading: 'I design and build digital products that people love',
        subheading: 'Freelance designer based in New York, specializing in branding, UI/UX and front-end development.',
        cta1: 'View My Work', cta2: 'Get In Touch',
        image: img('fashion-studio-2', 1600, 1000),
      }},
      { type: 'about', data: {
        eyebrow: 'About me',
        heading: 'A bit about my background',
        subheading: 'I’ve spent the last 8 years helping startups and brands design products from the ground up — from early concepts to polished, shipped experiences.',
        stat1num: '8+', stat1label: 'Years experience',
        stat2num: '60+', stat2label: 'Projects completed',
        image: img('team-person-5', 1200, 900),
      }},
      { type: 'gallery', data: { eyebrow: 'Selected Work', heading: 'A few favorite projects' } },
      { type: 'testimonials', data: { eyebrow: 'Kind Words', heading: 'What clients say' } },
      { type: 'contact', data: { heading: 'Let’s work together', text: 'Have a project in mind? I’d love to hear about it — send me a message.' } },
      { type: 'footer', data: {
        brand: 'Alex Rivera', tagline: 'Product designer & developer.',
        col1title: 'Site', col1l1: 'Work', col1l2: 'About', col1l3: 'Contact',
        col2title: 'Elsewhere', col2l1: 'Dribbble', col2l2: 'GitHub', col2l3: 'LinkedIn',
        copyright: '© 2026 Alex Rivera. All rights reserved.',
      }},
    ],
  },

  {
    id: 'ecommerce',
    name: 'E-commerce / Product',
    description: 'Storefront landing page to showcase and sell products.',
    category: 'Retail',
    theme: 'coral',
    font: 'poppins',
    sections: [
      { type: 'navbar', data: { brand: 'Lumora', link1: 'Shop', link2: 'Collections', link3: 'About', link4: 'Support', cta: 'Shop Now' } },
      { type: 'hero-split', data: {
        eyebrow: 'New Collection',
        heading: 'Minimal design, maximum comfort',
        subheading: 'Discover our latest collection of sustainably-made everyday essentials, designed to last.',
        cta1: 'Shop Collection', cta2: 'Learn More',
        image: img('fashion-product-1', 1200, 900),
      }},
      { type: 'logos', data: { label: 'As featured in' } },
      { type: 'features', data: { eyebrow: 'Why Lumora', heading: 'Designed to last, made to love',
        icon1: '🌿', title1: 'Sustainably made', text1: 'Responsibly sourced materials and ethical manufacturing.',
        icon2: '🚚', title2: 'Free shipping', text2: 'Free shipping and returns on every order over $50.',
        icon3: '♻️', title3: '30-day returns', text3: 'Not the right fit? Send it back within 30 days, no questions asked.',
        icon4: '⭐', title4: 'Loved by thousands', text4: 'Rated 4.8/5 by over 12,000 happy customers.',
      }},
      { type: 'gallery', data: { eyebrow: 'Shop the Look', heading: 'Customer favorites' } },
      { type: 'testimonials', data: { eyebrow: 'Reviews', heading: 'What our customers say' } },
      { type: 'newsletter', data: { heading: 'Get 10% off your first order', text: 'Sign up for our newsletter and stay up to date on new arrivals and offers.' } },
      { type: 'footer', data: { brand: 'Lumora', tagline: 'Everyday essentials, sustainably made.' } },
    ],
  },

  {
    id: 'restaurant',
    name: 'Restaurant / Café',
    description: 'Warm, inviting site for a restaurant, café or eatery.',
    category: 'Food & Drink',
    theme: 'earth',
    font: 'lora',
    sections: [
      { type: 'navbar', data: { brand: 'Olive & Oak', link1: 'Menu', link2: 'Reservations', link3: 'About', link4: 'Contact', cta: 'Reserve a Table' } },
      { type: 'hero', data: {
        eyebrow: 'Now Open',
        heading: 'Seasonal cuisine, crafted with care',
        subheading: 'A neighborhood restaurant serving locally-sourced dishes in a warm, welcoming space.',
        cta1: 'Reserve a Table', cta2: 'View Menu',
        image: img('food-restaurant-1', 1600, 1000),
      }},
      { type: 'about', data: {
        eyebrow: 'Our Story',
        heading: 'Family recipes meet modern technique',
        subheading: 'For over a decade we’ve been serving dishes inspired by family recipes, using ingredients sourced from local farms.',
        stat1num: '15', stat1label: 'Years serving the community',
        stat2num: '4.8★', stat2label: 'Average rating',
        image: img('food-cafe-1', 1200, 900),
      }},
      { type: 'gallery', data: { eyebrow: 'From the Kitchen', heading: 'A taste of what we serve' } },
      { type: 'testimonials', data: { eyebrow: 'Reviews', heading: 'What our guests are saying' } },
      { type: 'contact', data: { heading: 'Visit Us', text: 'Walk-ins welcome, or reserve your table in advance for the best experience.' } },
      { type: 'footer', data: { brand: 'Olive & Oak', tagline: 'Seasonal, local, delicious.' } },
    ],
  },

  {
    id: 'agency',
    name: 'Creative Agency',
    description: 'Bold landing page for a design studio or marketing agency.',
    category: 'Creative',
    theme: 'sunset',
    font: 'space',
    sections: [
      { type: 'navbar', data: { brand: 'Studio Nova', link1: 'Work', link2: 'Services', link3: 'Team', link4: 'Contact', cta: 'Start a Project' } },
      { type: 'hero-split', data: {
        eyebrow: 'Creative Studio',
        heading: 'We build brands that stand out',
        subheading: 'A full-service creative agency specializing in branding, web design and digital campaigns.',
        cta1: 'Start a Project', cta2: 'See Our Work',
        image: img('fashion-studio-1', 1200, 900),
      }},
      { type: 'logos', data: { label: 'Brands we’ve worked with' } },
      { type: 'features', data: { eyebrow: 'What We Do', heading: 'Services tailored to your goals',
        icon1: '🎯', title1: 'Brand Strategy', text1: 'Positioning, naming and visual identity that resonates.',
        icon2: '💻', title2: 'Web Design', text2: 'Beautiful, fast websites built to convert.',
        icon3: '📱', title3: 'Digital Campaigns', text3: 'Social, paid and content campaigns that drive growth.',
        icon4: '🎬', title4: 'Motion & Video', text4: 'Engaging video content for every platform.',
      }},
      { type: 'team', data: { eyebrow: 'The Studio', heading: 'Meet the creatives' } },
      { type: 'blog', data: { eyebrow: 'Journal', heading: 'Latest from the studio' } },
      { type: 'cta', data: { heading: 'Have a project in mind?', text: 'Let’s create something amazing together.', cta: 'Get In Touch' } },
      { type: 'footer', data: { brand: 'Studio Nova', tagline: 'Brand, web & digital design studio.' } },
    ],
  },

  {
    id: 'blog',
    name: 'Blog / Magazine',
    description: 'Editorial-style layout for writers, publications and newsletters.',
    category: 'Media',
    theme: 'pastel',
    font: 'quicksand',
    sections: [
      { type: 'navbar', data: { brand: 'The Daily Page', link1: 'Home', link2: 'Categories', link3: 'About', link4: 'Subscribe', cta: 'Subscribe' } },
      { type: 'hero', data: {
        eyebrow: 'Welcome',
        heading: 'Stories, ideas and inspiration',
        subheading: 'A weekly publication covering design, productivity and life.',
        cta1: 'Start Reading', cta2: 'Subscribe',
        image: img('food-cafe-2', 1600, 1000),
      }},
      { type: 'blog', data: { eyebrow: 'Latest', heading: 'Recent articles' } },
      { type: 'testimonials', data: { eyebrow: 'Readers Say', heading: 'What our subscribers think' } },
      { type: 'newsletter', data: { heading: 'Never miss an issue', text: 'Get new articles delivered straight to your inbox every week.' } },
      { type: 'footer', data: { brand: 'The Daily Page', tagline: 'A weekly read on design & life.' } },
    ],
  },

  {
    id: 'wellness',
    name: 'Health & Wellness',
    description: 'Energetic layout for gyms, studios and wellness brands.',
    category: 'Health & Fitness',
    theme: 'mint',
    font: 'poppins',
    sections: [
      { type: 'navbar', data: { brand: 'Vita Studio', link1: 'Classes', link2: 'Trainers', link3: 'Pricing', link4: 'Contact', cta: 'Join Now' } },
      { type: 'hero', data: {
        eyebrow: 'Your wellness journey starts here',
        heading: 'Feel stronger, healthier, happier',
        subheading: 'Personalized fitness and wellness programs designed around your goals — for every level.',
        cta1: 'Start Free Trial', cta2: 'View Classes',
        image: img('fit-yoga-1', 1600, 1000),
      }},
      { type: 'features', data: { eyebrow: 'Programs', heading: 'Find the right plan for you',
        icon1: '🧘', title1: 'Yoga & Mindfulness', text1: 'Build flexibility and reduce stress with guided sessions.',
        icon2: '🏋️', title2: 'Strength Training', text2: 'Personalized programs to build strength safely.',
        icon3: '🏃', title3: 'Cardio & Endurance', text3: 'High-energy classes to boost your stamina.',
        icon4: '🥗', title4: 'Nutrition Coaching', text4: 'One-on-one guidance to fuel your goals.',
      }},
      { type: 'stats' },
      { type: 'pricing', data: { eyebrow: 'Membership', heading: 'Choose your membership' } },
      { type: 'testimonials', data: { eyebrow: 'Success Stories', heading: 'Real results from real members' } },
      { type: 'faq' },
      { type: 'cta', data: { heading: 'Ready to get started?', text: 'Your first class is on us.', cta: 'Book Free Class' } },
      { type: 'footer', data: { brand: 'Vita Studio', tagline: 'Fitness & wellness for everybody.' } },
    ],
  },

  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch and build your page section by section.',
    category: 'Start from scratch',
    theme: 'ocean',
    font: 'inter',
    sections: [
      { type: 'navbar' },
      { type: 'hero' },
      { type: 'footer' },
    ],
  },
];

function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[TEMPLATES.length - 1];
}

if (typeof module !== 'undefined') {
  module.exports = { TEMPLATES, getTemplate };
}
