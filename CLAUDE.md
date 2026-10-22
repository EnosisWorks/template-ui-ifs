# Aurena mockup kit – instructions for Claude

This repo is used by consultants to build **clickable HTML mockups that look like IFS Cloud (Aurena)** for client workshops. Users are consultants, not front-end developers: they describe screens in business terms and expect you to produce finished pages.

## Repository layout

```
assets/ifs-cloud.css     shared styles (design tokens at the top)
assets/ifs-cloud.js      shell (header, navigator), icons, all interactions
index.html               kit home + catalog of all mockups (keep it updated)
kit/examples/            reference pages – one per Aurena page type (read-only)
kit/templates/blank.html starting point for a new page
mockups/<name>/          ONE FOLDER PER CLIENT MOCKUP (all new work goes here)
  config.js              mockup-wide settings: title, user, navigator, notifications
  index.html             start page of the mockup
  *.html                 other pages
tools/bundle.py          makes standalone HTML (CSS/JS inlined) to send to a client
```

## Hard rules

1. **New work goes only in `mockups/<name>/`.** Name: lowercase-kebab, `<client>-<topic>`, e.g. `acme-service-orders`.
2. **Do not edit `assets/` or `kit/` to build a mockup.** If a mockup needs something special, add a `<style>` block in that page. If you find a real bug or a missing reusable component in the kit, tell the user and only change `assets/` if they agree. If you do, add the component to `kit/examples/components.html` too.
3. **Every page in a mockup** sits directly in `mockups/<name>/` (no subfolders) and has, in this order:
   ```html
   <link rel="stylesheet" href="../../assets/ifs-cloud.css">
   <script src="config.js"></script>
   <script src="../../assets/ifs-cloud.js"></script>
   ```
   and `<body data-nav="<navigator item id>">`, `<main class="ifs-page">`.
4. **Links inside a mockup are plain relative file names** (`orders.html`), never `~/…` or `../`. That way `tools/bundle.py` output still works.
5. **Build from existing components.** Copy markup from `kit/examples/*.html` / `components.html`. Do not invent new class names when one exists. Read the relevant example page before writing a page of that type.
6. **No real brands or people.** Never add the IFS logo or any trademark. The header shows only the `MOCKUP` badge plus the optional `title` from `config.js`. Use fictional company and person names unless the user provides the client's real data.
7. **Register the mockup** with a row in the root `index.html` between `MOCKUPS:START` and `MOCKUPS:END`.
8. **Verify in the browser before you finish** (see "Previewing"). Check for console errors, then click through the navigator, tabs, dialogs and edit mode.

## Aurena page types → which example to copy

| User says | Aurena page type | Copy from |
|---|---|---|
| dashboard, start page, overview with KPIs | **Lobby** | `kit/examples/lobby.html` |
| list of X, search X, work queue | **Overview page** (list) | `kit/examples/customer-orders.html` |
| X card, record, details of one X | **Detail page** | `kit/examples/customer-order.html` |
| wizard, create X step by step | **Assistant** | `kit/examples/assistant.html` |
| popup, confirm, choose value | **Dialog** / **LOV** | dialogs in any example |

Screen layout (built by the JS — don't hand-write it): a white **top bar** with the MOCKUP badge, search, notifications and user, then a thin **icon rail** on the left (home, navigator, recent, coloured favourites), then the **navigator** panel (pinned by default; "Find page" search; drill-down folders with a "< parent" back row; active page highlighted in blue), and the content on a light grey background.

Aurena conventions to keep:
- Page header: white breadcrumb strip (`.ifs-breadcrumb`; the last `<span>` is bold automatically) → title row (`h1`, plain 23px) → **command bar** (CRUD first: New, Edit, Delete, Save, Cancel, then a separator, then business commands, with grouped commands in a dropdown). The icon buttons (filter, export, columns, refresh) sit on the right.
- Detail page: the **record selector** (`.ifs-selector`) goes next to the title, and the **state indicator** (`.ifs-state-indicator`, a progress bar with the state name) goes top-right in the title row. Key fields go in `.ifs-record-header`, then tabs with groups or sub-lists.
- Fields: dense grid (`.ifs-fields.cols-6` or `cols-8` on forms, `cols-4` in record headers), small grey label above, 27px square inputs. Selects show a black ▼ triangle, LOVs show a ≡ button (`data-icon="lov"`), and dates show a calendar button. **Required fields** (`.ifs-field.required`) get a red `*`, and they turn pink while empty (automatic). Booleans use `.ifs-toggle`. Read-only values are plain text. Edit mode comes from the Edit command (`data-type` on `.ifs-field`).
- Sections: white cards. Use `.ifs-group.plain` for a borderless field card, and `.ifs-group.collapsed` with `.ifs-group-header` for collapsible sections ("More Information"), which have a chevron on the right.
- Lobby: a grid of ~160px square tiles. Status counters are `.ifs-tile.counter.purple`, financial/secondary counters are `.ifs-tile.counter.light` (light blue, blue number), and plain counters and charts are white. A counter has a title at the top-left, a big number in the centre and a caption at the bottom (`.caption`). Size tiles with `.w-2/.w-3/.w-4/.w-6/.w-8/.w-12` and `.h-2/.h-3`. Chart tiles have a small grey `.tile-menu` button. The title row has lobby parameters (`.params`, e.g. `Site=WRO | Coordinator=%`) and a zoom slider (`.ifs-zoom`).
- Assistant: stepper card (filled blue circle = current step, italic labels = upcoming steps), then field cards, then a footer card with `◀ Previous`, `▶ Next`, `Finish`, `Cancel`. Buttons are disabled rather than hidden.
- Lists: checkbox selection; business commands need a selection (`data-needs-selection`); status shown as `.badge`.
- Status colours (`.badge`, `data-emphasis`): neutral = planned/prepared, `info` = released/open, `primary` = in progress/reserved, `success` = done/delivered/invoiced, `warning` = partial/overdue, `danger` = blocked/stopped.
- Use real IFS terminology: Customer Order, Sales Part, Inventory Part, Site, Coordinator, Work Task, Shop Order, Purchase Order, Supplier, LOV, Lobby, Assistant.
- Use European formats: dates `2026-10-21`, numbers `12 450,00` (unless the user asks otherwise). Use the user's language for UI text if they ask for it (for example, Polish).

## Component cheat sheet (all driven by attributes; JS lives in assets)

- Icons: `<i data-icon="plus"></i>` (add class `lg`/`xl` for size). All names are in `components.html`.
- Buttons: `.btn`, `.btn.primary`, `.btn.secondary`, `.btn.icon`, `.btn.sm`. Dropdown: `.ifs-menu-wrap > [data-menu] + .ifs-menu`.
- Toast: `data-toast="Saved"` + optional `data-toast-type="info|warning|danger"`.
- Dialog: `<dialog class="ifs-dialog" id="x">` opened with `data-open-dialog="x"`, closed with `data-close-dialog`.
- Side panel: `<aside class="ifs-panel" id="x">` + `data-open-panel="x"`.
- Tabs: container `[data-tabs]`, `.ifs-tab[data-tab=a]`, `.ifs-tab-panel[data-panel=a]`.
- Fields: `.ifs-fields.cols-4 > .ifs-field[data-type] > label + .ifs-field-value`. Types: `text|number|date|lov|select|checkbox|textarea`, plus `data-options="A|B"`, `data-readonly`, `.required`, `.span-2`, `.span-all`.
- Edit mode: wrap the record in `.ifs-record`; the command bar buttons use `data-action="edit|save|cancel|new|delete"`.
- State indicator: `<div class="ifs-state-indicator" data-states="A|B|C" data-current="B" data-emphasis="info"></div>`.
- Selector: `<div class="ifs-selector" data-records="ID1 – Name|ID2 – Name" data-current="0"></div>`.
- Lists: `.ifs-list > .ifs-list-toolbar + .ifs-table-wrap > table.ifs-table`. Selection uses `.all-check`/`.row-check`, filtering uses `input[data-filter]`, counts use `[data-row-count]`/`[data-selected-count]`, `.num` right-aligns, and `data-sortable="false"` turns sorting off.
- Lobby: `.ifs-lobby > .ifs-tile(.counter)(.purple|.light)(.w-N)(.h-N)` with `.ifs-tile-header`, `.ifs-tile-body > .ifs-counter + .caption`. Charts: line chart = inline SVG `.ifs-linechart` (copy it from lobby.html), horizontal bars `.ifs-hbars`, vertical bars `.ifs-bars`, donut `.ifs-donut`. Key/value list tile: `.ifs-kv` (see "Order Processing"). Also `.ifs-progress(.brand)` and `.ifs-quicklinks`.
- Assistant: `[data-assistant]` with `.ifs-step`, `.step-panel`, `data-step-next|back|finish`.
- Client notes: `.note-pin` (numbered dot) and `.note-box`. Viewers can hide them via the user menu.

## config.js

```js
window.IFS = { config: {
  title: 'Acme – Service',               // shown next to the MOCKUP badge
  home: 'index.html',
  user: { name: 'Jan Nowak', initials: 'JN', company: '10 – Acme' },
  navPinned: true,                        // navigator docked by default (users can unpin)
  notifications: [{ icon: 'warning', title: '…', meta: '…' }],
  favorites: [{ icon: 'wrench', color: '#3a9d5d', label: 'Service Orders', href: 'orders.html' }],  // icon rail
  navigator: [                            // folders (items) drill in, leaves are pages
    { label: 'Service', icon: 'wrench', items: [
      { label: 'Service Order Management', items: [
        { label: 'Service Orders', href: 'orders.html', id: 'orders', count: 12 },
        { label: 'Not part of mockup', href: '#' },
      ]},
    ]},
  ],
}};
```
Each page's `data-nav` must match an item `id`. The navigator opens at the folder containing the current page. Unbuilt screens get `href: '#'` so the navigator still looks complete, the way a real IFS menu would.

## Previewing

`.claude/launch.json` defines a `mockups` server (`python3 -m http.server 8765` at the repo root). Start it with the preview tool and open `http://localhost:8765/mockups/<name>/index.html`. Opening files via `file://` does not load the CSS/JS in Claude's browser pane, so always use the server. If the server cannot start (macOS blocks Python in some synced folders such as OneDrive), copy the repo to a temporary folder and serve it from there.

## Delivering to a client

`python3 tools/bundle.py mockups/<name> --zip` creates `dist/<name>/` (self-contained HTML) and `dist/<name>.zip`. `dist/` is git-ignored.
