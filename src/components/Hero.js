import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail, GitBranch, Globe, Sparkles } from 'lucide-react';
import { resolveAvatarUrl } from '@/lib/avatar';
import styles from './Hero.module.css';

export default function Hero({ siteSettings, profile }) {
  const headline = siteSettings?.hero_title || 'Building Scalable Web Applications';
  const subtitle = siteSettings?.hero_subtitle || 'Full-Stack Software Engineer & SIWES Intern';
  const description =
    siteSettings?.hero_description ||
    profile?.professional_intro ||
    'Specializing in Next.js, modern JavaScript, and scalable PostgreSQL architectures. Committed to high performance and clean design.';

  const avatarUrl = resolveAvatarUrl(profile?.avatar_url, siteSettings?.hero_image_url);
  const fullName = profile?.full_name || 'Software Developer';

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.contentColumn}>
          {/* Availability Status Kicker */}
          <div className={styles.statusKicker}>
            <span className={styles.pulseDot} />
            <span className={styles.kickerText}>
              Available for Opportunities &bull; SIWES Industrial Trainee
            </span>
          </div>

          {/* Hero Titles */}
          <h1 className={styles.title}>{headline}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.description}>{description}</p>

          {/* Action CTAs */}
          <div className={styles.ctaGroup}>
            <Link href="#projects" className={styles.primaryCta}>
              <span>Explore Projects</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="#contact" className={styles.secondaryCta}>
              <Mail size={18} aria-hidden="true" />
              <span>Contact Me</span>
            </Link>
          </div>

          {/* Social quick links */}
          <div className={styles.socialRow}>
            <span className={styles.socialLabel}>Connect:</span>
            {siteSettings?.github_url && (
              <a
                href={siteSettings.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub Profile"
              >
                <GitBranch size={18} />
              </a>
            )}
            {siteSettings?.linkedin_url && (
              <a
                href={siteSettings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn Profile"
              >
                <Globe size={18} />
              </a>
            )}
            <a
              href={`mailto:${siteSettings?.contact_email || 'developer@example.com'}`}
              className={styles.socialLink}
              aria-label="Send Direct Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Visual Column / Portrait Avatar */}
        <div className={styles.visualColumn}>
          <div className={styles.avatarCard}>
            <div className={styles.cardBackdropGlow} aria-hidden="true" />
            <div className={styles.imageWrapper}>
              <Image
                src={avatarUrl}
                alt={fullName}
                width={380}
                height={380}
                className={styles.avatarImage}
                priority
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={styles.badgeOverlay}>
              <Sparkles size={16} className={styles.sparkleIcon} aria-hidden="true" />
              <div className={styles.badgeText}>
                <strong>Full-Stack</strong> Next.js &bull; PostgreSQL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
