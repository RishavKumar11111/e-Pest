var deferredPrompt;

if (!window.Promise) {
    window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/serviceWorker.js', {scope: '/'})
    .then(function () {
        console.log('Service Worker is registered!');
    }).catch(function(err) {
        console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired...');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});