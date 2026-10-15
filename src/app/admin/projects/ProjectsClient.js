'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  FolderGit2,
  Star,
  X,
  Save,
  Code2,
  Globe,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImagePreviewInput from '@/components/admin/ImagePreviewInput';
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from '../actions';
import styles from './projects.module.css';

const INITIAL_PROJECT_FORM = {
  title: '',
  slug: '',
  short_description: '',
  full_description: '',
  thumbnail_url: '',
  technologies: '',
  project_url: '',
  github_url: '',
  project_year: new Date().getFullYear().toString(),
  status: 'Completed',
  is_featured: false,
  display_order: 0,
};

export default function ProjectsClient({ initialProjects = [] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState(INITIAL_PROJECT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = () => {
    setCurrentProject(null);
    setFormData({
      ...INITIAL_PROJECT_FORM,
      display_order: projects.length + 1,
    });
    setFieldErrors({});
    setModalMode('create');
  };

  const handleOpenEdit = (project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      short_description: project.short_description || '',
      full_description: project.full_description || '',
      thumbnail_url: project.thumbnail_url || '',
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : project.technologies || '',
      project_url: project.project_url || '',
      github_url: project.github_url || '',
      project_year: project.project_year || '2026',
      status: project.status || 'Completed',
      is_featured: Boolean(project.is_featured),
      display_order: project.display_order || 0,
    });
    setFieldErrors({});
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setCurrentProject(null);
    setFieldErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Auto-generate slug when creating if slug hasn't been manually detached
      if (name === 'title' && modalMode === 'create' && (!prev.slug || prev.slug === slugify(prev.title))) {
        updated.slug = slugify(value);
      }
      return updated;
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setFieldErrors({});

    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Project title is required.';
    }
    if (!formData.slug.trim()) {
      errors.slug = 'Project slug identifier is required.';
    }
    if (!formData.short_description.trim()) {
      errors.short_description = 'Short description is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalMode === 'create') {
        const res = await createProjectAction(formData);
        setIsSubmitting(false);

        if (res.success && res.data) {
          setProjects((prev) => [res.data, ...prev]);
          setFeedback({
            type: 'success',
            message: `Project "${res.data.title}" successfully created!`,
          });
          setModalMode(null);
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to create project.',
          });
        }
      } else if (modalMode === 'edit' && currentProject) {
        const res = await updateProjectAction(currentProject.id, formData);
        setIsSubmitting(false);

        if (res.success && res.data) {
          setProjects((prev) =>
            prev.map((p) => (p.id === currentProject.id ? res.data : p))
          );
          setFeedback({
            type: 'success',
            message: `Project "${res.data.title}" successfully updated!`,
          });
          setModalMode(null);
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to update project.',
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

  const handleOpenDelete = (project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteProjectAction(projectToDelete.id);
      setIsDeleting(false);

      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        setFeedback({
          type: 'success',
          message: `Project "${projectToDelete.title}" permanently deleted.`,
        });
        setProjectToDelete(null);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to delete project.',
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
    <AdminLayout pageTitle="Projects Management">
      <div className={styles.container}>
        {/* Header Bar */}
        <div className={styles.introHeader}>
          <div>
            <h2 className={styles.introTitle}>Showcase Projects</h2>
            <p className={styles.introDesc}>
              Create, edit, organize, and delete portfolio showcase projects.
              Manage status flags, live URLs, GitHub repositories, and tech stacks.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/projects" target="_blank" className={styles.viewPublicLink}>
              <span>View Public Projects</span>
              <ExternalLink size={14} />
            </Link>
            <button
              type="button"
              onClick={handleOpenCreate}
              className={styles.addBtn}
            >
              <Plus size={16} />
              <span>Add Project</span>
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

        {/* Projects List Card */}
        <div className={styles.tableCard}>
          {projects.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Year</th>
                    <th>Technologies</th>
                    <th>Links</th>
                    <th className={styles.actionsHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => {
                    const techList = Array.isArray(project.technologies)
                      ? project.technologies
                      : typeof project.technologies === 'string'
                      ? project.technologies.split(',').map((t) => t.trim())
                      : [];

                    return (
                      <tr key={project.id || project.slug}>
                        <td className={styles.titleCell}>
                          <div className={styles.projectWrapper}>
                            {project.thumbnail_url ? (
                              <div className={styles.thumbnailBox}>
                                <Image
                                  src={project.thumbnail_url}
                                  alt={project.title}
                                  fill
                                  sizes="44px"
                                  className={styles.thumbImg}
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className={styles.thumbnailFallback}>
                                <FolderGit2 size={18} />
                              </div>
                            )}

                            <div>
                              <div className={styles.titleRow}>
                                <span className={styles.projectTitle}>{project.title}</span>
                                {project.is_featured && (
                                  <span className={styles.featuredBadge}>
                                    <Star size={11} />
                                    <span>Featured</span>
                                  </span>
                                )}
                              </div>
                              <span className={styles.projectSlug}>/{project.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              project.status === 'Completed'
                                ? styles.statusCompleted
                                : project.status === 'In Progress'
                                ? styles.statusProgress
                                : styles.statusArchived
                            }`}
                          >
                            {project.status || 'Completed'}
                          </span>
                        </td>

                        <td className={styles.yearCell}>{project.project_year || '2026'}</td>

                        <td className={styles.techCell}>
                          <div className={styles.techChips}>
                            {techList.slice(0, 3).map((tech) => (
                              <span key={tech} className={styles.techChip}>
                                {tech}
                              </span>
                            ))}
                            {techList.length > 3 && (
                              <span className={styles.techMore}>+{techList.length - 3}</span>
                            )}
                          </div>
                        </td>

                        <td className={styles.linksCell}>
                          <div className={styles.linksRow}>
                            {project.project_url && (
                              <a
                                href={project.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.linkIcon}
                                title="Live Demo"
                              >
                                <Globe size={15} />
                              </a>
                            )}
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.linkIcon}
                                title="GitHub Repository"
                              >
                                <Code2 size={15} />
                              </a>
                            )}
                          </div>
                        </td>

                        <td className={styles.actionsCell}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(project)}
                            className={styles.editBtn}
                            aria-label={`Edit ${project.title}`}
                          >
                            <Pencil size={15} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(project)}
                            className={styles.deleteBtn}
                            aria-label={`Delete ${project.title}`}
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No projects recorded yet in Supabase.</p>
              <button
                type="button"
                onClick={handleOpenCreate}
                className={styles.emptyAddBtn}
              >
                <Plus size={16} />
                <span>Add your first project</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal: Create / Edit Project */}
        {modalMode && (
          <div className={styles.modalOverlay} onClick={handleCloseModal} role="dialog">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {modalMode === 'create' ? 'Add New Project' : `Edit Project: ${currentProject?.title}`}
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
                    <label htmlFor="title" className={styles.label}>
                      Project Title <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. HealthLog Analytics"
                      className={`${styles.input} ${fieldErrors.title ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.title && (
                      <span className={styles.errorText}>{fieldErrors.title}</span>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="slug" className={styles.label}>
                      URL Slug Identifier <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      required
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="e.g. healthlog-analytics"
                      className={`${styles.input} ${fieldErrors.slug ? styles.inputError : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.slug && (
                      <span className={styles.errorText}>{fieldErrors.slug}</span>
                    )}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="short_description" className={styles.label}>
                    Short Description <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="short_description"
                    name="short_description"
                    rows={2}
                    required
                    value={formData.short_description}
                    onChange={handleChange}
                    placeholder="Concise 1-2 sentence summary displayed on portfolio project cards."
                    className={`${styles.textarea} ${
                      fieldErrors.short_description ? styles.inputError : ''
                    }`}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.short_description && (
                    <span className={styles.errorText}>{fieldErrors.short_description}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="full_description" className={styles.label}>
                    Detailed Full Description
                  </label>
                  <textarea
                    id="full_description"
                    name="full_description"
                    rows={4}
                    value={formData.full_description}
                    onChange={handleChange}
                    placeholder="Comprehensive overview of architecture, challenges solved, database design, and key features."
                    className={styles.textarea}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Thumbnail Image */}
                <ImagePreviewInput
                  id="thumbnail_url"
                  name="thumbnail_url"
                  label="Thumbnail Image URL / Path"
                  value={formData.thumbnail_url}
                  onChange={(val) => setFormData((prev) => ({ ...prev, thumbnail_url: val }))}
                  placeholder="/images/projects/... or https://..."
                  presets={[
                    { label: 'Placeholder 1', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Placeholder 2', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80' },
                  ]}
                  helpText="Preview image shown on portfolio cards."
                  disabled={isSubmitting}
                />

                <div className={styles.fieldGroup}>
                  <label htmlFor="technologies" className={styles.label}>
                    Technologies (Comma-separated)
                  </label>
                  <input
                    id="technologies"
                    name="technologies"
                    type="text"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="Next.js, PostgreSQL, Tailwind CSS, Supabase"
                    className={styles.input}
                    disabled={isSubmitting}
                  />
                  <span className={styles.helpText}>Enter technologies separated by commas.</span>
                </div>

                <div className={styles.modalGrid}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="project_url" className={styles.label}>
                      Live Demo URL
                    </label>
                    <input
                      id="project_url"
                      name="project_url"
                      type="url"
                      value={formData.project_url}
                      onChange={handleChange}
                      placeholder="https://myproject.com"
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="github_url" className={styles.label}>
                      GitHub Repository URL
                    </label>
                    <input
                      id="github_url"
                      name="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={handleChange}
                      placeholder="https://github.com/user/repo"
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.modalGridThree}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="status" className={styles.label}>
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={styles.select}
                      disabled={isSubmitting}
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="project_year" className={styles.label}>
                      Project Year
                    </label>
                    <input
                      id="project_year"
                      name="project_year"
                      type="text"
                      value={formData.project_year}
                      onChange={handleChange}
                      placeholder="2026"
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
                    <span>Highlight as Featured Project on Homepage</span>
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
                        <span>{modalMode === 'create' ? 'Create Project' : 'Save Changes'}</span>
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
          isOpen={Boolean(projectToDelete)}
          title="Delete Project"
          message="Are you sure you want to permanently delete this project? It will be removed from both the admin dashboard and public portfolio."
          itemName={projectToDelete?.title}
          confirmLabel="Delete Project"
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setProjectToDelete(null)}
        />
      </div>
    </AdminLayout>
  );
}
