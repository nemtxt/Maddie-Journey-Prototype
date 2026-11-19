/* Local fictional mode only. Never initializes Claude, Airtable, Google or a network connector. */
(function(){'use strict';
 var app=document.getElementById('app'),gate=document.getElementById('gate'),live=document.getElementById('live');
 if(gate){gate.classList.add('out');gate.hidden=true;gate.setAttribute('aria-hidden','true');}
 if(app)app.inert=false;
 document.body.classList.add('mcws','mc-fictional');
 var lock=document.getElementById('lock');if(lock){lock.hidden=true;lock.style.display='none';lock.disabled=true;}
 if(live){live.setAttribute('title','Fictional presentation data — no connectors');live.setAttribute('aria-label','Fictional demonstration data');}
 function refreshLabels(){
  ['livedot','livedot2'].forEach(function(id){var el=document.getElementById(id);if(el)el.className='dot g'});
  ['livetxt','livetxt2'].forEach(function(id){var el=document.getElementById(id);if(el)el.textContent='Fictional demo'});
  var ft=document.getElementById('sfoot');if(ft)ft.textContent='Fictional sample data · Read-only prototype';
 }
 window.MC_BOOT={status:function(){return{cls:'g',text:'Fictional demo'}},sources:function(from){
   if(typeof window.sheet!=='function')return;
   window.sheet('Demonstration data','Fictional data only',
     '<p class="note">This standalone prototype uses 51 fictional employee profiles and synthetic operational records. It is not connected to Airtable, Gmail, Google Sheets, Calendar, or Claude. No data is sent, changed, or saved by this preview.</p>',from);
  },refreshNow:function(){}};
 document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#live'))window.MC_BOOT.sources(e.target.closest('#live'))});
 document.addEventListener('click',function(e){var x=e.target.closest&&e.target.closest('#sensbtn');if(!x)return;var b=document.body,on=!b.classList.contains('mc-hide');b.classList.toggle('mc-hide',on);x.setAttribute('aria-pressed',String(on));x.setAttribute('aria-label',on?'Show sensitive values':'Hide sensitive values')});
 document.addEventListener('click',function(e){var x=e.target.closest&&e.target.closest('#bigbtn');if(!x)return;var b=document.body,on=!b.classList.contains('mc-big');b.classList.toggle('mc-big',on);x.setAttribute('aria-pressed',String(on));x.textContent=on?'A−':'A+'});
 addEventListener('hashchange',refreshLabels);
 window.MC_DEMO_READY=function(){refreshLabels();if(!location.hash)location.hash='#overview';else if(window.MC_APP)window.MC_APP.route()};
 refreshLabels();
})();