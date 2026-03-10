const CACHE_NAME = 'bobinaflow-' + '1773146428515';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  // Instalação: baixa os assets essenciais e ativa IMEDIATAMENTE.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Ativação: assume controle imediato das abas e deleta caches antigos.
  event.waitUntil(
    clients.claim()
      .then(() => caches.keys())
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Deletando cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições que não sejam GET (mutations para Supabase/API)
  if (event.request.method !== 'GET') return;

  // Estratégia: Network First (Rede primeiro, fallback para Cache)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se a requisição foi bem sucedida na rede, atualizamos o cache (opcional, mas bom pra offline)
        // Só fazemos cache de respostas de sucesso locais ou seguras, ignorando extensões etc.
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Se a rede falhar (offline), tenta buscar no cache
        return caches.match(event.request);
      })
  );
});
