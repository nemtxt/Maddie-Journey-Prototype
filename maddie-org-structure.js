/* Maddie Journey — complete fictional organization chart for Overview and
 * level-based division charts. The rendered hierarchy uses only existing
 * department membership, level and head flags; no inferred reporting lines.
 */
(function(){
'use strict';
const view=document.getElementById('view');
if(!view)return;
const $=(sel,base=view)=>base.querySelector(sel);
const people=()=>Array.isArray(window.MCD?.EMP)?window.MCD.EMP:[];
const divisions=()=>Array.isArray(window.MCD?.D)?window.MCD.D:[];
const route=()=>{try{return decodeURIComponent(location.hash.slice(1)||'overview')}catch{return location.hash.slice(1)||'overview'}};
const color=name=>window.MJ_DIVISION_COLOR?.(name)||'#7d7d7d';
const level=e=>Number(e.orgLevel)>0?Math.min(6,Number(e.orgLevel)):e.head?1:Math.max(2,Math.min(6,Number(e.lvl)||3));
const make=(tag,cls,txt)=>{
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(txt!==undefined)e.textContent=String(txt);
 return e;
};
const count=(arr,n)=>arr.filter(x=>level(x)===n).length;
function person(e){
 const btn=make('button','mj-org-person');
 btn.type='button';btn.dataset.emp=String(e.i);
 btn.title='Open read-only sample profile for '+e.name;
 btn.setAttribute('aria-label','View '+e.name+' — '+(e.role||'Role not recorded'));
 const avatar=make('span','mj-org-avatar',(e.name||'?').split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase());
 avatar.setAttribute('aria-hidden','true');
 const info=make('span','mj-org-person-text');
 info.append(make('strong','',e.name),make('small','',e.role||'Position not recorded'));
 btn.append(avatar,info);
 return btn;
}
function levelTitle(n){
 return n===1?'Division leadership':n===2?'Senior & supervisory roles':n===3?'Team roles':'Level '+n;
}
function levels(list,{compact=false,allLevels=false}={}){
 const wrap=make('div','mj-org-levels mj-org-level-bands'+(compact?' compact':''));
 // Match the supplied level-band chart: highest recorded level at the top.
 const levels=allLevels?[6,5,4,3,2,1]:[...new Set(list.map(level))].sort((a,b)=>b-a);
 if(!levels.length){wrap.append(make('p','mj-org-empty','No employees are recorded in this division.'));return wrap}
 for(const n of levels){
  const group=make('section','mj-org-level-group');
  if(allLevels)group.style.setProperty('--mj-org-specific-height','var(--mj-org-h'+n+',128px)');
  const head=make('div','mj-org-level-heading');
  head.append(make('span','mj-org-level-badge','L'+n),make('strong','',levelTitle(n)),make('small','',count(list,n)+' '+(count(list,n)===1?'person':'people')));
  group.append(head);
  const members=make('div','mj-org-members');
  list.filter(e=>level(e)===n).sort((a,b)=>(a.role||'').localeCompare(b.role||'')||(a.name||'').localeCompare(b.name||'')).forEach(e=>members.append(person(e)));
  group.append(members);wrap.append(group);
 }
 return wrap;
}
function divisionUnit(name,all,{inline=false,open=true,allLevels=false}={}){
 const staff=all.filter(e=>e.dept===name);
 const unit=make(inline?'div':'details','mj-org-unit');
 unit.style.setProperty('--mj-org-accent',color(name));
 if(!inline)unit.open=open;
 const header=make(inline?'header':'summary','mj-org-unit-heading');
 const dot=make('i','mj-org-division-dot');dot.setAttribute('aria-hidden','true');
 const label=make('span','mj-org-unit-label');
 label.append(make('strong','',name),make('small','',staff.length+' '+(staff.length===1?'person':'people')+' · '+[...new Set(staff.map(level))].length+' levels'));
 header.append(dot,label);
 if(inline){
  const link=make('a','mj-org-division-link','View');
  link.href='#division/'+encodeURIComponent(name);
  link.title='Open the '+name+' division dashboard';
  link.setAttribute('aria-label','Open '+name+' division dashboard');
  header.append(link);
 }else{
  const caret=make('span','mj-org-caret','▾');
  caret.setAttribute('aria-hidden','true');header.append(caret);
 }
 unit.append(header);
 const inner=make('div','mj-org-unit-content');
 inner.append(levels(staff,{compact:!inline,allLevels}));
 if(!inline){
  const link=make('a','mj-org-open','Open division dashboard');
  link.href='#division/'+encodeURIComponent(name);
  inner.append(link);
 }
 unit.append(inner);
 return unit;
}
function header(text,desc){
 const h=make('div','mj-org-section-header');
 const titles=make('div','mj-org-titles');
 titles.append(make('p','mj-org-eyebrow','ORGANIZATION STRUCTURE'),make('h2','',text),make('p','mj-org-description',desc));
 h.append(titles);return h;
}
/* Single-canvas organization chart: compact, connected and all eight division
 * columns visible on wide screens. The links represent organization groupings,
 * not unrecorded person-to-person reporting lines.
 */
function companyChart(){
 const P=people(),D=divisions();
 const order=['RMD','BUSINESS DEV','DESIGN/OPERATION','GENCON','CORP OPS','COO TEAM','MEDIA','CEO TEAM'];
 const ranked=[...D].sort((a,b)=>{
  const ai=order.indexOf(a[0]),bi=order.indexOf(b[0]);
  return (ai<0?100:ai)-(bi<0?100:bi);
 });
 const panel=make('section','mj-one-chart');
 panel.id='mj-full-org-chart';
 panel.dataset.mjOrgRoute='overview';
 panel.setAttribute('aria-label','Complete Madhouse company organization chart: leadership and all eight division levels');
 const h=make('header','mj-one-header');
 const titles=make('div','mj-one-titles');
 titles.append(make('p','mj-one-overline','PEOPLE & CULTURE · COMPANY STRUCTURE'));
 titles.append(make('h2','','Organization'));
 titles.append(make('p','mj-one-lede','Leadership and every division in one connected, single-screen overview.'));
 const meta=make('div','mj-one-meta');
 meta.append(make('strong','',P.length+' people'),make('span','',ranked.length+' divisions'),make('span','','Levels 6–1'));
 const controls=make('div','mj-one-actions');
 const expand=make('button','mj-one-expand','Full view');
 expand.type='button';expand.dataset.mjOrgExpand='1';
 expand.setAttribute('aria-pressed','false');
 expand.setAttribute('aria-label','Open the organization chart in a full-workspace view');
 controls.append(expand);
 h.append(titles,meta,controls);panel.append(h);

 // Render one employee identity once. Buttons retain the existing data-emp
 // handler, so every position opens the correct read-only employee profile.
 const compactPerson=(e,{detailed=false}={})=>{
  const b=make('button','mj-one-person'+(detailed?' mj-one-leader':''));
  b.type='button';b.dataset.emp=String(e.i);
  b.setAttribute('aria-label','Open profile: '+e.name+', '+(e.role||'role not recorded'));
  b.title=e.name+' · '+(e.role||'Role not recorded');
  const dot=make('i','mj-one-dot');
  dot.setAttribute('aria-hidden','true');
  const content=make('span','mj-one-person-name');
  content.append(make('strong','',e.name));
  if(detailed)content.append(make('small','',e.role||'Role not recorded'));
  b.append(dot,content);
  return b;
 };
 const tree=make('div','mj-one-tree');
 const ceo=P.find(e=>e.orgTier==='top'&&/chief executive officer/i.test(e.role||''))||
           P.find(e=>e.orgTier==='top')||null;
 const leadership=P.filter(e=>e.orgTier==='top'&&e!==ceo);
 const core=P.filter(e=>e.orgTier==='core');
 const main=make('div','mj-one-ceo');
 if(ceo)main.append(compactPerson(ceo,{detailed:true}));
 else main.append(make('strong','','Madhouse · Leadership'));
 tree.append(main);
 const connectorTop=make('div','mj-one-line mj-one-line-top');
 connectorTop.setAttribute('aria-hidden','true');tree.append(connectorTop);
 const top=make('div','mj-one-leader-row mj-one-executives');
 const topLabel=make('span','mj-one-rank-label','TOP LEADERSHIP');
 top.append(topLabel);
 const topPeople=make('div','mj-one-leader-list');
 leadership.forEach(e=>topPeople.append(compactPerson(e,{detailed:true})));
 top.append(topPeople);tree.append(top);
 const connectorCore=make('div','mj-one-line mj-one-line-middle');
 connectorCore.setAttribute('aria-hidden','true');tree.append(connectorCore);
 const coreRow=make('div','mj-one-leader-row mj-one-core');
 coreRow.append(make('span','mj-one-rank-label','CORE LEADERSHIP'));
 const corePeople=make('div','mj-one-leader-list');
 core.forEach(e=>corePeople.append(compactPerson(e,{detailed:true})));
 coreRow.append(corePeople);tree.append(coreRow);
 const connectorDivision=make('div','mj-one-line mj-one-line-divisions');
 connectorDivision.setAttribute('aria-hidden','true');tree.append(connectorDivision);

 const board=make('div','mj-one-board');
 board.setAttribute('aria-label','Eight division organization chart, levels six through one');
 const heading=make('div','mj-one-board-heading');
 heading.append(make('div','mj-one-level-head','LEVEL'));
 ranked.forEach(([name])=>{
  const group=P.filter(e=>e.dept===name);
  const unit=make('div','mj-one-department');
  unit.style.setProperty('--mj-one-color',color(name));
  const link=make('a','mj-one-department-link');
  link.href='#division/'+encodeURIComponent(name);
  link.title='Open '+name+' division dashboard';
  link.append(make('i','mj-one-department-dot'),make('strong','',name));
  unit.append(link,make('small','',group.length+' people'));
  heading.append(unit);
 });
 board.append(heading);
 const remaining=P.filter(e=>e.orgTier!=='top'&&e.orgTier!=='core');
 const rowOrder=[6,5,4,3,2,1];
 rowOrder.forEach(n=>{
  const row=make('div','mj-one-level-row');
  row.dataset.mjOneLevel=String(n);
  row.append(make('span','mj-one-level-name','Level '+n));
  ranked.forEach(([name])=>{
   const cell=make('div','mj-one-cell');
   cell.style.setProperty('--mj-one-color',color(name));
   const members=remaining.filter(e=>e.dept===name&&level(e)===n);
   members.sort((a,b)=>(a.name||'').localeCompare(b.name||''));
   members.forEach(e=>cell.append(compactPerson(e)));
   row.append(cell);
  });
  board.append(row);
 });
 tree.append(board);
 // Tablet/mobile view stacks divisions instead of clipping names or requiring
 // horizontal scrolling; this is intentionally hidden at desktop widths.
 const mobile=make('div','mj-one-mobile-divisions');
 mobile.append(make('p','mj-one-mobile-title','Division levels'));
 ranked.forEach(([name])=>{
  const staff=P.filter(e=>e.dept===name);
  const section=make('details','mj-one-mobile-unit');
  section.style.setProperty('--mj-one-color',color(name));
  const summary=make('summary','');
  summary.append(make('i','mj-one-department-dot'),make('strong','',name),make('small','',staff.length+' people'));
  section.append(summary);
  const inner=make('div','mj-one-mobile-levels');
  for(const n of rowOrder){
   const members=staff.filter(e=>level(e)===n);
   if(!members.length)continue;
   const row=make('div','mj-one-mobile-level');
   row.append(make('span','', 'Level '+n));
   const cards=make('div','mj-one-mobile-people');
   members.forEach(e=>cards.append(compactPerson(e)));
   row.append(cards);inner.append(row);
  }
  section.append(inner);mobile.append(section);
 });
 tree.append(mobile);panel.append(tree);
 panel.append(make('p','mj-one-footnote',
  'Fictional roster · Lines connect organizational groups, not unverified individual reporting relationships. Select any name to open its profile.'));
 return panel;
}
function divisionChart(name){
 const P=people(),D=divisions();
 const known=D.some(([n])=>n===name);
 if(!known)return null;
 const staff=P.filter(e=>e.dept===name);
 const panel=make('section','mj-org-panel mj-org-division');
 panel.dataset.mjOrgRoute='division/'+name;
 panel.style.setProperty('--mj-org-accent',color(name));
 panel.setAttribute('aria-label',name+' organization and role levels');
 const heading=header(name+' · organization chart',
  'Division hierarchy grouped by recorded levels and positions. All '+staff.length+' team members are included below.');
 const metrics=make('div','mj-org-summary');
 const leads=staff.filter(e=>level(e)===1).length;
 metrics.append(make('strong','',staff.length+' people'),make('span','',leads+' division '+(leads===1?'head':'heads')),
  make('span','',new Set(staff.map(level)).size+' levels'));
 heading.append(metrics);panel.append(heading);
 const root=make('div','mj-org-company-root mj-org-division-root');
 root.append(make('i','mj-org-division-dot'));
 const text=make('span','');
 text.append(make('strong','',name),make('small','','Division · '+staff.length+' people'));
 root.append(text);panel.append(root);
 const chart=make('div','mj-org-division-chart');
 chart.append(levels(staff));
 panel.append(chart);
 panel.append(make('p','mj-org-footnote',
  'People are grouped by recorded position levels. Direct manager-to-employee reporting relationships are not specified in the fictional source.'));
 return panel;
}
// Expanded chart provides maximum usable space without entering the browser
// Fullscreen API, so profiles, navigation and keyboard access still work.
let expandedChart=null;
function closeExpandedChart(){
 if(!expandedChart)return;
 const panel=expandedChart;expandedChart=null;
 panel.classList.remove('mj-org-expanded');
 const button=panel.querySelector('[data-mj-org-expand]');
 if(button){
  button.textContent=panel.classList.contains('mj-one-chart')?'Full view':'Expand chart';
  button.setAttribute('aria-pressed','false');
  button.setAttribute('aria-label','Expand organization chart to the full available workspace');
 }
 document.body.classList.remove('mj-org-expanded-open');
 button?.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-mj-org-expand]');
 if(!button)return;
 const panel=button.closest('.mj-one-chart,.mj-org-reference');
 if(!panel)return;
 if(expandedChart===panel){closeExpandedChart();return}
 closeExpandedChart();
 expandedChart=panel;
 panel.classList.add('mj-org-expanded');
 document.body.classList.add('mj-org-expanded-open');
 button.textContent='Close full view';
 button.setAttribute('aria-pressed','true');
 button.setAttribute('aria-label','Close expanded organization chart');
 panel.scrollTop=0;
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&expandedChart){event.preventDefault();closeExpandedChart()}
});
window.addEventListener('hashchange',closeExpandedChart);
let scheduled=false;
function enhance(){
 scheduled=false;
 if(!document.body.classList.contains('mj-new'))return;
 const h=route();
 if(h==='overview'){
  const page=$('.mj-page'),metrics=$('.mj-metrics');
  if(!page||!metrics||!page.contains(metrics))return;
  if(!$('#mj-full-org-chart')){
   const chart=companyChart();
   metrics.insertAdjacentElement('afterend',chart);
  }
  return;
 }
 if(h.startsWith('division/')){
  const label=h.slice(9),existing=$('.mj-org-division');
  if(existing?.dataset.mjOrgRoute===h)return;
  const ph=$('.ph'),grid=$('.g12');
  if(!ph||!grid||!grid.isConnected)return;
  existing?.remove();
  const chart=divisionChart(label);
  if(chart)ph.insertAdjacentElement('afterend',chart);
 }
}
function schedule(){
 if(scheduled)return;
 scheduled=true;requestAnimationFrame(enhance);
}
// Only full page replacements require rebuilding a chart. The chart's own
// inserted employee cards must not trigger repeated organization-wide scans.
new MutationObserver(schedule).observe(view,{childList:true});
addEventListener('hashchange',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
