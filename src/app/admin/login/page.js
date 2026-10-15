'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from './login.module.css';

function getSafeRedirect(target) {
  if (!target || typeof target !== 'string') return '/admin';
  // Prevent protocol-relative URLs, external domains, or backslash path traversal
  if (target.startsWith('/') && !target.startsWith('//') && !target.includes('\\')) {
    return target;
  }
  return '/admin';
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams?.get('redirectTo'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage(
        'Supabase client is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please verify your administrator credentials.');
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          setErrorMessage('Email address has not been confirmed in Supabase Auth.');
        } else {
          setErrorMessage(error.message || 'Authentication failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginCard}>
      {/* Card Header */}
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <Shield size={26} className={styles.shieldIcon} aria-hidden="true" />
        </div>
        <h1 className={styles.title}>Admin Access</h1>
        <p className={styles.subtitle}>
          Sign in with your Supabase administrator account to manage portfolio content.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className={styles.errorBanner} role="alert">
          <AlertCircle size={18} className={styles.errorIcon} aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className={styles.form} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="admin-email" className={styles.label}>
            Email Address
          </label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.inputIcon} aria-hidden="true" />
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="admin-password" className={styles.label}>
            Password
          </label>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} aria-hidden="true" />
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitBtn}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className={styles.spinner} aria-hidden="true" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      {/* Security Note */}
      <div className={styles.footerNote}>
        <p>Secured with Supabase Auth &bull; Single-Owner Administration</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Return to Portfolio Link */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Public Portfolio</span>
        </Link>
      </div>

      <div className={styles.cardWrapper}>
        <Suspense
          fallback={
            <div className={styles.loginCard} style={{ textAlign: 'center', padding: '3rem' }}>
              <Loader2 size={24} className={styles.spinner} style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>Loading authentication...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
