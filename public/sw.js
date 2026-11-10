const CACHE_NAME = 'atlas-v10';
const APP_SHELL = [
  './', './index.html', './offline.html', './manifest.json',
  './css/tokens.css', './css/base.css', './css/components.css', './css/layout.css',
  './js/config.js', './js/db.js', './js/auth.js', './js/store.js',
  './js/router.js', './js/i18n.js', './js/ui.js', './js/form.js',
  './js/map.js', './js/parts.js', './js/pwa.js', './js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never cache Supabase
  if (url.hostname.includes('supabase')) return;
  // Network-first for API / auth
  if (url.pathname.startsWith('/auth') || url.pathname.startsWith('/rest')) return;
  // Map tiles: stale-while-revalidate
  if (url.hostname.includes('tile.openstreetmap.org')) {
    e.respondWith(caches.open('atlas-tiles').then(cache =>
      cache.match(e.request).then(cached => {
        const fetched = fetch(e.request).then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => cached);
        return cached || fetched;
      })
    ));
    return;
  }
  // App shell: cache-first
  e.respondWith(
  fetch(e.request).then(res => {
    if (res.ok && e.request.method === 'GET') {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
    }
    return res;
  }).catch(() => caches.match(e.request).then(cached => cached || (e.request.mode === 'navigate' ? caches.match('./offline.html') : undefined)))
);