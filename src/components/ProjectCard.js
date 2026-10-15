'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Code2, Sparkles, Folder } from 'lucide-react';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
  const [imageError, setImageError] = useState(false);

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  return (
    <div className={styles.card}>
      {/* Thumbnail Area */}
      <div className={styles.thumbnailContainer}>
        {project.thumbnail_url && !imageError ? (
          <Image
            src={project.thumbnail_url}
            alt={`${project.title} screenshot`}
            width={600}
            height={340}
            className={styles.thumbnail}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={styles.thumbnailFallback}>
            <Folder size={40} className={styles.fallbackIcon} aria-hidden="true" />
            <span className={styles.fallbackTitle}>{project.title}</span>
          </div>
        )}

        {/* Featured Tag & Status */}
        <div className={styles.overlayBadges}>
          {project.is_featured && (
            <span className={styles.featuredTag}>
              <Sparkles size={12} aria-hidden="true" />
              <span>Featured</span>
            </span>
          )}
          <span
            className={`${styles.statusTag} ${
              project.status === 'Completed' ? styles.statusCompleted : styles.statusProgress
            }`}
          >
            {project.status || 'Active'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className={styles.body}>
        {/* Year and metadata */}
        <div className={styles.metaRow}>
          <span className={styles.yearText}>{project.project_year || '2026'}</span>
          <span className={styles.metaDivider} aria-hidden="true">
            &bull;
          </span>
          <span className={styles.clientType}>Full-Stack Application</span>
        </div>

        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.short_description}</p>

        {/* Technologies as clean unboxed typography with separators */}
        {technologies.length > 0 && (
          <div className={styles.techStack} aria-label="Technologies used">
            {technologies.map((tech, idx) => (
              <span key={tech} className={styles.techItem}>
                <span className={styles.techName}>{tech}</span>
                {idx < technologies.length - 1 && (
                  <span className={styles.techDot} aria-hidden="true">
                    &bull;
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtnPrimary}
              aria-label={`View live demo of ${project.title}`}
            >
              <span>Live Demo</span>
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtnSecondary}
              aria-label={`View GitHub source code of ${project.title}`}
            >
              <Code2 size={15} aria-hidden="true" />
              <span>Source</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
