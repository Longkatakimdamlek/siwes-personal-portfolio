'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React hook for PWA installation lifecycle, service worker registration,
 * and online/offline connectivity tracking.
 */
export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detect standalone (already installed) mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    // 2. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // 3. Track service worker readiness
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => {
          setSwRegistered(true);
        })
        .catch(() => {
          setSwRegistered(false);
        });
    }

    // 4. Capture browser beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent automatic mini-infobar on mobile Chrome
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // 5. Track app installation event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // 6. Online / offline connection events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Trigger browser installation prompt
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[PWA] Prompt error:', err);
      return false;
    }
  }, [deferredPrompt]);

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    isOnline,
    swRegistered,
    promptInstall,
  };
}
