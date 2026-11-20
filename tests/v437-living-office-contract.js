/* V4.3.7 — Node-only non-network living-office regression checks.
 * Run: node tests/v437-living-office-contract.js
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const hub=read('p-hub.js'),lifeScript=read('maddie-office-life.js'),furnish=read('maddie-office-furnishings.js');
for(const code of [hub,lifeScript,furnish])new vm.Script(code);
const sandbox={window:{}};
vm.runInNewContext(lifeScript,sandbox);
const life=sandbox.window.MC_OFFICE_LIFE;
assert.ok(life&&typeof life.pose==='function');
assert.equal(life.CYCLE,80);
assert.match(hub,/mcLifeEnabled/);
assert.match(hub,/mcAnimateOverviewPeople/);
assert.match(hub,/mcAnimateFocusedPeople/);
assert.match(hub,/mcApplyRoomLOD/);
assert.match(hub,/mcRefreshRoomLabels/);
assert.match(hub,/data-mc-life/);
assert.match(hub,/officeLifeMotion/);
assert.match(hub,/prefers-reduced-motion|RM\.matches/);
assert.match(hub,/GD\.actorShadow/);
assert.match(hub,/pShadow=new THREE\.InstancedMesh/);
assert.match(hub,/mcPreview/);
assert.match(hub,/mcOfficeSettings/);
assert.match(hub,/mcLowCost/);
assert.match(furnish,/softLight/);
assert.match(furnish,/moodRug/);
for(const docName of ['index.html','demo.html']){
  const doc=read(docName);
  for(const file of ['maddie-office-furnishings.js','maddie-office-life.js','p-hub.js'])
    assert.ok(doc.includes(file+'?v=living-office-v437'),docName+' '+file+' cache tag');
  assert.ok(doc.indexOf('maddie-office-furnishings.js')<doc.indexOf('maddie-office-life.js'));
  assert.ok(doc.indexOf('maddie-office-life.js')<doc.indexOf('p-hub.js'));
}
const expected={work:'stretch',walk:'walk',chat:'chat',coffee:'coffee',meeting:'meeting'};
for(const [role,stage] of Object.entries(expected)){
 for(let room=0;room<8;room++){
  const actor={activity:role,room,avatarIndex:role==='chat'?3:2,phase:room*.2,
   homeX:1.5,homeZ:.75,deskX:-1.3,deskZ:-.4};
  const still=life.pose(actor,10,false);
  assert.equal(still.activity,role);
  assert.equal(still.walking,false);
  assert.deepEqual(life.pose(actor,15,false),still);
  const kinds=new Set;
  let last=null,maxStep=0;
  for(let k=0;k<3200;k++){
   const p=life.pose(actor,k*.05,true);
   assert.ok([p.x,p.z,p.y,p.turn,p.cupLift,p.armSwing,p.legSwing].every(Number.isFinite));
   assert.ok(Math.abs(p.x)<=2.13&&Math.abs(p.z)<=2.13,'room boundaries: '+role);
   kinds.add(p.activity);
   if(last)maxStep=Math.max(maxStep,Math.hypot(p.x-last.x,p.z-last.z));
   last=p;
  }
  assert.ok(kinds.has('work'),role+' at desk');
  assert.ok(kinds.has(stage),role+' specific activity');
  assert.ok(maxStep<.16,role+' movement continuity '+maxStep);
 }
}
assert.doesNotMatch(lifeScript,/\bfetch\s*\(|XMLHttpRequest|localStorage|supabase/i);
console.log('V4.3.7 living-office behavior, HTML boot order, reduced motion and geometry: PASS');
