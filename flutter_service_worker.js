'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "722139e6356f48324a4dce6dd32d0d66",
"assets/FontManifest.json": "136b8c93af539445ffe70e4e575db1d0",
"assets/fonts/Billa.ttf": "52b04f1c2bd73f240b4ad620924a40c9",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/images/0.jpg": "aa2930ec3ce2a2a236ef62a61a93f0fe",
"assets/images/1.jpg": "5d0d535593843da2deb90b11130876e8",
"assets/images/10.jpg": "ccae6f9221603c34e690751c6082fcb2",
"assets/images/11.jpg": "0f38207551c9f415a0a4b9070fe425fe",
"assets/images/12.jpg": "e9b14bc49b66df42a6e1410bb6e2ba41",
"assets/images/13.jpg": "5d06646f1f8b5c8ab2c6860e649317af",
"assets/images/14.jpg": "c13cb161cf6e87d90d8c8b9e84babaa9",
"assets/images/15.jpeg": "155dc482f731bdc2eda578252ead5b97",
"assets/images/15.jpg": "c13cb161cf6e87d90d8c8b9e84babaa9",
"assets/images/16.jpeg": "2c81b862b86f83d8082d59150a83676b",
"assets/images/17.jpeg": "f512c6b26dcc81c262488c0f6616dd3e",
"assets/images/18.jpeg": "2d7c9de62765fe82fd1c64a05da287d3",
"assets/images/19.jpeg": "f933eefdadb42fc638ba330b7824725d",
"assets/images/2.jpg": "b1264b5fe5353ceab332c4436e53fe4f",
"assets/images/20.jpeg": "fec0c8f8bb9668fd4346a07d4c76a3aa",
"assets/images/21.jpeg": "bbb28a1d3761e29d627638c210094682",
"assets/images/22.jpeg": "1bb4b77db3f51cc68360638489c9058c",
"assets/images/23.jpeg": "954f5a4a75389a9c7249d8fa7cabdd0f",
"assets/images/24.jpeg": "752a4f72dae8406dd09526e8207853db",
"assets/images/25.jpeg": "1bf55b7876a3170776bfed428697b939",
"assets/images/26.jpeg": "4b6287037a409293cd1ec60ae382baba",
"assets/images/27.jpeg": "a1402e2a7b42caecb60a22350e75a56c",
"assets/images/28.jpeg": "70d6e7b72a789139ac08d6d015a2b6b4",
"assets/images/29.jpeg": "0d33e73aedb9558f0fafc02bcbec0129",
"assets/images/3.jpg": "792ac18eec26fb30e23a6012a72ac29e",
"assets/images/30.jpeg": "0a7599471f200efbaffe3456357b693e",
"assets/images/4.jpg": "689159f3e1d3eb56b458217026433ebc",
"assets/images/5.jpg": "9ee7e3a52d0800a60519815b84d93631",
"assets/images/6.jpg": "be2c826833b977122a3400fdea2cd8a9",
"assets/images/7.jpg": "156a6de7d6785c747a7c3b867e607b70",
"assets/images/8.jpg": "d3e329d29c832b388581284770b87490",
"assets/images/9.jpg": "d781a38999f5122b6bf5b1793926b85c",
"assets/NOTICES": "5acccbb158ad0135ef8f1edd4f80eec7",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "333ff59c1368a5e440d67d69291e1872",
"/": "333ff59c1368a5e440d67d69291e1872",
"main.dart.js": "7fc981218e1d4a23ce540ac8e3c9d737",
"manifest.json": "31c52e2f0d99da8dc721b0d43745b816",
"version.json": "c5fe4e30b31a888fae988b9c0f2d5ccf"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
