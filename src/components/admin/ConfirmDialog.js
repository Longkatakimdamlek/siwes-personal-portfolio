'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Deletion',
  message,
  itemName,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel?.();
      }
    };

    if (isOpen) {
      confirmBtnRef.current?.focus();
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconCircle}>
          <AlertTriangle size={24} className={styles.warningIcon} aria-hidden="true" />
        </div>

        <h3 id="confirm-dialog-title" className={styles.title}>
          {title}
        </h3>

        <p className={styles.message}>
          {message || 'Are you sure you want to permanently delete this item? This action cannot be undone.'}
        </p>

        {itemName && (
          <div className={styles.itemBadge}>
            <strong>Target:</strong> &ldquo;{itemName}&rdquo;
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className={styles.cancelBtn}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={styles.confirmBtn}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
