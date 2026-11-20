/* Live Philippine Standard Time header. Never uses the visitor's timezone. */
(function(){
'use strict';
const clock=document.getElementById('mj-ph-clock');
if(!clock)return;
const date=clock.querySelector('.mj-ph-clock-date');
const time=clock.querySelector('.mj-ph-clock-time');
const dateFormat=new Intl.DateTimeFormat('en-PH',{
 timeZone:'Asia/Manila',weekday:'short',month:'short',day:'numeric',year:'numeric'
});
const timeFormat=new Intl.DateTimeFormat('en-PH',{
 timeZone:'Asia/Manila',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true
});
const isoFormat=new Intl.DateTimeFormat('sv-SE',{
 timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit',
 hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false
});
let interval=null;
function update(){
 const now=new Date();
 const currentDate=dateFormat.format(now);
 const currentTime=timeFormat.format(now)+' PHT';
 if(date&&date.textContent!==currentDate)date.textContent=currentDate;
 if(time&&time.textContent!==currentTime)time.textContent=currentTime;
 clock.dateTime=isoFormat.format(now).replace(' ','T')+'+08:00';
}
function sync(){
 if(interval!==null){clearInterval(interval);interval=null}
 update();
 if(!document.hidden)interval=setInterval(update,1000);
}
document.addEventListener('visibilitychange',sync,{passive:true});
sync();
})();
