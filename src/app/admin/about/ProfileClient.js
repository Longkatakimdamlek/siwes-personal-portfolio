'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  User,
  MapPin,
  Clock,
  CheckSquare,
  Square,
  FileText,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImagePreviewInput from '@/components/admin/ImagePreviewInput';
import { DEFAULT_AVATAR_URL, resolveAvatarUrl } from '@/lib/avatar';
import { saveProfileAction } from '../actions';
import styles from './profile.module.css';

export default function ProfileClient({ initialProfile }) {
  const [formData, setFormData] = useState({
    full_name: initialProfile.full_name || '',
    headline: initialProfile.headline || '',
    professional_intro: initialProfile.professional_intro || '',
    biography: initialProfile.biography || '',
    avatar_url: resolveAvatarUrl(initialProfile.avatar_url),
    years_of_experience: initialProfile.years_of_experience?.toString() || '3',
    location: initialProfile.location || '',
    available_for_hire:
      initialProfile.available_for_hire !== undefined
        ? initialProfile.available_for_hire
        : true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAvatarChange = (url) => {
    setFormData((prev) => ({ ...prev, avatar_url: url }));
  };

  const toggleAvailability = () => {
    setFormData((prev) => ({ ...prev, available_for_hire: !prev.available_for_hire }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setFieldErrors({});

    const errors = {};
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required.';
    }
    if (!formData.headline.trim()) {
      errors.headline = 'Professional headline is required.';
    }
    if (!formData.professional_intro.trim()) {
      errors.professional_intro = 'Professional introduction is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFeedback({ type: 'error', message: 'Please fix the highlighted errors before saving.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await saveProfileAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Profile information successfully updated! Public portfolio reflects the changes immediately.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to update profile. Please verify database permissions.',
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      setFeedback({
        type: 'error',
        message: err.message || 'An unexpected error occurred while saving profile.',
      });
    }
  };

  return (
    <AdminLayout pageTitle="About & Profile Management">
      <div className={styles.container}>
        {/* Header Notice */}
        <div className={styles.introHeader}>
          <div>
            <h2 className={styles.introTitle}>Personal Biography &amp; Professional Profile</h2>
            <p className={styles.introDesc}>
              Update developer identity, biography, photo portrait, career summary, and availability status.
              Modifications are saved to PostgreSQL and immediately displayed on the public portfolio.
            </p>
          </div>
          <Link href="/about" target="_blank" className={styles.viewPublicLink}>
            <span>View Public About</span>
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Feedback Alert */}
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
          {/* Card 1: Core Developer Identity */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <User size={18} className={styles.cardHeaderIcon} />
              <h3 className={styles.cardTitle}>Identity &amp; Role</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label htmlFor="full_name" className={styles.label}>
                  Full Legal / Developer Name <span className={styles.required}>*</span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className={`${styles.input} ${fieldErrors.full_name ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
                {fieldErrors.full_name && (
                  <span className={styles.errorText}>{fieldErrors.full_name}</span>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="headline" className={styles.label}>
                  Professional Headline <span className={styles.required}>*</span>
                </label>
                <input
                  id="headline"
                  name="headline"
                  type="text"
                  required
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Developer & Software Engineering Student"
                  className={`${styles.input} ${fieldErrors.headline ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
                {fieldErrors.headline && (
                  <span className={styles.errorText}>{fieldErrors.headline}</span>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="location" className={styles.label}>
                  <MapPin size={14} className={styles.inlineIcon} />
                  <span>Location / Base</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lagos, Nigeria"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="years_of_experience" className={styles.label}>
                  <Clock size={14} className={styles.inlineIcon} />
                  <span>Years of Experience</span>
                </label>
                <input
                  id="years_of_experience"
                  name="years_of_experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Profile Avatar / Photo */}
            <div className={styles.avatarSection}>
              <ImagePreviewInput
                id="avatar_url"
                name="avatar_url"
                label="Profile Photo / Avatar URL"
                value={formData.avatar_url}
                onChange={handleAvatarChange}
                placeholder="/images/... or https://..."
                presets={[
                  { label: 'Developer Portrait', url: DEFAULT_AVATAR_URL },
                ]}
                helpText="Avatar image displayed across About section and header."
                disabled={isSubmitting}
              />
            </div>

            {/* Availability Checkbox Toggle */}
            <div className={styles.toggleRow}>
              <button
                type="button"
                onClick={toggleAvailability}
                className={styles.toggleBtn}
                disabled={isSubmitting}
                aria-pressed={formData.available_for_hire}
              >
                {formData.available_for_hire ? (
                  <CheckSquare size={20} className={styles.checkedIcon} />
                ) : (
                  <Square size={20} className={styles.uncheckedIcon} />
                )}
                <div className={styles.toggleText}>
                  <span className={styles.toggleTitle}>Available for Internship / Hire</span>
                  <span className={styles.toggleDesc}>
                    When enabled, displays an active green status badge on the public portfolio.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Card 2: Biography & Introduction */}
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <FileText size={18} className={styles.cardHeaderIcon} />
              <h3 className={styles.cardTitle}>Narrative &amp; Biography</h3>
            </div>

            <div className={styles.formGridFull}>
              <div className={styles.fieldGroup}>
                <label htmlFor="professional_intro" className={styles.label}>
                  Professional Introduction <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="professional_intro"
                  name="professional_intro"
                  rows={3}
                  required
                  value={formData.professional_intro}
                  onChange={handleChange}
                  placeholder="Short, powerful introduction highlighting your technical focus and academic foundation."
                  className={`${styles.textarea} ${
                    fieldErrors.professional_intro ? styles.inputError : ''
                  }`}
                  disabled={isSubmitting}
                />
                {fieldErrors.professional_intro && (
                  <span className={styles.errorText}>{fieldErrors.professional_intro}</span>
                )}
                <span className={styles.helpText}>
                  Prominently featured in the About section header.
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="biography" className={styles.label}>
                  Full Developer Biography
                </label>
                <textarea
                  id="biography"
                  name="biography"
                  rows={6}
                  value={formData.biography}
                  onChange={handleChange}
                  placeholder="Detailed multi-paragraph background discussing your programming journey, SIWES internship objectives, problem-solving passion, and technical aspirations."
                  className={styles.textarea}
                  disabled={isSubmitting}
                />
                <span className={styles.helpText}>
                  Supports multi-paragraph narrative for visitors exploring your full background.
                </span>
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
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
