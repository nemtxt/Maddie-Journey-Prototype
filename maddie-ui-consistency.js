/* Maddie Journey v5.7: cohesive workspace-specific accents */
(function(){'use strict';
const map=new Set(['people','pay','pulse','journey','learning','culture','talent','governance','scoreboard']);
function sync(){
 // Resolve the first display explicitly so dark never falls back to navy or mixed white cards.
 if(!document.documentElement.dataset.theme){
  document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
 }
 const hash=decodeURIComponent(location.hash.slice(1)||'overview'),first=hash.split(':')[0];
 const section=map.has(first)?first:hash.startsWith('view/')?'reports':hash.startsWith('division/')?'divisions':hash;
 document.body.dataset.mjArea=section;
 document.querySelectorAll('#nav a[data-mj-href]').forEach(a=>{if(!a.getAttribute('title'))a.title=a.textContent.trim()});
}
addEventListener('hashchange',sync);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();