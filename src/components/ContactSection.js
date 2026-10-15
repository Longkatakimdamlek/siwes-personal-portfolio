'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  GitBranch,
  Globe,
  MessageCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { sendContactMessageAction } from '@/app/contact/actions';
import styles from './ContactSection.module.css';

export default function ContactSection({ siteSettings, profile }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // Honeypot field for bot spam prevention
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isMissingConfig, setIsMissingConfig] = useState(false);

  const contactEmail = siteSettings?.contact_email || 'developer@example.com';
  const phoneNumber = siteSettings?.phone_number || '+234 800 123 4567';
  const location = profile?.location || 'Nigeria';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (serverError) setServerError('');
    if (isMissingConfig) setIsMissingConfig(false);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name cannot exceed 100 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required.';
    } else if (formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters.';
    } else if (formData.subject.trim().length > 200) {
      errors.subject = 'Subject cannot exceed 200 characters.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message content is required.';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    } else if (formData.message.trim().length > 3000) {
      errors.message = 'Message cannot exceed 3,000 characters.';
    }

    return errors;
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '',
    });
    setFieldErrors({});
    setServerError('');
    setIsMissingConfig(false);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check offline connectivity first
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setServerError(
        'You are currently offline. Please reconnect to the internet to send your message. Your entered details have been saved.'
      );
      return;
    }

    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setServerError('Please review and fix the highlighted fields.');
      return;
    }

    setIsSubmitting(true);
    setServerError('');
    setIsMissingConfig(false);

    try {
      const response = await sendContactMessageAction(formData);

      if (response.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          website: '',
        });
        setFieldErrors({});
      } else {
        setServerError(response.error || 'Failed to deliver message. Please try again.');
        if (response.errors) {
          setFieldErrors(response.errors);
        }
        if (response.configured === false) {
          setIsMissingConfig(true);
        }
      }
    } catch (err) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setServerError(
          'Network connection lost while sending. Please reconnect and submit your message again.'
        );
      } else {
        setServerError(err.message || 'A network error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.sectionKicker}>05. Reach Out</div>
          <h2 className={styles.title}>Let&apos;s Build Something Great</h2>
          <p className={styles.subtitle}>
            Have an open software project, industrial internship opportunity, or technical inquiry?
            Feel free to send a message using the form below or connect through direct contact
            channels.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Direct Contact Info */}
          <div className={styles.infoColumn}>
            <div className={styles.contactCard}>
              <h3 className={styles.infoTitle}>Contact Details</h3>
              <p className={styles.infoDesc}>
                Open to discuss software engineering roles, SIWES industrial training opportunities,
                and technical collaborations. Messages sent through the form are routed directly to
                my inbox.
              </p>

              <div className={styles.channelsList}>
                <a href={`mailto:${contactEmail}`} className={styles.channelItem}>
                  <div className={styles.channelIconBox}>
                    <Mail size={18} aria-hidden="true" />
                  </div>
                  <div className={styles.channelInfo}>
                    <span className={styles.channelLabel}>Email Address</span>
                    <span className={styles.channelValue}>{contactEmail}</span>
                  </div>
                </a>

                {phoneNumber && (
                  <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className={styles.channelItem}>
                    <div className={styles.channelIconBox}>
                      <Phone size={18} aria-hidden="true" />
                    </div>
                    <div className={styles.channelInfo}>
                      <span className={styles.channelLabel}>Phone / WhatsApp</span>
                      <span className={styles.channelValue}>{phoneNumber}</span>
                    </div>
                  </a>
                )}

                <div className={styles.channelItemStatic}>
                  <div className={styles.channelIconBox}>
                    <MapPin size={18} aria-hidden="true" />
                  </div>
                  <div className={styles.channelInfo}>
                    <span className={styles.channelLabel}>Base Location</span>
                    <span className={styles.channelValue}>{location}</span>
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className={styles.socialSection}>
                <h4 className={styles.socialHeading}>Professional Networks</h4>
                <div className={styles.socialRow}>
                  {siteSettings?.github_url && (
                    <a
                      href={siteSettings.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBtn}
                      aria-label="GitHub Profile"
                    >
                      <GitBranch size={18} />
                      <span>GitHub</span>
                    </a>
                  )}

                  {siteSettings?.linkedin_url && (
                    <a
                      href={siteSettings.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBtn}
                      aria-label="LinkedIn Profile"
                    >
                      <Globe size={18} />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {siteSettings?.twitter_url && (
                    <a
                      href={siteSettings.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBtn}
                      aria-label="Twitter Profile"
                    >
                      <MessageCircle size={18} />
                      <span>Twitter / X</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className={styles.formColumn}>
            <div className={styles.formCard}>
              <div className={styles.statusBadge}>
                <ShieldCheck size={14} aria-hidden="true" />
                <span>Direct Email Delivery with Spam Protection</span>
              </div>

              <h3 className={styles.formTitle}>Send a Direct Message</h3>

              {submitSuccess && (
                <div className={styles.successBanner} role="status" aria-live="polite">
                  <CheckCircle2 size={24} className={styles.successIcon} aria-hidden="true" />
                  <div>
                    <h4 className={styles.successTitle}>Message Delivered Successfully!</h4>
                    <p className={styles.successText}>
                      Thank you for reaching out. Your message has been sent to my inbox, and a reply
                      will be sent to <strong>{contactEmail}</strong> or your email address shortly.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className={styles.resetBtn}
                      aria-label="Send another message"
                    >
                      <RotateCcw size={14} aria-hidden="true" />
                      <span>Send Another Message</span>
                    </button>
                  </div>
                </div>
              )}

              {serverError && (
                <div className={styles.errorBanner} role="alert" aria-live="assertive">
                  <AlertCircle size={20} className={styles.errorIcon} aria-hidden="true" />
                  <div>
                    <span>{serverError}</span>
                    {isMissingConfig && (
                      <p style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: '#fca5a5' }}>
                        You can also write to me directly at{' '}
                        <a
                          href={`mailto:${contactEmail}`}
                          style={{ color: '#ffffff', textDecoration: 'underline' }}
                        >
                          {contactEmail}
                        </a>
                        .
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!submitSuccess && (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  {/* Honeypot field (hidden from screen readers & users to catch spam bots) */}
                  <input
                    type="text"
                    name="website"
                    id="contact-website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className={styles.honeypotField}
                    value={formData.website}
                    onChange={handleChange}
                  />

                  <div className={styles.formRow}>
                    {/* Full Name */}
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-name" className={styles.label}>
                        Full Name <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        aria-required="true"
                        aria-invalid={fieldErrors.name ? 'true' : 'false'}
                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                        placeholder="e.g. Alex Johnson"
                        value={formData.name}
                        onChange={handleChange}
                        className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                      />
                      {fieldErrors.name && (
                        <span id="name-error" className={styles.fieldError}>
                          {fieldErrors.name}
                        </span>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-email" className={styles.label}>
                        Email Address <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        aria-required="true"
                        aria-invalid={fieldErrors.email ? 'true' : 'false'}
                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                      />
                      {fieldErrors.email && (
                        <span id="email-error" className={styles.fieldError}>
                          {fieldErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-subject" className={styles.label}>
                      Subject <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      aria-required="true"
                      aria-invalid={fieldErrors.subject ? 'true' : 'false'}
                      aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                      placeholder="e.g. Internship Opportunity / Collaboration"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`${styles.input} ${fieldErrors.subject ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.subject && (
                      <span id="subject-error" className={styles.fieldError}>
                        {fieldErrors.subject}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-message" className={styles.label}>
                      Message <span className={styles.requiredStar}>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      aria-required="true"
                      aria-invalid={fieldErrors.message ? 'true' : 'false'}
                      aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                      placeholder="Tell me about your project, industrial placement, or inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      className={`${styles.textarea} ${fieldErrors.message ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {fieldErrors.message ? (
                        <span id="message-error" className={styles.fieldError}>
                          {fieldErrors.message}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className={styles.charCount}>
                        {formData.message.length} / 3000
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitBtn}
                    aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
