/**
 * ============================================================================
 * FOCUS ARENA (AI POMODORO) — GOOGLE APPS SCRIPT BACKEND BY AMMAR AKHUND
 * ============================================================================
 * HOW TO ACTIVATE IN 60 SECONDS (100% FREE):
 * 1. Go to https://sheets.google.com and create a new blank Google Sheet.
 * 2. Click Extensions -> Apps Script, paste this entire file, and click Save.
 * 3. (Optional) Select `setupGoogleForm` from the top dropdown and click "Run"
 *    once—it will automatically create a branded Google Feedback Form in your
 *    Google Drive and print its URL in the Execution Log!
 * 4. Click "Deploy" -> "New deployment" -> Type: "Web app"
 *    - Execute as: "Me (ammar.akhund2017@gmail.com)"
 *    - Who has access: "Anyone"
 * 5. Copy the Web App URL and paste it into the Owner Admin Panel in your app
 *    (or into `USER_TRACKING_WEBHOOK_URL` in `src/config/appConfig.ts`).
 * ============================================================================
 */

const OWNER_EMAIL = 'ammar.akhund2017@gmail.com';
const APP_URL = 'https://xakhundx.github.io/Ai-Pomodoro-App/';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (payload.type === 'feedback') {
      let sheet = ss.getSheetByName('Feedback') || ss.insertSheet('Feedback');
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Nickname', 'Gmail', 'Rating', 'Message']);
      }
      sheet.appendRow([
        new Date(),
        payload.nickname || 'Anonymous',
        payload.gmail || '',
        payload.rating || 5,
        payload.message || ''
      ]);

      // Email instant feedback alert to Ammar
      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: `⭐ New ${payload.rating}/5 Feedback on Focus Arena from ${payload.nickname}`,
        htmlBody: `
          <div style="font-family:Inter,sans-serif;padding:20px;background:#0f172a;color:#fff;border-radius:12px;">
            <h2 style="color:#a855f7;margin-top:0;">New User Feedback Received</h2>
            <p><strong>User:</strong> ${payload.nickname} (${payload.gmail})</p>
            <p><strong>Rating:</strong> ${'⭐'.repeat(payload.rating || 5)}</p>
            <p><strong>Message:</strong><br/>${payload.message}</p>
          </div>
        `
      });

      return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
    }

    // Default: User Sign-In Tracking + Automated Welcome Email
    let userSheet = ss.getSheetByName('ActiveUsers') || ss.insertSheet('ActiveUsers');
    if (userSheet.getLastRow() === 0) {
      userSheet.appendRow(['Timestamp', 'Nickname', 'Gmail', 'Theme Interest']);
    }
    userSheet.appendRow([
      new Date(),
      payload.nickname || 'Warrior',
      payload.gmail || '',
      payload.interestPrompt || 'Dragon Ball'
    ]);

    // Send Automated Welcome Email to the User's Gmail!
    if (payload.gmail && payload.gmail.indexOf('@') !== -1) {
      MailApp.sendEmail({
        to: payload.gmail,
        subject: `⚡ Welcome to Focus Arena (AI Pomodoro) by Ammar Akhund!`,
        htmlBody: `
          <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#090d16;color:#f8fafc;border-radius:16px;border:1px solid #334155;">
            <h1 style="color:#a855f7;margin-top:0;">Welcome to Focus Arena, ${payload.nickname}! ⚡</h1>
            <p style="font-size:15px;line-height:1.6;color:#cbd5e1;">
              Thank you for signing in and using the <strong>AI Pomodoro & Focus Arena</strong> web application created by <strong>Ammar Akhund</strong>!
            </p>
            <p style="font-size:15px;line-height:1.6;color:#cbd5e1;">
              Your custom <strong>${payload.interestPrompt || 'Dragon Ball'}</strong> workspace is ready. Complete tasks to earn <strong>+1,000 Power</strong> each and unlock the legendary <strong>9,000 Milestone</strong>!
            </p>
            <div style="margin:24px 0;">
              <a href="${APP_URL}" style="background:linear-gradient(135deg,#a855f7,#3b82f6);color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block;">
                🚀 Launch Your Focus Arena
              </a>
            </div>
            <p style="font-size:14px;line-height:1.5;color:#94a3b8;">
              We truly appreciate your feedback! Reply directly to this email or click the <strong>💬 Feedback</strong> button inside the app anytime to share your thoughts or theme requests.
            </p>
            <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
            <p style="font-size:12px;color:#64748b;margin:0;">
              Built by <strong>Ammar Akhund</strong> •
              <a href="https://linkedin.com/in/ammar-akhund-145b17245/" style="color:#38bdf8;">LinkedIn</a> •
              <a href="https://github.com/xakhundx" style="color:#38bdf8;">GitHub</a>
            </p>
          </div>
        `
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Run this function once in Apps Script to automatically create a Google Form for Feedback!
 */
function setupGoogleForm() {
  const form = FormApp.create('Focus Arena (AI Pomodoro by Ammar Akhund) — User Feedback');
  form.setDescription('Thank you for using Focus Arena by Ammar Akhund! Share your feedback, theme requests, and feature ideas below.');
  form.addTextItem().setTitle('Your Nickname').setRequired(false);
  form.addScaleItem().setTitle('How would you rate Focus Arena?').setBounds(1, 5).setLabels('Needs Work', 'Amazing (Over 9000!)').setRequired(true);
  form.addParagraphTextItem().setTitle('What themes, personas, or features would you love to see next?').setRequired(true);
  Logger.log('GOOGLE FORM PUBLISHED URL: ' + form.getPublishedUrl());
}
