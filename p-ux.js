
(()=>{
const root=document.documentElement,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),$1=(s,r=document)=>r.querySelector(s);
const HX=["#f48fb1","#b9a6f2","#8fd3c0","#f6b98a","#9cc7f2","#f7a8d4","#c3dd9a","#ffcf8b","#a8d8e8","#e3c6a8"],LOB="#ec5f9e",ORDER=[0,1,2,3,"L",4,5,6,7].filter(c=>c==="L"||c<D.length);
window.MC_PHOTOS=window.MC_PHOTOS||{}; /* optional photo map by name (empty: initials are shown) */
addEventListener("error",e=>{const t=e.target;if(t&&t.classList&&t.classList.contains("avp"))t.outerHTML=av0(t.dataset.n,+t.dataset.s)},true);

/* ---------- lite mode ---------- */
const cn=navigator.connection||{},why=[];
const gl=(()=>{try{const c=document.createElement("canvas"),g=c.getContext("webgl")||c.getContext("experimental-webgl");if(!g)return false;const x=g.getExtension("WEBGL_lose_context");x&&x.loseContext();return true}catch(e){return false}})();
if(!gl)why.push("no WebGL");if(navigator.deviceMemory&&navigator.deviceMemory<=2)why.push("low memory");if(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2)why.push("few CPU cores");if(cn.saveData)why.push("Data Saver");if(/(^|slow-)2g/.test(cn.effectiveType||""))why.push("slow connection");
const manual=()=>store.get("lite"),lite=()=>!gl||(manual()==="1"?true:manual()==="0"?false:why.length>0||store.get("liteSlow")==="1");
const hubOpen=()=>document.body.classList.contains("hxon");
function labels(){const on=lite();$$("[data-ux=lite]").forEach(b=>{b.setAttribute("aria-pressed",on);b.disabled=!gl;b.title=gl?"Fixed third-person 3D camera with reduced rendering load":"Fixed CSS perspective fallback; WebGL unsupported";b.querySelector("span").textContent=on?"Lite mode: on":"Lite mode"})}
function apply(){root.classList.toggle("lite",lite());labels()}
function setLite(on,auto){if(auto)store.set("liteSlow","1");else store.set("lite",on?"1":"0");apply();if(hubOpen()){const d=HUB.active&&HUB.active();if(d)window.MC_PENDING_DIVISION=d;HUB.close();HUB.open()}}
let three;const loadThree=()=>three||(three=new Promise((ok,no)=>{if(typeof THREE!=="undefined")return ok();const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";s.onload=ok;s.onerror=()=>{three=null;no()};document.head.append(s)}));
const tile=o=>{const L=o==="L",d=L?"Lobby":D[o][0],l=L?[]:EMP.filter(e=>e.dept===d),c=L?LOB:HX[o],n=L?M.n:l.length;
 return`<button type="button" data-i="${o}" style="--c:${c}" aria-label="Open ${L?"company overview":d+" dashboard"}, ${n} people"><b>${d}</b><small>${L?"Company overview":n+" people"}</small><span class="uxds" aria-hidden="true">${l.map(e=>`<i class="uxd${e.head?" h":!e.hasId?" r":""}"></i>`).join("")}</span></button>`.replace("<button","<button class=\"uxt\"")};
function setup(){const hub=$1("#hub");if(!hub)return;const hb=$1(".hxb",hub);
 /* Camera and performance options live in Office settings; no developer widgets in the map. */
 const on=hub.classList.contains("hxnogl");hub.classList.toggle("hasplan",on);
 if(on){let p=$1("#hxplan",hub);if(!p){p=document.createElement("div");p.id="hxplan";hub.append(p)}
  p.innerHTML=`<div class="mc-fallback-guide"><b>Office directory</b><span>Choose a division to explore its people and activity.</span></div><div class="uxg" role="group" aria-label="Office rooms, ${ORDER.length} rooms">${ORDER.map(tile).join("")}</div><p class="uxk">Select a room to review its people and reports.</p>`}
 labels();window.MC_PERF&&window.MC_PERF.setMode(window.MC_PERF.mode)}
function probe(){if(lite()||manual()==="0")return;let t0=performance.now(),p=0,n=0,s=0;const tick=t=>{if(!hubOpen()||document.hidden||lite())return;if(p&&t-t0>1500){s+=t-p;n++}p=t;if(t-t0<5500)requestAnimationFrame(tick);else if(n>20&&s/n>45){setLite(true,true);toast("This device is struggling, so lite mode is on. Use Lite mode to switch back.")}};requestAnimationFrame(tick)}
const o0=HUB.open;
HUB.open=()=>{const go=()=>{const r=o0();setup();const d=window.MC_PENDING_DIVISION||(location.hash.startsWith("#division/")?decodeURIComponent(location.hash.slice(10)):null);if(d){delete window.MC_PENDING_DIVISION;HUB.preview(d)}return r};if(!gl||typeof THREE!=="undefined")return go();loadThree().then(go,go);return true};
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-ux]");if(!b)return;if(b.dataset.ux==="lite"){
 if(window.MC_PERF)window.MC_PERF.setMode(lite()?"auto":"lite");else setLite(!lite())
 }else if(b.dataset.ux==="fit")HUB.fit()});
apply();if(gl)loadThree().catch(()=>{});

/* ---------- org chart: collapse, zoom, pan, fit ---------- */
function org(rootEl){const sec=$1("#hxorg",rootEl),oc=sec&&$1(".hxoc",sec),ot=oc&&$1(".ot",oc);if(!oc||!ot||oc.dataset.ux)return;oc.dataset.ux=1;
 const hq=!!$1(".dvn.root",ot),divs=hq?$$("ul.tree>li>ul>li",ot):[],wide=matchMedia("(min-width:821px)");let k=1,x=0,fitM=true,lw=0;
 const setCol=(li,c)=>{li.classList.toggle("uxcol",c);const t=$1(".uxtg",li);if(t){t.setAttribute("aria-expanded",!c);t.firstChild.textContent=c?"Show team":"Hide team"}};
 divs.forEach((li,i)=>{const b=$1(".dvn",li),st=$1("ul.stk",li);if(!b||!st)return;st.id="uxs"+i+Date.now()%1e5;const t=document.createElement("button");t.type="button";t.className="uxtg";t.setAttribute("aria-controls",st.id);t.setAttribute("aria-label","Show or hide the "+$1("b",b).textContent+" team");t.innerHTML="<span></span>";b.after(t);setCol(li,true)});
 const bar=document.createElement("div");bar.className="uxbar";bar.setAttribute("role","toolbar");bar.setAttribute("aria-label","Chart controls");
 bar.innerHTML=(hq?'<button type="button" data-o="col">Collapse all</button><button type="button" data-o="exp">Expand all</button>':"")+'<span class="uxsp"></span><span class="uxzc" style="display:contents"><button type="button" data-o="out" aria-label="Zoom out">&minus;</button><output class="uxz" aria-live="polite">100%</output><button type="button" data-o="in" aria-label="Zoom in">+</button></span><button type="button" data-o="fit">Fit to screen</button>';
 oc.before(bar);oc.insertAdjacentHTML("afterend",'<p class="uxh2">Drag to move. Pinch, or hold Ctrl and scroll, to zoom. Keys: + &minus; 0 and arrow keys.</p>');
 oc.tabIndex=0;oc.setAttribute("role","group");oc.setAttribute("aria-label","Organization chart. Press plus or minus to zoom, zero to fit, arrow keys to move.");
 const out=$1(".uxz",bar),dim=()=>[ot.offsetWidth,ot.offsetHeight];
 const paint=()=>{if(!wide.matches){oc.classList.remove("uxpz");oc.style.height="";ot.style.transform="";return}
  oc.classList.add("uxpz");const[w,h]=dim(),cw=oc.clientWidth;oc.style.height=Math.ceil(h*k+8)+"px";oc.scrollLeft=0;x=w*k<=cw?(cw-w*k)/2:clamp(x,cw-w*k,0);ot.style.transform=`translate(${x}px,0) scale(${k})`;out.textContent=Math.round(k*100)+"%"};
 const fit=()=>{const[w]=dim();k=clamp(oc.clientWidth/w,.3,1);x=0;fitM=true;paint()},re=()=>fitM?fit():paint();
 const zoom=(f,cx)=>{const nk=clamp(k*f,.3,2.5);x=cx-(cx-x)*nk/k;k=nk;fitM=false;paint()};
 bar.addEventListener("click",e=>{const b=e.target.closest("button"),a=b&&b.dataset.o;if(!a)return;if(a==="col"||a==="exp"){divs.forEach(li=>setCol(li,a==="col"));re()}else if(a==="fit")fit();else zoom(a==="in"?1.25:.8,oc.clientWidth/2)});
 ot.addEventListener("click",e=>{const t=e.target.closest(".uxtg");if(!t)return;const li=t.closest("li");setCol(li,!li.classList.contains("uxcol"));re()});
 const P=new Map();let d0=0,k0=1,m0=0,x0=0,sx=0,mv=0,dr=0;const rx=c=>c-oc.getBoundingClientRect().left;
 oc.addEventListener("pointerdown",e=>{if(!wide.matches||(e.pointerType==="mouse"&&e.button))return;P.set(e.pointerId,[e.clientX,e.clientY]);oc.classList.add("uxon");
  if(P.size===1){sx=e.clientX;x0=x;mv=0}else if(P.size===2){const[a,b]=[...P.values()];d0=Math.hypot(a[0]-b[0],a[1]-b[1])||1;k0=k;x0=x;m0=rx((a[0]+b[0])/2);mv=1}});
 oc.addEventListener("pointermove",e=>{if(!P.has(e.pointerId))return;P.set(e.pointerId,[e.clientX,e.clientY]);
  if(P.size===2){const[a,b]=[...P.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),nk=clamp(k0*d/d0,.3,2.5),m=rx((a[0]+b[0])/2);x=m-(m0-x0)*nk/k0;k=nk;fitM=false;oc.classList.add("uxdr");paint();return}
  if(P.size===1&&(dr||Math.abs(e.clientX-sx)>6)){if(!dr){dr=1;mv=1;oc.classList.add("uxdr");try{oc.setPointerCapture(e.pointerId)}catch(_){}}x=x0+e.clientX-sx;fitM=false;paint()}});
 const up=e=>{P.delete(e.pointerId);if(P.size<2)d0=0;if(P.size===1){const[a]=[...P.values()];sx=a[0];x0=x}if(!P.size){dr=0;oc.classList.remove("uxdr")}};
 oc.addEventListener("pointerup",up);oc.addEventListener("pointercancel",up);
 oc.addEventListener("click",e=>{if(mv){e.stopPropagation();e.preventDefault();mv=0}},true);
 oc.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse")oc.classList.remove("uxon")});
 oc.addEventListener("wheel",e=>{if(!wide.matches||!(e.ctrlKey||e.metaKey||oc.classList.contains("uxon")))return;e.preventDefault();zoom(Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015)),rx(e.clientX))},{passive:false});
 oc.addEventListener("keydown",e=>{if(!wide.matches)return;const c=oc.clientWidth/2,K=e.key;if(K==="+"||K==="="){zoom(1.25,c)}else if(K==="-"||K==="_"){zoom(.8,c)}else if(K==="0"){fit()}else if(e.target===oc&&(K==="ArrowLeft"||K==="ArrowRight")){x+=K==="ArrowLeft"?60:-60;fitM=false;paint()}else return;e.preventDefault()});
 const ro=new ResizeObserver(()=>{if(!oc.isConnected){ro.disconnect();return}const w=oc.clientWidth+"x"+ot.offsetWidth;if(oc.clientWidth&&w!==lw){lw=w;re()}});ro.observe(oc);ro.observe(ot);
 requestAnimationFrame(()=>{const h=$1(".hxhint",sec);h&&h.remove();re()});}

/* ---------- richer profile cards ---------- */
const MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],slug=s=>s.toLowerCase().normalize("NFD").replace(/[^a-z]/g,"");
function card(e){const mdl=MCD.model,t=mdl.today,fmtD=iso=>iso?MN[+iso.slice(5,7)-1]+" "+(+iso.slice(8,10))+", "+iso.slice(0,4):"Not recorded";
 let bd="Not recorded";if(e.bday){let y=+t.slice(0,4),b=y+"-"+e.bday;if(b<t)b=(y+1)+"-"+e.bday;const dn=Math.round((Date.parse(b+"T00:00:00Z")-Date.parse(t+"T00:00:00Z"))/864e5);bd=MN[+e.bday.slice(0,2)-1]+" "+(+e.bday.slice(3,5))+(dn===0?" (today)":dn<=30?" (in "+dn+" days)":"")}
 const it=[];if(!e.hasId)it.push(["r","Employee ID not assigned"]);if(e.f<100)it.push([e.f<60?"r":"a","201 file is "+e.f+"% complete ("+e.onFile+" of "+e.tracked+")"]);if(e.l90>=3)it.push(["a",e.l90+" lates in the last 90 days"]);if(e.stage==="For evaluation")it.push(["b","Development record marked For Evaluation"]);if(e.stage==="Onboarding")it.push(["b","Onboarding, first 90 days"]);(e.issues||[]).forEach(x=>it.push(["a",x]));
 const up=MCD.TASKS[e.i];
 return`<div class="uxc"><h4>Dates</h4><ul><li><span>Start date</span><span>${fmtD(e.hire)}</span></li><li><span>Regularized</span><span>${e.reg?fmtD(e.reg):"—"}</span></li><li><span>Birthday</span><span>${bd}</span></li><li><span>Next dated item</span><span>${up&&up.due?esc(up.title)+", "+fmtD(up.due):"None in the next 60 days"}</span></li></ul><h4>Open items (${it.length})</h4><ul class="uxo">${it.length?it.map(x=>`<li><i class="dot ${x[0]}"></i><span>${esc(x[1])}</span></li>`).join(""):"<li><span>Nothing open.</span></li>"}</ul></div>`}
window.UX={lite,org,card,why,syncQuality:apply};
})();
