# SERVENA — UI/UX Design Brief & Design System

> **SERVENA — The Operating System for Modern Restaurants**
> The canonical UI/UX design contract for Phase 1: one design system, composed into every screen. It defines **how things look, read and behave**; it adds no product behaviour.

## 1. Document Control

| Field | Value |
|---|---|
| Document | SERVENA UI/UX Design Brief & Design System |
| Version | **v1.0 — APPROVED FOR DOWNSTREAM IMPLEMENTATION** |
| Status | **APPROVED FOR DOWNSTREAM IMPLEMENTATION** — the UI/UX Design Brief is complete and is the canonical frontend design authority for SERVENA development. This does **not** start frontend implementation. Approval basis: the §22 audit (31 checks, all PASS), 2026-10-07 |
| Date | 2026-10-07 · amended 2026-10-08 (OD-UX-3, OD-UX-9 and the re-fire part of OD-UX-8 reconciled with the product owner's decisions PO-1…PO-6) · **hardening pass 2026-10-08** (§22.1: financial-UX, KDS, accessibility, chart-token and shadcn-mapping fixes; no palette or visual redesign) |
| Upstream (canonical) | SPEC.md **v1.3** · docs/product/PRD.md **v1.2** · docs/APP_FLOW.md **v1.4** · docs/TRD.md **v1.0** |
| Downstream | Implementation Plan → Implementation (frontend) |
| Audience | Frontend developers · AI coding/UI agents · QA · product owners · design reviewers |
| Code changed | **None.** Documentation only. |

### 1.1 Classification tags (Part 17)

Every material decision carries exactly one tag.

| Tag | Meaning |
|---|---|
| **[SPEC]** / **[PRD]** | Defined by the product specification / requirements (cited by id) |
| **[APP_FLOW]** | Defined by the Application Flow: flows (`AF-nnn`), screens (`SCR-nnn`), navigation (`NAV-nnn`), behavioural contracts (`C-xxx`), gaps (`NAV-GAP-nnn`) |
| **[TRD]** | A technical contract the UI must honour (`TD-*`, `§`) |
| **[DESIGN]** (= **[DESIGN DECISION]**) | A UI decision made here because upstream is silent; the minimum reasonable choice; **never a product requirement**. `[DESIGN]` and `[DESIGN DECISION]` are the same classification in this document |
| **[ASSUMPTION]** | A working assumption about context (device, locale, brand) that is not upstream-defined; changing it changes tokens or layout, never behaviour |
| **[OPEN DECISION]** | Would affect product behaviour or an undecided upstream item; **not decided here**; the design is neutral and the affected piece is marked blocked (§18.3) |

Rules: a `[DESIGN]` / `[DESIGN DECISION]` item is never cited as a requirement; no tag means "restates an upstream rule" and the id is given.

### 1.2 Identifier schemes

`DT-*` design tokens · `CMP-*` components · `PAT-*` shared UX patterns · `TPL-*` screen templates · `SCR-nnn` APP_FLOW screens (unchanged ids) · `DDR-*` design decision records (§19) · `OD-UX-*` open UI decisions (§18.3). Upstream ids (`AF-`, `NAV-`, `C-`, `INV-`, `PB-`, `TD-`) are used as defined there.

### 1.3 Authority of this document

> **The SERVENA UI/UX Design Brief is the canonical visual and interaction design authority for the SERVENA frontend.**

It governs the visual and reusable UI system used throughout the **entire application**. It is a **development design contract**, not a mood board, a set of screen sketches, or optional recommendations: future frontend implementation agents **must** use it as their design-system source of truth, and **must follow** it.

| Question | Authority |
|---|---|
| *What the product does* (behaviour, permissions, states, money rules, scope) | SPEC → PRD → APP_FLOW → TRD. This brief **never** changes it |
| *How it looks, reads and is operated* (tokens, components, patterns, layout, wording, accessibility, responsive behaviour) | **This brief** |
| A conflict between the two | Upstream wins; the conflict is recorded (§2.4); the brief is corrected |
| A UI need this brief does not cover | The implementation agent **must not silently invent** a visual convention when an existing SERVENA pattern can be reused; otherwise follow §21 |

**Components defined in the SERVENA Design System are application-wide reusable components.** They are not screen-specific components.

**Global coverage (the 20 items every screen consumes)** — no screen may create its own independent visual system:

| # | Global element | Defined in | # | Global element | Defined in |
|---|---|---|---|---|---|
| 1 | Colour system | §4.2–4.3 | 11 | Shadow / elevation | §4.8 |
| 2 | Typography system | §4.4 | 12 | Motion | §4.9 |
| 3 | Font family | §4.4 | 13 | Density | §4.10 |
| 4 | Font weights | §4.4 | 14 | Iconography | §4.12 |
| 5 | Font sizes | §4.4.1 | 15 | Responsive breakpoints | §13.1 |
| 6 | Line heights | §4.4.1 | 16 | Accessibility | §14 |
| 7 | Letter spacing | §4.4.1 | 17 | Component states | §5.2 (GC-1), §4.2 |
| 8 | Spacing scale | §4.5 | 18 | Form conventions | §5.4, §10 |
| 9 | Border radius | §4.6 | 19 | Status semantics | §4.2, D-01 |
| 10 | Border system | §4.7 | 20 | Common content conventions | §10 |

The system applies identically to **Owner, Manager, Cashier, Waiter, Kitchen Staff, Customer and SuperAdmin**. Customer-facing experiences use a different *layout/composition* (CustomerShell, single column) but the **same tokens, components and design language**.

---

## 2. Source Authority, Codebase Inspection, Upstream Constraints

### 2.1 Hierarchy and conflict rule

```
SPEC → PRD → APP_FLOW → TRD → UI/UX DESIGN
```

UI/UX may not contradict upstream. A conflict is **never silently resolved**: it is recorded in §2.4, the higher authority is preserved, and no behaviour is invented.

### 2.2 Existing codebase inspection (performed)

| Item | Finding |
|---|---|
| `frontend/` | **Empty** — contains only `.gitkeep` (tracked). No React app, no `package.json`, no Vite/Tailwind config, no shadcn/Radix usage, no components, CSS variables, typography, layout, icon library, form/table/loading/error conventions. |
| Backend conventions that affect UI contracts | Response envelope `{statusCode,status,msg,type,data}`; error `type`/`data.code`/`data.factor` (TRD §16.3); `X-Outlet-Id`, `Idempotency-Key`, `rev` (TRD §16, §19, §38); money as integer paise (TRD ADR-009). The UI consumes these; it does not alter them. |
| Conclusion | **No existing frontend design system was available.** This brief establishes the new canonical SERVENA system. No convention is claimed to pre-exist. |

### 2.3 Upstream contracts the UI must honour (digest)

| # | Contract | Source | UI consequence |
|---|---|---|---|
| U1 | **Authorization is five-factor and server-side**; UI hiding is not security; a denial names the failed factor and shows no other-outlet data | RBAC-002/007/016, C-REFUSAL, TRD §13 | Actions are rendered from **effective permissions**, never from role names; every refusal uses one PermissionDenied/inline-refusal pattern (PAT-11) |
| U2 | **Working outlet** is explicit and single; Owner/Manager choose, others fixed | AUTH-008, C-OUTLET, TRD TD-TENANT-1 | Outlet context is always visible in the shell; all caches are outlet-keyed; changing outlet is deliberate |
| U3 | **Pending / failed / succeeded — never a false success**; retries safe; duplicates return the existing result | OFFLINE-002, C-POST, C-SESSION, TRD §19.7 | One SubmissionState pattern (PAT-14); success shown only after server acknowledgement |
| U4 | **Realtime events are hints; REST is truth**; disconnected KDS shows a disconnected state; resync on reconnect | TRD §17.6, KDS-016 | One ConnectionStatus + Stale-data pattern (PAT-15/16) |
| U5 | **Offline queue only for staff order commit and add-items**; everything else needs the server | TRD TD-OFF-1 | Ineligible actions are disabled with a reason while offline; never queued silently (PAT-14) |
| U6 | **Concurrency outcomes are designed states**: `REV_MISMATCH`, `ALREADY_IN_STATE`, `PRICE_CHANGED`, `ITEMS_UNAVAILABLE`, `CONFIRMATION_REQUIRED` | TRD §16.3, TABLE-008, MENU-015 | Dedicated message/recovery per outcome (PAT-17) |
| U7 | **Money is integer paise**; no floats; round-off is a separate line; totals are server-computed | TRD ADR-009, §25.4, PO-TRD-01 | One `Money` component; inputs parse to integer paise at the boundary; no client arithmetic on totals |
| U8 | **Takeaway** is shown on every surface for a no-table order | ORD-004, INV-14, HANDOFF-003 | OrderTypeTag mandatory in every order view, KDS card and bill |
| U9 | **AI is never operational truth**; facts ≠ recommendations ≠ actions; sensitive actions need explicit confirmation in a separate step | AI-004/021/029, TRD §31 | Information-kind system (§9.10); proposals are cards with a distinct confirm control |
| U10 | **Customers have no accounts/OTP**; table-QR asks no details; tableless QR/website ask name + phone; abandoned Drafts are never offered back; WhatsApp tracking is deferred | ORD-021/030/042/094, AUTH-009, DF-15 | Customer shell flows exactly as APP_FLOW §29.3.G; no resume-cart UI |
| U11 | **Closed ≠ Day-closed ≠ Suspended**; Closed blocks new business only; QR on suspended restaurant → blocked notice | ORG-021…034, ONB-014/016, TRD §28 | Distinct OutletStatus vs DayStatus vs platform-status visuals and wording |
| U12 | **No notification centre, profile page, settings page, tab bar or sidebar is defined upstream**; navigation structure is UI/UX | APP_FLOW §29.0, C-NAV, NAV-GAP-026/007 | The shell offers only destinations of §29.2; none is invented (§6) |
| U13 | **Set-first-password step** reachable from the invitation link inside the SCR-001 entry, not a new destination | TRD TN-1, §12.5 | SCR-001 has a second mode (§16, SCR-001) |
| U14 | **Reasons are mandatory** on cancellation, rejection, void, reopen (bill/day) | INV-16, ORD-089, BILL-014, DAY-018 | ReasonPicker (category + optional text, TD-ORD-5) in every such flow |
| U15 | **Day-aware wording**: "today" = business day since last Day Close; never midnight | DAY-017, ANALYTICS-005 | Labels say "This business day", never "Today (00:00–23:59)" |

### 2.4 Upstream inconsistencies and gaps discovered

None of these is silently resolved; each lists the preserved authority and the UI treatment.

| # | Observation | Higher authority preserved | UI treatment |
|---|---|---|---|
| I1 | The task asks for a **notification centre, profile, settings, breadcrumbs** in the shell; APP_FLOW §29.0 states no role has a defined sidebar/tab bar/breadcrumb/profile/settings/notification centre, and excludes an own-account screen (NAV-GAP-026) | APP_FLOW | The shell has a *user menu* (sign out, change working outlet, own availability) but **no profile/settings/notification-centre destination**. "Notification" is a transient realtime alert surface only (C-VIS). Breadcrumbs are an in-page orientation aid for nested views, **not** a navigation destination [DESIGN] |
| I2 | The task lists **ColumnVisibilityControl, DateRangePicker, BottomSheet, SplitPane** etc.; upstream requires none explicitly | PRD/APP_FLOW (no requirement) | Included only where a screen needs them (§5.10); the rest are explicitly omitted to avoid component sprawl |
| I3 | **SCR-057 "WhatsApp conversation"** is a destination in APP_FLOW but is rendered by WhatsApp, not by SERVENA's UI | APP_FLOW | The brief covers its **content conventions** only (§16, SCR-057); no screen is designed; tracking/status messages are not designed (DF-15) |
| I4 | RBAC-024 mentions Kitchen "station scope" while KDS-001/008 and C-STATION make the queue shared | Later decision (SOT-003) | KDS never hides or blocks items by station; station is a filter/grouping only (§12.1) |
| I5 | The Waiter "Served" action is **Waiter-only by default but Owner-grantable** (§15.0 canonical handoff rule) | APP_FLOW/SPEC | Handoff controls render from effective permission (U1), not "if role = Waiter" |
| I6 | "Partial" payment appears in some briefs; SPEC PAY-010 has only **Paid / Not Paid** | SPEC | PaymentStatusBadge shows only those two; "outstanding" and "overpaid" are amounts, "Split" is a derived label (§9.7) |
| I7 | Day state is **Running/Closed/Reopened**; outlet availability is **Open/Closed** — easily confused | SPEC ORG-022 | Separate components and wording (U11) |
| I8 | Several flows are **blocked by open product decisions** (TRD PB-2…19) | TRD §45.2 | The relevant screens/actions are designed as neutral shells and marked `[OPEN DECISION]` (§18.3); no behaviour is invented |

---

## 3. Design Principles  [DESIGN]

Principles are ordered; when two conflict, the earlier wins.

| # | Principle | What it means in SERVENA | Used to decide |
|---|---|---|---|
| DP1 | **Operational clarity first** | A staff member must read the state of an order, table, bill or day in under a second. Every state has text + icon + tone, never colour alone | Status system (§4.2, CMP-D) |
| DP2 | **Truthful state** | The screen shows what the server has acknowledged. Pending, failed, stale and offline are visible, never hidden (U3, U4) | PAT-14/15/16 |
| DP3 | **Predictability and consistency** | Same meaning ⇒ same component, tone, wording and position everywhere (§5.1 rules) | Reuse governance |
| DP4 | **Fast restaurant workflows** | Frequent actions are one or two taps; primary actions are large and reachable; no modal for routine acts | Density modes, touch targets (§4.10, §14) |
| DP5 | **Low cognitive load** | One primary action per view; progressive disclosure; consistent places for filters, actions and refusals | Templates (§16.1), patterns |
| DP6 | **Information density where needed** | Dense tables for administrators; roomy cards for touch/POS/customers; KDS optimised for distance reading | Density modes, KDS layout (§12) |
| DP7 | **Clear action hierarchy** | Exactly one `primary` button per region; destructive actions never share the primary style | Button system (CMP-F-01) |
| DP8 | **Error prevention before error messages** | Disable with a reason instead of letting the user fail; confirm irreversible/financial acts; show consequences | PAT-08/09 |
| DP9 | **Safe destructive and financial actions** | Reason + confirmation + consequence summary; no destructive act on a single tap; Back/Cancel never commits (C-BACK) | PAT-08, ConfirmationDialog |
| DP10 | **Fast scanning** | Left-aligned labels, right-aligned tabular numbers, stable column order, status at a consistent position | Typography numerics, DataTable |
| DP11 | **Accessible by default** | WCAG 2.2 AA, 44 px touch targets for operational controls, full keyboard operation, reduced-motion respect | §14 |
| DP12 | **Responsive by transformation, not shrinkage** | Each breakpoint re-composes the layout for the device the role uses (phone: waiter/customer; tablet: POS/waiter/KDS; desktop: owner/cashier) | §13 |
| DP13 | **AI is visibly secondary** | AI content is labelled, visually distinct, never inside operational tables, never the only source of a number | §9.10 |
| DP14 | **Professional, calm restaurant SaaS** | Neutral surfaces, one brand hue, restrained motion, no decoration that competes with status colour | Tokens §4 |

---

## 4. Global Design Tokens

**There is exactly one token set.** Screens and components consume tokens; they never introduce raw values (Rules 8–10, §5.1). No brand identity exists upstream, so the palette below is **approved as the SERVENA v1 design proposal** `[DESIGN DECISION]` (not `[SPEC]`/`[PRD]`/`[TRD]`); it can be re-skinned by changing **primitive** tokens only — no semantic, component or screen definition changes.

### 4.1 Token architecture  [DESIGN]

Three layers (primitive → semantic → component), the structure of the design-system skill used for this brief:

```
PRIMITIVE  (raw values)        --sv-indigo-700: #4338CA
      ↓
SEMANTIC   (purpose aliases)   --primary: var(--sv-indigo-700)     ← what screens and components use
      ↓
COMPONENT  (per-component)     --button-primary-bg: var(--primary)  ← optional, only where a component needs its own
```

Only semantic and component tokens appear in component specs. Light and dark are two **value sets** for the same semantic names. Theme follows the operating-system preference (`prefers-color-scheme`); there is no settings page to choose one (U12) `[DESIGN]`.

### 4.2 Colour tokens — semantic

All values below are the **light** set; dark values are in §4.3. Names are the contract.

**Brand** `[DESIGN]`

| Token | Light | Role |
|---|---|---|
| `--primary` | `#4338CA` | Primary actions, links, selected emphasis, focus ring |
| `--primary-hover` | `#3730A3` | Hover |
| `--primary-active` | `#312E81` | Pressed |
| `--primary-foreground` | `#FFFFFF` | Text/icon on `--primary` |
| `--secondary` | `#EEF0F4` | Secondary button surface, neutral fills |
| `--secondary-foreground` | `#334155` | Text on `--secondary` |
| `--accent` | `#0F766E` (teal) | Rare highlight (e.g. Reserved table tone, selected tab underline accent); **never** for status |

**Surfaces**

| Token | Light | Role |
|---|---|---|
| `--background` | `#F6F7F9` | App canvas |
| `--surface` | `#FFFFFF` | Cards, panels, tables, inputs |
| `--surface-sunken` | `#EEF0F4` | Table headers, wells, disabled fields |
| `--surface-elevated` | `#FFFFFF` + elevation | Popovers, menus, drawers, modals |
| `--overlay` | `rgba(15,23,42,0.50)` | Scrim behind modal/drawer |

**Text**

| Token | Light | Role |
|---|---|---|
| `--text-primary` | `#0F172A` | Body, headings |
| `--text-secondary` | `#334155` | Supporting text, table headers |
| `--text-muted` | `#5B6678` | Helper text, captions, placeholders (≥ 4.5:1) |
| `--text-inverse` | `#FFFFFF` | On solid tones and dark surfaces |
| `--text-disabled` | `#94A3B8` | Disabled labels (exempt from contrast; never carries essential meaning alone) |

**Borders**

| Token | Light | Role |
|---|---|---|
| `--border-subtle` | `#E4E7EE` | Dividers inside a surface |
| `--border` (default) | `#D0D5DF` | Card and table outlines (decorative) |
| `--border-strong` | `#7C8798` | **Input and control boundaries** (≥ 3:1 non-text contrast) |
| `--border-focus` | `#4338CA` | Focus ring colour |
| `--border-error` | `#B91C1C` | Invalid field boundary (paired with icon + text) |

**Semantic (feedback) tones** — variables are named `--{tone}-{subtle|fg|solid|on-solid}` (e.g. `--warning-fg`). Each tone has four roles: `subtle` (background), `fg` (text/icon on subtle), `solid` (strong fill), `on-solid` (text on solid).

| Tone | `-subtle` | `-fg` | `-solid` | `-on-solid` | Meaning |
|---|---|---|---|---|---|
| `success` | `#E7F6EC` | `#14532D` | `#15803D` | `#FFFFFF` | Completed, ready, available, paid |
| `warning` | `#FEF3C7` | `#78350F` | `#B45309` | `#FFFFFF` | Needs attention soon, outstanding, pending acceptance |
| `error` | `#FDE8E8` | `#991B1B` | `#B91C1C` | `#FFFFFF` | Failed, blocked, urgent, destructive |
| `info` | `#E0F2FE` | `#075985` | `#0369A1` | `#FFFFFF` | Informational, in-flight, sent |
| `progress` | `#EEF0FF` | `#3730A3` | `#4338CA` | `#FFFFFF` | Work in progress, selected, occupied |
| `ai` | `#FAE8FF` | `#86198F` | `#A21CAF` | `#FFFFFF` | **AI-generated content only** (never an operational state) |
| `neutral` | `#EEF0F4` | `#334155` | `#475569` | `#FFFFFF` | Inactive, draft, closed, cancelled |
| `accent` | `#CCFBF1` | `#115E59` | `#0F766E` | `#FFFFFF` | Reserved/secondary categorical highlight |

The `ai` tone is reserved: **no operational state may use it**, so a user can learn "this colour = AI says" (DP13).

**Interaction**

| Token | Light | Role |
|---|---|---|
| `--hover` | `rgba(15,23,42,0.05)` overlay | Hover on neutral surfaces/rows |
| `--active` | `rgba(15,23,42,0.10)` overlay | Pressed |
| `--selected` | `#EEF0FF` | Selected row/item/tab background (with a 2 px leading `--primary` bar — not colour alone) |
| `--focus-ring` | `#4338CA` 2 px, 2 px offset | Keyboard focus on every interactive element |
| `--disabled-bg` | `#EEF0F4` | Disabled control fill |

**Data-visualisation series** `[DESIGN DECISION]` (hardening 2026-10-08 — HF-10). Charts (DT-08) need categorical colours that do **not** read as status. `--chart-1` = `--primary` · `--chart-2` = `--accent` (teal) · `--chart-3` = `--neutral-solid` · `--chart-4` = `--info-solid` (shadcn's scaffold also defines `--chart-5`; here it aliases `--chart-4` and is unused in Phase 1, so shadcn's `Chart` component works unmodified). They are aliases of tokens whose contrast against `--surface` is already verified (≥ 3:1 in both themes, §4.3), so no new colour value exists. Rules: at most **4 series per chart** in Phase 1 (a source mix or top-items distribution with more categories is a sorted horizontal bar in `--chart-1` with direct labels); every series also has a **pattern fill and a direct label/legend entry** (§14.6); `success`, `warning`, `error` and `ai` solids are **never** used as series colours, so green/amber/red/fuchsia keep their one meaning (R3).

**Operational state tokens** — map domain states to tones; the full table (domain → state → tone → icon → label) is the single status system:

| Domain | State → Tone (icon) — labels are upstream terms |
|---|---|
| **Order stage** [SPEC ORD-060] | Draft → `neutral` (pencil) · Awaiting acceptance → `warning` (clock) · Confirmed → `info` (check) · KOT Sent → `info` (send) · Preparing → `progress` (flame) · Ready → `success` (bell) · Served → `success` (utensils) · Picked Up → `success` (shopping-bag) · Completed → `success` (check-circle) · Cancelled → `neutral` (x-circle, struck text) · **Rejected → label `[OPEN DECISION]` OD-UX-1 (TRD PB-4)**, tone `neutral` |
| **Item state** [SPEC ORD-071] | Pending → `neutral` · Sent (KDS "New") → `info` · Preparing → `progress` · Ready → `success` · Served/Picked Up → `success` · Cancelled → `neutral` (struck) · Held (flag) → `warning` (pause) |
| **KDS priority** [SPEC KDS-005] | Normal → `neutral` (no badge by default) · High → `warning` (chevrons-up) · Urgent → `error` (alert-triangle) |
| **Cancellation request** [SPEC ORD-088/093] | Open → `warning` (message-square-warning) · Stale → `error` + AttentionBadge · Accepted → `neutral` · Declined → `neutral` |
| **Bill status** [SPEC BILL-002] | Draft → `neutral` · Finalized → `info` (lock) · Reopened → `warning` (rotate-ccw) · Cancelled → `neutral` (struck) · Refunded → `neutral` (`undo-2`), with a **Partial** / **Full** qualifier **supplied by the server** (derived from refunded vs recorded payments; the UI never computes it — U7) `[SPEC BILL-002, APP_FLOW §16.1/AF-051, TRD §25.9.1–2; OD-UX-3 resolved]` |
| **Payment status** [SPEC PAY-010] | Not Paid → `warning` · Paid → `success` (check). *Outstanding* and *Overpaid* are **amounts** shown with `warning` / `info` text, not statuses |
| **Menu availability** [SPEC MENU-011] | Available → `success` · Unavailable today (temporary, business day) → `warning` · Unavailable (permanent) → `neutral` + ban icon |
| **Staff availability** [SPEC STAFF-004] | Available → `success` · On Break → `warning` · Unavailable → `neutral` · Attendance: Present → `success` · Absent → `neutral` |
| **Table** [SPEC TABLE-001] | Available → `success` · Occupied → `progress` · Billing → `info` · Cleaning → `warning` · Reserved → `accent` |
| **Outlet availability** [SPEC ORG-020] | Open → `success` · Closed → `neutral` strong + lock icon · Not activated → `neutral` outline |
| **Restaurant platform status** [SPEC ONB-014] | Provisioned → `info` · Suspended → `error` · Deactivated → `error` outline |
| **Business day** [SPEC DAY-*] | Running → `success` · Closed → `neutral` · Reopened → `warning` |
| **Attention** [SPEC ATTENTION-006] | Open → `warning` (bell-ring) · Dismissed → `neutral` · Resolved → `success` |
| **Submission** [TRD §19.7] | Pending → `info` (loader) · Failed → `error` · Succeeded → `success` |
| **Connection** [TRD §17.6] | Live → `success` dot (hidden when healthy) · Reconnecting → `warning` · Offline → `error` |
| **Import draft** [SPEC AI-010…014] | Extracting → `info` · Ready for review → `warning` · Approved → `success` · Failed → `error` |
| **Information kind** (AI/UI) | Fact → `neutral` solid card · Recommendation → `ai` dashed · Action/proposal → `ai` + primary confirm · Warning → `warning` · Requires approval → `warning` + lock icon |

**Colour is never the only carrier**: every state has a text label and an icon (DP1, §14.6).

### 4.3 Contrast — verified

Pairings were computed (WCAG 2.2 relative-luminance formula) at design time. Requirement: text ≥ 4.5:1, large text ≥ 3:1, non-text UI ≥ 3:1.

**Light theme**

| Pairing | Foreground | Background | Ratio | Required |
|---|---|---|---|---|
| text-primary on surface | `#0F172A` | `#FFFFFF` | **17.9:1** | 4.5:1 |
| text-secondary on surface | `#334155` | `#FFFFFF` | **10.4:1** | 4.5:1 |
| text-muted on surface | `#5B6678` | `#FFFFFF` | **5.8:1** | 4.5:1 |
| text-muted on background | `#5B6678` | `#F6F7F9` | **5.4:1** | 4.5:1 |
| text-inverse on primary | `#FFFFFF` | `#4338CA` | **7.9:1** | 4.5:1 |
| text-inverse on primary-active | `#FFFFFF` | `#312E81` | **11.4:1** | 4.5:1 |
| primary text on selected | `#4338CA` | `#EEF0FF` | **7.0:1** | 4.5:1 |
| input border on surface (non-text) | `#7C8798` | `#FFFFFF` | **3.6:1** | 3:1 |
| focus ring on surface (non-text) | `#4338CA` | `#FFFFFF` | **7.9:1** | 3:1 |
| success: text on subtle | `#14532D` | `#E7F6EC` | **8.2:1** | 4.5:1 |
| success: white on solid | `#FFFFFF` | `#15803D` | **5.0:1** | 4.5:1 |
| warning: text on subtle | `#78350F` | `#FEF3C7` | **8.1:1** | 4.5:1 |
| warning: white on solid | `#FFFFFF` | `#B45309` | **5.0:1** | 4.5:1 |
| error: text on subtle | `#991B1B` | `#FDE8E8` | **7.1:1** | 4.5:1 |
| error: white on solid | `#FFFFFF` | `#B91C1C` | **6.5:1** | 4.5:1 |
| info: text on subtle | `#075985` | `#E0F2FE` | **6.6:1** | 4.5:1 |
| info: white on solid | `#FFFFFF` | `#0369A1` | **5.9:1** | 4.5:1 |
| progress: text on subtle | `#3730A3` | `#EEF0FF` | **8.8:1** | 4.5:1 |
| progress: white on solid | `#FFFFFF` | `#4338CA` | **7.9:1** | 4.5:1 |
| ai: text on subtle | `#86198F` | `#FAE8FF` | **7.1:1** | 4.5:1 |
| ai: white on solid | `#FFFFFF` | `#A21CAF` | **6.3:1** | 4.5:1 |
| neutral: text on subtle | `#334155` | `#EEF0F4` | **9.1:1** | 4.5:1 |
| neutral: white on solid | `#FFFFFF` | `#475569` | **7.6:1** | 4.5:1 |
| accent: text on subtle | `#115E59` | `#CCFBF1` | **6.7:1** | 4.5:1 |
| accent: white on solid | `#FFFFFF` | `#0F766E` | **5.5:1** | 4.5:1 |


**Dark theme — values** `[DESIGN]` (same semantic names; useful for dim kitchens and night service)

| Token | Dark | | Token | Dark |
|---|---|---|---|---|
| `--background` | `#0B1020` | | `--text-primary` | `#E8ECF5` |
| `--surface` | `#121A2E` | | `--text-secondary` | `#B9C3D8` |
| `--surface-sunken` | `#0D1426` | | `--text-muted` | `#93A0BA` |
| `--surface-elevated` | `#17213A` | | `--text-inverse` | `#0B1020` |
| `--overlay` | `rgba(2,6,16,0.70)` | | `--border-strong` | `#6B7891` |
| `--primary` | `#8F89FF` | | `--border-subtle` / `--border` | `#1C2742` / `#26324F` |
| `--primary-foreground` | `#0B1020` | | `--border-focus` / `--focus-ring` | `#A5A0FF` |
| `--selected` | `#1E2250` | | `--hover` / `--active` | `rgba(232,236,245,0.06)` / `0.12` |

| Tone (dark) | `-subtle` | `-fg` | `-solid` | `-on-solid` |
|---|---|---|---|---|
| success | `#12301E` | `#86EFAC` | `#4ADE80` | `#0B1020` |
| warning | `#3B2A0A` | `#FCD34D` | `#FBBF24` | `#0B1020` |
| error | `#3F1414` | `#FCA5A5` | `#F87171` | `#0B1020` |
| info | `#0C2A40` | `#7DD3FC` | `#38BDF8` | `#0B1020` |
| progress | `#1E2250` | `#C4C1FF` | `#8F89FF` | `#0B1020` |
| ai | `#3A1442` | `#F0ABFC` | `#E879F9` | `#0B1020` |
| neutral | `#1C2438` | `#B9C3D8` | `#94A3B8` | `#0B1020` |
| accent | `#0C3A36` | `#5EEAD4` | `#2DD4BF` | `#0B1020` |


**Additional dark-theme values** (so every semantic token has a value in both themes)

| Token | Light | Dark |
|---|---|---|
| `--primary-hover` | `#3730A3` | `#A39EFF` |
| `--primary-active` | `#312E81` | `#B7B3FF` |
| `--secondary` / `--secondary-foreground` | `#EEF0F4` / `#334155` | `#1C2438` / `#B9C3D8` |
| `--accent` | `#0F766E` | `#2DD4BF` |
| `--text-disabled` | `#94A3B8` | `#5B6784` |
| `--border-error` | `#B91C1C` | `#F87171` |
| `--disabled-bg` | `#EEF0F4` | `#1C2438` |

Note the dark solid tones use **dark** `-on-solid` text (the inverse of light) — keep the token, change the value.

**Dark theme — computed contrast**

| Pairing | Foreground | Background | Ratio | Required |
|---|---|---|---|---|
| text-primary on surface | `#E8ECF5` | `#121A2E` | **14.6:1** | 4.5:1 |
| text-secondary on surface | `#B9C3D8` | `#121A2E` | **9.8:1** | 4.5:1 |
| text-muted on surface | `#93A0BA` | `#121A2E` | **6.6:1** | 4.5:1 |
| on-primary on primary | `#0B1020` | `#8F89FF` | **6.5:1** | 4.5:1 |
| primary text on surface | `#8F89FF` | `#121A2E` | **5.9:1** | 4.5:1 |
| input border on surface (non-text) | `#6B7891` | `#121A2E` | **3.9:1** | 3:1 |
| focus ring on surface (non-text) | `#A5A0FF` | `#121A2E` | **7.5:1** | 3:1 |
| success: text on subtle | `#86EFAC` | `#12301E` | **10.2:1** | 4.5:1 |
| success: dark text on solid | `#0B1020` | `#4ADE80` | **10.9:1** | 4.5:1 |
| warning: text on subtle | `#FCD34D` | `#3B2A0A` | **9.6:1** | 4.5:1 |
| warning: dark text on solid | `#0B1020` | `#FBBF24` | **11.3:1** | 4.5:1 |
| error: text on subtle | `#FCA5A5` | `#3F1414` | **8.4:1** | 4.5:1 |
| error: dark text on solid | `#0B1020` | `#F87171` | **6.8:1** | 4.5:1 |
| info: text on subtle | `#7DD3FC` | `#0C2A40` | **8.9:1** | 4.5:1 |
| info: dark text on solid | `#0B1020` | `#38BDF8` | **8.8:1** | 4.5:1 |
| progress: text on subtle | `#C4C1FF` | `#1E2250` | **8.9:1** | 4.5:1 |
| progress: dark text on solid | `#0B1020` | `#8F89FF` | **6.5:1** | 4.5:1 |
| ai: text on subtle | `#F0ABFC` | `#3A1442` | **8.8:1** | 4.5:1 |
| ai: dark text on solid | `#0B1020` | `#E879F9` | **7.7:1** | 4.5:1 |
| neutral: text on subtle | `#B9C3D8` | `#1C2438` | **8.7:1** | 4.5:1 |
| neutral: dark text on solid | `#0B1020` | `#94A3B8` | **7.4:1** | 4.5:1 |
| accent: text on subtle | `#5EEAD4` | `#0C3A36` | **8.5:1** | 4.5:1 |
| accent: dark text on solid | `#0B1020` | `#2DD4BF` | **10.2:1** | 4.5:1 |



**Additional pairings (completing both themes)**

| Pairing | Foreground | Background | Ratio | Required |
|---|---|---|---|---|
| Light: accent on surface | `#0F766E` | `#FFFFFF` | **5.5:1** | 4.5:1 |
| Light: border-error on surface (non-text) | `#B91C1C` | `#FFFFFF` | **6.5:1** | 3:1 |
| Light: primary-hover on surface | `#3730A3` | `#FFFFFF` | **9.9:1** | 4.5:1 |
| Light: secondary-foreground on secondary | `#334155` | `#EEF0F4` | **9.1:1** | 4.5:1 |
| Dark: on-primary on primary-hover | `#0B1020` | `#A39EFF` | **8.0:1** | 4.5:1 |
| Dark: on-primary on primary-active | `#0B1020` | `#B7B3FF` | **9.8:1** | 4.5:1 |
| Dark: primary-hover on surface | `#A39EFF` | `#121A2E` | **7.3:1** | 4.5:1 |
| Dark: accent on surface (non-text) | `#2DD4BF` | `#121A2E` | **9.3:1** | 3:1 |
| Dark: border-error on surface (non-text) | `#F87171` | `#121A2E` | **6.3:1** | 3:1 |
| Dark: secondary-foreground on secondary | `#B9C3D8` | `#1C2438` | **8.7:1** | 4.5:1 |

`--text-disabled` is exempt from contrast (WCAG 1.4.3 inactive components) and never carries essential meaning alone.

All 105 computed pairings (light + dark, including every tone's text-on-subtle, on-solid and solid-as-icon-on-surface) meet their threshold. A token change that lowers any ratio below its threshold is a defect (§14.1).

### 4.4 Typography tokens  [DESIGN]

| Token | Value |
|---|---|
| `--font-sans` | `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif` |
| Fallback behaviour | Inter is a variable web font with `font-display: swap`; the system stack is the metric-compatible fallback (no layout shift budget > 0.05) |
| `--font-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` — only for ids/references (payment reference, order-link tokens in support contexts) |
| Weights | 400 (regular), 500 (medium), 600 (semibold), 700 (bold — display, KDS order number, totals only) |
| Numerics | `font-variant-numeric: tabular-nums lining-nums` on **every** numeric/financial/time/quantity element (§4.4.2) |
| Min size | 12 px (captions/helper only). Operational body ≥ 14 px; customer and touch contexts ≥ 16 px |
| Locale | English, `en-IN` number/date formatting `[ASSUMPTION]` (§18.4); no text is baked into images; UI strings are externalisable |

**4.4.0 Canonical typography contract**  `[DESIGN DECISION]`

The typography below is the **only** typography of SERVENA. Every screen uses these tokens. Developers **must not** invent another font, another heading scale, arbitrary font sizes, arbitrary weights, or arbitrary line heights. A genuinely new typographic need **extends** this system through §21 (a new token, documented) — never a screen-specific style.

| Role asked for | Token |
|---|---|
| Page title | `--type-h1` |
| Section title | `--type-h2` (cards/panels: `--type-h3`; sub-sections: `--type-h4`) |
| Numeric / financial text | `--type-num`, `--type-currency`, `--type-currency-total`, `--type-kpi` (always tabular) |
| Button / navigation / badge | `--type-button`, `--type-nav`, `--type-badge` |

**Font loading strategy** `[DESIGN DECISION]`: Inter is **self-hosted** as a variable font (WOFF2, Latin + Latin-Extended subset; weights 400–700 in one file), served from the application origin/CDN with long-lived immutable caching — **no third-party font request**. The two critical faces (regular, semibold) are `preload`ed; `font-display: swap`; a metric-matched **fallback face** (`size-adjust`, `ascent-override`) built from the system stack keeps layout shift ≈ 0. If the font fails to load, the system stack renders with no loss of function.

**4.4.1 Type scale** (size / line-height / weight / letter-spacing). `compact` and `comfortable` differ **only** in the body-level rows; headings are identical.

| Role | Token | Compact (desktop admin) | Comfortable (touch, POS, customer) | Notes |
|---|---|---|---|---|
| Display | `--type-display` | 36/44 · 700 · −0.02em | 36/44 · 700 · −0.02em | Customer outlet title, empty-state hero only |
| H1 / Page title | `--type-h1` | 28/36 · 600 · −0.015em | 28/36 | One per view |
| H2 / Section title | `--type-h2` | 22/28 · 600 · −0.01em | 22/28 | |
| H3 | `--type-h3` | 18/24 · 600 | 18/24 | Card/panel titles |
| H4 | `--type-h4` | 16/24 · 600 | 16/24 | Sub-sections |
| Page title / Section title | alias | = `--type-h1` / `--type-h2` | same | Roles, not new sizes |
| Body | `--type-body` | **14/20** · 400 | **16/24** · 400 | |
| Body small | `--type-body-sm` | 13/18 · 400 | 14/20 · 400 | |
| Label | `--type-label` | 13/16 · 500 | 14/20 · 500 | Form labels, column headers' emphasis |
| Caption | `--type-caption` | 12/16 · 400 | 12/16 · 400 | Timestamps, metadata |
| Helper text | `--type-helper` | 12/16 · 400 · `--text-muted` | 13/18 | Under fields |
| Table text | `--type-table` | 14/20 · 400 | 15/22 · 400 | Table header: 12/16 · 600 · `--text-secondary` |
| Numeric data | `--type-num` | 14/20 · 500 · tabular | 16/24 · 500 · tabular | Counts, quantities, timers |
| Currency | `--type-currency` | 14/20 · 600 · tabular | 16/24 · 600 · tabular | Line amounts |
| Currency — total | `--type-currency-total` | 20/28 · 700 · tabular | 24/32 · 700 · tabular | Bill total, outstanding |
| KPI | `--type-kpi` | 32/36 · 600 · tabular | 32/36 | MetricCard value |
| Button | `--type-button` | 14/20 · 500 (sm 13/16) | 16/24 · 500 | Never below 14 on touch |
| Navigation | `--type-nav` | 14/20 · 500 | 15/20 · 500 | |
| Badge / status | `--type-badge` | 12/16 · 600 · +0.01em | 13/16 · 600 | Sentence case; never all-caps |
| **KDS** (specialised, §12.1) | `--type-kds-order` 32/36·700 · `--type-kds-item` 22/28·600 · `--type-kds-mod` 16/22·500 · `--type-kds-timer` 24/28·700 | | | Same family/weights/tone tokens, larger sizes |

**4.4.2 Financial and operational numbers** `[DESIGN]` on `[TRD]` money rules

| Rule | Specification |
|---|---|
| Source of truth | The UI receives **integer paise** (`…Paise`). It formats; it never derives totals, taxes or round-off (TRD §25.4) |
| Format | `₹` + Indian digit grouping via `Intl.NumberFormat('en-IN')` (e.g. `₹1,25,000.00`); **always two decimals** for bills/payments; the symbol is part of the `Money` component, never typed by screens |
| Alignment | Right-aligned in tables and summaries; label left, amount right; decimals aligned (tabular) |
| Sign | Refunds/negatives use a leading `−` **and** the word "Refund"/"Round-off", never colour alone |
| Zero | Shown as `₹0.00`, not blank, in financial summaries |
| Input | Money inputs accept rupees with ≤ 2 decimals and convert to integer paise at the form boundary; non-numeric, > 2 decimals or negative input is rejected inline; no float arithmetic |
| Round-off | Always its own labelled line, never merged into total silently (PO-TRD-01) |
| Quantities, counts, timers | Tabular, right-aligned in tables; timers `mm:ss` (≥ 1 h → `h:mm:ss`) |
| Phone | Displayed in E.164-aware grouped form, stored/validated E.164 (`+91 98765 43210`); masked where privacy requires (§10.7) |
| Dates/time | `en-IN`; times 24-hour for staff operational surfaces `[ASSUMPTION]`; "This business day" wording for day-scoped data (U15) |

### 4.5 Spacing tokens  [DESIGN]

Base unit 4 px. Only these steps exist.

| Token | px | | Token | px |
|---|---|---|---|---|
| `--space-0` | 0 | | `--space-6` | 24 |
| `--space-0-5` | 2 | | `--space-8` | 32 |
| `--space-1` | 4 | | `--space-10` | 40 |
| `--space-2` | 8 | | `--space-12` | 48 |
| `--space-3` | 12 | | `--space-16` | 64 |
| `--space-4` | 16 | | `--space-20` | 80 |
| `--space-5` | 20 | | | |

**Applied spacing (the only permitted compositions)**

| Context | Value |
|---|---|
| **Page padding** | mobile 16 (`space-4`) · tablet 24 (`space-6`) · desktop 32 (`space-8`) |
| **Section spacing** (between PageHeader/sections) | mobile 24 · tablet/desktop 32 |
| **Card / Panel padding** | compact 16 · comfortable 20 (header 16 + body 16/20) |
| **Form spacing** | label→control 6 (`1.5`: 6 px = space-1 + space-0-5) · field→field 16 · FormSection→FormSection 24 · helper/error below control 4 |
| **Table spacing** | cell padding: compact 8 × 12 · comfortable 12 × 16; toolbar→table 12 |
| **Grid spacing** | 16 (cards), 24 (dashboard metric grids at desktop), KDS tickets 12 |
| **Modal** | padding 24; title→body 12; body→footer 24; footer button gap 8 |
| **Drawer** | header 16×24; body 24; footer 16×24; width: sm 400 · md 480 · lg 640 |
| **Navigation** | item padding 8×12; item gap 4; group gap 16; sidebar padding 12; TopBar height 56 |
| **Touch-target spacing** | ≥ 8 between adjacent operational controls |

Arbitrary pixel values outside this scale are not allowed without a recorded justification (§5.1 Rule 10).

**4.5b Layout-dimension tokens** `[DESIGN DECISION]` — the only fixed sizes screens may use:

| Token | Value | Use |
|---|---|---|
| `--size-touch` | 44 px | Minimum operational touch target |
| `--size-touch-kds` | 56 px | KDS/POS primary targets |
| `--size-topbar` | 56 px | TopBar height |
| `--size-sidebar` / `--size-rail` | 248 px / 72 px | Sidebar expanded / rail |
| `--size-auth` | 400 px | Sign-in / invitation card width (= Modal `sm`) |
| `--size-content-customer` | 640 px | Customer column maximum |
| `--size-form` | 560 px (tablet) · 720 px (desktop) | Form maximum width |
| `--size-sheet-sm/md/lg` | 400 / 480 / 640 px | Sheet widths |
| `--size-modal-sm/md/lg` | 400 / 560 / 720 px | Modal widths |
| `--size-ticket-min` | 280 px | KDS ticket minimum width |


### 4.6 Radius tokens

| Token | px | Use |
|---|---|---|
| `--radius-none` | 0 | Table cell dividers, full-bleed regions |
| `--radius-sm` | 4 | Tags inside dense tables, checkbox, kbd |
| `--radius-md` | 8 | Buttons, inputs, selects, dropdown items, toasts |
| `--radius-lg` | 12 | Cards, panels, tables outer container, KDS tickets |
| `--radius-xl` | 16 | Modal, drawer (leading edge), bottom-sheet top |
| `--radius-full` | 9999 | Badges, avatars, status dots, pills |

### 4.7 Border tokens

| Token | Spec |
|---|---|
| `--border-width` | 1 px (default) |
| `--border-width-strong` | 2 px (focus ring, selected leading bar, error emphasis) |
| Default border | `1px solid var(--border)` on surfaces |
| Subtle border | `1px solid var(--border-subtle)` for internal dividers |
| Strong border | `1px solid var(--border-strong)` on **every input/control boundary** |
| Focus border | `2px` ring `--focus-ring`, offset 2 px; never removed (§14.3) |
| Error border | `1px solid var(--border-error)` + error icon + message below (colour never alone) |

### 4.8 Elevation tokens

| Level | Token | Light shadow | Used by |
|---|---|---|---|
| 0 | `--elev-0` | none | Flat content |
| 1 | `--elev-1` | `0 1px 2px rgba(15,23,42,.06), 0 1px 1px rgba(15,23,42,.04)` | Cards, panels |
| 2 | `--elev-2` | `0 4px 12px rgba(15,23,42,.10)` | Dropdowns, popovers, tooltips |
| 3 | `--elev-3` | `0 12px 32px rgba(15,23,42,.18)` | Modal, drawer, bottom sheet |
| 4 | `--elev-4` | `0 8px 24px rgba(15,23,42,.20)` | Toast, operational alert banner |

Dark theme conveys elevation by **surface lightness** (`--surface` → `--surface-elevated`) plus a 1 px `--border`; shadows are reduced to ≤ 40 % opacity.

Z-index scale: `--z-base 0`, `--z-sticky 10`, `--z-drawer 40`, `--z-modal 50`, `--z-popover 60`, `--z-toast 70`, `--z-tooltip 80`.

### 4.9 Motion tokens  [DESIGN]

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 0 ms | Reduced-motion |
| `--dur-fast` | 100 ms | Hover, press, focus, checkbox |
| `--dur-base` | 150 ms | Dropdown, tooltip, tab, toast exit, modal exit |
| `--dur-moderate` | 200 ms | Modal/toast enter, collapse |
| `--dur-slow` | 250–300 ms | Drawer/bottom-sheet slide (maximum anywhere) |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | State changes |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Enter |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exit |

| Rule | Spec |
|---|---|
| Hover | 100 ms colour/elevation only; no movement |
| Modal | enter 200 ms fade + scale 0.98→1; exit 150 ms fade |
| Drawer / bottom sheet | enter/exit 250 ms slide on `ease-decelerate`/`accelerate`; scrim fades |
| Toast | enter 200 ms slide-up + fade; exit 150 ms; auto-dismiss 5 s for success/info, **errors and failures persist** until dismissed |
| Loading | Spinner only after **300 ms** of waiting (avoids flicker); content-shaped Skeleton for loads > 300 ms; skeleton uses a 1.5 s opacity pulse (no shimmer sweep); progress is determinate when known |
| Operational | **No** decorative animation on KDS/POS. A new KDS ticket or awaiting-acceptance item gets a single 1.5 s outline emphasis then a static "new" marker until seen; no bouncing, no auto-scroll that moves cards under a finger |
| Reduced motion | `prefers-reduced-motion: reduce` ⇒ all transitions → `--dur-instant` or opacity-only ≤ 100 ms; the "new" emphasis becomes the static marker; no parallax/auto-advancing content |

### 4.10 Density modes  [DESIGN]

One system, three density configurations selected by **context**, never by hand-tuning a screen.

| Mode | Where | Row height | Control height | Min touch target | Body |
|---|---|---|---|---|---|
| `compact` | Desktop administrative/data screens (Owner, Manager, Cashier at desk, SuperAdmin) | 40 | 36 (sm 32) | 24 + 8 spacing (pointer) | 14 |
| `comfortable` | Touch/tablet POS, Waiter, Cashier tablet, customer, all dialogs on touch | 48 | 44 | **44 × 44** | 16 |
| `kds` | Kitchen display (§12.1) | 56–72 ticket line | 56 | **56 × 56** | KDS scale |

Density is a CSS-variable set (`--row-h`, `--control-h`, `--space-density`, type-scale selection) switched at the shell by role + device, not per component.

### 4.12 Iconography tokens  `[DESIGN DECISION]`

| Token / rule | Specification |
|---|---|
| Library | **lucide-react** — the only icon set; never mix sets |
| Sizes | `--icon-sm` 16 px · `--icon-md` 20 px · `--icon-lg` 24 px |
| Stroke | 1.75 px, `currentColor` (inherits tone/text) |
| Meaning | State icons come only from the status registry (§4.2 / D-01); an icon never changes meaning between screens |
| Accessibility | Decorative icons `aria-hidden`; icon-only controls carry `aria-label` (IconButton); an icon never carries a state alone (text always present) |
| Prohibited | Emoji as UI icons; ad-hoc SVGs; per-screen icon colours. A new icon is a documented extension (§21) |

### 4.11 Token governance

| Rule | |
|---|---|
| T1 | A value that is not a token is a defect (lint: no raw hex, px outside scale, or font-size outside scale in app code; allowed only inside the token files) |
| T2 | New tokens require a DDR (§19) and a use that no existing token satisfies |
| T3 | Semantic tokens never reference screens; component tokens never reference other components |
| T4 | Status colours are only ever applied through `StatusBadge`/status tokens (CMP-D-01), never ad hoc |
| T5 | Both themes and both density sets must be defined for every new semantic token |

**Token inventory (for the completion count):** 8 categories — Colour (brand 7, surface 5, text 5, border 5, tones 8×4=32, interaction 5, operational maps 17 domains), Typography (19 roles + font/weight/numeric tokens), Spacing (14 steps + 9 applied groups), Radius (6), Border (7), Elevation (5 + 7 z-levels), Motion (8 + 6 rules), Density (3 modes).


---

## 5. Canonical Component Library

**One library, application-wide.** *Components defined in the SERVENA Design System are application-wide reusable components — they are not screen-specific components.* Components are defined **once** here; screens (§16) only compose them and set screen-specific configuration. Where a Phase 1 screen needs a component not listed, Rule 6 applies (§5.1).

### 5.1 Reuse governance (the ten rules)  [DESIGN]

**R0 — Mandatory reuse check (development rule).** *Before creating a new frontend component, the implementation agent MUST determine whether an existing SERVENA component or composition can satisfy the requirement.* If yes, **reuse it**. If a variation is needed, **extend the canonical component** through a documented variant, composition or configuration (§21) — never a duplicate. **Prohibited duplication examples:** `OrderButton`, `BillingButton`, `StaffButton` (all are `Button`); `OrderTable`, `BillingTable`, `StaffTable` (all are `DataTable` with different columns); `OrderCard`/`BillCard` that are merely differently configured `Surface`; a second status chip beside `StatusBadge`. Domain-specific components exist **only** where the domain meaning is genuinely different, and every new shared component needs a documented reason.

| # | Rule |
|---|---|
| R1 | A UI element that appears on more than one screen **must** be a library component or shared pattern |
| R2 | No `MenuButton`, `OrderButton`, `BillingButton`: behaviour that is only a Button variant uses the canonical **Button** (CMP-F-01) |
| R3 | One semantic state ⇒ one tone everywhere (e.g. *success* is always `success-*`; *Ready* is always `success`) |
| R4 | A domain component is allowed only when the **domain meaning** differs (e.g. `StatusBadge` registry, `OrderItemRow`, `KdsTicket`, `Money`); each is justified in §5.8 |
| R5 | A screen **composes** components; it never redefines their look |
| R6 | A new component needs a written justification (§19 DDR) stating why no existing component or composition satisfies the need |
| R7 | No duplicate components with slightly different spacing, colour, typography or behaviour; variants are props, not new components |
| R8 | No screen-specific colours — tokens only (§4.2) |
| R9 | No screen-specific typography — type tokens only (§4.4) |
| R10 | No screen-specific spacing — spacing tokens only (§4.5); an exception needs a recorded justification |

### 5.2 Global component contract (applies to **every** component)  [DESIGN]

| # | Contract |
|---|---|
| GC-1 | **States.** Every interactive component implements: default · hover · `focus-visible` · active/pressed · disabled; plus, where relevant: loading · selected · invalid · read-only. Component tables below list only **deviations or additions** |
| GC-2 | **Hidden vs disabled** (U1). An action the user's effective permission **never** grants is *not rendered*. An action that is granted but invalid *now* (outlet Closed, wrong state, offline, stale) is rendered **disabled with a visible reason** (text or tooltip + `aria-describedby`). Hiding is a convenience; the server still enforces (RBAC-007) |
| GC-3 | **Size mapping.** `sm`/`md`/`lg`/`xl` map to the density mode (§4.10); `xl` is reserved for primary POS/KDS actions |
| GC-4 | **Tokens only** (R8–R10). No raw colours, sizes, shadows or durations inside components |
| GC-5 | **Accessibility baseline.** Built on Radix primitives where one exists; accessible name always present; visible `focus-visible` ring; operable by keyboard and touch; status never by colour alone; announces async results via a live region (§14) |
| GC-6 | **Async actions.** A control that triggers a server call shows `loading` (width does not change, `aria-busy`, repeat activation blocked) and then the **server-acknowledged** result (U3). It never shows success before the response |
| GC-7 | **Strings** are externalisable; components accept `label`/`description` props rather than hard-coding copy (§10) |
| GC-8 | **Composition over variants explosion.** If a variant needs > 2 structural changes, compose two components instead |
| GC-9 | **Responsive**: each component states its behaviour at mobile/tablet/desktop (§13); no component is merely shrunk |

### 5.3 Foundation components (CMP-F)

| ID | Component | Purpose | Variants | Sizes | States / notes | Use / Don't use | Composition & tokens | A11y · responsive |
|---|---|---|---|---|---|---|---|---|
| F-01 | **Button** | Trigger an action | `primary` · `secondary` · `tertiary` (ghost) · `destructive` | sm 32 · md 36 (compact) / 44 (comfortable) · lg 44 / 52 (heights, px) · xl 56 | `loading` (spinner replaces leading icon), `disabled` (with reason, GC-2), optional leading/trailing icon | **One `primary` per region** (DP7). `destructive` only for irreversible/financial/destructive acts and always behind ConfirmationDialog. Don't use for navigation (use Link) | `--primary*`, `--secondary*`, `--error-solid`, `--radius-md`, `--type-button`; destructive never filled-primary | Native `<button>`; ≥ 44 px on touch; icon+text; full-width on mobile footers (StickyActionBar) |
| F-02 | **IconButton** | Compact action with icon only | same as Button (`secondary`/`tertiary`/`destructive`) | 32 · 36 · 44 · 56 | Requires `aria-label` **and** Tooltip (desktop) | Don't use for primary or destructive acts that need a label; don't use without a name | Button tokens | 44 px hit area even when glyph is 20 px |
| F-03 | **Link** | Navigate / open a reference | `inline` (underlined) · `standalone` (with chevron) | inherits text | visited not styled; external adds icon + sr text | Navigation only; actions are Buttons | `--primary`, underline always for inline links (not colour only) | Link text meaningful out of context |
| F-04 | **Text / Heading** | Typography primitive | `display` · `h1`–`h4` · `body` · `body-sm` · `label` · `caption` · `helper` · `num` · `currency` | — | `tone`: primary/secondary/muted/inverse; `truncate`/`clamp` | Always use instead of raw tags/sizes (R9). Heading level follows document outline, visual size independent | `--type-*`, `--text-*` | One `h1` per view; no skipped levels |
| F-05 | **Badge** | Generic label/count tag (non-status) | `neutral` · tone variants · `count` · `outline` | sm 20 · md 24 | `count` caps at 99+ | Use **StatusBadge (D-01)** for any domain state; Badge is for counts/tags only | `--*-subtle/-fg`, `--radius-full`, `--type-badge` | Text always present |
| F-06 | **Avatar** | Person/entity mark | `initials` · `image` | 24 · 32 · 40 | fallback to initials | StaffAvatar (D-06) adds status; don't use as button without wrapper | `--secondary`, `--radius-full` | Decorative unless it is the only label |
| F-07 | **Divider** | Separate regions | `horizontal` · `vertical` · `labelled` | — | — | Prefer spacing; use only where it aids scanning | `--border-subtle` | `role="separator"` |
| F-08 | **Tooltip** | Supplementary hint | — | — | Opens on hover **and** focus; dismiss on Esc | **Never the only place** an essential fact or disabled-reason lives on touch; not for interactive content | `--surface-elevated`, `--elev-2` | Not relied on for touch; reason also visible inline on mobile |
| F-09 | **Icon** | Single icon system (lucide) `[DESIGN]` | `decorative` · `labelled` | 16 · 20 · 24 | — | One library, one stroke weight (1.75); never mix sets | currentColor | `aria-hidden` when decorative |

### 5.4 Form components (CMP-FM)

All form controls share: height = control height of the density mode; `--radius-md`; `--border-strong` boundary; error = `--border-error` + icon + message; label above control (never placeholder-only); disabled uses `--disabled-bg`; read-only is not styled as disabled.

| ID | Component | Purpose | Variants / specialisations | Key states & rules | Use / Don't use | A11y · responsive |
|---|---|---|---|---|---|---|
| FM-01 | **Input** | Single-line text | `text` · `email` · `number` · prefix/suffix slots | `invalid`, `read-only`, `disabled`; character counter where a limit exists | Don't use for money (FM-05), phone (FM-03), search (FM-04) | Label via FormField; `autocomplete` set; `inputmode` for numeric |
| FM-02 | **PasswordInput** | Credential entry | Input + show/hide toggle | Toggle is an IconButton with `aria-pressed`; **paste allowed**; no strength meter (no policy beyond min length — TRD TD-AUTH-1) | Don't add composition rules the TRD does not define | `autocomplete="current-password"`/`new-password` |
| FM-03 | **PhoneInput** | E.164 phone | Input + country-code select (default `+91` `[ASSUMPTION]`) | Validates E.164 (`+[1-9]\d{6,14}`); formats on blur; stores normalised | Used for customer details (SCR-052), staff phone, SCR-001 identifier | `inputmode="tel"`, `autocomplete="tel"` |
| FM-04 | **SearchInput** | Filter/search a list | Input + leading search icon + clear | 250 ms debounce; clear with Esc; `role="search"` | Search ≠ filter: SearchInput is free text; structured filters use FilterBar | Announces result count (live region) |
| FM-05 | **MoneyInput** | Rupee amount entry | Input with `₹` prefix, right-aligned, tabular | Accepts ≤ 2 decimals; converts to **integer paise** on commit; rejects negative/NaN; never uses floats for arithmetic | Payments, refunds, counted cash, discounts (flat) | `inputmode="decimal"`; error names the constraint |
| FM-06 | **Textarea** | Multi-line text | auto-grow (max 6 rows) | Counter `n/limit` | Notes, reasons, comments | Limit announced politely |
| FM-07 | **Select** | Choose 1 of ≤ 7 options | desktop popover · mobile → full-height Sheet list | `placeholder` option is non-selectable | ≤ 7 options; else Combobox | Radix Select semantics |
| FM-08 | **Combobox** | Searchable choice | single · multi (chips) | Async search with loading row; "no matches" row | Menu categories, staff, customers, outlets (> 7 options) | `role="combobox"`, listbox, `aria-activedescendant` |
| FM-09 | **DatePicker** | Pick a calendar date | popover calendar · typed input | Disabled date ranges with reason | Schedule/attendance dates `[PRD §15–16]`; **not** for "business day" (that is a system concept, not user-picked) | Keyboard grid navigation |
| FM-10 | **TimePicker** | Pick a time (24 h) | typed `HH:mm` + list | Validates start < end in pairs (FormSection) | Schedule planned period `[SPEC STAFF-002]` | Typed entry always possible |
| FM-11 | **DateRangePicker** | From/to dates | presets (**This business day**, Last 7 days) + custom | Preset "business day" is resolved by the server (U15) | History filters (customer history, audit trail) | Two labelled inputs, not one ambiguous field |
| FM-12 | **Checkbox** | Independent boolean/multi-select | — | `indeterminate` for parent selection | Selecting rows; acknowledging (e.g. confirm unresolved) | Native semantics |
| FM-13 | **RadioGroup** | One of ≤ 5 exclusive options | vertical · card-style (for payment mode) | Roving focus | ≤ 5 options with equal weight | Group labelled |
| FM-14 | **Switch** | Immediate on/off setting | — | Takes effect immediately and shows server result; **never** used inside a form that has a Save button | e.g. availability toggles | `role="switch"`, label states effect |
| FM-15 | **FileUpload** | Choose/drop a file | `dropzone` · `button` · image preview | Shows type/size limits (5 MB images; 10 MB imports `[TRD §34]`), progress, reject reason | Logo, item image, AI menu import source | Keyboard-operable picker; progress announced |
| FM-16 | **FormField** | Label + control + helper + error | parts: `Label`, `Control`, `HelperText`, `FormError` | Required marker `*` + sr "required"; optional text "(optional)"; error replaces helper and is announced | Every control sits in a FormField (R1) | `aria-describedby` helper/error; error `role="alert"` once on submit, `aria-live="polite"` on blur |
| FM-17 | **FormSection** | Group related fields | with heading + description | Collapsible only in long wizards | ≥ 3 related fields | `<fieldset>/<legend>` |

*FormHelperText and FormError are parts of FM-16, not separate components.*


### 5.5 Feedback components (CMP-FB)

| ID | Component | Purpose | Variants | Rules | Use / Don't use | A11y · responsive |
|---|---|---|---|---|---|---|
| FB-01 | **Alert** | Persistent in-context message | tones `info/success/warning/error`; `conflict` (stale data: *"This changed while you were viewing it"* + Refresh) | Optional action; dismissible only when informational; **error alerts for failed actions persist** | Don't use for transient confirmation (Toast) or field errors (FormError) | `role="alert"` for error/conflict, `role="status"` otherwise |
| FB-02 | **Toast** (also the **Notification** surface) | Transient confirmation; operational realtime notice | `confirmation` · `operational` (e.g. "New order awaiting acceptance" + **Review**) · `error` | Success/info auto-dismiss 5 s; **error/operational persist** until acted on or dismissed; stack max 3 (collapse older into a count); mute control for the optional audible cue (TopBar) `[DESIGN]` | Never the only record of a result that must be revisited (put it on the object too). Not a notification centre — none exists upstream (U12) | `role="status"`/`alert`; focus never stolen; action reachable by keyboard |
| FB-03 | **ConfirmationDialog** | Confirm a consequential act | `standard` · `destructive` · `financial` | States **what will happen**, the object, and the consequence; for `financial` shows the amount via Money; for acts needing a reason embeds ReasonPicker (D-14); primary label is the verb ("Cancel item"), never "OK"; default focus on the **safe** option for destructive; **Back/Escape never commits** (C-BACK) | Don't confirm routine acts (DP4); don't stack dialogs | `role="alertdialog"` for destructive; focus trap; returns focus |
| FB-04 | **Spinner** | Indeterminate wait | `inline` · `block` | Appears after 300 ms | Short waits (< 2 s) | `role="status"` + sr text |
| FB-05 | **Skeleton** | Content-shaped placeholder | `text` · `row` · `card` · `table` · `ticket` | Mirrors final layout to prevent shift; no shimmer (§4.9) | Loads > 300 ms | `aria-busy` on region |
| FB-06 | **LoadingState** | Standard loading for a region/page | `page` (shell + skeleton) · `section` · `button` | Composition of Spinner/Skeleton; announces "Loading <noun>" | Every data region uses this; no bespoke loaders | live region |
| FB-07 | **EmptyState** | Nothing to show | `first-use` (setup prompt) · `no-data` · `no-results` (filters active → "Clear filters") · `caught-up` (queue cleared) · `needs-connection` | Icon + one-line title + one explanatory line + at most one CTA; `no-results` ≠ `no-data` (C-EMPTY: empty never hides permitted data) | Don't use for errors | Heading semantics |
| FB-08 | **ErrorState** | A load/action failed | `page` · `section` · `inline` · `offline` · `not-found` (invalid/expired link, C-INVALID) | Plain-language cause, **Retry**, and a copyable support reference (`requestId`, TRD §36.3); no stack/Mongo text | Not for permission denial (FB-09) or empty (FB-07) | `role="alert"`; retry focusable |
| FB-09 | **PermissionDeniedState** | Refused by authorization | `page` · `inline` · `action` (tooltip/helper on a disabled control) | **Names the failed factor** — permission / outlet / state / approval — and what the user can do; never shows other-outlet data; never navigates or mutates (C-REFUSAL, RBAC-016) | Don't use for "no data" or errors | `role="alert"`; factor in text, not colour |
| FB-10 | **ConnectionBanner** | Global connectivity | `reconnecting` (warning) · `offline` (error) · hidden when live | Sticky under TopBar; states what still works and what is paused; when back, shows "Back online — syncing" then disappears after resync | One per shell | `role="status"`; not dismissible while degraded |
| FB-11 | **SubmissionStatus** | Show pending/failed/succeeded of a user action | `chip` · `row` (in queue) | Exactly three states (TRD §19.7): **Pending** (info + spinner), **Failed** (error + reason + Retry/Discard), **Succeeded** (success, shown only after server ack). Never "Saved!" before ack | Order commit/add-items queue and any in-flight mutation | live region |
| FB-12 | **PendingQueue** | List queued offline operations | `panel` (popover from TopBar) | Per-aggregate order; each row = SubmissionStatus + description + Retry/Discard; failed rows never auto-vanish; discard confirms (TRD §19.7) | Only for TD-OFF-1 operations | focus-managed popover |

*"InlineError" = ErrorState `inline`; "OfflineState" = ErrorState `offline`; "DestructiveConfirmationDialog" = ConfirmationDialog `destructive`; "Notification" = Toast `operational` (§5.10).*

### 5.6 Layout components (CMP-L)

| ID | Component | Purpose | Variants | Composition & rules | A11y · responsive |
|---|---|---|---|---|---|
| L-01 | **AppShell** | Authenticated staff/platform frame | `staff` · `platform` (SuperAdmin: SCR-040/041/042 only) | Sidebar + TopBar + ConnectionBanner + content region + Toast region; sets density mode by role/device; provides working-outlet context (U2) | Landmarks: `banner`, `navigation`, `main`; skip-to-content link |
| L-02 | **CustomerShell** | Customer frame | one | Minimal TopBar (outlet name, optional Takeaway/table tag), single content column, sticky bottom action bar; **no sidebar**; same tokens/components; `comfortable` density | Mobile-first; max content width 640 centred on larger screens |
| L-03 | **Sidebar** | Primary navigation (desktop/tablet) | `expanded` 248 · `rail` 72 | Role-filtered items (§6.3); groups with SectionHeader; active item = `--selected` + leading bar + `aria-current="page"` | Rail shows tooltip labels; tablet default `rail` |
| L-04 | **TopBar** | Context + global controls | one | Left: menu/outlet chip; centre: page context (optional); right: ConnectionStatus, mute-alert toggle, PendingQueue trigger, Attention indicator (Owner/Manager), UserMenu. Height 56 | Collapses secondary controls into the UserMenu on mobile |
| L-05 | **OutletSwitcher** | Show/change working outlet | `chip` (single outlet, read-only) · `menu` (Owner/Manager with several outlets → opens SCR-002 pattern) | Always shows the current outlet name + OutletStatus (Open/Closed); changing outlet is deliberate, confirms if unsent work exists | Combobox semantics when searchable |
| L-06 | **UserMenu** | Identity and session | one | Shows name + role; **Sign out**, **Change outlet** (if > 1), **My availability** (SCR-018). **No profile/settings** (U12) | Menu semantics |
| L-07 | **MobileNavigation** | Phone/small-tablet nav | bottom bar ≤ 5 destinations + **More** (Sheet) | Same destination set as Sidebar, prioritised per role (§6.3); badge counts for awaiting-acceptance/ready | 44 px targets; labels always visible |
| L-08 | **PageHeader** | Title block of a view | `list` · `detail` (with status + key facts) · `workspace` | Title (`h1`), optional StatusBadge/OrderOriginTag, one **primary** action, ≤ 2 secondary, overflow menu; breadcrumb above on nested views | On mobile primary action moves to StickyActionBar |
| L-09 | **SectionHeader** | Title of a section/card | with description, actions | `h2`/`h3` per outline | — |
| L-10 | **Breadcrumbs** | In-page orientation on nested views `[DESIGN]` | — | Used only for list → detail depth ≥ 2 (e.g. Orders › #1042); never a navigation destination; collapses to a back-link on mobile | `nav aria-label="Breadcrumb"` |
| L-11 | **Tabs** | Switch peer views in one screen | `underline` · `segmented` (≤ 4) | Used where APP_FLOW groups one capability across facets (e.g. SCR-017 Schedule/Attendance). Counts via Badge | Roving tabindex; scrollable on mobile |
| L-12 | **Surface** (Card / Panel) | Group content | `card` (elevation 1) · `panel` (border only) · `inset` (sunken) | Header (SectionHeader) + body + optional footer actions; **no nested cards deeper than 1** | Region landmark only when titled |
| L-13 | **Modal** | Focused interruption | `sm` 400 · `md` 560 · `lg` 720 | Only for confirmation or short forms (≤ 5 fields); long forms use Sheet; mobile ⇒ full-height Sheet | Radix Dialog; focus trap, Esc, scroll lock |
| L-14 | **Sheet** (Drawer / BottomSheet) | Side/bottom panel for create/edit/detail | `side` (right: sm 400 · md 480 · lg 640) · `bottom` (mobile) | The default container for **create/edit** on list screens (PAT-01/02); unsaved-changes guard (PAT-12); sticky footer actions | Focus trap; Esc closes only when clean |
| L-15 | **SplitPane** | Master-detail / POS two-pane | `list-detail` · `catalog-order` (POS) | Desktop/tablet-landscape: two panes (resizable ±); tablet-portrait/mobile: stacked with a persistent summary bar that opens the detail Sheet | Pane landmarks labelled |
| L-16 | **StickyActionBar** | Persistent primary actions | `footer` · `with-summary` (shows Money total) | Mobile/tablet forms and the customer cart; contains the **one** primary Button (+ optional secondary) | Respects safe-area insets; not over content (reserves space) |

### 5.7 Data components (CMP-DT)

| ID | Component | Purpose | Variants | Rules | A11y · responsive |
|---|---|---|---|---|---|
| DT-01 | **DataTable** | The single table system (§11) | `standard` · `selectable` · `expandable` | Sticky header, sortable headers, row actions menu, row status via StatusBadge, tabular right-aligned numbers, empty/loading/error states built in | `<table>` semantics; `aria-sort`; keyboard row focus; **mobile ⇒ card-list transformation** |
| DT-02 | **TableToolbar** | Controls above a table | — | SearchInput + FilterBar trigger + primary list action + bulk-action bar (appears when rows selected) | Wraps to two rows at tablet |
| DT-03 | **FilterBar** | Structured filters | `inline` · `sheet` (mobile) | Shows active filters as FilterChips; **Clear all**; filters are URL-reflected (shareable, C-DEEPLINK safe) | Filter changes announce result count |
| DT-04 | **FilterChip** | One active filter | — | Label: value; remove button with name | — |
| DT-05 | **Pagination** | Page through results | `pages` (page/limit, config lists) · `cursor` (Previous/Next or Load more — orders, bills, audit, history; TRD TD-API-1) | Shows range, not total, when total is unknown | Buttons labelled "Next page" |
| DT-06 | **SortControl** | Sort in card-list mode | — | Equivalent to column sorting where columns are hidden | Select semantics |
| DT-07 | **MetricCard** (also **StatCard**) | One headline number | `value` · `value+comparison` | KPI type token; label states the scope ("This business day"); comparison is text + icon, never colour only; value formatted by Money/num | Reads as "label, value" |
| DT-08 | **Chart** | Distributions/trends on the dashboard (peak hours, payment mix, top items/categories, source mix) | `bar` · `horizontal-bar` · `stacked` · `line` | Uses tone tokens; always has a **table alternative** toggle and text summary; no 3-D; no decoration `[DESIGN]` | Patterns/labels in addition to colour; keyboard-reachable data points |
| DT-09 | **Timeline** (also **ActivityLog**) | Chronological history | `vertical` · `log` (dense) | Order/KOT history, cancellation records, bill revisions, table operations, day lifecycle; each entry = time, actor, event, optional reason; append-only look (no edit affordance) | `<ol>`; times in text |
| DT-10 | **KeyValueList** | Label/value facts | `stacked` · `inline` · `grid` | Used in order/bill/customer/outlet summaries; values use Text/Money | `<dl>` |

### 5.8 Domain-shared components (CMP-D)  — each justified under Rule 4

| ID | Component | Why it is domain-specific | Variants / props | Rules | Composition |
|---|---|---|---|---|---|
| D-01 | **StatusBadge** | The single status system: maps *domain + state* → tone + icon + upstream label (§4.2). Changing a status look happens in one registry | `domain` ∈ order · item · cancellation-request · bill · payment · menu-availability · staff-availability · attendance · table · outlet · restaurant · day · attention · priority · import · submission · connection; `variant`: `badge` · `dot+text` (compact/tables) · `icon-only` (with sr text) | Text + icon + tone always (§14.6); never custom colours; unknown state ⇒ renders neutral with the raw label and logs a defect | Badge + Icon. **Aliases** (thin exports, not separate components): `OrderStatusBadge`, `PaymentStatusBadge`, `BillStatusBadge`, `AvailabilityBadge`, `OutletStatusBadge`, `AttentionBadge`, `PriorityBadge`, `TableStatusIndicator`, `StaffStatusIndicator`, `DayStatusBadge` |
| D-02 | **OrderOriginTag** | Takeaway/table/source semantics are mandatory everywhere (U8, INV-14) | `dine-in` (table label) · `takeaway` · + `source` (Staff · Table QR · Tableless QR · Website · WhatsApp · Reorder) | **Takeaway is always shown** for no-table orders, on staff screens, KDS, bill, customer view | Badge + Icon |
| D-03 | **Money** (= PriceDisplay / CurrencyDisplay) | Financial formatting is a domain rule (§4.4.2) | `amountPaise` (integer) · `size` (body/total/kpi) · `signed` · `strike` (cancelled item) · `muted` | Formats `₹` + `en-IN`; right-aligned tabular; **never** accepts floats; no arithmetic | Text |
| D-04 | **QuantityControl** | Stepper rules (min, max, remove) are order-domain | `stepper` · `compact` (table) | `−` at 1 offers **Remove** (confirm if the line is already sent); long-press repeat disabled (safety); 44 px targets | IconButton ×2 + Text |
| D-05 | **MenuItemRow** | One representation of a menu item across menu admin, order entry and customer menu | `admin` (row: name, category, price, availability, station) · `picker` (staff entry: tap to add) · `customer-card` (image, price, veg marker, add) | Veg/non-veg marker is an icon + text (not colour only); unavailable items render **disabled with reason**, never hidden from the owner, hidden from customers per the resolved menu; price via Money | Surface + Text + Money + StatusBadge + QuantityControl |
| D-06 | **StaffAvatar** | Person + availability | Avatar + `StatusBadge(dot)` | Shows On Break/Unavailable distinctly | Avatar + D-01 |
| D-07 | **TableTile** | Floor object semantics (state, label, session summary) | `tile` (floor grid) · `row` (list) | Shows state via D-01, label, current order count/outstanding hint if permitted, **reserved** marker; tap = open/select per permission; selection mode for transfer/merge | Surface + D-01 + Text |
| D-08 | **OrderSummary** | Order header facts reused on lists, detail, KDS, customer view | `row` · `card` · `header` | order number, D-02, D-01 (stage), age (ElapsedTimer), item count, customer (if captured), awaiting-acceptance emphasis | Surface/Row + D-01 + D-02 + D-19 |
| D-09 | **OrderItemRow** | Item line with state, modifiers, notes, hold, actions — same semantics on order detail, KDS, customer view | `staff` · `kds` · `customer` (no staff actions) · `bill` (snapshot, read-only) | Struck-through + "Cancelled" for cancelled lines (kept visible, ORD-090); `Held` flag; station tag; modifiers/notes indented; actions menu limited to effective permissions | Text + Money + D-01 + IconButton |
| D-10 | **KdsTicket** | The kitchen's card (§12.1) — a distinct layout/density that composes existing parts | `new` · `preparing` · `ready` (state shown by D-01, **column placement is not the only cue**) · `cancellation-request` | OrderSummary header + D-09 `kds` lines + one `xl` action; whole-order oriented; **no "delayed" styling** (KDS-007, NG-014); priority via D-01 `priority` | Surface + D-08 + D-09 + Button(xl) |
| D-11 | **BillSummary** | Bill totals block has strict financial layout | `compact` · `full` | Lines in order: subtotal → discount → service/packaging charges → tax breakdown (CGST/SGST) → **round-off (own line)** → **Total** (`currency-total`); right-aligned; status badges for bill + payment. **Header facts (hardening HF-03, `[TRD §25.9.5, PO-4]`):** once finalized the **invoice number** is shown and is **the same on every revision**; when the bill has been re-finalized (revision ≥ 2) the text **"Revised n"** sits beside it and on every print/reprint (the marker value comes from the server). A `Refunded`/`Cancelled` bill shows its status badge and the lines/totals read-only | KeyValueList + Money + D-01 |
| D-12 | **PaymentSummary** | Payments/refunds ledger presentation | `list` · `inline` | Shows each payment entry (mode, amount, reference masked), derived **Split** label (≥ 2 components), **Outstanding** / **Overpaid** amounts (not statuses), refunds as separate "Refund" rows with minus sign and a **Refunded** total; all figures are **server values** — *Outstanding* uses gross recorded payments (a refund never creates an outstanding amount) and *Overpaid* already nets refunds `[TRD §25.9.1, PO-1]`; the UI shows no "Not paid" caused by a refund | DataTable(compact) or KeyValueList + Money + D-01 |
| D-13 | **CustomerSummary** | Customer facts with privacy rules | `inline` · `card` | Name, phone masked for non-privileged contexts, visit/spend chips (outlet-scoped; Owner cross-outlet) | Surface + KeyValueList |
| D-14 | **ReasonPicker** | Mandatory-reason capture (U14, TD-ORD-5) | `category` select + optional text | Required where upstream requires; category list is configuration; **cannot submit without it** | RadioGroup/Select + Textarea in FormField |
| D-15 | **IssueList** | List of things needing attention with severity and a way to resolve | `warnings` (Day Close DAY-020) · `checklist` (activation ONB-030) · `flags` (AI import low-confidence) | Grouped by type with counts; each item deep-links to the object; **does not alter** the data (DAY-012) | Surface + Text + Badge + Link |
| D-16 | **InformationBlock** | Visual distinction of Fact / Recommendation / Action / Warning / Requires approval (§9.10) | `kind` ∈ fact · recommendation · action · warning · approval | The only way AI or system advice is displayed; labels in text; AI kinds carry the `ai` tone + "AI" label + dashed border | Surface + Icon + Text |
| D-17 | **ProposalCard** | Owner-Agent action confirmation (TRD §31.3) | one | Server-generated summary of the action, scope, expiry countdown, **Confirm** (separate explicit control) and **Reject**; unconfirmed ⇒ nothing executes; expired ⇒ inert | D-16(action) + Button + ElapsedTimer |
| D-18 | **QrCodeCard** | QR preview/print/download | `table` · `tableless` | Shows the target (table label or "No table — takeaway") and the outlet; regenerating a QR confirms (old one stops working — TRD §21.5) | Surface + Button |
| D-19 | **ElapsedTimer** | Order age on KDS/lists | `inline` | **Neutral tone only** — it never escalates to a warning/delay colour (delayed-order workflow is removed upstream, KDS-007/NG-014) | Text(num) |

### 5.9 Registry summary

| Family | Count |
|---|---|
| Foundation (F) | 9 |
| Forms (FM) | 17 |
| Feedback (FB) | 12 |
| Layout (L) | 16 |
| Data (DT) | 10 |
| Domain (D) | 19 |
| **Total reusable components** | **83** |
| Named aliases (thin exports, not components) | 26 (§5.10–5.11) |

### 5.10 Aliases, merges and deliberate omissions

| Requested | Decision | Why |
|---|---|---|
| Heading | = `Text` `h1–h4` (F-04) | Same primitive |
| StatusBadge + Order/Payment/Bill/Availability/Outlet/Attention/Priority badges, TableStatusIndicator, StaffStatusIndicator | One `StatusBadge` (D-01) with named aliases | One status system (R3, R7) |
| PriceDisplay, CurrencyDisplay | = `Money` (D-03) | Same behaviour |
| Notification | = `Toast` `operational` (FB-02) | No notification centre upstream |
| InlineError | = `ErrorState` `inline` (FB-08) | |
| OfflineState | = `ErrorState` `offline` + `EmptyState` `needs-connection` | |
| DestructiveConfirmationDialog | = `ConfirmationDialog` `destructive` | |
| Panel | = `Surface` `panel` | |
| Drawer, BottomSheet | = `Sheet` `side` / `bottom` | |
| StatCard | = `MetricCard` | |
| ActivityLog | = `Timeline` `log` | |
| FormError, FormHelperText | parts of `FormField` | |
| **ColumnVisibilityControl** | **Omitted** | Phase 1 tables have ≤ 8 columns; narrow screens use the card-list transformation (§11) — adding it would add a settings surface no upstream flow needs |
| SplitPane | Kept (`list-detail`, `catalog-order`) | Needed by POS order entry (SCR-023) and master-detail lists |
| DatePicker/TimePicker/DateRangePicker | Kept, each justified in §5.4 | STAFF-002, history filters |
| Sidebar vs MobileNavigation | Both kept | Different transformations of the same destination set (§13) |


### 5.11 Requested-name map (completeness check)

Every component name in the design brief's required catalogue resolves to exactly one canonical component; the **25** names that are not separate components are aliases, variants or parts. With `DayStatusBadge` (added for Day Close) there are **26** named aliases in total. Nothing was added merely to match a name (§5.1 R0).

| Requested name | Canonical component | Kind |
|---|---|---|
| Button | `F-01` Button | **Canonical** |
| IconButton | `F-02` IconButton | **Canonical** |
| Link | `F-03` Link | **Canonical** |
| Text | `F-04` Text / Heading | **Canonical** |
| Heading | `F-04` Text / Heading | **Canonical** |
| Badge | `F-05` Badge | **Canonical** |
| StatusBadge | `D-01` StatusBadge | **Canonical** |
| Avatar | `F-06` Avatar | **Canonical** |
| Divider | `F-07` Divider | **Canonical** |
| Tooltip | `F-08` Tooltip | **Canonical** |
| Input | `FM-01` Input | **Canonical** |
| PasswordInput | `FM-02` PasswordInput | **Canonical** |
| PhoneInput | `FM-03` PhoneInput | **Canonical** |
| SearchInput | `FM-04` SearchInput | **Canonical** |
| Textarea | `FM-06` Textarea | **Canonical** |
| Select | `FM-07` Select | **Canonical** |
| Combobox | `FM-08` Combobox | **Canonical** |
| DatePicker | `FM-09` DatePicker | **Canonical** |
| TimePicker | `FM-10` TimePicker | **Canonical** |
| DateRangePicker | `FM-11` DateRangePicker | **Canonical** |
| Checkbox | `FM-12` Checkbox | **Canonical** |
| Radio | `FM-13` RadioGroup | Alias / variant / part (not a separate component) |
| Switch | `FM-14` Switch | **Canonical** |
| FormField | `FM-16` FormField | **Canonical** |
| FormSection | `FM-17` FormSection | **Canonical** |
| FormError | `FM-16` FormField | Alias / variant / part (not a separate component) |
| FormHelperText | `FM-16` FormField | Alias / variant / part (not a separate component) |
| Alert | `FB-01` Alert | **Canonical** |
| Toast | `FB-02` Toast | **Canonical** |
| Notification | `FB-02` Toast | Alias / variant / part (not a separate component) |
| InlineError | `FB-08` ErrorState | Alias / variant / part (not a separate component) |
| ConfirmationDialog | `FB-03` ConfirmationDialog | **Canonical** |
| DestructiveConfirmationDialog | `FB-03` ConfirmationDialog | Alias / variant / part (not a separate component) |
| LoadingState | `FB-06` LoadingState | **Canonical** |
| Skeleton | `FB-05` Skeleton | **Canonical** |
| EmptyState | `FB-07` EmptyState | **Canonical** |
| ErrorState | `FB-08` ErrorState | **Canonical** |
| PermissionDeniedState | `FB-09` PermissionDeniedState | **Canonical** |
| OfflineState | `FB-08` ErrorState | Alias / variant / part (not a separate component) |
| AppShell | `L-01` AppShell | **Canonical** |
| Sidebar | `L-03` Sidebar | **Canonical** |
| TopBar | `L-04` TopBar | **Canonical** |
| MobileNavigation | `L-07` MobileNavigation | **Canonical** |
| PageHeader | `L-08` PageHeader | **Canonical** |
| SectionHeader | `L-09` SectionHeader | **Canonical** |
| Breadcrumbs | `L-10` Breadcrumbs | **Canonical** |
| Tabs | `L-11` Tabs | **Canonical** |
| Card | `L-12` Surface | Alias / variant / part (not a separate component) |
| Panel | `L-12` Surface | Alias / variant / part (not a separate component) |
| Drawer | `L-14` Sheet | Alias / variant / part (not a separate component) |
| Modal | `L-13` Modal | **Canonical** |
| BottomSheet | `L-14` Sheet | Alias / variant / part (not a separate component) |
| SplitPane | `L-15` SplitPane | **Canonical** |
| Table | `DT-01` DataTable | Alias / variant / part (not a separate component) |
| DataTable | `DT-01` DataTable | **Canonical** |
| TableToolbar | `DT-02` TableToolbar | **Canonical** |
| FilterBar | `DT-03` FilterBar | **Canonical** |
| FilterChip | `DT-04` FilterChip | **Canonical** |
| Pagination | `DT-05` Pagination | **Canonical** |
| SortControl | `DT-06` SortControl | **Canonical** |
| ColumnVisibilityControl | — | **Omitted (justified)**: Phase 1 tables have ≤ 8 columns and use the card-list transformation (§11); adding it would add a settings surface no flow needs |
| MetricCard | `DT-07` MetricCard | **Canonical** |
| StatCard | `DT-07` MetricCard | Alias / variant / part (not a separate component) |
| Timeline | `DT-09` Timeline | **Canonical** |
| ActivityLog | `DT-09` Timeline | Alias / variant / part (not a separate component) |
| OrderStatusBadge | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| PaymentStatusBadge | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| BillStatusBadge | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| AvailabilityBadge | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| OutletStatusBadge | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| AttentionBadge | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| PriorityBadge | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| PriceDisplay | `D-03` Money | Alias / variant / part (not a separate component) |
| CurrencyDisplay | `D-03` Money | Alias / variant / part (not a separate component) |
| QuantityControl | `D-04` QuantityControl | **Canonical** |
| MenuItemRow | `D-05` MenuItemRow | **Canonical** |
| StaffAvatar | `D-06` StaffAvatar | **Canonical** |
| StaffStatusIndicator | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| DayStatusBadge | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| TableStatusIndicator | `D-01` StatusBadge | Alias / variant / part (not a separate component) |
| OrderSummary | `D-08` OrderSummary | **Canonical** |
| BillSummary | `D-11` BillSummary | **Canonical** |
| PaymentSummary | `D-12` PaymentSummary | **Canonical** |
| CustomerSummary | `D-13` CustomerSummary | **Canonical** |

---

## 6. Application Shell

**Traces:** APP_FLOW §29.2 (role × navigation), §29.6 (landings), C-NAV, C-OUTLET, C-VIS, NAV-GAP-007/026 · TRD §13, §17, §19. Navigation **destinations** are fixed by APP_FLOW; their **grouping, labels and layout are `[DESIGN]`** (APP_FLOW §29.0, C-NAV).

### 6.1 Anatomy

```
DESKTOP (≥ 1280)                              TABLET (768–1279)                 MOBILE (< 768)
┌────────┬─────────────────────────────┐     ┌──┬──────────────────────────┐   ┌───────────────────────┐
│Sidebar │ TopBar: outlet · status ·   │     │R │ TopBar                   │   │ TopBar (outlet · ⋯)    │
│ 248    │  alerts · queue · user      │     │a │ ConnectionBanner         │   │ ConnectionBanner       │
│ groups │ ConnectionBanner            │     │i │ PageHeader               │   │ PageHeader (title+CTA→ │
│        │ PageHeader  (breadcrumb)    │     │l │ ───────────────────────  │   │   sticky bar)          │
│        │ ─────────────────────────── │     │  │ Content (SplitPane /      │   │ Content (single col)   │
│        │ Content (Surface, DataTable)│     │72│  stacked)                │   │ StickyActionBar        │
│        │ Toast region (bottom-right) │     └──┴──────────────────────────┘   │ MobileNavigation (5)   │
└────────┴─────────────────────────────┘                                        └───────────────────────┘
```

| Region | Component | Notes |
|---|---|---|
| Global navigation | Sidebar (desktop, tablet `rail`) / MobileNavigation (phone) | Same destination set, different form (DP12) |
| Top navigation | TopBar | Outlet context, connectivity, alerts, queue, user |
| Restaurant/outlet context | OutletSwitcher in TopBar | Restaurant/brand name + working outlet + **Open/Closed** StatusBadge (U2, U11) |
| User identity | UserMenu | Name, role; Sign out · Change outlet · My availability — **no profile/settings** (U12) |
| Notifications | Toast `operational` (+ optional audible cue, mute control) | Realtime alerts per PRD §54 / C-VIS; **no notification-centre screen** |
| Attention indicators | TopBar bell (Owner, Manager) with count of **Open** Attention items → SCR-006; nav badges: *Awaiting acceptance* (accepting roles), *Ready* (handoff roles), *Cancellation requests* (Kitchen) | Indicators link to the existing screens; they are not a new destination |
| Breadcrumbs | `Breadcrumbs` only on nested views | Orientation aid, not navigation (I1) |
| Page headers | PageHeader | Title, key status, one primary action |
| Connectivity | ConnectionBanner | Global, sticky |
| Restaurant / outlet state (staff) | `Alert` (FB-01) pinned under the ConnectionBanner, **only while the state applies** | **Restaurant suspended or deactivated** (staff can still sign in — ONB-014.1): "This restaurant is suspended. New orders are blocked. Existing orders, bills and corrections continue." · **Outlet not activated**: link to SCR-003 (Owner/Manager) · **Outlet Closed** is shown by the OutletSwitcher badge and per-action disabled reasons, not a banner. Shown from the server's platform-status flag; never inferred. Wording is `[DESIGN]` on `[TRD §28.2–28.3]` (hardening HF-08) |
| Responsive navigation | §13.2 | |

### 6.2 What is shared and what differs

| Shared by Owner, Manager, Cashier, Waiter, Kitchen | Differs by role/device |
|---|---|
| AppShell frame, TopBar, Toast region, ConnectionBanner, PermissionDenied handling, tokens, every component | Destinations offered (from effective permissions), landing screen (§29.6), density mode, default view arrangement, primary operational emphasis |
| **Customer** uses `CustomerShell` (L-02): same tokens and components, no sidebar/TopBar controls, single-column, `comfortable` density | Channel-specific sequence (§16, SCR-050…058) |
| **SuperAdmin** uses `AppShell` `platform` variant: Sidebar with exactly SCR-040/041/042, no outlet context, no restaurant destinations (C-SA-IA) | Platform scope |

### 6.3 Navigation model (grouping `[DESIGN]`; destinations `[APP_FLOW §29.2]`)

Items are **shown only when the user's effective permissions grant a related action or view** (C-NAV, U1); an Owner's permission customization changes the set; an item that is not offered is still refused if reached directly (RBAC-007). Matrix shows the **default** offering.

| Group | Destination (SCR) | Owner | Manager | Cashier | Waiter | Kitchen |
|---|---|:-:|:-:|:-:|:-:|:-:|
| **Overview** | Dashboard (004) | ● (+ comparison) | ● (no comparison) | | | |
| | Attention (006) · Daily Brief (007) · What Changed? (008) | ● | ● | | | |
| | Owner AI Agent (009) | ● | | | | |
| **Service** | Floor / tables (019) | ● | ● | | ● (open/select) | |
| | Active orders (020) | ● | ● | ● | ● | ● (view) |
| | Awaiting acceptance (021) | ● | ● | ● | ● | |
| | New order (023) | ● | ● | ● | ● | |
| | Ready / handoff (025) | | | ● (takeaway) | ● | |
| | Kitchen queue (024) | ● (view, Ready) | ● (view, Ready, priority) | | | ● (home) |
| **Billing** | Active bills (026) | ● (via bill actions) | ● | ● (home) | ● (via bill actions) | |
| | Unresolved bills (005) | ● | ● | ● | ● | |
| | Day Close (028) · Reopen Day (029) | ● | ● | ● | | |
| **Menu** | Menu (011) · Outlet overrides (012) | ● | ● | | | |
| | AI Menu Import (010) | ● | | | | |
| **People** | Staff (015) | ● | ● (not Manager accounts unless granted) | own record | own record | own record |
| | Permissions (016) | ● | if granted | | | |
| | Schedule & attendance (017) | ● | ● | own | own | own |
| | My availability (018) | ● | ● | ● | ● (landing step 1) | ● |
| **Setup** | Setup & activation (003) | ● | parts | | | |
| | Restaurant / outlet configuration (013) | ● | | | | |
| | Floor & QR configuration (014) | ● | ● | | | |
| **Customers** | Customer history (031) | ● (cross-outlet) | ● | ● | ● | ● (own outlet) |
| | Feedback (032) | ● | ● | | | |
| **Outlet** | Outlet Open/Closed (030) | ● (TopBar control) | ● | | | |

**Landings** `[APP_FLOW §29.6]`: Owner → SCR-003 until an outlet is activated, then SCR-004 · Manager → SCR-004 · Cashier → SCR-026 · Waiter → SCR-018 then SCR-019 · Kitchen → SCR-024 · multi-outlet Owner/Manager pass SCR-002 first · SuperAdmin → one of SCR-040/041/042 (**OD-UX-2 resolved `[DESIGN DECISION]`**: APP_FLOW leaves the SuperAdmin landing to UI/UX; the landing is **SCR-041** (restaurant list/record)).

### 6.4 Mobile priority sets `[DESIGN]`

| Role | Bottom bar (≤ 5) | Under "More" |
|---|---|---|
| Owner | Dashboard · Orders · Billing · Attention · More | everything else |
| Manager | Dashboard · Orders · Floor · Billing · More | |
| Cashier | Bills · Orders · Day Close · Pickup · More | Unresolved, Customers, availability |
| Waiter | Floor · Orders · Ready · Bills · More | Unresolved, Customers, availability |
| Kitchen | Queue · Orders · Availability | — |

### 6.5 Customer shell (L-02)

Minimal TopBar (outlet name; Takeaway/table tag), one column, sticky bottom action bar (cart summary → submit). Customers never see staff navigation, the outlet switcher, or any permission-denied chrome. Invalid/expired/foreign links render `ErrorState not-found` with **no** order or outlet data (C-INVALID).

### 6.6 Page-header and breadcrumb rules

1. Every view has exactly one `h1` in its PageHeader.
2. The primary action is the single `primary` Button in the header on desktop; on mobile it moves to the StickyActionBar.
3. Status and key facts that define "what am I looking at" (stage, Takeaway/table, outlet state, bill status) live in the header, not buried in the body.
4. Breadcrumbs appear only for depth ≥ 2 (list › detail); on mobile they collapse to a labelled back-link.

---

## 7. Role-Specific Experience

The visual language is **identical** across roles (DP3); roles differ only in **navigation set, density, defaults and emphasis**, all derived from APP_FLOW §29.2/§29.6 and effective permissions. Device assumptions are `[ASSUMPTION]` and never change behaviour.

| Role | Typical device `[ASSUMPTION]` | Density | Landing | Operational emphasis | Primary surfaces | Notes (source) |
|---|---|---|---|---|---|---|
| **Owner** | Desktop; phone for quick checks | `compact` (desktop) | SCR-003 → SCR-004 | Cross-outlet health, exceptions (Attention), setup, configuration, AI insight | Dashboard, Attention, Menu, People, Configuration, Day Close | All authorized outlets; cross-outlet comparison only here (ANALYTICS-003); no audit trail (AUDIT-007) |
| **Manager** | Desktop/tablet | `compact`/`comfortable` | SCR-004 (working outlet) | Outlet performance, staff, floor, priority escalation, corrections | Dashboard, Orders, Floor, KDS (view/Ready/priority), Menu overrides | Assigned outlets only; no HQ view (ANALYTICS-004) |
| **Cashier** | Counter desktop or tablet | `compact`/`comfortable` | SCR-026 Active bills | Billing, payments, refunds, Day Close, pickup of takeaway | Active bills, Bill, Day Close, Unresolved, Pickup | Cannot open tables (ACT-TBL-01 N); Owner config not implied (RBAC-026) |
| **Waiter** | Phone / small tablet | `comfortable` | SCR-018 → SCR-019 | Floor, tables, taking and adding orders, Ready alerts, Served | Floor, Order entry, Order detail, Ready, Bill (create/finalize/reopen) | "Served" is a default Waiter action but permission-driven (I5); cannot refund/discount/print (ACT-BIL matrix) |
| **Kitchen Staff** | Wall/counter tablet or monitor | `kds` | SCR-024 KDS | Queue throughput, readiness, cancellation requests | KDS, Active orders (view) | One shared outlet queue; any Kitchen user acts on any item (KDS-008); stations are grouping only |
| **Customer** | Own phone | `comfortable` | Channel-specific | Order, track, pay-nothing-in-app (no payment execution — NG-011), feedback, reorder | CustomerShell flows | No account, no OTP; table QR shows no details step (ORD-021) |
| **SuperAdmin** | Desktop | `compact` | SCR-040/041/042 (landing SCR-041 — OD-UX-2 resolved) | Provisioning, suspend/deactivate, owner reset, audit | Platform shell | Distinct principal; never a restaurant user (RBAC-020) |

**Role-conditional rendering rule.** The UI reads the user's **effective permission set** (TRD §13.3) from the session and renders affordances from *permissions*, not role names (U1, I5). A role name may drive **defaults** (landing, density, mobile bar) but never *authority*.

---

## 8. Shared UX Patterns

Every pattern below is **reused unchanged** by every screen that needs it. A screen section (§16) names the pattern id; it does not restate it.

### 8.1 Pattern catalogue

| ID | Pattern | Standard behaviour (the contract) | Components |
|---|---|---|---|
| **PAT-01** | **Create** | From the list's primary action (PageHeader). Opens a **Sheet `side`** (≤ 8 fields) or a full page/wizard (> 8 fields or multi-step, e.g. SCR-003). Fields in FormSections; footer: **Save** (primary) + **Cancel**. On server success: Sheet closes, new row is **highlighted for 3 s** and focused, Toast `confirmation` names the object ("Staff member added"). On failure: Sheet stays open, field errors inline, nothing lost | Sheet, FormField, Button, DataTable, Toast |
| **PAT-02** | **Edit** | Row click or row-menu **Edit** opens the same Sheet pre-filled; carries `rev`; **PAT-12** guards unsaved changes; on `REV_MISMATCH` shows PAT-17 | Sheet, FormField |
| **PAT-03** | **Delete** | **Only configuration entities** that upstream allows to be removed (soft status — TRD C-register); **business records (orders, bills, payments, KOTs, Drafts, audit) are never deleted** (INV-04, F9) and show **no delete affordance**; corrections use their own flows (void, cancel, reopen, refund). Delete confirms via PAT-09 | ConfirmationDialog |
| **PAT-04** | **Archive / deactivate** | Used for staff (deactivate), restaurants (suspend/deactivate), QR keys, menu items (unpublish/unavailable). Always reversible wording where upstream allows; states **consequences** ("They will no longer be able to sign in; past records stay") and requires confirm; row shows StatusBadge afterward. Reinstatement of a suspended restaurant is `[OPEN DECISION]` OD-UX-4 (TRD PB-7) | ConfirmationDialog, StatusBadge |
| **PAT-05** | **Search** | SearchInput in TableToolbar; debounce 250 ms; matches visible identifying fields only (e.g. order number, table, customer name/phone, item, staff name); preserves filters; result count announced; clear = Esc | SearchInput |
| **PAT-06** | **Filter & sort** | FilterBar (inline desktop; Sheet on mobile) with FilterChips; filters are **structured** (status, source, table, date range "This business day"…); defaults documented per screen; **Clear all** always visible when filtered; sort via column headers (SortControl in card mode); both reflected in the URL | FilterBar, FilterChip, SortControl |
| **PAT-07** | **Bulk actions** | Only where a screen declares it (Phase 1: none destructive). Selection shows a bulk bar (count + allowed actions); **bulk never bypasses per-item authorization or reasons** — mixed-eligibility selections list which items are skipped and why before confirming | DataTable `selectable`, TableToolbar |
| **PAT-08** | **Confirmation** | Required for: cancellation (item, order, **bill**), void, reopen (bill/day), refund, finalize with warnings, Day Close/Reopen, outlet Closed, deactivate/suspend, permission change, credential reset, QR regenerate, AI approval/proposal. Not for routine acts. Anatomy: verb title · object · consequence · (ReasonPicker if required) · primary verb button · Cancel. **Back/Esc never commits** (C-BACK) | ConfirmationDialog |
| **PAT-09** | **Destructive & financial actions** | `destructive`/`financial` dialog; amounts via Money; **reason is mandatory** where upstream requires it (INV-16); default focus on the safe option; the button text is the exact verb; after success the result and its audit-relevant facts are shown (C-POST); for the highest-impact acts (suspend/deactivate restaurant, Owner credential reset) require typing the restaurant name `[DESIGN]` | ConfirmationDialog, ReasonPicker, Money |
| **PAT-10** | **Approval** | Only the source-defined approval exists: **Owner approval of an AI-imported menu** (RBAC-014) → `InformationBlock kind=approval` + explicit Approve. The Owner-Agent **confirmation** (AI-029) is a separate single-actor gate (ProposalCard). **No dual-approval UI exists** (OD-28). Never present a generic "request approval" flow | InformationBlock, ProposalCard |
| **PAT-11** | **Permission denial** | Two forms. (a) **Action-level**: a granted-but-invalid control is disabled with the reason; a refused attempt shows an inline Alert/Toast naming the **failed factor** and stays in context (C-REFUSAL). (b) **Screen-level**: `PermissionDeniedState page` at the requested location with no protected content. Copy by factor: *permission* ("Your role isn't allowed to do this"), *outlet* ("This belongs to another outlet — switch your working outlet" for authorised outlets; otherwise generic), *state* (the specific state reason, e.g. "Ordering is closed for this outlet"), *approval* ("Needs the Owner's approval"). **Never reveals other-outlet data**; never navigates | PermissionDeniedState, Alert |
| **PAT-12** | **Unsaved changes** | A form with edits warns on close/navigate (Sheet, Modal, route change, tab close): *Discard changes?* with **Keep editing** (default) / **Discard**. Applies to forms only; operational actions never keep hidden draft state | ConfirmationDialog |
| **PAT-13** | **Loading & empty** | Initial load: `LoadingState` mirroring the final layout (Skeleton) after 300 ms; refresh keeps data visible with a subtle progress indicator (no blanking). Empty: `EmptyState` variant per cause — `first-use`, `no-data`, `no-results`, `caught-up`; a permitted-but-empty list never implies hidden data (C-EMPTY). Tables show headers + empty row state, never collapse | LoadingState, EmptyState |
| **PAT-14** | **Submission & offline operation** | Every mutating action follows: *idle → pending → (succeeded \| failed)*. **Pending** shows SubmissionStatus and keeps the form data; **succeeded only on server ack** (U3); **failed** keeps data, names the reason, offers **Retry** (same idempotency key) and never silently drops. **Offline**: only **order commit** and **add items** may queue (TD-OFF-1) — they show "Not sent yet — will send when online" with PendingQueue; **all other actions are disabled offline with the reason** "Needs a connection" (GC-2); queued work is never replayed under another user/outlet; failed queue rows persist until Retry/Discard (confirm) | SubmissionStatus, PendingQueue, ConnectionBanner |
| **PAT-15** | **Realtime updates & connection** | Realtime events are **hints** (U4): lists/queues update in place by `rev`; new/changed items get the single 1.5 s emphasis then a static marker; **no layout jumps under the pointer** (new items insert without moving the focused/hovered row — they appear in a "N new" pill when the user is interacting); ConnectionBanner states Live/Reconnecting/Offline; on reconnect the view **resyncs from the server** and shows "Updated" briefly. KDS shows a prominent disconnected state and **disables actions** until resynced (no offline KDS actions — TRD §17.6) | ConnectionBanner, Toast, StatusBadge |
| **PAT-16** | **Stale data** | Views older than the freshness threshold (KDS/handoff 30 s revalidate; others on focus/refetch) while disconnected show "Last updated hh:mm:ss" with a Refresh control; data is never silently replaced under an open edit — a `conflict` Alert offers **Refresh** | Alert `conflict`, Button |
| **PAT-17** | **Error recovery & concurrency outcomes** | Every outcome in TRD §16.3 has a designed response: `REV_MISMATCH` → "This changed while you were viewing it" + **Refresh** (shows the new state, keeps the user's input for re-apply); `ALREADY_IN_STATE` → treated as converged (shows current state, quiet confirmation, no error styling); `PRICE_CHANGED` → updated lines highlighted with old→new price, customer must re-confirm; `ITEMS_UNAVAILABLE` → names the lines, offers remove/continue (reorder: explicit acknowledge); `CONFIRMATION_REQUIRED` → shows the warning list and a Checkbox "I understand" + confirm; `OUTLET_CLOSED`/`RESTAURANT_SUSPENDED`/`OUTLET_NOT_ACTIVATED` → state reason (PAT-11b); `429` → "Too many attempts — try again in n s"; `5xx`/network → ErrorState with Retry and support reference | Alert, ErrorState |
| **PAT-18** | **Form validation** | Validate on blur and on submit (not on every keystroke); errors beside the field via FormError **and** a summary Alert at the top for submissions with > 3 errors; first invalid field receives focus; server field errors (`data.fields[]`) map to fields; messages say **what to do** (§10.5); required/optional per §10.2 | FormField, Alert |
| **PAT-19** | **Success feedback** | Confirm the **authoritative resulting state** (C-POST): show the updated object (new StatusBadge/stage/amounts) and a Toast naming the effect; irreversible financial results (finalize, payment, refund, Day Close) also show the resulting figures in place. Never a generic "Success" | Toast, StatusBadge, Money |
| **PAT-20** | **Navigation after mutation** | Default: stay on the object and show the new state (C-POST). Create from a list → remain on the list with the row highlighted (open detail only on request). Completing a wizard → the next-step screen of the flow (e.g. activation → SCR-004). Customer submit → SCR-053 awaiting acceptance (APP_FLOW §29.6). Refusals never navigate (C-REFUSAL) | — |
| **PAT-21** | **Responsive transformation** | Standard recompositions for every list/detail/form/dialog (§13); screens do not invent their own breakpoints | DataTable, Sheet, SplitPane |

### 8.2 Pattern ↔ component quick map

| Need | Use |
|---|---|
| Add/edit a record | PAT-01/02 (Sheet + FormField) |
| Dangerous or financial act | PAT-08/09 (ConfirmationDialog) |
| Something is not allowed | PAT-11 (PermissionDeniedState / disabled-with-reason) |
| Network trouble | PAT-14/15/16 (ConnectionBanner, SubmissionStatus, PendingQueue) |
| Someone else changed it | PAT-17 (`conflict` Alert, Refresh) |



### 8.3 Common-states index (Part 11) — every screen consumes these, none invents its own

| State | Canonical component / pattern |
|---|---|
| Loading | `LoadingState` (FB-06) · PAT-13 |
| Skeleton | `Skeleton` (FB-05) via LoadingState |
| Empty | `EmptyState` (FB-07) · PAT-13 |
| Error | `ErrorState` (FB-08) · PAT-17 |
| Permission denied | `PermissionDeniedState` (FB-09) · PAT-11 |
| Offline | `ConnectionBanner` (FB-10) · `ErrorState offline` · PAT-14 |
| Stale data | `Alert conflict` (FB-01) · PAT-16 |
| Realtime update | PAT-15 (+ `Toast operational`, FB-02) |
| Success | `Toast confirmation` + updated object · PAT-19 |
| Warning | `Alert warning` / `InformationBlock warning` (D-16) |
| Restaurant suspended / outlet not activated / outlet Closed (staff) | AppShell status `Alert` (§6.1) + per-action disabled reasons (GC-2); the server refusal text is shown if the state changed meanwhile (PAT-11a) |
| Confirmation | `ConfirmationDialog standard` (FB-03) · PAT-08 |
| Destructive confirmation | `ConfirmationDialog destructive/financial` · PAT-09 |
| Unsaved changes | PAT-12 |

---

## 9. SERVENA Operational UX

Domain rules that every screen in the area follows. Each rule restates an upstream fact (tagged) or is a `[DESIGN]` choice. Components and patterns are referenced, not redefined.

### 9.1 Menu

| Topic | Rule |
|---|---|
| Hierarchy | Categories and subcategories (MENU-001 `[SPEC]`): a **tree** (left Surface on desktop; Combobox/Tabs on mobile) beside an items DataTable. Items show name, category, price, availability, station |
| Item editing | A **Sheet `side` lg** with FormSections: *Basics* (name, description, image, veg/non-veg) · *Pricing & tax* (price via MoneyInput; GST per item/category — PO-TRD-01) · *Variants & portions* · *Modifier groups* (spice, preparation, dietary, add-on, packaging, notes — MENU-004) · *Kitchen* (station mapping, preparation time) · *Availability by order type* (MENU-007). `[SPEC]` fields, `[DESIGN]` grouping |
| Price display | Menu price entry states the policy once: **"Price includes tax"** (PO-TRD-01); a helper under price states **"Existing orders keep the price they were placed at"** (MENU-017) |
| **Price overrides** (outlet) | A row shows **central price and outlet price together** ("Central ₹200 · Outlet ₹220") so the difference is visible; overridden rows carry a Badge "Outlet price"; reset-to-central is a tertiary action (MENU-009.AC1) |
| **Availability** | Three explicit states with text + icon: *Available* · *Unavailable until Day Close* (temporary, business-day scoped — MENU-011 `[SPEC]`, never "until midnight") · *Unavailable (permanent)*. Toggling uses a Sheet/menu with those two choices, not a bare Switch (so the duration is explicit) |
| Publish | Changes are drafts until **Publish** (MENU-008); a publish review lists what changes; unpublished/AI-imported-unapproved items are visibly "Draft" and never shown to customers |
| Audit hint | Price/availability changes are audited (MENU-013) — no UI beyond a neutral footer note; the audit trail is SuperAdmin-only |

### 9.2 Staff

| Topic | Rule |
|---|---|
| Three separate dimensions (STAFF-001) | **Schedule** (planned period, TimePicker pair), **Attendance** (Present/Absent), **Availability** (Available/On Break/Unavailable) are shown as three distinct fields/columns — never merged into one "status" |
| Availability control | Segmented control (3 options) in SCR-018 and on the staff record; each option has icon + text. **Absent forces Unavailable** (STAFF-008): *Available* is disabled when Absent, with the reason "Absent staff are shown as Unavailable" (GC-2) |
| On Break / Unavailable | Helper text: *"You won't receive new work. Work already in progress stays with you."* (STAFF-013 `[SPEC]`). **No assignment UI exists** (no work-assignment subsystem); "assignment" means outlet assignment only |
| Staff lists | StaffAvatar + availability dot; StatusBadge for `Active/Inactive`; outlet column for Owner |
| Outlet reassignment | Confirmation states the effect: *"Next sign-in shows only <new outlet>; history in <old outlet> is kept"* (STAFF-010, ORG-010) |
| Credentials | "Reset credentials" shows a Modal to **set a new password**; states that the old password stops working and active sessions end (TRD §12.5); never displays a password after saving |

### 9.3 Tables

| Topic | Rule |
|---|---|
| Floor view (SCR-019) | Grid of **TableTile** (state via StatusBadge D-01 + label + session hint); filter by state; **Reserved** is a manual marker, no booking UI (TABLE-003, NG-016) |
| Opening a table | Tap an *Available* tile → "Open table" (Owner, Manager, Waiter — ACT-TBL-01); the tile becomes *Occupied* only after server ack (U3) |
| Table session | Detail Sheet shows the session's order(s), bill state, and the **association history** (Timeline) — historical associations are never rewritten (TABLE-017) |
| Billing state | A *Billing* tile allows adding items **only while the bill is not Finalized** (TABLE-010); otherwise the Add action is disabled with "Bill is finalized — reopen it to add items" |
| **Transfer** | Selection flow: source table → choose an *Available* target → ConfirmationDialog stating KOT history is preserved and the kitchen will see the new table (TABLE-009) → source tile shows *Cleaning* |
| **Merge / Split / Move items** | The *shell* (selection mode, confirmation, history entry) is designed; **the behaviour is not**: which order receives new items after a merge, what split does, and whether moved items change order/bill are undecided (TRD PB-13). These three actions render **disabled with "Not available yet"** until decided — `[OPEN DECISION]` OD-UX-5. Finalized bills are never restructured (TABLE-018) |
| Concurrency | If another user changed the table/order, show PAT-17 `REV_MISMATCH` ("The table was updated by someone else") |
| Clear / Reserve | Manager/Owner (ACT-TBL-03/04). Clear requires every order of the session to be terminal; otherwise disabled with the reason (TRD T7) |

### 9.4 Orders

| Topic | Rule |
|---|---|
| Order header | OrderSummary `header`: number, **OrderOriginTag (Takeaway or table label + source)**, stage StatusBadge, age (ElapsedTimer), customer if captured. Customer orders show **Awaiting acceptance** with accept/reject controls to authorised staff |
| Item lines | OrderItemRow `staff`: state badge, qty, modifiers, notes, station tag, **Held** flag; **cancelled lines remain visible, struck through** (ORD-090) |
| Add items | Opens the picker (§12.2); after commit shows "**Additional KOT #n sent**" (ORD-080) in the Timeline and a Toast; offline → queued per PAT-14 |
| Edit before KOT | In place (Pending items). **After a KOT, edit is presented as "Change item"** and explained: *"The kitchen will receive a cancellation and a new ticket"* (ORD-086) |
| Hold / Void / Re-fire | Item actions menu (Hold, Void: Owner/Manager; Re-fire: Owner/Manager/Kitchen — ACT-MOD-03/04, ACT-KOT-04). Hold shows the **Held** flag; **releasing a hold has no upstream action** — `[OPEN DECISION]` OD-UX-8 (TRD PB-5): the Release control is not designed and not shown. Re-fire is **kitchen-only** `[PO-3, resolved]`: the control exists, it never adds a line or a price to the bill, and a re-fire of a Finalized bill's order is allowed; a **kitchen cancellation on a Finalized bill is refused** with "Reopen the bill first" (K1) |
| **Cancellation** | One **Cancel** action whose behaviour follows item state, explained in the dialog: *Pending* → cancelled directly · *Sent* → "A cancellation ticket goes to the kitchen" · *Preparing/Ready* by non-kitchen → button reads **"Request cancellation"** and the dialog states the kitchen must accept (ORD-088) · *Kitchen* → **"Cancel"** directly (ACT-CAN-04) · *Served/Picked Up* → **no cancel**; shows *"Already served — use bill correction or a refund"* (ORD-082, PRD §65). **Reason is mandatory** (ReasonPicker). **Bill guard `[TRD §25.9.4, PO-3 K1]`:** while the order's bill is **Finalized**, every cancel/void — **including the Kitchen's** — is refused with *"Reopen the bill first"*; while it is **Refunded** or **Cancelled** the refusal reads *"This bill is refunded/cancelled — items can't be changed"*. Where the bill state is known the control is rendered disabled with that reason (GC-2); otherwise the server refusal is shown (PAT-11a). Re-fire is never blocked by the bill |
| Cancellation request | Appears on the order and on the KDS as an `Open` request with StatusBadge; **it never auto-cancels**; if it becomes stale it shows the AttentionBadge; if the item is served first it resolves to "No longer needed" (ORD-093) |
| Rejected customer order | Shown with the rejection reason; **label of the terminal outcome is undecided** — `[OPEN DECISION]` OD-UX-1 (TRD PB-4); interim `[DESIGN]` copy "Not accepted" (neutral tone), never "Cancelled" or "Completed" |
| Completed | Completed requires every item terminal **and** handoff done; the badge never appears because a bill is paid (ORD-063) |

### 9.5 KDS

Specialised layout in §12.1. Domain rules: shared outlet queue; every Kitchen user can act on any item (KDS-008); tickets are whole-order; New → Preparing → Ready are item-level with an order roll-up ("fully Ready only when all required items are Ready" — KDS-009); **cancellation requests** are prominent with **Accept** / **Decline**; **priority** is manual (Normal/High/Urgent — KDS-005); the **timer is neutral** (no delay colours — KDS-007); stale requests show an Attention marker; Takeaway is always labelled.

### 9.6 Waiter

| Topic | Rule |
|---|---|
| Flow | Availability → Floor → table → order → Ready alert → Served (PRD §27, APP_FLOW §29.3.D) |
| Floor | `comfortable` TableTile grid; own/assigned emphasis is **not** defined upstream (no waiter-table assignment) so no per-waiter table filter is invented |
| Ready orders | SCR-025 list of Ready items grouped by order; **Mark Served** (table) per item/order with xl buttons; a Ready alert is a Toast `operational` + badge on the nav |
| Takeaway | Ready takeaway items offer **Mark Picked Up** to Waiter and Cashier (ACT-HND-02); a table order never offers Picked Up (§15.0) |
| Availability | One tap segmented control, always reachable from the UserMenu |

### 9.7 Billing

| Topic | Rule |
|---|---|
| Two statuses, side by side | **Bill status** (Draft · Finalized · Reopened · Cancelled · **Refunded** Partial/Full) and **Payment status** (Not Paid · Paid) as separate StatusBadges in the header; they are independent (BILL-001, INV-09) — a refund changes the bill status and the refunded/overpaid amounts, **never** the payment status. No "Partial" status — use **Outstanding ₹x** / **Overpaid ₹x** amounts (I6) |
| Layout | PageHeader (bill/invoice number once finalized, with **"Revised n"** for revision ≥ 2) → OrderSummary → lines (snapshot, `bill` OrderItemRow/DataTable) → **BillSummary** → **PaymentSummary** → Timeline (finalization revisions, reopen events, refunds, cancellation — each entry shows the **business day it took effect** and the time). Cancelled items are excluded from totals but visible struck-through (ORD-087) |
| BillSummary order | Subtotal · Discount · Service charge · Packaging charge (only configured ones) · CGST · SGST · **Round-off (own line)** · **Total**. A caption states *"Prices include tax"* (PO-TRD-01). All amounts via Money; **no client arithmetic** (U7) |
| Finalize | Primary Button when Draft/Reopened; allowed while the outlet is Closed (ORG-027). After success: lock icon, invoice number, totals frozen; helper "To change a finalized bill, reopen it" (BILL-004) |
| Record payment | Sheet: MoneyInput + mode RadioGroup (UPI · Cash · Card) + optional reference ("Never invent a reference" → field is optional, placeholder example only); **Add another payment** supports split; summary shows running total vs bill total (server values) |
| Overpayment | Shown explicitly, persistent, with an Info Alert until resolved by correction/refund (PAY-012) |
| Reopen | Cashier/Manager/Owner/**Waiter** (BILL-017): `financial` ConfirmationDialog with mandatory reason (BILL-014); works for paid bills; allowed while outlet Closed (ORG-034) |
| Refund | Cashier/Manager/Owner: `financial` dialog; amount (MoneyInput, ≤ paid less refunds already recorded), mode, reason; states **"This records a refund. No money is moved by SERVENA."** (BILL-012 `[SPEC]`) |
| Cancel bill | Available for **Finalized** bills only (Owner/Manager/Cashier): `financial` ConfirmationDialog with a **mandatory reason**; helper text "Cancelling does not refund any payment. Record a refund separately if money was paid." (BILL-007); afterwards the bill shows `Cancelled` and cannot be re-billed `[OD-UX-9 resolved]` |
| Print / reprint | Cashier only (ACT-BIL-08): **Print** / **Reprint** labelled; reprint shows identical data and a Timeline entry; printing uses the browser print stylesheet (thermal printing out — DF-05) |
| Corrections after close | Reopening a bill after Day Close still works (DAY-022). A correction (re-finalization, refund, cancellation) is **counted in the business day in which it actually happens**, and the original day stays attached to the bill (DAY-022, TRD §25.9.7, PO-6): the revision/refund row reads *"Recorded in <business day it happened> · bill from <original business day>"* — never "Counted in <original day>" |
| Refunded status | The bill-level **Refunded (Partial/Full)** status is canonical (SPEC BILL-002, APP_FLOW §16.1/AF-051): the bill-status badge shows it once a refund is recorded on a Finalized bill; refund ledger rows remain in PaymentSummary. Restrictions are visible, not silent (GC-2): on a Refunded bill **Reopen, Cancel bill and Record payment are rendered disabled with the reason "This bill has been refunded"**, lines are read-only, and **Refund** stays available while part of the recorded payments is unrefunded (`[TRD §25.9.2]`; see the status table below) `[OD-UX-3 resolved]` |

**Bill status → what SCR-027 offers** `[DESIGN]` rendering of `[TRD §25.4–25.9]`; every action additionally requires the user's effective permission (U1). "Disabled" = rendered with the stated reason (GC-2).

| Bill status | Lines · discount · charge | Record payment | Refund | Reopen | Cancel bill | Finalize |
|---|---|---|---|---|---|---|
| **Draft** | editable | yes | yes if a payment exists (ledger only; status unchanged) | not offered (a Draft is corrected directly — PAY-012) | disabled: "Only a finalized bill can be cancelled" | yes |
| **Finalized** | read-only + lock "Reopen to change" | yes if outstanding | yes if a payment exists → bill becomes **Refunded** | yes (reason) | yes (reason) | — |
| **Reopened** | editable | yes | yes if a payment exists (ledger only) | — | disabled: "Finalize the bill first" | yes (keeps the same invoice number) |
| **Refunded** | read-only | disabled: "This bill has been refunded" | yes while refunds < recorded payments, else disabled "Fully refunded" | disabled: "This bill has been refunded" | disabled: "This bill has been refunded" | — |
| **Cancelled** | read-only (struck status) | disabled: "This bill was cancelled" | yes if a payment exists (ledger only; recorded after cancellation, no re-bill) | disabled: "A cancelled bill can't be reopened" | — | — |

Cancelling shows beside its confirmation: *"Payments already recorded stay as they are. Record a refund separately if money was paid. The order can't be billed again."* (BILL-007, PO-5). A new bill can't be created for a cancelled bill's order (BILL-015).

### 9.7b Not-to-do list for money screens

No editable totals · no UI-computed refund kind (Partial/Full), net sales or overpayment · no floating-point math · no hiding of round-off · no payment-execution UI (no "Pay now", no gateway buttons — PAY-008/NG-011) · no card fields.

### 9.8 Day Close

| Topic | Rule |
|---|---|
| Wording | **"Close business day"** — never "Close day for the night"; subtitle explains *"Closing the business day does not close the outlet"* (U11, ORG-022) |
| Layout | PageHeader (day Running, since <time>) → **MetricCards** (Gross sales · **Net sales** · Refunds · Discounts · Paid · Outstanding · UPI · Cash · Card) — *Net sales = gross sales − refunds recorded this business day* (DAY-026) and is **shown signed**: it can be negative ("−₹200.00 · refunds exceed gross sales") and is never clamped; gross and net come from the server, the closed-day record offers a KeyValueList breakdown (first finalizations · corrections counted today · refunds · refunds on cancelled bills) `[TRD §27.3, §25.9.7]` → **Cash reconciliation** panel (Expected cash [server], Counted cash [MoneyInput], Variance [server-computed, signed, with text "Over"/"Short"/"Matches"]) → **IssueList warnings** (DAY-020 groups: orders not Completed/Cancelled · awaiting acceptance · items Pending/Sent/Preparing/Ready · unresolved bills) → Notes → confirm |
| Confirmation | If warnings exist: Checkbox **"I understand these stay unresolved and unchanged"** + primary **Close business day** → ConfirmationDialog `financial` summarising totals. **Variance never blocks** the action (CASH-006); it is shown neutrally (not as an error) |
| Success | Authoritative closed-day record shown in place (totals, expected/actual/variance, closing user, time) and "Next business day started" (C-POST, DAY-004) |
| Retry / duplicate | Lost connection → "Checking whether it closed…" then shows the single existing record (DAY-009/010); never a double-submit |
| **Reopen Day (SCR-029)** | Shows the most recently closed day only; reason required; blocked states rendered as **state refusals** with the exact reason: *"Not the most recent closed day"* / *"The current business day already has activity"* (DAY-015/021). **Re-close** reuses the Day Close view with "Reopened" status and a note that totals and cash will be recalculated |
| Day vs outlet | `DayStatus` (Running/Closed/Reopened) and `OutletStatus` (Open/Closed) are different badges in different places; never combined |

### 9.9 Customer

| Flow | Rule |
|---|---|
| **QR / website ordering** | CustomerShell: outlet header → menu (MenuItemRow `customer-card`, category chips, search) → cart (StickyActionBar with item count; totals only if provided by server) → **details only when required** → submit → SCR-053. **Table QR: no details step** (ORD-021, PO-AF-02) — the form is not rendered. **Tableless QR / website: name + phone required**, no OTP (ORD-030/031/042) |
| Takeaway | Shown clearly as **Takeaway** on cart, confirmation and tracking for every no-table order (INV-14) |
| Closed / not activated / suspended | `SCR-056` "Ordering is unavailable right now" (no cart UI) · `SCR-058` suspended/blocked notice with the upstream statement and **no menu** (PO-AF-03). Contact channel for the SERVENA technical team is **not defined upstream** — `[OPEN DECISION]` OD-UX-6 |
| Submission | Refused fields highlighted inline (`customer.name/phone`); sold-out lines named (MENU-015); price changes re-confirmed (PRICE_CHANGED); pending/failed per PAT-14; duplicate tap returns the same order |
| Tracking (SCR-053) | Vertical step list in customer words: *Waiting for the restaurant* (Awaiting acceptance) → *Order accepted* → *Being prepared* → *Ready* → *Served / Picked up* → *Completed*; rejection shows reason. Updates live (hints) with manual refresh; no staff names or internal notes (customer-safe projection) |
| Bill view (SCR-054) | Read-only BillSummary; **no payment action** (NG-011) |
| Feedback (SCR-055) | Only for Completed orders; 1–5 rating (RadioGroup with labels, not stars-only) + optional comment (counter) + Submit; once per order (FEEDBACK-006) — afterwards read-only thank-you |
| Reorder | From a Completed order: shows items that **will** be ordered with *current* prices and excludes unavailable items **listed with a clear message**; requires **Acknowledge** when anything is excluded (TD-CUS-4); result is a **new order** (SCR-053) |
| No resume | Never offer to resume an abandoned cart (ORD-094) |
| WhatsApp | See SCR-057: copy conventions only |

### 9.10 AI and "information kinds"

AI must never *look like* operational truth (DP13, U9). Every piece of system/AI-supplied guidance is rendered through **InformationBlock** with one of five **kinds**; each uses at least three cues (icon, text label, container style).

| Kind | When | Container | Label (text) | Icon | Tone |
|---|---|---|---|---|---|
| **FACT** | Server-computed numbers/records (including those quoted in an AI brief) | Solid neutral Surface, left bar | "From your data" + source ("Day Close totals", "Orders today") | database/bar-chart | `neutral` |
| **RECOMMENDATION** | AI-written suggestion | **Dashed** border, `ai-subtle` fill | "AI suggestion — you decide" | sparkle | `ai` |
| **ACTION** | An executable proposal (Owner Agent) | `ai` border + footer controls | "Proposed action — nothing happens until you confirm" + expiry | zap | `ai` + primary **Confirm** |
| **WARNING** | Something needs attention (Day Close warnings, Attention items, import flags) | Solid `warning-subtle` | "Needs attention" | alert-triangle | `warning` |
| **REQUIRES APPROVAL** | Owner approval of an AI-imported menu | `warning` + lock | "Owner approval required" | lock | `warning` |

Rules: (1) Facts and recommendations are in **separate sections** (AI-021). (2) AI content is **never** inside operational tables, status badges, or alongside a number as if it were data; numbers shown with a recommendation are Facts with a source. (3) AI output carries a small "AI" tag and generation time. (4) **Attention items are rule-based evidence, not AI** — they use `warning`, show evidence and use non-accusatory wording (ATTENTION-004). (5) **AI unavailable** → ErrorState/EmptyState "AI isn't available right now — your restaurant keeps running" (INTEG-001, AI-040). (6) **What Changed?** with no baseline → "Comparison unavailable" (AI-028.AC1). (7) The Owner Agent never displays an action as done until the **server returns** the result; unconfirmed proposals show "Not executed" (AI-029.AC1). (8) No AI control appears for roles without the permission.

---

## 10. Forms, Labels, Placeholders and Content

### 10.1 Labels

| Rule | |
|---|---|
| L1 | Every control has a **visible label above it** (never placeholder-only); labels are noun phrases in sentence case, ≤ 3 words (*Phone number*, *Counted cash*, *Reason*) |
| L2 | Labels use **upstream terms** (§10.6) |
| L3 | Group related fields in FormSections with a heading |
| L4 | Switches and checkboxes label the **effect** ("Available for ordering") |

### 10.2 Required / optional indicators

Required fields show `*` after the label with a visually hidden "required" and a form-level legend "* required". Optional fields in otherwise-required forms show "(optional)". Do not mark both on one form beyond this scheme.

### 10.3 Placeholders `[DESIGN]`

A placeholder is an **example or hint of format**, never an instruction or the label. Colour `--text-muted`; disappears on input.

| Control | Placeholder |
|---|---|
| Menu search | `Search menu items…` |
| Order search | `Search orders by order number` |
| Staff search | `Search staff by name` |
| Customer search | `Search by name or phone number` |
| Staff email | `Enter staff email` · helper "Used to sign in" |
| Phone | `Enter phone number` (country code shown separately, e.g. +91) |
| Item name | `e.g. Paneer Tikka` |
| Money | `0.00` (with ₹ prefix) |
| Reason (free text) | `Add a short note (optional)` |
| Counted cash | `Enter counted cash` |
| Customer name | `Enter your name` |
| Table label | `e.g. T4` |
| Note to kitchen | `e.g. Less spicy` |

Do not invent placeholder **data** that implies product behaviour (no fake prices or customers in the UI contract).

### 10.4 Helper text, limits and formatting

| Topic | Rule |
|---|---|
| Helper | One sentence under the control; states the **consequence or format** ("Existing orders keep their price") |
| Character limits | Show a counter `n/limit` from 80 % of the limit: notes ≤ 1 000 chars (customer line notes ≤ 1 KB, TRD §29.3), feedback comment ≤ 1 000 (TRD §30.3), cart ≤ 50 lines |
| Phone | E.164 normalised; display grouped; validation message "Enter a valid phone number with country code" |
| Money | See §4.4.2 |
| Email | Lower-cased, trimmed |
| Names | Trimmed; no case rewriting |
| Quantity | Integers ≥ 1 |

### 10.5 Messages

| Type | Pattern | Example |
|---|---|---|
| **Validation** | *What to fix*, not *what is wrong* | "Enter a phone number with country code" (not "Invalid phone") |
| **Required** | "Enter <field>" / "Select <field>" | "Select a reason" |
| **Error (system)** | Cause in plain words + what the user can do + reference | "We couldn't send the order. Check your connection and try again. Reference 7f3a…" |
| **Refusal (by factor)** | The factor + the way forward; never other-outlet data | "Only the Owner can change permissions." · "Ordering is closed for this outlet." |
| **Success** | `<Object> <past participle>` + the effect | "Item cancelled. A cancellation ticket was sent to the kitchen." |
| **Pending** | "Sending…" / "Not sent yet — will send when you're back online" | |
| **Empty** | Title + one line + CTA | "No orders yet — new orders will appear here." |

Never expose error codes, stack traces or database words; show the **support reference** (`requestId`) separately and copyable.

### 10.6 Terminology (use the upstream words)

| Use | Not |
|---|---|
| Takeaway | "Pickup order", "No-table order" |
| Awaiting acceptance | "Pending approval" |
| Accept / Reject (customer orders) | Approve/Decline |
| Cancel · Void · Hold · Re-fire (distinct meanings, ORD-073) | Using them interchangeably |
| KOT / kitchen ticket | "Print order" |
| Served (table) · Picked Up (takeaway) | "Delivered" |
| Finalize · Reopen (bill) | Close/Open bill |
| Not Paid / Paid · Outstanding · Overpaid | "Partial", "Due" |
| Close business day · Reopen day | "End of day" |
| Outlet Open / Closed | Conflating with the business day |
| Deactivate (staff) · Suspend (restaurant) | |
| Working outlet | "Branch", "Store" |
| Order link (customer) | "Account" |

### 10.7 Privacy in the UI

Customer phone/name appear only where the viewer's scope allows (CUSTOMER-004/021); lists show masked phone (`+91 ••••• ••210`) with reveal only inside the customer detail for authorised roles `[DESIGN]`; payment references are masked to the last 4 in lists; no PII in toasts, page titles or URLs.


### 10.8 Number, date, time and phone formats (global)

| Item | Rule |
|---|---|
| Currency | `Money` only (§4.4.2): `₹1,25,000.00` |
| Integers/counts | `en-IN` grouping (`1,25,000`); no abbreviations (no "1.2L") in operational views |
| Percentages | Up to 2 decimals, `%` suffix; never used to compute money in the UI |
| Dates | `07 Oct 2026` (day, short month, year); same year may omit the year in lists |
| Times | 24-hour `18:45` on staff operational surfaces `[ASSUMPTION AS4]`; seconds only for timers/audit |
| Timestamps | `07 Oct 2026, 18:45`; relative ("5 min ago") only where freshness matters (queues), with the absolute time in a tooltip/`title` |
| Durations | `mm:ss`, then `h:mm:ss` |
| Phone | E.164 stored; displayed grouped (`+91 98765 43210`); masked per §10.7 |
| Business-day wording | "This business day", "Previous business day" — never "Today" for day-scoped data (U15) |

### 10.9 Confirmation and destructive-warning templates

| Kind | Template |
|---|---|
| Standard confirmation | **Title:** `<Verb> <object>?` · **Body:** one sentence on the effect · **Buttons:** `<Verb>` (primary) / `Cancel` |
| Destructive | **Title:** `<Verb> <object>?` · **Body:** what is lost or changes + what is kept ("Past records are kept") · reason field if required · **Buttons:** `<Exact verb>` (destructive) / `Keep` (default focus) |
| Financial | Body states the **amount via Money**, the object and "This records … — no money is moved by SERVENA" where applicable (BILL-012) |
| Irreversible-ish (suspend/deactivate) | Adds typed-name confirmation (PAT-09) |
| Unsaved changes | **Title:** `Discard changes?` · **Buttons:** `Keep editing` (default) / `Discard` |

Where upstream terminology is locked (§10.6) it is preserved **exactly**; wording conventions are reusable across screens and are not invented per developer.

---

## 11. Tables and Data-Dense UI

**One table system: `DataTable` (DT-01).** Only columns and cell content change per screen.

| Aspect | Standard |
|---|---|
| Structure | Surface → TableToolbar → table → Pagination; sticky header (`--surface-sunken`, 12/16 semibold secondary text) |
| Row height / density | `compact` 40 · `comfortable` 48 · `kds` n/a (tickets, not tables); cell padding per §4.5 |
| Column order | **Identifier (leftmost) → Status (second) → descriptive columns → numeric/amount columns (right-aligned) → row action (rightmost)** |
| Column limit | ≤ 8 visible columns per table; extra detail goes to the row's Sheet |
| Sorting | Click header (`aria-sort`); one sort at a time; default sort per screen (newest first for time series); a visible sort indicator (icon, not colour) |
| Filtering/search | PAT-05/06 above the table; filter state in the URL |
| Pagination | `cursor` for orders, bills, history, audit (high volume — TRD TD-API-1); `pages` for config lists; range text "1–25" |
| Selection | Only when the screen declares bulk actions (none destructive in Phase 1); checkbox column + bulk bar |
| Row click | Opens the object (Sheet or detail view); the whole row is a hit target and keyboard-activatable; inline action buttons do not trigger row click |
| Actions | At most **one inline primary** action per row (e.g. *Accept*); everything else in an **overflow menu** (IconButton `⋯`) |
| Status | Always `StatusBadge`; never a bare coloured dot or text |
| Numbers | Tabular, right-aligned; currency via Money; zero shown as `₹0.00` |
| Truncation | Single-line ellipsis with full value in a Tooltip **and** accessible name; never truncate numbers or statuses |
| Empty / loading / error | Built-in: Skeleton rows (5) / EmptyState variants / ErrorState `section` with Retry (PAT-13/17) |
| Live updates | In-place by `rev`; no re-sort under the pointer while hovering/focused — new rows queue under a "N new" pill (PAT-15) |
| Overflow | Desktop: horizontal scroll with sticky first column only when > 8 columns is unavoidable (justify); never horizontal scroll on phones |
| **Mobile** | **Card-list transformation**: each row becomes a Surface with *title line* (identifier + StatusBadge), 2–3 key facts as KeyValueList, and the primary action; filters in a Sheet; sort via SortControl |
| Totals row | Financial tables may show a **server-computed** footer total; never client-summed |

---

## 12. KDS / POS / Operational Screens

Specialised **layouts**, not a separate design system: they use the same tokens, Button/StatusBadge/Money/Form components and accessibility rules; they differ in density (`kds`/`comfortable`), size and arrangement.

### 12.1 KDS (SCR-024)  `[DESIGN]` on `[SPEC KDS-*]`

```
┌ TopBar-lite: outlet · connection · my availability · mute ──────────────────────┐
│ Station: [All] [Tandoor] [Curry] …   (view grouping only — never hides items)     │
├───────────── New ───────────┬────────── Preparing ─────────┬──────── Ready ───────┤
│ ┌ #1042  Takeaway  ⏱ 04:12 ┐│ ┌ #1039 T4  ⏱ 11:40 ▲High ┐ │ ┌ #1036 T2 ⏱ 14:05 ┐ │
│ │ 2 × Paneer Tikka  [Start]││ │ Dal Makhani ● Preparing  │ │ │ ✓ all items ready│ │
│ │ 1 × Naan  ▸ Added  [Start]│ │ [Mark Ready]             │ │ └──────────────────┘ │
│ └──────────────────────────┘│ └──────────────────────────┘ │                       │
└─────────────────────────────┴──────────────────────────────┴───────────────────────┘
```

| Aspect | Specification |
|---|---|
| Frame | AppShell with **Sidebar hidden**, TopBar-lite, `kds` density; theme follows system (dark recommended in kitchens `[DESIGN]`, same tokens) |
| Columns | New (= item *Sent*) · Preparing · Ready — columns are an **arrangement**; each ticket **also** carries its StatusBadge so state is never carried by position alone |
| Ticket | **KdsTicket**: header = order number (`--type-kds-order`), OrderOriginTag (**Takeaway** always labelled), source, ElapsedTimer (neutral), priority badge when High/Urgent; lines = OrderItemRow `kds` (qty × name, modifiers, notes, station tag, state) |
| Ordering | By **priority (Urgent › High › Normal)** then oldest first `[DESIGN]`; never re-ordered under a finger (PAT-15) |
| Actions | `xl` (56 px) buttons: **Start** (Preparing) per item, **Mark Ready** per item and **Mark all ready** per ticket (ACT-KDS-01/02); Owner/Manager see **Mark Ready** only (not Start) per permission (I5); priority control for Manager/Kitchen (ACT-KDS-03) |
| Additional items | New lines on an existing ticket get an **"Added"** tag; cancelled lines stay visible, struck-through with "Cancelled" (ORD-090) |
| **Cancellation request** | A distinct ticket variant/banner on the affected ticket with the item, requester reason and **Accept** / **Decline** `xl` buttons (ACT-CAN-07); stale ⇒ AttentionBadge; **no auto-action** |
| Re-fire | A re-fire appears under the original item as an additional line tagged **Re-fire** (text + icon). It is **informational**: no Start/Ready buttons, no state of its own, no price, and it stays on the ticket while the ticket is active (re-fire adds no item state — TRD §15.2, §25.9.4; it never changes the bill). The **Re-fire** action (Owner/Manager/Kitchen) is in the item menu and is refused for a Cancelled item ("Nothing to re-fire"). Kitchen **Cancel** on an order whose bill is Finalized/Refunded/Cancelled is refused (§9.4) |
| Fully Ready | A ticket shows "All items ready" only when every required item is Ready (KDS-009.AC1) |
| Realtime/offline | PAT-15/16: live pill; **disconnected ⇒ full-width error banner and all action buttons disabled** ("Reconnecting — actions are paused"); on reconnect resync and show "Updated" (KDS-016.AC1: no duplicate cards) |
| Empty | EmptyState `caught-up`: "No active orders" |
| Large queues | Virtualised columns; ticket min-width 280; overflow scroll inside each column; counts in column headers |
| Audio | Optional new-ticket cue; **off until the user enables it** (browser policy) and mutable from the TopBar |
| Responsive | ≥ 1024 landscape: 3 columns · tablet portrait / phone: single column with **Tabs** (New / Preparing / Ready) and counts; a **pinned bar above the Tabs** ("n cancellation requests") and a count badge on the tab that contains them, so a request is never hidden in an inactive tab |
| Accessibility | Tickets are focusable articles; actions have unique names ("Mark Paneer Tikka ready"); no timed auto-dismiss; announces "New ticket #1042" politely |

### 12.2 POS — staff order entry (SCR-023) and counter billing (SCR-026/027)

```
SplitPane catalog-order (tablet landscape / desktop)                       Phone: stacked
┌ Catalog ───────────────────────────────┬ Order ─────────────────────────┐   ┌ Catalog (chips+grid) ┐
│ [Search menu items…]                   │ Table T4 ▾  |  Takeaway         │   │ …                    │
│ [Starters][Mains][Breads]…  (chips)    │ ── lines (OrderItemRow staff) ──│   │ StickyActionBar:     │
│ ┌item┐┌item┐┌item┐ (MenuItemRow picker)│ qty stepper · note · remove      │   │ [Order · 3 items ▸]  │
│                                        │ Customer details ▸ (optional)   │   │  → opens order Sheet │
│                                        │ [ Send to kitchen ]  (xl primary)│   └──────────────────────┘
└────────────────────────────────────────┴─────────────────────────────────┘
```

| Aspect | Specification |
|---|---|
| Layout | SplitPane `catalog-order`; catalog left (categories as chips, SearchInput, MenuItemRow `picker` grid 44+ px), order panel right; on phones the order is a persistent summary bar that opens a Sheet |
| Context | Table chip (or **Takeaway** toggle) at the top of the order panel; the order type is always visible (U8) |
| Lines | OrderItemRow draft lines with QuantityControl, note field, remove; **line amounts come from the server** (resolved prices); no client-computed totals (U7); offline shows unit prices only and "Prices confirmed when sent" `[DESIGN]` |
| Primary action | **Send to kitchen** (`xl`, `primary`) = commit (Staff → Confirmed, ACT-ORD-01/02). Label is `[DESIGN]`; upstream term is "Confirmed → KOT sent". Disabled with reason when the outlet is Closed or the item list is empty |
| Customer details | An **optional** collapsible section (ACT-ORD-03); upstream says "customer details if required" without defining when — `[OPEN DECISION]` OD-UX-7: no condition is invented, the section is optional |
| Add-items mode | Same screen opened on an existing order (title "Add items to #1042"); button reads **Send additional items**; explains an additional KOT will be sent (ORD-080) |
| Draft | Leaving before sending leaves an uncommitted Draft (C-BACK); the back action never sends |
| Offline | Eligible: queue with "Not sent yet" + PendingQueue; all else disabled (PAT-14) |
| **Counter billing** | SplitPane `list-detail`: Active bills list (SCR-026) + selected Bill (SCR-027); tablet portrait: stacked; keyboard-first on desktop (Tab order: filters → list → primary action) |
| Touch | All operational controls ≥ 44 px; ≥ 8 px spacing; no hover-only affordances; swipe is never the only way |
| Consistency | Same Button/Money/StatusBadge/ConfirmationDialog as admin screens — nothing POS-specific is restyled |


---

## 13. Responsive Design

### 13.1 Breakpoints and device classes  `[DESIGN]`

| Token | Min width | Device class | Primary roles `[ASSUMPTION]` |
|---|---|---|---|
| `--bp-sm` | 640 | large phone | Waiter, Customer |
| `--bp-md` | 768 | **Tablet** (portrait) | Waiter, Cashier, Kitchen, Manager |
| `--bp-lg` | 1024 | Tablet (landscape) / small laptop | Cashier, Kitchen, Manager |
| `--bp-xl` | 1280 | **Desktop** | Owner, Manager, Cashier, SuperAdmin |
| `--bp-2xl` | 1536 | Wide / wall display | Kitchen display |

Device classes used in specs: **Mobile** < 768 · **Tablet** 768–1279 · **Desktop** ≥ 1280 (KDS wall display ≥ 1536 uses the same desktop layout with `kds` type scale). Layout responds to **width and input type** (`pointer: coarse` ⇒ `comfortable` density), not user-agent. Text must remain usable at 200 % zoom and reflow at 320 px width.

### 13.2 Canonical component transformations

| Component | Mobile (< 768) | Tablet (768–1279) | Desktop (≥ 1280) |
|---|---|---|---|
| **AppShell navigation** | MobileNavigation bottom bar (≤ 5) + More Sheet; TopBar compact | Sidebar **rail** 72 (expands on demand) | Sidebar expanded 248 |
| **PageHeader** | Title + overflow; **primary action → StickyActionBar** | Title + actions inline | Title + breadcrumb + actions inline |
| **DataTable** | **Card-list transformation** (title+status, 2–3 facts, primary action) | Table with priority-1/2 columns | Full table (≤ 8 columns) |
| **TableToolbar / FilterBar** | SearchInput + "Filters" button → Sheet `bottom` | Inline search + filter chips | Inline |
| **Forms** | Single column; labels above; StickyActionBar | Single column, max-width 560 | Two-column only within FormSections of short fields; max-width 720 |
| **Modal** | Becomes full-height `Sheet bottom` | Centered `md` | Centered `sm/md/lg` |
| **Sheet `side`** | Full-screen `Sheet bottom` (80–100 % height) | 480 wide | 400/480/640 |
| **Tabs** | Horizontally scrollable | Standard | Standard |
| **SplitPane** | Stacked + summary bar → Sheet | Two panes (landscape) / stacked (portrait) | Two panes, resizable |
| **MetricCard grid** | 1 col (2 for compact metrics) | 2 cols | 4 cols |
| **Chart** | Full width, simplified labels, table toggle | Full width | In grid |
| **Breadcrumbs** | Back-link | Collapsed middle | Full |
| **ConfirmationDialog** | `Sheet bottom` with full-width stacked buttons, primary on top | Modal | Modal |
| **Toast region** | Top, full-width, stacked 1 | Bottom-right | Bottom-right |
| **Select** | Full-height Sheet list | Popover | Popover |

### 13.3 Role-critical responsive behaviour

| Surface | Mobile | Tablet | Desktop |
|---|---|---|---|
| **POS order entry (SCR-023)** | Catalog full screen; order summary bar → Sheet; `xl` Send | Landscape: SplitPane catalog-order; portrait: stacked with persistent summary | SplitPane with keyboard shortcuts disabled by default (no single-key shortcuts — §14.2) |
| **KDS (SCR-024)** | Single column with state Tabs | Landscape 2–3 columns; portrait Tabs | 3 columns, ≥ 1536 wall layout |
| **Floor (SCR-019/014)** | 2-column TableTile grid, list toggle | 4–6 col grid | 6–8 col grid + detail Sheet |
| **Tables (data)** | Card-list | Reduced columns | Full |
| **Bill (SCR-027)** | Stacked sections; actions in StickyActionBar (primary Finalize/Record payment) | Two-column: lines left, summary/payment right | Same + Timeline column |
| **Day Close (SCR-028)** | Single column; Confirm in sticky bar | Two-column | Two-column with sticky summary |
| **Customer ordering (SCR-050…055)** | Native target (mobile-first): single column, sticky cart bar, large type (`comfortable`) | Centered column 640 | Centered column 640 with outlet header |
| **Dashboard (SCR-004)** | Metrics 1–2 col, charts stacked | 2 col | 4 col + side panel for Attention |

Rules: never simply scale desktop; **orientation changes** must not lose state; keyboards on mobile (virtual) must not hide the primary action (sticky bars use `visualViewport`-aware positioning); safe-area insets respected.

---

## 14. Accessibility

Applies **globally** to the component system; a screen inherits it and adds only screen-specific notes.

### 14.1 Targets

| | |
|---|---|
| Standard | **WCAG 2.2 Level AA** `[DESIGN]` (the product states no explicit standard) |
| Contrast | Text ≥ 4.5:1, large text ≥ 3:1, UI/graphics ≥ 3:1 — verified for both themes (§4.3); a token change below threshold is a defect |
| Touch targets | Operational controls ≥ **44 × 44 px** (stricter than the 24 px AA minimum); KDS ≥ 56; spacing ≥ 8 |
| Text resize / reflow | 200 % zoom and 320 px reflow without loss of content or function |
| WCAG 2.2 additions (hardening HF-12) | **2.4.11 Focus Not Obscured** — sticky TopBar, ConnectionBanner and StickyActionBar must never hide the focused element: scroll containers use `scroll-padding-block` equal to the sticky heights. **2.5.7 Dragging Movements** — SplitPane resize and any reorder have a keyboard/click alternative (the divider is a focusable `separator` moved with arrow keys; nothing is drag-only). **3.3.7 Redundant Entry** — data entered earlier in a flow is not asked again (customer name/phone is prefilled when a failed submit is retried). **3.2.6 Consistent Help** — when the technical-team contact exists (OD-UX-6) it appears in the same place on SCR-001 and SCR-058 |

### 14.2 Keyboard

| Rule | |
|---|---|
| K1 | Every function is operable by keyboard; logical tab order follows visual order; no keyboard traps (modals trap focus intentionally and return it on close) |
| K2 | Skip-to-content link first in the shell |
| K3 | Composite widgets use roving tabindex (Tabs, menus, radio groups, grid of TableTiles with arrow keys, KDS tickets with arrow keys between tickets) |
| K4 | **No single-character shortcuts by default** (WCAG 2.1.4). If shortcuts are added later they must be disable-able/remappable |
| K5 | Esc closes the topmost overlay only when it has no unsaved changes (PAT-12) |
| K6 | Enter activates the focused row's primary action; Space toggles selection |

### 14.3 Focus

A visible **2 px `--focus-ring`, offset 2 px** on every focusable element in both themes (≥ 3:1 against adjacent colours); never `outline: none` without replacement; focus moves to the first error on failed submit, to a dialog's safe option on open (destructive) or first field (forms), and returns to the trigger on close; focus is never stolen by Toasts or realtime updates.

### 14.4 Semantics and screen readers

| Topic | Rule |
|---|---|
| Landmarks | `banner`, `navigation` (labelled), `main`, `complementary` (side panels), `search` |
| Headings | One `h1` per view; no skipped levels |
| Tables | Real `<table>` with `<th scope>`, `aria-sort`; card-list transformation preserves list semantics and the same accessible names |
| Names | Icon-only controls have `aria-label`; action buttons in lists name their object ("Accept order 1042") |
| Status | StatusBadge exposes state as text (not `aria-hidden`); realtime counts use `aria-live="polite"` |
| Live regions | Errors/refusals: `role="alert"` (assertive, once); results/pending/success: `role="status"` (polite); realtime "N new" is polite and debounced |
| Forms | Labels programmatically bound; helper and error via `aria-describedby`; required via `aria-required`; groups in `fieldset/legend` |
| Dialogs | `role="dialog"`/`alertdialog`, `aria-labelledby`/`-describedby` |
| Charts | Text summary + data table alternative; no information in colour alone |

### 14.5 Errors and time

Errors are announced and associated with fields; messages say how to fix (§10.5). Auto-dismissing Toasts never carry the **only** copy of essential information and errors persist (WCAG 2.2.1). The ProposalCard expiry is announced at start and when ≤ 1 minute remains (not every second); an expired proposal can be re-requested (it is inert, not a failure).

### 14.6 Colour independence

Every state = **text + icon + tone** (StatusBadge). Charts add patterns/direct labels. Deltas use ▲/▼ and words. Required fields use `*` + text. Focus and selection use shape (ring, leading bar) in addition to colour.

### 14.7 Motion

`prefers-reduced-motion` honoured globally (§4.9): no motion beyond opacity ≤ 100 ms; no auto-advancing content; the single "new item" emphasis degrades to a static marker.

### 14.8 Authentication accessibility (WCAG 3.3.8)

SCR-001 allows **paste** and password managers, offers show-password, has **no CAPTCHA**, no OTP, no cognitive test (consistent with AUTH-002, NG-012).

### 14.9 Verification

Automated axe checks in Jest/Playwright on every screen state; manual keyboard-only and screen-reader pass for the critical journeys of TRD §39.3 (E1–E12); contrast regression test against the token table.

---

## 15. Design-Token Implementation Mapping

Conceptual only — **no application code**. It makes the brief directly implementable with the mandated stack (React · Vite · Tailwind · shadcn/ui · Radix).

### 15.1 Layers and files (conceptual)

```
src/design-system/
  tokens/        primitives (raw values)  →  semantic (aliases)  →  theme sets (light, dark)  →  density sets
  ui/            shadcn/Radix-based primitives (Button, Input, Dialog, Sheet, Table, …)       [CMP-F, FM, FB, L, DT]
  servena/       domain components (StatusBadge, Money, OrderItemRow, KdsTicket, …)           [CMP-D]
  patterns/      PAT-01…21 recipes (form-in-sheet, confirm-flow, submission-state, …)
  shells/        AppShell, CustomerShell, role navigation maps
```

Screens import **only** from `shells`, `patterns`, `servena`, and `ui`; they may not import Radix or define colours directly (enforced by lint — §15.6).

### 15.2 CSS variables

| Concern | Mapping |
|---|---|
| Naming | shadcn's standard variables are kept for compatibility (`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`); SERVENA adds `--surface`, `--surface-sunken`, `--surface-elevated`, `--text-*`, `--border-*`, tone families `--success-{subtle,fg,solid,on-solid}` (same for warning, error, info, progress, ai, neutral, accent), `--selected`, `--hover`, `--active`, `--focus-ring`, spacing/type/radius/elev/motion/z tokens |
| Mapping to shadcn | **Name collision (hardening HF-09):** shadcn's `--accent`/`--accent-foreground` are the neutral hover/selected fill used by menu items, select options and ghost buttons, whereas §4.2's `--accent` is SERVENA's teal. In code, shadcn's `--accent` ← `--hover`-equivalent neutral (`--secondary`) and `--accent-foreground` ← `--secondary-foreground`; the SERVENA teal is exposed as `--accent-brand` (Tailwind `accent-brand`, tone family `accent.subtle/fg/solid/on`). Everywhere in this brief "`--accent`" means **`--accent-brand`**; a menu item hover must never turn teal. `--destructive` ← `--error-solid`; `--muted` ← `--surface-sunken`; `--muted-foreground` ← `--text-muted`; `--input` ← `--border-strong`; `--ring` ← `--focus-ring`; `--card` ← `--surface`; `--popover` ← `--surface-elevated` |
| Sidebar variables (shadcn Sidebar, hardening HF-11) | `--sidebar` ← `--surface` · `--sidebar-foreground` ← `--text-secondary` · `--sidebar-primary` ← `--primary` · `--sidebar-primary-foreground` ← `--primary-foreground` · `--sidebar-accent` ← `--selected` · `--sidebar-accent-foreground` ← `--primary` (7.0:1 on `--selected`, §4.3) · `--sidebar-border` ← `--border-subtle` · `--sidebar-ring` ← `--focus-ring`; the active item keeps its leading bar and `aria-current` (not colour alone) |
| Themes | `:root` = light; `.dark` (and `prefers-color-scheme: dark` bootstrap) = dark values; same names |
| Density | `[data-density="compact"]`, `"comfortable"`, `"kds"` on the shell root swaps `--row-h`, `--control-h`, `--space-density`, and the **type-scale set** (`--type-body-*`) |
| Money/numerics | A utility class applies `font-variant-numeric: tabular-nums lining-nums`; the `Money` component is the only formatter |

### 15.3 Tailwind

| Concern | Mapping |
|---|---|
| Colours | `theme.extend.colors` references CSS variables (semantic names, tone objects: `success.subtle/fg/solid/on`). **No raw palette** is exposed to app code |
| Spacing | Tailwind's 4 px scale matches §4.5; only the listed steps are enabled (`theme.spacing` restricted) |
| Font sizes | `theme.fontSize` defines the **type tokens** (`display, h1…h4, body, body-sm, label, caption, helper, table, num, currency, currency-total, kpi, button, nav, badge, kds-*`) with their paired metrics (leading, weight, tracking); no default `text-xl` family |
| Radius / shadow / motion | `borderRadius` = radius tokens; `boxShadow` = `elev-1…4`; `transitionDuration`/`TimingFunction` = motion tokens |
| Breakpoints | `screens` = §13.1 |
| Arbitrary values | Disallowed (`[…]` values) by lint except inside `design-system/tokens`; justified exceptions recorded (R10) |

### 15.4 shadcn / Radix mapping per component

| SERVENA component | Source primitive |
|---|---|
| Button, IconButton, Badge, Alert, Skeleton, Card/Surface, Breadcrumbs | shadcn component styled with **cva** variants from §5; `tailwind-merge` |
| Tooltip, Popover, DropdownMenu (UserMenu, row menus), Tabs, Checkbox, RadioGroup, Switch, Select, Avatar, Separator, ScrollArea | **Radix** primitives (via shadcn) |
| Modal, ConfirmationDialog | Radix **Dialog** / **AlertDialog** |
| Sheet (`side`/`bottom`) | shadcn **Sheet** (Radix Dialog) with a drawer (vaul) variant for `bottom` |
| Combobox, DatePicker/Calendar, DateRangePicker | shadcn **Command + Popover**, **Calendar** (react-day-picker) |
| Toast | shadcn **Sonner** (or Radix Toast) wrapped as `Toast` with `confirmation/operational/error` |
| Form, FormField, FormSection | shadcn **Form** on **react-hook-form** + **Zod** (client convenience; server Joi is authoritative) |
| DataTable | shadcn **Table** + **TanStack Table** (sorting, selection) + TanStack Query for data |
| Sidebar, MobileNavigation | shadcn **Sidebar** (rail/expanded) and a custom bottom bar built from the same nav map |
| Chart | shadcn **Chart** (Recharts) |
| Icon | **lucide-react** (single set, 1.75 stroke) |
| Timeline, KeyValueList, domain components | Composed from the above; no new primitives |

### 15.5 Variant system

Variants are **props mapped to class sets via cva**: `Button{variant,size}`, `Badge{tone,variant}`, `StatusBadge{domain,state,variant}`, `Surface{variant}`, `Sheet{side,size}`, etc. A variant not listed in §5 cannot be added without a DDR (R6/R7). StatusBadge reads a **single registry** `domain → state → {tone, icon, label}` (§4.2); changing a status look edits the registry only.

### 15.6 Enforcement (conceptual)

| Rule | Mechanism |
|---|---|
| No raw colours / sizes / shadows / durations in app code | ESLint + Stylelint rules; token-compliance script (as in the design-system skill) |
| No Radix/shadcn imports from screens | `import/no-restricted-paths` (screens ↛ `ui`/Radix directly except via `servena`/`patterns`) |
| Contrast regression | Unit test over the token table (§4.3) |
| Accessibility | axe in CI on component and screen states |
| Visual consistency | Dev-only **component gallery** route rendering every component × variant × state × theme × density `[DESIGN]` |
| Fonts | Inter self-hosted (no third-party font request), `font-display: swap` |


---

## 16. Screen Design — All Phase 1 Screens

**Coverage:** all **44** APP_FLOW destinations — SCR-001…032, SCR-040…042, SCR-050…058 — each exactly once. Screen ids, purposes, actors and navigation (`NAV-nnn`) are `[APP_FLOW §29]`; everything about *how it is composed* is `[DESIGN]` unless tagged otherwise. A screen **composes** library components and patterns; it does not redefine them.

**Screens are compositions, not redesigns.** Every screen is `GLOBAL TOKENS + COMMON COMPONENTS + DOMAIN COMPONENTS + SHARED UX PATTERNS`. A screen block specifies only **layout, information hierarchy, content, component composition, actions, state behaviour and responsive behaviour**; it **must not** redefine fonts, colours, button/input/table/modal/badge styles, spacing or radius unless a documented extension (§21) requires it. Every block ends with a **Reuses** row.

### 16.1 How to read a screen block

| Row | Meaning |
|---|---|
| Flow · Roles | `AF-nnn` flow(s) and the actors from the APP_FLOW catalogue; actions inside the screen still render from effective permissions (U1) |
| Purpose · Entry → Exit | One-line purpose; entry points and exit paths (`NAV-nnn`) |
| Template · Layout | One of the templates below + the screen's arrangement |
| Composition | Ordered components (ids in §5); **only composition and configuration are defined here** |
| Hierarchy · Primary CTA · Secondary | Reading order; the single primary action; supporting actions |
| Forms · Data views · Filters | Fields and their components; tables/cards; filters/search |
| States | **Empty** (variant) · **Loading** · **Error** · **Denied** · **Offline** · **Realtime/stale** · **D** = the default recipe below |
| Confirm · Destructive | Which patterns guard actions |
| Responsive · A11y | Screen-specific notes only (global rules in §13/§14) |

**Default recipes (`D`)** — used unless a screen says otherwise:

| State | Default |
|---|---|
| Loading | `LoadingState` mirroring the layout (PAT-13) |
| Error | `ErrorState section` with Retry + support reference (PAT-17) |
| Denied | `PermissionDeniedState page` at the requested location, no protected content (PAT-11b); action-level refusals per PAT-11a |
| Offline | `ConnectionBanner`; last loaded data stays visible read-only with "Last updated hh:mm"; mutating actions disabled with "Needs a connection" (PAT-14) |
| Realtime/stale | none, unless the row says ⚡ (PAT-15/16) |
| Responsive | §13.2 default transformations |
| Accessibility | §14 + the component rules |

**Templates** (arrangements of the same components, not new systems):

| ID | Template | Arrangement |
|---|---|---|
| TPL-01 | **Entry** | Centered Surface on `background`, no shell (SCR-001) |
| TPL-02 | **Insight** | PageHeader + MetricCard grid + Chart/Surface panels + InformationBlocks (SCR-004, 006…009) |
| TPL-03 | **List + Sheet** | PageHeader → TableToolbar → DataTable → Sheet for create/edit/detail (PAT-01/02) |
| TPL-04 | **Guided flow** | Step list + FormSections + IssueList + sticky actions (SCR-003, 010, 040) |
| TPL-05 | **Board** | Filter row + TableTile grid + detail Sheet (SCR-014, 019) |
| TPL-06 | **Workspace** | SplitPane (catalog/order or list/detail) (SCR-023, 026/027) |
| TPL-07 | **Queue** | Column board of KdsTickets (SCR-024) |
| TPL-08 | **Record** | PageHeader (status) + sections + Timeline (SCR-022, 027, 028, 041) |
| TPL-09 | **Customer page** | CustomerShell single column + StickyActionBar (SCR-050…058) |

---

### 16.2 Access, setup and context

#### SCR-001 — Sign-in  ·  TPL-01

| | |
|---|---|
| **Flow · Roles** | AF-002 · Owner, Manager, Cashier, Waiter, Kitchen Staff. *(SuperAdmin uses the same layout at the **platform entry**, C-SA-AUTH, `[DESIGN]`; APP_FLOW names no separate SuperAdmin sign-in screen.)* |
| **Purpose** | Email **or** phone + password; no 2FA, no self-service reset `[SPEC AUTH-001/002/005]` |
| **Entry → Exit** | Unauthenticated access to any protected destination (NAV-051), sign-out (NAV-048), invitation link · → role landing (NAV-001/004/049/050/055), SCR-002 for several outlets (NAV-002); failure stays here (NAV-005) |
| **Layout** | Centered Surface 400 px; wordmark above; no AppShell |
| **Composition** | Surface · Heading · FormField(Input "Email or phone number") · FormField(PasswordInput) · Button · Alert · Text |
| **Hierarchy · CTA** | Heading → fields → **Sign in** (primary, full width) |
| **Secondary** | Show/hide password; helper "Forgot your password? Staff: ask your Owner or Manager to reset it. Owners: contact SERVENA." — **no reset link** (AUTH-005). *(Contact detail: OD-UX-6, open)* |
| **Modes** | **Invitation redemption** `[TRD TN-1, §12.5]`: same Surface, heading "Set your password", fields *New password* + *Confirm password* (min 8, ≤ 72 bytes, no composition rules — TD-AUTH-1), primary **Set password** → then Sign in. Expired/used link → `ErrorState not-found`: "This invitation link is no longer valid. Ask for a new one." (no contact detail invented). **Session expired** (C-SESSION): Alert "Please sign in again" with the return-to path preserved |
| **Forms** | Identifier (accepts email or phone; one field), password; validation on submit only (avoid account hints) |
| **States** | Empty n/a · Loading: button `loading` · Error: **one generic message** "The email/phone or password is incorrect, or the account is inactive." — identical for wrong password and inactive (AUTH-006.AC1 `[SPEC]`) · rate-limited: "Too many attempts. Try again in n minutes" · Denied n/a · Offline: button disabled "Sign-in needs a connection" · Realtime — |
| **Confirm · Destructive** | None |
| **Responsive · A11y** | Full-width on mobile; `autocomplete="username"/"current-password"`; **paste allowed**; no CAPTCHA/OTP (§14.8); error `role="alert"` once |
| **Reuses** | Surface, Text, FormField, Input, PasswordInput, Button, Alert, ErrorState |

#### SCR-002 — Working-outlet selection  ·  TPL-03 (selection list)

| | |
|---|---|
| **Flow · Roles** | AF-002 · Owner; Manager with > 1 assigned outlet `[AUTH-008]` |
| **Purpose** | Choose the outlet all subsequent actions run in |
| **Entry → Exit** | NAV-002 (after sign-in), OutletSwitcher (any time) · NAV-003 → Owner SCR-003/004, Manager SCR-004 |
| **Layout** | Full-width page (no sidebar when first shown) or Modal `md` when opened from the OutletSwitcher; selectable Surface cards |
| **Composition** | PageHeader (title only) · Surface×n (outlet name, address, StatusBadge outlet, StatusBadge day) · Button |
| **Hierarchy · CTA** | List of outlets → **Continue** (primary, enabled when one is selected) |
| **Secondary** | Sign out |
| **States** | Empty: `EmptyState no-data` "You aren't assigned to an outlet yet. Ask your Owner or Manager." (AF-002 failure path; wording `[DESIGN]`) · Loading D · Error D · Denied D · Offline: list from last load, Continue disabled if no connection |
| **Confirm** | Changing outlet with **unsent offline work** → ConfirmationDialog "You have 2 orders not sent yet. They will stay with <old outlet>." (queued work never replays under another outlet — TRD §19.5) |
| **Responsive · A11y** | Cards in a radio-group semantics (single selection); keyboard arrows |
| **Reuses** | PageHeader, Surface, StatusBadge, Button, EmptyState, ConfirmationDialog |

#### SCR-003 — Owner operational setup + activation checklist  ·  TPL-04

| | |
|---|---|
| **Flow · Roles** | AF-004, AF-005 · Owner (Manager: menu, tables/QR, staff parts) `[APP_FLOW §29.1]` |
| **Purpose** | Guided setup steps 1–11 and activation (ONB-020…031); an outlet cannot accept orders before activation (ONB-032) |
| **Entry → Exit** | NAV-004 (first sign-in), NAV-008 (add outlet) · NAV-006 activation → C-POST, Owner landing becomes SCR-004; NAV-007 stays with missing items listed |
| **Layout** | Left **step list** (vertical Tabs: Identity · Address & GST · Restaurant type · Outlets · Menu · Staff & permissions · Floor, tables & QR · Kitchen stations · Payment information · Ordering channels · Review & activate); right content with FormSections; top **IssueList `checklist`** |
| **Composition** | PageHeader (outlet being set up) · Tabs(vertical) · FormSection · FormField(Input/Select/Switch/FileUpload) · IssueList · StickyActionBar · Button |
| **Hierarchy · CTA** | Current step content → **Save and continue**; final step → **Activate outlet** (primary) |
| **Secondary** | Back, Skip-for-now only where upstream allows leaving a step incomplete (checklist decides); "Import menu with AI" (→ SCR-010) / "Add menu manually" (→ SCR-011) |
| **Forms** | Per step per ONB-020…029: identity (name, brand, logo, contact), address & GST/tax, type/cuisine template, outlet(s), stations & routing, payment information (modes), channels; **no invented fields** (checklist contents are defined in PRD-ONB-033.1) |
| **Tables/cards** | Staff and floor steps embed the same List+Sheet components used by SCR-015/014 |
| **States** | Empty: `first-use` per step · Loading D · Error D · Denied D · Offline: edits disabled "Setup needs a connection" · Refusal: **Activate** refused → IssueList shows the missing items (ONB-030.AC1) |
| **Confirm** | Activation → ConfirmationDialog (what changes: the outlet can accept orders); unsaved step changes guarded (PAT-12) |
| **Responsive · A11y** | Mobile: step list becomes a collapsible "Step n of 11" header; progress announced politely; each step is a landmark with heading |
| **Reuses** | Tabs, FormSection, FormField, Input, Select, Switch, FileUpload, IssueList, StickyActionBar |

#### SCR-030 — Outlet Open/Closed control  ·  Sheet (`TPL-03`-style panel)

| | |
|---|---|
| **Flow · Roles** | AF-006, AF-007 · Owner, Manager |
| **Purpose** | Manually set outlet availability; **not** Day Close (ORG-022, ORG-032) |
| **Entry → Exit** | OutletSwitcher chip in TopBar and Dashboard header → C-POST (new state shown) |
| **Layout** | Popover → Sheet `side sm`: current OutletStatus, plain-language **effects list**, one action |
| **Composition** | Sheet · StatusBadge(outlet) · KeyValueList (effects) · Button · ConfirmationDialog |
| **Content** | Closing says: *"New orders from all channels and staff stop. Orders already accepted continue through kitchen, billing and payment. Customer orders waiting for acceptance stay waiting."* (ORG-021…034). Opening says: *"The outlet accepts new orders again; waiting customer orders can be accepted or rejected."* |
| **States** | Suspended restaurant: **Open** disabled with "The restaurant is suspended" (TRD §28) · Not activated: shows the setup link · Offline disabled · Denied: not rendered for Cashier/Waiter/Kitchen |
| **Confirm** | `standard` ConfirmationDialog both directions; no automatic/scheduled control exists (ORG-032) |
| **A11y** | Chip is a button with `aria-haspopup`; state change announced |
| **Reuses** | OutletSwitcher, Sheet, StatusBadge, KeyValueList, ConfirmationDialog |

---

### 16.3 Insight, AI and unresolved work

#### SCR-004 — Outlet dashboard  ·  TPL-02

| | |
|---|---|
| **Flow · Roles** | AF-066 · Owner (all authorized outlets **+ cross-outlet comparison**), Manager (assigned outlets, **no comparison**) |
| **Purpose** | Answer business questions before reports: sales, orders, AOV, payment mix, top items/categories, source mix, peak hours, discounts, cancellations, refunds, open orders, staff activity, payment variance (ANALYTICS-001/002) |
| **Entry → Exit** | Landing for Owner (after activation) and Manager (NAV-050) · → SCR-005 (NAV-012), SCR-006 (NAV-013), drill-downs only to destinations the actor may open (C-DRILL) |
| **Layout** | PageHeader (outlet + **"This business day, since <last Day Close>"** — U15) → **Needs attention** row (unresolved bills, open Attention, awaiting acceptance) → **Headline MetricCards** → Charts → panels. Owner: outlet segmented control + **Compare outlets** DataTable panel |
| **Composition** | PageHeader · OutletSwitcher · MetricCard · Chart · DataTable (comparison, Owner) · Surface · Link |
| **Hierarchy · CTA** | Headline numbers → exceptions → distributions. No primary CTA (read-mostly); links are secondary |
| **Data views** | Values are server rollups (≤ 60 s staleness, TRD §37.5); no client aggregation; amounts via Money |
| **Filters** | Owner: outlet; none else (business-day scope is fixed) |
| **States** | Empty: `no-data` "No activity yet this business day." · Loading D (skeleton cards) · Error D (section-level so one failed panel doesn't blank the page) · Denied D · Offline D · Realtime ⚡ "Updated hh:mm" + refresh on `day.closed` and every minute |
| **Responsive** | §13.3 (1–2 / 2 / 4 columns) |
| **A11y** | Each Chart has text summary + table toggle; MetricCards read "label, value, scope" |
| **Reuses** | MetricCard, Chart, DataTable, Surface, OutletSwitcher, EmptyState |

#### SCR-005 — Unresolved bills  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | AF-067 · Owner, Manager, Cashier, Waiter |
| **Purpose** | Bills Draft, Reopened, or Finalized + Not Paid remain visible **across Day Close until resolved** (ANALYTICS-010/011) |
| **Entry → Exit** | NAV-012 (dashboard), nav · row → SCR-027 |
| **Composition** | PageHeader · TableToolbar · FilterBar · DataTable · Pagination(cursor) |
| **Columns** | Bill/order no. · OrderOriginTag · Bill status · Payment status · Total · **Outstanding** · "Since <business day>" |
| **Filters** | Bill status, outlet (Owner), date range (FM-11, default "All unresolved"), search by order/bill number |
| **States** | Empty: `caught-up` "No unresolved bills." (never implies hidden data — C-EMPTY) · Realtime ⚡ `bill.*` · others D |
| **Reuses** | DataTable, FilterBar, StatusBadge, OrderOriginTag, Money |

#### SCR-006 — Attention items  ·  TPL-02

| | |
|---|---|
| **Flow · Roles** | AF-062 · Owner, Manager (own outlets) |
| **Purpose** | Review evidence; act, dismiss or resolve Open items (ATTENTION-002/006); an insight, never an alert (ATTENTION-005) |
| **Entry → Exit** | NAV-013, TopBar bell · NAV-014 act → a relevant **permitted** destination (C-DRILL), NAV-015 dismiss/resolve → C-POST |
| **Layout** | List of **InformationBlock `warning`** cards: title (signal), evidence KeyValueList (current vs usual), time, outlet; status filter (default Open) |
| **Composition** | PageHeader · FilterBar · InformationBlock(warning) · KeyValueList · StatusBadge(attention) · Button |
| **Wording** | Evidence only; **no accusation or cause** (ATTENTION-004): "Cancellations this business day: 9 (usual: 3)" — template-based |
| **Hierarchy · CTA** | Evidence → **Review** (primary: opens the related view) · **Dismiss** · **Resolve** (secondary) |
| **Confirm** | Dismiss/Resolve: lightweight confirm, no reason required (upstream defines only actor/time — ATTENTION-006) |
| **States** | Empty: `caught-up` · Realtime ⚡ `attention.created` (Toast + bell count) · others D. Auto-resolution not shown (**OD-UX-11**, TRD PB-9) |
| **Reuses** | InformationBlock, KeyValueList, StatusBadge, FilterBar |

#### SCR-007 — Daily AI Brief  ·  TPL-02

| | |
|---|---|
| **Flow · Roles** | AF-060 · Owner (authorized outlets), Manager (own outlets) |
| **Purpose** | The outlet's business-day brief (AI-026/027) |
| **Layout** | PageHeader (outlet, business day, **"AI-generated summary", generated hh:mm**) → **Facts** section (InformationBlock `fact` + MetricCards) → **Recommendations** section (InformationBlock `recommendation`) — **separate sections** (AI-021) |
| **Composition** | PageHeader · Select (previous business days that have briefs, `[DESIGN]`) · InformationBlock · MetricCard · Text |
| **States** | Empty `first-use`: "The brief appears after you close the business day." · AI/brief unavailable: ErrorState "The brief isn't available right now. Your restaurant keeps running." — facts-only fallback shown if the server supplies it (AI-041) · Loading D · Offline D |
| **Notes** | Delivery is in-app retrieval only (no push — TD-AI-1) |
| **A11y** | AI tag is text; recommendation container has `aria-label="AI suggestion"` |
| **Reuses** | InformationBlock, MetricCard, Select, ErrorState |

#### SCR-008 — What Changed?  ·  TPL-02

| | |
|---|---|
| **Flow · Roles** | AF-061 · Owner, Manager (own outlets) |
| **Purpose** | Compare now with the latest comparable completed business day (AI-028) |
| **Layout** | PageHeader ("Compared with <baseline day>") → grouped **Facts** (before → after, with ▲/▼ + words) by area: sales · orders · bills & payments · anomalies · Attention · menu/staff/outlet changes → optional **Recommendations** |
| **Composition** | PageHeader · KeyValueList · InformationBlock(fact/recommendation) · Button (Refresh) |
| **States** | **No baseline** → `EmptyState`: "Comparison unavailable — there is no completed business day to compare with yet." (AI-028.AC1) · AI unavailable: facts only, narrative omitted with note · Loading: skeleton + "Comparing…" |
| **Reuses** | InformationBlock, KeyValueList, EmptyState |

#### SCR-009 — Owner AI Agent  ·  TPL-02 (conversation)

| | |
|---|---|
| **Flow · Roles** | AF-058 (read), AF-059 (action) · Owner only |
| **Purpose** | Ask, analyze, recommend; propose a permitted action; confirm sensitive actions (AI-025/029) |
| **Layout** | Conversation column: user messages; AI messages (tagged **AI**) with **Fact blocks** for data it quotes and **Recommendation blocks** for advice; composer at bottom; side note "Conversations aren't saved after you leave" `[DESIGN]` (TRD: transient) |
| **Composition** | PageHeader · Surface (thread) · InformationBlock · ProposalCard · Textarea · Button · Alert |
| **Action flow** | A proposal appears as **ProposalCard** (server-generated summary, scope, expiry) with **Confirm** and **Reject**; **nothing executes until Confirm**; declining or leaving executes nothing (NAV-054, AI-029.AC1); after confirmation the **server result** is shown, never optimistic |
| **Availability of actions** | Action proposals are **not available** until the permitted-action catalogue is defined (**OD-UX-12**, TRD PB-18): Phase-1 UI ships the **read** agent; the ProposalCard is specified but not rendered |
| **States** | Empty `first-use`: short description of what it can read (no invented capabilities) · AI unavailable: ErrorState "The assistant isn't available right now." · rate-limited: Alert · Offline: composer disabled |
| **A11y** | Thread is `role="log"` with polite announcements; ProposalCard controls have explicit names |
| **Reuses** | InformationBlock, ProposalCard, Textarea, Button, ErrorState |

#### SCR-010 — AI Menu Import  ·  TPL-04

| | |
|---|---|
| **Flow · Roles** | AF-057 · Owner only |
| **Purpose** | Upload → review flagged draft → edit → **Owner approval** → live (AI-010…016) |
| **Layout** | Stepper: **1 Upload** · **2 Processing** · **3 Review** · **4 Approve** |
| **Composition** | PageHeader · Tabs(step) · FileUpload (PDF, image, Excel/CSV; limits shown) · StatusBadge(import) · DataTable (draft items) · IssueList `flags` · Sheet (edit item) · InformationBlock `approval` · Button · ConfirmationDialog |
| **Review** | Draft rows labelled **"AI-extracted"**; low-confidence fields highlighted (warning tone + text "Check this field") and listed in IssueList; **duplicates flagged** (AI-016); filter "Needs review"; edit in the same item Sheet as SCR-011 |
| **Approval** | InformationBlock `approval`: "Only approved items go live. Nothing here is visible to customers yet." → **Approve and publish** (primary) → ConfirmationDialog with counts (NAV-010); **unapproved draft is never live** (AI-014.AC1) |
| **States** | Processing ⚡ (status via `ai.import.ready`, polling fallback) · Failed: ErrorState with **Retry** and **"Add the menu manually"** link (ONB-024) · AI unavailable: upload disabled with explanation; manual path remains · Offline: upload disabled |
| **Reuses** | FileUpload, DataTable, IssueList, Sheet, InformationBlock, ConfirmationDialog |

---

### 16.4 Menu, setup, staff

#### SCR-011 — Menu management  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | AF-014, AF-015 · Owner, Manager |
| **Purpose** | Categories, items, variants, modifiers, station mapping, price, publish (§9.1) |
| **Layout** | Left category tree Surface (desktop; Select on mobile) + items DataTable |
| **Composition** | AppShell · PageHeader (+ **Add item**) · TableToolbar · DataTable · Sheet lg (item form) · FormSection · FormField · MoneyInput · Combobox · StatusBadge(menu availability) · Badge("Draft") · ConfirmationDialog |
| **Columns** | Item (name + veg marker) · Category · Price (Money) · Availability · Station · Published |
| **Filters** | Category, availability, published, search "Search menu items…" |
| **Primary / secondary** | **Add item** · Add category, **Publish**, (Owner) Import with AI → SCR-010 |
| **States** | Empty `first-use`: "Add your first item or import a menu." · Realtime ⚡ `menu.changed` (stale-edit Alert) · Concurrency PAT-17 · others D |
| **Confirm · Destructive** | Publish review (list of changes); archiving/unpublishing an item uses PAT-04; menu items are not hard-deleted |
| **Reuses** | DataTable, Sheet, FormSection, FormField, MoneyInput, Combobox, StatusBadge |

#### SCR-012 — Outlet menu overrides  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | AF-016 · Owner, Manager |
| **Layout** | DataTable of items for the working outlet |
| **Columns** | Item · **Central price** · **Outlet price** (Badge if overridden) · Availability (+ duration text) |
| **Row action** | **Set outlet price** (Sheet sm: MoneyInput) · **Set availability** (Sheet sm: RadioGroup — *Available* / *Unavailable until Day Close* / *Unavailable until changed*) · **Reset to central** |
| **Filters** | Overridden only, availability, search |
| **States** | Empty `no-data`: "No overrides — every item uses the central menu." · others D |
| **Notes** | Temporary availability is described as **"until Day Close"**, never as a date (MENU-011) |
| **Reuses** | DataTable, Sheet, RadioGroup, MoneyInput, StatusBadge |

#### SCR-013 — Restaurant / outlet configuration  ·  TPL-03 (form pages)

| | |
|---|---|
| **Flow · Roles** | AF-004, AF-005 · **Owner only** `[ACT-CFG-01]` |
| **Layout** | Tabs: **Identity** · **Address & GST** · **Outlets** · **Kitchen stations** · **Payment information** · **Ordering channels** · **Charges** (service/packaging per outlet, default off — PO-TRD-01) |
| **Composition** | PageHeader · Tabs · FormSection · FormField · FileUpload(logo) · DataTable (outlets, with OutletStatus + activation) · Sheet (add/edit outlet/station) · StickyActionBar |
| **Actions** | Per-tab **Save**; **Add outlet** → NAV-008 → SCR-003 for the new outlet (ONB-015) |
| **Confirm** | Unsaved changes guard (PAT-12); changing GST/charges states "Applies to new bills; finalized bills never change" (MENU-017 spirit / PO-TRD-01) |
| **States** | D; Concurrency PAT-17 |
| **Reuses** | Tabs, FormSection, FormField, FileUpload, DataTable, Sheet |

#### SCR-014 — Floor / table & QR configuration  ·  TPL-05

| | |
|---|---|
| **Flow · Roles** | AF-017 · Owner, Manager |
| **Layout** | Floor Tabs → TableTile `config` grid; top card **"Takeaway QR — no table"** (tableless QR, TABLE-006) |
| **Composition** | PageHeader · Tabs · TableTile · Sheet (add/edit table: label, floor) · QrCodeCard · Button · ConfirmationDialog |
| **Actions** | Add floor, **Add table**, edit/deactivate table (PAT-04), **Download/Print QR**, **Regenerate QR** (confirm: "The old QR will stop working") |
| **Notes** | No capacity, no drag-and-drop floor plan, no reservations (not upstream — TABLE-003). Table QR identifies outlet + table (TABLE-005) |
| **States** | Empty `first-use`: "Add your tables to generate QR codes." · others D |
| **Reuses** | TableTile, QrCodeCard, Sheet, Tabs, ConfirmationDialog |

#### SCR-015 — Staff list and staff record  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | AF-008, AF-009 · Owner, Manager; Cashier/Waiter/Kitchen see **their own record only** |
| **Layout** | DataTable → Sheet record. **Own-record view** (non-managers): read-only Sheet-as-page |
| **Columns** | StaffAvatar + name · Role · Outlet (Owner) · Active/Inactive · Attendance · Availability |
| **Filters** | Role, outlet, status, availability, search "Search staff by name" |
| **Add staff** (Sheet) | Name · Email or phone (Input/PhoneInput) · Role (Select: Manager only for Owner/granted — else option hidden) · Outlet(s) (single for Cashier/Waiter/Kitchen; one or more for Manager) · Initial password (PasswordInput; the actor sets it) |
| **Record actions** | Edit · **Deactivate** (PAT-04) · **Reassign outlet** · **Reset credentials** · (Owner) Open permissions → SCR-016. Manager accounts: actions disabled for a Manager with reason "Only the Owner manages Manager accounts" unless granted (RBAC-029) |
| **Confirm** | Deactivate (consequence text), reassign (§9.2), reset credentials (old password stops; sessions end) |
| **States** | Empty `first-use` "Add your first staff member." · Concurrency PAT-17 · others D |
| **Reuses** | DataTable, Sheet, StaffAvatar, StatusBadge, FormField, PasswordInput, PhoneInput, Select, ConfirmationDialog |

#### SCR-016 — Permission customization  ·  TPL-03 (matrix)

| | |
|---|---|
| **Flow · Roles** | AF-010 · Owner (Manager only if granted `ACT-STF-05`) |
| **Layout** | Header: **target selector** (Combobox: a *role* or a *person*) → permission catalogue grouped by RBAC-011 families (collapsible FormSections) |
| **Row** | Permission name (upstream action label) · **Default** for the target (text) · **Override** (three-state: Default / Allow / Deny, RadioGroup segmented) · note where state/outlet/approval still apply |
| **Notice** | InformationBlock `warning`: "Permissions never override outlet access, state rules or approvals. Changes apply to the user's next action." (RBAC-005, C-REVOKE) |
| **Actions** | **Save changes** → ConfirmationDialog listing the **diff** (PAT-08); audited server-side |
| **Bounds** | Only catalogue actions are listed; no SuperAdmin capability, no new permission types (RBAC-005) |
| **States** | Empty n/a · others D; out-of-bounds refusal renders inline |
| **Reuses** | Combobox, FormSection(collapsible), RadioGroup, SearchInput, InformationBlock, ConfirmationDialog |

#### SCR-017 — Schedule and attendance  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | AF-011, AF-012 · Owner, Manager manage; Manager/Cashier/Waiter/Kitchen **view own** attendance |
| **Layout** | Tabs: **Schedule** (staff × week DataTable; cell = planned period, edit in Sheet with TimePicker pair — STAFF-002) · **Attendance** (staff × selected date: Present/Absent controls — STAFF-003) |
| **Composition** | Tabs · DatePicker · DataTable · Sheet · TimePicker · SegmentedControl(Present/Absent via RadioGroup) · StatusBadge |
| **Rules** | Marking **Absent** shows "Availability will be set to Unavailable" (STAFF-008); calendar dates are used for shifts `[ASSUMPTION]` (distinct from business days); no payroll/overtime (STAFF-009) |
| **Own view** | Read-only list of the user's own attendance (ACT-ATT-03) |
| **States** | Empty `no-data` "No schedule set." · others D |
| **Reuses** | Tabs, DatePicker, TimePicker, DataTable, Sheet, RadioGroup |

#### SCR-018 — Own availability  ·  TPL-03 (focused page)

| | |
|---|---|
| **Flow · Roles** | AF-013 · Owner, Manager, Cashier, Waiter, Kitchen |
| **Purpose** | Set own **Available / On Break / Unavailable** (STAFF-004/005) |
| **Entry → Exit** | Waiter landing step (NAV-049) → **Continue to floor** → SCR-019; any user via UserMenu "My availability" (Popover with the same control) |
| **Composition** | PageHeader · RadioGroup(segmented, large) · StatusBadge · Text (helper) · Button (Waiter: "Continue to floor") |
| **Rules** | *Available* disabled while Absent with the reason (STAFF-008); helper under On Break/Unavailable: "You won't receive new work. Work already in progress stays with you." (STAFF-013) |
| **States** | Empty n/a · Offline: disabled "Needs a connection" · others D |
| **Reuses** | RadioGroup, StatusBadge, Button |


---

### 16.5 Service floor: tables, orders, kitchen, handoff

#### SCR-019 — Floor / tables (operational)  ·  TPL-05

| | |
|---|---|
| **Flow · Roles** | AF-018…022, AF-028 · Owner, Manager (all table actions); Waiter (open, select) |
| **Purpose** | See table states; open a table; reach the table's order; clear, reserve, transfer (merge/split/move-items gated — §9.3) |
| **Entry → Exit** | Waiter landing (after SCR-018) · NAV-019 open table → SCR-023; NAV-020 select table with active order → SCR-022 |
| **Layout** | Filter row (state chips) + legend → TableTile grid by floor → detail Sheet (session, order, bill state, association history Timeline) |
| **Composition** | AppShell · PageHeader · FilterBar · TableTile · StatusBadge(table) · Sheet · Timeline · Button · ConfirmationDialog |
| **Primary CTA** | On an *Available* tile: **Open table** (xl on touch); on *Occupied*: **Open order** |
| **Secondary** | Clear table · Reserve · **Transfer** (Owner/Manager) · *Merge / Split / Move items* — **rendered disabled "Not available yet"** (OD-UX-5, TRD PB-13) |
| **States** | Empty `first-use` for Owner/Manager "No tables yet — add them in Floor & QR" (link SCR-014); Waiter: "No tables configured." · Realtime ⚡ `table.state.changed` · Concurrency PAT-17 ("The table was updated by someone else") · Offline: read-only, Open disabled · others D |
| **Confirm** | Transfer (PAT-08: KOT history preserved, kitchen sees new table); Clear (requires terminal orders — else disabled with reason); Reserve none |
| **Responsive** | 2 / 4–6 / 6–8 columns (§13.3); list toggle on mobile |
| **A11y** | Tiles are a grid with arrow-key navigation; state in text on every tile |
| **Reuses** | TableTile, StatusBadge, Sheet, Timeline, ConfirmationDialog |

#### SCR-020 — Active orders  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | `ACT-ORD-04` · Owner, Manager, Cashier, Waiter, Kitchen (**view**) |
| **Purpose** | The outlet's active orders incl. **Takeaway marker** and source (ORD-003.AC1, ORD-004.AC1) |
| **Entry → Exit** | Nav, NAV-022 · row → SCR-022 |
| **Columns** | Order no. · **OrderOriginTag** (Takeaway / table + source) · Stage (StatusBadge) · Items · Customer · Age (ElapsedTimer) · row action **Open** |
| **Filters** | Stage chips (Awaiting acceptance, Confirmed, KOT Sent, Preparing, Ready…), source, table, **Takeaway only**; search "Search orders by order number"; default = active (non-terminal) |
| **States** | Empty `caught-up` "No active orders." · Realtime ⚡ `order.*` (in place by `rev`; "N new" pill while interacting) · Kitchen: no action buttons · others D |
| **Reuses** | DataTable, FilterBar, StatusBadge, OrderOriginTag, ElapsedTimer |

#### SCR-021 — Orders awaiting acceptance  ·  TPL-03 (queue)

| | |
|---|---|
| **Flow · Roles** | AF-027 · Owner, Manager, Cashier, Waiter (**Kitchen cannot accept** — INV-13) |
| **Purpose** | Every new customer-originated order awaiting acceptance (ORD-008.2) |
| **Entry → Exit** | Nav badge, Toast `operational` · NAV-016 → SCR-022; NAV-017 accept, NAV-018 reject → C-POST |
| **Layout** | Cards/rows sorted **oldest first**: origin tag, customer (if captured), item preview, age; **table-QR add-batches** are labelled "Add items to #1039" (TABLE-015, ACT-MOD-01) |
| **Composition** | PageHeader · Surface/OrderSummary(row) · OrderOriginTag · ElapsedTimer · Button(primary **Accept**, secondary **Reject**) · ReasonPicker (in ConfirmationDialog) |
| **Rules** | **Reject requires a reason** (ORD-008, INV-16). While the outlet is **Closed**: Accept/Reject are **disabled** with "The outlet is closed — customer orders wait until it reopens" and rows stay visible (ORG-033, ORG-033.AC1). Two staff acting at once → loser sees "Already accepted/rejected" (`ALREADY_IN_STATE`, PAT-17) |
| **States** | Empty `caught-up` "No orders waiting." · Realtime ⚡ prominent (`order.submitted`: Toast + badge + optional cue) · others D |
| **Reuses** | OrderSummary, OrderOriginTag, ElapsedTimer, Button, ReasonPicker, ConfirmationDialog, Toast |

#### SCR-022 — Order detail  ·  TPL-08

| | |
|---|---|
| **Flow · Roles** | AF-027, AF-030…035, AF-040 · Owner, Manager, Cashier, Waiter (actions per catalogue); Kitchen **view** |
| **Layout** | PageHeader (OrderSummary `header`: number, OrderOriginTag, stage, age) → **Items** (OrderItemRow `staff`) → side column: **Bill** summary link, **Customer** (CustomerSummary), **KOT & history** Timeline, open **cancellation requests** |
| **Composition** | PageHeader · OrderSummary · OrderItemRow · Timeline · CustomerSummary · StatusBadge · Button · Sheet · ConfirmationDialog · ReasonPicker |
| **Primary CTA** | Context-dependent, **one**: *Accept* (awaiting) / *Add items* (active) / *Open bill* (served & billing) |
| **Secondary** | Cancel item/order, Hold, Void, Re-fire (per permission & state — §9.4), Open bill (NAV-025) |
| **States** | Realtime ⚡ item states update in place · Concurrency PAT-17 · Kitchen: read-only · Denied: out-of-outlet → PAT-11a/b · others D |
| **Confirm** | All cancellations/voids PAT-08/09 with ReasonPicker; Served/Picked Up lines show **no cancel** (ORD-082); cancel/void is refused while the bill is Finalized/Refunded/Cancelled (§9.4 bill guard, K1) |
| **Reuses** | OrderSummary, OrderItemRow, Timeline, CustomerSummary, ReasonPicker, ConfirmationDialog |

#### SCR-023 — Staff order entry  ·  TPL-06

| | |
|---|---|
| **Flow · Roles** | AF-028, AF-029, AF-030 · Owner, Manager, Cashier, Waiter |
| **Purpose** | Create a table or takeaway order; add items to an existing order (§12.2) |
| **Entry → Exit** | NAV-019 (open table), nav "New order" · NAV-021 **Send to kitchen** → C-POST (order Confirmed, KOT sent) |
| **Layout / Composition** | SplitPane `catalog-order` · SearchInput · FilterChip(categories) · MenuItemRow `picker` · OrderItemRow draft · QuantityControl · Textarea (note) · FormSection (customer details, optional) · StickyActionBar · Button(`xl`) · SubmissionStatus · PendingQueue |
| **Primary CTA** | **Send to kitchen** (add-mode: **Send additional items**) |
| **States** | Empty: "Pick items to start an order." · Closed/suspended/not activated: CTA disabled with the state reason (ORG-024) · item unavailable: row disabled with "Unavailable" · Offline: eligible (commit/add) → queued "Not sent yet"; PAT-14 · Concurrency PAT-17 |
| **Confirm** | None for send; leaving with items → PAT-12-style "Keep the draft?" — leaving leaves an uncommitted Draft, never sends (C-BACK) |
| **A11y** | Catalog and order panels are labelled regions; QuantityControl announces "Paneer Tikka, quantity 2" |
| **Reuses** | SplitPane, MenuItemRow, OrderItemRow, QuantityControl, StickyActionBar, SubmissionStatus, PendingQueue |

#### SCR-024 — KDS (kitchen queue)  ·  TPL-07

| | |
|---|---|
| **Flow · Roles** | AF-036…040, AF-065 · Kitchen Staff; Owner/Manager view + Ready (Manager priority) |
| **Layout / Composition** | §12.1 — AppShell(kds) · station chips · three columns (New/Preparing/Ready) of **KdsTicket** · cancellation-request ticket variant · ConnectionBanner |
| **Primary CTA** | **Start** / **Mark Ready** (`xl`) per item; **Mark all ready** per ticket |
| **Secondary** | Priority menu (Manager, Kitchen), Re-fire (Owner/Manager/Kitchen), Cancel (Kitchen, reason), **Accept/Decline** request |
| **States** | Empty `caught-up` "No active orders." · Realtime ⚡ essential: disconnected → banner + **actions disabled** (PAT-15) · Stale: "Last updated" · Offline: no queued kitchen actions (TRD §17.6) · Denied D |
| **Confirm** | Kitchen cancel (ReasonPicker, PAT-09; refused with the §9.4 bill-guard message when the bill is Finalized/Refunded/Cancelled); Accept cancellation request (single confirm tap); Decline no reason required |
| **Reuses** | KdsTicket, OrderItemRow, StatusBadge, OrderOriginTag, ElapsedTimer, ConnectionBanner, Tabs (mobile) |

#### SCR-025 — Ready / handoff visibility  ·  TPL-03 (queue)

| | |
|---|---|
| **Flow · Roles** | AF-041, AF-042 · Waiter (table), Waiter and Cashier (takeaway) |
| **Layout** | Cards grouped by order: OrderOriginTag + Ready items (OrderItemRow) + action |
| **Primary CTA** | **Mark Served** (table-associated; permission `ACT-HND-01`) or **Mark Picked Up** (Takeaway; `ACT-HND-02`) — **never both**; Owner-granted roles see the same control (I5) |
| **States** | Empty `caught-up` "Nothing ready right now." · Realtime ⚡ `order.item.ready` (Toast + badge) · Concurrency: already served → converged · Cashier view shows takeaway only |
| **Reuses** | OrderSummary, OrderItemRow, OrderOriginTag, Button, Toast |

---

### 16.6 Billing and day

#### SCR-026 — Active bills  ·  TPL-06 (list-detail)

| | |
|---|---|
| **Flow · Roles** | AF-043…045 · Cashier (landing); Owner, Manager, Waiter via bill actions |
| **Purpose** | The cashier's list of active bills; **also the discovery path to past (closed-day) bills for correction** `[DESIGN DECISION]` (OD-UX-10 resolved). Upstream basis for *that restaurant users can reach past bills for correction*: SPEC CUSTOMER-022 (PO-TRD-02), TABLE-011, APP_FLOW §18.3; the list-plus-date-filter *access path* is the design decision. This defines only the UI discovery/access pattern. It does not create or alter bill correction, reopening, authorization, or day-close business rules. |
| **Layout** | SplitPane `list-detail`: DataTable list + selected Bill (SCR-027) on tablet/desktop; list-only on mobile → navigates to SCR-027 |
| **Columns** | Bill / order no. · OrderOriginTag · Bill status · Payment status · Total · Outstanding · Age |
| **Filters** | Bill status, payment status, **date range** (FM-11; default **This business day**; earlier days selectable for corrections `[DESIGN]`), search by bill/order number |
| **Primary CTA** | Open selected bill |
| **States** | Empty `caught-up` "No bills to handle." · Realtime ⚡ `bill.*`, `payment.recorded` · others D |
| **Reuses** | SplitPane, DataTable, FilterBar, StatusBadge, OrderOriginTag, Money |

#### SCR-027 — Bill  ·  TPL-08

| | |
|---|---|
| **Flow · Roles** | AF-043…051 · Owner, Manager, Cashier, Waiter (per action) |
| **Layout / Composition** | §9.7 — PageHeader (bill/invoice number, **Bill status** + **Payment status** badges) · OrderSummary · lines (OrderItemRow `bill` / DataTable) · BillSummary · PaymentSummary · Timeline · StickyActionBar (mobile) |
| **Primary CTA** | One of: **Finalize bill** (Draft/Reopened) · **Record payment** (Finalized & outstanding) · **none** on a Refunded or Cancelled bill (read-only; Refund remains a secondary action while refundable) |
| **Secondary** | Discount, Service/packaging charge (Owner/Manager/Cashier; Draft/Reopened) · **Reopen** (reason) · **Refund** · Cancel bill (Finalized only, mandatory reason, OD-UX-9 resolved) · Print/**Reprint** (Cashier) |
| **Forms** | Record payment Sheet (MoneyInput, RadioGroup mode, optional reference, **Add another payment**); Refund dialog (MoneyInput ≤ paid less refunds already recorded, mode, ReasonPicker); Discount (percent or flat; whole bill; before tax) |
| **States** | **Bill status → offered actions: §9.7 table** (Refunded and Cancelled bills show their restrictions as disabled-with-reason) · invoice number stable across revisions with "Revised n" · Finalized: lines read-only with lock + "Reopen to change" (BILL-004) · **Overpaid** Info Alert persistent (PAY-012) · Closed outlet: **no banner blocking billing** (ORG-027) · Concurrency PAT-17 · Offline: all mutations disabled — **never queued** (TD-OFF-1) · Realtime ⚡ |
| **Confirm** | Finalize (summary of totals), Reopen/Refund/**Cancel bill** `financial` (PAT-09; Cancel and Reopen require a reason) |
| **A11y** | Amounts read with currency and sign; totals region labelled |
| **Reuses** | BillSummary, PaymentSummary, OrderItemRow, Timeline, Money, MoneyInput, ReasonPicker, ConfirmationDialog |

#### SCR-028 — Day Close  ·  TPL-08

| | |
|---|---|
| **Flow · Roles** | AF-052 · Owner, Manager, Cashier |
| **Layout / Composition** | §9.8 — PageHeader (**Running** DayStatus, since) · MetricCard grid (Gross · **Net, signed** · Refunds · …, §9.8) · Cash reconciliation Surface (Expected [server] · MoneyInput Counted · Variance [server]) · IssueList `warnings` · Textarea (notes) · Checkbox (acknowledge) · StickyActionBar |
| **Primary CTA** | **Close business day** (disabled until acknowledgement when warnings exist) |
| **States** | Interruption: "Checking whether it closed…" → single result (DAY-009/010) · Outlet Closed: still available (ORG-022.AC1) · variance never blocks (CASH-006) · Offline: disabled — requires server confirmation (TRD §27.3) · others D |
| **Confirm** | `financial` dialog summarising totals (PAT-09) |
| **Reuses** | MetricCard, IssueList, MoneyInput, Checkbox, ConfirmationDialog, Timeline (closed-day record) |

#### SCR-029 — Reopen Day  ·  TPL-08

| | |
|---|---|
| **Flow · Roles** | AF-053 · Owner, Manager, Cashier |
| **Layout** | Shows the **most recently closed day** summary, reason (ReasonPicker: Missed transaction · Cash count correction · Other — `[PRD AF-053]`), **Reopen day** primary |
| **States** | Refusal states rendered with the exact reason: *"The current business day already has activity"* / *"Only the most recent closed day can be reopened"* (DAY-015/021, PRD §65) · after reopen: Day shows **Reopened**; **Re-close** → SCR-028 (NAV-033) with note "Totals and cash will be recalculated" |
| **Confirm** | `standard` dialog (consequence: transactions recorded now belong to the reopened day) |
| **Reuses** | ReasonPicker, StatusBadge(day), ConfirmationDialog, PermissionDeniedState (state factor) |

---

### 16.7 Customers and feedback (staff views)

#### SCR-031 — Customer history  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | `ACT-CUS-01` · Owner (all outlets), Manager (own), Cashier, Waiter, Kitchen (own outlet) |
| **Columns** | Customer (name) · **Phone (masked)** · Visits · Total spend · Last order · Outlet(s) (Owner) |
| **Row Sheet** | CustomerSummary + that customer's **orders within the viewer's scope**; each links to its order/bill (SCR-022/027) where authorised — this is also a **customer-history discovery path** to past orders for billing correction `[DESIGN DECISION]` (OD-UX-10). This defines only the UI discovery/access pattern. It does not create or alter bill correction, reopening, authorization, or day-close business rules. |
| **Filters** | Search "Search by name or phone number", outlet (Owner), date range |
| **States** | Empty `no-data` "No customers captured yet." (table-QR customers are not recorded — ORD-021) · others D |
| **Notes** | Phone is a matching key at organization scope but **visibility stays outlet-scoped** (CUSTOMER-021): the UI never shows another outlet's history to a non-Owner |
| **Reuses** | DataTable, Sheet, CustomerSummary, SearchInput |

#### SCR-032 — Feedback (staff view)  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | `ACT-FB-02` · Owner, Manager |
| **Layout** | Counts per rating (1–5) as MetricCards + DataTable of feedback (rating, comment, order link, date, outlet) |
| **Filters** | Rating, outlet, date range |
| **States** | Empty `no-data` "No feedback yet." · others D |
| **Notes** | Operational insight only; no public-review or response workflow (NG-008). No computed averages are introduced beyond upstream |
| **Reuses** | MetricCard, DataTable, FilterBar |


---

### 16.8 Platform (SuperAdmin)

The `platform` AppShell offers **exactly** SCR-040, SCR-041, SCR-042 and no restaurant destination (C-SA-IA); landing **SCR-041** `[DESIGN DECISION]` (OD-UX-2 resolved).

#### SCR-040 — Restaurant provisioning  ·  TPL-04

| | |
|---|---|
| **Flow · Roles** | AF-001 · SuperAdmin |
| **Purpose** | Create restaurant, structure, Owner, basic data, provision (ONB-001…006) |
| **Layout** | Step list: **Restaurant** (name, brand) · **Structure** (RadioGroup: single / multi-outlet — ONB-002) · **Outlet(s)** basic data (ONB-004) · **Owner** (create new or assign existing — ONB-003) · **Review & provision** |
| **Composition** | PageHeader · Tabs(step) · FormSection · FormField(Input/PhoneInput/Select/Combobox) · IssueList · StickyActionBar · ConfirmationDialog |
| **Primary CTA** | **Provision restaurant** → NAV-036 C-POST: restaurant **Provisioned** + **invitation status** (Sent / Failed + **Resend**) |
| **Rules** | Duplicate/validation rules (same Owner across restaurants, duplicate names) are **undefined upstream** (TRD PB-2): the UI shows only server validation messages and invents no rule. No self-signup UI exists (ONB-012) |
| **States** | Invitation email failed → Alert "Restaurant created. The invitation email could not be sent." + **Resend** (ONB-013.AC1) · Offline disabled · others D |
| **Confirm** | `standard` dialog summarising restaurant + Owner |
| **Reuses** | Tabs, FormSection, FormField, PhoneInput, Combobox, IssueList, Alert, StatusBadge |

#### SCR-041 — Restaurant record (platform)  ·  TPL-08

| | |
|---|---|
| **Flow · Roles** | AF-001, AF-003 · SuperAdmin |
| **Layout** | Restaurant DataTable (name, structure, **platform status** badge, outlets, invitation status) → record view with Tabs: **Overview** (read-only operational data — ONB-007) · **Configuration** (edit — ONB-008) · **Owner & access** (reset Owner credentials, **resend invitation**, invitation Timeline — ONB-010/013) · **Status** |
| **Status tab** | **Suspend** / **Deactivate** with consequences listed: *"New orders stop on every channel. Existing orders, bills and corrections continue. Customers scanning the QR see the suspended notice. Nothing is deleted."* (ONB-014/016). **Type the restaurant name to confirm** (PAT-09) `[DESIGN]`. **Reinstatement is not shown** (OD-UX-4, TRD PB-7). Suspension is never presented as Day Close (ONB-009) |
| **States** | Platform status always visible in the header via StatusBadge `restaurant`; Realtime — ; others D |
| **Reuses** | DataTable, Tabs, StatusBadge, KeyValueList, ConfirmationDialog, Timeline |

#### SCR-042 — Audit trail  ·  TPL-03

| | |
|---|---|
| **Flow · Roles** | AF §26 · **SuperAdmin only** (AUDIT-007); a restaurant user opening it is refused with `PermissionDeniedState` and **no audit content** (AUDIT-007.AC1) |
| **Layout** | TableToolbar + DataTable (cursor pagination) → Sheet with **before/after** changed-fields view |
| **Columns** | Time · Restaurant · Outlet · Actor (type + id) · Action (stable label) · Target · Reason |
| **Filters** | Restaurant, outlet, actor, action, date range |
| **Notes** | Read-only, append-only look (no edit/delete affordance); no export (not upstream) |
| **States** | Empty `no-results`/`no-data` "No events match." · others D |
| **Reuses** | DataTable, FilterBar, DateRangePicker, Sheet, KeyValueList |

---

### 16.9 Customer flows (CustomerShell, TPL-09)

Customer screens are **mobile-first**, `comfortable` density, single column, same tokens and components. Customers have **no account, no OTP, no sign-in** (AUTH-009). **Invalid, expired or foreign link / QR** → `ErrorState not-found` "This link isn't valid." with **no outlet or order data** (C-INVALID, CUSTOMER-003.AC1) — a state of the shell, not an additional screen.

#### SCR-050 — Customer menu

| | |
|---|---|
| **Flow · Roles** | AF-023, AF-024, AF-025 · Customer |
| **Purpose** | Published menu of the outlet **with its overrides** (ORD-020, MENU-008/009); outlet known **before** any menu (C-WEB) |
| **Entry → Exit** | NAV-038 (QR/website entry) · NAV-039 add item → SCR-051; SCR-056 / SCR-058 by outlet/restaurant state |
| **Layout** | Outlet header (name; **table label** or **Takeaway** tag) → sticky category chips + SearchInput "Search menu items…" → MenuItemRow `customer-card` list → sticky cart bar |
| **Composition** | CustomerShell · Text · OrderOriginTag · FilterChip(categories) · SearchInput · MenuItemRow · Sheet `bottom` (item options: variants, modifiers, note) · StickyActionBar |
| **Primary CTA** | **Add** (item) → cart bar **View cart · n items** |
| **Rules** | Only currently orderable items are shown (resolved menu); veg/non-veg by icon + text; prices via Money (`₹`, tax-inclusive per PO-TRD-01) |
| **States** | Empty: ErrorState "The menu isn't available right now." · Loading D (skeleton cards) · Offline: ErrorState offline + Retry · Realtime — (menu refetched on focus) |
| **A11y** | Chips are a tablist-like filter group; item options Sheet traps focus |
| **Reuses** | MenuItemRow, FilterChip, SearchInput, Sheet, StickyActionBar, OrderOriginTag |

#### SCR-051 — Cart

| | |
|---|---|
| **Flow · Roles** | AF-023…025 · Customer |
| **Layout** | Lines (QuantityControl, note, Remove) → server-provided totals if available (label: "Total — the restaurant confirms the final bill"; **no client arithmetic**) → StickyActionBar |
| **Primary CTA** | **Table QR:** **Place order** (no details step — ORD-021, PO-AF-02). **Tableless QR / website:** **Continue** → SCR-052 (NAV-040) |
| **Rules** | **Submission is a separate explicit action** (C-SUBMIT). A sold-out item: named, not ordered, customer can remove/continue (NAV-042, MENU-015). **PRICE_CHANGED** → changed lines highlighted old→new and re-confirm. Outlet Closed at submit → SCR-056, nothing created (NAV-052). The cart is **never offered back** after abandonment (ORD-094) |
| **States** | Empty `no-data` "Your cart is empty." + Link to menu · Submitting: SubmissionStatus pending, button `loading`, double-tap safe (same key) · Failed: Alert + Retry, cart kept (PAT-14) |
| **Reuses** | QuantityControl, OrderItemRow(customer), SubmissionStatus, Alert, StickyActionBar |

#### SCR-052 — Customer details entry

| | |
|---|---|
| **Flow · Roles** | AF-024, AF-025 · Customer — **tableless QR and website only** (PO-AF-02) |
| **Layout** | One FormSection: **Name**, **Phone number** (PhoneInput, E.164) → **Place order** |
| **Rules** | Both **required**; **no OTP**, no verification (ORD-030/031/042). Missing → **field-level** messages "Enter your name" / "Enter your phone number with country code" (ORD-030.AC1). Helper: "The restaurant uses these to identify your order." The order is **Takeaway** and the tag is shown |
| **States** | Submitting/failed per PAT-14 · Offline: button disabled "Needs a connection" |
| **A11y** | `autocomplete="name"`/`"tel"`; errors on blur and submit |
| **Reuses** | FormSection, FormField, Input, PhoneInput, StickyActionBar, OrderOriginTag |

#### SCR-053 — Customer order view (private link)  ·  TPL-09

| | |
|---|---|
| **Flow · Roles** | AF-054 · Customer (own order only, via private non-guessable link — AUTH-009, ACT-CUS-02) |
| **Purpose** | Current state incl. **awaiting acceptance**, rejection, progress, Takeaway, completion; entry to bill, feedback, reorder |
| **Entry → Exit** | NAV-041 (after submit), NAV-043 (link), NAV-047 (reorder) · NAV-044 bill, NAV-045 feedback, NAV-047 reorder |
| **Layout** | Header (outlet, order number, OrderOriginTag) → **progress step list** (customer wording §9.9) → items (OrderItemRow `customer`; **kitchen-cancelled items visible**, struck — KDS-013.1) → actions |
| **Composition** | CustomerShell · PageHeader(lite) · Timeline(vertical, progress) · StatusBadge(order) · OrderItemRow · Alert (rejection) · Button |
| **Primary CTA** | Context: *none* while in progress · **Give feedback** (Completed, not yet given) · **Order again** |
| **States** | *Awaiting acceptance*: "Waiting for the restaurant to accept your order" (Draft sub-state — ORD-062) · **Rejected**: Alert with reason; wording of the outcome `[OPEN DECISION]` OD-UX-1 (interim "Not accepted"); "Start a new order" returns to channel entry only (NAV-053) · Realtime ⚡ via `/customer` events, with manual **Refresh** and "Last updated" (PAT-15/16) · Invalid/expired link → not-found (above) · Offline D |
| **Notes** | Customer-safe: **no staff names, notes or internal data**. Footer: "Keep this link to check your order. Anyone with the link can see it." `[DESIGN]` |
| **A11y** | Progress is an ordered list with the current step `aria-current="step"`; status change announced politely |
| **Reuses** | Timeline, StatusBadge, OrderOriginTag, OrderItemRow, Alert |

#### SCR-054 — Customer bill view

| | |
|---|---|
| **Flow · Roles** | AF-054 · Customer (own bill via private link — ACT-BIL-01) |
| **Layout** | BillSummary `full` (read-only) + payment status badge |
| **Rules** | **No payment action** exists (PAY-008/NG-011); no refund/reprint controls; amounts via Money; "Prices include tax" caption. Renders **only the customer-safe projection the server returns** (TRD §30.2): the UI adds no field of its own — no invented bill status, invoice marker or refund wording — and shows the payment-status badge only as supplied |
| **States** | Empty: `no-data` "Your bill isn't ready yet." · others D |
| **Reuses** | BillSummary, StatusBadge, Money |

#### SCR-055 — Feedback

| | |
|---|---|
| **Flow · Roles** | AF-055 · Customer |
| **Layout** | Rating RadioGroup **1–5 with text labels** (not stars only) → Textarea "Add a short note (optional)" with counter (≤ 1 000) → **Submit feedback** |
| **Rules** | Offered only for **Completed** orders; **once per order** (FEEDBACK-006) — afterwards read-only "Thanks for your feedback" and not offered again (NAV-046); no public review/publishing (NG-008) |
| **States** | Submitting/failed PAT-14; duplicate submit returns existing |
| **Reuses** | RadioGroup, Textarea, FormField, Button |

#### SCR-056 — Ordering unavailable / outlet closed

| | |
|---|---|
| **Flow · Roles** | AF-006 (customer side), AF-004 · Customer |
| **Layout** | `EmptyState` (info tone): outlet name + one-line reason + **no cart, no menu actions** |
| **Copy** | Closed: "<Outlet> isn't taking orders right now." · Not activated: "Ordering isn't available yet." — both **"Ordering is unavailable"** in meaning (ORG-021.1, ONB-032.1); website states **closed** (ORG-029) |
| **Actions** | **Check again** (refreshes status) |
| **States** | Loading (on **Check again**): button `loading`, previous message stays visible · Error: `ErrorState inline` + Retry · Offline: ErrorState offline (no cached order data is ever shown) · Realtime — · Denied n/a |
| **Reuses** | EmptyState, Text, Button |

#### SCR-057 — WhatsApp conversation  (content conventions only)

| | |
|---|---|
| **Flow · Roles** | AF-026, AF-063 · Customer |
| **Why no screen** | The conversation is rendered by WhatsApp, not by SERVENA UI (I3). This block defines the **content conventions** of the agent's replies so tone and terminology match the product |
| **Conventions** | Plain text; terms per §10.6; amounts `₹` + `en-IN`; shows **only published, currently available items** (AI-032); states the order is **Takeaway**; after submission says the order was **sent to the restaurant for acceptance** (ORD-008) |
| **Not designed** | **No order-status/tracking messages and no order-link message** are sent over WhatsApp (DF-15, PO-AF-01). **Closed**: message "<Outlet> isn't taking orders right now." (ORG-030) · **Suspended**: unavailability notice · **AI unavailable**: no deterministic fallback is defined (`[OPEN DECISION]` OD-UX-13, TRD PB-16) |
| **States** | n/a — rendered by WhatsApp. Failure copy (AI unavailable, outlet closed/suspended) is listed under *Not designed* above; no SERVENA loading/empty/error states exist for this block |
| **Reuses** | Terminology §10.6, Money formatting §4.4.2 |

#### SCR-058 — Restaurant suspended / blocked notice

| | |
|---|---|
| **Flow · Roles** | AF-003 · Customer (QR scan of a **suspended or deactivated** restaurant — PO-AF-03) |
| **Layout** | CustomerShell with SERVENA wordmark; `EmptyState` (error tone): heading + explanation; **no menu, no outlet menu, no ordering controls** |
| **Copy** | States that **the account has been suspended/blocked and to contact the SERVENA technical team to resolve it** `[PRD-ONB-016.1]`. Final microcopy `[DESIGN]`; **contact channel (phone/email/link) is not defined upstream** — `[OPEN DECISION]` OD-UX-6: the screen shows no invented contact detail |
| **Notes** | Does not show restaurant name or any data beyond what the notice needs; same page for suspended and deactivated (TRD §28) |
| **States** | Static notice: no loading/empty states · Offline: ErrorState offline + Retry (the notice itself never claims reinstatement) · Realtime — · Denied n/a |
| **Reuses** | EmptyState, Text |


---

### 16.10 Screen coverage index

| SCR | Screen | Template / arrangement | § |
|---|---|---|---|
| SCR-001 | Sign-in | TPL-01 | 16.2 |
| SCR-002 | Working-outlet selection | TPL-03 (selection list) | 16.2 |
| SCR-003 | Owner operational setup + activation checklist | TPL-04 | 16.2 |
| SCR-004 | Outlet dashboard | TPL-02 | 16.3 |
| SCR-005 | Unresolved bills | TPL-03 | 16.3 |
| SCR-006 | Attention items | TPL-02 | 16.3 |
| SCR-007 | Daily AI Brief | TPL-02 | 16.3 |
| SCR-008 | What Changed? | TPL-02 | 16.3 |
| SCR-009 | Owner AI Agent | TPL-02 (conversation) | 16.3 |
| SCR-010 | AI Menu Import | TPL-04 | 16.3 |
| SCR-011 | Menu management | TPL-03 | 16.4 |
| SCR-012 | Outlet menu overrides | TPL-03 | 16.4 |
| SCR-013 | Restaurant / outlet configuration | TPL-03 (form pages) | 16.4 |
| SCR-014 | Floor / table & QR configuration | TPL-05 | 16.4 |
| SCR-015 | Staff list and staff record | TPL-03 | 16.4 |
| SCR-016 | Permission customization | TPL-03 (matrix) | 16.4 |
| SCR-017 | Schedule and attendance | TPL-03 | 16.4 |
| SCR-018 | Own availability | TPL-03 (focused page) | 16.4 |
| SCR-019 | Floor / tables (operational) | TPL-05 | 16.5 |
| SCR-020 | Active orders | TPL-03 | 16.5 |
| SCR-021 | Orders awaiting acceptance | TPL-03 (queue) | 16.5 |
| SCR-022 | Order detail | TPL-08 | 16.5 |
| SCR-023 | Staff order entry | TPL-06 | 16.5 |
| SCR-024 | KDS (kitchen queue) | TPL-07 | 16.5 |
| SCR-025 | Ready / handoff visibility | TPL-03 (queue) | 16.5 |
| SCR-026 | Active bills | TPL-06 (list-detail) | 16.6 |
| SCR-027 | Bill | TPL-08 | 16.6 |
| SCR-028 | Day Close | TPL-08 | 16.6 |
| SCR-029 | Reopen Day | TPL-08 | 16.6 |
| SCR-030 | Outlet Open/Closed control | Sheet (`TPL-03`-style panel) | 16.2 |
| SCR-031 | Customer history | TPL-03 | 16.7 |
| SCR-032 | Feedback (staff view) | TPL-03 | 16.7 |
| SCR-040 | Restaurant provisioning | TPL-04 | 16.8 |
| SCR-041 | Restaurant record (platform) | TPL-08 | 16.8 |
| SCR-042 | Audit trail | TPL-03 | 16.8 |
| SCR-050 | Customer menu | TPL-09 | 16.9 |
| SCR-051 | Cart | TPL-09 | 16.9 |
| SCR-052 | Customer details entry | TPL-09 | 16.9 |
| SCR-053 | Customer order view (private link) | TPL-09 | 16.9 |
| SCR-054 | Customer bill view | TPL-09 | 16.9 |
| SCR-055 | Feedback | TPL-09 | 16.9 |
| SCR-056 | Ordering unavailable / outlet closed | TPL-09 | 16.9 |
| SCR-057 | WhatsApp conversation  (content conventions only) | TPL-09 | 16.9 |
| SCR-058 | Restaurant suspended / blocked notice | TPL-09 | 16.9 |

---

## 17. Design System Directory

```
SERVENA DESIGN SYSTEM
│
├── TOKENS (§4)
│   ├── Colors ─────── brand · surface · text · border · tones (success warning error info progress ai neutral accent)
│   │                  · interaction · operational state maps (17 domains) · light + dark          → §4.2–4.3
│   ├── Typography ─── Inter + system stack · 19 roles · financial/numeric rules                    → §4.4
│   ├── Spacing ────── 4 px scale + applied spacing groups                                          → §4.5
│   ├── Radius ─────── none · sm · md · lg · xl · full                                              → §4.6
│   ├── Borders ────── subtle · default · strong · focus · error                                    → §4.7
│   ├── Shadows ────── elev 0–4 + z-index scale                                                      → §4.8
│   ├── Motion ─────── durations · easings · loading/reduced-motion rules                           → §4.9
│   └── Density ────── compact · comfortable · kds                                                   → §4.10
│
├── COMPONENTS (§5)  — 83 reusable
│   ├── Foundation (F-01…09)  Button · IconButton · Link · Text/Heading · Badge · Avatar · Divider · Tooltip · Icon
│   ├── Forms (FM-01…17)      Input · PasswordInput · PhoneInput · SearchInput · MoneyInput · Textarea · Select · Combobox
│   │                          · DatePicker · TimePicker · DateRangePicker · Checkbox · RadioGroup · Switch · FileUpload
│   │                          · FormField · FormSection
│   ├── Feedback (FB-01…12)   Alert · Toast · ConfirmationDialog · Spinner · Skeleton · LoadingState · EmptyState
│   │                          · ErrorState · PermissionDeniedState · ConnectionBanner · SubmissionStatus · PendingQueue
│   ├── Layout (L-01…16)      AppShell · CustomerShell · Sidebar · TopBar · OutletSwitcher · UserMenu · MobileNavigation
│   │                          · PageHeader · SectionHeader · Breadcrumbs · Tabs · Surface · Modal · Sheet · SplitPane · StickyActionBar
│   ├── Data (DT-01…10)       DataTable · TableToolbar · FilterBar · FilterChip · Pagination · SortControl · MetricCard
│   │                          · Chart · Timeline · KeyValueList
│   └── Domain (D-01…19)      StatusBadge · OrderOriginTag · Money · QuantityControl · MenuItemRow · StaffAvatar · TableTile
│                              · OrderSummary · OrderItemRow · KdsTicket · BillSummary · PaymentSummary · CustomerSummary
│                              · ReasonPicker · IssueList · InformationBlock · ProposalCard · QrCodeCard · ElapsedTimer
│
├── PATTERNS (§8)  — 21
│   ├── CRUD ──────────── PAT-01 Create · 02 Edit · 03 Delete · 04 Archive/deactivate
│   ├── Search ────────── PAT-05
│   ├── Filters ───────── PAT-06 Filter & sort · 07 Bulk actions
│   ├── Confirmation ──── PAT-08 Confirmation · 09 Destructive & financial · 12 Unsaved changes
│   ├── Approval ──────── PAT-10 · permission denial PAT-11
│   ├── Error Recovery ── PAT-17 · validation PAT-18 · success PAT-19 · navigation after mutation PAT-20
│   ├── Offline ───────── PAT-14 Submission & offline operation
│   ├── Realtime ──────── PAT-15 Realtime & connection · PAT-16 Stale data · PAT-13 Loading & empty
│   └── Responsive ────── PAT-21 (§13)
│
└── SCREENS (§16)  — 44 compositions (no new components)
    ├── Owner ─────── 001 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019 020 021 022 023 024(view, Ready) 026 027 028 029 030 031 032
    ├── Manager ───── 001 002 003(parts) 004 005 006 007 008 011 012 014 015 016(if granted) 017 018 019 020 021 022 023 024(view, Ready, priority) 026 027 028 029 030 031 032
    ├── Cashier ───── 001 005 018 020 021 022 023 025(takeaway) 026 027 028 029 031   (+ own record 015/017)
    ├── Waiter ────── 001 005 018 019 020 021 022 023 025 027 031                     (+ own record 015/017)
    ├── Kitchen ───── 001 018 020(view) 024 031                                        (+ own record 015/017)
    ├── Customer ──── 050 051 052 053 054 055 056 057 058
    └── SuperAdmin ── 040 041 042
```

*Reusable globally:* everything under TOKENS, COMPONENTS, PATTERNS. *Screen-specific:* only the compositions and configuration in §16 (which components, which columns, which copy). Per-role screen sets follow the APP_FLOW §29.2 matrix and the **default** catalogue; an Owner's permission customization can add destinations (e.g. SCR-025 for a role the Owner grants handoff to), and the shell then offers them (C-NAV).

---

## 18. Traceability, Assumptions and Open Decisions

### 18.1 Classification of major design decisions

| # | Decision | Tag | Source / rationale |
|---|---|---|---|
| 1 | One design system; three-layer tokens (primitive → semantic → component) | `[DESIGN]` | DDR-01 |
| 2 | Actions rendered from **effective permissions**; hidden if never granted, disabled-with-reason if granted but invalid | `[TRD]` + `[DESIGN]` | RBAC-007, TRD §13; DDR-06 |
| 3 | Working outlet is explicit, always visible; caches outlet-keyed | `[SPEC]` | AUTH-008, C-OUTLET |
| 4 | Pending / failed / succeeded only; success after server ack | `[TRD]` | OFFLINE-002, TRD §19.7 |
| 5 | Only order commit and add-items may queue offline | `[TRD]` | TD-OFF-1 |
| 6 | Realtime = hints; resync on reconnect; KDS disconnected disables actions | `[TRD]` | TRD §17.6 |
| 7 | Money = integer paise; `Money` formats; round-off own line; no client arithmetic; "Prices include tax" | `[TRD]` / `[SPEC]` | ADR-009, PO-TRD-01 (BILL-018) |
| 8 | Takeaway shown on every surface for no-table orders | `[SPEC]` | ORD-004, INV-14 |
| 9 | Table QR: no customer-details step; tableless QR/website: name + phone, no OTP | `[SPEC]` | ORD-021/030/042 (PO-AF-02) |
| 10 | Suspended/blocked notice with no menu; Closed → "ordering unavailable" | `[SPEC]` | ONB-016, ORG-021 |
| 11 | No resume of abandoned carts | `[SPEC]` | ORD-094 |
| 12 | Facts / recommendations / actions / warnings / approval as distinct visual kinds; AI tone reserved | `[DESIGN]` on `[SPEC]` | AI-021/029; DDR-11 |
| 13 | Owner Agent confirmation is a separate explicit control; nothing executes unconfirmed | `[SPEC]` | AI-029.AC1 |
| 14 | Only source-defined approval is Owner approval of AI menu import; no dual-approval UI | `[SPEC]` | RBAC-014, OD-28 |
| 15 | Reasons mandatory on cancel/reject/void/reopen | `[SPEC]` | INV-16, ORD-089, BILL-014, DAY-018 |
| 16 | Cancellation UI follows item state; Served/Picked Up shows no cancel | `[SPEC]` | ORD-082 |
| 17 | KDS: shared queue, any Kitchen user acts, stations = grouping only, neutral timer, no delay styling | `[SPEC]` | KDS-001/007/008, NG-014 |
| 18 | KDS columns + ticket cards; ordering by priority then age; ≥ 56 px actions | `[DESIGN]` | DDR-10 |
| 19 | Two bill/payment badges; "Outstanding"/"Overpaid" amounts; no "Partial" status | `[SPEC]` | PAY-010, BILL-001 |
| 20 | "Close business day" wording; Day ≠ Outlet states | `[SPEC]` | DAY-001, ORG-022 |
| 21 | Variance never blocks Day Close; shown neutrally | `[SPEC]` | CASH-006 |
| 22 | No notification centre / profile / settings; user menu + realtime Toasts only | `[APP_FLOW]` | §29.0, NAV-GAP-026 |
| 23 | Sidebar/rail/bottom-bar grouping and labels | `[DESIGN]` | C-NAV leaves structure to UI/UX |
| 24 | Landings per role | `[APP_FLOW]` | §29.6 |
| 25 | Sheet as default create/edit container | `[DESIGN]` | DDR-05 |
| 26 | Indigo primary; teal accent; reserved fuchsia `ai` tone — **approved as the v1 palette** | `[DESIGN DECISION]` | DDR-02, OD-UX-18 (no upstream brand identity) |
| 27 | Inter + lucide; WCAG 2.2 AA; 44 px targets | `[DESIGN]` | §4.4, §14 |
| 28 | Theme follows OS; no theme setting | `[DESIGN]` | DDR-09 |
| 29 | Density modes compact/comfortable/kds | `[DESIGN]` | DDR-04 |
| 30 | Discovery of past bills via SCR-026 date filter + SCR-031 customer history (UI access pattern only) | `[DESIGN DECISION]` | Upstream: CUSTOMER-022, TABLE-011, APP_FLOW §18.3 define *that* past bills are reachable for correction; the path is design. This defines only the UI discovery/access pattern. It does not create or alter bill correction, reopening, authorization, or day-close business rules. |
| 31 | Merge/split/move-items controls disabled "Not available yet" | `[OPEN DECISION]` | TRD PB-13 |
| 32 | "Send to kitchen" / "Send additional items" labels | `[DESIGN]` | upstream term is Confirmed → KOT sent |
| 33 | Typed-name confirmation for suspend/deactivate | `[DESIGN]` | PAT-09 |
| 34 | Optional audible cue, off by default, mutable | `[DESIGN]` | TRD §17.5 leaves sounds to UI/UX |

### 18.2 Assumptions `[ASSUMPTION]`

| # | Assumption | If wrong |
|---|---|---|
| AS1 | Devices: Owner desktop; Manager/Cashier desktop or tablet; Waiter phone/small tablet; Kitchen tablet/monitor; Customer own phone | Density/layout mapping changes; behaviour unaffected |
| AS2 | UI language English; formats `en-IN`; currency `₹` (SPEC target users are Indian restaurants, ₹/GST) | See OD-UX-17 |
| AS3 | Evergreen browsers (latest two versions; iOS Safari 16+) | Test matrix changes |
| AS4 | Staff times shown in 24-hour format | Format token change |
| AS5 | Schedule/attendance use calendar dates (distinct from business days) | Wording/date-field change |
| AS6 | Default phone country code +91, changeable | Default change |
| AS7 | The v1 palette is a design decision, not a brand mandate; wordmark is the text "SERVENA" until a logo asset exists | Re-skin by primitive tokens only |
| AS8 | Kitchens benefit from dark theme; theme follows OS preference | Token set already exists |

### 18.3 Open-decision disposition

Each item was classified as **already upstream / pure UI / product / technical / genuinely unresolved**. Only what is safe at the UI layer was resolved; no product behaviour was invented to remove an open decision. Unresolved items keep `[OPEN DECISION]` and name the artifact that must resolve them.

| ID | Question | Class | Disposition | Must be resolved by | Screens | Design treatment |
|---|---|---|---|---|---|---|
| OD-UX-1 | Name/terminal state of a **rejected** customer order | Product | **OPEN** | SPEC/PRD (APP_FLOW AMB-03; TRD PB-4) | 021, 022, 053 | Neutral "Not accepted" + reason; never "Cancelled"/"Completed" |
| OD-UX-2 | SuperAdmin landing | Pure UI | **RESOLVED** `[DESIGN DECISION]` | — | 040–042 | Landing = SCR-041 |
| OD-UX-3 | Bill-level **Refunded** label / status after refund | Product | **RESOLVED** (canonical: SPEC BILL-002, APP_FLOW §16.1/AF-051; product-owner decisions PO-1, OD-DB-27 on 2026-10-08) | — | 027 | Bill-status badge **Refunded** + Partial/Full qualifier; ledger rows kept |
| OD-UX-4 | Suspended vs Deactivated; **reinstatement** | Product | **OPEN** | SPEC/PRD (TRD PB-7) | 041 | Reinstatement not shown |
| OD-UX-5 | Merge / split / move-items semantics | Product | **OPEN** | SPEC/PRD (TRD PB-13) | 019 | Disabled "Not available yet" |
| OD-UX-6 | **Contact channel** for the SERVENA technical team | Product | **OPEN** | SPEC/PRD amendment to ONB-016 (follow-up to PO-AF-03) | 001, 058 | No contact detail displayed |
| OD-UX-7 | When customer details are "required" for **staff** orders | Product | **OPEN** | SPEC/PRD (ACT-ORD-03, ORD-050) | 023 | Optional section; no condition invented |
| OD-UX-8 | Hold **release** and readiness effect (the re-fire bill effect is **RESOLVED**: kitchen-only, PO-3, 2026-10-08) | Product | **OPEN** (hold release only) | SPEC/PRD (TRD PB-5) | 022, 024 | No Release control; re-fire shows no price |
| OD-UX-9 | **Cancel bill** rules | Product | **RESOLVED** (product-owner decision PO-5, 2026-10-08: Finalized only, mandatory reason, no automatic refund, no re-bill) | — | 027 | Enabled for Finalized bills with a `financial` dialog and mandatory reason |
| OD-UX-10 | How staff **discover past (closed-day) bills** for correction | Pure UI (the *capability* is upstream) | **RESOLVED** `[DESIGN DECISION]` | — | 026, 031 | Bills list + date-range filter + customer history. *This defines only the UI discovery/access pattern. It does not create or alter bill correction, reopening, authorization, or day-close business rules.* |
| OD-UX-11 | Attention **auto-resolution** / Dismissed vs Resolved meaning | Product | **OPEN** | SPEC/PRD (TRD PB-9) | 006 | Manual actions only |
| OD-UX-12 | Owner Agent **permitted actions** catalogue | Product + technical (tool catalogue) | **OPEN** | SPEC/PRD, then TRD (PB-18) | 009 | Read agent only; ProposalCard specified, not rendered |
| OD-UX-13 | WhatsApp ordering when **AI is unavailable** | Product | **OPEN** | SPEC/PRD (TRD PB-16) | 057 | No fallback designed |
| OD-UX-14 | Table-QR acceptance when **no session exists**; concurrent pending submissions | Product | **OPEN** | SPEC/PRD (TRD PB-11) | 019, 021 | Independent pending batches; session handling per server |
| OD-UX-15 | Closed-state gaps (open table, discounts, hold/void/re-fire while Closed; initial Open/Closed) | Product (UI part resolved) | **OPEN** (product); UI treatment fixed | SPEC/PRD (TRD PB-10) | 003, 019, 022, 027, 030 | UI shows the **server's refusal reason**; no pre-emptive enabling/disabling |
| OD-UX-16 | Reorder: table context from a link; **all items unavailable** | Product (UI wording resolved) | **OPEN** (product); wording fixed | SPEC/PRD (TRD PB-17) | 053 | Takeaway; message "None of these items are available right now" |
| OD-UX-17 | UI languages beyond English | Product | **OPEN** | PRD / product owner | all | Strings externalised; English only `[ASSUMPTION AS2]` |
| OD-UX-18 | **Brand identity** | Pure UI | **RESOLVED** `[DESIGN DECISION]` | — | all | Palette approved as v1; wordmark = text "SERVENA" until a logo asset is supplied |

**Totals:** 18 items · **3 resolved at the UI layer** (OD-UX-2, 10, 18) · **2 resolved by product-owner decision on 2026-10-08** (OD-UX-3, 9) · **13 genuinely unresolved** (OD-UX-8 only for hold release), all product-owned; re-reviewed in the 2026-10-08 hardening pass (§22.1): none is UI-owned, none is closed by a UI treatment, no new decision created (OD-UX-12 also needs a TRD tool catalogue after the product decision). None blocks the design contract: each has a neutral, specified treatment.

---

## 19. Design Decision Records

**DDR-01 — Three-layer tokens with shadcn variable compatibility.** *Context:* mandated stack uses shadcn/Tailwind. *Decision:* primitive → semantic → component tokens; semantic names keep shadcn's standard variables and add SERVENA families (§15.2); the one name that means two things (`--accent`) is disambiguated in §15.2. *Alternatives:* Tailwind palette in app code (rejected: allows arbitrary colour). *Consequences:* re-skin via primitives only.

**DDR-02 — Indigo primary, teal accent, reserved fuchsia `ai` tone (APPROVED as v1 palette, `[DESIGN DECISION]`).** *Context:* status colours (green/amber/red/blue) must stay unambiguous; AI must never look operational. *Decision:* a hue for brand that collides with none, and an `ai` tone no operational state may use. *Alternatives:* green/blue brand (rejected: collides with success/info). *Consequences:* learnable "this colour = AI says" rule; contrast verified in both themes.

**DDR-03 — Single StatusBadge registry.** *Decision:* one component with a domain→state→{tone, icon, label} registry; named aliases are exports. *Alternatives:* a badge per domain (rejected: drift, R7). *Consequences:* one place to change a status look.

**DDR-04 — Density modes, not per-screen sizing.** *Decision:* `compact`/`comfortable`/`kds` as variable sets chosen by role/device at the shell. *Alternatives:* ad-hoc sizes per screen (rejected: R9/R10). *Consequences:* POS and KDS reuse every component.

**DDR-05 — Sheet is the default create/edit container.** *Decision:* side Sheet (bottom on mobile) for ≤ 8-field forms; Modal only for confirmation/short forms. *Alternatives:* route-per-form (more navigation), modals everywhere (poor on mobile). *Consequences:* list context is kept; unsaved-changes guard is one pattern.

**DDR-06 — Permission-driven rendering: hide vs disable.** *Decision:* never-granted actions are not rendered; granted-but-invalid actions are disabled with a visible reason. *Alternatives:* show everything disabled (noise, leaks capability map). *Consequences:* consistent with RBAC-007/016; Owner-granted permissions appear automatically.

**DDR-07 — `Money` is the only money formatter; no client arithmetic.** *Decision:* components format integer paise; totals and tax come from the server. *Consequences:* UI cannot disagree with the ledger.

**DDR-08 — CustomerShell is a separate frame on the same system.** *Decision:* no sidebar/TopBar controls for customers; same tokens/components. *Consequences:* one visual language, minimal customer surface.

**DDR-09 — Theme follows OS; no theme setting.** *Context:* no settings/profile destination exists (U12). *Decision:* `prefers-color-scheme` only. *Consequences:* no invented settings screen.

**DDR-10 — KDS columns carry state but never alone.** *Decision:* three columns plus a StatusBadge on every ticket; ordering by priority then age; no delay styling. *Consequences:* accessible and consistent with the removal of delayed-order workflows.

**DDR-11 — AI information kinds.** *Decision:* five kinds with text + icon + container cues; AI tone reserved; facts server-rendered. *Consequences:* AI cannot be mistaken for truth.

---

## 20. Development Enforcement Rules

These rules bind every future frontend implementation agent and developer. They are part of the design contract.

1. **The UI/UX Design Brief is the frontend visual source of truth.**
2. **All screens use the canonical SERVENA design tokens** (§4).
3. **All screens use the canonical reusable components** (§5).
4. **All screens use the canonical UX patterns** (§8).
5. Developers **must not introduce arbitrary colours** (no raw hex/RGB/HSL values outside the token files; no screen-specific status colours).
6. Developers **must not introduce arbitrary typography** (no other font family, heading scale, size, weight, line height or letter spacing).
7. Developers **must not introduce arbitrary spacing** (spacing, radius, border, elevation and fixed sizes come from tokens only).
8. Developers **must not duplicate existing components** (R0, R7).
9. Developers **must not create screen-specific design systems.**
10. Developers **must not create alternative button / input / modal / table systems** without an approved design-system extension (§21).
11. **New reusable components require documented justification** (§21, R6).
12. **New tokens require documented justification** (§21, T2).
13. **New visual patterns require documented justification** (§21).
14. **Accessibility rules are mandatory** (§14).
15. **Responsive rules are mandatory** (§13).
16. **Light/dark theme behaviour is mandatory** — every token, component and screen works in both themes (§4.2–4.3).
17. **Existing semantic states must be reused** (§4.2, D-01); a state is never given a new colour or icon on one screen.
18. **Product behaviour comes from the upstream product and technical documents**, not from visual implementation decisions.

> **If an implementation agent encounters a UI requirement not covered by this document, it MUST NOT silently invent a new visual convention when an existing SERVENA pattern can be reused.**

**Enforcement mechanisms** (conceptual, §15.6): lint for raw colours / arbitrary values / forbidden imports; token-compliance script; contrast regression test; axe checks on component and screen states; a dev-only component gallery showing every component × variant × state × theme × density; design-system extension review (§21) as a required PR check.

---

## 21. Design-System Extension Governance

A genuinely new **token, component, component variant, UX pattern, semantic state or responsive behaviour** may be added only through this process. One-off screen hacks are not allowed.

| Step | Action |
|---|---|
| 1 | **Search** the existing design system (tokens §4, components §5, patterns §8, aliases §5.10) |
| 2 | **Determine whether reuse is possible** (R0: reuse → variant → composition) |
| 3 | If not, **document the gap** (what is needed, on which screen/flow, upstream reference) |
| 4 | **Explain why existing components are insufficient** (which were tried and why they fail) |
| 5 | **Propose the smallest reusable extension** (token / variant / component) and its name, props and tokens |
| 6 | **Ensure accessibility** (§14: contrast, keyboard, focus, names, targets, reduced motion) |
| 7 | **Ensure light/dark compatibility** (values in both themes; contrast re-verified) |
| 8 | **Ensure responsive behaviour** (§13 transformation for mobile/tablet/desktop; density modes) |
| 9 | **Add it to the canonical design system** — this document (registry row/variant, §5.10 alias table, §19 DDR, §18.1 classification) in the same change |
| 10 | **Use it consistently thereafter** on every screen where the need recurs; the one-off is removed |

**Extension record (required in the PR):** *Gap · Upstream reference · Existing options tried · Proposed extension · A11y · Light/dark · Responsive · Affected screens · DDR id.*

**Approval:** an extension is merged only with the design-system owner's review and an updated brief. An extension never changes upstream product behaviour; if it would, it is an `[OPEN DECISION]` for the owning upstream document.

---

## 22. Final Audit and Quality Gates

Automated (S) checks parse the values **from this document** and the APP_FLOW catalogue; review (R) checks are by reading against SPEC v1.3, PRD v1.2, APP_FLOW v1.4 and TRD v1.0.

| # | Check | Result | Method | Evidence |
|---|---|---|---|---|
| 1 | 44/44 APP_FLOW screens | **PASS** | S | 44 of 44; missing []; extra [] |
| 2 | No duplicate screen IDs | **PASS** | S | headings 44, unique 44; index 44 unique 44 |
| 3 | No duplicate component definitions | **PASS** | S | 83 unique ids, 83 unique names |
| 4 | Every screen has component references | **PASS** | S | 44 screens; missing Reuses: []; names not in registry: [] |
| 5 | No raw colours outside token definitions | **PASS** | S | 0 occurrences outside §4 |
| 6 | No arbitrary typography outside tokens | **PASS** | S | 0 typography property/size literals outside §4: [] |
| 7 | No arbitrary spacing/size outside tokens | **PASS** | S | px values outside §4: [2, 4, 8, 20, 24, 44, 56, 320, 400]; not token-derived: [] |
| 8 | No arbitrary radius outside tokens | **PASS** | S | 0 radius literals outside §4 |
| 9 | Semantic tokens resolve correctly | **PASS** | S | unresolved colour tokens: []; unresolved scale tokens: [] |
| 10 | Light theme complete | **PASS** | S | 23 semantic tokens + 8 tones × 4 roles parsed from §4; missing: [] |
| 11 | Dark theme complete | **PASS** | S | 23 semantic tokens + 8 tones × 4 roles parsed; missing: [] |
| 12 | WCAG contrast computed | **PASS** | S | 105 pairings computed from the values parsed out of §4 |
| 13 | All contrast pairings pass | **PASS** | S | 105/105 pass; failures: [] |
| 14 | All roles covered | **PASS** | S | §7 rows for Owner, Manager, Cashier, Waiter, Kitchen, Customer, SuperAdmin; navigation matrix §6.3 |
| 15 | Shared UX states covered | **PASS** | S | 13 states mapped to canonical components (§8.3) |
| 16 | Accessibility covered | **PASS** | S | §14.1–14.9 (WCAG 2.2 AA, keyboard, focus, semantics, errors/time, colour independence, motion, auth, verification) |
| 17 | Responsive behaviour covered | **PASS** | S | §13.1 breakpoints, §13.2 transformations, §13.3 role-critical surfaces |
| 18 | Financial UX covered | **PASS** | S | §4.4.2, D-03/D-11/D-12, §9.7 (incl. bill-status action table), SCR-027/028; re-verified against the finalized schema/TRD in §22.1 |
| 19 | AI UX covered | **PASS** | S | §9.10, D-16/D-17, SCR-007…010 |
| 20 | KDS/POS UX covered | **PASS** | S | §12.1, §12.2, SCR-023/024/026/027 |
| 21 | Operational state semantics preserved | **PASS** | S | 37 upstream state labels present in the status registry; missing: [] |
| 22 | No product behaviour invented | **PASS** | R | Every undefined upstream behaviour is an OD-UX item with a neutral treatment (§18.3); automated scan for out-of-scope concepts outside negations: 2 hits reviewed → ['pay now', 'public review'] |
| 23 | No permission behaviour invented | **PASS** | R | Navigation (§6.3) and role rows (§7) are derived from APP_FLOW §29.2; actions render from effective permissions (U1); no role or atom added |
| 24 | No financial rule changed | **PASS** | R | Money/billing UI restates PO-TRD-01, BILL-*, PAY-*, DAY-022; no totals computed client-side; no payment execution UI |
| 25 | No Phase 1 scope changed | **PASS** | R | No reservations, loyalty, public reviews, payment execution, delayed-KDS styling, 2FA/OTP, extra roles (§2.3, §9, SCR blocks) |
| 26 | Component reuse rules explicit | **PASS** | S | §5.1 R0 + R1–R10 |
| 27 | Development enforcement rules explicit | **PASS** | S | §20 (18 rules + mandatory sentence) |
| 28 | Extension governance explicit | **PASS** | S | §21 (10 steps + extension record) |
| 29 | Palette classified [DESIGN DECISION] | **PASS** | S | §4 intro, §18.1 #26, DDR-02 |
| 30 | OD-UX-10 correctly classified | **PASS** | S | classified [DESIGN DECISION]; upstream basis cited (CUSTOMER-022, TABLE-011, APP_FLOW §18.3); required statement present 4× |
| 31 | No frontend implementation started | **PASS** | S | git: only docs/ changes; frontend/ contains only .gitkeep; other changes: [] |

**Totals**

| Measure | Count |
|---|---|
| Token categories | 8 (colour, typography, spacing, radius, border, elevation, motion, density) + layout dimensions + iconography · 17 operational state domains · 2 themes · 3 density modes |
| Contrast pairings computed | 105 (all pass) |
| Reusable components | **83** (F 9 · FM 17 · FB 12 · L 16 · DT 10 · D 19) + 26 named aliases |
| Shared UX patterns | **21** |
| Screens | **44 / 44** |
| Open UI decisions | 18 reviewed → **5 resolved** (OD-UX-2, 3, 9, 10, 18 — 3 at the UI layer, 2 by product-owner decision), **13 genuinely unresolved** (product-owned) |
| Design decision records | 11 |

---

### 22.1 Hardening pass — 2026-10-08

An independent review of this brief against the **finalized** SPEC v1.3, PRD v1.2, APP_FLOW v1.4, TRD (incl. §25.9 PO-TRD-03) and DATABASE_SCHEMA v1.0. It is not a redesign: the approved palette (OD-UX-18) and the component system are unchanged. Findings are classified **P0** blocks implementation · **P1** fix before implementation · **P2** implementation-safe improvement · **P3** preference, and by source.

#### 22.1.1 Method and skills

| Item | Detail |
|---|---|
| Read in full | this brief (2,551 lines); targeted anchored re-reads of SPEC (BILL-*, PAY-*, DAY-*, ORD-073/082/087/088/093), PRD (§39, PRD-BILL-*), APP_FLOW (§16, §18.3, §29 catalogue, AMB-02/05/11/14), TRD (§13, §15, §17, §19, §25.9, §27, §28, §30, §37.3), DATABASE_SCHEMA (§10, §11.32–11.40, §22.4) |
| Automated re-checks | screen coverage, component registry, alias map, raw-hex scan, token-duplicate scan, contrast recomputation, stale-text scan, matrix generation (scripts run during this pass; evidence in 22.1.2–22.1.3) |
| Official source consulted | shadcn/ui theming documentation (`ui.shadcn.com/docs/theming`): `--accent` is the "interactive hover, focus, and active surfaces" token (menu highlight, hovered rows); `--chart-1…5` and `--sidebar-*` variables exist in the default scaffold — grounds HF-09/HF-10/HF-11 |
| Skills **applied** (loaded and used as review lenses) | `ui-ux-pro-max:ui-ux-pro-max` (accessibility, touch, forms, navigation priorities) · `ui-ux-pro-max:design-system` (token and component-spec architecture) · `ui-ux-pro-max:design` and `ui-ux-pro-max:ui-styling` (routing and shadcn/Tailwind theming) · `frontend-design:frontend-design` · `impeccable:impeccable` (Operate-mode principle: scanability and consistency over expression) · `taste-skill:brandkit` (brand-coherence lens) · `taste-skill:taste-skill` (= *design-taste-frontend*) and `taste-skill:minimalist-skill` (= *minimalist-ui*) · `taste-skill:output-skill` (= *full-output-enforcement*) · `agent-skills:frontend-ui-engineering` · `agent-skills:spec-driven-development`, `source-driven-development`, `constraint-driven-development`, `documentation-and-adrs` and `superpowers:verification-before-completion` (loaded earlier in this session and applied) |
| Skills **unavailable** | none of the named skills failed to load. **Scope limits, stated honestly:** the `taste-skill` pair scope themselves to landing pages and portfolios ("dashboards: out of scope"), so they were applied only to the customer-facing surfaces and their Inter/Lucide/palette preferences were **not** treated as requirements (the palette is approved); `impeccable`'s project-context script and detector were **not run** because no frontend code exists; nothing was rendered in a browser |

#### 22.1.2 The 31 existing checks — re-verified

| Measure | Result |
|---|---|
| Previous | 31 / 31 PASS |
| New PASS | **31** (checks 16, 18, 20 and 24 pass **after** fixes HF-01…HF-12) |
| New FAIL | **0** |
| New WARNING | **3** — (W1) accessibility is verified at document level only: no axe, keyboard or screen-reader run is possible before a UI exists; (W2) check 13: this pass independently recomputed **87** contrast pairings (every tone, text, border and focus pairing in both themes plus the new chart aliases) with **0** failures, but did not reproduce the brief's 105-pair list one-for-one; (W3) component-library behaviours (Sonner, vaul, shadcn Sidebar) were not re-verified against their documentation — only shadcn theming was |

| # | Check | Previous | Re-run | New | Note |
|---|---|---|---|---|---|
| 1–2 | 44/44 screens, no duplicate ids | PASS | script: APP_FLOW catalogue 44, brief headings 44 unique, index 44 | PASS | |
| 3 | No duplicate component definitions | PASS | script: 83 ids, 83 names, F9·FM17·FB12·L16·DT10·D19 | PASS | |
| 4 | Every screen has component references | PASS | script: 44/44 `Reuses` rows | PASS | |
| 5 | No raw colours outside tokens | PASS | script: 0 hex outside §4 | PASS | chart tokens added as **aliases**, no new value |
| 6–9 | Typography / spacing / radius literals; tokens resolve | PASS | review + duplicate-token scan (72 rows; repeats are the light/dark value sets of one name, not conflicts) | PASS | |
| 10–11 | Light / dark complete | PASS | review of §4.2–4.3 | PASS | `--chart-*` inherit both themes through their targets |
| 12–13 | Contrast computed / all pass | PASS | independent recompute, 87 pairings, 0 failures | PASS | W2 |
| 14 | All roles covered | PASS | §6.3 nav matrix compared with APP_FLOW §29.2 access table | PASS | |
| 15 | Shared states | PASS | §8.3 (+1 row: staff restaurant/outlet state) | PASS | |
| 16 | Accessibility | PASS | WCAG 2.2 claim vs criteria | PASS after HF-12 | 2.4.11, 2.5.7, 3.3.7, 3.2.6 added; W1 |
| 17 | Responsive | PASS | §13.1–13.3 + per-screen defaults | PASS | KDS tab-mode gap closed (HF-13) |
| 18 | Financial UX | PASS | against schema/TRD §25.9 | PASS after HF-01…HF-05 | stale Refunded/attribution wording fixed |
| 19 | AI UX | PASS | §9.10, SCR-007…010 | PASS | no change needed |
| 20 | KDS / POS | PASS | §12 vs TRD §15.2, §23.7, §25.9.4 | PASS after HF-06, HF-07, HF-13 | |
| 21 | Operational state semantics | PASS | status registry vs schema §10.1 | PASS | `Refunded` present; schema has no state the registry lacks |
| 22–25 | No invented product / permission / financial / scope | PASS | review of every added sentence | PASS | each addition cites SPEC/APP_FLOW/TRD §25.9 or is tagged `[DESIGN]` |
| 26–28 | Reuse, enforcement, governance | PASS | §5.1, §20, §21 | PASS | |
| 29–30 | Palette and OD-UX-10 classification | PASS | unchanged | PASS | |
| 31 | No frontend implementation | PASS | `git status`: only `docs/` | PASS | |

#### 22.1.3 New checks

| # | Check | Result | Evidence |
|---|---|---|---|
| N1 | Cross-document matrix (screen → APP_FLOW → PRD → TRD → schema → component → role → states → a11y → responsive) | **PASS** | §22.1.8: 44 rows, 0 missing links |
| N2 | Financial terminology equals the finalized rules | **PASS** after fixes | `Refunded` is a bill status with server-supplied Partial/Full; a refund never changes payment status; invoice number stable with "Revised n"; cancel needs a reason and Finalized only; Finalized/Refunded/Cancelled restrictions visible (§9.7 table); re-fire non-financial; corrections counted on the day they happen; net sales signed |
| N3 | No stale OD-UX entries | **PASS** | 18 entries re-reviewed; OD-UX-3 and 9 resolved; OD-UX-8 only hold release; totals line corrected |
| N4 | Hide vs disable vs deny vs approval vs wrong state/outlet/closed/suspended | **PASS** after HF-08 | GC-2, PAT-11, FB-09, staff AppShell status Alert |
| N5 | UI never presents hiding as the security boundary | **PASS** | U1, GC-2 ("the server still enforces"), PAT-11a |
| N6 | Offline / realtime | **PASS** | PAT-14/15/16, FB-10/11/12, KDS disconnect rule; success only after server ack; queue ≠ success; same-key retry; REST authoritative, events are hints; reconnect resync |
| N7 | AI never appears as operational truth | **PASS** | five information kinds, reserved `ai` tone (also excluded from chart series), facts/recommendations separate |
| N8 | Token consistency | **PASS** after HF-09/HF-10/HF-11 | no conflicting duplicate; shadcn `--accent` collision resolved; `--chart-*`/`--sidebar-*` mapped |
| N9 | Component registry / aliases | **PASS** after HF-14 | 83 components; 26 aliases now all listed in §5.11 |
| N10 | State coverage per screen | **PASS** after HF-16 | all 44 blocks carry a States row or the declared default recipe |
| N11 | Responsive coverage | **PASS** | 38 blocks use the declared default transformations (§13.2); role-critical surfaces explicit (§13.3) |
| N12 | Implementation feasibility (React · Vite · Tailwind · shadcn · Radix · TanStack Query · Zustand) | **PASS** | every component maps to a primitive (§15.4); variables mapped (§15.2); state-library split is an Implementation-Plan concern (HR-02) |
| N13 | Development enforcement and extension governance | **PASS** | §20, §21 unchanged and sufficient |
| N14 | No business rule introduced | **PASS** | additions restate upstream (cited) or are visual/wording `[DESIGN]`; no new `OD-UX` created |
| N15 | No duplicate component definitions | **PASS** | script (N9) |
| N16 | Upstream untouched | **PASS** | SPEC, PRD, APP_FLOW, TRD, DATABASE_SCHEMA not modified by this pass |

#### 22.1.4 Findings register

| ID | Priority | Area | Finding | Source | Action |
|---|---|---|---|---|---|
| HF-01 | **P1** | Financial UX | §9.7 "two statuses" row still listed bill statuses without **Refunded**; Partial/Full qualifier computed-by-UI wording ambiguous | [DATABASE_SCHEMA] §10.1, [TRD] §25.9.2, [APP_FLOW] §16.1 | Fixed: Refunded added; qualifier is server-supplied (§4.2, §9.7) |
| HF-02 | **P1** | Financial UX | "Counted in <original business day>" contradicted PO-6 (a correction counts on the day it happens) | [TRD] §25.9.7, [SPEC] DAY-022 | Fixed: "Recorded in <day it happened> · bill from <original day>" |
| HF-03 | **P1** | Financial UX | No UI contract for the **stable invoice number**, "Revised n", or revision/refund/cancellation history | [TRD] §25.9.5 | Fixed: D-11, §9.7 layout, Timeline entries with effective business day |
| HF-04 | **P1** | Financial UX | Finalized / Refunded / Cancelled restrictions not visible; my earlier Refunded wording ("shows no controls") contradicted GC-2 | [TRD] §25.9.2/§25.9.6, [UI DESIGN] GC-2 | Fixed: bill-status → action table; disabled-with-reason everywhere |
| HF-05 | **P1** | Day Close | Metric cards lacked Gross and **Net (signed, can be negative)**; no correction/refund breakdown | [SPEC] DAY-007/026, [TRD] §27.3, §25.9.7 | Fixed: §9.8, SCR-028 |
| HF-06 | **P1** | KDS / orders | No UI for the bill guard: cancel/void (Kitchen included) refused while the bill is Finalized/Refunded/Cancelled | [TRD] §25.9.4 (K1) | Fixed: §9.4, SCR-022, SCR-024 |
| HF-07 | **P1** | KDS | Re-fire had no representation (informational line, no state, no price) | [TRD] §15.2, §23.7, §25.9.4 | Fixed: §12.1 |
| HF-08 | **P1** | Generic states | Staff shell had no persistent **suspended / not-activated** state (staff may sign in while suspended) | [SPEC] ONB-014.1, [TRD] §28.2–28.3 | Fixed: AppShell status `Alert` (existing component), §8.3 |
| HF-09 | **P1** | Implementability | shadcn `--accent` means hover/selected fill; §4.2 `--accent` is teal → menu hovers would turn teal | shadcn theming docs, [UI DESIGN] §15.2 | Fixed: teal exposed as `--accent-brand` in code; mapping stated |
| HF-10 | **P1** | Design system | No categorical chart colours; devs would reuse status tones (green = "success") | [DESIGN DECISION] | Fixed: `--chart-1…4` aliases of verified solids, ≤ 4 series, patterns + labels, status/AI tones excluded |
| HF-11 | P2 | Implementability | shadcn Sidebar needs `--sidebar-*` variables; unmapped | shadcn theming docs | Fixed: §15.2 mapping |
| HF-12 | **P1** | Accessibility | "WCAG 2.2 AA" claimed without 2.4.11 Focus Not Obscured, 2.5.7 Dragging, 3.3.7 Redundant Entry, 3.2.6 Consistent Help | WCAG 2.2 | Fixed: §14.1 row |
| HF-13 | P2 | Responsive / KDS | In single-column Tabs mode a cancellation request could sit in an inactive tab | [UI DESIGN] | Fixed: pinned request bar + tab count badge |
| HF-14 | P2 | Registry | `DayStatusBadge` alias missing from §5.11 (25 vs 26); PAT-08 omitted bill cancellation | [UI DESIGN] | Fixed |
| HF-15 | P2 | Governance | §18.3 and §22 totals still said 3 resolved / 15 open | [UI DESIGN] | Fixed (5 / 13) |
| HF-16 | P2 | States | SCR-056/057/058 lacked a States row | [UI DESIGN] | Fixed |
| HF-17 | P2 | Customer | SCR-054 could be read as allowing UI-invented bill status/markers | [TRD] §30.2 | Fixed: renders only the server's customer-safe projection |
| HR-01 | P3 | Brand | Indigo + Inter + Lucide is a conventional SaaS identity; coherent and approved | [DESIGN DECISION] OD-UX-18 | **Not changed** (see 22.1.6) |
| HR-02 | P2 | Implementation | Brief is silent on server-state vs UI-state libraries (TanStack Query vs Zustand) | [IMPLEMENTATION RECOMMENDATION] | Not a requirement; left to the Implementation Plan |
| HR-03 | P2 | Customers | SCR-031 "Visits" has no upstream definition (schema OD-DB-22); "Total spend" is defined (TD-CUS-2, refunds separate) | [PRD] CUSTOMER-002, [DATABASE_SCHEMA] | UI shows server values; no extra definition invented |
| HR-04 | P2 | Kitchen | Re-fired work has no state, so Kitchen cannot mark it done separately | [TRD] §15.2/§25.9.4 | Reported, not changed (22.1.7) |
| HR-05 | P3 | Docs | §4.12 precedes §4.11 | [UI DESIGN] | Cosmetic; not renumbered (ids are referenced elsewhere) |

**P0: none. P1: 11 found (HF-01…HF-10, HF-12), 11 fixed, 0 open. P2: 9 (6 fixed, 3 reported as recommendations). P3: 2 (not changed).**

#### 22.1.5 Remaining UI open decisions

All 13 remaining `OD-UX` items (1, 4, 5, 6, 7, 8-hold-release, 11–17) are **product-owned**; none is UI-owned, none is answered by a UI treatment, none depends on the finalized schema/TRD decisions beyond what is already recorded, and each has a neutral, specified treatment. No new decision was created.

#### 22.1.6 Non-blocking recommendations (not requirements)

1. `[IMPLEMENTATION RECOMMENDATION]` Keep **server state in TanStack Query** (invalidate on realtime hints, refetch on reconnect) and use **Zustand** only for ephemeral UI state (connection banner, pending-queue view, density/shell context); decide in the Implementation Plan.
2. `[DESIGN]` When the logo asset exists (OD-UX-18), revisit the wordmark and consider a brand-specific display face for the customer shell only; the operational UI should stay on the neutral system for scanability.
3. `[DESIGN]` Build the dev-only component gallery (§15.6) before screens, including the bill-status × action table of §9.7 as story fixtures.
4. `[IMPLEMENTATION RECOMMENDATION]` Verify Sonner, vaul and shadcn Sidebar behaviours against their documentation in the foundation slice (W3).

#### 22.1.7 Upstream changes required

**None.** One observation for the product owner, not a blocker and not a new decision: re-fired work is an informational KOT line with no state (TRD §15.2), so Kitchen cannot mark it separately done (HR-04); if tracking is wanted it is a future product decision.

#### 22.1.8 Cross-document matrix

| SCR | APP_FLOW | PRD / SPEC refs | TRD | DATABASE_SCHEMA | UI components / patterns | Roles | States | A11y | Responsive |
|---|---|---|---|---|---|---|---|---|---|
| SCR-001 | AF-002 | AUTH-001.1, AUTH-005.AC1 | §12.1–12.5, TN-1 | users, sessions, invitations | Surface, Text, FormField, Input, PasswordInput | Owner, Manager, Cashier, Waiter, Kitchen Staff. (SuperAdmin  | row | row | row |
| SCR-002 | AF-002 | AUTH-008.1 | §11.5, §13.7, TD-TENANT-1 | staffAssignments, outlets | PageHeader, Surface, StatusBadge, Button, EmptyState | Owner; Manager with > 1 assigned outlet [AUTH-008] | row | row | row |
| SCR-003 | AF-004, AF-005 | ONB-020.1…ONB-033.1, PRD §10–§11 | §28, §20, §34 | organizations, outlets, menu*, floors/tables, staffAssignments, kitchenStations | Tabs, FormSection, FormField, Input, Select | Owner (Manager: menu, tables/QR, staff parts) [APP_FLOW §29. | row | row | row |
| SCR-030 | AF-006, AF-007 | ACT-AVA-01.1 | §28 | outlets, outletStateEvents | OutletSwitcher, Sheet, StatusBadge, KeyValueList, ConfirmationDialog | Owner, Manager | row | row | §13.2/13.3 |
| SCR-004 | AF-066 | ACT-ANL-01.1, ACT-ANL-02.1, ANALYTICS-001.1…006.1 | §27.6, §37.5, §31.9 | dayRollups, businessDays (+ live ledger) | MetricCard, Chart, DataTable, Surface, OutletSwitcher | Owner (all authorized outlets + cross-outlet comparison), Ma | row | row | row |
| SCR-005 | AF-067 | ANALYTICS-010.AC1, ACT-ANL-03.1 | §15.5–15.6, §25 | bills | DataTable, FilterBar, StatusBadge, OrderOriginTag, Money | Owner, Manager, Cashier, Waiter | row | global §14 | §13.2/13.3 |
| SCR-006 | AF-062 | ACT-ANL-04.1, ATTENTION-002.1 | §15.7, §31.9 | attentionItems | InformationBlock, KeyValueList, StatusBadge, FilterBar | Owner, Manager (own outlets) | row | global §14 | §13.2/13.3 |
| SCR-007 | AF-060 | ACT-AI-04.1, AI-026.1 | §31.5 | dailyBriefs | InformationBlock, MetricCard, Select, ErrorState | Owner (authorized outlets), Manager (own outlets) | row | row | §13.2/13.3 |
| SCR-008 | AF-061 | ACT-AI-05.1, AI-028.1 | §31.6 | dayRollups (computed; nothing stored) | InformationBlock, KeyValueList, EmptyState | Owner, Manager (own outlets) | row | global §14 | §13.2/13.3 |
| SCR-009 | AF-058, AF-059 | ACT-AI-03.1, ACT-AI-08.1, AI-029.1 | §31.1–31.3 | aiProposals, aiInteractions | InformationBlock, ProposalCard, Textarea, Button, ErrorState | Owner only | row | row | §13.2/13.3 |
| SCR-010 | AF-057 | ACT-AI-01.1, ACT-AI-07.1, ACT-AI-02.1, AI-012.AC1 | §31.4, §34 | menuImports, menuImportCandidates, uploadedFiles | FileUpload, DataTable, IssueList, Sheet, InformationBlock | Owner only | row | global §14 | §13.2/13.3 |
| SCR-011 | AF-014, AF-015 | ACT-MNU-01.1, ACT-MNU-02.1 | §20 | menuCategories, menuItems, modifierGroups | DataTable, Sheet, FormSection, FormField, MoneyInput | Owner, Manager | row | global §14 | §13.2/13.3 |
| SCR-012 | AF-016 | ACT-MNU-03.1 | §20.2 | menuOutletOverrides | DataTable, Sheet, RadioGroup, MoneyInput, StatusBadge | Owner, Manager | row | global §14 | §13.2/13.3 |
| SCR-013 | ACT-CFG-01, AF-004, AF-005 | ACT-CFG-01.1, ONB-015.1 | §28, §34 | organizations, outlets, uploadedFiles | Tabs, FormSection, FormField, FileUpload, DataTable | Owner only [ACT-CFG-01] | row | global §14 | §13.2/13.3 |
| SCR-014 | AF-017 | ACT-TBL-05.1 | §21.5 | floors, tables | TableTile, QrCodeCard, Sheet, Tabs, ConfirmationDialog | Owner, Manager | row | global §14 | §13.2/13.3 |
| SCR-015 | AF-008, AF-009 | ACT-STF-01.1…06.1 | §12.5, §13 | users, staffProfiles, staffAssignments | DataTable, Sheet, StaffAvatar, StatusBadge, FormField | Owner, Manager; Cashier/Waiter/Kitchen see their own record  | row | global §14 | §13.2/13.3 |
| SCR-016 | ACT-STF-05, AF-010 | ACT-STF-05.1, RBAC-005.1 | §13.2–13.3 | permissionOverrides | Combobox, FormSection(collapsible), RadioGroup, SearchInput, InformationBlock | Owner (Manager only if granted ACT-STF-05) | row | global §14 | §13.2/13.3 |
| SCR-017 | AF-011, AF-012 | ACT-ATT-01.1…04.1 | §13, STAFF-002 | staffProfiles | Tabs, DatePicker, TimePicker, DataTable, Sheet | Owner, Manager manage; Manager/Cashier/Waiter/Kitchen view o | row | global §14 | §13.2/13.3 |
| SCR-018 | AF-013 | ACT-AVL-01.1 | STAFF-004…008 | staffProfiles | RadioGroup, StatusBadge, Button | Owner, Manager, Cashier, Waiter, Kitchen | row | global §14 | §13.2/13.3 |
| SCR-019 | AF-018…022, AF-028 | ACT-TBL-01.1…07.1, ACT-MOD-05.1, ORD-050.1 | §21 | tables, tableSessions, tableOperationEvents | TableTile, StatusBadge, Sheet, Timeline, ConfirmationDialog | Owner, Manager (all table actions); Waiter (open, select) | row | row | row |
| SCR-020 | ACT-ORD-04 | ACT-ORD-04.1, ORD-003.AC1, ORD-004.AC1 | §22 | orders, orderItems | DataTable, FilterBar, StatusBadge, OrderOriginTag, ElapsedTimer | Owner, Manager, Cashier, Waiter, Kitchen (view) | row | global §14 | §13.2/13.3 |
| SCR-021 | AF-027 | ORD-008.2, ACT-ACC-01.1 | §15.1, §22.2 | orders, orderBatches | OrderSummary, OrderOriginTag, ElapsedTimer, Button, ReasonPicker | Owner, Manager, Cashier, Waiter (Kitchen cannot accept — INV | row | global §14 | §13.2/13.3 |
| SCR-022 | AF-027, AF-030…035, AF-040 | ORD-003.1, ACT-MOD-01.1…07.1, ACT-CAN-01.1…06.1 | §15.1–15.4, §22.7, §23, §25.9.4 | orders, orderItems, kots, cancellationRecords, cancellationRequests | OrderSummary, OrderItemRow, Timeline, CustomerSummary, ReasonPicker | Owner, Manager, Cashier, Waiter (actions per catalogue); Kit | row | global §14 | §13.2/13.3 |
| SCR-023 | AF-028, AF-029, AF-030 | ACT-ORD-01.1…03.1, ORD-050.1 | §19.5, §22, §23 | orders, orderItems, orderBatches, kots | SplitPane, MenuItemRow, OrderItemRow, QuantityControl, StickyActionBar | Owner, Manager, Cashier, Waiter | row | row | §13.2/13.3 |
| SCR-024 | AF-036…040, AF-065 | ACT-KDS-01.1…04.1, KDS-001.1…017.1 | §15.3, §23, §17.6 | orderItems, kots, cancellationRequests | KdsTicket, OrderItemRow, StatusBadge, OrderOriginTag, ElapsedTimer | Kitchen Staff; Owner/Manager view + Ready (Manager priority) | row | global §14 | §13.2/13.3 |
| SCR-025 | AF-041, AF-042 | HANDOFF-001.2, ACT-HND-01.1, ACT-HND-02.1 | §22 handoff | orders, orderItems | OrderSummary, OrderItemRow, OrderOriginTag, Button, Toast | Waiter (table), Waiter and Cashier (takeaway) | row | global §14 | §13.2/13.3 |
| SCR-026 | AF-043…045 | ACT-BIL-01.1, PRD §41 | §25, §26.3 | bills, billRevisions | SplitPane, DataTable, FilterBar, StatusBadge, OrderOriginTag | Cashier (landing); Owner, Manager, Waiter via bill actions | row | global §14 | §13.2/13.3 |
| SCR-027 | AF-043…051 | ACT-BIL-01.1…09.1, ACT-PAY-01.1, ACT-PAY-02.1 | §15.5–15.6, §25.5–25.9, §26 | bills, billRevisions, payments, refunds | BillSummary, PaymentSummary, OrderItemRow, Timeline, Money | Owner, Manager, Cashier, Waiter (per action) | row | row | §13.2/13.3 |
| SCR-028 | AF-052 | ACT-DAY-01.1, ACT-DAY-02.1, ACT-CSH-01.1, ACT-CSH-02.1 | §27.1–27.3, §25.9.7 | businessDays, dayCloseRevisions, cashReconciliations | MetricCard, IssueList, MoneyInput, Checkbox, ConfirmationDialog | Owner, Manager, Cashier | row | global §14 | §13.2/13.3 |
| SCR-029 | AF-053 | ACT-DAY-03.1 | §27.4 | businessDays, dayCloseRevisions | ReasonPicker, StatusBadge(day), ConfirmationDialog, PermissionDeniedState (state factor) | Owner, Manager, Cashier | row | global §14 | §13.2/13.3 |
| SCR-031 | ACT-CUS-01 | ACT-CUS-01.1, CUSTOMER-002.1 | §30.1 | customers, customerOutletProfiles, orders | DataTable, Sheet, CustomerSummary, SearchInput | Owner (all outlets), Manager (own), Cashier, Waiter, Kitchen | row | global §14 | §13.2/13.3 |
| SCR-032 | ACT-FB-02 | ACT-FB-02.1 | §30.3 | feedback | MetricCard, DataTable, FilterBar | Owner, Manager | row | global §14 | §13.2/13.3 |
| SCR-040 | AF-001 | ONB-001.1…006.1 | §12.5, §28 | organizations, outlets, users, invitations | Tabs, FormSection, FormField, PhoneInput, Combobox | SuperAdmin | row | global §14 | §13.2/13.3 |
| SCR-041 | AF-001, AF-003 | ONB-007.1…010.1, ONB-013.1 | §28, §12.5 | organizations, invitations | DataTable, Tabs, StatusBadge, KeyValueList, ConfirmationDialog | SuperAdmin | row | global §14 | §13.2/13.3 |
| SCR-042 | — | AUDIT-007.1, AUDIT-007.AC1 | §32 | auditEvents, auditSeals | DataTable, FilterBar, DateRangePicker, Sheet, KeyValueList | SuperAdmin only (AUDIT-007); a restaurant user opening it is | row | global §14 | §13.2/13.3 |
| SCR-050 | AF-023, AF-024, AF-025 | ORD-020.1, MENU-008.1 | §29, §20 | menu*, menuOutletOverrides, outlets (public key) | MenuItemRow, FilterChip, SearchInput, Sheet, StickyActionBar | Customer | row | row | §13.2/13.3 |
| SCR-051 | AF-023…025 | MENU-015.1 | §29.3, TD-ORD-4 | customerDrafts | QuantityControl, OrderItemRow(customer), SubmissionStatus, Alert, StickyActionBar | Customer | row | global §14 | §13.2/13.3 |
| SCR-052 | AF-02, AF-024, AF-025 | ORD-030.1, ORD-042.1, ORD-021.1 | §29.3, §30.1 | customers, orders | FormSection, FormField, Input, PhoneInput, StickyActionBar | Customer — tableless QR and website only (PO-AF-02) | row | row | §13.2/13.3 |
| SCR-053 | ACT-CUS-02, AF-054 | ORD-022.AC1, ORD-062.1, AUTH-009.1, ACT-CUS-02.1 | §30.2, §17 | orders, orderItems, customerOrderLinks | Timeline, StatusBadge, OrderOriginTag, OrderItemRow, Alert | Customer (own order only, via private non-guessable link — A | row | row | §13.2/13.3 |
| SCR-054 | ACT-BIL-01, AF-054 | ACT-BIL-01.1 | §30.2, §25.7 | bills, billRevisions (customer-safe projection) | BillSummary, StatusBadge, Money | Customer (own bill via private link — ACT-BIL-01) | row | global §14 | §13.2/13.3 |
| SCR-055 | AF-055 | FEEDBACK-001.1, FEEDBACK-006.1, ACT-FB-01.1 | §30.3 | feedback | RadioGroup, Textarea, FormField, Button | Customer | row | global §14 | §13.2/13.3 |
| SCR-056 | AF-004, AF-006 | ORG-021.1, ORG-029.1, ONB-032.1 | §28.3 | outlets | EmptyState, Text, Button | Customer | row | global §14 | §13.2/13.3 |
| SCR-057 | AF-026, AF-063 | AI-030.1, ORG-030.1 | §31.8 | whatsappMessages | Terminology §10.6, Money formatting §4.4.2 | Customer | row | global §14 | §13.2/13.3 |
| SCR-058 | AF-003, AF-03 | ONB-009.1, ONB-014.1, ONB-016.1 (PO-AF-03) | §28.3 | organizations (platform status) | EmptyState, Text | Customer (QR scan of a suspended or deactivated restaurant — | row | global §14 | §13.2/13.3 |

*States / A11y / Responsive: `row` = the screen block has its own row; otherwise the declared default recipe applies (§16.1: States `D`, A11y §14, Responsive §13.2–13.3).*

#### 22.1.9 Status gate

No P0 · no P1 open · no unresolved upstream conflict · 44/44 screens and 7/7 roles covered · financial UX matches the finalized schema/TRD · offline/realtime implementable with REST authoritative · AI never operational truth · accessibility specified to WCAG 2.2 AA (document-level, W1) · responsive behaviour specified · component system reusable and governed · traceability intact (N1) ⇒ **APPROVED FOR DOWNSTREAM IMPLEMENTATION** is retained.


*End of SERVENA UI/UX Design Brief v1.0 — APPROVED FOR DOWNSTREAM IMPLEMENTATION. No application code, backend change or frontend scaffold is created by this document. The next artifact (Implementation Plan) is created only after explicit approval to proceed.*
