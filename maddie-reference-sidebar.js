/* Reference sidebar interactions. Never replaces the existing P&C navigation tree. */
(function(){
  'use strict';
  const q=(s,r=document)=>r.querySelector(s);
  const nav=q('#nav'), app=q('#app'), side=q('#side'), toggle=q('#sbtn');
  if(!nav||!app||!side||!toggle)return;
  let currentTrigger=null,closeHandle=null;
  const compact=()=>document.body.classList.contains('mj-new') && app.classList.contains('mini') && window.matchMedia('(min-width:821px)').matches;
  const safeText=(s)=>String(s||'').trim();
  const fly=document.createElement('div');
  fly.id='mj-rail-flyout';
  fly.setAttribute('role','navigation');
  fly.setAttribute('aria-label','Sidebar subcategories');
  document.body.appendChild(fly);
  // The existing header #sbtn controls sidebar expansion; do not create a duplicate.
  function syncCompact(){if(!compact())hide()}
  function ensureIcons(){
    nav.querySelectorAll('.mj-pink-section-toggle').forEach(btn=>{
      if(btn.querySelector('.mj-rail-section-icon'))return;
      const symbol=btn.dataset.pinkSection==='organization'?'office':'bars';
      btn.insertAdjacentHTML('afterbegin','<svg class="i mj-rail-section-icon" aria-hidden="true"><use href="#i-'+symbol+'"></use></svg>');
    });
  }
  function cancelClose(){if(closeHandle){clearTimeout(closeHandle);closeHandle=null}}
  function hide(){
    cancelClose();fly.classList.remove('show');fly.replaceChildren();
    fly.setAttribute('aria-hidden','true');currentTrigger=null;
  }
  function deferClose(){cancelClose();closeHandle=setTimeout(()=>{
    if(!fly.contains(document.activeElement)&&!nav.contains(document.activeElement))hide();
    else if(document.activeElement===document.body)hide();
  },180)}
  function getMenu(trigger){
    const group=trigger.closest('[data-pink-group]');
    if(group){
      const id=group.dataset.pinkGroup;
      const source=q('#pink-'+id,nav);
      const title=safeText(q('.nl',trigger)?.textContent)||safeText(trigger.title);
      return source?{title,links:[...source.querySelectorAll('a[href]')]}:null;
    }
    if(trigger.matches('[data-pink-section]')){
      const title=safeText(q('span',trigger)?.textContent);
      const source=q('#pink-section-'+trigger.dataset.pinkSection,nav);
      return source?{title,links:[...source.querySelectorAll('a[href]')]}:null;
    }
    return null;
  }
  function show(trigger){
    if(!compact()){hide();return}
    const menu=getMenu(trigger);
    if(!menu||!menu.links.length){hide();return}
    cancelClose();
    if(currentTrigger===trigger&&fly.classList.contains('show'))return;
    currentTrigger=trigger;
    fly.replaceChildren();
    const header=document.createElement('div');
    header.className='mj-fly-title';header.textContent=menu.title;
    fly.appendChild(header);
    menu.links.forEach(source=>{
      const a=source.cloneNode(true);
      a.removeAttribute('id');
      a.removeAttribute('tabindex');
      a.removeAttribute('title');
      if(!a.getAttribute('href')?.startsWith('#'))return;
      fly.appendChild(a);
    });
    fly.setAttribute('aria-label',menu.title+' subcategories');
    fly.setAttribute('aria-hidden','false');
    fly.classList.add('show');
    const rect=trigger.getBoundingClientRect();
    const sideRect=side.getBoundingClientRect();
    const maxLeft=Math.max(8,innerWidth-fly.offsetWidth-12);
    fly.style.left=Math.min(maxLeft,sideRect.right+9)+'px';
    fly.style.top=Math.max(12,Math.min(rect.top-10,innerHeight-fly.offsetHeight-12))+'px';
  }
  nav.addEventListener('pointerover',e=>{
    const trigger=e.target.closest('.mj-pink-group>.mj-pink-workspace-toggle,[data-pink-section]');
    if(trigger)show(trigger);
    else if(!e.target.closest('.mj-pink-group'))deferClose();
  });
  nav.addEventListener('pointerleave',deferClose);
  nav.addEventListener('focusin',e=>{
    const trigger=e.target.closest('.mj-pink-group>.mj-pink-workspace-toggle,[data-pink-section]');
    if(trigger)show(trigger);
    else deferClose();
  });
  nav.addEventListener('focusout',deferClose);
  nav.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'&&currentTrigger===e.target&&fly.classList.contains('show')){
      const first=q('a[href]',fly);
      if(first){e.preventDefault();first.focus()}
    }
    if(e.key==='Escape'&&fly.classList.contains('show')){
      e.preventDefault();e.stopPropagation();const target=currentTrigger;hide();target?.focus();
    }
  });
  fly.addEventListener('pointerenter',cancelClose);
  fly.addEventListener('pointerleave',deferClose);
  fly.addEventListener('focusin',cancelClose);
  fly.addEventListener('focusout',deferClose);
  fly.addEventListener('keydown',e=>{
    if(e.key==='Escape'||e.key==='ArrowLeft'){
      e.preventDefault();e.stopPropagation();const target=currentTrigger;hide();target?.focus();
    }
  });
  fly.addEventListener('click',e=>{
    if(e.target.closest('a[href]'))hide();
  });
  document.addEventListener('pointerdown',e=>{
    if(!fly.contains(e.target)&&!nav.contains(e.target))hide();
  },true);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&fly.classList.contains('show')){
      const target=currentTrigger;hide();e.preventDefault();e.stopPropagation();target?.focus();
    }
  },true);
  addEventListener('hashchange',hide);
  addEventListener('resize',()=>{syncCompact();hide()});
  new MutationObserver(()=>{ensureIcons();if(currentTrigger&&!nav.contains(currentTrigger))hide()}).observe(nav,{childList:true,subtree:true});
  new MutationObserver(syncCompact).observe(app,{attributes:true,attributeFilter:['class']});
  ensureIcons();syncCompact();
})();
