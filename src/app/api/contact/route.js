import { NextResponse } from 'next/server';
import { sendContactEmail, isEmailConfigured } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getSupabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Rate limiting check
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many messages submitted from your connection. Please wait 10 minutes before trying again.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { name, email, subject, message, website, honeypot } = body;

    // Honeypot spam check
    if (website || honeypot) {
      return NextResponse.json({
        success: true,
        message: 'Message received.',
      });
    }

    // Required fields check
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedSubject = subject?.trim();
    const trimmedMessage = message?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return NextResponse.json(
        { success: false, error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    if (trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must not exceed 100 characters.' },
        { status: 400 }
      );
    }

    if (trimmedSubject.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Subject must not exceed 200 characters.' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 3000) {
      return NextResponse.json(
        { success: false, error: 'Message must not exceed 3,000 characters.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Determine destination email
    const destinationEmail =
      process.env.CONTACT_TO_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'developer@example.com';

    // Optional DB logging
    try {
      const supabase = getSupabase();
      if (supabase) {
        Promise.race([
          supabase.from('contact_messages').insert({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('DB logging timed out')), 1500)
          ),
        ]).catch(() => {
          // Gracefully caught
        });
      }
    } catch {
      // Ignored
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: `Email service is not configured (missing RESEND_API_KEY). Direct inquiries can be sent to ${destinationEmail}.`,
        },
        { status: 503 }
      );
    }

    const emailResult = await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      recipientEmail: destinationEmail,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || 'Failed to deliver email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
    });
  } catch (err) {
    console.error('API /api/contact error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while sending message.' },
      { status: 500 }
    );
  }
}
