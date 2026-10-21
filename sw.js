const V='stationen-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Erst Internet, dann Zwischenspeicher: Updates kommen sofort an, offline läuft die gespeicherte Version.
   Fremde Adressen (Mehrspieler-Server, Wikimedia-Fotos) werden nie zwischengespeichert. */
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{
  if(r&&r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}
  return r;
 }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||caches.match('./index.html'))));
});
