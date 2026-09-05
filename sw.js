/* NIGHT CITY OS — service worker

   Bump CACHE whenever any shell file changes. The old cache is deleted
   on activate, and the page offers a reload rather than swapping code
   underneath someone mid-tap.

   The fonts are inlined into index.html, so the shell is one document
   plus its icons. */

const CACHE = "ncos-v2";

const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/favicon-32.png",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      // One bad URL must not fail the whole install, so each is added on its own.
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {}))))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The page asks for this once the user accepts the update. */
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      /* Cache first so the app opens instantly and works offline. The
         network copy is fetched in the background and stored for next
         launch, which is what surfaces the update prompt. */
      const network = fetch(req).then(res => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => null);

      if (hit) { event.waitUntil(network); return hit; }

      return network.then(res => {
        if (res) return res;
        // Offline, uncached, and a navigation: fall back to the shell.
        if (req.mode === "navigate") return caches.match("index.html");
        return new Response("", { status: 504, statusText: "offline" });
      });
    })
  );
});
