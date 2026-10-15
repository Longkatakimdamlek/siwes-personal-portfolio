'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  FileText,
  Share2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImagePreviewInput from '@/components/admin/ImagePreviewInput';
import { DEFAULT_AVATAR_URL, resolveAvatarUrl } from '@/lib/avatar';
import { saveSiteSettingsAction } from '../actions';
import styles from './settings.module.css';

export default function SettingsClient({ initialSettings }) {
  const [formData, setFormData] = useState({
    site_name: initialSettings.site_name || '',
    logo_url: initialSettings.logo_url || '',
    hero_title: initialSettings.hero_title || '',
    hero_subtitle: initialSettings.hero_subtitle || '',
    hero_description: initialSettings.hero_description || '',
    hero_image_url: resolveAvatarUrl(null, initialSettings.hero_image_url),
    contact_email: initialSettings.contact_email || '',
    phone_number: initialSettings.phone_number || '',
    about_summary: initialSettings.about_summary || '',
    resume_url: initialSettings.resume_url || '',
    github_url: initialSettings.github_url || '',
    linkedin_url: initialSettings.linkedin_url || '',
    twitter_url: initialSettings.twitter_url || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (fieldName, val) => {
    setFormData((prev) => ({ ...prev, [fieldName]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setFieldErrors({});

    // Client-side validations
    const errors = {};
    if (!formData.hero_title.trim()) {
      errors.hero_title = 'Hero Title headline is required.';
    }
    if (!formData.contact_email.trim()) {
      errors.contact_email = 'Contact email is required.';
    } else if (!formData.contact_email.includes('@') || !formData.contact_email.includes('.')) {
      errors.contact_email = 'Please enter a valid email address.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFeedback({ type: 'error', message: 'Please resolve the highlighted field errors below.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await saveSiteSettingsAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Site settings successfully updated! Public portfolio reflects the changes immediately.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to save site settings. Please check database permissions.',
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      setFeedback({
        type: 'error',
        message: err.message || 'An unexpected error occurred while saving.',
      });
    }
  };

  return (
    <AdminLayout pageTitle="Site Settings Management">
      <div className={styles.container}>
        {/* Header Notice */}
        <div className={styles.introHeader}>
          <div>
            <h2 className={styles.introTitle}>Global Site &amp; Showcase Configuration</h2>
            <p className={styles.introDesc}>
              Modify site branding, hero section text, contact channels, and social media links.
              Values are synchronized with PostgreSQL and update the public website in real time.
            </p>
          </div>
          <Link href="/" target="_blank" className={styles.viewPublicLink}>
            <span>View Public Site</span>
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`${styles.feedbackBanner} ${
              feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
            }`}
            role="alert"
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={18} className={styles.feedbackIcon} />
            ) : (
              <AlertCircle size={18} className={styles.feedbackIcon} />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Section 1: Branding & Identity */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <Globe size={18} className={styles.cardHeaderIcon} />
              <h3 className={styles.cardTitle}>Branding &amp; Identity</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label htmlFor="site_name" className={styles.label}>
                  Site Name / Title
                </label>
                <input
                  id="site_name"
                  name="site_name"
                  type="text"
                  value={formData.site_name}
                  onChange={handleChange}
                  placeholder="e.g. Developer Portfolio"
                  className={styles.input}
                  disabled={isSubmitting}
                />
                <span className={styles.helpText}>Used in browser title and navigation branding.</span>
              </div>

              <ImagePreviewInput
                id="logo_url"
                name="logo_url"
                label="Brand Logo URL / Path"
                value={formData.logo_url}
                onChange={(val) => handleImageChange('logo_url', val)}
                placeholder="/images/... or https://..."
                presets={[{ label: 'Avatar Preset', url: '/images/avatar.jpg' }]}
                helpText="Optional custom logo icon. Leave empty to use default text/icon branding."
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Section 2: Hero Presentation Section */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <FileText size={18} className={styles.cardHeaderIcon} />
              <h3 className={styles.cardTitle}>Hero Showcase Section</h3>
            </div>

            <div className={styles.formGridFull}>
              <div className={styles.fieldGroup}>
                <label htmlFor="hero_title" className={styles.label}>
                  Hero Headline <span className={styles.required}>*</span>
                </label>
                <input
                  id="hero_title"
                  name="hero_title"
                  type="text"
                  required
                  value={formData.hero_title}
                  onChange={handleChange}
                  placeholder="e.g. Crafting Modern Web Experiences"
                  className={`${styles.input} ${fieldErrors.hero_title ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
                {fieldErrors.hero_title && (
                  <span className={styles.errorText}>{fieldErrors.hero_title}</span>
                )}
                <span className={styles.helpText}>Primary high-impact title displayed on the homepage hero.</span>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="hero_subtitle" className={styles.label}>
                  Hero Subtitle
                </label>
                <input
                  id="hero_subtitle"
                  name="hero_subtitle"
                  type="text"
                  value={formData.hero_subtitle}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Developer & Software Engineering Student"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="hero_description" className={styles.label}>
                  Hero Supporting Description
                </label>
                <textarea
                  id="hero_description"
                  name="hero_description"
                  rows={3}
                  value={formData.hero_description}
                  onChange={handleChange}
                  placeholder="e.g. Specializing in Next.js, modern JavaScript, and scalable PostgreSQL architectures."
                  className={styles.textarea}
                  disabled={isSubmitting}
                />
              </div>

              <ImagePreviewInput
                id="hero_image_url"
                name="hero_image_url"
                label="Hero Visual Image / Graphic URL"
                value={formData.hero_image_url}
                onChange={(val) => handleImageChange('hero_image_url', val)}
                placeholder="/images/... or https://..."
                presets={[
                  { label: 'Developer Portrait', url: DEFAULT_AVATAR_URL },
                ]}
                helpText="Optional hero presentation image."
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Section 3: Contact Details & Channels */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <Mail size={18} className={styles.cardHeaderIcon} />
              <h3 className={styles.cardTitle}>Contact Information</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label htmlFor="contact_email" className={styles.label}>
                  Contact Email <span className={styles.required}>*</span>
                </label>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="developer@example.com"
                  className={`${styles.input} ${fieldErrors.contact_email ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
                {fieldErrors.contact_email && (
                  <span className={styles.errorText}>{fieldErrors.contact_email}</span>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="phone_number" className={styles.label}>
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+234 800 123 4567"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label htmlFor="about_summary" className={styles.label}>
                  Global About / Elevator Pitch
                </label>
                <textarea
                  id="about_summary"
                  name="about_summary"
                  rows={2}
                  value={formData.about_summary}
                  onChange={handleChange}
                  placeholder="Concise overview summarizing your developer profile and technical focus."
                  className={styles.textarea}
                  disabled={isSubmitting}
                />
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label htmlFor="resume_url" className={styles.label}>
                  Resume / CV Document URL
                </label>
                <input
                  id="resume_url"
                  name="resume_url"
                  type="text"
                  value={formData.resume_url}
                  onChange={handleChange}
                  placeholder="https://... or /resume.pdf"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Social Profiles & Repositories */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <Share2 size={18} className={styles.cardHeaderIcon} />
              <h3 className={styles.cardTitle}>Social Profiles &amp; Links</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label htmlFor="github_url" className={styles.label}>
                  GitHub Profile URL
                </label>
                <input
                  id="github_url"
                  name="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="linkedin_url" className={styles.label}>
                  LinkedIn Profile URL
                </label>
                <input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="twitter_url" className={styles.label}>
                  Twitter / X Profile URL
                </label>
                <input
                  id="twitter_url"
                  name="twitter_url"
                  type="url"
                  value={formData.twitter_url}
                  onChange={handleChange}
                  placeholder="https://x.com/username"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div className={styles.submitBar}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.saveBtn}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className={styles.spinner} />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Site Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
