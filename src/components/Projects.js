'use client';

import { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';

export default function Projects({ projects = [] }) {
  const [filter, setFilter] = useState('All');

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects;
    if (filter === 'Featured') return projects.filter((p) => p.is_featured);
    if (filter === 'Completed') return projects.filter((p) => p.status === 'Completed');
    if (filter === 'In Progress') return projects.filter((p) => p.status === 'In Progress');
    return projects;
  }, [projects, filter]);

  const filterTabs = ['All', 'Featured', 'Completed', 'In Progress'];

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.sectionKicker}>03. Selected Work</div>
          <h2 className={styles.title}>Featured Projects</h2>
          <p className={styles.subtitle}>
            A showcase of full-stack web applications, database architectures, and software solutions
            developed with modern engineering standards.
          </p>
        </div>

        {/* Filter Controls */}
        <div className={styles.filterRow} role="tablist" aria-label="Project filters">
          {filterTabs.map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No projects match the selected criteria.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
