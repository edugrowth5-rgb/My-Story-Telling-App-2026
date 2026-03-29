const CACHE_NAME = 'storyteller-v1';

// In files ko browser apne paas save kar lega (Offline ke liye)
const ASSETS = [
  './STindex.html',
  './STstyle.css',
  './STapp.js',
  './STstories.js',
  './STmanifest.json',
  '1774774989614.png',
  '1774775001206.png',
  '1774775014769.png',
  '1774775038988.png',
  '1774775051478.png'
];

// 1. Install Event: Files ko cache mein save karna
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('ST Cache Opened');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate Event: Purane cache ko delete karna (jab aap app update karein)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('ST Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Event: Internet na hone par Cache se file uthana
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Agar cache mein file mil gayi toh wahi return karo, nahi toh network se lo
      return response || fetch(event.request);
    })
  );
});
