/* Maddie Journey V4.3.7 | illustrative office-life simulator.
 * Deterministic, bounded and stateless. Never represents observed employee behavior.
 * Local to existing fictional office; no network requests, timers or personal data.
 */
(function(root){
 'use strict';
 const CYCLE=80, TO_START=27, WALK_OUT_END=36, SOCIAL_END=53, RETURN_END=62;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
 const mix=(a,b,p)=>a+(b-a)*p;
 const roleOf=a=>['work','walk','chat','coffee','meeting'].includes(a.activity)?a.activity:'work';
 const points=a=>{
   const sx=clamp(Number(a.deskX??a.homeX)||0,-2.12,2.12);
   const sz=clamp(Number(a.deskZ??a.homeZ)||0,-2.12,2.12);
   const tx=clamp(Number(a.homeX)||0,-2.12,2.12);
   const tz=clamp(Number(a.homeZ)||0,-2.12,2.12);
   // A clear aisle runs in front of the workstation bank, before the social area.
   const corridor=clamp(Math.max(sz+.18,.42),.42,1.65);
   return [[sx,sz],[sx,corridor],[tx,corridor],[tx,tz]];
 };
 function pathAt(path,p){
   const x=clamp(p,0,1)*3,j=Math.min(2,Math.floor(x)),f=smooth(x-j);
   return {x:mix(path[j][0],path[j+1][0],f),z:mix(path[j][1],path[j+1][1],f)};
 }
 function phaseOf(a,seconds){
   // Keep two-person discussions synchronized, stagger larger teams.
   const offset=roleOf(a)==='chat'&&(a.avatarIndex<2)?(a.room%7)*4:(a.room%7)*3+(a.avatarIndex%6)*7.5;
   const time=Number.isFinite(seconds)?seconds:0;
   return ((time+offset)%CYCLE+CYCLE)%CYCLE;
 }
 function pose(a,seconds=0,moving=true){
   const role=roleOf(a),path=points(a),phase=phaseOf(a,seconds);
   const start={x:path[0][0],z:path[0][1]},end={x:path[3][0],z:path[3][1]};
   if(!moving){
     const social=role!=='work';
     return {x:social?end.x:start.x,z:social?end.z:start.z,y:0,
       turn:role==='chat'?(a.avatarIndex===0||a.avatarIndex===3?Math.PI/2:-Math.PI/2):
         role==='meeting'?Math.PI:role==='work'?Math.PI:0,
       activity:role,walking:false,coffee:role==='coffee',cupLift:.06,armSwing:0,legSwing:0};
   }
   let pos,activity='work',walking=false,way=0;
   if(phase<TO_START){pos=start}
   else if(phase<WALK_OUT_END){
     walking=true;activity='walk';way=smooth((phase-TO_START)/(WALK_OUT_END-TO_START));pos=pathAt(path,way)
   }else if(phase<SOCIAL_END){
     pos=end;activity=role==='work'?'stretch':role;
   }else if(phase<RETURN_END){
     walking=true;activity='walk';way=1-smooth((phase-SOCIAL_END)/(RETURN_END-SOCIAL_END));pos=pathAt(path,way)
   }else{pos=start}
   const t=Number.isFinite(seconds)?seconds:0;
   const cycleBeat=Math.sin(t*2.5+(a.phase||0));
   const social=phase>=WALK_OUT_END&&phase<SOCIAL_END;
   if(social&&role==='walk'){
     const envelope=Math.sin(Math.PI*(phase-WALK_OUT_END)/(SOCIAL_END-WALK_OUT_END));
     pos={x:clamp(pos.x+Math.sin(t*.58+(a.phase||0))*.21*envelope,-2.12,2.12),
       z:clamp(pos.z+Math.cos(t*.55+(a.phase||0))*.13*envelope,-2.12,2.12)};
   }
   let turn=Math.PI;
   if(walking){
     const step=phase<TO_START?0:phase<SOCIAL_END?.002:-.002;
     const v=pathAt(path,clamp(way+step,0,1));
     const dx=v.x-pos.x,dz=v.z-pos.z;
     turn=Math.hypot(dx,dz)>.005?Math.atan2(dx,dz):Math.PI;
   }else if(activity==='chat')turn=a.avatarIndex===0||a.avatarIndex===3?Math.PI/2:-Math.PI/2;
   else if(activity==='coffee')turn=.2;
   else if(activity==='meeting')turn=Math.PI;
   else if(activity==='walk')turn=Math.sin(t*.45)*.35;
   const coffee=activity==='coffee';
   const bob=walking?Math.abs(cycleBeat)*.043:Math.abs(Math.sin(t*.9+(a.phase||0)))*.010;
   const sip=coffee?(Math.sin(t*1.6+(a.phase||0))*.5+.5):0;
   const arm=activity==='chat'?Math.sin(t*2+(a.phase||0))*.37:
      activity==='meeting'?Math.sin(t*1.7+(a.phase||0))*.24:
      activity==='stretch'?Math.sin(t*1.2+(a.phase||0))*.34:
      walking?Math.sin(t*6+(a.phase||0))*.44:.08*Math.sin(t*2+(a.phase||0));
   return {x:pos.x,z:pos.z,y:bob,turn,activity,walking,coffee,
     cupLift:.06+sip*.21,armSwing:arm,legSwing:walking?Math.sin(t*6+(a.phase||0))*.46:0};
 }
 root.MC_OFFICE_LIFE=Object.freeze({pose,phaseOf,roleOf,points,CYCLE});
})(window);
