import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 4900, // $49.00 AUD in cents
      currency: "aud",
      metadata: {
        businessName: req.body.businessName || "",
        url: req.body.url || "",
      },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
