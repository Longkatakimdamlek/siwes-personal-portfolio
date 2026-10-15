import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0b0b12',
      color: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem 1rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '480px',
        padding: '2.5rem',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#a78bfa' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0 0 1rem' }}>Page Not Found</h2>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The requested page could not be located. It may have moved or no longer exists.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <Home size={18} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
