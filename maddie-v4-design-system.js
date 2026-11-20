/* Maddie Journey V4.0 — dashboard presentation contract.
 * Adds semantic classes for consistent hierarchy; no data or navigation changes.
 * Observe only direct route replacements to avoid repeated work on chart updates.
 */
(function(){
 'use strict';
 const root=document.getElementById('view');
 if(!root)return;
 const CATEGORIES=new Set(['people','pay','pulse','journey','learning','culture','talent','governance','scoreboard']);
 const route=()=>{try{return decodeURIComponent(location.hash.slice(1)||'overview')}catch{return location.hash.slice(1)||'overview'}};
 const kind=h=>{
  if(h==='office')return 'office';
  if(h==='overview')return 'home';
  if(h.startsWith('division/'))return 'division';
  if(h.startsWith('view/'))return 'executive';
  if(h.includes(':')&&CATEGORIES.has(h.split(':')[0]))return 'report';
  if(CATEGORIES.has(h))return 'workspace';
  if(h==='workspaces'||h==='reports'||h==='divisions')return 'directory';
  if(h==='settings'||h==='data-system'||h==='help')return 'settings';
  return 'general';
 };
 let queued=false;
 const classify=(selector,name,test)=>{
  root.querySelectorAll(selector).forEach(el=>{
   if(!test||test(el))el.classList.add(name);
  });
 };
 const makeDivider=(target,title,description)=>{
  if(!target||target.previousElementSibling?.classList.contains('mj-v4-report-divider'))return;
  const el=document.createElement('div');el.className='mj-v4-report-divider';
  const label=document.createElement('strong');label.textContent=title;
  const note=document.createElement('span');note.textContent=description;
  el.append(label,note);target.before(el);
 };
 function apply(){
  queued=false;
  if(!document.body.classList.contains('mj-new'))return;
  const h=route(),type=kind(h);
  document.body.classList.add('mj-v4');
  document.body.dataset.mjV4Kind=type;
  root.dataset.mjV4Kind=type;
  if(type==='office'&&document.body.classList.contains('hxon'))return;
  classify('.mj-page','mj-v4-page');
  classify('.mj-head,.ph','mj-v4-header');
  classify('.mj-metrics,.cos,.strip','mj-v4-kpis');
  classify('.mj-metric,.co,.strip>.k','mj-v4-kpi');
  classify('.mj-grid','mj-v4-directory');
  classify('.mj-tile','mj-v4-tile');
  classify('.mj-sectionhead,.mj-zone-heading','mj-v4-section-title');
  classify('.mj-panel,.card,.secc','mj-v4-surface');
  classify('.g12','mj-v4-content');
  classify('.g12>.card,.mj-panel','mj-v4-data-surface',el=>Boolean(el.querySelector('table,.tbl,.scroll,.rk,.kb,.mj-data-table')));
  classify('.g12>.card,.mj-panel','mj-v4-insight-surface',el=>Boolean(el.querySelector('.cc,.rg,.bars,.trend,.stack,.heat,.spark')));
  classify('.g12>.card,.mj-panel','mj-v4-attention-surface',el=>Boolean(el.querySelector('.exl,.mj-alerts')));
  classify('.secb','mj-v4-report-body');
  classify('.tbl,.mj-tablewrap','mj-v4-table-region');
  classify('.sh','mj-v4-subsection');
  // Report headers already contain their own specific KPIs. This small divider
  // introduces detailed records without adding another summary dashboard.
  if(type==='report'){
   const pane=root.querySelector('#pane');
   if(pane)makeDivider(pane,'Detailed report','Source records and supporting analysis');
  }else if(type==='division'){
   const grid=root.querySelector('.g12');
   if(grid)makeDivider(grid,'Division details','Workforce, organizational structure and supporting records');
  }
 }
 function schedule(){
  if(queued)return;
  queued=true;requestAnimationFrame(apply);
 }
 const observer=new MutationObserver(records=>{
  if(records.some(r=>r.target===root||Array.from(r.addedNodes).some(n=>{
   if(n.nodeType!==1)return false;
   if(n.classList?.contains('mj-v4-report-divider'))return false;
   return n.matches?.('.mj-page,.ph,.mj-head,.g12,#pane')||Boolean(n.querySelector?.('.mj-head,.ph,.g12,#pane'));
  })))schedule();
 });
 observer.observe(root,{childList:true,subtree:true});
 addEventListener('hashchange',schedule);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
 else schedule();
 window.MJ_V4_DESIGN={version:'4.0',refresh:schedule};
})();
