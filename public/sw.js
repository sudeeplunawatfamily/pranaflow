// PranaFlow Service Worker — cache buster
// Increment SW_VERSION whenever you need to force all clients to reload.
const SW_VERSION = 'v3';

// Activate immediately without waiting for existing tabs to close.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // 1. Delete every cache from any previous SW version.
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(cacheNames.map((name) => caches.delete(name)))
      )
      // 2. Take control of all open tabs immediately.
      .then(() => self.clients.claim())
      // 3. Tell every open window to reload so it fetches the latest bundle.
      .then(() =>
        self.clients
          .matchAll({ type: 'window', includeUncontrolled: true })
          .then((clients) =>
            Promise.all(
              clients.map((client) =>
                client.postMessage({ type: 'SW_ACTIVATED', version: SW_VERSION })
              )
            )
          )
      )
  );
});

// No fetch interception — all network requests go through normally.
// This SW exists only to invalidate stale caches and signal tabs to reload.
