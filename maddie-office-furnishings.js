/* Maddie Journey | Virtual Office furniture kit.
 * Procedural, batched, division-specific interiors; no external assets or user data.
 * Rooms and activity keep existing read-only routing and headcount calculations.
 */
(function(){
  'use strict';
  window.MC_OFFICE_FURNISH=function(opts){
    const {THREE,GD,MT,addStatic,piece,plant,division='',desks=[],isLobby=false,isLite=false}=opts;
    const type=division.toLowerCase();
    const color=(hex)=>MT({color:hex});
    const C={
      wood:color(0xc5a78b),pale:color(0xf8ede0),white:color(0xfffdfa),
      ink:color(0x254a70),steel:color(0x7c92a7),screen:MT({color:0x214c72,emissive:0x14335a,emissiveIntensity:.32}),
      blue:color(0x9dc8ee),mint:color(0x9bd9ba),pink:color(0xf0bbd4),
      coral:color(0xf5b398),yellow:color(0xf8d795),grey:color(0xd5dae1)
    };
    const box=(x,y,z,w,h,d,mat)=>piece([x,y,z],[w,h,d],mat);
    const cyl=new THREE.CylinderGeometry(1,1,1,12);
    const cupGeo=new THREE.CylinderGeometry(.065,.052,.11,8);
    const circle=(x,y,z,rx,h,rz,mat)=>{
      addStatic('office-circle',cyl,mat,[x,y,z],[rx,h,rz]);
    };
    const cup=(x,y,z,mat=C.white)=>addStatic('office-cup',cupGeo,mat,[x,y,z]);
    const shelf=(x,z)=>{
      box(x,.86,z,1.10,1.48,.24,C.wood);
      box(x,.88,z+.15,.95,1.25,.055,C.pale);
      for(let j=0;j<4;j++){
        box(x,.39+j*.34,z+.16,1.06,.045,.30,C.wood);
        if(!isLite)for(let k=0;k<5;k++){
          const tones=[C.ink,C.blue,C.coral,C.mint,C.yellow];
          box(x-.39+k*.18,.52+j*.30,z+.27,.10,.18,.08,tones[(j+k)%tones.length]);
        }
      }
    };
    const wallScreen=(kind='metrics')=>{
      box(-.45,1.06,-2.31,1.48,.88,.09,C.ink);
      box(-.45,1.06,-2.25,1.32,.69,.04,C.white);
      if(kind==='notes'||kind==='flow'){
        for(let i=0;i<9;i++){
          const px=-.96+(i%3)*.38,py=.82+Math.floor(i/3)*.22;
          box(px,py,-2.195,.24,.15,.022,[C.pink,C.yellow,C.mint,C.blue][i%4]);
          if(kind==='flow'&&i%3<2)box(px+.20,py,-2.18,.09,.014,.014,C.steel);
        }
      }else{
        for(let i=0;i<5;i++){
          const h=[.23,.38,.29,.48,.59][i];
          box(-.97+i*.24,.82+h*.5,-2.19,.11,h,.035,[C.mint,C.blue,C.coral,C.yellow,C.blue][i]);
        }
        box(-.45,1.34,-2.18,.92,.035,.02,C.grey);
      }
    };
    const meeting=(x,z,scale=1)=>{
      circle(x,.52,z,.54*scale,.09,.43*scale,C.white);
      circle(x,.29,z,.065,.40,.065,C.steel);
      for(const [dx,dz] of [[-.67,0],[.67,0],[0,-.55],[0,.55]]){
        box(x+dx*scale,.31,z+dz*scale,.28,.09,.30,C.blue);
        box(x+dx*scale,.49,z+(dz+(.05*Math.sign(dz||1)))*scale,.30,.31,.08,C.steel);
      }
      cup(x+.15,.60,z+.09,C.pale);
    };
    const lounge=(x,z)=>{
      box(x,.34,z,.76,.24,.43,C.pale);
      box(x,.57,z-.20,.82,.38,.16,C.blue);
      box(x-.45,.33,z,.12,.25,.46,C.blue);
      box(x+.45,.33,z,.12,.25,.46,C.blue);
      circle(x-.72,.34,z+.48,.27,.10,.27,C.wood);
      circle(x-.72,.15,z+.48,.045,.24,.045,C.steel);
      cup(x-.72,.42,z+.48,C.white);
    };
    const coffeeNook=()=>{
      box(1.97,.26,1.98,.76,.45,.38,C.wood);
      box(1.97,.52,1.98,.80,.08,.40,C.white);
      box(1.78,.71,1.96,.20,.28,.20,C.ink);
      box(1.79,.79,2.08,.13,.055,.025,C.steel);
      cup(2.10,.65,2.02,C.pale);
    };
    const chair=(x,z)=>{
      box(x,.26,z,.34,.08,.35,C.blue);
      box(x,.45,z+.17,.37,.41,.075,C.steel);
      box(x,.13,z,.06,.19,.06,C.ink);
    };
    const chartNotes=()=>{
      wallScreen('metrics');
      box(-1.78,1.03,-2.27,.62,.65,.07,C.white);
      box(-1.78,1.03,-2.22,.52,.53,.025,C.mint);
      for(let i=0;i<3;i++)box(-1.96+i*.18,.89+i*.10,-2.20,.10,.16+i*.06,.012,C.ink);
    };
    if(isLobby){
      // The central globe and rings are kept visible: furniture stays at the perimeter.
      box(0,.36,2.16,1.60,.56,.42,C.wood);
      box(0,.69,2.16,1.64,.10,.45,C.white);
      box(-.46,.83,2.00,.30,.20,.045,C.screen);
      cup(.42,.82,2.03,C.white);
      lounge(-1.55,1.72);
      plant(1.94,1.84);
      return;
    }
    // All furniture sits around the existing staff/workstation footprint.
    shelf(1.74,-2.09);
    coffeeNook();
    for(const desk of desks){
      const x=desk.position.x,z=desk.position.z;
      chair(x+.26,z+.50);
      box(x,.665,z-.105,.29,.025,.055,C.ink);
      box(x,.63,z-.12,.34,.21,.02,C.screen);
      box(x,.52,z+.10,.27,.016,.115,C.grey);
    }
    if(/design/.test(type)){
      wallScreen('notes');
      meeting(1.42,.08,.87);
      box(1.54,1.00,-1.42,.94,.82,.08,C.white);
      if(!isLite)for(let i=0;i<8;i++)box(1.16+(i%4)*.22,.80+Math.floor(i/4)*.26,-1.36,.12,.17,.03,[C.mint,C.pink,C.yellow,C.blue][i%4]);
      lounge(1.43,1.28);
    }else if(/media/.test(type)){
      wallScreen('metrics');
      box(1.24,.92,-1.43,.90,.55,.05,C.ink);
      box(1.24,.92,-1.38,.74,.40,.02,C.blue);
      // Tripod, compact camera and studio lights.
      box(1.33,.79,1.00,.07,1.10,.07,C.steel);
      box(1.33,1.36,1.00,.36,.24,.25,C.ink);
      box(1.22,1.39,1.19,.12,.12,.13,C.screen);
      for(const dx of [-.23,.23])box(1.33+dx,.30,1.00+dx,.05,.58,.05,C.steel);
      box(2.04,1.23,.78,.12,1.22,.12,C.steel);
      box(2.04,1.84,.78,.46,.34,.10,C.white);
      box(1.75,.26,-.83,.78,.48,.38,C.grey);
    }else if(/corporate/.test(type)){
      wallScreen('flow');
      meeting(1.44,.28,.91);
      for(let j=0;j<3;j++)box(1.9,.42+j*.36,-1.50,.65,.32,.38,C.steel);
      box(1.92,.44,-1.30,.54,.055,.025,C.white);
    }else if(/revenue/.test(type)){
      chartNotes();
      box(1.30,.97,-1.48,.95,.63,.08,C.ink);
      box(1.30,.97,-1.41,.82,.46,.02,C.white);
      for(let i=0;i<4;i++)box(.97+i*.20,.80+[.11,.20,.28,.38][i]*.5,-1.385,.105,[.11,.20,.28,.38][i],.016,[C.blue,C.mint,C.coral,C.yellow][i]);
      meeting(1.42,.72,.75);
    }else if(/gencon/.test(type)){
      wallScreen('flow');
      meeting(1.37,.35,.98);
      box(1.63,.78,-1.50,.94,.63,.09,C.white);
      for(let i=0;i<6;i++)box(1.29+(i%3)*.28,.62+Math.floor(i/3)*.25,-1.43,.20,.14,.024,[C.mint,C.yellow,C.blue][i%3]);
    }else if(/business/.test(type)){
      chartNotes();
      meeting(1.08,.35,1.07);
      box(1.93,1.01,-1.22,.61,.63,.07,C.ink);
      box(1.93,1.01,-1.16,.49,.50,.025,C.blue);
    }else if(/ceo/.test(type)||/coo/.test(type)){
      wallScreen('metrics');
      lounge(1.40,.72);
      box(1.65,.35,-1.36,.75,.61,.42,C.wood);
      box(1.65,.68,-1.35,.73,.08,.44,C.white);
      box(1.51,.81,-1.56,.36,.21,.03,C.ink);
      cup(1.89,.77,-1.34,C.white);
    }else{
      wallScreen('flow');
      meeting(1.35,.40,.86);
    }
    if(!isLite){
      // Extra small details only for regular/detail quality.
      box(-2.10,.95,.80,.34,.65,.23,C.wood);
      for(let j=0;j<3;j++)box(-2.1,.78+j*.18,.93,.30,.045,.02,C.steel);
      cup(-1.82,.57,1.86,C.yellow);
      plant(2.04,-.10);
    }
  };
})();
