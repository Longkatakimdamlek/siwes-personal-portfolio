import styles from './StatusCard.module.css';

export default function StatusCard({ title, status, description }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.badge}>{status}</span>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
