/* yaha sw — stale-while-revalidate: instant load from cache (works offline in
   Taiwan), silently refetches in the background so the next open gets updates.
   No version bumps or reinstalls needed when files change on the server. */
const CACHE = "yaha-v10";
const ASSETS = ["./", "index.html", "style.css", "app.js", "engine.js", "path.js",
                "data.js", "hsk2.js", "taiwan.js", "chats.js",
                "trad.js", "strokes.js", "vendor-hanzi-writer.js", "manifest.webmanifest",
                "icon-180.png", "icon-512.png", "icon-512-maskable.png", "audio/cast/index.json",
                "chars/manifest.json", "chars/chiikawa.png", "chars/hachiware.png", "chars/usagi.png", "chars/momonga.png", "chars/rakko.png", "chars/kurimanju.png", "chars/shisa.png", "chars/yoroi.png", "chars/kani.png", "chars/chimera.png",
                "fonts/mplus-500.woff2", "fonts/mplus-700.woff2", "fonts/mplus-800.woff2", "fonts/mplus-900.woff2"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const work = caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    // no-cache: bypass the HTTP cache so a server-side update is actually seen
    const refetch = fetch(e.request, { cache: "no-cache" }).then(async res => {
      if (res && res.ok) await c.put(e.request, res.clone());
      return res;
    }).catch(() => hit);
    // keep the sw alive until the background refresh lands in the cache
    e.waitUntil(refetch.catch(() => {}));
    return { hit, refetch };
  });
  e.respondWith(work.then(({ hit, refetch }) => hit || refetch));
});
