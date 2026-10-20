/**
 * Central configuration for the AI Pomodoro App.
 *
 * 1. GOOGLE_FEEDBACK_FORM_URL:
 *    Paste your public Google Form link here (e.g. "https://docs.google.com/forms/d/e/.../viewform").
 *    When set, clicking "Open Google Form" in the Feedback Modal will open your form directly,
 *    or embed it if `?embedded=true` is supported.
 *
 * 2. GOOGLE_SIGNIN_WEBHOOK_URL:
 *    Optional Google Apps Script Web App URL or Formspree endpoint to automatically record
 *    every user's Nickname, Gmail, and chosen Theme in your Google Sheet.
 */
export const APP_CONFIG = {
  // Paste your Google Form URL here when ready:
  GOOGLE_FEEDBACK_FORM_URL: '',

  // Optional webhook / Google Apps Script URL to log new user sign-ins (Nickname + Gmail + Theme):
  USER_TRACKING_WEBHOOK_URL: '',

  // Starting Power Level & Task Reward Constants
  INITIAL_POWER_LEVEL: 0,
  POWER_PER_TASK: 1000,
  POWER_PER_POMODORO: 1000,
  OVER_9000_THRESHOLD: 9000,
};
