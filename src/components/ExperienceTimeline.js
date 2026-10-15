import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import styles from './ExperienceTimeline.module.css';

export default function ExperienceTimeline({ experiences = [], education = [] }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="experience" className={styles.experienceSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.sectionKicker}>04. Trajectory</div>
          <h2 className={styles.title}>Experience &amp; Education</h2>
          <p className={styles.subtitle}>
            My professional career path, industrial training achievements, and academic background in
            Computer Science.
          </p>
        </div>

        <div className={styles.columns}>
          {/* Work Experience Column */}
          <div className={styles.column}>
            <div className={styles.columnTitleRow}>
              <div className={styles.columnIconBox}>
                <Briefcase size={20} className={styles.columnIcon} aria-hidden="true" />
              </div>
              <h3 className={styles.columnTitle}>Work &amp; Internship Experience</h3>
            </div>

            <div className={styles.timeline}>
              {experiences.map((exp) => (
                <div key={exp.id || exp.role_title} className={styles.timelineItem}>
                  <div className={styles.timelineMarker} />
                  <div className={styles.timelineCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.dateBadge}>
                        <Calendar size={13} aria-hidden="true" />
                        <span>
                          {formatDate(exp.start_date)} -{' '}
                          {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </span>
                      </span>
                      {exp.is_current && <span className={styles.currentTag}>Current Role</span>}
                    </div>

                    <h4 className={styles.roleTitle}>{exp.role_title}</h4>
                    <div className={styles.companyMeta}>
                      <span className={styles.companyName}>{exp.company_name}</span>
                      {exp.location && (
                        <>
                          <span className={styles.metaDot}>&bull;</span>
                          <span className={styles.location}>
                            <MapPin size={13} aria-hidden="true" />
                            <span>{exp.location}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {exp.description && (
                      <p className={styles.itemDescription}>{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div className={styles.column}>
            <div className={styles.columnTitleRow}>
              <div className={styles.columnIconBox}>
                <GraduationCap size={20} className={styles.columnIcon} aria-hidden="true" />
              </div>
              <h3 className={styles.columnTitle}>Academic Qualifications</h3>
            </div>

            <div className={styles.timeline}>
              {education.map((edu) => (
                <div key={edu.id || edu.degree} className={styles.timelineItem}>
                  <div className={styles.timelineMarker} />
                  <div className={styles.timelineCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.dateBadge}>
                        <Calendar size={13} aria-hidden="true" />
                        <span>
                          {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                        </span>
                      </span>
                    </div>

                    <h4 className={styles.roleTitle}>{edu.degree}</h4>
                    <div className={styles.companyMeta}>
                      <span className={styles.companyName}>{edu.institution}</span>
                      <span className={styles.metaDot}>&bull;</span>
                      <span className={styles.fieldOfStudy}>{edu.field_of_study}</span>
                    </div>

                    {edu.description && (
                      <p className={styles.itemDescription}>{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
