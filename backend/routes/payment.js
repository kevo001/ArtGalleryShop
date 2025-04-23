// server.js eller routes/payment.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // fra .env

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Beløp i øre – f.eks. 5000 = 50 kr

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'nok',
      automatic_payment_methods: { enabled: true }, // smart håndtering av kort + Apple Pay etc.
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;