/**
 * Central configuration for Focus Arena — AI Pomodoro Workspace by Ammar Akhund.
 */
export const APP_CONFIG = {
  // Creator & Owner Branding
  OWNER_NAME: 'Ammar Akhund',
  OWNER_HANDLE: '@xakhundx',
  OWNER_EMAIL: 'ammar.akhund2017@gmail.com',
  OWNER_LINKEDIN_URL: 'https://linkedin.com/in/ammar-akhund-145b17245/',
  OWNER_GITHUB_URL: 'https://github.com/xakhundx',

  // Google Form URL for external feedback (can also be set in-app by Owner)
  GOOGLE_FEEDBACK_FORM_URL: '',

  // Optional Google Apps Script Web App URL for anonymous/user activity & feedback logging
  USER_TRACKING_WEBHOOK_URL: '',

  // Privacy-First Anonymous Product Analytics (PostHog — tracks active users without requiring email)
  // Get a free key at https://posthog.com and paste it here (or set VITE_POSTHOG_KEY in Vercel)
  POSTHOG_KEY: '',
  POSTHOG_HOST: 'https://us.i.posthog.com',

  // Stripe Checkout & Billing Portal Configuration
  // 1) For GitHub Pages / zero-backend: paste your Stripe Payment Links (https://buy.stripe.com/...)
  // 2) For Vercel Serverless: set STRIPE_SECRET_KEY + STRIPE_PRICE_MONTHLY + STRIPE_PRICE_ANNUAL in Vercel env
  PRO_CHECKOUT_URL: '',
  PRO_ANNUAL_CHECKOUT_URL: '',
  STRIPE_BILLING_PORTAL_URL: '',
  PRO_PRICE_DISPLAY: '$1.99 / month',
  PRO_ANNUAL_PRICE_DISPLAY: '$14.99 / year',

  // Starting Power Level & Task Reward Constants
  INITIAL_POWER_LEVEL: 0,
  POWER_PER_TASK: 1000,
  POWER_PER_POMODORO: 1000,
  OVER_9000_THRESHOLD: 9000,
};
