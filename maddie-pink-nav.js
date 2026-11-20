/* Maddie Journey v5.6 — one consistent P&C sidebar */
(function(){
'use strict';
const areas=[
 ['people','People Directory','id'],['pay','Pay & Benefits','wallet'],
 ['pulse','Workforce Pulse','pulse'],['journey','Career Journey','compass'],
 ['learning','Learning & Development','cap'],['culture','Culture & Community','spark'],
 ['talent','Recruitment','brief'],['governance','People Governance','shield'],
 ['scoreboard','Executive Scoreboard','bars']
];
const leaders=[
 ['ceo','CEO Overview'],['coo','COO Workforce'],['cso','CSO Career & Culture'],
 ['pc','P&C Operations'],['division','Division Head View'],['monthly','Monthly Review']
];
const q=(s,r=document)=>r.querySelector(s);
const all=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=id=>'<svg class="i" aria-hidden="true"><use href="#i-'+id+'"></use></svg>';
const link=(href,label,ico)=>'<a href="#'+href+'" data-id="'+href+'" data-mj-href="'+href+'" title="'+esc(label)+'">'+icon(ico)+'<span class="nl">'+esc(label)+'</span></a>';
const sections=id=>{try{return typeof CAT_SECTIONS!=='undefined'?(CAT_SECTIONS[id]||[]):[]}catch{return []}};
const isArea=id=>areas.some(x=>x[0]===id);

/* Division colors match the supplied visual reference; counts come from the demo roster. */
const departmentColor=name=>{
 const n=String(name||'').toLowerCase();
 if(/leadership|executive|ceo|top operations/.test(n))return '#A9F562';
 if(/revenue|rmd/.test(n))return '#9964ED';
 if(/business development|business dev/.test(n))return '#F1AA3B';
 if(/design/.test(n))return '#F6CA31';
 if(/gencon|general construction|construction/.test(n))return '#ED4854';
 if(/corporate|corp ops/.test(n))return '#436FE4';
 if(/^it\b|it operations|coo team|technology/.test(n))return '#3585E8';
 if(/media/.test(n))return '#1DB7AA';
 if(/external affairs/.test(n))return '#6C9F47';
 return '#858585';
};
const divisionItems=()=>{
 const divisions=typeof MCD!=='undefined'&&Array.isArray(MCD.D)?MCD.D:[];
 if(!divisions.length)return '';
 return '<div class="mj-divisions-heading">DIVISIONS <span>'+divisions.length+'</span></div>'+
 '<div class="mj-division-links">'+divisions.map(([name,count])=>{
  const route='division/'+encodeURIComponent(name),color=departmentColor(name);
  return '<a class="mj-division-item" href="#'+route+'" data-id="'+esc(route)+'" data-mj-href="'+esc(route)+'" title="Open '+esc(name)+' division">'+
   '<span class="mj-division-dot" aria-hidden="true" style="--division-color:'+color+'"></span>'+
   '<span class="nl">'+esc(name)+'</span><span class="mj-division-count">'+Number(count||0)+'</span></a>';
 }).join('')+'</div><div class="mj-divisions-heading mj-divisions-heading-secondary">PEOPLE REPORTS</div>';
};

const baseRoute=()=>location.hash.slice(1)||'overview';
let expandedWorkspace=null,lastBase='',executiveExpanded=false,organizationExpanded=false;
let manualExecutive=false,manualOrganization=false;
function syncRoute(){
 const h=baseRoute(),base=h.split(':')[0];
 if(base!==lastBase){
  lastBase=base;
  expandedWorkspace=isArea(base)?base:(h.startsWith('division/')?'people':null);
  if(h.startsWith('view/')&&!manualExecutive)executiveExpanded=true;
  if((h==='office'||h==='divisions'||h.startsWith('division/'))&&!manualOrganization)organizationExpanded=true;
 }
 return h;
}
function areaHtml([id,name,ico]){
 const expanded=expandedWorkspace===id;
 return '<div class="mj-pink-group'+(expanded?' expanded':'')+'" data-pink-group="'+id+'">'+link(id,name,ico)+
 '<button class="mj-pink-expand" type="button" data-pink-expand="'+id+'" aria-expanded="'+expanded+'" aria-controls="pink-'+id+'" aria-label="'+(expanded?'Collapse ':'Expand ')+esc(name)+' subcategories">'+icon('arrow')+'</button></div>'+
 '<div class="mj-pink-submenu" id="pink-'+id+'"'+(expanded?'':' hidden')+'>'+
 (id==='people'?divisionItems():'')+sections(id).map(s=>'<a href="#'+id+':'+s.id+'" data-id="'+id+':'+s.id+'" data-mj-href="'+id+':'+s.id+'" title="'+esc(s.label)+'"><i class="mj-pink-dot" aria-hidden="true"></i><span class="nl">'+esc(s.label)+'</span></a>').join('')+'</div>';
}
function toggle(id,label,expanded,count){
 return '<button class="mj-pink-section-toggle" type="button" data-pink-section="'+id+'" aria-controls="pink-section-'+id+'" aria-expanded="'+expanded+'"><span>'+label+'</span><small>'+count+'</small>'+icon('arrow')+'</button>';
}
function render(){
 const nav=q('#nav');
 if(!nav||!document.body.classList.contains('mj-new'))return;
 syncRoute();
 nav.innerHTML='<div class="mj-pink-heading">MAIN WORKSPACE</div>'+link('overview','Overview','grid')+link('workspaces','All workspaces','office')+
 '<div class="mj-pink-divider"></div><div class="mj-pink-heading">P&C WORKSPACES</div>'+areas.map(areaHtml).join('')+
 '<div class="mj-pink-divider"></div>'+toggle('executive','EXECUTIVE VIEWS',executiveExpanded,6)+
 '<div class="mj-pink-section-body" id="pink-section-executive"'+(executiveExpanded?'':' hidden')+'>'+
 leaders.map(x=>link('view/'+x[0],x[1],'bars')).join('')+'</div>'+
 toggle('organization','ORGANIZATION',organizationExpanded,2)+
 '<div class="mj-pink-section-body" id="pink-section-organization"'+(organizationExpanded?'':' hidden')+'>'+
 link('divisions','All divisions','user')+link('office','3D Office','office')+'</div>';
 const side=q('#side'),foot=q('#sfoot');
 if(side){
  let bar=q('#mj-sidebar-actions',side);
  if(!bar){bar=document.createElement('div');bar.id='mj-sidebar-actions';bar.className='mj-sidebar-actions';side.insertBefore(bar,foot||null)}
  bar.innerHTML=link('settings','Settings & Data','shield')+link('help','Help','search');
 }
 if(foot){
  foot.classList.add('mj-side-status');
  foot.innerHTML='<b><span class="mj-status-dot" aria-hidden="true"></span>Fictional demo · Read-only</b><small>Developed by NemDev</small>';
 }
 const ov=q('[data-mj-href="overview"]',side);
 if(ov){
  ov.classList.add('mj-overview-link');
  q('.mj-overview-count',ov)?.remove();
  const n=typeof MCD!=='undefined'&&Array.isArray(MCD.EXC)?MCD.EXC.length:0;
  const badge=document.createElement('span');badge.className='mj-overview-count';
  badge.textContent=String(n);badge.title=n+' priority items in the fictional dataset';
  ov.appendChild(badge);
 }
 active();
}
function active(){
 const side=q('#side');if(!side)return;
 const h=syncRoute(),base=h.split(':')[0];
 all('[data-mj-href]',side).forEach(a=>{
  const d=a.dataset.mjHref;
  const on=d===h||(d==='settings'&&h==='data-system')||
   (d==='people'&&h.startsWith('people:'))||
   (d==='divisions'&&h.startsWith('division/'));
  a.classList.toggle('on',on);
  if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 });
 all('[data-pink-group]',side).forEach(g=>{
  const id=g.dataset.pinkGroup,expanded=expandedWorkspace===id;
  g.classList.toggle('expanded',expanded);g.classList.toggle('current',id===base||(id==='people'&&h.startsWith('division/')));
  const sub=q('#pink-'+id),btn=g.querySelector('[data-pink-expand]');
  if(sub)sub.hidden=!expanded;
  if(btn){btn.setAttribute('aria-expanded',String(expanded));btn.setAttribute('aria-label',(expanded?'Collapse ':'Expand ')+areas.find(x=>x[0]===id)[1]+' subcategories')}
 });
 for(const id of ['executive','organization']){
  const expanded=id==='executive'?executiveExpanded:organizationExpanded;
  const btn=q('[data-pink-section="'+id+'"]',side),panel=q('#pink-section-'+id,side);
  if(btn){btn.setAttribute('aria-expanded',String(expanded));btn.classList.toggle('expanded',expanded)}
  if(panel)panel.hidden=!expanded;
 }
}
document.addEventListener('click',event=>{
 const item=event.target.closest?.('[data-pink-expand]');
 if(item){
  event.preventDefault();event.stopPropagation();
  expandedWorkspace=expandedWorkspace===item.dataset.pinkExpand?null:item.dataset.pinkExpand;
  active();return;
 }
 const section=event.target.closest?.('[data-pink-section]');
 if(section){
  event.preventDefault();event.stopPropagation();
  if(section.dataset.pinkSection==='executive'){executiveExpanded=!executiveExpanded;manualExecutive=true}
  else{organizationExpanded=!organizationExpanded;manualOrganization=true}
  active();
 }
},true);
window.MJ_PINK_NAV_MANAGED=true;
window.MJ_PINK_NAV_RENDER=render;
window.MJ_PINK_NAV_ACTIVE=active;
addEventListener('hashchange',()=>setTimeout(active,0));
function init(){if(document.body.classList.contains('mj-new'))render();else setTimeout(render,30)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
