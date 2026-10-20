/**
 * Central configuration for Focus Arena — AI Pomodoro App by Ammar Akhund.
 */
export const APP_CONFIG = {
  // Creator & Owner Branding
  OWNER_NAME: 'Ammar Akhund',
  OWNER_HANDLE: '@xakhundx',
  OWNER_EMAIL: 'ammar.akhund2017@gmail.com',
  OWNER_LINKEDIN_URL: 'https://linkedin.com/in/ammar-akhund-145b17245/',
  OWNER_GITHUB_URL: 'https://github.com/xakhundx',

  // Google Form URL for external feedback (can also be set in-app by Owner):
  GOOGLE_FEEDBACK_FORM_URL: '',

  // Google Apps Script Web App URL for:
  // 1) Automated "Welcome by Ammar Akhund" email to new Gmail sign-ins
  // 2) Logging active users & feedback directly to your Google Sheet & emailing you
  USER_TRACKING_WEBHOOK_URL: '',

  // Stripe Payment Link or LemonSqueezy URL for Pro Tier ($2.99/mo)
  PRO_CHECKOUT_URL: '',
  PRO_PRICE_DISPLAY: '$2.99 / month',

  // Starting Power Level & Task Reward Constants
  INITIAL_POWER_LEVEL: 0,
  POWER_PER_TASK: 1000,
  POWER_PER_POMODORO: 1000,
  OVER_9000_THRESHOLD: 9000,
};
