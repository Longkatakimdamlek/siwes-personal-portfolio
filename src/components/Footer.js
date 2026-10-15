'use client';

import Link from 'next/link';
import { GitBranch, Globe, MessageCircle, Mail, ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer({ siteSettings, profile }) {
  const brandName = siteSettings?.site_name || 'DevPortfolio';
  const email = siteSettings?.contact_email || 'developer@example.com';
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Tier */}
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <Link href="/" className={styles.brand} aria-label={`${brandName} Home`}>
              <span className={styles.brandPrefix}>&lt;</span>
              <span className={styles.brandText}>{brandName}</span>
              <span className={styles.brandSuffix}>/&gt;</span>
            </Link>
            <p className={styles.tagline}>
              Full-Stack Developer portfolio engineered with Next.js, React 19, and Supabase PostgreSQL
              for SIWES software development training.
            </p>
          </div>

          <div className={styles.navBlock}>
            <h4 className={styles.columnTitle}>Navigation</h4>
            <ul className={styles.navList}>
              <li>
                <Link href="/#home" className={styles.navLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className={styles.navLink}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/#skills" className={styles.navLink}>
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/#projects" className={styles.navLink}>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#experience" className={styles.navLink}>
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/#contact" className={styles.navLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.connectBlock}>
            <h4 className={styles.columnTitle}>Get in Touch</h4>
            <p className={styles.contactEmailText}>
              Feel free to reach out directly via email or professional profiles:
            </p>
            <a href={`mailto:${email}`} className={styles.emailLink}>
              <Mail size={16} aria-hidden="true" />
              <span>{email}</span>
            </a>

            <div className={styles.socialIconsRow}>
              {siteSettings?.github_url && (
                <a
                  href={siteSettings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconBtn}
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
                  className={styles.iconBtn}
                  aria-label="LinkedIn Profile"
                >
                  <Globe size={18} />
                </a>
              )}
              {siteSettings?.twitter_url && (
                <a
                  href={siteSettings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconBtn}
                  aria-label="Twitter Profile"
                >
                  <MessageCircle size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Tier */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; {currentYear} {brandName}. All rights reserved &bull; SIWES Software Development Project
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backToTopBtn}
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
