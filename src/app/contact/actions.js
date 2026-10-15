'use server';

import { headers } from 'next/headers';
import { sendContactEmail, isEmailConfigured } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getSupabase } from '@/lib/supabase';

/**
 * Validates and sanitizes contact form fields.
 * @param {object} data
 * @returns {{ errors: object, isValid: boolean, sanitized: object }}
 */
function validateContactData(data) {
  const errors = {};
  const sanitized = {};

  // 1. Full Name
  const rawName = (data.name || '').trim();
  if (!rawName) {
    errors.name = 'Full name is required.';
  } else if (rawName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (rawName.length > 100) {
    errors.name = 'Name must not exceed 100 characters.';
  } else {
    sanitized.name = rawName;
  }

  // 2. Email Address
  const rawEmail = (data.email || '').trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!rawEmail) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(rawEmail)) {
    errors.email = 'Please provide a valid email address (e.g. name@domain.com).';
  } else if (rawEmail.length > 150) {
    errors.email = 'Email address must not exceed 150 characters.';
  } else {
    sanitized.email = rawEmail;
  }

  // 3. Subject
  const rawSubject = (data.subject || '').trim();
  if (!rawSubject) {
    errors.subject = 'Subject is required.';
  } else if (rawSubject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  } else if (rawSubject.length > 200) {
    errors.subject = 'Subject must not exceed 200 characters.';
  } else {
    sanitized.subject = rawSubject;
  }

  // 4. Message
  const rawMessage = (data.message || '').trim();
  if (!rawMessage) {
    errors.message = 'Message content is required.';
  } else if (rawMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  } else if (rawMessage.length > 3000) {
    errors.message = 'Message must not exceed 3,000 characters.';
  } else {
    sanitized.message = rawMessage;
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    sanitized,
  };
}

/**
 * Server Action for sending contact messages.
 * Handles validation, honeypot protection, rate limiting, and email dispatch.
 *
 * @param {object} payload
 * @returns {Promise<{ success: boolean, message?: string, errors?: object, error?: string, configured?: boolean }>}
 */
export async function sendContactMessageAction(payload) {
  try {
    // 1. Retrieve client IP for rate limiting
    const headerList = await headers();
    const forwarded = headerList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 2. Honeypot check (Spam protection)
    // If the hidden field is filled, silently return success without sending
    if (payload.website || payload.honeypot) {
      console.warn('[Contact Spam] Honeypot triggered by IP:', ip);
      return {
        success: true,
        message: 'Thank you! Your message has been received.',
      };
    }

    // 3. Rate limiting check
    if (checkRateLimit(ip)) {
      return {
        success: false,
        error:
          'Too many messages submitted from your connection. Please wait 10 minutes before trying again.',
      };
    }

    // 4. Server-side validation
    const { errors, isValid, sanitized } = validateContactData(payload);
    if (!isValid) {
      return {
        success: false,
        errors,
        error: 'Please correct the highlighted errors before submitting.',
      };
    }

    // 5. Determine target destination email address (prioritizing env vars, then fallback)
    const destinationEmail =
      process.env.CONTACT_TO_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'developer@example.com';

    // 6. Optional database logging (if Supabase is available and table exists)
    try {
      const supabase = getSupabase();
      if (supabase) {
        // Guard with short timeout so placeholder or unreachable database never delays email processing
        Promise.race([
          supabase.from('contact_messages').insert({
            name: sanitized.name,
            email: sanitized.email,
            subject: sanitized.subject,
            message: sanitized.message,
            ip_address: ip,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('DB logging timed out')), 1500)
          ),
        ]).catch((dbErr) => {
          console.warn('[Contact Action] DB logging skipped:', dbErr.message);
        });
      }
    } catch (dbErr) {
      // Safe catch: DB logging failure should never abort email delivery
      console.warn('[Contact Action] DB logging skipped:', dbErr.message);
    }

    // 7. Check if email provider is configured
    if (!isEmailConfigured()) {
      console.warn('[Contact Action] RESEND_API_KEY is not configured.');
      return {
        success: false,
        configured: false,
        error: `The automated email delivery service is currently not configured (missing RESEND_API_KEY). Please contact me directly at ${destinationEmail}.`,
      };
    }

    // 8. Send the email via Resend
    const emailResult = await sendContactEmail({
      name: sanitized.name,
      email: sanitized.email,
      subject: sanitized.subject,
      message: sanitized.message,
      recipientEmail: destinationEmail,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error:
          emailResult.error ||
          'Failed to deliver email through provider. Please reach out directly via email.',
      };
    }

    return {
      success: true,
      message:
        'Thank you for reaching out! Your message has been sent successfully, and I will reply to you shortly.',
    };
  } catch (err) {
    console.error('[sendContactMessageAction Exception]', err);
    return {
      success: false,
      error: 'An unexpected system error occurred while processing your message. Please try again later.',
    };
  }
}
