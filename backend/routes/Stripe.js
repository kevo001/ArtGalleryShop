// routes/stripe.js eller lignende
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { cart } = req.body;

  const line_items = cart.map((item) => ({
    price_data: {
      currency: 'nok',
      product_data: {
        name: item.title,
      },
      unit_amount: item.price * 100, // kr -> øre
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/OrderSummary',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Stripe error' });
  }
});

module.exports = router;
