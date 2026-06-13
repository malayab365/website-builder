const Stripe = require('stripe');
const db = require('./db');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// Handles POST /api/payments/webhook. Must receive the RAW request body
// (express.raw) so the Stripe signature can be verified.
module.exports = function webhookHandler(req, res) {
  if (!stripe) return res.status(503).send('Stripe not configured');

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // No webhook secret configured (dev mode) - parse body directly.
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const projectId = session.metadata && session.metadata.projectId;
    if (projectId) {
      const project = db.find('projects', (p) => p.id === projectId);
      if (project) {
        db.update('projects', projectId, { paid: true, stripeSessionId: session.id });
      }
    }
  }

  res.json({ received: true });
};
