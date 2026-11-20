/* Maddie Journey V4.1 — KPI Visualization & Executive Insights.
 * Every figure below is derived at render time from the existing MCD model.
 * The original reports remain the source of record and all data stays read-only.
 */
(function(){
 'use strict';
 const root=document.getElementById('view');
 if(!root)return;
 const NS='http://www.w3.org/2000/svg';
 const $=(s,r=root)=>r.querySelector(s);
 const el=(tag,cl,content)=>{
  const x=document.createElement(tag);
  if(cl)x.className=cl;
  if(content!==undefined&&content!==null)x.textContent=String(content);
  return x;
 };
 const svgEl=(tag,attrs)=>{
  const x=document.createElementNS(NS,tag);
  Object.entries(attrs||{}).forEach(([k,v])=>x.setAttribute(k,String(v)));
  return x;
 };
 const finite=n=>typeof n==='number'&&Number.isFinite(n);
 const number=v=>Number.isFinite(Number(v))?Number(v):0;
 const pct=(a,b)=>b>0?Math.round(100*a/b):0;
 const total=l=>l.reduce((a,x)=>a+number(x),0);
 const fmt=v=>number(v).toLocaleString('en-PH');
 const currentRoute=()=>{try{return decodeURIComponent(location.hash.slice(1)||'overview')}catch{return location.hash.slice(1)||'overview'}};
 const snapshot=()=>{
  const m=window.MCD||{},people=Array.isArray(m.EMP)?m.EMP:[],divisionEntries=Array.isArray(m.D)?m.D:[];
  const divisions=divisionEntries.map(([name])=>{
   const staff=people.filter(e=>e.dept===name);
   const o=m.OPS?.[name],valid=Boolean(o?.loaded&&o.stats);
   return {name,count:staff.length,staff,avgFile:staff.length?Math.round(total(staff.map(e=>e.f))/staff.length):null,
    lates:total(staff.map(e=>e.l30)),overdue:valid?number(o.stats.overdue):null,open:valid?number(o.stats.open):null};
  });
  const status={};
  const stages={};
  const levels={};
  people.forEach(e=>{
   const st=e.status||'Not recorded',stage=e.stage||'Not recorded',level=Number(e.orgLevel||e.lvl)||null;
   status[st]=(status[st]||0)+1;
   stages[stage]=(stages[stage]||0)+1;
   if(level!==null)levels['Level '+level]=(levels['Level '+level]||0)+1;
  });
  const model=m.model||{};
  const cases=Array.isArray(m.CASES)?m.CASES:[];
  const cstat={Open:0,'Closed or issued':0,Other:0};
  cases.forEach(c=>{
   const st=String(c.status||'');
   if(/close|resolv|done|complete|issued|served/i.test(st))cstat['Closed or issued']++;
   else if(/open|pending|progress|review|await|investig|for /i.test(st))cstat.Open++;
   else cstat.Other++;
  });
  const caseTypes={};cases.forEach(c=>{const k=c.kind||'Unclassified';caseTypes[k]=(caseTypes[k]||0)+1});
  const hc=Array.isArray(m.HC)?m.HC.map(Number):[];
  const mon=Array.isArray(m.MON)?m.MON.slice():[];
  const late=Array.isArray(m.TL)?m.TL.map(Number):[];
  const pipeline=Array.isArray(m.PIPE)?m.PIPE.map(([n,c])=>[n,number(c)]):[];
  const events=Array.isArray(model.culture?.events)?model.culture.events:[];
  const training=events.filter(e=>/training|orientation|onboarding|workshop|learning|webinar|seminar|coach|assessment|revalida/i.test(e.title||''));
  const jobCount=people.filter(e=>e.comp?.basic!==null&&e.comp?.basic!==undefined&&e.comp.basic!==''&&Number.isFinite(Number(e.comp.basic))).length;
  return {
   people,divisions,status,stages,levels,cases,cstat,caseTypes,mon,hc,late,pipeline,model,
   events,training,salaryRecords:jobCount,
   incomplete:people.filter(e=>number(e.f)<100).length,
   fileAverage:people.length?Math.round(total(people.map(e=>e.f))/people.length):null,
   missingId:people.filter(e=>!e.hasId).length,
   late30:total(people.map(e=>e.l30)),
   repeatLate:people.filter(e=>number(e.l90)>=3).length,
   overdueDivisions:divisions.filter(d=>d.overdue!==null),
   highRisk:(m.EXC||[]).filter(x=>x.sev==='Critical'||x.sev==='High').length,
   routine:(m.EXC||[]).filter(x=>x.sev==='Routine').length,
   talent:model.talent||{},
   birth:(model.culture?.birthdays||[]).length,
   anniversaries:(model.culture?.anniversaries||[]).length,
   upcoming:(model.journey?.upcoming||[]).length
  };
 };
 const heading=(title,subtitle,action)=>{
  const head=el('div','mj-v41-heading');
  const left=el('div','mj-v41-heading-copy');
  left.append(el('span','mj-v41-eyebrow','DATA-DRIVEN INSIGHTS'),el('h2','',title),el('p','',subtitle));
  head.append(left);
  if(action){
   const a=el('a','mj-v41-more','Open detailed report');
   a.href='#'+action;
   head.append(a);
  }
  return head;
 };
 const card=(title,detail)=>{
  const c=el('article','mj-v41-card');
  const h=el('header','mj-v41-card-head');
  h.append(el('h3','',title),el('p','',detail));
  c.append(h);
  return c;
 };
 const finish=(c,label,href)=>{
  if(!label&&!href)return c;
  const foot=el('div','mj-v41-card-footer');
  if(label)foot.append(el('span','',label));
  if(href){const a=el('a','', 'View records');a.href='#'+href;foot.append(a)}
  c.append(foot);
  return c;
 };
 const empty=(c,why)=>{
  c.append(el('p','mj-v41-empty',why||'No comparable records are available in this sample.'));
  return c;
 };
 const lineCard=(title,detail,labels,values,footer,href)=>{
  const c=card(title,detail);
  const series=values.map(Number);
  if(series.length<2||series.some(x=>!finite(x)))return finish(empty(c),footer,href);
  const min=Math.min(...series),max=Math.max(...series);
  const floor=Math.max(0,Math.floor(min/5)*5-(min===max?5:0));
  const ceiling=Math.max(max+1,Math.ceil(max/5)*5+Math.max(1,Math.ceil((max-min)/4)));
  const W=560,H=146,left=34,right=12,top=13,bottom=22;
  const w=W-left-right,h=H-top-bottom,span=Math.max(1,ceiling-floor);
  const points=series.map((v,i)=>[left+i*w/(series.length-1),top+h-(v-floor)*h/span]);
  const svg=svgEl('svg',{viewBox:'0 0 '+W+' '+H,'class':'mj-v41-line',role:'img','aria-label':title+': '+series.map((v,i)=>(labels[i]||i)+', '+v).join('; ')});
  svg.append(svgEl('title',{}));svg.lastChild.textContent=title;
  for(let i=0;i<=2;i++){
   const y=top+i*h/2;
   svg.append(svgEl('line',{x1:left,y1:y,x2:W-right,y2:y,'class':'mj-v41-grid-line'}));
  }
  const d=points.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  svg.append(svgEl('path',{d,'class':'mj-v41-line-path'}));
  points.forEach(p=>svg.append(svgEl('circle',{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:2.8,'class':'mj-v41-point'})));
  c.append(svg);
  const axis=el('div','mj-v41-axis');
  const first=String(labels[0]||'Start'),last=String(labels[labels.length-1]||'Latest');
  const net=series[series.length-1]-series[0];
  const result=el('strong','mj-v41-delta',(net>0?'+':'')+fmt(net));
  result.title='First recorded period to last recorded period; not an annualized rate';
  axis.append(el('span','',first),result,el('span','',last));
  c.append(axis);
  return finish(c,footer,href);
 };
 const barCard=(title,detail,pairs,footer,href,options={})=>{
  const c=card(title,detail);
  if(!pairs.length)return finish(empty(c),footer,href);
  const entries=pairs.filter(x=>finite(Number(x[1]))&&Number(x[1])>=0);
  if(!entries.length)return finish(empty(c),footer,href);
  const max=options.max||Math.max(1,...entries.map(x=>Number(x[1])));
  const list=el('div','mj-v41-bars');
  entries.slice(0,options.limit||8).forEach(([label,value])=>{
   const row=el('div','mj-v41-bar-row');
   const top=el('div','mj-v41-bar-meta');
   top.append(el('span','',label),el('strong','',fmt(value)+(options.unit||'')));
   const track=el('div','mj-v41-track');
   track.setAttribute('role','img');
   track.setAttribute('aria-label',label+': '+fmt(value)+(options.unit||''));
   const fill=el('i','mj-v41-bar-fill');
   fill.style.width=Math.min(100,Math.max(0,100*number(value)/max))+'%';
   track.append(fill);
   row.append(top,track);list.append(row);
  });
  c.append(list);
  return finish(c,footer,href);
 };
 const mixCard=(title,detail,pairs,footer,href)=>{
  const c=card(title,detail);
  const entries=pairs.filter(([k,v])=>number(v)>0);
  const count=total(entries.map(x=>x[1]));
  if(!count)return finish(empty(c),footer,href);
  const stack=el('div','mj-v41-stack');stack.setAttribute('role','img');
  stack.setAttribute('aria-label',entries.map(([k,v])=>k+': '+v+' ('+pct(v,count)+'%)').join('; '));
  entries.forEach(([label,value],i)=>{
   const segment=el('span','mj-v41-stack-segment mj-v41-segment-'+(i%5));
   segment.style.width=pct(value,count)+'%';
   segment.title=label+': '+value;
   stack.append(segment);
  });
  c.append(stack);
  const legend=el('div','mj-v41-legend');
  entries.forEach(([label,value],i)=>{
   const item=el('div','mj-v41-legend-item');
   item.append(el('i','mj-v41-legend-dot mj-v41-segment-'+(i%5)),el('span','',label),el('strong','',fmt(value)));
   legend.append(item);
  });
  c.append(legend);
  return finish(c,footer,href);
 };
 const ringCard=(title,detail,value,rows,footer,href)=>{
  const c=card(title,detail);
  if(!finite(value))return finish(empty(c),footer,href);
  const body=el('div','mj-v41-ring-layout');
  const ring=el('div','mj-v41-ring');
  ring.style.setProperty('--mj-v41-pct',Math.min(100,Math.max(0,value))+'%');
  ring.setAttribute('role','img');ring.setAttribute('aria-label',title+': '+value+' percent');
  ring.append(el('strong','',fmt(value)+'%'));
  const list=el('dl','mj-v41-ring-stats');
  rows.forEach(([label,val])=>{
   list.append(el('dt','',label),el('dd','',String(val)));
  });
  body.append(ring,list);c.append(body);
  return finish(c,footer,href);
 };
 const pairsOf=obj=>Object.entries(obj||{}).map(([k,v])=>[k,number(v)]);
 const staffLevels=staff=>{
  const counts={};
  staff.forEach(e=>{const n=Number(e.orgLevel||e.lvl);if(n>=1&&n<=6){const k='Level '+n;counts[k]=(counts[k]||0)+1}});
  return Array.from({length:6},(_,i)=>['Level '+(i+1),counts['Level '+(i+1)]||0]);
 };
 const casesBreakdown=d=>mixCard('Case status distribution','Classified from recorded case statuses; unknown labels remain Other.',
  pairsOf(d.cstat),'People Governance · sample','governance:case-status');
 const teamOverdue=d=>barCard('Overdue tasks by division','Only divisions with mapped Chiefs’ Hub task records are included.',
  d.overdueDivisions.map(x=>[x.name,x.overdue]).sort((a,b)=>b[1]-a[1]),
  d.overdueDivisions.length+' of '+d.divisions.length+' divisions with mapped task data','divisions',{max:Math.max(1,...d.overdueDivisions.map(x=>x.overdue))});
 const divisionCounts=d=>barCard('Headcount by division','Employee counts from the fictional People Directory.',
  d.divisions.map(x=>[x.name,x.count]),'Company workforce · '+fmt(d.people.length)+' people','people:masterlist');
 const workforceTrend=d=>lineCard('Workforce trend','Recorded headcount across available reporting months.',
  d.mon,d.hc,'Recorded monthly headcount · not a forecast','scoreboard:headcount');
 const lateTrend=d=>lineCard('Monthly late entries','Recorded lates by month; counts are events, not unique employees.',
  d.mon,d.late,'Attendance events · fictional tracker','pulse:monthly');
 const stageMix=d=>mixCard('Employee journey stages','Current employee journey-stage classification.',
  pairsOf(d.stages),'People directory & development records','journey:profile');
 const levelBars=d=>barCard('Workforce by level','Role levels, not individual reporting relationships.',
  staffLevels(d.people),'Current fictional workforce','people:masterlist');
 const lateDivisions=d=>barCard('Lates by division · 30 days','Counts represent recorded late entries, not unique people.',
  d.divisions.map(x=>[x.name,x.lates]).sort((a,b)=>b[1]-a[1]),
  'Attendance records · last 30 days','pulse:division-att');
 const incompleteBars=d=>barCard('201-file completeness by division','Average completion of tracked required documents for each employee.',
  d.divisions.filter(x=>x.avgFile!==null).map(x=>[x.name,x.avgFile]).sort((a,b)=>a[1]-b[1]),
  'Percentages are per-division averages','people:documents',{max:100,unit:'%'});
 const docsRing=d=>ringCard('201-file completion','Mean employee completion across tracked required documents.',
  d.fileAverage,[['Employees with incomplete files',fmt(d.incomplete)],['Employee IDs missing',fmt(d.missingId)]],
  'Averages are not proof of verified compliance','people:documents');
 const statusMix=d=>mixCard('Employment status','Employment classifications across the current roster.',
  pairsOf(d.status),'Roster status · not benefits enrollment','people:masterlist');
 const pipeline=d=>barCard('Recruitment pipeline','Candidate count in each recorded stage; stages are not a conversion forecast.',
  d.pipeline,'Candidate-stage snapshot','talent:recruitment-pipeline',{limit:8});
 const priorities=d=>mixCard('Recorded priority signals','Severity of monitoring exceptions generated from current sample records.',
  [['High / critical',d.highRisk],['Routine',d.routine]],
  'Risk labels come from the prototype exception model','scoreboard:risks');
 const monthComparison=d=>{
  const last=d.mon.length-1;
  if(last<1||d.hc.length<2)return barCard('Month-over-month workforce','Comparable prior periods are not available.',[],'No fabricated comparison','scoreboard:headcount');
  return barCard('Latest headcount comparison','Actual recorded headcount for the two latest periods.',
   [[d.mon[last-1],d.hc[last-1]],[d.mon[last],d.hc[last]]],
   'Net '+(d.hc[last]-d.hc[last-1]>=0?'+':'')+(d.hc[last]-d.hc[last-1])+' employees','scoreboard:headcount');
 };
 const calendarCard=d=>{
  const c=card('Scheduled People & Culture activity','Upcoming items recorded in the current fictional calendar snapshot.');
  const list=el('div','mj-v41-mini-stats');
  [['Calendar events',d.events.length],['Birthdays',d.birth],['Work anniversaries',d.anniversaries]].forEach(([l,v])=>{
   const stat=el('div','mj-v41-mini-stat');
   stat.append(el('strong','',fmt(v)),el('span','',l));list.append(stat);
  });
  c.append(list);
  return finish(c,'Calendar-derived counts · sample','culture:milestones');
 };
 const learningCard=d=>{
  const c=card('Learning-related calendar signals','Counts use activity titles containing training, workshop, orientation or similar terms.');
  const list=el('div','mj-v41-mini-stats');
  [['Related events',d.training.length],['All P&C events',d.events.length],['Development checkpoints',d.upcoming]].forEach(([l,v])=>{
   const item=el('div','mj-v41-mini-stat');
   item.append(el('strong','',fmt(v)),el('span','',l));list.append(item);
  });
  c.append(list);
  return finish(c,'Title-matched counts, not confirmed training completion','learning');
 };
 const talentCard=d=>{
  const c=card('Recruitment volume','Open position and candidate counts from the current fictional source.');
  const list=el('div','mj-v41-mini-stats');
  [['Open roles',number(d.talent.open)],['Candidates',number(d.talent.candidates?.total)],['Interview records',number(d.talent.interviews?.total)]].forEach(([l,v])=>{
   const item=el('div','mj-v41-mini-stat');item.append(el('strong','',fmt(v)),el('span','',l));list.append(item);
  });
  c.append(list);
  return finish(c,'No hiring target or conversion rate is inferred','talent');
 };
 const payrollCard=d=>ringCard('Basic salary record coverage','Recorded basic-salary fields; not a payroll accuracy audit.',
  pct(d.salaryRecords,d.people.length),
  [['Records with basic salary',fmt(d.salaryRecords)],['Employee records',fmt(d.people.length)]],
  'Aggregate field presence only · no amounts shown','pay:salary');
 const caseKinds=d=>barCard('Case types','Distribution of recorded incidents, notices and improvement cases.',
  pairsOf(d.caseTypes).sort((a,b)=>b[1]-a[1]),
  'Unclassified statuses are not treated as closed','governance:case-status');
 const docsBands=d=>{
  const bins=[['Below 50%',0],['50–79%',0],['80–99%',0],['100%',0]];
  d.people.forEach(e=>{const n=number(e.f);bins[n<50?0:n<80?1:n<100?2:3][1]++});
  return barCard('Document-completion bands','People grouped by their recorded 201-file completion percentage.',
   bins,'Fictional 201-file tracker','people:documents');
 };
 const divisionPanels=(d,name)=>{
  const dept=d.divisions.find(x=>x.name===name);
  if(!dept)return[];
  return [
   barCard('Division level distribution','Employee count within each recorded role level.',
    staffLevels(dept.staff),dept.count+' employees · '+name,'division/'+encodeURIComponent(name)),
   ringCard('Division 201-file completion','Average completion of required tracker documents for this division.',
    dept.avgFile,[['Incomplete employee files',dept.staff.filter(e=>number(e.f)<100).length],
      ['Late entries · 30 days',fmt(dept.lates)]],
    'Division-specific sample records','people:documents')
  ];
 };
 function configuration(h,d){
  if(h==='overview')return {title:'Workforce intelligence',note:'Company-wide trends and workforce mix, drawn from the existing fictional reporting model.',
   cards:[workforceTrend(d),divisionCounts(d)],link:'people:masterlist'};
  if(h==='divisions')return {title:'Division intelligence',note:'Compare headcount and document-completion patterns across the company.',
   cards:[divisionCounts(d),incompleteBars(d)],link:'divisions'};
  if(h.startsWith('division/')){
   const name=h.slice('division/'.length);
   return {title:'Division intelligence',note:'Level structure and document signals for '+name+'.',
    cards:divisionPanels(d,name),link:''};
  }
  if(h.startsWith('view/')){
   const v=h.slice('view/'.length);
   const c={
    ceo:[workforceTrend(d),teamOverdue(d)],
    coo:[divisionCounts(d),lateTrend(d)],
    cso:[stageMix(d),levelBars(d)],
    pc:[docsBands(d),lateDivisions(d)],
    monthly:[monthComparison(d),lateTrend(d)]
   };
   if(v==='division'){
    const chosen=$('.divpick button[aria-pressed="true"]')?.dataset.divsel||d.divisions[0]?.name;
    return {title:'Division head intelligence',note:'Read-only level and document indicators for the selected division.',
     cards:divisionPanels(d,chosen),link:''};
   }
   if(!c[v])return null;
   return {title:'Executive intelligence',note:'Comparative indicators tailored to the selected leadership view.',
    cards:c[v],link:''};
  }
  if(h==='reports')return {title:'Executive intelligence',note:'Company-wide workforce and priority signals before opening a leadership report.',
   cards:[workforceTrend(d),priorities(d)],link:'view/ceo'};
  const map={
   people:{title:'People Directory insights',note:'Employment composition and required-document reporting.',cards:[statusMix(d),docsRing(d)]},
   pay:{title:'Pay & Benefits insights',note:'Field coverage and status mix without exposing payroll amounts.',cards:[payrollCard(d),statusMix(d)]},
   pulse:{title:'Workforce Pulse insights',note:'Attendance event trends and division comparisons.',cards:[lateTrend(d),lateDivisions(d)]},
   journey:{title:'Career Journey insights',note:'Recorded journey stages and organizational levels.',cards:[stageMix(d),levelBars(d)]},
   learning:{title:'Learning insights',note:'Available event and development-checkpoint counts; no inferred course completions.',cards:[learningCard(d)]},
   culture:{title:'Culture & Community insights',note:'Available calendar milestones, not engagement scores.',cards:[calendarCard(d)]},
   talent:{title:'Recruitment insights',note:'Candidate pipeline stages and recorded hiring activity.',cards:[pipeline(d),talentCard(d)]},
   governance:{title:'People Governance insights',note:'Recorded case statuses and categories; unknown labels remain Other.',cards:[casesBreakdown(d),caseKinds(d)]},
   scoreboard:{title:'Executive Scoreboard insights',note:'Mapped overdue tasks and recorded priority signals.',cards:[teamOverdue(d),priorities(d)]}
  };
  return map[h]||null;
 }
 function render(){
  scheduled=false;
  if(!document.body.classList.contains('mj-new'))return;
  const h=currentRoute();
  if(h==='office'||document.body.classList.contains('hxon'))return;
  const data=snapshot(),key=h+'|'+String(window.MCD?.gen||0);
  const current=$('[data-mj-v41]');
  if(current?.dataset.mjV41===key)return;
  if(current)current.remove();
  const cfg=configuration(h,data);
  if(!cfg||!cfg.cards.length)return;
  const panel=el('section','mj-v41');
  panel.dataset.mjV41=key;
  panel.setAttribute('aria-label',cfg.title);
  panel.append(heading(cfg.title,cfg.note,cfg.link));
  const grid=el('div','mj-v41-grid');
  cfg.cards.forEach(c=>grid.append(c));
  panel.append(grid);
  const note=el('p','mj-v41-source-note','Fictional sample data • Comparisons describe recorded values only; no targets or forecasts are assumed.');
  panel.append(note);
  const page=$('.mj-page');
  if(page){
   const kpis=$('.mj-metrics',page);
   const start=$('.mj-intro',page);
   if(kpis){kpis.after(panel);return}
   if(start){start.after(panel);return}
   const head=$('.mj-head',page);
   if(head){head.after(panel);return}
   page.prepend(panel);return;
  }
  const firstGrid=$('.g12');
  if(h==='view/division'){
   const pick=$('.divpick')?.closest('.card');
   if(pick){pick.after(panel);return}
  }
  if(firstGrid){firstGrid.before(panel);return}
  const head=$('.ph,.mj-head');
  if(head){head.after(panel);return}
  root.prepend(panel);
 }
 let scheduled=false;
 const queue=()=>{
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(render);
 };
 const observer=new MutationObserver(records=>{
  if(records.some(r=>r.target===root||Array.from(r.addedNodes).some(n=>{
   if(n.nodeType!==1||n.matches?.('.mj-v41,.mj-v41-report-divider'))return false;
   return n.matches?.('.mj-page,.ph,.mj-head,.g12,.divpick')||
    Boolean(n.querySelector?.('.mj-page,.ph,.g12,.divpick'));
  })))queue();
 });
 observer.observe(root,{subtree:true,childList:true});
 addEventListener('hashchange',queue);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
 window.MJ_V41={version:'4.1',refresh:queue,metrics:snapshot};
})();
