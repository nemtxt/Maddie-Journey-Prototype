/* Restored P&C navigation; leaves the fictional reports and Settings/Data routes intact. */
(function(){
'use strict';
const areas=[['people','People Directory','id'],['pay','Pay & Benefits','wallet'],['pulse','Workforce Pulse','pulse'],['journey','Career Journey','compass'],['learning','Learning & Development','cap'],['culture','Culture & Community','spark'],['talent','Recruitment','brief'],['governance','People Governance','shield'],['scoreboard','Executive Scoreboard','bars']];
const leaders=[['ceo','CEO Overview'],['coo','COO Workforce'],['cso','CSO Career & Culture'],['pc','P&C Operations'],['division','Division Head View'],['monthly','Monthly Review']];
const state=new Map();
const q=(s,r=document)=>r.querySelector(s), all=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const icon=id=>'<svg class="i" aria-hidden="true"><use href="#i-'+id+'"></use></svg>';
const link=(href,label,ico)=>'<a href="#'+href+'" data-id="'+href+'" data-mj-href="'+href+'" title="'+esc(label)+'">'+icon(ico)+'<span class="nl">'+esc(label)+'</span></a>';
function sections(id){try{return typeof CAT_SECTIONS!=='undefined'?(CAT_SECTIONS[id]||[]):[]}catch{return []}}
function render(){
const n=q('#nav');if(!n||!document.body.classList.contains('mj-new'))return;
const selected=(location.hash.slice(1)||'overview').split(':')[0];
const category=([id,name,ico])=>{
const expanded=state.has(id)?state.get(id):id===selected;
return '<div class="mj-pink-group'+(expanded?' expanded':'')+'" data-pink-group="'+id+'">'+link(id,name,ico)+
'<button class="mj-pink-expand" type="button" data-pink-expand="'+id+'" aria-expanded="'+expanded+'" aria-controls="pink-'+id+'" aria-label="'+(expanded?'Collapse ':'Expand ')+esc(name)+' dashboards">'+icon('arrow')+'</button></div>'+
'<div class="mj-pink-submenu" id="pink-'+id+'"'+(expanded?'':' hidden')+'>'+
sections(id).map(s=>'<a href="#'+id+':'+s.id+'" data-id="'+id+':'+s.id+'" data-mj-href="'+id+':'+s.id+'"><i class="mj-pink-dot" aria-hidden="true"></i><span class="nl">'+esc(s.label)+'</span></a>').join('')+'</div>';
};
n.innerHTML='<div class="mj-pink-heading">MAIN WORKSPACE</div>'+link('overview','Overview','grid')+link('workspaces','All workspaces','office')+
'<div class="mj-pink-divider"></div><div class="mj-pink-heading">P&C WORKSPACES</div>'+areas.map(category).join('')+
'<div class="mj-pink-divider"></div><div class="mj-pink-heading">EXECUTIVE VIEWS</div>'+leaders.map(x=>link('view/'+x[0],x[1],'bars')).join('')+
'<div class="mj-pink-divider"></div><div class="mj-pink-heading">ORGANIZATION</div>'+link('divisions','All divisions','user')+link('office','3D Office','office')+
'<div class="mj-pink-foot">'+link('settings','Settings','theme')+link('data-system','Settings & Data','shield')+link('help','How to use','search')+
'<div class="mj-pink-credit">Developed by NemDev</div></div>';
const foot=q('#sfoot');if(foot)foot.innerHTML='<b>Fictional demonstration</b><small>Sample P&C data. No live connector is active.</small>';
active();
}
function active(){
const n=q('#nav');if(!n)return;
const h=location.hash.slice(1)||'overview',base=h.split(':')[0];
all('[data-mj-href]',n).forEach(a=>{const on=a.dataset.mjHref===h;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
all('[data-pink-group]',n).forEach(g=>{const id=g.dataset.pinkGroup,expanded=state.has(id)?state.get(id):id===base;
g.classList.toggle('expanded',!!expanded);g.classList.toggle('current',id===base);
const sub=q('#pink-'+id),btn=g.querySelector('[data-pink-expand]');
if(sub)sub.hidden=!expanded;
if(btn){btn.setAttribute('aria-expanded',String(!!expanded));btn.setAttribute('aria-label',(expanded?'Collapse ':'Expand ')+areas.find(x=>x[0]===id)[1]+' dashboards')}
});
}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-pink-expand]');if(!b)return;e.preventDefault();e.stopPropagation();state.set(b.dataset.pinkExpand,b.getAttribute('aria-expanded')!=='true');active()},true);
addEventListener('hashchange',()=>setTimeout(active,35));
function init(){setTimeout(render,55)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
