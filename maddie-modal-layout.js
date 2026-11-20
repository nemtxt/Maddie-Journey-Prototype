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
 const observer=new MutationObserver(schedule);
 // Modal hosts are appended directly to #layer. Reflowing fields inside a
 // sheet should not queue another query for every moved DOM node.
 observer.observe(layer,{childList:true});
 schedule();
})();
