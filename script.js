// JS commun + correction de mailto
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

function handleSubmit(e){
  e.preventDefault();
  const f = e.target;
  const name = encodeURIComponent(f.name.value.trim());
  const email = encodeURIComponent(f.email.value.trim());
  const body = encodeURIComponent(f.message.value.trim());
  // mailto correctement formé (avec guillemets)
  const href = `mailto:csgm-bf@outlook.com?subject=Message%20depuis%20le%20site%20CSGM-BF%20(%20${name}%20)&body=De:%20${name}%20%3C${email}%3E%0D%0A%0D%0A${body}`;
  window.location.href = href;
  const msg = document.getElementById('msg');
  if (msg) msg.textContent = "Merci ! Votre client e‑mail va s’ouvrir pour finaliser l’envoi.";
  f.reset();
}


// Lightbox simple pour la galerie
(function(){
  const lightbox = document.getElementById('lightbox');
  if(!lightbox) return;
  const img = lightbox.querySelector('img');
  const items = Array.from(document.querySelectorAll('.gallery a'));
  let idx = -1;

  function open(i){
    idx = i;
    const href = items[idx].getAttribute('href');
    img.src = href;
    lightbox.classList.add('open');
  }
  function close(){ lightbox.classList.remove('open'); }
  function prev(){ if(idx<=0) idx = items.length-1; else idx--; open(idx); }
  function next(){ if(idx>=items.length-1) idx = 0; else idx++; open(idx); }

  items.forEach((a,i)=>{
    a.addEventListener('click', (e)=>{ e.preventDefault(); open(i); });
  });
  lightbox.querySelector('.close').addEventListener('click', close);
  lightbox.querySelector('.prev').addEventListener('click', (e)=>{e.stopPropagation(); prev();});
  lightbox.querySelector('.next').addEventListener('click', (e)=>{e.stopPropagation(); next();});
  lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) close(); });
  document.addEventListener('keydown', (e)=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') { e.preventDefault(); prev(); }
    if(e.key==='ArrowRight') { e.preventDefault(); next(); }
  });
})();
