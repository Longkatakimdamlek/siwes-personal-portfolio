'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Briefcase,
  Calendar,
  MapPin,
  X,
  Save,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import {
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
} from '../actions';
import styles from './experience.module.css';

const INITIAL_EXP_FORM = {
  role_title: '',
  company_name: '',
  company_url: '',
  location: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: false,
  display_order: 0,
};

export default function ExperienceClient({ initialExperiences = [] }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [currentExp, setCurrentExp] = useState(null);
  const [formData, setFormData] = useState(INITIAL_EXP_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Delete modal state
  const [expToDelete, setExpToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = () => {
    setCurrentExp(null);
    setFormData({
      ...INITIAL_EXP_FORM,
      display_order: experiences.length + 1,
    });
    setFieldErrors({});
    setModalMode('create');
  };

  const handleOpenEdit = (exp) => {
    setCurrentExp(exp);
    setFormData({
      role_title: exp.role_title || '',
      company_name: exp.company_name || '',
      company_url: exp.company_url || '',
      location: exp.location || '',
      description: exp.description || '',
      start_date: exp.start_date ? exp.start_date.substring(0, 10) : '',
      end_date: exp.end_date ? exp.end_date.substring(0, 10) : '',
      is_current: Boolean(exp.is_current),
      display_order: exp.display_order || 0,
    });
    setFieldErrors({});
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setCurrentExp(null);
    setFieldErrors({});
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setFieldErrors({});

    const errors = {};
    if (!formData.role_title.trim()) {
      errors.role_title = 'Role or job title is required.';
    }
    if (!formData.company_name.trim()) {
      errors.company_name = 'Company or organization name is required.';
    }
    if (!formData.start_date.trim()) {
      errors.start_date = 'Start date is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalMode === 'create') {
        const res = await createExperienceAction(formData);
        setIsSubmitting(false);

        if (res.success && res.data) {
          setExperiences((prev) => [res.data, ...prev]);
          setFeedback({
            type: 'success',
            message: `Experience "${res.data.role_title}" successfully created!`,
          });
          setModalMode(null);
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to create experience.',
          });
        }
      } else if (modalMode === 'edit' && currentExp) {
        const res = await updateExperienceAction(currentExp.id, formData);
        setIsSubmitting(false);

        if (res.success && res.data) {
          setExperiences((prev) =>
            prev.map((e) => (e.id === currentExp.id ? res.data : e))
          );
          setFeedback({
            type: 'success',
            message: `Experience "${res.data.role_title}" successfully updated!`,
          });
          setModalMode(null);
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to update experience.',
          });
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      setFeedback({
        type: 'error',
        message: err.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleOpenDelete = (exp) => {
    setExpToDelete(exp);
  };

  const handleConfirmDelete = async () => {
    if (!expToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteExperienceAction(expToDelete.id);
      setIsDeleting(false);

      if (res.success) {
        setExperiences((prev) => prev.filter((e) => e.id !== expToDelete.id));
        setFeedback({
          type: 'success',
          message: `Experience "${expToDelete.role_title} at ${expToDelete.company_name}" permanently deleted.`,
        });
        setExpToDelete(null);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to delete experience.',
        });
      }
    } catch (err) {
      setIsDeleting(false);
      setFeedback({
        type: 'error',
        message: err.message || 'An unexpected error occurred while deleting.',
      });
    }
  };

  return (
    <AdminLayout pageTitle="Experience Management">
      <div className={styles.container}>
        {/* Header Bar */}
        <div className={styles.introHeader}>
          <div>
            <h2 className={styles.introTitle}>Professional Experience &amp; Internships</h2>
            <p className={styles.introDesc}>
              Manage your career history, SIWES internships, and engineering positions.
              Entries are sorted by timeline order and synchronized with PostgreSQL.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/about#experience" target="_blank" className={styles.viewPublicLink}>
              <span>View On About Page</span>
              <ExternalLink size={14} />
            </Link>
            <button
              type="button"
              onClick={handleOpenCreate}
              className={styles.addBtn}
            >
              <Plus size={16} />
              <span>Add Experience</span>
            </button>
          </div>
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

        {/* Experiences List */}
        <div className={styles.tableCard}>
          {experiences.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Role &amp; Company</th>
                    <th>Period</th>
                    <th>Location</th>
                    <th>Sort Order</th>
                    <th className={styles.actionsHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((exp) => (
                    <tr key={exp.id || exp.role_title}>
                      <td className={styles.roleCell}>
                        <div className={styles.roleWrapper}>
                          <div className={styles.iconBadge}>
                            <Briefcase size={16} />
                          </div>
                          <div>
                            <div className={styles.roleTitleRow}>
                              <span className={styles.roleTitle}>{exp.role_title}</span>
                              {exp.is_current && (
                                <span className={styles.currentBadge}>Current</span>
                              )}
                            </div>
                            <span className={styles.companyName}>
                              {exp.company_name}
                              {exp.company_url && (
                                <a
                                  href={exp.company_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.companyLink}
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className={styles.dateCell}>
                        <div className={styles.dateRow}>
                          <Calendar size={13} className={styles.dateIcon} />
                          <span>
                            {exp.start_date ? exp.start_date.substring(0, 7) : 'N/A'} &mdash;{' '}
                            {exp.is_current
                              ? 'Present'
                              : exp.end_date
                              ? exp.end_date.substring(0, 7)
                              : 'Present'}
                          </span>
                        </div>
                      </td>

                      <td className={styles.locationCell}>
                        {exp.location ? (
                          <div className={styles.locationRow}>
                            <MapPin size={13} className={styles.locationIcon} />
                            <span>{exp.location}</span>
                          </div>
                        ) : (
                          <span className={styles.mutedText}>Remote / Unspecified</span>
                        )}
                      </td>

                      <td className={styles.orderCell}>{exp.display_order || 0}</td>

                      <td className={styles.actionsCell}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(exp)}
                          className={styles.editBtn}
                          aria-label={`Edit ${exp.role_title}`}
                        >
                          <Pencil size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(exp)}
                          className={styles.deleteBtn}
                          aria-label={`Delete ${exp.role_title}`}
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No work experience or internships recorded yet.</p>
              <button
                type="button"
                onClick={handleOpenCreate}
                className={styles.emptyAddBtn}
              >
                <Plus size={16} />
                <span>Add your first work experience</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal: Create / Edit Experience */}
        {modalMode && (
          <div className={styles.modalOverlay} onClick={handleCloseModal} role="dialog">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {modalMode === 'create'
                    ? 'Add Experience Entry'
                    : `Edit Experience: ${currentExp?.role_title}`}
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.modalCloseBtn}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.modalForm} noValidate>
                <div className={styles.modalGrid}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="role_title" className={styles.label}>
                      Role / Position Title <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="role_title"
                      name="role_title"
                      type="text"
                      required
                      value={formData.role_title}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineering Intern (SIWES)"
                      className={`${styles.input} ${fieldErrors.role_title ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.role_title && (
                      <span className={styles.errorText}>{fieldErrors.role_title}</span>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="company_name" className={styles.label}>
                      Company / Organization <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="e.g. TechCorp Innovations"
                      className={`${styles.input} ${fieldErrors.company_name ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.company_name && (
                      <span className={styles.errorText}>{fieldErrors.company_name}</span>
                    )}
                  </div>
                </div>

                <div className={styles.modalGrid}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="company_url" className={styles.label}>
                      Company Website URL
                    </label>
                    <input
                      id="company_url"
                      name="company_url"
                      type="url"
                      value={formData.company_url}
                      onChange={handleChange}
                      placeholder="https://company.com"
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="location" className={styles.label}>
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Lagos, Nigeria / Remote"
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.modalGridThree}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="start_date" className={styles.label}>
                      Start Date <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="start_date"
                      name="start_date"
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={handleChange}
                      className={`${styles.input} ${fieldErrors.start_date ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.start_date && (
                      <span className={styles.errorText}>{fieldErrors.start_date}</span>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="end_date" className={styles.label}>
                      End Date
                    </label>
                    <input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleChange}
                      disabled={formData.is_current || isSubmitting}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="display_order" className={styles.label}>
                      Sort Order
                    </label>
                    <input
                      id="display_order"
                      name="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={handleChange}
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.checkboxRow}>
                  <label className={styles.checkboxLabel}>
                    <input
                      name="is_current"
                      type="checkbox"
                      checked={formData.is_current}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={styles.checkbox}
                    />
                    <span>I am currently working in this role</span>
                  </label>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Responsibilities &amp; Achievements
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe core contributions, frameworks utilized, and engineering milestones delivered."
                    className={styles.textarea}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitModalBtn}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className={styles.spinner} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{modalMode === 'create' ? 'Create Experience' : 'Save Changes'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Deletion */}
        <ConfirmDialog
          isOpen={Boolean(expToDelete)}
          title="Delete Experience Entry"
          message="Are you sure you want to permanently delete this experience entry? It will be removed from both the admin dashboard and public portfolio."
          itemName={expToDelete ? `${expToDelete.role_title} at ${expToDelete.company_name}` : ''}
          confirmLabel="Delete Entry"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setExpToDelete(null)}
        />
      </div>
    </AdminLayout>
  );
}
