'use client';

import { useEffect } from 'react';
import OfflineIndicator from './OfflineIndicator';

/**
 * Client component to register the PWA Service Worker on initial mount
 * and mount the global offline status indicator banner.
 */
export default function PWARegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const registerSW = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] SW register failed:', err);
        });
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
      return () => window.removeEventListener('load', registerSW);
    }
  }, []);

  return <OfflineIndicator />;
}
