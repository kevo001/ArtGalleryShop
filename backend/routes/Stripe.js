const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { cart } = req.body;
  if (!Array.isArray(cart)) {
    return res.status(400).json({ error: "Invalid cart data" });
  }

  // Prepare metadata with _id and imageUrl as well
  const simplified = cart.map(i => ({
    _id:      i._id,
    title:    i.title,
    quantity: i.quantity,
    price:    i.price,
    imageUrl: i.imageUrl,    // carry over so you can render it later
  }));
  const cartJson = JSON.stringify(simplified);
  const cartB64  = Buffer.from(cartJson).toString("base64");

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.map(item => ({
        price_data: {
          currency: "nok",
          product_data: { name: item.title },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: { allowed_countries: ["NO"] },
      metadata: { cart: cartJson },
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: `http://localhost:5173/order-summary?cart=${cartB64}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id, {
      expand: ["customer_details"],
    });

    // We stored the full metadata JSON here, so parse it
    const cart = JSON.parse(session.metadata?.cart || "[]");

    res.json({
      orderNumber:   session.id,
      customerName:  session.customer_details?.name,
      email:         session.customer_details?.email,
      address:       session.customer_details?.address,
      cart,  // now includes _id, title, quantity, price, imageUrl
      totalAmount:   session.amount_total / 100,
    });
  } catch (err) {
    console.error("❌ Failed to fetch session:", err);
    res.status(500).json({ error: "Failed to retrieve session data" });
  }
});

module.exports = router;
