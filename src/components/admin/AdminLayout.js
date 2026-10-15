'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  User,
  Cpu,
  FolderGit2,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import LogoutButton from './LogoutButton';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  { label: 'About & Profile', href: '/admin/about', icon: User },
  { label: 'Skills', href: '/admin/skills', icon: Cpu },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Education', href: '/admin/education', icon: GraduationCap },
];

export default function AdminLayout({ children, pageTitle = 'Dashboard' }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className={styles.adminRoot}>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar Navigation */}
      <aside
        className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}
        aria-label="Admin Navigation Sidebar"
      >
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.brandLink} onClick={closeMobileMenu}>
            <div className={styles.brandBadge}>
              <ShieldCheck size={20} className={styles.brandIcon} aria-hidden="true" />
            </div>
            <div>
              <span className={styles.brandTitle}>Admin Center</span>
              <span className={styles.brandSubtitle}>SIWES Portfolio</span>
            </div>
          </Link>
          <button
            type="button"
            className={styles.mobileCloseBtn}
            onClick={closeMobileMenu}
            aria-label="Close sidebar navigation"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navGroupLabel}>Content Management</div>
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={18} className={styles.navIcon} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.publicSiteLink}
          >
            <ExternalLink size={16} aria-hidden="true" />
            <span>View Live Portfolio</span>
          </Link>
          <div className={styles.logoutWrapper}>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        {/* Top Header Bar */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.mobileMenuTrigger}
              onClick={toggleMobileMenu}
              aria-label="Open sidebar menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
            <div className={styles.titleWrapper}>
              <h1 className={styles.pageTitle}>{pageTitle}</h1>
            </div>
          </div>

          <div className={styles.headerRight}>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerPublicBtn}
              aria-label="Open public portfolio website in new tab"
            >
              <span>Public Site</span>
              <ExternalLink size={14} aria-hidden="true" />
            </Link>
            <div className={styles.headerLogout}>
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <main className={styles.contentBody}>{children}</main>
      </div>
    </div>
  );
}
