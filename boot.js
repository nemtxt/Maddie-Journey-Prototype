/* MADDIE CENTRAL 2027 v4 — boot: passcode lock, data runtime and live refresh.
 * Owner view: reads connectors live (read-only), rebuilds the model and saves an encrypted copy only when it changed.
 * Leader view: decrypts the newest copy with the passcode. Nothing here edits, approves, sends or schedules anything. */
(function () {
  'use strict';
  var C = window.MC_CORE;
  var S = { locked: true, owner: false, rt: {}, key: null, meta: null, model: null, raw: {}, status: {}, digest: '', unwatch: [], liveAt: null, peersLive: null,
    started: false, loading: false, retried: false, loadError: null, saveError: null, msg: '' };
  var $ = function (s) { return document.querySelector(s); };
  var gate = $('#gate'), gf = $('#gform'), pc = $('#pc'), gs = $('#gs'), unl = $('#unl'), app = $('#app');
  function ago(iso) { if (!iso) return 'never'; var s = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000)); return s < 45 ? 'just now' : s < 3600 ? Math.round(s / 60) + ' min ago' : s < 86400 ? Math.round(s / 3600) + ' h ago' : Math.round(s / 86400) + ' d ago'; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function setGate(msg, err) { S.msg = msg || ''; gs.textContent = S.msg; gs.className = 'gs' + (err ? ' err' : ''); }
  function firstSetup() { return S.owner && S.rt.db && S.meta === null; }
  function paintGate() {
    var first = firstSetup(), c2 = $('#pc2wrap');
    c2.hidden = !first; $('#pc2').required = first;
    unl.textContent = first ? 'Set passcode and connect' : 'Unlock';
    $('#gnote').textContent = first ? 'First setup: this passcode encrypts the data leaders see. Share it only with authorized leaders.'
      : 'Read-only. Data is decrypted in this browser only and is never edited here.' + (S.owner ? ' You are the owner: your connectors refresh the data live.' : '');
  }
  app.inert = true;

  /* ---------- runtime ---------- */
  async function init() {
    setGate('Connecting…');
    var claude = window.claude;
    if (!claude || typeof claude.use !== 'function') { setGate('Open this page on claude.ai to load the monitoring data.', true); return; }
    var user = await claude.use('user');
    S.owner = user ? !!(await user.isOwner().catch(function () { return false; })) : false;
    S.rt.db = await claude.use('db');
    S.rt.room = await claude.use('room');
    if (S.owner) S.rt.mcp = await claude.use('mcp');
    if (!S.rt.db) { setGate('Sign in to claude.ai with the email this page was shared with to view the monitoring data.', true); return; }
    var metaTimer = setTimeout(function () { if (!S.meta && S.locked) { setGate(S.owner ? '' : 'Still connecting to the monitoring data…'); paintGate(); } }, 10000);
    S.rt.db.doc('central/meta').onSnapshot(function (snap) {
      clearTimeout(metaTimer);
      var prev = S.meta; S.meta = snap.exists ? snap.data() : null;
      if (S.locked) { setGate(S.meta || S.owner ? '' : 'P&C has not published the monitoring data yet.'); paintGate(); return; }
      if (!S.owner && S.meta && (!prev || prev.ver !== S.meta.ver)) loadSnapshot();
      paintStatus();
    }, function () { setGate('The monitoring data is not reachable right now. Reload the page to try again.', true); });
    if (S.rt.room) S.rt.room.onPeers(function (ch) {
      var live = ch.peers.filter(function (p) { return !p.isMe && p.presence && p.presence.live && Date.now() - Date.parse(p.presence.at || 0) < 150000; });
      S.peersLive = live.length ? live[0].presence.at : null; paintStatus();
    });
    setInterval(paintStatus, 15000);
    paintGate(); setGate('');
    setTimeout(function () { try { pc.focus(); } catch (e) {} }, 300);
  }
  gf.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (unl.disabled || !S.rt.db) return;
    var pass = pc.value, p2 = $('#pc2');
    unl.disabled = true; setGate('Unlocking…');
    try {
      if (S.meta) { S.key = await C.deriveKey(pass, S.meta.salt); await C.open(S.key, S.meta.check); }
      else if (S.owner) {
        if (p2.value !== pass) throw new Error('mismatch');
        if (pass.length < 6) throw new Error('short');
        S.salt = C.newSalt(); S.key = await C.deriveKey(pass, S.salt);
      } else throw new Error('nodata');
      S.locked = false; setGate(S.owner ? 'Opening the office…' : 'Opening the latest data…');
      if (S.meta) await loadSnapshot();
      if (S.owner) startLive();
      if (!S.model) setGate(S.owner ? 'Reading your connectors… allow each one when claude.ai asks.' : 'Opening the latest data…');
    } catch (err) {
      await new Promise(function (r) { setTimeout(r, 600); });
      S.key = null; S.locked = true; unl.disabled = false;
      setGate(err.message === 'mismatch' ? 'The two passcodes do not match.' : err.message === 'short' ? 'Use at least 6 characters.' :
        err.message === 'nodata' ? 'P&C has not published the monitoring data yet. Try again later.' : 'That passcode did not unlock the data.', true);
      gf.classList.remove('bad'); void gf.offsetWidth; gf.classList.add('bad'); pc.focus(); pc.select();
    }
  });

  /* ---------- leader view: encrypted copy ---------- */
  async function loadSnapshot() {
    var m = S.meta; if (!m || !S.key) return;
    try {
      var parts = [];
      for (var i = 0; i < m.n; i++) { var snap = await S.rt.db.doc('snapshots/' + m.ver + '-' + i).get(); if (!snap.exists) throw new Error('missing'); parts.push(snap.data().d); }
      var model = await C.open(S.key, { iv: m.iv, data: parts.join('') });
      S.retried = false; S.loadError = null;
      if (!S.owner || !S.model) { S.digest = m.digest; show(model); }
    } catch (err) {
      if (S.owner) return;
      if (!S.retried) { S.retried = true; setTimeout(function () { if (S.meta === m) loadSnapshot(); }, 3000); return; }
      S.loadError = 'The newest copy could not be opened. It may still be saving; it will retry on the next update.'; paintStatus();
      if (!S.model) setGate(S.loadError, true);
    }
  }

  /* ---------- owner view: live connectors (read-only tools only) ---------- */
  var DENY = { needs_reauth: 1, server_not_connected: 1, blocked_by_policy: 1, approval_required: 1, not_in_manifest: 1, selection_required: 1 };
  function startLive() {
    if (!S.rt.mcp) { S.liveError = 'Connector access is not available in this view.'; return; }
    var J = C.jobs(Date.now());
    Object.keys(J).forEach(function (key) {
      var j = J[key];
      var un = S.rt.mcp.watchTool(j.server, j.tool, j.input, function (ev) {
        if (ev.type === 'data') {
          S.raw[key] = ev.result.payload;
          S.status[key] = { at: new Date(ev.result.cache && ev.result.cache.storedAt || Date.now()).toISOString(), error: null };
        } else {
          var code = ev.error && ev.error.code;
          if (DENY[code]) delete S.raw[key];
          S.status[key] = { at: S.status[key] && S.status[key].at, error: code === 'needs_reauth' ? 'Reconnect ' + j.server + ' in claude.ai Settings → Connectors' :
            code === 'server_not_connected' ? 'Add ' + j.server + ' in claude.ai Settings → Connectors' : code === 'approval_required' || code === 'not_in_manifest' ? 'Allow ' + j.server + ' for this page' :
            code === 'tool_error' ? j.server + ' reported an error for this dataset' : 'Temporarily unreachable; keeping the last data' };
        }
        scheduleRebuild();
      }, { refetchInterval: 30000 });
      S.unwatch.push(un);
    });
  }
  var rebuildTimer = null;
  function scheduleRebuild() { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(rebuild, 900); }
  async function rebuild() {
    if (!S.raw.people || S.locked) { paintStatus(); return; }
    var model = C.buildModel(S.raw, S.status, Date.now());
    var dg = await C.digest(model);
    S.liveAt = new Date().toISOString();
    if (S.rt.room) S.rt.room.presence({ live: true, at: S.liveAt }).catch(function () {});
    if (dg !== S.digest) { S.digest = dg; show(model); publish(model, dg); } else paintStatus();
  }
  var publishing = false, pendingPublish = null;
  async function publish(model, dg) {
    if (publishing) { pendingPublish = [model, dg]; return; }
    publishing = true;
    try {
      var sealed = await C.seal(S.key, model), CH = 200000, n = Math.ceil(sealed.data.length / CH) || 1, ver = Date.now().toString(36);
      for (var i = 0; i < n; i++) await S.rt.db.doc('snapshots/' + ver + '-' + i).set({ d: sealed.data.slice(i * CH, (i + 1) * CH) });
      var old = S.meta;
      var check = old && old.check ? old.check : await C.seal(S.key, { ok: true });
      await S.rt.db.doc('central/meta').set({ ver: ver, n: n, iv: sealed.iv, salt: old ? old.salt : S.salt, check: check, digest: dg, updatedAt: model.generatedAt, iter: C.ITER });
      if (old && old.ver) for (var k = 0; k < old.n; k++) await S.rt.db.doc('snapshots/' + old.ver + '-' + k).delete().catch(function () {});
      S.saveError = null;
    } catch (err) { S.saveError = err && err.code === 'quota_exceeded' ? 'Storage is full; delete older artifacts or data.' : 'Saving the encrypted copy failed; it will retry on the next change.'; }
    publishing = false; paintStatus();
    if (pendingPublish) { var p = pendingPublish; pendingPublish = null; publish(p[0], p[1]); }
  }
  function refreshNow() { if (S.rt.mcp && S.rt.mcp.invalidate) S.rt.mcp.invalidate().catch(function () {}); }

  /* ---------- interface ---------- */
  var SCRIPTS = ['p-main.js', 'p-hub.js', 'p-fix.js', 'p-ux.js', 'p-wf.js'];
  function loadScripts(list) {
    return list.reduce(function (p, src) { return p.then(function () { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { no(new Error('load ' + src)); }; document.body.appendChild(s); }); }); }, Promise.resolve());
  }
  async function show(model) {
    S.model = model;
    window.MC_ADAPT(model);
    if (S.locked) return;
    if (!S.started) {
      if (S.loading) return; S.loading = true;
      try { await loadScripts(SCRIPTS); } catch (e) { S.loading = false; setGate('Part of the interface did not load. Reload the page to try again.', true); return; }
      S.started = true; S.loading = false;
      openApp(true);
    } else if (gate.classList.contains('out')) {
      try { window.MC_APP && MC_APP.refresh(); window.HUB && HUB.refresh && HUB.refresh(); } catch (e) { console.error(e); }
    } else openApp(false);
    paintStatus();
  }
  function openApp(first) {
    setGate('');
    gate.classList.add('out'); gate.setAttribute('aria-hidden', 'true'); app.inert = false;
    var h = location.hash.slice(1), ws = h && h !== 'office' && h.indexOf('division/') !== 0;
    if (ws) document.body.classList.add('mcws');
    try { if (window.MC_APP) MC_APP.route(); } catch (e) { console.error(e); }
    try { if (window.HUB && !ws) HUB.open(); } catch (e) { console.error(e); }
    setTimeout(paintStatus, 600); setTimeout(paintStatus, 2500);
    paintStatus();
  }
  function statusInfo() {
    if (S.owner) {
      var errs = Object.keys(S.status).filter(function (k) { return S.status[k].error; }).length;
      if (!S.raw.people) return { cls: errs ? 'r' : 'a', text: errs ? 'Connector needs attention' : 'Connecting live…' };
      return { cls: errs || S.saveError ? 'a' : 'g', text: 'Live · checked ' + ago(S.liveAt) + (errs ? ' · ' + errs + ' issue' + (errs > 1 ? 's' : '') : '') };
    }
    var upd = S.meta && S.meta.updatedAt;
    if (S.loadError) return { cls: 'a', text: 'Showing previous copy' };
    if (S.peersLive) return { cls: 'g', text: 'Live · updated ' + ago(upd) };
    var old = upd && Date.now() - Date.parse(upd) > 86400000;
    return { cls: old ? 'a' : 'g', text: (old ? 'Stale · updated ' : 'Updated ') + ago(upd) };
  }
  function paintStatus() {
    var s = statusInfo(), d = $('#livedot'), t = $('#livetxt'), f = $('#sfoot'), d2 = $('#livedot2'), t2 = $('#livetxt2');
    if (d) d.className = 'dot ' + s.cls; if (t) t.textContent = s.text; if (d2) d2.className = 'dot ' + s.cls; if (t2) t2.textContent = s.text;
    if (f) f.textContent = (S.owner ? 'Owner · live connectors' : 'Viewer · read-only') + '. ' + s.text + '.';
  }
  function sourcesSheet(from) {
    var m = S.model; if (!m || typeof window.sheet !== 'function') return;
    var keys = Object.keys(m.sources), ok = keys.filter(function (k) { return m.sources[k].ok && !m.sources[k].error; }).length;
    var rows = keys.map(function (k) { var s = m.sources[k];
      var src = window.MCD && MCD.SRC[k]; return '<li><span class="pn"><i class="dot ' + (s.error ? 'r' : s.ok ? 'g' : 'a') + '"></i>' + (src && src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.name) + '</a>' : esc(s.name)) + '</span><span class="mu">' + esc(s.error || (s.ok ? (s.count != null ? s.count + ' rows' : 'Loaded') + (s.at ? ' · ' + ago(s.at) : '') : 'Waiting for data')) + '</span></li>'; }).join('');
    window.sheet('Data & sources', statusInfo().text, '<p style="margin:0">' + ok + ' of ' + keys.length + ' sources healthy. ' + (S.owner ? 'Connectors re-read about every 30 seconds while this tab is open and visible; the encrypted copy for leaders is saved only when data changes.' : 'Data comes from P&amp;C’s read-only connectors and updates automatically when P&amp;C’s live view saves a change.') + '</p>' +
      (S.saveError ? '<p class="note">' + esc(S.saveError) + '</p>' : '') + (S.loadError ? '<p class="note">' + esc(S.loadError) + '</p>' : '') +
      '<h3>Sources</h3><ul class="plist">' + rows + '</ul>' + (S.owner ? '<button class="btn" type="button" id="refreshnow" style="margin-top:16px;width:100%">Refresh now</button>' : '') +
      '<p class="note" style="margin-top:16px">Select a source to open it. Only read tools are used; the roster\u2019s password and bank account columns are never requested.</p>', from);
    var r = document.getElementById('refreshnow'); if (r) r.onclick = function () { refreshNow(); r.textContent = 'Refreshing…'; };
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('#live'); if (b) sourcesSheet(b); });
  /* Eye button: blurs pay, ID and contact values (for a projector). Remembered on this device only. */
  function setSens(hide) { document.body.classList.toggle('mc-hide', hide); var sb = $('#sensbtn'); if (sb) { sb.setAttribute('aria-pressed', String(hide)); sb.setAttribute('aria-label', hide ? 'Show sensitive values' : 'Hide sensitive values'); } try { localStorage.setItem('mc.hideSens', hide ? '1' : '0'); } catch (e) {} }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('#sensbtn'); if (b) setSens(!document.body.classList.contains('mc-hide')); });
  try { if (localStorage.getItem('mc.hideSens') === '1') setSens(true); } catch (e) {}
  /* A+ button: larger text for easier reading. Remembered on this device only. */
  function setBig(on) { document.body.classList.toggle('mc-big', on); var bb = $('#bigbtn'); if (bb) { bb.setAttribute('aria-pressed', String(on)); bb.textContent = on ? 'A−' : 'A+'; bb.setAttribute('aria-label', on ? 'Normal text size' : 'Larger text'); } try { localStorage.setItem('mc.big', on ? '1' : '0'); } catch (e) {} }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('#bigbtn'); if (b) setBig(!document.body.classList.contains('mc-big')); });
  try { if (localStorage.getItem('mc.big') === '1') setBig(true); } catch (e) {}
  window.MC_BOOT = {
    lock: function () {
      S.unwatch.forEach(function (u) { try { u(); } catch (e) {} }); S.unwatch = [];
      if (S.rt.room) S.rt.room.presence({ live: null, at: null }).catch(function () {});
      S.key = null; S.model = null; S.raw = {}; S.status = {}; S.digest = ''; S.locked = true;
      var v = $('#view'); if (v) v.innerHTML = '';
      app.inert = true; gate.classList.remove('out'); gate.removeAttribute('aria-hidden');
      unl.disabled = false; pc.value = ''; $('#pc2').value = ''; paintGate(); setGate('Locked.');
      setTimeout(function () { pc.focus(); }, 400);
    },
    status: statusInfo, sources: sourcesSheet, refreshNow: refreshNow
  };
  try { var th = localStorage.getItem('mc.theme'); if (th) document.documentElement.dataset.theme = th; } catch (e) {}
  var gth = $('#gth'); if (gth) gth.onclick = function () { var r = document.documentElement, d = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches; r.dataset.theme = d ? 'light' : 'dark'; try { localStorage.setItem('mc.theme', r.dataset.theme); } catch (e) {} };
  init();
})();
