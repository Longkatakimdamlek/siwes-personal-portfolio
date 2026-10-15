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
  GraduationCap,
  Calendar,
  BookOpen,
  X,
  Save,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import {
  createEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from '../actions';
import styles from './education.module.css';

const INITIAL_EDU_FORM = {
  institution: '',
  degree: '',
  field_of_study: '',
  description: '',
  start_date: '',
  end_date: '',
  display_order: 0,
};

export default function EducationClient({ initialEducation = [] }) {
  const [educationList, setEducationList] = useState(initialEducation);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [currentEdu, setCurrentEdu] = useState(null);
  const [formData, setFormData] = useState(INITIAL_EDU_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Delete modal state
  const [eduToDelete, setEduToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = () => {
    setCurrentEdu(null);
    setFormData({
      ...INITIAL_EDU_FORM,
      display_order: educationList.length + 1,
    });
    setFieldErrors({});
    setModalMode('create');
  };

  const handleOpenEdit = (edu) => {
    setCurrentEdu(edu);
    setFormData({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field_of_study: edu.field_of_study || '',
      description: edu.description || '',
      start_date: edu.start_date ? edu.start_date.substring(0, 10) : '',
      end_date: edu.end_date ? edu.end_date.substring(0, 10) : '',
      display_order: edu.display_order || 0,
    });
    setFieldErrors({});
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setCurrentEdu(null);
    setFieldErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setFieldErrors({});

    const errors = {};
    if (!formData.institution.trim()) {
      errors.institution = 'Institution or university name is required.';
    }
    if (!formData.degree.trim()) {
      errors.degree = 'Degree or qualification title is required.';
    }
    if (!formData.field_of_study.trim()) {
      errors.field_of_study = 'Field of study or major is required.';
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
        const res = await createEducationAction(formData);
        setIsSubmitting(false);

        if (res.success && res.data) {
          setEducationList((prev) => [res.data, ...prev]);
          setFeedback({
            type: 'success',
            message: `Education entry "${res.data.degree}" successfully created!`,
          });
          setModalMode(null);
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to create education entry.',
          });
        }
      } else if (modalMode === 'edit' && currentEdu) {
        const res = await updateEducationAction(currentEdu.id, formData);
        setIsSubmitting(false);

        if (res.success && res.data) {
          setEducationList((prev) =>
            prev.map((e) => (e.id === currentEdu.id ? res.data : e))
          );
          setFeedback({
            type: 'success',
            message: `Education entry "${res.data.degree}" successfully updated!`,
          });
          setModalMode(null);
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to update education entry.',
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

  const handleOpenDelete = (edu) => {
    setEduToDelete(edu);
  };

  const handleConfirmDelete = async () => {
    if (!eduToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteEducationAction(eduToDelete.id);
      setIsDeleting(false);

      if (res.success) {
        setEducationList((prev) => prev.filter((e) => e.id !== eduToDelete.id));
        setFeedback({
          type: 'success',
          message: `Education entry "${eduToDelete.degree} at ${eduToDelete.institution}" permanently deleted.`,
        });
        setEduToDelete(null);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to delete education entry.',
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
    <AdminLayout pageTitle="Education Management">
      <div className={styles.container}>
        {/* Header Bar */}
        <div className={styles.introHeader}>
          <div>
            <h2 className={styles.introTitle}>Academic Credentials &amp; Education</h2>
            <p className={styles.introDesc}>
              Manage university degrees, diplomas, and academic programs.
              Sorted by display order and timeline, synchronized with PostgreSQL.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/about#education" target="_blank" className={styles.viewPublicLink}>
              <span>View On About Page</span>
              <ExternalLink size={14} />
            </Link>
            <button
              type="button"
              onClick={handleOpenCreate}
              className={styles.addBtn}
            >
              <Plus size={16} />
              <span>Add Education</span>
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

        {/* Education List Table */}
        <div className={styles.tableCard}>
          {educationList.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Degree &amp; Major</th>
                    <th>Institution</th>
                    <th>Period</th>
                    <th>Sort Order</th>
                    <th className={styles.actionsHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {educationList.map((edu) => (
                    <tr key={edu.id || edu.degree}>
                      <td className={styles.degreeCell}>
                        <div className={styles.degreeWrapper}>
                          <div className={styles.iconBadge}>
                            <GraduationCap size={16} />
                          </div>
                          <div>
                            <span className={styles.degreeTitle}>{edu.degree}</span>
                            <div className={styles.majorRow}>
                              <BookOpen size={12} className={styles.inlineIcon} />
                              <span className={styles.majorText}>{edu.field_of_study}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className={styles.institutionCell}>{edu.institution}</td>

                      <td className={styles.dateCell}>
                        <div className={styles.dateRow}>
                          <Calendar size={13} className={styles.dateIcon} />
                          <span>
                            {edu.start_date ? edu.start_date.substring(0, 4) : 'N/A'} &mdash;{' '}
                            {edu.end_date ? edu.end_date.substring(0, 4) : 'Present'}
                          </span>
                        </div>
                      </td>

                      <td className={styles.orderCell}>{edu.display_order || 0}</td>

                      <td className={styles.actionsCell}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(edu)}
                          className={styles.editBtn}
                          aria-label={`Edit ${edu.degree}`}
                        >
                          <Pencil size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(edu)}
                          className={styles.deleteBtn}
                          aria-label={`Delete ${edu.degree}`}
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
              <p>No education qualifications recorded yet.</p>
              <button
                type="button"
                onClick={handleOpenCreate}
                className={styles.emptyAddBtn}
              >
                <Plus size={16} />
                <span>Add your first education qualification</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal: Create / Edit Education */}
        {modalMode && (
          <div className={styles.modalOverlay} onClick={handleCloseModal} role="dialog">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {modalMode === 'create'
                    ? 'Add Academic Qualification'
                    : `Edit Qualification: ${currentEdu?.degree}`}
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
                <div className={styles.fieldGroup}>
                  <label htmlFor="institution" className={styles.label}>
                    Institution / University <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="institution"
                    name="institution"
                    type="text"
                    required
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="e.g. University of Lagos / Covenant University"
                    className={`${styles.input} ${fieldErrors.institution ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.institution && (
                    <span className={styles.errorText}>{fieldErrors.institution}</span>
                  )}
                </div>

                <div className={styles.modalGrid}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="degree" className={styles.label}>
                      Degree / Qualification <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="degree"
                      name="degree"
                      type="text"
                      required
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="e.g. B.Sc. Computer Science"
                      className={`${styles.input} ${fieldErrors.degree ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.degree && (
                      <span className={styles.errorText}>{fieldErrors.degree}</span>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="field_of_study" className={styles.label}>
                      Field of Study / Major <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="field_of_study"
                      name="field_of_study"
                      type="text"
                      required
                      value={formData.field_of_study}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineering &amp; Data Structures"
                      className={`${styles.input} ${
                        fieldErrors.field_of_study ? styles.inputError : ''
                      }`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.field_of_study && (
                      <span className={styles.errorText}>{fieldErrors.field_of_study}</span>
                    )}
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
                      Graduation / End Date
                    </label>
                    <input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className={styles.input}
                      disabled={isSubmitting}
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

                <div className={styles.fieldGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Academic Highlights &amp; Honors
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Relevant coursework, academic honors, SIWES defense, or key technical research topics."
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
                        <span>{modalMode === 'create' ? 'Create Education' : 'Save Changes'}</span>
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
          isOpen={Boolean(eduToDelete)}
          title="Delete Education Qualification"
          message="Are you sure you want to permanently delete this academic credential? It will be removed from both the admin dashboard and public portfolio."
          itemName={eduToDelete ? `${eduToDelete.degree} at ${eduToDelete.institution}` : ''}
          confirmLabel="Delete Qualification"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setEduToDelete(null)}
        />
      </div>
    </AdminLayout>
  );
}
