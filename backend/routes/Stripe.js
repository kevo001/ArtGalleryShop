const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { cart } = req.body;

  if (!cart || !Array.isArray(cart)) {
    return res.status(400).json({ error: "Invalid cart data" });
  }

  // 1. Strip down cart for metadata
  const simplifiedCart = cart.map(item => ({
    title: item.title,
    quantity: item.quantity,
    price: item.price,
  }));

  const cartMeta = JSON.stringify(simplifiedCart);

  if (cartMeta.length > 500) {
    console.warn("⚠️ Cart metadata too long. Consider trimming further:", cartMeta);
  }

  try {
    // 2. Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cart.map(item => ({
        price_data: {
          currency: 'nok',
          product_data: {
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ['NO'],
      },
      metadata: {
        cart: cartMeta,
      },
      success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get Stripe session details (for success page)
router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id, {
      expand: ["customer_details"],
    });

    const cart = JSON.parse(session.metadata?.cart || "[]");

    res.json({
      orderNumber: session.id,
      customerName: session.customer_details?.name,
      email: session.customer_details?.email,
      address: session.customer_details?.address,
      cart,
      totalAmount: session.amount_total / 100,
    });
  } catch (err) {
    console.error("❌ Failed to fetch session:", err);
    res.status(500).json({ error: "Failed to retrieve session data" });
  }
});

module.exports = router;
