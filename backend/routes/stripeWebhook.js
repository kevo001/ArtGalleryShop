const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const Order = require("../models/Order");

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`❌ Webhook error: ${err.message}`);
      return res.status(400).send(`Webhook Error`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Optional fallback if name is missing
      const customerName = session.customer_details?.name || "Ukjent";

      const newOrder = new Order({
        orderNumber: session.id,
        customerName,
        status: "Under behandling", // default value
        date: new Date().toLocaleDateString("no-NO"), // or you can format your way
        totalAmount: session.amount_total / 100, // from øre to kr
      });

      try {
        await newOrder.save();
        console.log("✅ Order saved:", newOrder);
      } catch (err) {
        console.error("❌ Failed to save order:", err);
      }
    }

    res.status(200).end();
  }
);

module.exports = router;
