importScripts('https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/7.0.0/workbox-sw.min.js');

const versions = {
    images: 'v0.53',
    js: 'v0.70',
    css: 'v0.59'
};

if (workbox) {
    workbox.routing.registerRoute(
        ({request}) => request.destination === 'image',
        new workbox.strategies.CacheFirst({
            cacheName: `images-cache-${versions.images}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 6000,
                    maxAgeSeconds: 180 * 24 * 60 * 60,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [200],
                })
            ]
        })
    );

    workbox.routing.registerRoute(
        ({request}) => request.destination === 'script',
        new workbox.strategies.CacheFirst({
            cacheName: `js-cache-${versions.js}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 20,
                    maxAgeSeconds: 180 * 24 * 60 * 60,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [200],
                })
            ]
        })
    );

    workbox.routing.registerRoute(
        ({request}) => request.destination === 'style',
        new workbox.strategies.CacheFirst({
            cacheName: `css-cache-${versions.css}`,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 10,
                    maxAgeSeconds: 180 * 24 * 60 * 60,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [200],
                })
            ]
        })
    );
} else {
    console.log('Workbox failed to load');
}

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    for (const [resourceType, version] of Object.entries(versions)) {
                        const cachePrefix = `${resourceType}-cache-`;
                        if (cacheName.startsWith(cachePrefix) && cacheName !== `${cachePrefix}${version}`) {
                            console.log(`Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    }
                }).filter(Boolean) 
            );
        })
    );
});
