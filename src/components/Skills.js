'use client';

import { useState, useMemo } from 'react';
import SkillCard from './SkillCard';
import styles from './Skills.module.css';

export default function Skills({ skills = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [skills]);

  // Filter skills based on selected tab
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <section id="skills" className={styles.skillsSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.sectionKicker}>02. Technical Arsenal</div>
          <h2 className={styles.title}>Skills &amp; Technologies</h2>
          <p className={styles.subtitle}>
            A curated stack of modern languages, frameworks, and database architectures utilized in
            building real-world software.
          </p>
        </div>

        {/* Interactive Category Filter Tabs */}
        {categories.length > 1 && (
          <div className={styles.filterRow} role="tablist" aria-label="Skill categories">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No skills found in this category.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id || skill.name} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
