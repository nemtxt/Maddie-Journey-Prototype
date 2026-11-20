/* Maddie Journey V4.3 DOM/data contract checks.
 * Run: node tests/v43-profile-division-contract.js
 * No external packages required. Uses existing fictional model and V4.3 source.
 */
'use strict';
const fs=typeof require==='function'?require('fs'):null;
const path=typeof require==='function'?require('path'):null;
const SRC=typeof SOURCE==='string'?SOURCE:fs.readFileSync(path.join(__dirname,'..','maddie-v43-profiles-divisions.js'),'utf8');
const FIXTURE=typeof FIX==='object'&&FIX?FIX:null;
class Element{
 constructor(tag,cls='',txt=''){
  this.tagName=tag.toUpperCase();this.className=cls;this._text=txt;this.children=[];
  this.parentNode=null;this.dataset={};this.attrs={};this.style={setProperty:(k,v)=>{(this.styleValues||(this.styleValues={}))[k]=v}};
 }
 get textContent(){return this._text+this.children.map(x=>x.textContent).join(' ')}
 set textContent(v){this._text=String(v);this.children=[]}
 get firstElementChild(){return this.children[0]||null}
 get classList(){const node=this;return{
  contains:k=>node.className.split(' ').includes(k),
  add:k=>{node.className=[...new Set(node.className.split(' ').filter(Boolean).concat(k))].join(' ')},
  toggle:(k,force)=>{const values=new Set(node.className.split(' ').filter(Boolean));const state=force===undefined?!values.has(k):force;state?values.add(k):values.delete(k);node.className=[...values].join(' ');return state}
 }}
 append(...nodes){for(const n of nodes){n.remove();this.children.push(n);n.parentNode=this}}
 appendChild(n){this.append(n);return n}
 before(n){const p=this.parentNode;if(!p)throw Error('No parent');n.remove();p.children.splice(p.children.indexOf(this),0,n);n.parentNode=p}
 insertBefore(n,child){n.remove();this.children.splice(this.children.indexOf(child),0,n);n.parentNode=this}
 remove(){if(!this.parentNode)return;const a=this.parentNode.children;const i=a.indexOf(this);if(i>=0)a.splice(i,1);this.parentNode=null}
 setAttribute(k,v){this.attrs[k]=String(v);if(k==='id')this.id=String(v)}
 removeAttribute(k){delete this.attrs[k]}
 getAttribute(k){return this.attrs[k]??null}
 matches(selector){
  return selector.split(',').some(raw=>{
   const s=raw.trim(),tag=/^[a-z][a-z0-9-]*/i.exec(s)?.[0];
   if(tag&&tag.toUpperCase()!==this.tagName)return false;
   if([...s.matchAll(/\.([a-z0-9-]+)/gi)].some(m=>!this.classList.contains(m[1])))return false;
   const attrs=[...s.matchAll(/\[([a-z0-9-]+)(?:=(["'])(.*?)\2)?\]/gi)];
   for(const a of attrs){const k=a[1],v=k.startsWith('data-')?this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:this.attrs[k];if(v===undefined)return false;if(a[3]!==undefined&&String(v)!==a[3])return false}
   return true;
  });
 }
 descendants(){return this.children.flatMap(x=>[x,...x.descendants()])}
 querySelectorAll(selector){
  return selector.split(',').flatMap(raw=>{
   const s=raw.trim();
   if(s.startsWith(':scope >'))return this.children.filter(x=>x.matches(s.slice(8).trim()));
   const pieces=s.split(/\s*>\s*|\s+/);let items=[this];
   for(const token of pieces)items=items.flatMap(x=>x.descendants().filter(y=>y.matches(token)));
   return items;
  });
 }
 querySelector(selector){return this.querySelectorAll(selector)[0]||null}
 closest(selector){for(let n=this;n;n=n.parentNode){if(n.matches(selector))return n}return null}
}
const make=(t,c='',txt='')=>new Element(t,c,txt);
const layer=make('div'),view=make('main');
const layerListeners=[];
layer.addEventListener=(type,fn)=>{if(type==='click')layerListeners.push(fn)};
const people=FIXTURE?.EMP||[],divisions=FIXTURE?.D||[],cases=FIXTURE?.CASES||[];
const selected=people.find(e=>e.dept==='Media')||people[0];
if(!selected)throw Error('No fictional fixture employee supplied');
const sheet=make('aside','sheet mj-profile-sheet');
const identity=make('header','mj-profile-identity'),heading=make('div','mj-profile-heading');
heading.append(make('h2','',selected.name),make('p','sub',selected.role));
identity.append(make('div','pf'));
identity.children[0].dataset.mjV43Employee=String(selected.i);
identity.append(heading);
sheet.append(identity);
const nav=make('nav','mj-profile-jumps');nav.append(make('span','mj-profile-jumps-title','Profile details'));
sheet.append(nav);
const grid=make('div','mj-profile-grid');
const labels=['Employment','Contact','Government IDs','Compensation','Attendance and 201 file','201 documents','Cases (1)'];
for(let i=0;i<labels.length;i++){
 const section=make('section','mj-profile-group');section.dataset.mjProfileDetail=String(i);section.id='mj-profile-detail-'+i;
 section.append(make('h3','',labels[i]),make('dl','dl','Original field values '+i));grid.append(section);
 const button=make('button','mj-profile-jump',labels[i]);button.dataset.mjProfileJump=String(i);nav.append(button);
}
sheet.append(grid);layer.append(sheet);
const header=make('header','ph'),titleBox=make('div'),title=make('h1','',selected.dept);titleBox.append(title,make('p','','Example description'));
header.append(titleBox);
const chart=make('section','mj-one-division-chart'),titles=make('div','mj-one-titles');
titles.append(make('h2','',selected.dept));chart.append(titles);
const content=make('div','g12');
for(const label of ['At a glance','People','Other divisions']){
 const card=make('section','card'),h2=make('h2','',label);card.append(h2);content.append(card);
}
view.append(header,chart,content);
const callbacks={};
const document={
 getElementById:id=>id==='layer'?layer:id==='view'?view:null,
 createElement:t=>make(t),body:{classList:{contains:k=>k==='mj-new'}},
 readyState:'complete',addEventListener(){}
};
const location={hash:'#division/'+encodeURIComponent(selected.dept)};
const window={MCD:{EMP:people,D:divisions,CASES:cases},
 MJ_DIVISION_COLOR:d=>d==='Media'?'#1db9aa':'#858585'};
new Function('document','window','MutationObserver','addEventListener','requestAnimationFrame','location',SRC)(
 document,window,class{observe(){}},(t,fn)=>callbacks[t]=fn,fn=>fn(),location
);
const issues=[],check=(k,ok)=>{if(!ok)issues.push(k)};
const api=window.MJ_V43;
check('API registered',api?.version==='4.3');
check('Exact identity linked to source record',sheet.dataset.mjV43Ready==='1');
check('Profile summary has four factual signals',sheet.querySelectorAll('.mj-v43-stat').length===4);
check('Career timeline built from recorded facts',sheet.querySelectorAll('.mj-v43-timeline-event').length>=2);
check('All original field groups retained',grid.children.length===labels.length);
check('Employment prioritized first',grid.children[0].dataset.mjV43Group==='Employment');
check('Attendance prioritized second',grid.children[1].dataset.mjV43Group==='Attendance and 201 file');
check('201 documents prioritized third',grid.children[2].dataset.mjV43Group==='201 documents');
check('Optional contact details collapsed initially',grid.children.some(x=>x.dataset.mjV43Group==='Contact'&&x.classList.contains('mj-v43-group-closed')));
check('Profile jumps remain in reordered sequence',nav.querySelectorAll('.mj-profile-jump')[1].textContent==='Attendance and 201 file');
check('Division identity color grounded in division color map',sheet.styleValues['--mj-v43-division']==='#1db9aa');
check('Division page identified',view.classList.contains('mj-v43-division-dashboard'));
check('Division header has one informational kicker',header.querySelectorAll('.mj-v43-division-eyebrow').length===1);
check('Division context has four factual labels',header.querySelectorAll('.mj-v43-division-context span').length===4);
check('Existing organization chart renamed to common heading',titles.querySelector('h2').textContent==='Organization structure');
check('People and related division cards classified',content.querySelector('.mj-v43-division-people')!==null&&content.querySelector('.mj-v43-division-related')!==null);
api.refresh();
check('Enhancement idempotent',sheet.querySelectorAll('.mj-v43-profile-snapshot').length===1&&header.querySelectorAll('.mj-v43-division-eyebrow').length===1);
const click=target=>{
 const event={target,preventDefault(){},stopPropagation(){}};
 (layer._listeners||[]).forEach(fn=>fn(event));
};
const contact=grid.children.find(x=>x.dataset.mjV43Group==='Contact');
check('Closed contact group exists',!!contact);

const mods=people.map(e=>api.employeeModel(e));
const teamModels=divisions.map(([name])=>api.divisionModel(name));
check('All 51 existing profiles map accurately',mods.length===51&&mods.every((m,i)=>m.id===people[i].i));
check('All 8 division counts reconcile',teamModels.length===8&&teamModels.reduce((n,d)=>n+d.count,0)===51);
check('Every division average uses existing file percentages',teamModels.every(t=>{
 const group=people.filter(e=>e.dept===t.name);
 return t.avgFile===Math.round(group.reduce((n,e)=>n+e.f,0)/group.length);
}));
check('Career dates never invented',mods.every(m=>m.events.every(ev=>ev.kind==='dated'?!!ev.date&&!!ev.displayDate:ev.date===null)));
check('Sensitive compensation absent from quick summary',!SRC.includes('peso(')&&!SRC.includes('salaryOf('));
const result={tests:22,passed:22-issues.length,issues,profiles:mods.length,divisions:teamModels.length};
if(typeof module!=='undefined'){
 console.log(JSON.stringify(result,null,2));
 if(issues.length)process.exitCode=1;
}
