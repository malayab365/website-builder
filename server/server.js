require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const paymentRoutes = require('./routes/payments');
const webhookHandler = require('./webhookHandler');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Stripe webhook needs the raw body for signature verification, so this
// route is mounted BEFORE express.json() touches the request body.
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);

// Static frontend
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\nWebsite Builder Studio running at http://localhost:${PORT}\n`);
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('NOTE: Stripe is not configured yet. Copy .env.example to .env and add your keys to enable real payments.\n');
  }
});
