const V='stationen-v2';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Erst Internet, dann Zwischenspeicher: Updates kommen sofort an, offline läuft die gespeicherte Version.
   Fremde Adressen (Mehrspieler-Server) werden nie zwischengespeichert. */
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{
  if(r&&r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}
  return r;
 }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||caches.match('./index.html'))));
});
