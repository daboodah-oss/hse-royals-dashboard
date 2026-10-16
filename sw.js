// HSE Royals dashboard service worker.
// Navigations: network-first with cached fallback (dashboard refreshes weekly).
// Static icons/manifest: cache-first, they're immutable.
// Bump both versions on every change to this file (ai-build-standards v5.3).
const PAGE_CACHE = 'hse-page-v2';
const ASSET_CACHE = 'hse-assets-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ASSET_CACHE).then((cache) =>
      cache.addAll(['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'])
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== PAGE_CACHE && k !== ASSET_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((res) => {
        // Cache only a real 200 from this origin: never an error page or a
        // redirect, which would then be served offline as the dashboard.
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(event.request, copy));
        }
        return res;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
  const url = new URL(event.request.url);
  if (url.pathname.includes('/icons/') || url.pathname.endsWith('.webmanifest')) {
    event.respondWith(
      caches.match(event.request).then((hit) => hit || fetch(event.request))
    );
  }
});
