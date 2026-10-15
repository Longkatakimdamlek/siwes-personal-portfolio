'use client';

import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Check, Sparkles } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import styles from './PWAInstallButton.module.css';

export default function PWAInstallButton({ variant = 'header' }) {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWA();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowIOSModal(false);
    };
    if (showIOSModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showIOSModal]);

  // If already installed and running standalone, hide the prompt
  if (isInstalled && !installedSuccess) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await promptInstall();
      if (outcome) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 5000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // In browsers where beforeinstallprompt hasn't fired yet or is not supported
      setShowIOSModal(true);
    }
  };

  const isDrawerVariant = variant === 'drawer';

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`${styles.installBtn} ${isDrawerVariant ? styles.drawerBtn : ''}`}
        aria-label="Install Portfolio application to your home screen or desktop"
        title="Install as Progressive Web App"
      >
        <Download size={15} className={styles.icon} aria-hidden="true" />
        <span className={styles.btnText}>Install App</span>
      </button>

      {/* iOS & Manual Guide Modal */}
      {showIOSModal && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-heading"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setShowIOSModal(false)}
              aria-label="Close installation instructions"
            >
              <X size={20} />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.appIconBadge}>
                <Sparkles size={22} className={styles.sparkleIcon} />
              </div>
              <div>
                <h3 id="pwa-install-heading" className={styles.modalTitle}>
                  Install Developer Portfolio
                </h3>
                <p className={styles.modalSubtitle}>
                  Get fast, offline-ready access from your home screen or desktop.
                </p>
              </div>
            </div>

            <div className={styles.instructionsList}>
              {isIOS ? (
                <>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNum}>1</div>
                    <div className={styles.stepContent}>
                      <span className={styles.stepTitle}>Tap the Share button</span>
                      <p className={styles.stepDesc}>
                        In Safari bottom toolbar, tap the <Share size={14} className={styles.inlineIcon} /> <strong>Share</strong> icon.
                      </p>
                    </div>
                  </div>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNum}>2</div>
                    <div className={styles.stepContent}>
                      <span className={styles.stepTitle}>Select &apos;Add to Home Screen&apos;</span>
                      <p className={styles.stepDesc}>
                        Scroll down the menu options and tap <PlusSquare size={14} className={styles.inlineIcon} /> <strong>Add to Home Screen</strong>.
                      </p>
                    </div>
                  </div>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNum}>3</div>
                    <div className={styles.stepContent}>
                      <span className={styles.stepTitle}>Launch standalone app</span>
                      <p className={styles.stepDesc}>
                        Tap <strong>Add</strong> in the top-right corner to place the app on your home screen.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNum}>1</div>
                    <div className={styles.stepContent}>
                      <span className={styles.stepTitle}>Browser Menu</span>
                      <p className={styles.stepDesc}>
                        Look for the <strong>Install</strong> or <strong>Add to Desktop</strong> icon in your browser URL bar or settings menu (⋮).
                      </p>
                    </div>
                  </div>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNum}>2</div>
                    <div className={styles.stepContent}>
                      <span className={styles.stepTitle}>Confirm Installation</span>
                      <p className={styles.stepDesc}>
                        Click <strong>Install</strong> to add the portfolio to your applications with standalone window support.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.dismissBtn}
                onClick={() => setShowIOSModal(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
