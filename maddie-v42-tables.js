/* Maddie Journey V4.2 — table & report workspace controls.
 * Enhances existing read-only table outputs; it never rewrites source records.
 * Native search/chip/sort behaviour from p-main-demo.js remains authoritative.
 */
(function(){
 'use strict';
 const root=document.getElementById('view');
 if(!root)return;
 const states=new WeakMap();
 const create=(tag,cls,txt)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(txt!==undefined)node.textContent=String(txt);
  return node;
 };
 const button=(cls,label,action)=>{
  const el=create('button',cls,label);
  el.type='button';el.dataset.v42Action=action;
  return el;
 };
 const one=(s,scope=root)=>scope.querySelector(s);
 const all=(s,scope=root)=>Array.from(scope.querySelectorAll(s));
 const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
 const textOf=el=>clean(el?.textContent);
 const escaped=n=>Number(n).toLocaleString('en-PH');
 const rowsOf=table=>Array.from(table.tBodies).flatMap(b=>Array.from(b.rows));
 const sizeValue=state=>state.size==='all'?Infinity:Number(state.size)||10;
 function setHidden(row,hide){if(row.hidden!==hide)row.hidden=hide}
 function footer(bar){
  const nav=create('div','mj-v42-pagination');
  const prev=button('mj-v42-nav-btn','Previous','prev');
  const next=button('mj-v42-nav-btn','Next','next');
  const detail=create('span','mj-v42-page-status');
  detail.setAttribute('role','status');
  detail.setAttribute('aria-live','polite');
  nav.append(prev,detail,next);
  bar.append(nav);
  return {prev,next,detail};
 }
 function densityControl(host){
  const b=button('mj-v42-density','Compact rows','density');
  b.setAttribute('aria-pressed','false');
  b.setAttribute('aria-label','Switch between comfortable and compact row spacing');
  host.append(b);return b;
 }
 function applyLegacy(state){
  const wrap=state.wrap;
  if(!wrap.isConnected)return;
  const q=clean(one('[data-filter]',wrap)?.value).toLocaleLowerCase();
  const chip=one('[data-chip].on',wrap)?.dataset.chip||'all';
  const rows=rowsOf(state.table);
  const matches=rows.filter(row=>{
   const same=row.textContent.toLocaleLowerCase().includes(q);
   const tags=String(row.dataset.tags||'').split(/\s+/);
   return same&&(chip==='all'||tags.includes(chip));
  });
  const per=sizeValue(state);
  const pages=Math.max(1,Math.ceil(matches.length/per));
  state.page=Math.min(Math.max(0,state.page),pages-1);
  const start=state.page*per,end=Math.min(matches.length,start+per);
  const visible=new Set(matches.slice(start,end));
  rows.forEach(row=>setHidden(row,!visible.has(row)));
  const native=one('.cnt2',wrap);
  if(native)native.textContent=escaped(matches.length)+' matching · '+escaped(rows.length)+' total';
  const empty=one('.emp0',wrap);
  if(empty)empty.hidden=matches.length>0;
  state.controls.prev.disabled=state.page<=0||matches.length===0;
  state.controls.next.disabled=state.page>=pages-1||matches.length===0;
  state.controls.detail.textContent=matches.length?(escaped(start+1)+'–'+escaped(end)+' of '+escaped(matches.length)): '0 matching rows';
  state.controls.detail.title='Page '+(state.page+1)+' of '+pages;
 }
 function markColumns(state){
  const hidden=state.hidden;
  const tables=[state.table];
  tables.forEach(table=>{
   const rows=Array.from(table.rows);
   rows.forEach(row=>{
    Array.from(row.cells).forEach((cell,i)=>{
     const hide=hidden.has(i);
     cell.classList.toggle('mj-v42-col-hidden',hide);
    });
   });
  });
 }
 function columnMenu(state,host){
  const heads=Array.from(state.table.tHead?.rows[0]?.cells||[]);
  if(heads.length<3)return;
  const details=create('details','mj-v42-columns');
  const summary=create('summary','', 'Columns');
  summary.setAttribute('aria-label','Choose visible table columns');
  const box=create('div','mj-v42-column-options');
  heads.forEach((head,i)=>{
   if(i===0)return; // Identity column always remains available.
   const label=create('label','mj-v42-column-option');
   const input=create('input');input.type='checkbox';input.checked=true;
   input.dataset.v42Column=String(i);
   input.setAttribute('aria-label','Show '+(textOf(head)||'column '+(i+1)));
   label.append(input,create('span','',textOf(head)||'Column '+(i+1)));
   box.append(label);
  });
  details.append(summary,box);host.append(details);
 }
 function enhanceLegacy(wrap){
  if(states.has(wrap)||!wrap.querySelector('table')||!wrap.querySelector('.tools2'))return;
  const table=one('table',wrap),tool=one('.tools2',wrap);
  if(!table.tBodies.length||!table.tHead)return;
  const state={kind:'legacy',wrap,table,page:0,size:'10',density:false,hidden:new Set(),controls:null};
  states.set(wrap,state);
  wrap.classList.add('mj-v42-table');
  const tools=create('div','mj-v42-controls');
  const selectLabel=create('label','mj-v42-size');
  selectLabel.append(create('span','','Rows'));
  const sizes=create('select');sizes.dataset.v42Size='1';sizes.setAttribute('aria-label','Rows per page');
  ['10','20','50','all'].forEach(v=>{const o=create('option','',v==='all'?'All':v);o.value=v;if(v==='10')o.selected=true;sizes.append(o)});
  selectLabel.append(sizes);
  tools.append(selectLabel);
  densityControl(tools);
  columnMenu(state,tools);
  tool.append(tools);
  const bottom=create('div','mj-v42-bottom');
  bottom.append(create('span','mj-v42-summary-note','Read-only records · select a row to view details'));
  state.controls=footer(bottom);
  wrap.append(bottom);
  // A large dataset defaults to ten visible records, preserving the entire
  // original tbody in the DOM for search, sorting and profile associations.
  applyLegacy(state);
 }
 function applyPlain(state){
  if(!state.wrap.isConnected)return;
  const q=clean(state.search.value).toLocaleLowerCase();
  const rows=rowsOf(state.table);
  const matches=rows.filter(r=>r.textContent.toLocaleLowerCase().includes(q));
  const per=sizeValue(state),pages=Math.max(1,Math.ceil(matches.length/per));
  state.page=Math.min(Math.max(0,state.page),pages-1);
  const start=state.page*per,end=Math.min(matches.length,start+per);
  const chosen=new Set(matches.slice(start,end));
  rows.forEach(row=>setHidden(row,!chosen.has(row)));
  state.controls.prev.disabled=state.page===0||!matches.length;
  state.controls.next.disabled=state.page>=pages-1||!matches.length;
  state.controls.detail.textContent=matches.length?(escaped(start+1)+'–'+escaped(end)+' of '+escaped(matches.length)):'No matching rows';
  state.count.textContent=escaped(matches.length)+' matching of '+escaped(rows.length);
  state.empty.hidden=matches.length>0;
 }
 function applyMatrix(state){
  if(!state.wrap.isConnected)return;
  const q=clean(state.search.value).toLocaleLowerCase();
  const bodies=Array.from(state.table.tBodies);
  let shown=0,total=0;
  bodies.forEach(body=>Array.from(body.rows).forEach(row=>{
   const yes=row.textContent.toLocaleLowerCase().includes(q);
   setHidden(row,!yes);total++;if(yes)shown++;
  }));
  state.count.textContent=escaped(shown)+' of '+escaped(total)+' rows';
  state.empty.hidden=shown>0;
 }
 function applyGroups(state){
  if(!state.wrap.isConnected)return;
  const q=clean(state.search.value).toLocaleLowerCase();
  const bodies=Array.from(state.table.tBodies);
  let matched=0,total=0;
  bodies.forEach((body,i)=>{
   const heading=one('tr.gh',body);
   const rows=Array.from(body.rows).filter(r=>r!==heading);
   const label=textOf(heading);
   const matchHeader=label.toLocaleLowerCase().includes(q);
   const selected=rows.filter(r=>matchHeader||r.textContent.toLocaleLowerCase().includes(q));
   total+=rows.length;matched+=selected.length;
   const groupVisible=!q||selected.length>0;
   const closed=state.closed.has(i);
   if(heading)setHidden(heading,!groupVisible);
   rows.forEach(row=>setHidden(row,!groupVisible||closed||!selected.includes(row)));
   const toggle=heading?.querySelector('[data-v42-group]');
   if(toggle)toggle.setAttribute('aria-expanded',String(!closed));
  });
  state.count.textContent=escaped(matched)+' matching of '+escaped(total);
  state.empty.hidden=matched>0;
 }
 function makeSearch(scope,placeholder){
  const label=create('label','mj-v42-search');
  const input=create('input');
  input.type='search';input.dataset.v42Search='1';
  input.placeholder=placeholder;
  input.autocomplete='off';
  input.setAttribute('aria-label',placeholder);
  label.append(input);scope.append(label);return input;
 }
 function enhanceAnalytical(wrap){
  if(states.has(wrap)||wrap.closest('.tbl')||!wrap.querySelector('table'))return;
  const table=one('table',wrap);
  if(!table.tBodies.length||!table.tHead)return;
  const grouped=table.classList.contains('gt')&&all('tbody .gh',table).length>0;
  const matrix=table.classList.contains('xt')||Boolean(table.tFoot)||grouped;
  const count=rowsOf(table).length;
  if(count<7&&!grouped)return;
  const host=create('div','mj-v42-analysis');
  const toolbar=create('div','mj-v42-analysis-tools');
  const type=grouped?'Grouped records':matrix?'Matrix view':'Records';
  const title=create('strong','mj-v42-analysis-title',type);
  const countLabel=create('span','mj-v42-analysis-count');
  toolbar.append(title);
  const search=makeSearch(toolbar,grouped?'Find grouped records':matrix?'Find matrix rows':'Find records');
  toolbar.append(countLabel);
  const controls=create('div','mj-v42-analysis-controls');
  densityControl(controls);
  const state={kind:grouped?'grouped':matrix?'matrix':'plain',wrap:host,table,scroll:wrap,search,count:countLabel,
   size:'10',page:0,closed:new Set(),density:false,controls:null};
  states.set(wrap,state);states.set(host,state);
  if(!grouped&&!matrix){
   const label=create('label','mj-v42-size');
   label.append(create('span','','Rows'));
   const select=create('select');select.dataset.v42Size='1';select.setAttribute('aria-label','Rows per page');
   ['10','20','50','all'].forEach(v=>{const opt=create('option','',v==='all'?'All':v);opt.value=v;select.append(opt)});
   label.append(select);controls.append(label);
  }
  if(grouped){
   Array.from(table.tBodies).forEach((body,i)=>{
    const head=one('tr.gh th',body);if(!head)return;
    const caption=textOf(head);
    const trigger=button('mj-v42-group-toggle','Collapse group','group');
    trigger.dataset.v42Group=String(i);
    trigger.setAttribute('aria-expanded','true');
    trigger.setAttribute('aria-label','Collapse '+caption);
    head.append(trigger);
   });
   const collapse=button('mj-v42-groups-all','Collapse all groups','collapse-all');
   const expand=button('mj-v42-groups-all','Expand all groups','expand-all');
   controls.append(collapse,expand);
  }
  toolbar.append(controls);host.append(toolbar);
  // Grouped and matrix reports retain their source totals in the tfoot and
  // header cells. Filtering is explicitly view-only.
  const note=create('p','mj-v42-analysis-note',matrix?
   'Filtered visibility only · source totals and group counts remain unchanged.':
   'Select a record to inspect its details · read-only.');
  host.append(note);
  // Place controls at the table's existing position before moving its scroll
  // node. Reparenting without this step would detach the whole report table.
  wrap.before(host);
  host.append(wrap);
  const foot=create('div','mj-v42-bottom');
  if(state.kind==='plain')state.controls=footer(foot);
  const empty=create('p','mj-v42-empty','No records match this search.');
  empty.hidden=true;host.append(empty);
  if(state.kind==='plain')host.append(foot);
  state.empty=empty;
  // Original scrollbar stays on .scroll; wrapper adds controls, not nested
  // horizontal scroll containers.
  if(state.kind==='grouped')applyGroups(state);
  else if(state.kind==='matrix')applyMatrix(state);
  else applyPlain(state);
 }
 function enhanceReports(){
  const cards=all('section.secc',root).filter(c=>c.querySelector('.sech')&&c.querySelector('.secb'));
  if(cards.length<4)return;
  const groups=new Map();
  cards.forEach(card=>{
   const container=card.closest('#pane')||card.parentElement;
   if(!groups.has(container))groups.set(container,[]);
   groups.get(container).push(card);
  });
  groups.forEach((sections,container)=>{
   if(sections.length<4||one('.mj-v42-section-actions',container))return;
   const bar=create('div','mj-v42-section-actions');
   bar.append(create('strong','','Report sections'));
   bar.append(create('span','',sections.length+' sections'));
   bar.append(button('mj-v42-action-btn','Expand all','sections-open'));
   bar.append(button('mj-v42-action-btn','Collapse all','sections-close'));
   sections[0].before(bar);
   sections.forEach((section,i)=>{
    const heading=one('.sech',section),body=one('.secb',section);
    if(!heading||!body)return;
    section.classList.add('mj-v42-section');
    const toggle=button('mj-v42-section-toggle','Collapse','section-toggle');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Collapse report section '+textOf(one('h2',heading)));
    heading.append(toggle);
    if(i>=2)toggleSection(section,false);
   });
  });
 }
 function toggleSection(section,open){
  const toggle=one('[data-v42-action="section-toggle"]',section);
  if(!toggle)return;
  section.classList.toggle('mj-v42-section-closed',!open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.textContent=open?'Collapse':'Expand';
  const title=textOf(one('.sech h2',section));
  toggle.setAttribute('aria-label',(open?'Collapse':'Expand')+' report section '+title);
  all(':scope > .secb,:scope > .src',section).forEach(x=>{if(x.hidden===open)x.hidden=!open});
 }
 function apply(action,button){
  const state=states.get(button.closest('.tbl,.mj-v42-analysis'))||null;
  if(action==='section-toggle'){
   const section=button.closest('section.secc');
   if(section)toggleSection(section,section.classList.contains('mj-v42-section-closed'));return;
  }
  if(action==='sections-open'||action==='sections-close'){
   const container=button.parentElement?.parentElement;
   if(container)all('section.mj-v42-section',container).forEach(s=>toggleSection(s,action==='sections-open'));return;
  }
  if(!state)return;
  if(action==='density'){
   state.density=!state.density;
   const host=state.kind==='legacy'?state.wrap:state.wrap;
   host.classList.toggle('mj-v42-compact',state.density);
   button.textContent=state.density?'Comfortable rows':'Compact rows';
   button.setAttribute('aria-pressed',String(state.density));return;
  }
  if(action==='group'||action==='collapse-all'||action==='expand-all'){
   if(state.kind!=='grouped')return;
   if(action==='group'){
    const n=Number(button.dataset.v42Group);
    if(state.closed.has(n))state.closed.delete(n);else state.closed.add(n);
   }else{
    state.closed.clear();
    if(action==='collapse-all')Array.from(state.table.tBodies).forEach((_,i)=>state.closed.add(i));
   }
   applyGroups(state);return;
  }
  if(action==='prev'||action==='next'){
   state.page+=action==='next'?1:-1;
   if(state.kind==='legacy')applyLegacy(state);
   if(state.kind==='plain')applyPlain(state);
  }
 }
 const refreshLegacy=(wrap,resetPage)=>{
  const state=states.get(wrap);if(!state)return;
  if(resetPage)state.page=0;
  applyLegacy(state);
 };
 function refresh(){
  if(!document.body.classList.contains('mj-new')||document.body.classList.contains('hxon'))return;
  all('.tbl',root).forEach(enhanceLegacy);
  all('.scroll',root).forEach(enhanceAnalytical);
  enhanceReports();
 }
 let queued=false;
 function schedule(){
  if(queued)return;queued=true;
  requestAnimationFrame(()=>{queued=false;refresh()});
 }
 // Existing listeners run first. A microtask then applies pagination to the
 // current search/filter/sort order, without modifying native sorting code.
 document.addEventListener('input',e=>{
  const wrap=e.target.closest?.('.tbl');
  if(wrap&&e.target.matches('[data-filter]'))queueMicrotask(()=>refreshLegacy(wrap,true));
  if(e.target.matches('[data-v42-search]')){
   const state=states.get(e.target.closest('.mj-v42-analysis'));
   if(!state)return;state.page=0;
   (state.kind==='grouped'?applyGroups:state.kind==='matrix'?applyMatrix:applyPlain)(state);
  }
 });
 document.addEventListener('change',e=>{
  const target=e.target;
  if(target.matches('[data-v42-size]')){
   const state=states.get(target.closest('.tbl,.mj-v42-analysis'));if(!state)return;
   state.size=target.value;state.page=0;
   if(state.kind==='legacy')applyLegacy(state);
   else if(state.kind==='plain')applyPlain(state);
  }else if(target.matches('[data-v42-column]')){
   const wrap=target.closest('.tbl'),state=states.get(wrap);
   if(!state)return;
   const i=Number(target.dataset.v42Column);
   if(target.checked)state.hidden.delete(i);else state.hidden.add(i);
   markColumns(state);
  }
 });
 // Run before the legacy delegated click handler for V4.2 controls, so a
 // grouped header button never triggers the old generic row-details popup.
 document.addEventListener('click',e=>{
  const target=e.target.closest?.('[data-v42-action]');
  if(target){
   e.stopPropagation();
   apply(target.dataset.v42Action,target);return;
  }
 },true);
 document.addEventListener('click',e=>{
  const th=e.target.closest?.('th[data-sort]');
  const chip=e.target.closest?.('[data-chip]');
  if(th||chip){const wrap=e.target.closest('.tbl');if(wrap)queueMicrotask(()=>refreshLegacy(wrap,Boolean(chip)))}
 });
 const mo=new MutationObserver(records=>{
  if(records.some(r=>r.target===root||Array.from(r.addedNodes).some(node=>{
   if(node.nodeType!==1)return false;
   if(node.classList?.contains('mj-v42-analysis')||node.classList?.contains('mj-v42-section-actions')||node.classList?.contains('mj-v42-controls')||node.classList?.contains('mj-v42-bottom'))return false;
   return node.matches?.('.tbl,.scroll,.secc,#pane,.g12,.mj-page')||
    Boolean(node.querySelector?.('.tbl,.scroll,.secc'));
  })))schedule();
 });
 mo.observe(root,{childList:true,subtree:true});
 addEventListener('hashchange',schedule);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
 else schedule();
 window.MJ_V42={version:'4.2',refresh:schedule};
})();
