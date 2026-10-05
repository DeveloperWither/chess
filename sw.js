// Offline support: keeps every app file on the device.
// Bump VERSION whenever app files change so phones pick up the update.
const VERSION = 'chess-studio-v6';
const FILES = [
  './', 'index.html', 'style.css', 'app.js', 'openings.js', 'vision.js', 'endgames.js', 'firebase-config.js', 'online.js', 'chess.min.js', 'puzzles.json', 'manifest.webmanifest',
  'engine/stockfish.wasm.js', 'engine/stockfish.wasm', 'stockfish.js',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.pathname.includes('/api/')) return;
  const big = /stockfish|\.wasm|icons\//.test(url.pathname);
  if (url.origin === location.origin && !big) {
    // app code: network first so updates show up at once; the cached copy is the offline fallback
    e.respondWith(caches.open(VERSION).then(async c => {
      try {
        const r = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 3000))]);
        if (r.ok) c.put(req, r.clone());
        return r;
      } catch {
        return (await c.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? c.match('index.html') : Response.error());
      }
    }));
  } else if (url.origin === location.origin) {
    // engine + icons: cache first (large and rarely change), refresh the cached copy in the background
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true });
      const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
      return hit || (await net) || (req.mode === 'navigate' ? c.match('index.html') : Response.error());
    }));
  } else if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(VERSION + '-fonts').then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      try { const r = await fetch(req); c.put(req, r.clone()); return r; } catch { return Response.error(); }
    }));
  }
  // everything else (Chess.com, Lichess) goes straight to the network
});
