/* ==========================================================================
   Curated image library
   Uses Lorem Picsum (https://picsum.photos), a free placeholder photo
   service. Each "seed" always returns the same photo, so designs stay
   stable. Swap these for your own hosted images before going live.
   ========================================================================== */

function img(seed, w = 1200, h = 900) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const IMAGE_LIBRARY = {
  business: {
    label: 'Business & Office',
    images: [
      img('biz-office-1'), img('biz-office-2'), img('biz-office-3'), img('biz-office-4'),
      img('biz-meeting-1'), img('biz-meeting-2'), img('biz-desk-1'), img('biz-desk-2'),
    ],
  },
  team: {
    label: 'People & Team',
    images: [
      img('team-person-1', 600, 600), img('team-person-2', 600, 600), img('team-person-3', 600, 600),
      img('team-person-4', 600, 600), img('team-person-5', 600, 600), img('team-person-6', 600, 600),
      img('team-group-1'), img('team-group-2'),
    ],
  },
  technology: {
    label: 'Technology',
    images: [
      img('tech-code-1'), img('tech-code-2'), img('tech-device-1'), img('tech-device-2'),
      img('tech-abstract-1'), img('tech-abstract-2'), img('tech-server-1'), img('tech-laptop-1'),
    ],
  },
  nature: {
    label: 'Nature & Outdoors',
    images: [
      img('nature-forest-1'), img('nature-forest-2'), img('nature-mountain-1'), img('nature-mountain-2'),
      img('nature-ocean-1'), img('nature-ocean-2'), img('nature-leaf-1'), img('nature-sky-1'),
    ],
  },
  food: {
    label: 'Food & Drink',
    images: [
      img('food-dish-1'), img('food-dish-2'), img('food-cafe-1'), img('food-cafe-2'),
      img('food-bakery-1'), img('food-restaurant-1'), img('food-drink-1'), img('food-table-1'),
    ],
  },
  travel: {
    label: 'Travel & City',
    images: [
      img('travel-city-1'), img('travel-city-2'), img('travel-street-1'), img('travel-beach-1'),
      img('travel-architecture-1'), img('travel-skyline-1'), img('travel-road-1'), img('travel-map-1'),
    ],
  },
  fashion: {
    label: 'Fashion & Lifestyle',
    images: [
      img('fashion-studio-1'), img('fashion-studio-2'), img('fashion-model-1'), img('fashion-model-2'),
      img('fashion-product-1'), img('fashion-product-2'), img('fashion-store-1'), img('fashion-detail-1'),
    ],
  },
  architecture: {
    label: 'Architecture & Interiors',
    images: [
      img('arch-building-1'), img('arch-building-2'), img('arch-interior-1'), img('arch-interior-2'),
      img('arch-house-1'), img('arch-house-2'), img('arch-window-1'), img('arch-stairs-1'),
    ],
  },
  fitness: {
    label: 'Fitness & Health',
    images: [
      img('fit-gym-1'), img('fit-gym-2'), img('fit-yoga-1'), img('fit-yoga-2'),
      img('fit-run-1'), img('fit-health-1'), img('fit-sport-1'), img('fit-wellness-1'),
    ],
  },
  abstract: {
    label: 'Abstract & Textures',
    images: [
      img('abstract-1'), img('abstract-2'), img('abstract-3'), img('abstract-4'),
      img('abstract-5'), img('abstract-6'), img('abstract-7'), img('abstract-8'),
    ],
  },
};

// Flat list, handy for "All" tab in the image picker
const ALL_IMAGES = Object.values(IMAGE_LIBRARY).flatMap((cat) => cat.images);

if (typeof module !== 'undefined') {
  module.exports = { IMAGE_LIBRARY, ALL_IMAGES, img };
}
