'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, ImageOff, Check } from 'lucide-react';
import styles from './ImagePreviewInput.module.css';

export default function ImagePreviewInput({
  id,
  name,
  label,
  value = '',
  onChange,
  placeholder = '/images/... or https://...',
  presets = [],
  helpText,
  disabled = false,
}) {
  const [imgError, setImgError] = useState(false);

  const handleChange = (e) => {
    setImgError(false);
    onChange(e.target.value);
  };

  const handleSelectPreset = (presetUrl) => {
    setImgError(false);
    onChange(presetUrl);
  };

  const hasValue = Boolean(value && value.trim());

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputRow}>
        <div className={styles.fieldWrapper}>
          <input
            id={id}
            name={name}
            type="text"
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={styles.input}
          />
        </div>

        {/* Live Preview Box */}
        <div className={styles.previewBox} title="Image Preview">
          {hasValue && !imgError ? (
            <div className={styles.imgWrapper}>
              <Image
                src={value}
                alt="Preview"
                fill
                sizes="64px"
                className={styles.previewImg}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                unoptimized
              />
            </div>
          ) : hasValue && imgError ? (
            <div className={styles.errorBox} title="Image could not be loaded">
              <ImageOff size={20} className={styles.errorIcon} />
            </div>
          ) : (
            <div className={styles.emptyBox} title="No image URL specified">
              <ImageIcon size={20} className={styles.placeholderIcon} />
            </div>
          )}
        </div>
      </div>

      {helpText && <p className={styles.helpText}>{helpText}</p>}

      {/* Preset Asset Quick-Select */}
      {presets && presets.length > 0 && (
        <div className={styles.presetsWrapper}>
          <span className={styles.presetLabel}>Quick Presets:</span>
          <div className={styles.presetChips}>
            {presets.map((preset) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  disabled={disabled}
                  className={`${styles.presetBtn} ${isSelected ? styles.presetBtnActive : ''}`}
                >
                  {isSelected && <Check size={12} className={styles.checkIcon} />}
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
