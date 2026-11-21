/**
 * Vercel Serverless Function: Verify Stripe Checkout Session or Webhook
 * Supports verifying a paid session_id cleanly after redirect from Stripe Checkout.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Stripe-Signature');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({ verified: false, error: 'STRIPE_SECRET_KEY not configured.' });
  }

  // Client-side post-checkout session verification: GET /api/stripe-webhook?session_id=cs_...
  if (req.method === 'GET') {
    const sessionId = req.query?.session_id;
    if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return res.status(400).json({ verified: false, error: 'Invalid session_id' });
    }
    try {
      const stripeRes = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
        { headers: { Authorization: `Bearer ${secretKey}` } }
      );
      const session = await stripeRes.json();
      const paid =
        stripeRes.ok &&
        (session.payment_status === 'paid' || session.status === 'complete');

      return res.status(200).json({
        verified: paid,
        email: session.customer_details?.email || session.customer_email || null,
        visitorId: session.client_reference_id || null,
      });
    } catch (err) {
      console.error('Stripe session verification failed:', err);
      return res.status(500).json({ verified: false });
    }
  }

  // Webhook event receiver (extend with Supabase DB sync when ready)
  if (req.method === 'POST') {
    return res.status(200).json({ received: true });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
