// Bento Service Worker — Offline Cache
// Cache-first strategy for landing page, blog, and leaderboard

const CACHE_NAME = "bento-cache-v1";

const CACHE_URLS = [
  "/",
  "/blog",
  "/leaderboard",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon.svg",
];

// Install: pre-cache core pages and assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS).catch((err) => {
        // Don't fail install if individual URLs fail — cache what we can
        console.warn("SW install: some URLs failed to cache", err);
      });
    })
  );
  // Activate immediately — don't wait for old SW to close
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  // Claim all clients so the SW controls the page immediately
  self.clients.claim();
});

// Fetch: cache-first for navigation and static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Skip non-http(s) requests (chrome-extension://, etc.)
  if (!request.url.startsWith("http")) return;

  // For navigation requests (HTML pages), use cache-first
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            // Cache the response for next time
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => {
            // If offline and not cached, return a simple offline page
            return new Response(
              "<html><body style='background:#0f172a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0'><div style='text-align:center'><h1 style='color:#10b981;font-size:2rem'>Bento</h1><p>You're offline. Check your connection and try again.</p></div></body></html>",
              { headers: { "Content-Type": "text/html" } }
            );
          });
      })
    );
    return;
  }

  // For static assets (JS, CSS, images, fonts), cache-first
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "manifest"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
        );
      })
    );
    return;
  }

  // For API calls, network-first (don't cache)
  // Let them pass through to the network
});
