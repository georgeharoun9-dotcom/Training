const CACHE = 'traning-v1';
const CORE = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {}))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network first so updates arrive, cache as fallback for the gym without signal
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
});
