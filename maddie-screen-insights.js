/* Maddie Journey: in-page summary dashboards and consistent division colors.
 * Sidebar link removal remains intact. All values come from existing demo records.
 */
(function(){
'use strict';
const root=document.getElementById('view');
if(!root)return;
const $=(s,r=root)=>r.querySelector(s), $$=(s,r=root)=>Array.from(r.querySelectorAll(s));
const CATS=['people','pay','pulse','journey','learning','culture','talent','governance','scoreboard'];
const CATLABEL={
 people:'People Directory',pay:'Pay & Benefits',pulse:'Workforce Pulse',
 journey:'Career Journey',learning:'Learning & Development',
 culture:'Culture & Community',talent:'Recruitment',
 governance:'People Governance',scoreboard:'Executive Scoreboard'
};
const DIVISION_COLORS=[
 [/revenue management|^rmd$/i,'#a166ed'],
 [/design\s*(?:&|\/|and)?\s*(?:design operations|operations|ops)?$/i,'#f1c232'],
 [/corporate operations|corp(?:orate)? ops/i,'#4775e4'],
 [/^media$/i,'#1db9aa'],
 [/^coo team$|^it operations$|^it$/i,'#308ce6'],
 [/^gencon$|general construction/i,'#f14958'],
 [/business development|business dev/i,'#f2a735'],
 [/^ceo team$|top leadership|executive leadership|external affairs/i,'#a6f369']
];
const norm=v=>String(v??'').trim().replace(/\s+/g,' ');
const color=name=>{
 const n=norm(name);
 for(const [pat,value] of DIVISION_COLORS)if(pat.test(n))return value;
 return '#858585';
};
window.MJ_DIVISION_COLOR=color;
const model=()=>window.MCD||{};
const staff=()=>Array.isArray(model().EMP)?model().EMP:[];
const divisions=()=>Array.isArray(model().D)?model().D:[];
const sections=k=>{try{return typeof CAT_SECTIONS!=='undefined'?(CAT_SECTIONS[k]||[]):[]}catch{return []}};
const route=()=>{try{return decodeURIComponent(location.hash.slice(1)||'overview')}catch{return location.hash.slice(1)||'overview'}};
const metric=(value,label)=>({value:norm(value),label:norm(label)});
const count=s=>{try{const v=s?.count?.();return v==null||v===''?null:String(v)}catch{return null}};
const sum=(rows,key)=>rows.reduce((n,r)=>n+(Number(r[key])||0),0);
const dt=()=>divisions().length;
const employeeStats=()=>{
 const rows=staff();
 return {total:rows.length,divisionCount:dt(),
  regular:rows.filter(e=>/regular/i.test(e.status||'')).length,
  incomplete:rows.filter(e=>Number(e.f)<100).length,
  complete:rows.filter(e=>Number(e.f)>=100).length,
  avg:rows.length?Math.round(sum(rows,'f')/rows.length):0,
  probation:rows.filter(e=>/probation/i.test(e.status||'')).length,
  lates:sum(rows,'l30'),peopleLate:rows.filter(e=>Number(e.l30)>0).length,
  upcoming:rows.filter(e=>['In progress','For evaluation','Onboarding'].includes(e.stage)).length,
  completed:rows.filter(e=>e.stage==='Completed').length};
};
function renderMetric(f){
 const cell=document.createElement('div');cell.className='mj-screen-figure';
 const strong=document.createElement('strong');strong.textContent=f.value;
 const small=document.createElement('span');small.textContent=f.label;
 cell.append(strong,small);return cell;
}
function summary({kicker='REPORT SNAPSHOT',note='',metrics=[],accent=null,routeKey=''}) {
 const section=document.createElement('section');
 section.className='mj-screen-insights';
 section.dataset.mjSummaryRoute=routeKey;
 section.setAttribute('aria-label','Summary for '+routeKey.replace(/[/:]/g,' '));
 if(accent){section.classList.add('mj-summary-division');section.style.setProperty('--mj-division-accent',accent)}
 const intro=document.createElement('div');intro.className='mj-screen-intro';
 const title=document.createElement('span');title.className='mj-screen-kicker';title.textContent=kicker;
 const hint=document.createElement('p');hint.textContent=note;
 intro.append(title,hint);
 const figures=document.createElement('div');figures.className='mj-screen-figures';
 metrics.filter(f=>f&&f.value!='').slice(0,3).forEach(f=>figures.append(renderMetric(f)));
 section.append(intro,figures);
 return section;
}
function contextFacts(k,s,available){
 const st=employeeStats(),N=staff();
 if(k==='people')return [metric(st.total,'Employees'),metric(st.divisionCount,'Divisions'),metric(st.incomplete,'Incomplete 201 files')];
 if(k==='pay')return [metric(st.regular,'Regular employees'),metric(st.total,'Workforce records'),metric(available,'Populated reports')];
 if(k==='pulse')return [metric(st.lates,'Lates · last 30 days'),metric(st.peopleLate,'Employees with lates'),metric(available,'Populated reports')];
 if(k==='journey')return [metric(st.completed,'Completed journey'),metric(st.upcoming,'Active journey stages'),metric(available,'Populated reports')];
 if(k==='learning'){
  const records=N.filter(e=>e.dev&&Object.values(e.dev).some(v=>v!=null&&v!==''&&v!=='Not recorded')).length;
  return [metric(records,'Development records'),metric(s.length,'Learning sections'),metric(available,'Populated reports')];
 }
 if(k==='culture')return [metric(s.length,'Culture sections'),metric(available,'Populated reports'),metric(st.total,'Employees covered')];
 if(k==='talent')return [metric(s.length,'Recruitment sections'),metric(available,'Populated reports'),metric(st.divisionCount,'Divisions supported')];
 if(k==='governance')return [metric((model().CASES||[]).length,'Governance cases'),metric(s.length,'Governance sections'),metric(available,'Populated reports')];
 if(k==='scoreboard')return [metric((model().EXC||[]).length,'Priority indicators'),metric(st.divisionCount,'Divisions'),metric(available,'Populated reports')];
 return [metric(s.length,'Sections'),metric(available,'Populated reports')];
}
function reportFacts(category,section){
 const entries=staff(),st=employeeStats();
 if(category==='people'&&section.id==='masterlist')return [
  metric(st.total,'Employee records'),metric(st.divisionCount,'Divisions'),metric(st.regular,'Regular employees')
 ];
 if(category==='people'&&section.id==='documents')return [
  metric(st.complete,'201 files complete'),metric(st.incomplete,'Incomplete files'),metric(st.avg+'%','Average completeness')
 ];
 if(category==='people'&&section.id==='personal')return [
  metric(entries.filter(e=>e.contact?.companyEmail).length,'Company emails'),
  metric(entries.filter(e=>e.contact?.phone).length,'Phone records'),
  metric(st.total,'Employee profiles')];
 if(category==='pulse'&&/attend|late/i.test(section.id+' '+section.label))return [
  metric(st.lates,'Lates · last 30 days'),
  metric(st.peopleLate,'Employees with lates'),
  metric(st.total,'Employees covered')];
 if(category==='journey'&&/journey|probation|onboard|movement/i.test(section.id+' '+section.label))return [
  metric(st.upcoming,'In-progress stages'),metric(st.completed,'Completed stages'),metric(st.total,'Employees')];
 const kpis=$$('.cos>.co,.strip>.k').slice(0,3).map(item=>{
  const v=norm($('b,strong',item)?.textContent||'');
  const l=norm($('small,span',item)?.textContent||'');
  return v&&l?metric(v,l):null;
 }).filter(Boolean);
 if(kpis.length>=2)return kpis;
 const table=$('#pane table');
 const tableRows=table?$$('tbody tr',table).length:0;
 const fields=table?$$('thead th',table).length:0;
 const result=[];
 const counted=count(section);
 if(counted!==null)result.push(metric(counted,'Report coverage'));
 if(table&&tableRows>0)result.push(metric(tableRows,'Listed records'));
 if(table&&fields>0&&result.length<3)result.push(metric(fields,'Tracked fields'));
 if(result.length<2&&section.src?.length)result.push(metric(section.src.length,'Source groups'));
 if(result.length<2)result.push(metric(sections(category).length,'Category sections'));
 return result.slice(0,3);
}
function headerForCurrent(){
 const h=route(),people=employeeStats(),base=h.split(':')[0];
 if(h==='office'&&document.body.classList.contains('hxon'))return null;
 if(h==='overview'){
  // Overview already presents four live KPI cards immediately after the photo hero.
  return null;
 }
 if(CATS.includes(base)&&h===base){
  const L=sections(base),available=L.filter(s=>s.state!=='none').length;
  const header=$('.mj-head,.ph');if(!header)return null;
  return {node:header,tag:'WORKSPACE AT A GLANCE',
   note:'Reporting coverage for '+CATLABEL[base]+'. Open a section below for the underlying records.',
   metrics:contextFacts(base,L,available)};
 }
 const sub=/^([a-z]+):([a-z0-9-]+)$/.exec(h);
 if(sub&&CATS.includes(sub[1])){
  const sect=sections(sub[1]).find(s=>s.id===sub[2]),header=$('.ph');
  if(!sect||!header)return null;
  return {node:header,tag:'SECTION AT A GLANCE',
   note:'Key figures for '+sect.label+' from the current fictional reporting dataset.',
   metrics:reportFacts(sub[1],sect)};
 }
 if(h.startsWith('division/')){
  const name=h.slice('division/'.length),header=$('.ph'),workers=staff().filter(x=>x.dept===name);
  if(!header)return null;
  const n=workers.length,avg=n?Math.round(sum(workers,'f')/n):0;
  return {node:header,tag:'DIVISION AT A GLANCE',accent:color(name),
   note:'Team-specific workforce, document and attendance indicators.',
   metrics:[metric(n,'Employees'),metric(avg+'%','201 file average'),metric(sum(workers,'l30'),'Lates · last 30 days')]};
 }
 if(h==='divisions'){
  const header=$('.ph,.mj-head');
  if(!header)return null;
  return {node:header,tag:'ORGANIZATION AT A GLANCE',
   note:'Each division uses the same color legend in navigation and department reports.',
   metrics:[metric(people.divisionCount,'Divisions'),metric(people.total,'Employee records'),metric(people.incomplete,'Incomplete 201 files')]};
 }
 if(h==='workspaces'||h==='reports'){
  const header=$('.mj-head,.ph');if(!header)return null;
  return {node:header,tag:h==='workspaces'?'WORKSPACE DIRECTORY':'EXECUTIVE REPORTS',
   note:h==='workspaces'?'Select a workspace to inspect its reporting sections.':'Read-only leadership monitoring views.',
   metrics:[metric(h==='workspaces'?CATS.length:6,h==='workspaces'?'Workspaces':'Executive views'),
    metric(people.total,'Employees'),metric(people.divisionCount,'Divisions')]};
 }
 if(h.startsWith('view/')){
  const header=$('.ph');if(!header)return null;
  const kpis=$$('.strip>.k').slice(0,3).map(node=>
   metric($('b',node)?.textContent||'—',$('small',node)?.textContent||'Indicator'));
  return {node:header,tag:'EXECUTIVE VIEW AT A GLANCE',
   note:'Highlights from this leadership report; detailed records remain below.',
   metrics:kpis.length?kpis:[metric(people.total,'Employees'),metric(people.divisionCount,'Divisions')]};
 }
 if(h==='help'||h==='settings'||h==='data-system'){
  const header=$('.mj-head,.ph');if(!header)return null;
  const detail=h==='help'
   ?'Navigation and reporting guidance for the read-only demonstration.'
   :h==='settings'?'Appearance and accessibility preferences for this browser.'
   :'Source architecture and fictional data documentation; no live connector.';
  return {node:header,tag:'PAGE OVERVIEW',note:detail,
   metrics:h==='data-system'?[metric(CATS.length,'Reporting areas'),metric(people.total,'Fictional records')]
    :[metric(CATS.length,'Reporting areas'),metric(people.divisionCount,'Divisions')]};
 }
 const header=$('.ph,.mj-head');
 if(!header)return null;
 return {node:header,tag:'PAGE AT A GLANCE',
  note:'This page presents the current fictional monitoring report.',
  metrics:[metric(people.total,'Employee records'),metric(people.divisionCount,'Divisions')]};
}
function decorateDivisions(){
 const known=divisions();
 const names=known.map(([n])=>n);
 function matchLabel(label){
  const t=norm(label);
  if(!t)return '';
  const direct=names.find(n=>norm(n).toLowerCase()===t.toLowerCase());
  if(direct)return direct;
  const aliases=[
   ['RMD','Revenue Management'],['Design / Ops','Design & Design Operations'],
   ['Design & Operations','Design & Design Operations'],['Corp Ops','Corporate Operations'],
   ['Business Dev','Business Development'],['CEO','CEO Team'],
   ['COO','COO Team'],['IT Operations','COO Team']
  ];
  const alias=aliases.find(([a])=>a.toLowerCase()===t.toLowerCase());
  if(alias){const v=names.find(n=>n.toLowerCase()===alias[1].toLowerCase());return v||''}
  return '';
 }
 const h=route();
 root.removeAttribute('data-mj-division-color');
 if(h.startsWith('division/')){
  const name=h.slice('division/'.length),accent=color(name);
  root.dataset.mjDivisionColor=accent;
  root.style.setProperty('--mj-division-accent',accent);
 }
 $$('[data-go^="division/"],[href^="#division/"]').forEach(el=>{
  const url=el.getAttribute('data-go')||el.getAttribute('href')?.slice(1)||'';
  let name=url.slice('division/'.length);
  try{name=decodeURIComponent(name)}catch{}
  const clr=color(name);
  if(el.style.getPropertyValue('--mj-division-accent')!==clr)el.style.setProperty('--mj-division-accent',clr);
  if(el.style.getPropertyValue('--c')!==clr&&el.matches('.dvc'))el.style.setProperty('--c',clr);
  if(el.matches('.dvc'))el.classList.add('mj-division-surface');
 });
 $$('table').forEach(table=>{
  const head=$$('thead th',table);
  const cols=head.map((th,i)=>/^(division|department|unit|team)$/i.test(norm(th.textContent))?i:-1).filter(i=>i>=0);
  if(!cols.length)return;
  $$('tbody tr',table).forEach(tr=>{
   cols.forEach(i=>{
    const td=tr.cells?.[i];if(!td||td.querySelector('.mj-division-key'))return;
    const name=matchLabel(td.textContent);if(!name)return;
    const dot=document.createElement('span');dot.className='mj-division-key';
    dot.setAttribute('aria-hidden','true');dot.style.setProperty('--mj-division-accent',color(name));
    td.prepend(dot);td.classList.add('mj-division-table-cell');
   });
  });
 });
 $$('.bars li').forEach(li=>{
  const text=norm($('.bl',li)?.textContent),name=matchLabel(text);
  if(!name)return;
  const bar=$('.bt i',li);
  if(bar&&bar.style.getPropertyValue('--c')!==color(name))bar.style.setProperty('--c',color(name));
  li.style.setProperty('--mj-division-accent',color(name));li.classList.add('mj-division-chart-row');
 });
}
let pending=false;
function update(){
 pending=false;
 if(!document.body.classList.contains('mj-new'))return;
 const current=route();
 // The older generic summary widgets are intentionally replaced by
 // meaningful screen-level summaries, not duplicated or added to navigation.
 $$('.mj-route-summary').forEach(el=>el.remove());
 $$('.mj-screen-insights').forEach(el=>{
  if(el.dataset.mjSummaryRoute!==current)el.remove();
 });
 const data=headerForCurrent();
 if(data&&data.node&&!$('.mj-screen-insights',data.node)){
  const block=summary({...data,routeKey:current});
  data.node.append(block);
  data.node.classList.add('mj-summary-header');
  if(data.accent)data.node.style.setProperty('--mj-division-accent',data.accent);
 }
 decorateDivisions();
}
const queue=()=>{if(!pending){pending=true;requestAnimationFrame(update)}};
new MutationObserver(queue).observe(root,{subtree:true,childList:true});
addEventListener('hashchange',queue);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
})();