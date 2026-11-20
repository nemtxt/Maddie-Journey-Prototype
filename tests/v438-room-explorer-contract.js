/* Maddie Journey V4.3.8 — read-only room explorer regression.
   Run: node tests/v438-room-explorer-contract.js
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const hub=read('p-hub.js'),css=read('maddie-office-explorer.css');
new vm.Script(hub);
for(const page of ['index.html','demo.html']){
 const html=read(page);
 assert.ok(html.includes('maddie-office-explorer.css?v=interactive-rooms-v438'));
 assert.ok(html.includes('p-hub.js?v=interactive-rooms-v438'));
 assert.ok(html.indexOf('maddie-office-explorer.css')>html.indexOf('maddie-v435-depth.css'));
 assert.ok(html.indexOf('maddie-office-life.js')<html.indexOf('p-hub.js'));
}
for(const marker of ['data-hx="inspector"','data-hx="team-more"','data-hx="focus-person"','data-hx="profile"','data-hx="person"','data-hx="metrics"','data-hx="preset"','aria-expanded','aria-pressed','mcEntryTransitionUntil','mcHasPersonCamera','mcInspectorOpen','mcTeamExpanded','mcSafe','mcFocusCamera("person")','mcAnimateFocusedPeople','mcApplyRoomLOD','mcLifeEnabled']){
 assert.ok(hub.includes(marker),'Hub missing '+marker);
}
for(const marker of ['.mc-room-inspector','.mc-explorer-content','.mc-explorer-presets','@media(max-width:730px)','@media(prefers-reduced-motion:reduce)',':focus-visible']){
 assert.ok(css.includes(marker),'CSS missing '+marker);
}
const start=hub.indexOf('function mcRoomFlavor(d){'),end=hub.indexOf('function mcBuildEmotes(){',start);
assert.ok(start>=0&&end>start,'extract room explorer functions');
const employees=[
 {i:0,name:'Fictional Ada',role:'Designer',dept:'Design',status:'Regular',f:80,l90:2,head:true},
 {i:1,name:'Fictional Ben',role:'Artist',dept:'Design',status:'Probationary',f:60,l90:0},
 {i:2,name:'Fictional Cora',role:'Artist',dept:'Design',status:'Regular',f:90,l90:1},
 {i:3,name:'Fictional Drew',role:'Manager',dept:'Design',status:'Regular',f:100,l90:0},
 {i:4,name:'Fictional Erin',role:'Designer',dept:'Design',status:'Regular',f:95,l90:0},
 {i:5,name:'Fictional Faye',role:'Editor',dept:'Media',status:'Regular',f:78,l90:0}
];
const context={
 D:[['Design',5],['Media',1]],LOB:'#183B63',HX:['#79C9A5','#F26B4F'],mcOfficeNames:['HQ','Design','Media'],
 mcPeople:d=>d==='HQ'?employees:employees.filter(e=>e.dept===d),
 mcTeamExpanded:false,mcSelectedPerson:0,mcInspectorOpen:true,mcViewPreset:'iso',
 mcSafe:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'),
 ic:()=>'',isDark:()=>false,ready:1,focus:{idx:0},mcActors:[{emp:{i:0},room:0}]
};
vm.createContext(context);
vm.runInContext(hub.slice(start,end)+'\nthis.explorer={mcPanel,mcInspectorHtml,mcRoomFlavor};',context);
const panel=context.explorer.mcPanel('Design');
assert.match(panel,/Explore room/);assert.match(panel,/Camera/);assert.match(panel,/Full profile/);
assert.match(panel,/Inspect avatar/);assert.match(panel,/201-file completion/);
assert.match(panel,/Recorded lates/);assert.match(panel,/aria-pressed="true"/);
assert.match(panel,/data-emp="0"/);
assert.equal((panel.match(/class="mc-explorer-person"/g)||[]).length,4);
context.mcTeamExpanded=true;
assert.equal((context.explorer.mcPanel('Design').match(/class="mc-explorer-person"/g)||[]).length,5);
context.mcInspectorOpen=false;
assert.match(context.explorer.mcPanel('Design'),/data-open="false"/);
context.focus=null;context.ready=0;
assert.doesNotMatch(context.explorer.mcPanel('Design'),/data-hx="focus-person"/);
assert.match(context.explorer.mcPanel('HQ'),/Headquarters/);
for(const division of ['HQ','Media','Design','Corporate Operations','Revenue Management','GenCon','Business Development','CEO Team','COO Team']){
 const brief=context.explorer.mcRoomFlavor(division);
 assert.ok(brief.length===2&&brief.every(s=>s.length>5),division+' descriptive scene');
}
assert.match(hub,/if\(view==="person"&&!mcHasPersonCamera\(\)\)view="iso"/);
assert.match(hub,/mcEntryTransitionUntil=performance\.now\(\)/);
assert.match(hub,/mcInspectorHtml/); // inspector helpers remain integrated
console.log('V4.3.8 room inspector, camera presets, accessible controls and read-only previews: PASS');
