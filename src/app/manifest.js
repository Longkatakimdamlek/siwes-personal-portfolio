/**
 * @file src/app/manifest.js
 * @description Next.js App Router Web App Manifest generator
 * Returns compliant PWA manifest metadata.
 */

export default function manifest() {
  return {
    id: '/',
    name: 'SIWES Developer Portfolio',
    short_name: 'Portfolio',
    description:
      'Personal full-stack developer portfolio website built with Next.js and Supabase for SIWES project.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0b0b12',
    theme_color: '#0b0b12',
    categories: ['portfolio', 'developer', 'education', 'productivity'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Projects',
        short_name: 'Projects',
        description: 'Explore featured portfolio projects',
        url: '/#projects',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Send a message or get in touch',
        url: '/#contact',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Skills',
        short_name: 'Skills',
        description: 'Review technical skill matrix',
        url: '/#skills',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
