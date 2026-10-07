# SERVENA — Phase 1 Product Requirements Document (PRD)

> **The Operating System for Modern Restaurants**

| Field | Value |
|---|---|
| Document | Phase 1 Product Requirements Document |
| Version | **1.0 — FINALIZED — READY FOR PRODUCT-OWNER APPROVAL** (every open decision closed 2026-10-07; not yet approved by the product owner) |
| Date | 2026-10-07 |
| Upstream (highest product source) | [SPEC v1.1](../../SPEC.md) — v1.0 approved 2026-10-07; v1.1 adds dated amendment A1 (2026-10-07) recording the decisions closed for this PRD |
| Companion | [CAPABILITY-MAP.md](../../CAPABILITY-MAP.md) · [PRD_TRACEABILITY.md](PRD_TRACEABILITY.md) |
| Background source | `SERVENA_Phase_1_User_Wise_Product_Workflow_and_Edge_Case_Hardening_v1.1.docx` (already reflected in SPEC) |
| Downstream (not started) | TRD → Database Schema → UI/UX Design → Implementation Plan → Implementation |

---

## 0. How to Read This PRD

### 0.1 Source hierarchy

```
Explicit User Decisions
        ↓
SPEC v1.1           ← v1.0 approved + dated amendment A1; this PRD must not contradict it
        ↓
PRD (this document)
        ↓
TRD → Database Schema → UI/UX Design → Implementation Plan → Implementation
```

- **PRD-SOT-001.1** This PRD does not contradict SPEC v1.1 or any explicit user decision. Where a conflict is discovered, this PRD is corrected; SPEC changes only through an explicit, dated user decision.
- **PRD-SOT-002.1** A change to a CONFIRMED SPEC requirement requires an explicit, dated user decision before this PRD reflects it.
- **PRD-SOT-003.1** Within explicit user decisions, later dated decisions and SPEC v1.1's approved resolutions take precedence over the v1.1 source document.
- **PRD-SOT-005.1** This PRD contains no PROPOSED or OPEN product decisions: every decision recorded in §71 is a final product decision issued by the product owner on 2026-10-07. The PRD as a whole becomes canonical when the product owner approves it.
- **PRD-SOT-004.1** SPEC v1.1 has no OPEN items. SPEC items that are DEFERRED are listed in Deferred Features (§70) with the document that owns them.
- **PRD-SOT-010.1** Every PRD requirement carries its upstream SPEC ID inside its own ID; downstream documents (TRD, schema, UI, plan, tests) must trace to PRD IDs.
- **PRD-SOT-011.1** Every CONFIRMED SPEC requirement is covered by at least one PRD requirement ([PRD_TRACEABILITY.md](PRD_TRACEABILITY.md)).
- **PRD-SOT-012.1** No PRD requirement exists without an upstream SPEC ID.
- **PRD-SOT-013.1** Acceptance criteria are written so that they can be turned into tests in the five categories: happy path · invalid transition · permission denial · duplicate/retry · failure/recovery.

### 0.2 Requirement IDs

| Pattern | Meaning | Example |
|---|---|---|
| `PRD-<SPEC-ID>.<n>` | Product requirement *n* derived from SPEC requirement `<SPEC-ID>` | `PRD-ORD-006.1` traces to `ORD-006` |
| `PRD-<SPEC-ID>.AC<n>` | Acceptance criterion *n* for that SPEC requirement | `PRD-ORD-006.AC1` |
| `PRD-ACT-<…>.1` | Permission catalogue entry derived from SPEC action-inventory row | `PRD-ACT-BIL-07.1` traces to `ACT-BIL-07` |
| `PQ-nn` | Product question raised while writing this PRD — all closed (§71.2) | `PQ-03` |
| `OD-nn` | Decision carried from SPEC v1.0 and closed on 2026-10-07 (SPEC amendment A1; §71.1) | `OD-14` |

SPEC IDs are never renumbered or reused. A PRD requirement that implements several SPEC requirements lists the others as **"also: …"**.

### 0.3 Terms

| Term | Meaning in this PRD |
|---|---|
| Organization | The restaurant brand / tenant. Contains one or more outlets. |
| Outlet | One physical restaurant location with exactly one kitchen. |
| Business day | The operational period of one outlet, ended only by Day Close (no midnight boundary). |
| Customer-originated order | An order placed by the customer via table QR, tableless QR, website or WhatsApp. |
| Staff-created order | An order created by Owner, Manager, Cashier or Waiter. |
| Takeaway | Any order without an associated table. |
| KOT | Kitchen Order Ticket — the kitchen's work instruction for an order or change. |
| KDS | Kitchen Display — where the kitchen receives KOTs and records progress. |
| Unresolved bill | A bill that is Draft or Reopened, or Finalized with payment status Not Paid. |

### 0.4 Requirement status

| Tag | Meaning |
|---|---|
| *(no tag)* | **CONFIRMED** — derived from a CONFIRMED SPEC v1.1 requirement, including the decisions closed on 2026-10-07; the deciding OD/PQ is cited in italics, e.g. *(OD-14)* |
| DEFERRED | Explicitly deferred to a named downstream document or a later phase (§70) |
| EXCLUDED | Explicit Phase 1 non-goal (§6) |

This PRD contains no PROPOSED or OPEN product decisions.

### 0.5 Capability format

Each major capability uses: **Objective · Actors · Preconditions · Main Flow · Alternative Flows · Business Rules · Permissions · State Changes · Error / Edge Cases · Acceptance Criteria**. Business rules carry the PRD requirement IDs; permissions reference the catalogue in §13.4 by action ID (`ACT-…`).

---

## 1. Executive Summary

SERVENA Phase 1 is a restaurant operating system for single- and multi-outlet restaurants. It runs one operational loop — onboarding, outlet setup, menu, staff, tables, ordering from every channel, kitchen tickets and display, food handoff, billing, payment information, customers, day close and owner/manager analytics — on a single order truth, and adds practical AI on top: AI Menu Import, an Owner AI Agent, a Daily AI Brief, What Changed?, a WhatsApp Ordering Agent and one-tap reorder.

The product is built around a small number of non-negotiable rules:
- every channel feeds one Unified Order Engine; any order without a table is Takeaway;
- customer-originated orders need staff acceptance before the kitchen gets them;
- each outlet has one kitchen (with stations) shared by all Kitchen users;
- bill finalization and payment status are separate; every correction is authorized, reasoned and audited;
- the business day ends only when an authorized user performs Day Close — there is no midnight boundary and no Start Day;
- access is decided by Role + Outlet Access + Permission + Current State + Approval Requirement;
- AI assists but is never the source of operational truth, and the restaurant works with AI switched off.

## 2. Product Vision

- **PRD-AI-003.1** SERVENA is the operating system a restaurant runs on every day; its core operations (ordering, KOT, kitchen, billing, Day Close) work fully without AI. *also: AI-040*
- **PRD-AI-004.1** AI is an assistance and intelligence layer; it never silently changes orders, bills, payments, menu or day records.
- The Phase 1 operating loop:

```
Restaurant Onboarding → Outlet Setup → Menu → Staff → Tables
→ Customer Ordering / Waiter Ordering → Unified Order Engine → KOT → Kitchen / KDS
→ Food Handoff → Billing → Payment Information → Customer → Day Close
→ Owner / Manager Analytics → AI capabilities
```

## 3. Problem Statement

Restaurants need one trustworthy operational system rather than disconnected ordering, kitchen, billing and reporting steps. SPEC v1.1 identifies the failures Phase 1 must prevent:

| Problem | Phase 1 answer | Key SPEC areas |
|---|---|---|
| Orders from many channels with no single truth → duplicates and losses | Unified Order Engine with idempotent submission | ORD-001, ORD-006 |
| Silent kitchen changes; takeaway food treated as table service | KOT for every change, cancellation trace, Takeaway marker | KOT-*, KDS-*, ORD-083 |
| Financial corrections without authority or trace | Separate finalization/payment, permissioned corrections, audit | BILL-*, PAY-*, AUDIT-* |
| Ambiguous day boundaries and late cash variance | Explicit Day Close per outlet; cash reconciled to it | DAY-*, CASH-* |
| Data leaking across outlets or roles | Five-factor authorization, tenant and outlet isolation | RBAC-*, SEC-* |
| Owners must read every report | Dashboard + Attention Engine with evidence | ANALYTICS-*, ATTENTION-* |
| Slow menu onboarding | AI Menu Import with Owner approval | AI-010…016 |

Market sizing, competitor framing and quantitative success targets are not part of the Phase 1 product requirements; they are DEFERRED (PQ-04, SPEC DF-01).

## 4. Product Goals

| ID | Goal | Evidence of achievement (qualitative product behavior; numeric targets DEFERRED — PQ-04) |
|---|---|---|
| G1 | One operational order truth across all channels | No duplicate orders/KOTs under retry (PRD-ORD-006.*) |
| G2 | Kitchen clarity | Every change and cancellation reaches the KDS with Takeaway/table identity (PRD-KOT-*, PRD-KDS-*) |
| G3 | Financial integrity | Every correction has actor, reason and audit (PRD-BILL-*, PRD-AUDIT-*) |
| G4 | Accountable business day | Day Close is the only boundary; cash reconciles to it (PRD-DAY-*, PRD-CASH-*) |
| G5 | Least-privilege access | Every permission cell enforced (PRD-RBAC-*, PRD-ACT-*) |
| G6 | Fast onboarding | Provisioning + guided setup + AI Menu Import (PRD-ONB-*, PRD-AI-010…016) |
| G7 | Owner insight | Dashboard, Attention, AI insight features (PRD-ANALYTICS-*, PRD-ATTENTION-*, PRD-AI-020…029) |
| G8 | Resilience | Safe retry, recovery, graceful integration failure (PRD-OFFLINE-*, PRD-INTEG-*) |

## 5. Phase 1 Scope

| Capability module (CAPABILITY-MAP) | PRD sections |
|---|---|
| `tenancy` | §9, §10 |
| `identity-access` | §12, §13 |
| `audit` | §53 |
| `outlet-setup` | §11, §9.2 (Outlet Open/Closed) |
| `staff` | §14–§17 |
| `menu` | §18, §19 |
| `ai-menu-import` | §57 |
| `tables` | §20 |
| `order-engine` | §27–§32 |
| `kitchen` | §33–§36 |
| `customer-ordering` | §21–§25, §37 |
| `billing` | §38–§41 |
| `customers` | §42–§44 |
| `day-close` | §45–§49 |
| `analytics` | §50, §51 |
| `attention` | §52 |
| `ai-insights` | §58–§60 |
| `whatsapp-ordering` | §26, §61 |

- **PRD-AI-001.1** Phase 1 AI capabilities are exactly: AI Menu Import, Owner AI Agent, Daily AI Brief, What Changed?, WhatsApp Ordering Agent and one-tap reorder.
- **PRD-AI-002.1** No broader customer-recovery automation is included.

## 6. Phase 1 Non-Goals

The following MUST NOT be built in Phase 1:

- **PRD-NG-001.1** Inventory automation and raw-material stock.
- **PRD-NG-002.1** Purchasing, procurement and suppliers.
- **PRD-NG-003.1** Recipes, recipe costing and waste management.
- **PRD-NG-004.1** Central kitchen; more than one kitchen per outlet.
- **PRD-NG-005.1** Full accounting/ERP, payroll and expenses. *also: DAY-008, STAFF-009*
- **PRD-NG-006.1** Advanced forecasting.
- **PRD-NG-007.1** Loyalty, campaigns, reorder assistant or customer-recovery beyond one-tap reorder. *also: CUSTOMER-010, AI-002*
- **PRD-NG-008.1** Public review publishing or review-request workflows. *also: CUSTOMER-006, FEEDBACK-005*
- **PRD-CUSTOMER-006.1** Public reviews are a Phase 2 capability.
- **PRD-FEEDBACK-005.1** Phase 1 feedback is never published to or requested on public review platforms.
- **PRD-NG-009.1** Delivery and franchise management.
- **PRD-NG-010.1** Advanced autonomous financial actions; broad autonomous restaurant management.
- **PRD-NG-011.1** Payment execution / payment-gateway workflow. *also: PAY-008*
- **PRD-PAY-008.1** Phase 1 records payment information only; it never executes, captures or moves money.
- **PRD-NG-012.1** 2FA for staff; mandatory OTP for customers.
- **PRD-NG-013.1** Admin, Supervisor and Support Agent roles. *also: RBAC-021*
- **PRD-NG-014.1** Delayed-order KDS workflow or delay alerts. *also: KDS-007*
- **PRD-NG-015.1** Midnight day boundary; Start Day action. *also: DAY-001, DAY-002*
- **PRD-NG-016.1** Restaurant self-signup; customer reservation booking. *also: ONB-012, TABLE-003*

## 7. Personas and User Roles

Personas are defined only by role responsibilities in SPEC v1.1; no demographic or behavioral assumptions are added.

| Role | Type | Who they are | Primary jobs |
|---|---|---|---|
| **SuperAdmin** | Platform | SERVENA operator | Provision, configure, suspend restaurants; reset Owner credentials; view audit trail |
| **Owner** | Restaurant | Owns the organization | Configure restaurant and outlets; manage staff and permissions; oversee all outlets; use AI insight features |
| **Manager** | Restaurant | Runs assigned outlet(s) | Daily operations, menu availability, staff, corrections, Day Close |
| **Cashier** | Restaurant | Billing desk at one outlet | Bills, payment information, refunds, Day Close |
| **Waiter** | Restaurant | Floor service at one outlet | Tables, orders, service, bill handoff |
| **Kitchen Staff** | Restaurant | Kitchen at one outlet | KDS, preparation, readiness, kitchen cancellation |
| **Customer** | End user | Diner | Browse, order, track, receive/pick up, feedback, one-tap reorder |

- **PRD-RBAC-020.1** Phase 1 restaurant roles are exactly Owner, Manager, Cashier, Waiter, Kitchen Staff and Customer; SuperAdmin is a platform role and never a restaurant operational user.
- **PRD-RBAC-021.1** No Admin, Supervisor, Support Agent or Delivery role exists.

## 8. Role Responsibilities and Boundaries

- **PRD-RBAC-022.1** Owner sees and acts on all outlets of the organization they are authorized for, including cross-outlet views.
- **PRD-RBAC-023.1** Manager sees and acts only on assigned outlet(s) within granted permissions; Manager never sees an organization-wide (HQ) view.
- **PRD-RBAC-024.1** Cashier and Waiter work in their assigned outlet; Kitchen Staff work in their assigned outlet's kitchen (including its stations).
- **PRD-RBAC-025.1** A Customer sees only their own order(s). *also: CUSTOMER-003*
- **PRD-RBAC-026.1** A Cashier never gains Owner configuration access by holding billing permissions.
- **PRD-ORG-008.1** Cashier, Waiter and Kitchen Staff operate in exactly one current outlet at a time.
- **PRD-ORG-009.1** Outlet staff see only their own outlet's history.

| Boundary | Owner | Manager | Cashier | Waiter | Kitchen | Customer | SuperAdmin |
|---|---|---|---|---|---|---|---|
| Outlets visible | All authorized | Assigned | Current | Current | Current | Ordering outlet | All restaurants (platform) |
| Cross-outlet comparison | Yes | No | No | No | No | No | — |
| Restaurant configuration | Yes | Menu, tables/QR and staff only (§13.4) | No | No | No | No | Edit after provisioning |
| Day-to-day operations | Yes | Yes | Billing/payments | Service | Kitchen | Own order | No |

**Acceptance criteria**
- **PRD-RBAC-023.AC1** Given a Manager assigned only to Outlet A, when they request any Outlet B record or an organization-wide aggregate, then the request is denied and no Outlet B data is shown.
- **PRD-RBAC-025.AC1** Given a customer holding the link to order X, when they try to open order Y, then order Y is not shown.

## 9. Organization and Outlet Model

### Objective
Represent every restaurant as an organization with one or more outlets so data, operations and access stay correctly scoped.

### Actors
SuperAdmin, Owner, Manager, outlet staff.

### Preconditions
Organization provisioned (§10).

### Main Flow
1. SuperAdmin provisions an organization as single- or multi-outlet.
2. Owner configures outlets; staff are assigned to outlets.
3. All operations happen inside one outlet; Owner can view across outlets.

### Alternative Flows
- Outlet staff are reassigned to another outlet (§14).
- The Owner adds outlets after provisioning; a second outlet makes the organization multi-outlet automatically (PRD-ONB-015.1).

### Business Rules
- **PRD-ORG-001.1** An organization is the top-level tenant and has at least one outlet; a single-outlet restaurant is an organization with one outlet.
- **PRD-ORG-002.1** Central (organization) configuration and outlet-specific overrides coexist (e.g., menu price/availability — §19).
- **PRD-ORG-003.1** Every operational record (order, KOT, bill, payment, table, staff assignment, day close, feedback, audit event) belongs to exactly one organization and, where operational, one outlet. *also: SEC-001*
- **PRD-ORG-004.1** Access across outlets is granted only through permissions. *also: SEC-002*
- **PRD-ORG-005.1** Each outlet has exactly one kitchen operational context. *also: NG-004*
- **PRD-ORG-006.1** Owner sees all authorized outlets, cross-outlet customer/history and benchmarking.
- **PRD-ORG-007.1** Manager sees only assigned outlets; never a general HQ view.
- **PRD-ORG-010.1** After a staff member is reassigned, their past actions remain attributed to the outlet where they happened.
- **PRD-ORG-011.1** Business day, Day Close and cash reconciliation are per outlet; each outlet has its own running/closed business-day state. *also: DAY-016*

### Permissions
Outlet scope is the Outlet Access factor of §13.1. Cross-outlet comparison: ACT-ANL-02.

### State Changes
Outlet operational availability Open ↔ Closed (§9.2). Business-day state per outlet (§45).

### Error / Edge Cases
- Wrong outlet structure provisioned → SuperAdmin corrects configuration (PRD-ONB-008.1).
- Cross-outlet access attempt → denied (PRD-SEC-002.1).

### Acceptance Criteria
- **PRD-ORG-007.AC1** Given a Manager with Outlet A access, when Outlet B data is requested, then it is denied.
- **PRD-ORG-008.AC1** Given a Cashier in Outlet A, when Outlet B records are requested, then access is denied.
- **PRD-ORG-010.AC1** Given a Waiter reassigned from Outlet A to B, when Outlet A history is viewed by an authorized user, then the Waiter's past actions still show Outlet A, and the Waiter can no longer access Outlet A.
- **PRD-ORG-011.AC1** Given two outlets of one organization, when Outlet A performs Day Close, then Outlet B's business day is unaffected.

### 9.2 Outlet Operational Availability (Open / Closed)

#### Objective
Let authorized managers stop new orders at an outlet without ending the business day.

#### Actors
Owner, Manager (change state); all ordering roles and customers (affected).

#### Main Flow
1. Owner or Manager sets the outlet to Closed.
2. All channels stop accepting new orders; existing orders continue to completion.
3. Owner or Manager sets the outlet back to Open.

#### Business Rules
- **PRD-ORG-020.1** Each outlet is either Open or Closed for ordering.
- **PRD-ORG-021.1** While Closed, no new customer order can be created on any customer channel (table QR, tableless QR, website, WhatsApp, one-tap reorder); the customer is told ordering is unavailable. *also: CUSTOMER-018*
- **PRD-ORG-022.1** Closing an outlet is not Day Close, not a system start/end and needs no Start Day; the business day continues.
- **PRD-ORG-023.1** Billing is never blocked by the time of day.
- **PRD-ORG-024.1** While Closed, staff cannot create new orders either.
- **PRD-ORG-025.1** While Closed, already confirmed orders continue through kitchen, handoff and billing and can be completed.
- **PRD-ORG-026.1** While Closed, no new items can be added to an existing order.
- **PRD-ORG-027.1** While Closed, existing bills can be finalized and payment information recorded.
- **PRD-ORG-028.1** While Closed, the kitchen keeps processing existing confirmed orders.
- **PRD-ORG-029.1** While Closed, the website shows that the outlet is closed and accepts no new orders.
- **PRD-ORG-030.1** While Closed, the WhatsApp channel tells the customer the outlet is closed and accepts no new orders.
- **PRD-ORG-031.1** Only Owner and Manager can change the Open/Closed state.
- **PRD-ORG-032.1** There is no automatic Open/Closed transition based on configured operating hours in Phase 1; the Owner and Manager explicitly control the outlet state. *(OD-43)*
- **PRD-ORG-033.1** A customer order awaiting acceptance when the outlet closes stays visible as awaiting acceptance. While the outlet is Closed it cannot be accepted, rejected or become Confirmed; after the outlet reopens it can be accepted or rejected. Closing the outlet never cancels it automatically. *(OD-31)*
- **PRD-ORG-034.1** Outlet Closed blocks new business, not authorized corrections to existing business: while Closed, authorized users may reopen an existing finalized bill, make permitted corrections, record refunds and finalize the corrected bill, under the normal permission, state, reason and audit rules. *(OD-42)*

#### Permissions
ACT-AVA-01.

#### State Changes
Outlet: Open → Closed → Open. No business-day state change.

#### Acceptance Criteria
- **PRD-ORG-021.AC1** Given Outlet A is Closed, when a customer submits via table QR, tableless QR, website, WhatsApp or one-tap reorder, then no order is created and the customer sees that ordering is unavailable.
- **PRD-ORG-024.AC1** Given Outlet A is Closed, when a Waiter tries to create a new order, then it is refused.
- **PRD-ORG-025.AC1** Given an order Confirmed before closing, when the outlet closes, then the kitchen can still mark it Ready, the Waiter can mark it Served, and the Cashier can finalize its bill and record payment.
- **PRD-ORG-026.AC1** Given Outlet A is Closed, when anyone tries to add an item to an existing order, then it is refused.
- **PRD-ORG-022.AC1** Given Outlet A is Closed, then the business day is still running and Day Close is still available.
- **PRD-ORG-031.AC1** Given a Cashier, when they try to change Open/Closed, then it is denied.
- **PRD-ORG-033.AC1** Given a customer order awaiting acceptance when the outlet closes, then it stays visible as awaiting acceptance, any attempt to accept or reject it while Closed is refused, it is not cancelled, and after the outlet reopens it can be accepted or rejected.
- **PRD-ORG-034.AC1** Given the outlet is Closed, when a Cashier reopens a paid bill with a reason, corrects it and re-finalizes it, or records a refund, then each step succeeds and is audited.
- **PRD-ORG-032.AC1** Given configured operating hours pass, then the outlet's Open/Closed state does not change by itself.

## 10. SuperAdmin Onboarding

### Objective
Let SERVENA provision a restaurant and hand it to its Owner without SuperAdmin becoming part of daily operations.

### Actors
SuperAdmin; Owner (receives invitation).

### Preconditions
None (platform action). Restaurants cannot sign themselves up.

### Main Flow
```
Create Restaurant → Select Single/Multi Outlet → Create/Assign Owner → Basic Restaurant & Outlet Data
→ Provision → Onboarding Email/Invitation → Owner Login → Owner Operational Setup (§11)
```

### Alternative Flows
- Invitation email fails → SuperAdmin resends; the provisioned restaurant stays intact.
- Configuration was wrong → SuperAdmin edits it after provisioning.
- Restaurant must be stopped → SuperAdmin suspends or deactivates it.

### Business Rules
- **PRD-ONB-001.1** SuperAdmin creates the restaurant (organization).
- **PRD-ONB-002.1** SuperAdmin chooses single-outlet or multi-outlet structure.
- **PRD-ONB-003.1** SuperAdmin creates a new Owner or assigns an existing one.
- **PRD-ONB-004.1** SuperAdmin enters basic restaurant and outlet data.
- **PRD-ONB-005.1** SuperAdmin provisions the restaurant, making it available to its Owner.
- **PRD-ONB-006.1** On provisioning, the Owner receives an onboarding email/invitation.
- **PRD-ONB-007.1** SuperAdmin can view a restaurant's operational data.
- **PRD-ONB-008.1** SuperAdmin can edit restaurant configuration after provisioning.
- **PRD-ONB-009.1** SuperAdmin can suspend or deactivate a restaurant; this is a platform action and is never Day Close.
- **PRD-ONB-010.1** SuperAdmin can reset the Owner's credentials. *also: AUTH-004*
- **PRD-ONB-011.1** Provisioning never replaces the Owner's operational setup (menu, staff, tables, kitchen, channels).
- **PRD-ONB-012.1** There is no restaurant or Owner self-signup.
- **PRD-ONB-013.1** If email is unavailable, the provisioned account remains recoverable and onboarding can be retried. *also: INTEG-003*
- **PRD-ONB-014.1** Suspension is a platform-level state. While a restaurant is suspended no new business is possible — no new order can be created — but existing confirmed orders are not silently cancelled and may continue through kitchen, handoff and billing; existing bills may be finalized, paid and corrected under the normal authorization rules; all historical and audit data remain intact. Suspension never deletes data. *(OD-17)*
- **PRD-ONB-015.1** The Owner may add outlets after initial provisioning; a Manager cannot create outlets. When a single-outlet organization receives a second outlet it becomes multi-outlet automatically: the existing outlet is unchanged, the Owner's organization-level visibility follows the existing Owner rules (PRD-ORG-006.1), and the new outlet needs its own operational setup and activation before accepting orders (PRD-ONB-030.1, PRD-ONB-032.1). *(OD-16)*

### Permissions
SuperAdmin only (platform role, outside the restaurant permission catalogue). SuperAdmin suspension/deactivation and Owner credential resets are audited (§53).

### State Changes
Restaurant: Provisioned → (Suspended / Deactivated). Not related to any business-day state.

### Error / Edge Cases
Invitation not received · Owner credential reset · wrong outlet structure · outlet added after provisioning (PRD-ONB-015.1) · suspended during active operation (PRD-ONB-014.1).

### Acceptance Criteria
- **PRD-ONB-006.AC1** Given SuperAdmin provisions a restaurant with an Owner, when provisioning completes, then the Owner receives an invitation and can log in to start setup.
- **PRD-ONB-013.AC1** Given the invitation email fails, when SuperAdmin retries, then a new invitation is sent and no restaurant data is lost.
- **PRD-ONB-009.AC1** Given SuperAdmin suspends a restaurant, then the suspension is recorded in the audit trail and no Day Close is created.
- **PRD-ONB-014.AC1** Given a suspended restaurant, when anyone tries to create a new order, then it is refused; an order Confirmed before the suspension can still be prepared, handed off and billed; all existing orders, bills and audit records remain intact.
- **PRD-ONB-015.AC1** Given a single-outlet organization, when the Owner adds a second outlet, then the organization becomes multi-outlet, the first outlet is unchanged, and the new outlet cannot take orders until it is set up and activated; given a Manager tries to add an outlet, then it is refused.
- **PRD-ONB-012.AC1** Given a visitor without SuperAdmin provisioning, when they look for a way to create a restaurant, then none exists.

## 11. Owner Onboarding

### Objective
Guide the Owner from first login to an outlet that can take orders.

### Actors
Owner.

### Preconditions
Restaurant provisioned; Owner has logged in.

### Main Flow
1. Restaurant identity — name, brand, logo, contact.
2. Address/location and GST/tax information.
3. Restaurant type / cuisine template and operating configuration.
4. Outlet(s).
5. Menu — AI import (§57) or manual creation; review and approve AI-imported menu.
6. Staff, roles, outlet assignment and permissions.
7. Floor, tables and QR codes.
8. Kitchen stations and routing.
9. Payment information (accepted payment modes).
10. Ordering channels.
11. Verify the onboarding checklist and activate operations.

### Alternative Flows
- Owner uses a template to speed up setup.
- Owner starts with manual menu entry if AI import is unavailable (PRD-AI-041.1).

### Business Rules
- **PRD-ONB-020.1** Owner configures restaurant identity: name, brand, logo and contact information.
- **PRD-ONB-021.1** Owner configures address/location and GST/tax information.
- **PRD-ONB-022.1** Owner configures restaurant type / cuisine template and operating configuration.
- **PRD-ONB-023.1** Owner configures the outlet(s).
- **PRD-ONB-024.1** Owner imports a menu with AI or creates it manually, and must review and approve any AI-imported menu before it goes live.
- **PRD-ONB-025.1** Owner configures staff, roles, outlet assignments and permissions.
- **PRD-ONB-026.1** Owner configures floor, tables and QR codes.
- **PRD-ONB-027.1** Owner configures kitchen stations and the routing of menu items to stations.
- **PRD-ONB-028.1** Owner configures payment information (the payment modes the outlet records).
- **PRD-ONB-029.1** Owner configures which ordering channels are used.
- **PRD-ONB-030.1** Owner verifies an onboarding checklist and then activates operations.
- **PRD-ONB-031.1** Setup is guided, offers templates, and generates QR codes.
- **PRD-ONB-032.1** An outlet cannot accept any order before it is activated.
- **PRD-ONB-033.1** Mandatory activation checklist for an outlet *(PQ-05)*:
  1. Restaurant identity completed (PRD-ONB-020.1).
  2. Address and GST/tax information completed (PRD-ONB-021.1).
  3. Outlet configured (PRD-ONB-023.1).
  4. A published menu with at least one orderable item (PRD-ONB-024.1, PRD-MENU-008.1).
  5. Every published item mapped to a kitchen station (PRD-ONB-027.1, PRD-MENU-005.1).
  6. At least one payment mode configured (PRD-ONB-028.1).
  7. At least one ordering channel enabled (PRD-ONB-029.1).
  8. If table QR ordering is enabled: tables and table QR codes configured (PRD-ONB-026.1).
  Staff accounts are not mandatory for activation, and template use is optional. An outlet must nevertheless have the necessary operational staff and permissions before meaningful staff-operated ordering can occur (PRD-ONB-025.1).

### Permissions
Restaurant/outlet configuration: ACT-CFG-01. Tables/QR: ACT-TBL-05. Menu: ACT-MNU-01…03, ACT-AI-01/02/07. Staff: ACT-STF-01…05.

### State Changes
Outlet: Not activated → Activated (operations live).

### Error / Edge Cases
Incomplete onboarding · AI-imported menu has low-confidence fields (§57) · Owner leaves setup half done.

### Acceptance Criteria
- **PRD-ONB-030.AC1** Given mandatory checklist items are incomplete, when the Owner tries to activate, then activation is refused and the missing items are listed.
- **PRD-ONB-032.AC1** Given an outlet is not yet activated, when a customer scans its QR or staff try to create an order, then no order can be placed.
- **PRD-ONB-024.AC1** Given an AI-imported menu that is not approved, when the outlet is activated, then the unapproved items are not orderable.

## 12. Authentication

### Objective
Let restaurant users sign in simply and securely, and keep recovery under the restaurant's control.

### Actors
Owner, Manager, Cashier, Waiter, Kitchen Staff; SuperAdmin (Owner recovery). Customers do not sign in.

### Preconditions
User account exists and is active.

### Main Flow
1. User signs in with email + password or phone + password.
2. A user with more than one outlet chooses the outlet they are working in.

### Alternative Flows
- Staff member forgets password → Owner or Manager resets it.
- Owner forgets password → SuperAdmin resets it.

### Business Rules
- **PRD-AUTH-001.1** Restaurant users sign in with email or phone plus password.
- **PRD-AUTH-002.1** There is no 2FA in Phase 1. *also: NG-012*
- **PRD-AUTH-003.1** Staff credentials are created and reset by Owner or Manager (within their permissions).
- **PRD-AUTH-004.1** Owner credentials are reset by SuperAdmin.
- **PRD-AUTH-005.1** There is no self-service "forgot password" flow.
- **PRD-AUTH-006.1** Inactive or deactivated users cannot sign in or perform any action. *also: SEC-004*
- **PRD-AUTH-007.1** Credential and security actions are audited.
- **PRD-AUTH-008.1** A user with access to several outlets chooses a working outlet; all actions happen in that outlet's context.
- **PRD-AUTH-009.1** Customers have no accounts in Phase 1. Tableless QR and website orders capture name and phone without mandatory OTP; customers reach their orders through a private, non-guessable order link. *also: CUSTOMER-005*

### Permissions
Credential reset: ACT-STF-03 (Manager cannot reset Manager accounts unless granted — PRD-RBAC-029.1).

### State Changes
User: Active ↔ Inactive.

### Error / Edge Cases
Inactive user signs in · wrong credentials · user with no outlet assignment.

### Acceptance Criteria
- **PRD-AUTH-001.AC1** Given an active user, when they sign in with email+password, and separately with phone+password, then both succeed.
- **PRD-AUTH-006.AC1** Given an inactive user, when they sign in, then sign-in is refused without revealing whether the account exists.
- **PRD-AUTH-003.AC1** Given a Manager resets a Waiter's password, then the old password stops working and the reset appears in the audit trail.
- **PRD-AUTH-005.AC1** Given the sign-in screen, then there is no self-service password reset.

## 13. RBAC and Permissions

### Objective
Make every action available only to the right person, in the right outlet, on an object in the right state.

### 13.1 Authorization model
```
ACTUAL ACCESS = ROLE (default permission profile, customizable by Owner)
              + OUTLET ACCESS
              + PERMISSION (for the specific action)
              + CURRENT STATE (the object is in a state where the action is valid)
              + APPROVAL REQUIREMENT (if any)
```

### Business Rules
- **PRD-RBAC-001.1** Access starts from Role + Outlet Access + Permission Set.
- **PRD-RBAC-002.1** Every action is also checked against the object's Current State and any Approval Requirement; all five factors must pass. *also: RBAC-018*
- **PRD-RBAC-003.1** Every role has a default permission profile (§13.4).
- **PRD-RBAC-004.1** The Owner can customize permissions where supported (bounds: PRD-RBAC-005.1).
- **PRD-RBAC-006.1** Outlet assignment limits what data a user sees and where they can act.
- **PRD-RBAC-007.1** Permissions are enforced by the product itself; hiding a button is never the only protection.
- **PRD-RBAC-008.1** A refused action changes nothing — no partial updates.
- **PRD-RBAC-009.1** No role receives broader authority than the catalogue without an explicit product decision.
- **PRD-RBAC-010.1** Every permission change is audited.
- **PRD-RBAC-011.1** Permissions are organized in families: restaurant/outlet configuration · menu management · price/availability override · staff management · schedule/attendance/availability · table operations · order create/edit/cancel/void/hold · KOT/KDS actions · billing/finalization/reprint · discounts/service/packaging adjustments · refund/reopen/cancel · payment information · Day Close/reopen · customer/history access · AI capabilities · audit/reporting.
- **PRD-RBAC-012.1** The locked action matrix (edit menu, change price, cancel item, refund, reopen bill, Day Close, Reopen Day, mark Ready) is applied exactly.
- **PRD-RBAC-013.1** The default permission catalogue is §13.4.
- **PRD-RBAC-014.1** The only approval step in Phase 1 is Owner approval of an AI-imported menu before it goes live. All other sensitive actions are controlled by role, permission, state, reason and audit — no second-person approval.
- **PRD-RBAC-015.1** Each action's state preconditions are those listed in §13.4.
- **PRD-RBAC-016.1** When an action is refused, the user is told which factor failed — permission, outlet, state or approval — without revealing another outlet's data.
- **PRD-RBAC-017.1** No permission is inferred from a job title; only explicit catalogue assignments apply. *also: RBAC-030*
- **PRD-RBAC-027.1** A user who holds any action permission on an object can also view that object.
- **PRD-RBAC-028.1** "Manage tables" covers operational table actions — open, transfer, merge, split, move items, clear, reserve — for Owner and Manager; Waiters also open tables.
- **PRD-RBAC-029.1** Managers cannot manage Manager accounts or customize permissions unless the Owner grants it.
- **PRD-RBAC-005.1** The Owner customizes permissions only within the predefined catalogue (§13.4). The Owner cannot create new permission types, grant SuperAdmin capabilities, cross organization boundaries, or bypass outlet access, current-state rules or required approvals. Every change is audited (PRD-RBAC-010.1). A Manager can customize permissions only if the Owner explicitly granted that permission (PRD-RBAC-029.1). *(OD-12)*
- **PRD-RBAC-019.1** Every catalogue cell is decided: an action not explicitly granted to a role is denied. Customers act only on their own orders; SuperAdmin is outside the restaurant catalogue; the Owner may extend a role only through customization within the catalogue (PRD-RBAC-005.1). *(OD-45.1)*

### 13.2 Approval requirement
- Owner approval of AI-imported menu (ACT-AI-02) is the only approval step.
- No second-person approval exists for refunds, reopen, cancellation, Day Close or any other action (PRD-RBAC-014.1).

### 13.3 Current-state checks (examples)
| Action | Valid only when |
|---|---|
| Accept/reject customer order | Order is awaiting acceptance and the outlet is Open (PRD-ORG-033.1) |
| Add/edit items | Bill not Finalized; outlet Open |
| Reopen bill | Bill is Finalized (a Draft bill — even with payments — is corrected without Reopen, PRD-PAY-012.1) |
| Refund | Payment recorded on the bill |
| Day Close | Business day running |
| Reopen Day | It is the most recently closed day and the current running day has zero transactions (PRD-DAY-025.1) |
| Feedback | Order Completed |

### 13.4 Default permission catalogue

**Legend:** `Y` allowed · `N` not allowed (an action not explicitly granted is denied — PRD-RBAC-019.1) · `—` not applicable · `sys` system-performed. Customer actions are limited to the customer's own orders. "None" in Approval = no second-person approval.

#### 13.4.1 Ordering, acceptance, modification
| PRD ID | SPEC row | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PRD-ACT-ORD-01.1** | ACT-ORD-01 | Create dine-in (table) order | Y | Y | Y | Y | N | Y (table QR) | Outlet Open: customers ORG-021, staff ORG-024; if the table session already has an active order, items are added to it (TABLE-015) | — | OD-08 ("create staff order"), H§15 |
| **PRD-ACT-ORD-02.1** | ACT-ORD-02 | Create takeaway order | Y | Y | Y | Y | N | Y (tableless QR, website, WhatsApp) | Outlet Open (as above) | — | OD-08, LD-18, H§12 |
| **PRD-ACT-ORD-03.1** | ACT-ORD-03 | Capture customer name/phone | Y | Y | Y | Y | N | Y | Part of Create staff order / Edit order; mandatory for tableless QR (ORD-030) and website (ORD-042) | — | OD-08, H§16 |
| **PRD-ACT-ORD-04.1** | ACT-ORD-04 | View the outlet's active orders | Y | Y | Y | Y | Y | — | View implied by holding an order action (RBAC-027) | — | OD-45.2 |
| **PRD-ACT-ACC-01.1** | ACT-ACC-01 | Accept a customer-originated order | Y | Y | Y | Y | N | — | Order awaiting acceptance (ORD-008); outlet Open — while Closed it stays pending (ORG-033) | — | OD-08, OD-31 |
| **PRD-ACT-ACC-02.1** | ACT-ACC-02 | Reject a customer-originated order | Y | Y | Y | Y | N | — | Order awaiting acceptance; outlet Open (ORG-033); reason required | None | OD-08, OD-31 |
| **PRD-ACT-MOD-01.1** | ACT-MOD-01 | Add items to an existing order | Y | Y | Y | Y | N | Y (table QR, via acceptance ORD-008) | Bill not Finalized (BILL-004); outlet Open (ORG-026); added to the table's active order (TABLE-015) | — | OD-08, OD-35 |
| **PRD-ACT-MOD-02.1** | ACT-MOD-02 | Edit quantity / modifiers / notes ("Edit order") | Y | Y | Y | Y | N | N | Bill not Finalized; after KOT see ORD-086 | — | OD-08, H§17, OD-45.1 |
| **PRD-ACT-MOD-03.1** | ACT-MOD-03 | Hold item | Y | Y | N | N | N | — | Item not yet terminal; pauses progress without erasing history (ORD-073) | None | OD-15, OD-45.1 |
| **PRD-ACT-MOD-04.1** | ACT-MOD-04 | Void item | Y | Y | N | N | N | — | Reason required; once in kitchen processing follows cancellation state-safety (ORD-073, ORD-082, ORD-088) | None | OD-15, OD-45.1 |
| **PRD-ACT-MOD-05.1** | ACT-MOD-05 | Move items between tables | Y | Y | N | N | — | — | Creates auditable event; history and order/bill ownership preserved (TABLE-016, TABLE-017, TABLE-018) | — | OD-35, OD-45.3 ("Manage tables"), OD-46 |
| **PRD-ACT-MOD-06.1** | ACT-MOD-06 | Hold order | Y | Y | Y | Y | N | — | Entire order intentionally paused (ORD-073) | None | OD-08, OD-15 |
| **PRD-ACT-MOD-07.1** | ACT-MOD-07 | Void order | Y | Y | Y | N | N | — | Reason required; cancellation state-safety once in kitchen processing (ORD-073) | None | OD-08, OD-15 |
#### 13.4.2 KOT, kitchen, handoff, cancellation
| PRD ID | SPEC row | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PRD-ACT-KOT-01.1** | ACT-KOT-01 | Generate initial KOT | sys | sys | sys | sys | sys | — | Order Confirmed | — | H§13, H§15 |
| **PRD-ACT-KOT-02.1** | ACT-KOT-02 | Generate additional KOT | sys | sys | sys | sys | sys | — | Item added after initial KOT | — | H§14.1 |
| **PRD-ACT-KOT-03.1** | ACT-KOT-03 | Generate cancellation KOT/update | sys | sys | sys | sys | sys | — | Sent item cancelled (ORD-082) | — | H§14.2, OD-34 |
| **PRD-ACT-KOT-04.1** | ACT-KOT-04 | Re-fire item | Y | Y | N | N | Y | — | Existing preparation unusable or another preparation needed; original history kept (ORD-073) | None | OD-08, H§18, OD-15 |
| **PRD-ACT-KDS-01.1** | ACT-KDS-01 | Mark item/order Preparing | N | N | N | N | Y | — | Item New | — | OD-08 |
| **PRD-ACT-KDS-02.1** | ACT-KDS-02 | Mark item/order Ready | Y | Y | N | N | Y | — | Item not yet Ready | — | OD-08, H§36, LD-2 |
| **PRD-ACT-KDS-03.1** | ACT-KDS-03 | Escalate priority to HIGH/URGENT | N | Y | N | N | Y | — | Item not completed | — | H§18, OD-45.1 |
| **PRD-ACT-KDS-04.1** | ACT-KDS-04 | View the kitchen queue (KDS) | Y | Y | N | N | Y | — | — | — | OD-08 |
| **PRD-ACT-HND-01.1** | ACT-HND-01 | Mark item/order Served | N | N | N | Y | N | — | Ready; table associated | — | H§19, OD-45.1 |
| **PRD-ACT-HND-02.1** | ACT-HND-02 | Mark takeaway Picked Up | N | N | Y | Y | N | N | Ready; no table | — | H§19, OD-45.1, 2026-10-07 |
| **PRD-ACT-CAN-01.1** | ACT-CAN-01 | Cancel item | Y | Y | Y | Y | Y | N | By state (ORD-082): Pending → direct; Sent → cancellation KOT/event; Preparing/Ready → non-kitchen via request (ACT-CAN-06), Kitchen directly (ACT-CAN-04); Served/Picked Up → not allowed, use correction/refund. Reason: ORD-088 (Preparing/Ready), ORD-089 (others) | None | LD-MX, OD-08, OD-34 |
| **PRD-ACT-CAN-02.1** | ACT-CAN-02 | Cancel whole order | Y | Y | Y | Y | Y | N | Same per-item state rules; reason required (H§14.3) | None | OD-08, LD-3 |
| **PRD-ACT-CAN-03.1** | ACT-CAN-03 | Customer cancels own order before acceptance | — | — | — | — | — | N | Awaiting acceptance | — | not granted (OD-45.1) |
| **PRD-ACT-CAN-04.1** | ACT-CAN-04 | Kitchen operational cancellation of item(s) | N | N | N | N | Y | — | Unavailability or other valid operational reason; reason required; no request needed | None | OD-08 ("cancel kitchen item"), LD-3, OD-34 |
| **PRD-ACT-CAN-05.1** | ACT-CAN-05 | Kitchen operational cancellation of whole order | N | N | N | N | Y | — | As ACT-CAN-04 | None | OD-08, LD-3, LD-21 |
| **PRD-ACT-CAN-06.1** | ACT-CAN-06 | Request cancellation of a Preparing/Ready item | Y | Y | Y | Y | — | — | Item Preparing or Ready; reason required | None | OD-34 (non-kitchen holders of Cancel item) |
| **PRD-ACT-CAN-07.1** | ACT-CAN-07 | Acknowledge (accept or decline) a cancellation request | N | N | N | N | Y | — | Request open; accept → item Cancelled; decline → item stays active; if the item reaches Served/Picked Up first the request becomes a no-op (ORD-093) | — | OD-34, OD-44, OD-45.1 |
#### 13.4.3 Bill and payment information
| PRD ID | SPEC row | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PRD-ACT-BIL-09.1** | ACT-BIL-09 | Create bill | Y | Y | Y | Y | N | — | One bill per order (BILL-015) | — | OD-08 |
| **PRD-ACT-BIL-01.1** | ACT-BIL-01 | Open/review active bill ("View bill") | Y | Y | Y | Y | N | Y (own order, via private link) | — | — | OD-08, H§22, CUSTOMER-001 |
| **PRD-ACT-BIL-02.1** | ACT-BIL-02 | Apply discount | Y | Y | Y | N | N | — | Bill not Finalized | None | OD-45.1, 2026-10-07 |
| **PRD-ACT-BIL-03.1** | ACT-BIL-03 | Apply/adjust service or packaging charge | Y | Y | Y | N | N | — | Bill not Finalized | None | OD-45.1, 2026-10-07 |
| **PRD-ACT-BIL-04.1** | ACT-BIL-04 | Finalize bill | Y | Y | Y | Y | N | — | Bill Draft or Reopened; allowed while outlet Closed (ORG-027) | — | OD-08, H§22 |
| **PRD-ACT-BIL-05.1** | ACT-BIL-05 | Reopen bill | Y | Y | Y | Y | N | — | Bill Finalized (paid or not); allowed while outlet Closed (ORG-034); Draft bills are corrected without Reopen (PAY-012) | None | LD-MX, OD-08, OD-42 |
| **PRD-ACT-BIL-06.1** | ACT-BIL-06 | Cancel bill | Y | Y | Y | N | N | — | — | None | OD-08 |
| **PRD-ACT-BIL-07.1** | ACT-BIL-07 | Refund (partial/full) | Y | Y | Y | N | N | — | Payment recorded; allowed while outlet Closed (ORG-034) | None | LD-MX, OD-08, OD-42 |
| **PRD-ACT-BIL-08.1** | ACT-BIL-08 | Print / provide digital bill / reprint | N | N | Y | N | N | N | Reprint never mutates data (BILL-009) | — | H§22, OD-45.1 |
| **PRD-ACT-PAY-01.1** | ACT-PAY-01 | Record payment information | Y | Y | Y | N | N | — | Independent of finalization; Draft bills may receive payments (PAY-010, PAY-012); allowed while Closed (ORG-027) | — | OD-08, H§22 |
| **PRD-ACT-PAY-02.1** | ACT-PAY-02 | Correct payment information | Y | Y | Y | N | N | — | — | None | OD-45.1, 2026-10-07 |
#### 13.4.4 Tables, menu, configuration
| PRD ID | SPEC row | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PRD-ACT-TBL-01.1** | ACT-TBL-01 | Open table (starts the table session) | Y | Y | N | Y | — | — | Table Available; one active session per table (TABLE-014) | — | H§17, OD-45.3 |
| **PRD-ACT-TBL-03.1** | ACT-TBL-03 | Clear table / set Cleaning / Available | Y | Y | N | N | — | — | Transition table DF-03 | — | OD-45.3 |
| **PRD-ACT-TBL-04.1** | ACT-TBL-04 | Set table Reserved | Y | Y | N | N | — | — | — | — | H§11, OD-45.3 |
| **PRD-ACT-TBL-05.1** | ACT-TBL-05 | Configure floor, tables, QR ("Manage tables", "Manage QR") | Y | Y | N | N | N | — | — | — | OD-08, H§6 |
| **PRD-ACT-TBL-06.1** | ACT-TBL-06 | Transfer table | Y | Y | N | N | — | — | Auditable event; history preserved (TABLE-016, TABLE-017) | — | OD-35, OD-45.3 |
| **PRD-ACT-TBL-07.1** | ACT-TBL-07 | Merge / split tables | Y | Y | N | N | — | — | Auditable event; history preserved; order/bill ownership unchanged (TABLE-018) | — | OD-35, OD-45.3, OD-46 |
| **PRD-ACT-MNU-01.1** | ACT-MNU-01 | Edit menu | Y | Y | N | N | N | — | — | — | LD-MX, OD-08 |
| **PRD-ACT-MNU-02.1** | ACT-MNU-02 | Change price | Y | Y | N | N | N | — | — | None | LD-MX, OD-08 |
| **PRD-ACT-MNU-03.1** | ACT-MNU-03 | Change availability / outlet menu override | Y | Y | N | N | N | — | Temporary (current business day, ends at Day Close) or permanent until changed (MENU-011) | — | OD-08, H§7, OD-25 |
| **PRD-ACT-CFG-01.1** | ACT-CFG-01 | Restaurant / outlet configuration | Y | N | N | N | N | — | — | — | H§6, H§22, OD-45.1 |
#### 13.4.5 Staff, attendance, availability
| PRD ID | SPEC row | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PRD-ACT-STF-01.1** | ACT-STF-01 | Create / edit / deactivate staff | Y | Y | N | N | N | — | Within actor's outlet access; Manager over Manager accounts → ACT-STF-02 | None | OD-08 |
| **PRD-ACT-STF-02.1** | ACT-STF-02 | Manage Manager accounts | Y | N (Owner may grant via customization) | N | N | N | — | — | None | H§6, OD-45.4 |
| **PRD-ACT-STF-03.1** | ACT-STF-03 | Reset staff credentials | Y | Y (not for Manager accounts unless granted) | N | N | N | — | — | None | LD-38, OD-45.4 |
| **PRD-ACT-STF-04.1** | ACT-STF-04 | Assign / reassign staff outlet | Y | Y (within authorized scope) | N | N | N | — | Manager: source and target outlets within scope | None | OD-08, LD-34 |
| **PRD-ACT-STF-05.1** | ACT-STF-05 | Customize permissions | Y | N (Owner may grant via customization) | N | N | N | — | Within the catalogue only (RBAC-005) | None | LD-40, OD-45.4, OD-12 |
| **PRD-ACT-STF-06.1** | ACT-STF-06 | View staff list and status | Y | Y | N (own record only) | N (own record only) | N (own record only) | — | View implied by staff actions (RBAC-027) | — | OD-45.2 |
| **PRD-ACT-ATT-01.1** | ACT-ATT-01 | Record attendance | Y | Y | N | N | N | — | — | — | OD-08 |
| **PRD-ACT-ATT-02.1** | ACT-ATT-02 | Manage schedule | Y | Y | N | N | N | — | — | — | OD-08 |
| **PRD-ACT-ATT-03.1** | ACT-ATT-03 | View own attendance | — | Y | Y | Y | Y | — | Own record only | — | OD-08 |
| **PRD-ACT-ATT-04.1** | ACT-ATT-04 | View staff attendance | Y | Y | N | N | N | — | Within outlet access | — | OD-08 |
| **PRD-ACT-AVL-01.1** | ACT-AVL-01 | Change own availability | Y | Y | Y | Y | Y | — | Absent + Available invalid (STAFF-007) | — | LD-32, OD-08 |
| **PRD-ACT-AVL-02.1** | ACT-AVL-02 | Change another staff member's availability | Y | Y (own outlets) | N | N | N | — | Same | — | LD-32, OD-08 |
#### 13.4.6 Day close, cash, outlet availability
| PRD ID | SPEC row | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PRD-ACT-DAY-01.1** | ACT-DAY-01 | Review running-day totals before close | Y | Y | Y | N | N | — | Day running | — | H§26, OD-08, OD-45.1 |
| **PRD-ACT-DAY-02.1** | ACT-DAY-02 | Day Close | Y | Y | Y | N | N | — | Day running; unresolved items → warnings + explicit confirmation (DAY-012) | None | LD-8, LD-MX, OD-08 |
| **PRD-ACT-DAY-03.1** | ACT-DAY-03 | Reopen Day | Y | Y | Y | N | N | — | Most recently closed day only (DAY-015); **blocked if the running day has any transaction (DAY-021, DAY-025)** | None | LD-11, LD-MX, OD-08, OD-32, OD-47 |
| **PRD-ACT-CSH-01.1** | ACT-CSH-01 | Enter counted cash at close ("Cash reconciliation") | Y | Y | Y | N | N | — | Part of Day Close | — | OD-08, H§26 |
| **PRD-ACT-CSH-02.1** | ACT-CSH-02 | View expected cash / variance ("View cash reconciliation") | Y | Y | Y | N | N | — | — | — | OD-08 |
| **PRD-ACT-AVA-01.1** | ACT-AVA-01 | Change outlet Open/Closed | Y | Y | N | N | N | — | Manual only; no automatic transition (ORG-032) | — | OD-02, OD-43 |
#### 13.4.7 Analytics, AI, customer, feedback
| PRD ID | SPEC row | Action | Own | Mgr | Csh | Wtr | Kit | Cust | Current-state precondition | Approval | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PRD-ACT-ANL-01.1** | ACT-ANL-01 | View outlet dashboard | Y | Y (own outlets) | N | N | N | — | — | — | H§7, H§31, OD-45.1 |
| **PRD-ACT-ANL-02.1** | ACT-ANL-02 | View cross-outlet comparison | Y | N | N | N | N | — | — | — | LD-35, LD-36, LD-37 |
| **PRD-ACT-ANL-03.1** | ACT-ANL-03 | View unresolved bills | Y | Y | Y | Y | N | — | Cashier/Waiter: view implied by bill actions (RBAC-027) | — | LD-4, OD-45.2, OD-45.1 |
| **PRD-ACT-ANL-04.1** | ACT-ANL-04 | Review / act / dismiss / resolve Attention item | Y | Y (own outlets) | N | N | N | — | Item open | — | H§32, OD-18 |
| **PRD-ACT-ANL-05.1** | ACT-ANL-05 | View audit trail | N | N | N | N | N | — | **SuperAdmin only** (platform role, not a restaurant column) | — | OD-45.1, 2026-10-07 |
| **PRD-ACT-AI-01.1** | ACT-AI-01 | Upload menu source for AI import | Y | N | N | N | N | — | — | — | H§6, LD-MX, OD-45.1 |
| **PRD-ACT-AI-07.1** | ACT-AI-07 | Edit AI-imported draft before approval | Y | N | N | N | N | — | Draft not yet approved | — | H§10, LD-MX, OD-45.1 |
| **PRD-ACT-AI-02.1** | ACT-AI-02 | Approve AI-imported menu for publishing | Y | N | N | N | N | — | Draft reviewed | **Owner approval** | H§33.1, OD-45.1 |
| **PRD-ACT-AI-03.1** | ACT-AI-03 | Use Owner Agent (answer, analyze, recommend) | Y | N | N | N | N | — | Authorized data only (AI-020…024) | — | H§33, OD-10, OD-45.1 |
| **PRD-ACT-AI-08.1** | ACT-AI-08 | Owner Agent executes a permitted action | Y | N | N | N | N | — | Explicitly permitted action through a controlled tool; the action's own permission, state and audit rules apply (AI-029) | Owner confirmation for sensitive actions (AI-029) | OD-10, OD-37 |
| **PRD-ACT-AI-04.1** | ACT-AI-04 | Receive / view Daily AI Brief | Y | Y (own outlets) | N | N | N | — | Outlet business day (AI-026) | — | H§33, OD-18 |
| **PRD-ACT-AI-05.1** | ACT-AI-05 | Use What Changed? | Y | Y (own outlets) | N | N | N | — | Most recent comparable completed business day; unavailable if none (AI-028) | — | H§33, OD-18, OD-29 |
| **PRD-ACT-AI-06.1** | ACT-AI-06 | Order via WhatsApp Ordering Agent | — | — | — | — | — | Y | Outlet Open; acceptance (ORD-008) | — | H§33, OD-01 |
| **PRD-ACT-CUS-01.1** | ACT-CUS-01 | View customer history | Y (all outlets) | Y (own outlets) | Y (own outlet) | Y (own outlet) | Y (own outlet) | — | Outlet-scoped (CUSTOMER-004); organization-scope phone matching never widens visibility (CUSTOMER-021) | — | H§7, CUSTOMER-004, OD-38 |
| **PRD-ACT-CUS-02.1** | ACT-CUS-02 | Track own order | — | — | — | — | — | Y | Via private non-guessable link (AUTH-009) | — | H§23, H§37, OD-20 |
| **PRD-ACT-CUS-03.1** | ACT-CUS-03 | One-tap reorder | — | — | — | — | — | Y | Via private link (CUSTOMER-016); Completed order with reorderable items (CUSTOMER-020); outlet Open | — | H§25, OD-09, OD-36 |
| **PRD-ACT-FB-01.1** | ACT-FB-01 | Submit feedback | — | — | — | — | — | Y | Order Completed (ORD-063); customer order with an order-access link | — | H§24, PQ-08 (A1) |
| **PRD-ACT-FB-02.1** | ACT-FB-02 | View feedback | Y | Y (own outlets) | N | N | N | — | — | — | H§24, OD-45.1 |

SPEC row ACT-TBL-02 was withdrawn in SPEC v0.4 (split into ACT-TBL-06 / ACT-TBL-07) and has no PRD entry. SuperAdmin is outside this catalogue; it alone views the audit trail (ACT-ANL-05).

### Acceptance Criteria
- **PRD-RBAC-012.AC1** Given a default-permission user of each role, when they attempt each action in §13.4, then every `Y` succeeds (if state allows) and every `N` is refused with no change.
- **PRD-RBAC-007.AC1** Given a hidden action, when an unauthorized user attempts it by any other means, then it is refused.
- **PRD-RBAC-010.AC1** Given the Owner revokes a Cashier's Refund permission, when the Cashier attempts a refund, then it is refused and the permission change is in the audit trail.
- **PRD-RBAC-016.AC1** Given a Cashier attempts Reopen Day while the running day has transactions, then the message says the state check failed.
- **PRD-RBAC-005.AC1** Given the Owner customizes a Waiter's permissions, then only catalogue permissions can be granted; no grant can reach another organization or an outlet the Waiter is not assigned to, and no SuperAdmin capability can be granted.
- **PRD-RBAC-029.AC1** Given a Manager without an Owner grant, when they try to create a Manager account or change permissions, then it is refused.

## 14. Staff Management

### Objective
Let Owners and Managers maintain the right people in the right outlets with the right permissions.

### Actors
Owner, Manager (within scope); staff (self-service availability).

### Preconditions
Outlet exists.

### Main Flow
1. Owner/Manager creates a staff member with role, outlet and permissions.
2. Owner/Manager edits, deactivates or reassigns the staff member when needed.

### Alternative Flows
- Staff member moves to another outlet (reassignment).
- Staff member is deactivated and can no longer sign in.

### Business Rules
- **PRD-STAFF-001.1** Schedule, attendance and availability are three separate dimensions of a staff member (§15–§17).
- **PRD-STAFF-009.1** Staff status is operational only; it is not payroll or overtime data, and SERVENA does no payroll in Phase 1.
- **PRD-STAFF-010.1** Cashier, Waiter and Kitchen Staff can be moved to another outlet through staff management. *also: ORG-008*
- **PRD-STAFF-011.1** Every outlet reassignment is audited.
- **PRD-STAFF-012.1** A Manager manages staff only in their authorized outlets.
- **PRD-STAFF-013.1** Setting a staff member On Break or Unavailable prevents new assignments to them, never silently cancels their current work, and keeps existing work attributed to them. Authorized users may explicitly reassign work only through existing staff, table and order operations; nothing is reassigned implicitly, and there is no separate work-assignment subsystem. *(OD-26)*

### Permissions
ACT-STF-01…06. Manager accounts and permission customization: Owner (Manager only if granted — PRD-RBAC-029.1).

### State Changes
Staff: Active ↔ Inactive; outlet assignment changes (audited).

### Error / Edge Cases
Reassigned staff · inactive staff signs in (PRD-AUTH-006.1) · Manager acting outside their outlets (denied).

### Acceptance Criteria
- **PRD-STAFF-010.AC1** Given a Kitchen Staff member reassigned from A to B, when they sign in, then they see only Outlet B's kitchen.
- **PRD-STAFF-011.AC1** Given a reassignment, then the audit trail records who, when, the previous outlet and the new outlet.
- **PRD-STAFF-012.AC1** Given a Manager of Outlet A, when they try to edit a staff member of Outlet B, then it is refused.
- **PRD-STAFF-013.AC1** Given a Waiter with open orders goes On Break, then those orders are unchanged and still attributed to the Waiter, and nothing is reassigned automatically.

## 15. Staff Schedule

### Objective
Record when each staff member is planned to work.

### Actors
Owner, Manager.

### Business Rules
- **PRD-STAFF-002.1** A schedule is a planned working period (e.g., 10:00–19:00) and is independent of attendance and availability.

### Permissions
ACT-ATT-02.

### Acceptance Criteria
- **PRD-STAFF-002.AC1** Given a Waiter scheduled 10:00–19:00, when their availability changes to On Break, then the schedule is unchanged.

## 16. Attendance

### Objective
Record whether staff actually attended.

### Actors
Owner, Manager (record); each staff member (view own).

### Business Rules
- **PRD-STAFF-003.1** Attendance is Present or Absent.
- **PRD-STAFF-008.1** Marking a staff member Absent sets their availability to Unavailable.

### Permissions
ACT-ATT-01, ACT-ATT-03, ACT-ATT-04.

### Acceptance Criteria
- **PRD-STAFF-008.AC1** Given a staff member who is Available, when they are marked Absent, then their availability becomes Unavailable.

## 17. Availability

### Objective
Show who can take operational work right now.

### Actors
Each staff member (self); Owner, Manager (others).

### Business Rules
- **PRD-STAFF-004.1** Availability is Available, On Break or Unavailable.
- **PRD-STAFF-005.1** Availability can be changed by the Owner, a Manager (own outlets) and the staff member themselves — nobody else.
- **PRD-STAFF-006.1** On Break means the staff member is currently unavailable for operational work.
- **PRD-STAFF-007.1** The product never stores an invalid combination such as Absent + Available.

### Permissions
ACT-AVL-01, ACT-AVL-02.

### State Changes
Available ↔ On Break ↔ Unavailable (Absent forces Unavailable).

### Acceptance Criteria
- **PRD-STAFF-005.AC1** Given a Waiter, when they try to change another staff member's availability, then it is refused.
- **PRD-STAFF-006.AC1** Given a Waiter sets themselves On Break, then they are shown as unavailable for operational work.
- **PRD-STAFF-007.AC1** Given any sequence of attendance and availability changes, then Absent + Available is never shown or stored.

## 18. Menu Management

### Objective
Give every outlet an accurate, published menu that all ordering channels use.

### Actors
Owner, Manager (edit); all ordering roles and customers (consume).

### Preconditions
Organization provisioned.

### Main Flow
1. Owner/Manager creates categories and subcategories.
2. Creates items with description, image, price, tax and veg/non-veg marker.
3. Adds variants/portion sizes and add-on/modifier groups.
4. Maps each item to a kitchen station and sets preparation time and order-type availability.
5. Publishes the approved menu.

### Alternative Flows
- Menu is created through AI Menu Import and approved by the Owner (§57).

### Business Rules
- **PRD-MENU-001.1** The menu is organized into categories and subcategories.
- **PRD-MENU-002.1** Each item has description, image, price, tax and a veg/non-veg marker.
- **PRD-MENU-003.1** Items can have variants / portion sizes.
- **PRD-MENU-004.1** Items can have add-on/modifier groups, including spice, preparation, dietary, add-on, packaging and free-form customer notes.
- **PRD-MENU-005.1** Each item is mapped to a kitchen station. *also: KOT-006*
- **PRD-MENU-006.1** Each item has a preparation time.
- **PRD-MENU-007.1** Each item states which order types it is available for (dine-in / takeaway).
- **PRD-MENU-008.1** Only published (approved) menu data is visible to ordering channels.
- **PRD-MENU-012.1** Only Owner and Manager can edit the menu or change prices.
- **PRD-MENU-013.1** Every price or availability change is audited.
- **PRD-MENU-015.1** If an item becomes unavailable after a customer added it to their cart, the order is not placed with that item silently; the customer is told which item is unavailable.
- **PRD-MENU-016.1** A modifier becoming unavailable after an order was created does not change that order.
- **PRD-MENU-017.1** When an item is added to an order, the order line captures its commercial values — item price and applicable tax information. Later menu price or tax configuration changes never change that order line. *(OD-22)*

### Permissions
ACT-MNU-01, ACT-MNU-02, ACT-MNU-03.

### State Changes
Menu data: Draft → Published.

### Error / Edge Cases
Item sold out during checkout · modifier unavailable after ordering · tax configuration changed after orders exist (PRD-MENU-017.1) · AI import low-confidence data (§57).

### Acceptance Criteria
- **PRD-MENU-012.AC1** Given a Cashier, when they try to change a price, then it is refused.
- **PRD-MENU-015.AC1** Given an item in a customer's cart becomes unavailable, when they submit, then the item is not ordered and the customer is told which item was unavailable.
- **PRD-MENU-008.AC1** Given an unpublished item, then no channel offers it.
- **PRD-MENU-017.AC1** Given an item added at ₹200 with 5% tax, when the price changes to ₹220 before billing, then the existing order still bills ₹200 at 5%.
- **PRD-MENU-013.AC1** Given a Manager changes an item price, then the audit trail shows who, when, old price and new price.

## 19. Outlet Menu Overrides

### Objective
Let each outlet differ from the central menu on price and availability.

### Actors
Owner, Manager (authorized outlets).

### Main Flow
1. Owner/Manager selects an outlet and an item.
2. Sets an outlet price and/or marks the item unavailable — temporarily for the current business day, or permanently.

### Business Rules
- **PRD-MENU-009.1** Each outlet can override an item's price and availability.
- **PRD-MENU-010.1** Overrides are made by the Owner and authorized Managers.
- **PRD-MENU-011.1** A Manager can change an item's availability for their outlet, temporarily (current business day) or permanently.
- **PRD-MENU-011.2** A menu-item availability override is either **temporary** — for the outlet's current business day as defined by Day Close; it stops applying when that day is closed, never at midnight — or **permanent** until explicitly changed. This rule concerns menu-item availability only, not staff availability. *(OD-25)*
- **PRD-MENU-014.1** An item can be unavailable at one outlet and available at another.

### Permissions
ACT-MNU-03.

### Acceptance Criteria
- **PRD-MENU-009.AC1** Given a central price of ₹200 and an Outlet A override of ₹220, when an order is placed at Outlet A, then ₹220 applies; at other outlets ₹200 applies.
- **PRD-MENU-014.AC1** Given an item unavailable at Outlet A, when a customer orders at Outlet B, then the item is offered there.
- **PRD-MENU-011.AC1** Given a Manager marks an item unavailable for the day at 18:00 and Day Close happens at 01:30, then the item stays unavailable until 01:30 and is available again in the next business day; given a permanent override, it stays unavailable until changed.

## 20. Table and Floor Management

### Objective
Represent the floor so staff always know which tables are free, in use or being billed, and can move guests without losing history.

### Actors
Owner, Manager (manage tables); Waiter (open tables); customers (table QR).

### Preconditions
Floor and tables configured (§11).

### Main Flow
1. A table is opened — a table session starts and the table becomes Occupied.
2. Orders for the table go into its one active order.
3. The bill is prepared — table in Billing.
4. Guests leave — table cleared (Cleaning) and becomes Available.

### Alternative Flows
- Transfer the session to another table.
- Merge two tables or split one.
- Move items between tables.
- Mark a table Reserved (a manual flag; there is no booking feature).

### Business Rules
- **PRD-TABLE-001.1** A table is Available, Occupied, Billing, Cleaning or Reserved.
- **PRD-TABLE-002.1** The typical cycle is Available → Occupied → Billing → Cleared → Available.
- **PRD-TABLE-003.1** Reserved is a manual state; there is no customer reservation-booking feature.
- **PRD-TABLE-004.1** Table operations are: open, add items, transfer, merge, split, move items, reopen bill, clear. *also: TABLE-012*
- **PRD-TABLE-005.1** A table QR identifies the outlet and the table.
- **PRD-TABLE-006.1** A tableless QR identifies the outlet only and carries no table.
- **PRD-TABLE-007.1** An abandoned Draft never occupies a table permanently: when it becomes abandoned under the inactivity policy, its table occupancy/session claim is released; the Draft itself is not deleted (PRD-ORD-064.2). *(OD-14)*
- **PRD-TABLE-008.1** If two staff change the same table or order at the same time, no update is lost and the second person is told the data changed.
- **PRD-TABLE-009.1** Transferring a table while a KOT is active keeps the KOT history and the kitchen sees the new table.
- **PRD-TABLE-010.1** Items can be added to a table in Billing only while its bill is not Finalized.
- **PRD-TABLE-011.1** A table's last bill stays reachable after it is paid (for reprint or correction).
- **PRD-TABLE-014.1** A table has at most one active table session.
- **PRD-TABLE-015.1** A table session has one active order; new items are added to it. *also: ORD-091*
- **PRD-TABLE-016.1** Move, merge and split each create an auditable operational event.
- **PRD-TABLE-017.1** Table operations never rewrite history: the current table association may change, but earlier associations remain visible.
- **PRD-TABLE-018.1** The order is the billing ownership boundary: a bill belongs to its order. Transfer, merge, split and move-items change the current table association while preserving each order's and bill's identity and every historical association, including where moved items were originally ordered. A finalized bill is never silently reassigned to another order and historical bill ownership never changes; if a restructuring needs a billing change, the authorized billing correction / Reopen workflow is used. No silent duplicate bills are created. *(OD-46)*

### Permissions
ACT-TBL-01, ACT-TBL-03…07, ACT-MOD-05. "Manage tables" (Owner, Manager) covers all operational table actions; Waiters also open tables (PRD-RBAC-028.1).

### State Changes
Table: Available → Occupied → Billing → Cleaning → Available; Reserved set manually. Table session: started on open, ended on clear.

### Error / Edge Cases
Occupied with no active order (clear table) · concurrent edits · transfer during active KOT · merged table with several order contexts (PRD-TABLE-018.1) · item added while table in Billing · old paid bill · abandoned draft.

### Acceptance Criteria
- **PRD-TABLE-014.AC1** Given Table 5 has an active session, when someone tries to open a second session on Table 5, then it is refused and the existing session is used.
- **PRD-TABLE-015.AC1** Given Table 5 has an active order, when a customer submits again from Table 5's QR, then the items join the existing order (after acceptance).
- **PRD-TABLE-009.AC1** Given an active KOT on Table 5, when the table is transferred to Table 8, then the KDS shows Table 8 and the KOT history is unchanged.
- **PRD-TABLE-016.AC1** Given a Manager merges Tables 3 and 4, then an audit event records actor, time and the before/after associations.
- **PRD-TABLE-017.AC1** Given items were moved from Table 3 to Table 4, then Table 3's history still shows the items were originally ordered there.
- **PRD-TABLE-008.AC1** Given two staff edit the same order at once, then one change succeeds and the other is told the order changed; nothing is silently overwritten.
- **PRD-TABLE-010.AC1** Given a table in Billing with a Finalized bill, when an item is added, then it is refused until the bill is reopened.
- **PRD-TABLE-007.AC1** Given a Draft on a table becomes abandoned under the inactivity policy (threshold: TRD), then the table is no longer held by it, the Draft still exists and is identifiable as Draft, and no KOT or sale exists.
- **PRD-TABLE-018.AC1** Given Table 3's order has a finalized bill, when Tables 3 and 4 are merged, then that bill still belongs to Table 3's order, no new or duplicate bill is created, the merge is recorded as an auditable event, and any billing change requires reopening the bill.

## 21. QR Ordering

### Objective
Let customers order from their own phone using a QR code.

### Actors
Customer; accepting staff.

### Business Rules
- Two QR types exist: **table QR** (outlet + table, §22) and **tableless QR** (outlet only, §23). *(PRD-TABLE-005.1, PRD-TABLE-006.1)*
- **PRD-ORD-007.1** An order placed through a QR stays bound to the organization, outlet and (if any) table of that QR.
- **PRD-ORD-022.1** The customer can track their order's status. *also: CUSTOMER-015*
- **PRD-ORD-062.1** A customer order waiting for staff acceptance is shown to staff and customer as "awaiting acceptance".
- All customer ordering stops while the outlet is Closed (PRD-ORG-021.1) or not yet activated (PRD-ONB-032.1).

### Acceptance Criteria
- **PRD-ORD-007.AC1** Given a QR for Outlet A Table 5, when an order is placed, then it belongs to Outlet A, Table 5 and can never appear under another outlet.
- **PRD-ORD-022.AC1** Given a submitted order, when its state changes, then the customer's order view shows the new status.

## 22. Table QR Ordering

### Objective
Let seated customers order directly to their table.

### Actors
Customer; Owner/Manager/Cashier/Waiter (acceptance); Kitchen; Waiter (service).

### Preconditions
Outlet activated and Open; table QR valid.

### Main Flow
```
Scan table QR → outlet + table identified → menu → build order → submit → staff receives it
→ staff accepts → Confirmed → KOT sent → kitchen prepares → Ready → waiter serves
→ bill finalized → payment information recorded → Completed → feedback offered
```
(Completion is governed by PRD-ORD-063.1, not by the bill; the order above is the typical sequence.)

### Alternative Flows
- Staff rejects the order with a reason.
- The table already has an active order — the new items join it (PRD-TABLE-015.1).
- Customer adds more items later — they need acceptance and generate an additional KOT.

### Business Rules
- **PRD-ORD-020.1** A table QR order follows the flow above, including staff acceptance before it becomes Confirmed.
- **PRD-ORD-021.1** Name and phone are not required for table QR orders unless the selected flow asks for customer details.
- Acceptance rules: PRD-ORD-008.1.

### Permissions
Customer creates (own order); acceptance ACT-ACC-01/02.

### State Changes
Draft (awaiting acceptance) → Confirmed → KOT Sent → … (§29).

### Error / Edge Cases
Double submit (PRD-ORD-006.1) · item sold out during checkout (PRD-MENU-015.1) · outlet Closed (PRD-ORG-021.1) · network lost during submit (§55).

### Acceptance Criteria
- **PRD-ORD-020.AC1** Given a customer submits from a table QR, then the order shows as awaiting acceptance and no KOT exists yet.
- **PRD-ORD-020.AC2** Given staff accepts it, then it becomes Confirmed and a KOT showing the table number reaches the KDS.
- **PRD-ORD-021.AC1** Given a table QR order, when the customer submits without name or phone, then it is accepted for submission.

## 23. Tableless QR Ordering

### Objective
Let customers order from a QR that is not tied to a table — always as Takeaway.

### Actors
Customer; accepting staff; Kitchen; Waiter/Cashier (handoff).

### Preconditions
Outlet activated and Open.

### Main Flow
1. Customer scans the outlet's tableless QR.
2. Builds the order; enters **name and phone** (no OTP).
3. Submits; order awaits staff acceptance.
4. After acceptance it is Confirmed as Takeaway and continues to KOT, kitchen and handoff (Picked Up).

### Business Rules
- **PRD-ORD-030.1** The customer must enter name and phone number before placing the order.
- **PRD-ORD-031.1** No OTP or other verification is required. *also: NG-012*
- **PRD-ORD-032.1** The order has no table and is Takeaway.
- **PRD-ORD-033.1** Name and phone are stored with the order and the customer's history.

### Acceptance Criteria
- **PRD-ORD-030.AC1** Given a tableless QR order, when name or phone is missing, then submission is refused with a message for the missing field.
- **PRD-ORD-031.AC1** Given name and phone are entered, when the customer submits, then no OTP is requested and the order awaits acceptance.
- **PRD-ORD-032.AC1** Given the order is accepted, then staff screens, KOT, KDS and bill all show it as Takeaway.

## 24. Takeaway

### Objective
Handle every order without a table consistently, whoever placed it.

### Actors
Customer (tableless QR, website, WhatsApp); Owner, Manager, Cashier, Waiter (staff takeaway); Kitchen; Waiter/Cashier (handoff).

### Business Rules
- **PRD-ORD-004.1** Any order without an associated table is Takeaway, whatever its source.
- **PRD-ORD-005.1** Takeaway can be placed by the customer, a Waiter or other authorized staff. *also: ORD-054*
- **PRD-HANDOFF-003.1** Kitchen and customer-facing screens clearly show Takeaway so food is not routed as table service. *also: KOT-005*
- Takeaway completes through Handoff → Picked Up (§37).

### Permissions
ACT-ORD-02.

### Acceptance Criteria
- **PRD-ORD-004.AC1** Given any order with no table, then it is typed Takeaway on staff screens, KOT, KDS and bill.
- **PRD-ORD-005.AC1** Given a Cashier creates a walk-in order with no table, then it is created as Takeaway without acceptance.

## 25. Website Ordering

### Objective
Let customers order from the restaurant's direct website.

### Actors
Customer; accepting staff.

### Main Flow
Same as tableless QR (§23): browse → name + phone → submit → acceptance → Takeaway.

### Business Rules
- **PRD-ORD-040.1** The direct website is an ordering channel into the Unified Order Engine.
- **PRD-ORD-041.1** Website orders have no table and are Takeaway.
- **PRD-ORD-042.1** Website orders require name and phone, no mandatory OTP, and staff acceptance.
- While the outlet is Closed the website shows the outlet is closed (PRD-ORG-029.1).

### Acceptance Criteria
- **PRD-ORD-042.AC1** Given a website order without phone, then submission is refused; with name + phone it awaits staff acceptance.
- **PRD-ORD-041.AC1** Given an accepted website order, then it is Takeaway everywhere.

## 26. WhatsApp Ordering

### Objective
Let customers order through WhatsApp, handled by the WhatsApp Ordering Agent (§61).

### Actors
Customer; WhatsApp Ordering Agent; accepting staff.

### Business Rules
- **PRD-AI-030.1** WhatsApp orders enter the Unified Order Engine and follow the same rules as every other channel.
- **PRD-AI-031.1** WhatsApp orders have no table and are Takeaway.
- **PRD-AI-033.1** WhatsApp orders require staff acceptance.
- While Closed, the WhatsApp channel says the outlet is closed (PRD-ORG-030.1).
- Name capture and customer matching: PRD-CUSTOMER-021.1.

### Acceptance Criteria
- **PRD-AI-033.AC1** Given a WhatsApp order is placed, then it appears to staff as awaiting acceptance and no KOT exists until accepted.
- **PRD-AI-031.AC1** Given an accepted WhatsApp order, then it is Takeaway everywhere.

## 27. Waiter Ordering

### Objective
Let waiters take and manage table and takeaway orders.

### Actors
Waiter (also Owner, Manager, Cashier for staff orders).

### Preconditions
Waiter Available; outlet Open.

### Main Flow
```
Availability → Table → Customer details if required → Order → KOT → Kitchen → Ready → Serve → Bill → Payment Information → Completed
```

### Alternative Flows
- Customer adds items after the KOT → additional KOT.
- Customer changes an item after the KOT → cancellation KOT + additional KOT (PRD-ORD-086.1).
- Customer asks to cancel an item → cancellation by state (§32).
- Waiter creates a takeaway order.

### Business Rules
- **PRD-ORD-050.1** Waiter ordering follows the flow above.
- **PRD-ORD-051.1** A Waiter may edit the current unpaid bill's order as an explicit, permissioned capability (not generic cashier behavior).
- **PRD-ORD-052.1** A Waiter may add items, trigger the needed KOT updates and request cancellation subject to kitchen state.
- **PRD-ORD-053.1** A Waiter can cancel an item (within the state rules of §32).
- **PRD-ORD-054.1** A Waiter can create takeaway orders.
- Staff-created orders are Confirmed without acceptance (PRD-ORD-008.1).

### Permissions
ACT-ORD-01…03, ACT-MOD-01/02/06, ACT-CAN-01/02/06, ACT-TBL-01, ACT-HND-01/02, ACT-BIL-01/04/05/09.

### Acceptance Criteria
- **PRD-ORD-051.AC1** Given an unpaid current bill, when the Waiter adds an item, then it is added and an additional KOT is generated.
- **PRD-ORD-051.AC2** Given a Paid bill, when the Waiter tries to edit it directly, then it is refused unless the bill is reopened first.
- **PRD-ORD-050.AC1** Given a Waiter creates a dine-in order, then it is Confirmed immediately and its KOT reaches the KDS.

## 28. Unified Order Engine

### Objective
Turn orders from every channel into one consistent order model so the kitchen, billing and analytics see one truth.

### Actors
All ordering roles and channels.

### Main Flow
1. An order is created on any channel.
2. Customer-originated orders wait for staff acceptance; staff-created orders are Confirmed immediately.
3. Confirmed orders produce KOTs and move through the lifecycle (§29).

### Business Rules
- **PRD-ORD-001.1** Every channel enters one order model.
- **PRD-ORD-002.1** Channels are: waiter, table QR, takeaway/walk-in (staff), tableless QR, direct website and WhatsApp.
- **PRD-ORD-003.1** Each order keeps: organization, outlet, source channel, table (if any), customer (if known), staff (if any), items, KOT history, bill, payment information and audit history.
- **PRD-ORD-006.1** Submitting is idempotent: one logical submission creates exactly one order; a retry returns the existing order; no duplicate KOT is created. *also: OFFLINE-003, SEC-003*
- **PRD-ORD-008.1** Customer-originated orders (table QR, tableless QR, website, WhatsApp) need staff acceptance; staff-created orders do not. Owner, Manager, Cashier and Waiter may accept or reject; Kitchen may not. Rejecting requires a reason.
- **PRD-ORD-084.1** Supported order operations: modify quantity, modify modifiers/add-ons, customer notes, kitchen notes, multiple KOTs, hold, void, cancel, re-fire, cancel order with reason, and source tracking.

### Permissions
ACT-ORD-01…04, ACT-ACC-01/02.

### State Changes
See §29.

### Error / Edge Cases
Duplicate submit · network retry · outlet Closed while order awaits acceptance (PRD-ORG-033.1).

### Acceptance Criteria
- **PRD-ORD-006.AC1** Given a customer taps Submit twice or retries after a timeout, then exactly one order and at most one initial KOT exist.
- **PRD-ORD-008.AC1** Given a customer-originated order, when a Kitchen user tries to accept it, then it is refused.
- **PRD-ORD-008.AC2** Given a Waiter rejects a customer order without a reason, then the rejection is refused; with a reason it succeeds and the customer sees the rejection.
- **PRD-ORD-003.AC1** Given any order, then its source channel, outlet and (if any) table are always visible to authorized staff.

## 29. Order Lifecycle

### Objective
Give every order a clear, enforced lifecycle.

### State model
```
Draft (incl. "awaiting acceptance") → Confirmed → KOT Sent → Preparing → Ready → Served / Picked Up → Completed
Cancelled = terminal outcome when authorized and applicable
```

| State | Meaning | Typical actor/event |
|---|---|---|
| Draft | Being assembled; not committed; no KOT | Customer / staff |
| Draft — awaiting acceptance | Customer order submitted, waiting for staff | Customer |
| Confirmed | Accepted for processing | Staff acceptance or staff creation |
| KOT Sent | Kitchen work dispatched | System |
| Preparing | Kitchen is preparing | Kitchen |
| Ready | All required food ready | Kitchen (or Owner/Manager oversight) |
| Served | Waiter served (table) | Waiter |
| Picked Up | Recipient collected (takeaway) | Waiter or Cashier |
| Completed | Journey complete | System |
| Cancelled | Cancelled with reason | Authorized actor / Kitchen |

### Business Rules
- **PRD-ORD-060.1** Orders use the states and meanings above.
- **PRD-ORD-061.1** Every transition has defined actors; invalid transitions and skipped required states are refused (full transition table: TRD).
- **PRD-ORD-063.1** An order becomes Completed only when every item has a terminal outcome — Served, Picked Up or Cancelled — and customer handoff is complete. Bill or payment status alone never completes an order; any Pending, Sent, Preparing or Ready item prevents completion.
- **PRD-ORD-064.1** An abandoned Draft creates no KOT and no sale and never holds a table permanently (PRD-TABLE-007.1).
- **PRD-ORD-064.2** A Draft is a persisted business object and remains identifiable as Draft in history. Draft lifetime and table-session occupancy are separate concepts: when a Draft becomes abandoned under the product's inactivity policy, its active table occupancy/session claim is released — the Draft is not deleted, and no sale and no KOT are created. The exact inactivity threshold is a TRD concern; the product guarantees that an abandoned Draft can never block a table permanently. This applies to uncommitted Drafts; an order awaiting acceptance has been submitted and is not an abandoned Draft. *(OD-14)*
- **PRD-ORD-065.1** If every item of an order is cancelled before fulfillment, the order outcome is Cancelled, not Completed. If at least one item was fulfilled and all remaining items are cancelled, the order becomes Completed only when every item outcome is terminal and handoff is complete (PRD-ORD-063.1). *(OD-40)*

### Acceptance Criteria
- **PRD-ORD-061.AC1** Given a Draft order, when anyone tries to move it directly to Ready, then it is refused and nothing changes.
- **PRD-ORD-063.AC1** Given Burger Served, Fries Served and Coke Cancelled, then the order is Completed.
- **PRD-ORD-063.AC2** Given one item still Ready, when the bill is fully paid, then the order is not Completed.
- **PRD-ORD-065.AC1** Given an order whose every item was cancelled, then the order is Cancelled and is not offered feedback.
- **PRD-ORD-064.AC1** Given a customer abandons a Draft, then no KOT is created and no sale is counted.
- **PRD-ORD-064.AC2** Given an abandoned Draft whose table claim was released, then the Draft can still be found, identified as Draft, in history.

## 30. Order Item Lifecycle

### Objective
Track each item separately so partial readiness, cancellation and handoff are precise.

### State model
```
Pending → Sent (KOT) → Preparing → Ready → Served / Picked Up
           ↘ Cancelled (with reason; cancellation KOT if already Sent)
```

### Business Rules
- **PRD-ORD-070.1** Item state, KOT state, cancellation rules and hold/void/re-fire are defined per item.
- **PRD-ORD-071.1** Items move Pending → Sent → Preparing → Ready → Served or Picked Up, or end Cancelled.
- **PRD-ORD-072.1** Readiness is recorded per item, so an order can be partly ready.
- **PRD-ORD-073.1** **Hold** temporarily pauses an item from progressing; it is primarily item-level, and order-level Hold is used only when the entire order is intentionally paused. **Void** is an authorized operational invalidation of an item or order: the record is preserved (never physically deleted), a reason is required, and once the item has entered kitchen processing Void follows the same state-safety rules as cancellation (PRD-ORD-082.1, PRD-ORD-088.1) — it never bypasses cancellation, KOT or audit behavior. **Re-fire** requests another preparation of an item because the existing preparation is operationally unusable or another preparation is required; the original history is preserved and the additional kitchen work is generated. Hold, Void and Re-fire are audited operational actions. *(OD-15)*

### Acceptance Criteria
- **PRD-ORD-072.AC1** Given a two-item order where one item is Ready, then that item shows Ready and the order does not show fully Ready.
- **PRD-ORD-073.AC1** Given a Preparing item, when a Manager voids it with a reason, then a cancellation request reaches the Kitchen exactly as for cancellation, and the voided item's record stays in history.
- **PRD-ORD-073.AC2** Given a Ready item, when the Kitchen re-fires it, then additional kitchen work is generated and the original preparation history is unchanged.

## 31. Order Modification

### Objective
Allow changes to an order without losing kitchen or billing history.

### Actors
Owner, Manager, Cashier, Waiter; Customer (adding items via table QR, with acceptance).

### Preconditions
Bill not Finalized; outlet Open.

### Main Flow — add item after KOT
1. Authorized user adds an item to the existing order.
2. Original order and KOT history stay unchanged.
3. An additional KOT goes to the kitchen.
4. The bill includes the new item.

### Alternative Flows
- Change quantity/modifiers after KOT → cancellation KOT for the old line + additional KOT for the new line.
- Change before KOT → edited directly.
- Hold or void an item or an order (PRD-ORD-073.1).

### Business Rules
- **PRD-ORD-080.1** Adding an item after the first KOT keeps it on the same order, preserves earlier KOT history, sends an additional KOT and updates the bill. *also: KOT-002*
- **PRD-ORD-086.1** After a KOT, changing quantity or modifiers is recorded as a cancellation KOT plus an additional KOT.
- **PRD-ORD-091.1** A table session has one active order; new items are added to it.
- Edits are refused when the bill is Finalized (PRD-BILL-004.1) or the outlet is Closed (PRD-ORG-026.1).

### Permissions
ACT-MOD-01, ACT-MOD-02, ACT-MOD-03, ACT-MOD-04, ACT-MOD-06, ACT-MOD-07.

### Acceptance Criteria
- **PRD-ORD-080.AC1** Given an order with one KOT, when an item is added, then a second KOT contains only the new item and the first KOT is unchanged.
- **PRD-ORD-086.AC1** Given a sent item's quantity is changed from 1 to 2, then the kitchen receives a cancellation for the original line and a new KOT for the changed line.

## 32. Order Cancellation

### Objective
Cancel items or orders safely, with the kitchen always informed and the history preserved.

### Actors
Owner, Manager, Cashier, Waiter (cancel / request); Kitchen (cancel independently, acknowledge requests).

### Main Flow — by item state
| Item state | What happens |
|---|---|
| Pending | Cancelled directly |
| Sent (KOT issued) | Cancelled; a cancellation KOT/event reaches the kitchen; history kept |
| Preparing / Ready | Non-kitchen user creates a **cancellation request** with reason → Kitchen accepts (item Cancelled) or declines (item stays active). Kitchen may cancel directly |
| Served / Picked Up | Normal cancellation not allowed → use bill correction / refund |
| Order Completed | Bill correction / refund workflow |

### Business Rules
- **PRD-ORD-081.1** Cancelling an item already sent to the kitchen checks the kitchen state; if operationally cancellable, a cancellation KOT/update is generated, the kitchen handles it, and the order and bill reflect the result.
- **PRD-ORD-082.1** Cancellation follows the state table above; Kitchen may independently cancel whole or partial orders for operational reasons.
- **PRD-ORD-083.1** A cancellation after KOT always leaves a cancellation trace; it is never a silent deletion.
- **PRD-ORD-085.1** Cancelling an order requires a reason.
- **PRD-ORD-087.1** Cancelled items are excluded from the bill.
- **PRD-ORD-088.1** For a Preparing or Ready item, a non-kitchen cancellation creates a request with a mandatory reason; the Kitchen must acknowledge it by accepting (the item becomes Cancelled) or declining (the item stays active). *also: KDS-017*
- **PRD-ORD-089.1** Every cancellation — item or order, by any actor — requires a reason.
- **PRD-ORD-090.1** No cancellation erases an issued KOT.
- **PRD-ORD-092.1** Every cancellation record keeps actor, reason, time, previous state and resulting state.
- **PRD-ORD-093.1** If the item reaches Served or Picked Up before a cancellation request is resolved, Served/Picked Up is the authoritative terminal state and the request becomes a no-op that remains in history and audit. An unresolved request stays visible, never cancels the item automatically, and when it becomes stale it becomes an Attention item (stale threshold: TRD). *(OD-44)*
- Reason capture: PRD-KDS-015.1.

### Permissions
ACT-CAN-01…07.

### State Changes
Item → Cancelled (directly, or after Kitchen acknowledgement for Preparing/Ready).

### Acceptance Criteria
- **PRD-ORD-082.AC1** Given a Pending item, when a Waiter cancels it with a reason, then it is Cancelled and no KOT is involved.
- **PRD-ORD-082.AC2** Given a Sent item, when a Cashier cancels it with a reason, then the kitchen receives a cancellation and the item is Cancelled.
- **PRD-ORD-088.AC1** Given a Preparing item, when a Waiter cancels it, then a cancellation request appears on the KDS and the item stays Preparing until the Kitchen acknowledges; if the Kitchen accepts it is Cancelled.
- **PRD-ORD-082.AC3** Given a Served item, when anyone tries a normal cancellation, then it is refused and the user is directed to bill correction/refund.
- **PRD-ORD-089.AC1** Given any cancellation without a reason, then it is refused.
- **PRD-ORD-087.AC1** Given an item is cancelled, then the bill total no longer includes it.
- **PRD-ORD-093.AC1** Given a cancellation request, when the Kitchen declines it, then the item stays in its current state and the declined request remains in history.
- **PRD-ORD-093.AC2** Given a request left unresolved past the stale threshold (TRD), then it is still pending, the item is not cancelled, and an Attention item exists.
- **PRD-ORD-093.AC3** Given a pending cancellation request, when the Waiter marks the item Served first, then the item stays Served, the request becomes a no-op, and it remains in the audit history.
- **PRD-ORD-092.AC1** Given any cancellation, then its record shows actor, reason, time and previous/new state.

## 33. KOT

### Objective
Tell the kitchen exactly what to prepare, change or stop.

### Actors
System (generates); Kitchen (receives).

### Business Rules
- **PRD-KOT-001.1** The first KOT is sent when an order becomes Confirmed.
- **PRD-KOT-002.1** Items added after the first KOT generate an additional KOT.
- **PRD-KOT-003.1** Cancelling a sent item generates a cancellation KOT/update.
- **PRD-KOT-004.1** A KOT shows table or order number, items, modifiers and notes.
- **PRD-KOT-005.1** A KOT clearly marks Takeaway when there is no table.
- **PRD-KOT-006.1** Each item is routed to its mapped kitchen station.
- **PRD-KOT-007.1** An interrupted KOT can be retried safely; the kitchen receives one logical KOT. *also: OFFLINE-004*
- **PRD-KOT-008.1** All KOTs stay in the order's history.
- **PRD-KOT-009.1** KOTs are received on the KDS. (Thermal printing is deferred — §70.)

### Permissions
ACT-KOT-01…03 (system), ACT-KOT-04 (re-fire).

### Acceptance Criteria
- **PRD-KOT-006.AC1** Given an item mapped to Tandoor, when it is ordered, then its KOT is routed to Tandoor.
- **PRD-KOT-007.AC1** Given a KOT send is interrupted and retried, then the KDS shows exactly one KOT.
- **PRD-KOT-005.AC1** Given a takeaway order, then its KOT shows TAKEAWAY and no table.

## 34. Kitchen and KDS

### Objective
Give the kitchen one shared queue showing what to prepare, in what priority, and what is ready.

### Actors
Kitchen Staff; Owner and Manager (view KDS, oversight Ready, Manager priority).

### Main Flow
1. KOT arrives on the KDS as New.
2. Kitchen user marks items Preparing.
3. Kitchen user marks items Ready.
4. When all required food is Ready, the order is Ready and handoff can begin.

### Alternative Flows
- Re-fire an item (PRD-ORD-073.1).
- Escalate priority to HIGH or URGENT.
- Receive and acknowledge cancellation requests (§32).

### Business Rules
- **PRD-KDS-001.1** Each outlet has one kitchen context; all Kitchen users share its queue and may update the same orders.
- **PRD-KDS-003.1** Items move New → Preparing → Ready on the KDS.
- **PRD-KDS-004.1** The KDS shows an order timer.
- **PRD-KDS-005.1** Priority defaults to NORMAL; Kitchen and Manager can raise it to HIGH or URGENT; priority is set manually, never by AI. *also: AI-044*
- **PRD-KDS-006.1** The kitchen can re-fire an item.
- **PRD-KDS-007.1** There is no delayed-order workflow and no delay alerts.
- **PRD-KDS-008.1** Any authorized Kitchen user can mark an item or order Ready.
- **PRD-KDS-009.1** An order is fully Ready only when all its required food — across all stations — is Ready; which user marked it does not matter.
- **PRD-KDS-010.1** Owner and Manager can mark Ready in an oversight capacity.
- **PRD-KDS-016.1** If the KDS loses connection, it reconnects and shows the current state without duplicates. *also: OFFLINE-005*

### Permissions
ACT-KDS-01…04, ACT-KOT-04, ACT-CAN-04/05/07.

### State Changes
Item: New/Sent → Preparing → Ready.

### Acceptance Criteria
- **PRD-KDS-009.AC1** Given two Kitchen users mark different items of one order Ready, then the order becomes Ready only when the last required item is Ready.
- **PRD-KDS-005.AC1** Given a Manager raises an order to URGENT, then the KDS shows URGENT.
- **PRD-KDS-016.AC1** Given the KDS disconnects and reconnects, then it shows the current queue with no duplicate cards.
- **PRD-KDS-010.AC1** Given an Owner marks an item Ready, then it is Ready and the action is attributed to the Owner.

## 35. Kitchen Stations

### Objective
Route items to the right part of the single kitchen.

### Business Rules
- **PRD-KDS-002.1** Stations (e.g., Tandoor) exist inside the outlet's single kitchen; they are not separate kitchens.
- Items are mapped to stations (PRD-MENU-005.1) and KOTs route by station (PRD-KOT-006.1); readiness rolls up across stations (PRD-KDS-009.1); the Owner configures stations (PRD-ONB-027.1).

### Acceptance Criteria
- **PRD-KDS-002.AC1** Given a Tandoor item Ready and a curry item Preparing on another station, then the order is not shown fully Ready.

## 36. Kitchen Cancellation

### Objective
Let the kitchen stop food it cannot make, with a recorded reason.

### Actors
Kitchen Staff.

### Main Flow
1. Kitchen user selects items or the whole order.
2. Chooses/enters a reason (e.g., unavailable).
3. Items are Cancelled; order and bill update; staff and customer see the result.

### Business Rules
- **PRD-KDS-011.1** The kitchen can cancel the whole order or part of it because of unavailability or another valid operational reason.
- **PRD-KDS-012.1** A reason is mandatory.
- **PRD-KDS-013.1** Kitchen cancellation updates the order and bill; it is never a silent deletion.
- **PRD-KDS-014.1** Item and kitchen cancellations are audited.
- **PRD-KDS-017.1** The kitchen acknowledges cancellation requests for Preparing/Ready items (§32).
- **PRD-KDS-015.1** Reasons are captured as a predefined reason category plus optional free-text detail where operationally useful. A reason is required for: customer order rejection, cancellation where required, kitchen operational cancellation, bill reopen, day reopen, and relevant void/correction actions. The reason catalogue is configuration detail that may be refined downstream without changing this rule; the initial categories are *(PQ-06)*:

  | Reason use | Categories |
  |---|---|
  | Kitchen cancellation | Item unavailable · Ingredient unavailable · Preparation issue · Duplicate entry · Other |
  | Order rejection (staff) | Item unavailable · Kitchen capacity · Duplicate order · Other |
  | Item/order cancellation (non-kitchen) | Customer request · Order entry error · Item unavailable · Other |
  | Bill reopen | Item correction · Payment correction · Discount/charge correction · Other |
  | Refund | Customer complaint · Billing error · Cancelled after payment · Other |
  | Day reopen | Missed transaction · Cash count correction · Other |

### Permissions
ACT-CAN-04, ACT-CAN-05, ACT-CAN-07.

### Acceptance Criteria
- **PRD-KDS-011.AC1** Given a three-item order, when the kitchen cancels one item as "out of stock", then that item is Cancelled with that reason, the bill excludes it, and the Waiter/Cashier see it.
- **PRD-KDS-012.AC1** Given a kitchen cancellation without a reason, then it is refused.

## 37. Food Handoff

### Objective
Close the loop from Ready food to the customer.

### Actors
Waiter (Served); Waiter or Cashier (Picked Up).

### Main Flow
| Situation | Flow | Completion event |
|---|---|---|
| Table associated, waiter assigned/used | Ready → Waiter collects → **Served** | Waiter confirms service |
| No waiter / Takeaway | Ready → Handoff → **Picked Up** | Waiter or Cashier records pickup |

### Business Rules
- **PRD-HANDOFF-001.1** For a table order with a waiter, the Waiter collects the Ready food and confirms Served.
- **PRD-HANDOFF-002.1** For takeaway or no-waiter orders, food is handed off and recorded as Picked Up.
- **PRD-HANDOFF-004.1** Picked Up is recorded by a Waiter or a Cashier.

### Permissions
ACT-HND-01, ACT-HND-02.

### Acceptance Criteria
- **PRD-HANDOFF-004.AC1** Given a Ready takeaway order, when a Cashier records pickup, then items become Picked Up; when a Kitchen user tries, it is refused.
- **PRD-HANDOFF-001.AC1** Given a Ready table order, when the Waiter confirms service, then items become Served.

## 38. Billing

### Objective
Produce a correct bill for every order and keep every correction authorized and traceable.

### Actors
Owner, Manager, Cashier, Waiter (per §13.4).

### Preconditions
An order exists.

### Main Flow
1. A bill is created for the order (one bill per order).
2. While Draft, items can still be added.
3. Discounts, service charge, packaging charge and round-off are applied; tax is calculated.
4. The bill is Finalized; payment information is recorded (§40).
5. A printable and/or digital bill is provided; reprints are possible.

### Alternative Flows
- Reopen a Finalized (paid or unpaid) bill to correct it — reason required.
- Cancel a bill (not automatically a refund).
- Refund a paid bill partially or fully.
- Correct a Draft bill — even one with payments recorded — without reopening it (PRD-PAY-012.1).

### Business Rules
- **PRD-BILL-008.1** Billing covers: bill generation, tax, discounts, service charge, packaging charge, round-off, customer details, printable bill, digital bill, reprint, refund and cancellation. Detailed calculation policies — GST/tax calculation, discount rules, service- and packaging-charge basis, rounding and invoice numbering — are DEFERRED to the downstream specification (PQ-07, SPEC DF-14).
- **PRD-BILL-015.1** One bill per order (customer transaction context): Table → Order → Bill; no table → Takeaway Order → Bill. Items can be added to the order until the bill is resolved. A split payment is recorded on the one bill — it never creates multiple bills.
- **PRD-BILL-009.1** Reprinting a bill never changes any financial data.
- **PRD-BILL-010.1** Refund, reopen and cancel each require the corresponding permission.
- **PRD-BILL-011.1** Every correction keeps its history.
- **PRD-BILL-013.1** Discounts, reopen, refund, cancellation and payment corrections are audited.
- **PRD-BILL-016.1** A Waiter cannot edit a Paid bill directly; they must reopen it first.
- **PRD-BILL-017.1** A Waiter may reopen bills, including paid ones.
- **PRD-ORG-023.1** applies: billing is never blocked by time of day.

### Permissions
ACT-BIL-01…09, ACT-PAY-01/02.

### State Changes
See §39.

### Error / Edge Cases
Draft stays open (unresolved — §49) · finalize without payment · payment after finalization · reopen paid bill · partial/full refund · cancel vs refund · reprint · split payment · merged/split table bills (PRD-TABLE-018.1).

### Acceptance Criteria
- **PRD-BILL-015.AC1** Given a table order, then exactly one bill exists for it; given a split payment, then still one bill exists.
- **PRD-BILL-009.AC1** Given a bill is reprinted, then all amounts are identical and no financial field changed.
- **PRD-BILL-016.AC1** Given a Paid bill, when a Waiter tries to edit it, then it is refused; after the Waiter reopens it with a reason, editing is allowed.
- **PRD-BILL-013.AC1** Given a discount is applied, then the audit trail records who applied it, when and the before/after amounts.

## 39. Bill Lifecycle

### State model
Two independent axes:

| Axis | Values |
|---|---|
| Bill status | Draft → Finalized; correction states Reopened, Cancelled, Refunded (partial or full) |
| Payment status | Not Paid / Paid |

```
Draft ──finalize──▶ Finalized ──reopen (reason)──▶ Reopened ──finalize──▶ Finalized
Finalized ──cancel──▶ Cancelled
Paid bill ──refund (amount)──▶ Refunded (partial or full)
Draft bill (with or without payments) ──items added/removed──▶ Draft (outstanding / overpayment recalculated; no Reopen)
Payment status: Not Paid ──payments cover total──▶ Paid
```

### Business Rules
- **PRD-BILL-001.1** Finalization and payment status are separate; each is tracked on its own.
- **PRD-BILL-002.1** A bill can be Draft, Finalized, Reopened, Cancelled or Refunded, and separately Paid or Not Paid.
- **PRD-BILL-003.1** While Draft, the customer is not yet billed and can keep ordering.
- **PRD-BILL-004.1** Once Finalized, any change requires the correction path (reopen).
- **PRD-BILL-005.1** Reopen is the authorized correction path for a Finalized bill (paid or not): Reopen → correction → re-finalization. A Draft bill, even with payments recorded, is corrected without Reopen (PRD-PAY-012.1).
- **PRD-BILL-014.1** Reopening a bill requires a reason.
- **PRD-BILL-006.1** A refund records its amount and the authorizing user; partial and full refunds are distinguished.
- **PRD-BILL-007.1** Cancelling a bill is an authorized correction and does not automatically create a refund.
- **PRD-BILL-012.1** A refund is recorded information only; no money is moved by SERVENA.
- **PRD-PAY-013.1** Every refund records, where applicable: amount, refund/payment mode, reason, actor, timestamp, and the provider/reference identifier when one is available. A provider/reference identifier is never fabricated. *(OD-33)*
- **PRD-PAY-012.1** A Draft bill may have payment information recorded against it and may still receive additional items before finalization; correcting a Draft does not require Reopen (Reopen applies to Finalized bills — PRD-BILL-005.1). Existing payment records are never silently deleted or rewritten. When the bill total changes, existing payments are kept, the outstanding amount is recalculated and payment status reflects the new total (PRD-PAY-010.1). **Overpayment = total recorded payments − current bill total**; when it is greater than zero it is shown explicitly on the bill and stays visible until resolved through an authorized, audited correction or refund. A Finalized or Paid bill is corrected only through authorized Reopen → correction → re-finalization. *(OD-39)*

### Acceptance Criteria
- **PRD-BILL-001.AC1** Given a bill is Finalized without payment, then it is Finalized + Not Paid.
- **PRD-BILL-004.AC1** Given a Finalized bill, when an item edit is attempted without reopening, then it is refused.
- **PRD-BILL-014.AC1** Given a Cashier reopens a bill without a reason, then it is refused; with a reason it becomes Reopened and the audit shows before/after.
- **PRD-BILL-006.AC1** Given a ₹2,840 paid bill, when ₹500 is refunded, then a partial refund of ₹500 by the named user is recorded.
- **PRD-PAY-013.AC1** Given a cash refund of ₹500, then the refund record shows mode Cash, ₹500, reason, actor and time, and no reference ID is invented.
- **PRD-PAY-012.AC1** Given a Finalized + Paid ₹2,840 bill, when it is reopened with a reason and an item is added raising the total to ₹3,040, then the existing payment is unchanged and the bill is Not Paid with ₹200 outstanding.
- **PRD-PAY-012.AC2** Given a Draft bill of ₹1,000 with ₹1,000 recorded as paid, when a ₹200 item is added, then no Reopen is needed, the ₹1,000 payment record is unchanged, and the bill is Not Paid with ₹200 outstanding.
- **PRD-PAY-012.AC3** Given a Draft bill of ₹1,000 with ₹1,000 recorded as paid, when a ₹300 item is cancelled, then the bill shows an overpayment of ₹300 that stays visible until an authorized correction or refund resolves it.
- **PRD-BILL-007.AC1** Given a bill is cancelled, then no refund record is created automatically.

## 40. Payment Information

### Objective
Record how each bill was paid — accurately enough for Day Close — without processing payments.

### Actors
Owner, Manager, Cashier.

### Main Flow
1. The bill reaches the payment point.
2. Payment components are recorded: mode (UPI, Cash, Card) and amount; for online payments, the transaction/reference ID when the payment flow/provider supplies one.
3. When recorded payments cover the total, the bill is Paid.

### Alternative Flows
- Split payment across modes (e.g., ₹1,840 UPI + ₹1,000 Cash).
- Payment recorded before finalization (allowed — status is independent).
- Correction of payment information (audited).

### Business Rules
- **PRD-PAY-001.1** Each bill shows Paid or Not Paid.
- **PRD-PAY-002.1** Payment modes are UPI, Cash, Card and Split.
- **PRD-PAY-003.1** When the payment flow/provider supplies an online payment reference or transaction ID, it is recorded.
- **PRD-PAY-004.1** Each payment is linked to its bill, order and outlet.
- **PRD-PAY-005.1** Split components are kept separately and feed Day Close reconciliation.
- **PRD-PAY-006.1** Submitting the same payment again never creates a duplicate record. *also: OFFLINE-006*
- **PRD-PAY-007.1** Payment corrections are audited.
- **PRD-PAY-009.1** A payment belongs to the business day in which it was recorded. *also: CASH-004*
- **PRD-PAY-010.1** Payment status does not depend on finalization: it stays Not Paid until recorded payments cover the bill total, then becomes Paid. Each payment record keeps its own amount, mode and transaction ID.
- **PRD-PAY-011.1** If no reference ID is supplied, the payment may still be recorded; SERVENA never generates or fabricates a reference ID. Payment execution is outside Phase 1, so no further gateway behavior applies. *(OD-24)*

### Permissions
ACT-PAY-01, ACT-PAY-02.

### Acceptance Criteria
- **PRD-PAY-005.AC1** Given a ₹2,840 bill paid ₹1,840 UPI (with transaction ID) + ₹1,000 Cash, then both components stay linked to the bill and appear separately in Day Close.
- **PRD-PAY-006.AC1** Given the same payment submission is retried, then one payment record exists.
- **PRD-PAY-010.AC1** Given ₹2,000 recorded on a ₹2,840 bill, then the bill is Not Paid with ₹840 outstanding.
- **PRD-PAY-010.AC2** Given a Draft bill, when a payment is recorded, then the payment is accepted and the bill remains Draft.
- **PRD-PAY-011.AC1** Given a UPI payment recorded without a supplied reference ID, then the payment is recorded with no reference ID and none is generated.

## 41. Cashier Workflow

### Objective
Give the Cashier a complete billing desk flow.

### Main Flow
```
Sign in → active bills → verify items, taxes, discounts, charges → finalize → record payment information
→ printable/digital bill → (when needed) reopen / refund / cancel → Day Close
```

### Business Rules
- The Cashier works in one outlet (PRD-RBAC-024.1) and has no Owner configuration access (PRD-RBAC-026.1).
- Cashier billing permissions: ACT-BIL-01…09, ACT-PAY-01/02; Day Close and Reopen Day: ACT-DAY-02/03; cash reconciliation: ACT-CSH-01/02; takeaway pickup: ACT-HND-02.

### Acceptance Criteria
- **PRD-BILL-010.AC1** Given a Cashier, when they refund, reopen or cancel a bill with a reason, then each succeeds and is audited; given a Waiter tries to refund or cancel a bill, then it is refused.

## 42. Customer Experience

### Objective
Give diners a simple journey from menu to food to feedback, without an account.

### Main Flow
```
Discover menu → create order → submit → staff acceptance (customer-originated orders) → kitchen → Ready
→ served / picked up → bill → payment information → Completed → feedback → one-tap reorder
```

### Business Rules
- **PRD-CUSTOMER-001.1** The customer journey follows the flow above.
- **PRD-CUSTOMER-002.1** When name/phone are captured, the customer record holds: name, phone, order history, visit count, total spend, average order value, last order, preferred items and outlet history.
- **PRD-CUSTOMER-003.1** A customer sees only their own orders.
- **PRD-CUSTOMER-004.1** Outlet staff see their own outlet's customer history; the Owner sees cross-outlet customer history.
- **PRD-CUSTOMER-005.1** Customers have no accounts; tableless QR and website orders capture name + phone without OTP; customers reach their orders through a private, non-guessable link.
- **PRD-CUSTOMER-015.1** The customer always sees their order's current state.
- **PRD-CUSTOMER-021.1** Phone number is the primary customer matching key at organization scope. Operational order and history visibility stays outlet-scoped according to authorization (Owner cross-outlet, PRD-CUSTOMER-004.1); customers never get restaurant-wide access. WhatsApp captures the customer's name when available. There is no mandatory OTP. Matching never lets one customer's private order access expose another customer's order. *(OD-38)*

### Permissions
ACT-CUS-01…03.

### Acceptance Criteria
- **PRD-CUSTOMER-003.AC1** Given a customer's private order link, when they change it to guess another order, then no other order is shown.
- **PRD-CUSTOMER-002.AC1** Given a customer with three completed orders, then their record shows visit count, total spend, AOV and last order.
- **PRD-CUSTOMER-021.AC1** Given two orders placed with the same phone at two outlets, then they match one customer record at organization scope, a Cashier of one outlet sees only that outlet's order, and each order link opens only its own order.

## 43. Customer Feedback

### Objective
Capture the customer's view of each completed order as operational insight.

### Actors
Customer (submit); Owner and Manager (view).

### Main Flow
1. Order reaches Completed.
2. Customer is offered feedback.
3. Customer gives a 1–5 rating and optional comment.

### Business Rules
- **PRD-FEEDBACK-001.1** Feedback is offered only when the order is Completed.
- **PRD-FEEDBACK-002.1** The customer submits a rating and/or comment where the channel supports it.
- **PRD-FEEDBACK-002.2** Customer self-service feedback is offered for eligible Completed customer orders placed through table QR, tableless QR, website and WhatsApp. Staff-created or walk-in orders with no customer order-access identity/link are not offered self-service feedback; no customer identity is invented for them. *(PQ-08)*
- **PRD-FEEDBACK-003.1** Feedback is linked to the order, outlet and customer.
- **PRD-FEEDBACK-004.1** Management uses feedback as operational insight. *also: ANALYTICS-006*
- **PRD-FEEDBACK-006.1** Rating is 1–5 with an optional comment; one feedback per order.

### Permissions
ACT-FB-01, ACT-FB-02.

### Acceptance Criteria
- **PRD-FEEDBACK-001.AC1** Given an order not yet Completed, then feedback is not offered.
- **PRD-FEEDBACK-006.AC1** Given feedback already exists for an order, when the customer submits again, then it is refused.
- **PRD-FEEDBACK-002.AC1** Given a Completed walk-in takeaway order created by a Cashier with no customer order link, then no self-service feedback is offered.

## 44. One-Tap Reorder

### Objective
Let a customer repeat a previous order in one step — and nothing broader.

### Actors
Customer; accepting staff.

### Preconditions
Customer holds the private link to an eligible past order; outlet Open.

### Main Flow
1. Customer opens a past order via its private link.
2. Taps reorder.
3. The product checks current availability, price, tax and outlet context.
4. A **new** order submission is created through the Unified Order Engine and awaits acceptance (if the customer has an active table context whose session already has an active order, the items join that order — PRD-CUSTOMER-020.1).
5. The customer sees the new order and any items that could not be included.

### Business Rules
- **PRD-CUSTOMER-010.1** Phase 1 offers one-tap reorder only — no reorder assistant, loyalty or recovery automation.
- **PRD-CUSTOMER-011.1** Reorder needs an eligible prior order (PRD-CUSTOMER-020.1).
- **PRD-CUSTOMER-012.1** Current availability and outlet context are checked first.
- **PRD-CUSTOMER-013.1** Reorder creates a new order through the Unified Order Engine.
- **PRD-CUSTOMER-014.1** Unavailable items are never silently substituted or invented; they are left out and shown to the customer.
- **PRD-CUSTOMER-016.1** The customer reaches past orders through a private, non-guessable link; no account is needed.
- **PRD-CUSTOMER-017.1** Current price, tax, availability and menu rules apply.
- **PRD-CUSTOMER-018.1** Reorder is unavailable while the outlet is Closed.
- **PRD-CUSTOMER-019.1** Reorder never changes the original order.
- **PRD-CUSTOMER-020.1** One-tap reorder is available from the customer's private order-access link. Eligible: a historical order that reached Completed and contains reorderable items; cancelled or non-fulfillable historical items are not recreated. Reorder creates a new order submission using the current menu, price, applicable tax, availability and outlet state, and never mutates the historical order. If a valid active table context exists, the reorder is associated with that table — its items join the table session's active order if one exists (PRD-TABLE-015.1); otherwise the reorder is Takeaway. While the outlet is Closed the reorder is rejected because no new order can be created. No customer account or OTP is introduced. *(OD-36)*

### Permissions
ACT-CUS-03; acceptance ACT-ACC-01/02.

### Acceptance Criteria
- **PRD-CUSTOMER-014.AC1** Given one of three items is unavailable, when the customer reorders, then the new order has two items and the customer is told which item was left out.
- **PRD-CUSTOMER-017.AC1** Given an item's price rose since the original order, when reordered, then the current price applies.
- **PRD-CUSTOMER-019.AC1** Given a reorder, then the original order is unchanged.
- **PRD-CUSTOMER-018.AC1** Given the outlet is Closed, when the customer taps reorder, then no order is created.
- **PRD-CUSTOMER-020.AC1** Given a historical order that ended Cancelled, then no reorder is offered; given a Completed order with one cancelled item, then the reorder does not include that item.
- **PRD-CUSTOMER-020.AC2** Given no active table context, then the reorder is created as Takeaway and awaits staff acceptance.

## 45. Business Day

### Objective
Define the restaurant day by an explicit, accountable action instead of the clock.

### Business Rules
- **PRD-DAY-001.1** Each outlet runs a continuous business day; there is no midnight, operating-hours or system start/end boundary.
- **PRD-DAY-002.1** There is no Start Day action.
- **PRD-DAY-003.1** The only boundary is Day Close by Owner, Manager or Cashier; its timestamp is authoritative.
- **PRD-DAY-004.1** After Day Close the next period automatically becomes the running business day.
- **PRD-DAY-005.1** A transaction crossing midnight has no special meaning.
- **PRD-DAY-006.1** Transactions after a close belong to the new running day.
- **PRD-DAY-016.1** Business day and Day Close are per outlet.
- **PRD-DAY-017.1** Every "day" in the product — analytics "today", Daily AI Brief — means the business day bounded by Day Close. *also: ANALYTICS-005, AI-027*
- **PRD-DAY-019.1** Every transaction keeps the business day it originated in.
- **PRD-DAY-023.1** An outlet's business days are continuous and never overlap; each ends at its Day Close timestamp. No action may create overlapping or gapped days.

### Acceptance Criteria
- **PRD-DAY-005.AC1** Given transactions at 23:50 and 00:20 with no Day Close between, then both belong to the same business day.
- **PRD-DAY-006.AC1** Given Day Close at 01:30, then a payment at 01:31 belongs to the next business day.
- **PRD-DAY-002.AC1** Given any user, then there is no Start Day action anywhere in the product.

## 46. Day Close

### Objective
Close an outlet's business day with reconciled totals and full visibility of anything unresolved.

### Actors
Owner, Manager, Cashier.

### Preconditions
Outlet business day is running.

### Main Flow
1. Authorized user opens Day Close and reviews the running-day totals.
2. The product shows warnings for anything unresolved (list below).
3. User enters counted cash and optional notes.
4. User explicitly confirms.
5. The day is Closed at that timestamp; the next business day starts automatically.

Warnings are shown for: orders not Completed or Cancelled; customer orders awaiting acceptance; items Pending, Sent, Preparing or Ready; unresolved bills.

### Alternative Flows
- Close with unresolved items — allowed after explicit confirmation; nothing is cancelled or changed.
- Close with cash variance — allowed; variance recorded.

### Business Rules
- **PRD-DAY-007.1** The Day Close record contains: gross sales, refunds, discounts, net sales, UPI/cash/card sales, expected cash, actual (counted) cash, variance, closing user, timestamp and notes.
- **PRD-DAY-022.1** Day-close sales figures are based on bill finalization; payment status is reported separately. A Finalized + Paid bill contributes finalized sales and paid amount; a Finalized + Not Paid bill contributes finalized sales and remains outstanding; Draft and Reopened bills are not finalized sales. Corrections, refunds and re-finalizations keep both their original business-day attribution and the actual timestamp at which they happened; no further accounting or tax treatment is defined in Phase 1 (SPEC DF-14). *(OD-41)*
- **PRD-DAY-008.1** Expenses are not part of Day Close.
- **PRD-DAY-009.1** Submitting Day Close twice produces one closed day.
- **PRD-DAY-010.1** If the connection drops during Day Close, the result is recoverable and never duplicated. *also: OFFLINE-007*
- **PRD-DAY-011.1** Unresolved bills at close remain visible as unresolved and appear in Owner/Manager analytics; they are never lost or excluded.
- **PRD-DAY-012.1** Day Close is allowed with unresolved items; the closing user sees warnings and must explicitly confirm; nothing is silently cancelled or changed.
- **PRD-DAY-014.1** Day Close and Reopen Day are audited.
- **PRD-DAY-020.1** Warnings cover: orders not Completed or Cancelled; customer orders awaiting acceptance; items Pending, Sent, Preparing or Ready; unresolved bills.

### Permissions
ACT-DAY-01, ACT-DAY-02, ACT-CSH-01, ACT-CSH-02.

### State Changes
Business day: Running → Closed (timestamp = boundary); new Running day begins.

### Acceptance Criteria
- **PRD-DAY-012.AC1** Given an unpaid finalized bill and a Preparing item, when the Cashier starts Day Close, then both are listed as warnings, and closing requires explicit confirmation; afterwards the bill and item are unchanged.
- **PRD-DAY-009.AC1** Given Day Close is submitted twice, then exactly one closed-day record exists.
- **PRD-DAY-010.AC1** Given the connection drops during Day Close, when the user reconnects, then they see one definite outcome — closed or not closed.
- **PRD-DAY-003.AC1** Given a Waiter or Kitchen user, when they try Day Close, then it is refused.
- **PRD-DAY-022.AC1** Given a Finalized + Paid bill of ₹1,000, a Finalized + Not Paid bill of ₹500 and a Draft bill of ₹300 in the business day, then day-close finalized sales are ₹1,500, the paid amount is ₹1,000, ₹500 is outstanding, and the Draft is not counted as sales.

## 47. Reopen Day

### Objective
Allow correction of the most recent closed day without breaking the day timeline.

### Actors
Owner, Manager, Cashier.

### Preconditions
The day to reopen is the outlet's most recently closed day **and** the current running day has zero transactions.

### Main Flow
1. Authorized user selects the most recently closed day and enters a reason.
2. The day becomes Reopened; the empty running period joins it.
3. Corrections are recorded in the reopened day.
4. User re-closes the day; totals and cash reconciliation are recalculated; the re-close timestamp becomes the boundary.

### Business Rules
- **PRD-DAY-013.1** Owner, Manager and Cashier can reopen a day.
- **PRD-DAY-015.1** Only the most recently closed day can be reopened; a reason is required; one outlet never has two active business days; transactions during the reopened period belong to the reopened day; re-close recalculates totals and cash reconciliation.
- **PRD-DAY-018.1** Reopening requires a reason.
- **PRD-DAY-021.1** Reopening is blocked if the current running day has any transaction.
- **PRD-DAY-025.1** For the Reopen Day block, a transaction is any persisted business operation that materially changes operational or financial state: order creation, modification or cancellation; item changes; KOT-related business changes; bill creation, finalization, reopen or cancellation; payment recording or correction; refunds; cash reconciliation; and relevant table/order operational changes. An order awaiting acceptance is a persisted order operation and counts. An uncommitted customer Draft does not count merely because it exists, and opening an empty table by itself does not count. *(OD-47)*
- **PRD-DAY-024.1** On reopen, the empty running period becomes part of the reopened day, and the re-close timestamp becomes that day's boundary.
- **PRD-AUDIT-008.1** The day's audit history shows Closed → Reopened → Reclosed.

### Permissions
ACT-DAY-03.

### State Changes
Closed → Reopened → Reclosed.

### Acceptance Criteria
- **PRD-DAY-021.AC1** Given the current running day already has a transaction, when a Manager tries to reopen the previous day, then it is refused with a state message.
- **PRD-DAY-015.AC1** Given the running day has no transactions, when the Cashier reopens the last closed day with a reason, records a correction and re-closes, then the day's totals and cash reconciliation reflect the correction.
- **PRD-DAY-015.AC2** Given a day that is not the most recently closed, when reopen is attempted, then it is refused.
- **PRD-DAY-025.AC1** Given the running day contains only an opened empty table, then Reopen Day is allowed; given it contains a customer order awaiting acceptance, then Reopen Day is refused.
- **PRD-AUDIT-008.AC1** Given a reopen and re-close, then the audit trail shows Closed → Reopened → Reclosed with actors, times and reason.

## 48. Cash Reconciliation

### Objective
Compare the cash that should be there with the cash counted, at the same boundary as Day Close.

### Actors
Owner, Manager, Cashier.

### Business Rules
- **PRD-CASH-001.1** Cash reconciliation uses the Day Close boundary — no midnight reset, no Start Day.
- **PRD-CASH-002.1** Expected cash is the cash that should be held at the moment the day is closed.
- **PRD-CASH-003.1** Counted cash and variance are recorded.
- **PRD-CASH-004.1** Cash recorded before or after a close belongs to the day in which it was recorded.
- **PRD-CASH-005.1** Reconciliation is per outlet and business day; there is no opening float; expected cash comes from that day's cash transactions; counted cash is entered and variance calculated.
- **PRD-CASH-006.1** A cash variance never blocks Day Close.
- **PRD-CASH-007.1** Expected cash = cash payments recorded in the business day − cash refunds recorded in it (refund mode recorded per PRD-PAY-013.1).

### Permissions
ACT-CSH-01, ACT-CSH-02.

### Acceptance Criteria
- **PRD-CASH-007.AC1** Given ₹10,000 cash payments and a ₹500 cash refund in the business day, then expected cash is ₹9,500; given ₹9,400 counted, then variance −₹100 is recorded.
- **PRD-CASH-006.AC1** Given a variance, when Day Close is confirmed, then the day closes and the variance is stored.

## 49. Unresolved Bills

### Objective
Make sure no unpaid or open bill disappears.

### Business Rules
- **PRD-ANALYTICS-011.1** A bill is unresolved if it is Draft or Reopened, or Finalized with payment status Not Paid. It is resolved when Finalized + Paid, Cancelled or Refunded.
- **PRD-ANALYTICS-010.1** Unresolved bills stay visible and traceable in Owner and Manager analytics until resolved, across Day Close.

### Permissions
ACT-ANL-03.

### Acceptance Criteria
- **PRD-ANALYTICS-010.AC1** Given a Finalized + Not Paid bill when the day closes, then it appears in the closed day's warnings and in the unresolved-bills view until it is paid, cancelled or refunded.

## 50. Owner Analytics

### Objective
Answer the Owner's business questions at a glance — across every outlet — before they need detailed reports.

### Actors
Owner.

### What the Owner needs to understand → metrics → questions → follow-up actions

| Metric (current business day unless stated) | Question answered | Possible follow-up (existing permitted actions only) |
|---|---|---|
| Sales, orders, average order value | How is today going? | Compare outlets; review Attention items |
| Payment mix (UPI/cash/card) | How are customers paying? | Review cash reconciliation |
| Top items, top categories | What sells? | Adjust menu availability/price (ACT-MNU-02/03) |
| Order-source mix | Which channels bring orders? | Review channel configuration (ACT-CFG-01) |
| Peak hours | When is the outlet busiest? | Adjust staff schedule (ACT-ATT-02) |
| Discounts, cancellations, refunds | Where is revenue leaking? | Review audit/cancellation reasons |
| Open orders | What is still in progress? | Follow up with outlet |
| Staff activity | Who did what? | Staff management |
| Payment variance | Does cash reconcile? | Review Day Close records |
| Unresolved bills | What is unpaid or open? | Finalize / record payment (if permitted) |
| Feedback | How do customers rate us? | Operational follow-up |
| Multi-outlet comparison | Which outlet over/under-performs? | Review that outlet |

### Business Rules
- **PRD-ANALYTICS-001.1** The dashboard answers business questions first; detailed reports come second.
- **PRD-ANALYTICS-002.1** The dashboard shows: sales, orders, AOV, payment mix, top items, top categories, order-source mix, peak hours, discounts, cancellations, refunds, open orders, staff activity, payment variance and multi-outlet comparison where applicable.
- **PRD-ANALYTICS-003.1** The Owner sees all outlets and cross-outlet comparison.
- **PRD-ANALYTICS-005.1** "Today" means the current business day since the last Day Close.
- **PRD-ANALYTICS-006.1** Feedback appears as operational insight.
- Unresolved bills always appear (PRD-ANALYTICS-010.1).
- Quantitative success targets for SERVENA itself are DEFERRED (PQ-04, SPEC DF-01).

### Permissions
ACT-ANL-01…04, ACT-FB-02, ACT-CUS-01.

### Acceptance Criteria
- **PRD-ANALYTICS-003.AC1** Given an Owner of two outlets, then the dashboard shows each outlet and a comparison.
- **PRD-ANALYTICS-005.AC1** Given Day Close happened at 01:30, then "today" starts at 01:30, not at midnight.

## 51. Manager Analytics

### Objective
Give Managers the same operational picture for their own outlets only.

### Business Rules
- **PRD-ANALYTICS-004.1** Managers see the dashboard for their assigned outlets only; no organization-wide aggregate and no cross-outlet comparison.
- Same metrics as §50 within scope; unresolved bills always visible (PRD-ANALYTICS-010.1).
- Managers receive the Daily AI Brief, What Changed? and Attention items for their assigned outlets only (PRD-AI-026.1, PRD-AI-028.1, PRD-ATTENTION-008.1).
- Cashier, Waiter and Kitchen have no dashboard access (§13.4, ACT-ANL-01).

### Permissions
ACT-ANL-01 (own outlets), ACT-ANL-02 = N, ACT-ANL-03, ACT-ANL-04 (own outlets), ACT-AI-04, ACT-AI-05.

### Acceptance Criteria
- **PRD-ANALYTICS-004.AC1** Given a Manager of Outlet A, then the dashboard shows only Outlet A and offers no comparison with other outlets.

## 52. Attention Engine

### Objective
Surface meaningful exceptions with evidence so the Owner does not have to inspect every report.

### Actors
Owner (authorized outlets) and Manager (assigned outlets): review, act, dismiss, resolve.

### Main Flow
```
Operational data → detect exception → validate evidence → create Attention item → Owner reviews → act / dismiss / resolve
```

### Business Rules
- **PRD-ATTENTION-001.1** The Attention Engine is part of Phase 1.
- **PRD-ATTENTION-002.1** Attention items follow the flow above.
- **PRD-ATTENTION-003.1** Signals: sales materially below baseline, cash variance, unusually high discount usage, unusual cancellation/void activity, kitchen preparation slowdown, customer reorder gap, outlet underperformance.
- **PRD-ATTENTION-004.1** Each item shows its evidence; it never accuses an employee or claims a cause the data cannot establish.
- **PRD-ATTENTION-005.1** Attention is insight only: it does not create KDS delay alerts and does not contact customers.
- **PRD-ATTENTION-006.1** An Attention item is Open until Dismissed or Resolved; the actor and time are recorded.
- **PRD-ATTENTION-003.2** An unresolved cancellation request that becomes stale creates an Attention item (stale threshold: TRD). *(OD-44)*
- Thresholds and baselines are defined in the TRD (§70).
- **PRD-ATTENTION-008.1** Attention items follow outlet authorization: the Owner sees them for authorized outlets and a Manager for assigned outlets. *(OD-18)*

### Permissions
ACT-ANL-04.

### Acceptance Criteria
- **PRD-ATTENTION-003.AC1** Given a cash variance at Day Close that meets the detection threshold (thresholds: TRD), then an Attention item appears with the variance as evidence.
- **PRD-ATTENTION-004.AC1** Given an unusual-cancellation item, then it shows the cancellation counts and reasons and names no cause beyond the data.
- **PRD-ATTENTION-006.AC1** Given the Owner dismisses an item, then it is Dismissed with the Owner and time recorded.
- **PRD-ATTENTION-008.AC1** Given a Manager of Outlet A, then they see Outlet A's Attention items and none from Outlet B.

## 53. Audit Trail

### Objective
Make every sensitive action attributable and permanent.

### Actors
All users (generate events); SuperAdmin (views).

### Business Rules
- **PRD-AUDIT-001.1** Each sensitive action records who, what, when, outlet, before state, after state and reason (where applicable).
- **PRD-AUDIT-002.1** Audited events include: credential/security actions, permission changes, staff outlet reassignment, menu price/availability changes, discounts, order cancellation/void/hold, item cancellation, re-fire, bill reopen, refund, bill cancellation, payment corrections, Day Close, Day Reopen, AI Menu Import approval and SuperAdmin suspension/deactivation. *also: AUTH-007, RBAC-010, STAFF-011, MENU-013, BILL-013, PAY-007, DAY-014, KDS-014, AI-015*
- **PRD-AUDIT-003.1** A sensitive action without its audit event is a defect.
- **PRD-AUDIT-004.1** AI actions are audited. *also: AI-042*
- **PRD-AUDIT-005.1** Audit records are append-only; nobody can edit or delete them.
- **PRD-AUDIT-007.1** Only SuperAdmin can view the audit trail; no restaurant role (including Owner) can.

### Permissions
ACT-ANL-05 (SuperAdmin only).

### Acceptance Criteria
- **PRD-AUDIT-001.AC1** Given a refund, then its audit record shows actor, time, outlet, amount, before/after state and reason.
- **PRD-AUDIT-005.AC1** Given any audit record, when anyone attempts to edit or delete it, then it is refused.
- **PRD-AUDIT-007.AC1** Given an Owner, when they try to open the audit trail, then it is refused; given SuperAdmin, then it is shown.

## 54. Notifications

### Objective
Make sure the right role learns about a cross-role event when it needs to act. These are product events; device, notification transport and screen layout belong to the UI/UX brief and TRD (PQ-01).

| Event | Who must be informed | Source requirement |
|---|---|---|
| Customer order submitted | Staff who can accept (Owner, Manager, Cashier, Waiter) | PRD-ORD-020.1, PRD-ORD-008.1 |
| Order accepted / rejected | Customer (via order status) | PRD-ORD-022.1 |
| Order Confirmed | Kitchen (KOT on KDS) | PRD-KOT-001.1, PRD-KOT-009.1 |
| Item added after KOT | Kitchen (additional KOT) | PRD-ORD-080.1 |
| Sent item cancelled | Kitchen (cancellation KOT) | PRD-KOT-003.1 |
| Cancellation request (Preparing/Ready) | Kitchen (to acknowledge) | PRD-ORD-088.1 |
| Kitchen cancels items | Waiter/Cashier and customer (order view) | PRD-KDS-013.1 |
| Order Ready | Waiter (serve) or handoff staff (pickup); customer (status) | PRD-ORD-050.1, PRD-HANDOFF-001.1/002.1 |
| Onboarding | Owner (email invitation) | PRD-ONB-006.1 |
| WhatsApp / email failure | Staff / Owner (failure surfaced) | PRD-INTEG-002.1, PRD-INTEG-003.1 |
| Unresolved items at Day Close | Closing user (warnings) | PRD-DAY-012.1 |
| Attention item created | Owner; Manager for assigned outlets | PRD-ATTENTION-002.1, PRD-ATTENTION-008.1 |

### Staff operational visibility *(PQ-01)*
Device, notification transport and screen layout belong to the UI/UX brief and TRD; the product behavior is:

- **PRD-ORD-008.2** Staff who can accept (Owner, Manager, Cashier and Waiter of the outlet) receive operational visibility of every new customer-originated order awaiting acceptance.
- **PRD-HANDOFF-001.2** Staff responsible for handoff receive visibility of orders/items that are Ready: the Waiter for table orders; Waiter and Cashier for takeaway orders (PRD-HANDOFF-004.1).
- **PRD-ORD-088.2** The Kitchen receives visibility of every cancellation request that requires its acknowledgement.
- **PRD-ATTENTION-002.2** The Owner (authorized outlets) and Manager (assigned outlets) receive visibility of relevant operational Attention items.
- **PRD-KOT-009.2** The Kitchen receives new, additional and cancellation KOTs on the KDS.
- **PRD-KDS-013.2** The outlet's Waiter and Cashier can see items cancelled by the kitchen.
- **PRD-INTEG-002.2** WhatsApp and email integration failures are surfaced to outlet staff and the Owner.

## 55. Offline and Reconnection Behavior

### Objective
Keep operations correct when networks are unreliable.

### Business Rules
- **PRD-OFFLINE-001.1** If the network is lost while an order is being created, the user sees whether it is pending or failed, can retry safely, and no duplicate order is created.
- **PRD-OFFLINE-002.1** The product always tells the user whether a submission succeeded, failed or is still pending.
- **PRD-OFFLINE-003.1** Retries are safe; records are never partially duplicated.
- **PRD-OFFLINE-004.1** An interrupted KOT results in one KOT (PRD-KOT-007.1).
- **PRD-OFFLINE-005.1** The KDS reconnects and recovers its current state (PRD-KDS-016.1).
- **PRD-OFFLINE-006.1** Payment-information retries never duplicate payments (PRD-PAY-006.1).
- **PRD-OFFLINE-007.1** An interrupted Day Close has one recoverable outcome (PRD-DAY-010.1).
- **PRD-OFFLINE-008.1** Offline behavior is limited to safe client-side resilience: the product may preserve user-entered work locally, queue eligible operations, retry after reconnection and deduplicate retries. The server remains authoritative. Offline mode never bypasses permissions, outlet state or business-state validation, never creates conflicting financial truth, and never silently overwrites newer server data. The list of offline-eligible actions belongs to the TRD. *(OD-27)*

### Acceptance Criteria
- **PRD-OFFLINE-002.AC1** Given a submit with no network, then the user sees "pending" or "failed" — never a false "success".
- **PRD-OFFLINE-001.AC1** Given a retry after a lost connection, then exactly one order exists.
- **PRD-OFFLINE-008.AC1** Given a Waiter queues an item addition while offline and the outlet is Closed before reconnection, when the queue is sent, then the server refuses the addition, the Waiter is told, and no server data is overwritten.

## 56. External Integration Failure Behavior

### Business Rules
- **PRD-INTEG-001.1** If the AI provider is unavailable, ordering, KOT, kitchen, billing and Day Close continue; AI features show that they are unavailable.
- **PRD-INTEG-002.1** If WhatsApp is unavailable, no order data is corrupted and the failure is shown to staff/Owner.
- **PRD-INTEG-003.1** If email is unavailable, provisioned accounts stay recoverable and onboarding can be retried.
- Payment gateway: not applicable in Phase 1.

### Acceptance Criteria
- **PRD-INTEG-001.AC1** Given the AI provider is down, then a full order-to-Day-Close cycle completes normally.
- **PRD-INTEG-002.AC1** Given WhatsApp is down mid-conversation, then no partial order is created and staff see the integration failure.

## 57. AI Menu Import

### Objective
Turn an existing menu file into a structured draft the Owner approves — without retyping.

### Actors
Owner only (§13.4: ACT-AI-01, ACT-AI-02, ACT-AI-07).

### Main Flow
1. Owner uploads a PDF, image or Excel/CSV menu.
2. AI extracts a structured draft (categories, items, prices, attributes; may suggest variants/modifiers).
3. Low-confidence fields and duplicates are flagged.
4. Owner reviews and edits the draft.
5. Owner approves; only approved content goes live.

### Business Rules
- **PRD-AI-010.1** Import accepts PDF, image and Excel/CSV files.
- **PRD-AI-011.1** AI produces a structured draft — an **AI-generated output**, never live data.
- **PRD-AI-012.1** Low-confidence fields are visibly flagged.
- **PRD-AI-013.1** The Owner reviews and may edit the draft.
- **PRD-AI-014.1** Only Owner-approved content becomes live; AI never publishes menu data.
- **PRD-AI-015.1** Approval is audited.
- **PRD-AI-016.1** Duplicate items in an import are flagged before approval.

### Permissions
ACT-AI-01, ACT-AI-07, ACT-AI-02 (Owner approval).

### Acceptance Criteria
- **PRD-AI-014.AC1** Given an import not yet approved, then none of its items are orderable.
- **PRD-AI-012.AC1** Given a price read with low confidence, then it is flagged in review.
- **PRD-AI-016.AC1** Given an import repeats an existing item, then it is flagged as a duplicate before approval.

## 58. Owner AI Agent

### Objective
Let the Owner ask questions, get analysis and recommendations, and carry out explicitly permitted actions — without bypassing any rule.

### Actors
Owner only (§13.4: ACT-AI-03, ACT-AI-08).

### Main Flow
1. Owner asks a question.
2. Agent answers from authorized data, separating **facts** from **recommendations**.
3. If the Owner asks for an explicitly permitted business action, the agent executes it through a controlled business tool — after explicit Owner confirmation when the action is sensitive — subject to the same permission, state and audit rules as a human.

### Business Rules
- **PRD-AI-020.1** The Owner Agent, Daily AI Brief and What Changed? use only data the user is authorized to see.
- **PRD-AI-021.1** They clearly separate facts from recommendations.
- **PRD-AI-022.1** They never invent missing operational facts.
- **PRD-AI-023.1** They never bypass RBAC. *also: SEC-005*
- **PRD-AI-024.1** They have no unrestricted access to production data; they act only through controlled tools.
- **PRD-AI-025.1** The Owner Agent may answer, analyze, recommend and execute explicitly permitted actions through controlled tools; it never bypasses RBAC, approvals, business rules or audit, never changes data directly, and never invents facts.
- **PRD-AI-029.1** The Owner Agent is read-only by default. It executes only explicitly permitted business actions through controlled business tools. Sensitive actions require explicit Owner confirmation before execution: refunds, payment corrections, permission/RBAC changes, staff credentials/access, outlet Open/Closed state, menu price changes, and destructive or corrective operational actions. The agent never receives unrestricted database access, never bypasses RBAC or business-state rules, never silently mutates operational truth, and every executed action is audited. Tool implementation belongs to the TRD. *(OD-37)*

### Permissions
ACT-AI-03, ACT-AI-08.

### Acceptance Criteria
- **PRD-AI-021.AC1** Given the Owner asks "how were sales yesterday?", then the answer shows the figures as facts and any suggestion labelled as a recommendation.
- **PRD-AI-022.AC1** Given data that does not exist, then the agent says it is unavailable rather than estimating it as fact.
- **PRD-AI-029.AC1** Given the Owner asks the agent to record a refund, then nothing happens until the Owner explicitly confirms, the refund then follows the normal refund rules, and the executed action is audited.
- **PRD-AI-025.AC1** Given the Owner asks the agent to perform an action that is not explicitly permitted, then it is refused.

## 59. Daily AI Brief

### Objective
Summarize an outlet's business day for the Owner and Manager.

### Business Rules
- **PRD-AI-027.1** The brief covers a business day bounded by Day Close.
- Boundaries PRD-AI-020.1…024.1 apply.
- **PRD-AI-026.1** The Daily AI Brief is associated with the outlet business-day lifecycle (never a midnight-bounded day). It summarizes sales, orders, bills and payment status, operational anomalies, Attention items, meaningful operational changes, useful business-day comparisons, and important changes requiring Owner/Manager awareness. It contains no fabricated values and clearly separates facts from recommendations. The Owner can view it for authorized outlets; a Manager for assigned outlets. The trigger, exact time and delivery mechanism are downstream TRD/UI details. *(OD-18, PQ-02)*

### Acceptance Criteria
- **PRD-AI-026.AC1** Given a Manager of Outlet A, then their brief covers Outlet A only.
- **PRD-AI-027.AC1** Given Day Close at 01:30, then the brief covers the period ending at 01:30, not a calendar day.

## 60. What Changed?

### Objective
Show the Owner and Manager what changed, with evidence.

### Business Rules
- Boundaries PRD-AI-020.1…024.1 apply; facts and recommendations are separated.
- **PRD-AI-028.1** What Changed? compares the current meaningful business/operational state against the most recent comparable completed business-day baseline available. It highlights meaningful changes in sales, order volume/status, bills/payments, operational anomalies, Attention and meaningful menu/staff/outlet configuration. It is not a raw audit viewer. If no valid comparable baseline exists, it says the comparison is unavailable and never fabricates one. The Owner and Manager use it within outlet authorization. *(OD-29, PQ-03)*

### Permissions
ACT-AI-05.

### Acceptance Criteria
- **PRD-AI-028.AC1** Given an outlet with no completed business day yet, then What Changed? states that a comparison is unavailable.
- **PRD-AI-028.AC2** Given a menu price changed in the current business day, then What Changed? reports it as a meaningful change, not as a raw audit entry.

## 61. WhatsApp Ordering Agent

### Objective
Take orders over WhatsApp accurately.

### Business Rules
- **PRD-AI-032.1** The agent offers only published, currently available items at current prices; it never invents items or prices.
- PRD-AI-030.1, PRD-AI-031.1, PRD-AI-033.1 (§26) and PRD-ORG-030.1 (closed outlet) apply.
- If WhatsApp fails: PRD-INTEG-002.1.

### Acceptance Criteria
- **PRD-AI-032.AC1** Given a customer asks for an item not on the menu, then the agent does not add it to the order.

## 62. AI Safety and Guardrails

### Output classes

| Class | Meaning | Example | Rule |
|---|---|---|---|
| **FACT** | A value read from operational records | "Sales: ₹48,200" | Must match source data |
| **RECOMMENDATION** | A suggestion based on facts | "Consider reviewing discounts at Outlet B" | Labeled; never executed automatically |
| **AI-GENERATED OUTPUT** | Content created by AI that is not yet truth | Menu import draft | Becomes truth only after authorized approval |
| **AUTHORIZED ACTION** | An action executed on a user's explicit request | Explicitly permitted Owner Agent action | Same permission, state and audit rules as a human |

### Business Rules
- **PRD-AI-040.1** If AI is unavailable, ordering, KOT, kitchen, billing and Day Close continue. *also: INTEG-001*
- **PRD-AI-041.1** If AI output fails, the product falls back to normal non-AI behavior (e.g., manual menu entry).
- **PRD-AI-042.1** AI actions are permissioned and audited.
- **PRD-AI-043.1** Business rules are applied by the product, not by AI reasoning.
- **PRD-AI-044.1** Kitchen priority is never set by AI.
- **PRD-AI-045.1** If an AI result conflicts with source data, the source data wins.
- AI is never the source of operational truth (PRD-AI-004.1).

### Acceptance Criteria
- **PRD-AI-045.AC1** Given the agent's summary disagrees with recorded sales, then the recorded sales are shown as the fact.
- **PRD-AI-042.AC1** Given the Owner Agent executes an action, then an audit record shows the action, the requesting Owner and the AI origin.

## 63. Security and Privacy Requirements

- **PRD-SEC-001.1** Tenant isolation: no user ever sees another organization's data (SuperAdmin platform functions excepted).
- **PRD-SEC-002.1** Cross-outlet access attempts are refused unless permitted.
- **PRD-SEC-003.1** Duplicate financial operations are prevented (orders, payments, Day Close).
- **PRD-SEC-004.1** Inactive users cannot act.
- **PRD-SEC-005.1** Unauthorized AI tool actions are blocked.
- Customers see only their own orders via non-guessable links (PRD-CUSTOMER-003.1, PRD-AUTH-009.1).
- Baseline controls (rate limiting, validation, payment-reference handling) are specified in the TRD (§70).

### Acceptance Criteria
- **PRD-SEC-002.AC1** Given a Cashier of Outlet A, when Outlet B records are requested, then access is denied.
- **PRD-SEC-003.AC1** Given a duplicated payment or Day Close submission, then only one record results.

## 64. Cross-Role Workflows

These end-to-end flows combine requirements defined above; they add no new rules.

### 64.1 Dine-in via table QR
| Step | Actor | Requirement |
|---|---|---|
| Scan, order, submit | Customer | PRD-ORD-020.1, PRD-TABLE-005.1 |
| Accept (or reject with reason) | Owner/Manager/Cashier/Waiter | PRD-ORD-008.1 |
| KOT to KDS, routed by station | System | PRD-KOT-001.1, PRD-KOT-006.1 |
| Preparing → Ready | Kitchen | PRD-KDS-003.1, PRD-KDS-009.1 |
| Serve | Waiter | PRD-HANDOFF-001.1 |
| Finalize bill, record payment | Cashier (or per §13.4) | PRD-BILL-001.1, PRD-PAY-010.1 |
| Completed, feedback | System, Customer | PRD-ORD-063.1, PRD-FEEDBACK-001.1 |

### 64.2 Takeaway via tableless QR / website / WhatsApp
Customer orders with name + phone (no OTP) → staff accepts → KOT marked TAKEAWAY → Ready → Waiter or Cashier records Picked Up → bill/payment → Completed.
(PRD-ORD-030.1…033.1, PRD-ORD-042.1, PRD-AI-030.1…033.1, PRD-KOT-005.1, PRD-HANDOFF-002.1/004.1)

### 64.3 Waiter dine-in with later change
Waiter opens table → order Confirmed → KOT → customer adds an item (additional KOT) → customer cancels a Preparing item (cancellation request → Kitchen acknowledges) → Served → bill excludes the cancelled item.
(PRD-ORD-050.1, PRD-ORD-080.1, PRD-ORD-088.1, PRD-ORD-087.1)

### 64.4 Kitchen unavailability
Kitchen cancels an item with reason → order and bill update → Waiter/Cashier and customer see it → audited.
(PRD-KDS-011.1…014.1, PRD-ORD-087.1)

### 64.5 Post-payment correction
Paid bill → authorized user (incl. Waiter) reopens with reason → correction → re-finalize → payment status recalculated (PRD-PAY-012.1) or refund recorded by Owner/Manager/Cashier → audited.
(PRD-BILL-005.1, PRD-BILL-014.1, PRD-BILL-017.1, PRD-BILL-006.1, PRD-AUDIT-002.1)

### 64.6 Outlet closing with open work
Owner/Manager closes outlet → new orders blocked on all channels → orders awaiting acceptance stay pending until the outlet reopens → existing confirmed orders finish in kitchen, handoff and billing → authorized bill corrections and refunds remain possible → Day Close remains available.
(PRD-ORG-021.1, PRD-ORG-024.1…034.1)

### 64.7 Day Close and Reopen
Cashier reviews totals → sees warnings for unresolved items → enters counted cash → confirms → day Closed → next day starts automatically. If a correction is needed and the new day has no transactions: reopen with reason → correct → re-close (totals and cash recalculated).
(PRD-DAY-012.1, PRD-DAY-020.1, PRD-CASH-005.1, PRD-DAY-015.1, PRD-DAY-021.1, PRD-AUDIT-008.1)

### 64.8 Table operations
Transfer / merge / split / move items by Owner or Manager → auditable event → history preserved → order/bill ownership unchanged → kitchen sees current table.
(PRD-TABLE-009.1, PRD-TABLE-014.1…018.1, PRD-RBAC-028.1)

## 65. Error States

Every error state below is observable by the user and leaves data unchanged (PRD-RBAC-008.1).

| Situation | What the user experiences | Requirement |
|---|---|---|
| Action not permitted | Refusal naming the failed factor (permission / outlet / state / approval) | PRD-RBAC-016.1 |
| Other outlet's data requested | Refusal; no data shown | PRD-SEC-002.1 |
| Inactive account | Sign-in refused | PRD-AUTH-006.1 |
| Outlet Closed / not activated | "Ordering unavailable" | PRD-ORG-021.1, PRD-ONB-032.1 |
| Accept/reject while outlet Closed | Refused; order stays awaiting acceptance | PRD-ORG-033.1 |
| Reorder of an ineligible order | Reorder not offered | PRD-CUSTOMER-020.1 |
| Agent sensitive action without confirmation | Nothing executed until the Owner confirms | PRD-AI-029.1 |
| Missing name/phone (tableless QR, website) | Field-level message | PRD-ORD-030.1, PRD-ORD-042.1 |
| Item became unavailable during checkout | Told which item; not ordered | PRD-MENU-015.1 |
| Submission interrupted | Pending / failed shown; safe retry | PRD-OFFLINE-001.1, PRD-OFFLINE-002.1 |
| Concurrent edit | Told the data changed | PRD-TABLE-008.1 |
| Edit on Finalized bill | Directed to reopen | PRD-BILL-004.1 |
| Cancellation without reason | Refused | PRD-ORD-089.1 |
| Cancelling Served/Picked Up item | Directed to bill correction/refund | PRD-ORD-082.1 |
| Reopen Day blocked | State message (running day has transactions / not the latest day) | PRD-DAY-021.1, PRD-DAY-015.1 |
| Duplicate Day Close / payment | One record; user sees the existing result | PRD-DAY-009.1, PRD-PAY-006.1 |
| AI unavailable | AI feature shows unavailable; operations continue | PRD-INTEG-001.1 |
| WhatsApp / email failure | Failure surfaced; data intact; retry path | PRD-INTEG-002.1, PRD-INTEG-003.1 |

## 66. Edge Cases

All edge cases come from SPEC v1.1 (§30 of SPEC) and map to requirements above.

| Area | Edge case | Covered by |
|---|---|---|
| Duplicate orders | Double submit; retry after timeout | PRD-ORD-006.1, PRD-OFFLINE-001.1 |
| Cancellation | After KOT; during Preparing/Ready; after Served | PRD-ORD-082.1, PRD-ORD-088.1 |
| Cancellation | Request declined or left pending; item served while pending | PRD-ORD-093.1, PRD-ATTENTION-003.2 |
| Kitchen unavailability | Item unavailable after order | PRD-KDS-011.1 |
| Kitchen | Multiple stations; one Ready, one Preparing | PRD-KDS-009.1 |
| Kitchen | KDS disconnect | PRD-KDS-016.1 |
| Outlet closed | New orders; existing orders; adding items; billing | PRD-ORG-021.1…030.1 |
| Outlet closed | Orders awaiting acceptance at closing; corrections while Closed | PRD-ORG-033.1, PRD-ORG-034.1 |
| Unresolved bills | Draft/unpaid bill at Day Close | PRD-DAY-011.1, PRD-ANALYTICS-010.1 |
| Day Close | Open orders, pending acceptance, Preparing KOT | PRD-DAY-012.1, PRD-DAY-020.1 |
| Day Close | Submitted twice; interrupted | PRD-DAY-009.1, PRD-DAY-010.1 |
| Day Close | Transaction crossing midnight; cash after close | PRD-DAY-005.1, PRD-CASH-004.1 |
| Reopen Day | New day already has transactions | PRD-DAY-021.1 |
| Cash variance | Variance at close | PRD-CASH-006.1 |
| Table operations | Transfer during active KOT; merge with several orders | PRD-TABLE-009.1, PRD-TABLE-018.1 |
| Table operations | Concurrent edits; old paid bill; abandoned draft | PRD-TABLE-008.1, PRD-TABLE-011.1, PRD-TABLE-007.1 |
| Billing | Finalize without payment; reopen paid; partial/full refund; cancel vs refund; reprint; split | §38–§40 |
| Menu | Sold out at checkout; modifier unavailable; tax change; price override | PRD-MENU-015.1, PRD-MENU-016.1, PRD-MENU-017.1, PRD-MENU-009.1 |
| Staff | Reassignment; Absent + Available; inactive login; unavailable mid-service | PRD-STAFF-010.1, PRD-STAFF-007.1, PRD-AUTH-006.1, PRD-STAFF-013.1 |
| Permissions | Denied action; UI-hidden action; Manager acting on Managers | PRD-RBAC-008.1, PRD-RBAC-007.1, PRD-RBAC-029.1 |
| Multi-outlet | Manager / Cashier requesting other outlet | PRD-ORG-007.1, PRD-SEC-002.1 |
| Offline | Lost network during order/KOT/payment/Day Close | §55 |
| Integrations | AI, WhatsApp, email failure | §56 |
| AI | Hallucination; unauthorized tool action; unapproved import; conflict with data | PRD-AI-022.1, PRD-AI-023.1, PRD-AI-014.1, PRD-AI-045.1 |
| Onboarding | Invitation not received; suspended mid-operation; outlet added later | PRD-ONB-013.1, PRD-ONB-014.1, PRD-ONB-015.1 |
| Customer | Abandons order; sees only own order; reorder item unavailable | PRD-ORD-064.1, PRD-ORD-064.2, PRD-CUSTOMER-003.1, PRD-CUSTOMER-014.1 |
| Billing | Draft bill with payments gains or loses items; overpayment | PRD-PAY-012.1 |

## 67. Acceptance Criteria

Acceptance criteria are written inline in each capability section as `PRD-<SPEC-ID>.AC<n>` in Given / When / Then form. Every capability's criteria, taken together, must be testable in all five categories:

| Category | Example |
|---|---|
| Happy path | PRD-ORD-020.AC2 |
| Invalid transition | PRD-ORD-061.AC1 |
| Permission denial | PRD-RBAC-012.AC1 |
| Duplicate / retry / idempotency | PRD-ORD-006.AC1, PRD-DAY-009.AC1 |
| Failure / offline / recovery | PRD-KDS-016.AC1, PRD-INTEG-001.AC1 |

The full list is indexed in [PRD_TRACEABILITY.md](PRD_TRACEABILITY.md).

## 68. Product Completion Criteria

Phase 1 is product-complete when:

- **PRD-PC-001.1** The full loop runs with AI disabled: provision → setup → menu → staff → tables → table-QR order → acceptance → KOT → KDS Ready → Served → finalize → split payment information → Day Close.
- **PRD-PC-002.1** A tableless-QR order (name + phone, no OTP) runs end to end as Takeaway → Picked Up.
- **PRD-PC-003.1** Every `Y`/`N` cell in §13.4 is enforced and has a permission test.
- **PRD-PC-004.1** Every audited event in PRD-AUDIT-002.1 produces a record with before/after state.
- **PRD-PC-005.1** None of the excluded behaviors exist: multiple kitchens per outlet, payment execution, 2FA/mandatory OTP, Admin/Supervisor/Support roles, delayed KDS workflow, midnight boundary or Start Day.
- **PRD-PC-006.1** All six AI capabilities respect PRD-AI-020.1…024.1 and degrade per PRD-AI-040.1/041.1.
- **PRD-PC-007.1** No requirement is OPEN or PROPOSED. (Satisfied by PRD v1.0: every decision in §71 is closed.)

## 69. Phase 1 Risks

*(Product analysis — not requirements.)*

| Risk | Why it matters | Mitigation in this PRD |
|---|---|---|
| Strict deny-by-default permissions | Some roles lack actions they may want (e.g., a Waiter cannot clear or transfer tables, print bills or see the dashboard) | Owner can extend roles within the catalogue (PRD-RBAC-005.1); every cell is explicit (PRD-RBAC-019.1) |
| Acceptance bottleneck | Every customer-originated order waits for staff | Staff operational visibility of pending orders (PRD-ORD-008.2) |
| Stale cancellation requests | Food may be prepared for an item the guest no longer wants | Stale requests become Attention items (PRD-ATTENTION-003.2); Served/Picked Up wins (PRD-ORD-093.1) |
| Billing calculation detail deferred | GST, discount, charge, rounding and invoice-numbering rules are not yet specified | DEFERRED to the downstream specification (PQ-07, SPEC DF-14); PRD fixes behavior around them |
| Overpayment on Draft bills | Items removed after payment create money owed back | Overpayment shown explicitly until resolved by authorized correction/refund (PRD-PAY-012.1) |
| Owner Agent actions | Unsafe automation | Read-only by default; sensitive actions need explicit Owner confirmation; audited (PRD-AI-029.1) |
| Customer identity without accounts | Duplicate or merged customer records | Phone key at organization scope; outlet-scoped visibility; private links (PRD-CUSTOMER-021.1) |
| Audit visible only to SuperAdmin | Owners cannot self-investigate from the audit trail | CONFIRMED decision (PRD-AUDIT-007.1); Attention and What Changed? give evidence-based insight instead |
| Thresholds not yet set | Draft inactivity and stale-request timing affect operations | Product guarantees fixed here; values set in the TRD (SPEC DF-13) |

## 70. Deferred Features

| ID | Item | Status | Owner document |
|---|---|---|---|
| DF-01 / PQ-04 | Quantitative success metrics; market narrative — Phase 1 goals stay qualitative | DEFERRED | Later product planning |
| DF-02 / ATTENTION-007 | Attention thresholds and baselines | DEFERRED | TRD |
| DF-03 / TABLE-013 / AUDIT-006 | Transition tables, permission atoms, idempotency keys, offline mechanics, audit payloads, API contracts | DEFERRED | TRD |
| DF-04 | Optional customer phone verification | DEFERRED — not built unless requested | — |
| DF-05 / KOT-010 | Thermal KOT/bill printer integration | DEFERRED | Post-Phase 1 unless requested |
| DF-06 | Payment gateway execution | DEFERRED | Later phase |
| DF-07 | Public reviews | DEFERRED | Phase 2 |
| DF-08 / KDS-015 | Reason-capture format | Rule defined here (PRD-KDS-015.1); reason catalogue content refinable downstream | PRD / configuration |
| DF-09 / SEC-006 | Rate limiting, input validation, payment-reference handling | DEFERRED | TRD |
| DF-10 / ONB-033 | Onboarding checklist contents | Defined here (PRD-ONB-033.1) | PRD |
| DF-11 | Concurrency mechanism | DEFERRED | TRD |
| DF-12 | Private order-link mechanism | DEFERRED | TRD |
| DF-13 | Draft inactivity threshold; stale cancellation-request threshold; Daily AI Brief trigger, time and delivery; staff-alert device, transport and layout; offline-eligible action list; Owner Agent tool implementation | DEFERRED | TRD / UI-UX brief |
| DF-14 / PQ-07 | Billing calculation policies: GST/tax calculation, discount rules, service- and packaging-charge basis, rounding, invoice numbering, accounting treatment beyond PRD-DAY-022.1 | DEFERRED | Downstream specification (TRD / configuration) |

## 71. Decision Record

Every decision below is CLOSED. Decisions OD-nn are final product decisions issued by the product owner on 2026-10-07 and written back into SPEC v1.1 as amendment A1. No PROPOSED or OPEN product decision remains in this PRD.

### 71.1 SPEC decisions closed for this PRD

| ID | SPEC req | Final rule (PRD) | Status |
|---|---|---|---|
| OD-12 | RBAC-005 | PRD-RBAC-005.1 — customization only within the catalogue; Manager only if granted | CONFIRMED |
| OD-14 | ORD-064, TABLE-007 (amended) | PRD-ORD-064.2, PRD-TABLE-007.1 — Draft kept; abandoned Draft releases its table claim | CONFIRMED |
| OD-15 | ORD-073 | PRD-ORD-073.1 — Hold / Void / Re-fire definitions; catalogue ACT-MOD-03/04/06/07, ACT-KOT-04 | CONFIRMED |
| OD-16 | ONB-015 | PRD-ONB-015.1 — Owner adds outlets; automatic multi-outlet | CONFIRMED |
| OD-17 | ONB-014 | PRD-ONB-014.1 — suspension blocks new business; confirmed orders continue | CONFIRMED |
| OD-18 | AI-026, ATTENTION-008 | PRD-AI-026.1, PRD-ATTENTION-008.1 — Brief, What Changed?, Attention for Owner and Manager within outlet authorization | CONFIRMED |
| OD-22 | MENU-017 | PRD-MENU-017.1 — price/tax snapshot per order line | CONFIRMED |
| OD-24 | PAY-003 (amended), PAY-011 | PRD-PAY-003.1, PRD-PAY-011.1 — record reference when supplied; never fabricate | CONFIRMED |
| OD-25 | MENU-011 (amended) | PRD-MENU-011.2 — menu-item availability: current business day or permanent | CONFIRMED |
| OD-26 | STAFF-013 | PRD-STAFF-013.1 — no implicit reassignment; no new subsystem | CONFIRMED |
| OD-27 | OFFLINE-008 | PRD-OFFLINE-008.1 — safe client-side resilience; server authoritative | CONFIRMED |
| OD-29 | AI-028 | PRD-AI-028.1 — most recent comparable completed business day; no fabricated baseline | CONFIRMED |
| OD-31 | ORG-033 | PRD-ORG-033.1 — pending orders stay pending while Closed | CONFIRMED |
| OD-33 | PAY-013 | PRD-PAY-013.1 — refund record fields | CONFIRMED |
| OD-36 | CUSTOMER-020 | PRD-CUSTOMER-020.1 — eligibility, table/Takeaway context, Closed rejection | CONFIRMED |
| OD-37 | AI-029 | PRD-AI-029.1 — read-only default; sensitive actions need Owner confirmation | CONFIRMED |
| OD-38 | CUSTOMER-021 | PRD-CUSTOMER-021.1 — phone key at organization scope; outlet-scoped visibility | CONFIRMED |
| OD-39 | PAY-012, BILL-005 (amended) | PRD-PAY-012.1, PRD-BILL-005.1 — Draft correction without Reopen; overpayment explicit | CONFIRMED |
| OD-40 | ORD-065 | PRD-ORD-065.1 — all items cancelled → Cancelled | CONFIRMED |
| OD-41 | DAY-022 | PRD-DAY-022.1 — finalization-based sales; payment reported separately | CONFIRMED |
| OD-42 | ORG-034 | PRD-ORG-034.1 — corrections allowed while Closed | CONFIRMED |
| OD-43 | ORG-032 | PRD-ORG-032.1 — no automatic Open/Closed | CONFIRMED |
| OD-44 | ORD-093, ORD-088 (amended) | PRD-ORD-088.1, PRD-ORD-093.1, PRD-ATTENTION-003.2 — accept/decline; Served wins; stale → Attention | CONFIRMED |
| OD-45.1 | RBAC-019 | PRD-RBAC-019.1; §13.4 has no undecided cells | CONFIRMED |
| OD-46 | TABLE-018 | PRD-TABLE-018.1 — order is the billing ownership boundary | CONFIRMED |
| OD-47 | DAY-025 | PRD-DAY-025.1 — what counts as a transaction for Reopen Day | CONFIRMED |

### 71.2 PRD questions

| ID | Topic | Resolution | Status |
|---|---|---|---|
| PQ-01 | Staff operational visibility | §54 (PRD-ORD-008.2, PRD-HANDOFF-001.2, PRD-ORD-088.2, PRD-ATTENTION-002.2, PRD-KOT-009.2, PRD-KDS-013.2, PRD-INTEG-002.2); device/transport/layout → UI/UX + TRD | CONFIRMED |
| PQ-02 | Daily AI Brief content | PRD-AI-026.1 | CONFIRMED |
| PQ-03 | What Changed? content | PRD-AI-028.1 | CONFIRMED |
| PQ-04 | Quantitative success targets | No numeric targets in Phase 1; goals remain qualitative | DEFERRED (DF-01) |
| PQ-05 | Activation checklist | PRD-ONB-033.1 | CONFIRMED |
| PQ-06 | Reason categories | PRD-KDS-015.1 | CONFIRMED |
| PQ-07 | Billing calculation policies | Not defined in the PRD; no PRD blocker | DEFERRED (DF-14) |
| PQ-08 | Feedback channels | PRD-FEEDBACK-002.2 | CONFIRMED |

### 71.3 Contradictions with SPEC — resolved

| ID | Conflict | Resolution |
|---|---|---|
| C-PRD-01 | Draft expiry vs Drafts remaining identifiable | OD-14 — SPEC ORD-064 and TABLE-007 amended (A1); PRD-ORD-064.2, PRD-TABLE-007.1 |
| C-PRD-02 | Mandatory transaction ID vs reference not always supplied | OD-24 — SPEC PAY-003 amended (A1); PRD-PAY-003.1, PRD-PAY-011.1 |
| C-PRD-03 | Draft bill with payments vs Reopen-only correction | OD-39 — SPEC BILL-005 amended, PAY-012 closed (A1); PRD-BILL-005.1, PRD-PAY-012.1 |
| C-PRD-04 | "For a particular day" vs business day | OD-25 — SPEC MENU-011 amended (A1); PRD-MENU-011.2 |

Two further conflicts found during finalization were also resolved: ORD-088 ("on acknowledgement → Cancelled") vs OD-44 (Kitchen may decline) — SPEC ORD-088 amended (A1); and reorder "creates a new order" vs one active order per table session — reconciled in PRD-CUSTOMER-020.1 (items join the active order; the historical order is never mutated).

### 71.4 Ambiguities — resolved

| ID | Ambiguity | Resolution |
|---|---|---|
| A-PRD-01 | Second outlet and single/multi structure | Becomes multi-outlet automatically (PRD-ONB-015.1) |
| A-PRD-02 | Confirmed orders during suspension | Continue through kitchen, handoff and billing (PRD-ONB-014.1) |
| A-PRD-03 | Void vs cancellation rules | Void follows cancellation state-safety and preserves history (PRD-ORD-073.1) |
| A-PRD-04 | OD-25 scope | Menu-item availability only (PRD-MENU-011.2) |
| A-PRD-05 | Work reassignment | No separate subsystem; only existing staff/table/order operations (PRD-STAFF-013.1) |
| A-PRD-06 | Rejecting pending orders while Closed | Not allowed; pending until reopen (PRD-ORG-033.1) |
| A-PRD-07 | Overpayment representation | Payments − current bill total, shown until resolved (PRD-PAY-012.1) |
| A-PRD-08 | What Changed? baseline | Most recent comparable completed business day (PRD-AI-028.1) |
| A-PRD-09 | Business day of corrections/refunds | Original attribution and actual timestamp both kept; no further accounting treatment (PRD-DAY-022.1) |
| A-PRD-10 | Pending request when item is Served/Picked Up | Request becomes a no-op, kept in audit (PRD-ORD-093.1) |
| A-PRD-11 | Table open / Draft / pending order as transaction | Empty table open and uncommitted Draft do not count; order awaiting acceptance counts (PRD-DAY-025.1) |
| A-PRD-12 | Feedback without customer link | Not offered (PRD-FEEDBACK-002.2) |

No ambiguity from this list remains open.

---

*End of PRD v1.0 — FINALIZED — READY FOR PRODUCT-OWNER APPROVAL. All product decisions are closed; the product owner's explicit approval of this PRD is still required. TRD work starts only after that approval.*
