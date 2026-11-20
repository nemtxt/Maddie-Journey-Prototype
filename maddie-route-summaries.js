/* Maddie Journey: route-aware, data-grounded summaries.
   Adds small narrative summaries to existing dashboards without changing sources. */
(function(){
 'use strict';
 const view=document.getElementById('view');
 if(!view)return;
 const CATEGORIES=['people','pay','pulse','journey','learning','culture','talent','governance','scoreboard'];
 const TITLES={
  people:'People Directory',pay:'Pay & Benefits',pulse:'Workforce Pulse',
  journey:'Career Journey',learning:'Learning & Development',
  culture:'Culture & Community',talent:'Recruitment',
  governance:'People Governance',scoreboard:'Executive Scoreboard'
 };
 let queued=false;
 const all=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const one=(s,r=document)=>r.querySelector(s);
 const model=()=>typeof MCD==='object'&&MCD?MCD:{};
 const route=()=>{try{return decodeURIComponent(location.hash.slice(1)||'overview')}catch{return location.hash.slice(1)||'overview'}};
 const sections=c=>{try{return typeof CAT_SECTIONS!=='undefined'?(CAT_SECTIONS[c]||[]):[]}catch{return []}};
 const getCount=s=>{try{const v=s.count?.();return v===null||v===undefined||String(v).trim()===''?'—':String(v)}catch{return '—'}};
 const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
 const color=d=>{
  const s=String(d).toLowerCase();
  if(/leadership|executive|ceo|top operations/.test(s))return '#A9F562';
  if(/revenue|rmd/.test(s))return '#9964ED';
  if(/business development|business dev/.test(s))return '#F1AA3B';
  if(/design/.test(s))return '#F6CA31';
  if(/gencon|general construction|construction/.test(s))return '#ED4854';
  if(/corporate|corp ops/.test(s))return '#436FE4';
  if(/^it\b|it operations|coo team|technology/.test(s))return '#3585E8';
  if(/media/.test(s))return '#1DB7AA';
  if(/external affairs/.test(s))return '#6C9F47';
  return '#858585';
 };
 function element(label,title,note,figures,accent){
  const e=document.createElement('section');
  e.className='mj-route-summary';
  e.setAttribute('aria-label',clean(label)+' summary');
  if(accent){e.classList.add('mj-division-summary');e.style.setProperty('--mj-division-accent',accent)}
  const left=document.createElement('div');left.className='mj-summary-main';
  const kicker=document.createElement('p');kicker.className='mj-summary-label';
  if(accent){const dot=document.createElement('i');dot.className='mj-division-key';dot.setAttribute('aria-hidden','true');kicker.append(dot)}
  kicker.append(document.createTextNode(clean(label)));
  const h=document.createElement('h2');h.className='mj-summary-title';h.textContent=clean(title);
  left.append(kicker,h);
  if(note){const p=document.createElement('p');p.className='mj-summary-note';p.textContent=clean(note);left.append(p)}
  e.append(left);
  if(figures?.length){
   const group=document.createElement('div');group.className='mj-summary-stats';
   figures.slice(0,3).forEach(x=>{
    const f=document.createElement('div');f.className='mj-summary-stat';
    const num=document.createElement('strong');num.textContent=clean(x.value);
    const desc=document.createElement('span');desc.textContent=clean(x.label);
    f.append(num,desc);group.append(f);
   });e.append(group);
  }
  return e;
 }
 function insertAfter(target,node){
  if(!target?.parentNode)return false;
  if(one('.mj-route-summary',target.parentNode))return false;
  target.insertAdjacentElement('afterend',node);return true;
 }
 function statsFromCallouts(){
  return all('.cos>.co',view).slice(0,3).map(x=>({
   value:clean(one('b',x)?.textContent)||'—',
   label:clean(one('span',x)?.textContent)||'Figure'
  }));
 }
 function statsFromKpis(){
  return all('.mj-metrics>.mj-metric',view).slice(0,3).map(x=>({
    value:clean(one('strong',x)?.textContent)||'—',
    label:clean(one('span',x)?.textContent)||'Indicator'
  }));
 }
 function contextualSummary(){
  if(one('.mj-route-summary',view))return;
  const h=route(),m=model(),people=Array.isArray(m.EMP)?m.EMP:[],divs=Array.isArray(m.D)?m.D:[];
  const hBase=h.split(':')[0],page=one('.mj-page',view);
  if(h==='overview'){
   const intro=one('.mj-intro',view);
   if(!intro)return;
   const bad=people.filter(x=>Number(x.f)<100).length;
   const summary=element('Workforce summary','People & Culture at a glance',
    'Monitor fictional workforce records and open the relevant workspace for details.',
    [{value:people.length,label:'Employees'},{value:divs.length,label:'Divisions'},{value:bad,label:'201 files incomplete'}]);
   insertAfter(intro,summary);return;
  }
  if(CATEGORIES.includes(hBase)&&h===hBase){
   const sect=sections(hBase),ready=sect.filter(s=>s.state!=='none'),head=one('.mj-head,.ph',view);
   if(!head)return;
   const highlights=sect.filter(s=>getCount(s)!=='—').slice(0,2);
   const facts=[{value:sect.length,label:'Section dashboards'},{value:ready.length,label:'Populated sample reports'}];
   if(highlights.length)facts.push({value:getCount(highlights[0]),label:highlights[0].label});
   const note=sect.length
    ?'First areas: '+sect.slice(0,3).map(s=>s.label).join(' · ')+'.'
    :'Read-only category reporting from the fictional dataset.';
   insertAfter(head,element('Workspace summary',TITLES[hBase]+' — quick overview',note,facts));return;
  }
  const match=/^([a-z]+):([a-z0-9-]+)$/.exec(h);
  if(match&&CATEGORIES.includes(match[1])){
   const s=sections(match[1]).find(x=>x.id===match[2]);
   const pane=one('#pane',view);
   if(!s||!pane)return;
   const stats=statsFromCallouts();
   const figures=stats.length?stats:[{value:getCount(s),label:'Available examples'}];
   const node=element('Subcategory summary',s.label+' — report snapshot',
    s.contents||'This read-only report is based on fictional sample data.',figures);
   node.classList.add('mj-summary-in-grid');
   pane.prepend(node);return;
  }
  if(h.startsWith('division/')){
   const name=h.slice('division/'.length),pane=one('.g12',view);
   if(!pane)return;
   const staff=people.filter(x=>x.dept===name),size=staff.length;
   const avg=size?Math.round(staff.reduce((acc,x)=>acc+(Number(x.f)||0),0)/size):0;
   const lates=staff.reduce((acc,x)=>acc+(Number(x.l30)||0),0);
   const node=element('Division summary',name,
    'Department-specific headcount, document coverage and attendance from the fictional roster.',
    [{value:size,label:'People'},{value:avg+'%',label:'201 file average'},{value:lates,label:'Lates · 30 days'}],color(name));
   node.classList.add('mj-summary-in-grid');pane.prepend(node);return;
  }
  if(h==='divisions'){
   const pane=one('#pane,.g12',view);if(!pane)return;
   const top=[...divs].sort((a,b)=>b[1]-a[1])[0];
   const node=element('Organization summary','Division overview',
    'Select a department for its own workforce and operational dashboard.',
    [{value:divs.length,label:'Divisions'},{value:people.length,label:'Employees'},...(top?[{value:top[1],label:'Largest division · '+top[0]}]:[])]);
   node.classList.add('mj-summary-in-grid');pane.prepend(node);return;
  }
  if(h==='workspaces'||h==='reports'){
   const head=one('.mj-head,.ph',view);if(!head)return;
   const isWork=h==='workspaces';
   insertAfter(head,element('Directory summary',isWork?'Workspace directory':'Executive report directory',
    isWork?'Each workspace links to a distinct category dashboard and its individual reports.':'Read-only leadership views are grouped by role.',
    [{value:isWork?CATEGORIES.length:6,label:isWork?'Workspaces':'Executive views'},
     {value:people.length,label:'Fictional employees'},{value:divs.length,label:'Divisions'}]));return;
  }
  if(h.startsWith('view/')){
   const pane=one('.g12',view);
   if(!pane)return;
   const header=one('.ph h1',view);
   const facts=all('.strip>.k',view).slice(0,2).map(k=>({value:clean(one('b',k)?.textContent)||'—',label:clean(one('small',k)?.textContent)||'Indicator'}));
   const node=element('Executive summary',(header?.textContent||'Leadership report')+' — overview',
    'High-level monitoring figures and detailed report sections from fictional data.',
    facts.length?facts:[{value:people.length,label:'Employees'},{value:divs.length,label:'Divisions'}]);
   node.classList.add('mj-summary-in-grid');pane.prepend(node);return;
  }
  if(h==='office'){
   const pane=one('.g12',view);if(!pane)return;
   const node=element('Organization summary','Office workspace map',
    'Open a division room to view its related dashboard and employee records.',
    [{value:divs.length,label:'Divisions'},{value:people.length,label:'People'}]);
   node.classList.add('mj-summary-in-grid');pane.prepend(node);
  }
 }
 function decorateDivisionCards(){
  all('[data-go^="division/"]',view).forEach(node=>{
   if(node.dataset.mjDivisionColored==='1')return;
   const route=node.getAttribute('data-go')||'';
   let name=route.slice('division/'.length);
   try{name=decodeURIComponent(name)}catch{}
   node.style.setProperty('--mj-division-accent',color(name));
   node.dataset.mjDivisionColored='1';
  });
 }
 function enhance(){
  queued=false;
  if(!document.body.classList.contains('mj-new'))return;
  contextualSummary();decorateDivisionCards();
 }
 function queue(){if(queued)return;queued=true;requestAnimationFrame(enhance)}
 new MutationObserver(queue).observe(view,{childList:true});
 addEventListener('hashchange',queue);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});
 else queue();
})();
