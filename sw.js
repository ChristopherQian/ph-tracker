/* 尿液 pH 记录 — Service Worker
   改动 index.html / 图标后，把 VERSION 加 1，用户端会自动更新缓存 */
const VERSION = 'ph-v10';
const CACHE = VERSION;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

/* 安装：预缓存应用外壳 */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

/* 激活：清掉旧版本缓存 */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* 请求：缓存优先，后台更新（stale-while-revalidate） */
self.addEventListener('fetch', (e) => {
  const req = e.request;

  // 只处理同源 GET
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then((hit) => {
      const fetched = fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);

      return hit || fetched;
    })
  );
});
