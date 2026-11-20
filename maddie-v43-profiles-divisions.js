/* Maddie Journey V4.3 — employee profiles and division dashboards.
 * Progressive, read-only enhancement of existing modal and route markup.
 * Sensitive values and source-record links stay in their original masked fields.
 */
(function(){
 'use strict';
 const layer=document.getElementById('layer');
 const view=document.getElementById('view');
 if(!layer||!view)return;
 const people=()=>Array.isArray(window.MCD?.EMP)?window.MCD.EMP:[];
 const divisions=()=>Array.isArray(window.MCD?.D)?window.MCD.D:[];
 const currentRoute=()=>{try{return decodeURIComponent(location.hash.slice(1)||'overview')}catch{return location.hash.slice(1)||'overview'}};
 const count=(list,fn)=>list.filter(fn).length;
 const make=(tag,cls,text)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(text!==undefined&&text!==null)node.textContent=String(text);
  return node;
 };
 const add=(parent,tag,cls,value)=>{
  const node=make(tag,cls,value);
  parent.appendChild(node);
  return node;
 };
 const fullDate=value=>{
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const [year,month,day]=value.split('-').map(Number);
  const check=new Date(Date.UTC(year,month-1,day));
  if(check.getUTCFullYear()!==year||check.getUTCMonth()!==month-1||check.getUTCDate()!==day)return null;
  return new Intl.DateTimeFormat('en-PH',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric'}).format(check);
 };
 const employeeModel=e=>{
  if(!e)return null;
  const cases=Array.isArray(window.MCD?.CASES)?window.MCD.CASES.filter(c=>
   Array.isArray(c.people)&&c.people.some(p=>Number(p.i)===Number(e.i))):[];
  const tracked=Number(e.tracked)||0,onFile=Number(e.onFile)||0;
  const percentage=Number.isFinite(Number(e.f))?Math.max(0,Math.min(100,Number(e.f))):null;
  const level=Number(e.orgLevel)>0?Number(e.orgLevel):Number(e.lvl)>0?Number(e.lvl):null;
  const dateEvents=[];
  if(fullDate(e.hire))dateEvents.push({date:e.hire,label:'Hired',description:'Employment start date'});
  if(fullDate(e.reg))dateEvents.push({date:e.reg,label:'Regularized',description:'Recorded regularization date'});
  dateEvents.sort((a,b)=>a.date.localeCompare(b.date));
  const events=dateEvents.map(v=>({...v,displayDate:fullDate(v.date),kind:'dated'}));
  if(e.dev&&(e.dev.type||e.dev.status)){
   events.push({date:null,displayDate:'Undated record',label:e.dev.type||'Development review',
    description:e.dev.status||'Status not recorded',kind:'current'});
  }
  if(e.stage){
   events.push({date:null,displayDate:'Current recorded stage',label:e.stage,
    description:'Journey tracker classification',kind:'current'});
  }
  return {
   id:Number(e.i),name:e.name,division:e.dept,role:e.role,status:e.status||'Not recorded',
   level,tenure:typeof e.ten==='number'?(e.ten>=1?e.ten+' yr'+(e.ten===1?'':'s'):'Under 1 year'):'Not recorded',
   percentage,onFile,tracked,lates:Number(e.l30)||0,cases:cases.length,events,
   divisionColor:typeof window.MJ_DIVISION_COLOR==='function'?window.MJ_DIVISION_COLOR(e.dept):'#858585'
  };
 };
 const divisionModel=name=>{
  const staff=people().filter(e=>e.dept===name);
  if(!divisions().some(([d])=>d===name))return null;
  const levels=[...new Set(staff.map(e=>Number(e.orgLevel||e.lvl)).filter(n=>n>=1&&n<=6))];
  const avg=staff.length?Math.round(staff.reduce((sum,e)=>sum+(Number(e.f)||0),0)/staff.length):null;
  return {
   name,count:staff.length,representedLevels:levels.length,regular:count(staff,e=>e.status==='Regular'),
   probationary:count(staff,e=>e.status==='Probationary'),
   partTime:count(staff,e=>e.status==='Part-Time'),avgFile:avg,
   lates:staff.reduce((n,e)=>n+(Number(e.l30)||0),0),
   color:typeof window.MJ_DIVISION_COLOR==='function'?window.MJ_DIVISION_COLOR(name):'#858585'
  };
 };
 const groupPriority=label=>{
  const s=String(label||'').toLowerCase();
  if(/^employment$/.test(s))return 0;
  if(s.includes('attendance'))return 1;
  if(s.includes('201 document'))return 2;
  if(s.includes('contact'))return 3;
  if(s.includes('government'))return 4;
  if(s.includes('compensation'))return 5;
  if(s.startsWith('cases'))return 6;
  return 7;
 };
 function setGroupOpen(group,open){
  group.classList.toggle('mj-v43-group-closed',!open);
  const toggle=group.querySelector('[data-mj-v43-group-toggle]');
  if(!toggle)return;
  toggle.setAttribute('aria-expanded',String(open));
  toggle.textContent=open?'Hide details':'Show details';
  const label=group.dataset.mjV43Group||'profile section';
  toggle.setAttribute('aria-label',(open?'Hide':'Show')+' details for '+label);
 }
 function decorateGroups(sheet){
  const grid=sheet.querySelector('.mj-profile-grid');
  if(!grid)return;
  const sections=Array.from(grid.querySelectorAll(':scope > .mj-profile-group'));
  if(!sections.length)return;
  const sorted=sections.map((group,index)=>({
   group,index,label:group.querySelector('h3')?.textContent?.trim()||('Section '+(index+1))
  })).sort((a,b)=>groupPriority(a.label)-groupPriority(b.label)||a.index-b.index);
  const nav=sheet.querySelector('.mj-profile-jumps');
  sorted.forEach(({group,label},index)=>{
   grid.appendChild(group);
   group.dataset.mjV43Group=label;
   const kind=groupPriority(label);
   group.classList.add('mj-v43-group-'+(['employment','attendance','documents','contact','government','compensation','cases','other'][kind]));
   group.style.setProperty('--mj-v43-order',String(index));
   const heading=group.querySelector('h3');
   if(!heading||heading.querySelector('[data-mj-v43-group-toggle]'))return;
   heading.classList.add('mj-v43-group-title');
   const toggle=make('button','mj-v43-group-toggle');
   toggle.type='button';
   toggle.dataset.mjV43GroupToggle='1';
   if(group.id)toggle.setAttribute('aria-controls',group.id);
   heading.appendChild(toggle);
   setGroupOpen(group,groupPriority(label)<=2);
  });
  if(nav){
   const buttons=Array.from(nav.querySelectorAll('[data-mj-profile-jump]'));
   const byIndex=new Map(buttons.map(button=>[button.dataset.mjProfileJump,button]));
   buttons.forEach(button=>button.removeAttribute('aria-current'));
   sorted.forEach(({group},i)=>{
    const button=byIndex.get(group.dataset.mjProfileDetail);
    if(!button)return;
    nav.appendChild(button);
    if(i===0)button.setAttribute('aria-current','location');
   });
  }
 }
 function timeline(model){
  if(!model.events.length)return null;
  const section=make('section','mj-v43-timeline');
  section.setAttribute('aria-label','Recorded career timeline');
  const head=make('div','mj-v43-timeline-heading');
  add(head,'strong','','Career timeline');
  add(head,'span','','Recorded dates and current tracker stages only');
  section.appendChild(head);
  const list=make('ol','mj-v43-timeline-list');
  model.events.forEach((entry,i)=>{
   const item=make('li','mj-v43-timeline-event'+(entry.kind==='current'?' is-current':''));
   item.dataset.mjV43Event=String(i);
   add(item,'span','mj-v43-time-date',entry.displayDate);
   add(item,'strong','mj-v43-time-title',entry.label);
   add(item,'span','mj-v43-time-note',entry.description);
   list.appendChild(item);
  });
  section.appendChild(list);
  return section;
 }
 function stat(label,value,hint){
  const cell=make('div','mj-v43-stat');
  add(cell,'span','mj-v43-stat-label',label);
  add(cell,'strong','mj-v43-stat-value',value);
  if(hint)add(cell,'small','mj-v43-stat-hint',hint);
  return cell;
 }
 function enhanceProfile(sheet){
  if(!sheet.classList.contains('mj-profile-sheet')||sheet.dataset.mjV43Ready)return;
  const raw=sheet.querySelector('[data-mj-v43-employee]');
  if(!raw)return;
  const id=Number(raw.dataset.mjV43Employee);
  const record=people().find(e=>Number(e.i)===id);
  const model=employeeModel(record);
  if(!model)return;
  const identity=sheet.querySelector('.mj-profile-identity'),grid=sheet.querySelector('.mj-profile-grid');
  if(!identity||!grid)return;
  sheet.dataset.mjV43Ready='1';
  sheet.classList.add('mj-v43-profile');
  sheet.style.setProperty('--mj-v43-division',model.divisionColor);
  identity.classList.add('mj-v43-profile-identity');
  const heading=identity.querySelector('.mj-profile-heading');
  if(heading){
   const tags=make('div','mj-v43-identity-tags');
   add(tags,'span','mj-v43-profile-pill',model.status);
   if(model.level)add(tags,'span','mj-v43-profile-pill','Level '+model.level);
   const division=make('a','mj-v43-division-link',model.division);
   division.href='#division/'+encodeURIComponent(model.division);
   division.title='View the '+model.division+' division dashboard';
   tags.appendChild(division);
   heading.appendChild(tags);
  }
  const summary=make('section','mj-v43-profile-snapshot');
  summary.setAttribute('aria-label','Employee record snapshot');
  summary.append(
   stat('Employment',model.status,model.tenure),
   stat('201-file completion',model.percentage===null?'Not recorded':model.percentage+'%',
    model.tracked?model.onFile+' of '+model.tracked+' tracked documents':'No tracked documents'),
   stat('Late entries · 30 days',model.lates,'Recorded attendance events'),
   stat('Governance cases',model.cases,'Recorded case entries')
  );
  grid.before(summary);
  const events=timeline(model);
  if(events)grid.before(events);
  decorateGroups(sheet);
  const controls=make('div','mj-v43-profile-controls');
  add(controls,'span','mj-v43-profile-note','Full details remain available below.');
  for(const [action,label] of [['expand','Expand all details'],['collapse','Collapse details']]){
   const btn=make('button','mj-v43-profile-control',label);
   btn.type='button';btn.dataset.mjV43Control=action;
   controls.appendChild(btn);
  }
  grid.before(controls);
 }
 function enhanceDivision(){
  const h=currentRoute();
  const isDivision=h.startsWith('division/');
  view.classList.toggle('mj-v43-division-dashboard',isDivision);
  if(!isDivision||document.body.classList.contains('hxon'))return;
  const name=h.slice('division/'.length);
  const model=divisionModel(name);
  const header=view.querySelector('.ph');
  if(!model||!header)return;
  header.classList.add('mj-v43-division-header');
  header.style.setProperty('--mj-v43-division',model.color);
  if(header.dataset.mjV43Division!==name){
   header.dataset.mjV43Division=name;
   const title=header.querySelector('h1');
   if(title){
    const label=make('p','mj-v43-division-eyebrow','DIVISION · WORKFORCE & PEOPLE');
    title.before(label);
   }
   const meta=make('div','mj-v43-division-context');
   [
    model.representedLevels+' of 6 recorded levels',
    model.regular+' regular',
    model.probationary+' probationary',
    model.partTime+' part-time'
   ].forEach(item=>add(meta,'span','',item));
   const main=header.firstElementChild||header;
   main.appendChild(meta);
  }
  const chart=view.querySelector('.mj-one-division-chart');
  if(chart){
   chart.classList.add('mj-v43-org-panel');
   chart.style.setProperty('--mj-v43-division',model.color);
   const title=chart.querySelector('.mj-one-titles h2');
   if(title&&title.textContent===name)title.textContent='Organization structure';
  }
  view.querySelectorAll('.g12 > .card').forEach(card=>{
   const title=card.querySelector('h2')?.textContent?.trim().toLowerCase()||'';
   let part='';
   if(title==='at a glance')part='snapshot';
   else if(title==='people')part='people';
   else if(title.includes('open tasks'))part='tasks';
   else if(title.includes('weekly pulse'))part='pulse';
   else if(title==='journey stages')part='journey';
   else if(title==='other divisions')part='related';
   if(part)card.classList.add('mj-v43-division-'+part);
  });
 }
 let scheduled=false;
 function queue(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
   scheduled=false;
   if(!document.body.classList.contains('mj-new'))return;
   layer.querySelectorAll('.sheet.mj-profile-sheet').forEach(enhanceProfile);
   enhanceDivision();
  });
 }
 layer.addEventListener('click',event=>{
  const jump=event.target.closest?.('[data-mj-profile-jump]');
  if(jump){
   const sheet=jump.closest('.mj-v43-profile');
   const group=sheet?.querySelector('[data-mj-profile-detail="'+jump.dataset.mjProfileJump+'"]');
   if(group){
    setGroupOpen(group,true);
    // V4.3 identity and section tabs wrap naturally rather than remaining
    // fixed. Scroll to the actual group, not the prior sticky-header offset.
    if(typeof sheet.scrollTo==='function'&&typeof group.getBoundingClientRect==='function'){
     const top=sheet.scrollTop+group.getBoundingClientRect().top-sheet.getBoundingClientRect().top-14;
     const reduced=document.documentElement.classList.contains('mj-reduced')||
      (typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion:reduce)').matches);
     sheet.scrollTo({top:Math.max(0,top),behavior:reduced?'auto':'smooth'});
    }
    sheet.querySelectorAll('.mj-profile-jump').forEach(item=>{
     if(item===jump)item.setAttribute('aria-current','location');
     else item.removeAttribute('aria-current');
    });
    event.preventDefault();event.stopPropagation();
   }
   return;
  }
  const toggle=event.target.closest?.('[data-mj-v43-group-toggle]');
  if(toggle){
   event.preventDefault();event.stopPropagation();
   const group=toggle.closest('.mj-profile-group');
   if(group)setGroupOpen(group,group.classList.contains('mj-v43-group-closed'));
   return;
  }
  const control=event.target.closest?.('[data-mj-v43-control]');
  if(control){
   event.preventDefault();event.stopPropagation();
   const sheet=control.closest('.mj-v43-profile');
   const opening=control.dataset.mjV43Control==='expand';
   sheet?.querySelectorAll('.mj-profile-group').forEach(group=>setGroupOpen(group,opening));
  }
 },true);
 const layerObserver=new MutationObserver(records=>{
  if(records.some(r=>Array.from(r.addedNodes).some(n=>{
   if(n.nodeType!==1)return false;
   return n.matches?.('.sheet,.mj-profile-sheet,.mj-profile-grid,.mj-profile-identity')||
    Boolean(n.querySelector?.('.sheet,.mj-profile-sheet'));
  })))queue();
 });
 layerObserver.observe(layer,{childList:true,subtree:true});
 const viewObserver=new MutationObserver(records=>{
  if(records.some(r=>r.target===view||Array.from(r.addedNodes).some(n=>{
   if(n.nodeType!==1)return false;
   return n.matches?.('.ph,.g12,.mj-one-division-chart')||
    Boolean(n.querySelector?.('.ph,.mj-one-division-chart'));
  })))queue();
 });
 viewObserver.observe(view,{childList:true,subtree:true});
 addEventListener('hashchange',queue);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});
 else queue();
 window.MJ_V43={version:'4.3',refresh:queue,employeeModel,divisionModel};
})();
