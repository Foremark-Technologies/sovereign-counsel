// ============================================
// SOVEREIGN COUNSEL v5.0 â€” Elite Legal OS
// Complete Application
// ============================================

const { useState, useEffect, useRef, useCallback, useMemo, createElement: h, Fragment } = React;
const API_BASE = "http://localhost:4000/api/v1";

async function apiRequest(path, options = {}) {
  console.log("API CALL →", API_BASE + path, options);
  const token = localStorage.getItem("accessToken");

const res = await fetch("http://localhost:4000/api/v1" + path, {
  method: options.method || 'GET',
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  },
  body: options.body
});

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("RAW RESPONSE:", text);
    throw new Error("Server returned HTML instead of JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

// ============================================
// HOOKS
// ============================================
function useRouter() {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/login');
  useEffect(() => {
    const handler = () => setPath(window.location.hash.slice(1) || '/login');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const navigate = useCallback((to) => { window.location.hash = to; }, []);
  return { path, navigate };
}

function useAnimateIn(delay = 0) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return v;
}

function useKeyboard(key, modifier, handler) {
  useEffect(() => {
    const fn = (e) => {
      if (modifier === 'meta' && (e.metaKey || e.ctrlKey) && e.key === key) {
        e.preventDefault(); handler();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [key, modifier, handler]);
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [ref, handler]);
}

// ============================================
// UTILITY COMPONENTS
// ============================================
function Icon({ name, className = '' }) {
  return h('i', { className: `fa-solid fa-${name} ${className}` });
}

function Badge({ type = 'neutral', dot, children }) {
  return h('span', { className: `badge badge-${type} ${dot ? 'badge-dot' : ''}` }, children);
}

function PriorityBadge({ level }) {
  const map = { p0: ['P0', 'critical'], p1: ['P1', 'high'], p2: ['P2', 'medium'], p3: ['P3', 'low'] };
  const [label, cls] = map[level] || ['â€”', 'neutral'];
  return h('span', { className: `badge badge-${cls}` }, label);
}

function Avatar({ initials, color = '#0c1525', size = 'md', online }) {
  return h('div', { className: `avatar avatar-${size}`, style: { background: color }, title: initials },
    initials,
    online && h('span', { className: 'absolute -bottom-px -right-px w-2 h-2 bg-emerald-400 rounded-full border-[1.5px] border-white', style: { position: 'absolute' } })
  );
}

function ProgressBar({ value, color = '#0c1525', height = 4 }) {
  return h('div', { className: 'progress-bar', style: { height } },
    h('div', { className: 'progress-fill', style: { width: `${Math.min(100, value)}%`, background: color } })
  );
}

function SLATimer({ value, className = '' }) {
  const isOverdue = value === 'OVERDUE';
  const cls = isOverdue ? 'sla-overdue' :
    value.includes('h') && !value.includes('d') ? 'sla-danger' :
      value.includes('d') && parseInt(value) <= 2 ? 'sla-warning' : 'sla-ok';
  return h('span', { className: `sla-timer ${cls} ${className}` },
    h(Icon, { name: 'clock', className: 'text-[8px]' }),
    value
  );
}

function HealthScore({ score, size = 48 }) {
  const color = score >= 70 ? '#059669' : score >= 40 ? '#d97706' : '#dc2626';
  const bg = score >= 70 ? '#ecfdf5' : score >= 40 ? '#fffbeb' : '#fef2f2';
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return h('div', { style: { width: size, height: size, position: 'relative' } },
    h('svg', { width: size, height: size, style: { transform: 'rotate(-90deg)' } },
      h('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: '#e5e7eb', strokeWidth: 3 }),
      h('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: color, strokeWidth: 3, strokeDasharray: c, strokeDashoffset: offset, strokeLinecap: 'round' })
    ),
    h('span', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.28, fontWeight: 750, color } }, score)
  );
}

function SectionTitle({ title, icon, action, actionLabel, count }) {
  return h('div', { className: 'flex items-center justify-between mb-2' },
    h('div', { className: 'flex items-center gap-2' },
      icon && h(Icon, { name: icon, className: 'text-[10px] text-graphite-400' }),
      h('span', { className: 't-label text-graphite-500' }, title),
      count !== undefined && h('span', { className: 'badge badge-neutral', style: { fontSize: 9, padding: '1px 5px' } }, count)
    ),
    action && h('button', { className: 'btn btn-ghost btn-xs', onClick: action },
      actionLabel || 'View All', h(Icon, { name: 'arrow-right', className: 'text-[8px]' })
    )
  );
}

function EmptyState({ icon, title, sub }) {
  return h('div', { className: 'empty-state' },
    h(Icon, { name: icon, className: 'text-2xl text-graphite-200 mb-2' }),
    h('div', { className: 't-body font-semibold text-graphite-400 mb-1' }, title),
    sub && h('div', { className: 't-caption text-graphite-300' }, sub)
  );
}

function TabNav({ tabs, active, onChange }) {
  return h('div', { className: 'tab-nav' },
    tabs.map(t => h('div', { key: t.id, className: `tab-item ${active === t.id ? 'active' : ''}`, onClick: () => onChange(t.id) },
      t.label,
      t.count !== undefined && h('span', { className: 'tab-count' }, t.count)
    ))
  );
}

function FilterChip({ label, active, icon, onClick }) {
  return h('button', { className: `filter-chip ${active ? 'active' : ''}`, onClick },
    icon && h(Icon, { name: icon, className: 'text-[9px]' }),
    label
  );
}

// ============================================
// COMMAND PALETTE (Cmd+K)
// ============================================
function CommandPalette({ open, onClose, navigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => { if (open && inputRef.current) { setQuery(''); inputRef.current.focus(); } }, [open]);
  useClickOutside(boxRef, onClose);

  if (!open) return null;

  const filtered = query.length > 0
    ? MOCK.searchItems.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.sub.toLowerCase().includes(query.toLowerCase()))
    : MOCK.searchItems;

  const grouped = {};
  filtered.forEach(i => { if (!grouped[i.type]) grouped[i.type] = []; grouped[i.type].push(i); });

  const typeLabels = { matter: 'Matters', client: 'Clients', document: 'Documents', person: 'People', action: 'Actions' };

  const handleSelect = (item) => {
    onClose();
    if (item.type === 'matter') navigate('/matters/detail');
    else if (item.type === 'client') navigate('/matters');
    else if (item.type === 'document') navigate('/documents');
    else if (item.type === 'person') navigate('/control');
    else if (item.type === 'action') {
      if (item.title.includes('Matter')) navigate('/matters');
      else if (item.title.includes('Time')) navigate('/billing');
      else navigate('/documents');
    }
  };

  return h('div', { className: 'cmd-overlay', onClick: (e) => { if (e.target === e.currentTarget) onClose(); } },
    h('div', { className: 'cmd-box', ref: boxRef },
      h('div', { className: 'cmd-input-wrap' },
        h(Icon, { name: 'magnifying-glass' }),
        h('input', { ref: inputRef, className: 'cmd-input', placeholder: 'Search matters, clients, documents, people...', value: query, onChange: e => setQuery(e.target.value), onKeyDown: e => { if (e.key === 'Escape') onClose(); } }),
        h('kbd', { className: 'kbd' }, 'ESC')
      ),
      h('div', { className: 'cmd-results' },
        Object.entries(grouped).map(([type, items]) =>
          h(Fragment, { key: type },
            h('div', { className: 'cmd-group-label' }, typeLabels[type] || type),
            items.slice(0, 5).map((item, i) =>
              h('div', { key: i, className: 'cmd-item', onClick: () => handleSelect(item) },
                h(Icon, { name: item.icon, className: '' }),
                h('span', { className: 'cmd-item-title' }, item.title),
                h('span', { className: 'cmd-item-sub' }, item.sub)
              )
            )
          )
        ),
        filtered.length === 0 && h('div', { className: 'p-6 text-center' },
          h('div', { className: 't-body text-graphite-400' }, 'No results found'),
          h('div', { className: 't-caption text-graphite-300 mt-1' }, 'Try a different search term')
        )
      ),
      h('div', { className: 'cmd-footer' },
        h('span', { className: 'flex items-center gap-1 t-caption text-graphite-400' }, h('kbd', { className: 'kbd' }, 'â†µ'), 'Select'),
        h('span', { className: 'flex items-center gap-1 t-caption text-graphite-400' }, h('kbd', { className: 'kbd' }, 'â†‘â†“'), 'Navigate'),
        h('span', { className: 'flex items-center gap-1 t-caption text-graphite-400' }, h('kbd', { className: 'kbd' }, 'esc'), 'Close')
      )
    )
  );
}

// ============================================
// SIDEBAR
// ============================================
function Sidebar({ activePath, navigate }) {
  // Icons chosen from Font Awesome 6 Free (solid) for consistent 20px optical size.
  // Matched to semantic intent: Dashboard = command grid; Analytics = strategic trendline.
  const navItems = [
    { icon: 'table-cells-large', path: '/dashboard', label: 'Dashboard', shortcut: '1' },
    { icon: 'gavel', path: '/matters', label: 'Matters', shortcut: '2' },
    { icon: 'calendar-days', path: '/calendar', label: 'Calendar', shortcut: '3' },
    { icon: 'folder-open', path: '/documents', label: 'Documents', shortcut: '4' },
    { icon: 'file-invoice-dollar', path: '/billing', label: 'Billing', shortcut: '5' },
    { icon: 'bell', path: '/notifications', label: 'Alerts', shortcut: '6' },
    { icon: 'chart-line', path: '/analytics', label: 'Analytics', shortcut: '7' },
    { icon: 'shield-halved', path: '/control', label: 'Control', shortcut: '8' },
  ];

  return h('aside', { className: 'app-sidebar' },
    h('div', { className: 'sidebar-logo', onClick: () => navigate('/dashboard') },
      h('span', { className: 'text-white font-bold text-[11px] tracking-tight' }, 'SC')
    ),
    h('nav', { className: 'flex flex-col gap-1 flex-1' },
      navItems.map(item =>
        h('div', { key: item.path, className: `sidebar-nav-item ${activePath.startsWith(item.path) ? 'active' : ''}`, onClick: () => navigate(item.path) },
          h(Icon, { name: item.icon }),
          h('span', { className: 'tooltip' }, item.label)
        )
      )
    ),
    h('div', { className: 'flex flex-col gap-1 mt-auto' },
      h('div', { className: 'sidebar-nav-item', onClick: () => navigate('/portal') },
        h(Icon, { name: 'circle-user' }),
        h('span', { className: 'tooltip' }, 'Client Portal')
      ),
      h('div', { className: 'sidebar-nav-item', onClick: () => navigate('/login') },
        h(Icon, { name: 'right-from-bracket' }),
        h('span', { className: 'tooltip' }, 'Sign Out')
      )
    )
  );
}

// ============================================
// MOBILE NAV â€” header + slide-over drawer
// (only visible < 1024px; desktop sidebar untouched)
// ============================================
const MOBILE_NAV_ITEMS = [
  { icon: 'table-cells-large', path: '/dashboard', label: 'Dashboard', shortcut: '1' },
  { icon: 'gavel', path: '/matters', label: 'Matters', shortcut: '2' },
  { icon: 'calendar-days', path: '/calendar', label: 'Calendar', shortcut: '3' },
  { icon: 'folder-open', path: '/documents', label: 'Documents', shortcut: '4' },
  { icon: 'file-invoice-dollar', path: '/billing', label: 'Billing', shortcut: '5' },
  { icon: 'bell', path: '/notifications', label: 'Notifications', shortcut: '6' },
  { icon: 'chart-line', path: '/analytics', label: 'Analytics', shortcut: '7' },
  { icon: 'shield-halved', path: '/control', label: 'Control Center', shortcut: '8' },
  { icon: 'circle-user', path: '/portal', label: 'Client Portal' },
];

const PAGE_TITLE_MAP = {
  '/dashboard': 'Dashboard',
  '/matters': 'Matters',
  '/calendar': 'Calendar',
  '/documents': 'Documents',
  '/billing': 'Billing',
  '/notifications': 'Notifications',
  '/analytics': 'Analytics',
  '/control': 'Control Center',
  '/portal': 'Client Portal',
};

function MobileHeader({ activePath, navigate, onOpenDrawer, onCmdK }) {
  const title = (() => {
    if (activePath.startsWith('/matters/detail')) return 'Matter Detail';
    for (const key of Object.keys(PAGE_TITLE_MAP)) {
      if (activePath.startsWith(key)) return PAGE_TITLE_MAP[key];
    }
    return 'Sovereign Counsel';
  })();

  return h('header', { className: 'mobile-header', role: 'banner' },
    h('button', {
      className: 'mobile-header-btn',
      onClick: onOpenDrawer,
      'aria-label': 'Open navigation menu',
      type: 'button',
    },
      h(Icon, { name: 'bars' })
    ),
    h('div', { className: 'mobile-header-brand' },
      h('div', {
        className: 'mobile-header-logo',
        onClick: () => navigate('/dashboard'),
        role: 'button',
        'aria-label': 'Go to dashboard',
      }, 'SC'),
      h('div', { style: { minWidth: 0, lineHeight: 1 } },
        h('div', { className: 'mobile-header-title' }, title),
        h('div', { className: 'mobile-header-sub' }, 'Sovereign Counsel')
      )
    ),
    h('div', { className: 'mobile-header-actions' },
      h('button', {
        className: 'mobile-header-btn',
        onClick: onCmdK,
        'aria-label': 'Search',
        type: 'button',
      }, h(Icon, { name: 'magnifying-glass' })),
      h('button', {
        className: 'mobile-header-btn',
        onClick: () => navigate('/notifications'),
        'aria-label': 'Notifications',
        type: 'button',
      },
        h(Icon, { name: 'bell' }),
        h('span', { className: 'notif-dot' })
      )
    )
  );
}

function MobileDrawer({ open, onClose, activePath, navigate }) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.classList.add('mobile-drawer-lock');
    } else {
      document.body.classList.remove('mobile-drawer-lock');
    }
    return () => document.body.classList.remove('mobile-drawer-lock');
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const go = (path) => { navigate(path); onClose(); };

  return h(Fragment, null,
    h('div', {
      className: `mobile-drawer-backdrop ${open ? 'open' : ''}`,
      onClick: onClose,
      'aria-hidden': 'true',
    }),
    h('aside', {
      className: `mobile-drawer ${open ? 'open' : ''}`,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Main navigation',
    },
      h('div', { className: 'mobile-drawer-header' },
        h('div', { className: 'mobile-drawer-brand' },
          h('div', { className: 'mobile-drawer-logo' }, 'SC'),
          h('div', null,
            h('div', { className: 'mobile-drawer-wordmark' }, 'Sovereign Counsel'),
            h('div', { className: 'mobile-drawer-tag' }, 'Legal Operations')
          )
        ),
        h('button', {
          className: 'mobile-drawer-close',
          onClick: onClose,
          'aria-label': 'Close navigation',
          type: 'button',
        }, h(Icon, { name: 'xmark' }))
      ),

      h('div', { className: 'mobile-drawer-section-label' }, 'Workspace'),
      h('nav', { className: 'mobile-drawer-nav' },
        MOBILE_NAV_ITEMS.slice(0, 8).map(item =>
          h('div', {
            key: item.path,
            className: `mobile-drawer-nav-item ${activePath.startsWith(item.path) ? 'active' : ''}`,
            onClick: () => go(item.path),
            role: 'link',
            tabIndex: 0,
            onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(item.path); } },
          },
            h(Icon, { name: item.icon }),
            h('span', null, item.label),
            item.shortcut && h('span', { className: 'shortcut' }, item.shortcut)
          )
        )
      ),

      h('div', { className: 'mobile-drawer-section-label' }, 'Access'),
      h('nav', { className: 'mobile-drawer-nav' },
        h('div', {
          className: `mobile-drawer-nav-item ${activePath.startsWith('/portal') ? 'active' : ''}`,
          onClick: () => go('/portal'),
          role: 'link', tabIndex: 0,
        },
          h(Icon, { name: 'circle-user' }),
          h('span', null, 'Client Portal')
        ),
        h('div', {
          className: 'mobile-drawer-nav-item',
          onClick: () => go('/control'),
          role: 'link', tabIndex: 0,
        },
          h(Icon, { name: 'gear' }),
          h('span', null, 'Settings')
        ),
        h('div', {
          className: 'mobile-drawer-nav-item',
          onClick: () => go('/login'),
          role: 'link', tabIndex: 0,
        },
          h(Icon, { name: 'right-from-bracket' }),
          h('span', null, 'Sign Out')
        )
      ),

      h('div', { className: 'mobile-drawer-footer' },
        h('div', { className: 'mobile-drawer-user' },
          h('div', { className: 'mobile-drawer-user-avatar' }, (MOCK && MOCK.user && MOCK.user.initials) || 'AM'),
          h('div', { className: 'mobile-drawer-user-meta' },
            h('div', { className: 'mobile-drawer-user-name' }, (MOCK && MOCK.user && MOCK.user.name) || 'Adavya Mehta'),
            h('div', { className: 'mobile-drawer-user-role' }, (MOCK && MOCK.user && MOCK.user.role) || 'Managing Partner')
          )
        )
      )
    )
  );
}

// ============================================
// TOP BAR
// ============================================
function TopBar({ title, navigate, onCmdK, children }) {
  return h('header', { className: 'app-topbar' },
    h('span', { className: 't-label-sm hidden lg:block mr-3', style: { letterSpacing: '0.14em', color: 'var(--graphite-400)', fontWeight: 700 } }, 'SOVEREIGN COUNSEL'),
    h('div', { className: 'divider-v mr-2 hidden lg:block' }),
    title && h('span', { className: 't-h3 text-navy-900 mr-4', style: { fontWeight: 650 } }, title),
    children,
    h('div', { className: 'flex-1' }),
    // Search trigger
    h('button', { className: 'search-bar max-w-[260px] min-w-[180px]', onClick: onCmdK },
      h(Icon, { name: 'magnifying-glass', className: 'text-[12px] text-graphite-400' }),
      h('span', { className: 't-body-sm text-graphite-400' }, 'Search everything...'),
      h('kbd', { className: 'kbd ml-auto' }, 'âŒ˜K')
    ),
    h('div', { className: 'flex items-center gap-1 ml-2' },
      h('button', { className: 'btn-icon relative', onClick: () => navigate('/notifications'), title: 'Alerts' },
        h(Icon, { name: 'bell', className: 'text-[13px]' }),
        h('span', { className: 'notif-dot' })
      ),
      h('button', { className: 'btn-icon', title: 'Help' },
        h(Icon, { name: 'circle-question', className: 'text-[13px]' })
      ),
      h('div', { className: 'divider-v mx-2' }),
      h('div', { className: 'flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg cursor-pointer hover:bg-graphite-50 transition-all', onClick: () => navigate('/control') },
        h('div', { className: 'text-right hidden xl:block leading-none' },
          h('div', { style: { fontSize: 12, fontWeight: 650, color: 'var(--graphite-900)', letterSpacing: '-0.005em' } }, MOCK.user.name),
          h('div', { className: 't-micro mt-1', style: { color: 'var(--graphite-400)' } }, MOCK.user.role)
        ),
        h(Avatar, { initials: 'AM', size: 'sm' })
      )
    )
  );
}

// ============================================
// PAGE: LOGIN
// ============================================
function LoginPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST", // 🔥 THIS IS THE KEY FIX
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pw
        })
      });
  
      const data = await res.json();
  
      localStorage.setItem("accessToken", data.data.accessToken);
  
      navigate("dashboard");
  
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };
  return h('div', { className: 'login-page' },
    // ======= LEFT BRAND (Private Infrastructure) =======
    h('div', { className: 'login-brand' },
      h('div', { className: 'login-brand-content' },
        // Logo + Wordmark
        h('div', { className: 'flex items-center gap-3 mb-14 anim-in' },
          h('div', {
            style: {
              width: 44, height: 44,
              borderRadius: 11,
              background: 'linear-gradient(135deg, #3b5280 0%, #141c33 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 18px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
            }
          },
            h(Icon, { name: 'scale-balanced', className: 'text-white', style: { fontSize: 18 } })
          ),
          h('div', null,
            h('div', { style: { fontSize: 15, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' } }, 'Sovereign Counsel'),
            h('div', { className: 't-micro', style: { color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginTop: 2, fontWeight: 650 } }, 'LEGAL OPERATIONS')
          )
        ),

        // Headline â€” display weight
        h('h1', {
          className: 'anim-in stg-1 text-gradient-navy', style: {
            fontSize: 'clamp(2.4rem, 3.6vw, 3.2rem)',
            fontWeight: 750,
            lineHeight: 1.04,
            letterSpacing: '-0.04em',
            marginBottom: 20,
            color: 'white',
          }
        },
          'Where elite law firms ',
          h('br'),
          'run their operations.'
        ),

        // Sub
        h('p', {
          className: 'anim-in stg-2', style: {
            fontSize: '15.5px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.56)',
            marginBottom: 40,
            maxWidth: 460,
            fontWeight: 400,
            letterSpacing: '-0.005em',
          }
        },
          'Matter intelligence, deadline command, document control, and revenue operations â€” unified in one private, audited system.'
        ),

        // Stat Row â€” premium
        h('div', {
          className: 'anim-in stg-3', style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginBottom: 44,
            paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }
        },
          [
            { v: '142', l: 'Active matters' },
            { v: '99.98%', l: 'Uptime SLA' },
            { v: '\u20b924L+', l: 'Billed MTD' },
          ].map((s, i) =>
            h('div', { key: i },
              h('div', { style: { fontSize: 26, fontWeight: 700, color: 'white', letterSpacing: '-0.035em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' } }, s.v),
              h('div', { className: 't-caption', style: { color: 'rgba(255,255,255,0.36)', marginTop: 6, fontWeight: 500 } }, s.l)
            )
          )
        ),

        // Trusted by
        h('div', { className: 'anim-in stg-4' },
          h('div', { className: 't-label-sm', style: { color: 'rgba(255,255,255,0.3)', marginBottom: 14, letterSpacing: '0.16em' } }, 'TRUSTED BY INDIA\'S TOP FIRMS'),
          h('div', { className: 'login-firm-logos', style: { marginBottom: 22 } },
            h('span', null, 'CYRIL AMARCHAND'),
            h('span', { className: 'sep' }, 'Â·'),
            h('span', null, 'KHAITAN & CO'),
            h('span', { className: 'sep' }, 'Â·'),
            h('span', null, 'TRILEGAL'),
            h('span', { className: 'sep' }, 'Â·'),
            h('span', null, 'AZB')
          ),
          h('div', { className: 'login-trust-row' },
            h('span', { className: 'login-trust-chip' }, h(Icon, { name: 'shield-halved' }), 'ISO 27001'),
            h('span', { className: 'login-trust-chip' }, h(Icon, { name: 'shield-check' }), 'SOC 2 TYPE II'),
            h('span', { className: 'login-trust-chip' }, h(Icon, { name: 'lock' }), 'AES-256'),
            h('span', { className: 'login-trust-chip' }, h(Icon, { name: 'building-columns' }), 'Attorney-Client Privileged')
          )
        )
      )
    ),

    // ======= RIGHT FORM =======
    h('div', { className: 'login-form-side' },
      h('div', { className: 'login-card anim-in stg-2' },
        // Status line
        h('div', { className: 'flex items-center gap-2 mb-7' },
          h('span', { className: 'status-indicator live' },
            h('span', { className: 'dot' }),
            h('span', { style: { color: 'var(--emerald-700)' } }, 'All systems operational')
          )
        ),

        h('h2', { className: 't-h1 text-navy-900 mb-2', style: { fontSize: '1.75rem', letterSpacing: '-0.03em' } }, 'Sign in to your workspace'),
        h('p', { className: 't-body mb-7', style: { color: 'var(--graphite-500)' } }, 'Authenticate with your firm credentials to access the platform.'),

        // SSO
        h('div', { className: 'space-y-2.5 mb-6' },
          h('button', { className: 'sso-btn' },
            h('i', { className: 'fa-brands fa-microsoft', style: { color: '#2563eb', fontSize: 16 } }),
            'Continue with Microsoft 365',
            h(Icon, { name: 'arrow-right', className: 'ml-auto text-[11px] text-graphite-400' })
          ),
          h('button', { className: 'sso-btn' },
            h('i', { className: 'fa-brands fa-google', style: { color: '#ea4335', fontSize: 16 } }),
            'Continue with Google Workspace',
            h(Icon, { name: 'arrow-right', className: 'ml-auto text-[11px] text-graphite-400' })
          )
        ),

        h('div', { className: 'flex items-center gap-3 mb-6' },
          h('div', { className: 'flex-1 h-px bg-graphite-100' }),
          h('span', { className: 't-label-sm text-graphite-400' }, 'OR WITH EMAIL'),
          h('div', { className: 'flex-1 h-px bg-graphite-100' })
        ),

        // Form
        h('form', { onSubmit: handleLogin },
          h('div', { className: 'mb-4' },
            h('label', { className: 't-label mb-2 block', style: { color: 'var(--graphite-600)' } }, 'WORK EMAIL'),
            h('input', { type: 'email', className: 'input focus-ring', placeholder: 'name@firm.com', value: email, onChange: e => setEmail(e.target.value), autoComplete: 'email', style: { padding: '10px 13px', fontSize: 13.5 } })
          ),
          h('div', { className: 'mb-4' },
            h('div', { className: 'flex items-center justify-between mb-2' },
              h('label', { className: 't-label', style: { color: 'var(--graphite-600)' } }, 'PASSWORD'),
              h('a', { href: '#', className: 't-caption font-semibold', style: { color: 'var(--navy-700)' } }, 'Forgot?')
            ),
            h('div', { className: 'relative' },
              h('input', { type: showPw ? 'text' : 'password', className: 'input focus-ring pr-10', placeholder: 'Enter password', value: pw, onChange: e => setPw(e.target.value), autoComplete: 'current-password', style: { padding: '10px 13px', fontSize: 13.5 } }),
              h('button', { type: 'button', className: 'absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400 hover:text-graphite-700 transition-colors', onClick: () => setShowPw(!showPw), title: showPw ? 'Hide password' : 'Show password' },
                h(Icon, { name: showPw ? 'eye-slash' : 'eye', className: 'text-[13px]' })
              )
            )
          ),
          h('label', { className: 'flex items-center gap-2 t-caption cursor-pointer mb-5', style: { color: 'var(--graphite-600)' } },
            h('input', { type: 'checkbox', className: 'w-3.5 h-3.5 rounded accent-navy-900' }),
            'Keep me signed in for 30 days'
          ),
          h('button', {
            type: 'submit',
            className: `btn btn-primary btn-lg w-full justify-center ${loading ? 'btn-loading' : ''}`,
            disabled: loading,
            style: { padding: '12px 16px', fontSize: 13.5, fontWeight: 650 }
          },
            loading ? 'Authenticating' : 'Sign in securely',
            !loading && h(Icon, { name: 'arrow-right', className: 'text-[11px]' })
          ),
          h('div', { className: 'flex items-center justify-center gap-2 mt-5 t-caption', style: { color: 'var(--graphite-400)' } },
            h(Icon, { name: 'lock', className: 'text-[10px]' }),
            'End-to-end encrypted \u00b7 ',
            h('a', { href: '#', className: 'font-semibold', style: { color: 'var(--navy-700)' } }, 'Request access')
          )
        )
      )
    )
  );
}

function AcceptInvitePage({ navigate }) {
  const queryToken = new URLSearchParams(window.location.hash.split('?')[1] || '').get('token') || '';
  const [inviteToken, setInviteToken] = useState(queryToken);
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest('/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteToken, password, firstName, lastName }),
      });
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return h('div', { className: 'login-page' },
    h('div', { className: 'login-form-side', style: { margin: '0 auto' } },
      h('div', { className: 'login-card anim-in stg-2' },
        h('h2', { className: 't-h2 text-navy-900 mb-3' }, 'Accept Firm Invite'),
        h('form', { onSubmit },
          h('input', { className: 'input mb-2', placeholder: 'Invite token', value: inviteToken, onChange: (e) => setInviteToken(e.target.value), required: true }),
          h('input', { className: 'input mb-2', placeholder: 'First name', value: firstName, onChange: (e) => setFirstName(e.target.value), required: true }),
          h('input', { className: 'input mb-2', placeholder: 'Last name', value: lastName, onChange: (e) => setLastName(e.target.value), required: true }),
          h('input', { className: 'input mb-3', type: 'password', placeholder: 'Password', value: password, onChange: (e) => setPassword(e.target.value), required: true }),
          h('button', { type: 'submit', className: 'btn btn-primary w-full justify-center', disabled: loading }, loading ? 'Joining...' : 'Join Organization')
        ),
        h('button', { className: 'btn btn-ghost w-full mt-3', onClick: () => navigate('/login') }, 'Back to login')
      )
    )
  );
}

// ============================================
// PAGE: DASHBOARD â€” Legal War Room
// ============================================
function DashboardPage({ navigate, onCmdK }) {
  const d = MOCK.dashStats;
  const [activeTab, setActiveTab] = useState('command');
  const [myMatters, setMyMatters] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [upcomingHearings, setUpcomingHearings] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [matterForm, setMatterForm] = useState({
    clientName: '',
    matterTitle: '',
  });
  const [showMatterModal, setShowMatterModal] = useState(false);
  const openMatterModal = () => setShowMatterModal(true);
  const closeMatterModal = () => { setShowMatterModal(false); setMatterForm({ clientName: '', matterTitle: '' }); };
  const [hearingForm, setHearingForm] = useState({
    matterId: '',
    date: '',
    court: '',
  });

  // â”€â”€ Users feature state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userForm, setUserForm] = useState({ email: '', roleId: '' });
  const [userLoading, setUserLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiRequest('/users');
      setUsers(data || []);
    } catch (err) {
      console.error('fetchUsers:', err);
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const data = await apiRequest('/users/me');
      setMyProfile(data || null);
    } catch (err) {
      console.error('fetchMe:', err);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const list = await apiRequest('/users/roles');
      setRoles(list);
      if (!userForm.roleId && list[0]?.id) {
        setUserForm((f) => ({ ...f, roleId: list[0].id }));
      }
    } catch (err) {
      console.error('fetchRoles:', err);
    }
  }, [userForm.roleId]);

  const fetchDashboardSummary = useCallback(async () => {
    try {
      const data = await apiRequest('/dashboard/summary');
      setMyMatters(data.myMatters || []);
      setDeadlines(data.deadlines || []);
      setUpcomingHearings(data.upcomingHearings || []);
    } catch (err) {
      console.error('fetchDashboardSummary:', err);
    }
  }, []);

  const fetchMyMatters = useCallback(async () => {
    try {
      const matters = await apiRequest('/matters/my');
      setMyMatters(matters || []);
    } catch (err) {
      console.error('fetchMyMatters:', err);
    }
  }, []);

  const fetchMatters = useCallback(async () => {
    await fetchMyMatters();
  }, [fetchMyMatters]);

  const fetchDashboard = useCallback(async () => {
    await fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  useEffect(() => {
    fetchUsers();
    fetchMe();
    fetchRoles();
    fetchMyMatters();
    fetchDashboardSummary();
  }, [fetchUsers, fetchMe, fetchRoles, fetchMyMatters, fetchDashboardSummary]);

  useEffect(() => {
    if (!hearingForm.matterId && myMatters[0]?.id) {
      setHearingForm((f) => ({ ...f, matterId: myMatters[0].id }));
    }
  }, [myMatters, hearingForm.matterId]);

  async function handleCreateMatter(e) {
  e.preventDefault();

  try {
    await apiRequest('/matters', {
      method: 'POST',
      body: JSON.stringify({
        clientName: matterForm.clientName,
        matterTitle: matterForm.matterTitle,
        practiceArea: matterForm.practiceArea
      })
    });

    alert("Matter created successfully");

    // reload list
    fetchMatters();

  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to create matter");
  }
}

  const handleInviteUser = useCallback(async (e) => {
    e.preventDefault();
    setUserLoading(true);
    try {
      const data = await apiRequest('/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userForm.email,
          roleId: userForm.roleId,
        }),
      });
      setUserForm((f) => ({ ...f, email: '' }));
      alert(`Invite token: ${data.inviteToken}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUserLoading(false);
    }
  }, [userForm.email, userForm.roleId]);
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return h(Fragment, null,
    h(TopBar, { title: 'Dashboard', navigate, onCmdK },
      h('div', { className: 'flex items-center gap-3 ml-4' },
        h('span', { className: 'status-indicator live' },
          h('span', { className: 'dot' }),
          h('span', { style: { color: 'var(--emerald-700)', fontWeight: 650, fontSize: 10.5, letterSpacing: '0.06em' } }, 'LIVE')
        ),
        h('span', { className: 't-caption', style: { color: 'var(--graphite-400)' } }, 'Mon, 13 May 2026 \u00b7 09:12 IST')
      )
    ),
    h('div', { className: 'app-content' },
      h('div', { className: 'card anim-in stg-1', style: { marginBottom: 16 } },
        h('div', { className: 'card-header' },
          h('div', null,
            h('div', { className: 't-h3 text-navy-900' }, 'My Matters'),
            h('div', { className: 't-micro', style: { color: 'var(--graphite-500)' } }, `${myMatters.length} visible matters`)
          )
        ),
        h('div', { style: { padding: '0 14px 14px' } },
          myMatters.length === 0
            ? h(EmptyState, { icon: 'folder-open', title: 'No accessible matters', sub: 'Matters appear here when assigned/shared' })
            : myMatters.slice(0, 6).map((m) =>
              h('div', { key: m.id, className: 'activity-item' },
                h('div', { className: 'flex-1 min-w-0' },
                  h('div', { className: 't-caption truncate-1', style: { color: 'var(--graphite-800)', fontWeight: 600 } }, m.matterTitle || m.title),
                  h('div', { className: 't-micro', style: { color: 'var(--graphite-500)' } }, `${m.clientName || 'Client pending'} • Deadline: ${formatDate(m.nextDeadline)}`),
                  h('div', { className: 't-micro', style: { color: 'var(--graphite-500)' } }, `Hearing: ${formatDate(m.nextHearingDate)}`)
                )
              )
            )
        )
      ),

      // ======= Page Header =======
      h('div', { className: 'flex items-end justify-between mb-6 anim-in' },
        h('div', null,
          h('div', { className: 'page-eyebrow' }, 'Executive Dashboard'),
          h('h1', { className: 't-h1 text-navy-900 mb-1', style: { fontSize: '1.75rem', letterSpacing: '-0.032em', fontWeight: 680 } }, 'Good morning, ', (myProfile?.firstName || MOCK.user.name.split(' ')[0])),
          h('p', { className: 't-body', style: { color: 'var(--graphite-500)' } },
            "Today's posture \u2014 ",
            h('span', { style: { color: 'var(--red-600)', fontWeight: 600 } }, d.urgentMatters, ' urgent'),
            ', ',
            h('span', { style: { color: 'var(--amber-700)', fontWeight: 600 } }, d.overdueTasks, ' overdue'),
            ' \u00b7 ',
            h('span', { style: { color: 'var(--graphite-700)', fontWeight: 600 } }, 'Next hearing ', d.hearingNext)
          )
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'arrow-down-to-line', className: 'text-[10px]' }), 'Export brief'),
          h('button', { className: 'btn btn-primary btn-sm', onClick: () => openMatterModal() },
            h(Icon, { name: 'plus', className: 'text-[10px]' }), 'New matter'
          )
        )
      ),

      // ======= Stats row =======
      h('div', { className: 'dash-stats mb-6 anim-in stg-1' },
        h('div', { className: 'dash-stat stat-accent-red' },
          h('div', { className: 'flex items-center justify-between mb-2.5' },
            h('span', { className: 't-label' }, 'Urgent Matters'),
            h('div', { className: 'icon-tile-sm icon-tile-red' }, h(Icon, { name: 'triangle-exclamation' }))
          ),
          h('div', { className: 'flex items-baseline gap-2' },
            h('span', { className: 't-metric', style: { color: 'var(--red-700)' } }, d.urgentMatters),
            h('span', { className: 'delta delta-down' }, h(Icon, { name: 'arrow-up', className: 'text-[8px]' }), '+', d.urgentNew)
          ),
          h('div', { className: 't-caption mt-2', style: { color: 'var(--graphite-500)' } }, 'Requires immediate action')
        ),
        h('div', { className: 'dash-stat stat-accent-amber' },
          h('div', { className: 'flex items-center justify-between mb-2.5' },
            h('span', { className: 't-label' }, 'Overdue Tasks'),
            h('div', { className: 'icon-tile-sm icon-tile-amber' }, h(Icon, { name: 'clock-rotate-left' }))
          ),
          h('div', { className: 'flex items-baseline gap-2' },
            h('span', { className: 't-metric', style: { color: 'var(--amber-700)' } }, d.overdueTasks),
            h('span', { className: 'delta delta-down' }, d.overdueEsc, ' escalated')
          ),
          h('div', { className: 't-caption mt-2', style: { color: 'var(--graphite-500)' } }, 'Across ', d.overdueTasks - 3, ' active matters')
        ),
        h('div', { className: 'dash-stat stat-accent-blue' },
          h('div', { className: 'flex items-center justify-between mb-2.5' },
            h('span', { className: 't-label' }, 'Hearings Today'),
            h('div', { className: 'icon-tile-sm icon-tile-blue' }, h(Icon, { name: 'gavel' }))
          ),
          h('div', { className: 'flex items-baseline gap-2' },
            h('span', { className: 't-metric', style: { color: 'var(--navy-900)' } }, d.hearingsToday),
            h('span', { className: 't-caption font-semibold', style: { color: 'var(--blue-600)' } }, 'Next \u00b7 ', d.hearingNext)
          ),
          h('div', { className: 't-caption mt-2', style: { color: 'var(--graphite-500)' } }, '3 courts \u00b7 2 advocates')
        ),
        h('div', { className: 'dash-stat stat-accent-green' },
          h('div', { className: 'flex items-center justify-between mb-2.5' },
            h('span', { className: 't-label' }, 'Active Matters'),
            h('div', { className: 'icon-tile-sm icon-tile-emerald' }, h(Icon, { name: 'folder-open' }))
          ),
          h('div', { className: 'flex items-baseline gap-2' },
            h('span', { className: 't-metric', style: { color: 'var(--navy-900)' } }, d.activeCases),
            h('span', { className: 'delta delta-up' }, h(Icon, { name: 'arrow-up', className: 'text-[8px]' }), d.casesChange)
          ),
          h('div', { className: 't-caption mt-2', style: { color: 'var(--graphite-500)' } }, '7 practice areas')
        ),
        h('div', { className: 'dash-stat stat-accent-navy' },
          h('div', { className: 'flex items-center justify-between mb-2.5' },
            h('span', { className: 't-label' }, 'Billed \u00b7 MTD'),
            h('div', { className: 'icon-tile-sm icon-tile-navy' }, h(Icon, { name: 'indian-rupee-sign' }))
          ),
          h('div', { className: 'flex items-baseline gap-2' },
            h('span', { className: 't-metric', style: { color: 'var(--navy-900)' } }, d.billedMTD),
            h('span', { className: 'delta delta-up' }, h(Icon, { name: 'arrow-up', className: 'text-[8px]' }), d.billedChange)
          ),
          h('div', { className: 't-caption mt-2', style: { color: 'var(--graphite-500)' } }, '\u20b98.4L outstanding')
        )
      ),

      // Main Grid
      h('div', { className: 'dash-grid' },
        // LEFT COLUMN
        h('div', { className: 'dash-main' },
          // ======= Command Center Table =======
          h('div', { className: 'card anim-in stg-2' },
            h('div', { className: 'card-header' },
              h('div', { className: 'flex items-center gap-3' },
                h('div', { className: 'icon-tile-sm', style: { background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: 'white', boxShadow: '0 2px 6px rgba(217,119,6,0.25)' } },
                  h(Icon, { name: 'bolt' })
                ),
                h('div', null,
                  h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, 'Command Queue'),
                  h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, MOCK.commandItems.length, ' actions awaiting your decision')
                )
              ),
              h('div', { className: 'flex items-center gap-1.5' },
                h('button', { className: 'btn btn-ghost btn-sm' }, h(Icon, { name: 'filter', className: 'text-[10px]' }), 'Filter'),
                h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'arrow-up-right-from-square', className: 'text-[10px]' }), 'Open queue'),
                h('button', { className: 'btn btn-primary btn-sm', onClick: async () => {
                  const matterId = myMatters[0]?.id;
                  if (!matterId) return alert('No matter available');
                  const title = window.prompt('Task title');
                  if (!title) return;
                  const dueDate = window.prompt('Due date (YYYY-MM-DD)');
                  try {
                    await apiRequest('/tasks', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ matterId, title, dueDate: dueDate || undefined }),
                    });
                    fetchDashboardSummary();
                  } catch (err) { alert(err.message); }
                } }, h(Icon, { name: 'plus', className: 'text-[10px]' }), 'New task')
              )
            ),
            h('div', { className: 'overflow-x-auto' },
              h('table', { className: 'power-table' },
                h('thead', null,
                  h('tr', null,
                    h('th', { style: { width: 50 } }, 'P'),
                    h('th', null, 'Matter'),
                    h('th', null, 'Action Required'),
                    h('th', null, 'Deadline'),
                    h('th', null, 'SLA'),
                    h('th', null, 'Owner'),
                    h('th', null, 'Stage')
                  )
                ),
                h('tbody', null,
                  MOCK.commandItems.map(item =>
                    h('tr', { key: item.id, className: item.priority === 'p0' ? 'row-critical' : item.priority === 'p1' ? 'row-warning' : '', style: { cursor: 'pointer' }, onClick: () => navigate('/matters/detail') },
                      h('td', null, h(PriorityBadge, { level: item.priority })),
                      h('td', { className: 'cell-primary' },
                        h('div', null, item.matter),
                        h('div', { className: 'cell-sub' }, item.court)
                      ),
                      h('td', { className: 'font-medium text-navy-800' }, item.task),
                      h('td', null,
                        h('span', { className: `font-semibold ${item.deadline.includes('Today') ? 'text-red-600' : 'text-graphite-600'}` }, item.deadline)
                      ),
                      h('td', null, h(SLATimer, { value: item.sla })),
                      h('td', null,
                        h('div', { className: 'flex items-center gap-1.5' },
                          h(Avatar, { initials: item.owner, size: 'xs' }),
                          h('span', { className: 't-caption' }, item.ownerName)
                        )
                      ),
                      h('td', null, h('span', { className: 'badge badge-neutral' }, item.stage))
                    )
                  )
                )
              )
            )
          ),

          // ======= Hearings + Deadlines Row =======
          h('div', { className: 'dash-row-2 anim-in stg-3' },
            // Hearings
            h('div', { className: 'card' },
              h('div', { className: 'card-header' },
                h('div', { className: 'flex items-center gap-3' },
                  h('div', { className: 'icon-tile-sm icon-tile-blue' }, h(Icon, { name: 'gavel' })),
                  h('div', null,
                    h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, "Today's Hearings"),
                    h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, MOCK.todayHearings.length, ' sessions scheduled across 3 courts')
                  )
                ),
                h('button', { className: 'btn btn-ghost btn-xs' }, 'View all ', h(Icon, { name: 'arrow-right', className: 'text-[8px]' }))
              ),
              h('div', { style: { padding: '4px 16px 12px' } },
                MOCK.todayHearings.map((h2, i) =>
                  h('div', { key: i, className: 'hearing-item' },
                    h('div', { className: 'hearing-time' },
                      h('div', { className: 'hearing-time-value' }, h2.time.split(' ')[0]),
                      h('div', { className: 'hearing-time-period' }, h2.time.split(' ')[1])
                    ),
                    h('div', { className: 'flex-1 min-w-0' },
                      h('div', { className: 't-body font-semibold text-navy-900 truncate-1', style: { fontSize: 13, letterSpacing: '-0.01em' } }, h2.matter),
                      h('div', { className: 't-caption mt-0.5', style: { color: 'var(--graphite-500)' } }, h2.court, ' \u00b7 Room ', h2.room.replace('Room ', '')),
                      h('div', { className: 'flex items-center gap-2 mt-2' },
                        h('span', { className: 'badge badge-info' }, h2.type),
                        h('span', { className: 't-caption', style: { color: 'var(--graphite-500)' } },
                          h(Icon, { name: 'user-tie', className: 'text-[9px] mr-1' }), h2.advocate
                        )
                      )
                    ),
                    h('div', { className: 'flex-shrink-0' },
                      h(Icon, { name: 'chevron-right', className: 'text-[10px] text-graphite-300' })
                    )
                  )
                )
              )
            ),

            // Critical Deadlines
            h('div', { className: 'card' },
              h('div', { className: 'card-header' },
                h('div', { className: 'flex items-center gap-3' },
                  h('div', { className: 'icon-tile-sm icon-tile-red' }, h(Icon, { name: 'clock' })),
                  h('div', null,
                    h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, 'Critical Deadlines'),
                    h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, MOCK.criticalDeadlines.length, ' items due within 7 calendar days')
                  )
                ),
                h('span', { className: 'badge badge-critical' }, h(Icon, { name: 'bolt', className: 'text-[8px]' }), 'Urgent')
              ),
              h('div', { style: { padding: '4px 16px 12px' } },
                MOCK.criticalDeadlines.slice(0, 5).map((d2, i) =>
                  h('div', { key: i, className: 'deadline-item' },
                    h('div', { className: `deadline-marker sev-${d2.sev}` }),
                    h('div', { className: 'flex-1 min-w-0' },
                      h('div', { className: 't-body font-semibold text-navy-900 truncate-1', style: { fontSize: 13, letterSpacing: '-0.008em' } }, d2.title),
                      h('div', { className: 't-caption truncate-1 mt-0.5', style: { color: 'var(--graphite-500)' } }, d2.matter)
                    ),
                    h('div', { className: 'text-right flex-shrink-0 flex flex-col items-end gap-1' },
                      h('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '-0.005em', color: d2.sev === 'critical' ? 'var(--red-700)' : d2.sev === 'high' ? '#c2410c' : 'var(--graphite-600)' } }, d2.date),
                      h(SLATimer, { value: d2.sla })
                    )
                  )
                )
              )
            )
          ),

          // ======= AI + Risk Row =======
          h('div', { className: 'dash-row-2 anim-in stg-4' },
            // AI Recommendations â€” premium violet accent
            h('div', { className: 'ai-card' },
              h('div', { className: 'card-header' },
                h('div', { className: 'flex items-center gap-3' },
                  h('div', { className: 'icon-tile-sm icon-tile-gradient-violet' }, h(Icon, { name: 'wand-magic-sparkles' })),
                  h('div', null,
                    h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, 'Strategic Intelligence'),
                    h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, 'Signals detected across 142 active matters')
                  )
                ),
                h('span', { className: 'badge badge-purple' }, h(Icon, { name: 'sparkles', className: 'text-[8px]' }), 'Live')
              ),
              h('div', { style: { padding: '6px 18px 14px' } },
                MOCK.aiRecommendations.map((r, i) =>
                  h('div', { key: i, className: 'ai-rec-item' },
                    h('div', { className: `icon-tile-sm ${r.type === 'risk' ? 'icon-tile-red' : r.type === 'billing' ? 'icon-tile-amber' : 'icon-tile-blue'}` },
                      h(Icon, { name: r.icon })
                    ),
                    h('div', { className: 'flex-1 min-w-0' },
                      h('div', { className: 't-body-sm', style: { color: 'var(--graphite-800)', fontWeight: 500, lineHeight: 1.55, letterSpacing: '-0.005em' } }, r.text),
                      h('div', { className: 'flex items-center gap-2 mt-1.5' },
                        h('button', { className: 'btn btn-xs', style: { background: 'var(--violet-50)', color: 'var(--violet-700)', padding: '2px 8px', fontSize: 10.5 } }, 'Act'),
                        h('button', { className: 'btn btn-ghost btn-xs', style: { padding: '2px 6px', fontSize: 10.5, color: 'var(--graphite-500)' } }, 'Dismiss')
                      )
                    )
                  )
                )
              )
            ),
            // Matters at Risk
            h('div', { className: 'card' },
              h('div', { className: 'card-header' },
                h('div', { className: 'flex items-center gap-3' },
                  h('div', { className: 'icon-tile-sm icon-tile-red' }, h(Icon, { name: 'triangle-exclamation' })),
                  h('div', null,
                    h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, 'Risk Exposure Queue'),
                    h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, MOCK.mattersAtRisk.length, ' matters requiring senior intervention')
                  )
                ),
                h('button', { className: 'btn btn-ghost btn-xs', onClick: () => navigate('/matters') }, 'Review ', h(Icon, { name: 'arrow-right', className: 'text-[8px]' }))
              ),
              h('div', { style: { padding: '4px 16px 12px' } },
                MOCK.mattersAtRisk.map((m, i) =>
                  h('div', {
                    key: i,
                    className: 'flex items-center gap-3 py-2.5 cursor-pointer transition-all rounded-md -mx-1 px-1',
                    style: { borderBottom: '1px solid var(--border-subtle)' },
                    onClick: () => navigate('/matters/detail'),
                    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-1)',
                    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
                  },
                    h(HealthScore, { score: m.score, size: 36 }),
                    h('div', { className: 'flex-1 min-w-0' },
                      h('div', { className: 't-body font-semibold text-navy-900 truncate-1', style: { fontSize: 13, letterSpacing: '-0.008em' } }, m.name),
                      h('div', { className: 't-caption truncate-1 mt-0.5', style: { color: 'var(--graphite-500)' } }, m.reason)
                    ),
                    h('div', { className: 'flex items-center gap-1.5 flex-shrink-0' },
                      h(Avatar, { initials: m.owner, size: 'xs' }),
                      h(Icon, { name: 'chevron-right', className: 'text-[10px] text-graphite-300' })
                    )
                  )
                )
              )
            )
          )
        ),

        // ======= RIGHT COLUMN â€” Sidebar =======
        h('div', { className: 'dash-side' },
          // Pending Approvals
          h('div', { className: 'card anim-in stg-3' },
            h('div', { className: 'card-header' },
              h('div', { className: 'flex items-center gap-2.5' },
                h('div', { className: 'icon-tile-sm icon-tile-amber' }, h(Icon, { name: 'circle-check' })),
                h('div', null,
                  h('div', { className: 't-h4 text-navy-900' }, 'Pending Approvals'),
                  h('div', { className: 't-micro', style: { color: 'var(--graphite-500)', marginTop: 1 } }, '3 waiting')
                )
              ),
              h('span', { className: 'badge badge-high' }, '3')
            ),
            h('div', { style: { padding: '4px 14px 10px' } },
              MOCK.approvalsPending.map((a, i) =>
                h('div', { key: i, className: 'py-2.5', style: { borderBottom: i < MOCK.approvalsPending.length - 1 ? '1px solid var(--border-subtle)' : 'none' } },
                  h('div', { className: 'flex items-start gap-2 mb-1.5' },
                    h(PriorityBadge, { level: a.priority }),
                    h('div', { className: 'flex-1 min-w-0' },
                      h('div', { className: 't-body-sm font-semibold text-navy-900 truncate-1', style: { letterSpacing: '-0.005em' } }, a.title),
                      h('div', { className: 't-caption mt-0.5', style: { color: 'var(--graphite-500)' } }, a.type, ' \u00b7 ', a.from)
                    )
                  ),
                  h('div', { className: 'flex gap-1.5 mt-2' },
                    h('button', { className: 'btn btn-primary btn-xs flex-1 justify-center' }, h(Icon, { name: 'check', className: 'text-[9px]' }), 'Approve'),
                    h('button', { className: 'btn btn-secondary btn-xs flex-1 justify-center' }, 'Review')
                  )
                )
              )
            )
          ),

          // Team Workload (with utilization ring feel)
          h('div', { className: 'card anim-in stg-4' },
            h('div', { className: 'card-header' },
              h('div', { className: 'flex items-center gap-2.5' },
                h('div', { className: 'icon-tile-sm icon-tile-blue' }, h(Icon, { name: 'users' })),
                h('div', null,
                  h('div', { className: 't-h4 text-navy-900' }, 'Team Capacity'),
                  h('div', { className: 't-micro', style: { color: 'var(--graphite-500)', marginTop: 1 } }, 'Capacity \u00b7 ', Math.round(MOCK.teamLoad.reduce((s, t) => s + t.load, 0) / MOCK.teamLoad.length), '% avg')
                )
              )
            ),
            h('div', { style: { padding: '10px 14px 12px' } },
              MOCK.teamLoad.map((t, i) =>
                h('div', { key: i, className: 'teamload-row' },
                  h(Avatar, { initials: t.initials, size: 'xs' }),
                  h('div', { className: 'flex-1 min-w-0' },
                    h('div', { className: 'flex items-center justify-between mb-1' },
                      h('span', { className: 't-caption', style: { color: 'var(--graphite-800)', fontWeight: 550, letterSpacing: '-0.005em' } }, t.name),
                      h('span', { style: { fontSize: 10.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: t.load > 85 ? 'var(--red-700)' : t.load > 70 ? 'var(--amber-700)' : 'var(--emerald-700)' } }, t.load, '%')
                    ),
                    h(ProgressBar, { value: t.load, color: t.color, height: 4 })
                  )
                )
              )
            )
          ),

          // Revenue Snapshot â€” CFO-grade
          h('div', { className: 'revenue-card anim-in stg-5' },
            h('div', { className: 'card-header' },
              h('div', { className: 'flex items-center gap-2.5' },
                h('div', { className: 'icon-tile-sm icon-tile-emerald' }, h(Icon, { name: 'indian-rupee-sign' })),
                h('div', null,
                  h('div', { className: 't-h4 text-navy-900' }, 'Revenue'),
                  h('div', { className: 't-micro', style: { color: 'var(--graphite-500)', marginTop: 1 } }, 'May 2026 \u00b7 MTD')
                )
              ),
              h('span', { className: 'badge badge-success' }, MOCK.revenueSnapshot.collectedPct)
            ),
            h('div', { style: { padding: '16px' } },
              h('div', { className: 'ticker', style: { fontSize: 28, fontWeight: 750, letterSpacing: '-0.04em', color: 'var(--navy-900)', lineHeight: 1 } }, MOCK.revenueSnapshot.collected),
              h('div', { className: 't-caption mt-1', style: { color: 'var(--graphite-500)' } }, 'Collected of \u20b933.2L target'),
              h('div', { className: 'progress-bar mt-3 mb-4', style: { height: 5 } },
                h('div', { className: 'progress-fill', style: { width: MOCK.revenueSnapshot.collectedPct, background: 'linear-gradient(90deg, var(--emerald-500), var(--emerald-600))' } })
              ),
              h('div', { className: 'space-y-0' },
                h('div', { className: 'kv-row' },
                  h('span', { className: 'kv-label' }, 'Outstanding'),
                  h('span', { className: 'kv-value', style: { color: 'var(--amber-700)' } }, MOCK.revenueSnapshot.outstanding)
                ),
                h('div', { className: 'kv-row' },
                  h('span', { className: 'kv-label' }, 'Unbilled WIP'),
                  h('span', { className: 'kv-value' }, MOCK.revenueSnapshot.unbilled)
                ),
                h('div', { className: 'kv-row' },
                  h('span', { className: 'kv-label flex items-center gap-1', style: { color: 'var(--red-600)' } },
                    h(Icon, { name: 'triangle-exclamation', className: 'text-[9px]' }), 'Billing leakage'
                  ),
                  h('span', { className: 'kv-value', style: { color: 'var(--red-700)' } }, MOCK.revenueSnapshot.leakage)
                )
              ),
              h('button', { className: 'btn btn-secondary btn-sm w-full justify-center mt-4', onClick: () => navigate('/billing') },
                'Open billing', h(Icon, { name: 'arrow-right', className: 'text-[9px]' })
              )
            )
          ),

          // Activity Feed
          h('div', { className: 'card anim-in stg-6' },
            h('div', { className: 'card-header' },
              h('div', { className: 'flex items-center gap-2.5' },
                h('div', { className: 'icon-tile-sm icon-tile-grey' }, h(Icon, { name: 'wave-pulse' })),
                h('div', null,
                  h('div', { className: 't-h4 text-navy-900' }, 'Live Activity'),
                  h('div', { className: 't-micro', style: { color: 'var(--graphite-500)', marginTop: 1 } }, 'Across workspace')
                )
              ),
              h('span', { className: 'status-indicator live' }, h('span', { className: 'dot' }))
            ),
            h('div', { style: { padding: '6px 14px 12px', maxHeight: 240, overflowY: 'auto' } },
              MOCK.activityFeed.map((a, i) =>
                h('div', { key: i, className: 'activity-item' },
                  h('div', { style: { width: 24, height: 24, borderRadius: 6, background: a.color + '18', color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 } },
                    h(Icon, { name: a.icon, className: 'text-[10px]' })
                  ),
                  h('div', { className: 'flex-1 min-w-0' },
                    h('div', { className: 't-caption truncate-1', style: { color: 'var(--graphite-800)', fontWeight: 550, letterSpacing: '-0.005em' } }, a.title),
                    h('div', { className: 't-micro truncate-1 mt-0.5', style: { color: 'var(--graphite-400)' } }, a.detail)
                  ),
                  h('span', { className: 't-micro flex-shrink-0', style: { color: 'var(--graphite-400)' } }, a.time)
                )
              )
            )
          ),


          // â”€â”€ Users Management Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          h('div', { className: 'card anim-in stg-7', style: { marginTop: 16 } },
            h('div', { className: 'card-header' },
              h('div', { className: 'flex items-center gap-2.5' },
                h('div', { className: 'icon-tile-sm icon-tile-blue' }, h(Icon, { name: 'users' })),
                h('div', null,
                  h('div', { className: 't-h4 text-navy-900' }, 'Users'),
                  h('div', { className: 't-micro', style: { color: 'var(--graphite-500)', marginTop: 1 } }, users.length, ' member', users.length !== 1 ? 's' : '')
                )
              )
            ),

            // User list
            h('div', { style: { padding: '6px 14px 10px', maxHeight: 200, overflowY: 'auto' } },
              users.length === 0
                ? h(EmptyState, { icon: 'user-slash', title: 'No users yet', sub: 'Create the first user below' })
                : users.map((u, i) =>
                  h('div', { key: u.id || i, className: 'activity-item' },
                    h(Avatar, { initials: ((u.firstName || '?')[0] + (u.lastName || '?')[0]).toUpperCase(), size: 'xs' }),
                    h('div', { className: 'flex-1 min-w-0' },
                      h('div', { className: 't-caption truncate-1', style: { color: 'var(--graphite-800)', fontWeight: 550 } },
                        (u.firstName || '') + ' ' + (u.lastName || '')
                      ),
                      h('div', { className: 't-micro truncate-1 mt-0.5', style: { color: 'var(--graphite-400)' } }, u.email)
                    )
                  )
                )
            ),

            // Invite user form
            h('div', { style: { padding: '0 14px 14px', borderTop: '1px solid var(--border-subtle)' } },
              h('div', { className: 't-label-sm', style: { color: 'var(--graphite-500)', margin: '10px 0 8px', letterSpacing: '0.1em' } }, 'INVITE USER'),
              h('form', { onSubmit: handleInviteUser },
                h('input', {
                  className: 'input mb-2',
                  style: { fontSize: 12, padding: '6px 9px' },
                  type: 'email',
                  placeholder: 'Email',
                  value: userForm.email,
                  required: true,
                  onChange: e => setUserForm(f => ({ ...f, email: e.target.value }))
                }),
                h('select', {
                  className: 'input mb-3',
                  style: { fontSize: 12, padding: '6px 9px', width: '100%' },
                  value: userForm.roleId,
                  required: true,
                  onChange: e => setUserForm(f => ({ ...f, roleId: e.target.value })),
                }, roles.map((r) => h('option', { key: r.id, value: r.id }, r.name))),
                h('button', {
                  type: 'submit',
                  className: `btn btn-primary btn-sm w-full justify-center ${userLoading ? 'btn-loading' : ''}`,
                  disabled: userLoading
                },
                  h(Icon, { name: userLoading ? 'spinner' : 'user-plus', className: 'text-[10px]' }),
                  userLoading ? 'Sending...' : 'Send Invite'
                )
              )
            )
          )
          // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        )
      )
    )
  );
}

// ============================================
// PAGE: MATTERS LIST (Power Table)
// ============================================
function MattersPage({ navigate, onCmdK }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('priority');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [matters, setMatters] = useState([]);

  const fetchMatters = useCallback(async () => {
    try {
      const data = await apiRequest('/matters/my');
      setMatters((data || []).map((m, i) => ({
        id: m.id,
        name: m.matterTitle || m.title || 'Untitled matter',
        client: m.clientName || 'Client',
        court: m.court || '-',
        stage: m.status || 'OPEN',
        subStage: 'In Progress',
        nextAction: 'Review filings',
        nextDeadline: formatDate(m.nextDeadline),
        slaTimer: m.nextDeadline ? formatDate(m.nextDeadline) : 'N/A',
        healthScore: 70,
        riskScore: 30,
        owner: 'SC',
        ownerName: 'Sovereign Counsel',
        inactivityDays: 0,
        lastMovement: 'Live',
        practiceArea: m.practiceArea || 'General',
        priority: (m.priority || 'MEDIUM').toLowerCase() === 'high' ? 'p1' : 'p2',
      })));
    } catch (err) {
      console.error('fetchMatters', err);
    }
  }, []);

  useEffect(() => { fetchMatters(); }, [fetchMatters]);

  const filtered = useMemo(() => {
    let m = [...matters];
    if (filter === 'at-risk') m = m.filter(x => x.status === 'at-risk' || x.riskScore > 60);
    else if (filter === 'dormant') m = m.filter(x => x.inactivityDays > 30);
    else if (filter === 'urgent') m = m.filter(x => x.priority === 'p0' || x.priority === 'p1');
    else if (filter !== 'all') m = m.filter(x => x.status === filter);
    if (search) m = m.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.client.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'priority') m.sort((a, b) => a.priority.localeCompare(b.priority));
    else if (sort === 'deadline') m.sort((a, b) => a.nextDeadline.localeCompare(b.nextDeadline));
    else if (sort === 'risk') m.sort((a, b) => b.riskScore - a.riskScore);
    else if (sort === 'health') m.sort((a, b) => a.healthScore - b.healthScore);
    return m;
  }, [filter, sort, search, matters]);

  const toggleSelect = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };
  const toggleAll = () => {
    setSelected(s => s.length === filtered.length ? [] : filtered.map(m => m.id));
  };

  return h(Fragment, null,
    h(TopBar, { title: 'Matters', navigate, onCmdK },
      h('div', { className: 'flex items-center gap-2 ml-3' },
        h('span', { className: 'badge badge-neutral' }, matters.length, ' total'),
        h('span', { className: 'badge badge-critical' }, h(Icon, { name: 'triangle-exclamation', className: 'text-[8px]' }), matters.filter(x => x.priority === 'p0').length, ' P0')
      )
    ),
    h('div', { className: 'app-content' },
      // ======= Page Header =======
      h('div', { className: 'flex items-end justify-between mb-5 anim-in' },
        h('div', null,
          h('div', { className: 'page-eyebrow' }, 'Practice'),
          h('h1', { className: 't-h1 text-navy-900 mb-1', style: { fontSize: '1.75rem', letterSpacing: '-0.032em', fontWeight: 680 } }, 'Matters'),
          h('p', { className: 't-body', style: { color: 'var(--graphite-500)' } }, matters.length, ' active engagements across 7 practice areas.')
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'arrow-down-to-line', className: 'text-[10px]' }), 'Export'),
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'sliders', className: 'text-[10px]' }), 'Columns'),
          h('button', { className: 'btn btn-primary btn-sm', onClick: async () => {
            const matterTitle = window.prompt('Matter title');
            if (!matterTitle) return;
            const clientName = window.prompt('Client name') || '';
            try {
              await apiRequest('/matters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: matterTitle, matterTitle, clientName, practiceArea: 'General' }),
              });
              fetchMatters();
            } catch (err) { alert(err.message); }
          } }, h(Icon, { name: 'plus', className: 'text-[10px]' }), 'New matter')
        )
      ),

      // ======= Filters & Controls =======
      h('div', { className: 'matters-controls mb-3 anim-in stg-1' },
        h('div', { className: 'flex items-center gap-2 flex-1 flex-wrap' },
          ['all', 'urgent', 'active', 'at-risk', 'dormant'].map(f =>
            h(FilterChip, { key: f, label: f === 'all' ? 'All matters' : f === 'at-risk' ? 'At risk' : f.charAt(0).toUpperCase() + f.slice(1), active: filter === f, onClick: () => setFilter(f) })
          )
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('div', { className: 'search-bar', style: { width: 240 } },
            h(Icon, { name: 'magnifying-glass', className: 'text-[11px] text-graphite-400' }),
            h('input', { placeholder: 'Filter matters, clients, court\u2026', value: search, onChange: e => setSearch(e.target.value) })
          ),
          h('select', { className: 'input input-sm', style: { width: 150, fontSize: 11.5, fontWeight: 550 }, value: sort, onChange: e => setSort(e.target.value) },
            h('option', { value: 'priority' }, 'Sort: Priority'),
            h('option', { value: 'deadline' }, 'Sort: Deadline'),
            h('option', { value: 'risk' }, 'Sort: Risk Score'),
            h('option', { value: 'health' }, 'Sort: Health')
          )
        )
      ),

      // ======= Bulk Actions Bar =======
      selected.length > 0 && h('div', {
        className: 'flex items-center gap-2 mb-3 anim-fade',
        style: { padding: '10px 14px', background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: 'var(--r-xl)', border: '1px solid rgba(59,130,246,0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }
      },
        h('div', { className: 'flex items-center gap-2' },
          h('div', { style: { width: 24, height: 24, borderRadius: 6, background: 'var(--blue-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 } }, selected.length),
          h('span', { className: 't-caption font-semibold', style: { color: 'var(--blue-700)', letterSpacing: '-0.005em' } }, 'matter', selected.length !== 1 ? 's' : '', ' selected')
        ),
        h('div', { className: 'divider-v' }),
        h('button', { className: 'btn btn-secondary btn-xs' }, h(Icon, { name: 'user-plus', className: 'text-[9px]' }), 'Assign'),
        h('button', { className: 'btn btn-secondary btn-xs', onClick: async () => {
          if (!selected[0]) return;
          const status = window.prompt('New status (OPEN, ON_HOLD, CLOSED, ARCHIVED)');
          if (!status) return;
          try {
            await apiRequest(`/matters/${selected[0]}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status }),
            });
            fetchMatters();
          } catch (err) { alert(err.message); }
        } }, h(Icon, { name: 'arrow-up-right-from-square', className: 'text-[9px]' }), 'Update stage'),
        h('button', { className: 'btn btn-secondary btn-xs' }, h(Icon, { name: 'arrow-down-to-line', className: 'text-[9px]' }), 'Export'),
        h('button', { className: 'btn btn-danger btn-xs' }, h(Icon, { name: 'box-archive', className: 'text-[9px]' }), 'Archive'),
        h('div', { className: 'flex-1' }),
        h('button', { className: 'btn btn-ghost btn-xs', onClick: () => setSelected([]) }, 'Clear')
      ),

      // Power Table
      h('div', { className: 'card anim-in stg-1' },
        h('div', { className: 'overflow-x-auto' },
          h('table', { className: 'power-table' },
            h('thead', null,
              h('tr', null,
                h('th', { className: 'col-check' }, h('input', { type: 'checkbox', checked: selected.length === filtered.length && filtered.length > 0, onChange: toggleAll })),
                h('th', { style: { width: 45 } }, 'P'),
                h('th', null, 'Matter ID'),
                h('th', { style: { minWidth: 200 } }, 'Case Name'),
                h('th', null, 'Client'),
                h('th', null, 'Court'),
                h('th', null, 'Stage'),
                h('th', null, 'Next Action'),
                h('th', null, 'Deadline'),
                h('th', null, 'SLA'),
                h('th', null, 'Health'),
                h('th', null, 'Risk'),
                h('th', null, 'Owner'),
                h('th', null, 'Last Activity')
              )
            ),
            h('tbody', null,
              filtered.map(m =>
                h('tr', { key: m.id, className: `${selected.includes(m.id) ? 'selected' : ''} ${m.priority === 'p0' ? 'row-critical' : m.status === 'at-risk' ? 'row-warning' : ''}`, style: { cursor: 'pointer' }, onClick: (e) => { if (!e.target.closest('input')) navigate('/matters/detail'); } },
                  h('td', { className: 'col-check', onClick: e => e.stopPropagation() },
                    h('input', { type: 'checkbox', checked: selected.includes(m.id), onChange: () => toggleSelect(m.id) })
                  ),
                  h('td', null, h(PriorityBadge, { level: m.priority })),
                  h('td', { className: 'cell-mono' }, m.id),
                  h('td', { className: 'cell-primary' },
                    h('div', { className: 'truncate-1', style: { maxWidth: 220 } }, m.name),
                    h('div', { className: 'cell-sub' }, m.practiceArea)
                  ),
                  h('td', null, h('span', { className: 't-caption text-graphite-600' }, m.client)),
                  h('td', null, h('span', { className: 't-caption text-graphite-500' }, m.court)),
                  h('td', null,
                    h('div', null,
                      h('span', { className: 'badge badge-info', style: { fontSize: 9 } }, m.stage),
                      h('div', { className: 't-caption text-graphite-400 mt-0.5' }, m.subStage)
                    )
                  ),
                  h('td', null, h('span', { className: 't-caption font-medium text-navy-800' }, m.nextAction)),
                  h('td', null, h('span', { className: `t-caption font-semibold ${m.nextDeadline.includes('13 May') ? 'text-red-600' : 'text-graphite-600'}` }, m.nextDeadline)),
                  h('td', null, h(SLATimer, { value: m.slaTimer })),
                  h('td', null, h(HealthScore, { score: m.healthScore, size: 28 })),
                  h('td', null,
                    h('span', { className: `t-caption font-bold ${m.riskScore > 60 ? 'text-red-600' : m.riskScore > 40 ? 'text-amber-600' : 'text-emerald-600'}` }, m.riskScore)
                  ),
                  h('td', null,
                    h('div', { className: 'flex items-center gap-1.5' },
                      h(Avatar, { initials: m.owner, size: 'xs' }),
                      h('span', { className: 't-caption' }, m.ownerName.replace('Adv. ', ''))
                    )
                  ),
                  h('td', null, h('span', { className: `t-caption ${m.inactivityDays > 30 ? 'text-red-500 font-bold' : 'text-graphite-400'}` }, m.lastMovement))
                )
              )
            )
          )
        ),
        h('div', { className: 'card-footer flex items-center justify-between' },
          h('span', { className: 't-caption text-graphite-400' }, 'Showing ', filtered.length, ' of ', matters.length, ' matters'),
          h('div', { className: 'flex items-center gap-1' },
            h('button', { className: 'btn btn-ghost btn-xs' }, 'â† Prev'),
            h('span', { className: 'badge badge-neutral' }, '1'),
            h('button', { className: 'btn btn-ghost btn-xs' }, 'Next â†’')
          )
        )
      )
    )
  );
}

// ============================================
// PAGE: MATTER DETAIL
// ============================================
function MatterDetailPage({ navigate, onCmdK }) {
  const m = MOCK.matterDetail;
  const [activeTab, setActiveTab] = useState('timeline');

  return h(Fragment, null,
    h(TopBar, { navigate, onCmdK },
      h('div', { className: 'flex items-center gap-2 ml-2' },
        h('button', { className: 'btn btn-ghost btn-xs', onClick: () => navigate('/matters') },
          h(Icon, { name: 'arrow-left', className: 'text-[9px]' }), 'Matters'
        ),
        h('span', { className: 'text-graphite-200' }, '/'),
        h('span', { className: 't-caption font-semibold text-navy-900' }, m.id),
        h(PriorityBadge, { level: 'p0' }),
        h(SLATimer, { value: m.slaTimer })
      )
    ),
    h('div', { className: 'app-content' },
      // ======= Matter Hero (flagship) =======
      h('div', { className: 'matter-hero anim-in' },
        h('div', { style: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' } },
          h('div', { className: 'min-w-0 flex-1', style: { maxWidth: '72%' } },
            h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10.5, fontWeight: 620, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 10 } },
              h('span', { style: { width: 14, height: 1, background: 'rgba(255,255,255,0.25)' } }),
              'Matter \u00b7 ', m.id
            ),
            h('h1', { style: { fontSize: '1.875rem', letterSpacing: '-0.034em', fontWeight: 680, lineHeight: 1.15, color: '#ffffff', marginBottom: 12 } }, m.name),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', color: 'rgba(255,255,255,0.72)', fontSize: 12.5, fontWeight: 500 } },
              h('span', { style: { color: '#ffffff', fontWeight: 600 } }, m.client),
              h('span', { style: { color: 'rgba(255,255,255,0.3)' } }, '\u00b7'),
              h('span', null, m.court),
              h('span', { style: { color: 'rgba(255,255,255,0.3)' } }, '\u00b7'),
              h('span', null, "Hon'ble ", m.judge),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 } },
                m.tags.map(t => h('span', { key: t, style: { display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px', fontSize: 10.5, fontWeight: 580, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, letterSpacing: '-0.003em' } }, t))
              )
            ),
            // Hero metrics row
            h('div', { style: { display: 'flex', gap: 32, marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' } },
              [
                ['Amount at Stake', m.amountAtStake, '#60a5fa'],
                ['Stage', `${m.stage} \u2192 ${m.subStage}`, '#a78bfa'],
                ['Progress', `${m.stageProgress}%`, '#34d399'],
                ['Status', m.status, '#fbbf24'],
              ].map(([label, value, dot], i) =>
                h('div', { key: i },
                  h('div', { style: { fontSize: 9.5, fontWeight: 620, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 } },
                    h('span', { style: { width: 5, height: 5, borderRadius: 999, background: dot, boxShadow: `0 0 8px ${dot}80` } }),
                    label
                  ),
                  h('div', { style: { fontSize: 14, fontWeight: 620, letterSpacing: '-0.012em', color: '#ffffff', fontVariantNumeric: 'tabular-nums' } }, value)
                )
              )
            )
          ),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative', zIndex: 2 } },
            h('button', { className: 'btn-icon', style: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.1)' } }, h(Icon, { name: 'share-nodes', className: 'text-[13px]' })),
            h('button', { className: 'btn-icon', style: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.1)' } }, h(Icon, { name: 'bell', className: 'text-[13px]' })),
            h('button', { className: 'btn btn-sm', style: { background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' } }, h(Icon, { name: 'pen-to-square', className: 'text-[10px]' }), 'Edit'),
            h('button', { className: 'btn btn-sm', style: { background: '#ffffff', color: '#0b1220', fontWeight: 620 } }, h(Icon, { name: 'plus', className: 'text-[10px]' }), 'Add task')
          )
        )
      ),

      // 3-Column Layout
      h('div', { className: 'matter-layout anim-in stg-1' },
        // LEFT: Case Metadata
        h('div', { className: 'matter-left' },
          // Case Info
          h('div', { className: 'card' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Case Information')
            ),
            h('div', { className: 'card-body-dense space-y-2.5' },
              [
                ['Client', m.client],
                ['Contact', m.clientContact],
                ['Court', m.court],
                ['Court Room', m.courtRoom],
                ['Judge', m.judge],
                ['Jurisdiction', m.jurisdiction],
                ['Filing No.', m.filingNumber],
                ['Practice Area', m.practiceArea],
                ['Amount at Stake', m.amountAtStake],
                ['Opposing Counsel', m.opposingCounsel],
                ['Status', m.status],
                ['Billing', m.billingStatus],
              ].map(([label, value]) =>
                h('div', { key: label },
                  h('div', { className: 't-label text-graphite-400 mb-0.5' }, label),
                  h('div', { className: 't-caption font-semibold text-navy-900' }, value)
                )
              )
            )
          ),
          // Stage Progress
          h('div', { className: 'card' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Stage Progress')
            ),
            h('div', { className: 'card-body-dense' },
              h('div', { className: 'flex items-center justify-between mb-1' },
                h('span', { className: 't-caption font-semibold text-navy-800' }, m.stage, ' â†’ ', m.subStage),
                h('span', { className: 't-caption font-bold text-blue-600' }, m.stageProgress, '%')
              ),
              h(ProgressBar, { value: m.stageProgress, color: '#3b82f6', height: 5 })
            )
          ),
          // Team
          h('div', { className: 'card' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Team'),
              h('span', { className: 'badge badge-neutral', style: { fontSize: 9 } }, m.team.length)
            ),
            h('div', { className: 'card-body-dense' },
              m.team.map((t, i) =>
                h('div', { key: i, className: 'flex items-center gap-2 py-1.5' },
                  h(Avatar, { initials: t.initials, color: t.color, size: 'sm', online: t.online }),
                  h('div', { className: 'flex-1' },
                    h('div', { className: 't-caption font-semibold text-navy-900' }, t.name),
                    h('div', { className: 't-caption text-graphite-400' }, t.role)
                  )
                )
              )
            )
          )
        ),

        // CENTER: Tabs
        h('div', { className: 'matter-center' },
          h(TabNav, {
            tabs: [
              { id: 'timeline', label: 'Timeline', count: m.timeline.length },
              { id: 'tasks', label: 'Tasks', count: m.tasks.length },
              { id: 'documents', label: 'Documents', count: m.documents.length },
              { id: 'notes', label: 'Notes', count: m.notes.length },
            ],
            active: activeTab, onChange: setActiveTab
          }),
          h('div', { className: 'mt-3' },
            // Timeline
            activeTab === 'timeline' && h('div', { className: 'timeline' },
              m.timeline.map((ev, i) =>
                h('div', { key: ev.id, className: 'timeline-item' },
                  h('div', { className: `timeline-dot dot-${ev.dotColor}` },
                    h(Icon, { name: ev.type === 'filing' ? 'file-arrow-up' : ev.type === 'hearing' ? 'calendar' : ev.type === 'client' ? 'envelope' : ev.type === 'task' ? 'check' : ev.type === 'billing' ? 'indian-rupee-sign' : ev.type === 'approval' ? 'circle-check' : ev.type === 'evidence' ? 'folder' : 'circle-info' })
                  ),
                  h('div', null,
                    h('div', { className: 'flex items-center gap-2 mb-0.5' },
                      h('span', { className: 't-body font-semibold text-navy-900' }, ev.title),
                      h('span', { className: 't-caption text-graphite-300' }, ev.time)
                    ),
                    h('div', { className: 't-body-sm text-graphite-500 leading-relaxed' }, ev.detail),
                    h('div', { className: 't-caption text-graphite-400 mt-1' }, 'by ', ev.user)
                  )
                )
              )
            ),
            // Tasks
            activeTab === 'tasks' && h('div', { className: 'space-y-2' },
              m.tasks.map(t =>
                h('div', { key: t.id, className: 'card-compact flex items-start gap-3' },
                  h('input', { type: 'checkbox', className: 'mt-1 accent-navy-900', style: { width: 14, height: 14 } }),
                  h('div', { className: 'flex-1' },
                    h('div', { className: 'flex items-center gap-2' },
                      h(PriorityBadge, { level: t.priority }),
                      h('span', { className: 't-body font-semibold text-navy-900' }, t.title)
                    ),
                    h('div', { className: 'flex items-center gap-3 mt-1' },
                      h('span', { className: 'flex items-center gap-1 t-caption text-graphite-400' },
                        h(Avatar, { initials: t.assigneeInit, size: 'xs' }), t.assignee),
                      h('span', { className: `t-caption font-semibold ${t.due.includes('Today') ? 'text-red-600' : 'text-graphite-500'}` }, t.due),
                      h('span', { className: `badge badge-${t.status === 'in-progress' ? 'info' : t.status === 'waiting' ? 'medium' : 'neutral'}`, style: { fontSize: 9 } }, t.status)
                    )
                  )
                )
              )
            ),
            // Documents
            activeTab === 'documents' && h('div', { className: 'space-y-2' },
              m.documents.map(d =>
                h('div', { key: d.id, className: `card-compact flex items-center gap-3 ${d.needsAction ? 'border-l-2 border-l-amber-400' : ''}` },
                  h(Icon, { name: d.type === 'pdf' ? 'file-pdf' : d.type === 'word' ? 'file-word' : 'file-excel', className: `text-lg ${d.type === 'pdf' ? 'text-red-400' : d.type === 'word' ? 'text-blue-400' : 'text-emerald-400'}` }),
                  h('div', { className: 'flex-1 min-w-0' },
                    h('div', { className: 't-body font-semibold text-navy-900 truncate-1' }, d.name),
                    h('div', { className: 't-caption text-graphite-400' }, d.date, ' â€¢ ', d.size, ' â€¢ ', d.version)
                  ),
                  h(Badge, { type: d.status === 'Draft' ? 'medium' : d.status === 'In Review' ? 'info' : d.status === 'Pending Signature' ? 'high' : 'success' }, d.status),
                  h(Avatar, { initials: d.owner, size: 'xs' })
                )
              )
            ),
            // Notes
            activeTab === 'notes' && h('div', { className: 'space-y-3' },
              m.notes.map(n =>
                h('div', { key: n.id, className: 'card-compact' },
                  h('div', { className: 'flex items-center gap-2 mb-1.5' },
                    h('span', { className: 'badge', style: { background: n.tagColor + '15', color: n.tagColor, fontSize: 9 } }, n.tag),
                    h('span', { className: 't-body font-semibold text-navy-900' }, n.title)
                  ),
                  h('div', { className: 't-body-sm text-graphite-600 leading-relaxed mb-2' }, n.content),
                  h('div', { className: 'flex items-center justify-between' },
                    h('span', { className: 't-caption text-graphite-400' }, n.author),
                    h('span', { className: 't-caption text-graphite-300' }, n.time)
                  )
                )
              )
            )
          )
        ),

        // RIGHT: Risk & Intelligence
        h('div', { className: 'matter-right' },
          // Health + Risk
          h('div', { className: 'card' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Case Intelligence')
            ),
            h('div', { className: 'card-body-dense' },
              h('div', { className: 'flex items-center justify-around mb-3' },
                h('div', { className: 'text-center' },
                  h(HealthScore, { score: m.healthScore, size: 52 }),
                  h('div', { className: 't-caption text-graphite-400 mt-1' }, 'Health')
                ),
                h('div', { className: 'text-center' },
                  h('div', { className: `t-metric-sm ${m.riskScore > 60 ? 'text-red-600' : m.riskScore > 40 ? 'text-amber-600' : 'text-emerald-600'}` }, m.riskScore),
                  h('div', { className: 't-caption text-graphite-400 mt-1' }, 'Risk Score')
                ),
                h('div', { className: 'text-center' },
                  h('div', { className: 't-metric-sm text-blue-600' }, m.probability, '%'),
                  h('div', { className: 't-caption text-graphite-400 mt-1' }, 'Win Prob.')
                )
              ),
              h('div', { className: 'border-t pt-2 mt-1', style: { borderColor: 'var(--surface-3)' } },
                h(SectionTitle, { title: 'Risk Flags' }),
                m.riskFlags.map((r, i) =>
                  h('div', { key: i, className: 'flex items-start gap-2 py-1' },
                    h(Icon, { name: 'triangle-exclamation', className: `text-[9px] mt-0.5 ${r.severity === 'high' ? 'text-red-500' : r.severity === 'medium' ? 'text-amber-500' : 'text-gray-400'}` }),
                    h('span', { className: 't-caption text-graphite-600' }, r.text)
                  )
                )
              )
            )
          ),

          // Next Hearing
          h('div', { className: 'card' },
            h('div', { className: 'card-header' },
              h(Icon, { name: 'gavel', className: 'text-blue-500 text-[10px]' }),
              h('span', { className: 't-h4 text-navy-900' }, 'Next Hearing')
            ),
            h('div', { className: 'card-body-dense' },
              h('div', { className: 't-h3 text-navy-900 mb-0.5' }, m.nextHearing.date),
              h('div', { className: 't-caption text-blue-600 font-bold mb-2' }, m.nextHearing.time, ' â€¢ ', m.nextHearing.type),
              h('div', { className: 'space-y-1' },
                h('div', { className: 't-caption text-graphite-500' }, m.nextHearing.court),
                h('div', { className: 't-caption text-graphite-500' }, m.nextHearing.room),
                h('div', { className: 't-caption text-graphite-500' }, m.nextHearing.judge)
              )
            )
          ),

          // Upcoming Deadlines
          h('div', { className: 'card' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Deadlines'),
              h('span', { className: 'badge badge-critical', style: { fontSize: 9 } }, m.deadlines.filter(d => d.urgent).length, ' urgent')
            ),
            h('div', { className: 'card-body-dense' },
              m.deadlines.map((d, i) =>
                h('div', { key: i, className: 'flex items-center gap-2 py-1.5 border-b last:border-0', style: { borderColor: 'var(--surface-3)' } },
                  h('div', { className: `w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${d.urgent ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-graphite-500'}` },
                    h('span', { className: 't-caption font-bold' }, d.date.split(' ')[0])
                  ),
                  h('div', { className: 'flex-1' },
                    h('div', { className: 't-caption font-semibold text-navy-900' }, d.title),
                    h(SLATimer, { value: d.sla })
                  )
                )
              )
            )
          ),

          // Billing Summary
          h('div', { className: 'card' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Billing')
            ),
            h('div', { className: 'card-body-dense space-y-2' },
              [
                ['Total Billed', m.billing.totalBilled, 'text-navy-900'],
                ['Monthly Fees', m.billing.monthlyFees, 'text-navy-800'],
                ['Unbilled', m.billing.unbilled, 'text-amber-600'],
                ['Write-offs', m.billing.writeOffs, 'text-red-500'],
              ].map(([label, val, cls]) =>
                h('div', { key: label, className: 'flex items-center justify-between' },
                  h('span', { className: 't-caption text-graphite-500' }, label),
                  h('span', { className: `t-caption font-bold ${cls}` }, val)
                )
              ),
              h('div', { className: 'border-t pt-2 mt-1', style: { borderColor: 'var(--surface-3)' } },
                h('div', { className: 'flex items-center justify-between mb-1' },
                  h('span', { className: 't-caption text-graphite-500' }, 'Retainer Usage'),
                  h('span', { className: 't-caption font-bold text-navy-900' }, m.billing.retainerUsed, '%')
                ),
                h(ProgressBar, { value: m.billing.retainerUsed, color: m.billing.retainerUsed > 80 ? '#dc2626' : '#3b82f6', height: 4 })
              )
            )
          )
        )
      )
    )
  );
}

// ============================================
// PAGE: DOCUMENTS
// ============================================
function DocumentsPage({ navigate, onCmdK }) {
  const [tab, setTab] = useState('all');
  const [docs, setDocs] = useState([]);
  const [matters, setMatters] = useState([]);

  const fetchDocuments = useCallback(async (matterId) => {
    const data = await apiRequest(`/documents${matterId ? `?matterId=${matterId}` : ''}`);
    setDocs(data || []);
  }, []);

  useEffect(() => {
    (async () => {
      const myMatters = await apiRequest('/matters/my');
      setMatters(myMatters || []);
      await fetchDocuments(myMatters?.[0]?.id);
    })().catch((err) => console.error(err));
  }, [fetchDocuments]);

  return h(Fragment, null,
    h(TopBar, { title: 'Documents', navigate, onCmdK },
      h('div', { className: 'flex items-center gap-2 ml-3' },
        h('span', { className: 'badge badge-purple' }, h(Icon, { name: 'sparkles', className: 'text-[8px]' }), 'AI indexed')
      )
    ),
    h('div', { className: 'app-content' },
      // ======= Page Header =======
      h('div', { className: 'flex items-end justify-between mb-5 anim-in' },
        h('div', null,
          h('div', { className: 'page-eyebrow' }, 'Document Vault'),
          h('h1', { className: 't-h1 text-navy-900 mb-1', style: { fontSize: '1.75rem', letterSpacing: '-0.032em', fontWeight: 680 } }, 'Documents'),
          h('p', { className: 't-body', style: { color: 'var(--graphite-500)' } }, docs.length, ' files under management.')
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'code-compare', className: 'text-[10px]' }), 'Compare'),
          h('button', { className: 'btn btn-violet btn-sm' }, h(Icon, { name: 'wand-magic-sparkles', className: 'text-[10px]' }), 'AI summarise'),
          h('button', { className: 'btn btn-primary btn-sm', onClick: async () => {
            const matterId = matters[0]?.id;
            if (!matterId) return alert('No matter available');
            const fileName = window.prompt('File name');
            if (!fileName) return;
            try {
              await apiRequest('/documents/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  matterId,
                  title: fileName,
                  fileName,
                  mimeType: 'application/pdf',
                  sizeBytes: 1,
                  storageKey: `placeholder/${Date.now()}-${fileName}`,
                }),
              });
              await fetchDocuments(matterId);
            } catch (err) { alert(err.message); }
          } }, h(Icon, { name: 'cloud-arrow-up', className: 'text-[10px]' }), 'Upload')
        )
      ),

      // ======= Stats =======
      h('div', { className: 'grid grid-cols-4 gap-3 mb-5 anim-in stg-1' },
        [
          ['Total files', docs.length, 'folder', 'blue'],
          ['Drafts pending', 0, 'pen-to-square', 'amber'],
          ['Awaiting signature', 0, 'file-signature', 'violet'],
          ['Overdue', 0, 'circle-exclamation', 'red'],
        ].map(([label, value, icon, tone], i) =>
          h('div', { key: i, className: 'card-compact flex items-center gap-3' },
            h('div', { className: `icon-tile icon-tile-${tone === 'red' ? 'red' : tone === 'amber' ? 'amber' : tone === 'violet' ? 'violet' : 'blue'}` },
              h(Icon, { name: icon })
            ),
            h('div', null,
              h('div', { className: 't-label mb-0.5' }, label),
              h('div', { className: 't-metric-sm', style: { color: 'var(--navy-900)' } }, value)
            )
          )
        )
      ),

      h('div', { className: 'doc-layout' },
        // Main Area
        h('div', null,
          // Action Required
          h('div', { className: 'card mb-4 anim-in stg-1' },
            h('div', { className: 'card-header' },
              h('div', { className: 'flex items-center gap-2' },
                h(Icon, { name: 'circle-exclamation', className: 'text-amber-500 text-[11px]' }),
                h('span', { className: 't-h4 text-navy-900' }, 'Requires Action'),
                h('span', { className: 'badge badge-high', style: { fontSize: 9 } }, 0)
              )
            ),
            h('div', { className: 'card-body-dense' },
              [].map((d, i) =>
                h('div', { key: i, className: 'flex items-center gap-3 py-2 border-b last:border-0', style: { borderColor: 'var(--surface-3)' } },
                  h('i', { className: `fa-solid ${d.icon} text-lg text-amber-400` }),
                  h('div', { className: 'flex-1' },
                    h('div', { className: 't-body font-semibold text-navy-900' }, d.name),
                    h('div', { className: 't-caption text-graphite-400' }, d.detail)
                  ),
                  h(Badge, { type: d.severity }, d.badge),
                  h('button', { className: 'btn btn-secondary btn-xs' }, 'Open')
                )
              )
            )
          ),

          // Document Library Table
          h('div', { className: 'card anim-in stg-2' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Document Library'),
              h('div', { className: 'search-bar', style: { width: 180 } },
                h(Icon, { name: 'magnifying-glass', className: 'text-[10px] text-graphite-300' }),
                h('input', { placeholder: 'Search files...', className: 't-body-sm', style: { border: 'none', outline: 'none', background: 'transparent', flex: 1 } })
              )
            ),
            h('div', { className: 'overflow-x-auto' },
              h('table', { className: 'power-table' },
                h('thead', null,
                  h('tr', null,
                    h('th', null, 'File Name'),
                    h('th', null, 'Matter'),
                    h('th', null, 'Owner'),
                    h('th', null, 'Updated'),
                    h('th', null, 'Stage'),
                    h('th', null, 'Version'),
                    h('th', null, 'Size')
                  )
                ),
                h('tbody', null,
                  docs.map(d =>
                    h('tr', { key: d.id, style: { cursor: 'pointer' } },
                      h('td', { className: 'cell-primary' },
                        h('div', { className: 'flex items-center gap-2' },
                          h(Icon, { name: 'file-pdf', className: 'text-red-400' }),
                          d.fileName
                        )
                      ),
                      h('td', null, h('span', { className: 't-caption text-graphite-500' }, d.matterId)),
                      h('td', null,
                        h('div', { className: 'flex items-center gap-1.5' },
                          h(Avatar, { initials: 'SC', size: 'xs' }),
                          h('span', { className: 't-caption' }, 'Sovereign Counsel')
                        )
                      ),
                      h('td', null, h('span', { className: 't-caption text-graphite-500' }, formatDate(d.createdAt))),
                      h('td', null, h(Badge, { type: 'info' }, 'Uploaded')),
                      h('td', null, h('span', { className: 't-caption font-mono text-graphite-500' }, 'v1')),
                      h('td', null, h('span', { className: 't-caption text-graphite-400' }, `${d.sizeBytes || 0}`))
                    )
                  )
                )
              )
            )
          )
        ),

        // Right Sidebar - Version History + Preview
        h('div', null,
          h('div', { className: 'card anim-in stg-3' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Version History')
            ),
            h('div', { className: 'card-body-dense' },
              MOCK.versionHistory.map((v, i) =>
                h('div', { key: i, className: `flex items-start gap-2 py-2 border-b last:border-0 ${v.active ? 'bg-blue-50 -mx-3 px-3 rounded' : ''}`, style: { borderColor: 'var(--surface-3)' } },
                  h('div', { className: `badge ${v.active ? 'badge-info' : 'badge-neutral'}`, style: { fontSize: 9, flexShrink: 0, marginTop: 2 } }, v.version),
                  h('div', { className: 'flex-1' },
                    h('div', { className: 't-caption font-semibold text-navy-900' }, v.time),
                    h('div', { className: 't-caption text-graphite-400' }, v.detail)
                  ),
                  v.active && h('span', { className: 'badge badge-success', style: { fontSize: 8 } }, 'Active')
                )
              )
            )
          ),
          // Premium Upload Zone
          h('div', { className: 'doc-upload-zone mt-3 anim-in stg-4' },
            h('div', { className: 'doc-upload-zone-icon' },
              h(Icon, { name: 'cloud-arrow-up' })
            ),
            h('div', { className: 't-h4 text-navy-900 mb-1', style: { fontSize: 13.5 } }, 'Drop files here'),
            h('div', { className: 't-caption mb-4', style: { color: 'var(--graphite-500)' } }, 'PDF, DOCX, XLSX up to 50MB \u00b7 Auto-indexed by AI'),
            h('button', { className: 'btn btn-primary btn-sm' },
              h(Icon, { name: 'folder-open', className: 'text-[10px]' }), 'Browse files'
            ),
            h('div', { className: 'flex items-center justify-center gap-3 mt-4 pt-4', style: { borderTop: '1px solid var(--border-subtle)' } },
              h('span', { className: 't-caption flex items-center gap-1', style: { color: 'var(--graphite-500)' } },
                h(Icon, { name: 'shield-check', className: 'text-[10px] text-emerald-500' }), 'End-to-end encrypted'
              )
            )
          )
        )
      )
    )
  );
}

// ============================================
// PAGE: BILLING
// ============================================
function BillingPage({ navigate, onCmdK }) {
  const [billing, setBilling] = useState({ outstanding: 0, paid: 0, invoices: [], entries: [] });
  const b = {
    collected: `₹${Number(billing.paid || 0).toFixed(2)}`,
    outstanding: `₹${Number(billing.outstanding || 0).toFixed(2)}`,
    unbilled: `₹${Number((billing.entries || []).reduce((s, e) => s + Number(e.amount || 0), 0)).toFixed(2)}`,
    writeOff: '₹0',
    collectedPct: '',
  };

  useEffect(() => {
    apiRequest('/billing/summary').then((data) => setBilling(data || { outstanding: 0, paid: 0, invoices: [], entries: [] })).catch((err) => console.error(err));
  }, []);

  return h(Fragment, null,
    h(TopBar, { title: 'Billing & Revenue', navigate, onCmdK },
      h('div', { className: 'flex items-center gap-2 ml-3' },
        h('span', { className: 'status-indicator live' }, h('span', { className: 'dot' }), h('span', { style: { color: 'var(--emerald-700)', fontWeight: 650, fontSize: 10.5 } }, 'May 2026 cycle'))
      )
    ),
    h('div', { className: 'app-content' },
      // ======= Page Header =======
      h('div', { className: 'flex items-end justify-between mb-5 anim-in' },
        h('div', null,
          h('div', { className: 'page-eyebrow' }, 'Revenue Command'),
          h('h1', { className: 't-h1 text-navy-900 mb-1', style: { fontSize: '1.75rem', letterSpacing: '-0.032em', fontWeight: 680 } }, 'Billing & Collections'),
          h('p', { className: 't-body', style: { color: 'var(--graphite-500)' } },
            'Billed ',
            h('span', { style: { color: 'var(--navy-900)', fontWeight: 650 } }, b.collected),
            ' \u00b7 ', h('span', { style: { color: 'var(--amber-700)', fontWeight: 600 } }, b.outstanding, ' outstanding'),
            ' \u00b7 ',
            h('span', { style: { color: 'var(--red-700)', fontWeight: 600 } }, b.writeOff, ' write-offs')
          )
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'clock', className: 'text-[10px]' }), 'Log time'),
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'arrow-down-to-line', className: 'text-[10px]' }), 'Export'),
          h('button', { className: 'btn btn-primary btn-sm' }, h(Icon, { name: 'file-invoice', className: 'text-[10px]' }), 'New invoice')
        )
      ),

      // ======= Stats =======
      h('div', { className: 'billing-stats mb-5 anim-in stg-1' },
        [
          ['Collected MTD', b.collected, b.collectedPct, 'green', 'emerald', 'arrow-trend-up'],
          ['Outstanding', b.outstanding, null, 'amber', 'amber', 'clock'],
          ['Unbilled WIP', b.unbilled, null, 'blue', 'blue', 'hourglass-half'],
          ['Write-offs', b.writeOff, null, 'red', 'red', 'arrow-trend-down'],
        ].map(([label, value, badge, accent, tone, icon], i) =>
          h('div', { key: i, className: `dash-stat stat-accent-${accent}` },
            h('div', { className: 'flex items-center justify-between mb-2.5' },
              h('span', { className: 't-label' }, label),
              h('div', { className: `icon-tile-sm icon-tile-${tone}` }, h(Icon, { name: icon }))
            ),
            h('div', { className: 'flex items-baseline gap-2' },
              h('span', { className: 't-metric-sm ticker', style: { color: 'var(--navy-900)' } }, value),
              badge && h('span', { className: 'delta delta-up' }, h(Icon, { name: 'arrow-up', className: 'text-[8px]' }), badge)
            )
          )
        )
      ),

      h('div', { className: 'billing-grid' },
        h('div', { className: 'space-y-4' },
          // Invoices
          h('div', { className: 'card anim-in stg-1' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Invoices'),
              h('span', { className: 'badge badge-neutral', style: { fontSize: 9 } }, (billing.invoices || []).length)
            ),
            h('div', { className: 'overflow-x-auto' },
              h('table', { className: 'power-table' },
                h('thead', null,
                  h('tr', null,
                    h('th', null, 'Invoice'),
                    h('th', null, 'Client'),
                    h('th', null, 'Matter'),
                    h('th', null, 'Amount'),
                    h('th', null, 'Hours'),
                    h('th', null, 'Status'),
                    h('th', null, 'Aging')
                  )
                ),
                h('tbody', null,
                  (billing.invoices || []).map(inv =>
                    h('tr', { key: inv.id, className: inv.status === 'overdue' ? 'row-critical' : '' },
                      h('td', { className: 'cell-mono' }, inv.invoiceNumber || inv.id),
                      h('td', { className: 'cell-primary' }, inv.clientId || '-'),
                      h('td', null, h('span', { className: 't-caption text-graphite-500' }, inv.matterId || '-')),
                      h('td', null, h('span', { className: 't-body font-bold text-navy-900' }, `₹${Number(inv.totalAmount || 0).toFixed(2)}`)),
                      h('td', null, h('span', { className: 't-caption text-graphite-500' }, '-')),
                      h('td', null, h(Badge, { type: inv.status === 'OVERDUE' ? 'critical' : inv.status === 'PAID' ? 'success' : 'medium' }, inv.status)),
                      h('td', null, h('span', { className: 't-caption font-bold text-graphite-500' }, '-'))
                    )
                  )
                )
              )
            )
          ),

          // Time Entries
          h('div', { className: 'card anim-in stg-2' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Recent Time Entries')
            ),
            h('div', { className: 'overflow-x-auto' },
              h('table', { className: 'power-table' },
                h('thead', null,
                  h('tr', null,
                    h('th', null, 'Advocate'),
                    h('th', null, 'Client'),
                    h('th', null, 'Work Description'),
                    h('th', null, 'Hours'),
                    h('th', null, 'Amount')
                  )
                ),
                h('tbody', null,
                  (billing.entries || []).map((t, i) =>
                    h('tr', { key: i },
                      h('td', null,
                        h('div', { className: 'flex items-center gap-1.5' },
                          h(Avatar, { initials: 'SC', size: 'xs' }),
                          h('span', { className: 't-caption font-medium' }, 'Sovereign Counsel')
                        )
                      ),
                      h('td', null, h('span', { className: 't-caption text-graphite-500' }, t.matterId)),
                      h('td', { className: 'cell-primary' }, t.description),
                      h('td', null, h('span', { className: 't-mono t-caption text-graphite-600' }, `${(Number(t.durationMinutes || 0) / 60).toFixed(1)}h`)),
                      h('td', null, h('span', { className: 't-body font-semibold text-navy-900' }, `₹${Number(t.amount || 0).toFixed(2)}`))
                    )
                  )
                )
              )
            )
          )
        ),

        // Right Side
        h('div', { className: 'space-y-3' },
          // Revenue by Practice
          h('div', { className: 'card anim-in stg-2' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Revenue by Practice')
            ),
            h('div', { className: 'card-body-dense' },
              MOCK.revenueByPractice.map((r, i) =>
                h('div', { key: i, className: 'mb-2.5' },
                  h('div', { className: 'flex items-center justify-between mb-1' },
                    h('span', { className: 't-caption font-medium text-graphite-700' }, r.name),
                    h('span', { className: 't-caption font-bold text-navy-900' }, r.amount)
                  ),
                  h(ProgressBar, { value: r.pct, color: r.color, height: 5 })
                )
              )
            )
          ),

          // Priority Receivables
          h('div', { className: 'card anim-in stg-3' },
            h('div', { className: 'card-header' },
              h('div', { className: 'flex items-center gap-2' },
                h(Icon, { name: 'triangle-exclamation', className: 'text-red-500 text-[10px]' }),
                h('span', { className: 't-h4 text-navy-900' }, 'Priority Receivables')
              )
            ),
            h('div', { className: 'card-body-dense' },
              MOCK.receivables.map((r, i) =>
                h('div', { key: i, className: 'flex items-center justify-between py-1.5 border-b last:border-0', style: { borderColor: 'var(--surface-3)' } },
                  h('div', null,
                    h('div', { className: 't-caption font-semibold text-navy-900' }, r.client),
                    h(Badge, { type: r.severity }, r.status)
                  ),
                  h('span', { className: 't-body font-bold text-navy-900' }, r.amount)
                )
              )
            )
          )
        )
      )
    )
  );
}

// ============================================
// PAGE: CALENDAR
// ============================================
function CalendarPage({ navigate, onCmdK }) {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    apiRequest('/tasks/my').then((data) => setTasks(data || [])).catch((err) => console.error(err));
  }, []);
  const today = 13;
  const daysInMonth = 31;
  const startDay = 3; // May 2026 starts on Wednesday (0=Sun)
  const calendarEvents = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    const day = new Date(task.dueDate).getDate();
    if (!day) return acc;
    if (!acc[day]) acc[day] = [];
    acc[day].push({ type: 'task', title: task.title, id: task.id });
    return acc;
  }, {});
  const days = [];
  for (let i = 0; i < startDay; i++) days.push({ num: 30 - startDay + i + 1, other: true });
  for (let i = 1; i <= daysInMonth; i++) days.push({ num: i, other: false, today: i === today, events: calendarEvents[i] || [] });
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) days.push({ num: i, other: true });

  return h(Fragment, null,
    h(TopBar, { title: 'Calendar', navigate, onCmdK }),
    h('div', { className: 'app-content' },
      // ======= Page Header =======
      h('div', { className: 'flex items-end justify-between mb-5 anim-in' },
        h('div', null,
          h('div', { className: 'page-eyebrow' }, 'Calendar'),
          h('h1', { className: 't-h1 text-navy-900 mb-1', style: { fontSize: '1.75rem', letterSpacing: '-0.032em', fontWeight: 680 } }, 'May 2026'),
          h('p', { className: 't-body', style: { color: 'var(--graphite-500)' } }, 'Hearings, deadlines, filings, and meetings \u00b7 Synced with court calendars.')
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('div', { className: 'segmented' },
            h('div', { className: 'segmented-item active' }, 'Month'),
            h('div', { className: 'segmented-item' }, 'Week'),
            h('div', { className: 'segmented-item' }, 'Agenda')
          ),
          h('div', { className: 'divider-v-lg' }),
          h('button', { className: 'btn-icon' }, h(Icon, { name: 'chevron-left', className: 'text-[11px]' })),
          h('button', { className: 'btn btn-secondary btn-sm' }, 'Today'),
          h('button', { className: 'btn-icon' }, h(Icon, { name: 'chevron-right', className: 'text-[11px]' })),
          h('button', { className: 'btn btn-primary btn-sm ml-1' }, h(Icon, { name: 'plus', className: 'text-[10px]' }), 'Event')
        )
      ),

      h('div', { className: 'cal-layout' },
        // Calendar Grid
        h('div', { className: 'anim-in' },
          h('div', { className: 'cal-grid' },
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d =>
              h('div', { key: d, className: 'cal-header-cell' }, d)
            ),
            days.map((d, i) =>
              h('div', { key: i, className: `cal-cell ${d.today ? 'today' : ''} ${d.other ? 'other-month' : ''}` },
                h('div', { className: 'cal-day-num' }, d.num),
                d.events && d.events.map((ev, j) =>
                  h('div', { key: j, className: `cal-event ev-${ev.type}` }, ev.title)
                )
              )
            )
          )
        ),

        // Sidebar
        h('div', { className: 'space-y-3' },
          h('div', { className: 'card anim-in stg-1' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, "Today's Schedule")
            ),
            h('div', { className: 'card-body-dense' },
              tasks.slice(0, 5).map((h2, i) =>
                h('div', { key: i, className: 'flex items-start gap-2 py-2 border-b last:border-0', style: { borderColor: 'var(--surface-3)' } },
                  h('div', { className: 'w-1 h-full rounded-full flex-shrink-0', style: { background: '#2563eb', minHeight: 36 } }),
                  h('div', null,
                    h('div', { className: 't-caption font-bold', style: { color: '#2563eb' } }, formatDate(h2.dueDate)),
                    h('div', { className: 't-caption font-semibold text-navy-900' }, h2.title),
                    h('div', { className: 't-caption text-graphite-400' }, h2.matter?.matterTitle || h2.matter?.title || '-')
                  )
                )
              )
            )
          ),

          h('div', { className: 'card anim-in stg-2' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Upcoming Deadlines')
            ),
            h('div', { className: 'card-body-dense' },
              tasks.filter((t) => !!t.dueDate).slice(0, 4).map((d, i) =>
                h('div', { key: i, className: 'flex items-center gap-2 py-1.5 border-b last:border-0', style: { borderColor: 'var(--surface-3)' } },
                  h('div', { className: 'w-1 h-6 rounded-full', style: { background: '#dc2626' } }),
                  h('div', { className: 'flex-1' },
                    h('div', { className: 't-caption font-semibold text-navy-900' }, d.title),
                    h('div', { className: 't-caption text-graphite-400' }, d.matter?.matterTitle || d.matter?.title || '-')
                  ),
                  h('span', { className: 't-caption font-bold text-red-600' }, formatDate(d.dueDate))
                )
              )
            )
          ),

          // Legend
          h('div', { className: 'card anim-in stg-3' },
            h('div', { className: 'card-body-dense' },
              h('div', { className: 't-label text-graphite-400 mb-2' }, 'LEGEND'),
              [
                ['Hearing', 'ev-hearing'], ['Deadline', 'ev-deadline'], ['Meeting', 'ev-meeting'], ['Filing', 'ev-filing']
              ].map(([label, cls]) =>
                h('div', { key: cls, className: 'flex items-center gap-2 py-0.5' },
                  h('div', { className: `cal-event ${cls}`, style: { display: 'inline-block', padding: '2px 8px' } }, label)
                )
              )
            )
          )
        )
      )
    )
  );
}

// ============================================
// PAGE: NOTIFICATIONS
// ============================================
function NotificationsPage({ navigate, onCmdK }) {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    apiRequest('/alerts').then((data) => setNotifications(data || [])).catch((err) => console.error(err));
  }, []);
  const n = {
    unread: notifications.filter((x) => !x.readStatus).length,
    approvals: 0,
    deadlines: notifications.filter((x) => x.type === 'DEADLINE').length,
    billing: 0,
    mentions: notifications.filter((x) => x.type === 'MENTION').length,
  };

  const filtered = filter === 'all' ? notifications :
    filter === 'unread' ? notifications.filter((x) => !x.readStatus) :
      notifications.filter((x) => (x.type || '').toLowerCase() === filter);

  return h(Fragment, null,
    h(TopBar, { title: 'Notifications', navigate, onCmdK }),
    h('div', { className: 'app-content' },
      // ======= Page Header =======
      h('div', { className: 'flex items-end justify-between mb-5 anim-in' },
        h('div', null,
          h('div', { className: 'page-eyebrow' }, 'Notifications'),
          h('h1', { className: 't-h1 text-navy-900 mb-1', style: { fontSize: '1.75rem', letterSpacing: '-0.032em', fontWeight: 680 } }, 'Command Feed'),
          h('p', { className: 't-body', style: { color: 'var(--graphite-500)' } },
            h('span', { style: { color: 'var(--red-600)', fontWeight: 650 } }, n.unread, ' unread'),
            ' \u00b7 ',
            h('span', { style: { color: 'var(--amber-700)', fontWeight: 600 } }, n.approvals, ' awaiting approval'),
            ' \u00b7 Urgent first, noise filtered.'
          )
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'moon', className: 'text-[10px]' }), 'Focus mode'),
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'sliders', className: 'text-[10px]' }), 'Preferences'),
          h('button', { className: 'btn btn-primary btn-sm' }, h(Icon, { name: 'check-double', className: 'text-[10px]' }), 'Mark all read')
        )
      ),

      // ======= Stats =======
      h('div', { className: 'grid grid-cols-5 gap-3 mb-5 anim-in stg-1' },
        [
          ['Unread', n.unread, 'bell', 'red'],
          ['Approvals', n.approvals, 'circle-check', 'amber'],
          ['Deadlines', n.deadlines, 'clock', 'blue'],
          ['Billing', n.billing, 'indian-rupee-sign', 'emerald'],
          ['Mentions', n.mentions, 'at', 'violet'],
        ].map(([label, val, icon, tone], i) =>
          h('div', { key: i, className: 'card-compact flex items-center gap-3 cursor-pointer', onClick: () => setFilter(label.toLowerCase()) },
            h('div', { className: `icon-tile icon-tile-${tone}` }, h(Icon, { name: icon })),
            h('div', null,
              h('div', { className: 't-label mb-0.5' }, label),
              h('div', { className: 't-metric-sm', style: { color: 'var(--navy-900)' } }, val)
            )
          )
        )
      ),

      h('div', { className: 'notif-layout' },
        // Notifications List
        h('div', null,
          h('div', { className: 'matters-controls mb-3' },
            ['all', 'unread', 'urgent', 'approval', 'mention'].map(f =>
              h(FilterChip, { key: f, label: f.charAt(0).toUpperCase() + f.slice(1), active: filter === f, onClick: () => setFilter(f) })
            ),
            h('div', { className: 'flex-1' }),
            h('button', { className: 'btn btn-ghost btn-xs' }, 'Mark All Read')
          ),
          h('div', { className: 'space-y-2 anim-in stg-1' },
            filtered.map(notif =>
              h('div', { key: notif.id, className: `card-compact flex items-start gap-3 ${!notif.readStatus ? 'border-l-2 border-l-blue-400' : ''}` },
                h('div', { className: 'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-50 text-amber-500' },
                  h(Icon, { name: 'bell', className: 'text-[11px]' })
                ),
                h('div', { className: 'flex-1 min-w-0' },
                  h('div', { className: 'flex items-center gap-2' },
                    h(PriorityBadge, { level: 'p2' }),
                    h('span', { className: `t-body font-semibold ${!notif.readStatus ? 'text-navy-900' : 'text-graphite-600'}` }, notif.title)
                  ),
                  h('div', { className: 't-body-sm text-graphite-500 mt-0.5' }, notif.message),
                  h('div', { className: 'flex items-center gap-2 mt-1.5' },
                    h('span', { className: 'badge badge-neutral', style: { fontSize: 9 } }, notif.type),
                    h('button', { className: 'btn btn-ghost btn-xs' }, 'Snooze'),
                    h('button', { className: 'btn btn-ghost btn-xs' }, 'â†’ Task'),
                    h('button', { className: 'btn btn-ghost btn-xs' }, 'Assign')
                  )
                ),
                h('span', { className: 't-caption text-graphite-300 flex-shrink-0' }, formatDate(notif.createdAt))
              )
            )
          )
        ),

        // Right Column
        h('div', { className: 'space-y-3' },
          h('div', { className: 'card anim-in stg-2' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Quick Actions')
            ),
            h('div', { className: 'card-body-dense space-y-1.5' },
              [
                ['Set Focus Time', 'moon', 'Block notifications for 2 hours'],
                ['Daily Digest', 'envelope', 'Get morning summary email'],
                ['Notification Rules', 'sliders', 'Configure alert preferences'],
              ].map(([title, icon, sub], i) =>
                h('div', { key: i, className: 'flex items-center gap-2 py-1.5 cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1' },
                  h(Icon, { name: icon, className: 'text-graphite-400 text-[11px] w-4 text-center' }),
                  h('div', null,
                    h('div', { className: 't-caption font-semibold text-navy-900' }, title),
                    h('div', { className: 't-caption text-graphite-400' }, sub)
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

// ============================================
// PAGE: ANALYTICS
// ============================================
function AnalyticsPage({ navigate, onCmdK }) {
  const [analytics, setAnalytics] = useState({ matterCount: 0, taskCompletion: 0, workload: [] });
  useEffect(() => {
    apiRequest('/analytics').then((data) => setAnalytics(data || { matterCount: 0, taskCompletion: 0, workload: [] })).catch((err) => console.error(err));
  }, []);
  return h(Fragment, null,
    h(TopBar, { title: 'Analytics', navigate, onCmdK }),
    h('div', { className: 'app-content' },
      // ======= Page Header =======
      h('div', { className: 'flex items-end justify-between mb-5 anim-in' },
        h('div', null,
          h('div', { className: 'page-eyebrow' }, 'Analytics'),
          h('h1', { className: 't-h1 text-navy-900 mb-1', style: { fontSize: '1.75rem', letterSpacing: '-0.032em', fontWeight: 680 } }, 'Firm Performance'),
          h('p', { className: 't-body', style: { color: 'var(--graphite-500)' } }, 'Boardroom-grade intelligence across practice, revenue, and capacity.')
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('div', { className: 'segmented' },
            h('div', { className: 'segmented-item' }, '30d'),
            h('div', { className: 'segmented-item active' }, '90d'),
            h('div', { className: 'segmented-item' }, 'YTD'),
            h('div', { className: 'segmented-item' }, '12m')
          ),
          h('div', { className: 'divider-v-lg' }),
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'file-pdf', className: 'text-[10px]' }), 'Export PDF'),
          h('button', { className: 'btn btn-violet btn-sm' }, h(Icon, { name: 'wand-magic-sparkles', className: 'text-[10px]' }), 'AI brief')
        )
      ),

      // ======= Insight summary row =======
      h('div', { className: 'grid grid-cols-4 gap-3 mb-5 anim-in stg-1' },
        [
          ['Matters', `${analytics.matterCount}`, '+0%', 'Current total', 'emerald'],
          ['Task Completion', `${analytics.taskCompletion}%`, '+0%', 'Completion rate', 'blue'],
          ['Workload Users', `${(analytics.workload || []).length}`, '+0%', 'Active users', 'violet'],
          ['Utilization', `${analytics.taskCompletion}%`, '+0%', 'Task-derived', 'amber'],
        ].map(([label, value, delta, note, tone], i) =>
          h('div', { key: i, className: `insight-card dash-stat stat-accent-${tone === 'emerald' ? 'green' : tone}` },
            h('div', { className: 't-label mb-2' }, label),
            h('div', { className: 'flex items-baseline gap-2 mb-1' },
              h('span', { className: 't-metric ticker', style: { color: 'var(--navy-900)' } }, value),
              h('span', { className: `delta ${delta.startsWith('-') && tone !== 'violet' ? 'delta-down' : delta.startsWith('-') ? 'delta-up' : 'delta-up'}` },
                h(Icon, { name: delta.startsWith('-') ? 'arrow-down' : 'arrow-up', className: 'text-[8px]' }),
                delta
              )
            ),
            h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, note)
          )
        )
      ),

      h('div', { className: 'analytics-grid' },
        // Revenue Chart
        h('div', { className: 'card anim-in stg-2' },
          h('div', { className: 'card-header' },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'icon-tile-sm icon-tile-emerald' }, h(Icon, { name: 'arrow-trend-up' })),
              h('div', null,
                h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, 'Revenue Command'),
                h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, 'Monthly collections \u00b7 trailing 12 months')
              )
            ),
            h('div', { className: 'flex items-center gap-1.5' },
              h('span', { className: 'delta delta-up' }, h(Icon, { name: 'arrow-up', className: 'text-[8px]' }), '14.2%'),
              h('span', { className: 'badge badge-neutral' }, 'vs LY')
            )
          ),
          h('div', { className: 'card-body', style: { height: 300 } },
            h(RevenueChart)
          )
        ),
        // Cases by Practice
        h('div', { className: 'card anim-in stg-3' },
          h('div', { className: 'card-header' },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'icon-tile-sm icon-tile-blue' }, h(Icon, { name: 'scale-balanced' })),
              h('div', null,
                h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, 'Practice Mix'),
                h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, 'Active matters by discipline')
              )
            ),
            h('button', { className: 'btn btn-ghost btn-xs' }, 'Expand ', h(Icon, { name: 'arrow-up-right-from-square', className: 'text-[8px]' }))
          ),
          h('div', { className: 'card-body' },
            MOCK.casesByPractice.map((p, i) =>
              h('div', { key: i, className: 'flex items-center gap-3 mb-3.5' },
                h('div', { style: { width: 10, height: 10, borderRadius: 3, background: p.color, boxShadow: `0 0 0 2px ${p.color}22` } }),
                h('span', { className: 't-caption', style: { color: 'var(--graphite-800)', fontWeight: 550, width: 100, letterSpacing: '-0.005em' } }, p.name),
                h('div', { className: 'flex-1' },
                  h(ProgressBar, { value: (p.value / 45) * 100, color: p.color, height: 8 })
                ),
                h('span', { className: 'ticker', style: { fontSize: 13, fontWeight: 700, color: 'var(--navy-900)', minWidth: 30, textAlign: 'right' } }, p.value)
              )
            )
          )
        ),
        // Matter Flow
        h('div', { className: 'card anim-in stg-4' },
          h('div', { className: 'card-header' },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'icon-tile-sm icon-tile-violet' }, h(Icon, { name: 'diagram-project' })),
              h('div', null,
                h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, 'Matter Flow'),
                h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, 'Intake vs. resolution \u00b7 trailing 12 months')
              )
            )
          ),
          h('div', { className: 'card-body' },
            h('div', { className: 'overflow-x-auto' },
              h('table', { className: 'power-table' },
                h('thead', null,
                  h('tr', null,
                    h('th', null, 'Month'),
                    h('th', null, 'Opened'),
                    h('th', null, 'Closed'),
                    h('th', null, 'Net')
                  )
                ),
                h('tbody', null,
                  MOCK.matterFlow.map((m, i) =>
                    h('tr', { key: i },
                      h('td', { className: 'font-medium' }, m.month),
                      h('td', null, h('span', { className: 'text-blue-600 font-semibold' }, m.opened)),
                      h('td', null, h('span', { className: 'text-emerald-600 font-semibold' }, m.closed)),
                      h('td', null, h('span', { className: `font-bold ${m.opened - m.closed > 0 ? 'text-amber-600' : 'text-emerald-600'}` }, m.opened - m.closed > 0 ? '+' : '', m.opened - m.closed))
                    )
                  )
                )
              )
            )
          )
        ),
        // Key Metrics
        h('div', { className: 'card anim-in stg-5' },
          h('div', { className: 'card-header' },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'icon-tile-sm icon-tile-navy' }, h(Icon, { name: 'gauge-high' })),
              h('div', null,
                h('div', { className: 't-h3 text-navy-900', style: { fontWeight: 620 } }, 'Firm Health Indicators'),
                h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, 'Quarterly benchmarks across the practice')
              )
            )
          ),
          h('div', { className: 'card-body space-y-3' },
            [
              ['Billing Efficiency', 87, '#059669'],
              ['Collection Rate', 78, '#3b82f6'],
              ['Client Satisfaction', 92, '#8b5cf6'],
              ['Deadline Compliance', 94, '#0c1525'],
              ['Team Utilization', 76, '#d97706'],
            ].map(([label, val, color], i) =>
              h('div', { key: i },
                h('div', { className: 'flex items-center justify-between mb-1' },
                  h('span', { className: 't-caption font-medium text-graphite-700' }, label),
                  h('span', { className: 't-caption font-bold', style: { color } }, val, '%')
                ),
                h(ProgressBar, { value: val, color, height: 6 })
              )
            )
          )
        )
      )
    )
  );
}

// Revenue Chart â€” boardroom-grade, editorial tooltip, subtle grid
function RevenueChart() {
  if (!window.Recharts) return h('div', { className: 't-caption text-graphite-400 text-center py-8' }, 'Loading chart\u2026');
  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } = Recharts;

  // Editorial, handcrafted tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const v = payload[0].value;
    return h('div', {
      style: {
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(10,16,32,0.09)',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 4px 12px -2px rgba(10,16,32,0.1), 0 0 0 1px rgba(10,16,32,0.05)',
        minWidth: 140,
      }
    },
      h('div', { style: { fontSize: 10, fontWeight: 620, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a808b', marginBottom: 4 } }, label),
      h('div', { style: { fontSize: 16, fontWeight: 680, letterSpacing: '-0.022em', color: '#0b1220', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 } },
        '\u20b9', (v / 100000).toFixed(2), 'L'
      ),
      h('div', { style: { fontSize: 11, color: '#7a808b', marginTop: 3, fontWeight: 500 } }, 'Collected revenue')
    );
  };

  return h(ResponsiveContainer, { width: '100%', height: '100%' },
    h(AreaChart, { data: MOCK.monthlyRevenue, margin: { top: 14, right: 16, left: -6, bottom: 4 } },
      h('defs', null,
        h('linearGradient', { id: 'navyGrad', x1: 0, y1: 0, x2: 0, y2: 1 },
          h('stop', { offset: '0%', stopColor: '#1a2338', stopOpacity: 0.18 }),
          h('stop', { offset: '100%', stopColor: '#1a2338', stopOpacity: 0 })
        ),
        h('linearGradient', { id: 'navyStroke', x1: 0, y1: 0, x2: 1, y2: 0 },
          h('stop', { offset: '0%', stopColor: '#1a2338' }),
          h('stop', { offset: '100%', stopColor: '#0b1220' })
        )
      ),
      h(CartesianGrid, { strokeDasharray: '2 4', stroke: 'rgba(10,16,32,0.055)', vertical: false }),
      h(XAxis, {
        dataKey: 'month',
        tick: { fontSize: 10.5, fill: '#7a808b', fontWeight: 580, letterSpacing: '0.03em' },
        axisLine: false, tickLine: false, dy: 8,
      }),
      h(YAxis, {
        tick: { fontSize: 10.5, fill: '#7a808b', fontWeight: 580 },
        axisLine: false, tickLine: false, dx: -4,
        tickFormatter: v => `\u20b9${(v / 100000).toFixed(0)}L`,
      }),
      h(Tooltip, {
        content: h(CustomTooltip),
        cursor: { stroke: 'rgba(10,16,32,0.18)', strokeWidth: 1, strokeDasharray: '3 3' },
      }),
      h(Area, {
        type: 'monotone',
        dataKey: 'value',
        stroke: 'url(#navyStroke)',
        fill: 'url(#navyGrad)',
        strokeWidth: 2,
        dot: false,
        activeDot: { r: 5, fill: '#0b1220', stroke: 'white', strokeWidth: 2.5 },
      })
    )
  );
}

// ============================================
// PAGE: CONTROL CENTER
// ============================================
function ControlPage({ navigate, onCmdK }) {
  const [tab, setTab] = useState('team');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const refreshControl = useCallback(async () => {
    try {
      const [u, r] = await Promise.all([apiRequest('/users'), apiRequest('/users/roles')]);
      setUsers(u || []);
      setRoles(r || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { refreshControl(); }, [refreshControl]);

  return h(Fragment, null,
    h(TopBar, { title: 'Control Center', navigate, onCmdK },
      h('span', { className: 'status-indicator live ml-3' }, h('span', { className: 'dot' }), h('span', { style: { color: 'var(--emerald-700)', fontWeight: 650, fontSize: 10.5 } }, 'All systems operational'))
    ),
    h('div', { className: 'app-content' },
      // ======= Page Header =======
      h('div', { className: 'flex items-end justify-between mb-5 anim-in' },
        h('div', null,
          h('div', { className: 'page-eyebrow' }, 'Administration'),
          h('h1', { className: 't-h1 text-navy-900 mb-1', style: { fontSize: '1.75rem', letterSpacing: '-0.032em', fontWeight: 680 } }, 'Control Center'),
          h('p', { className: 't-body', style: { color: 'var(--graphite-500)' } }, 'Team, permissions, audit logs, and integrations for your workspace.')
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('button', { className: 'btn btn-secondary btn-sm' }, h(Icon, { name: 'file-export', className: 'text-[10px]' }), 'Audit report'),
          h('button', { className: 'btn btn-primary btn-sm', onClick: async () => {
            const email = window.prompt('Invite email');
            if (!email) return;
            const roleId = roles[0]?.id;
            if (!roleId) return alert('No role available');
            try {
              const out = await apiRequest('/users/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, roleId }),
              });
              alert(`Invite token: ${out.inviteToken}`);
              refreshControl();
            } catch (err) { alert(err.message); }
          } }, h(Icon, { name: 'user-plus', className: 'text-[10px]' }), 'Invite member')
        )
      ),

      // ======= Stats with Security Score Hero =======
      h('div', { className: 'grid gap-4 mb-5 anim-in stg-1', style: { gridTemplateColumns: '1.6fr 1fr 1fr 1fr' } },
        // Security Score â€” hero card
        h('div', { className: 'security-score-card' },
          h('div', { className: 'flex items-center justify-between mb-3 relative z-10' },
            h('div', null,
              h('div', { className: 't-label', style: { color: 'rgba(255,255,255,0.5)' } }, 'SECURITY SCORE'),
              h('div', { className: 'flex items-baseline gap-2 mt-1' },
                h('span', { className: 'ticker', style: { fontSize: 34, fontWeight: 750, color: 'white', letterSpacing: '-0.035em', lineHeight: 1 } }, '98'),
                h('span', { style: { fontSize: 15, color: 'rgba(255,255,255,0.45)', fontWeight: 600 } }, '/ 100')
              )
            ),
            h('div', { style: { width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 16px rgba(16,185,129,0.2)' } },
              h(Icon, { name: 'shield-halved', style: { color: '#6ee7b7', fontSize: 18 } })
            )
          ),
          h('div', { className: 'flex items-center gap-2 relative z-10 flex-wrap' },
            h('span', { className: 'badge', style: { background: 'rgba(16,185,129,0.18)', color: '#6ee7b7', boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.3)' } }, h(Icon, { name: 'check', className: 'text-[8px]' }), 'SOC 2 II'),
            h('span', { className: 'badge', style: { background: 'rgba(16,185,129,0.18)', color: '#6ee7b7', boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.3)' } }, h(Icon, { name: 'check', className: 'text-[8px]' }), 'ISO 27001'),
            h('span', { className: 'badge', style: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' } }, h(Icon, { name: 'lock', className: 'text-[8px]' }), 'AES-256')
          )
        ),
        ...[
          ['ACTIVE USERS', users.length, null, 'users', 'blue'],
          ['PENDING INVITES', 0, null, 'envelope', 'amber'],
          ['PERMISSION GROUPS', roles.length, null, 'shield-halved', 'violet'],
        ].map(([label, val, badge, icon, tone], i) =>
          h('div', { key: i, className: 'dash-stat' },
            h('div', { className: 'flex items-center justify-between mb-2.5' },
              h('span', { className: 't-label' }, label),
              h('div', { className: `icon-tile-sm icon-tile-${tone}` }, h(Icon, { name: icon }))
            ),
            h('div', { className: 'flex items-baseline gap-2' },
              h('span', { className: 't-metric', style: { color: 'var(--navy-900)' } }, val),
              badge && h('span', { className: 'delta delta-up' }, h(Icon, { name: 'arrow-up', className: 'text-[8px]' }), badge)
            )
          )
        )
      ),

      h(TabNav, {
        tabs: [
          { id: 'team', label: 'Team', count: users.length },
          { id: 'policies', label: 'Policies' },
          { id: 'audit', label: 'Audit Log', count: MOCK.auditLog.length },
          { id: 'integrations', label: 'Integrations' },
        ], active: tab, onChange: setTab
      }),

      h('div', { className: 'mt-4' },
        // Team Tab
        tab === 'team' && h('div', { className: 'card anim-in' },
          h('div', { className: 'card-header' },
            h('span', { className: 't-h4 text-navy-900' }, 'Team Members'),
            h('button', { className: 'btn btn-primary btn-sm' }, h(Icon, { name: 'user-plus', className: 'text-[9px]' }), 'Invite')
          ),
          h('div', { className: 'overflow-x-auto' },
            h('table', { className: 'power-table' },
              h('thead', null,
                h('tr', null,
                  h('th', null, 'Member'),
                  h('th', null, 'Role'),
                  h('th', null, 'Department'),
                  h('th', null, 'Access'),
                  h('th', null, 'Status'),
                  h('th', null, 'Actions')
                )
              ),
              h('tbody', null,
                users.map((m, i) =>
                  h('tr', { key: i },
                    h('td', null,
                      h('div', { className: 'flex items-center gap-2' },
                        h(Avatar, { initials: `${(m.firstName || 'U')[0]}${(m.lastName || 'U')[0]}`, color: '#0c1525', size: 'sm' }),
                        h('span', { className: 'font-semibold text-navy-900' }, `${m.firstName || ''} ${m.lastName || ''}`)
                      )
                    ),
                    h('td', null, m.role?.name || '-'),
                    h('td', null, 'Legal'),
                    h('td', null, h(Badge, { type: 'neutral' }, 'Scoped')),
                    h('td', null,
                      h('span', { className: 'flex items-center gap-1.5 t-caption text-emerald-600' },
                        h('span', { className: 'w-1.5 h-1.5 rounded-full bg-emerald-400' }),
                        'Active'
                      )
                    ),
                    h('td', null,
                      h('button', { className: 'btn btn-ghost btn-xs' }, 'Edit'),
                      h('button', { className: 'btn btn-ghost btn-xs' }, 'Permissions')
                    )
                  )
                )
              )
            )
          )
        ),

        // Policies Tab
        tab === 'policies' && h('div', { className: 'grid grid-cols-2 gap-4 anim-in' },
          MOCK.policies.map((p, i) =>
            h('div', { key: i, className: 'card-compact flex items-start gap-3' },
              h('div', { className: 'w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0' },
                h(Icon, { name: p.icon, className: 'text-xs text-navy-600' })
              ),
              h('div', { className: 'flex-1' },
                h('div', { className: 'flex items-center justify-between' },
                  h('span', { className: 't-body font-semibold text-navy-900' }, p.name),
                  h(Badge, { type: p.value === 'Enforced' || p.value === 'Active' ? 'success' : p.value === 'Restricted' ? 'critical' : 'info' }, p.value)
                ),
                h('div', { className: 't-caption text-graphite-400 mt-0.5' }, p.desc)
              )
            )
          )
        ),

        // Audit Log Tab
        tab === 'audit' && h('div', { className: 'card anim-in' },
          h('div', { className: 'card-body-dense' },
            h('div', { className: 'timeline' },
              MOCK.auditLog.map((log, i) =>
                h('div', { key: i, className: 'timeline-item' },
                  h('div', { className: `timeline-dot ${log.type === 'change' ? 'dot-amber' : log.type === 'system' ? 'dot-blue' : log.type === 'add' ? 'dot-green' : log.type === 'security' ? 'dot-red' : 'dot-purple'}` },
                    h(Icon, { name: log.type === 'change' ? 'pen' : log.type === 'system' ? 'gear' : log.type === 'add' ? 'user-plus' : log.type === 'security' ? 'key' : 'shield-halved' })
                  ),
                  h('div', null,
                    h('div', { className: 'flex items-center gap-2' },
                      h('span', { className: 't-body font-semibold text-navy-900' }, log.title),
                      h('span', { className: 't-caption text-graphite-300' }, log.time)
                    ),
                    h('div', { className: 't-body-sm text-graphite-500' }, log.detail),
                    h('div', { className: 't-caption text-graphite-400 mt-0.5' }, 'by ', log.user)
                  )
                )
              )
            )
          )
        ),

        // Integrations Tab
        tab === 'integrations' && h('div', { className: 'grid grid-cols-3 gap-4 anim-in' },
          [
            ['Microsoft 365', 'fa-brands fa-microsoft', 'Connected', 'Email, Calendar, Teams', 'success'],
            ['Google Workspace', 'fa-brands fa-google', 'Connected', 'Drive, Gmail, Meet', 'success'],
            ['Slack', 'fa-brands fa-slack', 'Available', 'Team notifications', 'neutral'],
            ['DocuSign', 'fa-solid fa-file-signature', 'Connected', 'E-signatures', 'success'],
            ['Salesforce', 'fa-brands fa-salesforce', 'Available', 'CRM integration', 'neutral'],
            ['API Access', 'fa-solid fa-code', 'Active', 'REST API v4.2', 'success'],
          ].map(([name, icon, status, desc, badge], i) =>
            h('div', { key: i, className: 'card-compact flex items-center gap-3' },
              h('div', { className: 'w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center' },
                h('i', { className: `${icon} text-lg text-navy-600` })
              ),
              h('div', { className: 'flex-1' },
                h('div', { className: 'flex items-center gap-2' },
                  h('span', { className: 't-body font-semibold text-navy-900' }, name),
                  h(Badge, { type: badge }, status)
                ),
                h('div', { className: 't-caption text-graphite-400' }, desc)
              )
            )
          )
        )
      )
    )
  );
}

// ============================================
// PAGE: CLIENT PORTAL
// ============================================
function ClientPortalPage({ navigate, onCmdK }) {
  const c = MOCK.matterDetail;
  const pf = MOCK.portalFinancial;

  return h(Fragment, null,
    h(TopBar, { navigate, onCmdK },
      h('div', { className: 'flex items-center gap-2 ml-2' },
        h('span', { className: 't-h4 text-navy-900' }, 'Client Portal'),
        h('span', { className: 'badge badge-purple' }, h(Icon, { name: 'user-tie', className: 'text-[8px]' }), 'Client View')
      )
    ),
    h('div', { className: 'app-content' },
      // ======= Premium Portal Header =======
      h('div', { className: 'portal-header anim-in' },
        h('div', { className: 'flex items-start justify-between mb-6' },
          h('div', null,
            h('div', { className: 'flex items-center gap-3 mb-4' },
              h('span', { style: { fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' } }, 'Matter Reference'),
              h('span', { style: { fontSize: 11, fontWeight: 650, color: 'white', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.02em', background: 'rgba(255,255,255,0.08)', padding: '3px 9px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' } }, c.id)
            ),
            h('h1', { className: 'text-gradient-navy', style: { fontSize: 32, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: 10, color: 'white' } }, c.name),
            h('div', { style: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, maxWidth: 520 } },
              c.court, ' \u00b7 Hon\'ble ', c.judge
            ),
            h('div', { className: 'mt-5 flex items-center gap-2' },
              h('span', { className: 'badge', style: { background: 'rgba(16,185,129,0.16)', color: '#6ee7b7', boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.3)' } },
                h(Icon, { name: 'circle-check', className: 'text-[8px]' }), 'Progressing on schedule'
              ),
              h('span', { className: 'badge', style: { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' } },
                h(Icon, { name: 'shield-check', className: 'text-[8px]' }), 'Attorney-Client Privileged'
              )
            )
          ),
          h('div', { style: { textAlign: 'right' } },
            h(HealthScore, { score: c.healthScore, size: 64 }),
            h('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginTop: 8 } }, 'Case Health')
          )
        )
      ),

      // ======= Lifecycle Progress Tracker =======
      h('div', { className: 'card mb-5 anim-in stg-1' },
        h('div', { className: 'card-header' },
          h('div', { className: 'flex items-center gap-2.5' },
            h('div', { className: 'icon-tile-sm icon-tile-blue' }, h(Icon, { name: 'route' })),
            h('div', null,
              h('div', { className: 't-h4 text-navy-900' }, 'Case lifecycle'),
              h('div', { className: 't-caption', style: { color: 'var(--graphite-500)' } }, 'Your matter is currently at ', h('span', { style: { color: 'var(--navy-900)', fontWeight: 650 } }, MOCK.portalStages.find(s => s.status === 'active')?.stage || 'Active'))
            )
          ),
          h('span', { className: 'badge badge-info' }, Math.round((MOCK.portalStages.filter(s => s.status === 'completed').length / MOCK.portalStages.length) * 100), '% complete')
        ),
        h('div', { style: { padding: '20px 28px 24px' } },
          h('div', { className: 'portal-progress-track' },
            MOCK.portalStages.map((s, i) =>
              h('div', { key: i, className: `portal-step ${s.status === 'completed' ? 'done' : s.status === 'active' ? 'current' : ''}` },
                i < MOCK.portalStages.length - 1 && h('div', { className: 'portal-step-connector' }),
                h('div', { className: 'portal-step-dot' },
                  s.status === 'completed' ? h(Icon, { name: 'check' }) : h('span', null, i + 1)
                ),
                h('div', { className: 'portal-step-label' }, s.stage),
                h('div', { className: 't-micro', style: { color: 'var(--graphite-400)', textAlign: 'center' } }, s.date)
              )
            )
          )
        )
      ),

      // Portal Grid
      h('div', { className: 'portal-grid' },
        // Updates
        h('div', { className: 'card anim-in stg-2' },
          h('div', { className: 'card-header' },
            h('span', { className: 't-h4 text-navy-900' }, 'Latest Updates')
          ),
          h('div', { className: 'card-body-dense' },
            h('div', { className: 'timeline' },
              c.timeline.slice(0, 4).map((ev, i) =>
                h('div', { key: i, className: 'timeline-item' },
                  h('div', { className: `timeline-dot dot-${ev.dotColor}` },
                    h(Icon, { name: 'circle-info' })
                  ),
                  h('div', null,
                    h('div', { className: 't-caption font-semibold text-navy-900' }, ev.title),
                    h('div', { className: 't-caption text-graphite-400' }, ev.detail),
                    h('div', { className: 't-caption text-graphite-300 mt-0.5' }, ev.time)
                  )
                )
              )
            )
          )
        ),

        // Documents to Review
        h('div', { className: 'card anim-in stg-3' },
          h('div', { className: 'card-header' },
            h('span', { className: 't-h4 text-navy-900' }, 'Documents')
          ),
          h('div', { className: 'card-body-dense' },
            MOCK.portalDocs.map((d, i) =>
              h('div', { key: i, className: 'flex items-center gap-3 py-2 border-b last:border-0', style: { borderColor: 'var(--surface-3)' } },
                h('i', { className: `fa-solid ${d.icon} text-red-400` }),
                h('div', { className: 'flex-1' },
                  h('div', { className: 't-body font-semibold text-navy-900' }, d.name),
                  h('div', { className: 't-caption text-graphite-400' }, d.date)
                ),
                h(Badge, { type: d.status === 'For Review' ? 'high' : 'success' }, d.status),
                h('button', { className: 'btn btn-secondary btn-xs' }, 'Download')
              )
            ),
            h('div', { className: 'mt-3' },
              h('button', { className: 'btn btn-secondary btn-sm w-full justify-center' }, h(Icon, { name: 'cloud-arrow-up', className: 'text-[9px]' }), 'Upload Document')
            )
          )
        ),

        // Right Side
        h('div', { className: 'space-y-3' },
          // Next Milestone
          h('div', { className: 'card anim-in stg-3' },
            h('div', { className: 'card-header' },
              h(Icon, { name: 'gavel', className: 'text-blue-500 text-[10px]' }),
              h('span', { className: 't-h4 text-navy-900' }, 'Next Hearing')
            ),
            h('div', { className: 'card-body-dense' },
              h('div', { className: 't-h3 text-navy-900' }, c.nextHearing.date),
              h('div', { className: 't-caption text-blue-600 font-bold' }, c.nextHearing.time),
              h('div', { className: 't-caption text-graphite-500 mt-1' }, c.nextHearing.court),
              h('div', { className: 't-caption text-graphite-500' }, c.nextHearing.room)
            )
          ),

          // Financial
          h('div', { className: 'card anim-in stg-4' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Financial Summary')
            ),
            h('div', { className: 'card-body-dense space-y-2' },
              h('div', { className: 'flex justify-between' },
                h('span', { className: 't-caption text-graphite-500' }, 'Retainer Balance'),
                h('span', { className: 't-caption font-bold text-navy-900' }, pf.retainer)
              ),
              h('div', { className: 'flex justify-between' },
                h('span', { className: 't-caption text-graphite-500' }, 'Amount Utilized'),
                h('span', { className: 't-caption font-bold text-amber-600' }, pf.utilized)
              ),
              h(ProgressBar, { value: 62, color: '#3b82f6', height: 5 }),
              h('div', { className: 'flex justify-between mt-1' },
                h('span', { className: 't-caption text-graphite-500' }, 'Pending Invoice'),
                h('span', { className: 't-caption font-bold text-red-600' }, pf.pending)
              ),
              h('button', { className: 'btn btn-primary btn-sm w-full justify-center mt-2' }, 'Pay Invoice')
            )
          ),

          // Your Team
          h('div', { className: 'card anim-in stg-5' },
            h('div', { className: 'card-header' },
              h('span', { className: 't-h4 text-navy-900' }, 'Your Legal Team')
            ),
            h('div', { className: 'card-body-dense' },
              c.team.map((t, i) =>
                h('div', { key: i, className: 'flex items-center gap-2 py-1.5' },
                  h(Avatar, { initials: t.initials, color: t.color, size: 'sm', online: t.online }),
                  h('div', null,
                    h('div', { className: 't-caption font-semibold text-navy-900' }, t.name),
                    h('div', { className: 't-caption text-graphite-400' }, t.role)
                  )
                )
              ),
              h('button', { className: 'btn btn-secondary btn-sm w-full justify-center mt-2' }, h(Icon, { name: 'comments', className: 'text-[9px]' }), 'Message Team')
            )
          ),

          // Trust
          h('div', { className: 'card-compact text-center anim-in stg-6' },
            h(Icon, { name: 'shield-check', className: 'text-emerald-400 text-lg mb-1' }),
            h('div', { className: 't-caption font-semibold text-graphite-600' }, 'Secure Client Portal'),
            h('div', { className: 't-caption text-graphite-400' }, 'ISO 27001 â€¢ SOC2 â€¢ AES-256'),
            h('div', { className: 't-caption text-graphite-300 mt-1' }, 'Your data is end-to-end encrypted')
          )
        )
      )
    )
  );
}

// ============================================
// APP ROOT
// ============================================
function App() {
  const { path, navigate } = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);
  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  useKeyboard('k', 'meta', openCmd);

  // Close mobile nav whenever route changes
  useEffect(() => { setMobileNavOpen(false); }, [path]);

  const isLoggedIn = path !== '/login' && !path.startsWith('/accept-invite');

  // Page identity â€” drives v6.3 signature details per page
  const pageKey = (() => {
    if (path === '/login' || path.startsWith('/accept-invite')) return 'login';
    if (path.startsWith('/matters')) return 'matters';
    if (path === '/calendar') return 'calendar';
    if (path === '/documents') return 'documents';
    if (path === '/billing') return 'billing';
    if (path === '/notifications') return 'notifications';
    if (path === '/analytics') return 'analytics';
    if (path === '/control') return 'control';
    if (path === '/portal') return 'portal';
    return 'dashboard';
  })();
  useEffect(() => {
    document.body.setAttribute('data-page', pageKey);
    document.body.className = `page-${pageKey}`;
    return () => { document.body.removeAttribute('data-page'); document.body.className = ''; };
  }, [pageKey]);
  const currentPage = (() => {
    if (path === '/login') return h(LoginPage, { navigate });
    if (path.startsWith('/accept-invite')) return h(AcceptInvitePage, { navigate });
    if (path === '/dashboard') return h(DashboardPage, { navigate, onCmdK: openCmd });
    if (path.startsWith('/matters/detail')) return h(MatterDetailPage, { navigate, onCmdK: openCmd });
    if (path === '/matters') return h(MattersPage, { navigate, onCmdK: openCmd });
    if (path === '/calendar') return h(CalendarPage, { navigate, onCmdK: openCmd });
    if (path === '/documents') return h(DocumentsPage, { navigate, onCmdK: openCmd });
    if (path === '/billing') return h(BillingPage, { navigate, onCmdK: openCmd });
    if (path === '/notifications') return h(NotificationsPage, { navigate, onCmdK: openCmd });
    if (path === '/analytics') return h(AnalyticsPage, { navigate, onCmdK: openCmd });
    if (path === '/control') return h(ControlPage, { navigate, onCmdK: openCmd });
    if (path === '/portal') return h(ClientPortalPage, { navigate, onCmdK: openCmd });
    return h(DashboardPage, { navigate, onCmdK: openCmd });
  })();

  return h('div', { className: isLoggedIn ? 'app-shell' : '' },
    isLoggedIn && h(Sidebar, { activePath: path, navigate }),
    h('div', { className: isLoggedIn ? 'app-body' : '' },
      // Mobile-only sticky header (hidden on desktop via CSS)
      isLoggedIn && h(MobileHeader, {
        activePath: path,
        navigate,
        onOpenDrawer: openMobileNav,
        onCmdK: openCmd,
      }),
      currentPage
    ),
    // Mobile slide-over drawer (hidden on desktop via CSS)
    isLoggedIn && h(MobileDrawer, {
      open: mobileNavOpen,
      onClose: closeMobileNav,
      activePath: path,
      navigate,
    }),
    h(CommandPalette, { open: cmdOpen, onClose: closeCmd, navigate })


  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));
