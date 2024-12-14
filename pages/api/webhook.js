import { buffer } from 'micro';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false, // Stripe wymaga przesyłania raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const signingSecret = process.env.STRIPE_SIGNING_SECRET;

  let event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    // Weryfikacja autentyczności webhooka
    event = stripe.webhooks.constructEvent(buf, sig, signingSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Obsługa różnych zdarzeń Stripe
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`✅ Payment successful! Session ID: ${session.id}`);
      // Możesz zapisać dane do bazy danych lub wysłać powiadomienie
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`✅ PaymentIntent succeeded: ${paymentIntent.id}`);
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(`❌ PaymentIntent failed: ${failedPaymentIntent.id}`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
