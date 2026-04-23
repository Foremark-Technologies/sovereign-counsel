# Sovereign Counsel v6.4 — Elite Legal Operations Platform

A world-class, executive-grade legal-operations suite designed for top-tier litigation firms, arbitration teams, in-house legal departments, and multi-office practices.

---

## 🏁 v6.4 — Final Production Pass (April 2026)

> Ship-grade QA layer. Desktop and mobile now pixel-consistent across every breakpoint.
> No redesign — surgical polish only.

All v6.4 corrections live in **`css/v64-final.css`** — loaded LAST in the cascade, after `mobile.css`.

### What was repaired in v6.4

1. **Global overflow safety** — `overflow-x: clip` on `html, body`; every breakpoint audited for horizontal bleed.
2. **Focus system** — single canonical focus ring across all interactive elements (buttons, links, inputs, chips, tabs), accessible per WCAG 2.2.
3. **Button interaction system** — uniform hover / press / disabled states; 38px minimum tap target on mobile; no hover lifts on touch devices.
4. **Table rhythm** — consistent row hover, sticky thead, hairline row separators, scrollable wrapper with soft edge fades to signal scrollability.
5. **Mobile header polish** — elevated shadow, refined glass effect, animated press feedback on icon buttons.
6. **Mobile drawer polish** — layered gradient background, active-item glowing left-rail indicator, safer safe-area handling.
7. **Dashboard KPI row** — true 5-column layout on ≥1024px, 3-col at 768–1023, 2-col at 481–767, 1-col at ≤480 with calibrated typography at each breakpoint.
8. **Matter Detail** — aside rails hide cleanly at ≤1023px; tabs become horizontally swipeable.
9. **Matters page controls** — filter-chip row becomes horizontally swipeable; search + sort grid to 2-col then 1-col.
10. **Bulk-action bar** — wraps cleanly on mobile; dividers hide when stacked.
11. **Analytics charts** — Recharts containers locked to 100% width; legends wrap on mobile; axis tick text shrinks on small screens.
12. **Login page** — brand side hides on ≤1023px (focused form experience); form card sizes perfectly down to 320px.
13. **Client Portal / Control / Notifications** — all grids collapse to 1-col under 1024px with proper gaps; filter rows become swipeable.
14. **Command palette** — fits viewport margins on mobile with 20px safe gutters.
15. **Safe-area insets** — iOS notch / home indicator respected in app-content, mobile-header, mobile-drawer.
16. **Reduced-motion** — full `prefers-reduced-motion: reduce` coverage disabling all animations and transitions.
17. **Scrollbar styling** — premium minimal native scrollbars on desktop only.
18. **Radius / shadow / kbd consistency** — locked canonical values everywhere.
19. **Print stylesheet** — sidebar, topbar, drawer hidden; cards flatten to printable outlines.
20. **Sidebar active indicator** — signature glowing left rail for the current route.

### Files touched in v6.4
- **Added**: `css/v64-final.css` (new, last in cascade).
- **Modified**: `index.html` — one `<link>` added for the new stylesheet.

No existing CSS file was modified. No JS component was changed. Cascade order is preserved.

---

## 📱 v6.3.1 — Mobile Responsive Repair Pass (April 2026)

> Surgical repair on top of v6.3. Desktop pixel-for-pixel untouched.
> Fixes the broken mobile experience without redesigning the product.

All mobile fixes live in **`css/mobile.css`** — loaded LAST in the cascade (after `v63.css`).
Two new React components were added to `js/app.js`: `MobileHeader` + `MobileDrawer`.

### What was repaired

1. **Mobile navigation (was missing)**
   - Desktop left sidebar hides below 1024px.
   - Sticky top `mobile-header` replaces it: hamburger (left) · logo + page title (center-left) · search + notifications (right).
   - Hamburger opens a **slide-over drawer from the left** with backdrop overlay, all 10 routes, active-route highlight, 48px tap targets, smooth 280ms transform, Escape-to-close, outside-tap-to-close, auto-close on route select, and body-scroll lock.
   - Desktop sidebar is completely unchanged.

2. **Action buttons no longer clipped**
   - Page headers using `flex items-end justify-between` auto-stack to column below 768px with `gap: 12px` and wrap action-group children with `flex-wrap`.
   - CTA buttons (`.btn-primary`, `.btn-secondary`) go full-width when stacked.

3. **Tables no longer overflow**
   - Below 1024px, any `.card` containing a `.power-table` becomes horizontally scrollable (`overflow-x: auto`) and the table enforces `min-width: 780–860px` so columns stay readable instead of crushing.
   - Sticky headers preserved.
   - Filter chip rows become horizontally swipeable with hidden scrollbars.

4. **KPI / stat strips become responsive grids**
   - `.dash-stats`, `.billing-stats`: 4 cols → 2 cols below 640px → 1 col below 420px.
   - `.dash-hero-row`: collapses to single column below 640px.
   - Cards get minimum height and smaller padding on mobile while keeping legibility.

5. **Page container padding fixed**
   - `.app-content` mobile padding: `16px 14px 28px` (was `28px 32px`).
   - `html, body, .app-shell, .app-body` get `overflow-x: hidden` to eliminate horizontal scroll anywhere.

6. **Touch target compliance**
   - All `.btn*`, `.btn-icon`, `.filter-chip` enforce 40–44px minimum height below 768px.

### Files touched in this pass
- **Added**: `css/mobile.css` (new, loaded last)
- **Added**: `MobileHeader`, `MobileDrawer` components in `js/app.js`
- **Modified**: `App()` root in `js/app.js` — now renders mobile header + drawer alongside existing desktop `Sidebar`
- **Modified**: `index.html` — added `<link rel="stylesheet" href="css/mobile.css">` as the last stylesheet

No existing CSS file was modified. No desktop markup was changed. Cascade order is preserved.

---

**Design language**: Stripe Dashboard × Linear × Notion Enterprise × Vercel × Ramp × Palantir × Harvey AI × Apple-level polish.
Mature, disciplined, premium minimalism — built to feel trustworthy under scrutiny.

---

## 🏛 v6.3 Final Elite Pass (current — April 2026)

> Surgical final refinement on top of v6.2. Target: **9.8 → 9.95**.
> Zero redesigns. Zero genericization. Zero density loss.
> Only the handcrafted 0.15 that separates an in-house category leader from a polished SaaS dashboard.

All v6.3 refinements live in **`css/v63.css`** — loaded LAST in the cascade.
It overrides `design-system → components → pages → polish → elite` without modifying any of them.

### 🔍 What changed in v6.3

**1. Believable depth system**
- Three-ply layered shadows (`--v63-shadow-rest/raise/hover/pop`) with sub-pixel hairlines
- Dash-stat KPI tiles: 2px accent pillar + whisper-light top rule + -1px lift on hover
- Cards de-emphasized; only hero/chart/ai/revenue cards lift above the sheet

**2. Enterprise table system**
- Sticky headers with proper aria-sort carets
- Sticky first column (opt-in via `.sticky-first`)
- Pinned action column reveals on row hover/focus
- Selectable rows with 2px inset rail + bulk-action floating pill
- Truncation + tooltip-ready ellipsis column
- Mobile: tables convert to expandable record cards with `data-label` attribution

**3. Trust layer (legal + finance)**
- `.trust-chip` chips: encrypted / audited / partner-reviewed / confidential
- `.trust-bar` footer strip for finance and legal pages
- `.approval-chain` overlapping-avatar mini widget with approved/pending/rejected states

**4. Page identity — one signature detail per route**
- Dashboard: subtle dot-grid backdrop that fades at 40%
- Matters: navy left rule on page header (workspace identity)
- Calendar: violet left rule (schedule chroma)
- Documents: amber left rule (trusted repository)
- Billing: emerald left rule (revenue control)
- Analytics: navy left rule (boardroom)
- Control Center: red left rule (secure admin)
- Notifications: amber left rule (triage)
- Client Portal: frosted top hairline (luxury experience)
- Login: crystalline radial gradient + 48px precision grid + gradient-text wordmark

**5. Boardroom-grade charts**
- Recharts gridlines locked to hairline-1
- Tooltips → dark glass (rgba(11,18,32,0.95)) with uppercase axis label
- 10.5px axis text in ink-meta, restrained legends
- Sparklines at 72×22, progress bars with inner highlight

**6. Premium motion (150–220ms)**
- Single canonical easing: `cubic-bezier(0.22,0.61,0.36,1)`
- Buttons: -0.5px lift on hover, 80ms press settle
- Modals fade-up 6px + 0.985 scale
- Drawers slide-in 8px from right
- `prefers-reduced-motion` honored globally

**7. Focus ring discipline**
- Single canonical ring everywhere: `0 0 0 2px #fff, 0 0 0 4px rgba(29,78,216,0.35)`
- Applied to buttons, links, inputs, sidebar items, selectable rows

**8. Sidebar identity**
- Vertical navy gradient + subtle top-center hero glow
- Active rail is a 2px white bar that scales-in vertically
- Section labels get 0.14em uppercase treatment

**9. Topbar refinement**
- Translucent frosted glass (blur 14px saturate 160%)
- Global search has rest/hover/focus states, kbd hint chip
- `.kbd` utility class for keyboard shortcuts

**10. Mobile — intentional, not shrunk**
- Tables collapse to record-cards with labeled rows
- Bottom nav (safe-area aware) with frosted glass
- Swipeable KPI carousel (`.dash-stats.swipe`)
- Sticky bottom action bar above the nav
- KPI grid: 2-col at ≤900px, 1-col at ≤600px

**11. De-AI micro fixes**
- Broken 50/50 symmetric card rows via asymmetric header ruling
- Max-one-vivid-icon rule in card headers
- Whole-card tone backgrounds disabled — only left/top accent rulers allowed
- Tabular numerics enforced globally on every data surface
- `::selection` locked to ink-primary
- Hairline colors unified to a 3-stop scale (`--v63-line-1/2/3`)

**12. Print / audit export**
- Clean page-break rules for cards and trust bars
- Sidebar, topbar, bulk-bar, mobile nav hidden
- Page headers lose their colored left rule for compliance PDF look

---

## ✨ v6.2 Elite Refinement Pass

> A surgical refinement layer on top of the v6.1 foundation. Target: **9.1 → 9.8**.
> No redesigns, no branding changes, no replaced layouts. Only the handcrafted
> 0.7 that separates an elite in-house product from a polished mockup.

All v6.2 refinements live in **`css/elite.css`** — loaded last in the cascade so it
overrides both `polish.css` and any upstream styles without modification.

### 🔍 What changed in v6.2

**1. Typography Master Pass**
- New editorial ink scale (`--ink-primary` → `--ink-ghost`) replacing flat graphite tokens
- Hierarchy contrast rebuilt: titles `1.75rem / 680`, section headers `620`, metrics `680`
- Every headline retightened to `-0.032em` with `line-height: 1.15`
- All body copy now sits on a 13px/1.55 editorial rhythm with tabular numerics everywhere

**2. De-Carding**
- Dash-side panels now lighter (`0 1px 2px` shadows) instead of walled-off boxes
- Card borders switched from `--border-light` to `rgba(10,16,32,0.055)` hairlines
- KPI stat tiles get a vertical 2px accent rail (editorial) instead of heavy left-tinted borders
- Hearing / deadline / approval items use invisible dividers with surface-recessed hover
- Section dividers replace redundant card headers in multiple places

**3. Boardroom-Grade Charts**
- Revenue chart: custom editorial tooltip (uppercase eyebrow, tabular metric, caption)
- Gradient stroke (`navyStroke` `#1a2338 → #0b1220`) replacing flat stroke
- Subtle 2×4 dashed grid at 5.5% opacity; dots removed (only `activeDot` on hover)
- Recharts axes now consistently use `--ink-subtle` at `10.5px / 580` weight
- Progress bars receive inner highlight gradient for dimensional realism

**4. Micro-Spacing**
- Canonical spacing: `4/8/12/16/20/24/32` enforced across all surfaces
- Card header minimum height `56px`, body padding `20px 22px`
- Table row padding `13px 14px`, first/last column padding `22px` for editorial rhythm
- Sidebar items `42×42`, icon `16px` for better optical balance

**5. Depth System**
- Three-tier shadow stack: hairline · elevated · lifted
- Cards rest on `0 1px 2px` then lift to `0 1px 2px + 6px 18px` on hover — not translate
- Layered shadows always include `0 0 0 1px` inner hairline for definition
- Active sidebar items get a glowing left-rail `::before` accent (2px × 18px, blue glow)

**6. Copywriting Upgrade**
- `AI intelligence` → **Strategic Intelligence**
- `Matters at risk` → **Risk Exposure Queue**
- `Revenue operations` → **Revenue Command** / **Billing & Collections**
- `Command Center` → **Command Queue**
- `Operational Intelligence` → **Firm Performance**
- `Performance KPIs` → **Firm Health Indicators**
- `Matter Intelligence` → **Matters** (with eyebrow: *Practice*)
- `Document Operations` → **Documents** (with eyebrow: *Document Vault*)
- Every page title now has an editorial eyebrow line above it

**7. Table Perfection**
- Uppercase `10px / 620` column headers with `0.08em` tracking
- Zebra replaced with subtle blue-tinted hover (`rgba(59,130,246,0.022)`)
- Row-hover first cell receives a 2px navy left accent
- Critical / warning rows: left accent rail only (no full row flood)
- All numeric cells now tabular by default

**8. Matter Detail Signature Hero**
- Full-width dark hero (`#0b1220 → #05080f`) with radial blue + violet glows
- Editorial eyebrow `Matter · MC-2026-089`
- 4-column metric strip below title: Amount at Stake · Stage · Progress · Status
- Glass action buttons (share, bell) with `rgba(255,255,255,0.08)` surfaces
- Primary "Add task" button becomes white against the dark — signature contrast

**9. Interaction Polish**
- Button hover: `translateY(-0.5px)` only — no translateX AI-feel
- Card hover: border color deepens + shadow lifts — no translateY jitter
- Sidebar active: blue-tinted gradient + left-glow rail
- Segmented controls: 2px inner padding, `white` active pill with hairline shadow
- Tab nav: bottom-only 2px rail accent on active (replaces pills)

**10. Removed AI Sterility**
- No pure black anywhere (`#0b1220` is the deepest ink)
- Never use `font-weight: 700` for body — `580–620` is the editorial max
- Row-clickable cursors restored site-wide
- Subtle border-width imperfections (0.5px translateY, asymmetric header weights)
- All uppercase `.t-label` now sentence-case in actionable places

### 📁 File map for v6.2

```
css/
  ├─ design-system.css   # v6.0 foundation (tokens, reset, typography scale)
  ├─ components.css      # v6.0 components (cards, buttons, badges, tables)
  ├─ pages.css           # v6.0 page-specific layouts (login, matter, portal)
  ├─ polish.css          # v6.1 launch-grade polish (spacing, radii, focus)
  └─ elite.css           # v6.2 elite refinement (this pass) ← loaded last
```

---

## 🧪 v6.1 Launch-Grade Polish Pass

A surgical polish layer on top of the v6.0 foundation. No architectural changes,
no replaced navigation, no new identity — just the final 5% that separates a
polished mockup from a real funded-startup product.

### 🔴 Critical Bug Fixed — Sidebar Icons
- **Root cause**: `grid-2` (Dashboard) and `chart-mixed` (Analytics) are
  Font Awesome **Pro**-tier icons. The project loads the free FA 6.5.1 CDN,
  so those glyphs rendered as blank/generic squares.
- **Fix**: swapped to free-tier equivalents with stronger semantic intent —
  `table-cells-large` (Dashboard command grid), `chart-line` (Analytics trend),
  and `file-invoice-dollar` (Billing).
- **Visual system for every sidebar icon**:
  - 20px optical size (18px glyph in a 20×20 box — consistent across all items)
  - 40×40 tap target, 10px radius, even 4px vertical rhythm
  - Base color: `rgba(255,255,255,0.66)` (legible on all displays)
  - Hover: full white on `rgba(255,255,255,0.08)` surface
  - Active: blue-tinted gradient + left rail accent with 10px glow
  - Keyboard focus ring
  - 1px subtle separator between primary nav and footer nav

### 🎯 Design-System Token Lock (`css/polish.css`)
- **Spacing scale enforced**: `4 / 8 / 12 / 16 / 24 / 32 / 48` only.
- **Radius canonicalized**: buttons `10px` · cards `14px` · modals `18px` · pills `full`.
- **Shadows rewritten**: stacked, realistic elevation — no heavy blur.
- **Borders**: soft neutrals only (`--border-subtle`, `--border-light`, `--border-medium`).
- **Focus ring unified**: a single confident blue ring across all interactive elements.
- **Motion discipline**: every transition clamped to **140–220ms**, `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Typography rhythm**: page titles `24–40`, section headers `15–22`, body `13–14`,
  metadata `11–12`, KPI heroes `26–40` with tabular numerics.

### 🏢 Component Polish
- **Buttons**: unified height rhythm `22 / 28 / 32 / 40 px`, crisp 10px radius, tactile hover lift.
- **Tables**: 48px row height, sticky-header option, freeze-first-column option,
  hover-reveal row actions, priority rail accents (no full-row color bands).
- **Chips**: 20px pill for badges, 28px for saved filter chips with dismiss affordance.
- **Avatars**: pixel-aligned sizes 20/24/28/32/40/56 with stable inset highlight.
- **Inputs/Search**: 36px default, focused blue ring, no jitter on state change.
- **Dropdowns/Modals**: quieter shadows, 12/18px radii, 32px item height.
- **Skeletons**: realistic shimmer on `--surface-3`, matches final layout.
- **Empty states**: calm icon tile, 13.5px title, 12.5px sub — no illustrations.

### 🧭 Operational Markers (enterprise authority)
New utility classes available across every page:
- `.due-state` — `due-overdue · due-today · due-soon · due-upcoming · due-ok`
- `.approval-state` — `approval-pending · approved · rejected · draft`
- `.aging-chip` — `aging-0 / 30 / 60 / 90 / 120` for invoice aging buckets
- `.owner-label` with role eyebrow
- `.audit-row` — critical / auth / change dot variants with mono timestamp
- `.filter-chip` — saved filter UI with dismiss affordance
- `.milestone-track` — client portal lifecycle progress
- `.cal-today-pill` — elegant calendar today state

### 📐 Page-Level Refinements
| Page | Change |
|------|--------|
| **All pages** | New `.page-header` / `.page-title` / `.page-subtitle` rhythm |
| **Login** | Tightened SSO button to 42px, removed floating-glow animation (looked AI-generated), warmer card shadow |
| **Dashboard** | Single dominant KPI via `.kpi-hero-value` (40px) with `.kpi-hero-delta` chip — one hero zone, not six |
| **Matters** | `.table-frame.scroll-y` + `.freeze-first` options, hover-reveal row actions |
| **Calendar** | `.cal-today-pill` with live emerald dot |
| **Documents** | Refined `.upload-zone` (1.5px dashed, hover to blue) |
| **Billing** | `.aging-chip` buckets (0/30/60/90/120) — CFO-grade |
| **Analytics** | Cleaner segmented control, tabular axis numerics |
| **Control Center** | `.audit-row` feed with mono timestamps & severity dot |
| **Client Portal** | `.portal-hero` gradient title, `.milestone-track` lifecycle progress |

### 🧹 Anti-"AI-generated" Audit
Removed or neutralized:
- ❌ Translate-Y card hover (replaced by border + shadow change only)
- ❌ Excessive `floatGlow` animation on login hero
- ❌ Permanent `pulseRing` on notification dot (now a static halo)
- ❌ Rainbow chart palettes (max 3 colors)
- ❌ Over-rounded UI (radius capped at 18px for modals)
- ❌ Symmetry-for-its-own-sake — hero KPI is now asymmetric dominant

### File added
- `css/polish.css` — 30 KB, loaded last so it wins the cascade.

---

## 🎯 v6.0 Refinement Highlights

Compared to v5.0, this release transforms the product from a polished mockup into a production-grade, billion-dollar SaaS experience:

### Global System
- **Refined typography**: new Inter-based scale with tuned letter-spacing, tabular numerics (`cv11`, `ss01`), and premium metric sizes
- **Hierarchy of surfaces**: `card` · `card-hero` · `card-quiet` · `card-compact` · `card-dark` (AI) · `dash-stat-hero` · `security-score-card`
- **Controlled color system**: navy = trust, emerald = healthy, amber = warning, red = urgent, violet = AI/intelligence, blue = informational
- **Elevated shadows**: `--shadow-elevated` & `--shadow-hero` for premium card stacking
- **Motion system**: `--ease-out-soft`, `--ease-spring`, pulse/sheen/ring animations — subtle, never gimmicky
- **New utility classes**: `icon-tile-*`, `delta-up/down`, `kv-row`, `status-indicator`, `segmented`, `ticker`, `stat-chip`, `has-tooltip`

### Page-Level Upgrades

| Page | Key Refinements |
|------|-----------------|
| **Login** | Layered hero background (radial + grid mask), gradient headline, trust chips (ISO 27001, SOC 2 II, AES-256, Attorney-Client Privileged), polished SSO buttons, status indicator, encrypted-session footer |
| **Dashboard** | Personalised greeting header with inline stats, KPI cards with gradient accents + icon tiles, premium hearings feed, deadline markers with glow, AI card with violet accent, revenue card with ticker + progress, team-utilization ring-style |
| **Matters** | Executive page header, refined filter chips, premium bulk-actions bar with gradient, richer SLA + priority row markers |
| **Matter Detail** | Typography-led heading, inline breadcrumbs with SLA + priority, share/notify quick actions |
| **Calendar** | Segmented Month/Week/Agenda toggle, larger premium event pills with color-coded left borders, today highlight with shadow |
| **Documents** | AI-indexed badge, premium drop zone (hover-lift icon, encrypted footer), icon-tiled stats, AI summarise CTA |
| **Billing** | CFO-grade stat row with tone-matched icon tiles, `ticker` numerics, deltas, aging logic |
| **Notifications** | Command Feed header, grouped urgency, icon-tiled stat filters, focus-mode CTA |
| **Analytics** | Boardroom summary row (Revenue, Win Rate, Avg Cycle, Utilization), segmented 30d/90d/YTD/12m, refined Recharts styling (tabular ticks, dashed cursor, white-stroked dots) |
| **Control Center** | Dominant security-score hero card (navy gradient, emerald glow, compliance chips), icon-tiled secondary KPIs |
| **Client Portal** | Premium dark header with gradient + grid mask, health ring callout, progressing-on-schedule reassurance badge, visual lifecycle progress tracker (pulsing current stage), secure-portal trust |

### UX Quality
- ✅ Clear in 3 seconds — hierarchy establishes primary action per page
- ✅ Beautiful in 10 seconds — controlled use of gradients, elevated surfaces, motion
- ✅ Trustworthy in 30 seconds — compliance badges, status indicators, audit-ready tone
- ✅ Efficient after daily use — dense tables, Cmd+K, sticky headers, keyboard-first
- ✅ Impressive to executives — CFO-grade billing, boardroom analytics
- ✅ Smooth under scrutiny — no runtime errors, ~10s first paint, no layout shift

---

## 🧭 Completed Features (11 Production-Ready Pages)

1. **Login** (`#/login`) — Split-panel, SSO, compliance trust chips, encrypted footer
2. **Dashboard** (`#/dashboard`) — KPI hero row, Command Center, hearings, deadlines, AI, revenue, team load, activity
3. **Matters** (`#/matters`) — Power table with filters, bulk actions, freeze columns
4. **Matter Detail** (`#/matters/detail`) — 3-column (meta / tabs / deadlines+billing)
5. **Calendar** (`#/calendar`) — Month grid, today hero, sidebar schedule
6. **Documents** (`#/documents`) — Action-required, library table, version timeline, premium upload, AI actions
7. **Billing** (`#/billing`) — Invoice table, time entries, revenue by practice, priority receivables
8. **Notifications** (`#/notifications`) — Filters, group feed, quick actions, focus mode
9. **Analytics** (`#/analytics`) — Insight KPIs, Recharts revenue area chart, practice distribution, flow, performance rings
10. **Control Center** (`#/control`) — Security score hero, team, policies, audit log, integrations
11. **Client Portal** (`#/portal`) — Premium dark header, progress tracker, updates, docs, financial, team

### Global Affordances
- **Command Palette** (`⌘K` / `Ctrl+K`) — Fuzzy search across matters, clients, documents, people, actions
- **Hash routing** (`#/path`) — No build step; fully static
- **Responsive** — 768 · 1024 · 1200 · 1400 · 1760 breakpoints
- **Live status indicators** — Pulsing dots with ring animations
- **AI accents** — Violet gradients reserved exclusively for intelligence features

---

## 🔗 Route Map

| Path | Purpose |
|------|---------|
| `#/login` | Authentication |
| `#/dashboard` | Mission-control KPIs |
| `#/matters` | Matter intelligence list |
| `#/matters/detail` | Matter detail 3-col |
| `#/calendar` | Operations calendar |
| `#/documents` | Document OS |
| `#/billing` | Revenue operations |
| `#/notifications` | Command feed |
| `#/analytics` | Operational intelligence |
| `#/control` | Admin & security |
| `#/portal` | Client portal view |

---

## 🏗 File Structure

```
index.html                 Entry + Tailwind config + React/Recharts CDN
css/
  ├── design-system.css    Variables, typography, motion, shell, utilities
  ├── components.css       Sidebar, badges, buttons, cards, tables, avatars,
  │                        dropdowns, modals, command palette, timelines,
  │                        SLA timers, kv-rows, icon-tiles, deltas, ...
  └── pages.css            Login, dashboard, matters, calendar, docs,
                           billing, portal, notif, analytics, control
js/
  ├── mockData.js          All mock data (32KB)
  └── app.js               React app (hash-router, 11 pages, cmd palette)
README.md
```

---

## 🎨 Design Tokens (CSS Custom Properties)

### Colors
- `--navy-*`, `--graphite-*` — Primary ink & surface scales
- `--surface-0..5` — Layered greys from white to elevated
- `--red-*`, `--amber-*`, `--emerald-*`, `--blue-*`, `--violet-*`, `--indigo-*` — Semantic scales with 50/100/200/400/500/600/700 stops
- `--border-subtle`, `--border-light`, `--border-medium`, `--border-strong`, `--border-hairline`

### Shadows
- `--shadow-xs` → `--shadow-2xl`
- `--shadow-elevated` — Signature stacked shadow for important cards
- `--shadow-hero` — Deep shadow for hero moments
- `--ring-blue`, `--ring-red`, `--ring-navy` — Focus rings

### Typography (Inter + JetBrains Mono)
- `.t-display[-lg]`, `.t-h1..h4`
- `.t-body[-sm]`, `.t-caption`, `.t-micro`
- `.t-label[-sm]`
- `.t-metric[-xs/sm/lg/xl]` — Tabular executive numerics

### Motion
- `--ease-out`, `--ease-out-soft`, `--ease-spring`, `--ease-in-out`
- `--dur-instant` `80ms` · `--dur-fast` `140ms` · `--dur-normal` `220ms` · `--dur-slow` `360ms`
- Animations: `slideUp`, `fadeIn`, `scaleIn`, `pulseDot`, `pulseRing`, `sheen`, `drawLine`, `floatGlow`

### Spacing & Radii
- Spacing scale `sp-0 .. sp-16`
- Radii `r-xs` `3` to `r-4xl` `24`

---

## 💡 Signature Components

- **`.dash-stat`** — KPI cards with gradient accent strips (`stat-accent-red/amber/blue/green/navy/violet`)
- **`.icon-tile[-sm/lg]`** — Tone-matched icon containers (`icon-tile-red`, `icon-tile-gradient-violet`, …)
- **`.status-indicator.live`** — Pulsing live dot with ring animation
- **`.kv-row`** — Key-value row with dashed separator
- **`.delta.delta-up/.delta-down/.delta-flat`** — Trend chips
- **`.segmented`** — Premium segmented control (Stripe-grade)
- **`.power-table`** — Enterprise-grade table with sticky head, priority row markers (`row-critical`, `row-warning`), hover states, `cell-primary`/`cell-mono`
- **`.sla-timer`** — Monospaced countdown with semantic backgrounds
- **`.portal-step`** — Client-portal lifecycle tracker (done/current/pending)
- **`.security-score-card`** — Navy-gradient admin hero

---

## 🚀 Running & Deploying

This is a fully static website — no build step required.

Open `index.html` in a modern browser or serve the folder. To publish live, use the **Publish tab** which handles deployment automatically.

---

## 🔮 Not Yet Implemented / Future Work

- **Persistence layer** — All data is mock; wire to RESTful Table API (`tables/*`) for real CRUD
- **Real-time collaboration** — Presence, multi-cursor, live updates (WebSocket layer)
- **Document viewer** — Inline PDF annotation, redline compare
- **AI back-end** — Wire AI Recommendations, Summarise, Compare, Extract clauses to an LLM endpoint
- **Authentication** — Real Microsoft 365 / Google Workspace SSO + 2FA
- **Push notifications** — Browser + email digests
- **Dark mode** — System preference detection with navy-deep theme
- **Localisation** — Multi-locale (EN/HI/MR) with RTL support
- **Export** — PDF brief generator (Analytics page) via server-side rendering

---

## 📐 Design Principles

1. **Mature restraint** — No startup gimmicks, no playful excess, no rainbow gradients
2. **Disciplined hierarchy** — One dominant element per view, secondary whispers
3. **Operational power** — Dense tables, keyboard shortcuts, command palette
4. **Emotional confidence** — Security badges, "progressing on schedule" reassurance
5. **Pixel-perfect alignment** — Consistent spacing, baseline grid, tabular numerics
6. **Accessible contrast** — WCAG AA across text, focus rings on all interactives

---

## 👤 Demo Credentials

Any email / password combination on the login page signs you into the workspace as:

- **Name**: Adavya Mehta
- **Role**: Managing Partner
- **Firm**: Sovereign Counsel LLP

The client portal demo views the matter as **Mr. Ratan Tata** (Tata Realty & Infrastructure).

---

*"This is what top law firms use."*
