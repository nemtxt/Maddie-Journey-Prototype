/* Maddie Journey: route-aware presentation zoning (content only) */
(function(){
 'use strict';
 const root=document.getElementById('view');
 if(!root)return;
 const areas=new Set(['people','pay','pulse','journey','learning','culture','talent','governance','scoreboard']);
 const cleanRoute=()=>decodeURIComponent(location.hash.slice(1)||'overview');
 let queued=false;
 function heading(before,title,detail){
   if(!before||before.previousElementSibling?.classList.contains('mj-zone-heading'))return;
   const el=document.createElement('div');
   el.className='mj-zone-heading';
   const b=document.createElement('b');b.textContent=title;el.append(b);
   if(detail){const s=document.createElement('span');s.textContent=detail;el.append(s)}
   before.before(el);
 }
 function enhance(){
   queued=false;
   if(!document.body.classList.contains('mj-new'))return;
   const h=cleanRoute(),area=h.split(':')[0];
   const layout=h==='overview'?'home':areas.has(area)?(h.includes(':')?'detail':'workspace'):h.startsWith('view/')?'reports':h;
   document.body.dataset.mjLayout=layout;
   if(areas.has(area))document.body.dataset.mjArea=area;
   const page=root.querySelector('.mj-page');
   if(page){
     if(layout==='home'||layout==='workspace'||layout==='reports'){
       const metrics=page.querySelector('.mj-metrics');
       heading(metrics,'At a glance','Key figures — select a block to see more');
       if(layout==='home')heading(page.querySelector('.mj-duo'),'Priorities & shortcuts','Helpful details when you need them');
     }
   }
   const legacy=root.querySelector('.ph');
   if(legacy)legacy.classList.add('mj-rich-header');
   const calls=root.querySelector('.cos');
   if(calls)heading(calls,'At a glance','Summary of this report');
   root.querySelectorAll('.g12>.card:not(.strip)').forEach(card=>{
     if(card.querySelector('table,.tbl,.scroll,.rk,.mj-data-table'))card.classList.add('mj-data-surface');
     else card.classList.add('mj-insight-surface');
   });
 }
 const queue=()=>{if(!queued){queued=true;requestAnimationFrame(enhance)}};
 new MutationObserver(queue).observe(root,{childList:true,subtree:true});
 addEventListener('hashchange',queue);
 queue();
})();
