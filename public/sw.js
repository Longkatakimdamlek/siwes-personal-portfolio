/**
 * @file public/sw.js
 * @description Progressive Web App Service Worker for SIWES Developer Portfolio.
 * Implements intelligent multi-tier caching, offline fallback, cache versioning,
 * and strict security exclusion for admin routes and mutations.
 */

const CACHE_VERSION = 'siwes-portfolio-v1';
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const PAGES_CACHE_NAME = `pages-${CACHE_VERSION}`;
const IMAGES_CACHE_NAME = `images-${CACHE_VERSION}`;

// Core assets to pre-cache immediately upon service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/favicon.png',
  '/images/avatar.jpg',
  '/images/developer_avatar_portrait_1790252834755.jpg',
];

// Patterns that MUST NOT be cached (security, dynamic authentication, APIs, mutations)
function isExemptRequest(url, request) {
  // Only intercept GET requests
  if (request.method !== 'GET') {
    return true;
  }

  const pathname = url.pathname;

  // Never cache webpack HMR, hot updates, or development chunks
  if (
    pathname.includes('webpack-hmr') ||
    pathname.includes('.hot-update.') ||
    pathname.startsWith('/_next/webpack-hmr')
  ) {
    return true;
  }

  // Never cache admin authentication or dashboard routes
  if (pathname.startsWith('/admin')) {
    return true;
  }

  // Never cache API endpoints (such as /api/contact)
  if (pathname.startsWith('/api/')) {
    return true;
  }

  // Never cache Supabase auth or live backend sessions
  if (url.hostname.includes('supabase.co')) {
    return true;
  }

  // Never cache browser extensions
  if (!url.protocol.startsWith('http')) {
    return true;
  }

  return false;
}

// Installation event: precache the offline shell and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_ASSETS.map((asset) =>
            cache.add(asset).catch((err) => {
              console.warn(`[SW] Precache skipped for ${asset}:`, err.message);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activation event: prune deprecated caches from previous versions
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE_NAME, PAGES_CACHE_NAME, IMAGES_CACHE_NAME];

  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => !currentCaches.includes(key))
            .map((key) => {
              console.log(`[SW] Purging outdated cache: ${key}`);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event: handle navigation, image assets, and static files
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Bypass exempt requests (admin, API, non-GET)
  if (isExemptRequest(url, request)) {
    return;
  }

  // 2. Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, clone and update pages cache
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(PAGES_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed (offline). Look in pages cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // If un-cached page requested offline, serve the offline fallback page
          const offlineFallback = await caches.match('/offline');
          if (offlineFallback) {
            return offlineFallback;
          }

          // Minimal fallback response
          return new Response(
            '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 3. Image assets (/images/*, picsum, unsplash) -> Cache First with Network Fallback
  const isImage =
    request.destination === 'image' ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp');

  if (isImage) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(IMAGES_CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return cached fallback icon if available
            return caches.match('/icon-192.png');
          });
      })
    );
    return;
  }

  // 4. Next.js Static JS/CSS assets -> Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 5. Default: Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
