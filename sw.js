// BABYBOY MUSIK — Service Worker
// Cache tous les fichiers pour que le jeu fonctionne hors ligne

const CACHE_NAME = 'babyboy-musik-v1';
const REPO = '/babyboy-musik-game2';

const ASSETS_TO_CACHE = [
  `${REPO}/`,
  `${REPO}/index.html`,
  `${REPO}/cover.jpg`,
  `${REPO}/manifest.json`,
  `${REPO}/icons/icon-72.png`,
  `${REPO}/icons/icon-96.png`,
  `${REPO}/icons/icon-128.png`,
  `${REPO}/icons/icon-144.png`,
  `${REPO}/icons/icon-152.png`,
  `${REPO}/icons/icon-192.png`,
  `${REPO}/icons/icon-384.png`,
  `${REPO}/icons/icon-512.png`,
  `${REPO}/audio/bgbeat.mp3`,
  `${REPO}/audio/track_01.mp3`,
  `${REPO}/audio/track_02.mp3`,
  `${REPO}/audio/track_03.mp3`,
  `${REPO}/audio/track_04.mp3`,
  `${REPO}/audio/track_05.mp3`,
  `${REPO}/audio/track_06.mp3`,
  `${REPO}/audio/track_07.mp3`,
  `${REPO}/audio/track_08.mp3`,
  `${REPO}/audio/track_09.mp3`,
  `${REPO}/audio/track_10.mp3`,
  `${REPO}/audio/track_11.mp3`,
  `${REPO}/audio/track_12.mp3`,
  `${REPO}/audio/track_13.mp3`,
  `${REPO}/audio/track_14.mp3`,
];

// Installation — cache tous les assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching all assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      console.log('[SW] All assets cached!');
      return self.skipWaiting();
    })
  );
});

// Activation — supprime les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => { console.log('[SW] Deleting old cache:', key); return caches.delete(key); })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch — sert depuis le cache en priorité (offline-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      // Pas en cache — fetch depuis le réseau
      return fetch(event.request).then(response => {
        // Met en cache la réponse pour la prochaine fois
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Hors ligne et pas en cache — retourne index.html par défaut
        return caches.match(`${REPO}/index.html`);
      });
    })
  );
});
