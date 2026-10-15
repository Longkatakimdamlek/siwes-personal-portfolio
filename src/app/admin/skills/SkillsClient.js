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
  Cpu,
  Star,
  X,
  Save,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import {
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
} from '../actions';
import styles from './skills.module.css';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

const INITIAL_SKILL_FORM = {
  name: '',
  category: 'Frontend',
  description: '',
  icon_name: '',
  proficiency_level: 85,
  display_order: 0,
  is_featured: false,
};

export default function SkillsClient({ initialSkills = [] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [currentSkill, setCurrentSkill] = useState(null);
  const [formData, setFormData] = useState(INITIAL_SKILL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Delete modal state
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter skills
  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleOpenCreate = () => {
    setCurrentSkill(null);
    setFormData({
      ...INITIAL_SKILL_FORM,
      display_order: skills.length + 1,
    });
    setFieldErrors({});
    setModalMode('create');
  };

  const handleOpenEdit = (skill) => {
    setCurrentSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Frontend',
      description: skill.description || '',
      icon_name: skill.icon_name || '',
      proficiency_level: skill.proficiency_level || 85,
      display_order: skill.display_order || 0,
      is_featured: Boolean(skill.is_featured),
    });
    setFieldErrors({});
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setCurrentSkill(null);
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
    if (!formData.name.trim()) {
      errors.name = 'Skill name is required.';
    }
    const prof = parseInt(formData.proficiency_level, 10);
    if (isNaN(prof) || prof < 1 || prof > 100) {
      errors.proficiency_level = 'Proficiency must be an integer between 1 and 100.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalMode === 'create') {
        const res = await createSkillAction(formData);
        setIsSubmitting(false);

        if (res.success && res.data) {
          setSkills((prev) => [...prev, res.data]);
          setFeedback({
            type: 'success',
            message: `Skill "${res.data.name}" successfully created!`,
          });
          setModalMode(null);
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to create skill.',
          });
        }
      } else if (modalMode === 'edit' && currentSkill) {
        const res = await updateSkillAction(currentSkill.id, formData);
        setIsSubmitting(false);

        if (res.success && res.data) {
          setSkills((prev) =>
            prev.map((s) => (s.id === currentSkill.id ? res.data : s))
          );
          setFeedback({
            type: 'success',
            message: `Skill "${res.data.name}" successfully updated!`,
          });
          setModalMode(null);
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to update skill.',
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

  const handleOpenDelete = (skill) => {
    setSkillToDelete(skill);
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteSkillAction(skillToDelete.id);
      setIsDeleting(false);

      if (res.success) {
        setSkills((prev) => prev.filter((s) => s.id !== skillToDelete.id));
        setFeedback({
          type: 'success',
          message: `Skill "${skillToDelete.name}" permanently deleted.`,
        });
        setSkillToDelete(null);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to delete skill.',
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
    <AdminLayout pageTitle="Skills Management">
      <div className={styles.container}>
        {/* Header Bar */}
        <div className={styles.introHeader}>
          <div>
            <h2 className={styles.introTitle}>Technical Skills Catalog</h2>
            <p className={styles.introDesc}>
              Create, update, organize, and delete developer skills across categories.
              Changes update PostgreSQL and sync with the public portfolio immediately.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/skills" target="_blank" className={styles.viewPublicLink}>
              <span>View Public Skills</span>
              <ExternalLink size={14} />
            </Link>
            <button
              type="button"
              onClick={handleOpenCreate}
              className={styles.addBtn}
            >
              <Plus size={16} />
              <span>Add Skill</span>
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

        {/* Category Filters */}
        <div className={styles.filtersBar}>
          <div className={styles.categoryTabs}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.categoryTab} ${
                  selectedCategory === cat ? styles.categoryTabActive : ''
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className={styles.tabCount}>
                    {skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase()).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Table / Grid */}
        <div className={styles.tableCard}>
          {filteredSkills.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Skill Name</th>
                    <th>Category</th>
                    <th>Proficiency</th>
                    <th>Order</th>
                    <th>Featured</th>
                    <th className={styles.actionsHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkills.map((skill) => (
                    <tr key={skill.id || skill.name}>
                      <td className={styles.nameCell}>
                        <div className={styles.nameWrapper}>
                          <div className={styles.iconBadge}>
                            <Cpu size={16} />
                          </div>
                          <div>
                            <span className={styles.skillName}>{skill.name}</span>
                            {skill.description && (
                              <span className={styles.skillDesc}>{skill.description}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.catBadge}>{skill.category}</span>
                      </td>
                      <td className={styles.profCell}>
                        <div className={styles.profBar}>
                          <div
                            className={styles.profFill}
                            style={{ width: `${skill.proficiency_level || 80}%` }}
                          />
                        </div>
                        <span className={styles.profValue}>{skill.proficiency_level || 80}%</span>
                      </td>
                      <td className={styles.orderCell}>{skill.display_order || 0}</td>
                      <td>
                        {skill.is_featured ? (
                          <span className={styles.featuredBadge}>
                            <Star size={12} />
                            <span>Featured</span>
                          </span>
                        ) : (
                          <span className={styles.standardBadge}>Standard</span>
                        )}
                      </td>
                      <td className={styles.actionsCell}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(skill)}
                          className={styles.editBtn}
                          aria-label={`Edit ${skill.name}`}
                          title="Edit skill"
                        >
                          <Pencil size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(skill)}
                          className={styles.deleteBtn}
                          aria-label={`Delete ${skill.name}`}
                          title="Delete skill"
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
              <p>No skills found in category &ldquo;{selectedCategory}&rdquo;.</p>
              <button
                type="button"
                onClick={handleOpenCreate}
                className={styles.emptyAddBtn}
              >
                <Plus size={16} />
                <span>Add a skill to this category</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal: Create / Edit Skill */}
        {modalMode && (
          <div className={styles.modalOverlay} onClick={handleCloseModal} role="dialog">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {modalMode === 'create' ? 'Add New Technical Skill' : `Edit Skill: ${currentSkill?.name}`}
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
                  <label htmlFor="name" className={styles.label}>
                    Skill Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Next.js, PostgreSQL, Docker"
                    className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.name && (
                    <span className={styles.errorText}>{fieldErrors.name}</span>
                  )}
                </div>

                <div className={styles.modalGrid}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="category" className={styles.label}>
                      Category <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={styles.select}
                      disabled={isSubmitting}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="proficiency_level" className={styles.label}>
                      Proficiency Level (1–100%)
                    </label>
                    <div className={styles.profInputWrapper}>
                      <input
                        id="proficiency_level"
                        name="proficiency_level"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.proficiency_level}
                        onChange={handleChange}
                        className={`${styles.input} ${
                          fieldErrors.proficiency_level ? styles.inputError : ''
                        }`}
                        disabled={isSubmitting}
                      />
                      <span className={styles.percentSymbol}>%</span>
                    </div>
                    {fieldErrors.proficiency_level && (
                      <span className={styles.errorText}>{fieldErrors.proficiency_level}</span>
                    )}
                  </div>
                </div>

                <div className={styles.modalGrid}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="display_order" className={styles.label}>
                      Display Sort Order
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
                    <span className={styles.helpText}>Lower numbers display first (e.g. 1, 2, 3).</span>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="icon_name" className={styles.label}>
                      Lucide Icon Name
                    </label>
                    <input
                      id="icon_name"
                      name="icon_name"
                      type="text"
                      value={formData.icon_name}
                      onChange={handleChange}
                      placeholder="e.g. Code, Database, Cpu"
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Skill Description / Focus
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of application experience and frameworks."
                    className={styles.textarea}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.checkboxRow}>
                  <label className={styles.checkboxLabel}>
                    <input
                      name="is_featured"
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={styles.checkbox}
                    />
                    <span>Highlight as Featured Skill on Homepage</span>
                  </label>
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
                        <span>{modalMode === 'create' ? 'Create Skill' : 'Save Changes'}</span>
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
          isOpen={Boolean(skillToDelete)}
          title="Delete Skill"
          message="Are you sure you want to permanently delete this skill? It will be removed from both the admin dashboard and public portfolio."
          itemName={skillToDelete?.name}
          confirmLabel="Delete Skill"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setSkillToDelete(null)}
        />
      </div>
    </AdminLayout>
  );
}
