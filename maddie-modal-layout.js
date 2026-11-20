/* Responsive employee information sheet enhancement.
 * Reflows existing DOM; preserves record values, links and privacy masking.
 */
(function(){
 'use strict';
 const layer=document.getElementById('layer');
 if(!layer)return;
 let scheduled=false;
 function reshapeProfile(sheet){
  if(!sheet||sheet.dataset.mjRectReady)return;
  sheet.dataset.mjRectReady='1';
  const portrait=Array.from(sheet.children).find(n=>n.classList?.contains('pf'));
  if(!portrait)return;
  sheet.classList.add('mj-profile-sheet');
  const children=Array.from(sheet.children);
  const start=children.indexOf(portrait)+1;
  if(start<1)return;
  const grid=document.createElement('div');
  grid.className='mj-profile-grid';
  const footers=[];
  let current=null;
  for(const element of children.slice(start)){
   if(element.matches?.('.src')){
    footers.push(element);continue;
   }
   if(element.tagName==='H3'){
    current=document.createElement('section');
    current.className='mj-profile-group';
    current.setAttribute('aria-label',element.textContent.trim());
    grid.appendChild(current);
   }
   if(current)current.appendChild(element);
   else footers.push(element);
  }
  if(!grid.children.length)return;
  sheet.appendChild(grid);
  footers.forEach(n=>sheet.appendChild(n));
  // Consolidate the scattered name, role, and avatar into one compact,
  // sticky identity header. Reuse the original nodes to preserve their data.
  const name=Array.from(sheet.children).find(n=>n.tagName==='H2');
  const subtitle=Array.from(sheet.children).find(n=>n.classList?.contains('sub'));
  if(name){
   const identity=document.createElement('header');
   identity.className='mj-profile-identity';
   const text=document.createElement('div');
   text.className='mj-profile-heading';
   text.appendChild(name);
   if(subtitle)text.appendChild(subtitle);
   const note=document.createElement('span');
   note.className='mj-profile-readonly';
   note.textContent='Fictional profile · Read-only';
   text.appendChild(note);
   identity.appendChild(portrait);
   identity.appendChild(text);
   sheet.insertBefore(identity,grid);
  }
  // Fast access to every information group, without hiding any fields or
  // introducing separate profile pages. All targets use the existing DOM.
  const groups=Array.from(grid.querySelectorAll('.mj-profile-group'));
  if(groups.length>1){
   const bar=document.createElement('nav');
   bar.className='mj-profile-jumps';
   bar.setAttribute('aria-label','Jump to profile details');
   const prefix=document.createElement('span');
   prefix.className='mj-profile-jumps-title';
   prefix.textContent='Profile details';
   bar.appendChild(prefix);
   groups.forEach((group,index)=>{
    group.id='mj-profile-detail-'+index;
    group.dataset.mjProfileDetail=String(index);
    const label=group.querySelector('h3')?.textContent?.trim()||('Details '+(index+1));
    const button=document.createElement('button');
    button.type='button';button.className='mj-profile-jump';
    button.textContent=label;
    button.dataset.mjProfileJump=String(index);
    button.setAttribute('aria-controls',group.id);
    if(index===0)button.setAttribute('aria-current','location');
    bar.appendChild(button);
   });
   sheet.insertBefore(bar,grid);
  }
 }
 function enhance(){
  scheduled=false;
  if(!document.body.classList.contains('mj-new'))return;
  layer.querySelectorAll('.sheet:not([data-mj-rect-ready])').forEach(reshapeProfile);
 }
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  queueMicrotask(enhance);
 }
 // Jump links operate within the modal's own scroll container. Preserve
 // the keyboard focus and visible sensitive-value masking of the original sheet.
 layer.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-mj-profile-jump]');
  if(!button)return;
  const sheet=button.closest('.mj-profile-sheet');
  if(!sheet)return;
  const target=sheet.querySelector('[data-mj-profile-detail="'+button.dataset.mjProfileJump+'"]');
  if(!target)return;
  const heading=sheet.querySelector('.mj-profile-identity');
  const nav=sheet.querySelector('.mj-profile-jumps');
  const sheetTop=sheet.getBoundingClientRect().top;
  const desired=sheet.scrollTop+(target.getBoundingClientRect().top-sheetTop)-
   (heading?.getBoundingClientRect().height||0)-(nav?.getBoundingClientRect().height||0)-12;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches||
   document.documentElement.classList.contains('mj-reduced');
  sheet.scrollTo({top:Math.max(0,desired),behavior:reduced?'auto':'smooth'});
  nav?.querySelectorAll('[data-mj-profile-jump]').forEach(item=>{
   if(item===button)item.setAttribute('aria-current','location');
   else item.removeAttribute('aria-current');
  });
 });
 const observer=new MutationObserver(schedule);
 // Modal hosts are appended directly to #layer. Reflowing fields inside a
 // sheet should not queue another query for every moved DOM node.
 observer.observe(layer,{childList:true});
 schedule();
})();
