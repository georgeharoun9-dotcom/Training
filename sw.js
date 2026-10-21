const CACHE = 'traning-v4';
const CORE = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin && url.hostname !== 'unpkg.com') return; // food database lookups go straight to the network
  // Network first (bypassing the HTTP cache) so new versions show up at once; cached copy when offline
  e.respondWith(fetch(req, { cache: 'no-store' }).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); } return r; })
    .catch(() => caches.match(req).then(m => m || caches.match('index.html'))));
});
