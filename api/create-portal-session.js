/**
 * Vercel Serverless Function: Create a Stripe Billing Portal session
 * Allows Pro subscribers to cancel or update their payment method in 1 click.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({ error: 'STRIPE_SECRET_KEY not configured.' });
  }

  try {
    const { email, returnUrl } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required to open Billing Portal.' });

    const customerSearch = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const customers = await customerSearch.json();
    const customerId = customers?.data?.[0]?.id;

    if (!customerId) {
      return res.status(404).json({ error: 'No Stripe subscription found for this email.' });
    }

    const params = new URLSearchParams();
    params.append('customer', customerId);
    params.append('return_url', returnUrl || req.headers.origin || 'https://focusarena.app');

    const portalRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const portalData = await portalRes.json();
    if (!portalRes.ok) {
      return res.status(portalRes.status).json({ error: portalData.error?.message || 'Portal error' });
    }

    return res.status(200).json({ url: portalData.url });
  } catch (err) {
    console.error('Stripe portal error:', err);
    return res.status(500).json({ error: 'Unable to open Stripe Billing Portal.' });
  }
}
