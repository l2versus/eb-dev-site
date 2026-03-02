// ══════════════════════════════════════════════════════════════════════════════
// 🔧 Service Worker — PWA Offline + Cache Strategy
// Cache-first para assets, Network-first para APIs
// ══════════════════════════════════════════════════════════════════════════════

const CACHE_NAME = "eb-dev-v1";
const OFFLINE_URL = "/offline";

// Assets para pre-cache (shell do app)
const PRECACHE_URLS = [
    "/",
    "/offline",
    "/manifest.json",
];

// ─── INSTALL — Pre-cache do shell ─────────────────────────────────────────────
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[SW] Pre-caching app shell");
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

// ─── ACTIVATE — Limpar caches antigas ─────────────────────────────────────────
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log("[SW] Removing old cache:", name);
                        return caches.delete(name);
                    })
            )
        )
    );
    self.clients.claim();
});

// ─── FETCH — Estratégia de cache inteligente ──────────────────────────────────
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requests não-GET
    if (request.method !== "GET") return;

    // Ignorar API routes, auth, e extensões do Chrome
    if (
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/admin") ||
        url.pathname.includes("chrome-extension") ||
        url.pathname.includes("__next")
    ) {
        return;
    }

    // Estratégia: Stale-While-Revalidate para páginas
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cachear a resposta da página
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => {
                    // Sem internet: tentar cache, senão mostrar offline page
                    return caches.match(request).then(
                        (cached) => cached || caches.match(OFFLINE_URL)
                    );
                })
        );
        return;
    }

    // Estratégia: Cache-first para assets estáticos (imagens, fonts, CSS, JS)
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|avif|svg|gif|woff2?|ttf|ico)$/)
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) {
                    // Revalidar em background
                    fetch(request).then((response) => {
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
                    }).catch(() => { });
                    return cached;
                }
                // Não tem cache: buscar e cachear
                return fetch(request).then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                });
            })
        );
        return;
    }

    // Default: network-first
    event.respondWith(
        fetch(request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                return response;
            })
            .catch(() => caches.match(request))
    );
});

// ─── PUSH NOTIFICATIONS (futuro) ──────────────────────────────────────────────
self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    const title = data.title || "Emmanuel Bezerra Dev";
    const options = {
        body: data.body || "Novidade no seu projeto!",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        vibrate: [100, 50, 100],
        data: {
            url: data.url || "/",
        },
        actions: [
            { action: "open", title: "Abrir" },
            { action: "close", title: "Fechar" },
        ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Clique na notificação
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "/";
    event.waitUntil(
        self.clients.matchAll({ type: "window" }).then((clients) => {
            // Focar janela existente ou abrir nova
            for (const client of clients) {
                if (client.url.includes(url) && "focus" in client) {
                    return client.focus();
                }
            }
            return self.clients.openWindow(url);
        })
    );
});
