const express = require('express');
const Stripe = require('stripe');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const PRICE_CENTS = parseInt(process.env.DOWNLOAD_PRICE_CENTS || '2900', 10);
const PRICE_LABEL = process.env.DOWNLOAD_PRICE_LABEL || '$29.00';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4000';

function stripeConfigured(res) {
  if (!stripe) {
    res.status(503).json({
      error:
        'Stripe is not configured. Add STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY and STRIPE_WEBHOOK_SECRET to your .env file (see .env.example).',
    });
    return false;
  }
  return true;
}

// GET /api/payments/config - public config for the client (publishable key + price)
router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    priceCents: PRICE_CENTS,
    priceLabel: PRICE_LABEL,
    configured: !!stripe,
  });
});

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  if (!stripeConfigured(res)) return;

  const { projectId } = req.body || {};
  const project = db.find('projects', (p) => p.id === projectId && p.userId === req.user.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (project.paid) {
    return res.json({ alreadyPaid: true });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Website export: ${project.name}`,
              description: 'Unlock the final HTML download for this website design.',
            },
            unit_amount: PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        projectId: project.id,
        userId: req.user.id,
      },
      success_url: `${CLIENT_URL}/success.html?project=${project.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/builder.html?project=${project.id}&checkout=cancelled`,
    });

    db.update('projects', project.id, { stripeSessionId: session.id });
    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Stripe checkout session error:', err.message);
    res.status(500).json({ error: 'Unable to create checkout session', details: err.message });
  }
});

// GET /api/payments/status/:projectId - check (and lazily verify) payment status
router.get('/status/:projectId', requireAuth, async (req, res) => {
  const project = db.find(
    'projects',
    (p) => p.id === req.params.projectId && p.userId === req.user.id
  );
  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (!project.paid && project.stripeSessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(project.stripeSessionId);
      if (session.payment_status === 'paid') {
        const updated = db.update('projects', project.id, { paid: true });
        return res.json({ paid: true, project: updated });
      }
    } catch (err) {
      // ignore lookup errors, fall through to current status
    }
  }

  res.json({ paid: !!project.paid, project });
});

// POST /api/payments/dev-mark-paid
// Only available while Stripe is NOT configured. Lets you test the full
// "pay then download" flow locally before you've added real Stripe keys.
router.post('/dev-mark-paid', requireAuth, (req, res) => {
  if (stripe) {
    return res.status(403).json({ error: 'Stripe is configured; complete a real checkout instead.' });
  }
  const { projectId } = req.body || {};
  const project = db.find('projects', (p) => p.id === projectId && p.userId === req.user.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const updated = db.update('projects', project.id, { paid: true });
  res.json({ paid: true, project: updated });
});

// NOTE: the Stripe webhook (POST /api/payments/webhook) is handled separately
// in server.js via webhookHandler.js, because it needs the raw request body.

module.exports = router;
