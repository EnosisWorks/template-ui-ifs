/* Mockup-wide settings. Loaded by every page in this folder BEFORE ../../assets/ifs-cloud.js.
   Use plain relative links (same folder) so the mockup still works after `python3 tools/bundle.py`. */
window.IFS = {
  config: {
    title: 'Demo Company – Maintenance',
    home: 'index.html',
    user: { name: 'Tomasz Lis', initials: 'TL', company: '20 – Demo Company' },
    notifications: [
      { icon: 'warning', title: 'Work task WT-5012 overdue', meta: 'Compressor C-02 · 2 h ago' },
    ],
    // Coloured shortcuts in the left icon rail
    favorites: [
      { icon: 'wrench', color: '#3a9d5d', label: 'Work Tasks', href: 'index.html' },
    ],
    // Folders (with items) drill in; leaves are pages. id = <body data-nav>.
    navigator: [
      { label: 'Maintenance', icon: 'wrench', items: [
        { label: 'Work Management', items: [
          { label: 'Work Tasks', href: 'index.html', id: 'work-tasks', count: 5 },
          { label: 'Work Orders', href: '#' },
        ]},
        { label: 'Equipment', items: [{ label: 'Equipment Objects', href: '#' }] },
        { label: 'Preventive Maintenance', items: [{ label: 'PM Actions', href: '#' }] },
      ]},
    ],
  },
};
