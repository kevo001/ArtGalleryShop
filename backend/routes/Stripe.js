const express = require("express");
const router  = express.Router();
const Stripe  = require("stripe");
const stripe  = Stripe(process.env.STRIPE_SECRET_KEY);

const DOMAIN = "https://galleriedwin.onrender.com";

// Full ISO list for “allow all countries”
const ALL_COUNTRIES = [
  /* … your array of ["AF","AX","AL",…,"ZW"] … */
];

// Paste your real rate IDs here (strings!)
const SHIPPING_RATE_NORWAY        = "shr_1RLMBARbO64x4m079gyCOI1H";
const SHIPPING_RATE_INTERNATIONAL = "shr_1RLM5oRbO64x4m07MvMDPu72";

router.post("/create-checkout-session", async (req, res) => {
  const { cart } = req.body;
  if (!Array.isArray(cart)) {
    return res.status(400).json({ error: "Invalid cart data" });
  }

  // Simplify & encode cart for cancel URL / webhooks if needed
  const simplified = cart.map(i => ({
    _id:      i._id,
    title:    i.title,
    quantity: i.quantity,
    price:    i.price,
    imageUrl: i.imageUrl,
  }));
  const cartJson  = JSON.stringify(simplified);
  const cartParam = encodeURIComponent(cartJson);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      // 1) Collect addresses from *any* country
      shipping_address_collection: {
        allowed_countries: ALL_COUNTRIES
      },

      // 2) Offer your two pre-created rates
      shipping_options: [
        { shipping_rate: SHIPPING_RATE_NORWAY        },
        { shipping_rate: SHIPPING_RATE_INTERNATIONAL }
      ],

      line_items: cart.map(item => ({
        price_data: {
          currency:    "nok",
          product_data:{ name: item.title },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),

      metadata: { cart: cartJson },

      success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${DOMAIN}/order-summary?cart=${cartParam}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
