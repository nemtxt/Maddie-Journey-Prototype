/* Local fictional mode only. Never initializes Claude, Airtable, Google or a network connector. */
(function(){'use strict';
 var app=document.getElementById('app'),gate=document.getElementById('gate'),live=document.getElementById('live');
 /* Demo-only entry flow. This is not authentication or protection of real data. */
 var DEMO_PASSCODE='DEMO2027',form=document.getElementById('gform');
 var input=document.getElementById('pc'),status=document.getElementById('gs');
 var unlock=document.getElementById('unl'),note=document.getElementById('gnote');
 var themeToggle=document.getElementById('gth');
 var unlocked=false,transitioning=false;
 if(gate){gate.hidden=false;gate.classList.remove('out');gate.removeAttribute('aria-hidden');}
 if(app)app.inert=true;
 document.body.classList.add('mc-demo-locked');
 if(note)note.textContent='Demo passcode: DEMO2027. Fictional records only. This client-side gate does not secure confidential data.';
 if(status){status.textContent='';status.setAttribute('aria-live','polite')}
 if(unlock)unlock.textContent='Open demo';
 function setError(message){
  if(status)status.textContent=message;
  if(form){form.classList.remove('bad');void form.offsetWidth;form.classList.add('bad')}
  if(input){input.setAttribute('aria-invalid','true');input.focus();input.select()}
 }
 function successfulUnlock(){
  if(unlocked||transitioning)return;
  unlocked=true;transitioning=true;
  if(unlock){unlock.disabled=true;unlock.textContent='Opening 3D Office…'}
  if(status)status.textContent='Entering the fictional 3D Office';
  if(input){input.value='';input.removeAttribute('aria-invalid')}
  if(form)form.classList.remove('bad');
  // The office scene is prepared behind the gate. Reopen/reaffirm it
  // synchronously after unlocking, even when the hash was already #office.
  // Do not clear app.inert AFTER HUB.open(): the 3D viewer owns that flag.
  if(app&&!document.body.classList.contains('hxon'))app.inert=false;
  if(location.hash!=='#office')location.hash='#office';
  try{
   if(window.HUB?.open){window.HUB.open();}
   else if(window.MC_APP?.route){window.MC_APP.route();}
  }catch(error){console.error('3D Office navigation failed',error);
   // Keep the office route available even if the immersive renderer fails.
   window.MC_APP?.route?.();
  }
  document.body.classList.remove('mc-demo-locked');
  document.body.classList.add('mc-demo-revealing');
  gate?.classList.add('mc-demo-leaving');
  gate?.classList.add('out');
  var finish=function(){
   if(gate){gate.hidden=true;gate.setAttribute('aria-hidden','true')}
   document.body.classList.remove('mc-demo-revealing');
   transitioning=false;
   try{document.getElementById('view')?.focus({preventScroll:true})}catch(_){}
  };
  var reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||document.body.classList.contains('mj-reduced');
  if(reduce)finish();else setTimeout(finish,850);
 }
 if(form)form.addEventListener('submit',function(event){
  event.preventDefault();
  if(unlocked||transitioning)return;
  if(!input||input.value!==DEMO_PASSCODE){
   setError('Incorrect demo passcode. Use DEMO2027.');return;
  }
  successfulUnlock();
 });
 if(themeToggle)themeToggle.addEventListener('click',function(){
  var root=document.documentElement,old=root.dataset.theme||'light';
  root.dataset.theme=old==='dark'?'light':'dark';
  try{localStorage.setItem('mc.theme',root.dataset.theme)}catch(_){}
 });
 if(!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)setTimeout(function(){input?.focus()},150);
 else input?.focus();
 document.body.classList.add('mcws','mc-fictional');
 var lock=document.getElementById('lock');if(lock){lock.hidden=true;lock.style.display='none';lock.disabled=true;}
 if(live){live.setAttribute('title','Fictional presentation data — no connectors');live.setAttribute('aria-label','Fictional demonstration data');}
 function refreshLabels(){
  ['livedot','livedot2'].forEach(function(id){var el=document.getElementById(id);if(el)el.className='dot g'});
  ['livetxt','livetxt2'].forEach(function(id){var el=document.getElementById(id);if(el)el.textContent='Fictional demo'});
  var ft=document.getElementById('sfoot');if(ft)ft.textContent='Fictional sample data · Read-only prototype';
 }
 window.MC_BOOT={lock:function(){
   unlocked=false;transitioning=false;
   if(app)app.inert=true;
   if(gate){gate.hidden=false;gate.classList.remove('out','mc-demo-leaving');gate.removeAttribute('aria-hidden')}
   document.body.classList.add('mc-demo-locked');
   if(unlock){unlock.disabled=false;unlock.textContent='Open demo'}
   if(status)status.textContent='';
   if(input){input.value='';input.focus()}
  },status:function(){return{cls:'g',text:'Fictional demo'}},sources:function(from){
   if(typeof window.sheet!=='function')return;
   window.sheet('Demonstration data','Fictional data only',
     '<p class="note">This standalone prototype uses 51 fictional employee profiles and synthetic operational records. It is not connected to Airtable, Gmail, Google Sheets, Calendar, or Claude. No data is sent, changed, or saved by this preview.</p>',from);
  },refreshNow:function(){}};
 document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#live'))window.MC_BOOT.sources(e.target.closest('#live'))});
 document.addEventListener('click',function(e){var x=e.target.closest&&e.target.closest('#sensbtn');if(!x)return;var b=document.body,on=!b.classList.contains('mc-hide');b.classList.toggle('mc-hide',on);x.setAttribute('aria-pressed',String(on));x.setAttribute('aria-label',on?'Show sensitive values':'Hide sensitive values')});
 document.addEventListener('click',function(e){var x=e.target.closest&&e.target.closest('#bigbtn');if(!x)return;var b=document.body,on=!b.classList.contains('mc-big');b.classList.toggle('mc-big',on);x.setAttribute('aria-pressed',String(on));x.textContent=on?'A−':'A+'});
 addEventListener('hashchange',refreshLabels);
 window.MC_DEMO_READY=function(){
   refreshLabels();
   // Prepare the actual 3D office beneath the passcode overlay. After unlock,
   // the gate fades away to reveal this scene, rather than the overview page.
   if(!location.hash)location.replace('#office');
   else if(window.MC_APP)window.MC_APP.route();
  };
 refreshLabels();
})();