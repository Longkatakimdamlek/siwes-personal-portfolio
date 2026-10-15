import {
  Code,
  Layers,
  Cpu,
  Palette,
  Server,
  Network,
  Database,
  Cloud,
  GitBranch,
  Zap,
  Terminal,
  Globe,
  Star,
} from 'lucide-react';
import styles from './SkillCard.module.css';

const ICON_COMPONENTS = {
  code: Code,
  Code: Code,
  layers: Layers,
  Layers: Layers,
  atom: Layers,
  cpu: Cpu,
  Cpu: Cpu,
  palette: Palette,
  Palette: Palette,
  server: Server,
  Server: Server,
  network: Network,
  Network: Network,
  database: Database,
  Database: Database,
  cloud: Cloud,
  Cloud: Cloud,
  'git-branch': GitBranch,
  gitbranch: GitBranch,
  GitBranch: GitBranch,
  zap: Zap,
  Zap: Zap,
  terminal: Terminal,
  Terminal: Terminal,
  globe: Globe,
  Globe: Globe,
};

export default function SkillCard({ skill }) {
  const IconComponent = ICON_COMPONENTS[skill.icon_name] || Code;
  const level = skill.proficiency_level || 80;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <IconComponent size={22} className={styles.icon} aria-hidden="true" />
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.metaRow}>
            <span className={styles.category}>{skill.category}</span>
            {skill.is_featured && (
              <span className={styles.featuredBadge} title="Featured skill">
                <Star size={12} className={styles.starIcon} aria-hidden="true" />
                <span>Featured</span>
              </span>
            )}
          </div>
          <h3 className={styles.skillName}>{skill.name}</h3>
        </div>
      </div>

      {skill.description && <p className={styles.description}>{skill.description}</p>}

      {/* Proficiency Progress Bar */}
      <div className={styles.levelContainer}>
        <div className={styles.levelMeta}>
          <span className={styles.levelLabel}>Proficiency</span>
          <span className={styles.levelValue}>{level}%</span>
        </div>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={level}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`${skill.name} proficiency level: ${level}%`}
        >
          <div className={styles.progressFill} style={{ width: `${level}%` }} />
        </div>
      </div>
    </div>
  );
}
