'use client';

import { RefreshCw } from 'lucide-react';
import styles from './page.module.css';

export default function RetryButton() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <button
      type="button"
      onClick={handleRetry}
      className={styles.retryBtn}
      aria-label="Reload and check connection"
    >
      <RefreshCw size={18} aria-hidden="true" />
      <span>Check Connection & Retry</span>
    </button>
  );
}
