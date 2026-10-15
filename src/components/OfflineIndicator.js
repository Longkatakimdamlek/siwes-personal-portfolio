'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import styles from './OfflineIndicator.module.css';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  if (showReconnected) {
    return (
      <aside
        className={`${styles.indicator} ${styles.reconnected}`}
        role="status"
        aria-live="polite"
        aria-label="Internet connection restored"
      >
        <span className={styles.pulseDotGreen} />
        <Wifi size={16} aria-hidden="true" />
        <span>Connected — Back online</span>
      </aside>
    );
  }

  return (
    <aside
      className={`${styles.indicator} ${styles.offline}`}
      role="status"
      aria-live="assertive"
      aria-label="Application is in offline mode"
    >
      <span className={styles.pulseDotAmber} />
      <WifiOff size={16} aria-hidden="true" />
      <span>Offline Mode — Viewing cached portfolio</span>
    </aside>
  );
}
