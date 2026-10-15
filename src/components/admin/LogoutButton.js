'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Direct navigation to admin login and refresh server state
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={styles.logoutBtn}
      aria-label="Sign out of admin session"
    >
      {isLoggingOut ? (
        <>
          <Loader2 size={16} className={styles.spinner} aria-hidden="true" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <LogOut size={16} aria-hidden="true" />
          <span>Sign Out</span>
        </>
      )}
    </button>
  );
}
