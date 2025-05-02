// routes/stripeWebhook.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const Order   = require('../models/Order');
const Counter = require('../models/Counter');

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // 1) Verify signature & parse the raw body
  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      endpointSecret
    );
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2) Only handle the events you care about
  if (event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;

    // Build order data
    const customerName = session.customer_details?.name || 'Ukjent kunde';
    const email        = session.customer_details?.email;
    const address      = session.customer_details?.address || {};
    let   cart         = [];
    try { cart = JSON.parse(session.metadata?.cart || '[]'); }
    catch { console.warn('⚠️  Could not parse cart metadata'); }
    const totalAmount  = session.amount_total / 100;
    const date         = new Date().toLocaleDateString('no-NO');

    // Generate auto-incrementing order number
    let orderNumber;
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'order' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      orderNumber = `ORD-${counter.value}`;
    } catch (err) {
      console.error('❌ Failed to get order counter:', err);
      return res.status(500).end();
    }

    // Save the order
    try {
      await Order.create({
        orderNumber,
        customerName,
        email,
        address,
        cart,
        status: 'Under behandling',
        date,
        totalAmount,
      });
      console.log('✅ Order saved:', orderNumber);
    } catch (err) {
      console.error('❌ Failed to save order:', err);
      // we still return 200 so Stripe won’t retry forever
    }
  }

  // 3) Always respond 200 to acknowledge receipt
  res.status(200).json({ received: true });
};
