/* ============================================================
 * 後中醫生物學練習器 — Service Worker
 * 離線快取策略：App Shell 先快取，之後 cache-first
 *
 * ⚠ 更新 App 時務必把下面的 CACHE_VERSION 改一個新版號，
 *   舊快取才會被清掉、使用者才會拿到新版內容。
 * ============================================================ */
const CACHE_VERSION = 'biotrainer-v115plus-1';
const CACHE_NAME = 'bio-trainer-' + CACHE_VERSION;

// 需要離線可用的核心檔案
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.ico'
];

// 安裝：預先快取 App Shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// 啟用：清除舊版快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('bio-trainer-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// 取用：cache-first，找不到再上網，網路也失敗就回退到 index.html
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req)
        .then(resp => {
          // 同源資源動態加入快取
          if (resp && resp.status === 200 && resp.type === 'basic') {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
          return resp;
        })
        .catch(() => {
          // 導覽請求離線時回退到首頁
          if (req.mode === 'navigate') return caches.match('./index.html');
        });
    })
  );
});
