/**
 * Vercel Serverless Function: Create a verified Stripe Checkout Session ($1.99/mo or $14.99/yr)
 * Supports Cards, Apple Pay, Google Pay & Stripe Link automatically.
 *
 * Required Vercel Environment Variables:
 * - STRIPE_SECRET_KEY (sk_live_... or sk_test_...)
 * - STRIPE_PRICE_MONTHLY (price_... for $1.99/month recurring)
 * - STRIPE_PRICE_ANNUAL (price_... for $14.99/year recurring)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({
      error: 'Stripe server checkout is not configured yet. Set STRIPE_SECRET_KEY in Vercel.',
    });
  }

  try {
    const { plan = 'monthly', email, visitorId, returnUrl } = req.body || {};
    const priceId =
      plan === 'annual' ? process.env.STRIPE_PRICE_ANNUAL : process.env.STRIPE_PRICE_MONTHLY;

    if (!priceId) {
      return res.status(503).json({
        error: `Missing Stripe price ID for ${plan} plan in Vercel environment variables.`,
      });
    }

    const baseUrl = (returnUrl || req.headers.origin || 'https://focusarena.app').replace(/\/$/, '');
    const params = new URLSearchParams();
    params.append('mode', 'subscription');
    params.append('line_items[0][price]', priceId);
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', `${baseUrl}/?pro=success&session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${baseUrl}/?pro=cancelled`);
    params.append('allow_promotion_codes', 'true');
    if (email && email.includes('@')) {
      params.append('customer_email', email);
    }
    if (visitorId) {
      params.append('client_reference_id', visitorId);
      params.append('metadata[visitorId]', visitorId);
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();
    if (!stripeRes.ok) {
      return res.status(stripeRes.status).json({ error: data.error?.message || 'Stripe error' });
    }

    return res.status(200).json({ url: data.url, sessionId: data.id });
  } catch (err) {
    console.error('Stripe checkout creation failed:', err);
    return res.status(500).json({ error: 'Unable to initialize Stripe Checkout.' });
  }
}
