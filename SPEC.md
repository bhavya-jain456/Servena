# SERVENA — Phase 1 Canonical Product Specification

> **The Operating System for Modern Restaurants**

| Field | Value |
|---|---|
| Document | Phase 1 Canonical Product Specification (pre-PRD) |
| Version | **1.1** — v1.0 APPROVED by product owner 2026-10-07; v1.1 adds dated amendment **A1 (2026-10-07)** recording the product owner's explicit decisions that closed every OPEN item during PRD finalization (§40) |
| Date | 2026-10-07 |
| Product source of truth | `SERVENA_Phase_1_User_Wise_Product_Workflow_and_Edge_Case_Hardening_v1.1.docx` — cited **[H§n]** |
| Explicit user decisions | Locked decisions given 2026-10-07 — **[LD-n]** (numbered 1–40 in the order given) and the final action matrix — **[LD-MX]**; hardening instructions given 2026-10-07 — **[UD]** |
| Not used | `SERVENA_Phase_1_User_Wise_Product_Workflow_Specification.docx` (v1.0). No requirement depends on it. |
| Companion | [CAPABILITY-MAP.md](CAPABILITY-MAP.md) |

---

## 0. How to Read This Document

### 0.1 Requirement status

| Status | Meaning | Can downstream docs build on it? |
|---|---|---|
| **CONFIRMED** | Directly stated by [H], [LD], [LD-MX] or [UD]; source cited | Yes |
| **PROPOSED (OD-nn)** | Your proposed resolution of an open decision (2026-10-07); not canonical until you approve the complete set | No — approve first |
| **PROPOSED** | Rule drafted by me (inferred, or derived from your proposals); not canonical until you accept it | No — accept/reject first |
| **OPEN** | Substantive rule with more than one viable answer; blocked on a numbered Open Decision (OD) | No |
| **DEFERRED** | Correctly belongs to a later document (PRD / TRD / UI) or a later phase | Only in that document |
| **EXCLUDED** | Explicit Phase 1 non-goal | Must not be built |

### 0.2 Other notation
`OD-nn` open decision (§36) · `DF-nn` deferred item (§37) · `C-nn` contradiction (§38) · `ACT-…` action-inventory row (§9) ·
`<ID>.ACn` acceptance criterion of requirement `<ID>` · MUST / MUST NOT / SHOULD per RFC 2119.

---

## 1. Source of Truth Hierarchy  [UD]

```
Explicit User Decisions      ← LD-1…40, LD-MX, UD, and your answers to ODs
        ↓                       (the v1.1 Hardening document is designated by you as the product source;
        ↓                        within it, H§44–45 "Final Product Decisions" override the H body)
Approved SPEC                ← this document, once approved
        ↓
PRD
        ↓
TRD
        ↓
Database / API / UI
        ↓
Implementation
```

- **SOT-001** A lower-level document MUST NOT contradict a higher-level approved document. CONFIRMED [UD]
- **SOT-002** When a conflict is found, the lower document is corrected; the higher document changes only by an explicit user decision recorded with date and ID. CONFIRMED [UD]
- **SOT-003** Within explicit user decisions: OD answers and LD > H§44–45 > H body. Where H includes something LD does not mention, H is final and it is in scope. CONFIRMED [UD, prior instruction "what is given in that doc is final"]
- **SOT-004** PROPOSED, OPEN and DEFERRED items in this SPEC are not canonical for PRD/TRD until resolved. CONFIRMED [UD]
- **SOT-005** A proposed resolution becomes an explicit user decision only when you explicitly approve it; nothing is converted to CONFIRMED automatically. On approval its status changes from PROPOSED (OD-nn) to CONFIRMED and its source becomes the OD with the approval date. CONFIRMED [UD]

## 2. Requirement IDs and Traceability  [UD]

### 2.1 ID format
`<PREFIX>-<nnn>` — e.g. `ORD-006`. IDs are **stable**: never renumbered or reused. A withdrawn requirement keeps its ID and is marked WITHDRAWN. New requirements take the next free number in their prefix. Acceptance criteria are `<ID>.AC<n>`.

| Prefix | Area | Prefix | Area |
|---|---|---|---|
| SOT | Source of truth | ORD | Unified order engine, channels, order/item lifecycle |
| ONB | SuperAdmin + Owner onboarding | KOT | Kitchen order tickets |
| ORG | Organization, outlets, outlet availability | KDS | Kitchen display, readiness, kitchen cancellation |
| AUTH | Authentication | HANDOFF | Serve / pickup |
| RBAC | Authorization model, roles | BILL | Bill lifecycle and corrections |
| ACT | Action-inventory rows (part of RBAC) | PAY | Payment information |
| STAFF | Staff, schedule, attendance, availability | CASH | Cash reconciliation |
| MENU | Menu and overrides | DAY | Business day, Day Close, Reopen Day |
| TABLE | Tables, floor, QR | CUSTOMER | Customer records, journey, one-tap reorder |
| FEEDBACK | Feedback | AI | AI capabilities and boundaries |
| ATTENTION | Attention Engine | ANALYTICS | Owner/Manager analytics |
| AUDIT | Audit trail | OFFLINE | Offline / reconnection |
| INTEG | External integration failure | SEC | Security boundaries |
| NG | Non-goals | PC | Product-completion criteria |

### 2.2 Trace chain

```
SPEC requirement   ORD-006
   ↓ traces
PRD requirement    PRD-ORD-006.1          (field: traces: [ORD-006])
   ↓ traces
TRD requirement    TRD-ORD-014            (field: traces: [PRD-ORD-006.1])
   ↓ traces
DB / API / UI      DB-…, API-…, UI-…      (field: traces: [TRD-ORD-014])
   ↓ traces
Implementation     TASK-<module-id>-nn    (field: traces: [API-…, TRD-ORD-014])
   ↓ verifies
Test case          TC-ORD-006-01          (field: verifies: [ORD-006.AC1, TRD-ORD-014])
```

- **SOT-010** Every downstream item MUST carry a `traces:` (or `verifies:` for tests) field naming ≥1 upstream ID. CONFIRMED [UD]
- **SOT-011** Every CONFIRMED SPEC requirement MUST be covered by ≥1 PRD requirement and ≥1 test case; uncovered items are reported as gaps. CONFIRMED [UD]
- **SOT-012** A downstream item with no upstream trace is an orphan and MUST be justified by a new explicit user decision or removed. CONFIRMED [UD]
- **SOT-013** Test cases follow the five H§40 categories: happy path · invalid transition · permission denial · duplicate/retry/idempotency · failure/offline/recovery. CONFIRMED [H§40]

### 2.3 Traceability matrix (template — filled from PRD onwards)

| SPEC ID | PRD ID(s) | TRD ID(s) | DB/API/UI ID(s) | TASK ID(s) | TC ID(s) | Coverage |
|---|---|---|---|---|---|---|
| ORD-006 | | | | | | gap |

---

## 3. Product Vision, Problem, Goals, Users

**Vision** [H§1, H§3]. SERVENA is an AI-powered restaurant operating system (multi-tenant SaaS). Phase 1 is a production-ready restaurant operating foundation: onboarding, menu, staff, tables, unified ordering, KOT/KDS, billing, payment information, customers, day close, owner dashboard, Attention Engine, audit/security, multi-outlet capability and practical AI.

```
Restaurant Onboarding → Menu → Staff → Tables → Orders → KOT → Kitchen → Bill → Payment Information → Customer → Day Close → Owner Dashboard
QR / Website / WhatsApp → Unified Order Engine → KOT → Kitchen → Bill → Payment Information → Customer
```

**Problem** (derived from H; market narrative deferred — DF-01). Restaurants need one operational truth across channels; traceable kitchen changes; authorized, auditable financial corrections; an accountable day boundary; strict outlet/tenant boundaries; owner insight that surfaces exceptions instead of requiring every report to be read; and fast menu onboarding [H§1, H§28, H§30, H§32].

**Goals**
| ID | Goal | Main requirements |
|---|---|---|
| G1 | One operational order truth | ORD-001…008 |
| G2 | Kitchen clarity | KOT-*, KDS-* |
| G3 | Financial integrity | BILL-*, PAY-*, AUDIT-* |
| G4 | Accountable business day | DAY-*, CASH-* |
| G5 | Least-privilege access | RBAC-*, ACT-* |
| G6 | Fast onboarding | ONB-*, AI-010…016 |
| G7 | Owner insight | ANALYTICS-*, ATTENTION-*, AI-020…029 |
| G8 | Resilience | OFFLINE-*, INTEG-* |
Quantitative targets: DF-01.

**Target users** [H§4, H§6, H§7, H§21]: single- and multi-outlet Indian restaurants (GST, ₹, UPI); restaurant staff (Owner, Manager, Cashier, Waiter, Kitchen Staff); diners (table QR, tableless QR, website, WhatsApp, via staff); SERVENA SuperAdmin.

---

## 4. Roles and Role Boundaries

| ID | Requirement | Source | Status |
|---|---|---|---|
| RBAC-020 | Restaurant roles: Owner, Manager, Cashier, Waiter, Kitchen Staff, Customer. SuperAdmin is a platform role, not a restaurant operational user | H§4, LD | CONFIRMED |
| RBAC-021 | Admin, Supervisor, Support Agent and Delivery are not Phase 1 | H§4, H§39 | CONFIRMED |
| RBAC-022 | Owner: all authorized outlets, cross-outlet visibility | H§4, LD-36 | CONFIRMED |
| RBAC-023 | Manager: assigned outlet(s) + permissions; no HQ view | H§4, LD-35 | CONFIRMED |
| RBAC-024 | Cashier, Waiter: assigned outlet. Kitchen Staff: assigned outlet / station scope | H§4, LD-37 | CONFIRMED |
| RBAC-025 | Customer: own customer journey; sees only own order | H§4, H§37 | CONFIRMED |
| RBAC-026 | Cashier does not automatically gain Owner configuration access | H§22 | CONFIRMED |

## 5. Organization, Outlets and Multi-Outlet Behavior

| ID | Requirement | Source | Status |
|---|---|---|---|
| ORG-001 | Organization/brand is the top-level tenant with ≥1 outlets; single-outlet restaurant = organization with one outlet | H§7 | CONFIRMED |
| ORG-002 | Central configuration and outlet-specific overrides coexist | H§7 | CONFIRMED |
| ORG-003 | Every operational object remains associated with the correct organization and outlet | H§7 | CONFIRMED |
| ORG-004 | Cross-outlet access is permission-controlled | H§7 | CONFIRMED |
| ORG-005 | Exactly one kitchen operational context per outlet | H§44, LD-1 | CONFIRMED |
| ORG-006 | Owner sees all authorized outlets, cross-outlet customer/history and benchmarking | H§7, LD-36 | CONFIRMED |
| ORG-007 | Manager sees only assigned outlet(s), never a general HQ view | H§7, LD-35 | CONFIRMED |
| ORG-008 | Cashier, Waiter, Kitchen Staff operate within one current outlet and can be reassigned | H§7, LD-34, LD-37 | CONFIRMED |
| ORG-009 | Outlet staff see their own outlet history | H§7 | CONFIRMED |
| ORG-010 | After reassignment, past actions stay attributed to the outlet where they occurred | derived from ORG-003, AUDIT-001 | CONFIRMED (approved 2026-10-07) |
| ORG-011 | Business day, Day Close and cash reconciliation are per outlet; each outlet has its own active/closed business-day state | OD-19 | CONFIRMED (OD-19, approved 2026-10-07) |

- ORG-007.AC1: Manager with Outlet A access requests Outlet B data → denied [H§40].
- ORG-008.AC1: Cashier in Outlet A requests Outlet B records → denied [H§40].

### 5.1 Outlet operational availability

| ID | Requirement | Source | Status |
|---|---|---|---|
| ORG-020 | Each outlet has an operational availability state (Open / Closed) | H§29 | CONFIRMED |
| ORG-021 | Outlet Closed → **new customer ordering is unavailable for that outlet** (all customer channels, incl. one-tap reorder) | H§29, H§44, LD-13 | CONFIRMED |
| ORG-022 | Outlet Closed is an availability/control state; not a system start/end timer, not Day Close, no Start Day | H§29, LD-12 | CONFIRMED |
| ORG-023 | Bill generation is not blocked by time of day | H§26 | CONFIRMED |
| ORG-024 | New staff-created orders are blocked while the outlet is Closed | OD-02 | CONFIRMED (OD-02, approved 2026-10-07) |
| ORG-025 | Existing confirmed orders continue through kitchen, handoff and billing, and may be completed, while the outlet is Closed | OD-02 | CONFIRMED (OD-02, approved 2026-10-07) |
| ORG-026 | New items cannot be added to an existing order after the outlet is Closed | OD-02 | CONFIRMED (OD-02, approved 2026-10-07) |
| ORG-027 | Existing bills may be finalized and their payment information recorded while the outlet is Closed | OD-02 | CONFIRMED (OD-02, approved 2026-10-07) |
| ORG-028 | Kitchen continues processing existing confirmed orders while the outlet is Closed | OD-02 | CONFIRMED (OD-02, approved 2026-10-07) |
| ORG-029 | Website shows that the outlet is closed and accepts no new orders | OD-02 | CONFIRMED (OD-02, approved 2026-10-07) |
| ORG-030 | WhatsApp shows that the outlet is closed and accepts no new orders | OD-02 | CONFIRMED (OD-02, approved 2026-10-07) |
| ORG-031 | Owner and Manager may change outlet Open/Closed state | OD-02 | CONFIRMED (OD-02, approved 2026-10-07) |
| ORG-032 | No automatic Open/Closed transition from configured operating hours in Phase 1; Owner and Manager explicitly control the outlet state | OD-43 | CONFIRMED (OD-43; A1, 2026-10-07) |
| ORG-033 | A customer order awaiting acceptance when the outlet closes stays visible as awaiting acceptance; while Closed it cannot be accepted, rejected or become Confirmed; after the outlet reopens it can be accepted or rejected; closing never cancels it automatically | OD-31 | CONFIRMED (OD-31; A1, 2026-10-07) |
| ORG-034 | Outlet Closed blocks new business, not authorized corrections to existing business: reopening an existing finalized bill, permitted corrections, refunds and finalizing the corrected bill remain allowed under normal permission, state, reason and audit rules | OD-42 | CONFIRMED (OD-42; A1, 2026-10-07) |

- ORG-021.AC1: Outlet Closed → table QR, tableless QR, website, WhatsApp and reorder cannot create a new order; customer is told ordering is unavailable.
- ORG-022.AC1: Outlet Closed → business day stays running; Day Close still possible.

## 6. Onboarding

### 6.1 SuperAdmin → Owner [H§5]
```
SuperAdmin → Create Restaurant → Select Single/Multi Outlet → Create/Assign Owner → Basic Configuration → Provision → Onboarding Email → Owner Login → Operational Setup
```

| ID | Requirement | Source | Status |
|---|---|---|---|
| ONB-001 | SuperAdmin creates the restaurant/organization | H§5 | CONFIRMED |
| ONB-002 | SuperAdmin selects single- or multi-outlet structure | H§5 | CONFIRMED |
| ONB-003 | SuperAdmin creates or assigns the Owner | H§5 | CONFIRMED |
| ONB-004 | SuperAdmin enters basic restaurant and outlet data | H§5 | CONFIRMED |
| ONB-005 | SuperAdmin provisions the restaurant | H§5 | CONFIRMED |
| ONB-006 | System sends onboarding email/invitation to Owner | H§5 | CONFIRMED |
| ONB-007 | SuperAdmin can view restaurant operational data | H§5 | CONFIRMED |
| ONB-008 | SuperAdmin can edit restaurant configuration after provisioning | H§5 | CONFIRMED |
| ONB-009 | SuperAdmin can deactivate/suspend a restaurant; this is not Day Close | H§5 | CONFIRMED |
| ONB-010 | SuperAdmin can reset Owner credentials | H§5 | CONFIRMED |
| ONB-011 | Provisioning does not replace Owner operational setup | H§5 | CONFIRMED |
| ONB-012 | No restaurant/Owner self-signup | H§39 | CONFIRMED |
| ONB-013 | Email unavailable → provisioned account remains recoverable; onboarding retry path exists | H§34 | CONFIRMED |
| ONB-014 | Suspension is a platform-level state: new business is blocked (no new order can be created); existing confirmed orders are not silently cancelled and may continue through kitchen, handoff and billing; existing bills may be finalized, paid and corrected under authorization rules; all historical and audit data remain intact; suspension never deletes data | OD-17 | CONFIRMED (OD-17; A1, 2026-10-07) |
| ONB-015 | The Owner may add outlets after provisioning; a Manager cannot create outlets. Adding a second outlet makes a single-outlet organization multi-outlet automatically; the existing outlet is unchanged; Owner organization-level visibility follows the existing Owner rules; the new outlet needs its own operational setup and activation before accepting orders (ONB-030, ONB-032) | OD-16 | CONFIRMED (OD-16; A1, 2026-10-07) |

- ONB-013.AC1: Invite email fails → resend possible; restaurant intact.

### 6.2 Owner operational setup [H§6]

| ID | Requirement | Source | Status |
|---|---|---|---|
| ONB-020 | Configure restaurant identity: name, brand, logo, contact | H§6 | CONFIRMED |
| ONB-021 | Configure address/location and GST/tax information | H§6 | CONFIRMED |
| ONB-022 | Configure restaurant type / cuisine template and operating configuration | H§6 | CONFIRMED |
| ONB-023 | Configure outlet(s) | H§6 | CONFIRMED |
| ONB-024 | Import (AI) or manually create menu; review and approve AI-imported menu | H§6 | CONFIRMED |
| ONB-025 | Configure staff, roles, outlet assignment and permissions | H§6 | CONFIRMED |
| ONB-026 | Configure floor/tables and QR codes | H§6 | CONFIRMED |
| ONB-027 | Configure kitchen stations and routing | H§6 | CONFIRMED |
| ONB-028 | Configure payment information | H§6 | CONFIRMED |
| ONB-029 | Configure ordering channels | H§6 | CONFIRMED |
| ONB-030 | Verify onboarding checklist and activate operations | H§6 | CONFIRMED |
| ONB-031 | Guided onboarding with templates and QR generation | H§6 | CONFIRMED |
| ONB-032 | An outlet cannot accept orders before activation | derived from ONB-030 | CONFIRMED (approved 2026-10-07) |
| ONB-033 | Mandatory checklist contents | — | DEFERRED → DF-10 |

## 7. Authentication

| ID | Requirement | Source | Status |
|---|---|---|---|
| AUTH-001 | Restaurant users log in with email OR phone + password | LD-38 | CONFIRMED |
| AUTH-002 | No 2FA | H§39, LD-38 | CONFIRMED |
| AUTH-003 | Staff credentials and recovery are handled by Owner/Manager | LD-38 | CONFIRMED |
| AUTH-004 | Owner credentials are reset by SuperAdmin | H§5 | CONFIRMED |
| AUTH-005 | No self-service credential recovery | LD-38 ("handled by Owner and Manager") | CONFIRMED |
| AUTH-006 | Inactive staff/users cannot log in or act | H§37 | CONFIRMED |
| AUTH-007 | Credential/security actions are audited | H§30 | CONFIRMED |
| AUTH-008 | Users with access to several outlets choose a working outlet context | — | CONFIRMED (approved 2026-10-07) |
| AUTH-009 | No customer accounts in Phase 1; tableless QR and website orders capture name + phone without mandatory OTP; customers reach their orders through a private, non-guessable order link/token | OD-20 | CONFIRMED (OD-20, approved 2026-10-07) |

- AUTH-006.AC1: Inactive user login → rejected.

## 8. Authorization Model  [H§8, LD-39, LD-40, UD]

### 8.1 Five-factor model

```
ACTUAL ACCESS =  ROLE (default permission profile, customized by Owner)
               + OUTLET ACCESS (outlets the user may act in)
               + PERMISSION (the specific action permission)
               + CURRENT STATE (target object is in a state where the action is valid)
               + APPROVAL REQUIREMENT (any required approval is satisfied)
```

| ID | Requirement | Source | Status |
|---|---|---|---|
| RBAC-001 | Access = Role + Outlet Access + Permission Set | LD-39, H§8 | CONFIRMED |
| RBAC-002 | Authorization additionally evaluates Current State and Approval Requirement (five-factor model above); all five must pass | UD | CONFIRMED |
| RBAC-003 | Every role has a default permission profile | H§8, LD-40 | CONFIRMED |
| RBAC-004 | Owner can customize permissions where supported | H§8, LD-40 | CONFIRMED |
| RBAC-005 | The Owner customizes permissions only within the predefined catalogue (§9): the Owner cannot create new permission types, grant SuperAdmin capabilities, cross organization boundaries, or bypass outlet access, current-state rules or required approvals. Permission changes are audited. A Manager customizes permissions only if the Owner explicitly granted that permission (RBAC-029) | OD-12 | CONFIRMED (OD-12; A1, 2026-10-07) |
| RBAC-006 | Outlet assignment limits data and action scope | H§8 | CONFIRMED |
| RBAC-007 | Backend authorization is authoritative; UI hiding is not a security control | H§8 | CONFIRMED |
| RBAC-008 | A denied action fails safely and leaves no partial mutation | H§8 | CONFIRMED |
| RBAC-009 | Technical design may split permissions into finer atoms but must not grant a role broader authority than the matrix without an explicit product decision | H§36 | CONFIRMED |
| RBAC-010 | Permission changes are audited | H§30 | CONFIRMED |
| RBAC-011 | Permission families: restaurant/outlet configuration · menu management · price/availability override · staff management · schedule/attendance/availability · table operations · order create/edit/cancel/void/hold · KOT/KDS actions · billing/finalization/reprint · discounts/service/packaging adjustments · refund/reopen/cancel · payment information · Day Close/reopen · customer/history access · AI capabilities · audit/reporting | H§8.1 | CONFIRMED |
| RBAC-012 | Default action matrix [LD-MX] (rows marked LD-MX in §9) | LD-MX, H§36 | CONFIRMED |
| RBAC-013 | The default permission catalogue is the action inventory in §9 as set by OD-08 and OD-45 (2026-10-07); cells still `?` are resolved through OD-45.1 | OD-08 | CONFIRMED (OD-08) |
| RBAC-014 | Approval factor: Owner approval of AI-imported menu before it goes live is the only source-defined approval. No general second-person approval in Phase 1; sensitive actions are controlled by role, permission, state, reason and audit; dual approval is added to an action only by a later explicit decision | H§33.1; OD-28 | CONFIRMED (H§33.1; OD-28 approved 2026-10-07) |
| RBAC-015 | Current-state preconditions per action are those listed in §9; undefined preconditions are resolved through the referenced ODs | UD | CONFIRMED |
| RBAC-016 | A denial tells the user which factor failed (permission / outlet / state / approval) without leaking other-outlet data | — | CONFIRMED (approved 2026-10-07) |
| RBAC-017 | Missing permissions are never inferred from job titles beyond the explicit assignments in §9 | OD-08 | CONFIRMED (OD-08) |
| RBAC-018 | The §9 matrix is a permission catalogue only; actual authorization is Role + Outlet Access + Permission + Current State + Approval Requirement (RBAC-002) | OD-08 | CONFIRMED (OD-08) |
| RBAC-019 | Every permission cell is decided: an action not explicitly granted to a role is denied, and §9 contains no undecided cells. Customers act only on their own orders; SuperAdmin is outside the restaurant catalogue | OD-45.1 | CONFIRMED (OD-45.1; A1, 2026-10-07) |
| RBAC-027 | Viewing an object is implied by holding any action permission on that object | OD-45.2 | CONFIRMED (OD-45.2) |
| RBAC-028 | "Manage tables" covers operational table actions: open, transfer, merge, split, move items, clear, reserve (Owner, Manager; Waiter also opens tables per H§17) | OD-45.3 | CONFIRMED (OD-45.3) |
| RBAC-029 | Managers do not by default manage Manager accounts or customize permissions; the Owner may grant this through permission customization | OD-45.4 | CONFIRMED (OD-45.4) |
| RBAC-030 | Permission cells not covered by an explicit assignment are decided cell by cell; no blanket default | OD-45.1 | CONFIRMED (OD-45.1) |

- RBAC-012.AC1: Each LD-MX cell is enforced server-side for default-permission users; NO → denial, no state change.
- RBAC-007.AC1: Direct API call for a UI-hidden action by an unauthorized user → denied.
- RBAC-010.AC1: Owner revokes a Cashier's Refund → Cashier refund denied; change audited.

## 9. Action Inventory  [RBAC-012, RBAC-013, OD-08]

**Cell legend.** `Y` / `N` = allowed / not allowed, **CONFIRMED** (source cited: H, LD, LD-MX, or your explicit decisions OD-01…OD-45) ·
Any action not explicitly granted to a role is denied — no undecided cells remain (RBAC-019, RBAC-030) · `—` = not applicable · `sys` = performed by the system.
**Approval column.** `Owner approval` = source-defined (H§33.1) · `None` = no second-person approval (OD-28); still controlled by role, permission, state, reason and audit · `—` = not a sensitive action.
**Outlet Access** applies to every row: Owner = authorized outlets; Manager = assigned outlets; Cashier/Waiter/Kitchen = current outlet; Customer = the outlet of the QR/channel/link.
The matrix is a permission catalogue; actual authorization is the five-factor model (RBAC-002, RBAC-018).

### 9.1 Ordering, acceptance, modification
| ID | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| ACT-ORD-01 | Create dine-in (table) order | Y | Y | Y | Y | N | Y (table QR) | Outlet Open: customers ORG-021, staff ORG-024; if the table session already has an active order, items are added to it (TABLE-015) | — | OD-08 ("create staff order"), H§15 |
| ACT-ORD-02 | Create takeaway order | Y | Y | Y | Y | N | Y (tableless QR, website, WhatsApp) | Outlet Open (as above) | — | OD-08, LD-18, H§12 |
| ACT-ORD-03 | Capture customer name/phone | Y | Y | Y | Y | N | Y | Part of Create staff order / Edit order; mandatory for tableless QR (ORD-030) and website (ORD-042) | — | OD-08, H§16 |
| ACT-ORD-04 | View the outlet's active orders | Y | Y | Y | Y | Y | — | View implied by holding an order action (RBAC-027) | — | OD-45.2 |
| ACT-ACC-01 | Accept a customer-originated order | Y | Y | Y | Y | N | — | Order awaiting acceptance (ORD-008); outlet Open — while Closed it stays pending (ORG-033) | — | OD-08, OD-31 |
| ACT-ACC-02 | Reject a customer-originated order | Y | Y | Y | Y | N | — | Order awaiting acceptance; outlet Open (ORG-033); reason required | None | OD-08, OD-31 |
| ACT-MOD-01 | Add items to an existing order | Y | Y | Y | Y | N | Y (table QR, via acceptance ORD-008) | Bill not Finalized (BILL-004); outlet Open (ORG-026); added to the table's active order (TABLE-015) | — | OD-08, OD-35 |
| ACT-MOD-02 | Edit quantity / modifiers / notes ("Edit order") | Y | Y | Y | Y | N | N | Bill not Finalized; after KOT see ORD-086 | — | OD-08, H§17, OD-45.1 |
| ACT-MOD-03 | Hold item | Y | Y | N | N | N | — | Item not yet terminal; pauses progress without erasing history (ORD-073) | None | OD-15, OD-45.1 |
| ACT-MOD-04 | Void item | Y | Y | N | N | N | — | Reason required; once in kitchen processing follows cancellation state-safety (ORD-073, ORD-082, ORD-088) | None | OD-15, OD-45.1 |
| ACT-MOD-05 | Move items between tables | Y | Y | N | N | — | — | Creates auditable event; history and order/bill ownership preserved (TABLE-016, TABLE-017, TABLE-018) | — | OD-35, OD-45.3 ("Manage tables"), OD-46 |
| ACT-MOD-06 | Hold order | Y | Y | Y | Y | N | — | Entire order intentionally paused (ORD-073) | None | OD-08, OD-15 |
| ACT-MOD-07 | Void order | Y | Y | Y | N | N | — | Reason required; cancellation state-safety once in kitchen processing (ORD-073) | None | OD-08, OD-15 |

### 9.2 KOT, kitchen, handoff, cancellation
| ID | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| ACT-KOT-01 | Generate initial KOT | sys | sys | sys | sys | sys | — | Order Confirmed | — | H§13, H§15 |
| ACT-KOT-02 | Generate additional KOT | sys | sys | sys | sys | sys | — | Item added after initial KOT | — | H§14.1 |
| ACT-KOT-03 | Generate cancellation KOT/update | sys | sys | sys | sys | sys | — | Sent item cancelled (ORD-082) | — | H§14.2, OD-34 |
| ACT-KOT-04 | Re-fire item | Y | Y | N | N | Y | — | Existing preparation unusable or another preparation needed; original history kept (ORD-073) | None | OD-08, H§18, OD-15 |
| ACT-KDS-01 | Mark item/order Preparing | N | N | N | N | Y | — | Item New | — | OD-08 |
| ACT-KDS-02 | Mark item/order Ready | Y | Y | N | N | Y | — | Item not yet Ready | — | OD-08, H§36, LD-2 |
| ACT-KDS-03 | Escalate priority to HIGH/URGENT | N | Y | N | N | Y | — | Item not completed | — | H§18, OD-45.1 |
| ACT-KDS-04 | View the kitchen queue (KDS) | Y | Y | N | N | Y | — | — | — | OD-08 |
| ACT-HND-01 | Mark item/order Served | N | N | N | Y | N | — | Ready; table associated | — | H§19, OD-45.1 |
| ACT-HND-02 | Mark takeaway Picked Up | N | N | Y | Y | N | N | Ready; no table | — | H§19, OD-45.1, 2026-10-07 |
| ACT-CAN-01 | Cancel item | Y | Y | Y | Y | Y | N | By state (ORD-082): Pending → direct; Sent → cancellation KOT/event; Preparing/Ready → non-kitchen via request (ACT-CAN-06), Kitchen directly (ACT-CAN-04); Served/Picked Up → not allowed, use correction/refund. Reason: ORD-088 (Preparing/Ready), ORD-089 (others) | None | LD-MX, OD-08, OD-34 |
| ACT-CAN-02 | Cancel whole order | Y | Y | Y | Y | Y | N | Same per-item state rules; reason required (H§14.3) | None | OD-08, LD-3 |
| ACT-CAN-03 | Customer cancels own order before acceptance | — | — | — | — | — | N | Awaiting acceptance | — | not granted (OD-45.1) |
| ACT-CAN-04 | Kitchen operational cancellation of item(s) | N | N | N | N | Y | — | Unavailability or other valid operational reason; reason required; no request needed | None | OD-08 ("cancel kitchen item"), LD-3, OD-34 |
| ACT-CAN-05 | Kitchen operational cancellation of whole order | N | N | N | N | Y | — | As ACT-CAN-04 | None | OD-08, LD-3, LD-21 |
| ACT-CAN-06 | Request cancellation of a Preparing/Ready item | Y | Y | Y | Y | — | — | Item Preparing or Ready; reason required | None | OD-34 (non-kitchen holders of Cancel item) |
| ACT-CAN-07 | Acknowledge (accept or decline) a cancellation request | N | N | N | N | Y | — | Request open; accept → item Cancelled; decline → item stays active; if the item reaches Served/Picked Up first the request becomes a no-op (ORD-093) | — | OD-34, OD-44, OD-45.1 |

### 9.3 Bill and payment information
| ID | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| ACT-BIL-09 | Create bill | Y | Y | Y | Y | N | — | One bill per order (BILL-015) | — | OD-08 |
| ACT-BIL-01 | Open/review active bill ("View bill") | Y | Y | Y | Y | N | Y (own order, via private link) | — | — | OD-08, H§22, CUSTOMER-001 |
| ACT-BIL-02 | Apply discount | Y | Y | Y | N | N | — | Bill not Finalized | None | OD-45.1, 2026-10-07 |
| ACT-BIL-03 | Apply/adjust service or packaging charge | Y | Y | Y | N | N | — | Bill not Finalized | None | OD-45.1, 2026-10-07 |
| ACT-BIL-04 | Finalize bill | Y | Y | Y | Y | N | — | Bill Draft or Reopened; allowed while outlet Closed (ORG-027) | — | OD-08, H§22 |
| ACT-BIL-05 | Reopen bill | Y | Y | Y | Y | N | — | Bill Finalized (paid or not); allowed while outlet Closed (ORG-034); Draft bills are corrected without Reopen (PAY-012) | None | LD-MX, OD-08, OD-42 |
| ACT-BIL-06 | Cancel bill | Y | Y | Y | N | N | — | — | None | OD-08 |
| ACT-BIL-07 | Refund (partial/full) | Y | Y | Y | N | N | — | Payment recorded; allowed while outlet Closed (ORG-034) | None | LD-MX, OD-08, OD-42 |
| ACT-BIL-08 | Print / provide digital bill / reprint | N | N | Y | N | N | N | Reprint never mutates data (BILL-009) | — | H§22, OD-45.1 |
| ACT-PAY-01 | Record payment information | Y | Y | Y | N | N | — | Independent of finalization; Draft bills may receive payments (PAY-010, PAY-012); allowed while Closed (ORG-027) | — | OD-08, H§22 |
| ACT-PAY-02 | Correct payment information | Y | Y | Y | N | N | — | — | None | OD-45.1, 2026-10-07 |

### 9.4 Tables, menu, configuration
| ID | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| ACT-TBL-01 | Open table (starts the table session) | Y | Y | N | Y | — | — | Table Available; one active session per table (TABLE-014) | — | H§17, OD-45.3 |
| ACT-TBL-02 | ~~Transfer / merge / split tables~~ — **WITHDRAWN in v0.4**, split into ACT-TBL-06 and ACT-TBL-07 | | | | | | | | | |
| ACT-TBL-03 | Clear table / set Cleaning / Available | Y | Y | N | N | — | — | Transition table DF-03 | — | OD-45.3 |
| ACT-TBL-04 | Set table Reserved | Y | Y | N | N | — | — | — | — | H§11, OD-45.3 |
| ACT-TBL-05 | Configure floor, tables, QR ("Manage tables", "Manage QR") | Y | Y | N | N | N | — | — | — | OD-08, H§6 |
| ACT-TBL-06 | Transfer table | Y | Y | N | N | — | — | Auditable event; history preserved (TABLE-016, TABLE-017) | — | OD-35, OD-45.3 |
| ACT-TBL-07 | Merge / split tables | Y | Y | N | N | — | — | Auditable event; history preserved; order/bill ownership unchanged (TABLE-018) | — | OD-35, OD-45.3, OD-46 |
| ACT-MNU-01 | Edit menu | Y | Y | N | N | N | — | — | — | LD-MX, OD-08 |
| ACT-MNU-02 | Change price | Y | Y | N | N | N | — | — | None | LD-MX, OD-08 |
| ACT-MNU-03 | Change availability / outlet menu override | Y | Y | N | N | N | — | Temporary (current business day, ends at Day Close) or permanent until changed (MENU-011) | — | OD-08, H§7, OD-25 |
| ACT-CFG-01 | Restaurant / outlet configuration | Y | N | N | N | N | — | — | — | H§6, H§22, OD-45.1 |

### 9.5 Staff, attendance, availability
| ID | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| ACT-STF-01 | Create / edit / deactivate staff | Y | Y | N | N | N | — | Within actor's outlet access; Manager over Manager accounts → ACT-STF-02 | None | OD-08 |
| ACT-STF-02 | Manage Manager accounts | Y | N (Owner may grant via customization) | N | N | N | — | — | None | H§6, OD-45.4 |
| ACT-STF-03 | Reset staff credentials | Y | Y (not for Manager accounts unless granted) | N | N | N | — | — | None | LD-38, OD-45.4 |
| ACT-STF-04 | Assign / reassign staff outlet | Y | Y (within authorized scope) | N | N | N | — | Manager: source and target outlets within scope | None | OD-08, LD-34 |
| ACT-STF-05 | Customize permissions | Y | N (Owner may grant via customization) | N | N | N | — | Within the catalogue only (RBAC-005) | None | LD-40, OD-45.4, OD-12 |
| ACT-STF-06 | View staff list and status | Y | Y | N (own record only) | N (own record only) | N (own record only) | — | View implied by staff actions (RBAC-027) | — | OD-45.2 |
| ACT-ATT-01 | Record attendance | Y | Y | N | N | N | — | — | — | OD-08 |
| ACT-ATT-02 | Manage schedule | Y | Y | N | N | N | — | — | — | OD-08 |
| ACT-ATT-03 | View own attendance | — | Y | Y | Y | Y | — | Own record only | — | OD-08 |
| ACT-ATT-04 | View staff attendance | Y | Y | N | N | N | — | Within outlet access | — | OD-08 |
| ACT-AVL-01 | Change own availability | Y | Y | Y | Y | Y | — | Absent + Available invalid (STAFF-007) | — | LD-32, OD-08 |
| ACT-AVL-02 | Change another staff member's availability | Y | Y (own outlets) | N | N | N | — | Same | — | LD-32, OD-08 |

### 9.6 Day close, cash, outlet availability
| ID | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| ACT-DAY-01 | Review running-day totals before close | Y | Y | Y | N | N | — | Day running | — | H§26, OD-08, OD-45.1 |
| ACT-DAY-02 | Day Close | Y | Y | Y | N | N | — | Day running; unresolved items → warnings + explicit confirmation (DAY-012) | None | LD-8, LD-MX, OD-08 |
| ACT-DAY-03 | Reopen Day | Y | Y | Y | N | N | — | Most recently closed day only (DAY-015); **blocked if the running day has any transaction (DAY-021, DAY-025)** | None | LD-11, LD-MX, OD-08, OD-32, OD-47 |
| ACT-CSH-01 | Enter counted cash at close ("Cash reconciliation") | Y | Y | Y | N | N | — | Part of Day Close | — | OD-08, H§26 |
| ACT-CSH-02 | View expected cash / variance ("View cash reconciliation") | Y | Y | Y | N | N | — | — | — | OD-08 |
| ACT-AVA-01 | Change outlet Open/Closed | Y | Y | N | N | N | — | Manual only; no automatic transition (ORG-032) | — | OD-02, OD-43 |

### 9.7 Analytics, AI, customer, feedback
| ID | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| ACT-ANL-01 | View outlet dashboard | Y | Y (own outlets) | N | N | N | — | — | — | H§7, H§31, OD-45.1 |
| ACT-ANL-02 | View cross-outlet comparison | Y | N | N | N | N | — | — | — | LD-35, LD-36, LD-37 |
| ACT-ANL-03 | View unresolved bills | Y | Y | Y | Y | N | — | Cashier/Waiter: view implied by bill actions (RBAC-027) | — | LD-4, OD-45.2, OD-45.1 |
| ACT-ANL-04 | Review / act / dismiss / resolve Attention item | Y | Y (own outlets) | N | N | N | — | Item open | — | H§32, OD-18 |
| ACT-ANL-05 | View audit trail | N | N | N | N | N | — | **SuperAdmin only** (platform role, not a restaurant column) | — | OD-45.1, 2026-10-07 |
| ACT-AI-01 | Upload menu source for AI import | Y | N | N | N | N | — | — | — | H§6, LD-MX, OD-45.1 |
| ACT-AI-07 | Edit AI-imported draft before approval | Y | N | N | N | N | — | Draft not yet approved | — | H§10, LD-MX, OD-45.1 |
| ACT-AI-02 | Approve AI-imported menu for publishing | Y | N | N | N | N | — | Draft reviewed | **Owner approval** | H§33.1, OD-45.1 |
| ACT-AI-03 | Use Owner Agent (answer, analyze, recommend) | Y | N | N | N | N | — | Authorized data only (AI-020…024) | — | H§33, OD-10, OD-45.1 |
| ACT-AI-08 | Owner Agent executes a permitted action | Y | N | N | N | N | — | Explicitly permitted action through a controlled tool; the action's own permission, state and audit rules apply (AI-029) | Owner confirmation for sensitive actions (AI-029) | OD-10, OD-37 |
| ACT-AI-04 | Receive / view Daily AI Brief | Y | Y (own outlets) | N | N | N | — | Outlet business day (AI-026) | — | H§33, OD-18 |
| ACT-AI-05 | Use What Changed? | Y | Y (own outlets) | N | N | N | — | Most recent comparable completed business day; unavailable if none (AI-028) | — | H§33, OD-18, OD-29 |
| ACT-AI-06 | Order via WhatsApp Ordering Agent | — | — | — | — | — | Y | Outlet Open; acceptance (ORD-008) | — | H§33, OD-01 |
| ACT-CUS-01 | View customer history | Y (all outlets) | Y (own outlets) | Y (own outlet) | Y (own outlet) | Y (own outlet) | — | Outlet-scoped (CUSTOMER-004); organization-scope phone matching never widens visibility (CUSTOMER-021) | — | H§7, CUSTOMER-004, OD-38 |
| ACT-CUS-02 | Track own order | — | — | — | — | — | Y | Via private non-guessable link (AUTH-009) | — | H§23, H§37, OD-20 |
| ACT-CUS-03 | One-tap reorder | — | — | — | — | — | Y | Via private link (CUSTOMER-016); Completed order with reorderable items (CUSTOMER-020); outlet Open | — | H§25, OD-09, OD-36 |
| ACT-FB-01 | Submit feedback | — | — | — | — | — | Y | Order Completed (ORD-063); customer order with an order-access link | — | H§24, PQ-08 (A1) |
| ACT-FB-02 | View feedback | Y | Y (own outlets) | N | N | N | — | — | — | H§24, OD-45.1 |

## 10. Staff Management

| ID | Requirement | Source | Status |
|---|---|---|---|
| STAFF-001 | Schedule, attendance and availability are separate dimensions | H§9, LD-31 | CONFIRMED |
| STAFF-002 | Schedule = planned working period (e.g., 10:00–19:00) | H§9 | CONFIRMED |
| STAFF-003 | Attendance = Present / Absent | H§9 | CONFIRMED |
| STAFF-004 | Availability = Available / On Break / Unavailable | H§9 | CONFIRMED |
| STAFF-005 | Availability can be changed by Owner, Manager and the staff member themselves | H§9, LD-32 | CONFIRMED |
| STAFF-006 | On Break = currently unavailable for operational assignment (all staff) | LD-33 | CONFIRMED |
| STAFF-007 | Invalid combinations (e.g., Absent + Available) are prevented or explicitly handled by state rules, not UI | H§9 | CONFIRMED |
| STAFF-008 | Handling of Absent + Available: setting Absent forces Unavailable | — | CONFIRMED (approved 2026-10-07) |
| STAFF-009 | Staff status is not payroll/overtime data; no payroll | H§9 | CONFIRMED |
| STAFF-010 | Outlet staff can be moved/reassigned to another outlet via staff management | LD-34 | CONFIRMED |
| STAFF-011 | Staff outlet reassignment is audited | H§30 | CONFIRMED |
| STAFF-012 | Manager staff management is limited to their authorized outlets | H§7, H§8 | CONFIRMED |
| STAFF-013 | Setting a staff member On Break or Unavailable prevents new assignments, never silently cancels current work and keeps existing work attributed to them; authorized users may explicitly reassign work only through existing staff, table and order operations; no implicit reassignment and no separate work-assignment subsystem | OD-26 | CONFIRMED (OD-26; A1, 2026-10-07) |

- STAFF-007.AC1: Absent + Available is never stored.
- STAFF-005.AC1: Waiter changing another staff member's availability → denied.

## 11. Menu

| ID | Requirement | Source | Status |
|---|---|---|---|
| MENU-001 | Categories and subcategories | H§10 | CONFIRMED |
| MENU-002 | Item: description, image, price, tax, veg/non-veg | H§10 | CONFIRMED |
| MENU-003 | Variants / portion sizes | H§10 | CONFIRMED |
| MENU-004 | Add-on / modifier groups: spice, preparation, dietary, add-on, packaging, free-form customer notes | H§10 | CONFIRMED |
| MENU-005 | Kitchen station mapping | H§10 | CONFIRMED |
| MENU-006 | Preparation time | H§10 | CONFIRMED |
| MENU-007 | Order-type availability | H§10 | CONFIRMED |
| MENU-008 | Publish/activate approved menu data | H§10 | CONFIRMED |
| MENU-009 | Outlet-specific price and availability overrides | H§7, H§10 | CONFIRMED |
| MENU-010 | Overrides by Owner and authorized Manager | H§7 | CONFIRMED |
| MENU-011 | A menu-item availability override for the authorized outlet is either temporary for the outlet's current business day — it stops applying at Day Close, never at midnight (DAY-017) — or permanent until explicitly changed (menu-item availability only, not staff availability) | H§7, OD-25 | CONFIRMED (amended A1, 2026-10-07) |
| MENU-012 | Edit menu / change price: Owner, Manager only | LD-MX | CONFIRMED |
| MENU-013 | Menu price and availability changes are audited | H§30 | CONFIRMED |
| MENU-014 | An item may be unavailable at one outlet and available at another | H§10 | CONFIRMED |
| MENU-015 | Item sold out after it was added to a cart is not ordered silently; customer is told | — | CONFIRMED (approved 2026-10-07) |
| MENU-016 | A modifier becoming unavailable after order creation does not alter that order | — | CONFIRMED (approved 2026-10-07) |
| MENU-017 | When an item is added to an order, the order line captures its commercial values — item price and applicable tax information; later menu price or tax configuration changes never change that order line | OD-22 | CONFIRMED (OD-22; A1, 2026-10-07) |

- MENU-009.AC1: Central ₹200, Outlet A override ₹220 → Outlet A ₹220, others ₹200.
- MENU-012.AC1: Cashier price change → denied.

## 12. Tables, Floor and QR

| ID | Requirement | Source | Status |
|---|---|---|---|
| TABLE-001 | Table states: Available, Occupied, Billing, Cleaning, Reserved | H§11 | CONFIRMED |
| TABLE-002 | Typical flow Available → Occupied → Billing → Cleared → Available | H§11 | CONFIRMED |
| TABLE-003 | No customer reservation-booking workflow | H§11 | CONFIRMED |
| TABLE-004 | Operations: open, add items, transfer, merge, split, move items, reopen bill, clear | H§11, OD-35 | CONFIRMED |
| TABLE-005 | Table QR identifies outlet and table | H§15 | CONFIRMED |
| TABLE-006 | A tableless QR contains no table information | LD-14 | CONFIRMED |
| TABLE-007 | An abandoned Draft never permanently occupies a table; releasing its occupancy claim does not delete the Draft (ORD-064) | H§28.1, OD-14 | CONFIRMED (amended A1, 2026-10-07) |
| TABLE-008 | Two staff modifying the same table/order: no lost update; second writer informed | — | CONFIRMED (approved 2026-10-07; mechanism DF-11) |
| TABLE-009 | Table transfer during active KOT preserves KOT history and kitchen sees new table | — | CONFIRMED (approved 2026-10-07) |
| TABLE-010 | Items can be added to a table in Billing only while its bill is not Finalized | H§20.2 | CONFIRMED |
| TABLE-011 | A table's last bill stays reachable after it is paid | — | CONFIRMED (approved 2026-10-07) |
| TABLE-012 | Transfer, merge, split and move-items remain in Phase 1 | H§11, OD-35 | CONFIRMED (OD-35) |
| TABLE-013 | Full table transition/actor matrix | — | DEFERRED → DF-03 |
| TABLE-014 | One active table session per table | OD-35 | CONFIRMED (OD-35) |
| TABLE-015 | One active order context per table session (= ORD-091) | OD-35 | CONFIRMED (OD-35) |
| TABLE-016 | Move, merge and split operations create auditable operational events | OD-35 | CONFIRMED (OD-35) |
| TABLE-017 | Historical table/order records are never rewritten to erase history; an operation may change the current association without destroying historical associations | OD-35 | CONFIRMED (OD-35) |
| TABLE-018 | The order is the billing ownership boundary: a bill belongs to its order. Transfer, merge, split and move-items change the current table association while preserving order/bill identity and historical origin (including where moved items were ordered); merge/split are auditable events; a finalized bill is never silently reassigned; historical bill ownership is immutable; a restructuring that needs a billing change uses the authorized correction/Reopen workflow; no silent duplicate bills | OD-46 | CONFIRMED (OD-46; A1, 2026-10-07) |

## 13. Unified Order Engine and Ordering Channels

### 13.1 Engine
| ID | Requirement | Source | Status |
|---|---|---|---|
| ORD-001 | All channels enter one internal order model | H§12 | CONFIRMED |
| ORD-002 | Channels: waiter, table QR, takeaway/walk-in, tableless QR, direct website, WhatsApp | H§12, LD-14 | CONFIRMED |
| ORD-003 | Order retains organization, outlet, source, table (if any), customer (if known), staff (if any), items, KOT history, bill association, payment information, audit history | H§12 | CONFIRMED |
| ORD-004 | Any order without an associated table is Takeaway, whatever its source | H§44, LD-17 | CONFIRMED |
| ORD-005 | Takeaway can originate from customer, Waiter or other authorized staff | LD-18 | CONFIRMED |
| ORD-006 | Submission is idempotent: one logical submission = one order; retry returns existing result; no duplicate KOT | H§15, H§28.2 | CONFIRMED |
| ORD-007 | Order stays bound to the correct organization, outlet and table context | H§15 | CONFIRMED |
| ORD-008 | Customer-originated orders (table QR, tableless QR, website, WhatsApp) require staff acceptance; staff-created orders do not; Owner, Manager, Cashier and Waiter may accept or reject; Kitchen does not; rejection requires a reason | OD-01 | CONFIRMED (OD-01, approved 2026-10-07) |

- ORD-006.AC1: Same submission retried with the same idempotency context → one order [H§40].
- ORD-004.AC1: Every no-table order shows Takeaway on staff screens, KOT, KDS and bill.

### 13.2 Table QR [H§15]
```
Scan → outlet + table → menu → order → submit → staff receives → staff accepts → Confirmed → KOT sent
→ kitchen prepares → Ready → waiter serves / handoff → bill finalized → payment info recorded → Completed → feedback
```
| ID | Requirement | Source | Status |
|---|---|---|---|
| ORD-020 | Table QR flow as above, including staff acceptance before Confirmed | H§15 | CONFIRMED |
| ORD-021 | Name/phone not required unless the selected flow requests customer details | H§16 | CONFIRMED |
| ORD-022 | Customer can track order status | H§4, H§23, H§25 | CONFIRMED |

### 13.3 Tableless QR
| ID | Requirement | Source | Status |
|---|---|---|---|
| ORD-030 | Customer MUST provide name and phone before placing the order | LD-15, H§16 | CONFIRMED |
| ORD-031 | No OTP / mandatory verification | LD-16, H§16 | CONFIRMED |
| ORD-032 | Order is Takeaway | LD-17, H§16 | CONFIRMED |
| ORD-033 | Name and phone are associated with order and customer history | H§16 | CONFIRMED |

- ORD-030.AC1: Submit without name or phone → rejected.
- ORD-031.AC1: Submit with name + phone, no OTP → order created as Takeaway.

### 13.4 Direct website
| ID | Requirement | Source | Status |
|---|---|---|---|
| ORD-040 | Direct website is an ordering channel into the unified engine | H§3, H§12 | CONFIRMED |
| ORD-041 | Website orders have no table → Takeaway | LD-17 | CONFIRMED |
| ORD-042 | Website orders require name + phone, no mandatory OTP, and staff acceptance (ORD-008) | OD-11 | CONFIRMED (OD-11, approved 2026-10-07) |

### 13.5 Waiter ordering [H§17]
```
Availability → Table → Customer details if required → Order → KOT → Kitchen → Ready → Serve → Bill → Payment Information → Completed
```
| ID | Requirement | Source | Status |
|---|---|---|---|
| ORD-050 | Waiter workflow as above | H§17 | CONFIRMED |
| ORD-051 | Waiter may edit the current unpaid/current bill order per permission; this is an explicit permissioned capability, not generic cashier behavior | H§17, H§39 | CONFIRMED |
| ORD-052 | Waiter may add items, trigger required KOT updates, request cancellation subject to kitchen state | H§17 | CONFIRMED |
| ORD-053 | Waiter can cancel an item | LD-20, LD-MX | CONFIRMED |
| ORD-054 | Waiter can create takeaway orders | LD-18 | CONFIRMED |

- ORD-051.AC1: Unpaid current bill; Waiter adds item → item added, additional KOT generated [H§40].

## 14. Order Lifecycle, Item Lifecycle and Modifications

### 14.1 Order lifecycle [H§13]
```
Draft → Confirmed → KOT Sent → Preparing → Ready → Served / Picked Up → Completed
Cancelled = terminal outcome when authorized and applicable
```
| State | Meaning | Typical actor |
|---|---|---|
| Draft | Being assembled; not committed | Customer / waiter |
| Confirmed | Accepted for processing | Staff acceptance where applicable |
| KOT Sent | Kitchen work dispatched | Order/KOT engine |
| Preparing | Kitchen actively preparing | Kitchen |
| Ready | Food ready for service/handoff | Kitchen |
| Served | Waiter has served | Waiter |
| Picked Up | Recipient collected | Handoff flow |
| Completed | Journey completed | System after required completion |
| Cancelled | Cancellation completed | Authorized actor / system |

| ID | Requirement | Source | Status |
|---|---|---|---|
| ORD-060 | Order states and meanings as above | H§13 | CONFIRMED |
| ORD-061 | Valid/invalid transitions and actors are defined for every state; skipping a required state is rejected unless an approved channel rule exists | H§13 | CONFIRMED (table → DF-03) |
| ORD-062 | Customer order awaiting acceptance is shown as a distinct "awaiting acceptance" sub-state of Draft | — | CONFIRMED (approved 2026-10-07) |
| ORD-063 | An order becomes Completed only when every item has a terminal outcome (Served, Picked Up or Cancelled) and customer handoff is complete; bill/payment status never completes an order by itself; any non-terminal item (Pending, Sent, Preparing, Ready) prevents completion. Example: Burger Served + Fries Served + Coke Cancelled = Completed | OD-30 | CONFIRMED (OD-30, approved 2026-10-07) |
| ORD-064 | Abandoned (uncommitted) Draft: no KOT and no sale are created; the Draft remains identifiable as Draft in history. Draft lifetime and table-session occupancy are separate: when a Draft becomes abandoned under the product inactivity policy, its table occupancy/session claim is released without deleting the Draft. Inactivity threshold: DF-13 | H§28.1, OD-14 | CONFIRMED (amended A1, 2026-10-07) |
| ORD-065 | If every item of an order is cancelled before fulfillment, the order outcome is Cancelled (not Completed); if at least one item is fulfilled and the rest are cancelled, the order becomes Completed only under ORD-063 | OD-40 | CONFIRMED (OD-40; A1, 2026-10-07) |

- ORD-061.AC1: Draft → Ready → rejected, no change.

### 14.2 Item lifecycle
| ID | Requirement | Source | Status |
|---|---|---|---|
| ORD-070 | Item-level state, KOT state, cancellation cutoff and void/hold/re-fire are defined before implementation | H§35 | CONFIRMED |
| ORD-071 | Item states: Pending → Sent → Preparing → Ready → Served / Picked Up; Cancelled | OD-34 (uses exactly these states) | CONFIRMED (OD-34) |
| ORD-072 | Partial readiness is recorded at item level | H§18.1 | CONFIRMED |
| ORD-073 | Hold temporarily pauses an item (primarily) or an entire, intentionally paused order from progressing and never erases history. Void is an authorized operational invalidation of an item/order: the record is preserved (no physical deletion), a reason is required, and once the item has entered kitchen processing it follows cancellation state-safety rules (ORD-082, ORD-088) without bypassing cancellation, KOT or audit behavior. Re-fire requests another preparation of an item whose existing preparation is operationally unusable or insufficient, preserves original history and generates the additional kitchen work. All three are audited | OD-15 | CONFIRMED (OD-15; A1, 2026-10-07) |

### 14.3 Modifications and cancellation
| ID | Requirement | Source | Status |
|---|---|---|---|
| ORD-080 | Add item after initial KOT: same order; original order/KOT history preserved; additional KOT; kitchen receives; bill reflects | H§14.1 | CONFIRMED |
| ORD-081 | Cancel KOT'd item: request → kitchen-state check → if operationally cancellable, cancellation KOT/update → kitchen handles → order/bill reflect result | H§14.2 | CONFIRMED |
| ORD-082 | Cancellation by item state: Pending → direct cancellation; Sent/KOT → cancellation produces a cancellation event/KOT and preserves audit history; Preparing or Ready → a non-kitchen cancellation creates a cancellation request (ORD-088); Served/Picked Up → normal cancellation not allowed, use correction/refund workflow. Kitchen may independently cancel whole or partial orders for operational reasons (KDS-011) | OD-34 (supersedes the state rules of OD-06) | CONFIRMED (OD-34) |
| ORD-083 | Cancellation after KOT creates a cancellation/operational trace; never a silent deletion | LD-22, H§14.2 | CONFIRMED |
| ORD-084 | Supported operations: modify quantity, modify modifiers/add-ons, customer notes, kitchen notes, multiple KOTs, hold, void, cancel, re-fire, cancel order with reason, order source tracking | H§14.3 | CONFIRMED |
| ORD-085 | Cancelling an order requires a reason | H§14.3 | CONFIRMED |
| ORD-086 | A post-KOT quantity/modifier change is represented as cancellation KOT + additional KOT | — | CONFIRMED (approved 2026-10-07) |
| ORD-087 | Cancelled items are reflected in (excluded from) the bill | H§14.2, H§44 | CONFIRMED |
| ORD-088 | Cancellation request: for a Preparing or Ready item, a non-kitchen cancellation creates a request with a mandatory reason; Kitchen must acknowledge it by accepting (item becomes Cancelled) or declining (item stays active) (ORD-093) | OD-34, OD-44 | CONFIRMED (amended A1, 2026-10-07) |
| ORD-089 | Every cancellation (item or order, any actor) requires a reason — supplies the "cancellation policy" OD-34 refers to for Pending/Sent items | OD-06 | CONFIRMED (OD-06, approved 2026-10-07) |
| ORD-090 | No cancellation may silently erase an already-issued KOT | LD-22, OD-34 | CONFIRMED (LD-22, OD-34) |
| ORD-091 | A table session has at most one active order context; additional items are added to the existing active order | OD-35 | CONFIRMED (OD-35) |
| ORD-092 | Every cancellation record preserves actor, reason, timestamp, previous state and resulting state | OD-34 | CONFIRMED (OD-34) |
| ORD-093 | Kitchen acknowledges a Preparing/Ready cancellation request by accepting (item → Cancelled) or declining (item stays active). If the item reaches Served/Picked Up before the request is resolved, that terminal state stands and the request becomes a no-op kept in history/audit. An unresolved request stays visible, never cancels the item automatically, and when stale becomes an Attention item (stale threshold: DF-13) | OD-44 | CONFIRMED (OD-44; A1, 2026-10-07) |

- ORD-080.AC1: Add item after KOT → second KOT with only the new item; first KOT unchanged.

## 15. KOT

| ID | Requirement | Source | Status |
|---|---|---|---|
| KOT-001 | Initial KOT is sent when the order is Confirmed | H§13, H§15 | CONFIRMED |
| KOT-002 | Additional KOT for items added after the initial KOT | H§14.1 | CONFIRMED |
| KOT-003 | Cancellation KOT/update when a sent item is cancelled | H§14.2 | CONFIRMED |
| KOT-004 | KOT shows table/order number, items, modifiers and notes | H§18 | CONFIRMED |
| KOT-005 | KOT identifies Takeaway when no table is associated | LD-19, H§44 | CONFIRMED |
| KOT-006 | Items route to their mapped kitchen station | H§10, H§40 | CONFIRMED |
| KOT-007 | Interrupted KOT submission → safe retry → one logical KOT | H§34 | CONFIRMED |
| KOT-008 | KOT history preserved on the order | H§12, H§14.1 | CONFIRMED |
| KOT-009 | KOTs are received on the KDS | H§18 | CONFIRMED |
| KOT-010 | Thermal KOT printing | — | DEFERRED → DF-05 |

- KOT-006.AC1: Item mapped to Tandoor → KOT routed to Tandoor [H§40].
- KOT-007.AC1: Interrupted send + retry → one KOT.

## 16. Kitchen / KDS and Kitchen Cancellation

| ID | Requirement | Source | Status |
|---|---|---|---|
| KDS-001 | One kitchen operational context per outlet; all Kitchen-permission users share its queue and may update the same orders | H§18, H§44, LD-1 | CONFIRMED |
| KDS-002 | Stations (e.g., Tandoor) exist inside that single kitchen for routing and station work | H§6, H§10, H§40 + H§44 (C-01) | CONFIRMED |
| KDS-003 | KDS flow New → Preparing → Ready | H§18 | CONFIRMED |
| KDS-004 | Order timer | H§18 | CONFIRMED |
| KDS-005 | Priority default NORMAL; authorized Kitchen/Manager escalate to HIGH/URGENT; manual, not AI-driven | H§18 | CONFIRMED |
| KDS-006 | Re-fire | H§18 | CONFIRMED |
| KDS-007 | Delayed-order workflow is removed | H§18, H§39 | CONFIRMED |
| KDS-008 | Any authorized Kitchen user may mark an order/item Ready | LD-2, H§44 | CONFIRMED |
| KDS-009 | Readiness depends on the order's required food, not on which user acted; the order is not shown fully Ready while required food (across stations) is unready | H§18.1, H§44 | CONFIRMED |
| KDS-010 | Owner and Manager may mark Ready in an oversight capacity | H§36 | CONFIRMED |
| KDS-011 | Kitchen may cancel the whole order or part of it for unavailability or another valid operational reason | LD-3, LD-21, H§44 | CONFIRMED |
| KDS-012 | Kitchen cancellation reason is mandatory | LD-3, H§44 | CONFIRMED |
| KDS-013 | Kitchen cancellation updates affected order/bill state; never a silent deletion | H§14.2, H§44 | CONFIRMED |
| KDS-014 | Item and kitchen cancellations are audited | H§30 | CONFIRMED |
| KDS-015 | Format of reason capture (list, free text) | — | DEFERRED → DF-08 |
| KDS-016 | KDS disconnect → reconnect and recover current operational state | H§34 | CONFIRMED |
| KDS-017 | Kitchen acknowledges cancellation requests for Preparing/Ready items (ORD-088) | OD-34 | CONFIRMED (OD-34) |

- KDS-009.AC1: Tandoor item Ready, curry Preparing → order not fully Ready.
- KDS-012.AC1: Kitchen cancel without reason → rejected.
- KDS-016.AC1: Disconnect/reconnect → queue restored, no duplicate cards.

## 17. Food Handoff

| ID | Requirement | Source | Status |
|---|---|---|---|
| HANDOFF-001 | Table associated and waiter assigned/used: READY → waiter collects → Served (waiter confirms) | H§19 | CONFIRMED |
| HANDOFF-002 | No waiter / Takeaway: READY → handoff → Picked Up (customer/recipient pickup) | H§19 | CONFIRMED |
| HANDOFF-003 | Kitchen and customer-facing flows clearly show Takeaway | H§19, H§44 | CONFIRMED |
| HANDOFF-004 | Picked Up is recorded by Waiter or Cashier | OD-45.1 | CONFIRMED (OD-45.1, 2026-10-07) |

## 18. Billing

| ID | Requirement | Source | Status |
|---|---|---|---|
| BILL-001 | Bill finalization and payment status are separate concepts | H§20 | CONFIRMED |
| BILL-002 | Bill workflow distinguishes Draft, Finalized, Paid/Not Paid, Reopened, Cancelled, Refunded | LD-23, H§20 | CONFIRMED |
| BILL-003 | Draft: customer not yet billed and can continue ordering | H§20.1 | CONFIRMED |
| BILL-004 | Finalized: further modification requires the appropriate correction path | H§20.2 | CONFIRMED |
| BILL-005 | Reopen: authorized correction path for a Finalized bill (paid or not) — Reopen → correction → re-finalization. A Draft bill, even with payments recorded, is corrected without Reopen (PAY-012) | H§20.4, OD-39 | CONFIRMED (amended A1, 2026-10-07) |
| BILL-006 | Refund records amount and authorizing user; partial vs full preserved | H§20.5 | CONFIRMED |
| BILL-007 | Cancellation is an authorized correction and not automatically a refund | H§20.6 | CONFIRMED |
| BILL-008 | Capabilities: bill generation, tax, discounts, service charge, packaging charge, round-off, customer details, printable bill, digital bill, reprint, refund, cancellation | H§20 | CONFIRMED |
| BILL-009 | Reprint never silently mutates financial data | H§22 | CONFIRMED |
| BILL-010 | Refund/reopen/cancel are permissioned | H§22 | CONFIRMED |
| BILL-011 | Correction/audit history is preserved | H§22 | CONFIRMED |
| BILL-012 | Refund is recorded information only; no money movement | LD-24, H§21 | CONFIRMED |
| BILL-013 | Discounts, reopen, refund, cancellation, payment corrections are audited | H§30 | CONFIRMED |
| BILL-014 | Reopening a bill requires a reason | — | CONFIRMED (approved 2026-10-07) |
| BILL-015 | One bill per order / customer transaction context: Table → Order → Bill; no table → Takeaway Order → Bill; items may be added to the order until the bill is resolved; split payment is recorded at payment-information level without creating multiple bills | OD-07 | CONFIRMED (OD-07, approved 2026-10-07) |
| BILL-016 | Paid bill: Waiter direct edit denied unless the authorized correction workflow (reopen) is invoked | H§40 | CONFIRMED |
| BILL-017 | Waiter may reopen bills, including paid ones (reopen is that correction workflow) | LD-MX, H§36, H§40 (C-03) | CONFIRMED |

- BILL-004.AC1: Edit Finalized bill without reopen → denied.
- BILL-006.AC1: ₹500 partial refund of ₹2,840 → recorded with amount + user.
- BILL-007.AC1: Cancel bill → no refund created automatically.
- BILL-009.AC1: Reprint → identical financial data.

### 18.1 Cashier workflow [H§22]
Open/review active bill (ACT-BIL-01) → verify items/taxes/discounts/charges → finalize (ACT-BIL-04) → record payment info (ACT-PAY-01) → printable/digital bill (ACT-BIL-08) → authorized reopen/refund/cancel (ACT-BIL-05/06/07) → preserve correction history (BILL-011). Cashier also performs Day Close / Reopen Day (ACT-DAY-02/03).

## 19. Payment Information

| ID | Requirement | Source | Status |
|---|---|---|---|
| PAY-001 | Record Paid or Not Paid | H§21, LD-24 | CONFIRMED |
| PAY-002 | If paid, record payment mode: UPI, Cash, Card, Split | H§21 | CONFIRMED |
| PAY-003 | If the payment flow/provider supplies an online payment reference or transaction ID, it is recorded; it is never fabricated (PAY-011) | H§21, LD-24, OD-24 | CONFIRMED (amended A1, 2026-10-07) |
| PAY-004 | Associate payment with bill, order, outlet | H§21 | CONFIRMED |
| PAY-005 | Preserve split components; available for Day Close reconciliation | H§21 | CONFIRMED |
| PAY-006 | Repeated submissions do not create duplicate payment records | H§21 | CONFIRMED |
| PAY-007 | Payment corrections are audited | H§30 | CONFIRMED |
| PAY-008 | Payment execution / gateway integration not in Phase 1 | LD-24, H§21 | EXCLUDED |
| PAY-009 | Payment belongs to the operational day in which it is recorded | H§27 | CONFIRMED |
| PAY-010 | Payment status is independent of bill finalization; it stays Not Paid until recorded payments cover the bill total, then becomes Paid; each payment record keeps its amount, mode and transaction ID; gateway execution stays deferred | OD-21 | CONFIRMED (OD-21, approved 2026-10-07) |
| PAY-011 | If no provider/payment reference is supplied, the payment may still be recorded without one; SERVENA never fabricates a reference ID | OD-24 | CONFIRMED (OD-24; A1, 2026-10-07) |
| PAY-012 | A Draft bill may have payments recorded and may still receive items before finalization; correcting a Draft does not require Reopen. Existing payment records are never silently deleted or rewritten. When the total changes, existing payments are kept and the outstanding amount and payment status are recalculated against the new total. Overpayment = total recorded payments − current bill total; when greater than zero it is shown explicitly on the bill and stays visible until resolved through an authorized, audited correction/refund. A Finalized/Paid bill is corrected only via Reopen → correction → re-finalization | OD-39 | CONFIRMED (OD-39; A1, 2026-10-07) |
| PAY-013 | Every refund records, where applicable: amount, refund/payment mode, reason, actor, timestamp, and the provider/reference identifier when available (never fabricated) | OD-33 | CONFIRMED (OD-33; A1, 2026-10-07) |

- PAY-005.AC1: ₹2,840 paid ₹1,840 UPI + ₹1,000 cash → both components linked to bill and Day Close totals [H§40].
- PAY-006.AC1: Same payment retried → one record.

## 20. Customer Workflow, Records and One-Tap Reorder

```
Discover Menu → Create Order → Submit → Staff Acceptance where applicable → KOT/Kitchen → Ready
→ Serve/Pickup → Bill → Payment Information → Completed → Feedback → One-Tap Reorder      [H§23]
```
| ID | Requirement | Source | Status |
|---|---|---|---|
| CUSTOMER-001 | Customer journey as above | H§23 | CONFIRMED |
| CUSTOMER-002 | Customer record when captured: name/phone, order history, visit count, total spend, AOV, last order, preferred items, outlet history | H§23 | CONFIRMED |
| CUSTOMER-003 | Customer sees only their own order | H§37 | CONFIRMED |
| CUSTOMER-004 | Outlet staff see own-outlet history; Owner sees cross-outlet customer/history | H§7 | CONFIRMED |
| CUSTOMER-005 | No customer accounts; name + phone for tableless QR and website; no mandatory OTP; order access through a private non-guessable link/token (= AUTH-009) | OD-20 | CONFIRMED (OD-20, approved 2026-10-07) |
| CUSTOMER-006 | Public reviews are Phase 2 | H§23, LD-26 | EXCLUDED |
| CUSTOMER-010 | Only one-tap reorder; no broader recovery/reorder assistant/loyalty | LD-27, H§25 | CONFIRMED |
| CUSTOMER-011 | Requires an eligible prior order | H§25 | CONFIRMED (eligibility → OD-36) |
| CUSTOMER-012 | System validates current item/menu availability and outlet context | H§25 | CONFIRMED |
| CUSTOMER-013 | Reorder creates a new order through the unified engine | H§25 | CONFIRMED |
| CUSTOMER-014 | Unavailable items are not silently substituted or hallucinated | H§25 | CONFIRMED |
| CUSTOMER-015 | Customer sees the resulting order state | H§25 | CONFIRMED |
| CUSTOMER-016 | The customer reaches eligible past orders through a private, non-guessable order-access link; no account required | OD-09 | CONFIRMED (OD-09, approved 2026-10-07) |
| CUSTOMER-017 | Reorder applies current price, tax, availability and menu rules | OD-09 | CONFIRMED (OD-09, approved 2026-10-07; answers OD-23) |
| CUSTOMER-018 | Reorder is unavailable while the outlet is Closed | ORG-021 | CONFIRMED |
| CUSTOMER-019 | Reorder never modifies the historical order | OD-09 | CONFIRMED (OD-09, approved 2026-10-07) |
| CUSTOMER-020 | One-tap reorder is available from the customer's private order-access link for a historical order that reached Completed and contains reorderable items; cancelled/non-fulfillable items are not recreated. Reorder creates a new order submission using current menu, price, applicable tax, availability and outlet state and never mutates the historical order; it is rejected while the outlet is Closed. With a valid active table context it is associated with that table (joining the session's active order if one exists, TABLE-015); otherwise it is Takeaway. No customer account or OTP | OD-36 | CONFIRMED (OD-36; A1, 2026-10-07) |
| CUSTOMER-021 | Phone number is the primary customer matching key at organization scope; order/history visibility stays outlet-scoped according to authorization; customers never get restaurant-wide access; WhatsApp captures the customer's name when available; no mandatory OTP; matching never lets one customer's private order access expose another customer's order | OD-38 | CONFIRMED (OD-38; A1, 2026-10-07) |

- CUSTOMER-014.AC1: Reorder with one unavailable item → item excluded and shown; nothing substituted.

## 21. Feedback

| ID | Requirement | Source | Status |
|---|---|---|---|
| FEEDBACK-001 | Feedback is offered when the order reaches Completed | H§24 | CONFIRMED |
| FEEDBACK-002 | Customer submits rating/comment where supported | H§24 | CONFIRMED |
| FEEDBACK-003 | Feedback is associated with order, outlet and customer context | H§24 | CONFIRMED |
| FEEDBACK-004 | Management uses feedback as operational insight | H§24 | CONFIRMED |
| FEEDBACK-005 | Public review publishing/request workflows are not Phase 1 | H§24, LD-26 | EXCLUDED |
| FEEDBACK-006 | Rating 1–5 + optional comment; one feedback per order | — | CONFIRMED (approved 2026-10-07) |

## 22. Business Day, Day Close and Reopen Day

| ID | Requirement | Source | Status |
|---|---|---|---|
| DAY-001 | Continuous running operational day; no midnight, fixed operating-hours or system start/end boundary | LD-5, H§26 | CONFIRMED |
| DAY-002 | No Start Day action | LD-6, H§26 | CONFIRMED |
| DAY-003 | The boundary is created only when Owner, Manager or Cashier marks the day Closed; the close timestamp is authoritative | LD-7, LD-8, LD-9, H§26 | CONFIRMED |
| DAY-004 | After closure the next operational period becomes the running day automatically | H§26, H§44 | CONFIRMED |
| DAY-005 | A transaction crossing midnight has no special boundary meaning | H§27 | CONFIRMED |
| DAY-006 | New transactions after closure belong to the newly active day | H§27 | CONFIRMED |
| DAY-007 | Day-close information: gross sales, refunds, discounts, net sales, UPI/cash/card sales, expected cash, actual cash, variance, closing user, timestamp, notes | H§26 | CONFIRMED |
| DAY-008 | Expenses excluded | LD-30, H§26 | CONFIRMED |
| DAY-009 | Duplicate Day Close submission is safely rejected or treated as idempotent repeat | H§27 | CONFIRMED |
| DAY-010 | Lost connection during Day Close → final outcome recoverable; no duplicate closure; atomic | H§27, H§34 | CONFIRMED |
| DAY-011 | Unresolved bill at Day Close remains visible as unresolved and is surfaced in Owner/Manager analytics; never silently lost or excluded | H§27, H§44, LD-4 | CONFIRMED |
| DAY-012 | Day Close is allowed with unresolved items; the closing user sees warnings for unresolved operational/financial items (DAY-020) and must explicitly confirm; nothing is silently cancelled or altered | OD-03 | CONFIRMED (OD-03, approved 2026-10-07) |
| DAY-013 | Owner, Manager, Cashier can Reopen Day | LD-11, H§27 | CONFIRMED |
| DAY-014 | Day Close and Day Reopen are audited | H§30 | CONFIRMED |
| DAY-015 | Reopen Day: only the outlet's most recently closed day; reason required; never two simultaneously active business days per outlet; transactions during the reopened period belong to the reopened day; re-close recalculates day totals and cash reconciliation | OD-04 | CONFIRMED (OD-04, approved 2026-10-07) |
| DAY-016 | Business day and Day Close are per outlet (= ORG-011) | OD-19 | CONFIRMED (OD-19, approved 2026-10-07) |
| DAY-017 | Any "day" in the product (analytics "today", Daily AI Brief) means the business day bounded by Day Close | LD-5, LD-9 | CONFIRMED |
| DAY-018 | Reopening a day requires a reason | OD-04 | CONFIRMED (OD-04, approved 2026-10-07) |
| DAY-019 | Transactions retain their originating business-day association | OD-03 | CONFIRMED (OD-03, approved 2026-10-07) |
| DAY-020 | Items warned about before Day Close: orders not Completed or Cancelled; customer orders awaiting acceptance; items Pending, Sent, Preparing or Ready; unresolved bills (ANALYTICS-011) | list drafted per OD-03 | CONFIRMED (derived from OD-03, approved 2026-10-07) |
| DAY-021 | A previously closed day can be reopened only if the outlet's current running day has zero transactions; if it has any transaction, reopening is blocked | OD-32 | CONFIRMED (OD-32) |
| DAY-022 | Day-close sales figures are based on bill finalization; payment status is reported separately: Finalized + Paid contributes finalized sales and paid amount; Finalized + Not Paid contributes finalized sales and remains outstanding; Draft/Reopened bills are not finalized sales. Corrections, refunds and re-finalizations keep both their original business-day attribution and the actual timestamp at which they happened; no further accounting/tax treatment is defined (DF-14) | OD-41 | CONFIRMED (OD-41; A1, 2026-10-07) |
| DAY-023 | Temporal invariant: an outlet's business days are contiguous, non-overlapping periods, each ended by its Day Close timestamp; no operation may create overlapping or non-contiguous business days | OD-32, LD-9 | CONFIRMED (OD-32) |
| DAY-024 | On reopen, the empty running period is absorbed into the reopened day; the re-close timestamp becomes that day's boundary | derived from OD-32, OD-04 | CONFIRMED (derived, approved 2026-10-07) |
| DAY-025 | A transaction for DAY-021 is any persisted business operation that materially changes operational or financial state: order creation/modification/cancellation, item changes, KOT-related business changes, bill creation/finalization/reopen/cancellation, payment recording/correction, refunds, cash reconciliation and relevant table/order operational changes. An order awaiting acceptance counts; an uncommitted customer Draft does not count merely because it exists; opening an empty table alone does not count | OD-47 | CONFIRMED (OD-47; A1, 2026-10-07) |

- DAY-005.AC1: Transactions at 23:50 and 00:20, no close between → same business day.
- DAY-006.AC1: Close at 01:30 → payment at 01:31 belongs to the next day.
- DAY-009.AC1: Double submit → one closed-day record.
- DAY-002.AC1: No Start Day action exists anywhere.

## 23. Cash Reconciliation and Unresolved Bills

| ID | Requirement | Source | Status |
|---|---|---|---|
| CASH-001 | Reconciliation uses the same Day Close boundary; no midnight reset; no Start Day | LD-10, H§26 | CONFIRMED |
| CASH-002 | Expected cash = total cash with the responsible user at the moment the day is closed | H§26 | CONFIRMED (computed per outlet by CASH-005 → C-18) |
| CASH-003 | Actual/counted cash and variance are recorded | H§26 | CONFIRMED |
| CASH-004 | Cash received before/after a prior close belongs to the day in which it was recorded | H§27 | CONFIRMED |
| CASH-005 | Cash reconciliation is per outlet and business day; no opening float in Phase 1; expected cash is derived from cash transactions belonging to that business day; counted cash is recorded; variance is calculated | OD-05 | CONFIRMED (OD-05, approved 2026-10-07) |
| CASH-006 | Cash variance does not block Day Close | OD-05 | CONFIRMED (OD-05, approved 2026-10-07) |
| CASH-007 | Expected cash = cash payments recorded in the business day − cash refunds recorded in it | derived from OD-05 | CONFIRMED (approved 2026-10-07; refund mode depends on OD-33) |
| ANALYTICS-010 | Unresolved bills remain traceable and visible in Owner and Manager analytics; never disappear from reporting | LD-4, H§44 | CONFIRMED |
| ANALYTICS-011 | Unresolved bill = a bill whose status is Draft or Reopened, or Finalized with payment status Not Paid. Resolved = Finalized + Paid, Cancelled, or Refunded | definition drafted per OD-03 | CONFIRMED (derived from OD-03, approved 2026-10-07) |

## 24. Audit Trail

| ID | Requirement | Source | Status |
|---|---|---|---|
| AUDIT-001 | Sensitive actions record who, what, when, outlet, before state, after state, reason where applicable | H§30 | CONFIRMED |
| AUDIT-002 | Events: credential/security actions, permission changes, staff outlet reassignment, menu price/availability changes, discounts, order cancellation/void/hold, item cancellation, re-fire, bill reopen, refund, bill cancellation, payment corrections, Day Close, Day Reopen, AI Menu Import approval, SuperAdmin suspension/deactivation | H§30 | CONFIRMED |
| AUDIT-003 | A sensitive action without its audit event is a defect | H§37 | CONFIRMED |
| AUDIT-004 | AI actions are auditable | H§33.3 | CONFIRMED |
| AUDIT-005 | Audit records are append-only | — | CONFIRMED (approved 2026-10-07) |
| AUDIT-006 | Audit event payload design | — | DEFERRED → DF-03 |
| AUDIT-007 | The audit trail is viewable by SuperAdmin only | OD-45.1 | CONFIRMED (OD-45.1, 2026-10-07) |
| AUDIT-008 | Day lifecycle is audited as Closed → Reopened → Reclosed | OD-04 | CONFIRMED (OD-04, approved 2026-10-07) |

## 25. AI Features and Boundaries

| ID | Requirement | Source | Status |
|---|---|---|---|
| AI-001 | Phase 1 AI: AI Menu Import, Owner Agent, Daily AI Brief, What Changed?, WhatsApp Ordering Agent, One-tap reorder | LD-28, H§33 | CONFIRMED |
| AI-002 | Broader customer-recovery automation is not reintroduced | H§33 | CONFIRMED |
| AI-003 | Core operations work without AI | H§3 | CONFIRMED |
| AI-004 | AI never silently alters operational ground truth | H§3 | CONFIRMED |
| AI-010 | Menu import accepts PDF, images, Excel/CSV | H§6 | CONFIRMED |
| AI-011 | Extracts a structured draft | H§33.1 | CONFIRMED |
| AI-012 | Flags low-confidence fields | H§6, H§33.1 | CONFIRMED |
| AI-013 | Owner reviews and may edit the draft | H§10, H§33.1 | CONFIRMED |
| AI-014 | Owner approves; only approved content becomes live | H§33.1 | CONFIRMED |
| AI-015 | Import approval is audited | H§30 | CONFIRMED |
| AI-016 | Duplicate items in an import are flagged before approval | — | CONFIRMED (approved 2026-10-07) |
| AI-020 | Owner Agent / Daily Brief / What Changed? use authorized restaurant data | H§33.2 | CONFIRMED |
| AI-021 | They separate facts from recommendations | H§33.2 | CONFIRMED |
| AI-022 | They do not invent missing ground truth | H§33.2 | CONFIRMED |
| AI-023 | They do not bypass RBAC | H§33.2 | CONFIRMED |
| AI-024 | They have no unrestricted production database access; controlled tools only | H§33.2, H§33.3 | CONFIRMED |
| AI-025 | Owner Agent may answer, analyze, recommend, and execute explicitly permitted actions through controlled tools; it never bypasses RBAC, approvals, deterministic business rules or audit; never modifies the production database directly; never invents operational facts | OD-10 | CONFIRMED (OD-10, approved 2026-10-07) |
| AI-026 | The Daily AI Brief belongs to the outlet business-day lifecycle and summarizes sales, orders, bills and payment status, operational anomalies, Attention items, meaningful operational changes, useful business-day comparisons and important changes needing Owner/Manager awareness; facts and recommendations are separated and no values are fabricated. Owner views it for authorized outlets; Manager for assigned outlets. Trigger, exact time and delivery mechanism: DF-13 | OD-18 | CONFIRMED (OD-18; A1, 2026-10-07) |
| AI-027 | Daily AI Brief covers a business day bounded by Day Close | DAY-017 | CONFIRMED |
| AI-028 | What Changed? compares the current meaningful business/operational state with the most recent comparable completed business-day baseline available; it highlights meaningful changes in sales, order volume/status, bills/payments, operational anomalies, Attention and meaningful menu/staff/outlet configuration; it is not a raw audit viewer; with no valid baseline it states that comparison is unavailable and never fabricates one; same outlet authorization as AI-026 | OD-29 | CONFIRMED (OD-29; A1, 2026-10-07) |
| AI-029 | Owner Agent is read-only by default and executes only explicitly permitted business actions through controlled business tools. Sensitive actions require explicit Owner confirmation: refunds, payment corrections, permission/RBAC changes, staff credentials/access, outlet Open/Closed state, menu price changes, destructive/corrective operational actions. It never receives unrestricted database access, never bypasses RBAC or business-state rules, never silently mutates operational truth; every executed action is audited; tool implementation: DF-13 | OD-37 | CONFIRMED (OD-37; A1, 2026-10-07) |
| AI-030 | WhatsApp orders enter the unified order engine under the same rules | H§3, H§12 | CONFIRMED |
| AI-031 | WhatsApp orders carry no table and are Takeaway | — | CONFIRMED (approved 2026-10-07) |
| AI-032 | WhatsApp agent offers only published, currently available items; no invented items or prices | H§10, H§25, H§33.2 | CONFIRMED |
| AI-033 | WhatsApp orders require staff acceptance (ORD-008) | OD-01 | CONFIRMED (OD-01, approved 2026-10-07) |
| AI-040 | AI unavailable does not stop ordering, KOT, kitchen, billing or Day Close | H§33.3 | CONFIRMED |
| AI-041 | AI output failure degrades to deterministic product behavior | H§33.3 | CONFIRMED |
| AI-042 | AI actions are permissioned and auditable | H§33.3 | CONFIRMED |
| AI-043 | Deterministic business logic is separate from AI reasoning | H§33.3 | CONFIRMED |
| AI-044 | KDS priority is not AI-driven | H§18 | CONFIRMED |
| AI-045 | When an AI result conflicts with source data, source data prevails | — | CONFIRMED (approved 2026-10-07) |

- AI-014.AC1: Unapproved import cannot become live [H§40].

## 26. Owner / Manager Analytics and Attention Engine

| ID | Requirement | Source | Status |
|---|---|---|---|
| ANALYTICS-001 | Dashboard answers business questions before exposing detailed reports | H§31 | CONFIRMED |
| ANALYTICS-002 | Metrics: today's sales, orders, AOV, payment mix, top items, top categories, order-source mix, peak hours, discounts, cancellations, refunds, open orders, staff activity, payment variance, multi-outlet comparison where applicable | H§31 | CONFIRMED |
| ANALYTICS-003 | Owner: all outlets + cross-outlet comparison | H§7, LD-36 | CONFIRMED |
| ANALYTICS-004 | Manager: assigned outlets only; no HQ aggregate | H§7, LD-35 | CONFIRMED |
| ANALYTICS-005 | "Today" = current business day since last Day Close | DAY-017 | CONFIRMED |
| ANALYTICS-006 | Feedback used as operational insight | H§24 | CONFIRMED |
| ATTENTION-001 | Attention Engine is in Phase 1 | H§1, H§32 | CONFIRMED |
| ATTENTION-002 | Flow: Operational Data → Detect Exception → Validate Evidence → Create Attention → Owner Reviews → Action / Dismiss / Resolve | H§32 | CONFIRMED |
| ATTENTION-003 | Signals: sales below baseline, cash variance, unusual discount usage, unusual cancellation/void activity, kitchen preparation slowdown, customer reorder gap, outlet underperformance | H§32 | CONFIRMED |
| ATTENTION-004 | Surfaces evidence; never accuses an employee or claims a cause the data cannot establish | H§32 | CONFIRMED |
| ATTENTION-005 | Attention is an insight only: no KDS delayed alerts, no automated customer outreach | H§18, H§39, LD-27 (C-04, C-05) | CONFIRMED |
| ATTENTION-006 | Lifecycle states Open → Dismissed / Resolved with actor and time | — | CONFIRMED (approved 2026-10-07) |
| ATTENTION-007 | Detection thresholds and baselines | — | DEFERRED → DF-02 |
| ATTENTION-008 | Attention items follow outlet authorization: the Owner for authorized outlets, a Manager for assigned outlets | OD-18 | CONFIRMED (OD-18; A1, 2026-10-07) |

## 27. Offline, Reconnection and External Integrations

| ID | Requirement | Source | Status |
|---|---|---|---|
| OFFLINE-001 | Network lost while creating an order → pending/error state shown; safe retry; no duplicate order | H§34 | CONFIRMED |
| OFFLINE-002 | Frontend communicates whether submission succeeded, failed or is pending | H§28.3 | CONFIRMED |
| OFFLINE-003 | Retry is safe and idempotent; operational records not partially duplicated | H§28.3 | CONFIRMED |
| OFFLINE-004 | KOT interrupted → one logical KOT (= KOT-007) | H§34 | CONFIRMED |
| OFFLINE-005 | KDS disconnect → reconnect and recover (= KDS-016) | H§34 | CONFIRMED |
| OFFLINE-006 | Payment-information retry idempotent (= PAY-006) | H§34 | CONFIRMED |
| OFFLINE-007 | Day Close interrupted → atomic/idempotent (= DAY-010) | H§34 | CONFIRMED |
| OFFLINE-008 | Offline behavior is limited to safe client-side resilience: preserve user-entered work locally, queue eligible operations, retry after reconnection, deduplicate retries. The server remains authoritative; offline mode never bypasses permissions, outlet state or business-state validation, never creates conflicting financial truth and never silently overwrites newer server data; offline-eligible action list: DF-13 | OD-27 | CONFIRMED (OD-27; A1, 2026-10-07) |
| INTEG-001 | AI unavailable → core workflow continues | H§34 | CONFIRMED |
| INTEG-002 | WhatsApp unavailable → unified order data not corrupted; failure surfaced | H§34 | CONFIRMED |
| INTEG-003 | Email unavailable → account recoverable; onboarding retry path | H§34 | CONFIRMED |

## 28. Security Boundaries

| ID | Requirement | Source | Status |
|---|---|---|---|
| SEC-001 | Tenant isolation: every object bound to organization + outlet | H§7 | CONFIRMED |
| SEC-002 | Cross-outlet access attempts are denied unless permitted | H§37, H§40 | CONFIRMED |
| SEC-003 | Duplicate financial operations are prevented | H§37 | CONFIRMED |
| SEC-004 | Inactive users cannot act (= AUTH-006) | H§37 | CONFIRMED |
| SEC-005 | Unauthorized AI tool actions are blocked (= AI-023, AI-042) | H§37 | CONFIRMED |
| SEC-006 | Baseline controls: rate limiting (login, public ordering), input validation, secure payment-reference handling | — | DEFERRED → DF-09 |

## 29. Phase 1 Non-Goals

| ID | Excluded | Source |
|---|---|---|
| NG-001 | Inventory automation, raw-material stock | H§41, LD-29 |
| NG-002 | Purchasing/procurement, suppliers | H§41, LD-29 |
| NG-003 | Recipes/recipe costing, waste management | H§41, LD-29 |
| NG-004 | Central kitchen; multiple kitchens per outlet | H§41, H§45 |
| NG-005 | Full accounting/ERP, payroll, expenses | H§41, LD-29, LD-30 |
| NG-006 | Advanced forecasting | H§41, LD-29 |
| NG-007 | Loyalty/campaigns; broader reorder assistant / customer recovery | H§39, H§41, LD-27 |
| NG-008 | Public review workflows | H§41, LD-26 |
| NG-009 | Delivery; franchise management | H§41 |
| NG-010 | Advanced autonomous financial actions; broad autonomous restaurant management | H§41 |
| NG-011 | Payment-execution / gateway workflow | H§45, LD-24 |
| NG-012 | 2FA; mandatory OTP for tableless QR | H§39, H§45, LD-16 |
| NG-013 | Admin, Supervisor, Support Agent roles | H§39, H§45 |
| NG-014 | Delayed KDS workflow | H§39, H§45 |
| NG-015 | Midnight day boundary; Start Day action | H§45, LD-5, LD-6 |
| NG-016 | Restaurant self-signup; customer reservation booking | H§11, H§39 |

## 30. Edge-Case Catalog → Requirement IDs  [H§37 + H§11, H§10, H§27, H§28]

| Area | Edge case | Requirement / decision |
|---|---|---|
| Onboarding | Invitation not received | ONB-013 |
| | Owner credential reset | ONB-010 |
| | Wrong outlet structure | ONB-008 |
| | Outlet added after provisioning | ONB-015 / OD-16 |
| | Suspended during active operation | ONB-014 / OD-17 |
| Menu | AI low-confidence field; Owner edits draft | AI-012, AI-013 |
| | Duplicate item import | AI-016 |
| | Item sold out during checkout | MENU-015 |
| | Outlet price differs from central | MENU-009 |
| | Modifier unavailable after order | MENU-016 |
| | Tax config changed after orders exist | MENU-017 / OD-22 |
| Staff | Reassigned between outlets | STAFF-010, STAFF-011, ORG-010 |
| | Unavailable during active service | STAFF-013 / OD-26 |
| | Absent + Available | STAFF-007, STAFF-008 |
| | Manager lacks attendance permission | ACT-ATT-01 / OD-08 |
| | Inactive staff login | AUTH-006 |
| Tables | Two users update same table | TABLE-008 |
| | Transfer during active KOT | TABLE-009 |
| | Merge/split with multiple orders | TABLE-012, TABLE-014…018 / OD-46 |
| | Table has old paid bill | TABLE-011 |
| | Draft abandoned on table | TABLE-007, ORD-064 / OD-14 |
| | Occupied with no active order | TABLE-004 (clear table) |
| | Table in Billing while item added | TABLE-010 |
| Orders | Duplicate submit / network retry | ORD-006, OFFLINE-001…003 |
| | Additional item after KOT; multiple KOTs | ORD-080, KOT-002 |
| | Cancellation after KOT / after preparation starts | ORD-081, ORD-082, ORD-088, KDS-011, KDS-017 |
| | Void / hold / re-fire | ORD-073 / OD-15 |
| | Partial completion | KDS-009, ORD-072 |
| Kitchen | Multiple stations; one Ready, another Preparing | KDS-002, KDS-009 |
| | KDS disconnect | KDS-016 |
| | Re-fire | KDS-006 / OD-15 |
| | Priority escalation | KDS-005 |
| Billing | Draft remains open | DAY-011, ANALYTICS-010 / OD-03 |
| | Finalize without payment; payment after finalization | BILL-001 / OD-21 |
| | Reopen paid bill | BILL-005, BILL-017 |
| | Partial / full refund; cancel vs refund | BILL-006, BILL-007 |
| | Reprint | BILL-009 |
| | Split payment | PAY-005 |
| Day Close | Open orders, unpaid bills, pending KOT, pending QR order, unresolved refund | DAY-011, DAY-012 / OD-03 |
| | Cash variance | CASH-006 / OD-03 |
| | Transaction crossing midnight | DAY-005 |
| | Cash received after close | CASH-004, DAY-006 |
| | Close interrupted / submitted twice | DAY-009, DAY-010 |
| | Reopen closed day | DAY-013, DAY-015, DAY-021, DAY-023 / OD-04, OD-47 |
| Customer | QR without table | ORD-030…033 |
| | Optional verification | DF-04 |
| | Customer abandons order | ORD-064 |
| | Customer sees only own order | CUSTOMER-003 |
| | Reorder item unavailable | CUSTOMER-014 |
| | Feedback after completion | FEEDBACK-001 |
| Outlet | Ordering while Closed | ORG-021…034 / OD-02, OD-31, OD-42, OD-43 |
| AI | Unavailable | AI-040, INTEG-001 |
| | Hallucination / unsupported claim | AI-022 |
| | Unauthorized AI tool action | AI-023, AI-042 |
| | Import not approved | AI-014 |
| | AI result conflicts with source data | AI-045 |
| Security | Cross-outlet access; permission denied; inactive user; missing audit; duplicate financial op | SEC-002, RBAC-008, AUTH-006, AUDIT-003, SEC-003 |

## 31. Product-Completion Criteria

| ID | Criterion | Traces |
|---|---|---|
| PC-001 | Full loop runs with AI disabled: provision → setup → menu → staff → tables → table-QR order → acceptance → KOT → KDS Ready → Served → finalize → split payment info → Day Close | ONB-*, ORD-020, KOT-001, KDS-008, HANDOFF-001, BILL-*, PAY-005, DAY-003, AI-003 |
| PC-002 | Tableless-QR order (name + phone, no OTP) → Takeaway → Picked Up | ORD-030…033, HANDOFF-002 |
| PC-003 | Every Y/N cell in §9 is enforced server-side and has a permission test | RBAC-007, RBAC-012 |
| PC-004 | Every AUDIT-002 event produces a record with before/after | AUDIT-001…003 |
| PC-005 | Negative checks: none of NG-004, NG-011, NG-012, NG-013, NG-014, NG-015 exist | NG-* |
| PC-006 | All six AI capabilities respect AI-020…024 and degrade per AI-040/041 | AI-* |
| PC-007 | All OPEN items resolved; no requirement remains OPEN or PROPOSED | SOT-004 |

## 32. Engineering Context (baseline only — detailed in TRD)

Given stack: Node.js (existing boilerplate) · React · MongoDB. No boilerplate changes in this phase.
Observed in `backend/`: Express 4, Mongoose 8, Redis 4, Joi 17 + auto Swagger, JWT, bcryptjs, helmet, hpp, express-mongo-sanitize, express-rate-limit, multer, node-cron, winston; route-object → controller → service → model pattern; responses via `createSuccessResponse` / `createErrorResponse`.
Gaps relevant to this SPEC (TRD items): coarse `AVAILABLE_AUTHS` (ADMIN/STAFF/USER) cannot express the five-factor model (RBAC-002); no realtime library for KDS-016; no test runner (SOT-013); `userModel` has 2FA/self-signup fields contrary to AUTH-002 / ONB-012; `frontend/` empty; not a git repo.

---

## 33. Reclassification of v0.2 Assumptions A-01…A-38  [UD]

| v0.2 ID | v0.2 assumption | New class | Now |
|---|---|---|---|
| A-01 | Day Close, cash, Open/Closed are per outlet | Split: **CONFIRMED** (Open/Closed per outlet, H§29) + **OPEN DECISION** (Day Close & cash scope) | ORG-020/021; OD-19 |
| A-02 | No orders before activation | **PROPOSED** | ONB-032 |
| A-03 | No self-service password reset | **CONFIRMED** (LD-38, H§5) | AUTH-005 |
| A-04 | Customers have no accounts; private order link | **OPEN DECISION** (model); mechanism DEFERRED to TRD | OD-20 |
| A-05 | Absent forces Unavailable | **PROPOSED** (H§9 requires handling; the method is a proposal) | STAFF-008 |
| A-06 | Manager staff mgmt limited to own outlets; only Owner manages Managers | Split: **CONFIRMED** (outlet limit) + **OPEN DECISION** (who manages Managers) | STAFF-012; ACT-STF-02 / OD-08 |
| A-07 | "Particular day" = until Day Close | **OPEN DECISION** | OD-25 |
| A-08 | Price/tax captured when line added | **OPEN DECISION** | OD-22 |
| A-09 | Concurrent edit conflict detection | **PROPOSED** (behavior) + **DEFERRED** (mechanism) | TABLE-008; DF-11 |
| A-10 | Transfer keeps KOT history | **PROPOSED** | TABLE-009 |
| A-11 | Add items in Billing only before Finalized | **CONFIRMED** (H§20.2) | TABLE-010 |
| A-12 | Last paid bill reachable | **PROPOSED** | TABLE-011 |
| A-13 | Customer sees live order status | **CONFIRMED** (H§4, H§23, H§25) | ORD-022 |
| A-14 | "Awaiting acceptance" sub-state | **PROPOSED** | ORD-062 |
| A-15 | Item state list | **PROPOSED** (H§35 requires definition) | ORD-071 |
| A-16 | Post-KOT change = cancel + add KOT | **PROPOSED** | ORD-086 |
| A-17 | Cancelled items excluded from bill | **CONFIRMED** (H§14.2, H§44) | ORD-087 |
| A-18 | KOTs delivered to KDS | **CONFIRMED** (H§18); printing DEFERRED | KOT-009; DF-05 |
| A-19 | Kitchen reason = list + free text | Split: **CONFIRMED** (reason mandatory) + **DEFERRED** (format) | KDS-012; DF-08 |
| A-20 | Reopen bill/day requires reason | **PROPOSED** | BILL-014, DAY-018 |
| A-21 | Refund = recorded info only | **CONFIRMED** (LD-24, H§20.5) | BILL-012 |
| A-22 | Payment only against Finalized bill; Paid when components cover total | **OPEN DECISION** (and it was in tension with H§20.3 "tracked independently") | OD-21 |
| A-23 | Missing online reference ID allowed with warning | **OPEN DECISION** | OD-24 |
| A-24 | Customer identity = phone within org | **OPEN DECISION** | OD-20 |
| A-25 | Feedback 1–5 + comment, one per order | **PROPOSED** | FEEDBACK-006 |
| A-26 | Reorder uses current prices | **OPEN DECISION** | OD-23 |
| A-27 | Variance does not block close | **OPEN DECISION** | OD-03 |
| A-28 | Definition of unresolved bill | **OPEN DECISION** | OD-03 |
| A-29 | Audit append-only | **PROPOSED** | AUDIT-005 |
| A-30 | Daily Brief scoped to business day | **CONFIRMED** (LD-5, LD-9) | DAY-017, AI-027 |
| A-31 | What Changed? baseline = prior closed day(s) | **OPEN DECISION** | OD-29 |
| A-32 | WhatsApp agent offers only published, available items | **CONFIRMED** (H§10, H§25, H§33.2) | AI-032 |
| A-33 | Analytics "today" = business day | **CONFIRMED** (LD-5, LD-9) | ANALYTICS-005 |
| A-34 | Attention states Open → Dismissed/Resolved | **PROPOSED** | ATTENTION-006 |
| A-35 | No local-first offline mode | **OPEN DECISION** | OD-27 |
| A-36 | Baseline security controls | **DEFERRED** (TRD) | DF-09 |
| A-37 | On Break doesn't auto-reassign orders | **OPEN DECISION** | OD-26 |
| A-38 | Owner may mark Ready and escalate priority | Split: **CONFIRMED** (mark Ready, H§36) + **OPEN DECISION** (Owner escalation) | KDS-010; ACT-KDS-03 / OD-08 |

**Totals:** CONFIRMED 9 · PROPOSED 12 · DEFERRED 1 · OPEN DECISION 12 · split 4 (A-01, A-06, A-19, A-38).

*v0.6 note:* every item classed PROPOSED above, and every OD resolution, was explicitly approved on 2026-10-07 and is now CONFIRMED.

*v0.4 note:* the OPEN DECISION items above now carry your proposed resolutions where you gave one (A-01/OD-19, A-04/OD-20, A-22/OD-21, A-24/OD-20, A-26/OD-09, A-27/OD-05, A-28/OD-03). The rest remain open as P1 (§36.3).

## 34. Decision Record

Under SOT-005 a rule becomes CONFIRMED only when it is directly supported by v1.1 or an explicit locked user decision, or when you explicitly approve it. On 2026-10-07 you approved every proposed decision and rule in §34.1–34.3; all are now CONFIRMED with source "approved 2026-10-07". No PROPOSED items remain.

### 34.0 Explicit user decisions (CONFIRMED when given)

| OD | Decision | Requirement / action rows |
|---|---|---|
| OD-08 | Complete baseline permission catalogue; matrix is a catalogue, authorization is five-factor; no permissions inferred beyond explicit assignments | RBAC-013, RBAC-017, RBAC-018, §9 `Y`/`N` cells sourced OD-08 |
| OD-32 | Reopen only if the current running day has zero transactions; temporal invariant of contiguous, non-overlapping business days | DAY-021, DAY-023, ACT-DAY-03 |
| OD-34 | Cancellation-request workflow by item state; Kitchen acknowledgement for Preparing/Ready; Kitchen may cancel independently; cancellation records keep actor, reason, timestamp, previous and resulting state | ORD-082, ORD-088, ORD-090, ORD-092, KDS-017, ORD-071 (states), ACT-CAN-01…07 |
| OD-45.2 | Viewing an object is implied by holding any action permission on it | RBAC-027, ACT-ORD-04, ACT-STF-06, ACT-ANL-03 |
| OD-45.3 | "Manage tables" covers operational table actions | RBAC-028, ACT-MOD-05, ACT-TBL-01/03/04/06/07; resolves C-22 |
| OD-45.4 | Managers do not by default manage Manager accounts or customize permissions; Owner may grant via customization | RBAC-029, ACT-STF-02/03/05 |
| OD-45.1 | Remaining cells decided cell by cell; no blanket default | RBAC-030, RBAC-019 (open cells) |
| OD-35 | Transfer, merge, split and move-items stay; one active table session per table; one active order context per session; added items go to the active order; operations are auditable events; history never rewritten | TABLE-004, TABLE-012, TABLE-014…017, ORD-091 |

### 34.1 Your OD resolutions — approved 2026-10-07 (now CONFIRMED)

| OD | Proposed resolution (summary) | Requirement / action rows |
|---|---|---|
| OD-01 | Customer-originated orders (table QR, tableless QR, website, WhatsApp) need staff acceptance; staff-created orders do not; rejection needs a reason. (Who accepts/rejects is now CONFIRMED by OD-08.) | ORD-008, AI-033 |
| OD-02 | Outlet Closed: new customer and staff orders blocked; existing confirmed orders continue and may complete; existing bills may be finalized/paid; no new items; website/WhatsApp show closed; Owner and Manager toggle | ORG-024…031, ACT-AVA-01; C-08 now final |
| OD-03 | Day Close allowed with unresolved items; warnings; explicit confirmation; nothing silently altered; transactions keep originating business day | DAY-012, DAY-019 |
| OD-04 | Reopen only the most recently closed day; reason; never two active days; reopened-period transactions belong to the reopened day; re-close recalculates; audit Closed → Reopened → Reclosed | DAY-015, DAY-018, AUDIT-008 |
| OD-05 | Cash reconciliation per outlet and business day; no opening float; expected cash from that day's cash transactions; counted cash; variance; variance does not block close | CASH-005, CASH-006 |
| OD-06 | Remaining part only: every cancellation requires a reason (this supplies the "cancellation policy" OD-34 refers to for Pending/Sent items). Its state rules are superseded by OD-34 | ORD-089 |
| OD-07 | One bill per order/customer transaction; Table → Order → Bill; no table → Takeaway Order → Bill; split payment without multiple bills. Its "no merge/split" clause is superseded by OD-35 | BILL-015 |
| OD-09 | No account; private non-guessable link to past orders; reorder creates a new order, never modifies history; current price/tax/availability/menu rules | CUSTOMER-016, CUSTOMER-017, CUSTOMER-019, ACT-CUS-03 (answers P1 OD-23) |
| OD-10 | Owner Agent reads and executes explicitly permitted actions through controlled tools; never bypasses RBAC/approvals/rules/audit; no direct DB modification; no invented facts | AI-025, ACT-AI-08 |
| OD-11 | Website: name + phone; no OTP; Takeaway; acceptance required | ORD-042 |
| OD-19 | Business day and Day Close per outlet | ORG-011, DAY-016 |
| OD-20 | No customer accounts; name + phone for tableless QR and website; no OTP; private order link/token | AUTH-009, CUSTOMER-005, ACT-CUS-02 |
| OD-21 | Payment status independent of finalization; Not Paid until payments cover total, then Paid; records keep amount/mode/transaction ID | PAY-010, ACT-PAY-01 |
| OD-28 | No general second-person approval; role/permission/state/reason/audit controls; dual approval only by later decision | RBAC-014, Approval column in §9 |
| OD-30 | Completed only when every item is Served, Picked Up or Cancelled and handoff is complete; bill/payment never completes an order | ORD-063, ACT-FB-01 |

### 34.2 Rules drafted from v1.1 — approved 2026-10-07 (now CONFIRMED)

ORG-010 · ONB-032 · AUTH-008 · RBAC-016 · STAFF-008 · MENU-015 · MENU-016 · TABLE-008 · TABLE-009 · TABLE-011 · ORD-062 · ORD-086 · BILL-014 · FEEDBACK-006 · AUDIT-005 · AI-016 · AI-031 · AI-045 · ATTENTION-006 (19 items)
ORD-071 (item states) left this list: it became CONFIRMED because OD-34 uses exactly those states.

### 34.3 Rules derived from your decisions — approved 2026-10-07 (now CONFIRMED)

| ID | Derived rule | Derived from |
|---|---|---|
| ANALYTICS-011 | Unresolved bill = status Draft or Reopened, or Finalized + Not Paid; resolved = Finalized + Paid, Cancelled, Refunded | OD-03 |
| DAY-020 | Items warned about at Day Close | OD-03 |
| CASH-007 | Expected cash = cash payments recorded in the business day − cash refunds recorded in it | OD-05 (depends on OD-33) |
| DAY-024 | On reopen, the empty running period is absorbed into the reopened day; the re-close timestamp becomes that day's boundary | OD-32, OD-04 |

## 35. Requirement Count

Requirement-table rows (excludes SOT bullets, ACT rows, NG rows, PC rows, and the §34 / §2.3 reference tables); recomputed for v1.1:

| Status | Rows |
|---|---|
| CONFIRMED | 368 |
| PROPOSED | 0 |
| OPEN | 0 |
| DEFERRED | 7 |
| EXCLUDED | 3 (+ NG-001…016) |
| **Total** | **378** |

Action inventory: 88 ACT rows (87 active, ACT-TBL-02 WITHDRAWN); every cell is decided — no `?` cells remain (RBAC-019).

## 36. Decisions — all closed

### 36.1 OD-02 — Outlet Closed, expanded (all CONFIRMED)

| ID | Sub-decision | Status |
|---|---|---|
| OD-02.1 | New customer orders | CONFIRMED — blocked (ORG-021) |
| OD-02.2 | New staff-created orders | CONFIRMED — blocked (ORG-024) |
| OD-02.3 | Existing active (confirmed) orders | CONFIRMED — continue and may complete (ORG-025) |
| OD-02.4 | Adding items to existing orders | CONFIRMED — not allowed (ORG-026) |
| OD-02.5 | Billing existing orders | CONFIRMED — finalize and record payment allowed (ORG-027); reopen/refund/correction allowed (ORG-034, A1) |
| OD-02.6 | Kitchen processing existing orders | CONFIRMED — continues (ORG-028) |
| OD-02.7 | Website | CONFIRMED — shows closed, no new orders (ORG-029) |
| OD-02.8 | WhatsApp | CONFIRMED — shows closed, no new orders (ORG-030) |
| OD-02.9 | Who changes Open/Closed | CONFIRMED — Owner and Manager (ORG-031); no automatic transition (ORG-032, A1) |

### 36.2 P0 — none remaining

The five actions with no actor were assigned on 2026-10-07 (OD-45.1): Picked Up → Waiter, Cashier; apply discount, service/packaging charge, correct payment information → Owner, Manager, Cashier; view audit trail → SuperAdmin only.

### 36.3 Former P1 decisions — closed by amendment A1 (2026-10-07)

| ID | Decision | Resolved in |
|---|---|---|
| OD-12 | Bounds of Owner permission customization | RBAC-005 |
| OD-14 | Draft expiry / table occupancy | ORD-064, TABLE-007 (amended) |
| OD-15 | Hold / Void / Re-fire | ORD-073; ACT-MOD-03/04/06/07, ACT-KOT-04 |
| OD-16 | Who adds outlets | ONB-015 |
| OD-17 | Suspension during active operation | ONB-014 |
| OD-18 | Daily AI Brief; Manager access to Brief, What Changed?, Attention | AI-026, ATTENTION-008; ACT-AI-04/05, ACT-ANL-04 |
| OD-22 | Price/tax snapshot | MENU-017 |
| OD-24 | Online payment reference | PAY-003 (amended), PAY-011 |
| OD-25 | Menu-item availability "for a day" | MENU-011 (amended) |
| OD-26 | Staff unavailable during active work | STAFF-013 |
| OD-27 | Offline operation | OFFLINE-008 |
| OD-29 | What Changed? baseline | AI-028 |
| OD-31 | Orders awaiting acceptance when outlet closes | ORG-033; ACT-ACC-01/02 |
| OD-33 | Refund record | PAY-013 |
| OD-36 | One-tap reorder | CUSTOMER-020; ACT-CUS-03 |
| OD-37 | Owner AI Agent actions | AI-029; ACT-AI-08 |
| OD-38 | Customer matching | CUSTOMER-021; ACT-CUS-01 |
| OD-39 | Draft bill with existing payment; overpayment | PAY-012, BILL-005 (amended) |
| OD-40 | All items cancelled | ORD-065 |
| OD-41 | Day-close sales basis | DAY-022 |
| OD-42 | Bill reopen/refund while Closed | ORG-034; ACT-BIL-05/07 |
| OD-43 | Automatic Open/Closed | ORG-032; ACT-AVA-01 |
| OD-44 | Cancellation requests | ORD-093, ORD-088 (amended); ACT-CAN-07 |
| OD-45.1 | Remaining permission cells | RBAC-019; §9 (no `?` cells) |
| OD-46 | Merge / split / move items and bill ownership | TABLE-018; ACT-MOD-05, ACT-TBL-07 |
| OD-47 | What counts as a transaction for Reopen Day | DAY-025; ACT-DAY-03 |

No OPEN or PROPOSED items remain in this SPEC.

## 37. Deferred Items

| ID | Item | Deferred to |
|---|---|---|
| DF-01 | Quantitative success metrics; market narrative | Remains DEFERRED (PRD v1.0 keeps Phase 1 goals qualitative — PRD PQ-04) |
| DF-02 | Attention thresholds and baselines | TRD |
| DF-03 | State-transition tables (order, item, table, bill), permission atoms, idempotency keys, offline mechanics, audit payloads, API contracts | TRD |
| DF-04 | Optional (non-mandatory) customer phone verification | Not built unless requested |
| DF-05 | Thermal KOT/bill printer integration | Post-Phase 1 unless requested |
| DF-06 | Payment gateway execution | Later phase |
| DF-07 | Public reviews | Phase 2 |
| DF-08 | Reason-capture formats (cancellation, rejection, reopen) | PRD — rule defined in PRD v1.0 (category + optional free text); reason catalogue content refinable downstream |
| DF-09 | Baseline security controls (rate limiting, validation, payment-reference handling) | TRD |
| DF-10 | Onboarding checklist contents | PRD — defined in PRD v1.0 (PRD-ONB-033.1) |
| DF-11 | Concurrency/conflict mechanism | TRD |
| DF-12 | Private order-link/token mechanism (generation, expiry, revocation) | TRD |
| DF-13 | Technical thresholds and delivery mechanics: Draft inactivity threshold (ORD-064), stale cancellation-request threshold (ORD-093), Daily AI Brief trigger/time/delivery mechanism (AI-026), staff-alert device/notification transport/layout, offline-eligible action list (OFFLINE-008), Owner Agent tool implementation (AI-029) — added A1 | TRD / UI-UX brief |
| DF-14 | Billing calculation policies: GST/tax calculation, discount rules, service- and packaging-charge basis, rounding, invoice numbering, accounting treatment beyond DAY-022 — added A1 | Downstream specification (TRD / configuration) |

## 38. Contradictions and Reconciliation

| ID | Contradiction | Sources | Status |
|---|---|---|---|
| C-01 | Kitchen stations vs one kitchen per outlet | H§4, H§6, H§18, H§40 vs H§44, LD-1 | Reconciled (KDS-002) |
| C-02 | H§42 readiness gate stale | H§42 vs H§44 | Resolved |
| C-03 | Waiter Reopen bill = YES vs post-payment edit denied | H§36 vs H§40 | Reconciled (BILL-016, BILL-017) |
| C-04 | Attention "kitchen slowdown" vs delayed KDS removed | H§32 vs H§18 | Reconciled (ATTENTION-005) |
| C-05 | Attention "reorder gap" vs one-tap reorder only | H§32 vs LD-27 | Reconciled (ATTENTION-005) |
| C-06 | "On Break = Waiter unavailable" vs all staff | H§9 vs LD-33 | Resolved (STAFF-006) |
| C-07 | Outlet Closed "resolved" vs four scenarios open | H§38 vs H§29 | Resolved by OD-02 (approved) |
| C-08 | LD-13 "new ordering unavailable" vs H§44 "new customer ordering" | LD-13 vs H§44 | Resolved — final: OD-02 approved; all new orders blocked |
| C-09 | Bill lifecycle chain vs separate concepts | H§20 | Editorial |
| C-10 | Eight vs six AI capabilities | H§33 | Resolved |
| C-11 | Prompt omits Attention Engine and website | prompt vs H | Resolved: in scope |
| C-12 | Optional verification vs no OTP | H§37 vs LD-16 | Resolved (DF-04) |
| C-13 | Duplicate bullets in H§27 | H§27 | Editorial |
| C-14 | v0.2 Completed rule pointed at wrong OD | SPEC v0.2 | Fixed (OD-30) |
| C-15 | v0.2 payment-after-finalization vs H§20.3 | SPEC v0.2 vs H§20.3 | Fixed (OD-21) |
| C-16 | Reopen after running-day transactions vs LD-9 boundary | OD-04 vs LD-9 | Resolved by OD-32 |
| C-17 | No merge/split (OD-07) vs H§11 table operations | OD-07 vs H§11 | Resolved by OD-35 |
| C-18 | OD-05 per-outlet expected cash vs H§26 "responsible user" | OD-05 vs H§26 | Resolved — final: OD-05 approved |
| C-19 | Owner Agent actions vs NG-010 | OD-10 vs H§41 | Resolved by OD-37 (A1): sensitive actions need explicit Owner confirmation; no autonomous financial action |
| C-20 | OD-06 state rules vs OD-34 state rules | OD-06 vs OD-34 | Resolved: OD-34 supersedes |
| C-21 | OD-34 "reason where required by policy" vs ORD-089 | OD-34 vs OD-06 | Resolved: ORD-089 approved as that policy |
| C-22 | "Manage tables" vs operational table actions | OD-08 vs OD-35 | Resolved by OD-45.3 |
| C-23 | Draft expiry (ORD-064 "expiry/cleanup rule") vs Drafts remaining identifiable (PRD C-PRD-01) | ORD-064, TABLE-007 | Resolved by A1 (OD-14): occupancy released, Draft kept |
| C-24 | PAY-003 "record transaction ID" vs reference not always supplied (PRD C-PRD-02) | PAY-003, PAY-011 | Resolved by A1 (OD-24): record when supplied, never fabricate |
| C-25 | Draft bill with payments vs Reopen-only correction (PRD C-PRD-03) | BILL-003, BILL-005, PAY-010, PAY-012 | Resolved by A1 (OD-39): Draft corrected without Reopen; overpayment explicit |
| C-26 | "For a particular day" vs business day (PRD C-PRD-04) | MENU-011 vs DAY-017 | Resolved by A1 (OD-25): current business day, ends at Day Close |
| C-27 | ORD-088 "on acknowledgement → Cancelled" vs Kitchen may decline (OD-44) | ORD-088 vs ORD-093 | Resolved by A1: acknowledgement = accept or decline |
| C-28 | Reorder "creates a new order" vs one active order per table session | CUSTOMER-020 vs TABLE-015 | Reconciled (A1): with an active table order the reorder's items join it; the historical order is never mutated |

No open contradictions.

## 39. Approval Status

**SPEC v1.1** — v1.0 APPROVED by the product owner on 2026-10-07; amendment A1 (2026-10-07) records the product owner's explicit decisions issued for PRD finalization.

- No OPEN or PROPOSED items remain; no open contradictions; every permission cell is decided.
- DEFERRED items (§37) belong to the documents named there.
- Any change to a CONFIRMED requirement requires an explicit, dated user decision (SOT-002) and keeps its ID (§2.1).

Next document: PRD v1.0 (finalized, ready for product-owner approval).

## 40. Amendment Log

### A1 — 2026-10-07 — PRD decision closure

**Reason for amendment.** SPEC v1.0 carried 25 OPEN requirements (P1 decisions OD-12…OD-47 and the remaining permission cells of OD-45.1) to be "resolved during the PRD and written back into this SPEC as a dated change" (v1.0 §39). During PRD finalization the product owner issued explicit decisions closing all of them. Four PRD-level contradictions (C-PRD-01…04) and one further conflict (OD-44 vs ORD-088) required changing CONFIRMED wording. History is preserved below; no requirement ID was renumbered or reused.

**1. Amended CONFIRMED requirements (original wording preserved)**

| SPEC ID | Original issue | Original wording (v1.0) | Final resolution |
|---|---|---|---|
| ORD-064 | C-PRD-01: "expiry/cleanup rule" implied Drafts disappear; the decision keeps Drafts identifiable | "Abandoned Draft: no KOT, no completed sale, no permanent table lock; expiry/cleanup rule exists" | Draft kept in history; abandonment releases only the table occupancy/session claim; threshold DF-13 (OD-14) |
| TABLE-007 | C-PRD-01 (same issue) | "A Draft does not permanently lock table occupancy" | Abandoned Draft never permanently occupies a table; release does not delete the Draft (OD-14) |
| PAY-003 | C-PRD-02: required a transaction ID even when none is supplied | "If online, record transaction/reference ID" | Record the provider/payment reference when supplied; never fabricate one (OD-24) |
| MENU-011 | C-PRD-04: "particular day" could be read as a calendar date, conflicting with DAY-017 | "Manager may change availability for a particular day or permanently for the authorized outlet" | Temporary = current business day, ends at Day Close; or permanent until changed; menu-item availability only (OD-25) |
| BILL-005 | C-PRD-03: "after finalization/payment" implied a paid Draft needs Reopen | "Reopen: authorized correction path after finalization/payment" | Reopen applies to Finalized bills; a Draft with payments is corrected without Reopen (OD-39) |
| ORD-088 | OD-44 lets Kitchen decline; v1.0 said acknowledgement always cancels | "…Kitchen must acknowledge it; on acknowledgement the item becomes Cancelled" | Acknowledgement = accept (Cancelled) or decline (item stays active) (OD-44) |

**2. OPEN requirements closed (now CONFIRMED)**
ORG-032 (OD-43) · ORG-033 (OD-31) · ORG-034 (OD-42) · ONB-014 (OD-17) · ONB-015 (OD-16) · RBAC-005 (OD-12) · RBAC-019 (OD-45.1) · STAFF-013 (OD-26) · MENU-017 (OD-22) · TABLE-018 (OD-46) · ORD-065 (OD-40) · ORD-073 (OD-15) · ORD-093 (OD-44) · PAY-011 (OD-24) · PAY-012 (OD-39) · PAY-013 (OD-33) · CUSTOMER-020 (OD-36) · CUSTOMER-021 (OD-38) · DAY-022 (OD-41) · DAY-025 (OD-47) · AI-026 (OD-18) · AI-028 (OD-29) · AI-029 (OD-37) · ATTENTION-008 (OD-18) · OFFLINE-008 (OD-27). Each v1.0 row read "OPEN → OD-nn" with the question now answered in its statement.

**3. Action inventory (§9)** — every remaining `?` cell decided under OD-45.1 ("an action not explicitly granted is denied"), with explicit grants from OD-15 (Owner/Manager Hold/Void item), OD-18 (Manager Daily Brief, What Changed?, Attention for own outlets), CUSTOMER-004 (outlet staff customer history, own outlet) and CUSTOMER-001 (customer views own bill). Preconditions that referenced now-closed ODs point to the resolving requirement. ACT-CAN-07 renamed "Acknowledge (accept or decline) a cancellation request" (same action, OD-44).

**4. Deferred items added** — DF-13 (technical thresholds and delivery mechanics) and DF-14 (billing calculation policies). DF-08 and DF-10 are now satisfied by PRD v1.0.

**5. Unchanged** — every other requirement, including all LD-derived rules, is unchanged.
