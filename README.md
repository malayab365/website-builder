# Website Builder Studio

A full, self-hosted drag-and-drop website design tool: account creation, a visual
page builder with 18 component types, 9 page templates, 12 color themes and 8
font pairings, and a real Stripe checkout that gates the final HTML export
behind a one-time payment.

## Features

- **Accounts** — email/password signup & login (bcrypt + JWT), per-user projects.
- **Drag-and-drop builder** — drag sections from the palette onto the canvas,
  reorder by dragging, duplicate/delete/move sections, edit text in place
  (click and type) and swap images from a built-in stock photo library.
- **9 starter templates** — SaaS, Business/Consulting, Portfolio, E-commerce,
  Restaurant/Café, Creative Agency, Blog/Magazine, Health & Wellness, and a
  Blank Canvas.
- **12 color themes** (Ocean, Sunset, Forest, Royal, Midnight, Monochrome,
  Berry, Corporate, Pastel, Earth, Coral, Mint) and **8 Google Font pairings**,
  switchable per project with one click.
- **18 section types** — navbar, hero (centered & split), about, features,
  stats, testimonials, pricing, team, gallery, CTA banner, FAQ, contact,
  newsletter, logo cloud, blog, video, footer.
- **Real Stripe Checkout** — projects must be paid for (one-time, per project)
  before the HTML export can be downloaded. Includes webhook handling for
  reliable payment confirmation.
- **Clean HTML export** — downloads a single self-contained, responsive HTML
  file with all styles inlined — host it anywhere, no build step.

## Tech stack

- **Backend:** Node.js + Express, JSON-file persistence (no database to set up),
  bcryptjs + JWT auth, Stripe SDK.
- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step).

## Getting started

```bash
npm install
cp .env.example .env
npm start
```

The app runs at **http://localhost:4000** by default.

On first run it creates a `data/` folder with JSON files for `users` and
`projects` — this is your "database." Delete the files to reset.

## Configuring Stripe (real payments)

By default, Stripe is **not configured**, and the app runs in a "dev mode"
that lets you test the entire flow with a **Simulate payment** button instead
of a real card charge — so you can try everything end-to-end immediately.

To enable real payments:

1. Create a [Stripe](https://dashboard.stripe.com) account (test mode is fine).
2. In `.env`, set:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   CLIENT_URL=http://localhost:4000
   ```
3. For local webhook testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
   and run:
   ```bash
   stripe listen --forward-to localhost:4000/api/payments/webhook
   ```
   This prints a `whsec_...` value — put that in `STRIPE_WEBHOOK_SECRET`.
4. Restart the server. The "Pay & Unlock" button on the download paywall now
   creates a real Stripe Checkout session. After a successful test payment
   (use card `4242 4242 4242 4242`, any future expiry/CVC), Stripe redirects
   back to `success.html`, which confirms the payment and unlocks the
   download — even if the webhook hasn't arrived yet (the status endpoint
   lazily verifies the session with Stripe as a fallback).

You can change the download price by editing `DOWNLOAD_PRICE_CENTS` and
`DOWNLOAD_PRICE_LABEL` in `.env`.

## Project structure

```
website-builder/
├── package.json
├── .env.example
├── data/                  # created automatically (users.json, projects.json)
├── server/
│   ├── server.js          # Express app + static file serving
│   ├── db.js               # tiny JSON-file persistence layer
│   ├── webhookHandler.js    # Stripe webhook (raw body)
│   ├── middleware/auth.js   # JWT auth middleware
│   └── routes/
│       ├── auth.js          # signup / login / me
│       ├── projects.js      # CRUD for user projects
│       └── payments.js      # Stripe Checkout + status + dev-mark-paid
└── public/
    ├── index.html           # marketing landing page
    ├── signup.html / login.html
    ├── dashboard.html        # project list + "new site" template gallery
    ├── builder.html           # the drag-and-drop editor
    ├── success.html           # post-checkout confirmation + download
    ├── css/
    │   ├── themes.css          # 12 color themes as CSS variables
    │   ├── components.css       # styles for all 18 section types
    │   └── app.css               # builder UI chrome (sidebar, modals, etc.)
    └── js/
        ├── api.js               # fetch/auth helpers
        ├── images.js             # stock image library (Picsum)
        ├── themes.js              # theme & font registry
        ├── components.js          # the 18 section definitions + renderers
        ├── templates.js           # the 9 starter templates
        ├── export.js               # generates the standalone HTML export
        ├── builder.js               # the editor engine
        ├── dashboard.js, auth.js, landing.js, success.js
```

## How it works

- Each project stores `themeId`, `fontId` and a list of `sections`, where each
  section is `{ id, type, data, style }`. `type` maps to an entry in
  `components.js`, `data` holds the editable text/images, and `style` holds
  background/padding/alignment.
- The builder canvas and the final exported HTML render sections using the
  **same** `render(data)` functions and the same `themes.css` /
  `components.css`, so what you see in the editor matches the download.
- Exporting strips the editor-only `contenteditable` and `data-edit`
  attributes and inlines the stylesheets + Google Fonts link into one
  standalone `.html` file.

## Notes

- Replace the Picsum placeholder images (`public/js/images.js`) with your own
  hosted images before using exported sites in production.
- `JWT_SECRET` defaults to a dev value — set a strong random secret in `.env`
  for any real deployment.
