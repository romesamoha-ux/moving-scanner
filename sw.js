const V = 'mp-v7';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    try {
      return await fetch(e.request, { cache: 'no-store' });
    } catch (err) {
      const c = await caches.match(e.request);
      if (c) return c;
      throw err;
    }
  })());
});
