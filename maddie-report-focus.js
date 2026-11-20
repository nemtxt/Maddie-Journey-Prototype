/* Maddie Journey v6.0 — progressive disclosure of actual records */
(function(){
 'use strict';
 const view=document.getElementById('view');
 if(!view)return;
 const previewCount=8;
 let pending=false;
 const getRows=table=>Array.from(table.querySelectorAll('tbody tr'));
 function refresh(tableWrap){
   const table=tableWrap.querySelector('table');
   const control=tableWrap.querySelector('.mj-record-control');
   if(!table||!control)return;
   const rows=getRows(table);
   const query=tableWrap.querySelector('[data-filter]');
   const chip=tableWrap.querySelector('[data-chip].on');
   const filtering=Boolean(query&&query.value.trim())||Boolean(chip&&chip.dataset.chip!=='all');
   const expanded=tableWrap.dataset.mjExpanded==='true'||filtering;
   const eligible=rows.filter(r=>!r.hidden);
   let visibleIndex=0;
   rows.forEach(row=>{
      const folded=!row.hidden && !expanded && visibleIndex>=previewCount;
      if(row.classList.contains('mj-row-folded')!==folded)row.classList.toggle('mj-row-folded',folded);
      if(!row.hidden)visibleIndex++;
   });
   const total=eligible.length;
   const shown=expanded?total:Math.min(total,previewCount);
   control.hidden=filtering||total<=previewCount;
   const caption=control.querySelector('.mj-record-count');
   const button=control.querySelector('button');
   if(caption)caption.textContent=String(shown)+' of '+String(total)+' records shown';
   if(button){
     button.textContent=tableWrap.dataset.mjExpanded==='true'?'Show fewer records':'Show all '+String(total)+' records';
     button.setAttribute('aria-expanded',String(tableWrap.dataset.mjExpanded==='true'));
   }
 }
 function prepareTable(t){
   if(t.dataset.mjRowsMounted==='true')return;
   const table=t.querySelector('table');
   if(!table||getRows(table).length<=previewCount)return;
   t.dataset.mjRowsMounted='true';
   t.dataset.mjExpanded='false';
   const footer=document.createElement('div');
   footer.className='mj-record-control';
   const counter=document.createElement('span');
   counter.className='mj-record-count';
   const button=document.createElement('button');
   button.type='button';button.className='mj-show-rows';
   button.setAttribute('aria-expanded','false');
   button.addEventListener('click',()=>{
     t.dataset.mjExpanded=String(t.dataset.mjExpanded!=='true');
     refresh(t);
   });
   footer.append(counter,button);
   t.append(footer);
   refresh(t);
 }
 function organize(){
   pending=false;
   if(!document.body.classList.contains('mj-new'))return;
   const route=decodeURIComponent(location.hash.slice(1)||'overview');
   if(!/^[a-z]+:[a-z0-9-]+$/.test(route))return;
   const report=view.querySelector('#pane .secc');
   if(!report)return;
   const content=report.querySelector(':scope > .secb');
   if(!content)return;
   content.hidden=false;
   content.classList.remove('mj-detail-hide');
   report.querySelectorAll(':scope > .mj-preview, :scope > .mj-detail-buttons').forEach(n=>n.remove());
   report.querySelectorAll(':scope > .src').forEach(n=>n.hidden=false);
   if(!report.querySelector(':scope > .mj-report-section-title')){
     const header=document.createElement('div');header.className='mj-report-section-title';
     const title=document.createElement('h2');
     title.textContent=content.querySelector('table')?'Records & breakdown':'Report details';
     const hint=document.createElement('p');
     hint.textContent=content.querySelector('table')
      ?'Use the filters and sorting controls to find what matters.'
      :'Supporting figures and explanations.';
     header.append(title,hint);
     if(route==='people:masterlist'){
       const exportBtn=document.createElement('button');
       exportBtn.type='button';exportBtn.className='mj-btn mj-record-export';
       exportBtn.dataset.mjExport='';exportBtn.textContent='Export sample CSV';
       header.append(exportBtn);
     }
     report.insertBefore(header,content);
   }
   report.querySelectorAll('.secb .tbl').forEach(prepareTable);
 }
 function schedule(){
   if(pending)return;
   pending=true;
   requestAnimationFrame(organize);
 }
 // Only new report/table content requires preparation. Ignore child nodes
 // inserted by the existing summaries, charts and record-count controls.
 const relevant=record=>record.target===view||Array.from(record.addedNodes).some(node=>{
   if(node.nodeType!==1||node.matches?.('.mj-record-control,.mj-screen-insights,.mj-org-panel,.mj-zone-heading'))return false;
   return node.matches?.('#pane,.secc,.secb,.tbl,table,.mj-page')||
          Boolean(node.querySelector?.('.secc .secb,.secb .tbl'));
 });
 new MutationObserver(records=>{if(records.some(relevant))schedule()}).observe(view,{childList:true,subtree:true});
 const pendingTables=new WeakSet();
 const refreshSoon=table=>{
  if(!table||pendingTables.has(table))return;
  pendingTables.add(table);
  requestAnimationFrame(()=>{pendingTables.delete(table);if(table.isConnected)refresh(table)});
 };
 document.addEventListener('input',e=>{
  const table=e.target.closest?.('#pane .secc .tbl');
  refreshSoon(table);
 });
 document.addEventListener('click',e=>{
  const table=e.target.closest?.('#pane .secc .tbl');
  if(table&&!e.target.closest('.mj-show-rows'))refreshSoon(table);
 });
 addEventListener('hashchange',schedule);
 schedule();
})();
