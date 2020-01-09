var CACHE_DYNAMIC_NAME = 'dynamic';

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker...', event);
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker...', event);
    event.waitUntil(
        caches.keys()
        .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== CACHE_DYNAMIC_NAME) {
                    console.log('[Service Worker] Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        })
    )
    return self.clients.claim();
});

// self.addEventListener('fetch', function(event) {
//     // Cache with network fallback
//     event.respondWith(
//         caches.match(event.request)
//         .then(function(response) {
//             if (response) {
//                 return response;
//             }
//             else {
//                 return fetch(event.request)
//                 .then(function(res) {
//                     return caches.open(CACHE_DYNAMIC_NAME)
//                     .then(function(cache) {
//                         if (event.request.url.includes('/vawApp') || event.request.url.includes('/aaoApp') || event.request.url.includes('/adoApp') || event.request.url.includes('/app_login') || event.request.url.includes('/fonts') || event.request.url.includes('/images') || event.request.url.includes('/javascripts')  || event.request.url.includes('/stylesheets') || event.request.url.includes('/manifest')) {
//                             if (!(event.request.url.includes('/vawApp/changepassword') || event.request.url.includes('/vawApp/changepassword/') || event.request.url.includes('/vawApp/synchronize') || event.request.url.includes('/vawApp/synchronize/') || event.request.url.includes('/aaoApp/changepassword') || event.request.url.includes('/aaoApp/changepassword/') || event.request.url.includes('/aaoApp/synchronize') || event.request.url.includes('/aaoApp/synchronize/') || event.request.url.includes('/adoApp/changepassword') || event.request.url.includes('/adoApp/changepassword/') || event.request.url.includes('/adoApp/synchronize') || event.request.url.includes('/adoApp/synchronize/'))) {
//                                 cache.put(event.request.url, res.clone());
//                             }
//                         }
//                         return res;
//                     })
//                 }).catch(function(err) {
//                     return caches.open(CACHE_DYNAMIC_NAME)
//                     .then(function(cache) {
//                         return cache.match('/vawApp/offline');
//                     })
//                 });
//             }
//         })
//     )
// });

self.addEventListener('fetch', function(event) {
    // Network with cache fallback
    event.respondWith(
        fetch(event.request)
        .then(function (res) {
            return caches.open(CACHE_DYNAMIC_NAME)
            .then(function(cache) {
                if (event.request.url.includes('/vawApp') || event.request.url.includes('/aaoApp') || event.request.url.includes('/adoApp') || event.request.url.includes('/app_login') || event.request.url.includes('/fonts') || event.request.url.includes('/images') || event.request.url.includes('/javascripts')  || event.request.url.includes('/stylesheets') || event.request.url.includes('/manifest')) {
                    if (!(event.request.url.includes('/vawApp/changepassword') || event.request.url.includes('/vawApp/changepassword/') || event.request.url.includes('/vawApp/synchronize') || event.request.url.includes('/vawApp/synchronize/') || event.request.url.includes('/aaoApp/changepassword') || event.request.url.includes('/aaoApp/changepassword/') || event.request.url.includes('/aaoApp/synchronize') || event.request.url.includes('/aaoApp/synchronize/') || event.request.url.includes('/adoApp/changepassword') || event.request.url.includes('/adoApp/changepassword/') || event.request.url.includes('/adoApp/synchronize') || event.request.url.includes('/adoApp/synchronize/'))) {
                        cache.put(event.request.url, res.clone());
                    }
                }
                return res;
            })
        }).catch(function (err) {
            return caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                else {
                    return caches.open(CACHE_DYNAMIC_NAME)
                    .then(function(cache) {
                        return cache.match('/vawApp/offline');
                    })
                }
            })
        })
    )
});