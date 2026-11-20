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
function companyChart(){
 const P=people(),D=divisions();
 const panel=make('section','mj-org-panel mj-org-company mj-org-reference');
 panel.id='mj-full-org-chart';
 panel.dataset.mjOrgRoute='overview';
 panel.setAttribute('aria-label','Company organization chart, leadership and eight divisions');
 const head=header('Company organization chart',
  'Explore executive leadership and all eight divisions in a single responsive organization view.');
 const controls=make('div','mj-org-chart-actions');
 const expand=make('button','mj-org-expand','Expand chart');
 expand.type='button';
 expand.dataset.mjOrgExpand='1';
 expand.setAttribute('aria-pressed','false');
 expand.setAttribute('aria-label','Expand organization chart to the full available workspace');
 controls.append(expand);
 head.append(controls);
 const metrics=make('div','mj-org-summary');
 metrics.append(make('strong','',P.length+' people'),make('span','',D.length+' divisions'),make('span','','Levels 6 to 1'));
 head.append(metrics);panel.append(head);
 const root=make('div','mj-org-company-root mj-org-hq-root');
 root.append(make('strong','','MADHOUSE · PEOPLE & CULTURE'),
  make('small','','Executive leadership · Operations · Division teams'));
 panel.append(root);
 const leadership=make('div','mj-org-leadership');
 for(const [tier,label,description] of [
  ['top','Top leadership','Executive team'],
  ['core','Core leadership','Division leaders and principal roles']
 ]){
  const members=P.filter(e=>e.orgTier===tier);
  const band=make('section','mj-org-hierarchy-band');
  band.dataset.orgTier=tier;
  const labelRow=make('div','mj-org-band-heading');
  labelRow.append(make('strong','',label),make('small','',members.length+' people · '+description));
  band.append(labelRow);
  const group=make('div','mj-org-leadership-people');
  members.forEach(e=>group.append(person(e)));
  band.append(group);leadership.append(band);
 }
 panel.append(leadership);
 const note=make('div','mj-org-grid-intro');
 note.append(make('strong','','Division-level organization'),
  make('span','','Scroll horizontally to view every division; select a name to open their profile.'));
 panel.append(note);
 const scroll=make('div','mj-org-division-scroll');
 scroll.tabIndex=0;
 scroll.setAttribute('role','region');
 scroll.setAttribute('aria-label','Organization chart: eight division columns, scroll horizontally when needed');
 const tree=make('div','mj-org-company-tree mj-org-chart-columns');
 const departmentStaff=P.filter(e=>e.orgTier==='division'||!e.orgTier);
 D.forEach(([name])=>tree.append(divisionUnit(name,departmentStaff,{inline:true,allLevels:true})));
 const board=make('div','mj-org-chart-board');
 // Shared row heights are computed from the densest division at each level.
 // This avoids clipping long lists (e.g. seven Corporate Operations members)
 // and keeps the level labels perfectly aligned across all columns.
 const divisionTeams=D.map(([name])=>departmentStaff.filter(e=>e.dept===name));
 [6,5,4,3,2,1].forEach(n=>{
  const most=Math.max(0,...divisionTeams.map(team=>count(team,n)));
  const height=Math.max(96,most*30+22);
  board.style.setProperty('--mj-org-h'+n,height+'px');
 });
 const rail=make('div','mj-org-level-rail');
 rail.append(make('span','mj-org-level-rail-title','LEVEL'));
 [6,5,4,3,2,1].forEach(n=>rail.append(make('span','mj-org-level-rail-row','Level '+n)));
 board.append(rail,tree);
 scroll.append(board);panel.append(scroll);
 panel.append(make('p','mj-org-footnote',
  'Reference-based fictional names. Leadership and division levels are shown without inventing individual reporting relationships.'));
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
  button.textContent='Expand chart';
  button.setAttribute('aria-pressed','false');
  button.setAttribute('aria-label','Expand organization chart to the full available workspace');
 }
 document.body.classList.remove('mj-org-expanded-open');
 button?.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-mj-org-expand]');
 if(!button)return;
 const panel=button.closest('.mj-org-reference');
 if(!panel)return;
 if(expandedChart===panel){closeExpandedChart();return}
 closeExpandedChart();
 expandedChart=panel;
 panel.classList.add('mj-org-expanded');
 document.body.classList.add('mj-org-expanded-open');
 button.textContent='Exit expanded view';
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
