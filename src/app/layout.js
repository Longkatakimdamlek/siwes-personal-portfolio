import '@/styles/globals.css';
import PWARegistration from '@/components/PWARegistration';

export const viewport = {
  themeColor: '#0b0b12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: 'SIWES Developer Portfolio',
  description:
    'Personal full-stack developer portfolio website built with Next.js and Supabase for SIWES project.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Portfolio',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skipLink">
          Skip to main content
        </a>
        {children}
        <PWARegistration />
      </body>
    </html>
  );
}
