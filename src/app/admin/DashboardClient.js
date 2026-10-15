'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Plus,
  ArrowRight,
  Database,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { seedStarterDataAction } from './actions';
import styles from './dashboard.module.css';

export default function DashboardClient({
  userEmail,
  stats,
  recentProjects,
  recentSkills,
}) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSeedData = async () => {
    if (!confirm('This will populate empty database tables with starter portfolio content. Continue?')) {
      return;
    }

    setIsSeeding(true);
    setFeedback(null);

    const res = await seedStarterDataAction();
    setIsSeeding(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Starter data successfully seeded! Refreshing dashboard...' });
      window.location.reload();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to seed starter data.' });
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      count: stats.projectsCount,
      label: 'Showcase Items',
      href: '/admin/projects',
      icon: FolderGit2,
      color: 'purple',
    },
    {
      title: 'Skills Catalog',
      count: stats.skillsCount,
      label: 'Technical Capabilities',
      href: '/admin/skills',
      icon: Cpu,
      color: 'blue',
    },
    {
      title: 'Work Experience',
      count: stats.experienceCount,
      label: 'Career Milestones',
      href: '/admin/experience',
      icon: Briefcase,
      color: 'emerald',
    },
    {
      title: 'Education',
      count: stats.educationCount,
      label: 'Academic Credentials',
      href: '/admin/education',
      icon: GraduationCap,
      color: 'amber',
    },
  ];

  return (
    <AdminLayout pageTitle="Dashboard Overview">
      <div className={styles.dashboardContainer}>
        {/* Welcome Banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeInfo}>
            <h2 className={styles.welcomeTitle}>Welcome back, Portfolio Admin</h2>
            <p className={styles.welcomeSubtitle}>
              Logged in as <strong className={styles.emailHighlight}>{userEmail}</strong> &bull; Supabase PostgreSQL Connected
            </p>
          </div>

          <div className={styles.welcomeActions}>
            <Link href="/" target="_blank" className={styles.viewSiteBtn}>
              <span>View Live Portfolio</span>
              <ExternalLink size={15} />
            </Link>
            {stats.projectsCount === 0 && stats.skillsCount === 0 && (
              <button
                type="button"
                onClick={handleSeedData}
                disabled={isSeeding}
                className={styles.seedBtn}
                title="Populate empty tables with starter portfolio data"
              >
                {isSeeding ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    <span>Seeding Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Seed Starter Content</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`${styles.feedbackBanner} ${
              feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={18} className={styles.feedbackIcon} />
            ) : (
              <AlertCircle size={18} className={styles.feedbackIcon} />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <section className={styles.metricsGrid} aria-label="Portfolio Metrics">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href} className={styles.statCard}>
                <div className={styles.statCardTop}>
                  <div className={`${styles.statIconBadge} ${styles[card.color]}`}>
                    <Icon size={22} />
                  </div>
                  <span className={styles.statCount}>{card.count}</span>
                </div>
                <div className={styles.statCardBottom}>
                  <h3 className={styles.statTitle}>{card.title}</h3>
                  <span className={styles.statLabel}>{card.label}</span>
                </div>
                <div className={styles.statCardFooter}>
                  <span>Manage</span>
                  <ArrowRight size={14} className={styles.arrowIcon} />
                </div>
              </Link>
            );
          })}
        </section>

        {/* Quick Actions Bar */}
        <div className={styles.quickBar}>
          <h3 className={styles.quickTitle}>Quick Management Shortcuts</h3>
          <div className={styles.quickActions}>
            <Link href="/admin/projects" className={styles.quickBtn}>
              <Plus size={16} />
              <span>Add New Project</span>
            </Link>
            <Link href="/admin/skills" className={styles.quickBtn}>
              <Plus size={16} />
              <span>Add New Skill</span>
            </Link>
            <Link href="/admin/experience" className={styles.quickBtn}>
              <Plus size={16} />
              <span>Add Work History</span>
            </Link>
            <Link href="/admin/settings" className={styles.quickBtnSecondary}>
              <span>Edit Site Settings</span>
            </Link>
            <Link href="/admin/about" className={styles.quickBtnSecondary}>
              <span>Edit Biography</span>
            </Link>
          </div>
        </div>

        {/* Two-Column Overview */}
        <div className={styles.overviewGrid}>
          {/* Recent Projects Table */}
          <div className={styles.overviewCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Recent Projects</h3>
                <span className={styles.cardSubtitle}>Current portfolio showcase items</span>
              </div>
              <Link href="/admin/projects" className={styles.cardLink}>
                <span>View All ({stats.projectsCount})</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {recentProjects && recentProjects.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.slice(0, 5).map((project) => (
                      <tr key={project.id || project.slug}>
                        <td className={styles.primaryCell}>
                          <span className={styles.itemTitle}>{project.title}</span>
                          <span className={styles.itemMeta}>{project.slug}</span>
                        </td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              project.status === 'Completed'
                                ? styles.statusCompleted
                                : styles.statusProgress
                            }`}
                          >
                            {project.status || 'Active'}
                          </span>
                        </td>
                        <td className={styles.metaCell}>{project.project_year || '2026'}</td>
                        <td>
                          <Link href="/admin/projects" className={styles.actionBtn}>
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyCard}>
                <p>No projects recorded yet in Supabase.</p>
                <Link href="/admin/projects" className={styles.emptyActionBtn}>
                  Add your first project
                </Link>
              </div>
            )}
          </div>

          {/* Recent Skills Table */}
          <div className={styles.overviewCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Key Skills</h3>
                <span className={styles.cardSubtitle}>Categorized capabilities list</span>
              </div>
              <Link href="/admin/skills" className={styles.cardLink}>
                <span>View All ({stats.skillsCount})</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {recentSkills && recentSkills.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Category</th>
                      <th>Level</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSkills.slice(0, 5).map((skill) => (
                      <tr key={skill.id || skill.name}>
                        <td className={styles.primaryCell}>
                          <span className={styles.itemTitle}>{skill.name}</span>
                          {skill.is_featured && <span className={styles.featuredBadge}>Featured</span>}
                        </td>
                        <td>
                          <span className={styles.categoryBadge}>{skill.category}</span>
                        </td>
                        <td className={styles.levelCell}>
                          <div className={styles.levelBarWrapper}>
                            <div
                              className={styles.levelBarFill}
                              style={{ width: `${skill.proficiency_level || 80}%` }}
                            />
                          </div>
                          <span className={styles.levelNumber}>{skill.proficiency_level || 80}%</span>
                        </td>
                        <td>
                          <Link href="/admin/skills" className={styles.actionBtn}>
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyCard}>
                <p>No skills recorded yet in Supabase.</p>
                <Link href="/admin/skills" className={styles.emptyActionBtn}>
                  Add your first skill
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Database & Security Architecture Summary */}
        <div className={styles.systemCard}>
          <div className={styles.systemHeader}>
            <Database size={20} className={styles.systemIcon} />
            <h3 className={styles.systemTitle}>System &amp; Database Architecture</h3>
          </div>
          <p className={styles.systemDesc}>
            Content edited through this dashboard updates the PostgreSQL database on Supabase in real-time.
            Row Level Security (RLS) ensures public visitors can only read published content, while write operations
            are cryptographically restricted to your authenticated administrator session.
          </p>
          <div className={styles.systemPills}>
            <span className={styles.systemPill}>Single-Owner Protection</span>
            <span className={styles.systemPill}>Instant Server Revalidation</span>
            <span className={styles.systemPill}>PostgreSQL Normalized Schemas</span>
            <span className={styles.systemPill}>Row Level Security Active</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
