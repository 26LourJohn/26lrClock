self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open("26lrClock").then(function(cache) {
            return cache.addAll(["26lrClock.html","26lrClock.js","26LRLOGO72.png"])
        })
    )
})

self.addEventListener("fetch", function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request)
        })
    )
})