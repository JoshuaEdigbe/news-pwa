const staticAssets = ["./", "./style.css", "./app.js"];

self.addEventListener("install", async event => {
  console.log("Install");
  const cache = await caches.open("news-statis");
  cache.addAll(staticAssets);
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cacheResponse = await caches.match(req);
  return cacheResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open("news-dynamic");

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await caches.match(req);
  }
}
