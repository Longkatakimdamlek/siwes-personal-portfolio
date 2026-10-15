import { Resend } from 'resend';

/**
 * Checks if the Resend email service is properly configured.
 * @returns {boolean}
 */
export function isEmailConfigured() {
  const key = process.env.RESEND_API_KEY;
  return Boolean(key && !key.includes('placeholder') && key.trim().length > 5);
}

/**
 * Generates an accessible, clean HTML email template for portfolio inquiries.
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.subject
 * @param {string} params.message
 * @param {string} params.date
 * @returns {string} HTML string
 */
export function generateContactEmailHtml({ name, email, subject, message, date }) {
  // Escape HTML entities to prevent formatting injection in email clients
  const escapeHtml = (str) =>
    (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Inquiry: ${safeSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0e15; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0d0e15; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #161824; border: 1px solid #2d3148; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 24px 28px; text-align: left;">
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #ddd6fe; display: block; margin-bottom: 6px;">
                Portfolio Contact Notification
              </span>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                New Inquiry Received
              </h1>
            </td>
          </tr>

          <!-- Metadata Box -->
          <tr>
            <td style="padding: 24px 28px 12px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1f2233; border: 1px solid #2d3148; border-radius: 8px; padding: 16px;">
                <tr>
                  <td style="padding: 6px 12px; font-size: 13px; color: #94a3b8; width: 90px; vertical-align: top;">
                    <strong>Sender:</strong>
                  </td>
                  <td style="padding: 6px 12px; font-size: 14px; color: #ffffff; font-weight: 600;">
                    ${safeName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 13px; color: #94a3b8; vertical-align: top;">
                    <strong>Email:</strong>
                  </td>
                  <td style="padding: 6px 12px; font-size: 14px; color: #a78bfa;">
                    <a href="mailto:${safeEmail}" style="color: #a78bfa; text-decoration: none; font-weight: 600;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 13px; color: #94a3b8; vertical-align: top;">
                    <strong>Subject:</strong>
                  </td>
                  <td style="padding: 6px 12px; font-size: 14px; color: #f1f5f9;">
                    ${safeSubject}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 13px; color: #94a3b8; vertical-align: top;">
                    <strong>Received:</strong>
                  </td>
                  <td style="padding: 6px 12px; font-size: 13px; color: #cbd5e1;">
                    ${date}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 12px 28px 24px 28px;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin: 0 0 10px 0;">
                Message Content
              </h2>
              <div style="background-color: #12131d; border: 1px solid #282b3d; border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: normal;">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <!-- Quick Action Button -->
          <tr>
            <td style="padding: 0 28px 24px 28px;" align="center">
              <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subject)}" style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 26px; border-radius: 6px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);">
                Reply Directly to ${safeName}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #232638; padding: 18px 28px; text-align: center; font-size: 12px; color: #64748b; background-color: #12131d;">
              <p style="margin: 0 0 4px 0;">
                This inquiry was delivered via your SIWES Developer Portfolio contact system.
              </p>
              <p style="margin: 0;">
                Visitor's reply-to address is set to <strong>${safeEmail}</strong>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates plain-text alternative of the email.
 * @param {object} params
 * @returns {string}
 */
export function generateContactEmailText({ name, email, subject, message, date }) {
  return `
NEW PORTFOLIO CONTACT INQUIRY
=============================

Sender:   ${name}
Email:    ${email}
Subject:  ${subject}
Date:     ${date}

MESSAGE:
-----------------------------
${message}

-----------------------------
Reply directly to this email to respond to ${name} (${email}).
Sent via SIWES Developer Portfolio contact form.
`.trim();
}

/**
 * Sends a contact inquiry email through Resend.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.subject
 * @param {string} params.message
 * @param {string} [params.recipientEmail]
 * @returns {Promise<{ success: boolean, data?: object, error?: string, missingConfig?: boolean }>}
 */
export async function sendContactEmail({ name, email, subject, message, recipientEmail }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!isEmailConfigured()) {
    console.warn('[Contact System] RESEND_API_KEY is not configured or is a placeholder.');
    return {
      success: false,
      missingConfig: true,
      error:
        'Email delivery provider is not configured yet. Please configure the RESEND_API_KEY environment variable.',
    };
  }

  try {
    const resend = new Resend(apiKey);

    // Sender: Must be either a verified domain address or onboarding@resend.dev for test mode
    const fromAddress =
      process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    // Destination: Priority is explicit parameter, then CONTACT_TO_EMAIL, then ADMIN_EMAIL
    const toAddress =
      recipientEmail ||
      process.env.CONTACT_TO_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'developer@example.com';

    const nowFormatted = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium',
    }) + ' UTC';

    const htmlContent = generateContactEmailHtml({
      name,
      email,
      subject,
      message,
      date: nowFormatted,
    });

    const textContent = generateContactEmailText({
      name,
      email,
      subject,
      message,
      date: nowFormatted,
    });

    const emailPayload = {
      from: fromAddress,
      to: [toAddress],
      replyTo: email, // Resend SDK uses camelCase replyTo (or reply_to)
      subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
      html: htmlContent,
      text: textContent,
    };

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error('[Resend Error]', error);
      return {
        success: false,
        error: error.message || 'Failed to send email via Resend.',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error('[sendContactEmail Exception]', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while sending the message.',
    };
  }
}
