const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const Order = require("../models/Order");
const Counter = require("../models/Counter");

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
      return res.status(400).send("Webhook Error");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const customerName = session.customer_details?.name || "Ukjent kunde";
      const email = session.customer_details?.email;
      const address = session.customer_details?.address || {};
      const cart = JSON.parse(session.metadata?.cart || "[]");
      const totalAmount = session.amount_total / 100;
      const date = new Date().toLocaleDateString("no-NO");

      // Generate a custom order number
      let orderNumber;
      try {
        const counter = await Counter.findOneAndUpdate(
          { name: "order" },
          { $inc: { value: 1 } },
          { new: true, upsert: true }
        );
        orderNumber = `ORD-${counter.value}`;
      } catch (err) {
        console.error("❌ Failed to generate order number:", err);
        return res.status(500).send("Failed to generate order number");
      }

      const newOrder = new Order({
        orderNumber,
        customerName,
        email,
        address,
        cart, // ⬅️ This saves what was purchased
        status: "Under behandling",
        date,
        totalAmount,
      });

      try {
        await newOrder.save();
        console.log("✅ Order saved:", orderNumber);
      } catch (err) {
        console.error("❌ Failed to save order:", err);
      }
    }

    res.status(200).end();
  }
);

module.exports = router;
