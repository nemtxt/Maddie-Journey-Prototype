/* Maddie Journey V4.3.5 — presentation/interaction contract.
 * Run: node tests/v435-depth-contract.js (no packages).
 * DOM contract only, not a browser screenshot or a performance benchmark.
 */
'use strict';
const source=typeof SOURCE==='string'?SOURCE:require('fs').readFileSync(require('path').join(__dirname,'..','maddie-v435-depth.js'),'utf8');
class Node {
 constructor(tag,classes='',text=''){
  this.tagName=tag;this.className=classes;this.textContent=text;this.parentNode=null;
  this.children=[];this.dataset={};this.attrs={};this._event={};this._set=new Set(classes.split(' ').filter(Boolean));
 }
 get className(){return this._classes||''}
 set className(v){this._classes=String(v);this._set=new Set(String(v).split(' ').filter(Boolean))}
 get classList(){const node=this;return{
  contains:name=>node._set.has(name),
  add:name=>{node._set.add(name);node.className=[...node._set].join(' ')},
  remove:name=>{node._set.delete(name);node.className=[...node._set].join(' ')},
  toggle:(name,on)=>{if(on===undefined)on=!node._set.has(name);on?node._set.add(name):node._set.delete(name);node.className=[...node._set].join(' ');return on}
 }}
 append(...children){for(const child of children){child.parentNode=this;this.children.push(child)}}
 before(node){const parent=this.parentNode;if(!parent)throw Error('before on detached');const index=parent.children.indexOf(this);node.parentNode=parent;parent.children.splice(index,0,node)}
 setAttribute(name,val){this.attrs[name]=String(val);if(name==='data-mj-v435-detail')this.dataset.mjV435Detail=String(val)}
 getAttribute(name){return this.attrs[name]??null}
 closest(selector){let e=this;while(e){if(selector==='.mj-v41-card'&&e._set.has('mj-v41-card'))return e;if(selector==='.mj-v435-inspectable'&&e._set.has('mj-v435-inspectable'))return e;e=e.parentNode}return null}
 matches(s){if(s==='.mj-v435-inspectable')return this._set.has('mj-v435-inspectable');return false}
 contains(n){while(n){if(n===this)return true;n=n.parentNode}return false}
 querySelectorAll(selector){
  if(selector==='circle.mj-v41-point')return this.children.filter(x=>x._set.has('mj-v41-point'));
  if(selector==='.mj-v41-card')return this.children.filter(x=>x._set.has('mj-v41-card'));
  if(selector==='.mj-v41-bar-row'||selector==='.mj-v41-legend-item'){
   return this.children.filter(x=>x._set.has(selector.slice(1)));
  }
  if(selector==='.mj-v4-kpi')return this.children.filter(x=>x._set.has('mj-v4-kpi'));
  if(selector==='.mj-v435-inspectable.is-highlighted'){
   return this.desc().filter(x=>x._set.has('mj-v435-inspectable')&&x._set.has('is-highlighted'));
  }
  return this.desc().filter(x=>{
   if(selector==='.mj-v435-readout')return x._set.has('mj-v435-readout');
   return false;
  });
 }
 desc(){return this.children.flatMap(x=>[x,...x.desc()])}
 querySelector(selector){
  if(selector==='svg.mj-v41-line')return this.children.find(x=>x._set.has('mj-v41-line'))||null;
  if(selector==='[aria-label]')return this.children.find(x=>!!x.attrs['aria-label'])||null;
  if(selector==='span'||selector==='strong')return this.children.find(x=>x.tagName===selector)||null;
  if(selector==='.mj-v41-card-footer')return this.children.find(x=>x._set.has('mj-v41-card-footer'))||null;
  if(selector==='.mj-v435-readout')return this.children.find(x=>x._set.has('mj-v435-readout'))||null;
  if(selector==='.mj-v435-readout-value')return this.desc().find(x=>x._set.has('mj-v435-readout-value'))||null;
  if(selector==='h2')return this.children.find(x=>x.tagName==='h2')||null;
  return null;
 }
 addEventListener(type,fn){this._event[type]=fn}
}
const n=(tag,classes='',text='')=>new Node(tag,classes,text);
const events={};
const root=n('main'),section=n('section','mj-v41');
const card=n('article','mj-v41-card'),other=n('article','mj-v41-card');
const line=n('svg','mj-v41-line');line.setAttribute('aria-label','Headcount trend: May, 43; June, 45');
const p1=n('circle','mj-v41-point'),p2=n('circle','mj-v41-point');
line.append(p1,p2);card.append(line);
const footer=n('div','mj-v41-card-footer');card.append(footer);
const bar=n('div','mj-v41-bar-row'),track=n('div');track.setAttribute('aria-label','Media: 6');bar.append(track);other.append(bar);
const legend=n('div','mj-v41-legend-item'),ln=n('span','','Regular'),lv=n('strong','','37');
legend.append(ln,lv);other.append(legend);
section.append(card,other);
const report=n('section','card'),heading=n('h2','','Needs attention');report.append(heading);
const kpis=n('div','mj-v4-kpis'),metricA=n('div','mj-v4-kpi'),metricB=n('div','mj-v4-kpi');kpis.append(metricA,metricB);
root.querySelectorAll=function(sel){
 if(sel==='.mj-v41')return[section];
 if(sel==='.g12 > .card')return[report];
 if(sel==='.mj-v4-kpis')return[kpis];
 return[];
};
const doc={getElementById:id=>id==='view'?root:null,body:{classList:{contains:t=>t==='mj-new'}},readyState:'complete',activeElement:null,createElement:tag=>n(tag)};
const loc={hash:'#overview'},window={};
class Observer{observe(){}}
new Function('document','window','MutationObserver','addEventListener','requestAnimationFrame','location',source)(
 doc,window,Observer,(type,fn)=>{events[type]=fn},cb=>cb(),loc
);
const failures=[],check=(name,condition)=>{if(!condition)failures.push(name)};
check('V4.3.5 API registered',window.MJ_V435?.version==='4.3.5');
check('Overview classification remains local to content',root.classList.contains('mj-v435-home'));
check('Existing needs attention panel identified',report.dataset.mjV435Card==='priority');
check('First chart is featured, other is companion',card.classList.contains('mj-v435-primary-chart')&&other.classList.contains('mj-v435-companion-chart'));
check('Existing KPI numbers remain unchanged',metricA.classList.contains('mj-v435-kpi-primary')&&metricB.classList.contains('mj-v435-kpi'));
check('Timeline SVG points are keyboard accessible',[p1,p2].every(x=>x.attrs.tabindex==='0'&&x.attrs.role==='img'));
check('Timeline point labels derived from original chart',p1.dataset.mjV435Detail==='May, 43'&&p2.dataset.mjV435Detail==='June, 45');
check('Bar is accessible and record label unaltered',bar.dataset.mjV435Detail==='Media: 6'&&bar.attrs.tabindex==='0');
check('Legend values accessible from original text',legend.dataset.mjV435Detail==='Regular: 37');
root._event.focusin({target:p2});
const readout=card.querySelector('.mj-v435-readout');
check('Focus opens contextual recorded-value readout',!!readout&&readout.classList.contains('is-visible'));
check('Point focus shows correct value',readout?.querySelector('.mj-v435-readout-value')?.textContent==='June, 45');
check('Readout uses polite accessibility announcement',readout?.attrs['aria-live']==='polite');
root._event.pointerover({target:bar});
check('Pointer inspection highlights original bar',bar.classList.contains('is-highlighted'));
check('No duplicate readouts after repeated inspection',card.querySelectorAll('.mj-v435-readout').length===1);
window.MJ_V435.refresh();
check('Repeated decoration does not duplicate chart classes',card.className.split(' ').filter(x=>x==='mj-v435-primary-chart').length===1);
loc.hash='#office';const newChart=n('article','mj-v41-card');section.append(newChart);
window.MJ_V435.refresh();
check('Office route excluded from chart decoration',!newChart.classList.contains('mj-v435-chart'));
const result={tests:16,passed:16-failures.length,failures};
if(typeof module!=='undefined'){
 console.log(JSON.stringify(result,null,2));
 if(failures.length)process.exitCode=1;
}
