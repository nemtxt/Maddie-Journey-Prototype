# Fictional data — Claude integration handoff

**Current mode:** demonstration only. The application uses 51 fully fictional active employees, plus two sample historical exit records. The sample numbers are not statements about any real organization.

## How to use

- Present `preview-offline.html` for a single-file offline preview, or `index.html` with local adjacent files.
- Use `mock-data-manifest.json` for the 9-workspace / 86-subcategory inventory and the original source states.
- Any `example` data for formerly missing sources is generated only in `p-main-demo.js`.
- The original `p-main.js` and `boot.js` are used only by `live-readonly.html` and require their proper runtime.

## Fictional data sources

The `demo-data.js` file constructs source-shaped fake records for employee masterlist/201 files, salary and compensation movements, attendance and leave, probation and development, hiring and interviews, cases/NTEs/warnings/PIPs, satisfaction and Maddie Hour, surveys, KPI/WIGs, meeting decisions, learning events, Chiefs’ Hub tasks, division pulse, policies and initiative records. No real connector is called.

## Existing route structure — do not rename when integrating

### People Directory (10 dashboards)

- `#people:masterlist` — Employee Masterlist (fictional fixture)
- `#people:personal` — Personal Information (fictional fixture)
- `#people:documents` — Employment Documents (fictional fixture)
- `#people:government` — Government Requirements (fictional fixture)
- `#people:movements` — Employment Movements (fictional fixture)
- `#people:performance` — Performance Records (fictional fixture)
- `#people:journey-records` — Maddie Journey Records (fictional fixture)
- `#people:training` — Training Records (generated example)
- `#people:acknowledgements` — Acknowledgements (fictional fixture)
- `#people:exits` — Exit Records (fictional fixture)

### Pay & Benefits (9 dashboards)

- `#pay:salary` — Salary Masterlist (fictional fixture)
- `#pay:comp-movement` — Compensation Movement (fictional fixture)
- `#pay:incentives` — Incentives & Bonuses (generated example)
- `#pay:contributions` — Government Contributions (generated example)
- `#pay:hmo` — HMO (fictional fixture)
- `#pay:insurance` — Employee Insurance (generated example)
- `#pay:maddie-benefits` — Maddie Benefits (generated example)
- `#pay:wellness` — Wellness Benefits (fictional fixture)
- `#pay:benefits-review` — Benefits Review (fictional fixture)

### Workforce Pulse (6 dashboards)

- `#pulse:daily` — Daily Attendance (fictional fixture)
- `#pulse:monthly` — Monthly Attendance (fictional fixture)
- `#pulse:overtime` — Overtime Summary (generated example)
- `#pulse:lates` — Lates and Absence Monitoring (fictional fixture)
- `#pulse:division-att` — Division Attendance (fictional fixture)
- `#pulse:att-reports` — Attendance Reports (fictional fixture)

### Maddie Journey (9 dashboards)

- `#journey:wellbeing` — Benefits & Well-being (fictional fixture)
- `#journey:belonging` — Culture & Belonging (fictional fixture)
- `#journey:purpose` — Purpose & Experience (fictional fixture)
- `#journey:profile` — Employee Journey Profile (fictional fixture)
- `#journey:level-gates` — Career Direction & Level Gates (fictional fixture)
- `#journey:onboarding` — Onboarding & Probation (fictional fixture)
- `#journey:report-cards` — Performance Report Cards (generated example)
- `#journey:leadership` — Leadership Development (fictional fixture)
- `#journey:employee-movement` — Employee Movement (fictional fixture)

### Maddie Learning Hub (11 dashboards)

- `#learning:training-calendar` — Annual Training Calendar (fictional fixture)
- `#learning:universal` — Universal Training (generated example)
- `#learning:specialized` — Specialized Training (generated example)
- `#learning:training-team` — Training Team (generated example)
- `#learning:programs` — Training Programs (generated example)
- `#learning:training-attendance` — Training Attendance (generated example)
- `#learning:assessments` — Training Assessments (generated example)
- `#learning:competency` — Competency Development (generated example)
- `#learning:partners` — External Partners (generated example)
- `#learning:ld-leadership` — Leadership Development (generated example)
- `#learning:evaluation` — Training Evaluation (generated example)

### Culture & Community (11 dashboards)

- `#culture:humans` — Humans of Madhouse (generated example)
- `#culture:milestones` — Maddie Milestones (fictional fixture)
- `#culture:corporate-calendar` — Corporate Calendar (fictional fixture)
- `#culture:maddie-hour` — Maddie Hour (fictional fixture)
- `#culture:engagement` — Monthly Engagement (fictional fixture)
- `#culture:assembly` — General Assembly (fictional fixture)
- `#culture:events` — Company Events (fictional fixture)
- `#culture:recognition` — Employee Recognition (generated example)
- `#culture:campaigns` — Culture Campaigns (generated example)
- `#culture:feedback` — Employee Feedback (fictional fixture)
- `#culture:incentive-activities` — Incentive Activities (generated example)

### Talent Acquisition (9 dashboards)

- `#talent:manpower-plan` — Manpower Plan (fictional fixture)
- `#talent:requisition` — Manpower Requisition (fictional fixture)
- `#talent:pipeline` — Recruitment Pipeline (fictional fixture)
- `#talent:partner` — Hiring Partner (fictional fixture)
- `#talent:hiring-status` — Hiring Status (fictional fixture)
- `#talent:new-hire` — New Hire Onboarding (fictional fixture)
- `#talent:probationary` — Probationary Monitoring (fictional fixture)
- `#talent:workforce-movement` — Workforce Movement (fictional fixture)
- `#talent:vacancy-aging` — Vacancy Aging (fictional fixture)

### People Governance (9 dashboards)

- `#governance:concerns` — Employee Concerns (fictional fixture)
- `#governance:notices` — Notices & Memorandums (fictional fixture)
- `#governance:case-docs` — Case Documentation (fictional fixture)
- `#governance:gov-review` — Governance Review (fictional fixture)
- `#governance:case-status` — Case Status (fictional fixture)
- `#governance:grievances` — Employee Grievances (fictional fixture)
- `#governance:policy` — Policy Compliance (fictional fixture)
- `#governance:corrective` — Corrective Actions (fictional fixture)
- `#governance:closure` — Case Closure (fictional fixture)

### Executive Scoreboard (12 dashboards)

- `#scoreboard:monthly-scorecard` — Monthly P&C Scorecard (fictional fixture)
- `#scoreboard:wig4` — WIG #4 Scorecard (fictional fixture)
- `#scoreboard:headcount` — Headcount Report (fictional fixture)
- `#scoreboard:comp-report` — Compensation Report (fictional fixture)
- `#scoreboard:attendance-report` — Attendance Report (fictional fixture)
- `#scoreboard:journey-report` — Maddie Journey Report (fictional fixture)
- `#scoreboard:ld-report` — L&D Report (generated example)
- `#scoreboard:culture-report` — Culture Report (fictional fixture)
- `#scoreboard:recruitment-report` — Recruitment Report (fictional fixture)
- `#scoreboard:er-report` — Employee Relations Report (fictional fixture)
- `#scoreboard:risks` — Risks & Blockers (fictional fixture)
- `#scoreboard:decisions` — Executive Decisions (fictional fixture)

## Suggested connector migration procedure

1. Keep the UI and routes unchanged; change only the data adapter. Use a separate non-public test branch.
2. For every mapped dataset, verify field-level contract, joins by employee ID/record ID, date periods, statuses, null handling and duplicate cases.
3. Compare the 86 sample screens against the corresponding connector-derived outputs; show a visible source timestamp and clear incomplete-data state.
4. Require data privacy, role/access checks, and audit logging before enabling the live view for actual employee data.
5. Never place live credentials, passphrases or confidential records in the public demo ZIP or a public GitHub Pages repository.

**Note:** `live-readonly.html` retains the old Claude application loader. It is not expected to function standalone in ordinary browsers.