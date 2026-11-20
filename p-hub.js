
(()=>{
const HX=["#79C9A5","#F26B4F","#183B63","#FFF1A8","#A83F73","#8BCFAF","#F59A83","#30537A","#F7E18C","#C06393"],LOB="#183B63",ORDER=[0,1,2,3,"L",4,5,6,7].filter(c=>c==="L"||c<D.length),MON=MCD.MON;
const SPEC=MCD.SPEC;
const row=(...p)=>p.map(([n,c])=>(n+" ").repeat(c)).join("").trim(),K4=row(["k0",3],["k1",3],["k2",3],["k3",3]),TM=row(["tm",12]),OC=row(["oc",12]);
const LAY={A:[K4,OC,row(["tr",8],["hl",4]),row(["bs",4],["ps",4],["nt",4])],
B:[row(["k0",3],["oc",9]),row(["k1",3],["oc",9]),row(["k2",3],["oc",9]),row(["k3",3],["tr",5],["hl",4]),row(["bs",4],["ps",4],["nt",4])],
C:[row(["tr",8],["hl",4]),K4,OC,row(["bs",4],["ps",4],["nt",4])],
D:[OC,K4,row(["tr",6],["bs",6]),row(["hl",4],["ps",4],["nt",4])]},
LA={"HQ":"A","HR":"A","Revenue Management":"A","Design":"A","Corporate Operations":"A","Media":"A","IT":"A","GenCon":"A","Business Development":"A"};
const TC=matchMedia("(pointer:coarse)").matches;
/* Office layer: real dated items per person (calculated probation checkpoints, birthdays, anniversaries) and division tasks from Chiefs’ Hub. */
const mcPad=n=>String(n).padStart(2,"0");
const mcDate=d=>`${d.getFullYear()}-${mcPad(d.getMonth()+1)}-${mcPad(d.getDate())}`;
const mcBase=(()=>{const v=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Manila",year:"numeric",month:"numeric",day:"numeric"}).formatToParts(new Date()),g=k=>+v.find(x=>x.type===k).value;return new Date(g("year"),g("month")-1,g("day"),12)})();
const mcAdd=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return mcDate(x)};
const MC_TASKS=MCD.TASKS;
const mcDayDiff=(a,b)=>Math.round((Date.parse(a+"T12:00:00Z")-Date.parse(b+"T12:00:00Z"))/86400000);
let mcSelectedDay=mcDate(mcBase),mcSelectedPerson=null,mcRoom=null,mcActors=[];
let mcLayer="overview",mcPanelCollapsed=false,mcViewPreset="iso",mcSearchTerm="",mcRoomMapOpen=false,mcViewsOpen=false;
const MC_LAYERS=[["overview","Overview"],["people","People"],["deadlines","Deadlines"],["documents","201 Files"],["attendance","Attendance"]];
const mcPeople=d=>d==="HQ"?EMP:EMP.filter(e=>e.dept===d);
const mcCounters=d=>{const o=MCD.OPS[d==="HQ"?"HQ":d],ht=o?o.tasks.filter(x=>!x.done&&x.due):[],t=(d==="HQ"?MC_TASKS:MC_TASKS.filter(x=>x.dept===d)).filter(x=>x.due).concat(ht);return {late:t.filter(x=>mcDayDiff(x.due,mcSelectedDay)<0).length,due:t.filter(x=>mcDayDiff(x.due,mcSelectedDay)===0).length,soon:t.filter(x=>{const q=mcDayDiff(x.due,mcSelectedDay);return q>0&&q<=2}).length}};
const mcOfficeNames=["HQ",...MCD.ROOMS];
 const mcMapName=new Proxy({},{get:(o,k)=>k==="HQ"?"Headquarters":MCD.SHORT[k]||k});
 const mcRoomButtons=(selected,compact=false)=>ORDER.map(v=>{const name=v==="L"?"HQ":D[v][0],active=name===selected,index=v==="L"?-1:+v,head=mcMapName[name]||name,people=name==="HQ"?M.n:D[index][1];return `<button type="button" class="mc-map-room mc-floor-tile${active?" is-current":""}" style="--mc-map-color:${v==="L"?LOB:HX[v]}" data-hx="jump" data-div="${mcSafe(name)}" aria-label="Open ${mcSafe(name)}, ${people} people" aria-current="${active?"location":"false"}" title="${mcSafe(name)}"><span class="mc-tile-swatch"></span><b>${mcSafe(head)}</b><small>${people} people</small></button>`}).join("");
 function mcBuildDirectory(){if(!hub)return;let dir=$("#mc-office-directory",hub);if(!dir){dir=document.createElement("section");dir.id="mc-office-directory";dir.setAttribute("aria-label","Office room directory");hub.append(dir)}dir.innerHTML=`<div class="mc-directory-head"><div><span class="mc-directory-eyebrow">Explore the workspace</span><h2>Office map <small>9 rooms</small></h2></div><button type="button" class="mc-directory-close" data-hx="toggle-directory" aria-label="${mcDirectoryClosed?"Show":"Hide"} office directory" aria-expanded="${!mcDirectoryClosed}">${mcDirectoryClosed?"Show map":"Minimize"}</button></div><div class="mc-map-grid">${mcRoomButtons(null)}</div><p>Choose a division to explore its people and work.</p>`;dir.classList.toggle("is-collapsed",mcDirectoryClosed)}

function mcRefreshRoomLabels(){if(!rooms.length)return;rooms.forEach(r=>{const d=r.idx==="L"?"HQ":D[r.idx][0],s=d==="HQ"?{n:M.n,a:M.avg}:deptStat(d),c=mcCounters(d);r.lab.innerHTML=`<b>${mcSafe(d==="HQ"?"Headquarters":d)}</b><span>${s.n} people</span>`})}

const mcTask=e=>MC_TASKS[e.i]||{due:null,title:"No dated item",person:e.name,emp:e.i},mcMood=(t,day=mcSelectedDay)=>{if(!t||!t.due)return{code:"steady",label:"No dated item",short:"No date",symbol:"·",color:0x9aa3b5};const q=mcDayDiff(t.due,day);return q<0?{code:"late",label:"Needs attention",short:"Overdue",symbol:"!",color:0xef6687}:q===0?{code:"due",label:"Deadline today",short:"Due today",symbol:"!",color:0xffb864}:q<=2?{code:"focus",label:"Focused work",short:"Due soon",symbol:"·",color:0x8a9def}:{code:"steady",label:"On schedule",short:"Planned",symbol:"✓",color:0x5dbf9a}};
const mcFormatted=d=>new Intl.DateTimeFormat("en-PH",{month:"short",day:"numeric",year:"numeric"}).format(new Date(d+"T12:00:00"));
const mcSafe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
function mcSetDay(d){if(!/^\d{4}-\d\d-\d\d$/.test(d)||!Number.isFinite(Date.parse(d)))return;mcSelectedDay=d;mcUpdatePeople();mcRefreshRoomLabels();mcPaintPanel()}
function mcUpdatePeople(){mcActors.forEach(a=>{const m=mcMood(a.task);a.mood=m;if(a.glow)a.glow.material.color.setHex(m.color);if(a.body.material&&a.body.material.emissive)a.body.material.emissive.setHex(m.color).multiplyScalar(.07)})}
function mcAgenda(d){const tasks=(d==="HQ"?MC_TASKS:MC_TASKS.filter(x=>x.dept===d)).filter(x=>x.due);return [...tasks].sort((a,b)=>Math.abs(mcDayDiff(a.due,mcSelectedDay))-Math.abs(mcDayDiff(b.due,mcSelectedDay))||a.due.localeCompare(b.due)).slice(0,6)}
function mcScheduleRow(t){const m=mcMood(t),selected=mcSelectedPerson===t.emp;return `<button type="button" class="mc-team-item${selected?" is-selected":""}" data-hx="person" data-emp="${t.emp}" aria-pressed="${selected}"><span class="mc-avatar ${m.code}">${mcSafe(t.person.split(/\s+/).map(x=>x[0]).slice(0,2).join(""))}</span><span class="mc-task-main"><b>${mcSafe(t.person)}</b><small>${mcSafe(t.title)}</small><em>${t.due?mcFormatted(t.due):"No date"}</em></span><span class="mc-task-state ${m.code}">${m.short}</span></button>`}
function mcEmployeeRow(e,type){const t=mcTask(e),is=mcSelectedPerson===e.i;let sub=type==="documents"?`${e.f}% completed${e.hasId?"":" · Missing ID"}`:type==="attendance"?`${e.l90} recorded lates (90 days)`:e.role;
 const v=type==="documents"?`${e.f}%`:type==="attendance"?`${e.l90} lates`:"Profile";
 return `<button class="mc-person-row${is?" is-selected":""}" data-hx="person" data-emp="${e.i}" aria-pressed="${is}"><span class="mc-avatar">${mcSafe(e.name.split(/\s+/).map(x=>x[0]).slice(0,2).join(""))}</span><span class="mc-task-main"><b>${mcSafe(e.name)}</b><small>${mcSafe(sub)}</small></span><span class="mc-row-chip">${v}</span></button>`}
function mcLayerContent(d){const people=mcPeople(d),tasks=d==="HQ"?MC_TASKS:MC_TASKS.filter(t=>t.dept===d),c=mcCounters(d);
 if(mcLayer==="people")return `<div class="mc-section-label">Team directory <span>${people.length} people</span></div><div class="mc-team-list mc-compact-list">${people.map(e=>mcEmployeeRow(e,"people")).join("")}</div>`;
 if(mcLayer==="documents"){const issues=[...people].filter(e=>e.f<100||!e.hasId).sort((a,b)=>a.f-b.f);return `<div class="mc-section-label">201-file attention <span>${issues.length} records to review</span></div><p class="mc-mini-explainer">Tracked 201 attachments and missing Employee IDs from the Airtable roster. Select a record for details.</p><div class="mc-team-list mc-compact-list">${(issues.length?issues:people).map(e=>mcEmployeeRow(e,"documents")).join("")}</div>`}
 if(mcLayer==="attendance"){const risks=[...people].sort((a,b)=>b.l90-a.l90);return `<div class="mc-section-label">Attendance overview <span>Previous 90 days</span></div><p class="mc-mini-explainer">Lates recorded in the Tardiness/Leave Tracker. Not real-time presence or productivity.</p><div class="mc-team-list mc-compact-list">${risks.map(e=>mcEmployeeRow(e,"attendance")).join("")}</div>`}
 if(mcLayer==="deadlines"){const o=MCD.OPS[d],open=o?o.tasks.filter(x=>!x.done).sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999")):[],dated=tasks.filter(x=>x.due).sort((a,b)=>a.due.localeCompare(b.due));return `<div class="mc-section-label">People dates <span>${dated.length} items</span></div><div class="mc-team-list mc-compact-list">${dated.map(mcScheduleRow).join("")||'<p class="mc-mini-explainer">No dated items in the next 60 days.</p>'}</div><div class="mc-section-label" style="margin-top:14px">Division tasks · Chiefs’ Hub <span>${o&&o.loaded?open.length+" open":"No task source"}</span></div><div class="mc-team-list mc-compact-list">${open.slice(0,12).map(x=>{const q=x.due?mcDayDiff(x.due,mcSelectedDay):null,c=q==null?"steady":q<0?"late":q===0?"due":q<=2?"focus":"steady";return`<div class="mc-team-item" style="cursor:default"><span class="mc-avatar ${c}">${q!=null&&q<0?"!":"·"}</span><span class="mc-task-main"><b>${mcSafe(x.title)}</b><small>${mcSafe([x.project,x.status].filter(Boolean).join(" · "))}</small><em>${x.due?mcFormatted(x.due):"No due date"}</em></span><span class="mc-task-state ${c}">${q==null?"No date":q<0?"Overdue":q===0?"Due today":q<=2?"Due soon":"Planned"}</span></div>`}).join("")}</div>`}
 return `<div class="mc-section-label">Team schedule <span>${mcFormatted(mcSelectedDay)}</span></div><div class="mc-team-list">${mcAgenda(d).map(mcScheduleRow).join("")}</div>`}
/* Focused rooms intentionally use an uncluttered 3D scene. The full reports,
   employee profiles and org charts remain available in dashboard routes. */
function mcPanel(d){
 const i=D.findIndex(x=>x[0]===d),hx=i<0?LOB:HX[i],
 idx=mcOfficeNames.indexOf(d),
 prev=mcOfficeNames[(idx-1+mcOfficeNames.length)%mcOfficeNames.length],
 next=mcOfficeNames[(idx+1)%mcOfficeNames.length];
 return `<div class="mc-scene mc-scene-minimal" style="--room-accent:${hx}">
   <div class="mc-scene-top">
     <div class="mc-scene-left">
       <button class="mc-scene-back" data-hx="leave">${ic("left")} All divisions</button>
       <button class="mc-scene-back mc-mini-btn" data-hx="prev" aria-label="Previous division" title="${mcSafe(prev)}">${ic("left")}</button>
       <button class="mc-scene-back mc-mini-btn" data-hx="next" aria-label="Next division" title="${mcSafe(next)}">${ic("arrow")}</button>
     </div>
     <div class="mc-scene-actions">
       <button type="button" class="mc-scene-back mc-mini-btn mc-office-theme-btn" data-hx="scene-theme" aria-label="Switch light or dark mode" aria-pressed="${isDark()}" title="Toggle appearance"><svg aria-hidden="true" class="i"><use href="#i-theme"></use></svg></button>
       <button class="mc-scene-back mc-mini-btn" data-hx="office-settings" aria-label="Office settings" title="Office settings">${ic("compass")}</button>
     </div>
   </div>
 </div>`;
}
function mcBuildEmotes(){let root=$("#mc-emotes",hub);if(root)root.remove();if(!ready||!mcRoom||!focus)return;
 root=document.createElement("div");root.id="mc-emotes";root.setAttribute("aria-hidden","true");hub.append(root);
 const candidates=mcActors.filter(a=>a.room===focus.idx).sort((a,b)=>(a.emp.i===mcSelectedPerson?-100:0)-(b.emp.i===mcSelectedPerson?-100:0)||mcDayDiff(a.task.due,mcSelectedDay)-mcDayDiff(b.task.due,mcSelectedDay));
 root.innerHTML=candidates.slice(0,hub.clientWidth<730?2:4).map(a=>{const m=mcMood(a.task);return`<div class="mc-emote ${m.code}${a.emp.i===mcSelectedPerson?" selected":""}" data-actor="${a.emp.i}" style="--emote-color:#${m.color.toString(16).padStart(6,"0")}"><span class="mc-emote-face">${m.symbol}</span><span class="mc-emote-meta"><b>${mcSafe(a.emp.name.split(" ")[0])}</b><small>${m.label}</small></span></div>`}).join("")}
function mcPaintPanel(){if(!hub||!mcRoom)return;let el=$("#mc-scene",hub);if(!el){el=document.createElement("div");el.id="mc-scene";hub.append(el)}
 const panelScroll=$(".mc-scene-panel",el)?.scrollTop||0;
 el.innerHTML=mcPanel(mcRoom);
 const activePanel=$(".mc-scene-panel",el);if(activePanel&&panelScroll)activePanel.scrollTop=panelScroll;
 mcSyncQualityUI();hub.classList.add("mc-focused");hub.classList.toggle("mc-css-fallback",!ready);if(!ready){mcBuildDirectory();mcFallbackRoom(mcRoom)}mcBuildEmotes()}
function mcFallbackRoom(d){let v=$("#mc-fallback",hub);if(!v){v=document.createElement("div");v.id="mc-fallback";hub.append(v)}
 const people=mcPeople(d).slice(0,8);
 v.innerHTML=`<div class="mc-fallback-office" style="--room-accent:${d==="HQ"?LOB:HX[D.findIndex(x=>x[0]===d)]}"><div class="mc-fb-wall"><div class="mc-fb-window"></div><div class="mc-fb-window"></div><div class="mc-fb-sign">${mcSafe(d)}</div></div><div class="mc-fb-floor">${people.map((e,k)=>{const m=mcMood(mcTask(e));return `<button type="button" class="mc-fb-desk" data-hx="person" data-emp="${e.i}" aria-label="Select ${mcSafe(e.name)}" style="--n:${k}"><span class="mc-fb-screen"></span><span class="mc-fb-person"></span><span class="mc-fb-chair"></span><span class="mc-fb-emote" style="--emo:#${m.color.toString(16).padStart(6,"0")}">${m.symbol}</span></button>`}).join("")}</div></div>`}
function mcCloseFocus(){mcCloseFloating();if(ready)$("#mc-office-directory",hub)?.remove();mcPanelCollapsed=false;mcRoomMapOpen=false;mcViewsOpen=false;mcRoom=null;mcSelectedPerson=null;focus=null;mcApplyRoomLOD();hub.classList.remove("mc-focused","mc-css-fallback","hxz");mcWake();const el=$("#mc-scene",hub);if(el)el.remove();const v=$("#mc-fallback",hub);if(v)v.remove();const bubbles=$("#mc-emotes",hub);if(bubbles)bubbles.remove();Vt.r=homeR();Vt.ph=.95;Vt.tx=Vt.tz=0;base=.75;rest=0;const hint=$(".hxk",hub);if(hint)hint.hidden=false}
function mcPreview(d){if(!hub||!isOpen){window.MC_PENDING_DIVISION=d;H.open();if(!hub||!isOpen)return}if(dvd)dvd.classList.remove("on");if(d!=="HQ"&&!D.some(x=>x[0]===d))return;
 mcCloseFloating();mcRoom=d;mcSelectedPerson=null;mcPanelCollapsed=false;mcRoomMapOpen=false;mcViewsOpen=false;mcViewPreset="iso";rest=0;const ri=d==="HQ"?"L":D.findIndex(x=>x[0]===d),r=rooms.find(x=>x.idx==ri);
 if(ready&&r){focus=r;Vt.r=clamp(3.8/(.3443*hub.clientWidth/hub.clientHeight),7.5,13);Vt.ph=.95;Vt.tx=r.x+(hub.clientWidth>860?.9:0);Vt.tz=r.z;hub.classList.add("hxz")}else{focus=null}
 mcApplyRoomLOD();mcAnimateFocusedPeople(Math.max(0,performance.now()/1000-t0),mcLifeEnabled());mcWake();
 mcSelectedPerson=(d==="HQ"?EMP:EMP.filter(e=>e.dept===d)).filter(e=>mcTask(e).due).sort((a,b)=>Math.abs(mcDayDiff(mcTask(a).due,mcSelectedDay))-Math.abs(mcDayDiff(mcTask(b).due,mcSelectedDay)))[0]?.i??null;
 mcPaintPanel();if(ready&&r)mcFocusCamera("iso");const hint=$(".hxk",hub);if(hint)hint.hidden=true;
 requestAnimationFrame(()=>{$(".mc-scene-back",hub)?.focus({preventScroll:true})});}

function mcFocusCamera(view="iso"){
 if(!hub)return;mcViewsOpen=false;$(".mc-scene-controls",hub)?.classList.remove("is-open");$(".mc-views-toggle",hub)?.setAttribute("aria-expanded","false");mcWake();mcViewPreset=view;const fb=$("#mc-fallback",hub);if(fb)fb.dataset.view=view;if(!focus){$$('[data-hx="preset"]',hub).forEach(b=>b.setAttribute("aria-pressed",b.dataset.view===view));return;}
 const r=clamp(3.8/(.3443*hub.clientWidth/hub.clientHeight),7.5,13);
 if(view==="top"){base=0;Vt.ph=.18;Vt.r=r*.93}
 else if(view==="front"){base=Math.PI;Vt.ph=1.23;Vt.r=r*1.02}
 else{base=.75;Vt.ph=.95;Vt.r=r}
 Vt.tx=focus.x+(hub.clientWidth>860?.9:0);Vt.tz=focus.z;
 $$('[data-hx="preset"]',hub).forEach(b=>b.setAttribute("aria-pressed",b.dataset.view===view));
}
function mcCloseFloating(){if(!hub)return;$("#mc-search",hub)?.remove();$("#mc-guide",hub)?.remove();$("#mc-settings",hub)?.remove()}
function mcSelectPerson(id){const e=EMP.find(e=>e.i===id);if(!e)return;if(mcRoom!=="HQ"&&mcRoom!==e.dept)mcPreview(e.dept);mcSelectedPerson=id;mcPanelCollapsed=false;mcPaintPanel()}
function mcFind(term){const q=term.toLocaleLowerCase().trim();const results=[...D.map(([n,c])=>({name:n,sub:`Division · ${c} people`,id:n,type:"room"})),{name:"Company HQ",sub:`Company · ${M.n} people`,id:"HQ",type:"room"},...EMP.map(e=>({name:e.name,sub:`${e.role} · ${e.dept}`,id:e.i,type:"person"}))];return (q?results.filter(x=>(x.name+" "+x.sub).toLowerCase().includes(q)):results.slice(0,9)).slice(0,12)}
function mcSearchResults(){const p=$("#mc-search-results",hub);if(!p)return;const rows=mcFind(mcSearchTerm);p.innerHTML=rows.length?rows.map(o=>`<button class="mc-find-item" data-hx="find-item" data-kind="${o.type}" data-value="${mcSafe(o.id)}"><b>${mcSafe(o.name)}</b><small>${mcSafe(o.sub)}</small></button>`).join(""):`<p class="mc-empty-search">No matching employee or division.</p>`}
function mcOpenSearch(){if(!hub)return;mcCloseFloating();mcSearchTerm="";const box=document.createElement("div");box.id="mc-search";box.className="mc-floating-backdrop";box.innerHTML=`<div class="mc-floating-dialog" role="dialog" aria-modal="true" aria-label="Find an employee or office"><div class="mc-dialog-head"><b>Find in the office</b><button data-hx="close-float" aria-label="Close search">${ic("x")}</button></div><input id="mc-search-input" type="search" placeholder="Search a person or division…" aria-label="Search people and divisions" autocomplete="off"><div id="mc-search-results" class="mc-search-results"></div><small>Choose a result to navigate directly.</small></div>`;hub.append(box);mcSearchResults();$("#mc-search-input",box).focus()}
function mcOpenGuide(){if(!hub)return;mcCloseFloating();const box=document.createElement("div");box.id="mc-guide";box.className="mc-floating-backdrop";box.innerHTML=`<div class="mc-floating-dialog" role="dialog" aria-modal="true" aria-label="How to use the office"><div class="mc-dialog-head"><b>Navigate the virtual office</b><button data-hx="close-float" aria-label="Close help">${ic("x")}</button></div><div class="mc-help-step"><b>01 · Move through divisions</b><p>Pick a room on the office map, use the previous/next arrows, or search for a division.</p></div><div class="mc-help-step"><b>02 · Explore the scene</b><p>Drag to orbit, scroll or pinch to zoom, or Shift + drag to pan when WebGL is available. Lite mode offers fixed camera angles.</p></div><div class="mc-help-step"><b>03 · Inspect people and insights</b><p>Select an avatar or employee in the panel to open their read-only profile. Switch monitoring layers to see deadlines, 201 files, and attendance.</p></div><p class="mc-help-note">Keyboard: Esc returns to office; + and − zoom; 0 resets camera; / opens search.</p><button class="mc-dash-btn" data-hx="close-float">Understood</button></div>`;hub.append(box);$("[data-hx=close-float]",box).focus()}
function mcNavigate(delta){const index=mcOfficeNames.indexOf(mcRoom||"HQ");mcPreview(mcOfficeNames[(index+delta+mcOfficeNames.length)%mcOfficeNames.length]);mcFocusCamera("iso")}

let mdl,mo,hemi,sunL,grd,pedM,peM,lastR=0;
const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme:dark)").matches};
function skin(){const d=isDark(),tc=document.getElementById("tc");if(tc)tc.content=d?"#000000":"#ffffff";if(!ready||!scene)return;const bg=d?0x000000:0xffffff;scene.background.setHex(bg);scene.fog.color.setHex(bg);hemi.color.setHex(d?0xffd9ea:0xffffff);hemi.groundColor.setHex(d?0x1b1418:0xead9e2);hemi.intensity=d?.9:1.05;sunL.intensity=d?.6:.4;scene.remove(grd);grd.geometry.dispose();grd.material.dispose();grd=new THREE.GridHelper(80,40,d?0x2c2229:0xeadde4,d?0x16111a:0xf5eef2);grd.position.y=-.45;scene.add(grd);pedM.color.setHex(d?0x0d0a0c:0xfbf4f8);peM.color.setHex(d?0x40303a:0xe0cdd7);rooms.forEach(r=>r.fm.color.setHex(d?0x17121a:0xffffff).lerp(r.col,d?.2:.4));parts.visible=!!(d&&mcDecorative&&mcQuality==="quality"&&!mcLowCost());scan.material.color.setHex(d?0xff9ccb:0xe5367f);mcWake()}
const mcRoomSets=[];
 // A single transform object updates the overview's instanced avatar meshes;
 // this preserves batching and avoids dozens of additional draw calls.
 let mcOverviewTransform=null;
 // Shared, fictional behavior engine. No telemetry or changes to employee records.
 const mcLifeEnabled=()=>mcLifeMotion&&!RM.matches&&!document.documentElement.classList.contains("mj-reduced");
 const mcLifePose=(actor,elapsed,moving=mcLifeEnabled())=>window.MC_OFFICE_LIFE
   ?window.MC_OFFICE_LIFE.pose(actor,elapsed,moving)
   :{x:actor.homeX,z:actor.homeZ,y:0,turn:0,activity:actor.activity,walking:false,coffee:actor.activity==="coffee",cupLift:.06,armSwing:0,legSwing:0};
 function mcAnimateOverviewPeople(el,motion=mcLifeEnabled()){
   if(!mcOverviewTransform)mcOverviewTransform=new THREE.Object3D();
   for(const entry of mcRoomSets){
     const set=entry.peopleInstances;
     if(!set||!entry.actors?.length)continue;
     for(let i=0;i<entry.actors.length;i++){
       const actor=entry.actors[i],v=mcLifePose(actor,el,motion);
       mcOverviewTransform.position.set(v.x,.45+v.y,v.z);
       mcOverviewTransform.rotation.set(0,v.turn,0);
       mcOverviewTransform.scale.set(1,1,1);mcOverviewTransform.updateMatrix();
       set.body.setMatrixAt(i,mcOverviewTransform.matrix);
       mcOverviewTransform.position.y=.79+v.y;mcOverviewTransform.updateMatrix();
       set.head.setMatrixAt(i,mcOverviewTransform.matrix);
       mcOverviewTransform.position.y=.84+v.y;mcOverviewTransform.updateMatrix();
       set.hair.setMatrixAt(i,mcOverviewTransform.matrix);
       if(set.shadows){
         mcOverviewTransform.position.set(v.x,.169,v.z);
         mcOverviewTransform.rotation.set(-Math.PI/2,0,0);mcOverviewTransform.updateMatrix();
         set.shadows.setMatrixAt(i,mcOverviewTransform.matrix);
       }
     }
     set.body.instanceMatrix.needsUpdate=true;
     set.head.instanceMatrix.needsUpdate=true;
     set.hair.instanceMatrix.needsUpdate=true;
     if(set.shadows)set.shadows.instanceMatrix.needsUpdate=true;
     if(set.cups){
       set.coffeeActors.forEach((actor,k)=>{
         const v=mcLifePose(actor,el,motion);
         mcOverviewTransform.position.set(v.x+.26,.55+v.cupLift,v.z+.10);
         mcOverviewTransform.rotation.set(0,v.turn,0);
         const scale=v.coffee?1:.0001;
         mcOverviewTransform.scale.set(scale,scale,scale);mcOverviewTransform.updateMatrix();
         set.cups.setMatrixAt(k,mcOverviewTransform.matrix);
       });
       set.cups.instanceMatrix.needsUpdate=true;
     }
   }
 }
 function mcAnimateFocusedPeople(el,motion=mcLifeEnabled()){
   if(!focus)return;
   for(const a of mcActors){
     if(a.room!==focus.idx)continue;
     const v=mcLifePose(a,el,motion);
     a.pf.position.set(v.x,v.y,v.z);a.pf.rotation.y=v.turn;
     a.arms.forEach((arm,j)=>{arm.rotation.x=v.armSwing*(j?-.8:1)});
     a.legs.forEach((leg,j)=>{leg.rotation.x=v.legSwing*(j?-1:1)});
     if(a.cup){a.cup.visible=v.coffee;a.cup.position.set(.26,.55+v.cupLift,.10)}
     a.glow.position.y=1.12+(motion?Math.sin(el*2+a.phase)*.035:0);
     a.glow.scale.setScalar(a.emp.i===mcSelectedPerson?1.65:1);
   }
 }
 function mcResetLifePose(){
   if(!ready)return;
   mcAnimateOverviewPeople(0,false);
   mcAnimateFocusedPeople(0,false);
   mcWake();
 }
 function mcApplyRoomLOD(){for(const entry of mcRoomSets){const detailed=!!focus&&focus.idx===entry.idx;entry.proxy.visible=!focus;entry.staff.forEach(x=>x.visible=detailed);entry.desks.forEach(x=>x.visible=detailed)}}
 let zm=1,rest=0,cw=1,ch=1,fa=0,fn=0,dpr=1,hub,dvd,cv,ren,scene,cam,glow,ray,nd,pv,parts,pa,scan,rooms=[],desks=[],spins=[],raf=0,ready=0,fail=0,isOpen=0,hov=null,focus=null,dn=null,moved=0,base=.75,skip=0,t0=0,last=0,cur=null;
const V={th:.75,ph:.95,r:46,tx:0,tz:0},Vt={ph:.95,r:21,tx:0,tz:0},clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* v3.9: sustained-performance adaptive quality; settings remain local to this trial. */
const MC_QUALITY_MODES=["auto","quality","balanced","lite"];
let mcQuality=MC_QUALITY_MODES.includes(store.get("officeQualityV39"))?store.get("officeQualityV39"):"auto";
let mcPerfDebug=false,mcDirectoryClosed=store.get("officeMapClosed")==="1",mcDecorative=store.get("officeDecorativeMotion")==="1",mcLifeMotion=store.get("officeLifeMotion")!=="0",mcLastActivity=performance.now();
let mcFrameSamples=0,mcFrameClock=0,mcDrawAverage=0,mcDrawCalls=0,mcTriangles=0,mcObservedFPS=0,mcLastQualityAdjust=0,mcLabelAt=0,mcActorAt=0,mcEmoteAt=0,mcParticleAt=0,mcSizeW=0,mcSizeH=0,mcSizeRatio=0;
const mcLowCost=()=>mcQuality==="lite"||(window.UX&&UX.lite());
const mcFrameLimit=()=>mcLowCost()?(TC?18:22):mcQuality==="quality"?(TC?40:50):mcQuality==="balanced"?(TC?25:34):(TC?28:38);
const mcOverviewLimit=()=>{
  if(mcLowCost())return TC?13:17;
  // Lower GPU upload and draw pressure when profiling indicates a slow device.
  if(mcDrawAverage>21)return 15;
  if(mcDrawAverage>14)return TC?17:20;
  if(mcQuality==="quality")return TC?22:31;
  return TC?18:29;
};
const mcDPRCap=()=>mcLowCost()?Math.min(devicePixelRatio||1,TC?.7:.8):mcQuality==="quality"?Math.min(devicePixelRatio||1,TC?1:1.4):mcQuality==="balanced"?Math.min(devicePixelRatio||1,TC?.8:1.05):Math.min(devicePixelRatio||1,TC?.82:1);
const mcDPRFloor=()=>mcLowCost()?.55:TC?.55:.65;
const mcQualityOptions=()=>MC_QUALITY_MODES.map(m=>`<option value="${m}" ${mcQuality===m?"selected":""}>${({auto:"Recommended (automatic)",quality:"Detailed",balanced:"Smooth",lite:"Lightweight"})[m]}</option>`).join("");
 function mcWake(){mcLastActivity=performance.now();if(isOpen&&ready&&!document.hidden&&!raf){last=mcLastActivity;lastR=0;raf=requestAnimationFrame(frame)}}
 function mcOfficeSettings(){if(!hub)return;mcCloseFloating();const dialog=document.createElement("div");dialog.id="mc-settings";dialog.className="mc-floating-backdrop mc-settings-backdrop";dialog.innerHTML=`<div class="mc-floating-dialog mc-settings-dialog" role="dialog" aria-modal="true" aria-labelledby="mc-settings-title"><div class="mc-dialog-head"><div><span class="mc-directory-eyebrow">Maddie Journey</span><h2 id="mc-settings-title">Office settings</h2></div><button type="button" data-hx="close-float" aria-label="Close settings">${ic("x")}</button></div><p class="mc-setting-intro">Choose how the office looks and moves. The suggested settings favor smooth navigation.</p><div class="mc-setting-row"><div><b>Visual detail</b><small>Automatic is recommended for most devices.</small></div><select data-perf-quality aria-label="Office visual detail">${mcQualityOptions()}</select></div><label class="mc-setting-row"><span><b>Illustrative activity</b><small>Fictional work, conversations, coffee breaks and meetings. Turn off to keep people still.</small></span><input type="checkbox" data-mc-life ${mcLifeMotion?"checked":""} aria-label="Animate fictional employee activities"></label><label class="mc-setting-row"><span><b>Decorative motion</b><small>Optional scene effects. Off uses less battery.</small></span><input type="checkbox" data-mc-decorative ${mcDecorative?"checked":""} aria-label="Enable decorative office motion"></label><div class="mc-setting-actions"><button data-hx="scene-theme" type="button">Switch appearance</button><button data-hx="settings-fullscreen" type="button">Full screen</button><button data-hx="settings-help" type="button">How to navigate</button><button data-hx="settings-lock" type="button">Lock</button></div><details class="mc-settings-technical"><summary>Technical details</summary><p>Optional performance information for troubleshooting.</p><output id="mc-settings-diagnostics">${mcPerfSummary()}</output></details><p class="mc-settings-note">Read-only monitoring. Settings are saved on this device.</p></div>`;hub.append(dialog);mcSyncQualityUI();dialog.querySelector("[data-hx=close-float]")?.focus()}
 function mcPerfSummary(){return ready?`${mcObservedFPS||"—"} frames/sec · ${mcDrawCalls} draw calls · ${mcTriangles.toLocaleString()} triangles · ${dpr.toFixed(2)}× resolution`:"Simplified office view · 3D engine unavailable"}

function mcSyncQualityUI(){
 if(!hub)return;
 hub.dataset.perfMode=mcLowCost()?"lite":mcQuality;
 hub.querySelectorAll("[data-perf-quality]").forEach(s=>{if(s.value!==mcQuality)s.value=mcQuality});
  const out=$("#mc-settings-diagnostics",hub);if(out)out.textContent=mcPerfSummary();
}
function mcSetQuality(mode){
 if(!MC_QUALITY_MODES.includes(mode))return;
 mcQuality=mode;store.set("officeQualityV39",mode);
 // Preserve the existing fallback semantics while avoiding a scene rebuild.
 if(mode==="lite")store.set("lite","1");
 else if(mode==="auto"){try{localStorage.removeItem("mc.lite")}catch(e){}}
 else store.set("lite","0");
 if(window.UX&&UX.syncQuality)UX.syncQuality();
 dpr=mcDPRCap();if(ready&&ren)size(true);
  if(parts)parts.visible=!!(mcDecorative&&mcQuality==="quality"&&!mcLowCost()&&isDark());
  mcWake();mcSyncQualityUI();
}
window.MC_PERF={get mode(){return mcQuality},setMode:mcSetQuality,
 snapshot:()=>({mode:mcQuality,illustrativeActivity:mcLifeMotion&&!RM.matches,fps:mcObservedFPS,drawCalls:mcDrawCalls,triangles:mcTriangles,renderMs:+mcDrawAverage.toFixed(2),pixelRatio:+dpr.toFixed(2),webgl:!!ready,rooms:rooms.length,employees:mcActors.length})};

// Use the existing saved dashboard theme setting, without rebuilding
// the 3D renderer or resetting its camera.
function syncOfficeThemeButtons(){
 if(!hub)return;
 const dark=isDark();
 hub.querySelectorAll('[data-hx="scene-theme"]').forEach(button=>{
  button.setAttribute("aria-pressed",String(dark));
  button.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
  button.title=dark?"Switch to light mode":"Switch to dark mode";
 });
}
new MutationObserver(syncOfficeThemeButtons).observe(document.documentElement,{
 attributes:true,attributeFilter:["data-theme"]
});
const go=(h,quiet)=>{if(location.hash==="#"+h){if(!quiet)route();return}if(quiet)skip=1;location.hash="#"+h};
const home=()=>clamp(9.5/(.3443*(hub.clientWidth/hub.clientHeight)),21,46),homeR=()=>home()*zm;
function mk(){
 hub=document.createElement("div");hub.id="hub";hub.setAttribute("role","region");hub.setAttribute("aria-label","Madhouse office, choose a division");
 hub.innerHTML=`<canvas id="hcv" role="img" aria-label="3D office with eight divisions. Use the buttons below to choose one."></canvas><div id="hxlab"></div><button type="button" class="hxbt mc-office-workspaces-btn" data-hx="workspaces" aria-label="Open Workspaces dashboard">${ic("grid")}<span>Workspaces</span></button><div class="hxh"><div><div class="hxt" role="heading" aria-level="1">Virtual office</div><p class="hxs">Select a division on the office map to explore.</p></div><div class="hxb"><button class="hxbt mc-live2" data-hx="sources" aria-label="Data status and sources"><i class="dot a" id="livedot2"></i><span id="livetxt2">Connecting…</span></button><button type="button" class="hxbt mc-office-theme-btn" data-hx="scene-theme" aria-label="Switch light or dark mode" aria-pressed="${isDark()}" title="Toggle appearance"><svg aria-hidden="true" class="i"><use href="#i-theme"></use></svg><span>Appearance</span></button></div></div><aside class="hxi" id="hxi" aria-live="polite"></aside><p class="hxk">Drag to look around. ${TC?"Pinch":"Scroll"} to zoom. ${TC?"Tap":"Click"} a room to enter it.</p><nav class="hxl" aria-label="Alternative division navigation"><button data-i="L" style="--c:#8fb4ff">Company <small>${M.n}</small></button>${D.map(([d,c],i)=>`<button data-i="${i}" style="--c:${HX[i]}">${d} <small>${c}</small></button>`).join("")}</nav>`;
 dvd=document.createElement("div");dvd.id="dvd";dvd.setAttribute("role","dialog");dvd.setAttribute("aria-modal","true");
 document.body.append(hub,dvd);cv=$("#hcv",hub);mdl=document.createElement("div");mdl.id="hxm";document.body.append(mdl);mdl.addEventListener("click",e=>{if(e.target===mdl||e.target.closest("[data-m]"))closeM()});
 hub.addEventListener("click",e=>{mcWake();const b=e.target.closest("button");if(!b)return;const a=b.dataset.hx;
  if(a==="theme"){window.mcTheme()}if(a==="fs"){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(_){}}
  if(a==="org"){dash("HQ");setTimeout(()=>{const o=$("#hxorg",dvd);o&&o.scrollIntoView({behavior:RM.matches?"auto":"smooth",block:"start"})},400)}else if(a==="lk"){$("#lock").click()}
  else if(b.dataset.i!=null){const i=b.dataset.i;mcPreview(i==="L"?"HQ":D[i][0])}});
 hub.addEventListener("change",e=>{if(e.target.id==="mc-date")mcSetDay(e.target.value);if(e.target.matches("[data-mc-decorative]")){mcDecorative=!!e.target.checked;store.set("officeDecorativeMotion",mcDecorative?"1":"0");if(parts)parts.visible=!!(mcDecorative&&mcQuality==="quality"&&!mcLowCost()&&isDark());mcWake()}});
 hub.addEventListener("input",e=>{if(e.target.id==="mc-search-input"){mcSearchTerm=e.target.value;mcSearchResults()}});
 hub.addEventListener("change",e=>{
   if(e.target.matches("[data-perf-quality]"))mcSetQuality(e.target.value);
   if(e.target.matches("[data-mc-life]")){
     mcLifeMotion=!!e.target.checked;store.set("officeLifeMotion",mcLifeMotion?"1":"0");
     if(!mcLifeMotion)mcResetLifePose();
     mcWake();mcSyncQualityUI();
   }
  });
 let mcLastPointerWake=0;
 hub.addEventListener("pointermove",()=>{
  if(mcRoom||raf)return;
  const now=performance.now();
  if(now-mcLastPointerWake<120)return;
  mcLastPointerWake=now;mcWake();
 },{passive:true});
 hub.addEventListener("pointerdown",mcWake,{passive:true});
 hub.addEventListener("wheel",mcWake,{passive:true});
 hub.addEventListener("click",e=>{if(e.target.classList.contains("mc-floating-backdrop"))mcCloseFloating()});
 hub.addEventListener("click",e=>{const b=e.target.closest("[data-hx]");if(!b)return;const a=b.dataset.hx;
 if(a==="workspaces"){H.close();document.body.classList.add("mcws");const h=location.hash.slice(1);if(!h||h==="office"||h.startsWith("division/"))location.hash="#overview";else if(window.MC_APP)MC_APP.route();return}
 if(a==="sources"){if(window.MC_BOOT)MC_BOOT.sources(b);return}
 if(a==="leave")mcCloseFocus();else if(a==="metrics")dash(mcRoom||"HQ");else if(a==="scene-theme"){window.mcTheme();syncOfficeThemeButtons()}
 else if(a==="today")mcSetDay(mcDate(mcBase));
 else if(a==="prev")mcNavigate(-1);else if(a==="next")mcNavigate(1);
 else if(a==="jump")mcPreview(b.dataset.div);
 else if(a==="reset")mcFocusCamera("iso");
 else if(a==="preset")mcFocusCamera(b.dataset.view);
 else if(a==="search")mcOpenSearch();else if(a==="help")mcOpenGuide();
 else if(a==="office-settings")mcOfficeSettings();
 else if(a==="toggle-directory"){mcDirectoryClosed=!mcDirectoryClosed;store.set("officeMapClosed",mcDirectoryClosed?"1":"0");mcBuildDirectory()}
 else if(a==="toggle-room-map"){mcRoomMapOpen=!mcRoomMapOpen;const map=$(".mc-room-map",hub);map?.classList.toggle("is-open",mcRoomMapOpen);b.setAttribute("aria-expanded",String(mcRoomMapOpen))}
 else if(a==="toggle-views"){mcViewsOpen=!mcViewsOpen;$(".mc-scene-controls",hub)?.classList.toggle("is-open",mcViewsOpen);b.setAttribute("aria-expanded",String(mcViewsOpen))}
 else if(a==="settings-help"){mcCloseFloating();mcOpenGuide()}
 else if(a==="settings-fullscreen"){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(_){}}
 else if(a==="settings-lock"){document.getElementById("lock")?.click()}
 else if(a==="close-float")mcCloseFloating();
 else if(a==="collapse"){mcPanelCollapsed=!mcPanelCollapsed;mcPaintPanel()}
 else if(a==="layer"){
  mcLayer=b.dataset.layer;
  const view=$("#mc-layer-view",hub);
  if(view&&mcRoom){view.innerHTML=mcLayerContent(mcRoom);$$('[data-hx="layer"]',hub).forEach(t=>t.setAttribute("aria-pressed",String(t.dataset.layer===mcLayer)))}
  else mcPaintPanel()
 }
 else if(a==="profile"){const e=EMP.find(e=>e.i===+b.dataset.emp);if(e)pfm(e,b)}
 else if(a==="find-item"){const value=b.dataset.value,kind=b.dataset.kind;mcCloseFloating();if(kind==="person"){mcSelectPerson(+value);if(!mcRoom){mcPreview(EMP[+value].dept);mcSelectPerson(+value)}}else mcPreview(value)}
 else if(a==="prevday"||a==="nextday")mcSetDay(mcAdd(new Date(mcSelectedDay+"T12:00:00"),a==="prevday"?-1:1));
 else if(a==="person")mcSelectPerson(+b.dataset.emp)});
 hub.addEventListener("pointerover",e=>{const b=e.target.closest&&e.target.closest(".hxl button");if(b)setHov(rooms.find(r=>r.idx==b.dataset.i))});
 hub.addEventListener("pointerout",e=>{if(e.target.closest&&e.target.closest(".hxl button"))setHov(null)});
 dvd.addEventListener("click",e=>{const b=e.target.closest("[data-d]");if(!b)return;const a=b.dataset.d;
  if(a==="theme")window.mcTheme();else if(a==="back")back();
  else if(a==="step"){const N=["HQ",...D.map(x=>x[0])],j=(N.indexOf(cur)+ +b.dataset.s+N.length)%N.length;back();mcPreview(N[j])}
  else if(a==="open"){const i=+b.dataset.n;back();mcPreview(D[i][0])}else if(a==="emp"){pfm(EMP[+b.dataset.e],b)}});
}
function build(){
 if(typeof THREE==="undefined"){fail=1;return 0}
 if(!hub)mk();
 try{ren=new THREE.WebGLRenderer({canvas:cv,antialias:!TC&&mcQuality==="quality"&&(devicePixelRatio||1)<2,powerPreference:TC?"low-power":"high-performance"})}catch(e){fail=1;return 0}
 cv.addEventListener("webglcontextlost",e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;hub.classList.add("hxnogl")});cv.addEventListener("webglcontextrestored",()=>{hub.classList.remove("hxnogl");last=performance.now();if(isOpen&&!raf)raf=requestAnimationFrame(frame)});
 dpr=mcDPRCap();ren.setPixelRatio(dpr);
 scene=new THREE.Scene();scene.background=new THREE.Color(0x070b16);scene.fog=new THREE.FogExp2(0x070b16,.016);
 cam=new THREE.PerspectiveCamera(38,1,.1,200);ray=new THREE.Raycaster();nd=new THREE.Vector2();pv=new THREE.Vector3();
 hemi=new THREE.HemisphereLight(0x9db8ff,0x10162a,.95);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xffffff,.65);sun.position.set(8,14,6);sunL=sun;scene.add(sun);
 glow=new THREE.PointLight(0xffffff,0,14,1.5);scene.add(glow);
 const gr=new THREE.GridHelper(80,40,0x2c2229,0x16111a);gr.position.y=-.45;grd=gr;scene.add(gr);
 const ped=new THREE.Mesh(new THREE.BoxGeometry(18.4,.2,18.4),new THREE.MeshLambertMaterial({color:0x0c1326}));ped.position.y=-.3;pedM=ped.material;scene.add(ped);
 const pe=new THREE.LineSegments(new THREE.EdgesGeometry(ped.geometry),new THREE.LineBasicMaterial({color:0x2b3d6b}));pe.position.copy(ped.position);peM=pe.material;scene.add(pe);
 scan=new THREE.Mesh(new THREE.RingGeometry(1,1.05,96),new THREE.MeshBasicMaterial({color:0x8fb4ff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));scan.rotation.x=-Math.PI/2;scan.position.y=-.18;scene.add(scan);
 const GD={d:new THREE.BoxGeometry(.72,.14,.46),m:new THREE.BoxGeometry(.36,.26,.04),b:new THREE.CylinderGeometry(.13,.17,.46,8),h:new THREE.SphereGeometry(.15,10,8),r:new THREE.SphereGeometry(.16,10,5,0,Math.PI*2,0,Math.PI/2),
   unit:new THREE.BoxGeometry(1,1,1),plantStem:new THREE.CylinderGeometry(.055,.07,.37,7),plantPot:new THREE.CylinderGeometry(.18,.15,.22,8),plantLeaf:new THREE.SphereGeometry(.19,7,6),
   screen:new THREE.BoxGeometry(.29,.19,.016),deskLeg:new THREE.CylinderGeometry(.045,.045,.34,6),body:new THREE.CylinderGeometry(.17,.205,.40,8),head:new THREE.SphereGeometry(.155,10,8),
   eye:new THREE.SphereGeometry(.016,5,4),mouth:new THREE.BoxGeometry(.065,.013,.012),arm:new THREE.CylinderGeometry(.045,.05,.31,6),foot:new THREE.CylinderGeometry(.055,.07,.28,6),glow:new THREE.SphereGeometry(.07,8,6)},MC={},MT=o=>{const k=JSON.stringify(o);return MC[k]||(MC[k]=new THREE.MeshLambertMaterial(o))};
 GD.cup=new THREE.CylinderGeometry(.065,.052,.11,8);
 GD.actorShadow=new THREE.CircleGeometry(.23,16);
 ORDER.forEach((o,n)=>{
  const L=o==="L",d=L?"":D[o][0],hex=L?LOB:HX[o],col=new THREE.Color(hex),g=new THREE.Group(),x=(n%3-1)*5.7,z=(Math.floor(n/3)-1)*5.7;
  g.position.set(x,-8,z);const mbm=new THREE.MeshBasicMaterial({color:col});
  const fm=new THREE.MeshLambertMaterial({color:new THREE.Color(0x121a30).lerp(col,.18),emissive:col,emissiveIntensity:.06}),fl=new THREE.Mesh(new THREE.BoxGeometry(5,.3,5),fm);g.add(fl);
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(fl.geometry),new THREE.LineBasicMaterial({color:col})));
  const wm=new THREE.MeshLambertMaterial({color:col,transparent:true,opacity:.26,emissive:col,emissiveIntensity:.3}),w1=new THREE.Mesh(new THREE.BoxGeometry(5,1.1,.1),wm),w2=new THREE.Mesh(new THREE.BoxGeometry(.1,1.1,5),wm);
  w1.position.set(0,.7,-2.45);w2.position.set(-2.45,.7,0);g.add(w1,w2);
  
   // Architectural details: warm floor, diffuse window bays, work islands, room signage, greenery.
   const wood=MT({color:0xd2bdad}),metal=MT({color:0x71737c}),white=MT({color:0xf8f3ed}),glass=MT({color:0x8fbacb,transparent:true,opacity:.36}),leaf=MT({color:0x4f9478}),pot=MT({color:0xe4c5b4});
   const staticBatches=new Map();
   const addStatic=(key,geometry,material,position,scale=[1,1,1])=>{const id=key+":"+material.id;let b=staticBatches.get(id);if(!b){b={geometry,material,instances:[]};staticBatches.set(id,b)}b.instances.push([position,scale])};
   const piece=(p,s,m,keep=false)=>{if(!keep){addStatic("box",GD.unit,m,p,s);return null}const mesh=new THREE.Mesh(GD.unit,m);mesh.position.set(...p);mesh.scale.set(...s);g.add(mesh);return mesh};
   piece([0,-.09,0],[4.82,.06,4.82],wood); // inset parquet floor
   for(let f=-2;f<=2;f++)piece([0,-.054,f*.91],[4.8,.008,.018],metal);
   // Low glass walls keep third-person visibility unobstructed.
   piece([0,.74,-2.44],[4.8,1.45,.07],glass);
   piece([-2.44,.74,0],[.07,1.45,4.8],glass);
   for(let xx=-1.8;xx<=1.8;xx+=1.8)piece([xx,.75,-2.37],[.06,1.4,.06],metal);
   piece([0,1.47,-2.4],[4.84,.08,.10],metal);
   const lamp=piece([0,1.95,0],[1.48,.055,.14],white,true);lamp.material.emissive&&lamp.material.emissive.setHex(0x5b5455);
   const plant=(a,b)=>{addStatic("plant-stem",GD.plantStem,MT({color:0x6b5142}),[a,.19,b]);addStatic("plant-pot",GD.plantPot,pot,[a,.11,b]);for(let j=0;j<4;j++)addStatic("plant-leaf",GD.plantLeaf,leaf,[a+Math.sin(j*2.1)*.14,.49+Math.cos(j*1.9)*.10,b+Math.cos(j*2.1)*.13],[.7,1.3,.65])};
   plant(2.02,-1.95);plant(-2.05,1.95);
   const furnish=(extra={})=>{if(typeof window.MC_OFFICE_FURNISH==="function")
      window.MC_OFFICE_FURNISH({THREE,GD,MT,addStatic,piece,plant,division:L?"Headquarters":d,isLobby:L,isLite:mcLowCost(),...extra})};
   if(!L){piece([1.1,.26,2.04],[1.24,.52,.32],metal);piece([1.1,.55,2.04],[1.14,.045,.30],white)}
   if(L){furnish();const ic=new THREE.Mesh(new THREE.IcosahedronGeometry(.95,1),new THREE.MeshBasicMaterial({color:col,wireframe:true}));ic.position.y=1.7;g.add(ic);spins.push(ic);
   [1.7,2.3].forEach((r,k)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(r,.035,8,72),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.7-k*.3}));t.rotation.x=Math.PI/2;t.position.y=.3+k*.35;g.add(t);spins.push(t)})}
  else{const l=EMP.filter(e=>e.dept===d),rw=Math.ceil(l.length/3),roomActors=[],roomDesks=[];
   l.forEach((e,k)=>{const c=k%3,r=Math.floor(k/3),dm=MT({color:e.head?0xffffff:!e.hasId?0xff5a5f:col.clone().lerp(new THREE.Color(0xffffff),.4),emissive:e.head?0x444444:0}),
    ds=new THREE.Mesh(GD.d,dm),mo=new THREE.Mesh(GD.m,mbm);
    mo.position.set(0,.20,-.13);ds.add(mo);const scr=new THREE.Mesh(GD.screen,MT({color:0x2e4f6c,emissive:0x203d5a,emissiveIntensity:.5}));scr.position.set(0,.19,-.10);ds.add(scr);
     const leg=new THREE.Mesh(GD.deskLeg,MT({color:0x88838c}));leg.position.y=-.2;ds.add(leg);
     ds.position.set(-1.55+c*.85,.46,-1.10+r*.77);ds.scale.setScalar(.001);ds.userData.dl=n*.09+.9+k*.05;g.add(ds);desks.push(ds);roomDesks.push(ds);
     const pf=new THREE.Group(),shirt=MT({color:[0xf6a6c1,0x9ad7a8,0xf3b27a,0x9fc3ff,0xcdb8ff][(e.i*7)%5],emissive:0x000000}),skin=MT({color:0xf0c9a8}),hair=MT({color:e.head?0x4d3b43:0x222a39}),shadow=MT({color:0x4e4c59});
     const bd=new THREE.Mesh(GD.body,shirt),hd=new THREE.Mesh(GD.head,skin),hr=new THREE.Mesh(GD.r,hair);
     bd.position.y=.45;hd.position.y=.79;hr.position.y=.84;pf.add(bd,hd,hr);
     const eyes=MT({color:0x27232b});for(let q of [-.06,.06]){const eye=new THREE.Mesh(GD.eye,eyes);eye.position.set(q,.805,.146);pf.add(eye)}
     const mouth=new THREE.Mesh(GD.mouth,eyes);mouth.position.set(0,.742,.15);pf.add(mouth);
     const arms=[],legs=[];for(const a of [-1,1]){const arm=new THREE.Mesh(GD.arm,shirt);arm.position.set(a*.20,.43,.025);arm.rotation.z=a*.18;pf.add(arm);arms.push(arm);
       const foot=new THREE.Mesh(GD.foot,shadow);foot.position.set(a*.105,.12,.005);pf.add(foot);legs.push(foot)}
     const activity=l.length===2?"chat":k===1?"walk":k===2?"coffee":k===3||k===4?"chat":k===5?"meeting":"work";
     let px=ds.position.x+.25,pz=ds.position.z+.47;
     if(l.length===2){px=k===0?.55:1.56;pz=k===0?.88:.62}
     else if(l.length>=3&&k===2){px=1.82;pz=1.38}
     else if(l.length>=5&&k===1){px=.91;pz=.17}
     else if(l.length>=5&&(k===3||k===4)){px=k===3?1.12:1.76;pz=-.13}
     else if(l.length>=6&&k===5){px=1.18;pz=.78}
     else if(l.length===3&&k===1){px=1.10;pz=.86}
     pf.position.set(px,0,pz);pf.userData.empId=e.i+1;pf.userData.activity=activity;g.add(pf);
     const cup=activity==="coffee"?new THREE.Mesh(GD.cup,MT({color:0xfffaf1})):null;
     if(cup){cup.position.set(.26,.55,.10);pf.add(cup)}
     const m=mcMood(mcTask(e));const glowDot=new THREE.Mesh(GD.glow,new THREE.MeshBasicMaterial({color:m.color}));glowDot.position.set(0,1.12,0);pf.add(glowDot);
     mcActors.push({emp:e,task:mcTask(e),pf,body:bd,glow:glowDot,mood:m,arms,legs,activity,cup,homeX:px,homeZ:pz,deskX:ds.position.x+.25,deskZ:ds.position.z+.47,phase:e.i*.81,room:o,avatarIndex:k});roomActors.push(pf)});
   furnish({desks:roomDesks});
   const proxy=new THREE.Group(),obj=new THREE.Object3D();
   const pDesk=new THREE.InstancedMesh(GD.d,MT({color:0xd8c8c1}),l.length),pBody=new THREE.InstancedMesh(GD.body,MT({color:0xffffff}),l.length),pHead=new THREE.InstancedMesh(GD.head,MT({color:0xf0c9a8}),l.length),pHair=new THREE.InstancedMesh(GD.r,MT({color:0x3b303a}),l.length);
   const pMonitor=new THREE.InstancedMesh(GD.unit,MT({color:0x3e7194}),l.length),pChair=new THREE.InstancedMesh(GD.unit,MT({color:0x92b7d2}),l.length);
    const pShadow=new THREE.InstancedMesh(GD.actorShadow,MT({color:0x244969,transparent:true,opacity:.17,side:THREE.DoubleSide,depthWrite:false}),l.length);
    const coffeeActors=mcActors.slice(-roomActors.length).filter(a=>a.activity==="coffee"),pCup=coffeeActors.length?new THREE.InstancedMesh(GD.cup,MT({color:0xfffaf1}),coffeeActors.length):null;
    const shirtColors=[0xf6a6c1,0x9ad7a8,0xf3b27a,0x9fc3ff,0xcdb8ff];
   l.forEach((e,k)=>{const desk=roomDesks[k],person=roomActors[k];obj.position.copy(desk.position);obj.scale.set(1,1,1);obj.updateMatrix();pDesk.setMatrixAt(k,obj.matrix);
    obj.position.set(person.position.x,.169,person.position.z);obj.rotation.set(-Math.PI/2,0,0);obj.updateMatrix();pShadow.setMatrixAt(k,obj.matrix);
     obj.rotation.set(0,0,0);obj.position.set(desk.position.x,.65,desk.position.z-.12);obj.scale.set(.32,.21,.035);obj.updateMatrix();pMonitor.setMatrixAt(k,obj.matrix);
    obj.position.set(desk.position.x+.25,.43,desk.position.z+.65);obj.scale.set(.37,.41,.08);obj.updateMatrix();pChair.setMatrixAt(k,obj.matrix);
    obj.scale.set(1,1,1);obj.position.set(person.position.x,.45,person.position.z);obj.updateMatrix();pBody.setMatrixAt(k,obj.matrix);pBody.setColorAt(k,new THREE.Color(shirtColors[(e.i*7)%5]));
    obj.position.y=.79;obj.updateMatrix();pHead.setMatrixAt(k,obj.matrix);
    obj.position.y=.84;obj.updateMatrix();pHair.setMatrixAt(k,obj.matrix)});
   if(pCup)coffeeActors.forEach((a,k)=>{obj.position.set(a.homeX+.26,.58,a.homeZ+.10);obj.rotation.set(0,0,0);obj.scale.set(1,1,1);obj.updateMatrix();pCup.setMatrixAt(k,obj.matrix)});
   [pDesk,pMonitor,pChair,pShadow,pBody,pHead,pHair,pCup].filter(Boolean).forEach(m=>{m.instanceMatrix.needsUpdate=true;m.frustumCulled=false;proxy.add(m)});
   g.add(proxy);mcRoomSets.push({idx:o,proxy,staff:roomActors,desks:roomDesks,
    actors:mcActors.slice(-roomActors.length),
    peopleInstances:{body:pBody,head:pHead,hair:pHair,shadows:pShadow,cups:pCup,coffeeActors}});roomActors.forEach(a=>a.visible=false);roomDesks.forEach(a=>a.visible=false)}
  // Static architecture is batched per room. Staff and desks remain individually selectable.
  const temp=new THREE.Object3D();
  staticBatches.forEach(batch=>{
   const mesh=new THREE.InstancedMesh(batch.geometry,batch.material,batch.instances.length);
   batch.instances.forEach(([pos,scale],index)=>{temp.position.set(...pos);temp.rotation.set(0,0,0);temp.scale.set(...scale);temp.updateMatrix();mesh.setMatrixAt(index,temp.matrix)});
   mesh.instanceMatrix.needsUpdate=true;mesh.frustumCulled=false;g.add(mesh);
  });
  const s=L?null:deptStat(d),lab=document.createElement("div");lab.className="hxn";lab.style.setProperty("--c",hex);
  lab.innerHTML=L?`<b>Lobby</b><span>Company overview</span><em>${M.n} people, all divisions</em>`:`<b>${d}</b><span>${s.n} people</span><em>${dvNames(d)}. ${s.a}% 201 files, ${s.l} lates</em>`;
  $("#hxlab",hub).append(lab);
  const r={grp:g,floor:fl,fm,col,x,z,idx:o,lab,h:0,n};g.userData.room=r;rooms.push(r);scene.add(g)});
 mcApplyRoomLOD();
 const N=TC?0:0;pa=new Float32Array(N*3);for(let i=0;i<N;i++){pa[i*3]=(Math.random()-.5)*36;pa[i*3+1]=Math.random()*10;pa[i*3+2]=(Math.random()-.5)*36}
 const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pa,3));
 parts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x8fb4ff,size:.08,transparent:true,opacity:.5,depthWrite:false}));parts.visible=false;scene.add(parts);
 const atActor=e=>{if(!focus)return null;const b=cv.getBoundingClientRect();nd.set((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(nd,cam);const actors=mcActors.filter(a=>a.room===focus.idx);const hits=ray.intersectObjects(actors.map(a=>a.pf),true);for(const h of hits){let x=h.object;while(x&&!x.userData.empId)x=x.parent;if(x&&x.userData.empId)return actors.find(a=>a.emp.i===x.userData.empId-1)||null}return null};
 const at=e=>{const b=cv.getBoundingClientRect();nd.set((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(nd,cam);const it=ray.intersectObjects(rooms.map(x=>x.floor),false)[0];let o=it&&it.object;while(o&&!o.userData.room)o=o.parent;return o?o.userData.room:null};
 const pts=new Map();let pd=0,hoverPickAt=0;
 cv.addEventListener("pointerdown",e=>{if(window.UX&&UX.lite()){dn={x:e.clientX,y:e.clientY,lite:true};return}pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size>1){dn=null;const[a,b]=[...pts.values()];pd=Math.hypot(a[0]-b[0],a[1]-b[1]);return}dn={x:e.clientX,y:e.clientY,th:base,ph:Vt.ph};moved=0;try{cv.setPointerCapture(e.pointerId)}catch(_){}});
 cv.addEventListener("pointermove",e=>{if(window.UX&&UX.lite())return;if(pts.has(e.pointerId))pts.set(e.pointerId,[e.clientX,e.clientY]);
  if(pts.size>1){const[a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pd){if(focus)Vt.r=clamp(Vt.r*pd/d,4.6,18);else{zm=clamp(zm*pd/d,.65,1.35);Vt.r=homeR()}}pd=d;moved=1;return}
  if(dn){const dx=e.clientX-dn.x,dy=e.clientY-dn.y;if(Math.hypot(dx,dy)>6)moved=1;if(moved){if(e.shiftKey&&focus){Vt.tx=clamp(focus.x-dx*.015,focus.x-1.8,focus.x+1.8);Vt.tz=clamp(focus.z+dy*.015,focus.z-1.8,focus.z+1.8)}else{base=dn.th-dx*.006;Vt.ph=clamp(dn.ph-dy*.004,focus ? .18 : .55,focus ? 1.38 : 1.25)}mcViewPreset="custom"}}else if(e.pointerType==="mouse"&&performance.now()-hoverPickAt>80){hoverPickAt=performance.now();cv.classList.toggle("hxpt",!!(atActor(e)||at(e)))}});
 const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pd=0};
 cv.addEventListener("pointerup",e=>{if(window.UX&&UX.lite()){const a=dn;dn=null;if(a&&Math.hypot(a.x-e.clientX,a.y-e.clientY)<9){const r=at(e);if(r)mcPreview(r.idx==="L"?"HQ":D[r.idx][0])}return}const was=dn&&!moved&&pts.size<=1;up(e);dn=null;if(was){const actor=atActor(e);if(actor){mcSelectPerson(actor.emp.i);return}if(!focus){const r=at(e);if(r)mcPreview(r.idx==="L"?"HQ":D[r.idx][0])}}});
 cv.addEventListener("pointercancel",e=>{up(e);dn=null});
 cv.addEventListener("pointerleave",()=>{if(!dn)setHov(null)});
 cv.addEventListener("wheel",e=>{e.preventDefault();if(window.UX&&UX.lite())return;if(focus)Vt.r=clamp(Vt.r*(1+e.deltaY*.0012),4.6,18);else{zm=clamp(zm*(1+e.deltaY*.0012),.65,1.35);Vt.r=homeR()}},{passive:false});
 // Coalesce resize work while the browser viewport changes.
 let sizeQueued=false;
 new ResizeObserver(()=>{
  if(sizeQueued)return;
  sizeQueued=true;
  requestAnimationFrame(()=>{sizeQueued=false;if(isOpen&&hub.isConnected)size()});
 }).observe(hub);
 ready=1;skin();mcRefreshRoomLabels();return 1}
function size(force=false){
 if(!ready||!ren||!hub)return;
 const w=Math.round(hub.clientWidth),h=Math.round(hub.clientHeight);if(!w||!h)return;
 const ratio=dpr;
 if(!force&&w===mcSizeW&&h===mcSizeH&&Math.abs(ratio-mcSizeRatio)<.001)return;
 mcSizeW=w;mcSizeH=h;mcSizeRatio=ratio;cw=w;ch=h;
 ren.setPixelRatio(ratio);ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();mcWake();
 if(!focus)Vt.r=homeR();
}
function setHov(r){if(r===hov)return;hov=r;mcWake();cv.classList.toggle("hxpt",!!r);rooms.forEach(x=>x.lab.classList.toggle("on",x===r));$$(".hxl button",hub).forEach(b=>b.classList.toggle("on",!!r&&b.dataset.i==r.idx));const pn=$("#hxi",hub);if(!r){pn.classList.remove("on");return}const d=r.idx==="L"?"HQ":D[r.idx][0];pn.innerHTML=`<b>${mcSafe(mcMapName[d]||d)}</b><small>${mcPeople(d).length} people · Select to enter</small>`;pn.classList.add("on")}
function aim(i){const r=rooms.find(x=>x.idx===i);if(r){Vt.tx=r.x;Vt.tz=r.z}}
function enter(r){if(!r)return;mcPreview(r.idx==="L"?"HQ":D[r.idx][0])}
function back(){dvd.classList.remove("on");mcCloseFocus()}
function frame(now){
  raf=0;
  if(rest||!isOpen||document.hidden){last=now;return}
  // Keep the overview alive so employees move even without a selected division.
  // Do not render the locked demo behind the passcode, or when reduced motion
  // is requested and the user has stopped interacting with the scene.
  if(document.body.classList.contains("mc-demo-locked"))return;
  if(!focus&&!mcLifeEnabled()&&!dn&&!mcDecorative&&now-mcLastActivity>2800&&now-t0*1000>4400)return;
  raf=requestAnimationFrame(frame);
 const gap=now-lastR,targetGap=1000/(focus?mcFrameLimit():Math.min(mcFrameLimit(),mcOverviewLimit()));
 if(gap<targetGap)return;
 lastR=now;
 const dt=Math.min(.05,(now-last)/1000||.016),el=now/1000-t0;last=now;
 mcFrameSamples++;if(!mcFrameClock)mcFrameClock=now;
 const k=1-Math.pow(.02,dt);
  V.th+=(base-V.th)*k;V.ph+=(Vt.ph-V.ph)*k;V.r+=(Vt.r-V.r)*k;V.tx+=(Vt.tx-V.tx)*k;V.tz+=(Vt.tz-V.tz)*k;
 cam.position.set(V.tx+V.r*Math.sin(V.ph)*Math.sin(V.th),V.r*Math.cos(V.ph),V.tz+V.r*Math.sin(V.ph)*Math.cos(V.th));cam.lookAt(V.tx,0,V.tz);
 const W=cw,Hh=ch,updateLabels=now-mcLabelAt>(focus?160:110);
 if(updateLabels)mcLabelAt=now;
 rooms.forEach(r=>{
  r.grp.visible=!focus||r===focus;
  const p=clamp((el-.2-r.n*.09)/1.1,0,1),e=1-Math.pow(1-p,3);r.h+=((r===hov||r===focus?1:0)-r.h)*Math.min(1,dt*9);
  r.grp.position.y=-8*(1-e)+r.h*.55;r.fm.emissiveIntensity=.06+.4*r.h;
  if(updateLabels&&!focus){pv.set(r.x,2.2+r.h*.5,r.z).project(cam);const l=r.lab;l.style.opacity=pv.z>1?0:e;l.style.transform=`translate(${(pv.x*.5+.5)*W}px,${(-pv.y*.5+.5)*Hh}px) translate(-50%,-100%)`}
 });
 if(el<4)desks.forEach(d=>{const p=clamp((el-d.userData.dl)/.5,0,1);d.scale.setScalar(Math.max(.001,1-Math.pow(1-p,3)))});
  const animatePeople=mcLifeEnabled()&&
    now-mcActorAt>(focus?mcLowCost()?110:mcQuality==="balanced"?54:22:mcLowCost()?125:TC?90:50);
 if(!focus&&animatePeople){
   mcActorAt=now;
   mcAnimateOverviewPeople(el);
 }
 if(focus&&animatePeople){mcActorAt=now;mcAnimateFocusedPeople(el)}
 if(mcDecorative&&!mcLowCost()&&!RM.matches&&!focus){spins.forEach((s,i)=>{if(s.geometry.type==="IcosahedronGeometry"){s.rotation.y=el*.6;s.position.y=1.7+Math.sin(el*1.4)*.14}else s.rotation.z=el*(.25+i*.1)*(i%2?-1:1)});const sc=(el%6)/6;scan.scale.setScalar(2+sc*16);scan.material.opacity=el<1.6?0:.28*(1-sc)}else scan.material.opacity=0;
  if(mcRoom&&focus&&now-mcEmoteAt>85){mcEmoteAt=now;const b=$("#mc-emotes",hub);if(b){$$('.mc-emote',b).forEach(el=>{const a=mcActors.find(x=>x.emp.i===+el.dataset.actor);if(!a)return;a.pf.getWorldPosition(pv);pv.y+=1.23;pv.project(cam);let xx=(pv.x*.5+.5)*cw,yy=(-pv.y*.5+.5)*ch;el.style.transform=`translate(${xx.toFixed(1)}px,${yy.toFixed(1)}px) translate(-50%,-100%)`;el.style.opacity=pv.z>1||xx<5||xx>cw-5||yy<135||yy>ch*(cw<730?.52:.94)?"0":"1"})}}
 if(hov){glow.color.copy(hov.col);glow.position.set(hov.x,3.4,hov.z)}glow.intensity+=((hov?2.6:0)-glow.intensity)*Math.min(1,dt*8);
 if(mcDecorative&&!RM.matches&&!mcLowCost()&&mcQuality==="quality"&&pa.length&&now-mcParticleAt>90){mcParticleAt=now;for(let i=1;i<pa.length;i+=3){pa[i]+=dt*.25;if(pa[i]>10)pa[i]=0}parts.geometry.attributes.position.needsUpdate=true}
const renderStart=performance.now();
 ren.render(scene,cam);
 const drawCost=performance.now()-renderStart;
 mcDrawAverage=mcDrawAverage?mcDrawAverage*.9+drawCost*.1:drawCost;
 if(now-mcFrameClock>=1300){
  mcObservedFPS=Math.round(mcFrameSamples*1000/(now-mcFrameClock));mcFrameSamples=0;mcFrameClock=now;
  mcDrawCalls=ren.info.render.calls;mcTriangles=ren.info.render.triangles;
  if(mcQuality==="auto"&&now-mcLastQualityAdjust>4200){
    const max=mcDPRCap(),floor=mcDPRFloor();
    if((mcDrawAverage>14||(mcObservedFPS<mcOverviewLimit()*.7&&!focus))&&dpr>floor+.02){dpr=Math.max(floor,dpr-.12);mcLastQualityAdjust=now;size(true)}
    else if(mcDrawAverage<6&&mcObservedFPS>=(focus?mcFrameLimit():mcOverviewLimit())*.84&&dpr<max-.02){dpr=Math.min(max,dpr+.1);mcLastQualityAdjust=now;size(true)}
  }
  if($("#mc-settings-diagnostics",hub))mcSyncQualityUI();
 }
}
/* ---------- division dashboards ---------- */
const ring=p=>`<svg class="hxr" viewBox="0 0 42 42" style="--p:${p}"><circle class="a" cx="21" cy="21" r="16"/><circle class="b" pathLength="100" cx="21" cy="21" r="16"/></svg>`;
function trend(a){const mx=Math.max(...a),mn=Math.min(...a),r=mx-mn||1,P=a.map((v,i)=>[10+i*280/(a.length-1),70-(v-mn)/r*54]),ln=P.map(p=>p.map(n=>n.toFixed(1)).join(",")).join(" ");
 return`<svg class="hxtr" viewBox="0 0 300 96" role="img" aria-label="Seven month trend, ${a.join(", ")}"><defs><linearGradient id="hxg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--c)" stop-opacity=".45"/><stop offset="1" stop-color="var(--c)" stop-opacity="0"/></linearGradient></defs><polygon points="10,88 ${ln} 290,88" fill="url(#hxg)"/><polyline pathLength="1" points="${ln}"/>${P.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3"/>`).join("")}</svg><div class="hxxl">${MON.map(m=>`<span>${m}</span>`).join("")}</div>`}
function cnt(root){$$("[data-to]",root).forEach(el=>{const to=+el.dataset.to,dp=(el.dataset.to.split(".")[1]||"").length;if(RM.matches){el.textContent=to.toFixed(dp);return}const s=performance.now();const f=t=>{const p=clamp((t-s-300)/1100,0,1);el.textContent=(to*(1-Math.pow(1-p,4))).toFixed(dp);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
const lvl=e=>e.head?1:Math.max(2,e.lvl||3);
function lv(d){const L=[[],[],[]];EMP.filter(e=>e.dept===d).forEach(e=>L[lvl(e)-1].push(e));return L.map((a,i)=>{const g={};a.forEach(e=>(g[e.role]=g[e.role]||[]).push(e));return{n:i+1,c:a.length,g:Object.entries(g)}}).filter(x=>x.c)}
const chip=(e,sub)=>`<button class="hxch" data-d="emp" data-e="${e.i}">${av(e.name,24)}<span>${e.name}${sub?`<small>${sub}</small>`:""}</span></button>`;
const pcard=(e,sub)=>`<button class="pc" data-d="emp" data-e="${e.i}" aria-label="${e.name}, ${sub||e.role}">${av(e.name,42)}<span class="pt"><b>${e.name}</b><small>${sub||e.role}</small></span></button>`;
const posNode=(t,a,n)=>`<li><div class="pos"><span class="pl">L${n}</span><b>${t}</b><em>${a.length}</em></div><ul class="stk">${a.map(e=>`<li>${pcard(e,t)}</li>`).join("")}</ul></li>`;
function divChart(d){const i=D.findIndex(x=>x[0]===d),hs=EMP.filter(e=>e.dept===d&&e.head),kids=lv(d).filter(x=>x.n>1).flatMap(x=>x.g.map(([t,a])=>posNode(t,a,x.n)));
 return`<div class="hxoc"><div class="ot" style="--c:${HX[i]}" role="group" aria-label="${d} organization chart"><ul class="tree"><li><div class="rowc">${hs.map(e=>pcard(e)).join("")}</div>${kids.length?`<ul>${kids.join("")}</ul>`:""}</li></ul></div></div>`}
function hqChart(){const kids=D.map(([dn,c],i)=>{const hs=EMP.filter(e=>e.dept===dn&&e.head),L=lv(dn).filter(x=>x.n>1).flatMap(x=>x.g.map(([t,a])=>[t,a.length]));
 return`<li style="--c:${HX[i]}"><button class="dvn" data-d="open" data-n="${i}" aria-label="Open the ${dn} dashboard"><b>${dn}</b><small>${c} people</small></button><ul class="stk">${hs.map(e=>`<li>${pcard(e)}</li>`).join("")}${L.length?`<li><div class="pills">${L.map(([t,n])=>`<span>${t}<em>${n}</em></span>`).join("")}</div></li>`:""}</ul></li>`}).join("");
 return`<div class="hxoc"><div class="ot" style="--c:${LOB}" role="group" aria-label="Madhouse HQ organization chart"><ul class="tree"><li><div class="dvn root"><b>Madhouse HQ</b><small>${M.n} people, ${D.length} divisions</small></div><ul>${kids}</ul></li></ul></div></div>`}
function psSec(hq,d,st){const it=hq?[1,2,3].map(n=>["Level "+n,EMP.filter(e=>lvl(e)===n).length]):lv(d).flatMap(x=>x.g.map(([t,a])=>["L"+x.n+" "+t,a.length])),m=Math.max(...it.map(x=>x[1]));
 return`<section class="hxp" ${st}><h3 class="hxq">${hq?"People by level":"Positions"}</h3><ul class="hxbr">${it.map((q,j)=>`<li><span>${q[0]}</span><i><u style="--w:${q[1]/m*100}%;--j:${j}"></u></i><b>${q[1]}</b></li>`).join("")}</ul>${srcLine(["people"])}</section>`}
function pfm(e,from){mo=from;const i=D.findIndex(x=>x[0]===e.dept),n=lvl(e);mdl.style.setProperty("--c",HX[i]);
 mdl.innerHTML=`<div class="hxmc" role="dialog" aria-modal="true" aria-label="${e.name}"><button class="hxbt hxmx" data-m="x" aria-label="Close">${ic("x")}</button><div class="hxmh">${av(e.name,68)}<div><div class="hxmn">${e.name}</div><div class="hxs" style="margin:2px 0 0">${e.role}</div><div class="hxpl"><span>${e.dept}</span><span>Level ${n}</span></div></div></div><dl class="hxdl hxmd"><dt>Employee ID</dt><dd>${eid(e)}</dd><dt>Reports to</dt><dd>${n===1?"Madhouse HQ":dvNames(e.dept)}</dd><dt>201 file</dt><dd><span class="hxmb"><u style="--w:${e.f}%"></u></span>${e.f}%</dd><dt>Lates, last 4 weeks</dt><dd>${e.l30}</dd><dt>Lates, last 90 days</dt><dd>${e.l90}</dd><dt>Development stage</dt><dd>${e.stage}</dd><dt>Tenure</dt><dd>${e.ten?e.ten+(e.ten===1?" year":" years"):"Under 1 year"}</dd></dl>${window.UX?UX.card(e):""}${window.MC_WORKFORCE?MC_WORKFORCE.profile(e):""}<p class="hxs" style="margin:14px 0 0">Live record. ${recLink("people",e.rid,"Open roster record in Airtable")}</p></div>`;
 mdl.classList.add("on");dvd.inert=true;setTimeout(()=>{const x=$(".hxmx",mdl);x&&x.focus()},40)}
function closeM(){mdl.classList.remove("on");dvd.inert=false;if(mo&&mo.isConnected)mo.focus({preventScroll:true})}
function fitOrg(){const o=$(".hxoc",dvd);if(!o)return;requestAnimationFrame(()=>{const over=o.scrollWidth>o.clientWidth+4;if(over){o.scrollLeft=(o.scrollWidth-o.clientWidth)/2;const h=$("#hxorg .hxq",dvd);if(h&&!h.querySelector(".hxhint"))h.insertAdjacentHTML("beforeend",'<small class="hxhint">Scroll sideways to see every division</small>')}})}
function dash(d){
 const hq=d==="HQ",i=hq?-1:D.findIndex(x=>x[0]===d);if(!hq&&i<0)return;cur=d;const s=hq?{n:M.n,a:M.avg,l:M.l30,r:M.prob}:deptStat(d),sp=SPEC[d],l=hq?EMP.filter(e=>e.head):EMP.filter(e=>e.dept===d);let n=0;const ix=a=>`style="--i:${n++};grid-area:${a}"`,mx=Math.max(1,...sp.bs[1].map(x=>x[1])),u=sp.bs[2]||"";
 dvd.style.setProperty("--c",hq?LOB:HX[i]);dvd.setAttribute("aria-label",(hq?"Company":d)+" dashboard");
 dvd.innerHTML=`<div class="hxw"><div class="hxdh"><div><button class="hxbt" data-d="back">${ic("left")}Back to office</button><div class="hxt" role="heading" aria-level="1">${hq?"Madhouse HQ":d}</div><p class="hxs">${sp.tag}. ${s.n} ${s.n===1?"person":"people"}${hq?"":", led by "+dvLead(d)}.</p><p class="hxs" style="margin-top:6px">${s.a}% of employee records (201 files) are complete, and ${s.l} lates were logged in the last 30 days.</p></div><div class="hxb"><button class="hxbt" data-d="theme" aria-label="Switch light or dark mode">${ic("theme")}</button><button class="hxbt" data-d="step" data-s="-1" aria-label="Previous division">${ic("left")}</button><button class="hxbt" data-d="step" data-s="1" aria-label="Next division">${ic("arrow")}</button></div></div>
 <div class="hxg" style='grid-template-areas:${LAY.A.map(r=>`"${r}"`).join(" ")}'>${[...sp.k,["People",s.n,"",`${Math.round(s.n/M.n*100)}% of the company`]].map((k,q)=>`<div class="hxk2" ${ix("k"+q)}><b><span data-to="${k[1]}" style="all:unset">0</span><i>${k[2]}</i></b><span>${k[0]}</span><small>${k[3]}</small></div>`).join("")}
 <section class="hxp" id="hxorg" ${ix("oc")}><h3 class="hxq">${hq?`Organization chart, all ${D.length} divisions`:"Organization chart by level"}</h3>${hq?hqChart():divChart(d)}${srcLine(["people","departments"])}</section>
 <section class="hxp" ${ix("tr")}><h3 class="hxq">${sp.tr[0]}</h3>${trend(sp.tr[1])}${srcLine(hq?["people"]:["attendance"])}</section>
 <section class="hxp" ${ix("hl")}><h3 class="hxq">${hq?"Company health":"Division health"}</h3><div class="hxhl">${ring(s.a)}<div><strong>${s.a}%</strong><div class="hxs" style="margin:2px 0 0">201 files, company ${M.avg}%</div></div></div><dl class="hxdl" style="margin-top:16px"><dt>Lates, last 30 days</dt><dd>${s.l}</dd><dt>On probation</dt><dd>${s.r} of ${s.n}</dd><dt>Missing Employee ID</dt><dd>${(hq?EMP:l).filter(e=>!e.hasId).length}</dd></dl>${srcLine(["people","attendance"])}</section>
 <section class="hxp" ${ix("bs")}><h3 class="hxq">${sp.bs[0]}</h3><ul class="hxbr">${sp.bs[1].map((b,j)=>`<li><span>${b[0]}</span><i><u style="--w:${b[1]/mx*100}%;--j:${j}"></u></i><b>${b[1]}${u}</b></li>`).join("")}</ul>${srcLine(sp.hub&&!hq?(MCD.OPS[hq?"HQ":d]&&MCD.OPS[hq?"HQ":d].src)||[]:["people"])}</section>
 ${psSec(hq,d,ix("ps"))}<section class="hxp" ${ix("nt")}><h3 class="hxq">What to know</h3><ul class="hxnt">${sp.nt.map(t=>`<li>${t}</li>`).join("")}</ul>${srcLine(["people"].concat((MCD.OPS[hq?"HQ":d]&&MCD.OPS[hq?"HQ":d].src)||[],MCD.OPS[hq?"HQ":d]&&MCD.OPS[hq?"HQ":d].psrc?[MCD.OPS[hq?"HQ":d].psrc]:[]))}</section>
 </div>
 ${window.MC_WORKFORCE?MC_WORKFORCE.shell(d):""}
 <div class="hxsrc">${srcLine(["people","departments","attendance","development"].concat((MCD.OPS[hq?"HQ":d]&&MCD.OPS[hq?"HQ":d].src)||[],MCD.OPS[hq?"HQ":d]&&MCD.OPS[hq?"HQ":d].psrc?[MCD.OPS[hq?"HQ":d].psrc]:[]))}</div><p class="hxs" style="margin:10px 0 0">Read-only. Select a Source link to open where the data lives.</p></div>`;
 dvd.classList.remove("go");dvd.scrollTop=0;dvd.classList.add("on");setTimeout(()=>{if(dvd.classList.contains("on"))rest=1},800);
 requestAnimationFrame(()=>requestAnimationFrame(()=>dvd.classList.add("go")));fitOrg();cnt(dvd);window.UX&&UX.org(dvd);setTimeout(()=>{const b=$("[data-d=back]",dvd);b&&b.focus({preventScroll:true})},60)}
window.MC_WF_PROFILE_BRIDGE=(e,from)=>pfm(e,from);
const H=window.HUB={
 open(){document.body.classList.remove("mcws");if(isOpen){mcWake();return true;}let ok=ready;if(!ok&&!fail){try{ok=build()}catch(e){console.error(e);fail=1;ok=0}}if(!hub)mk();isOpen=1;document.body.classList.add("hxon");hub.classList.add("on");hub.classList.toggle("hxnogl",!ok);app.inert=true;if(!ok){mcBuildDirectory();mcFallbackRoom("HQ");return true}t0=performance.now()/1000;last=performance.now();lastR=0;mcFrameSamples=0;mcFrameClock=0;mcSyncQualityUI();
  V.r=46;V.th=base-1.1;V.ph=.7;size();Vt.r=homeR();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);return true},
 close(){isOpen=0;rest=0;document.body.classList.remove("hxon");if(hub){hub.classList.remove("on","hxz");dvd.classList.remove("on")}mcCloseFocus();focus=null;cancelAnimationFrame(raf);raf=0;app.inert=false;Vt.tx=Vt.tz=0;Vt.ph=.95},
 fit(){if(!ready||focus)return;zm=1;base=.75;Vt.ph=.95;Vt.tx=Vt.tz=0;Vt.r=homeR()},
 dash,preview:mcPreview,leave:mcCloseFocus,active:()=>mcRoom,refresh(){try{mcRefreshRoomLabels();if(mcRoom&&hub)mcPaintPanel()}catch(e){}}};
document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else if(isOpen&&ready&&!fail&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}});
addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(!h.startsWith("division/")||document.body.classList.contains("mcws"))return;const d=decodeURIComponent(h.slice(9));if(D.some(x=>x[0]===d)){if(!isOpen)H.open();mcPreview(d)}});
 new MutationObserver(skin).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
matchMedia("(prefers-color-scheme:dark)").addEventListener("change",skin);skin();
addEventListener("keydown",e=>{if(!isOpen)return;const k=e.key.toLowerCase();if(e.target.closest&&e.target.closest("#mc-search"))return;
 if(((e.ctrlKey||e.metaKey)&&k==="k")||(k==="/"&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))){e.stopImmediatePropagation();e.preventDefault();mcOpenSearch();return}
 if(e.altKey&&k==="b"){e.stopImmediatePropagation();e.preventDefault();mcCloseFocus();return}
 if(mcRoom&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)&&!e.ctrlKey&&!e.metaKey){if(k==="0"){e.preventDefault();mcFocusCamera("iso")}else if(k==="+"||k==="="){e.preventDefault();Vt.r=clamp(Vt.r*.84,4.6,18)}else if(k==="-"||k==="_"){e.preventDefault();Vt.r=clamp(Vt.r*1.18,4.6,18)}}},true);
addEventListener("keydown",e=>{if(e.key==="Escape"){if($("#mc-search",hub)||$("#mc-guide",hub)){mcCloseFloating();return}if(mdl&&mdl.classList.contains("on")){closeM();return}if(dvd&&dvd.classList.contains("on")&&!layer){back();return}if(mcRoom){mcCloseFocus();return}}});
})();
