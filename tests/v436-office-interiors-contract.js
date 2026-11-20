/* Run: node tests/v436-office-interiors-contract.js */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(f)=>fs.readFileSync(path.join(root,f),'utf8');
const hub=read('p-hub.js'),furniture=read('maddie-office-furnishings.js');
new (require('node:vm').Script)(hub);
new (require('node:vm').Script)(furniture);
for(const html of ['index.html','demo.html']){
  const doc=read(html);
  assert.match(doc,/maddie-office-furnishings\.js\?v=living-office-v437/);
  assert.match(doc,/p-hub\.js\?v=living-office-v437/);
  assert.ok(doc.indexOf('maddie-office-furnishings.js')<doc.indexOf('p-hub.js'));
}
assert.match(hub,/window\.MC_OFFICE_FURNISH/);
assert.match(hub,/furnish\(\{desks:roomDesks\}\)/);
assert.match(hub,/coffeeActors/);
assert.match(hub,/activity==="coffee"/);
assert.match(hub,/mcApplyRoomLOD/);
assert.match(hub,/mcRefreshRoomLabels/);
assert.match(hub,/mcPreview/);
assert.match(hub,/mcLowCost/);
const win={};
new Function('window',furniture)(win);
assert.equal(typeof win.MC_OFFICE_FURNISH,'function');
const THREE={CylinderGeometry:class CylinderGeometry{constructor(...args){this.args=args}}};
for(const division of ['Headquarters','Design','Media','Corporate Operations','Revenue Management','CEO Team','COO Team','GenCon','Business Development']){
 let boxCount=0,batchCount=0;
 win.MC_OFFICE_FURNISH({THREE,GD:{},MT:()=>({id:1}),piece:()=>{boxCount++},
   addStatic:()=>{batchCount++},plant:()=>{},division,isLobby:division==='Headquarters',
   isLite:false,desks:[{position:{x:-1,z:-1}}]});
 assert.ok(boxCount>=8,division+' has room furnishing');
 assert.ok(batchCount>=1,division+' uses batched objects');
}
console.log('Office interiors contract: PASS');
