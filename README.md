# Maddie Journey — P&C Fictional Demo (v5.2)

## Open the prototype

Unzip the archive. Open `index.html` (or `demo.html`) in a browser. It displays the **original initial prototype layout and navigation**, with your Madhouse Design Studio logo (the original full logo is stored in `logo.png`; the header uses a crop of its house-shaped mark), updated Maddie Journey name and chosen mint/coral/navy/lemon/plum palette.

No account, passcode, internet connection, Claude subscription, external connector or billing is needed for sample data. This is **not a production or live employee database**.

## Presentation data

* 51 active fictional employee profiles in eight representative divisions, plus two fictional former-employee examples in Exit Records.
* Fictional salaries, government requirements, 201 files, attendance, late/leave history, probation milestones, recruitment, interviews, workforce movement, cases, notices, performance development, surveys, recognition, training and operations examples.
* Every original one of the nine workspaces and 86 subcategory screens remains accessible. Screens whose sources were originally absent are populated by clearly marked example records generated locally in `p-main-demo.js`. All 86 dashboard routes generate report content; some summaries are charts or timelines rather than data tables.
* Existing screen summaries, charts, detail tables, employee popups, 3D office and executive navigation are preserved.
* Sample dates refer to late 2026 and early 2027; data is fixed for a repeatable presentation.

## Separation of demo and live

* **`index.html`, `demo.html`**: local fictional prototype. Loads `demo-data.js`, `demo-runtime.js`, and `p-main-demo.js` instead of the protected boot process. Does not invoke any connector or request the passcode.
* **`live-readonly.html`**: the original protected Claude-based entry point with its original `boot.js` and `p-main.js`. It is preserved only for integration comparison; it requires its original runtime and authorization to function.
* `core.js` and `data.js` contain the original read-only model/adapter; only locally generated fictional records are passed to them in demo mode.

**Important:** Do not publish the `live-readonly.html` version or related integration code as a public demo without reviewing its connector configuration and privacy safeguards. Prefer publishing only the fictional demo assets.

## Files added for this update

- `demo-data.js` — synthetic source-shaped fixture.
- `p-main-demo.js` — demo-only section fallbacks for originally untracked content.
- `demo-runtime.js` — disables passcode and live services, labels sample status, preserves presentation controls.
- `demo.html` / `index.html` — fictional entry point.
- `live-readonly.html` — untouched protected entry point from the previous ZIP.

No existing app layout CSS was replaced and no production connector data was copied into the fictional dataset.

The ZIP also contains `preview-offline.html`, a single-file demonstration that bundles the main CSS, JavaScript, logo and sample background image. Use it when presenting without a local web server.

## Presenting the demo

Open `preview-offline.html` for a single-file preview; or open `index.html` after extracting the ZIP (keep adjacent files together). Preview screenshots are in `previews/`. `Fictional_Data_HandOff.md` and `mock-data-manifest.json` document the sample route and data contracts for later Claude integration.

### Verification

The fictional model produced 51 employees, 51 synthetic personnel tracker rows, eight divisions and example records across all nine workspaces. All 86 section report builders were evaluated without exception, browser navigation to sample pages and an employee detail popup were tested, and no page-level horizontal overflow was found at 390, 820 and 1440 px. Full hardware/device testing and original Claude connector behavior were not validated.


## Brand palette update (v5.3)

The original dashboard layout, fictional records, and navigation are unchanged. The visible sidebar logo now reads **MADDIE JOURNEY** without the `| 2027` suffix. New `maddie-palette.css` provides consistent mint `#79C9A5`, coral `#F26B4F`, deep navy `#183B63`, lemon `#FFF1A8`, and plum `#A83F73` across light/dark views, navigation, statuses, chart accents and the office view. `preview-offline.html` embeds the same palette without requiring an external stylesheet.


## Website-style presentation redesign

`maddie-site.css` and `maddie-site.js` provide a compact reference-inspired sidebar, a simplified home page, focused workspace directories, summary-first report pages and report previews. `#settings` includes appearance, readability, motion, privacy-display and developer credit (NemDev). `#data-system` includes fictional employee records, source mapping, technical architecture and sample CSV export. No connected accounts are used. The original nine workspaces, 86 report routes, 51 fictional employee records and protected live entry remain intact.\n
## Original navigation restored, pink sidebar (v5.5)

The original nine P&C workspace categories return as expandable sidebar destinations with all 86 subcategory links, plus six executive views, Divisions, 3D Office, Settings, and Data & System. Sidebar uses a deep plum-pink gradient and active pink motion; dashboard surfaces stay white, with mint/coral/navy/lemon highlights. These are presentation-only files; fictional data, original reporting, and protected live entry remain unchanged.

## Sidebar consistency fixes (v5.6)

Removed duplicate Settings links: the single **Settings & Data** sidebar destination opens `#settings`, with data tools accessible from there and `#data-system` deep links preserved. Pinned Settings & Data and Help outside the scrolling workspace list; added collapsible executive and organization groups, single-open workspace accordion, active-route highlighting, keyboard labels, compact and mobile states. Fixed the old navigation briefly rendering during startup. Updated the self-contained offline preview too. No fictional records or report routes changed.

## UI consistency & true black/white themes (v5.7)

Light mode uses a pure white page and white report surfaces. Dark mode uses a pure black page and a nearly black report/card surface; dark sidebar is black with pink active highlights. The compact sidebar now centers the logo and icons without empty invisible text. Nine workspace-specific accents are applied to relevant callouts, cards, report headers, and tables, while the existing reports, 51 fictional employees, 86 subcategories, and Settings & Data remain unchanged. Includes reduced-motion support. Both standard and standalone offline previews include the same styles.

## Settings & Data: limited scope (v5.8)

The single Settings & Data sidebar link now covers **Accessibility & Display** and **Data Architecture & Sources** only. Employee records, KPIs and sample CSV export remain in the relevant dashboards (Employee Masterlist for CSV). Source mappings show provider names and inactive demo status without credentials. The existing `#data-system` route remains a deep link to the architecture section. Original navigation and all fictional reports are preserved.

## Layered Dashboard Design v5.9

Adds the non-destructive presentation files `maddie-layered.css` and `maddie-layered.js` to the fictional preview. Includes a fully coloured overview KPI band (navy, mint, plum and lemon), an elevated editorial hero, asymmetric full-colour workspace cards, a plum priority panel, a lemon quick-action panel, workspace-specific report heroes, richly coloured callouts, and nested quiet table surfaces. All nine workspaces and 86 report routes remain mapped to the original fixtures and actions. The existing plum-pink sidebar, accessibility controls, source architecture and true-black/white modes are untouched. Purely presentational DOM zoning labels add structure without changing data or navigation.

## Focused report presentation (v6.0)

Removed the repeated Data Snapshot fictional panels and redundant View full report / Quick preview buttons on all 86 individual reports. The original report itself displays directly below existing KPI callouts. Long searchable tables initially show eight records, with a Show all records control; searching and sorting remain active. Employee-detail popups remain unchanged. The fictional CSV export is available on People Directory → Employee Masterlist. Workspace directories link directly to reports. Added maddie-report-focus.css and maddie-report-focus.js, including in the standalone offline preview. No changes to fictional data, sources, or navigation.
