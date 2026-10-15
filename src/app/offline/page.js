import Link from 'next/link';
import { WifiOff, Home } from 'lucide-react';
import RetryButton from './RetryButton';
import styles from './page.module.css';

export const metadata = {
  title: 'Offline | SIWES Developer Portfolio',
  description: 'You are currently offline. Cached portfolio sections remain accessible.',
};

export default function OfflinePage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <WifiOff size={42} className={styles.icon} aria-hidden="true" />
        </div>

        <h1 className={styles.title}>You are currently offline</h1>
        <p className={styles.subtitle}>
          It looks like your internet connection was temporarily interrupted.
          Previously loaded portfolio pages and project assets are still accessible in your offline cache.
        </p>

        <div className={styles.tipsBox}>
          <h2 className={styles.tipsHeading}>While offline, you can:</h2>
          <ul className={styles.tipsList}>
            <li>Browse previously visited portfolio sections (Home, About, Skills, Projects).</li>
            <li>Review project case studies and technical highlights already cached.</li>
            <li>Messages entered into the contact form will notify you to reconnect.</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <RetryButton />

          <Link href="/" className={styles.homeLink}>
            <Home size={18} aria-hidden="true" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
