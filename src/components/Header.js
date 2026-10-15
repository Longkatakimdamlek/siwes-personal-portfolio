'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import PWAInstallButton from './PWAInstallButton';
import styles from './Header.module.css';

export default function Header({ siteSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const brandName = siteSettings?.site_name || 'DevPortfolio';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change or Escape key
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Zone 1: Brand Wordmark */}
        <Link href="/" className={styles.brand} aria-label={`${brandName} Home`}>
          <span className={styles.brandPrefix}>&lt;</span>
          <span className={styles.brandText}>{brandName}</span>
          <span className={styles.brandSuffix}>/&gt;</span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className={styles.actionZone}>
          <PWAInstallButton variant="header" />

          <Link href="/#contact" className={styles.ctaButton}>
            <span>Let&apos;s Connect</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal={isOpen ? 'true' : 'false'}
        aria-label="Mobile navigation menu"
      >
        <div className={styles.mobileNavContainer}>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className={styles.mobileCtaButton}
              onClick={() => setIsOpen(false)}
            >
              <span>Let&apos;s Connect</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <PWAInstallButton variant="drawer" />
          </nav>
        </div>
      </div>
    </header>
  );
}
