/* Maddie Journey | 2027 — data core (browser + Node).
 * 1. JOBS: the read-only connector calls the owner's view makes.
 * 2. buildModel(): raw connector payloads -> one aggregate monitoring model.
 *    Only fields shown here are requested; restricted tables are reduced to
 *    counts, and counts of 1-2 become "<3" so no small group is identifiable.
 * 3. seal()/open(): gzip + AES-256-GCM with a key derived from the passcode. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MC_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var BASE = 'appm0tQwx2qy6T7VQ';
  var HOLIDAYS = 'en.philippines#holiday@group.v.calendar.google.com';
  var MASTERLIST = '1ps3sjKLkOvBhag8pZYhMivNrZZS10ZWrwstZL44pd8w';
  var F = {
    id: 'fldqkxggPg5zwh4Ab', first: 'flddzBNWtDWYM8jn1', last: 'fldo1b8IVG8guhPg0', dept: 'flduz4B2OAtIZ8LjG',
    pos: 'fldRagX7PCDhmAzkx', status: 'fld9fvRtbONcAEg7C', hire: 'fldrluTRKtUIcNYZB', hireText: 'fldMZ8hMqIvwCrnXG',
    reg: 'fldEM5tCqpdj1bwQS', sep: 'fldC6lKqtH450mwWz', bday: 'fldIDTYfwZ9q8Kv7Q'
  };
  var FX = { basic: 'fldKTwBAsFz92UjAO', current: 'fldfLJ4lCqi6mElgi', daily: 'fldwcg6o000a1EydJ', allowance: 'fldrn7j2AgLPRRGIm', gross: 'fldnPmWnQEK4qwL5H',
    meal: 'fldzoMUydof57YJeU', rsl: 'fldm6Hu9KUOxXbDEb', gas: 'fld8DAB1yTNea2TVA', other: 'fldZUoU3inbrkuFxK', additional: 'fldZnCOsPok5LM67V', ptype: 'fldsRHYVSiMpa2KaT',
    raises: 'fldKe6TvF9PEk2xQA', raiseRate: 'fldChh57HoCDxGQtK', sss: 'fldPV7FA6RyE40xCN', philhealth: 'fld6tuZBAGXSgclf2', pagibig: 'fldyOo2oiYX6eazOt', tin: 'fldXfMS9rFj13nyEC',
    cemail: 'fldApyDu1G4tIQiGN', pemail: 'fldLjTPi4jyk8Dehy', phone: 'fldaTUisJryAbsA9K', address: 'fldJQ9bbhTTfkPFoB', ecName: 'fldluSZhVMH7JaE2r', ecPhone: 'fld0huQZ6OTqSHuEi', ecRel: 'fldPYPbeDcsffryad', gender: 'fldmBS9CS1qCReeaL' };
  var FX_FIELDS = Object.keys(FX).map(function (k) { return FX[k]; });
  var DOCS = [
    ['probation-contract', 'Employment contract', ['fldRnY9UcaEj3NnGJ']],
    ['regularization-contract', 'Regularization contract', []],
    ['nda', 'Non-disclosure agreement', ['fldUQu41piUR6NCOn']],
    ['ncc', 'Non-compete agreement', ['fld1EWGsUs4BQcbmt']],
    ['personal-data', 'Personal data sheet', ['fld6LQ9nqOkbPt4R2']],
    ['identity', 'Two valid IDs', ['fldzLpBNpWVbVjZuy']],
    ['tax', 'TIN ID', ['fldaRAqh4gAUbFsZr']],
    ['benefits', 'SSS, PhilHealth, Pag-IBIG', ['fldOyHxm0gi4fk5XJ', 'fldKHdrfIO1zoIuRc', 'fldBJ4y99VsfgC5sF']],
    ['emergency-contact', 'Emergency contact form', ['fldQ3ueVI9bvkT1iK']]
  ];
  var DOC_FIELDS = [].concat.apply([], DOCS.map(function (d) { return d[2]; }));
  var HUB = 'appg7wZqpC7iLmkyK';
  var EXTRA = {"raises":{"base":"appm0tQwx2qy6T7VQ","table":"tblfZnY8PRpSoWsn5","name":"Salary Increase Tracker","f":{"emp":"fldBr9RrmyeEilMxy","date":"fldAGxhuartYBIc2J","prev":"fldSYfb1zpx1IKLVY","new":"fldyolw7gXi8ksWQo","pct":"fldKZH7Diu532tVAE","reason":"fldRb9qpbxmQVGxqu","pos":"fld3tNz0sUj7Frg1x"}},"salmove":{"base":"appm0tQwx2qy6T7VQ","table":"tblSm7D5kLBGHbFoz","name":"Salary Movement Monitoring","f":{"emp":"fld2jUn71qP3x8CYH","cur":"fldBkQ534mIIaboVn","prop":"fldFtIDVAfRJdk74X","curSal":"fld8J8WsLiwyqqbqM","propSal":"fldBHrTSELQekrKVm","pct":"fldxPDr76oSiiegn8","date":"fldyeJzb3TB7fZvgd","mgmt":"fld3WkIL9UX16jlo9","final":"fldt7hqKLGdpWMYoh","kpi":"fldfp6Lqw53mcHy6O","ref":"fldLnjn497SgIQNfw"}},"transitions":{"base":"appm0tQwx2qy6T7VQ","table":"tbl8RNZ7qw1ZhZm5W","name":"Transition of Role Monitoring","f":{"emp":"fldGGuX9fsGWIN4C7","cur":"fldxXmojaUxd9kvxs","prop":"fldXvwvcb4qcDYBuB","eff":"fldXqIgI6YtU6nXSq","decision":"fldjYMOoQHycCH6VM","final":"fldjp6ujUADXy2532","review":"fldgJDJ67L8jU0cGQ","unit":"fld7Q57ONXNNenDl1","ref":"fldkzsJRU6zAByZ17"}},"memos":{"base":"appm0tQwx2qy6T7VQ","table":"tblfZt0c7pRImHhv3","name":"Memo Repository","f":{"title":"fldCEINSZq6jHTrUU","no":"fldu7Vmu8bezwIEvT","date":"fldRPplSvkRB12fkn","eff":"fld89QWlqxOvKigow","cat":"fld3uOTgBkecw0r78","status":"fldzmOJ2ty7g7gB46","link":"fld1Uugxh9woWvx34","by":"fldO7Kp880j3y2zuv"}},"pctasks":{"base":"appm0tQwx2qy6T7VQ","table":"tbl9bwfNLodoRtLw2","name":"P&C Tasks","f":{"task":"fldtTo7YF9cE6v5mu","who":"fldOw6AvHi1lnxbru","status":"fld2zDs6OPKDF56wa","facet":"fldP82dLtkfFU2EZj","prio":"fldHkOKaORpZcevKH","due":"fldlXTUsoGhYOjYvc","tstatus":"fldyUZVu1PlpJhq5Q"}},"kpis":{"base":"appm0tQwx2qy6T7VQ","table":"tblcSnR9R5YKVZUBq","name":"KPI","f":{"kpi":"fldD7gscHNGizQoMF","prio":"fldKFTfDPzKj80YcV","pct":"fldCBJgYZ9kDxW344","status":"fld2WcMBtOx83WeTL","start":"fldlPZY8kcjc2xdpQ","end":"fldHgVgV5vovEMCZY","facet":"fldeB4mBGKT4hXfVg"}},"helpdesk":{"base":"appm0tQwx2qy6T7VQ","table":"tblq6tgOYOr1ZFIpj","name":"HR HelpDesk/Counselling","f":{"emp":"fldDanEvz17OwrivT","type":"fldtmkg56EITPr6Z2","prio":"fldcfF3fN026WYlOt","subject":"fldzno2L3GjpMY96w","status":"fldA3mN83JHQ0DB2z","created":"fldaXB6v10jXUPAGx","conf":"fldtUPraeYVmfJ9eZ","anon":"fldgD3HjPg2bPkC2m"}},"pcmeetings":{"base":"appm0tQwx2qy6T7VQ","table":"tbl5LLbt3chAX0ClD","name":"P&C Meetings & Email","f":{"date":"fldZQcvJ96cn47iny","agenda":"fldk1Ujto4QQXHMwi","type":"fldLB1UPXohiE6tOR","subject":"fld1ECYCYxBBteyGD","emp":"fldYjx6LxDOWHFFON"}},"wigs":{"base":"appg7wZqpC7iLmkyK","table":"tblKsDV7nr2Jpc9OX","name":"WIGs","f":{"name":"fldj1mH4sZUISDCfV","stmt":"fldp1rZ7MbHKMHUtG","from":"fld2x9aNMtkbNx1Hn","to":"fld6pPVWTejCxnhdF","health":"fldjUGMe5S5botlzz","progress":"fldJHQx14iUbVLHMV","inits":"fldxzknnt8S6TH08j","reds":"fld4kNKlZlfdIk1I2","target":"fldQyLtvTIWRTJ81H","year":"fldprEYnbWaBnbQwZ"}},"initiatives":{"base":"appg7wZqpC7iLmkyK","table":"tblJcHxhcOvGoUxvy","name":"Initiatives","f":{"name":"fldPMIRXeG0mRk7yI","div":"flds4r4EaWfTMGhp9","impact":"fld62xE5BKoxBvPFp","target":"fld2tSbaD6E8V7Cx3","conf":"fldFfR85N9ZEXsi7V","blocker":"fldb0qlhKzugTOPIM","next":"fld6uMCkC91ZVE9hu","red":"fldV10mUvoF1jI8Kl","stale":"fldlJ1ndzoLhZKccH","days":"fld89tKrTPBYyMhAp","link":"fldl6L43LBbQV0CKi"}},"decisions":{"base":"appg7wZqpC7iLmkyK","table":"tblkgwNo0cTqz8veL","name":"Meeting Decision","f":{"decision":"fldihmzzWijGZ8t5J","type":"fldAPVVuLIqGRgVBz","owner":"flddbp6FBVmNhD3cY","due":"fld5DIsOmo1APAkWn","status":"fldXAM6LQxMBSFZ9X","context":"fldNglqTyZFVykQto"}}};
  var T201_FILE = '1Q0wtlkzD0A1WVOI2tj5Gayt4edelhJ2J', T201_FOLDER = '1SsidNmzHws0DuqK6HEu-6u9wwgHByB0w';
  var HUBCFG = {"sync":{"tasks_design":{"table":"tbl5uFVa0P5GgPURU","name":"fldxG2ooco57bYLgE","status":"fldN5lsk7OIMSEcah","due":"fldWg4063emhVlrYq","done":"fldosqlIv83TWFTuL","prio":"flda8nwISuSDgSREo","project":"fldJLVQWPBbJSUvJy"},"tasks_corpops":{"table":"tblAUqLsraCaNBL07","name":"fldSTKk4LYMJ0ylUc","status":"fldlWmdL2K0xar9CH","due":"fldrYYIGAwjhYM7hi","done":"fldyukD4VcNzGm8zY","prio":"fldLfkGta0yPqbDuF","project":"fldm8vYdDoFuc51MI"},"tasks_finance":{"table":"tblb6ccgsPpeHKObL","name":"fldCXNCZ0vPILhR7w","status":"fldgqeuCgjH8lzlpX","due":"fld5poZbbcDgNAW3g","done":"fldikmR5O1CB8EfjM","prio":"fldoiVEBeOi5MtCNb","project":"fldB9cqBSMMJi1NTP"},"tasks_cj":{"table":"tblm7OUwTDl0wpHF9","name":"fldKuvUqz9Ex3BY5d","status":"fld0LYmjK64jy5zw7","due":"fldRTU9cAbM4ItDeR","done":"fldZYnBGcidChvbC3","prio":"fldbmPaj1DBNoTtQO","project":"fld5FzgfwE9Bng4sb"},"tasks_marketing":{"table":"tbl5kTBavuHoGRkaL","name":"fld0ri10fV9FFVDbX","status":"fldfyVdHCD5CGH0r7","due":"fldJOvsMktUzxlQbc","done":"fldNOYhl1n2SdbSSR","prio":"fld9LhdMjZrAHdNQz","project":"fldLNyWGVFaK0vp75"},"tasks_techops":{"table":"tbldkS75A8JdBgKsP","name":"fld49LWKMzTJnuiaT","status":"fldYq3xU8AhS5BtkX","due":"fldd6woGMZHa9BtN0","done":"fldJpVQnHY7THMO26","prio":"fld5H2GHK8USrnoqk","project":"fldwLetK6SpWcWE25"},"tasks_bizdev":{"table":"tblsh5RhKvkWvTYVM","name":"fld8foVUn2Rwff1Gt","status":"fldYFMA9hkYaLLT3W","due":"fldW8wjI4sFuX0zCO","done":"fld4Om7RCqBc3UhNl","prio":"fldRbBfEItvbzuwyV","project":"fldyaGtAUmwwELJfz"},"tasks_gencon":{"table":"tbllimRapt4p4IkIK","name":"fldJvvfFVjxQQvvQR","status":"fldQcUgVQGw9npgBc","due":"fldW5Fkx5DAdiHBfm","done":"fldIuGmu4AOHJn5IS","prio":null,"project":"fldiS35KoXHtQ8cNh"}},"pulse":{"pulse_pc":{"table":"tblrTaer0Me8s0g4Q","week":"fld6CC4MXDunPYj2v","from":"flde2ZPGurG8LORSC","sub":"fldlIGfoThvl6c5Cc","status":"fld9sPgstq0z4PWMK","lights":[["fldkpSlXUaI9j7hUX","Leaves"],["fldtzwJUSI6Mz5qiE","Lates"],["fld7TS11y7xa5rqWn","NTEs"],["fldYObzTjuMv9s1gK","Interview Success"],["fld5QljFJbFGpM4Po","Avg Hire Fill Time"]]},"pulse_finance":{"table":"tbllKhiCkGG740ovl","week":"fldShvGe5LdLYjyoW","from":"fld9G2sGG493VcKEm","sub":"fldXiLVPbIqlrVco4","status":"fldRo8FNIFLREnEf4","lights":[["fldIoWzKfq6yWFf7H","Weekly Cash Position"],["fldjGeczN2VJhM3g6","Expense Spend %"],["fldUTdDWE2oeuFKJo","AP Overdue %"],["fldC5s7RPw5EoTbpO","Weekly AR Collected"],["fldC2heuRkRaA4rrK","Weekly Net Profit"],["fldBSncApr1E4cHQq","AR Overdue"]]},"pulse_sales":{"table":"tbldLvYTdCjFB0dH5","week":"fld37kjFEC9ZGpjep","from":"fldaNjTZ269C3niUL","sub":"fldR6C6aUEc5R7JB0","status":"fld81Y6p0eiltvhdO","lights":[["fldpmXgh8dhiAf0Kl","TCV"],["fldDWSPlVt9Zrq0PG","Deals"],["fldlyHehjgRhNHF8S","Consultations"],["fldis4RTtlabJMxaF","Immediate Calls"]]},"pulse_bizdev":{"table":"tblySjQ5TqSismdTQ","week":"fldm74FmDOsZVqIWY","from":"fldLt2xXKX5IGjcYy","sub":"flddrrDndzylpHtjF","status":"fldKwgqifH7UXNOrz","lights":[["flduFaJs5KDWGpptA","BD Immediate Calls"],["fldYrMg9mmO4PXB6Q","BD Consultations"],["fldUEoSnztMj3tyYh","Active BD Projects On Schedule"],["fldrdnARCBYxNwIGj","Milestones"]]},"pulse_design":{"table":"tblk2r8hmcL9lgrUt","week":"fldZ5zNVUvVKGvg4p","from":"fldprsYs1tXupL7x8","sub":"fld7MgvqhDZhSp4ta","status":"fldybF9XQY38kRcGZ","lights":[["fldwWBZo4fDpWA6vq","Active Projects On Schedule"],["fldsBgv8S8ilk96lG","Active Projects w/ \ud83d\udfe2 Financial Health"],["fldRtWlVwnzRUgaSo","Design Deliverables On Time"]]},"pulse_marketing":{"table":"tblIYOvNhruPcy8QR","week":"fldwdzk41P4wFCDTZ","from":"fldVzxcF8YHfqv7Vz","sub":"fldnxWi5BAaS9TogG","status":"fldUCL50DIJrHZJoA","lights":[["fld6SZU0XypYg69du","Weekly FB Content"],["fldaBqgFZW0SElTDK","Weekly IG Content"],["fldWESSTedupUFOaz","Weekly TikTok Content"],["fldZ8EGFi8egM9m5e","Weekly FB Content Score"],["fldNoWkGjEEapXrwo","Weekly IG Content Score"],["fldjbQmEg2pPelqyO","Weekly TikTok Content Score"],["fldi95p3mMmKPzT21","Weekly FB Engagement"],["fldQ5Q0gnpIot9JPw","Weekly IG Engagement"],["fld8oW7TTMjZBDM5z","Weekly TikTok Engagement"],["fldeyccivmZMccIBg","Weekly Residential CPR Performance (FB)"],["fldMAu9LYM9DHgLA0","Weekly Commerical CPR Performance (FB)"],["fldqZkWDY4RjzJKxQ","Weekly Residential CPR Performance (IG)"],["fld23UlTGXb7wRVEa","Weekly Commercial CPR Performance (IG)"],["fldf6onEFlJwVe6H5","Weekly Website Visitors"],["fldJwO4ehvoNpPTin","Weekly Website Avg Visit Duration"]]},"pulse_it":{"table":"tblqNYrN35EVDzCXj","week":"fld5Q66rBoOwYOr7f","from":"fldvcZhYImQgH4iAY","sub":"flddxNOWYwS3aIfw0","status":"fldEWcstxRWUCanJP","lights":[["fldUNAXi0cCiBN2Xx","Completed Ticket w/in SLA"],["fldznerBOlHthVWMR","Weekly Avg Ticket Completion Time"],["fldTR7PSNQTstvQB7","Weekly Completed Tickets"],["fldAjs1xqPXRF77j6","Tickets Triaged w/in 24H"],["fldwtnelozB4CS0X1","Projects w/ Approved Plan"],["fld92eaAE20V27AfY","Intake to Approved Plan"],["fldq3s4HSsPYoaaBv","Size-Banded at Intake"],["fldwg5DQrRkBUKImo","Original Due Date Locked"],["fldja3PAlE5QFkQex","Active Projects On Schedule"],["fldvszkQkiP8lewxz","Schedule Slip"],["fld7cjtbx5owwvR7P","Delivered On Original Due Date"],["fldiQQeA8s95QDoXB","Weekly Project Updates"],["fldGQwd4pvDd06zqp","Requester Sign-Off"]]},"pulse_qs":{"table":"tbl1Tj57zAOT1arqe","week":"fldGCLVswr48o8uoT","from":"fldO28Gm3fgTkY2e0","sub":"fldVIP64s556FmgYA","status":"fldJsY782eAkDZ788","lights":[["fldS5HRCl20e9Lf8X","Avg BOQ Creation"],["fldzxDko1vTDPwg2o","Avg LQ Creation"],["fldA2yrSZFlNTiFEK","LQ Won Rate %"],["fldr97nvizPxApmhs","Weekly Quotation Creation (LQ + BOQ)"]]}}};
  function at(table, fields, size) {
    return { server: 'Airtable', tool: 'list_records_for_table', input: { baseId: BASE, tableId: table, pageSize: size || 2000, fieldIds: fields } };
  }
  function windowRange(now) {
    var d = new Date(now || Date.now());
    var y = Number(fmt(d, { year: 'numeric' })), m = Number(fmt(d, { month: 'numeric' }));
    var start = y + '-' + pad(m) + '-01';
    var e = new Date(Date.UTC(y, m - 1 + 3, 1));
    var end = e.getUTCFullYear() + '-' + pad(e.getUTCMonth() + 1) + '-01';
    return { start: start, end: end };
  }
  function jobs(now) {
    var w = windowRange(now);
    var o = {
      people: at('tblxpl5OtvuNC57O8', [F.id, F.first, F.last, F.dept, F.pos, F.status, F.hire, F.hireText, F.reg, F.sep, F.bday].concat(DOC_FIELDS, FX_FIELDS)),
      departments: at('tblV0THbeXrY7uLyB', ['fldkrnTAtVUs49xHN'], 100),
      attendance: at('tblndLiwxt64WfeHm', ['fldfJzllNfMpJoTvN', 'fldN9MmrWvdDAB6wu', 'fldJMbl3NVma2kNSw']),
      development: at('tbltViWwcJh93EDt0', ['fldGPGsYzmKwexrA2', 'fldgVvnkOgIrmEQeS', 'fldOJ6Ra6KQly5B1T', 'fldF62Y49plNBLs2h', 'fldQxCSJ8MChl8dUm'], 500),
      positions: at('tblcWi2a04clVMKVm', ['fldoPkNj8xkWpCgnO', 'fldQfak76TS9OyDWV', 'fldry8KfkqcSAHTYg', 'fld7ZDkzXxWaHeJLF', 'fldjc5JZXJbJx3smj', 'fldcdhnPrAovLIXng', 'fld8yMa7ENNVwOgjH', 'fldhPDrEGeoVWOCIB', 'fldpY7uxNhBu4cZ7I', 'fldPkDJQGbFbqXpaQ'], 500),
      candidates: at('tblegDXGxcVfJfRPG', ['fldIBuCFFCbeIsWhJ', 'fld0Sgf4AzOiftmSB', 'fldWvVNTdGG7oCoyw', 'fldJ2cmflo5edDrSf']),
      interviews: at('tblrbQmtbAFFFlYoF', ['fldmLm0vvF5KaQ2Wa', 'fldEZhPlyR6WAcwMF', 'fldVYtklu50x2JFqr', 'fldxKtbLpPBVOTjAm'], 500),
      incidents: at('tbl95uBWcTrsJE0Uc', ['fldhr8w04sGPCi6XE', 'fldTxr2QrFiDoPqWf', 'fldANnxJ7ZOYlJksS', 'fldW6690S8DXtYvXD', 'fld8nbnaqwun51b8D', 'fld3i3PZ0LLEffTgB', 'fld25dfaZ529uQNwQ', 'fldcaptPzVuilBcod', 'fld0gm3MqbWshi6cC', 'fld1pBnBZAzdw4ihv', 'fld8MmfMkETl4BxUS'], 500),
      nte: at('tbla6FmjdpXvh4d32', ['fldFpul2ZjwidEdUd', 'fldZEnW5rJdOLoTJd', 'fldFIBxoCfAlxCs6c', 'fld2jeNHT9LLTg7oM', 'fldhhYXWUsLuB74NY', 'fld8OBVmzAulm9xgl', 'fld8iCsTNze0qdzdL', 'fldVxOPdDpoEcBG2P'], 500),
      warnings: at('tblgu4nuoNo96Pndz', ['fldH4rTYQfNOHXjEw', 'fldxTXMCO3NzNkO6u', 'fldxIWPlp7IJFs5OR', 'fldB02QQoLfiVf6DA', 'fld7hxFMay7FXpIJB'], 500),
      pips: at('tbl7gwo6VGVIksCJz', ['fldJuwKdvZKd9qMBW', 'fldmSlEZ1A1fI5bU2', 'fldbAVXV9PEyEeYNi', 'fldv5BYjFNasUi6Nb', 'fld5j6LG2ALP82fP7', 'fldbkX1yjbYbKD6UC', 'fldiUrTwyM13VlGLD', 'fldSQPM3myx8U1apE'], 500),
      satisfaction: at('tblYpPOsYKczaT90U', ['fldFgnrs1p2Alj4gP', 'fldom0BQasPphY9c4', 'fld9GQV9jktEiivBW', 'fldlmY3z9KMCxGeid', 'fldZJFP9mSjgwME6R', 'fldhWpbpCTJG8WxGc', 'fldvIrrS2rdKiGjyG'], 500),
      maddieHour: at('tblbCoa1jeWXZQ95l', ['fldzWrEGCDBFIWTdQ', 'fldRyLsTwPQO2DxAK', 'fldxeqSb5d60w0RYs', 'fldwbG9qGE5eRyXHS', 'fldoPEPdddt520R7s', 'fldN3mkuv0Q6JROih', 'fldHqUlkzQtURlqtm', 'fld9r4UEAO6y7pVBt', 'fldMoYwXiqkkUdCdD', 'fldMYf1vPNUrtxgto', 'fldNs9mkUYgINJEd2', 'fldKgqv6S1R912j4J', 'fldin8uuqfNPlFg3S'], 500),
      calendar: { server: 'Google Calendar', tool: 'list_events', input: { startTime: w.start + 'T00:00:00', endTime: w.end + 'T00:00:00', pageSize: 250, timeZone: 'Asia/Manila' } },
      holidays: { server: 'Google Calendar', tool: 'list_events', input: { calendarId: HOLIDAYS, startTime: w.start + 'T00:00:00', endTime: w.end + 'T00:00:00', pageSize: 100, timeZone: 'Asia/Manila' } },
      masterlist: { server: 'Google Sheets', tool: 'get_values', input: { spreadsheetId: MASTERLIST, range: 'Masterlist!E1:F2000' } }
    };
    Object.keys(HUBCFG.sync).forEach(function (k) { var c = HUBCFG.sync[k]; o[k] = { server: 'Airtable', tool: 'list_records_for_table', input: { baseId: HUB, tableId: c.table, pageSize: 1000, fieldIds: [c.name, c.status, c.due, c.done, c.prio, c.project].filter(Boolean) } }; });
    o.tracker201 = { server: 'Google Drive', tool: 'read_file_content', input: { fileId: T201_FILE } };
    o.folders201 = { server: 'Google Drive', tool: 'search_files', input: { query: "parentId = '" + T201_FOLDER + "' and mimeType = 'application/vnd.google-apps.folder'", pageSize: 100, orderBy: 'modifiedTime desc', excludeContentSnippets: true } };
    Object.keys(EXTRA).forEach(function (k) { var c = EXTRA[k]; o[k] = { server: 'Airtable', tool: 'list_records_for_table', input: { baseId: c.base, tableId: c.table, pageSize: 500, fieldIds: Object.keys(c.f).map(function (x) { return c.f[x]; }) } }; });
    Object.keys(HUBCFG.pulse).forEach(function (k) { var c = HUBCFG.pulse[k]; o[k] = { server: 'Airtable', tool: 'list_records_for_table', input: { baseId: HUB, tableId: c.table, pageSize: 300, fieldIds: [c.week, c.status].concat(c.lights.map(function (l) { return l[0]; })).filter(Boolean) } }; });
    return o;
  }
  var SOURCE_NAMES = {
    people: 'Airtable · People', departments: 'Airtable · Departments', attendance: 'Airtable · Tardiness/Leave Tracker',
    development: 'Airtable · Development Monitoring', positions: 'Airtable · Open Positions', candidates: 'Airtable · Pooled Candidates',
    interviews: 'Airtable · Interviews', incidents: 'Airtable · Incident Reports', nte: 'Airtable · Notice to Explain',
    warnings: 'Airtable · Warnings', pips: 'Airtable · Improvement Plans', satisfaction: 'Airtable · Satisfaction Survey',
    maddieHour: 'Airtable · Maddie Hour Feedback', calendar: 'Google Calendar · primary', holidays: 'Google Calendar · PH holidays',
    masterlist: 'Google Sheets · Masterlist',
    tracker201: 'Google Drive · 201 Files Digitalization Tracker',
    folders201: 'Google Drive · 201 FILES folders',
    raises: "Airtable \u00b7 Salary Increase Tracker",
    salmove: "Airtable \u00b7 Salary Movement Monitoring",
    transitions: "Airtable \u00b7 Transition of Role Monitoring",
    memos: "Airtable \u00b7 Memo Repository",
    pctasks: "Airtable \u00b7 P&C Tasks",
    kpis: "Airtable \u00b7 KPI",
    helpdesk: "Airtable \u00b7 HR HelpDesk/Counselling",
    pcmeetings: "Airtable \u00b7 P&C Meetings & Email",
    wigs: "Chiefs\u2019 Hub \u00b7 WIGs",
    initiatives: "Chiefs\u2019 Hub \u00b7 Initiatives",
    decisions: "Chiefs\u2019 Hub \u00b7 Meeting Decision",

    tasks_design: "Chiefs' Hub · Design tasks",
    tasks_corpops: "Chiefs' Hub · Corp Ops tasks",
    tasks_finance: "Chiefs' Hub · Finance tasks",
    tasks_cj: "Chiefs' Hub · Client Journey tasks",
    tasks_marketing: "Chiefs' Hub · Marketing tasks",
    tasks_techops: "Chiefs' Hub · Tech Ops tasks",
    tasks_bizdev: "Chiefs' Hub · BizDev tasks",
    tasks_gencon: "Chiefs' Hub · GenCon tasks",
    pulse_pc: "Chiefs' Hub · P&C weekly pulse",
    pulse_finance: "Chiefs' Hub · Finance weekly pulse",
    pulse_sales: "Chiefs' Hub · Sales weekly pulse",
    pulse_bizdev: "Chiefs' Hub · BizDev weekly pulse",
    pulse_design: "Chiefs' Hub · MH Design weekly pulse",
    pulse_marketing: "Chiefs' Hub · Marketing weekly pulse",
    pulse_it: "Chiefs' Hub · IT weekly pulse",
    pulse_qs: "Chiefs' Hub · QS weekly pulse"
  };

  /* ---------- helpers ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmt(d, o) { return new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: 'Asia/Manila' }, o)).format(d); }
  function today(now) { var d = new Date(now || Date.now()); return fmt(d, { year: 'numeric' }) + '-' + pad(fmt(d, { month: 'numeric' })) + '-' + pad(fmt(d, { day: 'numeric' })); }
  function num(v) { if (Array.isArray(v)) v = v[0]; var n = typeof v === 'number' ? v : parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? null : Math.round(n * 100) / 100; }
  function txt(v) { if (Array.isArray(v)) v = v.map(function (x) { return x && x.name || x; }).join(', '); return v == null ? '' : String(v).trim(); }
  function name(v) { return typeof v === 'string' ? v : (v && v.name) || ''; }
  function links(v) { return (Array.isArray(v) ? v : []).map(function (l) { return typeof l === 'string' ? { id: l, name: '' } : l; }).filter(function (l) { return l && l.id; }); }
  function recs(p) { return p && Array.isArray(p.records) ? p.records : []; }
  function cells(r) { return r.cellValuesByFieldId || r.fields || {}; }
  function addDays(iso, n) { var d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function addMonths(iso, n) {
    var y = Number(iso.slice(0, 4)), m = Number(iso.slice(5, 7)) - 1 + n, d = Number(iso.slice(8, 10));
    var last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    var r = new Date(Date.UTC(y, m, Math.min(d, last)));
    return r.toISOString().slice(0, 10);
  }
  function days(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000); }
  function count(list, fn) { var o = {}; list.forEach(function (x) { var k = fn(x); if (k) o[k] = (o[k] || 0) + 1; }); return o; }
  /* Small-count suppression for restricted aggregates. */
  function sup(n) { return n === 0 ? 0 : n < 3 ? '<3' : n; }
  function supObj(o) { var r = {}; Object.keys(o).forEach(function (k) { r[k] = sup(o[k]); }); return r; }
  function normId(raw) {
    var t = String(raw == null ? '' : raw).trim();
    if (!t) return { c: null, s: 'missing', raw: '' };
    if (!/^\d{1,6}$/.test(t)) return { c: null, s: 'invalid', raw: t };
    var c = String(Number(t)).padStart(4, '0');
    return { c: c, s: c === t ? 'ok' : 'format', raw: t };
  }
  function longDate(t) {
    var m = /^([A-Za-z]+)\.?\s+(\d{1,2}),\s*(\d{4})$/.exec(String(t || '').trim());
    if (!m) return null;
    var i = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(m[1].slice(0, 3).toLowerCase());
    return i < 0 ? null : m[3] + '-' + pad(i + 1) + '-' + pad(Number(m[2]));
  }
  var ACTIVE = { Regular: 1, Probationary: 1, 'Part-Time': 1, Contract: 1, 'On Leave': 1 };
  var INACTIVE = { Resigned: 1, Terminated: 1, AWOL: 1 };
  var DIV = {
    'RMD': ['rmd', 'RMD', 'Revenue Management'], 'CORP OPS': ['corp', 'Corp Ops', 'Corporate Operations'], 'MEDIA': ['media', 'Media', 'Media'],
    'GENCON': ['gencon', 'GenCon', 'GenCon'], 'BUSINESS DEV': ['bd', 'Business Dev', 'Business Development'],
    'DESIGN/OPERATION': ['design', 'Design / Ops', 'Design & Design Operations'], 'CEO TEAM': ['ceo', 'CEO Team', 'CEO Team'],
    'COO TEAM': ['coo', 'COO Team', 'COO Team'], 'EXEC': ['exec', 'Exec', 'Executive']
  };
  var ATT = { 'Late': 'late', 'Awol': 'absent', 'AM Halfday': 'halfday', 'PM Halfday': 'halfday', 'Work From Home': 'wfh', 'Offset': 'wfh' };
  function attKind(t) { return ATT[t] || (/leave/i.test(t) ? 'leave' : 'other'); }
  var PC = /p&c|people\s*&\s*culture|\bhr\b|onboard|orientation|evaluat|regulari|probation|revalida|culture code|maddie hour|general assembly|town ?hall/i;
  var RESTRICTED = /\bpip\b|\bnte\b|notice to explain|disciplin|counsel|warning|incident|terminat|resign|exit interview|investigat|\blip\b/i;

  /* 201 tracker: CSV-like text from Drive. Left table: one row per employee; right table: leaders' core agreements. */
  function csvRow(line) { var out = [], cur = '', q = false; for (var i = 0; i < line.length; i++) { var ch = line[i];
    if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out.map(function (x) { return x.trim(); }); }
  function parse201(text) {
    var t = String(text || ''), lines = t.split(/\r?\n/); if (lines.length < 5) lines = t.split(/ (?=\d{1,3},")/);
    var st = function (v) { v = String(v || '').trim(); return /^uploaded$/i.test(v) ? 'Uploaded' : /no record/i.test(v) ? 'No Record' : /not applicable/i.test(v) ? 'Not applicable' : ''; };
    var rows = [], core = [], level = '';
    lines.forEach(function (ln) { var c = csvRow(ln);
      if (/^\d{1,3}$/.test(c[0]) && c[1] && /,/.test(c[1])) rows.push({ no: +c[0], name: c[1], prob: st(c[2]), mh: st(c[3]), tcg: st(c[4]), mf: st(c[5]), nda: st(c[6]), ncc: st(c[7]), verified: c[8] || '' });
      var n2 = c[10] || '', r2 = c[11] || '';
      if (/level/i.test(n2) && !r2) level = n2;
      else if (n2 && /,/.test(n2) && st(c[12])) core.push({ level: level, name: n2.trim(), role: r2, core: st(c[12]), nda: st(c[13]), verified: c[14] || '' }); });
    var m = /TOTAL EMPLOYEES:,,(\d+)/.exec(t);
    return { rows: rows, core: core, declared: m ? +m[1] : null };
  }

  /* ---------- model ---------- */
  function buildModel(raw, status, now) {
    var t = today(now), ms = now || Date.now();
    var srcStatus = {};
    Object.keys(SOURCE_NAMES).forEach(function (k) {
      var s = status && status[k];
      srcStatus[k] = { name: SOURCE_NAMES[k], ok: !!(raw[k]), error: s && s.error || null, at: s && s.at || null,
        count: raw[k] ? (recs(raw[k]).length || (raw[k].events || []).length || (raw[k].values || []).length || (raw[k].files || []).length || null) : null };
    });
    var deptNames = {};
    recs(raw.departments).forEach(function (r) { deptNames[r.id] = name(cells(r).fldkrnTAtVUs49xHN); });

    /* People */
    var people = recs(raw.people).map(function (r) {
      var c = cells(r), idn = normId(c[F.id]), st = name(c[F.status]);
      var dl = links(c[F.dept])[0], dname = dl ? (dl.name || deptNames[dl.id] || '') : '';
      var dv = DIV[String(dname).toUpperCase()] || (dname ? ['dept-' + dname.toLowerCase().replace(/[^a-z0-9]+/g, '-'), dname, dname] : ['none', 'No department', 'No department recorded']);
      var hire = c[F.hire] || longDate(c[F.hireText]) || '';
      var files = {}, missing = 0;
      DOCS.forEach(function (d) {
        if (!d[2].length) { files[d[0]] = 'unavailable'; return; }
        var all = d[2].every(function (f) { return Array.isArray(c[f]) && c[f].length; });
        files[d[0]] = all ? 'on-file' : 'missing'; if (!all) missing++;
      });
      return { rid: r.id, idn: idn, status: st, cohort: ACTIVE[st] ? 'active' : INACTIVE[st] ? 'inactive' : 'unknown',
        name: [name(c[F.first]), name(c[F.last])].join(' ').replace(/\s+/g, ' ').trim() || 'Name not recorded',
        div: dv[0], divShort: dv[1], divName: dv[2], pos: name(c[F.pos]) || 'Position not recorded',
        hire: hire, hireDateField: c[F.hire] || '', hireText: longDate(c[F.hireText]) || '', reg: c[F.reg] || '', sep: c[F.sep] || '',
        bday: c[F.bday] ? String(c[F.bday]).slice(5, 10) : '', bdate: c[F.bday] ? String(c[F.bday]).slice(0, 10) : '', files: files, missing201: missing, hasDept: !!dl,
        comp: { basic: num(c[FX.basic]), current: num(c[FX.current]), daily: num(c[FX.daily]), allowance: num(c[FX.allowance]), gross: num(c[FX.gross]), meal: num(c[FX.meal]), rsl: num(c[FX.rsl]), gas: num(c[FX.gas]),
          other: num(c[FX.other]), additional: num(c[FX.additional]), ptype: name(c[FX.ptype]), raises: num(c[FX.raises]), raiseRate: num(c[FX.raiseRate]) },
        gov: { sss: txt(c[FX.sss]), philhealth: txt(c[FX.philhealth]), pagibig: txt(c[FX.pagibig]), tin: txt(c[FX.tin]) },
        contact: { companyEmail: txt(c[FX.cemail]), personalEmail: txt(c[FX.pemail]), phone: txt(c[FX.phone]), address: txt(c[FX.address]), ecName: txt(c[FX.ecName]), ecPhone: txt(c[FX.ecPhone]), ecRel: txt(c[FX.ecRel]) }, gender: name(c[FX.gender]) };
    });
    var dupe = count(people.filter(function (p) { return p.idn.c; }), function (p) { return p.idn.c; });
    var issues = [];
    people.forEach(function (p) {
      var add = function (kind, sev, text) { issues.push({ rid: p.rid, name: p.cohort === 'inactive' ? '' : p.name, id: p.idn.c, kind: kind, sev: sev, text: text, active: p.cohort !== 'inactive' }); };
      if (p.idn.s === 'missing') add('missing-id', p.cohort === 'active' ? 'high' : 'low', 'No Employee ID in the roster');
      if (p.idn.s === 'invalid') add('invalid-id', 'high', 'Employee ID is not numeric');
      if (p.idn.c && dupe[p.idn.c] > 1) add('duplicate-id', 'high', 'Employee ID shared by more than one record');
      if (p.cohort === 'unknown') add('unknown-status', 'high', 'Employment status blank or unrecognized');
      if (!p.hasDept) add('no-department', p.cohort === 'active' ? 'medium' : 'low', 'No department linked');
      if (!p.hire) add('no-hire-date', p.cohort === 'active' ? 'medium' : 'low', 'No hire date in either field');
      if (p.hireDateField && p.hireText && p.hireDateField !== p.hireText) add('hire-date-conflict', 'medium', 'Hire Date and Hiring Date text disagree');
      if (p.status === 'Resigned' && !p.sep) add('no-separation-date', 'medium', 'Resigned without a separation date');
      if (p.cohort === 'active' && p.sep) add('status-date-conflict', 'high', 'Active status with a separation date');
      if (p.sep && p.reg && p.reg > p.sep) add('date-order', 'medium', 'Regularized after separation');
    });
    var keyed = {};
    people.forEach(function (p) { p.key = p.idn.c && dupe[p.idn.c] === 1 ? p.idn.c : 'AT-' + p.rid.slice(-6); keyed[p.rid] = p; });
    var active = people.filter(function (p) { return p.cohort !== 'inactive'; });
    var divisions = {};
    active.forEach(function (p) { var d = divisions[p.div] || (divisions[p.div] = { id: p.div, short: p.divShort, name: p.divName, count: 0 }); d.count++; });

    /* Attendance (joined by linked record ID, never by name) */
    var att = recs(raw.attendance).map(function (r) {
      var c = cells(r), l = links(c.fldfJzllNfMpJoTvN);
      return { date: c.fldN9MmrWvdDAB6wu || '', type: name(c.fldJMbl3NVma2kNSw) || 'Unspecified', kind: attKind(name(c.fldJMbl3NVma2kNSw)), p: l.length === 1 ? keyed[l[0].id] : null };
    }).filter(function (a) { return a.date; });
    var d30 = addDays(t, -30), d90 = addDays(t, -90);
    var last30 = att.filter(function (a) { return a.date > d30 && a.date <= t; });
    var byMonth = {};
    att.forEach(function (a) { var m = a.date.slice(0, 7); var o = byMonth[m] || (byMonth[m] = { m: m, late: 0, leave: 0, absent: 0, halfday: 0, wfh: 0, other: 0 }); o[a.kind]++; });
    var months = Object.keys(byMonth).sort().slice(-6).map(function (k) { return byMonth[k]; });
    var perPerson = {};
    att.filter(function (a) { return a.p && a.p.cohort !== 'inactive' && a.date > d90; }).forEach(function (a) {
      var o = perPerson[a.p.rid] || (perPerson[a.p.rid] = { k: a.p.key, name: a.p.name, div: a.p.divShort, late: 0, leave: 0, absent: 0, late30: 0 });
      if (o[a.kind] !== undefined) o[a.kind]++;
      if (a.kind === 'late' && a.date > d30) o.late30++;
    });
    var people90 = Object.keys(perPerson).map(function (k) { return perPerson[k]; });
    var byDiv = {};
    last30.forEach(function (a) { if (!a.p) return; var o = byDiv[a.p.div] || (byDiv[a.p.div] = { div: a.p.divShort, late: 0, leave: 0, absent: 0, total: 0 }); if (o[a.kind] !== undefined) o[a.kind]++; o.total++; });

    /* Journey */
    var dev = recs(raw.development).map(function (r) {
      var c = cells(r), l = links(c.fldGPGsYzmKwexrA2);
      return { p: l.length === 1 ? keyed[l[0].id] : null, type: name(c.fldgVvnkOgIrmEQeS), status: name(c.fldOJ6Ra6KQly5B1T), fifth: name(c.fldF62Y49plNBLs2h), regs: name(c.fldQxCSJ8MChl8dUm) };
    });
    var upcoming = [];
    active.forEach(function (p) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.hire)) return;
      [[3, 'Third-month check-in'], [5, 'Fifth-month review'], [6, 'Regularization decision']].forEach(function (s) {
        var d = addMonths(p.hire, s[0]);
        if (d >= t && d <= addDays(t, 60) && (p.status === 'Probationary' || s[0] < 6 && !p.reg)) upcoming.push({ k: p.key, name: p.name, div: p.divShort, what: s[1], date: d, computed: true });
      });
    });
    upcoming.sort(function (a, b) { return a.date.localeCompare(b.date); });
    var movements = [];
    active.forEach(function (p) {
      if (p.reg && p.reg >= d90 && p.reg <= t) movements.push({ k: p.key, name: p.name, div: p.divShort, what: 'Regularization', date: p.reg });
      if (p.hire && p.hire >= d90 && p.hire <= t) movements.push({ k: p.key, name: p.name, div: p.divShort, what: 'New hire', date: p.hire });
    });
    movements.sort(function (a, b) { return b.date.localeCompare(a.date); });
    var exits90 = people.filter(function (p) { return p.cohort === 'inactive' && p.sep && p.sep >= d90; }).length;

    /* Talent */
    var positions = recs(raw.positions).map(function (r) {
      var c = cells(r);
      return { title: String(c.fldoPkNj8xkWpCgnO || 'Untitled role').trim(), status: name(c.fldQfak76TS9OyDWV) || 'No status', priority: name(c.fldry8KfkqcSAHTYg),
        unit: name(c.fldPkDJQGbFbqXpaQ), posted: c.fld7ZDkzXxWaHeJLF || '', openings: Number(c.fldjc5JZXJbJx3smj) || 0,
        daysOpen: typeof c.fldcdhnPrAovLIXng === 'number' ? c.fldcdhnPrAovLIXng : null, applicants: Number(c.fld8yMa7ENNVwOgjH) || 0,
        forInterview: Number(c.fldhPDrEGeoVWOCIB) || 0, hired: Number(c.fldpY7uxNhBu4cZ7I) || 0 };
    });
    var openPos = positions.filter(function (p) { return !/filled|closed|cancel/i.test(p.status); });
    var cands = recs(raw.candidates).map(function (r) { var c = cells(r); return { stage: name(c.fldIBuCFFCbeIsWhJ), outcome: name(c.fld0Sgf4AzOiftmSB), source: name(c.fldWvVNTdGG7oCoyw), days: c.fldJ2cmflo5edDrSf }; });
    var ivs = recs(raw.interviews).map(function (r) { var c = cells(r); return { round: name(c.fldEZhPlyR6WAcwMF), rec: name(c.fldVYtklu50x2JFqr), score: Number(c.fldxKtbLpPBVOTjAm) || null, date: c.fldmLm0vvF5KaQ2Wa || '' }; });
    var avg = function (list) { var v = list.filter(function (x) { return typeof x === 'number' && !isNaN(x); }); return v.length ? Math.round(v.reduce(function (a, b) { return a + b; }, 0) / v.length * 10) / 10 : null; };

    /* Governance (counts only, suppressed) */
    var who = function (v) { return links(v).map(function (l) { var p = keyed[l.id]; return p ? { k: p.key, rid: p.rid, name: p.name, div: p.divShort } : { k: null, rid: l.id, name: l.name || 'Unlinked record', div: '' }; }); };
    var inc = recs(raw.incidents).map(function (r) { var c = cells(r); return { rid: r.id, code: txt(c.fld8nbnaqwun51b8D), status: name(c.fldhr8w04sGPCi6XE) || 'No status', sev: name(c.fldTxr2QrFiDoPqWf), type: name(c.fldANnxJ7ZOYlJksS), sla: name(c.fldW6690S8DXtYvXD),
      people: who(c.fld3i3PZ0LLEffTgB), date: txt(c.fld25dfaZ529uQNwQ) || String(r.createdTime || '').slice(0, 10), desc: txt(c.fldcaptPzVuilBcod).slice(0, 600), sanction: name(c.fld0gm3MqbWshi6cC), outcome: txt(c.fld1pBnBZAzdw4ihv).slice(0, 400), closed: txt(c.fld8MmfMkETl4BxUS) }; });
    var nte = recs(raw.nte).map(function (r) { var c = cells(r); return { rid: r.id, status: name(c.fldFpul2ZjwidEdUd) || 'No status', stage: name(c.fldZEnW5rJdOLoTJd), title: txt(c.fldFIBxoCfAlxCs6c), people: who(c.fld2jeNHT9LLTg7oM),
      decision: name(c.fldhhYXWUsLuB74NY), issued: txt(c.fld8OBVmzAulm9xgl), deadline: txt(c.fld8iCsTNze0qdzdL), desc: txt(c.fldVxOPdDpoEcBG2P).slice(0, 600) }; });
    var warn = recs(raw.warnings).map(function (r) { var c = cells(r); return { rid: r.id, type: name(c.fldH4rTYQfNOHXjEw) || 'Unspecified', date: c.fldxTXMCO3NzNkO6u || '', people: who(c.fldxIWPlp7IJFs5OR), details: txt(c.fldB02QQoLfiVf6DA).slice(0, 600), followUp: txt(c.fld7hxFMay7FXpIJB) }; });
    var pips = recs(raw.pips).map(function (r) { var c = cells(r); return { rid: r.id, status: name(c.fldJuwKdvZKd9qMBW) || 'No status', code: txt(c.fldmSlEZ1A1fI5bU2), people: who(c.fldbAVXV9PEyEeYNi), type: name(c.fldv5BYjFNasUi6Nb),
      start: txt(c.fld5j6LG2ALP82fP7), end: txt(c.fldbkX1yjbYbKD6UC), outcome: name(c.fldiUrTwyM13VlGLD), compliance: num(c.fldSQPM3myx8U1apE) }; });
    var openRe = /open|pending|progress|review|investig|await|ongoing|for /i;

    /* Culture */
    var events = [], calCounts = { retrieved: 0, withheld: 0, outOfScope: 0, included: 0 };
    function when(s) {
      if (!s) return null;
      if (s.date) return { date: s.date, time: '' };
      var d = new Date(s.dateTime); if (isNaN(d)) return null;
      return { date: fmt(d, { year: 'numeric' }) + '-' + pad(fmt(d, { month: 'numeric' })) + '-' + pad(fmt(d, { day: 'numeric' })),
        time: new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: false }).format(d) };
    }
    ((raw.calendar && raw.calendar.events) || []).forEach(function (e) {
      calCounts.retrieved++;
      if (e.status === 'cancelled') return;
      var w = when(e.start), title = String(e.summary || '').trim();
      if (!w) return;
      if (RESTRICTED.test(title)) { calCounts.withheld++; events.push({ date: w.date, time: w.time, title: title, kind: 'case', note: 'Case meeting', link: e.htmlLink || '' }); return; }
      if (!PC.test(title)) { calCounts.outOfScope++; return; }
      var gen = /^\s*p&c\s*x\s+/i.test(title);
      events.push({ date: w.date, time: w.time, title: title, kind: gen ? 'oneonone' : 'meeting', note: gen ? 'P&C one-on-one' : 'Confirmed meeting', link: e.htmlLink || '' });
      calCounts.included++;
    });
    ((raw.holidays && raw.holidays.events) || []).forEach(function (e) {
      var w = when(e.start); if (!w || e.status === 'cancelled') return;
      events.push({ date: w.date, time: '', title: String(e.summary || 'Holiday'), kind: 'holiday', note: /observance/i.test(e.description || '') ? 'Observance' : 'Public holiday' });
    });
    events.sort(function (a, b) { return a.date.localeCompare(b.date) || a.time.localeCompare(b.time); });
    var anniv = [], bdays = [];
    active.forEach(function (p) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(p.hire)) {
        for (var y = Number(t.slice(0, 4)); y <= Number(t.slice(0, 4)) + 1; y++) {
          var d = y + p.hire.slice(4); var yrs = y - Number(p.hire.slice(0, 4));
          if (yrs >= 1 && d >= t && d <= addDays(t, 90)) anniv.push({ k: p.key, name: p.name, div: p.divShort, date: d, years: yrs });
        }
      }
      if (p.bday) {
        for (var yy = Number(t.slice(0, 4)); yy <= Number(t.slice(0, 4)) + 1; yy++) {
          var bd = yy + '-' + p.bday; if (bd >= t && bd <= addDays(t, 60)) bdays.push({ k: p.key, name: p.name, div: p.divShort, date: bd });
        }
      }
    });
    anniv.sort(function (a, b) { return a.date.localeCompare(b.date); });
    bdays.sort(function (a, b) { return a.date.localeCompare(b.date); });
    var sat = recs(raw.satisfaction).map(function (r) { var c = cells(r); return {
      env: Number(c.fldFgnrs1p2Alj4gP), lead: Number(c.fldom0BQasPphY9c4), gov: Number(c.fld9GQV9jktEiivBW), comp: Number(c.fldlmY3z9KMCxGeid),
      growth: Number(c.fldZJFP9mSjgwME6R), overall: Number(c.fldhWpbpCTJG8WxGc), q: name(c.fldvIrrS2rdKiGjyG) }; });
    var satisfaction = sat.length < 3 ? { n: sup(sat.length), hidden: sat.length > 0 } : { n: sat.length,
      overall: avg(sat.map(function (s) { return s.overall; })),
      dims: { 'Work environment': avg(sat.map(function (s) { return s.env; })), 'Leadership & management': avg(sat.map(function (s) { return s.lead; })),
        'Governance & policy': avg(sat.map(function (s) { return s.gov; })), 'Pay, benefits & leave': avg(sat.map(function (s) { return s.comp; })),
        'Growth & development': avg(sat.map(function (s) { return s.growth; })) },
      byQuarter: count(sat, function (s) { return s.q; }) };
    var MH_Q = ['Overall experience at One Mad Fam', 'Support from direct leader', 'Team leadership & communication', 'Comfort sharing ideas', 'Role clarity',
      'Process clarity', 'Cross-team communication', 'Workplace & facilities', 'Tools & resources', 'Learning & growth', 'Motivation', 'Chiefs’ leadership', 'Chiefs’ communication'];
    var MH_F = jobs(ms).maddieHour.input.fieldIds;
    var mhRows = recs(raw.maddieHour);
    var maddieHour = mhRows.length < 3 ? { n: sup(mhRows.length), hidden: mhRows.length > 0 } : { n: mhRows.length, questions: MH_F.map(function (f, i) {
      var dist = count(mhRows, function (r) { return name(cells(r)[f]); }), total = 0, top = '', topN = 0;
      Object.keys(dist).forEach(function (k) { total += dist[k]; if (dist[k] > topN) { topN = dist[k]; top = k; } });
      return { q: MH_Q[i], top: top, share: total ? Math.round(topN / total * 100) : 0, n: total };
    }) };

    /* Masterlist reconciliation (IDs and status only) */
    var ml = null;
    if (raw.masterlist && Array.isArray(raw.masterlist.values)) {
      var sheet = {};
      raw.masterlist.values.slice(1).forEach(function (row) { var n = normId(row && row[0]); if (n.c && !sheet[n.c]) sheet[n.c] = String(row[1] || '').trim(); });
      var roster = {}; people.forEach(function (p) { if (p.idn.c) roster[p.idn.c] = p.status; });
      var matched = 0, onlySheet = 0, mismatch = 0;
      Object.keys(sheet).forEach(function (id) { if (roster[id] === undefined) onlySheet++; else { matched++; if (sheet[id] && roster[id] && sheet[id] !== roster[id]) mismatch++; } });
      ml = { matched: matched, onlySheet: onlySheet, onlyRoster: Object.keys(roster).filter(function (id) { return sheet[id] === undefined; }).length, mismatch: mismatch };
    }


    /* Trends: last 7 calendar months (headcount from hire/separation dates; lates from the tracker) */
    var mkeys = []; for (var mi = 6; mi >= 0; mi--) mkeys.push(addMonths(t.slice(0, 7) + '-01', -mi).slice(0, 7));
    var monthEnd = function (m) { return addDays(addMonths(m + '-01', 1), -1); };
    var trend = { months: mkeys, headcount: mkeys.map(function (m) { var e = monthEnd(m) > t ? t : monthEnd(m); return people.filter(function (p) { return /^\d{4}-\d{2}-\d{2}$/.test(p.hire) && p.hire <= e && (p.cohort === 'active' || (p.sep && p.sep > e)); }).length; }),
      lates: mkeys.map(function (m) { return att.filter(function (a) { return a.kind === 'late' && a.date.slice(0, 7) === m; }).length; }), byDiv: {} };
    att.forEach(function (a) { if (a.kind !== 'late' || !a.p) return; var i = mkeys.indexOf(a.date.slice(0, 7)); if (i < 0) return; var arr = trend.byDiv[a.p.div] || (trend.byDiv[a.p.div] = mkeys.map(function () { return 0; })); arr[i]++; });
    /* Lates by weekday over the last 12 weeks (Mon..Fri x 12 weeks, oldest first) */
    var tdow = (new Date(t + 'T00:00:00Z').getUTCDay() + 6) % 7, wk0 = addDays(t, -tdow - 77);
    var lateHeat = [0, 1, 2, 3, 4].map(function () { return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; });
    att.forEach(function (a) { if (a.kind !== 'late' || a.date < wk0 || a.date > t) return; var dd = days(wk0, a.date), w = Math.floor(dd / 7), wd = dd % 7; if (w >= 0 && w < 12 && wd < 5) lateHeat[wd][w]++; });

    /* Division operations from Chiefs' Hub (read-only): tasks and weekly pulse traffic lights */
    var isoDay = function (v) { return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? (v.length > 10 ? fmt(new Date(v), { year: 'numeric' }) + '-' + pad(fmt(new Date(v), { month: 'numeric' })) + '-' + pad(fmt(new Date(v), { day: 'numeric' })) : v) : ''; };
    var ops = { tasks: {}, pulse: {} };
    Object.keys(HUBCFG.sync).forEach(function (k) {
      if (!raw[k]) return; var c = HUBCFG.sync[k];
      ops.tasks[k] = recs(raw[k]).map(function (r) { var v = cells(r), dn = v[c.done];
        var st = name(v[c.status]) || 'No status', done = dn === 1 || dn === true || dn === '1' || /^(done|complete|completed)$/i.test(st);
        return { title: String(v[c.name] || 'Untitled task').trim().slice(0, 140), status: st, due: isoDay(v[c.due]), done: done, prio: name(v[c.prio]), project: String(name(v[c.project]) || '').slice(0, 80) };
      });
    });
    Object.keys(HUBCFG.pulse).forEach(function (k) {
      if (!raw[k]) return; var c = HUBCFG.pulse[k];
      var rows = recs(raw[k]).slice().sort(function (a, b) { return String(a.createdTime || '').localeCompare(String(b.createdTime || '')); });
      var light = function (v) { var x = name(v); return /🟢|on target|green/i.test(x) ? 'g' : /🟡|watch|yellow/i.test(x) ? 'a' : /🔴|below|red/i.test(x) ? 'r' : ''; };
      var hist = rows.map(function (r) { var v = cells(r); return { week: name(v[c.week]), at: String(r.createdTime || '').slice(0, 10), status: light(v[c.status]), lights: c.lights.map(function (l) { return [l[1], light(v[l[0]])]; }).filter(function (l) { return l[1]; }) }; }).filter(function (h) { return h.lights.length; });
      ops.pulse[k] = { latest: hist[hist.length - 1] || null, history: hist.slice(-7).map(function (h) { return { at: h.at, week: h.week, green: h.lights.filter(function (l) { return l[1] === 'g'; }).length, total: h.lights.length }; }), n: hist.length };
    });
    var extra = {};
    Object.keys(EXTRA).forEach(function (k) {
      if (!raw[k]) return; var f = EXTRA[k].f;
      extra[k] = recs(raw[k]).map(function (r) { var c = cells(r), o = { rid: r.id, created: String(r.createdTime || '').slice(0, 10) };
        Object.keys(f).forEach(function (n) { var v = c[f[n]];
          if (n === 'emp') { var l = links(v); o.emp = l.map(function (x) { var p = keyed[x.id]; return p ? { k: p.key, name: p.name, div: p.divShort } : { k: null, name: x.name || 'Unlinked record', div: '' }; }); }
          else if (Array.isArray(v)) o[n] = v.map(function (x) { return x && x.name || x; }).join(', ');
          else if (v && typeof v === 'object') o[n] = v.name || v.label || '';
          else o[n] = v == null ? '' : v; });
        if (k === 'helpdesk' && o.anon) o.emp = [{ k: null, name: 'Anonymous submission', div: '' }];
        if (typeof o.date === 'string' && o.date.length > 10) o.date = o.date.slice(0, 10);
        return o; });
    });
    var t201 = null;
    if (raw.tracker201) { var p201 = parse201(raw.tracker201.fileContent || raw.tracker201.content || raw.tracker201.text || '');
      t201 = { rows: p201.rows, core: p201.core, declared: p201.declared, folders: ((raw.folders201 && raw.folders201.files) || []).map(function (f) { return { title: String(f.title || f.name || '').trim(), url: f.viewUrl || ('https://drive.google.com/drive/folders/' + f.id) }; }),
        foldersMore: !!(raw.folders201 && raw.folders201.nextPageToken), modified: '' }; }
    var exitsList = people.filter(function (p) { return p.cohort === 'inactive'; }).map(function (p) { return { k: p.key, rid: p.rid, name: p.name, div: p.divShort, status: p.status, sep: p.sep, hire: p.hire, pos: p.pos }; }).sort(function (a, b) { return String(b.sep).localeCompare(String(a.sep)); });
    var withId = people.filter(function (p) { return p.idn.c; }).length;
    return {
      v: 1, generatedAt: new Date(ms).toISOString(), today: t, window: windowRange(ms), sources: srcStatus,
      people: {
        list: active.map(function (p) { return { k: p.key, rid: p.rid, comp: p.comp, gov: p.gov, contact: p.contact, gender: p.gender, bdate: p.bdate, id: p.idn.c, name: p.name, div: p.div, divShort: p.divShort, pos: p.pos, status: p.status,
          hire: p.hire, reg: p.reg, missing201: p.missing201, files: p.files,
          att90: perPerson[p.rid] ? { late: perPerson[p.rid].late, leave: perPerson[p.rid].leave, absent: perPerson[p.rid].absent, late30: perPerson[p.rid].late30 } : { late: 0, leave: 0, absent: 0, late30: 0 }, bday: p.bday, sep: p.sep,
          issues: issues.filter(function (i) { return i.rid === p.rid; }).map(function (i) { return i.text; }) }; })
          .sort(function (a, b) { return a.name.localeCompare(b.name); }),
        totals: { records: people.length, active: people.filter(function (p) { return p.cohort === 'active'; }).length,
          inactive: people.filter(function (p) { return p.cohort === 'inactive'; }).length, unknown: people.filter(function (p) { return p.cohort === 'unknown'; }).length,
          statusCounts: count(people, function (p) { return p.status || '(blank)'; }), withId: withId,
          missingId: people.filter(function (p) { return p.idn.s === 'missing'; }).length,
          activeMissingId: people.filter(function (p) { return p.idn.s === 'missing' && p.cohort === 'active'; }).length,
          duplicateIds: Object.keys(dupe).filter(function (k) { return dupe[k] > 1; }).length, baseline: 51 },
        divisions: Object.keys(divisions).map(function (k) { return divisions[k]; }).sort(function (a, b) { return b.count - a.count; }),
        issues: issues.filter(function (i) { return i.kind !== 'format'; }).map(function (i) { return { name: i.name || 'Inactive record', id: i.id, kind: i.kind, sev: i.sev, text: i.text }; }),
        issueCounts: count(issues, function (i) { return i.kind; }),
        movements: movements.slice(0, 20), exits90: sup(exits90), probation: active.filter(function (p) { return p.status === 'Probationary'; }).length
      },
      files201: { docs: DOCS.map(function (d) { var onFile = 0, miss = 0; active.forEach(function (p) { if (p.files[d[0]] === 'on-file') onFile++; else if (p.files[d[0]] === 'missing') miss++; });
        return { id: d[0], label: d[1], onFile: onFile, missing: miss, unavailable: !d[2].length }; }),
        complete: active.filter(function (p) { return p.missing201 === 0; }).length, incomplete: active.filter(function (p) { return p.missing201 > 0; }).length },
      attendance: { total: att.length, last30: count(last30, function (a) { return a.kind; }),
        daily: att.filter(function (a) { return a.date > addDays(t, -84) && a.date <= t; }).reduce(function (o, a) { var x = o[a.date] || (o[a.date] = { late: 0, leave: 0, absent: 0, other: 0 }); x[a.kind === 'halfday' || a.kind === 'wfh' ? 'other' : a.kind]++; return o; }, {}), byType30: count(last30, function (a) { return a.type; }), months: months,
        byDivision: Object.keys(byDiv).map(function (k) { return byDiv[k]; }).sort(function (a, b) { return b.total - a.total; }),
        repeatLates: people90.filter(function (p) { return p.late >= 3; }).sort(function (a, b) { return b.late - a.late; }).slice(0, 10),
        recent: att.filter(function (a) { return a.p && a.p.cohort !== 'inactive'; }).sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 12)
          .map(function (a) { return { date: a.date, type: a.type, kind: a.kind, name: a.p.name, div: a.p.divShort }; }),
        orphans: att.filter(function (a) { return !a.p; }).length },
      journey: { dev: { total: dev.length, byStatus: count(dev, function (d) { return d.status; }), byType: count(dev, function (d) { return d.type; }),
        fifthPending: dev.filter(function (d) { return d.fifth === 'Pending'; }).length, regPending: dev.filter(function (d) { return d.regs === 'Pending'; }).length,
        forEvaluation: dev.filter(function (d) { return d.status === 'For Evaluation'; }).map(function (d) { return d.p ? { k: d.p.key, name: d.p.name, div: d.p.divShort, type: d.type } : null; }).filter(Boolean) },
        upcoming: upcoming.slice(0, 20), devByKey: dev.reduce(function (o, d) { if (d.p) o[d.p.key] = { type: d.type, status: d.status, fifth: d.fifth, regs: d.regs }; return o; }, {}) },
      talent: { positions: positions.sort(function (a, b) { return (b.daysOpen || 0) - (a.daysOpen || 0); }), byStatus: count(positions, function (p) { return p.status; }),
        open: openPos.length, openings: openPos.reduce(function (a, p) { return a + (p.openings || 1); }, 0),
        avgDaysOpen: avg(openPos.map(function (p) { return p.daysOpen; })), filled: positions.filter(function (p) { return /filled/i.test(p.status); }).length,
        candidates: { total: cands.length, byStage: count(cands, function (c) { return c.stage; }), byOutcome: count(cands, function (c) { return c.outcome; }),
          bySource: count(cands, function (c) { return c.source; }), avgDays: avg(cands.filter(function (c) { return !/hired|reject|withdraw|cancel|no show/i.test(c.stage); }).map(function (c) { return c.days; })) },
        interviews: { total: ivs.length, byRound: count(ivs, function (i) { return i.round; }), byRec: count(ivs, function (i) { return i.rec; }), avgScore: avg(ivs.map(function (i) { return i.score; })) } },
      governance: { incidents: { total: inc.length, open: inc.filter(function (i) { return openRe.test(i.status); }).length, byStatus: count(inc, function (i) { return i.status; }),
          bySeverity: count(inc, function (i) { return i.sev; }), byType: count(inc, function (i) { return i.type; }), slaBreach: inc.filter(function (i) { return /breach|overdue|late/i.test(i.sla); }).length, list: inc },
        nte: { total: nte.length, byStatus: count(nte, function (n) { return n.status; }), byStage: count(nte, function (n) { return n.stage; }), list: nte },
        warnings: { total: warn.length, byType: count(warn, function (w) { return w.type; }), list: warn },
        pips: { total: pips.length, byStatus: count(pips, function (p) { return p.status; }), list: pips } },
      culture: { events: events, calendar: calCounts, anniversaries: anniv.slice(0, 20), birthdays: bdays.slice(0, 20), satisfaction: satisfaction, maddieHour: maddieHour },
      trend: trend, lateHeat: lateHeat, heatStart: wk0, ops: ops, extra: extra, exits: exitsList, t201: t201,
      recon: { masterlist: ml, attendanceOrphans: att.filter(function (a) { return !a.p; }).length, developmentOrphans: dev.filter(function (d) { return !d.p; }).length }
    };
  }

  /* ---------- seal / open (Web Crypto + CompressionStream) ---------- */
  var ITER = 310000;
  function b64(bytes) { var s = ''; bytes = new Uint8Array(bytes); for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); }
  function unb64(str) { var bin = atob(str), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
  async function streamBytes(bytes, Stream) { return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new Stream('gzip'))).arrayBuffer()); }
  async function deriveKey(passcode, saltB64) {
    var material = await crypto.subtle.importKey('raw', new TextEncoder().encode(passcode), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: unb64(saltB64), iterations: ITER }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  function newSalt() { return b64(crypto.getRandomValues(new Uint8Array(16))); }
  async function seal(key, obj) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var zipped = await streamBytes(new TextEncoder().encode(JSON.stringify(obj)), CompressionStream);
    var ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, zipped);
    return { iv: b64(iv), data: b64(ct) };
  }
  async function open(key, sealed) {
    var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(sealed.iv) }, key, unb64(sealed.data));
    var bytes = await streamBytes(new Uint8Array(plain), DecompressionStream);
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  async function digest(obj) {
    var copy = Object.assign({}, obj, { generatedAt: '', sources: Object.keys(obj.sources || {}).map(function (k) { return [k, obj.sources[k].ok, obj.sources[k].count]; }) });
    var h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(copy)));
    return b64(h).slice(0, 22);
  }
  return { parse201: parse201, jobs: jobs, buildModel: buildModel, SOURCE_NAMES: SOURCE_NAMES, deriveKey: deriveKey, newSalt: newSalt, seal: seal, open: open, digest: digest,
    sup: sup, today: today, ITER: ITER, DOCS: DOCS };
});
