/* =====================================================================
   IFS Cloud–style mockup kit – behaviour
   - Injects the header + navigator around <main class="ifs-page">
   - Renders <i data-icon="name"></i> as SVG icons
   - Wires tabs, menus, dialogs, panels, edit mode, tables, assistants, toasts

   DO NOT put client-specific settings here. A mockup overrides any of the
   defaults below with its own config.js, loaded BEFORE this file:
     window.IFS = { config: { user: {...}, navigator: [...] } };
   Links starting with "~/" resolve from the repository root.
   ===================================================================== */
(function () {
  const IFS = (window.IFS = window.IFS || {});

  // Repository root = folder that contains assets/ifs-cloud.js
  const ROOT = ((document.currentScript && document.currentScript.src) || '').replace(/assets\/ifs-cloud\.js.*$/, '');
  IFS.url = (href) => (href && href.startsWith('~/') ? ROOT + href.slice(2) : href);

  /* ---------------- Configuration (defaults) ---------------- */
  // A mockup with its own navigator must not inherit the kit's rail favourites
  if (IFS.config && IFS.config.navigator && !IFS.config.favorites) IFS.config.favorites = [];
  IFS.config = Object.assign({
    badge: 'MOCKUP',                // text in the top-left badge; '' hides it
    title: '',                      // optional text next to the badge, e.g. client or project name
    user: { name: 'Anna Kowalska', initials: 'AK', company: '10 – Demo Company' },
    home: '~/index.html',
    navPinned: true,                // default navigator state; users can pin/unpin (remembered per browser)
    // Coloured shortcuts in the left icon rail
    favorites: [
      { icon: 'grid', color: '#3a9d5d', label: 'Sales Lobby', href: '~/kit/examples/lobby.html' },
      { icon: 'flow', color: '#d93a4f', label: 'Customer Orders', href: '~/kit/examples/customer-orders.html' },
      { icon: 'star', color: '#3462d8', label: 'Customer Order', href: '~/kit/examples/customer-order.html' },
      { icon: 'star', color: '#e8890c', label: 'Create Customer Order', href: '~/kit/examples/assistant.html' },
      { icon: 'box', color: '#3a9d5d', label: 'Component Gallery', href: '~/kit/examples/components.html' },
    ],
    notifications: [
      { icon: 'warning', title: 'Credit check failed', meta: 'Order C1047 – Nordic Tools AB · 5 min ago' },
      { icon: 'check-circle', title: 'Shipment SH-2291 delivered', meta: 'Customer order C1032 · 1 h ago' },
      { icon: 'message', title: 'Comment from Piotr Nowak', meta: '"Please confirm delivery date" · yesterday' },
    ],
    // Navigator tree. A node with `items` is a folder (click drills in); otherwise it is a page link.
    // `id` must match <body data-nav="...">. `count` shows a number badge. Unbuilt pages: href '#'.
    navigator: [
      { label: 'Sales', icon: 'cart', items: [
        { label: 'Customer Order Management', items: [
          { label: 'Customer Order Management', href: '~/kit/examples/lobby.html', id: 'lobby' },
          { label: 'Shipping Planner Outbound', href: '#' },
          { label: 'Quotation', items: [{ label: 'Sales Quotations', href: '#' }, { label: 'Sales Quotation', href: '#' }] },
          { label: 'Order', items: [
            { label: 'Customer Orders', href: '~/kit/examples/customer-orders.html', id: 'orders', count: 186 },
            { label: 'Customer Order', href: '~/kit/examples/customer-order.html', id: 'order' },
            { label: 'Create Customer Order', href: '~/kit/examples/assistant.html', id: 'assistant' },
            { label: 'Customer Order Lines', href: '#' },
          ]},
          { label: 'Reservation', items: [{ label: 'Reserve Customer Orders', href: '#' }] },
          { label: 'Shipping', items: [{ label: 'Shipments', href: '#' }] },
          { label: 'Invoicing', items: [{ label: 'Customer Invoices', href: '#' }] },
          { label: 'Customer', items: [{ label: 'Customers', href: '#' }] },
          { label: 'Basic Data', items: [{ label: 'Sales Parts', href: '#' }] },
        ]},
      ]},
      { label: 'Financials', icon: 'money', items: [
        { label: 'Supplier Invoice', items: [{ label: 'Manual Supplier Invoices', href: '#' }, { label: 'Authorize Invoices for Payment', href: '#' }] },
        { label: 'General Ledger', items: [{ label: 'Vouchers', href: '#' }] },
      ]},
      { label: 'Supply Chain', icon: 'truck', items: [{ label: 'Inventory Part In Stock', href: '#' }, { label: 'Purchase Orders', href: '#' }] },
      { label: 'Manufacturing', icon: 'factory', items: [{ label: 'Shop Orders', href: '#' }, { label: 'Manufacturing Structures', href: '#' }] },
      { label: 'Maintenance', icon: 'wrench', items: [{ label: 'Work Tasks', href: '#' }, { label: 'Equipment Objects', href: '#' }] },
      { label: 'Human Resources', icon: 'users', items: [{ label: 'Employees', href: '#' }] },
      { label: 'Mockup Kit', icon: 'layers', items: [
        { label: 'Kit Home', href: '~/index.html', id: 'home' },
        { label: 'Component Gallery', href: '~/kit/examples/components.html', id: 'components' },
        { label: 'Blank Page Template', href: '~/kit/templates/blank.html', id: 'template' },
      ]},
    ],
  }, IFS.config || {});

  /* ---------------- Icons ---------------- */
  const C = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
  const P = (d) => `<path d="${d}"/>`;
  const R = (x, y, w, h, rx = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
  IFS.icons = {
    menu: P('M4 6h16M4 12h16M4 18h16'),
    search: C(11, 11, 7) + P('M21 21l-4.3-4.3'),
    bell: P('M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9') + P('M10.3 21a1.94 1.94 0 0 0 3.4 0'),
    star: P('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z'),
    help: C(12, 12, 10) + P('M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3') + P('M12 17h.01'),
    user: C(12, 8, 4) + P('M4 21a8 8 0 0 1 16 0'),
    users: P('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2') + C(9, 7, 4) + P('M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'),
    plus: P('M12 5v14M5 12h14'),
    edit: P('M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z'),
    trash: P('M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6'),
    save: P('M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z') + P('M17 21v-8H7v8M7 3v5h8'),
    close: P('M18 6 6 18M6 6l12 12'),
    more: `<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>`,
    'more-v': `<circle cx="12" cy="5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/>`,
    filter: P('M22 3H2l8 9.46V19l4 2v-8.54z'),
    refresh: P('M21 12a9 9 0 1 1-3-6.7L21 8') + P('M21 3v5h-5'),
    'chevron-right': P('M9 18l6-6-6-6'), 'chevron-left': P('M15 18l-6-6 6-6'),
    'chevron-down': P('M6 9l6 6 6-6'), 'chevron-up': P('M18 15l-6-6-6 6'),
    'arrow-left': P('M19 12H5M12 19l-7-7 7-7'), 'arrow-right': P('M5 12h14M12 5l7 7-7 7'),
    home: P('M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z'),
    download: P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3'),
    upload: P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'),
    paperclip: P('M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48'),
    settings: P('M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6'),
    check: P('M20 6 9 17l-5-5'),
    'check-circle': C(12, 12, 10) + P('M8 12l3 3 5-6'),
    info: C(12, 12, 10) + P('M12 16v-4M12 8h.01'),
    warning: P('M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z') + P('M12 9v4M12 17h.01'),
    error: C(12, 12, 10) + P('M15 9l-6 6M9 9l6 6'),
    calendar: R(3, 4, 18, 18) + P('M16 2v4M8 2v4M3 10h18'),
    clock: C(12, 12, 10) + P('M12 6v6l4 2'),
    eye: P('M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z') + C(12, 12, 3),
    copy: R(9, 9, 13, 13) + P('M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'),
    print: P('M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2') + R(6, 14, 12, 8, 0),
    columns: R(3, 3, 18, 18) + P('M9 3v18M15 3v18'),
    grid: R(3, 3, 7, 7, 1) + R(14, 3, 7, 7, 1) + R(14, 14, 7, 7, 1) + R(3, 14, 7, 7, 1),
    list: P('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'),
    cart: C(9, 21, 1) + C(20, 21, 1) + P('M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'),
    box: P('M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z') + P('M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12'),
    truck: P('M1 3h15v13H1zM16 8h4l3 3v5h-7V8z') + C(5.5, 18.5, 2.5) + C(18.5, 18.5, 2.5),
    money: P('M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'),
    factory: P('M2 20h20V8l-6 4V8l-6 4V4H2z') + P('M6 16h2M11 16h2M16 16h2'),
    wrench: P('M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'),
    chart: P('M3 3v18h18M8 17V10M13 17V6M18 17v-4'),
    doc: P('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z') + P('M14 2v6h6M16 13H8M16 17H8'),
    folder: P('M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'),
    link: P('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3'),
    location: P('M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z') + C(12, 10, 3),
    pin: P('M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z'),
    message: P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'),
    sparkle: P('M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z'),
    lock: R(3, 11, 18, 11) + P('M7 11V7a5 5 0 0 1 10 0v4'),
    layers: P('M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'),
    lov: P('M5 7h14M5 12h14M5 17h14'),
    window: R(2, 4, 20, 16) + P('M2 9h20'),
    flow: R(3, 3, 7, 6, 1) + R(14, 15, 7, 6, 1) + P('M6.5 9v3.5a2 2 0 0 0 2 2H14'),
    play: '<path d="M7 5v14l11-7z" fill="currentColor" stroke="none"/>',
    'play-left': '<path d="M17 5v14L6 12z" fill="currentColor" stroke="none"/>',
    wrench2: P('M14 7l3-3 3 3-3 3M3 21l9-9'),
    history: P('M3 12a9 9 0 1 0 3-6.7L3 8') + P('M3 3v5h5M12 7v5l4 2'),
    excel: R(3, 3, 18, 18) + P('M8 8l8 8M16 8l-8 8'),
    tag: P('M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z') + P('M7 7h.01'),
    mail: R(2, 4, 20, 16) + P('M22 6l-10 7L2 6'),
    phone: P('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z'),
    expand: P('M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7'),
    logout: P('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'),
  };
  IFS.icon = (name, cls = '') =>
    `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IFS.icons[name] || IFS.icons.help}</svg>`;
  IFS.renderIcons = (root = document) => {
    root.querySelectorAll('i[data-icon]').forEach((el) => {
      const tmp = document.createElement('span');
      tmp.innerHTML = IFS.icon(el.dataset.icon, el.className);
      el.replaceWith(tmp.firstChild);
    });
  };

  /* ---------------- Shell: top bar, icon rail, navigator ---------------- */
  const PIN_KEY = 'ifs-mockup-nav-pinned-v2';
  function readPinned() {
    try { const v = localStorage.getItem(PIN_KEY); if (v !== null) return v === '1'; } catch (e) {}
    return !!IFS.config.navPinned;
  }
  IFS.setNavPinned = (on) => {
    document.body.classList.toggle('nav-pinned', on);
    document.body.classList.remove('nav-open');
    document.querySelectorAll('[data-pin-nav]').forEach((b) => {
      b.classList.toggle('on', on);
      b.title = on ? 'Unpin navigator' : 'Pin navigator';
    });
    try { localStorage.setItem(PIN_KEY, on ? '1' : '0'); } catch (e) {}
  };

  // Navigator model: normalised tree + current folder path (drill-down like IFS Cloud)
  const norm = (nodes) => (nodes || []).map((n) => ({ ...n, label: n.label || n.title, items: n.items ? norm(n.items) : null }));
  let NAV = [];
  let navPath = [];
  let activeId = '';
  function findPath(nodes, id, trail) {
    for (const n of nodes) {
      if (n.id && n.id === id) return trail;
      if (n.items) { const r = findPath(n.items, id, [...trail, n]); if (r) return r; }
    }
    return null;
  }
  function leaves(nodes, trail, out) {
    nodes.forEach((n) => (n.items ? leaves(n.items, [...trail, n.label], out) : out.push({ n, path: trail.join(' / ') })));
    return out;
  }
  const navLink = (n, extra = '') =>
    `<a class="ifs-nav-item${n.id && n.id === activeId ? ' active' : ''}" href="${IFS.url(n.href || '#')}"><span>${n.label}${extra}</span>${n.count != null ? `<span class="count">${n.count}</span>` : ''}</a>`;
  function renderNav() {
    const tree = document.querySelector('.ifs-nav-tree');
    if (!tree) return;
    const term = (document.querySelector('[data-nav-search]')?.value || '').trim().toLowerCase();
    if (term) {
      const hits = leaves(NAV, [], []).filter((x) => x.n.label.toLowerCase().includes(term));
      tree.innerHTML = `<div class="ifs-nav-title">Search results</div>` +
        (hits.length ? hits.map((x) => navLink(x.n, `<span class="path">${x.path}</span>`)).join('') : `<div class="muted" style="padding:8px 12px">No pages found</div>`);
      return;
    }
    const level = navPath.length ? navPath[navPath.length - 1].items : NAV;
    let html = '';
    if (navPath.length) {
      const up = navPath.slice(0, -1).map((n) => n.label).join(' / ');
      html += `<button class="ifs-nav-back" data-nav-back>${IFS.icon('chevron-left')}<span>${up}</span></button>`;
      html += `<div class="ifs-nav-title">${navPath[navPath.length - 1].label}</div>`;
    }
    html += level.map((n, i) => n.items
      ? `<button class="ifs-nav-item" data-nav-drill="${i}">${!navPath.length && n.icon ? IFS.icon(n.icon, 'gi') : ''}<span>${n.label}</span>${IFS.icon('chevron-right', 'chev')}</button>`
      : navLink(n)).join('');
    tree.innerHTML = html;
  }

  function buildShell() {
    const cfg = IFS.config;
    const body = document.body;
    if (body.dataset.shell === 'none') return;
    activeId = body.dataset.nav || '';
    NAV = norm(cfg.navigator);
    navPath = findPath(NAV, activeId, []) || [];
    const notes = cfg.notifications || [];

    const header = document.createElement('header');
    header.className = 'ifs-header';
    header.innerHTML = `
      <a class="ifs-brand" href="${IFS.url(cfg.home)}">
        ${cfg.badge ? `<span class="env">${cfg.badge}</span>` : ''}
        ${cfg.title ? `<span class="app">${cfg.title}</span>` : ''}
      </a>
      <div class="ifs-hdr-search">${IFS.icon('search')}<input placeholder="Search"></div>
      <div class="ifs-hdr-right">
        <button class="hdr-btn" title="Copilot" data-toast="Copilot is not available in this mockup" data-toast-type="info">${IFS.icon('sparkle', 'lg')}</button>
        <button class="hdr-btn" title="Notifications" data-open-panel="ifs-notifications">${IFS.icon('bell', 'lg')}${notes.length ? `<span class="dot">${notes.length}</span>` : ''}</button>
        <button class="hdr-btn" title="Help">${IFS.icon('help', 'lg')}</button>
        <div class="ifs-menu-wrap">
          <div class="ifs-user" data-menu>
            <span class="ifs-avatar">${cfg.user.initials}</span>
            <span class="meta"><b>${cfg.user.name}</b><span>${cfg.user.company}</span></span>
          </div>
          <div class="ifs-menu right">
            <div class="hdr">Signed in as ${cfg.user.name}</div>
            <a href="#">${IFS.icon('user')}User profile</a>
            <a href="#">${IFS.icon('settings')}User settings</a>
            <button data-toggle-notes>${IFS.icon('eye')}Show / hide mockup notes</button>
            <hr><a href="#">${IFS.icon('logout')}Sign out</a>
          </div>
        </div>
      </div>`;

    const rail = document.createElement('aside');
    rail.className = 'ifs-rail';
    rail.innerHTML = `
      <a href="${IFS.url(cfg.home)}" title="Home">${IFS.icon('home')}</a>
      <button data-toggle-nav title="Navigator" class="on">${IFS.icon('menu')}</button>
      <button title="Recent" data-toast="Recent pages are not available in this mockup" data-toast-type="info">${IFS.icon('history')}</button>
      <hr>
      ${(cfg.favorites || []).map((f) => `<a href="${IFS.url(f.href || '#')}" title="${f.label}" style="color:${f.color || 'var(--text-2)'}">${IFS.icon(f.icon || 'star')}</a>`).join('')}
      <button class="bottom" title="Add favorite" data-toast="Added to favorites">${IFS.icon('plus')}</button>`;

    const nav = document.createElement('nav');
    nav.className = 'ifs-nav';
    nav.innerHTML = `
      <div class="ifs-nav-top">
        <div class="ifs-input-icon left">${IFS.icon('search')}<input class="ifs-input" placeholder="Find page" data-nav-search></div>
        <button class="btn icon pin" data-pin-nav title="Pin navigator">${IFS.icon('pin')}</button>
      </div>
      <div class="ifs-nav-tree"></div>`;
    const backdrop = document.createElement('div');
    backdrop.className = 'ifs-nav-backdrop';
    backdrop.dataset.toggleNav = '';

    const notif = document.createElement('aside');
    notif.className = 'ifs-panel';
    notif.id = 'ifs-notifications';
    notif.innerHTML = `
      <div class="ifs-panel-header"><h2>Notifications</h2><button class="btn icon" data-close-panel>${IFS.icon('close')}</button></div>
      <div class="ifs-panel-body">
        <ul class="ifs-mini-list">${notes.map((n) => `<li>${IFS.icon(n.icon || 'info')}<div class="grow"><b>${n.title}</b><small>${n.meta || ''}</small></div></li>`).join('')}</ul>
      </div>`;

    const toasts = document.createElement('div');
    toasts.className = 'ifs-toasts';

    body.prepend(header, rail, backdrop, nav);
    body.append(notif, toasts);
    renderNav();
    IFS.setNavPinned(readPinned());

    // Breadcrumb strip: window / full-screen buttons on the right
    document.querySelectorAll('.ifs-breadcrumb').forEach((bc) => {
      if (bc.querySelector('.bc-right')) return;
      const spans = bc.querySelectorAll(':scope > span');
      if (spans.length) spans[spans.length - 1].classList.add('current');
      bc.insertAdjacentHTML('beforeend', `<span class="bc-right"><button title="Open in new window">${IFS.icon('window')}</button><button title="Full screen" data-fullscreen>${IFS.icon('expand')}</button></span>`);
    });
  }

  // Required fields that are empty get a pink background (IFS Cloud behaviour)
  IFS.markRequired = (root = document) => {
    root.querySelectorAll('.ifs-field.required').forEach((f) => {
      const inp = f.querySelector('input:not([type=checkbox]):not([type=radio]), select, textarea');
      f.classList.toggle('is-empty', !!inp && !String(inp.value).trim());
    });
  };

  /* ---------------- Aurena widgets rendered from data-attributes ---------------- */
  // State indicator: <div class="ifs-state-indicator" data-states="Planned|Released|Reserved" data-current="Released" data-emphasis="info"></div>
  function renderStateIndicators() {
    document.querySelectorAll('.ifs-state-indicator[data-states]').forEach((el) => {
      const states = el.dataset.states.split('|');
      const cur = Math.max(0, states.indexOf(el.dataset.current));
      const pct = el.dataset.progress || Math.round(((cur + 1) / states.length) * 100);
      el.classList.add('ifs-menu-wrap', el.dataset.emphasis || 'primary');
      el.innerHTML = `
        <button class="si-btn" data-menu title="Show all states">
          <span class="si-label">${states[cur]}${IFS.icon('chevron-down')}</span>
          <span class="si-bar"><span style="width:${pct}%"></span></span>
        </button>
        <div class="ifs-menu right si-menu">
          <div class="hdr">States</div>
          ${states.map((s, i) => `<div class="si-item${i < cur ? ' done' : ''}${i === cur ? ' current' : ''}"><span class="si-dot"></span>${s}</div>`).join('')}
        </div>`;
    });
  }
  // Record selector: <div class="ifs-selector" data-records="C1045 – Alpen|C1046 – Baltic" data-current="0"></div>
  function renderSelectors() {
    document.querySelectorAll('.ifs-selector[data-records]').forEach((el) => {
      const recs = el.dataset.records.split('|');
      const cur = +(el.dataset.current || 0);
      el.classList.add('ifs-menu-wrap');
      el.innerHTML = `
        <button class="sel-btn" data-menu title="Select record"><span class="sel-text">${recs[cur]}</span>${IFS.icon('chevron-down')}</button>
        <div class="ifs-menu">
          <div class="ifs-input-icon left" style="display:block;padding:4px 8px 6px">${IFS.icon('search')}<input class="ifs-input" placeholder="Search" style="height:28px"></div>
          ${recs.map((r, i) => `<button data-select-record="${i}"${i === cur ? ' class="current"' : ''}>${r}</button>`).join('')}
        </div>`;
    });
  }

  /* ---------------- Toasts ---------------- */
  IFS.toast = (msg, type = 'success') => {
    const host = document.querySelector('.ifs-toasts') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'ifs-toasts' }));
    const icon = { success: 'check-circle', info: 'info', warning: 'warning', danger: 'error' }[type] || 'info';
    const t = document.createElement('div');
    t.className = `ifs-toast ${type}`;
    t.innerHTML = `${IFS.icon(icon)}<span>${msg}</span>`;
    host.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  };

  /* ---------------- Edit mode ---------------- */
  function toInput(field) {
    const v = field.querySelector('.ifs-field-value');
    if (!v || field.dataset.readonly !== undefined) return;
    const type = field.dataset.type || 'text';
    const raw = v.dataset.value ?? v.textContent.trim();
    v.dataset.html = v.innerHTML;
    let html;
    if (type === 'select') {
      const opts = (field.dataset.options || '').split('|');
      html = `<select class="ifs-select">${opts.map((o) => `<option${o === raw ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
    } else if (type === 'textarea') {
      html = `<textarea class="ifs-textarea">${raw}</textarea>`;
    } else if (type === 'checkbox') {
      html = `<label class="ifs-check"><input type="checkbox"${/^(yes|true|1)$/i.test(raw) ? ' checked' : ''}> ${field.dataset.checkLabel || ''}</label>`;
    } else if (type === 'lov') {
      html = `<div class="ifs-input-icon"><input class="ifs-input" value="${raw}"><button type="button" title="List of values" data-open-dialog="${field.dataset.lov || 'ifs-lov'}">${IFS.icon('lov')}</button></div>`;
    } else if (type === 'date') {
      html = `<div class="ifs-input-icon"><input class="ifs-input" value="${raw}"><button type="button" tabindex="-1">${IFS.icon('calendar')}</button></div>`;
    } else {
      html = `<input class="ifs-input${type === 'number' ? ' num' : ''}" value="${raw}"${type === 'number' ? ' style="text-align:right"' : ''}>`;
    }
    v.innerHTML = html;
  }
  function toReadonly(field, commit) {
    const v = field.querySelector('.ifs-field-value');
    if (!v || v.dataset.html === undefined) return;
    if (commit) {
      const inp = v.querySelector('input:not([type=checkbox]), select, textarea');
      const cb = v.querySelector('input[type=checkbox]');
      if (cb) v.textContent = cb.checked ? 'Yes' : 'No';
      else if (inp) { v.textContent = inp.value; v.dataset.value = inp.value; }
    } else v.innerHTML = v.dataset.html;
    delete v.dataset.html;
  }
  IFS.setEditing = (record, on, commit) => {
    record.classList.toggle('is-editing', on);
    record.querySelectorAll('.ifs-field').forEach((f) => (on ? toInput(f) : toReadonly(f, commit)));
    IFS.markRequired(record);
    const scope = record.closest('.ifs-page') || document;
    scope.querySelectorAll('[data-action="edit"],[data-action="new"],[data-action="delete"]').forEach((b) => (b.disabled = on));
    scope.querySelectorAll('[data-action="save"],[data-action="cancel"]').forEach((b) => (b.disabled = !on));
  };

  /* ---------------- Tables ---------------- */
  function updateSelectionCount(list) {
    const n = list.querySelectorAll('tbody tr.selected').length;
    list.querySelectorAll('[data-selected-count]').forEach((el) => (el.textContent = n ? `${n} selected` : ''));
    // Buttons inside the list follow it; page-header buttons follow the page's first list.
    const btns = [...list.querySelectorAll('[data-needs-selection]')];
    const page = list.closest('.ifs-page');
    if (page && page.querySelector('.ifs-list') === list)
      btns.push(...page.querySelectorAll('.ifs-page-header [data-needs-selection]'));
    btns.forEach((b) => (b.disabled = n === 0));
  }
  function sortTable(th) {
    const table = th.closest('table');
    const idx = [...th.parentNode.children].indexOf(th);
    const dir = th.dataset.dir === 'asc' ? 'desc' : 'asc';
    table.querySelectorAll('th').forEach((h) => { delete h.dataset.dir; const s = h.querySelector('.sort'); if (s) s.textContent = ''; });
    th.dataset.dir = dir;
    let s = th.querySelector('.sort');
    if (!s) { s = document.createElement('span'); s.className = 'sort'; th.append(' ', s); }
    s.textContent = dir === 'asc' ? '▲' : '▼';
    const tbody = table.tBodies[0];
    const val = (tr) => (tr.children[idx]?.dataset.sort ?? tr.children[idx]?.textContent ?? '').trim();
    const rows = [...tbody.rows].sort((a, b) => {
      const x = val(a), y = val(b);
      const nx = parseFloat(x.replace(/[^\d.-]/g, '')), ny = parseFloat(y.replace(/[^\d.-]/g, ''));
      const r = !isNaN(nx) && !isNaN(ny) && /^[\d\s.,-]+/.test(x) ? nx - ny : x.localeCompare(y);
      return dir === 'asc' ? r : -r;
    });
    rows.forEach((r) => tbody.appendChild(r));
  }

  /* ---------------- Assistant ---------------- */
  function assistantGo(a, idx) {
    const panels = [...a.querySelectorAll('.step-panel')];
    const steps = [...a.querySelectorAll('.ifs-step')];
    idx = Math.max(0, Math.min(panels.length - 1, idx));
    a.dataset.step = idx;
    panels.forEach((p, i) => p.classList.toggle('active', i === idx));
    steps.forEach((s, i) => { s.classList.toggle('active', i === idx); s.classList.toggle('done', i < idx); });
    a.querySelectorAll('[data-step-back]').forEach((b) => (b.disabled = idx === 0));
    a.querySelectorAll('[data-step-next]').forEach((b) => (b.disabled = idx === panels.length - 1));
    a.querySelectorAll('[data-step-finish]').forEach((b) => (b.disabled = idx !== panels.length - 1));
  }

  /* ---------------- Event delegation ---------------- */
  function closeMenus(except) {
    document.querySelectorAll('.ifs-menu.open').forEach((m) => m !== except && m.classList.remove('open'));
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    const q = (sel) => t.closest(sel);
    let el;

    if ((el = q('[data-pin-nav]'))) { IFS.setNavPinned(!document.body.classList.contains('nav-pinned')); return; }
    if ((el = q('[data-toggle-nav]'))) {
      // Pinned + wide screen: hamburger unpins. Otherwise it toggles the overlay.
      if (document.body.classList.contains('nav-pinned') && window.innerWidth > 900) IFS.setNavPinned(false);
      else document.body.classList.toggle('nav-open');
      return;
    }
    if ((el = q('[data-select-record]'))) {
      const sel = el.closest('.ifs-selector');
      sel.querySelector('.sel-text').textContent = el.textContent;
      sel.querySelectorAll('[data-select-record]').forEach((b) => b.classList.toggle('current', b === el));
    }
    if ((el = q('[data-nav-drill]'))) {
      const level = navPath.length ? navPath[navPath.length - 1].items : NAV;
      navPath.push(level[+el.dataset.navDrill]); renderNav(); return;
    }
    if ((el = q('[data-nav-back]'))) { navPath.pop(); renderNav(); return; }
    if ((el = q('[data-fullscreen]'))) {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.();
      return;
    }
    if ((el = q('[data-toggle-notes]'))) { document.body.classList.toggle('hide-notes'); closeMenus(); return; }

    // Menus
    if (q('.ifs-menu input')) return; // typing in a menu's search box
    if ((el = q('[data-menu]'))) {
      const menu = el.parentNode.querySelector('.ifs-menu');
      closeMenus(menu);
      menu?.classList.toggle('open');
      e.stopPropagation();
      return;
    }
    if (!q('.ifs-menu')) closeMenus();
    else if (q('.ifs-menu a, .ifs-menu button')) closeMenus();

    // Tabs
    if ((el = q('.ifs-tab[data-tab]'))) {
      const scope = el.closest('[data-tabs]') || document;
      scope.querySelectorAll(':scope .ifs-tab[data-tab]').forEach((b) => b.classList.toggle('active', b === el));
      scope.querySelectorAll(':scope .ifs-tab-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === el.dataset.tab));
    }

    // Collapsible groups
    if ((el = q('.ifs-group-header')) && !q('button, a, input')) el.parentNode.classList.toggle('collapsed');

    // Dialogs & panels
    if ((el = q('[data-open-dialog]'))) { document.getElementById(el.dataset.openDialog)?.showModal(); }
    if ((el = q('[data-close-dialog]'))) { el.closest('dialog')?.close(); }
    if (t.tagName === 'DIALOG' && t.classList.contains('ifs-dialog')) t.close(); // backdrop click
    if ((el = q('[data-open-panel]'))) { document.getElementById(el.dataset.openPanel)?.classList.toggle('open'); }
    if ((el = q('[data-close-panel]'))) { el.closest('.ifs-panel')?.classList.remove('open'); }

    // Record actions
    if ((el = q('[data-action]'))) {
      const rec = el.closest('.ifs-record') || document.querySelector('.ifs-record');
      const a = el.dataset.action;
      if (rec && a === 'edit') IFS.setEditing(rec, true);
      if (rec && a === 'cancel') IFS.setEditing(rec, false, false);
      if (rec && a === 'save') { IFS.setEditing(rec, false, true); IFS.toast('Changes saved'); }
    }

    // Toast trigger
    if ((el = q('[data-toast]'))) IFS.toast(el.dataset.toast, el.dataset.toastType || 'success');

    // Favorite star
    if ((el = q('.fav'))) el.classList.toggle('on');

    // Alerts
    if ((el = q('.ifs-alert .close'))) el.closest('.ifs-alert').remove();

    // Filter chips
    if ((el = q('.chip button'))) el.closest('.chip').remove();

    // Table: sort
    if ((el = q('.ifs-table th')) && !el.classList.contains('sel') && !el.classList.contains('act') && el.closest('table').dataset.sortable !== 'false') sortTable(el);

    // Table: row select
    if ((el = q('.ifs-table tbody tr')) && !q('a, button, input:not(.row-check), select')) {
      const cb = el.querySelector('.row-check');
      if (cb && t !== cb) cb.checked = !cb.checked;
      el.classList.toggle('selected', cb ? cb.checked : !el.classList.contains('selected'));
      const list = el.closest('.ifs-list'); if (list) updateSelectionCount(list);
    }
    if ((el = q('.ifs-table th .all-check'))) {
      const table = el.closest('table');
      table.querySelectorAll('tbody tr').forEach((tr) => {
        if (tr.style.display === 'none') return;
        const cb = tr.querySelector('.row-check'); if (cb) cb.checked = el.checked;
        tr.classList.toggle('selected', el.checked);
      });
      const list = el.closest('.ifs-list'); if (list) updateSelectionCount(list);
    }

    // Assistant
    const asst = q('[data-assistant]');
    if (asst) {
      const i = +(asst.dataset.step || 0);
      if (q('[data-step-next]')) assistantGo(asst, i + 1);
      if (q('[data-step-back]')) assistantGo(asst, i - 1);
      if ((el = q('.ifs-step'))) assistantGo(asst, [...asst.querySelectorAll('.ifs-step')].indexOf(el));
    }
  });

  document.addEventListener('input', (e) => {
    const t = e.target;
    // Quick filter in list toolbar: <input data-filter>
    if (t.matches('[data-filter]')) {
      const list = t.closest('.ifs-list');
      const term = t.value.toLowerCase();
      let shown = 0;
      list.querySelectorAll('tbody tr').forEach((tr) => {
        const ok = tr.textContent.toLowerCase().includes(term);
        tr.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      list.querySelectorAll('[data-row-count]').forEach((el) => (el.textContent = shown));
    }
    // Navigator search
    if (t.matches('[data-nav-search]')) renderNav();
    if (t.closest('.ifs-field.required')) IFS.markRequired(t.closest('.ifs-field').parentNode);
  });

  document.addEventListener('change', (e) => {
    if (e.target.closest('.ifs-field.required')) IFS.markRequired(e.target.closest('.ifs-field').parentNode);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.body.classList.remove('nav-open');
      document.querySelectorAll('.ifs-panel.open').forEach((p) => p.classList.remove('open'));
      closeMenus();
    }
  });

  /* ---------------- Init ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    buildShell();
    renderStateIndicators();
    renderSelectors();
    IFS.renderIcons();
    IFS.markRequired();
    document.querySelectorAll('[data-assistant]').forEach((a) => assistantGo(a, +(a.dataset.step || 0)));
    if (document.querySelector('.ifs-record'))
      document.querySelectorAll('[data-action="save"],[data-action="cancel"]').forEach((b) => (b.disabled = true));
    document.querySelectorAll('.ifs-list').forEach((l) => {
      updateSelectionCount(l);
      l.querySelectorAll('[data-row-count]').forEach((el) => (el.textContent = l.querySelectorAll('tbody tr').length));
    });
  });
})();
