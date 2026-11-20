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
const level=e=>e.head?1:Math.max(2,Math.min(6,Number(e.lvl)||3));
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
function levels(list,{compact=false}={}){
 const wrap=make('div','mj-org-levels'+(compact?' compact':''));
 const levels=[...new Set(list.map(level))].sort((a,b)=>a-b);
 if(!levels.length){wrap.append(make('p','mj-org-empty','No employees are recorded in this division.'));return wrap}
 for(const n of levels){
  const group=make('section','mj-org-level-group');
  const head=make('div','mj-org-level-heading');
  head.append(make('span','mj-org-level-badge','L'+n),make('strong','',levelTitle(n)),make('small','',count(list,n)+' '+(count(list,n)===1?'person':'people')));
  group.append(head);
  const members=make('div','mj-org-members');
  list.filter(e=>level(e)===n).sort((a,b)=>(a.role||'').localeCompare(b.role||'')||(a.name||'').localeCompare(b.name||'')).forEach(e=>members.append(person(e)));
  group.append(members);wrap.append(group);
 }
 return wrap;
}
function divisionUnit(name,all,{inline=false,open=true}={}){
 const staff=all.filter(e=>e.dept===name);
 const unit=make(inline?'div':'details','mj-org-unit');
 unit.style.setProperty('--mj-org-accent',color(name));
 if(!inline)unit.open=open;
 const header=make(inline?'header':'summary','mj-org-unit-heading');
 const dot=make('i','mj-org-division-dot');dot.setAttribute('aria-hidden','true');
 const label=make('span','mj-org-unit-label');
 label.append(make('strong','',name),make('small','',staff.length+' '+(staff.length===1?'person':'people')+' · '+[...new Set(staff.map(level))].length+' levels'));
 header.append(dot,label);
 if(!inline){const caret=make('span','mj-org-caret','▾');caret.setAttribute('aria-hidden','true');header.append(caret)}
 unit.append(header);
 const inner=make('div','mj-org-unit-content');
 inner.append(levels(staff,{compact:!inline}));
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
 const panel=make('section','mj-org-panel mj-org-company');panel.id='mj-full-org-chart';
 panel.dataset.mjOrgRoute='overview';
 panel.setAttribute('aria-label','Complete organization chart for the fictional company');
 const head=header('Company organization chart',
  'Full company structure grouped by division and recorded levels. Select any employee to view their read-only profile.');
 const metrics=make('div','mj-org-summary');
 metrics.append(make('strong','',P.length+' people'),make('span','',D.length+' divisions'),make('span','',new Set(P.map(level)).size+' recorded levels'));
 head.append(metrics);panel.append(head);
 const root=make('div','mj-org-company-root');
 root.append(make('strong','','Madhouse · People & Culture'),make('small','',P.length+' employees across '+D.length+' divisions'));
 panel.append(root);
 const tree=make('div','mj-org-company-tree');
 tree.setAttribute('aria-label','All divisions and employees');
 D.forEach(([name])=>tree.append(divisionUnit(name,P)));
 panel.append(tree);
 const foot=make('p','mj-org-footnote',
  'Fictional roster. Connections show the company, divisions and recorded position levels; individual reporting lines are not defined in the sample data.');
 panel.append(foot);
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
new MutationObserver(schedule).observe(view,{childList:true,subtree:true});
addEventListener('hashchange',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
