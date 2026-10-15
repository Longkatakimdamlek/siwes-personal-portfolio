import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Briefcase, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { resolveAvatarUrl } from '@/lib/avatar';
import styles from './About.module.css';

export default function About({ profile, siteSettings }) {
  const name = profile?.full_name || 'Software Developer';
  const headline = profile?.headline || 'Full-Stack Software Engineer';
  const bio =
    profile?.biography ||
    'Currently completing my Students Industrial Work Experience Scheme (SIWES) software development internship. Specialized in building performant, accessible web applications with Next.js, Node.js, and PostgreSQL.';

  const avatarUrl = resolveAvatarUrl(profile?.avatar_url, siteSettings?.hero_image_url);
  const location = profile?.location || 'Nigeria';
  const yearsExp = profile?.years_of_experience || 2;

  const keyStrengths = [
    'Clean full-stack architecture with Next.js App Router & React 19',
    'Relational database design & Row Level Security in PostgreSQL/Supabase',
    'Component-driven styling with CSS Modules and zero-runtime overhead',
    'Commitment to web accessibility, Core Web Vitals, and clean code',
  ];

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionKicker}>01. About Me</div>
          <h2 className={styles.sectionTitle}>Crafting Digital Products with Purpose</h2>
          <p className={styles.sectionSubtitle}>
            Bridging conceptual design and engineering rigor to build scalable web applications.
          </p>
        </div>

        {/* Content Grid */}
        <div className={styles.grid}>
          {/* Left Column: Portrait & Quick Facts */}
          <div className={styles.profileCard}>
            <div className={styles.imageContainer}>
              <Image
                src={avatarUrl}
                alt={`${name} portrait`}
                width={320}
                height={320}
                className={styles.portrait}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className={styles.cardDetails}>
              <h3 className={styles.cardName}>{name}</h3>
              <p className={styles.cardHeadline}>{headline}</p>

              <div className={styles.metaList}>
                <div className={styles.metaItem}>
                  <MapPin size={16} className={styles.metaIcon} aria-hidden="true" />
                  <span>{location}</span>
                </div>
                <div className={styles.metaItem}>
                  <Briefcase size={16} className={styles.metaIcon} aria-hidden="true" />
                  <span>{yearsExp}+ Years Practical Experience</span>
                </div>
                <div className={styles.metaItem}>
                  <GraduationCap size={16} className={styles.metaIcon} aria-hidden="true" />
                  <span>SIWES Software Engineering Intern</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Narrative & Stats */}
          <div className={styles.bioColumn}>
            <div className={styles.narrativeBox}>
              <h3 className={styles.bioHeading}>Engineering Background</h3>
              <p className={styles.bioParagraph}>{bio}</p>
              <p className={styles.bioParagraph}>
                My development workflow centers around writing maintainable JavaScript, structuring
                resilient relational database models, and building intuitive user interfaces that
                prioritize speed, responsiveness, and accessibility across all devices.
              </p>
            </div>

            {/* Strengths List */}
            <div className={styles.strengthsBox}>
              <h4 className={styles.strengthsTitle}>Core Competencies &amp; Focus:</h4>
              <ul className={styles.strengthsList}>
                {keyStrengths.map((strength) => (
                  <li key={strength} className={styles.strengthItem}>
                    <CheckCircle2 size={18} className={styles.checkIcon} aria-hidden="true" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick CTAs */}
            <div className={styles.actionRow}>
              <Link href="#skills" className={styles.textLink}>
                <span>Review Technical Skills</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="#projects" className={styles.textLink}>
                <span>View Portfolio Projects</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
