/* MADDIE CENTRAL 2027 v4 — adapter: live monitoring model -> the interface's data shapes.
 * Every number here is derived from a read-only connector source. Nothing is invented:
 * where a source does not exist the value is null and the interface says so.
 * People are joined by record ID only (done in core.js), never by name. */
(function () {
  'use strict';
  var MCD = window.MCD = { EMP: [], D: [], M: {}, EXC: [], PIPE: [], HC: [], TL: [], MON: [], HEAT: [], LEAVE: [], EVENTS: [], EVM: {},
    SPEC: {}, TASKS: [], OPS: {}, SHORT: {}, DIVID: {}, ROOMS: [], CASES: [], SRC: {}, model: null, gen: 0 };
  var HUBMAP = {
    design: { t: ['tasks_design'], p: 'pulse_design', tag: 'Design projects and delivery' },
    corp: { t: ['tasks_corpops', 'tasks_finance'], p: 'pulse_finance', tag: 'Corporate operations and finance' },
    rmd: { t: ['tasks_cj'], p: 'pulse_sales', tag: 'Revenue, sales and client journey' },
    media: { t: ['tasks_marketing'], p: 'pulse_marketing', tag: 'Marketing and content' },
    coo: { t: ['tasks_techops'], p: 'pulse_it', tag: 'Technology and systems' },
    bd: { t: ['tasks_bizdev'], p: 'pulse_bizdev', tag: 'Business development' },
    gencon: { t: ['tasks_gencon'], p: 'pulse_qs', tag: 'Construction and quantity surveying' }
  };
  MCD.HUBMAP = HUBMAP;
  /* Where each dataset lives: links open the source itself (sign-in to that tool is required). */
  (function () {
    var C = window.MC_CORE; if (!C) return; var J = C.jobs(Date.now()), names = C.SOURCE_NAMES || {};
    Object.keys(J).forEach(function (k) { var j = J[k], url = '';
      if (j.server === 'Airtable') url = 'https://airtable.com/' + j.input.baseId + '/' + j.input.tableId;
      else if (j.server === 'Google Calendar') url = 'https://calendar.google.com/calendar/r';
      else if (j.server === 'Google Sheets') url = 'https://docs.google.com/spreadsheets/d/' + j.input.spreadsheetId + '/edit';
      else if (j.server === 'Google Drive') { var fm = /'([\w-]{20,})'/.exec(j.input.query || ''); url = j.input.fileId ? 'https://docs.google.com/spreadsheets/d/' + j.input.fileId + '/edit' : fm ? 'https://drive.google.com/drive/folders/' + fm[1] : 'https://drive.google.com'; }
      MCD.SRC[k] = { name: names[k] || k, url: url, base: j.input.baseId, table: j.input.tableId }; });
  })();
  MCD.recordUrl = function (srcKey, rid) { var s = MCD.SRC[srcKey]; return s && s.base && rid && /^rec/.test(rid) ? 'https://airtable.com/' + s.base + '/' + s.table + '/' + rid : s ? s.url : ''; };
  var MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function lvlOf(pos) {
    var p = String(pos || '');
    if (/\basst\.?|assistant/i.test(p)) return 2;
    if (/\bchief\b|\bhead\b|general manager|director|operations manager|finance manager/i.test(p)) return 1;
    if (/project manager|officer|executive|senior|supervisor|\blead\b|\bII\b/i.test(p)) return 2;
    return 3;
  }
  function yearsSince(iso, t) { if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return 0; var y = Number(t.slice(0, 4)) - Number(iso.slice(0, 4)); if (t.slice(5) < iso.slice(5)) y--; return Math.max(0, y); }
  function daysBetween(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000); }
  function md(iso) { return iso ? MN[Number(iso.slice(5, 7)) - 1] + ' ' + Number(iso.slice(8, 10)) : ''; }
  MCD.md = md;
  function replace(arr, items) { arr.length = 0; Array.prototype.push.apply(arr, items); }
  function replaceObj(o, n) { Object.keys(o).forEach(function (k) { delete o[k]; }); Object.assign(o, n); }
  function tasksOf(model, keys) { var out = []; (keys || []).forEach(function (k) { (model.ops.tasks[k] || []).forEach(function (x) { out.push(Object.assign({ src: k }, x)); }); }); return out; }
  function taskStats(list, t) {
    var open = list.filter(function (x) { return !x.done; });
    var by = {}; list.forEach(function (x) { by[x.status] = (by[x.status] || 0) + 1; });
    return { total: list.length, open: open.length, done: list.length - open.length, overdue: open.filter(function (x) { return x.due && x.due < t; }).length,
      dueToday: open.filter(function (x) { return x.due === t; }).length, soon: open.filter(function (x) { return x.due && x.due > t && daysBetween(t, x.due) <= 7; }).length,
      byStatus: Object.keys(by).map(function (k) { return [k, by[k]]; }).sort(function (a, b) { return b[1] - a[1]; }) };
  }
  MCD.taskStats = taskStats;

  function normalize(model) {
    /* Copies saved by an older version lack the newer fields: fill them with empty values, never with invented numbers. */
    var t = model.today, mk = []; for (var i = 6; i >= 0; i--) { var d = new Date(Date.UTC(+t.slice(0, 4), +t.slice(5, 7) - 1 - i, 1)); mk.push(d.toISOString().slice(0, 7)); }
    if (!model.trend) model.trend = { months: mk, headcount: [], lates: [], byDiv: {}, missing: true };
    if (!model.lateHeat) { model.lateHeat = [0, 1, 2, 3, 4].map(function () { return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; }); model.heatMissing = true; }
    if (!model.heatStart) { var td = new Date(t + 'T00:00:00Z'), dow = (td.getUTCDay() + 6) % 7; td.setUTCDate(td.getUTCDate() - dow - 77); model.heatStart = td.toISOString().slice(0, 10); }
    if (!model.ops) model.ops = { tasks: {}, pulse: {} };
    if (!model.journey.devByKey) model.journey.devByKey = {};
    var G = model.governance || (model.governance = {});
    ['incidents', 'nte', 'warnings', 'pips'].forEach(function (k) { var g = G[k] || (G[k] = { total: 0 }); if (!g.list) g.list = []; ['byStatus', 'byType', 'bySeverity', 'byStage'].forEach(function (b) { if (!g[b]) g[b] = {}; }); });
    if (G.incidents.open == null) G.incidents.open = 0; if (G.incidents.slaBreach == null) G.incidents.slaBreach = 0;
    return model;
  }
  window.MC_ADAPT = function (model) {
    normalize(model);
    var t = model.today, P = model.people;
    MCD.model = model; MCD.gen++;
    /* Divisions, largest first (the order the roster gives) */
    var divs = P.divisions.slice();
    replace(MCD.D, divs.map(function (d) { return [d.name, d.count]; }));
    replaceObj(MCD.SHORT, divs.reduce(function (o, d) { o[d.name] = d.short; return o; }, {}));
    replaceObj(MCD.DIVID, divs.reduce(function (o, d) { o[d.name] = d.id; return o; }, {}));
    var nameOf = divs.reduce(function (o, d) { o[d.id] = d.name; return o; }, {});
    /* Stage: from employment status, hire date and the development tracker */
    var evalKeys = {}; model.journey.dev.forEvaluation.forEach(function (x) { if (x.k) evalKeys[x.k] = 1; });
    var order = divs.map(function (d) { return d.id; });
    var list = P.list.slice().sort(function (a, b) { return order.indexOf(a.div) - order.indexOf(b.div) || lvlOf(a.pos) - lvlOf(b.pos) || a.name.localeCompare(b.name); });
    var tracked = model.files201.docs.filter(function (d) { return !d.unavailable; }).length || 1;
    replace(MCD.EMP, list.map(function (p, i) {
      var onFile = model.files201.docs.filter(function (d) { return !d.unavailable && p.files[d.id] === 'on-file'; }).length;
      var stage = evalKeys[p.k] ? 'For evaluation' : p.status === 'Probationary' ? (p.hire && daysBetween(p.hire, t) <= 90 ? 'Onboarding' : 'In progress') : 'Completed';
      var a = p.att90 || {};
      return { i: i, k: p.k, rid: p.rid, comp: p.comp || {}, gov: p.gov || {}, contact: p.contact || {}, gender: p.gender || '', bdate: p.bdate || '', name: p.name, dept: nameOf[p.div] || p.divShort, divId: p.div, role: p.pos, hasId: !!p.id, id: p.id, f: Math.round(onFile / tracked * 100), onFile: onFile, tracked: tracked,
        files: p.files, missing201: p.missing201, l90: a.late || 0, l30: a.late30 || 0, leave90: a.leave || 0, absent90: a.absent || 0, ten: yearsSince(p.hire, t), hire: p.hire, reg: p.reg, bday: p.bday,
        status: p.status, stage: stage, lvl: lvlOf(p.pos), head: lvlOf(p.pos) === 1, issues: p.issues, dev: model.journey.devByKey[p.k] || null };
    }));
    var E = MCD.EMP;
    /* Divisions with no level-1 role still need a lead for the org chart: the most senior recorded person. */
    divs.forEach(function (d) { var l = E.filter(function (e) { return e.divId === d.id; }); if (l.length && !l.some(function (e) { return e.head; })) { var m = Math.min.apply(null, l.map(function (e) { return e.lvl; })); l.filter(function (e) { return e.lvl === m; }).forEach(function (e) { e.head = true; e.lvlNote = 'Most senior recorded role'; }); } });
    /* 201 tracker (Google Drive): per-employee document status. The tracker has no Employee ID column,
       so rows are linked to the roster by name (surname + first given name, unique matches only) and labelled as such. */
    MCD.T201 = null;
    if (model.t201) {
      var nz = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim(); };
      var split = function (n) { var p = String(n).split(','); return { last: nz(p[0]), given: nz(p.slice(1).join(' ')).split(' ').filter(Boolean) }; };
      var tokens = function (n) { return nz(n).split(' ').filter(Boolean); };
      var findEmp = function (n) {
        /* Exact-name fallback supports unique single-name sample identities.
           It is deliberately uniqueness-checked; ambiguous matches are never linked. */
        var target = String(n || '').trim().toLowerCase();
        var direct = E.filter(function (e) { return String(e.name || '').trim().toLowerCase() === target; });
        if (direct.length === 1) return direct[0];
        if (direct.length > 1) return null;
        var s = split(n); if (!s.last || !s.given.length) return null; var lt = s.last.split(' ');
        var hits = E.filter(function (e) { var tk = tokens(e.name); return lt.every(function (x) { return tk.indexOf(x) >= 0; }) && (tk[0] === s.given[0] || s.given.filter(function (g) { return g.length > 1 && tk.indexOf(g) >= 0; }).length >= 2); });
        return hits.length === 1 ? hits[0] : null; };
      var findFolder = function (n, core) { var s = split(n); return model.t201.folders.filter(function (f) { var c = /^core\b/i.test(f.title); if (!!core !== c) return false; var tk = tokens(f.title.replace(/^core\s+\w+\s*-\s*/i, ''));
        return s.last.split(' ').every(function (x) { return tk.indexOf(x) >= 0; }) && tk.indexOf(s.given[0]) >= 0; })[0] || null; };
      var DOC = [['prob', 'Probationary Contract'], ['reg', 'Regularization'], ['nda', 'NDA'], ['ncc', 'NCC']];
      var rows = model.t201.rows.map(function (r) {
        var e = findEmp(r.name), checked = !!(r.prob || r.mh || r.tcg || r.mf || r.nda || r.ncc), regEnt = ['mh', 'tcg', 'mf'].filter(function (k) { return r[k] === 'Uploaded'; }).map(function (k) { return k.toUpperCase(); });
        var notDue = e && e.status === 'Probationary';
        var docs = DOC.map(function (d) { var st = d[0] === 'reg' ? (regEnt.length ? 'Uploaded' : !checked ? '' : notDue ? 'Not yet due' : 'No Record') : r[d[0]];
          return { k: d[0], label: d[1], st: st || (checked ? 'No Record' : 'Not checked'), note: d[0] === 'reg' && regEnt.length ? regEnt.join(', ') : '' }; });
        var missing = docs.filter(function (d) { return d.st === 'No Record'; }), req = docs.filter(function (d) { return d.st === 'Uploaded' || d.st === 'No Record'; });
        var f = findFolder(r.name, false);
        return { no: r.no, name: r.name, e: e, docs: docs, missing: missing, checked: checked, complete: checked && !missing.length, onFile: req.length - missing.length, required: req.length, verified: r.verified, folder: f };
      });
      var core = model.t201.core.map(function (c) { var miss = [['core', 'Core Agreement'], ['nda', 'NDA']].filter(function (d) { return c[d[0]] === 'No Record'; }).map(function (d) { return d[1]; });
        return Object.assign({}, c, { e: findEmp(c.name), missing: miss, folder: findFolder(c.name, true) }); });
      var matched = {}; rows.forEach(function (r) { if (r.e) matched[r.e.k] = r; });
      E.forEach(function (e) { var r = matched[e.k]; e.t201 = r || null;
        if (r) { e.f = r.required ? Math.round(r.onFile / r.required * 100) : 0; e.onFile = r.onFile; e.tracked = r.required; e.missing201 = r.missing.length; } else { e.f = 0; e.onFile = 0; e.tracked = 4; } });
      MCD.T201 = { rows: rows, core: core, declared: model.t201.declared, notInTracker: E.filter(function (e) { return !matched[e.k] && !core.some(function (c) { return c.e && c.e.k === e.k; }); }), unmatched: rows.filter(function (r) { return !r.e; }), folders: model.t201.folders, foldersMore: model.t201.foldersMore };
    }
    var avg = E.length ? Math.round(E.reduce(function (s, e) { return s + e.f; }, 0) / E.length) : 0;
    replaceObj(MCD.M, { n: E.length, noId: E.filter(function (e) { return !e.hasId; }).length, avg: avg, low: E.filter(function (e) { return e.f < 60; }).length,
      rep: E.filter(function (e) { return e.l90 >= 3; }).length, l30: E.reduce(function (s, e) { return s + e.l30; }, 0), onb: E.filter(function (e) { return e.stage === 'Onboarding'; }).length,
      prob: E.filter(function (e) { return e.status === 'Probationary'; }).length, open: model.talent.open, openings: model.talent.openings, cands: model.talent.candidates.total,
      baseline: P.totals.baseline, records: P.totals.records, inactive: P.totals.inactive, evalN: model.journey.dev.forEvaluation.length, today: t });
    var M = MCD.M;
    /* Trends */
    replace(MCD.MON, model.trend.months.map(function (m) { return MN[Number(m.slice(5, 7)) - 1]; }));
    replace(MCD.HC, model.trend.headcount); replace(MCD.TL, model.trend.lates);
    var heatStart = model.heatStart;
    replace(MCD.HEAT, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(function (d, i) { return [d, model.lateHeat[i]]; }));
    MCD.heatStart = heatStart;
    replace(MCD.LEAVE, Object.keys(model.attendance.byType30).filter(function (k) { return /leave/i.test(k); }).map(function (k) { return [k, model.attendance.byType30[k]]; }).sort(function (a, b) { return b[1] - a[1]; }));
    /* Pipeline (counts only) in funnel order */
    var bs = model.talent.candidates.byStage, rank = function (s) { var o = ['applied', 'screen', 'assess', 'interview', 'final', 'offer', 'hired', 'reject', 'withdraw']; for (var i = 0; i < o.length; i++) if (new RegExp(o[i], 'i').test(s)) return i; return 50; };
    replace(MCD.PIPE, Object.keys(bs).sort(function (a, b) { return rank(a) - rank(b) || bs[b] - bs[a]; }).map(function (k) { return [k, bs[k]]; }));
    /* Calendar: confirmed P&C meetings and PH holidays (restricted meetings already withheld) */
    replace(MCD.EVENTS, model.culture.events.map(function (e) { return [e.title, md(e.date), e.kind, e.note, e.date, e.time]; }));
    var evm = {}; model.culture.events.forEach(function (e) { var k = (Number(e.date.slice(5, 7)) - 1) + '-' + Number(e.date.slice(8, 10)) + '-' + e.date.slice(0, 4); (evm[k] = evm[k] || []).push(e); });
    model.culture.anniversaries.forEach(function (a) { var k = (Number(a.date.slice(5, 7)) - 1) + '-' + Number(a.date.slice(8, 10)) + '-' + a.date.slice(0, 4); (evm[k] = evm[k] || []).push({ title: a.name + ', ' + a.years + '-year anniversary', kind: 'milestone', date: a.date }); });
    model.culture.birthdays.forEach(function (b) { var k = (Number(b.date.slice(5, 7)) - 1) + '-' + Number(b.date.slice(8, 10)) + '-' + b.date.slice(0, 4); (evm[k] = evm[k] || []).push({ title: b.name + ', birthday', kind: 'milestone', date: b.date }); });
    replaceObj(MCD.EVM, evm);
    /* Per-person dated items (calculated probation checkpoints, birthdays, anniversaries) for the office view */
    var byK = {}; E.forEach(function (e) { byK[e.k] = e; });
    var items = {};
    var push = function (k, title, date, kind) { if (!byK[k]) return; (items[k] = items[k] || []).push({ title: title, due: date, kind: kind }); };
    model.journey.upcoming.forEach(function (u) { push(u.k, u.what + ' (calculated)', u.date, 'checkpoint'); });
    model.culture.birthdays.forEach(function (b) { push(b.k, 'Birthday', b.date, 'birthday'); });
    model.culture.anniversaries.forEach(function (a) { push(a.k, a.years + '-year work anniversary', a.date, 'anniversary'); });
    replace(MCD.TASKS, E.map(function (e) {
      var l = (items[e.k] || []).sort(function (a, b) { return a.due.localeCompare(b.due); }), x = l[0];
      if (evalKeys[e.k]) x = { title: 'Development record marked For Evaluation', due: t, kind: 'evaluation' };
      return x ? { emp: e.i, person: e.name, dept: e.dept, title: x.title, due: x.due, time: '', kind: x.kind, real: true }
        : { emp: e.i, person: e.name, dept: e.dept, title: 'No dated item in the next 60 days', due: null, time: '', kind: 'none', real: false };
    }));
    /* Division operations (Chiefs' Hub) */
    var ops = {};
    divs.forEach(function (d) { var h = HUBMAP[d.id]; if (!h) return; var l = tasksOf(model, h.t); ops[d.name] = { tasks: l, stats: taskStats(l, t), pulse: model.ops.pulse[h.p] || null, src: h.t, psrc: h.p, tag: h.tag, loaded: h.t.some(function (k) { return !!model.ops.tasks[k]; }) }; });
    var allTasks = []; Object.keys(ops).forEach(function (k) { allTasks = allTasks.concat(ops[k].tasks); });
    ops.HQ = { tasks: allTasks, stats: taskStats(allTasks, t), pulse: model.ops.pulse.pulse_pc || null, psrc: 'pulse_pc', tag: 'Whole company', loaded: allTasks.length > 0 };
    replaceObj(MCD.OPS, ops);
    /* Division dashboard specs: three KPIs, a trend, one bar set and notes. */
    var spec = {};
    var green = function (pl) { return pl && pl.latest ? pl.latest.lights.filter(function (x) { return x[1] === 'g'; }).length : null; };
    var lightWord = { g: 'on target', a: 'watch', r: 'below target' };
    divs.concat([{ id: 'HQ', name: 'HQ', short: 'HQ' }]).forEach(function (d) {
      var hq = d.id === 'HQ', o = ops[hq ? 'HQ' : d.name], l = hq ? E : E.filter(function (e) { return e.divId === d.id; });
      var l30 = l.reduce(function (s, e) { return s + e.l30; }, 0), prob = l.filter(function (e) { return e.status === 'Probationary'; }).length, noId = l.filter(function (e) { return !e.hasId; }).length;
      var k = [], nt = [], bset;
      if (o && o.loaded) {
        k.push(['Open tasks', o.stats.open, '', o.stats.overdue + ' overdue, ' + o.stats.done + ' done']);
      } else k.push(['On probation', prob, '', 'of ' + l.length + (l.length === 1 ? ' person' : ' people')]);
      var g = green(o && o.pulse);
      if (g != null) k.push(['Pulse KPIs on target', g, ' of ' + o.pulse.latest.lights.length, (o.pulse.latest.week || 'Latest') + ' submission']);
      else k.push(['Missing Employee ID', noId, '', 'in the roster']);
      k.push(['Lates, last 30 days', l30, '', 'Tardiness/Leave Tracker']);
      if (hq) k[0] = ['Open roles', M.open, '', M.cands + ' candidates in the pool'];
      if (o && o.loaded && o.stats.byStatus.length) bset = ['Tasks by status', o.stats.byStatus.slice(0, 6)];
      else { var sc = {}; l.forEach(function (e) { sc[e.status] = (sc[e.status] || 0) + 1; }); bset = ['Employment status', Object.keys(sc).map(function (s) { return [s, sc[s]]; })]; }
      if (hq) bset = ['People by division', divs.map(function (x) { return [x.short, x.count]; })];
      if (o && o.pulse && o.pulse.latest) o.pulse.latest.lights.slice(0, 4).forEach(function (x) { nt.push(x[0] + ': ' + lightWord[x[1]] + ' (' + (o.pulse.latest.week || 'latest') + ')'); });
      if (o && o.loaded && o.stats.overdue) nt.push(o.stats.overdue + ' open ' + (o.stats.overdue === 1 ? 'task is' : 'tasks are') + ' past due in Chiefs’ Hub.');
      if (noId) nt.push(noId + (noId === 1 ? ' person has' : ' people have') + ' no Employee ID.');
      if (prob) nt.push(prob + ' on probation.');
      if (!nt.length) nt.push('Nothing flagged in the live sources.');
      var tr = hq ? ['Headcount over seven months', MCD.HC.slice(), 'People with a recorded hire date'] : ['Lates per month', (model.trend.byDiv[d.id] || MCD.MON.map(function () { return 0; })).slice(), 'Tardiness/Leave Tracker'];
      spec[d.name] = { tag: hq ? 'Whole company' : (HUBMAP[d.id] ? HUBMAP[d.id].tag : d.name), k: k, tr: tr, bs: bset, nt: nt.slice(0, 5), hub: !!(o && o.loaded) };
    });
    replaceObj(MCD.SPEC, spec);
    /* Rooms in the 3D office: the eight largest groups (3x3 grid with the lobby) */
    replace(MCD.ROOMS, divs.slice(0, 8).map(function (d) { return d.name; }));
    /* Items needing attention, from the live data */
    var X = [], T = model.talent;
    if (M.noId) X.push({ id: 'noid', sev: 'Critical', t: M.noId + ' active employees have no Employee ID', why: 'Records without an ID cannot be matched to attendance or masterlist entries.', ws: 'people', list: function () { return E.filter(function (e) { return !e.hasId; }); }, val: function () { return 'No ID'; }, next: 'P&C assigns the missing IDs in the Airtable roster.' });
    var inc = E.filter(function (e) { return e.f < 100; }).length;
    if (MCD.T201) { var tm = MCD.T201.rows.filter(function (r) { return r.missing.length; }), tn = MCD.T201.rows.filter(function (r) { return !r.checked; }).length + MCD.T201.notInTracker.length;
      if (tm.length || tn) X.push({ id: 'f201', sev: 'High', t: tm.length + ' employees are missing 201 documents' + (tn ? ', ' + tn + ' not yet checked' : ''), why: tm.slice(0, 4).map(function (r) { return r.name.split(',')[0] + ' (' + r.missing.map(function (d) { return d.label; }).join(', ') + ')'; }).join('; ') + (tm.length > 4 ? '; and ' + (tm.length - 4) + ' more.' : '.'), ws: 'people', list: function () { return E.filter(function (e) { return !e.t201 || e.t201.missing.length || !e.t201.checked; }).sort(function (a, b) { return (b.t201 ? b.t201.missing.length : 9) - (a.t201 ? a.t201.missing.length : 9); }); }, val: function (e) { return e.t201 ? (e.t201.checked ? e.t201.missing.map(function (d) { return d.label; }).join(', ') : 'Not checked yet') : 'Not in tracker'; }, next: 'Upload the missing documents to the employee\u2019s 201 folder and update the tracker.' }); }
    else if (inc) X.push({ id: 'f201', sev: 'High', t: inc + ' of ' + M.n + ' employees have an incomplete 201 file', why: 'Average completeness across the ' + E[0].tracked + ' tracked attachments is ' + M.avg + '%.', ws: 'people', list: function () { return E.slice().sort(function (a, b) { return a.f - b.f; }); }, val: function (e) { return e.f + '%'; }, next: 'Collect the missing attachments, starting with the lowest completeness.' });
    if (M.rep) X.push({ id: 'lates', sev: 'High', t: M.rep + ' employees have 3 or more lates in 90 days', why: 'Counted from the Tardiness/Leave Tracker, joined by record ID.', ws: 'pulse', list: function () { return E.filter(function (e) { return e.l90 >= 3; }).sort(function (a, b) { return b.l90 - a.l90; }); }, val: function (e) { return e.l90 + ' lates'; }, next: 'Team leads review attendance with these employees.' });
    if (M.evalN) X.push({ id: 'eval', sev: 'Routine', t: M.evalN + ' development record' + (M.evalN > 1 ? 's are' : ' is') + ' waiting for evaluation', why: 'Marked For Evaluation in the development tracker.', ws: 'journey', list: function () { return E.filter(function (e) { return e.stage === 'For evaluation'; }); }, val: function () { return 'For evaluation'; }, next: 'The manager completes the evaluation review.' });
    var aged = T.positions.filter(function (p) { return !/filled|closed|cancel/i.test(p.status) && p.daysOpen > 45; });
    if (aged.length) X.push({ id: 'aged', sev: 'High', t: aged.length + (aged.length > 1 ? ' requisitions open' : ' requisition open') + ' more than 45 days', why: aged.map(function (p) { return p.title + ' (' + p.daysOpen + ' days)'; }).join(', ') + '.', ws: 'talent', list: function () { return []; }, val: function () { return ''; }, next: 'Recruitment reviews the role and its pipeline.' });
    var overdueAll = ops.HQ.stats.overdue;
    if (overdueAll) X.push({ id: 'tasks', sev: 'High', t: overdueAll + ' division tasks are past due in Chiefs’ Hub', why: Object.keys(ops).filter(function (k) { return k !== 'HQ' && ops[k].stats.overdue; }).map(function (k) { return MCD.SHORT[k] + ' ' + ops[k].stats.overdue; }).join(', ') + '.', ws: 'divisions', list: function () { return []; }, val: function () { return ''; }, next: 'Each division head updates or re-plans the overdue tasks.' });
    var ml = model.recon.masterlist;
    if (ml && ml.mismatch) X.push({ id: 'recon', sev: 'Routine', t: ml.mismatch + ' status differences between the Masterlist sheet and Airtable', why: ml.matched + ' Employee IDs matched. Airtable is treated as the source of truth.', ws: 'scoreboard', list: function () { return []; }, val: function () { return ''; }, next: 'P&C updates the Masterlist sheet or confirms the Airtable status.' });
    var G = model.governance, cases = [], byKey = {}; E.forEach(function (e) { byKey[e.k] = e; });
    var pp = function (l) { return (l || []).map(function (x) { var e = x.k && byKey[x.k]; return { name: x.name, i: e ? e.i : null, div: x.div }; }); };
    (G.incidents.list || []).forEach(function (c) { cases.push({ kind: 'Incident report', src: 'incidents', rid: c.rid, title: c.code || c.type || 'Incident report', status: c.status, date: c.date, people: pp(c.people), detail: c.desc, meta: [c.type, c.sev && ('Severity ' + c.sev), c.sla, c.sanction && ('Recommended: ' + c.sanction)].filter(Boolean), outcome: c.outcome }); });
    (G.nte.list || []).forEach(function (c) { cases.push({ kind: 'Notice to explain', src: 'nte', rid: c.rid, title: c.title || 'Notice to explain', status: c.status, date: c.issued, people: pp(c.people), detail: c.desc, meta: [c.stage, c.decision && ('Decision: ' + c.decision), c.deadline && ('Response due ' + md(c.deadline))].filter(Boolean), deadline: c.deadline }); });
    (G.warnings.list || []).forEach(function (c) { cases.push({ kind: 'Warning', src: 'warnings', rid: c.rid, title: c.type + ' warning', status: c.followUp && c.followUp >= t ? 'Follow-up ' + md(c.followUp) : 'Issued', date: c.date, people: pp(c.people), detail: c.details, meta: [c.type].filter(Boolean) }); });
    (G.pips.list || []).forEach(function (c) { cases.push({ kind: 'Improvement plan', src: 'pips', rid: c.rid, title: c.code || (c.type || 'Improvement plan'), status: c.status, date: c.start, people: pp(c.people), detail: '', meta: [c.type, c.end && ('Ends ' + md(c.end)), c.compliance != null && ('Compliance ' + Math.round(c.compliance <= 1 ? c.compliance * 100 : c.compliance) + '%'), c.outcome].filter(Boolean) }); });
    cases.sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
    replace(MCD.CASES, cases);
    var d14 = new Date(Date.parse(t + 'T00:00:00Z') + 14 * 86400000).toISOString().slice(0, 10);
    var soon = model.journey.upcoming.filter(function (u) { return u.date <= d14; });
    if (soon.length) X.push({ id: 'probation', sev: 'Routine', t: soon.length + ' probation milestone' + (soon.length > 1 ? 's' : '') + ' in the next 14 days', why: soon.slice(0, 3).map(function (u) { return u.name + ', ' + u.what.toLowerCase() + ' on ' + md(u.date); }).join('; ') + '.', ws: 'journey', list: function () { return soon.map(function (u) { return E.find(function (e) { return e.k === u.k; }); }).filter(Boolean); }, val: function (e) { var u = soon.find(function (x) { return x.k === e.k; }); return u ? md(u.date) : ''; }, next: 'P&C Lead and the manager prepare the review.' });
    var nteLate = cases.filter(function (c) { return c.src === 'nte' && c.deadline && c.deadline < t && /pending|await|open|issued/i.test(c.status); });
    if (nteLate.length) X.push({ id: 'nte', sev: 'High', t: nteLate.length + ' notice' + (nteLate.length > 1 ? 's' : '') + ' to explain past the response date', why: 'Response deadline passed while the notice is still open.', ws: 'governance', list: function () { return []; }, val: function () { return ''; }, next: 'The case owner follows up or moves the case to decision.' });
    var dec = ((model.extra || {}).decisions || []).filter(function (r) { return r.due && !/done|approved|complete|declined/i.test(r.status || ''); });
    if (dec.length) X.push({ id: 'decisions', sev: 'High', t: dec.length + ' executive decision' + (dec.length > 1 ? 's' : '') + ' open', why: dec.slice(0, 3).map(function (r) { return r.decision + (r.due ? ' (due ' + md(String(r.due).slice(0, 10)) + ')' : ''); }).join('; ') + '.', ws: 'scoreboard', list: function () { return []; }, val: function () { return ''; }, next: 'The decision owner records the outcome in Chiefs’ Hub.' });
    var XSRC = { probation: ['people'], nte: ['nte'], decisions: ['decisions'], noid: ['people'], f201: ['tracker201', 'folders201'], lates: ['attendance'], eval: ['development'], aged: ['positions'], tasks: Object.keys(MCD.SRC).filter(function (k) { return /^tasks_/.test(k); }), recon: ['masterlist', 'people'] };
    X.forEach(function (x) { x.src = XSRC[x.id] || []; });
    replace(MCD.EXC, X);
    return MCD;
  };
})();
