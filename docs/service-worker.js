// Caution! Be sure you understand the caveats before publishing an application with
// offline support. See https://aka.ms/blazor-offline-considerations

self.importScripts('./service-worker-assets.js');
self.addEventListener('install', event => event.waitUntil(onInstall(event)));
self.addEventListener('activate', event => event.waitUntil(onActivate(event)));
self.addEventListener('fetch', event => event.respondWith(onFetch(event)));
var filesToCache = [
    './',
    //Fichiers HTML et CSS 
    './index.html',
    './css/site.css',
    './css/bootstrap/bootstrap.min.css',
    './ css/open-iconic/font/css/open-iconic-bootstrap.min.css',
    './css/open-iconic/font/fonts/open-iconic.woff',
    //Framework Blazor 
    './_framework/ blazor.webassembly.js',
    './_framework/blazor.boot.json',
    //Nos fichiers supplémentaires 
    './manifest.json',
    './serviceworker.js',
    './icons/icon-192x192.png ',
    './_framework/wasm/dotnet.js',
    './_framework/wasm/dotnet.wasm',
    './_framework/_bin/WebAssembly.Net.Http.dll',
    './_framework/_bin/Microsoft.AspNetCore .Blazor.HttpClient.dll',
    './_framework/_bin/Microsoft.AspNetCore.Blazor.dll',
    './_framework/_bin/Microsoft.AspNetCore.Components.dll',
    './_framework/_bin/Microsoft.AspNetCore .Components.Web.dll',
    './_framework/_bin/Microsoft.Extensions.DependencyInjection.Abstractions.dll',
    './_framework/_bin/Microsoft.Extensions.DependencyInjection.dll',
    './_framework/_bin/Microsoft .JSInterop.dll',
    './_framework/_bin/mscorlib.dll',
    './_framework/_bin/System.Net.Http.dll',
    './_framework/_bin/Mono.WebAssembly.Interop.dll',
    './_framework/_bin/System.dll',
    './_framework/_bin/System.Core.dll',
    './_framework/_bin/Microsoft .Bcl.AsyncInterfaces.dll',
    './_framework/_bin/Microsoft.Extensions.Configuration.Abstractions.dll',
    './_framework/_bin/Microsoft.Extensions.Logging.Abstractions.dll',
    './_framework/_bin /Microsoft.Extensions.Primitives.dll',
    './_framework/_bin/Microsoft.Extensions.Configuration.dll',
    './_framework/_bin/System.Text.Encodings.Web.dll',
    './_framework/_bin /System.Text.Json.dll',
    './_framework/_bin/WebAssembly.Bindings.dll',
    './_framework/_bin/System.Runtime.CompilerServices.Unsafe.dll',
    //Le projet compilé .dll's 
    './_framework/_bin/Client.dll',
    './_framework/_bin/Api.dll'
];

const cacheNamePrefix = 'offline-cache-';
const cacheName = `${cacheNamePrefix}${self.assetsManifest.version}`;
const offlineAssetsInclude = [ /\.dll$/, /\.pdb$/, /\.wasm/, /\.html/, /\.js$/, /\.json$/, /\.css$/, /\.woff$/, /\.png$/, /\.jpe?g$/, /\.gif$/, /\.ico$/, /\.blat$/, /\.dat$/ ];
const offlineAssetsExclude = [ /^service-worker\.js$/ ];

async function onInstall(event) {
    console.info('Service worker: Install');

    // Fetch and cache all matching items from the assets manifest
    const assetsRequests = self.assetsManifest.assets
        .filter(asset => offlineAssetsInclude.some(pattern => pattern.test(asset.url)))
        .filter(asset => !offlineAssetsExclude.some(pattern => pattern.test(asset.url)))
        .map(asset => new Request(asset.url, {}));
    await caches.open(cacheName).then(cache => cache.addAll(assetsRequests));
}

async function onActivate(event) {
    console.info('Service worker: Activate');

    // Delete unused caches
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys
        .filter(key => key.startsWith(cacheNamePrefix) && key !== cacheName)
        .map(key => caches.delete(key)));
}

async function onFetch(event) {
    let cachedResponse = null;
    if (event.request.method === 'GET') {
        // For all navigation requests, try to serve index.html from cache
        // If you need some URLs to be server-rendered, edit the following check to exclude those URLs
        const shouldServeIndexHtml = event.request.mode === 'navigate';

        const request = shouldServeIndexHtml ? 'index.html' : event.request;
        const cache = await caches.open(cacheName);
        cachedResponse = await cache.match(request);
    }

    return cachedResponse || fetch(event.request);
}
/* Manifest version: N3tI4/eH */
