const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // from .env

// ✅ Create a PaymentIntent
router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount in øre, e.g. 5000 = 50 NOK

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'nok',
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
