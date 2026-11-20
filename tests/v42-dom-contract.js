/* Maddie Journey V4.2 DOM contract tests.
 * Run: node tests/v42-dom-contract.js
 * No external dependencies; tests the read-only table adapter against fixtures.
 * This tests DOM contracts, not a live browser screenshot or CSS layout.
 */
'use strict';
const source=(typeof SOURCE==='string')?SOURCE:require('fs').readFileSync(require('path').join(__dirname,'..','maddie-v42-tables.js'),'utf8');
const events={};
class Element {
 constructor(tag,cl='',text=''){
  this.tagName=tag.toUpperCase();this.className=cl;this._text=text;this.children=[];
  this.parentNode=null;this.dataset={};this.attributes={};
  this.hidden=false;this.disabled=false;this.checked=false;this.value='';this.style={};
 }
 get isConnected(){let p=this;while(p){if(p===root)return true;p=p.parentNode}return false}
 get parentElement(){return this.parentNode}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join(' ')}
 set textContent(v){this._text=String(v);this.children=[]}
 append(...items){for(const x of items){x.remove();x.parentNode=this;this.children.push(x)}}
 prepend(x){x.remove();x.parentNode=this;this.children.unshift(x)}
 before(x){const p=this.parentNode;if(!p)throw Error('Detached before');x.remove();p.children.splice(p.children.indexOf(this),0,x);x.parentNode=p}
 after(x){const p=this.parentNode;if(!p)throw Error('Detached after');x.remove();p.children.splice(p.children.indexOf(this)+1,0,x);x.parentNode=p}
 remove(){if(this.parentNode){const a=this.parentNode.children;a.splice(a.indexOf(this),1);this.parentNode=null}}
 setAttribute(k,v){this.attributes[k]=String(v)}
 getAttribute(k){return this.attributes[k]??null}
 get classList(){
  const node=this;
  return {
   contains:k=>node.className.split(' ').includes(k),
   add:k=>{node.className=[...new Set([...node.className.split(' ').filter(Boolean),k])].join(' ')},
   toggle:(k,v)=>{const a=new Set(node.className.split(' ').filter(Boolean));const has=v===undefined?!a.has(k):v;has?a.add(k):a.delete(k);node.className=[...a].join(' ');return has}
  };
 }
 matches(query){
  return query.split(',').some(raw=>{
   const s=raw.trim();if(s.startsWith(':scope'))return false;
   const tag=/^[a-z][\w-]*/i.exec(s)?.[0];if(tag&&this.tagName!==tag.toUpperCase())return false;
   const id=/#([\w-]+)/.exec(s)?.[1];if(id&&this.id!==id)return false;
   if([...s.matchAll(/\.([\w-]+)/g)].some(m=>!this.classList.contains(m[1])))return false;
   const attr=/\[([\w-]+)(?:=(["'])(.*?)\2)?\]/.exec(s);
   if(attr){const k=attr[1],v=k.startsWith('data-')?this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:this.attributes[k];if(v===undefined)return false;if(attr[3]!==undefined&&String(v)!==attr[3])return false}
   return true;
  });
 }
 descendants(){return this.children.flatMap(x=>[x,...x.descendants()])}
 querySelectorAll(q){return q.split(',').flatMap(raw=>{
  const part=raw.trim();
  if(part.startsWith(':scope >'))return this.children.filter(x=>x.matches(part.slice(8).trim()));
  let roots=[this];
  for(const token of part.split(/\s+/))roots=roots.flatMap(x=>x.descendants().filter(y=>y.matches(token)));
  return roots;
 })}
 querySelector(q){return this.querySelectorAll(q)[0]||null}
 closest(q){for(let x=this;x;x=x.parentNode)if(x.matches(q))return x;return null}
 get tHead(){return this.tagName==='TABLE'?this.children.find(x=>x.tagName==='THEAD')||null:null}
 get tFoot(){return this.tagName==='TABLE'?this.children.find(x=>x.tagName==='TFOOT')||null:null}
 get tBodies(){return this.tagName==='TABLE'?this.children.filter(x=>x.tagName==='TBODY'):[]}
 get rows(){if(this.tagName==='TABLE')return [...(this.tHead?.rows||[]),...this.tBodies.flatMap(x=>x.rows)];return this.children.filter(x=>x.tagName==='TR')}
 get cells(){return this.children.filter(x=>['TD','TH'].includes(x.tagName))}
}
const n=(t,c='',v='')=>new Element(t,c,v),root=n('main');
const document={
 getElementById:()=>root,createElement:t=>n(t),
 body:{classList:{contains:c=>c==='mj-new'}},readyState:'complete',
 addEventListener:(type,fn,cap)=>{(events[type]||(events[type]=[])).push({fn,cap})}
};
const fire=(type,target)=>{const e={target,stopPropagation(){},preventDefault(){}};for(const cap of [true,false])for(const fn of events[type]||[])if(Boolean(fn.cap)===cap)fn.fn(e)};
function fixtureTable(cls,rows,groupCount=0){
 const scroll=n('div','scroll'),table=n('table',cls),head=n('thead'),h=n('tr');
 ['Name','Division','Completeness'].forEach(t=>h.append(n('th','',t)));head.append(h);table.append(head);
 const entry=i=>{const row=n('tr');row.dataset.tags='active';row.append(n('td','','Entry '+i),n('td','','Media'),n('td','','100%'));return row};
 if(groupCount)for(let g=0;g<groupCount;g++){
  const body=n('tbody'),title=n('tr','gh');title.append(n('th','','Group '+g));body.append(title);
  for(let i=0;i<rows;i++)body.append(entry(g+'-'+i));
  table.append(body);
 }else{
  const body=n('tbody');for(let i=0;i<rows;i++)body.append(entry(i));table.append(body);
 }
 scroll.append(table);return{scroll,table};
}
const standard=n('div','tbl'),originalBar=n('div','tools2'),input=n('input','fin');
input.dataset.filter='';originalBar.append(input,n('span','cnt2','51 of 51'));
standard.append(originalBar);
const main=fixtureTable('',51);standard.append(main.scroll,n('p','emp0','No matches'));root.append(standard);
const plain=fixtureTable('',24);root.append(plain.scroll);
const grouped=fixtureTable('gt',5,4);root.append(grouped.scroll);
const matrix=fixtureTable('xt',12);root.append(matrix.scroll);
const pane=n('div','g12');pane.id='pane';root.append(pane);
for(let i=0;i<4;i++){
 const card=n('section','secc'),head=n('div','sech');
 head.append(n('h2','','Report '+i));
 card.append(head,n('div','secb','Body'),n('p','src','Source'));pane.append(card);
}
new Function('document','window','MutationObserver','addEventListener','requestAnimationFrame','queueMicrotask',source)(
 document,{},class{observe(){}},()=>{},cb=>cb(),cb=>cb()
);
const problems=[],check=(label,ok)=>{if(!ok)problems.push(label)};
const visible=table=>table.tBodies.flatMap(x=>x.rows).filter(x=>!x.hidden);
check('Standard table default page has ten rows',visible(main.table).length===10);
check('Original standard table stays mounted',standard.isConnected&&main.scroll.isConnected);
check('Plain analytical table remains mounted',plain.scroll.isConnected&&plain.scroll.parentNode.classList.contains('mj-v42-analysis'));
check('Grouped analytical table remains mounted',grouped.scroll.isConnected&&grouped.scroll.parentNode.classList.contains('mj-v42-analysis'));
check('Matrix table remains mounted',matrix.scroll.isConnected&&matrix.scroll.parentNode.classList.contains('mj-v42-analysis'));
check('Plain table paginates',visible(plain.table).length===10);
check('Grouped report defaults to first two expanded',!grouped.table.tBodies[0].rows[1].hidden&&!grouped.table.tBodies[1].rows[1].hidden&&grouped.table.tBodies[2].rows[1].hidden);
check('Four long-report sections enhanced',pane.querySelectorAll('section.mj-v42-section').length===4);
check('Third/fourth report sections collapsed',pane.querySelectorAll('.mj-v42-section-closed').length===2);
fire('click',standard.querySelector('[data-v42-action="next"]'));
check('Next page displays the eleventh record',!main.table.tBodies[0].rows[10].hidden&&main.table.tBodies[0].rows[0].hidden);
const size=standard.querySelector('[data-v42-size]');size.value='20';fire('change',size);
check('Page size of twenty is respected',visible(main.table).length===20);
input.value='Entry 3';fire('input',input);
check('Search matches records across the full table',visible(main.table).length===11);
input.value='';fire('input',input);
check('Clearing search restores twenty records',visible(main.table).length===20);
const column=standard.querySelector('[data-v42-column]');column.checked=false;fire('change',column);
check('Column visibility hides the same header/column',main.table.tHead.rows[0].cells[1].classList.contains('mj-v42-col-hidden'));
fire('click',grouped.scroll.parentNode.querySelector('[data-v42-group="2"]'));
check('Individual collapsed group can expand',!grouped.table.tBodies[2].rows[1].hidden);
fire('click',grouped.scroll.parentNode.querySelector('[data-v42-action="collapse-all"]'));
check('Collapse all groups hides all rows',grouped.table.tBodies.every(x=>x.rows.slice(1).every(y=>y.hidden)));
fire('click',pane.querySelector('[data-v42-action="sections-open"]'));
check('Expand all sections',pane.querySelectorAll('.mj-v42-section-closed').length===0);
fire('click',pane.querySelector('[data-v42-action="sections-close"]'));
check('Collapse all sections',pane.querySelectorAll('.mj-v42-section-closed').length===4);
const matrixSearch=matrix.scroll.parentNode.querySelector('[data-v42-search]');
matrixSearch.value='Entry 1';fire('input',matrixSearch);
check('Matrix search hides nonmatching rows',visible(matrix.table).length===3);
check('All source row counts remain unchanged',main.table.tBodies[0].rows.length===51&&plain.table.tBodies[0].rows.length===24&&grouped.table.tBodies.length===4);
const result={tests:20,passed:20-problems.length,problems,allTablesMounted:[main,plain,grouped,matrix].every(x=>x.scroll.isConnected)};
if(typeof module!=='undefined') {
 console.log(JSON.stringify(result,null,2));
 if(problems.length)process.exitCode=1;
}
