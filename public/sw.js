const CACHE_NAME = "planly-v1.0.0"
const STATIC_CACHE = "planly-static-v1.0.0"
const DYNAMIC_CACHE = "planly-dynamic-v1.0.0"

// Assets críticos para cache
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/auth/login",
  "/onboarding",
  "/offline",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
]

// Estratégias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
}

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("[SW] Static assets cached")
        return self.skipWaiting()
      }),
  )
})

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Claiming clients")
        return self.clients.claim()
      }),
  )
})

// Fetch event - handle requests with different strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Skip external requests
  if (url.origin !== location.origin) return

  // Handle different types of requests
  if (url.pathname.startsWith("/api/")) {
    // API requests - Network first with cache fallback
    event.respondWith(handleApiRequest(request))
  } else if (url.pathname.startsWith("/_next/static/")) {
    // Static assets - Cache first
    event.respondWith(handleStaticAssets(request))
  } else {
    // Pages - Stale while revalidate
    event.respondWith(handlePageRequest(request))
  }
})

// Handle API requests - Network first
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Network failed for API, trying cache:", request.url)
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline response for API
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "Você está offline. Tente novamente quando a conexão for restaurada.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Handle static assets - Cache first
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    const cache = await caches.open(STATIC_CACHE)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    console.log("[SW] Failed to fetch static asset:", request.url)
    return new Response("Asset not available offline", { status: 404 })
  }
}

// Handle page requests - Stale while revalidate
async function handlePageRequest(request) {
  const cachedResponse = await caches.match(request)

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE)
        cache.then((c) => c.put(request, networkResponse.clone()))
      }
      return networkResponse
    })
    .catch(() => {
      // If network fails and we have cache, return it
      if (cachedResponse) {
        return cachedResponse
      }

      // Return offline page
      return caches.match("/offline")
    })

  // Return cached version immediately if available
  return cachedResponse || fetchPromise
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync:", event.tag)

  if (event.tag === "sync-habits") {
    event.waitUntil(syncHabits())
  } else if (event.tag === "sync-finances") {
    event.waitUntil(syncFinances())
  } else if (event.tag === "sync-health") {
    event.waitUntil(syncHealth())
  }
})

// Sync functions
async function syncHabits() {
  try {
    const habits = await getOfflineData("habits")
    if (habits.length > 0) {
      await fetch("/api/habits/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habits),
      })
      await clearOfflineData("habits")
      console.log("[SW] Habits synced successfully")
    }
  } catch (error) {
    console.error("[SW] Failed to sync habits:", error)
  }
}

async function syncFinances() {
  try {
    const transactions = await getOfflineData("finances")
    if (transactions.length > 0) {
      await fetch("/api/finances/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactions),
      })
      await clearOfflineData("finances")
      console.log("[SW] Finances synced successfully")
    }
  } catch (error) {
    console.error("[SW] Failed to sync finances:", error)
  }
}

async function syncHealth() {
  try {
    const healthData = await getOfflineData("health")
    if (healthData.length > 0) {
      await fetch("/api/health/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(healthData),
      })
      await clearOfflineData("health")
      console.log("[SW] Health data synced successfully")
    }
  } catch (error) {
    console.error("[SW] Failed to sync health data:", error)
  }
}

// Helper functions for offline data
async function getOfflineData(type) {
  const data = localStorage.getItem(`planly_offline_${type}`)
  return data ? JSON.parse(data) : []
}

async function clearOfflineData(type) {
  localStorage.removeItem(`planly_offline_${type}`)
}

// Push notification handling
self.addEventListener("push", (event) => {
  console.log("[SW] Push received:", event)

  const options = {
    body: "Você tem uma nova notificação do Planly",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Abrir App",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Fechar",
        icon: "/icon-192x192.png",
      },
    ],
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.title = data.title || "Planly"
  }

  event.waitUntil(self.registration.showNotification("Planly", options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click received.")

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/dashboard"))
  } else if (event.action === "close") {
    // Just close the notification
    return
  } else {
    // Default action - open app
    event.waitUntil(clients.openWindow("/"))
  }
})

// Message handling from main thread
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data)

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncAllData())
  }
})

async function syncAllData() {
  await Promise.all([syncHabits(), syncFinances(), syncHealth()])
}
