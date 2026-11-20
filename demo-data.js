/* Fictional demonstration data. This file never reads a real organization or connector. */
(function(){'use strict';
 /* User-supplied organization-chart names are represented as demo aliases;
  * no connected employee records, salary records, or identifiers are imported.
  * Top/core tiers are organization-chart placement only; original records keep
  * stable generated IDs and independently simulated employment information. */
 const referenceRoster=[
 {
  "div": "RMD",
  "name": "Trizia",
  "role": "Chief Experience Officer",
  "level": 0,
  "tier": "top"
 },
 {
  "div": "RMD",
  "name": "Josh",
  "role": "Team Member",
  "level": 5,
  "tier": "division"
 },
 {
  "div": "RMD",
  "name": "Faye",
  "role": "Team Member",
  "level": 4,
  "tier": "division"
 },
 {
  "div": "RMD",
  "name": "Ange",
  "role": "Team Member",
  "level": 4,
  "tier": "division"
 },
 {
  "div": "RMD",
  "name": "Abigael",
  "role": "Team Member",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "RMD",
  "name": "Richard Q.",
  "role": "Team Member",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "RMD",
  "name": "Jocelyn",
  "role": "Team Member",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "RMD",
  "name": "Catherine",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "RMD",
  "name": "Yvette",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "Zach",
  "role": "Principal Designer",
  "level": 0,
  "tier": "core"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "A.J.T.",
  "role": "Design Operations Manager",
  "level": 0,
  "tier": "core"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "Chano",
  "role": "Madhouse Design Partner",
  "level": 6,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "Albert",
  "role": "Team Member",
  "level": 5,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "AJ",
  "role": "Team Member",
  "level": 5,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "Regie",
  "role": "Team Member",
  "level": 4,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "Charmaine",
  "role": "Team Member",
  "level": 4,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "Ysac",
  "role": "Team Member",
  "level": 4,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "Marx",
  "role": "Team Member",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "John Ray",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "DESIGN/OPERATION",
  "name": "Erika",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Inigo",
  "role": "Chief Operations Officer",
  "level": 0,
  "tier": "top"
 },
 {
  "div": "CORP OPS",
  "name": "Clai",
  "role": "Director of Operations",
  "level": 0,
  "tier": "core"
 },
 {
  "div": "CORP OPS",
  "name": "Patricia",
  "role": "Finance Manager",
  "level": 6,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Kurt",
  "role": "Team Member",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Herman",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Ragnor",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Elmer",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Kate",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Joy",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Shadeline",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "CORP OPS",
  "name": "Jimmy",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "MEDIA",
  "name": "Michelle",
  "role": "Media Manager (Interim)",
  "level": 6,
  "tier": "division"
 },
 {
  "div": "MEDIA",
  "name": "Justine",
  "role": "Media Head",
  "level": 5,
  "tier": "division"
 },
 {
  "div": "MEDIA",
  "name": "Miggy",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "MEDIA",
  "name": "Lemuel",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "MEDIA",
  "name": "Domz",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "MEDIA",
  "name": "Ian",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "COO TEAM",
  "name": "Sean",
  "role": "Team Member",
  "level": 4,
  "tier": "division"
 },
 {
  "div": "COO TEAM",
  "name": "Janjo",
  "role": "Team Member",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "COO TEAM",
  "name": "Chris",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "GENCON",
  "name": "Shane",
  "role": "Team Member",
  "level": 5,
  "tier": "division"
 },
 {
  "div": "GENCON",
  "name": "Stephen",
  "role": "Team Member",
  "level": 4,
  "tier": "division"
 },
 {
  "div": "GENCON",
  "name": "Fatima",
  "role": "Team Member",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "GENCON",
  "name": "David",
  "role": "Team Member",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "GENCON",
  "name": "New QA/QC Hire",
  "role": "Vacant QA/QC role (demo)",
  "level": 3,
  "tier": "division"
 },
 {
  "div": "GENCON",
  "name": "Richard S.",
  "role": "Team Member",
  "level": 2,
  "tier": "division"
 },
 {
  "div": "BUSINESS DEV",
  "name": "Tin",
  "role": "Business Development Division Head",
  "level": 0,
  "tier": "core"
 },
 {
  "div": "BUSINESS DEV",
  "name": "Marc Kevin",
  "role": "Team Member",
  "level": 1,
  "tier": "division"
 },
 {
  "div": "CEO TEAM",
  "name": "Gila",
  "role": "Chief Executive Officer",
  "level": 0,
  "tier": "top"
 },
 {
  "div": "CEO TEAM",
  "name": "Sachi",
  "role": "Chief Strategy Officer / Chief of Staff",
  "level": 0,
  "tier": "top"
 },
 {
  "div": "CEO TEAM",
  "name": "Alyssa",
  "role": "Chief of External Affairs",
  "level": 0,
  "tier": "core"
 }
];
 const referenceByRecord=new Map();
 const divisions=[['RMD','Revenue Management'],['DESIGN/OPERATION','Design & Operations'],['CORP OPS','Corporate Operations'],['MEDIA','Media'],['COO TEAM','IT Operations'],['GENCON','General Construction'],['BUSINESS DEV','Business Development'],['CEO TEAM','Executive Office']];
 const roles=['Division Head','Operations Specialist','Senior Analyst','Coordinator','Project Officer','Design Associate','Team Supervisor','People Operations Associate'];
 const F={id:'fldqkxggPg5zwh4Ab',first:'flddzBNWtDWYM8jn1',last:'fldo1b8IVG8guhPg0',dept:'flduz4B2OAtIZ8LjG',pos:'fldRagX7PCDhmAzkx',status:'fld9fvRtbONcAEg7C',hire:'fldrluTRKtUIcNYZB',reg:'fldEM5tCqpdj1bwQS',bday:'fldIDTYfwZ9q8Kv7Q'},
 FX={basic:'fldKTwBAsFz92UjAO',current:'fldfLJ4lCqi6mElgi',daily:'fldwcg6o000a1EydJ',allowance:'fldrn7j2AgLPRRGIm',gross:'fldnPmWnQEK4qwL5H',ptype:'fldsRHYVSiMpa2KaT',sss:'fldPV7FA6RyE40xCN',philhealth:'fld6tuZBAGXSgclf2',pagibig:'fldyOo2oiYX6eazOt',tin:'fldXfMS9rFj13nyEC',cemail:'fldApyDu1G4tIQiGN',pemail:'fldLjTPi4jyk8Dehy',phone:'fldaTUisJryAbsA9K',address:'fldJQ9bbhTTfkPFoB',ecName:'fldluSZhVMH7JaE2r',ecPhone:'fld0huQZ6OTqSHuEi',ecRel:'fldPYPbeDcsffryad'},
 docs=['fldRnY9UcaEj3NnGJ','fldUQu41piUR6NCOn','fld1EWGsUs4BQcbmt','fld6LQ9nqOkbPt4R2','fldzLpBNpWVbVjZuy','fldaRAqh4gAUbFsZr','fldOyHxm0gi4fk5XJ','fldKHdrfIO1zoIuRc','fldBJ4y99VsfgC5sF','fldQ3ueVI9bvkT1iK'];
 const today=new Date('2026-11-20T12:00:00+08:00'),dateOffset=n=>new Date(today.getTime()+n*86400000).toISOString().slice(0,10),rec=(id,fields)=>({id,cellValuesByFieldId:fields}),raw={};
 let people=[],attendance=[],development=[];
 for(let i=0;i<51;i++){
   const sample=referenceRoster[i],div=divisions.find(d=>d[0]===sample.div);
   const words=sample.name.split(/\s+/),name=words.shift(),surname=words.join(' ');
   const status=i%7===0?'Probationary':i%17===0?'Part-Time':'Regular';
   const hire=dateOffset(status==='Probationary'?-(40+i%5*18):-(450+i*12)),monthly=24000+i%9*3900,fields={
     [F.id]:i%13===0?'':String(100100+i),[F.first]:name,[F.last]:surname,[F.dept]:[{id:'dep'+(i%8),name:div[0]}],
     [F.pos]:sample.role==='Team Member'?('Team Member · Level '+sample.level):sample.role,[F.status]:status,[F.hire]:hire,[F.reg]:status==='Regular'?dateOffset(-220-i*11):'',[F.bday]:'199'+i%10+'-'+String(i%12+1).padStart(2,'0')+'-'+String((i*3)%27+1).padStart(2,'0'),
     [FX.basic]:monthly,[FX.current]:monthly,[FX.daily]:Math.round(monthly/22),[FX.allowance]:1500+i%4*500,[FX.gross]:monthly+1500+i%4*500,[FX.ptype]:'Monthly',
     [FX.sss]:i%5===0?'':'SAMPLE-SSS-'+(10000+i),[FX.philhealth]:'SAMPLE-PH-'+(20000+i),[FX.pagibig]:i%6===0?'':'SAMPLE-PAG-'+(30000+i),[FX.tin]:i%8===0?'':'SAMPLE-TIN-'+(40000+i),
     [FX.cemail]:(sample.name.toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.|\.$/g,'')+i+'@example.com'),[FX.pemail]:'sample'+i+'@example.net',[FX.phone]:'09XX-XXX-'+String(i).padStart(4,'0'),[FX.address]:'Fictional address, Metro Manila', [FX.ecName]:'Demo Emergency Contact',[FX.ecPhone]:'09XX-000-0000',[FX.ecRel]:'Family'};
   docs.forEach((d,j)=>{if(i%3===0||(i+j*3)%8!==0)fields[d]=[{id:'attachment'+i+'_'+j}]});
   const rid='recDemo'+String(i).padStart(7,'0');people.push(rec(rid,fields));
   referenceByRecord.set(rid,sample);
   if(i%4===0){for(let n=0;n<1+i%3;n++)attendance.push(rec('recAtt'+i+'_'+n,{fldfJzllNfMpJoTvN:[{id:rid}],fldN9MmrWvdDAB6wu:dateOffset(-((i+n)%27+1)),fldJMbl3NVma2kNSw:'Late'}))}
   if(i%9===0)attendance.push(rec('recLeave'+i,{fldfJzllNfMpJoTvN:[{id:rid}],fldN9MmrWvdDAB6wu:dateOffset(-(i%16+2)),fldJMbl3NVma2kNSw:'Vacation Leave'}));
   if(status==='Probationary')development.push(rec('recDev'+i,{fldGPGsYzmKwexrA2:[{id:rid}],fldgVvnkOgIrmEQeS:'Probationary Review',fldOJ6Ra6KQly5B1T:i%2?'In Progress':'For Evaluation',fldF62Y49plNBLs2h:'Pending',fldQxCSJ8MChl8dUm:'Pending'}));
 }
 raw.people={records:people};raw.attendance={records:attendance};raw.development={records:development};
 // Independent fictional masterlist for reconciliation examples.
 raw.masterlist={values:[['Employee ID','Status'],...people.filter(p=>String(p.cellValuesByFieldId[F.id]||'').trim()).map(p=>[String(Number(p.cellValuesByFieldId[F.id])).padStart(4,'0'),p.cellValuesByFieldId[F.status]])]};
 raw.positions={records:[['Project Coordinator','Open','High','Design',2,34],['Media Producer','Open','Medium','Media',1,19],['IT Support Associate','Open','Medium','IT',1,16],['Account Manager','Filled','High','RMD',1,28]].map((a,i)=>rec('recPosition'+i,{fldoPkNj8xkWpCgnO:a[0],fldQfak76TS9OyDWV:a[1],fldry8KfkqcSAHTYg:a[2],fldPkDJQGbFbqXpaQ:a[3],fldjc5JZXJbJx3smj:a[4],fldcdhnPrAovLIXng:a[5],fld8yMa7ENNVwOgjH:6+i*2,fldhPDrEGeoVWOCIB:2+i,fldpY7uxNhBu4cZ7I:a[1]==='Filled'?1:0}))};
 raw.candidates={records:Array.from({length:18},(_,i)=>rec('recCandidate'+i,{fldIBuCFFCbeIsWhJ:['Screening','Interview','Assessment','Offer'][i%4],fld0Sgf4AzOiftmSB:i%7?'Pending':'Accepted',fldWvVNTdGG7oCoyw:['Referral','Job Board','Social Media'][i%3],fldJ2cmflo5edDrSf:1+i%22}))};
 raw.interviews={records:Array.from({length:9},(_,i)=>rec('recInterview'+i,{fldEZhPlyR6WAcwMF:['Initial','Technical','Final'][i%3],fldVYtklu50x2JFqr:['HR','Division Head','Executive'][i%3],fldxKtbLpPBVOTjAm:75+i%24,fldmLm0vvF5KaQ2Wa:dateOffset(-i-2)}))};
 raw.calendar={events:[{summary:'P&C Company Town Hall',start:{date:dateOffset(4)}},{summary:'Onboarding Orientation',start:{date:dateOffset(7)}},{summary:'Maddie Hour Team Session',start:{date:dateOffset(9)}},{summary:'P&C Training Workshop',start:{date:dateOffset(15)}},{summary:'P&C General Assembly',start:{date:dateOffset(28)}}]};
 raw.holidays={events:[{summary:'Christmas Day',start:{date:'2026-12-25'}},{summary:'Bonifacio Day',start:{date:'2026-11-30'}}]};
 function addExtra(key,data,fields){raw[key]={records:data.map((row,i)=>rec('recDemo'+key+i,Object.fromEntries(Object.keys(fields).map(k=>[fields[k],row[k]??'']))))}}
 addExtra('kpis',[{kpi:'Employee Experience Index',facet:'Culture',pct:82,status:'On Track',prio:'High'},{kpi:'201 File Completion',facet:'Governance',pct:89,status:'In Progress',prio:'High'},{kpi:'Quarterly Recruitment Cycle',facet:'Talent',pct:74,status:'At Risk',prio:'Medium'}],{kpi:'fldD7gscHNGizQoMF',facet:'fldeB4mBGKT4hXfVg',pct:'fldCBJgYZ9kDxW344',status:'fld2WcMBtOx83WeTL',prio:'fldKFTfDPzKj80YcV'});
 addExtra('wigs',[{name:'Strengthen people experience',health:'On Track',target:'90% engagement',progress:78,inits:4,reds:1,year:'2027'},{name:'Complete workforce documentation',health:'Watch',target:'100% files',progress:85,inits:3,reds:2,year:'2027'}],{name:'fldj1mH4sZUISDCfV',health:'fldjUGMe5S5botlzz',target:'fldQyLtvTIWRTJ81H',progress:'fldJHQx14iUbVLHMV',inits:'fldxzknnt8S6TH08j',reds:'fld4kNKlZlfdIk1I2',year:'fldprEYnbWaBnbQwZ'});
 addExtra('decisions',[{decision:'Confirm Q1 learning budget',type:'Financial',owner:'Executive Team',due:dateOffset(8),status:'Pending',context:'Fictional example for the dashboard'},{decision:'Review recruitment plan',type:'People',owner:'Division Heads',due:dateOffset(12),status:'In Review',context:'Fictional example for the dashboard'}],{decision:'fldihmzzWijGZ8t5J',type:'fldAPVVuLIqGRgVBz',owner:'flddbp6FBVmNhD3cY',due:'fld5DIsOmo1APAkWn',status:'fldXAM6LQxMBSFZ9X',context:'fldNglqTyZFVykQto'});
 addExtra('pctasks',[{task:'Review outstanding documents',who:'People Team',facet:'Compliance',prio:'High',due:dateOffset(4),status:'Ongoing',tstatus:'In Progress'},{task:'Prepare quarterly review',who:'People Team',facet:'Performance',prio:'Medium',due:dateOffset(13),status:'Planned',tstatus:'To Do'}],{task:'fldtTo7YF9cE6v5mu',who:'fldOw6AvHi1lnxbru',facet:'fldP82dLtkfFU2EZj',prio:'fldHkOKaORpZcevKH',due:'fldlXTUsoGhYOjYvc',status:'fld2zDs6OPKDF56wa',tstatus:'fldyUZVu1PlpJhq5Q'});
 addExtra('memos',[{title:'Workplace Conduct Guidelines',no:'DEMO-001',date:dateOffset(-22),eff:dateOffset(-20),cat:'Policy',status:'Issued'},{title:'Quarterly Learning Calendar',no:'DEMO-002',date:dateOffset(-5),eff:dateOffset(1),cat:'Training',status:'Published'}],{title:'fldCEINSZq6jHTrUU',no:'fldu7Vmu8bezwIEvT',date:'fldRPplSvkRB12fkn',eff:'fld89QWlqxOvKigow',cat:'fld3uOTgBkecw0r78',status:'fldzmOJ2ty7g7gB46'});
 addExtra('initiatives',[{name:'2027 People Experience Programme',div:'Company-wide',impact:'High',target:dateOffset(30),conf:'High',blocker:'None',next:'Finalize demo plan',red:false},{name:'Digital Records Quality',div:'Corporate',impact:'Medium',target:dateOffset(45),conf:'Medium',blocker:'Missing attachments',next:'Review backlog',red:true}],{name:'fldPMIRXeG0mRk7yI',div:'flds4r4EaWfTMGhp9',impact:'fld62xE5BKoxBvPFp',target:'fld2tSbaD6E8V7Cx3',conf:'fldFfR85N9ZEXsi7V',blocker:'fldb0qlhKzugTOPIM',next:'fld6uMCkC91ZVE9hu',red:'fldV10mUvoF1jI8Kl'});

 // Expanded fictional fixtures: every generated record belongs exclusively to this demonstration.
 // Individual names below are generated sample identities, not records fetched from a connector.
 const who=(i)=>[{id:people[i%51].id}], samplePerson=i=>referenceRoster[i%referenceRoster.length].name;
 raw.incidents={records:Array.from({length:7},(_,i)=>rec('recIncidentDemo'+i,{
  fld8nbnaqwun51b8D:'DEMO-INC-'+String(i+1).padStart(3,'0'),
  fldhr8w04sGPCi6XE:['In Review','Open','Resolved','Action in Progress'][i%4],
  fldTxr2QrFiDoPqWf:['Low','Medium','High'][i%3],
  fldANnxJ7ZOYlJksS:['Procedure','Documentation','Safety','Workplace conduct'][i%4],
  fldW6690S8DXtYvXD:i%3?'On Time':'At Risk',fld3i3PZ0LLEffTgB:who(i+10),
  fld25dfaZ529uQNwQ:dateOffset(-i*3-2),fldcaptPzVuilBcod:'Illustrative issue for workflow demonstration only',
  fld0gm3MqbWshi6cC:'Review',fld1pBnBZAzdw4ihv:'Sample follow-up noted'}))};
 raw.nte={records:Array.from({length:5},(_,i)=>rec('recNTEDemo'+i,{
  fldFpul2ZjwidEdUd:['Open','Awaiting Response','Closed'][i%3],fldZEnW5rJdOLoTJd:'Initial Review',
  fldFIBxoCfAlxCs6c:'Illustrative notice '+(i+1),fld2jeNHT9LLTg7oM:who(i+18),
  fldhhYXWUsLuB74NY:'For Review',fld8OBVmzAulm9xgl:dateOffset(-i*4-2),
  fld8iCsTNze0qdzdL:dateOffset(5-i*2),fldVxOPdDpoEcBG2P:'Fictional scenario without actual employee disciplinary information'}))};
 raw.warnings={records:Array.from({length:4},(_,i)=>rec('recWarningDemo'+i,{
  fldH4rTYQfNOHXjEw:['Written Reminder','Coaching Note','Written Reminder','Document Review'][i],
  fldxTXMCO3NzNkO6u:dateOffset(-i*7-3),fldxIWPlp7IJFs5OR:who(i+26),
  fldB02QQoLfiVf6DA:'Practice record, not a real disciplinary action',fld7hxFMay7FXpIJB:'Review after 30 days'}))};
 raw.pips={records:Array.from({length:4},(_,i)=>rec('recPIPDemo'+i,{
  fldJuwKdvZKd9qMBW:['In Progress','On Track','Completed','For Review'][i],fldmSlEZ1A1fI5bU2:'DEMO-PLAN-'+(i+1),
  fldbAVXV9PEyEeYNi:who(i+30),fldv5BYjFNasUi6Nb:'Coaching and development',
  fld5j6LG2ALP82fP7:dateOffset(-14-i),fldbkX1yjbYbKD6UC:dateOffset(21+i*4),
  fldiUrTwyM13VlGLD:'Illustrative',fldSQPM3myx8U1apE:70+i*7}))};
 raw.satisfaction={records:Array.from({length:26},(_,i)=>rec('recSatisfactionDemo'+i,{
  fldFgnrs1p2Alj4gP:3+i%3,fldom0BQasPphY9c4:3+(i+2)%3,
  fld9GQV9jktEiivBW:3+(i+1)%3,fldlmY3z9KMCxGeid:3+i%3,
  fldZJFP9mSjgwME6R:3+(i+1)%3,fldhWpbpCTJG8WxGc:4+i%2,
  fldvIrrS2rdKiGjyG:'Q4 2026'}))};
 const mhFields=MC_CORE.jobs(today.getTime()).maddieHour.input.fieldIds;
 raw.maddieHour={records:Array.from({length:22},(_,i)=>rec('recMaddieHourDemo'+i,
   Object.fromEntries(mhFields.map((f,j)=>[f,['Very satisfied','Satisfied','Neutral','Satisfied','Very satisfied'][(i+j)%5]]))))};
 addExtra('raises',Array.from({length:9},(_,i)=>({emp:who(i+5),date:dateOffset(-40-i*4),prev:26000+i*2200,
   new:28000+i*2500,pct:8+i%4,reason:['Annual review','Role adjustment','Merit'][i%3],pos:'Specialist'})),
   {emp:'fldBr9RrmyeEilMxy',date:'fldAGxhuartYBIc2J',prev:'fldSYfb1zpx1IKLVY',new:'fldyolw7gXi8ksWQo',pct:'fldKZH7Diu532tVAE',reason:'fldRb9qpbxmQVGxqu',pos:'fld3tNz0sUj7Frg1x'});
 addExtra('salmove',Array.from({length:8},(_,i)=>({emp:who(i+8),cur:'Analyst',prop:'Senior Analyst',curSal:32000+i*1200,
   propSal:35500+i*1450,pct:7+i,mgmt:'For Review',final:['Approved','Pending'][i%2],date:dateOffset(-i*7)})),
   {emp:'fld2jUn71qP3x8CYH',cur:'fldBkQ534mIIaboVn',prop:'fldFtIDVAfRJdk74X',curSal:'fld8J8WsLiwyqqbqM',propSal:'fldBHrTSELQekrKVm',pct:'fldxPDr76oSiiegn8',mgmt:'fld3WkIL9UX16jlo9',final:'fldt7hqKLGdpWMYoh',date:'fldyeJzb3TB7fZvgd'});
 addExtra('transitions',Array.from({length:8},(_,i)=>({emp:who(i+4),cur:'Associate',prop:['Senior Associate','Team Coordinator','Specialist'][i%3],
   eff:dateOffset(i*5-20),decision:['Approved','Under Review'][i%2],final:'P&C review',review:dateOffset(i*3+5),unit:divisions[i%8][0]})),
   {emp:'fldGGuX9fsGWIN4C7',cur:'fldxXmojaUxd9kvxs',prop:'fldXvwvcb4qcDYBuB',eff:'fldXqIgI6YtU6nXSq',decision:'fldjYMOoQHycCH6VM',final:'fldjp6ujUADXy2532',review:'fldgJDJ67L8jU0cGQ',unit:'fld7Q57ONXNNenDl1'});
 addExtra('helpdesk',Array.from({length:10},(_,i)=>({emp:who(i+3),type:['Benefits','Leave policy','Documentation','Work arrangements'][i%4],
   prio:['Routine','Medium','High'][i%3],subject:'Sample concern '+(i+1),status:['Open','Responded','Resolved','In Review'][i%4],
   created:dateOffset(-i*2-1),conf:'General',anon:false})),
   {emp:'fldDanEvz17OwrivT',type:'fldtmkg56EITPr6Z2',prio:'fldcfF3fN026WYlOt',subject:'fldzno2L3GjpMY96w',status:'fldA3mN83JHQ0DB2z',created:'fldaXB6v10jXUPAGx',conf:'fldtUPraeYVmfJ9eZ',anon:'fldgD3HjPg2bPkC2m'});
 addExtra('pcmeetings',Array.from({length:8},(_,i)=>({date:dateOffset(i*4+1),agenda:['Onboarding','Quarterly people review','Maddie Hour','Payroll check','Learning plan'][i%5],
   type:'P&C Meeting',subject:'Demonstration meeting '+(i+1),emp:who(i+7)})),
   {date:'fldZQcvJ96cn47iny',agenda:'fldk1Ujto4QQXHMwi',type:'fldLB1UPXohiE6tOR',subject:'fld1ECYCYxBBteyGD',emp:'fldYjx6LxDOWHFFON'});
 // Populated Chiefs' Hub task and weekly pulse datasets for all supported divisions.
 const J=MC_CORE.jobs(today.getTime());
 Object.keys(J).filter(k=>k.startsWith('tasks_')).forEach((k,i)=>{
  const f=J[k].input.fieldIds||[];
  raw[k]={records:Array.from({length:6},(_,j)=>rec('recDemoTask'+k+j,Object.fromEntries([
    [f[0],['Complete onboarding checklist','Review operational targets','Prepare monthly update','Confirm documents','Quality assurance review','Submit team summary'][j]],
    [f[1],['In Progress','Planned','Done','On Hold'][j%4]],[f[2],dateOffset((j-2)*4+i)],
    [f[3],j===2],[f[4],['High','Medium','Low'][j%3]],[f[5],'Sample 2027 division operations']
  ].filter(x=>x[0]))))};
 });
 Object.keys(J).filter(k=>k.startsWith('pulse_')).forEach((k,i)=>{
  const f=J[k].input.fieldIds||[];
  raw[k]={records:Array.from({length:5},(_,j)=>rec('recDemoPulse'+k+j,Object.fromEntries(f.map((fld,n)=>[
    fld,n===0?'Week '+(j+1):n===1?'On Target':['On Target','Watch','Below Target'][(j+n+i)%3]
  ]))))};
 });

 try {const model=MC_CORE.buildModel(raw,{},today.getTime());
  // The fictional 201 Files Digitalization Tracker is shaped like the existing connector model.
  // This drives the existing Who is missing what dashboard with 51 fully synthetic rows.
  const trows=people.map((p,i)=>{const f=p.cellValuesByFieldId,n=f[F.last]+', '+f[F.first],status=f[F.status],isProb=status==='Probationary';
    return{no:i+1,name:n,prob:i%7===0?'No Record':'Uploaded',mh:!isProb&&i%5!==0?'Uploaded':'No Record',tcg:'',mf:'',nda:i%8===0?'No Record':'Uploaded',ncc:i%10===0?'No Record':'Uploaded',verified:i%6===0?'Demo verifier - P&C':'Sample checklist'};});
  model.t201={declared:51,rows:trows,core:trows.slice(0,8).map((r,i)=>({name:r.name,level:'L1',role:'Division Head',core:i%6===0?'No Record':'Uploaded',nda:r.nda,verified:'Sample P&C',})),folders:[],foldersMore:false};
  model.exits=[{name:'Alexandra Marquez',div:'Design & Operations',pos:'Creative Associate',status:'Resigned',sep:'2026-10-15'},{name:'Gabriel Ledesma',div:'Media',pos:'Production Assistant',status:'Contract ended',sep:'2026-09-30'}];
  MC_ADAPT(model);
  MCD.EMP.forEach(e=>{
   const reference=referenceByRecord.get(e.rid);
   if(!reference)return;
   e.orgLevel=reference.level||e.lvl;
   e.orgTier=reference.tier;
   e.orgReferenceName=reference.name;
   e.orgReferenceRole=reference.role;
  });
  MCD.orgReference={source:'User-provided chart reference · fictional sample',people:referenceRoster.length};
  Object.keys(MCD.SRC).forEach(k=>{MCD.SRC[k]={name:(MC_CORE.SOURCE_NAMES||{})[k]||k,url:''}});window.MC_FICTIONAL=true}
 catch(e){window.MC_DEMO_ERROR=e;console.error('Demo fixture error',e)}
})();
