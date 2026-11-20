/* Maddie Journey V4.3.5 — Depth and purposeful interaction.
 * Presentation-only enhancements to existing dashboard / chart elements.
 * Does not change source records, calculations, routes or modal permissions.
 */
(function(){
 'use strict';
 const root=document.getElementById('view');
 if(!root)return;
 const layer=document.getElementById('layer');
 const selector='.mj-v41-card';
 const route=()=>{try{return decodeURIComponent(location.hash.slice(1)||'overview')}catch{return location.hash.slice(1)||'overview'}};
 const originalCards=new WeakSet();
 let scheduled=false;
 const value=(node,attribute)=>node?.getAttribute(attribute)||'';
 function decorateCharts(){
  root.querySelectorAll('.mj-v41').forEach(section=>{
   const cards=Array.from(section.querySelectorAll(selector));
   cards.forEach((card,i)=>{
    if(!originalCards.has(card)){
     originalCards.add(card);
     card.classList.add('mj-v435-chart');
     if(i===0)card.classList.add('mj-v435-primary-chart');
     if(i===1)card.classList.add('mj-v435-companion-chart');
    }
    const line=card.querySelector('svg.mj-v41-line');
    if(line&&!line.dataset.mjV435Ready){
     const aria=value(line,'aria-label');
     const chunks=aria.slice(aria.indexOf(':')+1).split(';').map(s=>s.trim()).filter(Boolean);
     line.querySelectorAll('circle.mj-v41-point').forEach((point,index)=>{
      const text=chunks[index];
      if(!text)return;
      point.setAttribute('tabindex','0');
      point.setAttribute('role','img');
      point.setAttribute('aria-label',text);
      point.setAttribute('data-mj-v435-detail',text);
      point.classList.add('mj-v435-inspectable');
     });
     line.dataset.mjV435Ready='1';
    }
    card.querySelectorAll('.mj-v41-bar-row').forEach(row=>{
     if(row.dataset.mjV435Ready)return;
     const track=row.querySelector('[aria-label]');
     const label=value(track,'aria-label');
     if(!label)return;
     row.dataset.mjV435Ready='1';
     row.setAttribute('tabindex','0');
     row.setAttribute('aria-label',label);
     row.setAttribute('data-mj-v435-detail',label);
     row.classList.add('mj-v435-inspectable');
    });
    card.querySelectorAll('.mj-v41-legend-item').forEach(item=>{
     if(item.dataset.mjV435Ready)return;
     const label=item.querySelector('span')?.textContent?.trim();
     const count=item.querySelector('strong')?.textContent?.trim();
     if(!label||!count)return;
     item.dataset.mjV435Ready='1';
     item.setAttribute('tabindex','0');
     item.setAttribute('aria-label',label+': '+count);
     item.setAttribute('data-mj-v435-detail',label+': '+count);
     item.classList.add('mj-v435-inspectable');
    });
   });
  });
 }
 function decorateReports(){
  const h=route();
  root.dataset.mjV435Route=h.startsWith('division/')?'division':h.startsWith('view/')?'executive':h.includes(':')?'report':h;
  const home=h==='overview';
  root.classList.toggle('mj-v435-home',home);
  // Use structural metadata, not arbitrary chart indices, to choose meaningful
  // visual emphasis. All original HTML/data remain in place.
  root.querySelectorAll('.g12 > .card').forEach(card=>{
   if(card.dataset.mjV435Card)return;
   const heading=card.querySelector('h2')?.textContent?.trim().toLocaleLowerCase()||'';
   const role=heading==='needs attention'?'priority':
     heading==='workforce'?'workforce':
     heading==='at a glance'?'division-summary':
     heading==='people'?'people':
     heading==='departments'?'departments':
     heading==='coming up, 30 days'?'calendar':
     heading==='hiring and evaluations'?'hiring':
     heading.includes('open tasks')?'tasks':
     heading.includes('weekly pulse')?'pulse':
     heading.includes('journey stages')?'journey':
     heading==='other divisions'?'directory':'general';
   card.dataset.mjV435Card=role;
  });
  decorateCharts();
  root.querySelectorAll('.mj-v4-kpis').forEach(group=>{
   if(group.dataset.mjV435Kpis)return;
   group.dataset.mjV435Kpis='1';
   const numbers=group.querySelectorAll('.mj-v4-kpi');
   numbers.forEach((node,i)=>{
    node.classList.add('mj-v435-kpi');
    if(i===0)node.classList.add('mj-v435-kpi-primary');
   });
  });
 }
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
   scheduled=false;
   if(!document.body.classList.contains('mj-new'))return;
   if(route()==='office'||document.body.classList.contains('hxon'))return;
   decorateReports();
  });
 }
 function readout(target){
  const text=value(target,'data-mj-v435-detail');
  if(!text)return;
  const card=target.closest(selector);
  if(!card)return;
  let box=card.querySelector('.mj-v435-readout');
  if(!box){
   box=document.createElement('div');
   box.className='mj-v435-readout';
   box.setAttribute('role','status');
   box.setAttribute('aria-live','polite');
   const label=document.createElement('span');
   label.className='mj-v435-readout-caption';
   label.textContent='Recorded value';
   const val=document.createElement('strong');
   val.className='mj-v435-readout-value';
   box.append(label,val);
   const footer=card.querySelector('.mj-v41-card-footer');
   if(footer)footer.before(box);else card.append(box);
  }
  const result=box.querySelector('.mj-v435-readout-value');
  if(result&&result.textContent!==text)result.textContent=text;
  box.classList.add('is-visible');
  card.querySelectorAll('.mj-v435-inspectable.is-highlighted').forEach(n=>{
   if(n!==target)n.classList.remove('is-highlighted');
  });
  target.classList.add('is-highlighted');
 }
 function clearInspection(target){
  const card=target?.closest?.(selector);
  if(!card)return;
  // Allow keyboard focus or mouse position to keep the current detail visible.
  const active=document.activeElement;
  if(active?.closest?.(selector)===card&&active.matches?.('.mj-v435-inspectable'))return;
  const readout=card.querySelector('.mj-v435-readout');
  if(readout)readout.classList.remove('is-visible');
  card.querySelectorAll('.mj-v435-inspectable.is-highlighted').forEach(n=>n.classList.remove('is-highlighted'));
 }
 // One listener pair supports every route without attaching handlers to dozens
 // of SVG points on each redraw.
 root.addEventListener('pointerover',event=>{
  const target=event.target.closest?.('.mj-v435-inspectable');
  if(target)readout(target);
 });
 root.addEventListener('pointerout',event=>{
  const target=event.target.closest?.('.mj-v435-inspectable');
  if(!target)return;
  const next=event.relatedTarget;
  if(next&&target.contains(next))return;
  if(next?.closest?.(selector)===target.closest(selector)&&next.matches?.('.mj-v435-inspectable')){
   readout(next);return;
  }
  clearInspection(target);
 });
 root.addEventListener('focusin',event=>{
  const target=event.target.closest?.('.mj-v435-inspectable');
  if(target)readout(target);
 });
 root.addEventListener('focusout',event=>{
  const target=event.target.closest?.('.mj-v435-inspectable');
  if(target){
   const next=event.relatedTarget;
   if(next?.closest?.(selector)===target.closest(selector)&&next.matches?.('.mj-v435-inspectable'))readout(next);
   else clearInspection(target);
  }
 });
 const observeNew=records=>records.some(record=>
  record.target===root||Array.from(record.addedNodes).some(node=>{
   if(node.nodeType!==1)return false;
   if(node.classList?.contains('mj-v435-readout'))return false;
   return node.matches?.('.mj-page,.mj-v41,.g12,.ph,.mj-head,.mj-v4-kpis')||
     Boolean(node.querySelector?.('.mj-v41,.mj-page,.g12,.mj-v4-kpis'));
  })
 );
 const observer=new MutationObserver(records=>{if(observeNew(records))schedule()});
 observer.observe(root,{childList:true,subtree:true});
 addEventListener('hashchange',schedule);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
 else schedule();
 window.MJ_V435={version:'4.3.5',refresh:schedule};
})();
