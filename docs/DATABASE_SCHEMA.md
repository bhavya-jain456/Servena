# SERVENA — Database Schema & Data Model Contract

> **SERVENA — The Operating System for Modern Restaurants**
> The canonical persistence contract for Phase 1: which collections exist, what they hold, how they are keyed, indexed, constrained, protected and retained. It defines **how data is stored**, never **what the product does**: it adds no product behaviour.

## 1. Document Control

| Field | Value |
|---|---|
| Document | SERVENA Database Schema & Data Model Contract |
| Version | **v1.0 — APPROVED FOR IMPLEMENTATION** (reconciliation passes R1, R2 and R3 applied; §22.4, §27, §28) |
| Status | **APPROVED FOR IMPLEMENTATION** — all known approval blockers are closed (§27): UC-2, OD-DB-5, 8, 15b, 18, 19, 21 and 27 are resolved and traceable (§22.4), the final gates pass (§27.1), and the product owner issued the closure decisions of 2026-10-08. 17 non-blocking, schema-neutral items remain open with named resolvers (§22.2). This status authorizes the **Implementation Plan to be drafted next**; it does not start it, and no code exists |
| Date | 2026-10-08 (R1 reconciliation and R2 decision-closure pass; first draft 2026-10-07) |
| Upstream (canonical) | SPEC.md **v1.3** · docs/product/PRD.md **v1.2** · docs/APP_FLOW.md **v1.4** · docs/TRD.md **TRD v1.0** · docs/UI_UX_DESIGN_BRIEF.md **v1.0** (presentation authority only) |
| Reference implementation style | `backend/` boilerplate (commit `08c719a`; Docker removal `d3abf32`) |
| Persistence stack | MongoDB Atlas + Mongoose 8 (boilerplate `^8.8.0`) |
| Changes to application code | **None.** This is documentation only. No Mongoose model, controller, service, route or frontend file was created or modified |
| Downstream | Implementation Plan → Implementation (**not started**; requires explicit approval of this document first) |

### 1.1 Source-of-truth hierarchy

```
SPEC v1.3  →  PRD v1.2  →  APP_FLOW v1.4  →  TRD v1.0  →  UI/UX Design Brief v1.0  →  DATABASE SCHEMA (this document)
```

| Rule | Statement |
|---|---|
| DB-SOT-1 | The schema **implements** the data requirements of the upstream artifacts. It MUST NOT add, remove or reinterpret product behaviour (SOT-001/002). |
| DB-SOT-2 | The **TRD is the primary technical authority** for persistence, relationships, state handling, concurrency, auditability, idempotency, security and infrastructure data requirements (TRD §46.1 lists the mandatory schema constraints; §26.1 of this document verifies each). |
| DB-SOT-3 | The UI/UX Design Brief is a **presentation** authority. A thing appearing in the UI never, by itself, creates a field, collection or rule (Part 39 of the brief for this task; §21 here). |
| DB-SOT-4 | The `backend/` boilerplate supplies **naming, layout and convention**, never product truth. Where a boilerplate model conflicts with the TRD, the TRD wins and the conflict is recorded (§3.2). |
| DB-SOT-5 | A necessity that exists **only because of MongoDB** is a `[SCHEMA DECISION]` with a stated reason. A product-defining gap is **not** closed: it is an `[OPEN DECISION]` naming the artifact that must resolve it, and the schema stays neutral (§22.2). |
| DB-SOT-6 | A contradiction between upstream artifacts, or between an upstream artifact and the task statement for this document, is **reported, never silently reconciled** (§23). |

### 1.2 Classification tags (every schema decision carries exactly one primary tag)

| Tag | Meaning |
|---|---|
| `[SPEC]` `[PRD]` `[APP_FLOW]` | Requirement stated by that artifact (id given where useful) |
| `[TRD]` | Stated or mandated by the TRD (section given) |
| `[DESIGN]` | Required to support an approved UI contract without adding behaviour (UI/UX brief) |
| `[SCHEMA DECISION]` (`SD-n`) | Necessary for MongoDB/Mongoose implementation; no product behaviour added; reason stated (§22.1) |
| `[OPEN DECISION]` (`OD-DB-n`) | Business or product rule not defined upstream; **not invented**; resolver artifact named (§22.2) |

### 1.3 Sources actually read

| Artifact | How it was used |
|---|---|
| TRD v1.0 (3 600 lines) | Read in full for every persistence-relevant section: §5, §11–§15, §19–§32, §34, §37.3, §38, §40.6, §45, §46 (the remaining sections were skimmed through the heading index only) |
| SPEC v1.3 (1 306 lines) | Targeted reads: §4–§6, §10–§12, §19–§21 plus requirement-id lookups; the rest consulted through TRD trace lines |
| PRD v1.2 / APP_FLOW v1.4 | Consulted by targeted search (onboarding checklist, navigation/notification rule) and through the TRD's trace tables; **not re-read end to end** for this task |
| UI/UX Design Brief v1.0 | Targeted search only (StatusBadge domains, status registry, no-notification-centre rule) for §21 |
| **R1 re-read (2026-10-08)** | Re-read at source for the reconciliation: TRD §5.1–5.2, §13.2, §15.1/15.3, §19.2, §22.4–22.5, §25.4–25.7, §26.1–26.2, §27.3, §28.2–28.5, §30.2, §31.1–31.3, §32.7, §33.4, §37.3, §45.1–45.3; SPEC lines for AUTH-003/009, BILL-005…018, DAY-007/015/020–026, ORD-093, STAFF-002…013, TABLE-001…012, ATTENTION-001…008, FEEDBACK-001…006, CUSTOMER-002/022, DF-14, PO-TRD-01/02; APP_FLOW §31 AMB-01…21; PRD v1.2 PRD-BILL-018.1 / PRD-DAY-026.1 / PRD-CUSTOMER-022.1 and the PO-TRD entries; backend `constants.js` `DEFAULT.STATUS`. **Not re-read end to end:** SPEC, PRD and APP_FLOW (≈ 7 200 lines) — read by anchored lookup of every id this pass relies on; UI/UX brief by targeted search. A reviewer should spot-check the ids cited in §22.2 and §23 |
| Backend boilerplate | Read: `userModel.js`, `sessionModel.js`, `models/index.js`, `db_mongo.js`, `constants.js` enums; `package.json` (Mongoose `^8.8.0`, Joi `^17.13.0`); layout via file listing; the rest through TRD §5.1's inspection table |
| MongoDB / Mongoose official docs | Partial-index operators and unique-partial semantics (`mongodb.com/docs/manual/core/index-partial/`), TTL restrictions (`…/core/index-ttl/`), Mongoose schema options (`mongoosejs.com/docs/guide.html`). Citations are in §13.5 and §19. The Context7 MCP server was unavailable (unauthorized) |

---

## 2. Purpose and Scope

**Purpose.** Turn the TRD's conceptual vocabulary (`organizationId`, `outletId`, `rev`, `businessDayId`, `idempotencyKey`, snapshots, append-only ledgers) into a complete, reviewable, implementation-ready data model: **51 collections**, their fields, state fields, indexes, uniqueness rules, concurrency and transaction boundaries, retention and security posture, and the Mongoose conventions to apply.

**In scope.** Collections, fields, types, enums, references, embedded documents, snapshots, indexes (including partial, unique and TTL), uniqueness, optimistic-concurrency (`rev`), idempotency persistence, transaction boundaries, retention/deletion, security of stored data, Mongoose mapping (conventions only), API/UI compatibility checks, classification of every decision.

**Out of scope (by instruction).** Application code, Mongoose source files, controllers, services, routes, frontend, the Implementation Plan. No Phase 2 entity is introduced (public reviews, delivery, loyalty, payment-gateway execution, customer accounts, 2FA, notification centre, reports/exports, WhatsApp order tracking — all non-goals, NG-001…NG-016).

**What this document does not define.** HTTP contracts (TRD §16, §41), Redis keys (TRD §18), UI (UI/UX brief). Where a Redis structure is the *fast layer* of a durable rule, only the durable Mongo part is specified here.

---

## 3. Existing Backend Inspection and Boilerplate Conflict Register

### 3.1 Inspection findings relevant to persistence

| Aspect | Observed in `backend/` | Use in this schema |
|---|---|---|
| Mongoose | `^8.8.0`; `require('mongoose')`; models are `new Schema({…}, { timestamps: true, versionKey: false })` | Adopted: `timestamps`, `versionKey:false` (TRD C10) |
| Model files | `app/models/userModel.js`, `sessionModel.js`; barrel `app/models/index.js` exports `UserModel`, `SessionModel` | Adopted: file `<noun>Model.js`, exported name `<Noun>Model`, sub-folder per module (TRD C2) |
| Collection names | `MONGOOSE.model('users', …)`, `('sessions', …)` — lowercase, plural | Adopted: lowercase plural **physical** names (§7); logical camelCase names are used in prose only |
| Enums | **Numeric** enums from `constants.js` (`USER_TYPE`, `USER_STATUS`, `TOKEN_TYPES`, `DEVICE_TYPES`, `SIGNUP_STEP`) **and** string enums (`GENDER: 'Male'…`) coexist | **Deviation SD-2:** persisted domain enums are **strings** (see §6.4 and UC-2) |
| ObjectId references | `userId: { type: Schema.Types.ObjectId, ref: 'users', index: true }` | Adopted: `<noun>Id` fields, `ref` = physical collection name |
| Indexes | Field-level `index:true` plus compound `schema.index({…})` after the schema; duplicates exist (`email` indexed twice, `phone` twice) | Adopted: schema-level `schema.index()` only, **no field-level `index:true`**, no duplicates (§19.7) |
| Validation | None in schema (Joi at the route layer) | Adopted: Joi at the API; **schema validators only for invariants the database layer must hold** (§19.5) |
| Soft delete | `status: 3` (`DELETED`) | **Adopted for configuration entities only** (`menuCategories`, `menuItems`, `modifierGroups`, `floors`, `tables`, `kitchenStations`) as `status: DELETED` + `deletedAt` `[TRD §16.2, C10]` (SD-18; UC-14 resolved by alignment). **Not applicable** to business records: they have no delete path at all (TRD F9) |
| Timestamps | `createdAt`/`updatedAt` (Mongoose), UTC | Adopted; append-only collections use `createdAt` only (§6.3) |
| Connection | `mongoose.connect(MONGODB.URL)` with retry/backoff; no pool options | Adopted; pool/`autoIndex` settings per TRD §37.6/§40.6 |
| Error handling / response envelope | `{statusCode,status,msg,type,data?}` envelope; services throw `createErrorResponse` | Out of scope here; §20 checks only that persisted fields can supply the TRD's error data (`current`, `rev`) |
| Middleware / hooks | None on models | Tenancy-guard and append-only plugins specified in §19.6 (TRD TD-TENANT-2, F9) |

### 3.2 Boilerplate conflict register (placeholder models vs approved TRD)

The boilerplate models are **placeholders** and are not preserved where they conflict (task Part 1; TRD C11/C12).

| # | Existing | Conflict with TRD | Schema resolution |
|---|---|---|---|
| BC-1 | `users.enabled2FA`, `users.isPhoneVerified`, `users.signupStep` | 2FA/OTP forbidden (AUTH-002, NG-012); no self-signup (ONB-012) — TRD C11 | **Dropped.** Not present in `users` (C-04) |
| BC-2 | `users.deviceToken`, `deviceType` | No push-notification feature; device context belongs to a session, not identity | **Dropped from `users`**; `deviceType` retained on `sessions` (C-08) |
| BC-3 | `users.gender`, `dob`, `profileUrl`, `country`, `timeZone` | No upstream requirement; no profile/own-account page exists (NAV-GAP-026) | **Dropped.** Time zone is an **outlet** attribute (C20, TRD §5.2) |
| BC-4 | `users.userType` numeric 1/2/3 = USER/STAFF/SUPER_ADMIN | Roles are a closed enum OWNER/MANAGER/CASHIER/WAITER/KITCHEN; SuperAdmin is a different principal type (RBAC-020, TRD §13.2) | Replaced by `userType ∈ {SUPER_ADMIN, RESTAURANT_USER}` plus `role` (C-04) |
| BC-5 | `users.status` 1/2/3/4 (`DELETED`, `DISABLED`) | Upstream defines Active/**Inactive** only (AUTH-006); no deletion of users with history | `status ∈ {ACTIVE, INACTIVE}`; no `DELETED` (SD-18) |
| BC-6 | `users.password` (no `select:false`, no hashing contract) | Hash only; never returned or logged (TRD §12.1, §32.4) | `passwordHash`, `select:false` (C-04) |
| BC-7 | `sessions.token` stores the **raw** token; `tokenType` numeric; JWT-decode fallback in `validateUser` | Refresh token stored **hashed**, rotated; the fallback must be removed (TRD C12, TD-AUTH-3) | `sessions.refreshHash` (SHA-256), `family`, rotation fields, TTL (C-08) |
| BC-8 | `users.email`/`phone` non-unique; indexed twice | Normalized email/phone **unique platform-wide** for restaurant users (TD-AUTH-2) | Partial unique indexes on normalized fields (C-04) |
| BC-9 | No tenancy fields on any model | Every tenant record carries `organizationId` (+`outletId`) (ORG-003) | Mandatory on all tenant collections (§5) |
| BC-10 | `versionKey:false`, no `rev` | Explicit `rev` on concurrency-sensitive aggregates (TRD C10, §38.1) | `rev` standard field (§6.2) |

### 3.3 What the boilerplate already gets right and is kept

Lowercase plural physical names; `timestamps:true`; `versionKey:false`; `ObjectId` `ref` fields; compound indexes declared at schema level; `.lean()` read pattern; the `DATABASE_VERSIONS` constant as the schema-version registry (TRD §40.6).

---

## 4. MongoDB Data-Modeling Strategy

SERVENA is modeled **for MongoDB**, not translated from a relational design. Five rules decide embed vs reference vs snapshot.

### 4.1 Embed, reference, denormalize, snapshot — decision rules

| Rule | Statement | Applied to |
|---|---|---|
| **M-EMB** (embed) | Embed when the child (a) is only ever read/written with its parent, (b) has a **small, bounded** cardinality, and (c) needs no independent uniqueness, concurrency or lifecycle | `variants[]` and `taxComponents[]` in `menuItems`; `options[]` in `modifierGroups`; `lines[]` in `kots` and `orderBatches`; `adjustments[]` in `bills`; `history[]` on orders/items/bills/sessions; `modifiers[]` snapshot in `orderItems` |
| **M-REF** (reference) | Reference when the child has its own lifecycle, concurrency, uniqueness, authorization, unbounded growth, or is queried alone | `orderItems` (own state, own `rev`, KDS queries, concurrent kitchen writes); `payments`, `refunds`, `billRevisions`, `cancellationRecords`, `auditEvents` (append-only, unbounded) |
| **M-SNAP** (snapshot) | **Copy** a value into the record at the moment it becomes historically significant; the copy is immutable and never recomputed from the source | Order-line name/price/tax (`orderItems.snapshot`), KOT line text, finalized bill lines (`billRevisions.lines`), outlet/table label on KOT, customer contact on order |
| **M-DENORM** (derive and store) | Store a derived figure **only** when it is (a) written in the same transaction as its inputs or (b) a rebuildable read model, and never as the sole truth | `bills.totals`, `bills.paymentStatus`, `recordedPaymentsPaise`, `orders.stage` (from items, TRD §15.1), `tables.state`, `customerOutletProfiles.*`, `dayRollups` |
| **M-LEDGER** (append-only) | Money, history and audit are **insert-only**; a correction is a new record referencing the old; the old is never edited | `payments` (incl. corrections), `refunds`, `billRevisions`, `billPrintEvents`, `kots`, `cancellationRecords`, `tableOperationEvents`, `dayCloseRevisions`, `cashReconciliations`, `auditEvents`, `auditSeals`, `outletStateEvents` |

### 4.2 Why the important relationships are referenced or embedded

| Relationship | Choice | Reason |
|---|---|---|
| Order → order items | **Reference** (`orderItems.orderId`) `[TRD §37.3, §38]` | Items have their own state machine and `rev`; two kitchen users act on different items of one order concurrently — embedding would serialize them on the order document and defeat the conditional-write design (TRD §15.2, §23.4). KDS queries items directly `(org, outlet, state, priority, createdAt)` |
| Order item → modifiers/variant | **Embedded snapshot** | Immutable copy, read only with the item, bounded (≤ modifier groups) |
| Order → KOT | **Reference** (`kots.orderId`) | KOTs are append-only, one per cause, keyed by unique `sourceKey` (TRD §19.2) |
| KOT → lines | **Embedded** | A KOT is never edited after issue (ORD-090); lines are only read with it |
| Bill → order | **Reference with unique `orderId`** (one bill per order — BILL-015) | The bill is a separate aggregate with its own state, `rev` and lifecycle |
| Bill → lines | **Reference to order items while Draft/Reopened; frozen embedded copy in each finalized revision** `[TRD §25.1, §25.5]` | Live totals must follow the order; a finalized snapshot must not |
| Bill → payments/refunds | **Reference** (`billId`) | Append-only, unbounded, idempotent per row |
| Table → session → order | **Reference chain** `[TRD §21.1]`; bill ownership stays with the order | Table operations re-point *current* association; history is append-only; nothing rewrites bill ownership (TABLE-017/018) |
| Menu category/item/modifier group | **Reference** (`categoryId`, `modifierGroupIds[]`) | Modifier groups are reusable across items; categories form a tree |
| Menu item → outlet override | **Separate collection keyed (outlet, item)** | Override has its own `rev`, outlet scope, audit and concurrency (MENU-009, TRD §20.2) |
| Organization → outlets | **Reference** (`outlets.organizationId`) | Outlets are independently scoped, activated and mutated |
| Customer → outlet history | **Separate per-outlet profile collection** | Operational visibility is outlet-scoped (CUSTOMER-004/021); embedding all-outlet stats in `customers` would leak cross-outlet data on read |
| Audit → every entity | **Reference by `target {type,id}`** (no foreign key) | Audit must survive entity changes and is a separate, SuperAdmin-only, insert-only store (TRD §32.1) |

### 4.3 Data classes (Part 25) — every collection belongs to exactly one class

| Class | Meaning | Collections |
|---|---|---|
| **1 Mutable operational state** | Changes during service; protected by `rev`/conditional writes; history appended elsewhere | `organizations`, `outlets`, `users`, `staffProfiles`, `staffAssignments`, `permissionOverrides`, `sessions`, `invitations`, `floors`, `tables`, `tableSessions`, `customerDrafts`, `occupancyClaims`, `orders`, `orderBatches`, `orderItems`, `cancellationRequests`, `bills`, `businessDays`, `menuImports`, `menuImportCandidates`, `uploadedFiles`, `aiProposals`, `attentionItems`, `customers`, `customerOutletProfiles`, `customerOrderLinks`, `counters` |
| **2 Historical snapshot** | Copy captured at a moment; immutable after creation | `orderItems.snapshot` (embedded), `kots`, `billRevisions`, `dailyBriefs`, `dayCloseRevisions` |
| **3 Immutable financial record** | Insert-only money ledger | `payments`, `refunds`, `billRevisions`, `billPrintEvents`, `cashReconciliations`, `dayCloseRevisions`, `cancellationRecords` (commercial effect) |
| **4 Audit record** | Insert-only, SuperAdmin-only, tamper-evident | `auditEvents`, `auditSeals` |
| **5 Reference/master data** | Configuration read by operations; versioned; soft-deleted (`status: DELETED`), never hard-deleted | `menuCategories`, `menuItems`, `modifierGroups`, `menuOutletOverrides`, `kitchenStations`, `outletStateEvents` (history of config), `feedback` (customer-supplied record) |
| *Derived read model* | Rebuildable from the above; never authoritative | `dayRollups`, `customerOutletProfiles` |
| *Operational log (non-business)* | Observability/ingest; TTL-bounded | `aiInteractions`, `whatsappMessages`, `migrations` |

> **Immutability rule (Part 25).** Menu, price, tax and modifier changes MUST NOT mutate historical order pricing or tax snapshots. A historical financial figure is reconstructed **only** from `orderItems.snapshot`, `billRevisions`, `payments`, `refunds`, `dayCloseRevisions` — never from `menuItems`, `menuOutletOverrides`, `outlets.charges` or any live master data. `[TRD §20.4, §25.4]`

---

## 5. Multi-Tenancy Model

### 5.1 Hierarchy and the canonical isolation rule

```
Platform (SuperAdmin)                        — global scope: organizationId = null
 └─ Organization  (tenant; isolation boundary 1)
     └─ Outlet  (isolation boundary 2; exactly one kitchen)
         └─ Outlet-scoped operational data (tables, sessions, orders, KOTs, bills, payments, days …)
```

**Canonical tenant isolation rule `TI-1`** `[TRD §11, SPEC SEC-001/002, ORG-003]`:

> Every record is owned by exactly one scope — **Platform**, **Organization**, or **Outlet**. A record owned by an organization carries `organizationId`; a record owned by an outlet carries `organizationId` **and** `outletId`; only the Platform-scope collections listed in §5.2 may omit `organizationId`. Every read and every write predicate includes `organizationId` (and `outletId ∈ allowedOutletIds`, or the working outlet, for outlet-scoped data) **inside the query filter**. A foreign id is indistinguishable from a missing id. No unique index may span two organizations except where the platform defines a platform-wide identifier (§5.3).

Enforcement is layered (TRD §11.4): query predicates (S1–S9) → tenancy-guard Mongoose plugin (fails on missing `organizationId`) → every compound index **leads with `organizationId`, then `outletId`** → scoped cache keys/rooms/jobs/object keys → generated cross-tenant test matrix.

### 5.2 Scope classes

| Scope | `organizationId` | `outletId` | Collections |
|---|---|---|---|
| **Platform** | **null/absent (legitimately)** | absent | `users` where `userType = SUPER_ADMIN`; `sessions` of SuperAdmin; `auditEvents`/`auditSeals` for platform actions (`organizationId:null`, chain `platform`); `migrations` |
| **Organization** | required | **absent (legitimately)** — organization-level configuration | `organizations` (itself: `_id` is the tenant id), `users` (restaurant), `permissionOverrides`, `invitations`, `menuCategories`, `menuItems`, `modifierGroups`, `menuImports`, `menuImportCandidates`, `customers`, `uploadedFiles` (outlet nullable), `auditEvents`/`auditSeals` for org-level actions (`outletId:null`) |
| **Outlet** | required | **required** | `outlets` (itself: `_id` is the outlet id; carries `organizationId`), `outletStateEvents`, `staffProfiles`* , `staffAssignments`, `menuOutletOverrides`, `kitchenStations`, `floors`, `tables`, `tableSessions`, `tableOperationEvents`, `customerDrafts`, `occupancyClaims`, `orders`, `orderBatches`, `orderItems`, `cancellationRecords`, `cancellationRequests`, `kots`, `bills`, `billRevisions`, `billPrintEvents`, `payments`, `refunds`, `businessDays`, `dayCloseRevisions`, `cashReconciliations`, `dayRollups`, `customerOutletProfiles`, `customerOrderLinks`, `feedback`, `dailyBriefs`, `whatsappMessages`, `attentionItems`, `counters` |
| **Mixed (outlet optional)** | required | **nullable by design** | `sessions` (restaurant sessions: `organizationId` set, no outlet), `aiProposals` (outlet optional), `aiInteractions`, `uploadedFiles` (`outletId` null for org-level purposes), `auditEvents` |

\* `staffProfiles` is per **person**, not per outlet (SD-9); it carries `organizationId` and a nullable `currentOutletId`; it is *not* an outlet-owned record, so it is listed as Organization scope in §9.

### 5.3 The only platform-wide uniqueness

| Identifier | Why platform-wide | Source |
|---|---|---|
| `users.emailNormalized`, `users.phoneE164` (restaurant users and SuperAdmin) | SCR-001 identifies the user by email/phone + password with **no restaurant selector** (TD-AUTH-2) | `[TRD TD-AUTH-2]` |
| `tables.qrKey`, `outlets.tablelessQrKey`, `outlets.websiteKey`, `outlets.whatsapp.businessNumberId` | A public opaque key must resolve to exactly one outlet without knowing the organization | `[TRD §21.5, §29.1]` |
| `customerOrderLinks.tokenHash`, `invitations.tokenHash`, `sessions.refreshHash` | Token lookup arrives without a tenant | `[TRD §30.2, §12.2, §12.5]` |
| `whatsappMessages.providerMessageId`, webhook event ids | Provider ids are global | `[TRD §19.2]` |

Everything else is unique **within** `(organizationId[, outletId])`.

### 5.4 Ambiguity guard

A record whose ownership could be read two ways is forbidden. Where a record is legitimately org-level (menu) its **outlet-specific variants live in a different collection** (`menuOutletOverrides`), never as an optional `outletId` on the same document. The only collections with a nullable `outletId` are `uploadedFiles`, `aiProposals`, `aiInteractions`, `auditEvents`/`auditSeals`, each justified in its definition.

---

## 6. Schema Conventions

### 6.1 Naming

| Item | Convention | Source |
|---|---|---|
| Logical collection name | `camelCase` plural, used in prose and in this document (`orderItems`) | `[SCHEMA DECISION]` SD-1 |
| **Physical** collection name | **lowercase, plural, no separators** (`orderitems`), set explicitly through the schema `collection` option so Mongoose never re-pluralizes | `[TRD C10]` boilerplate `'users'`, `'sessions'`; SD-1 |
| Field names | `camelCase` | boilerplate |
| Reference fields | `<noun>Id` (single) / `<noun>Ids` (array); `ref` is the **physical** collection name | boilerplate |
| Money fields | `<name>Paise` — integer paise (§6.5) | `[TRD TD-BILL-1, §20.4]` |
| Rates | `<name>Bps` — integer basis points (1 % = 100 bps) | `[TRD §20.4]` |
| Timestamps of events | `<event>At` (`Date`, UTC), nullable until the event happens | boilerplate/TRD C20 |
| Booleans | `is<Adjective>` | SD-1 |
| Enum values | `UPPER_SNAKE` strings (§6.4) | SD-2 |

### 6.2 Standard field sets (referenced by every collection definition)

| Set | Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|---|
| **TEN-O** | `organizationId` | ObjectId→`organizations` | **yes** | — | **no (immutable)** | Tenant owner. First field of every compound index. `[TRD §11.1, TI-1]` |
| **TEN-OO** | `organizationId` + `outletId` | ObjectId→`organizations`, ObjectId→`outlets` | **yes, both** | — | **no (immutable)** | Outlet owner. `outletId` is the **outlet at time of the action** and is never rewritten by staff reassignment (ORG-010). `[TRD §11.1, §11.5]` |
| **REV** | `rev` | Int ≥ 1 | yes | `1` | only via atomic `$inc` of 1 inside a conditional write | Optimistic-concurrency version exposed to clients as `expectedRev`. Replaces Mongoose `__v` (`versionKey:false`). `[TRD §38.2, C10]` |
| **TS** | `createdAt`, `updatedAt` | Date | yes | server now | `createdAt` no; `updatedAt` automatic | Mongoose `timestamps:true`. Server clock only (M5). |
| **TS-C** | `createdAt` | Date | yes | server now | no | Append-only collections: Mongoose `timestamps: { createdAt: true, updatedAt: false }` — the absence of `updatedAt` documents that the record is never updated. |

`REV` is carried by: `organizations`, `outlets`, `users`, `staffAssignments`, `permissionOverrides`, `menuCategories`, `menuItems`, `modifierGroups`, `menuOutletOverrides`, `tables`, `tableSessions`, `orders`, `orderItems`, `orderBatches`, `bills`, `businessDays`, `attentionItems`, `aiProposals`, `menuImports`, `staffProfiles`, `customerDrafts`, `cancellationRequests`. `[TRD §38.1 list: orders, items, bills, tables/sessions, menu entities, outlet, day, overrides]` — the extension to `staffProfiles`, `attentionItems`, `aiProposals`, `menuImports`, `customerDrafts`, `cancellationRequests` is SD-3 (their transitions are conditional writes, M2).

### 6.3 Embedded sub-document types (all declared `_id:false`)

| Type | Fields | Notes |
|---|---|---|
| **ActorRef** | `type` Enum(`USER`,`SUPERADMIN`,`SYSTEM`,`AI`,`CUSTOMER`) · `userId?` ObjectId→`users` · `role?` Enum(`ROLE`) · `via?` Enum(`WEB`,`AI`,`SYSTEM`) · `proposalId?` ObjectId→`aiProposals` · `customerId?` ObjectId→`customers` | Who. `via:'AI'` + `proposalId` for confirmed Owner-Agent actions (TRD §31.3, A6). Role is the role **at the time of the action**. `ROLE` is the TRD §13.2 closed enum `OWNER, MANAGER, CASHIER, WAITER, KITCHEN, CUSTOMER`; `CUSTOMER` appears only with `type: CUSTOMER` (a link principal with a fixed allow-set, never a `users` row). `[TRD §32.2, §13.2]` |
| **Reason** | `code?` String ≤ 40 (a code from the reason catalogue, TD-ORD-5) · `text?` String ≤ 500 | Mandatory-ness is enforced by the owning guard (INV-16); the sub-document only stores. Catalogue content is configuration, not schema. |
| **RequestCtx** | `requestId` String · `idempotencyKey?` String · `deviceType?` Enum(`IOS`,`ANDROID`,`WEB`) | Correlation (C21). `deviceType` reuses the boilerplate device-type vocabulary. |
| **HistoryEntry** | `from` String · `to` String · `actor` ActorRef · `at` Date · `reason?` Reason · `requestId` String · `via` Enum(`WEB`,`AI`,`SYSTEM`) | Entity transition history (M3). Append-only (`$push` only); **distinct from the audit trail** (TRD §32.1). |
| **TaxSnapshot** | `rateBps` Int ≥ 0 (total GST rate) · `components[]` of `{ name String (e.g. CGST, SGST), rateBps Int ≥ 0 }` | Component rates sum to `rateBps` (validator). Phase 1 components are CGST+SGST only (PO-TRD-01 #1). |
| **ModifierSnapshot** | `groupId?` ObjectId · `groupName` String · `optionId?` ObjectId · `optionName` String · `priceDeltaPaise` Int (signed allowed: a discounting option is not forbidden upstream) | Reference ids are **provenance only**; names/deltas are the truth. |
| **Address** | `line1`, `line2?`, `city`, `state`, `postalCode`, `country` (Strings) · `geo?` `{lat, lng}` | ONB-021 "address/location". Field set is `[SCHEMA DECISION]` SD-4 (upstream names the concept, not the fields). |
| **Contact** | `email?` (lower-case) · `phone?` (E.164) | ONB-020 "contact". |

### 6.4 Enum strategy — persisted enums are strings  `SD-2`  **[TRD §5.2 C9, amended 2026-10-08 — UC-2 RESOLVED]**

All persisted domain enums store **`UPPER_SNAKE` strings** (e.g. `stage: 'KOT_SENT'`), defined as frozen objects in `app/utils/constants/*.js` (`ORDER_STAGE = { DRAFT: 'DRAFT', … }`), consumed by schemas through `Object.values(...)` exactly as the boilerplate does (`enum: Object.values(USER_TYPE)`).

**Canonical rule `[TRD §5.2 C9]`:** *"Persisted enum values use `UPPER_SNAKE_CASE` strings. Numeric enum identifiers are not persisted."* State and enum names that the TRD writes in other casings (`Sent`, `KOT_Sent`, `NotPaid`) are names: each maps one-to-one to its `UPPER_SNAKE_CASE` persisted value, and API/wire spelling is unchanged. The constants-file **shape** (frozen objects, `Object.values`) is preserved. Strings keep partial-index filters, conditional writes, audit `before/after` and support queries legible and immune to enum re-ordering. *(Resolved in R2; TRD amended 2026-10-08, §5.2 C9 and §16.2 `status` = `DELETED`.)*

### 6.5 Money and quantity rules (Part 12 — mandatory)

| Rule | Statement |
|---|---|
| **MR-1** | **Every monetary value is a MongoDB integer number of paise** (1 ₹ = 100 paise). Mongoose type `Number` with validator `Number.isSafeInteger`. `Decimal128`, `Double` fractions and strings are **forbidden** for money. `[TRD TD-BILL-1]` |
| **MR-2** | Field names end in **`Paise`**. Signedness is declared per field: default **unsigned (≥ 0)**; signed fields are explicitly listed (`roundOffPaise`, `variancePaise`, `deltaPaise`, `correctionDeltaPaise`, `grossSalesPaise`, `netSalesPaise`, `ModifierSnapshot.priceDeltaPaise`). |
| **MR-3** | Rates are integer **basis points** (`…Bps`); no floating-point rate is stored. Quantities (`qty`) are positive integers. |
| **MR-4** | A money field is exactly one of: **SNAPSHOT** (copied at a moment, immutable), **LIVE-DERIVED** (recomputed in the same transaction as its inputs; never the sole truth), **LEDGER** (insert-only record value), or **CONFIG** (current master value, never used to rebuild history). §6.5.1 classifies every one. |
| **MR-5** | The calculation algorithm is **not** part of the schema (TRD §25.4 `computeBill`, `calcVersion`); the schema stores its inputs and outputs only. |
| **MR-6** | Naming follows the TRD (`unitPricePaise`, `subtotalPaise`, `discountPaise`, `chargesPaise`, `roundOffPaise`, `totalPaise`, `amountPaise`, `outstandingPaise`, `overpaymentPaise`, `expectedCashPaise`, `countedCashPaise`, `grossSalesPaise`, `netSalesPaise`). The TRD derives `recordedTotal`; this schema stores it as **`recordedPaymentsPaise`** `[SD-5]` — a deliberately neutral name, because a field called `paidPaise` would imply the `PAID` status. No parallel names are introduced. |
| **MR-7** | **No floating value is persisted anywhere in this schema.** Generic `Number` slots (`Map<String,Number>` metrics, `facts[].value`, `evidence[].value/baselineValue`) hold **safe integers only**: money as paise (key/unit `…Paise`/`PAISE`), counts as integers, minutes as whole minutes, ratios and rates as basis points (`BPS`). Averages (e.g. AOV, whose definition is open — OD-DB-22) are stored, if at all, as integer paise rounded by the owning policy function — never as a fractional number. A validator rejects non-integers for every `Number` map value and every non-`TEXT` fact/evidence value `[SCHEMA DECISION SD-46]` |

#### 6.5.1 Money-field dictionary (complete list; every field is integer paise)

| Field | Where | Sign | Nullable | Class | Meaning |
|---|---|---|---|---|---|
| `unitPricePaise` | `orderItems.snapshot`, `orderBatches.lines[].snapshot`, `billRevisions.lines[]` (a KOT carries no money) | ≥ 0 | no | SNAPSHOT | Price of one unit **after** outlet override, **excluding** modifier deltas, at the moment the line was added |
| `priceDeltaPaise` | `modifierGroups.options[]` (CONFIG); `ModifierSnapshot` (SNAPSHOT) | signed | no | CONFIG / SNAPSHOT | Price change of an option |
| `basePricePaise` | `menuItems`, `menuItems.variants[]` | ≥ 0 | no | CONFIG | Central price (org level) |
| `priceOverridePaise` | `menuOutletOverrides` (item and `variantPrices[]`) | ≥ 0 | yes | CONFIG | Outlet override of the central price |
| `lineTotalPaise` | `orderItems`, `orderBatches.lines[]` | ≥ 0 | no | LIVE-DERIVED (until KOT) then frozen | `qty × (unitPricePaise + Σ modifier deltas)`; recomputed only while item is `PENDING` |
| `expectedUnitPricePaise` | request payload only (TD-MENU-2) | — | — | **not persisted** | Client's displayed price, used for the `PRICE_CHANGED` check |
| `subtotalPaise`, `discountPaise`, `taxPaise`, `roundOffPaise`, `totalPaise` | `bills.totals`, `billRevisions.totals` | `roundOffPaise` signed; others ≥ 0 | no | LIVE-DERIVED (bill) / SNAPSHOT (revision) | `computeBill` outputs (TRD §25.4) |
| `chargesPaise` (total), `charges[].amountPaise`, `charges[].allocations[].amountPaise` | `bills.totals`, `billRevisions.totals` | ≥ 0 | no | LIVE-DERIVED / SNAPSHOT | Service/packaging charges and their tax-group apportionment (PO-2) |
| `taxBreakdown[].taxableValuePaise`, `.taxPaise` | `bills.totals`, `billRevisions.totals` | ≥ 0 | no | LIVE-DERIVED / SNAPSHOT | Per-component totals for tax reports |
| `valuePaise` | `bills.adjustments[]`, `outlets.charges.*` | ≥ 0 | when basis is `FLAT` | LEDGER entry / CONFIG | Flat discount or flat charge value |
| `amountPaise` (adjustment) | `bills.adjustments[]` | ≥ 0 | no | LEDGER entry | Computed paise effect of the adjustment when recorded |
| `amountPaise` | `payments`, `refunds` | payments: `PAYMENT` > 0, `CORRECTION` ≥ 0; refunds > 0 | no | LEDGER | Recorded amount |
| `recordedPaymentsPaise`, `outstandingPaise`, `overpaymentPaise`, `refundedPaise` | `bills` | ≥ 0 | no | LIVE-DERIVED | `outstanding = max(0,T−P)`; `overpayment = max(0,P−T−F)`; refunds never change `T`, `P` or `outstanding` (PO-1); recomputed in the same transaction as any payment/refund/total change (TRD §26.3) |
| `previousTotalPaise` | `billRevisions` | ≥ 0 | no | SNAPSHOT | Total of the preceding finalization revision |
| `deltaPaise` | `billRevisions` | **signed** | no | SNAPSHOT | The revision's contribution to Gross sales (PO-6) |
| `finalizedTotalPaise`, `discountsPaise`, `refundsRecordedPaise`, `refundsOnCancelledBillsPaise`, `byMode.upiPaise` / `.cashPaise` / `.cardPaise` | `dayCloseRevisions.totals` | ≥ 0 | no | SNAPSHOT | Day Close components (TRD §27.3) |
| `correctionDeltaPaise`, `grossSalesPaise`, `netSalesPaise` | `dayCloseRevisions.totals` | **signed** | no | SNAPSHOT | `gross = finalizedTotalPaise + correctionDeltaPaise`; `net = gross − (refundsRecordedPaise − refundsOnCancelledBillsPaise)`; **never clamped** (DAY-026, PO-5/PO-6, TRD §25.9.7) |
| `expectedCashPaise`, `countedCashPaise`, `cashPaymentsPaise`, `cashRefundsPaise` | `cashReconciliations` | ≥ 0 | no | SNAPSHOT | CASH-005…007 |
| `variancePaise` | `cashReconciliations` | **signed** | no | SNAPSHOT | `countedCashPaise − expectedCashPaise` |
| `salesPaise`, `discountsPaise`, `refundsPaise`, … | `dayRollups.metrics`, `dailyBriefs.metrics` | per metric | no | DERIVED | Rebuildable read models; never authoritative |
| `cashVariancePaise` threshold | configuration (not stored) | — | — | CONFIG | `ATTN_CASH_VARIANCE_PAISE` env (TRD §31.9) |

### 6.6 Time and identity

| Topic | Rule |
|---|---|
| Time | All `Date` fields are **UTC**, set by the **server clock** (M5). The outlet IANA zone (`outlets.timeZone`) is presentation only; **no field or index is keyed by midnight, a local calendar day, Start Day or End Day** (DAY-001, NG-015). The only day boundary is `businessDays.closedAt` (§11.37). |
| `_id` | MongoDB `ObjectId`, never exposed as a public access token. |
| Public tokens | Random, non-ObjectId, non-sequential values: QR keys (128-bit), order-link tokens (256-bit, hash stored), invitation tokens (256-bit, hash stored), refresh tokens (256-bit, hash stored). |
| Human numbers | `orders.orderSeq`, `kots.kotSeq` (per outlet-day, from the day document), `bills.invoice` (per outlet per financial year, from `counters`). Counters are Mongo-authoritative, incremented **inside the creating transaction** (TD-ORD-2). |
| PII | Fields tagged `[PII]` (customer name/phone, user email/phone, staff names). Encrypted at rest by Atlas; never logged in clear; excluded from realtime to non-privileged rooms and from Sentry (TRD §30.1, §35.9). |

---

## 7. Collection Inventory

**51 collections**, each required by a named TRD/SPEC need. `Phys.` is the physical (lowercase) name.

| ID | Logical | Phys. | Group | Scope | Class | Basis |
|---|---|---|---|---|---|---|
| C-01 | organizations | `organizations` | CORE | Org (tenant root) | 1 | ORG-001, ONB-001…009 `[SPEC]`; TRD §14 #1 |
| C-02 | outlets | `outlets` | CORE | Outlet root | 1 | ORG-001/005, ONB-015/020…032 |
| C-03 | outletStateEvents | `outletstateevents` | CORE | Outlet | 5 / ledger | TRD §28.5 (operational history of Open/Closed and activation) |
| C-04 | users | `users` | CORE | Platform (SuperAdmin) **or** Org (restaurant user) — discriminated by `userType` | 1 | AUTH-001…009, STAFF; TRD §12 |
| C-05 | staffProfiles | `staffprofiles` | CORE | Org | 1 | STAFF-001…009 |
| C-06 | staffAssignments | `staffassignments` | CORE | Outlet | 1 + history | ORG-004/008/010, STAFF-010/011/012; TRD §11.5 |
| C-07 | permissionOverrides | `permissionoverrides` | CORE | Org | 1 | RBAC-004/005/010; TRD §13.2 |
| C-08 | sessions | `sessions` | SECURITY | Platform (SuperAdmin) **or** Org (restaurant user) — inherits `userType` | 1 (TTL) | TRD §12.2 |
| C-09 | invitations | `invitations` | SECURITY | Org | 1 | ONB-006/013, AUTH-003/004; TRD TD-AUTH-7 |
| C-10 | auditEvents | `auditevents` | AUDIT | Platform / Org / Outlet — exactly the scope of the **audited action** (see §28.3) | 4 | AUDIT-001…008; TRD §32 |
| C-11 | auditSeals | `auditseals` | AUDIT | One chain per scope: platform, org, or outlet (see §28.3) | 4 | AUDIT-005; TRD §32.5 |
| C-12 | menuCategories | `menucategories` | MENU | Org | 5 | MENU-001 |
| C-13 | menuItems | `menuitems` | MENU | Org | 5 | MENU-002…008 |
| C-14 | modifierGroups | `modifiergroups` | MENU | Org | 5 | MENU-004 |
| C-15 | menuOutletOverrides | `menuoutletoverrides` | MENU | Outlet | 5 | MENU-009…014; TRD §20.2 |
| C-16 | menuImports | `menuimports` | MENU/AI | Org | 1 | AI-010…016; TRD §31.4 |
| C-17 | menuImportCandidates | `menuimportcandidates` | MENU/AI | Org | 1 | TRD §31.4 (draft store isolated from live menu) |
| C-18 | uploadedFiles | `uploadedfiles` | MENU/OPS | Org (`outletId` null = org-level purpose, set = outlet purpose) | 1 | TRD §34.2 |
| C-19 | floors | `floors` | OPERATIONS | Outlet | 5 | TABLE-004, ONB-026 |
| C-20 | tables | `tables` | OPERATIONS | Outlet | 1 | TABLE-001…006 |
| C-21 | tableSessions | `tablesessions` | OPERATIONS | Outlet | 1 + history | TABLE-014/015/017 |
| C-22 | tableOperationEvents | `tableoperationevents` | OPERATIONS | Outlet | ledger | TABLE-016; TRD §21.4 |
| C-23 | customerDrafts | `customerdrafts` | OPERATIONS | Outlet | 1 | ORD-064/094; TRD TD-ORD-4 |
| C-24 | occupancyClaims | `occupancyclaims` | OPERATIONS | Outlet | 1 | TABLE-007; TRD §21.6 |
| C-25 | orders | `orders` | OPERATIONS | Outlet | 1 + history | ORD-001…094 |
| C-26 | orderBatches | `orderbatches` | OPERATIONS | Outlet | 1 | ORD-080, ORD-008; TRD §19.2, §21.6 |
| C-27 | orderItems | `orderitems` | OPERATIONS | Outlet | 1 + snapshot | ORD-070…073, MENU-017 |
| C-28 | cancellationRecords | `cancellationrecords` | OPERATIONS | Outlet | ledger | ORD-082/088/089/092; TRD §22.7 |
| C-29 | cancellationRequests | `cancellationrequests` | OPERATIONS | Outlet | 1 | ORD-093; TRD §15.4 |
| C-30 | kitchenStations | `kitchenstations` | OPERATIONS | Outlet | 5 | ONB-027, MENU-005, KDS-002 |
| C-31 | kots | `kots` | OPERATIONS | Outlet | 2 / ledger | KOT-001…010 |
| C-32 | bills | `bills` | BILLING | Outlet | 1 | BILL-001…018 |
| C-33 | billRevisions | `billrevisions` | BILLING | Outlet | 2 / ledger | BILL-011; TRD §25.5 |
| C-34 | billPrintEvents | `billprintevents` | BILLING | Outlet | ledger | BILL-008/009; TRD §25.7 |
| C-35 | payments | `payments` | BILLING | Outlet | 3 | PAY-001…013 |
| C-36 | refunds | `refunds` | BILLING | Outlet | 3 | PAY-013, BILL-012 |
| C-37 | businessDays | `businessdays` | BILLING | Outlet | 1 + history | DAY-001…025 |
| C-38 | dayCloseRevisions | `daycloserevisions` | BILLING | Outlet | 2 / 3 | DAY-007/014; TRD §27.1 |
| C-39 | cashReconciliations | `cashreconciliations` | BILLING | Outlet | 3 | CASH-001…007 |
| C-40 | dayRollups | `dayrollups` | BILLING/ANALYTICS | Outlet | derived | ANALYTICS-*; TRD §14 #25 |
| C-41 | customers | `customers` | CUSTOMER | Org | 1 | CUSTOMER-002/021 |
| C-42 | customerOutletProfiles | `customeroutletprofiles` | CUSTOMER | Outlet | derived | CUSTOMER-002/004/021 |
| C-43 | customerOrderLinks | `customerorderlinks` | CUSTOMER | Outlet | 1 (TTL) | AUTH-009, DF-12; TRD §30.2 |
| C-44 | feedback | `feedback` | CUSTOMER | Outlet | 5 | FEEDBACK-001…006 |
| C-45 | aiProposals | `aiproposals` | AI | Org (`outletId` null = org-wide action, set = outlet-targeted action) | 1 (TTL) | AI-029; TRD §31.3 |
| C-46 | aiInteractions | `aiinteractions` | AI | Org (`outletId` = working-outlet context if any) | log (TTL) | AI-042; TRD §31.2 |
| C-47 | dailyBriefs | `dailybriefs` | AI | Outlet | 2 | AI-026/027; TRD §31.5 |
| C-48 | whatsappMessages | `whatsappmessages` | AI | Outlet | log (TTL) | AI-030…033, INTEG-002; TRD §31.8 |
| C-49 | attentionItems | `attentionitems` | AI | Outlet | 1 | ATTENTION-001…008 |
| C-50 | counters | `counters` | SYSTEM | Outlet | 1 | TD-ORD-2, PO-TRD-01 #5 |
| C-51 | migrations | `migrations` | SYSTEM | Platform | log | TRD §40.6 |

### 7.1 Collections deliberately **not** created (Part 33: "only what is required")

| Considered | Decision | Reason |
|---|---|---|
| `notifications` / notification centre | **Not created** | APP_FLOW §29.0 (no notification centre); TRD §14 #22 (notification intent is **transient**); realtime events and toasts are not business records (Part 22) |
| `roles` / `permissions` catalogue | **Not created** | Role defaults are a **code-resident versioned constant** (TRD §13.2); only org/user **overrides** persist (C-07) |
| `idempotencyKeys` (generic) | **Not created** | TRD §19.4: durable layer is the **business document's own unique key**; Redis is the fast layer. A generic table would duplicate and could drift (SD-6, §12) |
| `kitchens` | **Not created** | Exactly one kitchen per outlet (ORG-005): the outlet *is* the kitchen context; stations are routing metadata (C-30) |
| KDS state store | **Not created** | KDS is a read model over `orderItems` (TRD §15.3) |
| `whatChanged` results | **Not created** | Computed on demand, not persisted (TD-AI-2) |
| `agentConversations` | **Not created** | Owner-Agent conversations are transient (TRD §14 #26); only **proposals** and **interaction logs** persist |
| `payments`-gateway collections (`gatewayEvents`, webhooks) | **Not created** | PAY-008 EXCLUDED; no Phase 1 gateway (TRD §26.7) |
| `invoices` | **Not created** | The invoice is the finalized bill revision plus `bills.invoice` numbering (TRD §25.5) |
| `shifts`, `payroll`, `attendanceLogs` | **Not created** | STAFF-009: no payroll; attendance is a current state, not a log (SD-9) |
| `platformAccessLogs` | **Not created** | TD-TENANT-3 access-logging is an application log stream (TRD §36.9), not a business collection |
| `reports`/`exports` | **Not created** | TRD TD-JOB-1: no report queue; no export requirement |
| `reviews` | **Not created** | Public reviews are Phase 2 (CUSTOMER-006, FEEDBACK-005) |
| `deliveries`, `loyalty`, `coupons`, `reservations` | **Not created** | Non-goals (TABLE-003, NG-*) |
| `staffInvitations` | **Not created** | The TRD defines invitations only for Owner onboarding/reissue; staff credentials are set directly by an authorized user (TRD §12.5). **Reported as UC-1** |

---

## 8. Relationship Map

### 8.1 Operational chain (required by the task)

```
Organization ─1:n─▶ Outlet ─1:n─▶ Floor ─1:n─▶ Table ─1:n─▶ Table Session ─1:n─▶ Order ─1:n─▶ Order Item ─n:m─▶ KOT ─▶ (Kitchen = the outlet; stations route lines)
                       │                         │                                   │                                    ▲
                       │                         └─ Table.currentSessionId           │ (Takeaway: tableId = null)         └─ kots.lines[].orderItemId
                       └─ Outlet is the single kitchen context (ORG-005); KitchenStation = routing metadata inside it
```

```
Order ─1:1─▶ Bill ─1:n─▶ Payment ─(supersedes chain)─▶ Payment correction
              │    ├────1:n─▶ Refund (optionally → Payment)
              │    ├────1:n─▶ BillRevision (append-only, one per finalization)
              │    └────1:n─▶ BillPrintEvent
Table ─▶ Order ─▶ Bill      (bill ownership belongs to the ORDER, never the table — TABLE-018)
Takeaway Order (no table) ─▶ Bill
```

```
Organization ─1:n─▶ Customer (phone key, org scope) ─1:n─▶ CustomerOutletProfile (one per outlet interacted with)
Customer ─0:n─▶ Order (orders.customerId; table-QR orders have none) ─1:1─▶ CustomerOrderLink ─▶ Feedback (1 per order)
Organization ─1:n─▶ User ─1:n─▶ StaffAssignment ─n:1─▶ Outlet       (Owner: implicit all outlets)
User ─1:1─▶ StaffProfile        User/Role ─0:n─▶ PermissionOverride (grants/denies)       User ─1:n─▶ Session
Outlet ─1:n─▶ BusinessDay (≤1 active) ─1:n─▶ Orders / Bills / Payments / Refunds / DayCloseRevision ─1:1─▶ CashReconciliation
AuditEvent ─(target.{type,id})─▶ any auditable entity     AuditSeal ─1:1─▶ AuditEvent
```

### 8.2 Relationship table

| From | To | Cardinality | Key / field | Ownership note |
|---|---|---|---|---|
| organizations | outlets | 1 : n (≥1) | `outlets.organizationId` | ORG-001 |
| outlets | floors | 1 : n | `floors.outletId` | |
| floors | tables | 1 : n | `tables.floorId` | |
| tables | tableSessions | 1 : n (≤1 `ACTIVE`) | `tableSessions.tableId` | TABLE-014 |
| tables | tableSessions | 1 : 0..1 current | `tables.currentSessionId` | derived-then-stored with `state` |
| tableSessions | orders | 1 : n | `orders.tableSessionId` (current) + `orders.tableAssociations[]` (history) | TABLE-015/017 |
| orders | orderItems | 1 : n | `orderItems.orderId` | |
| orders | orderBatches | 1 : n | `orderBatches.orderId` | additions after the first submission |
| orders | kots | 1 : n | `kots.orderId` | KOT-007 |
| orderItems | kots (lines) | n : m | `kots.lines[].orderItemId` | |
| orders | bills | 1 : 0..1 | `bills.orderId` **unique** | BILL-015 |
| bills | billRevisions / billPrintEvents / payments / refunds | 1 : n | `…billId` | |
| payments | payments | 0..1 | `supersedes` | PAY-007/012 |
| refunds | payments | 0..1 | `refunds.paymentId` | PAY-013 |
| orders | customerOrderLinks | 1 : 0..1 | `customerOrderLinks.orderId` **unique** | every customer-originated order |
| orders | feedback | 1 : 0..1 | `feedback.orderId` **unique** | FEEDBACK-006 |
| customers | orders | 1 : n | `orders.customerId` (nullable) | CUSTOMER-021 |
| businessDays | orders / bills / payments / refunds / KOTs / tableOperationEvents | 1 : n | `…businessDayId` | day fence stamp |
| businessDays | dayCloseRevisions | 1 : n | `dayCloseRevisions.businessDayId` | |
| dayCloseRevisions | cashReconciliations | 1 : 1 | `dayCloseRevisions.cashReconciliationId` | |
| users | staffAssignments / sessions / staffProfiles / permissionOverrides | 1 : n / n / 1 / n | `…userId` | |
| menuCategories | menuItems | 1 : n | `menuItems.categoryId` | |
| menuItems | modifierGroups | n : m | `menuItems.modifierGroupIds[]` | |
| menuItems × outlets | menuOutletOverrides | 1 : 1 per pair | `(outletId, menuItemId)` | |
| menuImports | menuImportCandidates | 1 : n | `…importId` | |
| outlets | kitchenStations | 1 : n | `kitchenStations.outletId` | |
| auditEvents | auditSeals | 1 : 1 | `auditSeals.eventId` | |
| aiProposals | auditEvents | 1 : 0..1 | `auditEvents.actor.proposalId` | AUDIT-004 |

---

## 9. Data Ownership Matrix

`Owner` = the module (TRD §10.2) that exclusively writes the collection. `Mutable` = the **document** may be updated (`No` = insert-only). `Historical` = the record preserves a point-in-time truth. `Audited` = writes append an audit event in the same transaction (AUDIT-002, TRD §32.3).

| Entity (collection) | Organization scope | Outlet scope | Owner module | Mutable | Historical | Audited |
|---|---|---|---|---|---|---|
| organizations | root (`_id`) | — | `tenancy` | yes (`rev`) | no | status changes (`PLATFORM.*`) |
| outlets | required | root (`_id`) | `tenancy`, `outlet-setup` | yes (`rev`) | no | outlet state via `outletStateEvents`; AI-executed toggles audited |
| outletStateEvents | required | required | `tenancy` | **No** | yes | n/a (is the history) |
| users | nullable (SuperAdmin) | — | `identity-access` | yes (`rev`) | no | credential/deactivation (`AUTH.*`) |
| staffProfiles | required | `currentOutletId` nullable | `staff` | yes (`rev`) | no | no (not in AUDIT-002) |
| staffAssignments | required | required | `staff` | limited (`status`, `endedAt`) | **yes** (assignment history) | `STAFF.OUTLET_REASSIGNED` |
| permissionOverrides | required | — | `identity-access` | yes (`rev`) | no (changes audited) | `RBAC.OVERRIDE_CHANGED` |
| sessions | nullable | — | `identity-access` | rotation/revocation only | no | SA lockout `AUTH.*` |
| invitations | required | — | `identity-access` | status only | yes | `AUTH.INVITATION_REISSUED` |
| auditEvents | nullable | nullable | `audit` | **No** | yes | — |
| auditSeals | nullable | nullable | `audit` | **No** | yes | — |
| menuCategories | required | — | `menu` | yes (`rev`) | no | no |
| menuItems | required | — | `menu` | yes (`rev`) | no (snapshots live on orders) | `MENU.PRICE_CHANGED`, `MENU.AVAILABILITY_CHANGED` |
| modifierGroups | required | — | `menu` | yes (`rev`) | no | price delta changes follow `MENU.PRICE_CHANGED` |
| menuOutletOverrides | required | required | `menu` | yes (`rev`) | no | price/availability audited |
| menuImports | required | — | `ai-menu-import` | yes (`rev`) | yes | `MENU.IMPORT_APPROVED` |
| menuImportCandidates | required | — | `ai-menu-import` | yes (until approved) | no | no |
| uploadedFiles | required | nullable | `uploads` | status only | no | no |
| floors | required | required | `tables` | yes | no | no |
| tables | required | required | `tables` | yes (`rev`) | no | no |
| tableSessions | required | required | `tables` | yes (`rev`) | yes (association history) | no (operational events) |
| tableOperationEvents | required | required | `tables` | **No** | yes | operational record (TABLE-016); not in AUDIT-002 |
| customerDrafts | required | required | `customer-ordering` | yes (`rev`) | yes (kept) | no |
| occupancyClaims | required | required | `tables` | `releasedAt` only | yes | no |
| orders | required | required | `order-engine` | yes (`rev`) | yes (history) | cancel/void/hold (`ORDER.*`) |
| orderBatches | required | required | `order-engine` | yes (`rev`) | yes | no |
| orderItems | required | required | `order-engine` | yes (`rev`) | **yes (snapshot)** | `ITEM.*` |
| cancellationRecords | required | required | `order-engine` | **No** | yes | with `ITEM.CANCELLED` etc. |
| cancellationRequests | required | required | `kitchen` | status only | yes | accepted → `ITEM.CANCELLED` |
| kitchenStations | required | required | `kitchen` | yes | no | no |
| kots | required | required | `kitchen` | **No** | **yes** | no |
| bills | required | required | `billing` | yes (`rev`) | no (revisions hold history) | discount/reopen/cancel (`BILL.*`) |
| billRevisions | required | required | `billing` | **No** | **yes** | `BILL.REOPENED` context |
| billPrintEvents | required | required | `billing` | **No** | yes | no |
| payments | required | required | `billing` | **No** | **yes** | `PAYMENT.CORRECTED` |
| refunds | required | required | `billing` | **No** | **yes** | `REFUND.RECORDED` |
| businessDays | required | required | `day-close` | yes (`rev`) | yes | `DAY.CLOSED/REOPENED/RECLOSED` |
| dayCloseRevisions | required | required | `day-close` | **No** | **yes** | `DAY.*` |
| cashReconciliations | required | required | `day-close` | **No** | **yes** | with `DAY.CLOSED` |
| dayRollups | required | required | `analytics` | rebuildable | derived | no |
| customers | required | — | `customers` | yes | no | no |
| customerOutletProfiles | required | required | `customers` | rebuildable | derived | no |
| customerOrderLinks | required | required | `customers` | `expiresAt`, `revokedAt` | no | no |
| feedback | required | required | `customers` | **No** | yes | no |
| aiProposals | required | nullable | `ai` | status only | yes | `AI.ACTION_EXECUTED` |
| aiInteractions | required | nullable | `ai` | **No** | log | no |
| dailyBriefs | required | required | `ai-insights` | **No** | yes | no |
| whatsappMessages | required | required | `whatsapp-ordering` | status only | log | no |
| attentionItems | required | required | `attention` | yes (`status`) | yes | no |
| counters | required | required | `order-engine`, `billing` | `$inc` only | no | no |
| migrations | — | — | platform | **No** (insert) | log | no |

---

## 10. State Field Matrix and State-Machine Persistence

### 10.1 State field matrix (Part 36) — values exactly as upstream, stored as `UPPER_SNAKE`

| Entity | State field | Allowed values | Terminal states | History required |
|---|---|---|---|---|
| organizations | `platform.status` | `PROVISIONED`, `SUSPENDED`, `DEACTIVATED` | none enforced (reinstatement undefined — OD-DB-1/PB-7) | yes — audit (`PLATFORM.*`) + `platform.reason/changedAt/By` |
| outlets | `activation.state` | `NOT_ACTIVATED`, `ACTIVATED` | `ACTIVATED` (one-way in Phase 1) | `outletStateEvents` |
| outlets | `availability.state` | `OPEN`, `CLOSED` (nullable until first set — OD-DB-2/PB-10) | none | `outletStateEvents` |
| businessDays | `status` | `RUNNING`, `CLOSED`, `REOPENED`, `ABSORBED` | `ABSORBED`; `CLOSED` until reopened | `dayCloseRevisions`, `reopenEvents[]`, audit |
| users | `status` | `ACTIVE`, `INACTIVE` | none (reactivation not prohibited upstream) | audit (`AUTH.USER_DEACTIVATED`) |
| staffProfiles | `attendance` | `PRESENT`, `ABSENT` | none | no (current state only — SD-9) |
| staffProfiles | `availability` | `AVAILABLE`, `ON_BREAK`, `UNAVAILABLE` | none | no (current state only) |
| tables | `state` | `AVAILABLE`, `OCCUPIED`, `BILLING`, `CLEANING`, `RESERVED` | none | session + operation events |
| tableSessions | `status` | `ACTIVE`, `CLOSED` | `CLOSED` | `tableHistory[]`, `tableOperationEvents` |
| orders | `stage` | `DRAFT`, `AWAITING_ACCEPTANCE`, `CONFIRMED`, `KOT_SENT`, `PREPARING`, `READY`, `SERVED`, `PICKED_UP`, `COMPLETED`, `CANCELLED`, `REJECTED`† | `COMPLETED`, `CANCELLED`, `REJECTED`† | `history[]` |
| orderItems | `state` | `PENDING`, `SENT`, `PREPARING`, `READY`, `SERVED`, `PICKED_UP`, `CANCELLED` | `SERVED`, `PICKED_UP`, `CANCELLED` | `history[]` |
| orderBatches | `status` | `AWAITING_ACCEPTANCE`, `COMMITTED`, `REJECTED` | `COMMITTED`, `REJECTED` | `acceptedBy/at`, `rejection` |
| kots | — (**no state**; `kind` ∈ `INITIAL`, `ADDITIONAL`, `CANCELLATION`) | — | created-only | the record itself |
| cancellationRequests | `status` | `OPEN`, `ACCEPTED`, `DECLINED`, `NO_OP` | `ACCEPTED`, `DECLINED`, `NO_OP` | the record itself |
| bills | `status` | `DRAFT`, `FINALIZED`, `REOPENED`, `CANCELLED`, `REFUNDED` | `CANCELLED`, `REFUNDED` (no outgoing edge — OD-DB-27) | `history[]` + `billRevisions` |
| bills | `paymentStatus` (derived) | `NOT_PAID`, `PAID` | none | derivable from ledger |
| payments | — (**no state**; `type` ∈ `PAYMENT`, `CORRECTION`) | — | insert-only | the ledger |
| refunds | — (**no state**) | — | insert-only | the ledger |
| attentionItems | `status` | `OPEN`, `DISMISSED`, `RESOLVED` | `DISMISSED`, `RESOLVED` | `resolution.{by,at,reason?}` |
| menuImports | `status` | `UPLOADED`, `EXTRACTING`, `READY_FOR_REVIEW`, `APPROVED`, `PUBLISHED`, `FAILED`, `DISCARDED` | `PUBLISHED`, `FAILED`, `DISCARDED` | timestamps per step + audit on approval |
| aiProposals | `status` | `PROPOSED`, `CONFIRMED`, `EXECUTED`, `EXPIRED`, `REJECTED`, `FAILED` | `EXECUTED`, `EXPIRED`, `REJECTED`, `FAILED` | the record + audit |
| invitations | `status` | `PENDING`, `SENT`, `FAILED`, `REDEEMED`, `REVOKED` (expiry is derived from `expiresAt`) | `REDEEMED`, `REVOKED` | the record + audit on reissue |
| uploadedFiles | `status` | `PENDING_VALIDATION`, `READY`, `REJECTED` | `READY`, `REJECTED` | the record |
| dailyBriefs | `status` | `READY`, `UNAVAILABLE` | both | the record |

† `REJECTED` is the **neutral reserved** terminal pre-`CONFIRMED` outcome of TRD §15.1. Its **name and reporting classification are undecided (PB-4 → OD-DB-4)**; no analytics class is encoded in the schema. `bills.status` **does** contain `REFUNDED` `[APP_FLOW §16.1, AF-051; PRD §39, PRD-BILL-002.1; SPEC BILL-002]` (R2 correction of the R1 draft, which had excluded it on the strength of TRD §15.5); the effect of a refund on `paymentStatus` is OD-DB-5b (PO-1).

### 10.2 Per-machine persistence contract (Part 24)

Every transition is a single conditional write `findOneAndUpdate({_id, organizationId, outletId, <stateField>: from, rev: expectedRev}, {$set:{<stateField>:to}, $inc:{rev:1}, $push:{history: HistoryEntry}})` (M2). Zero matches ⇒ re-read: already `to` ⇒ idempotent replay result; else `409` with current state. Audited transitions append the audit event in the **same transaction** (M4). Server clock only (M5). Terminal states accept no forward transition (M8); corrections are **new records**.

| Machine | Current-state field | Allowed transitions (actor atom) | Timestamp / actor / reason stored | History strategy | Correction strategy |
|---|---|---|---|---|---|
| **Order** `[TRD §15.1]` | `orders.stage` (derived from items by `deriveOrderStage`, written in every item-changing transaction) | `DRAFT→AWAITING_ACCEPTANCE` (customer submit — in this schema the customer Draft lives in `customerDrafts`, so an order is **created** at `AWAITING_ACCEPTANCE`; SD-8) · `DRAFT→CONFIRMED` (staff commit ACT-ORD-01/02) · `AWAITING_ACCEPTANCE→CONFIRMED` (ACT-ACC-01) · `AWAITING_ACCEPTANCE→REJECTED` (ACT-ACC-02, reason) · `CONFIRMED→KOT_SENT` (system) · `KOT_SENT→PREPARING`, `PREPARING→READY`, `KOT_SENT→READY` (derived) · `READY→SERVED` (ACT-HND-01) / `READY→PICKED_UP` (ACT-HND-02) · `SERVED`/`PICKED_UP→COMPLETED` (system) · `CONFIRMED/KOT_SENT/PREPARING/READY→CANCELLED` (all items cancelled) | `confirmedAt`, `completedAt`, `cancelledAt`, `rejection{reason,by,at}`, per-transition `HistoryEntry` | embedded `history[]` (bounded ≈ 10) | Completed/Cancelled/Rejected never reopen; bill-side corrections use bill Reopen/refund. Bill/payment never changes `stage` (INV-09) |
| **Order item** `[TRD §15.2]` | `orderItems.state` | `PENDING→SENT` (system with KOT) · `SENT→PREPARING` (ACT-KDS-01) · `SENT/PREPARING→READY` (ACT-KDS-02) · `READY→SERVED` / `READY→PICKED_UP` (handoff) · `PENDING/SENT/PREPARING/READY→CANCELLED` (ACT-CAN-*) | `sentAt`, `preparingAt`, `readyAt`, `handoffAt`, `cancelledAt` (SD-10); reason via `cancellationRecords` | embedded `history[]` (bounded ≈ 8) | `SERVED/PICKED_UP→*` forbidden: bill Reopen/refund workflow |
| **KOT** `[TRD §23.1]` | none | created only: `INITIAL`, `ADDITIONAL`, `CANCELLATION` | `createdAt`, `issuedBy`, `sourceKey` | the document is the history; never edited (ORD-090) | A correction is a **new** `CANCELLATION` + `ADDITIONAL` KOT |
| **Bill** `[TRD §15.5; APP_FLOW §16.1]` | `bills.status` | `DRAFT→FINALIZED` (ACT-BIL-04) · `FINALIZED→REOPENED` (ACT-BIL-05, reason) · `REOPENED→FINALIZED` · `FINALIZED→CANCELLED` (ACT-BIL-06 — mandatory reason; the only cancel edge) · **`FINALIZED→REFUNDED` (a refund recorded against a Finalized bill that has a payment — ACT-BIL-07, AF-051; set in the same transaction as the `refunds` insert)** · `Draft`/`Reopened` bills **cannot** be cancelled (PO-5). A refund recorded on a `DRAFT`, `REOPENED` or `CANCELLED` bill is a ledger record with **no** status change. **No edge leaves `REFUNDED`** (OD-DB-27); every edge not listed is forbidden (TRD §15.12, §25.9.2) | `finalizedAt/By`, `reopenedAt/By/reason`, `cancellation{reason?,by,at}`; refund facts live in `refunds` | embedded `history[]` + insert-only `billRevisions` | Reopen → correct → re-finalize creates revision n+1; **prior revisions never edited** |
| **Payment** `[§26]` | none (`paymentStatus` is derived on the bill) | ledger: `PAYMENT`; `CORRECTION` supersedes | `recordedAt/By`, `businessDayId` | the ledger | Correction = new entry with `supersedes`; originals untouched |
| **Refund** `[TRD §26.6]` | none | ledger: refund entry | `at`, `actor`, `reason?`, `attributedDayId`, `recordedDayId` | the ledger | A mistaken refund is corrected through an authorized audited correction — mechanism undefined upstream (PB-19; not part of PO-1…PO-6) |
| **Business day** `[§27]` | `businessDays.status` | `RUNNING→CLOSED` (Day Close) · `CLOSED→RUNNING_next` (system: new day inserted in the same txn) · `CLOSED→REOPENED` (Reopen Day) · `REOPENED→CLOSED` (re-close) · `RUNNING→ABSORBED` (absorbed by Reopen) | `closedAt`, `reopenEvents[{at,by,reason}]` | `dayCloseRevisions`, `reopenEvents[]`, audit | Revisions only appended; **never rewritten** |
| **Outlet** `[TRD §28]` | `activation.state`; `availability.state` | `NOT_ACTIVATED→ACTIVATED` (Owner) · `OPEN↔CLOSED` (Owner, Manager; Owner Agent only with confirmation) | `activation.{at,by}`, `availability.{changedAt,changedBy}` | `outletStateEvents` | Open/Closed is reversible by design; history retained |
| **Staff availability** `[STAFF-004…013]` | `staffProfiles.attendance`, `.availability` | `availability`: Owner, Manager, self (ACT-AVL-01); setting `ABSENT` forces `UNAVAILABLE` (STAFF-008) | `…ChangedAt/By` | **none** (SD-9) | n/a — current state only |
| **Attention** `[TRD §15.7]` | `attentionItems.status` | `OPEN→DISMISSED` / `OPEN→RESOLVED` (ACT-ANL-04) | `resolution.{by,at,reason?}` | the record | No auto-resolution (PB-9 → OD-DB-6) |
| **Cancellation request** `[TRD §15.4]` | `cancellationRequests.status` | `OPEN→ACCEPTED` (ACT-CAN-07, also cancels item atomically) · `OPEN→DECLINED` · `OPEN→NO_OP` (set by the handoff transaction) | `requestedBy/At/reason`, `resolvedBy/At` | the record (rejected/stale remain) | Never auto-cancels; stale ⇒ an `attentionItems` row |
| Table / session / import / proposal / invitation | see §10.1 | per TRD §21.2, §15.9, §15.11, §12.5 | | | |

---

## 11. Collection Definitions

**How to read.** *Standard sets* (§6.2) are listed per collection and are **not repeated** in the field tables. Types: `ObjectId→coll`, `String`, `Int` (safe integer), `Paise` (§6.5), `Bps`, `Bool`, `Date` (UTC), `Enum(…)`, `[T]` (array), `{…}` (embedded). **Required / Default / Mutable** apply after creation. Tags in descriptions follow §1.2. Index notation: `U` unique · `P{filter}` partial · `T` TTL · `S` sparse-equivalent (expressed as partial `$type`). **All compound indexes lead with `organizationId` (then `outletId`)** unless stated (TRD §11.4). Every collection with `organizationId` is under the tenancy-guard plugin (§19.6).

### 11.1 Collection: organizations  (C-01)

**Purpose.** The tenant root: one restaurant/brand. Holds identity, platform lifecycle status and the menu publish version. **Scope.** Organization — its own `_id` **is** the tenant id (it carries no `organizationId`; the tenancy guard uses `_id` for this collection, SD-7). **Lifecycle.** Created by SuperAdmin at provisioning (ONB-001…005) → exists forever; never deleted (ONB-014: suspension never deletes data). **Ownership.** `tenancy`; platform status written only by SuperAdmin routes.
**Standard sets:** REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `name` | String ≤ 120 | yes | — | yes | Restaurant/brand display name `[SPEC ONB-020]` |
| `brandName` | String ≤ 120 | no | null | yes | Brand where it differs `[SPEC ONB-020]` |
| `logoFileId` | ObjectId→`uploadedfiles` | no | null | yes | Logo (purpose `LOGO`) `[SPEC ONB-020, TRD §34]` |
| `contact` | Contact | no | null | yes | Restaurant contact `[SPEC ONB-020]` |
| `restaurantType` | String ≤ 60 | no | null | yes | Cuisine/type template key `[SPEC ONB-022]` — template catalogue is configuration; **"operating configuration" content is undefined upstream → OD-DB-7** |
| `structure` | Enum(`SINGLE_OUTLET`,`MULTI_OUTLET`) | yes | — | yes (only `SINGLE→MULTI`) | Chosen at provisioning; set to `MULTI_OUTLET` automatically in the transaction that creates a second outlet `[SPEC ONB-002, ONB-015]` |
| `ownerUserId` | ObjectId→`users` | yes | — | yes (Owner reassignment via SuperAdmin) | The provisioned Owner `[SPEC ONB-003]`. Multi-organization Owner is **not** supported (TD-AUTH-2; PB-2 → OD-DB-3) |
| `platform.status` | Enum(`PROVISIONED`,`SUSPENDED`,`DEACTIVATED`) | yes | `PROVISIONED` | yes (SuperAdmin) | Restaurant platform state, **independent** of outlet and business-day state `[TRD §28.1, §15.10]`. `SUSPENDED` and `DEACTIVATED` are enforced identically; the difference and any reinstatement transition are undefined (PB-7 → OD-DB-1) |
| `platform.changedAt` / `platform.changedBy` | Date / ActorRef | no | null | yes | Last status change `[TRD §28.5]` |
| `platform.reason` | Reason | no | null | yes | SuperAdmin's stated reason, if given |
| `provisionedAt` / `provisionedBy` | Date / ActorRef | yes | now | no | ONB-005 |
| `menuVersion` | Int ≥ 0 | yes | `0` | `$inc` only | Monotonic organization menu publish version; bumped in the publish transaction `[TRD §20.3, §20.5]` |

- **Indexes.** `(platform.status, createdAt)` — SuperAdmin restaurant list/filter (SCR-040/041; platform scope, no `organizationId` lead because the collection *is* the tenant list). *(No `(ownerUserId)` index: sign-in resolves the organization through `users.organizationId`; the reverse lookup "which organization does this Owner own" is a rare SuperAdmin read served by `users (organizationId, role, status)` — index removed in R1 as redundant.)* 
- **Unique constraints.** **None on `name`**: duplicate restaurant names/validation are undecided (PB-2/AMB-20) — inventing uniqueness would invent a rule `[OD-DB-3]`.
- **References.** `ownerUserId`, `logoFileId`. **Embedded documents.** `contact`, `platform`. **Snapshots.** none.
- **State transitions.** `platform.status`: `PROVISIONED→SUSPENDED|DEACTIVATED` by SuperAdmin; no reverse transition is permitted by the schema/guard until PB-7 is decided.
- **Audit.** `PLATFORM.RESTAURANT_SUSPENDED`, `PLATFORM.RESTAURANT_DEACTIVATED` in the same transaction `[SPEC AUDIT-002, ONB-009]`; Redis `plat:{orgId}` snapshot invalidated after commit.
- **Concurrency.** `rev` conditional write; `menuVersion` bumped atomically inside the publish transaction.
- **Retention.** Never deleted; no soft-delete field (status is the lifecycle). **Security.** No secrets. SuperAdmin-only writes to `platform.*`; Owner may update identity fields (ACT-CFG-*).

### 11.2 Collection: outlets  (C-02)

**Purpose.** One physical outlet = one kitchen context. Carries address, tax identity, time zone, activation, Open/Closed availability, channel/payment/charge configuration and public channel keys. **Scope.** Outlet root (carries `organizationId`; its `_id` is the `outletId` used everywhere). **Lifecycle.** Created at provisioning or by the Owner (ONB-015) → `NOT_ACTIVATED` → `ACTIVATED`; never deleted or deactivated in Phase 1 (no outlet-closure lifecycle exists upstream). **Ownership.** `tenancy`, `outlet-setup`.
**Standard sets:** TEN-O (immutable), REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `name` | String ≤ 120 | yes | — | yes | Outlet name |
| `code` | String 2–10, `[A-Z0-9]` | yes | — | **no** | Short outlet code used as the **invoice-number prefix** `[TRD §25.4 PO-TRD-01 #5]`; immutable so issued invoice numbers stay valid `[SD-13]` |
| `address` | Address | yes (before activation) | — | yes | `[SPEC ONB-021]` |
| `timeZone` | String (IANA) | yes | — | yes | Display/reporting only; **never a day boundary** `[TRD C20, DAY-001]` |
| `gstin` | String 15, uppercase | no | null | yes | GST/tax information `[SPEC ONB-021, PO-TRD-01]` — format validation is an API rule |
| `activation.state` | Enum(`NOT_ACTIVATED`,`ACTIVATED`) | yes | `NOT_ACTIVATED` | yes (one-way) | `[SPEC ONB-030/032, TRD §15.10]` |
| `activation.activatedAt` / `.activatedBy` | Date / ActorRef | no | null | set once | Owner activation |
| `availability.state` | Enum(`OPEN`,`CLOSED`) \| null | **no (nullable)** | **null** | yes (Owner, Manager) | Manual only `[SPEC ORG-020/032]`. **Initial value at activation is undefined (PB-10 → OD-DB-2):** `null` = "never set"; the operation gate (TRD §28.2) treats it as *unspecified* and no order is accepted while activation or availability is unresolved |
| `availability.changedAt` / `.changedBy` | Date / ActorRef | no | null | yes | Mirrors the latest `outletStateEvents` row |
| `channels.tableQr` / `.tablelessQr` / `.website` / `.whatsapp` | Bool ×4 | yes | `false` | yes | Which ordering channels are enabled `[SPEC ONB-029]` |
| `tablelessQrKey` | String (22–32, base64url) | no | null | rotate | Opaque outlet-level QR key (**no table info**, TABLE-006) `[TRD §21.5]`. Public identifier, stored in clear (it is printed on QR codes) `[SD-14]` |
| `websiteKey` | String | no | null | rotate | Per-outlet public website key, **distinct from the QR key** `[TRD TD-CUS-1]` |
| `whatsapp.businessNumberId` | String | no | null | yes | Provider business-number id mapping an inbound webhook to this outlet `[TRD §29.1]` |
| `paymentModes` | [Enum(`UPI`,`CASH`,`CARD`)] | yes | `[]` | yes | Payment modes the outlet records `[SPEC ONB-028, PRD-ONB-028.1]`; at least one required for activation (checklist). Provider/UPI-ID details are not defined upstream **→ OD-DB-7** |
| `charges.service` / `charges.packaging` | `{ enabled Bool, basis Enum(PERCENT,FLAT), valueBps Bps?, valuePaise Paise? }` | yes | `{enabled:false}` | yes | Per-outlet service/packaging charge configuration, **off by default** `[TRD PO-TRD-01 #3]`. Exactly one of `valueBps`/`valuePaise` per `basis`. The outlet chooses `PERCENT` or `FLAT` per charge kind `[PO-2, TRD §25.9.3]`; PERCENT is computed on the discounted item subtotal, FLAT is once per bill. Staff **apply** the charge to a bill, and the bill's adjustment entry snapshots these values, so **changing this configuration never affects existing bills**. Config only — **never used to rebuild a historical bill** |
| `overrideVersion` | Int ≥ 0 | yes | `0` | `$inc` only | Monotonic outlet override version, bumped in every override-change transaction `[TRD §20.3]` |

- **Indexes.** **U** `(organizationId, code)` — invoice-prefix uniqueness per organization `[SD-13]`; `(organizationId, createdAt)` — Owner outlet list; **U P{tablelessQrKey: {$type:'string'}}** `(tablelessQrKey)`, **U P{websiteKey: {$type:'string'}}** `(websiteKey)`, **U P{whatsapp.businessNumberId: {$type:'string'}}** — public key → outlet resolution without an organization (§5.3). These three are the only indexes **not** led by `organizationId` (public resolution has no tenant context yet).
- **Unique constraints.** As above. **No** uniqueness on `name`/`gstin` (not defined upstream).
- **References.** `organizationId`. **Embedded documents.** `address`, `activation`, `availability`, `channels`, `whatsapp`, `charges`. **Snapshots.** none — consumers copy what they need at the moment of use.
- **State transitions.** `activation.state` one-way `NOT_ACTIVATED→ACTIVATED` (checklist, ONB-033); `availability.state` `OPEN↔CLOSED`. Both are *independent* of `organizations.platform.status` and `businessDays.status` (TRD §28.1).
- **Audit.** Open/Closed is **not** in AUDIT-002 (AMB-21/PB-19) but **is** recorded in `outletStateEvents`; executed by the Owner Agent it is audited (`AI.ACTION_EXECUTED`) `[TRD §28.5]`. Charge configuration changes are not enumerated upstream → OD-DB-9 (audit scope beyond AUDIT-002).
- **Concurrency.** `rev` conditional write on every toggle; the operational gate reads state inside the transaction (TD-OUT-2); `overrideVersion` incremented atomically.
- **Retention.** Never deleted. **Security.** Public keys are not credentials but are unguessable (128-bit); rotation overwrites the old key (old key then resolves to a generic not-found, C-INVALID).

### 11.3 Collection: outletStateEvents  (C-03)

**Purpose.** Append-only operational history of outlet activation and Open/Closed changes (actor, time, from→to) `[TRD §28.5]`. **Scope.** Outlet. **Lifecycle.** Insert-only. **Ownership.** `tenancy`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `type` | Enum(`ACTIVATION`,`AVAILABILITY`) | yes | — | no | Which dimension changed |
| `from` / `to` | String | `to` yes | — | no | Previous (nullable) and new value |
| `actor` | ActorRef | yes | — | no | Owner/Manager, or Owner Agent (`via:'AI'`) |
| `reason` | Reason | no | null | no | Optional |
| `businessDayId` | ObjectId→`businessdays` | no | null | no | Active day at the time (context only; **not** a fence write) |
| `requestId` | String | yes | — | no | Correlation |

- **Indexes.** `(organizationId, outletId, createdAt desc)` — outlet state timeline.
- **Unique.** none. **References.** `businessDayId`. **Audit.** The record *is* the history; AI-executed toggles additionally audited. **Concurrency.** Inserted in the same transaction as the `outlets` conditional write. **Retention.** Indefinite, insert-only. **Security.** none sensitive.
- **Embedded documents.** none beyond the `actor` (ActorRef) and `reason` sub-documents.
- **Snapshots.** Each row is itself a point-in-time record of one `from→to` change.
- **State transitions.** none — insert-only; the rows record the transitions of `outlets.activation` / `outlets.availability`.

- **Unique constraints.** none.
### 11.4 Collection: users  (C-04)

**Purpose.** Identity and credentials of **every authenticated principal**: restaurant users (Owner, Manager, Cashier, Waiter, Kitchen) and SuperAdmin. **Customers are not users** (no accounts, AUTH-009). **Scope.** Platform (SuperAdmin, `organizationId` null) **or** Organization. **Lifecycle.** Created by SuperAdmin (Owner), by Owner/Manager (staff) → `ACTIVE`/`INACTIVE`; never deleted (history is attributed to users). **Ownership.** `identity-access`.
**Standard sets:** REV, TS. (`organizationId` here is a **conditional** tenant field — required iff `userType = RESTAURANT_USER`.)

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `userType` | Enum(`SUPER_ADMIN`,`RESTAURANT_USER`) | yes | — | no | Principal type. SuperAdmin is **not** a role (RBAC-020) `[TRD §13.2]` |
| `organizationId` | ObjectId→`organizations` | iff `RESTAURANT_USER` | null | no | Null **only** for SuperAdmin (validator) `[SD-16]` |
| `role` | Enum(`OWNER`,`MANAGER`,`CASHIER`,`WAITER`,`KITCHEN`) | iff `RESTAURANT_USER` | null | yes (owner/manager with ACT-STF) | Closed enum; no role may be added (RBAC-021, NG-013). A validator **subset** of the TRD §13.2 `ROLE` enum: `CUSTOMER` is in that enum as a *link principal with a fixed, non-customizable allow-set* and is never a `users` row (no accounts, AUTH-009) |
| `name` | String ≤ 120 | yes | — | yes | `[PII]` |
| `email` | String (lower-cased, trimmed) | no* | null | yes | `[PII]` normalized identifier `[TRD §12.1]` |
| `phone` | String (E.164) | no* | null | yes | `[PII]` normalized identifier. *At least one of `email`/`phone` is required (AUTH-001 "email OR phone"; validator) |
| `passwordHash` | String | no | null | yes | bcrypt hash, cost 12 (`BCRYPT_ROUNDS`), input ≤ 72 bytes; **`select:false`**. Null until an invited Owner redeems the invitation `[TRD TD-AUTH-1, TD-AUTH-7]`. Never in logs, audit, JSON |
| `passwordChangedAt` | Date | no | null | yes | Set on reset/redemption |
| `status` | Enum(`ACTIVE`,`INACTIVE`) | yes | `ACTIVE` | yes | Inactive users cannot authenticate or act (AUTH-006). **No `DELETED` value** (BC-5) |
| `authzVersion` | Int ≥ 1 | yes | `1` | `$inc` only | Durable source of the permission/assignment version whose Redis mirror is `authz:ver:{userId}`; bumped **in the same transaction** as any override/assignment/status change `[TRD §13.7, §38.3]` `[SD-11]` |
| `createdBy` | ActorRef | yes | — | no | |

- **Indexes.** **U P{email: {$type:'string'}}** `(email)` and **U P{phone: {$type:'string'}}** `(phone)` — platform-wide login identifiers (TD-AUTH-2; the only deliberate cross-tenant unique; login has no tenant context); `(organizationId, role, status)` — staff list by role/status (its `(organizationId)` prefix also serves any other organization staff listing; a separate `(organizationId, status)` index was **removed in R1** as redundant — the per-organization staff set is small and bounded).
- **Unique constraints.** As above. **Not unique:** one-Owner-per-organization (undecided, AMB-20/PB-2) and name.
- **References.** `organizationId`. **Embedded documents.** none. **Snapshots.** `ActorRef.role` on historical records preserves the role *at the time*.
- **State transitions.** `ACTIVE↔INACTIVE`; deactivation = status change + `authzVersion` bump + revoke all `sessions` in one transaction `[TRD §12.5]`.
- **Audit.** `AUTH.CREDENTIAL_RESET`, `AUTH.USER_DEACTIVATED` (AUTH-007); role/permission changes → `RBAC.OVERRIDE_CHANGED`; role change itself is not enumerated in AUDIT-002 → OD-DB-9.
- **Concurrency.** `rev` + `authzVersion`; two concurrent permission edits serialize on the override document/`rev` (§14).
- **Retention.** Never deleted. **Security.** `passwordHash` `select:false` and stripped by the `toJSON` transform; identical login response for unknown/inactive/wrong-password (AUTH-006.AC1); BC-1…BC-8 fields removed.

### 11.5 Collection: staffProfiles  (C-05)

**Purpose.** The three **separate** staff dimensions — schedule, attendance, availability (STAFF-001) — per person. **Scope.** Organization (per person, not per outlet — SD-9). **Lifecycle.** Created with the user; updated in place; never deleted. **Ownership.** `staff`.
**Standard sets:** TEN-O, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `userId` | ObjectId→`users` | yes | — | no | One profile per restaurant user (unique) |
| `schedule` | `{ startTime 'HH:mm', endTime 'HH:mm' }` | no | null | yes | Planned working period, e.g. 10:00–19:00 `[SPEC STAFF-002]`. **Recurrence/day-of-week/exceptions are undefined → OD-DB-10**; the single window is the literal STAFF-002 example `[SD-9]` |
| `attendance` | Enum(`PRESENT`,`ABSENT`) | yes | `ABSENT` | yes | `[SPEC STAFF-003]`. Default is `ABSENT` because it is the only start state consistent with STAFF-008; initial value is not stated upstream → OD-DB-10 |
| `availability` | Enum(`AVAILABLE`,`ON_BREAK`,`UNAVAILABLE`) | yes | `UNAVAILABLE` | yes | `[SPEC STAFF-004, STAFF-006]` |
| `attendanceChangedAt` / `By` | Date / ActorRef | no | null | yes | |
| `availabilityChangedAt` / `By` | Date / ActorRef | no | null | yes | Owner, Manager or the person themself (STAFF-005) |

- **Invariant (STAFF-007/008).** `attendance = ABSENT ⇒ availability = UNAVAILABLE`. Enforced (a) by a Mongoose validator on save and (b) inside every update filter/pipeline (setting `ABSENT` sets `UNAVAILABLE` in the same `$set`); `ABSENT + AVAILABLE` is **never stored** (STAFF-007.AC1).
- **Indexes.** **U** `(organizationId, userId)` — profile lookup; staff lists by outlet are `staffAssignments(outletId,status)` → `$in` userIds → this unique index (no extra index justified).
- **State / history.** Current state only; **no history array** — STAFF-009 forbids payroll/attendance logging and no upstream requirement asks for availability history (SD-9). Changes are realtime hints (`staff.availability.changed`) only.
- **Audit.** None (not in AUDIT-002). **Concurrency.** `rev` conditional write; concurrent availability changes: last committed wins with the loser told the current state (§14). On Break/Unavailable **never** alters existing work attribution (STAFF-013): orders keep `createdBy`.
- **Retention.** Never deleted. **Security.** Operational, low sensitivity.
- **References.** `organizationId`→organizations; `userId`→users.
- **Embedded documents.** `schedule` `{startTime,endTime}`; change actors as ActorRef.
- **Snapshots.** none (current state only, SD-9).
- **State transitions.** `attendance` `PRESENT↔ABSENT`; `availability` `AVAILABLE↔ON_BREAK↔UNAVAILABLE`; setting `ABSENT` forces `UNAVAILABLE` in the same write (§10.2).

- **Unique constraints.** `(organizationId, userId)` (see Indexes).
### 11.6 Collection: staffAssignments  (C-06)

**Purpose.** Outlet access of non-Owner staff, with **history**: who worked where, in what role, from when to when (ORG-010: past actions stay attributed to the outlet where they occurred). **Scope.** Outlet. **Lifecycle.** `ACTIVE` → `ENDED`; a reassignment/role change **ends** the old row and inserts a new one in one transaction. **Ownership.** `staff`.
**Standard sets:** TEN-OO, REV, TS. **Owner has no rows** — Owner's `allowedOutletIds` is *all outlets of the organization* `[TRD §11.2]`.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `userId` | ObjectId→`users` | yes | — | no | |
| `role` | Enum(`MANAGER`,`CASHIER`,`WAITER`,`KITCHEN`) | yes | — | no | Role **at assignment time** (a role change = new row) |
| `status` | Enum(`ACTIVE`,`ENDED`) | yes | `ACTIVE` | yes (one-way) | |
| `isExclusive` | Bool | yes | derived from role | no | `true` for `CASHIER`/`WAITER`/`KITCHEN` (exactly one current outlet, ORG-008); `false` for `MANAGER` (assigned outlet(s), ORG-007) `[SD-17]` |
| `startedAt` / `startedBy` | Date / ActorRef | yes | now | no | |
| `endedAt` / `endedBy` | Date / ActorRef | no | null | set once | |
| `endReason` | Enum(`REASSIGNED`,`ROLE_CHANGED`,`DEACTIVATED`) | when ended | null | set once | `[SD-17]` classification of why access ended |

- **Indexes.** **U P{status:'ACTIVE', isExclusive:true}** `(organizationId, userId)` — a Cashier/Waiter/Kitchen has **exactly one** current outlet (ORG-008) `[SD-17]`; **U P{status:'ACTIVE'}** `(organizationId, outletId, userId)` — no duplicate active row per outlet; `(organizationId, outletId, status, role)` — staff list of an outlet (SCR-015); `(organizationId, userId, status)` — builds `allowedOutletIds` at sign-in.
- **References.** `userId`. **State transitions.** `ACTIVE→ENDED`. **History strategy.** The collection *is* the assignment history; `outletId` on every business record is stamped at action time and never rewritten.
- **Audit.** `STAFF.OUTLET_REASSIGNED` in the same transaction (STAFF-011); manager-assigned-outlet changes likewise (RBAC/AUDIT). **Concurrency.** Reassignment = one transaction: conditional end of old row (`rev`), insert new row, `users.authzVersion` bump; the partial unique index makes a racing duplicate assignment fail with a duplicate-key error (§14). **Retention.** Never deleted. **Security.** Outlet access is checked per request from this collection (via the identity snapshot).
- **Embedded documents.** none beyond ActorRef.
- **Snapshots.** `role` is a snapshot of the role *at assignment time*.

- **Unique constraints.** the two partial unique indexes above.
### 11.7 Collection: permissionOverrides  (C-07)

**Purpose.** Owner customization of the permission catalogue: **role-level** and **user-level** `grant`/`deny` sets, on top of the code-resident role defaults `[TRD §13.2–13.3]`. **Scope.** Organization. **Lifecycle.** Created on first customization; edited in place (`rev`); never deleted (clearing = empty sets, history in audit). **Ownership.** `identity-access`.
**Standard sets:** TEN-O, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `scope` | Enum(`ROLE`,`USER`) | yes | — | no | Org-wide role override vs one user's override |
| `role` | Enum(restaurant roles — the five `users.role` values) | iff `ROLE` | null | no | Which role the override applies to. `CUSTOMER` cannot be overridden: its allow-set is fixed `[TRD §13.2]` |
| `userId` | ObjectId→`users` | iff `USER` | null | no | |
| `grants` | [String] | yes | `[]` | yes | Permission atoms **explicitly granted** (`ACT-…` ids) |
| `denies` | [String] | yes | `[]` | yes | Permission atoms **explicitly denied** |
| `catalogueVersion` | Int | yes | current | yes | Version of the code-resident catalogue the atoms were validated against `[SD-12]` |
| `updatedBy` | ActorRef | yes | — | yes | |

**Default vs explicit grant vs explicit deny — never unresolved.** For one atom and one user exactly one of three states exists, evaluated in a fixed order: **(1) default** — the atom's role default from the code-resident profile (no document needed); **(2) explicit grant** — in some `grants`; **(3) explicit deny** — in some `denies`. Effective = `deny-filter((roleDefault ∪ roleOverride.grants ∪ userOverride.grants) − roleOverride.denies − userOverride.denies) ∩ catalogueBounds` (TRD §13.3; deny beats grant; user beats role beats default). Validators: `grants ∩ denies = ∅` within a document; every atom matches the catalogue pattern `^ACT-[A-Z]+-\d{2}$` and exists in the catalogue; **no SuperAdmin atom** can be stored (E3). Out-of-bound atoms are rejected at write **and** ignored at evaluation.

- **Indexes.** **U P{scope:'ROLE'}** `(organizationId, role)`; **U P{scope:'USER'}** `(organizationId, userId)` — one override document per role/user (a second concurrent create fails and is converted to an update).
- **Audit.** `RBAC.OVERRIDE_CHANGED` with before/after sets (RBAC-010) in the same transaction as the write **and** the `authzVersion` bump(s) (role override → every holder of that role). **Concurrency.** `rev` conditional write: two owners editing → `409 REV_MISMATCH`; in-flight actions finish, next action recomputes (§14). **Retention.** Never deleted. **Security.** Writer must hold ACT-STF-05; Manager cannot manage Manager accounts without ACT-STF-02 (E4, API-level).
- **Unique constraints.** the two partial unique indexes above (one document per role, one per user).
- **References.** `organizationId`; `userId`→users (USER scope).
- **Embedded documents.** `grants[]`, `denies[]` string arrays.
- **Snapshots.** `catalogueVersion` records which catalogue version the atoms were validated against.
- **State transitions.** none — configuration; every change is audited.

### 11.8 Collection: sessions  (C-08)

**Purpose.** Server-side authentication session — the **authoritative** record behind claims-free access tokens and rotating refresh tokens `[TRD TD-AUTH-3]`. Replaces the boilerplate `sessions` model (BC-7). **Scope.** Platform (SuperAdmin, `organizationId` null) / Organization. **Lifecycle.** Created at sign-in → rotated on each refresh → revoked or expired → **TTL-purged**. **Ownership.** `identity-access`.
**Standard sets:** TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `userId` | ObjectId→`users` | yes | — | no | |
| `organizationId` | ObjectId | no | null | no | Null for SuperAdmin |
| `userType` | Enum(`SUPER_ADMIN`,`RESTAURANT_USER`) | yes | — | no | Selects signing key/TTL set |
| `family` | String (UUID) | yes | — | no | Rotation family; reuse of a rotated token revokes the whole family |
| `refreshHash` | String (SHA-256 hex) | yes | — | rotates | Hash of the **current** refresh token; **`select:false`**; the raw token is never stored |
| `prevRefreshHash` | String | no | null | rotates | Hash of the immediately previous token — presenting it signals **reuse** → revoke family `[TRD §12.2]` `[SD-19]` |
| `rotatedAt` | Date | no | null | yes | |
| `lastSeenAt` | Date | yes | now | yes | |
| `idleExpiresAt` | Date | yes | now+`REFRESH_IDLE_TTL` | yes (slides) | 24 h default (SA 30 min) `[OTD-2]` |
| `absoluteExpiresAt` | Date | yes | now+`REFRESH_ABS_TTL` | no | 7 d default (SA 8 h) `[TRD §12.1, OTD-2]`; **TTL anchor** `[TRD §37.3: "TTL on absolute expiry"]` |
| `deviceType` | Enum(`IOS`,`ANDROID`,`WEB`) | no | null | no | Boilerplate field retained |
| `appVersion` | String | no | null | no | Boilerplate field retained |
| `remoteAddress` | String | no | null | no | Boilerplate field retained; `[PII]`, TTL-bounded; not copied into audit (audit stores `ipHash`) |
| `revokedAt` | Date | no | null | set once | |
| `revokedReason` | Enum(`LOGOUT`,`DEACTIVATED`,`CREDENTIAL_RESET`,`REFRESH_REUSE`,`SUSPENDED_PLATFORM`) | when revoked | null | set once | `[SD-19]` classification only; no new behaviour |

- **Indexes.** **U** `(refreshHash)` — refresh lookup (no tenant context); `(prevRefreshHash)` partial `{$type:'string'}` — reuse detection; `(userId, revokedAt)` — revoke-all-for-user on deactivation/reset; **T** `(absoluteExpiresAt)` with `expireAfterSeconds: 86400` — purge after absolute expiry: the TTL on absolute expiry is `[TRD §37.3]`; the **one-day grace is an engineering default** `[OPEN TECHNICAL DECISION]` OTD-15e (an index property: changing it needs `collMod`). A session past `absoluteExpiresAt` is already unusable, and the row is not a business or audit record (single-field TTL, per MongoDB TTL restrictions, §13.5).
- **State transitions.** Active → revoked (`revokedAt`) or expired; idle expiry is evaluated, not stored as a state.
- **Audit.** SuperAdmin lockout/credential actions per `TN-3`; ordinary logins are *not* audited (not in AUDIT-002); failure telemetry is a metric, not a record. **Concurrency.** Rotation is a conditional write on `{_id, refreshHash: presented}`; a concurrent second refresh with the same token finds a changed hash → treated as reuse/failed. **Retention.** TTL purge (not a business record). **Security.** Hash-only token storage; `select:false`; no raw tokens in any collection; Redis `revoked:{sid}` is a cache of `revokedAt`.
- **Unique constraints.** `refreshHash` (platform-wide).
- **References.** `userId`→users; `organizationId`→organizations (null for SuperAdmin).
- **Embedded documents.** none.
- **Snapshots.** none.

### 11.9 Collection: invitations  (C-09)

**Purpose.** Single-use onboarding invitation that lets an Owner set the **first password**; also the reissue mechanism after an Owner reset `[TRD TD-AUTH-7, §12.5, SPEC ONB-006/010/013]`. **Scope.** Organization. **Lifecycle.** `PENDING→SENT→REDEEMED`; `FAILED` (email failure, recoverable, ONB-013); `REVOKED` (resend revokes the previous token). **Ownership.** `identity-access`. **No staff invitations exist** (UC-1).
**Standard sets:** TEN-O, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `userId` | ObjectId→`users` | yes | — | no | The invited Owner |
| `purpose` | Enum(`OWNER_ONBOARDING`,`OWNER_RESET`) | yes | — | no | `[SD-20]` distinguishes first issue from SuperAdmin reissue (ONB-010) |
| `emailAtIssue` | String | yes | — | no | `[PII]` address the link was sent to |
| `tokenHash` | String (SHA-256) | yes | — | no | 256-bit token hash; **`select:false`**; raw token exists only in the email job |
| `status` | Enum(`PENDING`,`SENT`,`FAILED`,`REDEEMED`,`REVOKED`) | yes | `PENDING` | yes (forward) | `PENDING` = created, email not yet enqueued/sent; expiry derived from `expiresAt` |
| `expiresAt` | Date | yes | now+`INVITE_TTL` (7 d) | no | |
| `issuedBy` | ActorRef | yes | — | no | SuperAdmin |
| `enqueuedAt` / `sentAt` | Date | no | null | yes | Used by `reconcile-intents` to re-enqueue a lost job (PENDING without `enqueuedAt`) `[TRD §18.5]` |
| `failureReason` | String ≤ 200 | no | null | yes | Provider error class only (no secrets) |
| `redeemedAt` | Date | no | null | set once | |
| `revokedAt` / `revokedReason` | Date / String | no | null | set once | Resend revokes the previous invitation |

- **Indexes.** **U** `(tokenHash)` — redemption lookup (no tenant context); `(organizationId, userId, status)` — current invitation of a user; `(status, createdAt)` partial `{status:'PENDING'}` — reconciler scan.
- **Unique constraints.** `tokenHash` only; "one live invitation per user" is enforced by the transactional resend (revoke previous by conditional write, insert new), not by an index (SD-20).
- **Redemption (atomic).** Conditional `{tokenHash, status ∈ PENDING|SENT, expiresAt > now} → REDEEMED` **together with** setting `users.passwordHash` in one transaction; replay finds `REDEEMED` → refused (single use).
- **Audit.** `AUTH.INVITATION_REISSUED` on resend/reissue. **Retention.** Retained (not TTL) so redemption history survives; `tokenHash` stays for single-use detection. **Security.** Hash only; ≤ 7 d lifetime; no 2FA, no OTP.
- **References.** `organizationId`; `userId`→users.
- **Embedded documents.** none beyond ActorRef.
- **Snapshots.** `emailAtIssue` snapshots the address the link was sent to.
- **State transitions.** `PENDING→SENT→REDEEMED`; `PENDING|SENT→FAILED`; any non-terminal `→REVOKED` (resend revokes the previous token and issues a new one).
- **Concurrency considerations.** Redemption and resend are conditional writes (`{tokenHash,status,expiresAt}` / previous-invitation revoke) inside one transaction; a replayed redemption finds `REDEEMED` and is refused (single use).

### 11.10 Collection: auditEvents  (C-10)

**Purpose.** The canonical **audit trail** of sensitive actions — who/what/when/where/before/after/why. **Viewable by SuperAdmin only** (AUDIT-007); never exposed to Owners/Managers (CON-01) `[TRD §32]`. Distinct from entity transition history (`history[]`), which is operational. **Scope.** Platform (`organizationId:null`, platform actions), Organization (`outletId:null`) or Outlet. **Lifecycle.** **Insert-only, forever.** **Ownership.** `audit` (`auditService.append(session, event)` is the only writer).
**Standard sets:** none — `occurredAt` (server clock) replaces `createdAt`; **no `updatedAt`**.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `occurredAt` | Date | yes | server now | **no** | Authoritative time |
| `organizationId` | ObjectId | no | null | no | Null for platform-level actions |
| `outletId` | ObjectId | no | null | no | Null for platform/organization-level actions |
| `actor` | `{ type Enum(USER,SUPERADMIN,SYSTEM,AI), id ObjectId?, role?, via Enum(WEB,AI,SYSTEM)?, proposalId? }` | yes | — | no | **Who** `[TRD §32.2]` |
| `action` | String (stable code, §11.10.1) | yes | — | no | **What** |
| `target` | `{ type String, id ObjectId }` | yes | — | no | Affected entity |
| `before` / `after` | Object (redacted, allow-listed per action) | per action | null | no | **Changed fields only** (§18.3). The only `Mixed` fields in the schema `[SD-21]` |
| `reason` | Reason | where required | null | no | INV-16 |
| `source` | `{ channel Enum(WEB,AI,SYSTEM), deviceType?, ipHash? }` | yes | — | no | Never a raw IP |
| `requestId` / `idempotencyKey` | String | yes / no | — | no | Correlation |
| `businessDayId` | ObjectId | no | null | no | Day context |

#### 11.10.1 Audited action codes (stable registry — exactly TRD §32.3)

`AUTH.CREDENTIAL_RESET` · `AUTH.USER_DEACTIVATED` · `AUTH.INVITATION_REISSUED` · `AUTH.SA_LOGIN_FAILED_LOCKOUT` (TN-3) · `RBAC.OVERRIDE_CHANGED` · `STAFF.OUTLET_REASSIGNED` · `MENU.PRICE_CHANGED` · `MENU.AVAILABILITY_CHANGED` · `MENU.IMPORT_APPROVED` · `BILL.DISCOUNT_APPLIED` · `ORDER.CANCELLED` · `ORDER.VOIDED` · `ORDER.HELD` · `ITEM.CANCELLED` · `ITEM.VOIDED` · `ITEM.HELD` · `ITEM.REFIRED` · `KITCHEN.CANCELLED` · `BILL.REOPENED` · `BILL.CANCELLED` · `REFUND.RECORDED` · `PAYMENT.CORRECTED` · `DAY.CLOSED` · `DAY.REOPENED` · `DAY.RECLOSED` · `PLATFORM.RESTAURANT_SUSPENDED` · `PLATFORM.RESTAURANT_DEACTIVATED` · `AI.ACTION_EXECUTED`. The registry is code-resident (TD-AUD-1); additions beyond AUDIT-002 are OD-DB-9 / PB-19. The `action` field is a free string in the schema (registry-validated in code) so adding a code needs no migration `[SD-21]`.

- **Indexes.** `(organizationId, outletId, occurredAt desc)` — org/outlet scoped timeline with cursor pagination `(occurredAt, _id)`; `(organizationId, occurredAt desc)` — organization-wide; `(action, occurredAt desc)` — action filter (platform-wide); `(actor.id, occurredAt desc)` — per-actor; `(target.type, target.id, occurredAt desc)` — per-entity trail. These mirror the SuperAdmin filters of TRD §32.6 (organization, outlet, actor, action, target, date range) and nothing else. (`organizationId`-first rule is relaxed for the platform-wide `action`/`actor`/`target` indexes because the sole reader is the SuperAdmin platform route.)
- **Unique.** none. **Snapshots.** `before`/`after` are themselves immutable snapshots.
- **Concurrency.** Appended **inside the same transaction** as the audited mutation (P11): if the audit insert fails the business action rolls back. **Immutability.** Application: `append` only; model defines no update/delete; hooks on `update*`, `delete*`, `replaceOne`, `findOneAndUpdate/Delete` throw (F9). Database: the application's Atlas user has a custom role with `insert` and `find` **only** on this collection (no `update`, `remove`, `dropCollection`); index creation is performed by the migration task's separate user `[TRD TD-AUD-2]`.
- **Retention.** Indefinite in Phase 1 (OTD-9); never deleted. **Security.** SuperAdmin-only read route (`scope:'platform'` + negative test); redaction allow-lists per action (§18.3) — no password hashes, tokens, link/invitation secrets, API keys, full card data or payment references (last-4 only), model prompts.
- **Embedded documents.** `actor`, `target`, `reason`, `source`, `before`, `after`.
- **State transitions.** none — insert-only; the event records transitions of other entities.

- **Unique constraints.** none — events are never deduplicated; the append is inside the audited transaction, so a retried transaction cannot double-append.
- **References.** `organizationId`→organizations and `outletId`→outlets (both nullable by scope); `actor.userId`→users; `target.{type,id}` is a polymorphic pointer (no `ref`, so deleting or archiving the target never affects the event).

### 11.11 Collection: auditSeals  (C-11)

**Purpose.** Tamper-evidence: an **append-only hash chain** over audit events, kept in a **separate collection** so audit events are never updated `[TRD §32.5]`. **Scope.** Same chain scope as the sealed event: `(organizationId, outletId|'platform')`. **Lifecycle.** Insert-only by the `maintenance:audit-seal` job. **Ownership.** `audit`.
**Standard sets:** TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `scopeKey` | String (`'platform'` \| `'{orgId}'` \| `'{orgId}:{outletId}'`) | yes | — | no | Chain identity `[SD-22]` |
| `organizationId` / `outletId` | ObjectId | no | null | no | Mirror of the event scope |
| `seq` | Int ≥ 1 | yes | — | no | Position in the chain |
| `eventId` | ObjectId→`auditevents` | yes | — | no | Sealed event |
| `prevHash` | String | yes | `''` for seq 1 | no | |
| `hash` | String | yes | — | no | `SHA-256(prevHash ‖ canonical(event))` |

- **Indexes.** **U** `(scopeKey, seq)` — chain integrity (a gap or duplicate is detectable and unique-protected); **U** `(eventId)` — an event is sealed exactly once.
- **Sealer correctness note `[SD-22]`.** `ObjectId` order is not strictly monotonic across processes, so the sealer scans events from a **trailing safety window** behind its last high-water mark and relies on the unique `eventId` index to skip already-sealed events; no event is ever updated to mark it sealed.
- **Audit/Concurrency.** The sealer holds a per-scope lock for efficiency only; the `(scopeKey, seq)` unique index is the arbiter. **Retention.** Indefinite. **Security.** Sealer's DB role is insert/find only on this collection; a verify routine raises a Sentry alert on a gap or hash mismatch. This is tamper-**evidence**, not a compliance claim.
- **References.** `eventId`→auditEvents; `organizationId`/`outletId` mirror the event scope.
- **Embedded documents.** none.
- **Snapshots.** `hash` is a cryptographic snapshot-proof of the sealed event.
- **State transitions.** none — insert-only.

- **Unique constraints.** `(scopeKey, seq)` and `(eventId)` (see Indexes).
### 11.12 Collection: menuCategories  (C-12)

**Purpose.** Category / subcategory tree of the **organization (central) menu** (MENU-001, ORG-002). **Scope.** Organization. **Lifecycle.** Created/edited by Owner/Manager with ACT-MNU-01; soft-deleted (`status: DELETED`), never hard-deleted (order snapshots do not depend on it, but history of the menu does). **Ownership.** `menu`.
**Standard sets:** TEN-O, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `name` | String ≤ 80 | yes | — | yes | |
| `parentId` | ObjectId→`menucategories` | no | null | yes | `null` = top-level; **depth ≤ 2** (category → subcategory; validator) `[SPEC MENU-001]` |
| `sortOrder` | Int | yes | `0` | yes | Display order |
| `taxDefault` | TaxSnapshot | no | null | yes | Category GST default; an item inherits it when its own `taxOverride` is null `[TRD PO-TRD-01 #1 "set per item or category"]` — CONFIG, never used to rebuild a bill |
| `status` / `deletedAt` | Enum(`ACTIVE`,`DELETED`) / Date | yes / no | `ACTIVE` / null | yes (soft delete only) | Soft delete of a configuration entity `[TRD §16.2, C10]`: the boilerplate `DEFAULT.STATUS.DELETED` convention. `INACTIVE` (boilerplate value 2) is deliberately **not** used — no upstream rule gives it meaning. Stored representation per UC-2 |

- **Indexes.** `(organizationId, parentId, status, sortOrder)` — render the tree. **Unique.** none (duplicate names are not prohibited upstream; AI-016 only *flags* duplicates).
- **Audit.** Not audited (not in AUDIT-002). **Concurrency.** `rev` (`409 REV_MISMATCH` on concurrent edit). **Retention.** Soft-deleted (`status: DELETED`), never hard-deleted. **Security.** none sensitive.
- **References.** `organizationId`; `parentId`→menuCategories.
- **Embedded documents.** `taxDefault` (TaxSnapshot shape).
- **State transitions.** none — configuration; `status: DELETED` soft-deletes (history is unaffected).

- **Unique constraints.** none — duplicate names are not prohibited upstream.
- **Snapshots.** none — orders snapshot item data, never category data; renaming or deleting a category cannot alter history.

### 11.13 Collection: menuItems  (C-13)

**Purpose.** Items of the **organization menu**: description, image, price/variants, tax, veg/non-veg, modifier groups, station mapping, preparation time, order-type availability, publish state (MENU-002…008). **Scope.** Organization. **Lifecycle.** `DRAFT` → `PUBLISHED`; soft-deleted (`status: DELETED`), never hard-deleted. This is the **snapshot source** — orders copy from it and never read it again for history. **Ownership.** `menu`.
**Standard sets:** TEN-O, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `categoryId` | ObjectId→`menucategories` | yes | — | yes | |
| `name` | String ≤ 120 | yes | — | yes | |
| `nameNormalized` | String | yes | derived | derived | lower-cased, trimmed, whitespace-collapsed; used **only** for AI-import duplicate detection (AI-016) `[SD-23]` |
| `description` | String ≤ 500 | no | null | yes | MENU-002 |
| `imageFileId` | ObjectId→`uploadedfiles` | no | null | yes | MENU-002 |
| `dietType` | Enum(`VEG`,`NON_VEG`) | yes | — | yes | MENU-002 |
| `basePricePaise` | Paise | iff no variants | null | yes | Central price (**CONFIG**) `[TRD §20.1]`. Exactly one of `basePricePaise` / `variants[≥1]` is set (validator) |
| `variants[]` | `{ variantId ObjectId, name String, basePricePaise Paise, sortOrder Int, isActive Bool }` | no | `[]` | yes | Variants/portion sizes MENU-003; `variantId` is stable (provenance in snapshots) |
| `taxOverride` | TaxSnapshot | no | null | yes | Item GST; null ⇒ inherit `taxDefault` of the category. Effective tax is resolved **at snapshot time** |
| `modifierGroupIds` | [ObjectId→`modifiergroups`] | no | `[]` | yes | MENU-004 |
| `stationId` | ObjectId→`kitchenstations` | no (required **before publish**) | null | yes | MENU-005; activation checklist item 5 (PRD-ONB-033.1) is a publish/activation guard, not schema non-nullability |
| `prepTimeMinutes` | Int ≥ 0 | no | null | yes | MENU-006 |
| `availableFor` | `{ table Bool, takeaway Bool }` | yes | `{true,true}` | yes | Order-type availability MENU-007 (`takeaway` ≡ no table, ORD-004) `[SD-24]` naming |
| `publishState` | Enum(`DRAFT`,`PUBLISHED`) | yes | `DRAFT` | yes | Only `PUBLISHED` is orderable; unapproved AI-import content is never visible (AI-014) `[SPEC MENU-008]` |
| `publishedAt` | Date | no | null | yes | |
| `source` | Enum(`MANUAL`,`AI_IMPORT`) | yes | `MANUAL` | no | Provenance only |
| `importId` | ObjectId→`menuimports` | no | null | no | AI provenance |
| `sortOrder` | Int | yes | `0` | yes | |
| `status` / `deletedAt` | Enum(`ACTIVE`,`DELETED`) / Date | yes / no | `ACTIVE` / null | yes (soft delete only) | Soft delete of a configuration entity `[TRD §16.2, C10]`: the boilerplate `DEFAULT.STATUS.DELETED` convention. `INACTIVE` (boilerplate value 2) is deliberately **not** used — no upstream rule gives it meaning. Stored representation per UC-2 |

- **Indexes.** `(organizationId, categoryId, status, sortOrder)` — category listing; `(organizationId, publishState, status)` — `resolveOutletMenu` load of orderable items; *(No `nameNormalized` index: duplicate detection (AI-016) runs in memory over the organization's items, the same bounded set `resolveOutletMenu` already loads — an index would tax every menu write for a rare review-time check; removed in R1.)* **Unique.** none (duplicate items are *flagged*, never rejected).
- **Snapshots.** Provide the source for `orderItems.snapshot` (§11.27); the order copies, never references for money.
- **Audit.** `MENU.PRICE_CHANGED` (base/variant price, modifier deltas) and `MENU.AVAILABILITY_CHANGED` in the same transaction (MENU-013); publishing is one transaction that bumps `organizations.menuVersion` and appends audit (TRD §20.5).
- **Concurrency.** `rev`; concurrent edits → `409 REV_MISMATCH`. **Retention.** Soft-deleted (`status: DELETED`), never hard-deleted — historical orders remain fully reconstructable from their own snapshots **without** this document. **Security.** none sensitive.
- **Embedded documents.** `variants[]`, `taxOverride`, `availableFor`.
- **State transitions.** `publishState` `DRAFT→PUBLISHED`. *Un*-publishing is not defined upstream; temporary hiding is the availability override (MENU-010) — no reverse transition is built.

- **Unique constraints.** none — duplicate items are *flagged* (AI-016), never rejected.
- **References.** `categoryId`→menucategories; `modifierGroupIds[]`→modifiergroups; `stationId`→kitchenstations; `imageFileId`→uploadedfiles; `importId`→menuimports (provenance only).

### 11.14 Collection: modifierGroups  (C-14)

**Purpose.** Reusable add-on/modifier groups (spice, preparation, dietary, add-on, packaging) `[SPEC MENU-004]`. Free-form customer notes are **not** a group: they live on the order line (`orderItems.notes`). **Scope.** Organization. **Lifecycle.** As menu items. **Ownership.** `menu`.
**Standard sets:** TEN-O, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `name` | String ≤ 80 | yes | — | yes | |
| `kind` | Enum(`SPICE`,`PREPARATION`,`DIETARY`,`ADD_ON`,`PACKAGING`) | yes | — | yes | The five MENU-004 kinds |
| `minSelect` / `maxSelect` | Int ≥ 0 | yes | `0` / `1` | yes | Selection bounds (`min ≤ max`) `[SD-25]` — bounds are structural necessity for validating an order; their values are config |
| `options[]` | `{ optionId ObjectId, name String, priceDeltaPaise Int (signed), isActive Bool, sortOrder Int }` | yes (≥1) | — | yes | Price deltas are CONFIG here; copied into `ModifierSnapshot` at order time |
| `status` / `deletedAt` | Enum(`ACTIVE`,`DELETED`) / Date | yes / no | `ACTIVE` / null | yes (soft delete only) | Soft delete of a configuration entity `[TRD §16.2, C10]`: the boilerplate `DEFAULT.STATUS.DELETED` convention. `INACTIVE` (boilerplate value 2) is deliberately **not** used — no upstream rule gives it meaning. Stored representation per UC-2 |

- **Indexes.** `(organizationId, status)`. **Audit.** Price-delta changes follow `MENU.PRICE_CHANGED`. **Concurrency.** `rev`. **Retention.** Soft-deleted only (`status: DELETED`); never physically removed. **Snapshots.** An option becoming inactive/changed **after** an order is created never alters the order (MENU-016, TRD §20.4).
- **Unique constraints.** none beyond `_id` (duplicates are valid here). Group/option names may repeat.
- **References.** none outgoing (`menuItems.modifierGroupIds[]` reference groups).
- **Embedded documents.** `options[]`.
- **State transitions.** none — configuration; `status: DELETED` soft-deletes.
- **Security considerations.** none sensitive.

### 11.15 Collection: menuOutletOverrides  (C-15)

**Purpose.** Outlet-specific **price** and **availability** overrides of central menu items (MENU-009/010/014) — one document per `(outlet, item)`. **Scope.** Outlet (kept as a separate collection so organization-level menu documents never carry an optional `outletId` — §5.4). **Lifecycle.** Created on first override; edited in place; never deleted (clearing = fields null / state `AVAILABLE`). **Ownership.** `menu`.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `menuItemId` | ObjectId→`menuitems` | yes | — | no | |
| `priceOverridePaise` | Paise | no | null | yes | Item-level override (items without variants) `[SPEC MENU-009]` |
| `variantPrices[]` | `{ variantId ObjectId, priceOverridePaise Paise }` | no | `[]` | yes | "One value per item **and per variant** per outlet" `[TRD §20.2]` |
| `availability.state` | Enum(`AVAILABLE`,`UNAVAILABLE`) | yes | `AVAILABLE` | yes | |
| `availability.scope` | Enum(`PERMANENT`,`BUSINESS_DAY`) | iff `UNAVAILABLE` | null | yes | Permanent (until changed) or **temporary for the current business day** `[SPEC MENU-010/011]` |
| `availability.businessDayId` | ObjectId→`businessdays` | iff `BUSINESS_DAY` | null | yes | The outlet's current day when set. **In force iff equal to the outlet's current active day id** — so it stops at Day Close and never at midnight, with **no scheduled job** `[TRD TD-MENU-1]`. Behaviour across Reopen Day is undefined (AMB-12/PB-14 → OD-DB-11) and isolated in `isOverrideInForce()` |
| `availability.changedAt` / `.changedBy` | Date / ActorRef | no | null | yes | |

- **Indexes.** **U** `(organizationId, outletId, menuItemId)` — one override per item per outlet (and the lead prefix `(org, outlet)` serves the full-outlet load of `resolveOutletMenu`).
- **Audit.** `MENU.PRICE_CHANGED`, `MENU.AVAILABILITY_CHANGED` (MENU-013) with `outletId`; `outlets.overrideVersion` `$inc` in the same transaction. **Concurrency.** `rev`; `409 REV_MISMATCH`. **Retention.** Never deleted; **never** used to reconstruct historical prices (orders hold snapshots). **Security.** none.
- **Unique constraints.** `(organizationId, outletId, menuItemId)` (see Indexes).
- **References.** `menuItemId`→menuItems; `availability.businessDayId`→businessDays.
- **Embedded documents.** `variantPrices[]`, `availability`.
- **State transitions.** `availability.state` `AVAILABLE↔UNAVAILABLE` with scope `PERMANENT` or `BUSINESS_DAY`.
- **Snapshots.** none — configuration; the *effective* price is snapshotted onto `orderItems` when a line is added.

### 11.16 Collection: menuImports  (C-16)

**Purpose.** Header of an **AI Menu Import** draft — isolated from the live menu until the Owner approves and publishes (AI-014) `[TRD §31.4]`. **Scope.** Organization. **Lifecycle.** `UPLOADED→EXTRACTING→READY_FOR_REVIEW→(edits)→APPROVED→PUBLISHED`, or `FAILED` / `DISCARDED`. **Ownership.** `ai-menu-import`.
**Standard sets:** TEN-O, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `uploadedFileId` | ObjectId→`uploadedfiles` | yes | — | no | Source file (private bucket) |
| `sourceType` | Enum(`PDF`,`IMAGE`,`XLSX`,`CSV`) | yes | — | no | AI-010 |
| `status` | Enum(`UPLOADED`,`EXTRACTING`,`READY_FOR_REVIEW`,`APPROVED`,`PUBLISHED`,`FAILED`,`DISCARDED`) | yes | `UPLOADED` | yes | The "(Edited)*" step of TRD §15.11 is a repeatable event (`lastEditedAt`), not a state `[SD-26]` |
| `initiatedBy` | ActorRef | yes | — | no | ACT-AI-01 |
| `enqueuedAt` | Date | no | null | yes | Lost-enqueue reconciliation (`UPLOADED` older than N minutes with no `enqueuedAt`) `[TRD §18.5]` |
| `extractedAt` / `readyForReviewAt` | Date | no | null | yes | |
| `lastEditedAt` | Date | no | null | yes | Owner edit (ACT-AI-07) |
| `candidateCount` / `flaggedCount` | Int ≥ 0 | yes | `0` | yes | Review summary |
| `approvedBy` / `approvedAt` | ActorRef / Date | no | null | set once | **The approval factor** (RBAC-014): publish requires it `[TRD §13.5]` |
| `publishedAt` | Date | no | null | set once | |
| `failureReason` | String ≤ 300 | when failed | null | yes | Extraction failure class (Owner may retry or enter the menu manually, ONB-024) |

- **Indexes.** `(organizationId, status, createdAt desc)` — Owner's import list and reconciler. **Unique.** none.
- **Audit.** `MENU.IMPORT_APPROVED` (AI-015). **Concurrency.** `status` conditional writes; `publishApprovedImport` runs in **one transaction** (insert/update live menu rows, bump `menuVersion`, mark `PUBLISHED`, audit) and is the **sole** writer from an import into the live menu. **Retention.** Retained (history of what was approved); source files lifecycle-expire in S3 after 90 days (not a business record). **Security.** AI output never reaches `menuItems` without the `approvedBy` fact; no AI database access.
- **References.** `uploadedFileId`→uploadedFiles.
- **Embedded documents.** none beyond ActorRef.
- **Snapshots.** none — draft state; the approved result becomes live menu rows only via publish.
- **State transitions.** `UPLOADED→EXTRACTING→READY_FOR_REVIEW→APPROVED→PUBLISHED`; `EXTRACTING→FAILED`; `READY_FOR_REVIEW→DISCARDED` (§10.2).

- **Unique constraints.** none.
### 11.17 Collection: menuImportCandidates  (C-17)

**Purpose.** One row per candidate item extracted from an import, with confidence/duplicate flags; editable by the Owner until approval `[TRD §31.4]`. Kept as a separate collection so a 5 000-row sheet never approaches the 16 MB document limit. **Scope.** Organization. **Lifecycle.** Created by the worker; edited; frozen at `APPROVED`. **Ownership.** `ai-menu-import`.
**Standard sets:** TEN-O, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `importId` | ObjectId→`menuimports` | yes | — | no | |
| `rowRef` | Int ≥ 1 | yes | — | no | Source row/position |
| `proposed` | `{ name, description?, categoryName?, dietType?, basePricePaise?, variants[{name, basePricePaise}], taxRateBps?, stationName? }` | yes | — | yes (until `APPROVED`) | AI-extracted **proposal**, never truth; money as integer paise; unparseable values stay null and raise a flag |
| `flags[]` | `{ field String, code Enum(MISSING_PRICE,MISSING_CATEGORY,PRICE_OUTLIER,UNPARSEABLE_TAX,LOW_CONFIDENCE,DUPLICATE), confidence Int 0–100? }` | no | `[]` | yes | Model confidence **plus** deterministic rules (AI-012); flags never block editing |
| `duplicateOfItemId` | ObjectId→`menuitems` | no | null | no | Deterministic normalized-name+variant match (AI-016), flagged **before** approval |
| `isEdited` / `isRemoved` | Bool | yes | `false` | yes | Owner edits/removes rows (ACT-AI-07) |

- **Indexes.** **U** `(organizationId, importId, rowRef)`; *(The `(organizationId, importId)` prefix of the unique index loads every candidate of an import; a `flags.code` index was removed in R1 — review filtering is in-memory over a bounded draft.)* **Audit.** none (header carries approval). **Concurrency.** Per-row edits are independent writes; approval is the barrier (header `status` conditional write; candidates become read-only). **Retention.** Retained indefinitely in Phase 1 (OTD-9 default); purging discarded/failed drafts is unspecified → OD-DB-12. **Security.** Never written into live menu except through `publishApprovedImport`.
- **Unique constraints.** `(organizationId, importId, rowRef)`.
- **References.** `importId`→menuImports; `duplicateOfItemId`→menuItems.
- **Embedded documents.** `proposed`, `flags[]`.
- **Snapshots.** none — editable draft, frozen when the parent import is `APPROVED`.
- **State transitions.** none — rows become read-only when the parent reaches `APPROVED`.

### 11.18 Collection: uploadedFiles  (C-18)

**Purpose.** Metadata record that binds an S3 object to a tenant, so presign/read endpoints load it under the tenancy guard and a key from another tenant can never be signed `[TRD §34.2–34.3]`. **Scope.** Organization with **nullable** `outletId` (logo and item images are org-level; outlet-specific purposes carry it). **Lifecycle.** `PENDING_VALIDATION→READY|REJECTED`. **Ownership.** `uploads`.
**Standard sets:** TEN-O (+ optional `outletId`), TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `outletId` | ObjectId | no | null | no | Null for organization-level purposes |
| `purpose` | Enum(`LOGO`,`ITEM_IMAGE`,`IMPORT_SOURCE`,`IMPORT_ARTIFACT`) | yes | — | no | The TRD's purposes (`incoming` is a transient S3 prefix, not a purpose) |
| `bucket` | Enum(`PUBLIC`,`PRIVATE`) | yes | — | no | `servena-{env}-public` (CloudFront OAC) / `-private` (presigned only) |
| `objectKey` | String | yes | — | no | `org/{org}/outlet/{outlet|_}/{purpose}/{yyyy}/{mm}/{uuid}.{ext}` — server-generated ids only, **never a user file name** |
| `mimeDeclared` / `mimeDetected` | String | yes / when validated | — | no / yes | Must agree with magic bytes and extension |
| `sizeBytes` | Int ≥ 0 | yes | — | no | |
| `sha256` | String | no | null | yes | Content hash (immutable object naming) |
| `status` | Enum(`PENDING_VALIDATION`,`READY`,`REJECTED`) | yes | `PENDING_VALIDATION` | yes (forward) | |
| `rejectedReason` | String ≤ 200 | when rejected | null | yes | |
| `uploadedBy` | ActorRef | yes | — | no | |
| `objectDeletedAt` | Date | no | null | yes | Set when S3 lifecycle (import sources/artifacts: 90 d) removed the object; the **record stays** |

- **Indexes.** **U** `(objectKey)`; `(organizationId, purpose, createdAt desc)`. **Concurrency.** `status` conditional write from the validate worker. **Retention.** Records retained; S3 objects per lifecycle (`incoming/` 1 d; import files 90 d; public assets retained). **Security.** No SVG; non-executing parsers only; presigned GET ≤ 5 min after an authorize check; never listing.
- **Unique constraints.** `objectKey`.
- **References.** none outgoing (`organizations.logoFileId`, `menuItems.imageFileId`, `menuImports.uploadedFileId` reference it).
- **Embedded documents.** none beyond ActorRef.
- **Snapshots.** none.
- **State transitions.** `PENDING_VALIDATION→READY|REJECTED`.
- **Audit requirements.** none (not in AUDIT-002).

---

### 11.19 Collection: floors  (C-19)

**Purpose.** Grouping of tables within an outlet (floor/zone). The UI renders a **grid of tiles**; no coordinates/geometry is defined upstream, so none is stored (brief §D-07; TABLE-*). **Scope.** Outlet. **Lifecycle.** Created in setup (ACT-TBL-05); soft-deleted (`status: DELETED`), not hard-deleted. **Ownership.** `tables`.
**Standard sets:** TEN-OO, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `name` | String ≤ 60 | yes | — | yes | |
| `sortOrder` | Int | yes | `0` | yes | |
| `status` / `deletedAt` | Enum(`ACTIVE`,`DELETED`) / Date | yes / no | `ACTIVE` / null | yes (soft delete only) | Soft delete of a configuration entity `[TRD §16.2, C10]`: the boilerplate `DEFAULT.STATUS.DELETED` convention. `INACTIVE` (boilerplate value 2) is deliberately **not** used — no upstream rule gives it meaning. Stored representation per UC-2 |

- **Indexes.** `(organizationId, outletId, status, sortOrder)`. **Unique.** none. **Audit.** none. **Retention.** Soft-deleted only (`status: DELETED`); never physically removed. **Concurrency.** none beyond last-write (config, low contention).
- **References.** `organizationId`, `outletId`.
- **Embedded documents.** none.
- **Snapshots.** none.
- **State transitions.** none — configuration; `status: DELETED` soft-deletes.
- **Security considerations.** none sensitive.

- **Unique constraints.** none.
### 11.20 Collection: tables  (C-20)

**Purpose.** A table: label, state, current session pointer, table QR key. **Scope.** Outlet. **Lifecycle.** Created in setup; state changes only through the matrix transitions (TRD §21.2); soft-deleted (`status: DELETED`), not hard-deleted. **Ownership.** `tables`.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `floorId` | ObjectId→`floors` | yes | — | yes | |
| `label` | String ≤ 20 | yes | — | yes | Table number/name shown on KOT, KDS, bills `[SPEC KOT-004]` |
| `sortOrder` | Int | yes | `0` | yes | |
| `state` | Enum(`AVAILABLE`,`OCCUPIED`,`BILLING`,`CLEANING`,`RESERVED`) | yes | `AVAILABLE` | yes (matrix only) | **Derived-then-stored**: changed only inside the transaction that changes the session/order/bill, so it cannot drift `[TRD §21.2]` |
| `stateChangedAt` | Date | yes | now | yes | |
| `currentSessionId` | ObjectId→`tablesessions` | no | null | yes | The `ACTIVE` session, if any |
| `qrKey` | String (128-bit base64url) | yes | generated | rotate | Opaque, never a sequence or table number; public identifier, stored in clear `[SD-14]`. Rotation invalidates the old key `[TRD TD-TBL-3]` |
| `qrKeyRotatedAt` | Date | no | null | rotate | |
| `status` / `deletedAt` | Enum(`ACTIVE`,`DELETED`) / Date | yes / no | `ACTIVE` / null | yes (soft delete only) | Soft delete of a configuration entity `[TRD §16.2, C10]`: the boilerplate `DEFAULT.STATUS.DELETED` convention. `INACTIVE` (boilerplate value 2) is deliberately **not** used — no upstream rule gives it meaning. Stored representation per UC-2 |

- **Indexes.** **No unique index on `label`** `[OPEN DECISION OD-DB-26]`: upstream says a table has a number/name but never states the **scope of uniqueness** (outlet-wide vs per floor vs none); the earlier draft's outlet-wide unique (SD-27) would **reject legitimate data** such as "Table 1" on two floors, and invented a business rule — withdrawn in R1. Tables are identified by `_id` everywhere (KOT lines snapshot the label; orders carry `tableId`), so a duplicate label is a presentation ambiguity, not a data-integrity risk. **U** `(qrKey)` — public QR → outlet+table resolution with no tenant context (§5.3); `(organizationId, outletId, floorId, state)` — table grid load (its `(organizationId, outletId)` prefix serves "all tables of an outlet") and floor/state filters.
- **State transitions.** TRD §21.2 matrix T1–T10 (everything else `409 STATE_INVALID`). **Audit.** none (operational). **Concurrency.** `rev` conditional writes on each table inside the session/order transaction; multi-table operations take ordered Redis locks as contention reducers only. **Retention.** Soft-deleted (`status: DELETED`); historical orders reference `tableId` and carry a label snapshot on KOTs. **Security.** `qrKey` rotation is the QR-revocation mechanism.
- **References.** `floorId`→floors; `currentSessionId`→tableSessions.
- **Embedded documents.** none.
- **Snapshots.** none (KOTs snapshot the label at issue).

- **Unique constraints.** `qrKey` only (see Indexes). Label uniqueness is **not** enforced — OD-DB-26.
### 11.21 Collection: tableSessions  (C-21)

**Purpose.** One occupancy of a table. **At most one `ACTIVE` session per table** (TABLE-014). Holds the *current* table association and an **append-only association history** (TABLE-017). **Scope.** Outlet. **Lifecycle.** `ACTIVE→CLOSED` (Clear table closes it). **Ownership.** `tables`.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `tableId` | ObjectId→`tables` | yes | — | yes (transfer re-points) | **Current** table |
| `status` | Enum(`ACTIVE`,`CLOSED`) | yes | `ACTIVE` | yes | |
| `openedAt` / `openedBy` | Date / ActorRef | yes | now | no | |
| `closedAt` / `closedBy` | Date / ActorRef | no | null | set once | |
| `activeOrderId` | ObjectId→`orders` | no | null | yes | The single active order context (TABLE-015 = ORD-091). **After a merge several order contexts may coexist** (CON-03); which order receives new items is PB-13 → OD-DB-13, so this field stays a *pointer*, not a rule |
| `tableHistory[]` | `{ tableId, tableLabel, fromTableId?, fromTableLabel?, at, opId?, actor }` | yes | `[initial]` | `$push` only | Append-only association history `[TRD §21.1]` |

- **Indexes.** **U P{status:'ACTIVE'}** `(organizationId, outletId, tableId)` — **one active session per table** (also makes a transfer to an occupied table fail with a duplicate-key error); `(organizationId, outletId, status)` — active sessions of an outlet. 
- **Concurrency.** Open table: duplicate-key on the partial unique index is converted into "return the existing `ACTIVE` session" (idempotent open). Active-order lookup + creation occur inside one transaction on this document (`rev`). **Audit.** none (operational events in `tableOperationEvents`). **Retention.** Retained (history). **Security.** none.
- **References.** `tableId`→tables; `activeOrderId`→orders.
- **Embedded documents.** `tableHistory[]`.
- **Snapshots.** `tableHistory[]` is the preserved historical association.
- **State transitions.** `ACTIVE→CLOSED`.

- **Unique constraints.** partial unique one `ACTIVE` session per table (see Indexes).
### 11.22 Collection: tableOperationEvents  (C-22)

**Purpose.** Append-only record of **transfer, merge, split and move-items** (TABLE-016) — the auditable operational events. They never rewrite orders or bills; they record the change of *current* association `[TRD §21.4]`. **Scope.** Outlet. **Lifecycle.** Insert-only. **Ownership.** `tables`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `type` | Enum(`TRANSFER`,`MERGE`,`SPLIT`,`MOVE_ITEMS`) | yes | — | no | |
| `actor` | ActorRef | yes | — | no | |
| `businessDayId` | ObjectId | yes | — | no | Day fence stamp; counts as a DAY-025 transaction |
| `fromTableIds` / `toTableIds` | [ObjectId→`tables`] | yes | `[]` | no | |
| `sessionIds` / `orderIds` | [ObjectId] | yes | `[]` | no | Affected sessions/orders |
| `movedItems[]` | `{ orderItemId, fromOrderId, toOrderId?, originTableId }` | no | `[]` | no | Preserves where moved items were ordered `[SPEC TABLE-018]` |
| `reason` | Reason | no | null | no | Optional |
| `idempotencyKey` | String | yes | — | no | |

> **PB-13 (AMB-09).** Whether MERGE/SPLIT/MOVE_ITEMS change order/bill and which order receives new items is **undecided**. This collection stores the *envelope* (who, when, which tables/sessions/orders/items) and **no semantic result**; AF-020/021 are not buildable until PB-13 is decided. TRANSFER is fully defined.

- **Indexes.** **U** `(organizationId, outletId, idempotencyKey)`; `(organizationId, outletId, createdAt desc)`; `(organizationId, outletId, orderIds)` multikey — "history of this order's table operations". **Audit.** The record is itself the operational audit (TABLE-016); not in AUDIT-002 → OD-DB-9. **Concurrency.** Inserted in the same transaction as the multi-aggregate writes. **Retention.** Indefinite. **Security.** none.
- **Unique constraints.** `(organizationId, outletId, idempotencyKey)`.
- **References.** `fromTableIds`/`toTableIds`→tables; `sessionIds`→tableSessions; `orderIds`→orders; `movedItems[].orderItemId`→orderItems.
- **Embedded documents.** `movedItems[]`.
- **Snapshots.** The event is itself the historical record of the operation.
- **State transitions.** none — insert-only.

### 11.23 Collection: customerDrafts  (C-23)

**Purpose.** A **customer's server-persisted cart** keyed by a client-generated `draftKey`, created on the first item added; kept so an abandoned Draft stays identifiable in history, but **never offered back** to a customer (ORD-064, ORD-094) `[TRD TD-ORD-4]`. **Scope.** Outlet. **Lifecycle.** Open → `abandonedAt` (inactivity) **or** `submittedOrderId` (becomes an order). **Ownership.** `customer-ordering`. *Staff* Drafts are different: they are `orders` with `stage:'DRAFT'` (§11.25) — SD-8.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `draftKey` | String (UUID) | yes | — | no | Lives only in the page that created it |
| `source` | Enum(`TABLE_QR`,`TABLELESS_QR`,`WEBSITE`) | yes | — | no | WhatsApp carts are transient Redis state, not drafts (TRD §14 #27) |
| `tableId` | ObjectId→`tables` | no | null | no | Set for table QR |
| `lines[]` (≤ 50) | `{ menuItemId, variantId?, modifierOptionIds[], qty Int ≥1, notes String ≤1000 }` | yes | `[]` | yes | **Selections only** — no price/tax snapshot: money is resolved and snapshotted at submit (TD-MENU-2) |
| `clientSeq` | Int | yes | `0` | yes | Ordering of idempotent `PUT` upserts |
| `lastActivityAt` | Date | yes | now | yes | |
| `isOpen` | Bool | yes | `true` | yes | `false` once abandoned or submitted (derived marker enabling a robust partial index) `[SD-28]` |
| `abandonedAt` | Date | no | null | set once | Set by `draft-sweep` after `DRAFT_INACTIVITY_MIN` (30 min); keeps the Draft, creates no KOT/sale |
| `submittedOrderId` | ObjectId→`orders` | no | null | set once | |

- **Indexes.** **U** `(organizationId, outletId, draftKey)` — idempotent upsert; **P{isOpen:true}** `(organizationId, outletId, lastActivityAt)` — the abandonment sweep only scans open drafts.
- **Access rule (ORD-094).** There is **no read path** that returns a draft to a customer; only the sweep and staff history reads touch it. A new scan creates a new draft.
- **Audit.** none. **Concurrency.** `clientSeq`-ordered upserts; `rev`. **Retention.** Retained (INV-04; archival OTD-9); growth bounded by creation rate limits. **Security.** Contains no PII (no name/phone until submit).
- **Unique constraints.** `(organizationId, outletId, draftKey)`.
- **References.** `tableId`→tables; `submittedOrderId`→orders.
- **Embedded documents.** `lines[]` (selections).
- **Snapshots.** none — selections only; money is snapshotted at submit.
- **State transitions.** `isOpen` `true→false` (abandoned or submitted) — one-way.

### 11.24 Collection: occupancyClaims  (C-24)

**Purpose.** A Draft's **claim** on a table, separate from the Draft so releasing it never deletes the Draft `[SPEC TABLE-007, TRD §21.6]`. **Scope.** Outlet. **Lifecycle.** Created when a table-associated Draft claims occupancy → `releasedAt` set (abandonment or conversion to an order). **Ownership.** `tables`.
**Standard sets:** TEN-OO, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `tableId` | ObjectId→`tables` | yes | — | no | |
| `draftId` / `orderId` | ObjectId | one of | null | no | Staff Draft order or customer draft |
| `isActive` | Bool | yes | `true` | yes (→false once) | Derived marker for the partial index `[SD-28]` |
| `claimedAt` / `releasedAt` | Date | yes / no | now / null | set once | |
| `releaseReason` | Enum(`ABANDONED`,`CONVERTED`) | when released | null | set once | `[SD-29]` |

- **Indexes.** **P{isActive:true}** `(organizationId, outletId, tableId)` — non-unique (concurrent pending submissions from one table are not prohibited; AMB-04/PB-11 → OD-DB-14). **Audit.** none. **Concurrency.** Released by `draft-sweep` or in the commit transaction. **Retention.** Retained. **Security.** none.
- **References.** `tableId`→tables; `draftId`→customerDrafts; `orderId`→orders.
- **Embedded documents.** none.
- **Snapshots.** none.
- **State transitions.** `isActive` `true→false` (one-way, with `releaseReason`).

- **Unique constraints.** none — non-unique by design (PB-11).
### 11.25 Collection: orders  (C-25)

**Purpose.** The **order aggregate**: source/channel, table context (current + history), customer reference, lifecycle `stage`, hold, rejection, history. **The order is the billing ownership boundary** (TABLE-018, BILL-015). One engine for every channel (ORD-001). **Scope.** Outlet. **Lifecycle.** Staff Draft → commit, or created at `AWAITING_ACCEPTANCE` by a customer submission; terminal at `COMPLETED`, `CANCELLED` or `REJECTED`†. Never deleted. **Ownership.** `order-engine`.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `orderSeq` | Int ≥ 1 | no (null while staff `DRAFT`) | null | set once | Per-outlet **per-business-day** sequence allocated from `businessDays.counters.orderSeq` inside the creating transaction; **this is the displayed order number** (KOT-004) `[TRD TD-ORD-2]`. Assigned at commit/submit, so a staff Draft has none |
| `businessDayId` | ObjectId→`businessdays` | no (null while staff `DRAFT`) | null | set once | Day active when the order became a DAY-025 transaction (day fence stamp). **Not** midnight-derived |
| `source` | Enum(`STAFF`,`TABLE_QR`,`TABLELESS_QR`,`WEBSITE`,`WHATSAPP`,`REORDER`) | yes | — | no | Channel `[TRD §22.1]`. **Order type is not stored**: `isTakeaway ≡ (tableId == null)` is a derived virtual computed in one place (INV-14) |
| `stage` | Enum(`DRAFT`,`AWAITING_ACCEPTANCE`,`CONFIRMED`,`KOT_SENT`,`PREPARING`,`READY`,`SERVED`,`PICKED_UP`,`COMPLETED`,`CANCELLED`,`REJECTED`†) | yes | `DRAFT` | yes (machine only) | **Derived from item states** by `deriveOrderStage`, written in every item-changing transaction; distinct from item `state` (§10) `[TRD §15.1]`. The `awaitingAcceptance` attribute that TRD §15.1 lists as a stored attribute is stored as its own field (next row) `[TRD §15.1]` |
| `awaitingAcceptance` | Bool | yes | `false` | yes (machine only, **only together with `stage`**) | TRD §15.1 lists `stage` and an `awaitingAcceptance` flag as separate stored attributes `[TRD §15.1]`. Redundant by design: the invariant `awaitingAcceptance ⇔ (stage = AWAITING_ACCEPTANCE)` is written **in the same conditional write** that writes `stage` (never independently), so the two can never disagree. A validator on the transition function rejects any write that breaks the invariant. It is a read-optimisation/contract attribute, **not** a second state machine (UC-4 resolved by alignment) |
| `tableId` | ObjectId→`tables` | no | null | yes (transfer) | **Current** table; null = Takeaway |
| `tableSessionId` | ObjectId→`tablesessions` | no | null | yes | Current session |
| `tableAssociations[]` | `{ tableId, tableLabel, sessionId, fromTableId?, fromTableLabel?, at, opId?, actor }` | yes if ever table-associated | `[]` | `$push` only | **Append-only association history** so historical table ownership is never rewritten `[SPEC TABLE-017]`; `tableLabel`/`fromTableLabel` snapshot the label at that moment so a rename or delete never changes history `[SD-48]` |
| `customerId` | ObjectId→`customers` | no | null | no | Set for tableless QR / website / WhatsApp / staff-captured name+phone; **null for table-QR** orders (no details step, ORD-021) |
| `customerContact` | `{ name String, phone String(E.164) }` | no | null | no | `[PII]` **snapshot of what the customer entered** for this order (customer record may later change) |
| `createdBy` | ActorRef | yes | — | no | Staff user, or `CUSTOMER` principal; **attribution of the order stays with the creator** (STAFF-013) |
| `idempotencyOperation` / `idempotencyKey` / `requestHash` | Enum(`ORDER_SUBMIT`) / String / String | yes (key) | `ORDER_SUBMIT` | no | **Durable layer** of order-submit idempotency (ORD-006) `[TRD §19.2]` — §12 |
| `draftId` | ObjectId→`customerdrafts` | no | null | no | Customer draft this order came from |
| `reorderOfOrderId` | ObjectId→`orders` | no | null | no | One-tap reorder source (read-only reference, never modifies it — CUSTOMER-019) |
| `submittedAt` / `confirmedAt` | Date | no | null | set once | |
| `acceptedBy` | ActorRef | no | null | set once | ACT-ACC-01 (never Kitchen, INV-13) |
| `rejection` | `{ reason Reason, by ActorRef, at Date }` | no | null | set once | `REJECTED`†: reason mandatory (ORD-008, INV-16). Name/reporting class undecided (PB-4 → OD-DB-4) |
| `completedAt` / `cancelledAt` | Date | no | null | set once | |
| `abandonedAt` | Date | no | null | set once | Staff Drafts only (`draft-sweep`); keeps the Draft (ORD-064) |
| `hold` | `{ isActive Bool, since?, by ActorRef?, reason Reason? }` | no | `{false}` | yes | Order-level hold (ACT-MOD-06) — a **flag**, no new state `[TRD §15.2]`. **Release authority and KDS/readiness effect are undefined (PB-5 → OD-DB-15a, open and non-financial)**; the flag is storable, release is not built |
| `nextLineNo` | Int ≥ 1 | yes | `1` | `$inc` only | Per-order line counter feeding `orderItems.lineNo` `[SD-31]` |
| `history[]` | HistoryEntry | yes | `[]` | `$push` only | Transition history (M3) |

- **Indexes.**
  - **U P{idempotencyKey: {$type:'string'}}** `(organizationId, outletId, idempotencyOperation, idempotencyKey)` — durable duplicate-submission guard (§12).
  - **U P{orderSeq: {$type:'number'}}** `(organizationId, outletId, businessDayId, orderSeq)` — human number unique per outlet-day.
  - `(organizationId, outletId, stage, createdAt)` — active-orders list, **awaiting-acceptance queue**, handoff lists.
  - `(organizationId, outletId, tableSessionId, stage)` and `(organizationId, outletId, tableId, stage)` — orders of a session/table.
  - `(organizationId, outletId, businessDayId, stage)` — Day Close warnings (orders not terminal) and day reports.
  - `(organizationId, customerId, createdAt desc)` partial `{customerId: {$type:'objectId'}}` — customer history (outlet filter applied by S4 on the result; visibility never widens, S9).
  - `(organizationId, outletId, createdAt desc)` — outlet order history/bills lists (SCR-026/031).
- **Unique constraints.** The two above. **No** unique on `tableId`; many orders per table over time and, after merge, several concurrently (CON-03).
- **References.** `tableId`, `tableSessionId`, `customerId`, `draftId`, `reorderOfOrderId`. **Embedded documents.** `customerContact`, `rejection`, `hold`, `tableAssociations[]`, `history[]`. **Snapshots.** `customerContact`; line money lives on `orderItems`.
- **State transitions.** §10.2 *Order* row; M2 conditional write on `{stage: from, rev}`. `deriveOrderStage` mixed-state rule `TD-ORD-1` (least-advanced non-cancelled item) is provisional (PB-3 → OD-DB-16); the Completed-order add-items branch is not built.
- **Audit.** `ORDER.CANCELLED`, `ORDER.VOIDED`, `ORDER.HELD` (AUDIT-002). Accept/reject/handoff are **history entries**, not audit events (TRD §32.1). **Concurrency.** `rev` on every transition and edit; creation is idempotent via the unique key; two staff accepting the same customer order → one conditional write wins, the other gets `ALREADY_IN_STATE`; additive operations (add items) do not need `rev` (transaction + unique batch key) — §14. **Retention.** Never deleted; abandoned Drafts retained (OTD-9). **Security.** `customerContact` PII masked in logs/events; customer-safe projection (§18.4) excludes `createdBy`, `history[].actor`, `hold`, internal notes.

### 11.26 Collection: orderBatches  (C-26)

**Purpose.** An **additional-items submission** to an *existing* order — the idempotency anchor for "add items" and the container for **customer table-QR additions awaiting staff acceptance** (independent pending add-batches, each accepted or rejected on its own) `[TRD §19.2, §21.6, SPEC ORD-080/ORD-008]`. **Scope.** Outlet. **Lifecycle.** Staff additions are inserted `COMMITTED` and their items materialize in the same transaction; customer additions start `AWAITING_ACCEPTANCE`. **Ownership.** `order-engine`.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `orderId` | ObjectId→`orders` | yes | — | no | |
| `source` | Enum (same as `orders.source`) | yes | — | no | |
| `status` | Enum(`AWAITING_ACCEPTANCE`,`COMMITTED`,`REJECTED`) | yes | — | yes (once) | Customer pending → committed/rejected; staff → `COMMITTED` immediately |
| `lines[]` | `{ lineRef String, menuItemId, snapshot ItemSnapshot, qty, lineTotalPaise Paise, notes }` | yes (≥1) | — | no | **Snapshots taken at submit** (TD-MENU-2). Materialized into `orderItems` (same `snapshot`) on commit; bounded ≤ 50 |
| `materializedItemIds` | [ObjectId→`orderitems`] | no | `[]` | set once | |
| `submittedBy` | ActorRef | yes | — | no | |
| `acceptedBy` / `acceptedAt` | ActorRef / Date | no | null | set once | ACT-ACC-01 |
| `rejection` | `{ reason Reason, by ActorRef, at Date }` | no | null | set once | ACT-ACC-02, reason mandatory |
| `businessDayId` | ObjectId | no (stamped at submit) | null | set once | Fence stamp |
| `idempotencyKey` / `requestHash` | String | yes / yes | — | no | |

- **Indexes.** **U** `(organizationId, outletId, orderId, idempotencyKey)` — **unique added-items batch key** `[TRD §19.2]`; `(organizationId, outletId, status, createdAt)` partial `{status:'AWAITING_ACCEPTANCE'}` — pending add-batch queue.
- **State transitions.** `AWAITING_ACCEPTANCE→COMMITTED|REJECTED`; while the outlet is Closed acceptance/rejection is refused and the batch stays pending (ORG-033). Whether a table-QR addition can be accepted when **no session exists** is PB-11 → OD-DB-14 (the batch stores nothing that decides it).
- **Audit.** none for the batch; resulting item cancellations/holds audited on the item. **Concurrency.** Unique key dedupes retries; commit materializes items + **bill recompute + additional KOT** in one transaction (§15). **Retention.** Retained. **Security.** none beyond tenancy.
- **References.** `orderId`→orders; `materializedItemIds`→orderItems.
- **Embedded documents.** `lines[]` (each with an ItemSnapshot), `rejection`.

- **Unique constraints.** `(organizationId, outletId, orderId, idempotencyKey)`.
### 11.27 Collection: orderItems  (C-27)

**Purpose.** One **order line** with its own state machine, its **immutable price/tax snapshot**, modifiers, notes, hold and history. Items are authoritative; the order `stage` is derived from them (ORD-070). **Scope.** Outlet. **Lifecycle.** `PENDING→SENT→PREPARING→READY→SERVED|PICKED_UP`, or `CANCELLED`. Never deleted. **Ownership.** `order-engine` (kitchen transitions through its service).
**Standard sets:** TEN-OO, REV, TS.

#### ItemSnapshot (embedded; **immutable after creation**; `immutable:true` on the subtree)  `[TRD §20.4]`

| Field | Type | Required | Description |
|---|---|---|---|
| `menuItemId` | ObjectId | yes | **Provenance only** — never used to recompute money |
| `variantId` | ObjectId | no | Provenance only |
| `name` / `variantName` | String / String | yes / no | Identity snapshot |
| `dietType` | Enum(`VEG`,`NON_VEG`) | yes | |
| `unitPricePaise` | Paise | yes | Resolved **at that moment, after outlet override**, excluding modifier deltas |
| `modifiers[]` | ModifierSnapshot | no | Names and `priceDeltaPaise` copied |
| `tax` | TaxSnapshot | yes | **Tax configuration applied**: rate in bps + component names (CGST/SGST) |
| `stationId` / `prepTimeMinutes` | ObjectId / Int | no | Routing/KDS metadata at that moment |
| `menuVersion` / `overrideVersion` | Int | yes | Provenance: versions in force when the line was added |

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `orderId` | ObjectId→`orders` | yes | — | no | |
| `batchId` | ObjectId→`orderbatches` | no | null | no | Null for the initial submission's lines |
| `lineNo` | Int ≥ 1 | yes | from `orders.nextLineNo` | no | Stable line number within the order |
| `state` | Enum(`PENDING`,`SENT`,`PREPARING`,`READY`,`SERVED`,`PICKED_UP`,`CANCELLED`) | yes | `PENDING` | yes (machine only) | §10 |
| `snapshot` | ItemSnapshot | yes | — | **no** | Never recomputed or rewritten by menu, price, tax or modifier changes (MENU-016/017) |
| `qty` | Int ≥ 1 | yes | — | **only while `PENDING`** | After a KOT, an edit is *cancellation + addition*, never an in-place rewrite (ORD-086/090) |
| `lineTotalPaise` | Paise | yes | derived | with `qty` while `PENDING` | `qty × (unitPricePaise + Σ modifier deltas)` (LIVE-DERIVED until the KOT, then frozen) |
| `notes` | String ≤ 1000 | no | null | yes while `PENDING` | Customer/kitchen free text (output-encoded on read) |
| `priority` | Enum(`NORMAL`,`HIGH`,`URGENT`) | yes | `NORMAL` | yes (ACT-KDS-03: Kitchen, Manager) | **Manual only** — no AI (KDS-005, AI-044). Stored per item; the order's displayed priority is the maximum of its items `[SD-32]` (the TRD says "item/order attribute") |
| `hold` | `{ isActive, since?, by ActorRef?, reason Reason? }` | no | `{false}` | yes | Item hold (ACT-MOD-03) — flag, not a state; release undefined (PB-5 → OD-DB-15a, open and non-financial) |
| `originOrderId` / `originTableId` / `movedByOpId` | ObjectId | no | null | set once | Set **only** by move-items (preserves historical origin, TABLE-018); semantics PB-13 → OD-DB-13 |
| `sentAt` / `preparingAt` / `readyAt` / `handoffAt` / `cancelledAt` | Date | no | null | set once each | Denormalized event times for KDS timers and the kitchen-slowdown signal (median Confirmed→Ready) `[SD-10]`; the authoritative record is `history[]` |
| `handoffBy` | ActorRef | no | null | set once | Served/Picked-Up actor |
| `cancellationRecordId` | ObjectId→`cancellationrecords` | no | null | set once | |
| `businessDayId` | ObjectId | yes | stamped | no | Day active when the line was added (additions after a Day Close belong to the new day) |
| `history[]` | HistoryEntry | yes | `[]` | `$push` only | Transition + hold history (M3) |

- **Indexes.**
  - `(organizationId, outletId, state, priority, createdAt)` — **KDS queue** (whole-outlet queue, ≤ 200 active items) and handoff/ready lists.
  - **U** `(organizationId, outletId, orderId, lineNo)` — stable line numbering; also the order-detail load `(org, outlet, orderId)` prefix.
  - `(organizationId, orderId, state)` — `deriveOrderStage` roll-up inside transactions.
  - `(organizationId, outletId, businessDayId, state)` — Day Close warnings (items Pending/Sent/Preparing/Ready) and day analytics.
- **Unique constraints.** `(orderId, lineNo)` only; **no** uniqueness on `menuItemId` (an order may contain the same item many times).
- **Snapshots.** `snapshot` — class 2, immutable; reports, bills, reorder-selection read it; **reorder re-resolves the *current* menu** for the new order (CUSTOMER-017/019).
- **State transitions.** §10.2 *Order item* row; conditional write `{state: from, rev}`; `Preparing`/`Ready` writes by two Kitchen users → one wins, the other converges (`ALREADY_IN_STATE`). `SERVED/PICKED_UP→*` forbidden.
- **Audit.** `ITEM.CANCELLED`, `ITEM.VOIDED`, `ITEM.HELD`, `ITEM.REFIRED`, `KITCHEN.CANCELLED` (AUDIT-002, KDS-014). **Concurrency.** Per-item `rev` (this is why items are a separate collection, §4.2); handoff transaction also resolves an `OPEN` cancellation request on the item to `NO_OP` (ORD-093). **Retention.** Never deleted. **Security.** `notes` is free text — length-bounded, output-encoded; never rendered as HTML.
- **References.** `orderId`→orders; `batchId`→orderBatches; `originOrderId`/`originTableId`/`movedByOpId`; `cancellationRecordId`→cancellationRecords; `snapshot.menuItemId`/`variantId`/`stationId` are provenance only.

- **Embedded documents.** `snapshot` (ItemSnapshot), `hold`, `handoffBy`, `history[]`.
### 11.28 Collection: cancellationRecords  (C-28)

**Purpose.** Append-only **record of every cancellation or void** (item or order, any actor, any state): who, why, when, what the state was and became `[SPEC ORD-082/088/089/092, TRD §22.7]`. Issued KOTs are never erased — a Sent item's cancellation also creates a cancellation KOT (ORD-090). **Scope.** Outlet. **Lifecycle.** Insert-only. **Ownership.** `order-engine`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `target` | `{ type Enum(ORDER,ITEM), id ObjectId }` | yes | — | no | |
| `orderId` | ObjectId→`orders` | yes | — | no | |
| `kind` | Enum(`CANCEL`,`VOID`,`KITCHEN`,`REQUEST_ACCEPTED`) | yes | — | no | `VOID` is a cancellation with `kind=VOID` (TRD §15.2); there is no void *state* |
| `actor` | ActorRef | yes | — | no | |
| `reason` | Reason | yes | — | no | **Reason is mandatory in every case** (ORD-089): `reason.code` required, validated against the reason catalogue (TD-ORD-5) |
| `previousState` / `resultingState` | String | yes | — | no | Target state before/after |
| `cancellationKotId` | ObjectId→`kots` | no | null | no | Set when a cancellation KOT was issued |
| `cancellationRequestId` | ObjectId→`cancellationrequests` | no | null | no | Set for `REQUEST_ACCEPTED` |
| `businessDayId` | ObjectId | yes | — | no | |
| `requestId` | String | yes | — | no | |

- **Indexes.** **U** `(organizationId, outletId, target.type, target.id)` — each target is cancelled **at most once** (a cancelled item/order is terminal); `(organizationId, outletId, orderId, createdAt)` — order timeline; `(organizationId, outletId, businessDayId, kind)` — cancellation analytics (reasons reach Owners through analytics, not the audit trail, CON-01).
- **Audit.** Same transaction as the matching `ORDER.*`/`ITEM.*`/`KITCHEN.CANCELLED` audit event. **Concurrency.** Inserted in the item/order cancellation transaction (billing recompute transactional via `order.item.cancelled`). **Retention.** Indefinite. **Security.** none.
- **Unique constraints.** `(organizationId, outletId, target.type, target.id)`.
- **References.** `orderId`→orders; `cancellationKotId`→kots; `cancellationRequestId`→cancellationRequests; `target.id`→orders|orderItems.
- **Embedded documents.** `target`, `reason`, `actor`.
- **Snapshots.** `previousState`/`resultingState` snapshot the target's states.
- **State transitions.** none — insert-only.

### 11.29 Collection: cancellationRequests  (C-29)

**Purpose.** A **non-kitchen user's request** to cancel an item already `PREPARING`/`READY`; the Kitchen accepts or declines. It **never auto-cancels** (INV-17). Rejected, stale and no-op requests **remain** as records `[SPEC ORD-093, TRD §15.4]`. **Scope.** Outlet. **Lifecycle.** `OPEN→ACCEPTED|DECLINED|NO_OP`. **Ownership.** `kitchen`.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `orderId` / `orderItemId` | ObjectId | yes | — | no | **Target** |
| `status` | Enum(`OPEN`,`ACCEPTED`,`DECLINED`,`NO_OP`) | yes | `OPEN` | yes (once) | |
| `itemStateAtRequest` | Enum(`PREPARING`,`READY`) | yes | — | no | Guard at creation |
| `requestedBy` | ActorRef | yes | — | no | **Requester** (ACT-CAN-06) |
| `requestedAt` | Date | yes | now | no | |
| `reason` | Reason | yes | — | no | Mandatory (ORD-089) |
| `resolvedBy` | ActorRef | no | null | set once | **Decision actor** (Kitchen, ACT-CAN-07); `SYSTEM` for `NO_OP` |
| `resolvedAt` | Date | no | null | set once | **Decision timestamp** |
| `declineReason` | Reason | no | null | set once | Optional: whether a decline needs a reason is not defined upstream → OD-DB-17 |
| `staleAttentionItemId` | ObjectId→`attentionitems` | no | null | set once | One Attention item per stale request (idempotent on request id) `[TRD §23.6]` |
| `businessDayId` | ObjectId | yes | — | no | |

- **Indexes.** **U P{status:'OPEN'}** `(organizationId, outletId, orderItemId)` — **at most one `OPEN` request per item** `[TRD §15.4]`; `(organizationId, outletId, status, requestedAt)` — kitchen list and the stale sweep (`OPEN` older than `CANCEL_REQUEST_STALE_MIN` = 5 min).
- **State transitions.** `ACCEPTED` is a conditional write that **also** transitions the item to `CANCELLED` in the same transaction (and inserts the cancellation record + cancellation KOT); `NO_OP` is set **by the handoff transaction** (Served/Picked Up wins). **Audit.** Accepted ⇒ `ITEM.CANCELLED`; the request records themselves are the auditable operational trail for declined/stale. **Concurrency.** Partial unique + conditional write on `{status:'OPEN', rev}`. **Retention.** Indefinite. **Security.** none.
- **References.** `orderId`→orders; `orderItemId`→orderItems; `staleAttentionItemId`→attentionItems.
- **Embedded documents.** `reason`, `declineReason`, ActorRefs.
- **Snapshots.** `itemStateAtRequest` snapshots the item state when requested.

- **Unique constraints.** partial unique: one `OPEN` request per item.
### 11.30 Collection: kitchenStations  (C-30)

**Purpose.** **Routing metadata inside the outlet's single kitchen** (ORG-005, KDS-002, ONB-027). Stations are **not an authorization boundary** (TD-KDS-3): every Kitchen user sees the whole outlet queue. There is **no kitchen collection** — the outlet is the kitchen. **Scope.** Outlet. **Lifecycle.** Created in setup; soft-deleted (`status: DELETED`), never hard-deleted (KOT lines reference `stationId`). **Ownership.** `kitchen`.
**Standard sets:** TEN-OO, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `name` | String ≤ 60 | yes | — | yes | |
| `sortOrder` | Int | yes | `0` | yes | |
| `status` / `deletedAt` | Enum(`ACTIVE`,`DELETED`) / Date | yes / no | `ACTIVE` / null | yes (soft delete only) | Soft delete of a configuration entity `[TRD §16.2, C10]`: the boilerplate `DEFAULT.STATUS.DELETED` convention. `INACTIVE` (boilerplate value 2) is deliberately **not** used — no upstream rule gives it meaning. Stored representation per UC-2 |

- **Indexes.** `(organizationId, outletId, status, sortOrder)`. **Audit.** none. **Concurrency.** config, low contention. **Retention.** Soft-deleted only (`status: DELETED`); never physically removed. **Readiness.** "Order Ready" is **not** a station field: an order is fully Ready iff every non-cancelled item is Ready across all stations (KDS-009, TD-KDS-1) — computed from items.
- **Unique constraints.** none beyond `_id` (duplicates are valid here). Station names may repeat.
- **References.** none outgoing (items/KOT lines reference stations).
- **Embedded documents.** none.
- **Snapshots.** none.
- **State transitions.** none — configuration; `status: DELETED` soft-deletes.
- **Security considerations.** none sensitive.

### 11.31 Collection: kots  (C-31)

**Purpose.** Immutable **Kitchen Order Ticket**: one logical KOT per cause (initial, additional, cancellation); never edited, never silently erased (ORD-090, KOT-007/008). KDS is the only consumer (printing is out of Phase 1, KOT-010). **Scope.** Outlet. **Lifecycle.** Insert-only. **Ownership.** `kitchen`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `orderId` | ObjectId→`orders` | yes | — | no | |
| `kind` | Enum(`INITIAL`,`ADDITIONAL`,`CANCELLATION`) | yes | — | no | **No state field**: the KDS columns are derived from item state (TRD §15.3) |
| `kotSeq` | Int ≥ 1 | yes | from day counter | no | Per outlet-day sequence from `businessDays.counters.kotSeq` `[TRD TD-ORD-2]` |
| `businessDayId` | ObjectId | yes | — | no | |
| `sourceKey` | String | yes | — | no | Derived `(orderId, cause, orderRev | itemId)` — **idempotency** (KOT-007) |
| `orderSeq` | Int | yes | — | no | Snapshot of the order number for the ticket |
| `tableId` / `tableLabel` | ObjectId / String | no / no | null | no | **Snapshot** of the table label at issue; null = Takeaway (KOT-004/005). After a transfer the kitchen sees the **new** label through live joins; the KOT keeps what it said when issued (TABLE-009) |
| `lines[]` | `{ orderItemId, qty Int, name String, variantName?, modifiers[{groupName, optionName}], notes?, stationId?, refireOfItemId? }` | yes | — | no | Text snapshot (no money: a KOT carries no prices). **A re-fire is exactly an `ADDITIONAL` KOT line whose `refireOfItemId` references the original item** — no `orderItems` row, no item state, no bill line `[TRD §15.2, §25.9.4, PO-3]` |
| `cancellationRecordId` | ObjectId→`cancellationrecords` | no | null | no | For `CANCELLATION` KOTs |
| `issuedBy` | ActorRef | yes | — | no | `SYSTEM` for the transactional `order.confirmed` path |

- **Indexes.** **U** `(organizationId, outletId, sourceKey)` — duplicate KOT impossible (KOT-007); **U** `(organizationId, outletId, businessDayId, kotSeq)`; `(organizationId, outletId, orderId, createdAt)` — KOT history on the order (KOT-008)*(A `(…businessDayId, createdAt)` index was removed in R1: the unique `(…, businessDayId, kotSeq)` index already lists a day's KOTs in issue order.)*
- **Snapshots.** Lines copy names/modifiers at issue; the live item may later be edited via cancel+add. **Audit.** none (not in AUDIT-002); the kitchen cancellation trail is the cancellation record. **Concurrency.** Created **in the same transaction** as `Confirmed`/the add/the cancellation; a retry hits the unique `sourceKey` and returns the same KOT. **Retention.** Indefinite, insert-only. **Security.** none.
- **References.** `orderId`→orders; `tableId`→tables; `lines[].orderItemId`→orderItems; `lines[].stationId`→kitchenStations; `cancellationRecordId`→cancellationRecords.
- **Embedded documents.** `lines[]`.
- **State transitions.** none — a KOT has **no state**; KDS columns derive from item state.

- **Unique constraints.** `(organizationId, outletId, sourceKey)`; `(organizationId, outletId, businessDayId, kotSeq)`.
### 11.32 Collection: bills  (C-32)

**Purpose.** The **bill aggregate**: bill `status`, derived `paymentStatus`, live totals, adjustments (discounts/charges), payment-derived figures, invoice number, history. **Belongs to exactly one order** (BILL-015) — never to a table (TABLE-018). **Bill state and payment state are separate fields and are never collapsed** (BILL-001, PAY-010, INV-09). **Scope.** Outlet. **Lifecycle.** `DRAFT→FINALIZED→REOPENED→FINALIZED…`, or `CANCELLED`. Never deleted. **Ownership.** `billing`.
**Standard sets:** TEN-OO, REV, TS.

#### BillTotals (embedded; every field integer paise; outputs of `computeBill`, TRD §25.4)

| Field | Type | Sign | Description |
|---|---|---|---|
| `subtotalPaise` | Paise | ≥0 | Sum of non-cancelled line values (read from order-item snapshots) |
| `discountPaise` | Paise | ≥0 | Whole-bill, pre-tax discount total (PO-TRD-01 #2) |
| `charges[]` | `{ kind Enum(SERVICE,PACKAGING), amountPaise Paise, allocations[] of { rateBps Int, amountPaise Paise } }` | ≥0 | Service/packaging charges applied to the bill (off by default). `allocations[]` is the charge apportioned across the bill's tax-rate groups by taxable value (largest remainder; Σ `allocations.amountPaise` = `amountPaise` exactly) `[TRD §25.9.3, PO-2]` |
| `chargesPaise` | Paise | ≥0 | Σ `charges[].amountPaise` |
| `taxBreakdown[]` | `{ name String, rateBps Int, taxableValuePaise Paise, taxPaise Paise }` | ≥0 | Per-component totals (CGST/SGST) so tax reports need no recomputation |
| `taxPaise` | Paise | ≥0 | Σ `taxBreakdown[].taxPaise` (per-line half-up, #4) |
| `roundOffPaise` | Paise **signed** | ±  | Rupee round-off shown as its **own line** (#4) |
| `totalPaise` | Paise | ≥0 | Bill total, whole rupees |
| `calcVersion` | Int | — | Version of the calculation policy that produced these figures `[TRD §25.4]` |

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `orderId` | ObjectId→`orders` | yes | — | no | **Unique** — one bill per order |
| `businessDayId` | ObjectId→`businessdays` | yes | stamped | no | Day the bill was **created** (fence stamp). Sales attribution uses the revision's day (§11.33) |
| `status` | Enum(`DRAFT`,`FINALIZED`,`REOPENED`,`CANCELLED`,`REFUNDED`) | yes | `DRAFT` | yes (machine) | `REFUNDED` `[SPEC BILL-002; APP_FLOW §16.1/AF-051; TRD §25.9.2]`: entered from `FINALIZED` in the **same transaction** as the first refund against a bill that has a payment. `Refunded (partial/full)` is **derived** from `refundedPaise` vs `recordedPaymentsPaise` (`FULL` iff `F = P`), never a second status. **No edge leaves `REFUNDED`** (no Reopen, no Cancel, no new payment, no edits); further refunds are ledger records while `F < P`. `CANCELLED` is entered **only from `FINALIZED`**. Every other edge is forbidden (TRD §15.12). Resolved bills for ANALYTICS-011 = `FINALIZED`+`PAID`, `CANCELLED`, `REFUNDED` |
| `paymentStatus` | Enum(`NOT_PAID`,`PAID`) | yes | `NOT_PAID` | derived | `PAID` iff `recordedPaymentsPaise ≥ totals.totalPaise` and total > 0 — **gross recorded payments; a refund never reduces it and never turns a `PAID` bill `NOT_PAID`** `[TRD §25.9.1, PO-1]`; recomputed **in the same transaction** as every payment/total change; *partially paid* and *overpaid* are derived quantities, **not stored statuses** (PAY-010, UC-6) |
| `totals` | BillTotals | yes | zeros | derived | LIVE-DERIVED while `DRAFT`/`REOPENED`; the finalized figures are frozen in `billRevisions` |
| `adjustments[]` | `{ adjustmentId ObjectId, kind Enum(DISCOUNT,SERVICE_CHARGE,PACKAGING_CHARGE), basis Enum(PERCENT,FLAT), valueBps?, valuePaise?, amountPaise Paise, reason Reason?, actor ActorRef, at Date, removedAt?, removedBy? }` | no | `[]` | `$push`/mark-removed only | Recorded entries on a Draft/Reopened bill (BILL-013); removal marks `removedAt` (the entry is never physically removed). For `SERVICE_CHARGE`/`PACKAGING_CHARGE` the entry **snapshots** `basis` and `valueBps`/`valuePaise` from the outlet configuration at application time; later configuration changes never alter an existing entry `[TRD §25.9.3]`. Discount reason mandatory-ness is undefined (PB-19 → OD-DB-9) |
| `recordedPaymentsPaise` | Paise | yes | `0` | derived | Σ effective payment entries `[SD-5]` |
| `outstandingPaise` | Paise | yes | `0` | derived | `max(0, total − recorded)` — uses **gross** recorded payments; a refund never creates an outstanding balance `[TRD §25.9.1]` |
| `overpaymentPaise` | Paise | yes | `0` | derived | `max(0, recorded − total − refunded)` — **shown explicitly, never discarded silently** (PAY-012); a refund clears it up to the excess and is the only thing that does `[TRD §25.9.1, PO-1]` |
| `refundedPaise` | Paise | yes | `0` | derived | Σ refunds; the integrity check `refunded ≤ recorded` runs in-transaction (TN-2). Invariants: `refundedPaise ≤ recordedPaymentsPaise` (TN-2) and, for a payment correction, `recorded′ ≥ refunded`. A refund affects only `overpaymentPaise` and (on a `FINALIZED` bill) `status` — **never** `totals`, `outstandingPaise` or `paymentStatus` `[TRD §25.9.1]` |
| `currentRevision` | Int ≥ 0 | yes | `0` | `$inc` on finalize | Latest `billRevisions.n`; `0` until first finalization |
| `invoiceFy` / `invoiceSeq` / `invoiceNumber` | String / Int / String | no | null | set once (first finalization) | Per-outlet sequence resetting each **1 April**, prefixed with `outlets.code`; allocated from `counters` inside the **first** finalization transaction `[TRD PO-TRD-01 #5]`. **One invoice number per bill for all revisions** (re-finalization reuses it; printouts of revision `n ≥ 2` show "Revised n", derived) and **a cancelled bill keeps its number** `[TRD §25.9.5, PO-4]`. No second invoice identity exists |
| `finalizedAt` / `finalizedBy` | Date / ActorRef | no | null | yes | Latest finalization |
| `cancellation` | `{ reason Reason, by ActorRef, at Date, businessDayId ObjectId }` | no | null | set once | Cancel is allowed **only from `FINALIZED`**, with a **mandatory reason**; status change only — payments stay recorded and untouched, **no automatic refund** (BILL-007), the order is unchanged, **no replacement bill** (BILL-015) and no further items; writes a `CANCELLATION` revision with a negative sales delta on the day of cancellation `[TRD §25.9.6, PO-5]` |
| `createdBy` | ActorRef | yes | — | no | ACT-BIL-09 is a **human** action (bills are not system-created) |
| `history[]` | HistoryEntry (+ reopen reason in `reason`) | yes | `[]` | `$push` only | |

- **Indexes.** **U** `(organizationId, orderId)` — one bill per order, idempotent create `[TRD §19.2]`; **U P{invoiceSeq: {$type:'number'}}** `(organizationId, outletId, invoiceFy, invoiceSeq)` and **U P{invoiceNumber: {$type:'string'}}** `(organizationId, outletId, invoiceNumber)` — invoice numbers never duplicate; `(organizationId, outletId, status, paymentStatus)` — **unresolved bills** (Draft, Reopened, Finalized + `NOT_PAID`; ANALYTICS-011) independent of day; `(organizationId, outletId, businessDayId, status)` — day views; `(organizationId, outletId, createdAt desc)` — bill history/search.
- **Snapshots.** While `DRAFT`/`REOPENED` the bill **references** order items (reads their snapshots); on finalization the lines are **frozen** into `billRevisions`. Totals never read `menuItems`/`outlets.charges`/tax config (MENU-017).
- **State transitions.** §10.2 *Bill*. Forbidden: edit of a `FINALIZED` bill (BILL-004); `DRAFT→REOPENED` (PAY-012); anything out of `CANCELLED`.
- **Audit.** `BILL.DISCOUNT_APPLIED`, `BILL.REOPENED` (reason required, BILL-014), `BILL.CANCELLED`, plus payment/refund events (§11.35–36) in the same transactions. **Concurrency.** `rev` on every total/payment/status change; add-items and finalize are arbitrated by `rev`; two finalizers → one wins, other gets the existing result (M7). **Retention.** Never deleted; reachable after payment (TABLE-011). **Security.** Customer sees only a **read-only projection** through their order link (ACT-BIL-01).

- **Unique constraints.** `(organizationId, orderId)`; the invoice partial uniques (see Indexes).
- **Embedded documents.** `totals` (BillTotals), `adjustments[]`, `cancellation`, `history[]`.
- **References.** `orderId`→orders; `businessDayId`→businessdays; `createdBy.userId`/`finalizedBy.userId`→users (via ActorRef).

### 11.33 Collection: billRevisions  (C-33)

**Purpose.** **Immutable finalized snapshot** of a bill: frozen lines, adjustments, totals, tax breakdown — one per finalization (BILL-011). Reopen never edits it; re-finalization appends `n+1`. Printable/digital/reprinted bills render from the latest revision, never from a different calculation path (BILL-009) `[TRD §25.5, §25.7]`. **Scope.** Outlet. **Lifecycle.** Insert-only. **Ownership.** `billing`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `billId` / `orderId` | ObjectId | yes | — | no | |
| `n` | Int ≥ 1 | yes | next | no | Revision number (shared by both kinds) |
| `kind` | Enum(`FINALIZATION`,`CANCELLATION`) | yes | `FINALIZATION` | no | `CANCELLATION` is the insert-only record written when a Finalized bill is cancelled (PO-5); it carries only `deltaPaise`, `previousTotalPaise`, `reason`, `cancelledRevision`, the day ids, `invoiceNumber` and the actor — `lines`, `totals`, `header` and `calcVersion` are required for `FINALIZATION` only |
| `previousTotalPaise` | Paise | yes | `0` for `n = 1` | no | Total of the preceding finalization revision (`0` for revision 1); for `CANCELLATION` the latest finalized total being reversed |
| `deltaPaise` | Paise **signed** | yes | — | no | **This revision's contribution to Gross sales**: `totals.totalPaise − previousTotalPaise` for a finalization (so `+T₁` for revision 1), `−previousTotalPaise` for a cancellation. Counted on the day of `businessDayId`; frozen at insert `[TRD §25.9.7, PO-6]` |
| `lines[]` | `{ orderItemId ObjectId, lineNo Int, name String, variantName?, qty Int, unitPricePaise Paise, modifiers[ModifierSnapshot], tax TaxSnapshot, lineTotalPaise Paise, taxableValuePaise Paise, taxPaise Paise }` | yes | — | no | **Frozen copy** of non-cancelled lines at finalization (cancelled items excluded, ORD-087) |
| `adjustments[]` | (same shape as `bills.adjustments`, non-removed) | no | `[]` | no | |
| `totals` | BillTotals | yes | — | no | **SNAPSHOT** |
| `calcVersion` | Int | yes | — | no | A later policy change never reinterprets an old bill |
| `invoiceNumber` | String | yes | — | no | **The bill's single invoice number**, identical on every revision of the bill (PO-4); not unique here — uniqueness is on `bills` |
| `finalizedBy` / `finalizedAt` | ActorRef / Date | yes | now | no | |
| `businessDayId` | ObjectId | yes | stamped | no | Day in which this revision **actually happened** (actual timestamp's day, DAY-022). **`deltaPaise` is counted in this day's Gross sales** (PO-6, TRD §25.9.7) |
| `attributedDayId` | ObjectId | yes | original bill's day | no | Day the **original** bill belongs to; equals `businessDayId` for revision 1; for a post-close correction it keeps the original day while `businessDayId` records when it happened `[TRD TD-BILL-2, SPEC DAY-022]` |
| `header` | `{ outletName String, outletCode String, address Address?, contact Contact?, gstin String?, tableLabel String?, isTakeaway Bool, orderSeq Int?, customerContact {name,phone}? }` | yes | — | no | **SNAPSHOT of every non-financial value printed on the bill** `[SCHEMA DECISION SD-45]`. Without it, reprinting an old bill would read the live `outlets`/`tables`/`orders` and show a renamed outlet, a re-labelled table or a changed address — i.e. different historical content (BILL-009: reprint is rendered from the revision only). Contains only what BILL-008/ONB-021 name: outlet identity, address/contact, the configured GST/tax information (`outlets.gstin`, mutable configuration that a tax document must not retroactively change), table or Takeaway, customer details. Whether a tax invoice must *print* the GSTIN is a presentation/compliance matter (OD-DB-18 accountant review); the snapshot only guarantees that whatever is printed cannot change later |
| `reopenedFromRevision` | Int | no | null | no | Set on `n ≥ 2` |

- **Indexes.** **U** `(organizationId, billId, n)`; `(organizationId, outletId, businessDayId)` — **Day Close gross sales** = Σ `deltaPaise` of the day (PO-6); `(organizationId, outletId, attributedDayId)` — the as-originally-attributed report (Σ `deltaPaise` by original day; a report only, never written back to a Day Close). **Audit.** The reopen that precedes a revision is audited on the bill; the revision is the artifact. **Concurrency.** Inserted in the finalize transaction guarded by bill `status`+`rev`. **Retention.** Indefinite; **no update/delete path exists** (F9). **Security.** Customer-visible only via the bill projection.
- **Unique constraints.** `(organizationId, billId, n)`.
- **References.** `billId`→bills; `orderId`→orders; `lines[].orderItemId`→orderItems.
- **Embedded documents.** `lines[]`, `adjustments[]`, `totals`, `header`.
- **Snapshots.** The entire document is the finalized snapshot (financial **and** presentation, `header`).
- **State transitions.** none — insert-only.

### 11.34 Collection: billPrintEvents  (C-34)

**Purpose.** Append-only log of print / reprint / digital-bill renders; reprint **never mutates** the bill (BILL-009). **Scope.** Outlet. **Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `billId` | ObjectId→`bills` | yes | — | no | |
| `revision` | Int ≥ 1 | yes | — | no | Revision rendered |
| `kind` | Enum(`PRINT`,`REPRINT`,`DIGITAL`) | yes | — | no | |
| `actor` | ActorRef | yes | — | no | ACT-BIL-08 (Cashier) / link principal for `DIGITAL` |

- **Indexes.** `(organizationId, billId, createdAt)`. **Audit.** none (not in AUDIT-002). **Retention.** Indefinite. **Concurrency.** inserts only.
- **Lifecycle.** Insert-only; written whenever a bill is printed, reprinted or shown digitally.
- **Ownership.** `billing`.
- **Unique constraints.** none beyond `_id` (duplicates are valid here).
- **References.** `billId`→bills.
- **Embedded documents.** none beyond ActorRef.
- **Snapshots.** none — references revision `n` of `billRevisions`.
- **State transitions.** none.
- **Security considerations.** none sensitive.

### 11.35 Collection: payments  (C-35)

**Purpose.** The **append-only payment ledger**: recorded payment *information* (Phase 1 records, it does not execute — PAY-008 EXCLUDED, NG-011). Supports partial/multiple payments, split components, overpayment visibility and corrections. **No payment states** (no Pending/Failed/Authorized) are invented `[TRD §26.1]`. **Scope.** Outlet. **Lifecycle.** Insert-only; a correction is a new entry. **Ownership.** `billing`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `billId` / `orderId` | ObjectId | yes | — | no | PAY-004 association with bill, order, outlet |
| `type` | Enum(`PAYMENT`,`CORRECTION`) | yes | `PAYMENT` | no | |
| `amountPaise` | Paise | yes | — | no | `PAYMENT` > 0; `CORRECTION` ≥ 0 (0 = withdrawal of the superseded amount). Integer paise |
| `mode` | Enum(`UPI`,`CASH`,`CARD`) | yes | — | no | PAY-002. **"Split" is not a mode** — it is a derived label for ≥ 2 entries sharing `splitGroupId` (TD-PAY-1) |
| `splitGroupId` | ObjectId | no | null | no | Links components of one split payment (PAY-005.AC1: ₹1,840 UPI + ₹1,000 cash) |
| `reference` | String ≤ 64 (restricted charset) | no | null | no | UPI/transaction id **only when supplied**; **never fabricated** (PAY-003/011). Untrusted string: trimmed, never an authority, masked to last 4 in logs. **No card numbers/PINs are ever accepted** (§18) |
| `supersedes` | ObjectId→`payments` | `CORRECTION` only | null | no | The entry this correction replaces; originals are **never edited or deleted** (PAY-007/012) |
| `reason` | Reason | no | null | no | Stored if given; mandatory-ness for corrections undefined (PB-19 → OD-DB-9) |
| `recordedBy` | ActorRef | yes | — | no | |
| `recordedAt` | Date | yes | server now | no | |
| `businessDayId` | ObjectId→`businessdays` | yes | stamped | no | Day in which it was **recorded** (PAY-009) — also the day whose cash it counts toward |
| `idempotencyKey` / `requestHash` | String | yes / yes | — | no | **Durable layer** of PAY-006 |

**Effective payments** = entries not referenced by any `supersedes`, plus `CORRECTION` entries `[TRD §26.2]`. TRD §26.2 lists `supersededBy?` among the *conceptual* key fields **and** states that the original is "never edited or deleted" (PAY-007, PAY-012); both are satisfied only if `supersededBy` is a **derived read attribute** (the id of the entry whose `supersedes` points here), computed by the effective-payments query or a read-time virtual — **never a stored field**, because writing it would update an immutable ledger row. This is the TRD's own resolution (its normative append-only invariant governs its conceptual field list), so **no TRD amendment is required** (UC-3 resolved by alignment; an editorial note in TRD §26.2 is optional).

- **Indexes.** **U** `(organizationId, billId, idempotencyKey)` — duplicate submission yields the existing payment (PAY-006); **U P{type:'PAYMENT', reference:{$type:'string'}}** `(organizationId, billId, reference)` — one provider reference per **original** payment entry on a bill `[TRD §37.3: "(billId, reference) partial"]`. The filter includes `type:'PAYMENT'` on purpose: a `CORRECTION` that supersedes an entry (e.g. fixes the amount) legitimately **repeats the same reference** and would otherwise be rejected as a duplicate — an unintended constraint found in the R1 index audit; **U P{supersedes: {$type:'objectId'}}** `(organizationId, billId, supersedes)` — an entry can be superseded **at most once** (concurrent corrections: one wins); `(organizationId, billId, recordedAt)` — bill ledger; `(organizationId, outletId, businessDayId, mode, type)` — Day Close per-mode totals and **expected cash** aggregation.
- **Audit.** `PAYMENT.CORRECTED` (PAY-007) in the same transaction. **Concurrency.** Distinct keys = distinct intents: two cashiers both succeed (and `overpaymentPaise` shows any excess); the **bill `rev`** conditional write in the same transaction serializes recomputation of `recordedPaymentsPaise/outstanding/overpayment/paymentStatus`. **Retention.** Indefinite, insert-only. **Security.** Reference masked; no gateway fields; `PaymentProviderPort` exists but **no collection or webhook** for it in Phase 1.
- **Unique constraints.** `(organizationId, billId, idempotencyKey)`; partial `(organizationId, billId, reference)` on `type:'PAYMENT'`; partial `(organizationId, billId, supersedes)` (see Indexes).
- **References.** `billId`→bills; `orderId`→orders; `supersedes`→payments.
- **Embedded documents.** `reason`, `recordedBy`.
- **Snapshots.** none — a ledger row is itself immutable.
- **State transitions.** none — payments have **no state**; `type` is `PAYMENT` or `CORRECTION`.

### 11.36 Collection: refunds  (C-36)

**Purpose.** Append-only record of **refunds as recorded facts** — no money moves in Phase 1 (BILL-012). Every refund keeps amount, mode, reason, actor, timestamp and provider reference when available (PAY-013). **Scope.** Outlet. **Lifecycle.** Insert-only. **Ownership.** `billing`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `billId` / `orderId` | ObjectId | yes | — | no | |
| `paymentId` | ObjectId→`payments` | no | null | no | Specific payment refunded, if any |
| `amountPaise` | Paise | yes | — | no | > 0; Σ refunds ≤ Σ effective payments (TN-2, checked in-transaction) |
| `mode` | Enum(`UPI`,`CASH`,`CARD`) | yes | — | no | Refund/payment mode (PAY-013) |
| `reason` | Reason | no | null | no | "where applicable" (PAY-013); mandatory-ness PB-19 → OD-DB-9 |
| `providerReference` | String ≤ 64 | no | null | no | Only if actually supplied; never fabricated |
| `actor` | ActorRef | yes | — | no | |
| `attributedDayId` | ObjectId | yes | original bill's day | no | Day the original sale belongs to (DAY-022) |
| `recordedDayId` | ObjectId | yes | stamped | no | Day in which the refund was **recorded** — the day whose cash and net sales it affects (CASH-007, PO-TRD-01 #6) |
| `deductsFromNet` | Bool | yes | `true` | no | **Snapshot at recording**: `false` iff the bill was `CANCELLED` at that moment (its sale was already reversed by the `CANCELLATION` revision, so deducting again would count the same amount twice). Net sales deduct only refunds with `true`; cash reconciliation counts **all** refunds `[TRD §25.9.6–7, PO-5/PO-6]` |
| `idempotencyKey` / `requestHash` | String | yes / yes | — | no | |

- **Indexes.** **U** `(organizationId, billId, idempotencyKey)`; `(organizationId, billId, createdAt)` — bill refund list; `(organizationId, outletId, recordedDayId, mode)` — Day Close refunds and cash refunds; `(organizationId, outletId, attributedDayId)` — attribution reports. **Audit.** `REFUND.RECORDED`. **Concurrency.** Refund transaction: bill `rev` + in-transaction `refunded ≤ recorded`. **Retention.** Indefinite. **Security.** none beyond tenancy; a refund affects only `overpaymentPaise` and, on a `FINALIZED` bill, sets `status` to `REFUNDED` in the same transaction; it never changes `totals`, `outstandingPaise` or `paymentStatus` (PO-1, TRD §25.9).
- **Unique constraints.** `(organizationId, billId, idempotencyKey)`.
- **References.** `billId`→bills; `orderId`→orders; `paymentId`→payments.
- **Embedded documents.** `reason`, `actor`.
- **Snapshots.** `attributedDayId` and `recordedDayId` freeze both day attributions.
- **State transitions.** none — refunds have **no state**.

### 11.37 Collection: businessDays  (C-37)

**Purpose.** The **outlet business day**. The only boundary is the explicit Day Close timestamp — **no midnight, no Start Day/End Day, no fixed hours** (DAY-001/002, NG-015). Also the **day fence**: every DAY-025 transaction increments `txnCount` on the active day inside its own transaction, and the sequences for order/KOT numbers live here `[TRD §27.1–27.2, TD-ORD-2]`. **Scope.** Outlet. **Lifecycle.** `RUNNING→CLOSED` (and the next `RUNNING` is inserted in the same transaction); `CLOSED→REOPENED→CLOSED`; `RUNNING→ABSORBED` when a reopen absorbs the empty running period. **Ownership.** `day-close`.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `dayNo` | Int ≥ 1 | yes | prev+1 | no | Monotonic per outlet; supports contiguity checks `[SD-34]` |
| `status` | Enum(`RUNNING`,`CLOSED`,`REOPENED`,`ABSORBED`) | yes | `RUNNING` | yes (machine) | Terminology is the SPEC/APP_FLOW one ("Open/Closed" is outlet availability, a different dimension — TRD §45.3 #9) |
| `isActive` | Bool | yes | `true` | derived | `true` iff `status ∈ {RUNNING, REOPENED}`; marker enabling a robust partial unique index `[SD-35]` |
| `startedAt` | Date | yes | — | no | Equals the previous day's `closedAt` (contiguity, DAY-023); first day: activation time |
| `closedAt` | Date | no | null | yes (re-close) | **The authoritative boundary** (server clock) |
| `closedBy` | ActorRef | no | null | yes | |
| `txnCount` | Int ≥ 0 | yes | `0` | `$inc` only | DAY-025 transactions on this day. **Reopen precondition (DAY-021) is exactly `txnCount === 0`** on the running day |
| `counters.orderSeq` / `counters.kotSeq` | Int ≥ 0 | yes | `0` | `$inc` only | Per outlet-day sequences allocated inside the creating transaction |
| `previousDayId` | ObjectId→`businessdays` | no | null | no | Contiguity link |
| `lastCloseRevision` | Int ≥ 0 | yes | `0` | `$inc` on close | Latest `dayCloseRevisions.n` |
| `reopenEvents[]` | `{ reopenedAt Date, reopenedBy ActorRef, reason Reason, absorbedDayId ObjectId, requestId String }` | no | `[]` | `$push` only | **Reopen history** (DAY-018); reason mandatory; bounded by reality (only the latest closed day can be reopened, and only while the running day is empty) |
| `absorbedIntoDayId` / `absorbedAt` | ObjectId / Date | no | null | set once | For `ABSORBED` days |

- **Indexes.** **U P{isActive:true}** `(organizationId, outletId)` — **never two simultaneously active days per outlet** (DAY-015); **U** `(organizationId, outletId, dayNo)`; `(organizationId, outletId, status, closedAt desc)` — most-recent-closed lookup for Reopen (`status:'CLOSED'`, newest `closedAt`) and day history.
- **Rule: only the most recent closed day may be reopened** (DAY-015): the service selects the newest `CLOSED` row; a conditional write `{status:'CLOSED', closedAt: <that value>}` plus the running-day condition `{status:'RUNNING', txnCount:0, rev}` in **one transaction** enforces it against races (§14).
- **Audit.** `DAY.CLOSED`, `DAY.REOPENED`, `DAY.RECLOSED` in the same transaction (AUDIT-008). **Concurrency.** Close and Reopen write the same documents, so write-conflict detection serializes them against concurrent business writes; the loser retries into the new/reopened active day and is attributed correctly. **Retention.** Indefinite; **no day-close record is silently rewritten**. **Security.** none.
- **References.** `previousDayId`/`absorbedIntoDayId`→businessDays.
- **Embedded documents.** `counters`, `reopenEvents[]`.
- **Snapshots.** none (history in `dayCloseRevisions`).
- **State transitions.** `RUNNING→CLOSED`; `CLOSED→REOPENED→CLOSED`; `RUNNING→ABSORBED` (§10.2).

- **Unique constraints.** partial unique active day; `(organizationId, outletId, dayNo)`.
### 11.38 Collection: dayCloseRevisions  (C-38)

**Purpose.** The **immutable Day Close record**: one revision per close; a re-close appends `n+1` and keeps `n` (AUDIT-008). Totals are stored **as components** so `grossSalesPaise`/`netSalesPaise` stay derivable by the approved policy `[TRD §27.1, §27.3, PO-TRD-01 #6]`. **Scope.** Outlet. **Lifecycle.** Insert-only. **Ownership.** `day-close`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `businessDayId` | ObjectId→`businessdays` | yes | — | no | |
| `n` | Int ≥ 1 | yes | next | no | Revision number |
| `totals.finalizedTotalPaise` | Paise | yes | — | no | Σ `deltaPaise` of the day's **first-finalization** revisions (`kind = FINALIZATION`, `n = 1`) — i.e. Σ totals of bills finalized for the first time in this day (DAY-007/022/026) |
| `totals.correctionDeltaPaise` | Paise **signed** | yes | `0` | no | Σ `deltaPaise` of the day's re-finalization revisions (`n ≥ 2`) and `CANCELLATION` revisions — corrections that **actually happened** in this day, attributed to their original bills `[PO-6]` |
| `totals.discountsPaise` | Paise | yes | — | no | |
| `totals.refundsRecordedPaise` | Paise | yes | — | no | All refunds **recorded** that day (`recordedDayId`) — also the cash-refund source and the ANALYTICS-002 "refunds" metric |
| `totals.refundsOnCancelledBillsPaise` | Paise | yes | `0` | no | The part of `refundsRecordedPaise` with `deductsFromNet = false` (refunds against already-cancelled bills) |
| `totals.byMode.upiPaise` / `.cashPaise` / `.cardPaise` | Paise | yes | `0` | no | Payment totals per mode (split components individually) |
| `totals.grossSalesPaise` | Paise **signed** | yes | — | no | **Gross = `finalizedTotalPaise + correctionDeltaPaise`** = Σ `deltaPaise` of the day (PO-TRD-01 #6, PO-6). Signed because a day containing only a cancellation or a downward correction is negative |
| `totals.netSalesPaise` | Paise **signed** | yes | — | no | **Net = Gross − (`refundsRecordedPaise − refundsOnCancelledBillsPaise`)** (SPEC DAY-026 with the cancelled-bill exclusion that prevents double reduction, PO-5); **not clamped** `[TRD §25.9.7]` |
| `totals.counts` | `{ billsFinalized, ordersCompleted, ordersCancelled }` Int | yes | `0` | no | Counts only; no metric beyond ANALYTICS-002 is invented |
| `warnings` | `{ ordersNotTerminal Int, ordersAwaitingAcceptance Int, itemsInProgress Int, unresolvedBills Int, confirmedUnresolved Bool }` | yes | zeros | no | **Snapshot of DAY-020 warnings** shown at close and the explicit confirmation; nothing is cancelled or altered by closing (DAY-012). A `REJECTED` order's treatment follows PB-4 |
| `cashReconciliationId` | ObjectId→`cashreconciliations` | yes | — | no | |
| `closedBy` / `closedAt` | ActorRef / Date | yes | — | no | The day's boundary **at this revision** |
| `notes` | String ≤ 1000 | no | null | no | |
| `isReclose` | Bool | yes | `false` | no | `true` for `n ≥ 2` |
| `idempotencyKey` / `requestHash` | String | yes / yes | — | no | **Durable layer** of DAY-009 |

- **Indexes.** **U** `(organizationId, outletId, businessDayId, n)`; **U** `(organizationId, outletId, businessDayId, idempotencyKey)` — a retried Close returns the **existing closed-day record** (EF-09), never a duplicate. 
- **Audit.** `DAY.CLOSED` / `DAY.RECLOSED` in the same transaction. **Concurrency.** One atomic transaction with the day conditional write (§15). Post-close corrections never mutate an existing revision: a re-finalization or cancellation contributes to the day it actually happens (PO-6, TRD §25.9.7); only Reopen Day → re-close recalculates a day. **Retention.** Indefinite. **Security.** none.
- **Unique constraints.** `(organizationId, outletId, businessDayId, n)`; `(organizationId, outletId, businessDayId, idempotencyKey)`.
- **References.** `businessDayId`→businessDays; `cashReconciliationId`→cashReconciliations.
- **Embedded documents.** `totals`, `warnings`.
- **Snapshots.** The entire document is the Day Close snapshot.
- **State transitions.** none — insert-only.

### 11.39 Collection: cashReconciliations  (C-39)

**Purpose.** Cash reconciliation per **outlet-day and revision**: expected vs counted cash and variance; **variance never blocks Day Close** (CASH-006); **no opening float** (CASH-005…007). **Scope.** Outlet. **Lifecycle.** Insert-only; a re-close inserts revision `n+1`. **Ownership.** `day-close`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `businessDayId` | ObjectId | yes | — | no | Day reference |
| `revision` | Int ≥ 1 | yes | — | no | Matches `dayCloseRevisions.n` |
| `cashPaymentsPaise` | Paise | yes | — | no | Σ effective `CASH` payment entries **recorded** that day |
| `cashRefundsPaise` | Paise | yes | — | no | Σ `CASH` refunds **recorded** that day (`recordedDayId`) |
| `expectedCashPaise` | Paise | yes | — | no | `cashPaymentsPaise − cashRefundsPaise` (CASH-007); stored, with its inputs, so it is reproducible |
| `countedCashPaise` | Paise | yes | — | no | Actual counted cash entered at close |
| `variancePaise` | Paise **signed** | yes | — | no | `countedCashPaise − expectedCashPaise` |
| `recordedBy` / `recordedAt` | ActorRef / Date | yes | now | no | |

- **Indexes.** **U** `(organizationId, outletId, businessDayId, revision)`. **Audit.** Appended with `DAY.CLOSED`/`DAY.RECLOSED`. **Concurrency.** Inserted in the Day Close transaction. **Retention.** Indefinite; **reconciliation history is never overwritten**. **Security.** A cash-variance **Attention** signal reads this row (`ATTN_CASH_VARIANCE_PAISE`), it does not alter it.
- **Unique constraints.** `(organizationId, outletId, businessDayId, revision)`.
- **References.** `businessDayId`→businessDays.
- **Embedded documents.** none beyond ActorRef.
- **Snapshots.** The entire row snapshots the cash inputs and result.
- **State transitions.** none — insert-only.

### 11.40 Collection: dayRollups  (C-40)

**Purpose.** **Derived read model** of per-outlet-day metrics for dashboards/analytics, rebuilt from the ledger on `day.closed` (and invalidated incrementally); **never authoritative** and never used by Day Close, billing or the audit trail (TRD §14 #25, §27.6). **Scope.** Outlet. **Lifecycle.** Upserted by `rollup-day`; rebuildable from scratch. **Ownership.** `analytics`.
**Standard sets:** TEN-OO, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `businessDayId` | ObjectId | yes | — | no | |
| `closeRevision` | Int ≥ 0 | yes | — | no | `0` for provisional running-day figures; `n` after close |
| `rollupVersion` | Int | yes | — | no | Version of the metric definitions |
| `metrics` | Map<String, Number> | yes | `{}` | yes (rebuild) | Metric id → value; keys ending `Paise` are integer paise. Metric ids are exactly the ANALYTICS-002 families; **none invented** |
| `computedAt` | Date | yes | now | yes | |

- **Indexes.** **U** `(organizationId, outletId, businessDayId, closeRevision)` — aligned to the Owner dashboard and brief reads. **Audit.** none. **Concurrency.** Idempotent job (`jobId rollup:{outletId}:{dayId}:{n}`); read from secondaries (`maxStalenessSeconds 90`) — **analytics only**; money/Day Close read the primary (TRD §37.7). **Retention.** Rebuildable; retained. **Security.** Outlet-scoped like its sources; a Manager never sees another outlet's rows (S4).
- **Unique constraints.** `(organizationId, outletId, businessDayId, closeRevision)`.
- **References.** `businessDayId`→businessDays.
- **Embedded documents.** `metrics` map.
- **Snapshots.** Closed-day rows are derived snapshots, rebuildable from the ledger.
- **State transitions.** none.

### 11.41 Collection: customers  (C-41)

**Purpose.** A customer **identity record for operations only** — name + phone captured when an order carries them. **Phase 1 has no customer accounts**: no password, no login, no OTP, no verification, no authentication fields (AUTH-009, CUSTOMER-005, NG-012). **Scope.** Organization (phone is the matching key at organization scope, CUSTOMER-021). **Lifecycle.** Upserted when a name+phone order is placed (tableless QR, website, WhatsApp, staff-captured); never deleted. **Table-QR orders create no customer** (ORD-021). **Ownership.** `customers`.
**Standard sets:** TEN-O, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `phone` | String (E.164) | yes | — | no | `[PII]` primary matching key |
| `name` | String ≤ 120 | no | null | yes | `[PII]` when supplied; WhatsApp captures it "when available" (CUSTOMER-021). Latest supplied value; each order keeps its own `customerContact` snapshot |
| `firstSeenAt` | Date | yes | now | no | |

- **Indexes.** **U** `(organizationId, phone)` — one customer per phone per organization; the lookup used on every name+phone order. **Unique constraints.** Same. 
- **Visibility.** The record is organization-scoped but **never exposed organization-wide**: reads go through `customerOutletProfiles` for the caller's authorized outlets (S4/S9). A phone match **never widens access** and never lets one customer's link expose another's order (CUSTOMER-021).
- **References.** none outgoing. **Audit.** none. **Concurrency.** Upsert by the unique key; duplicate-key → read existing. **Retention.** Retained (history, INV-04); erasure/retention rules are not defined upstream (OTD-9). **Security.** PII: Atlas encryption at rest; never logged in clear (masked last 3 digits); excluded from Sentry and non-privileged realtime rooms (TRD §30.1). **No credential/authentication fields exist on this collection.**
- **Embedded documents.** none.
- **Snapshots.** none (each order keeps its own `customerContact` snapshot).
- **State transitions.** none.

### 11.42 Collection: customerOutletProfiles  (C-42)

**Purpose.** **Per-outlet derived customer history** (visit counts, spend, preferred items, last order) so that outlet staff see **only their own outlet's** history while the Owner sees all authorized outlets (CUSTOMER-004). Stores *components* so any later definition of a statistic is a recomputation (TRD §30.1). **Scope.** Outlet. **Lifecycle.** Maintained from order/bill events; fully rebuildable. **Ownership.** `customers`.
**Standard sets:** TEN-OO, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `customerId` | ObjectId→`customers` | yes | — | no | |
| `ordersCount` | Int ≥ 0 | yes | `0` | derived | Orders placed with this customer at this outlet |
| `completedOrdersCount` | Int ≥ 0 | yes | `0` | derived | Orders that reached `COMPLETED` |
| `finalizedBillsCount` | Int ≥ 0 | yes | `0` | derived | |
| `finalizedTotalPaise` | Paise | yes | `0` | derived | Σ `totalPaise` of **Finalized** bills — the TD-CUS-2 definition of *total spend* |
| `refundedPaise` | Paise | yes | `0` | derived | Refunds tracked **separately** (not netted) |
| `firstOrderAt` / `lastOrderAt` | Date | no | null | derived | |
| `itemCounts` | Map<String(menuItemId), Int> | yes | `{}` | derived | Basis for "preferred items" (top-N chosen at read time) |

- **Indexes.** **U** `(organizationId, outletId, customerId)`; `(organizationId, outletId, lastOrderAt desc)` — outlet customer list (SCR-031). 
- **Statistic definitions.** *Visit count*, *AOV*, *preferred items* are CUSTOMER-002 terms whose exact definition is not upstream; only total spend is defined (TD-CUS-2). Stored components make any definition a recomputation → **OD-DB-22**.
- **Audit.** none. **Concurrency.** Maintained by idempotent event handlers; a lost update is repaired by rebuild. **Retention.** Rebuildable; retained. **Security.** Existence of a row for `(outlet, customer)` is the **outlet-scoped authorization** for showing that customer's name/phone to that outlet's staff.
- **Unique constraints.** `(organizationId, outletId, customerId)`.
- **References.** `customerId`→customers.
- **Embedded documents.** `itemCounts` map.
- **Snapshots.** none — derived, rebuildable.
- **State transitions.** none.

### 11.43 Collection: customerOrderLinks  (C-43)

**Purpose.** The **private, non-guessable order-access mechanism**: the *only* way a customer reaches their order (tracking, bill view, feedback, reorder) — no accounts, no OTP (AUTH-009, CUSTOMER-005). **Scope of a link: exactly one order** (CUSTOMER-022). **Scope.** Outlet. **Lifecycle.** Issued once per customer-originated order at submission; expires; TTL-purged. **Ownership.** `customers`.
**Standard sets:** TEN-OO, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `orderId` | ObjectId→`orders` | yes | — | no | **Unique**: one link per order (idempotent issuance, TRD §19.2) |
| `tokenHash` | String (SHA-256 hex) | yes | — | no | **Only the hash is stored**; the 256-bit base64url token exists only in the issuing response; **`select:false`** |
| `customerId` | ObjectId→`customers` | no | null | no | Null for table-QR orders |
| `absoluteExpiresAt` | Date | yes | `createdAt + 90 d` | no | Absolute cap from creation (`ORDER_LINK_ABS_DAYS`, engineering default) `[TRD §30.2]` |
| `terminalAt` | Date | no | null | set once | When the order reached a terminal state |
| `expiresAt` | Date | yes | `= absoluteExpiresAt` | yes (once) | `min(terminalAt + 30 d, absoluteExpiresAt)` after the order is terminal (`ORDER_LINK_TTL_DAYS`); read and reorder access ends here |
| `revokedAt` | Date | no | null | set once | Platform-level revocation (security incident) only; no customer-facing revoke |
| `purgeAt` | Date | yes | `expiresAt + ORDER_LINK_PURGE_GRACE_DAYS` | recomputed with `expiresAt` | **TTL anchor.** The existence of a TTL/expiry field on this collection is `[TRD §37.3]` ("unique `(tokenHash)`, TTL/expiry field") and the expiry rule is `[TRD §30.2]`; the **grace length** (engineering default 7 d, `0` allowed) is **`[OPEN TECHNICAL DECISION]` OTD-15a** — configuration, not a retention policy. The record holds no business truth (the order is retained) `[SD-36]` |

- **Indexes.** **U** `(organizationId, orderId)`; **U** `(tokenHash)` — public lookup carries no tenant context (§5.3); **T** `(purgeAt)` with `expireAfterSeconds: 0` — bookkeeping purge a week after expiry (single-field TTL; documents without the field never expire). Read paths **also** check `expiresAt`/`revokedAt` explicitly — TTL deletion runs only every ~60 s and is not an access control.
- **No `lastUsedAt`.** The tracking page polls/refetches; a write per read would be pure write amplification and no upstream requirement needs it `[SD-37]`. Rate limiting is per IP in Redis.
- **Access scope.** A principal holding a link can read **that order's customer-safe projection**, track it, view its bill, submit feedback, reorder; it cannot list orders (past orders are staff-only, for billing correction — CUSTOMER-022). `Cache-Control: no-store`; access logs redact `/o/*` tokens.
- **Delivery.** SMS/email delivery of links is **not** modeled (no Phase 1 requirement); the link is returned in the submit response. For **WhatsApp** orders a link is issued but **not delivered over WhatsApp** (DF-15) — so the data model supports WhatsApp feedback eligibility while *practical access is deferred* (§23, UC-12).
- **Audit.** none. **Concurrency.** Created in the order-creation transaction; unique `orderId` makes issuance idempotent. **Retention.** TTL as above (not a business record). **Security.** Hash-only storage; 256-bit CSPRNG; invalid/expired/foreign token ⇒ generic not-found with no order data (C-INVALID).
- **References.** `orderId`→orders; `customerId`→customers.
- **Embedded documents.** none.
- **Snapshots.** none.
- **State transitions.** active → expired (derived from `expiresAt`) or revoked (`revokedAt`); not a stored state machine.

- **Unique constraints.** `(organizationId, orderId)`; `(tokenHash)`.
### 11.44 Collection: feedback  (C-44)

**Purpose.** Phase 1 customer **feedback**: integer rating 1–5 + optional comment, **one per order**, for eligible completed customer orders (FEEDBACK-001…006). Used as operational insight by Owner/Manager (ACT-FB-02); **no public review functionality** (Phase 2, CUSTOMER-006/FEEDBACK-005). **Scope.** Outlet. **Lifecycle.** Insert-only. **Ownership.** `customers`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `orderId` | ObjectId→`orders` | yes | — | no | **Unique** |
| `rating` | Int 1–5 | yes | — | no | |
| `comment` | String ≤ 1000 | no | null | no | Plain text, output-encoded |
| `customerId` | ObjectId→`customers` | no | null | no | Customer context (FEEDBACK-003); null for table-QR orders |
| `orderSource` | Enum (as `orders.source`) | yes | — | no | Channel copy: eligible `TABLE_QR`, `TABLELESS_QR`, `WEBSITE`, `WHATSAPP` (and `REORDER`) |

- **Eligibility (service-enforced, data-supported).** Order `stage = COMPLETED` **and** a `customerOrderLinks` row exists (customer-originated). `STAFF` source orders and walk-ins without customer identity/link get **no** self-service feedback; `CANCELLED`/`REJECTED` offer none (ORD-065.AC1). Nothing is stored for ineligible orders.
- **Indexes.** **U** `(organizationId, orderId)` — one per order (FEEDBACK-006) and the idempotency key; `(organizationId, outletId, createdAt desc)` — Owner/Manager feedback list/summary (SCR-032). **Audit.** none. **Concurrency.** Duplicate-key ⇒ return existing. **Retention.** Retained; correction/deletion rules undefined (OTD-9). **Security.** Comment is untrusted free text; never an instruction to the AI (prompt-injection posture, TRD §31.3).
- **References.** `orderId`→orders; `customerId`→customers.
- **Embedded documents.** none.
- **Snapshots.** `orderSource` copies the order's channel.
- **State transitions.** none — insert-only.

- **Unique constraints.** `(organizationId, orderId)`.
---

### 11.45 Collection: aiProposals  (C-45)

**Purpose.** The **single-use confirmation record** of an Owner-Agent *sensitive action*: the model can only *propose*; the Owner confirms through a separate authenticated request `[TRD §31.3, SPEC AI-029]`. Keeps sensitive AI actions auditable and bounded. **Phase 1 ships read-only tools; the permitted action catalogue is undefined (PB-18 → OD-DB-23)** — the collection exists so the framework is ready. **Scope.** Organization with optional `outletId`. **Lifecycle.** `PROPOSED→CONFIRMED→EXECUTED`, or `EXPIRED`/`REJECTED`/`FAILED`. **Ownership.** `ai`.
**Standard sets:** TEN-O (+ optional `outletId`), REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `outletId` | ObjectId | no | null | no | |
| `ownerId` | ObjectId→`users` | yes | — | no | Only this Owner can confirm |
| `tool` | String | yes | — | no | Registry action-tool name |
| `args` | Object (validated by the tool's Joi schema) | yes | — | no | Arguments **never** include `organizationId`/`outletId` from the model |
| `argsHash` | String | yes | — | no | Confirmation is bound to this hash |
| `summary` | String ≤ 500 | yes | — | no | **Server-generated from `args`**, never copied from model text |
| `status` | Enum(`PROPOSED`,`CONFIRMED`,`EXECUTED`,`EXPIRED`,`REJECTED`,`FAILED`) | yes | `PROPOSED` | yes (machine) | |
| `expiresAt` | Date | yes | now + `PROPOSAL_TTL` (10 min) | no | |
| `confirmedAt` / `executedAt` | Date | no | null | set once | |
| `result` | `{ outcome String, auditEventId ObjectId? }` | no | null | set once | |
| `failureReason` | String ≤ 200 | no | null | set once | |
| `purgeAt` | Date | no | null | set once, **only on a non-executed terminal state** | **TTL anchor.** `[TRD §31.3]` says the proposal store is "Mongo, TTL" and proposals expire (`PROPOSAL_TTL_MIN`, default 10 min). `purgeAt` is set when status becomes `EXPIRED`, `REJECTED` or `FAILED` (= that time + `AI_PROPOSAL_PURGE_GRACE_DAYS`, **`[OPEN TECHNICAL DECISION]` OTD-15b**, engineering default 30 d). It is **never set for `EXECUTED`** proposals: the confirmed summary/arguments the Owner approved are audit evidence for AUDIT-004 and must stay explainable `[SCHEMA DECISION SD-47]`; their retention follows OTD-9 (indefinite in Phase 1) |

- **Indexes.** `(organizationId, ownerId, status, createdAt desc)` — Owner's pending proposals; **T** `(purgeAt)` `expireAfterSeconds: 0` (single-field; documents without `purgeAt` — including every `EXECUTED` proposal — never expire). 
- **State transitions.** Single-use conditional write `{_id, ownerId, status:'PROPOSED', argsHash, expiresAt > now} → CONFIRMED`; execution runs the normal service with `via:'AI'` and `idempotencyKey = proposalId` after **re-running full five-factor authorization** at execution time.
- **Audit.** `AI.ACTION_EXECUTED` wraps the underlying action with `proposalId` (AI-042, AUDIT-004). **Concurrency.** Double confirm → conditional write; second sees the existing result. **Retention.** TTL. **Security.** No unrestricted DB access model exists anywhere: the model never sees collection names/queries; AI scope ≤ the invoking Owner's scope (A2, A3).
- **Unique constraints.** none beyond `_id`; single use is the conditional `PROPOSED→CONFIRMED` write.
- **References.** `ownerId`→users; `result.auditEventId`→auditEvents.
- **Embedded documents.** `args`, `result`.
- **Snapshots.** `summary` and `argsHash` freeze exactly what the Owner confirmed.

### 11.46 Collection: aiInteractions  (C-46)

**Purpose.** **Metadata-only** log of AI tool calls (who, which tool, outcome, latency, tokens) for observability and abuse control. **No prompts and no PII are persisted by default** (TD-AI-4). **Scope.** Organization with optional `outletId`. **Lifecycle.** Insert-only; TTL-purged. **Ownership.** `ai`.
**Standard sets:** TEN-O (+ optional `outletId`), TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `outletId` | ObjectId | no | null | no | |
| `userId` | ObjectId→`users` | yes | — | no | Invoking Owner |
| `requestId` | String | yes | — | no | |
| `tool` | String | yes | — | no | |
| `argsHash` | String | yes | — | no | Hash only — never the arguments |
| `status` | Enum(`OK`,`REFUSED`,`ERROR`) | yes | — | no | `[SD-39]` classification of the tool result (REFUSED = unknown tool / authorization denial) |
| `latencyMs` | Int | yes | — | no | |
| `tokens` | `{ input Int, output Int }` | no | null | no | |
| `purgeAt` | Date | no | null | no | **TTL anchor, populated only when `AI_LOG_RETENTION_DAYS` is configured.** `[TRD TD-AI-4]` says only "minimal retention" and gives **no period**; the value (engineering suggestion 90 d) is **`[OPEN TECHNICAL DECISION]` OTD-15c**. Until it is decided, `purgeAt` is absent and the log is retained (the safe default: no silent data destruction) `[SD-38]` |

- **Indexes.** `(organizationId, userId, createdAt desc)` — per-user budget/abuse review; **T** `(purgeAt)` (single-field; absent ⇒ never expires). **Audit.** none (executed actions are in `auditEvents`). **Concurrency.** inserts. **Retention.** Retained until OTD-15c is decided; then TTL. **Security.** No prompt text, no tool results, no customer data.
- **Unique constraints.** none beyond `_id` (duplicates are valid here).
- **References.** `userId`→users.
- **Embedded documents.** `tokens`.
- **Snapshots.** none.
- **State transitions.** none.

### 11.47 Collection: dailyBriefs  (C-47)

**Purpose.** The persisted **Daily AI Brief** for an outlet's closed business day: **facts** (server-rendered from computed metrics) and **recommendations** (model-generated) kept as separate sections so AI never reads as ground truth (AI-021/026/027). **What Changed? is not persisted** — it is computed on demand (TD-AI-2). **Scope.** Outlet. **Lifecycle.** Generated once per `(day, closeRevision)` by an event-triggered job; insert-only. **Ownership.** `ai-insights`.
**Standard sets:** TEN-OO, TS-C.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `businessDayId` | ObjectId | yes | — | no | Source/context |
| `closeRevision` | Int ≥ 1 | yes | — | no | A re-close generates a **new** brief |
| `status` | Enum(`READY`,`UNAVAILABLE`) | yes | — | no | `UNAVAILABLE` when generation failed and no deterministic section could be produced; nothing is fabricated |
| `generationMode` | Enum(`DETERMINISTIC_ONLY`,`MODEL_ASSISTED`) | yes | — | no | Fallback to facts-only on provider failure/guard violation (AI-041) |
| `facts[]` | `{ metricId String, label String, value Number, unit Enum(PAISE,COUNT,BPS,TEXT) }` | yes | `[]` | no | **Source data**; `PAISE` values are integer paise |
| `recommendations[]` | `{ text String ≤ 500, metricRefs [String] }` | no | `[]` | no | **AI-generated**; may not introduce numbers absent from `metrics` (numeric grounding guard, TD-AI-3) |
| `metrics` | Map<String, Number> | yes | `{}` | no | The metric set supplied to the call — the **source references** every fact traces to |
| `model` | `{ provider String, name String, promptVersion String }` | no | null | no | Null when `DETERMINISTIC_ONLY` `[TRD §31.5]` |
| `generatedAt` | Date | yes | now | no | |
| `failureReason` | String ≤ 200 | no | null | no | |

- **Indexes.** **U** `(organizationId, outletId, businessDayId, closeRevision)` — job idempotency (`brief:{outletId}:{dayId}:{closeRevision}`); `(organizationId, outletId, generatedAt desc)` — "latest brief" (`GET /ai/briefs/latest`). **Audit.** none (read-only insight). **Concurrency.** Unique key dedupes retried jobs. **Retention.** Retained. **Security.** Visible to Owner (authorized outlets) and Manager (assigned outlets) only (ACT-AI-04); no push/email/SMS delivery is modeled.
- **Embedded documents.** `facts[]`, `recommendations[]`, `model`.
- **Snapshots.** The entire document snapshots the metric set and narrative at generation time.
- **State transitions.** none — `status` is set at insert.

- **Unique constraints.** `(organizationId, outletId, businessDayId, closeRevision)`.
- **References.** `businessDayId`→businessdays; the source Day Close revision is identified by `closeRevision` (no separate reference).

### 11.48 Collection: whatsappMessages  (C-48)

**Purpose.** Persist **inbound WhatsApp events** exactly once (provider-id dedupe), so a message is never lost when AI is unavailable and no partial order is created (AI-030…033, INTEG-002; PB-16 defines no non-AI path → OD-DB-24). Order conversation state/cart is **transient Redis** (TTL 24 h) — not stored here. **Outbound tracking/status messages are not built** (DF-15), so no delivery-tracking fields exist. **Scope.** Outlet (resolved from the business number at the webhook). **Lifecycle.** `RECEIVED→PROCESSED|FAILED`; TTL-purged. **Ownership.** `whatsapp-ordering`.
**Standard sets:** TEN-OO, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `providerMessageId` | String | yes | — | no | **Globally unique** dedupe key (webhook + job) |
| `direction` | Enum(`INBOUND`,`OUTBOUND`) | yes | `INBOUND` | no | Outbound = conversational replies only (AI-030) |
| `phone` | String (E.164) | yes | — | no | `[PII]` needed to reply; TTL-bound |
| `phoneHash` | String | yes | — | no | Used in Redis keys/logs (never the number) |
| `text` | String ≤ 4000 | no | null | no | `[PII]` message body, TTL-bound |
| `status` | Enum(`RECEIVED`,`PROCESSED`,`FAILED`) | yes | `RECEIVED` | yes (forward) | `[SD-40]` processing state only |
| `orderId` | ObjectId→`orders` | no | null | set once | Resulting order (through the unified engine, Takeaway) |
| `failureReason` | String ≤ 200 | no | null | yes | Surfaces as `integration.failure` to staff/Owner |
| `receivedAt` / `processedAt` | Date | yes / no | now / null | no / yes | |
| `purgeAt` | Date | no | null | no | **TTL anchor, populated only when `WA_RETENTION_DAYS` is configured.** TRD §33.4 requires the event to be persisted before the `200` but defines **no retention** for it; the value (engineering suggestion 30 d) is **`[OPEN TECHNICAL DECISION]` OTD-15d**. The record contains PII (`from` phone), so a decision is required before production (see also OD-DB-25); until then it is retained `[SD-38]` |

- **Indexes.** **U** `(providerMessageId)` — webhook dedupe across the platform; `(organizationId, outletId, receivedAt desc)`; `(organizationId, outletId, status)` partial `{status:'FAILED'}` — integration-failure surfacing; **T** `(purgeAt)` (single-field; absent ⇒ never expires). **Audit.** none. **Concurrency.** Duplicate-key ⇒ ignore duplicate. **Retention.** Retained until OTD-15d is decided; then TTL. **Security.** Webhook signature + timestamp verified before insert; body and phone never logged; order creation still passes every gate (outlet Open, activated, not suspended) and requires staff acceptance (AI-033).
- **References.** `orderId`→orders.
- **Embedded documents.** none.
- **Snapshots.** none.
- **State transitions.** `RECEIVED→PROCESSED|FAILED`.

- **Unique constraints.** `(providerMessageId)`.
### 11.49 Collection: attentionItems  (C-49)

**Purpose.** **Attention Engine** insight items: deterministic, rule-based, evidence-linked, template-worded, **never accusatory or causal**; insight only — no KDS delayed-order alerts, no automated outreach (ATTENTION-001…008). Kitchen slowdown is **analytics/attention only**. **Scope.** Outlet (items follow outlet authorization, ATTENTION-008). **Lifecycle.** `OPEN→DISMISSED|RESOLVED`. **Ownership.** `attention`.
**Standard sets:** TEN-OO, REV, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `signalType` | Enum(`SALES_BELOW_BASELINE`,`CASH_VARIANCE`,`UNUSUAL_DISCOUNT_USAGE`,`UNUSUAL_CANCELLATION_ACTIVITY`,`KITCHEN_SLOWDOWN`,`CUSTOMER_REORDER_GAP`,`OUTLET_UNDERPERFORMANCE`,`STALE_CANCELLATION_REQUEST`) | yes | — | no | The ATTENTION-003 signals + the ORD-093 stale-request item `[TRD §31.9]` |
| `periodKey` | String | yes | — | no | Dedupe discriminator: `dayId` for post-close signals, a window bucket for sweep signals, `requestId` for stale requests |
| `status` | Enum(`OPEN`,`DISMISSED`,`RESOLVED`) | yes | `OPEN` | yes (once) | |
| `text` | String ≤ 300 | yes | — | no | Template-generated factual wording |
| `evidence[]` | `{ metricId String, value Number, baselineValue Number?, unit Enum(PAISE,COUNT,BPS,MINUTES) }` | yes | `[]` | no | Evidence attached as metric references (money = integer paise; all values safe integers — MR-7) |
| `sourceRefs[]` | `{ type String, id ObjectId }` | no | `[]` | no | e.g. day, cancellation request |
| `detectedAt` | Date | yes | now | no | |
| `businessDayId` | ObjectId | no | null | no | |
| `resolution` | `{ by ActorRef, at Date, reason Reason? }` | when not open | null | set once | Actor + time (ATTENTION-006). **Resolution reason and the meaning of Dismissed vs Resolved are undefined (PB-9 → OD-DB-6)**: stored as given by the actor, no auto-resolution |

- **Indexes.** **U** `(organizationId, outletId, signalType, periodKey)` — one item per `(outlet, signal, day|window)` (idempotent detection); `(organizationId, outletId, status, detectedAt desc)` — Attention list. **Severity/priority is intentionally absent**: no severity vocabulary is defined upstream (task Part 20 "where defined") `[OD-DB-6]`.
- **Audit.** none. **Concurrency.** Conditional write on `{status:'OPEN', rev}` (ACT-ANL-04: Owner; Manager for own outlets). **Retention.** Retained. **Security.** Outlet-scoped; a Manager never sees another outlet's items.
- **Unique constraints.** `(organizationId, outletId, signalType, periodKey)` (see Indexes).
- **Embedded documents.** `evidence[]`, `sourceRefs[]`, `resolution`.
- **Snapshots.** `evidence` values snapshot the metrics at detection time.
- **State transitions.** `OPEN→DISMISSED|RESOLVED`.

- **References.** `businessDayId`→businessdays (optional); `sourceRefs[]` is a polymorphic pointer list (day, cancellation request) with no `ref`.

---

### 11.50 Collection: counters  (C-50)

**Purpose.** Mongo-authoritative **invoice-number sequences** (per outlet, per financial year) allocated by `$inc` **inside the finalization transaction** — Redis `INCR` is not used for business numbers `[TRD TD-ORD-2, PO-TRD-01 #5]`. Order and KOT sequences live on `businessDays.counters` (they share the day-fence document). **Scope.** Outlet. **Ownership.** `billing`.
**Standard sets:** TEN-OO, TS.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `key` | Enum(`INVOICE`) | yes | — | no | |
| `period` | String (`'YYYY-YY'`, e.g. `'2026-27'`) | yes | — | no | **Indian financial year, 1 April → 31 March**; a new period document starts at 1 — the reset needs no job |
| `seq` | Int ≥ 0 | yes | `0` | `$inc` only | Last allocated number |

- **Indexes.** **U** `(organizationId, outletId, key, period)`. Allocation is `findOneAndUpdate({…}, {$inc:{seq:1}}, {upsert:true, new:true})` inside the finalization transaction; a concurrent first-insert duplicate-key is retried. A rolled-back finalization **rolls back the increment** (gap-free numbering within committed bills). **Audit.** none. **Retention.** Never deleted. **Security.** none.
- **Lifecycle.** Created lazily by upsert on the first invoice of a financial year; never deleted.
- **Unique constraints.** `(organizationId, outletId, key, period)` (see Indexes).
- **References.** none.
- **Embedded documents.** none.
- **Snapshots.** none.
- **State transitions.** none.
- **Concurrency considerations.** `$inc` inside the finalization transaction; a first-insert duplicate-key race is retried; a rolled-back finalization rolls the increment back.

### 11.51 Collection: migrations  (C-51)

**Purpose.** Registry of applied schema migrations and the migration lock `[TRD §40.6]`: versioned scripts, expand → migrate → contract, run by a one-off task before rollout; `autoIndex` is disabled in production and the task runs an allow-listed `syncIndexes`. **Scope.** Platform (no tenancy; exempt from the tenancy guard by registration). **Ownership.** platform/devops.

| Field | Type | Required | Default | Mutable | Description |
|---|---|---|---|---|---|
| `migrationId` | String (`NNNN_description`) | yes | — | no | Unique |
| `appliedAt` | Date | yes | now | no | |
| `schemaVersion` | Int | yes | — | no | Mirrors the boilerplate `DATABASE_VERSIONS` registry |
| `lock` | `{ holder String, at Date }` | no | null | yes | Single-runner lock |

- **Indexes.** **U** `(migrationId)`. **Retention.** Indefinite. **Security.** Written only by the migration task's DB user (which also owns index creation; the application user cannot create or drop indexes).
- **Lifecycle.** One row inserted per applied migration.

- **Unique constraints.** `(migrationId)`.
- **References.** none.
- **Embedded documents.** `lock`.
- **Snapshots.** none.
- **State transitions.** none — insert-only.
- **Audit requirements.** none (infrastructure record).
- **Concurrency considerations.** A single-runner `lock` prevents concurrent migration tasks.
---

## 12. Idempotency and Offline Data

### 12.1 Model — two layers, one durable rule  `[TRD §19.4]`

| Layer | Holds | Role |
|---|---|---|
| **Fast** (Redis `idem:{org}:{principal}:{key}`, 24 h) | `in_progress` claim, stored response ≤ 64 KB, request hash | Cheap replays and in-flight detection. **Not part of this schema.** |
| **Durable** (MongoDB, **this document**) | `idempotencyKey` (+ `requestHash`) **on the business document that the operation creates**, protected by a **unique index** | Correctness. If Redis was flushed, or an offline device replays days later, the second insert hits the unique index; the service catches the duplicate-key error and **returns the existing document** (response reconstructed from current state). |

There is **no generic `idempotencyKeys` collection** (§7.1): a parallel table could drift from the business truth. The *operation's own record* is the idempotency record, so "result reference" is the document itself, and "processing state" exists only in Redis (`in_progress`); a Mongo document exists only once committed.

### 12.2 The exact uniqueness boundary per operation

The rule is **never one global rule**: the scope is the *narrowest boundary inside which a duplicate is the same user intent*. Every unique index below **leads with `organizationId` (and `outletId`)**, even where the aggregate id already implies them, so the tenancy rule and index design stay uniform.

| Operation | Persisted fields | Unique index (durable dedupe) | Duplicate result | TRD source |
|---|---|---|---|---|
| Order submit / staff commit (ORD-006) | `orders.idempotencyOperation='ORDER_SUBMIT'`, `idempotencyKey`, `requestHash` | `(organizationId, outletId, idempotencyOperation, idempotencyKey)` partial `{idempotencyKey:{$type:'string'}}` | existing order | TRD §19.2 — **Organization + Outlet + Operation type + Key** |
| Add items | `orderBatches.idempotencyKey`, `requestHash` | `(organizationId, outletId, orderId, idempotencyKey)` | same batch | §19.2 `(orderId, key)` |
| Initial/additional/cancellation KOT (KOT-007) | `kots.sourceKey` = `(orderId, cause, orderRev | itemId)` | `(organizationId, outletId, sourceKey)` | the same KOT | §19.2 |
| Open table session | — (state) | partial unique one `ACTIVE` session per table | existing active session | TABLE-014 |
| Table operations | `tableOperationEvents.idempotencyKey` | `(organizationId, outletId, idempotencyKey)` | existing event | §19.3 |
| Create bill (BILL-015) | — (natural key) | `(organizationId, orderId)` | existing bill | §19.2 |
| Finalize / reopen / any transition | — | **conditional write** on `status` + `rev` (no key stored) | existing result / `ALREADY_IN_STATE` | TRD §15.0 M2/M7 |
| Record payment (PAY-006) | `payments.idempotencyKey`, `requestHash`, optional `reference` | `(organizationId, billId, idempotencyKey)` **and** partial `(organizationId, billId, reference)` on `type:'PAYMENT'` | existing payment | §19.2 |
| Payment correction | `payments.supersedes` | partial unique `(organizationId, billId, supersedes)` | one correction wins | §26.2 |
| Refund | `refunds.idempotencyKey`, `requestHash` | `(organizationId, billId, idempotencyKey)` | existing refund | §19.2 |
| Day Close (DAY-009) | `dayCloseRevisions.idempotencyKey` | `(organizationId, outletId, businessDayId, idempotencyKey)` + day `status`/`rev` | **existing closed-day record** (EF-09) | §19.2 |
| Reopen Day | `businessDays.reopenEvents[].requestId`; day `status` | conditional `{status:'CLOSED'}` → `REOPENED` | existing reopened day | §19.2 |
| Order-link issuance | — | `(organizationId, orderId)` unique | existing link | §19.2 |
| Feedback | — | `(organizationId, orderId)` | existing feedback | FEEDBACK-006 |
| Draft upsert | `customerDrafts.draftKey`, `clientSeq` | `(organizationId, outletId, draftKey)` | idempotent upsert | TD-ORD-4 |
| WhatsApp inbound | `whatsappMessages.providerMessageId` | `(providerMessageId)` | ignored duplicate | §19.2 |
| AI proposal confirm | `aiProposals.status` | conditional `PROPOSED→CONFIRMED`; execution key = `proposalId` | existing result | TRD §31.3 |

**Request identity.** `requestHash = sha256(method + path + canonical(body) + X-Outlet-Id)` is stored on the durable record for orders, batches, payments, refunds and Day Close revisions `[SD-6]`, so that **reusing a key with a different request** is detectable (`409 IDEMPOTENCY_KEY_REUSED`) **even after Redis was flushed**. The key namespace in Redis includes principal+organization (two users cannot probe each other's keys); the durable index is tenant-scoped for the same reason.

**Actor and device context.** Who submitted is on the document (`createdBy`, `recordedBy`, `actor`: `ActorRef`); `deviceType` is carried by `sessions` and `auditEvents.source`. The **offline queue itself is client-side (IndexedDB)** and is deliberately **not** mirrored server-side: a replay is an ordinary authenticated request, **re-authorized at arrival, not at queue time** (G-OFF-4). Client timestamps are advisory and not persisted (M5); `clientRef → orderId` is returned in the create response and not stored.

**Honouring a key (interface-design review).** The durable key is the *client-generated intent key* (stable across retries, never regenerated by the retry layer); it is **claimed atomically by the unique index on insert** — never by a read-then-write; a reused key with a different `requestHash` fails loudly; the in-flight duplicate is a deliberate `409 REQUEST_IN_PROGRESS` (Redis claim). **Retention:** durable keys live as long as the business record (indefinitely), so they outlive every retry path including offline replay days later — the 24-hour limit applies only to the Redis fast layer.

**What is not idempotent by design.** Reads; `PATCH` edits (protected by `rev`); AI chat turns (non-mutating) — TRD §19.8.

**Offline eligibility** (`OFFLINE_ELIGIBLE` = staff order commit and add-items only) is a **code constant**, not data (TRD §19.5); nothing in the schema relaxes it.

---

## 13. Index Strategy and Unique-Constraint Register

### 13.1 Index rules

| Rule | Statement |
|---|---|
| IX-1 | **Every compound index leads with `organizationId`, then `outletId`** (scoping is also the fast path). The exceptions are listed in §13.4 and exist only where a public/auth lookup carries no tenant context. |
| IX-2 | Indexes are derived from **named Phase 1 access patterns** (§13.2). A field is **not** indexed merely because it exists. |
| IX-3 | State-dependent uniqueness uses **partial unique indexes** with equality or `$type` filters, plus, where a state *set* is needed, a **derived marker** (`isActive`, `isOpen`) — `[SD-28/35]`. MongoDB documents `$in`/`$or` as supported in `partialFilterExpression` (§13.5) but the minimum server version for them was **not verified**, so equality markers are used for version independence. |
| IX-4 | `autoIndex` is **disabled in production**; the deploy-time migration task runs an allow-listed `syncIndexes`. Partial unique indexes are therefore **created before** the code that relies on them (expand → migrate → contract, TRD §40.6). Dropping an index is a *contract* step in a later release. |
| IX-5 | Unique indexes protect **correctness**; a duplicate-key error is **converted into an idempotent result**, never surfaced as 500 (TRD §38.1). |
| IX-6 | Reads of operational data use the **primary**; only analytics (`dayRollups`, brief metrics) may use `secondaryPreferred` (`maxStalenessSeconds 90`). Money, Day Close, orders, KDS never read secondaries. |

### 13.2 Access pattern → index map

| Phase 1 access pattern | Collection / index | Note |
|---|---|---|
| KDS queue (whole outlet, ≤ 200 active items) | `orderItems (org, outlet, state, priority, createdAt)` | single indexed query; history is a separate cursor query |
| Active orders / awaiting-acceptance queue / handoff | `orders (org, outlet, stage, createdAt)`; `orderBatches` partial `AWAITING_ACCEPTANCE` | |
| Orders of a table/session | `orders (org, outlet, tableId|tableSessionId, stage)` | |
| Duplicate order submit | `orders` unique `(org, outlet, idempotencyOperation, idempotencyKey)` | §12 |
| Order number lookup | `orders` unique `(org, outlet, businessDayId, orderSeq)` | orderNumber = `orderSeq` |
| Day Close warnings / reopen precondition | `orders (…businessDayId, stage)`, `orderItems (…businessDayId, state)`, `bills (…status, paymentStatus)`, day `txnCount` | exact O(1) for reopen |
| One bill per order | `bills` unique `(org, orderId)` | |
| Unresolved bills (independent of day) | `bills (org, outlet, status, paymentStatus)` | ANALYTICS-010/011 |
| Bill ledger / payments by bill | `payments (org, billId, recordedAt)`; unique `(org, billId, idempotencyKey)` | |
| Cash expected / per-mode totals | `payments (org, outlet, businessDayId, mode, type)`, `refunds (org, outlet, recordedDayId, mode)` | CASH-007 |
| Sales per day / attribution | `billRevisions (org, outlet, businessDayId)`, `(…attributedDayId)` | DAY-007/022 |
| Active day per outlet | `businessDays` unique partial `isActive` | DAY-015 |
| Most recent closed day | `businessDays (org, outlet, status, closedAt desc)` | Reopen target |
| One active session per table | `tableSessions` unique partial `ACTIVE` | TABLE-014 |
| Customer lookup by phone | `customers` unique `(org, phone)` | CUSTOMER-021 |
| Customer history (outlet-scoped) | `customerOutletProfiles (org, outlet, lastOrderAt)`; `orders (org, customerId, createdAt)` | S9 |
| Private link lookup | `customerOrderLinks` unique `(tokenHash)` + `(orderId)` + TTL | |
| Login / session | `users` unique partial email/phone; `sessions` unique `(refreshHash)` + TTL | |
| Effective permissions | `staffAssignments (org, userId, status)`, `permissionOverrides` uniques | |
| Audit lookups | `auditEvents` §11.10; `auditSeals` unique `(scopeKey, seq)` | SuperAdmin only |
| Menu resolution | `menuItems (org, publishState, status)`, `menuOutletOverrides (org, outlet)` prefix | one function `resolveOutletMenu` |
| Attention list / dedupe | `attentionItems` unique `(org, outlet, signalType, periodKey)`; `(…status, detectedAt)` | |
| Stale cancellation requests | `cancellationRequests (org, outlet, status, requestedAt)` | sweep |
| Draft abandonment sweep | `customerDrafts` partial `isOpen` `(org, outlet, lastActivityAt)` | |

### 13.3 Unique-constraint register (Part 27)

| # | Constraint | Collection | Kind | Why it is correct |
|---|---|---|---|---|
| U1 | normalized `email`; normalized `phone` | `users` | partial unique (`$type:'string'`) **platform-wide** | SCR-001 has no tenant selector (TD-AUTH-2); one person per identifier |
| U2 | `(org, code)` | `outlets` | unique | invoice prefix unambiguous per organization (SD-13) |
| U3 | `tablelessQrKey`, `websiteKey`, `whatsapp.businessNumberId`, `tables.qrKey` | `outlets`, `tables` | partial unique, platform-wide | public key resolves to exactly one outlet/table (§5.3) |
| U4 | ~~`(org, outlet, label)` where `status:'ACTIVE'`~~ — **withdrawn in R1** | `tables` | — | Upstream states no uniqueness scope for table labels; the constraint could reject valid data (same label on two floors). Open product decision OD-DB-26; tables are identified by `_id` |
| U5 | one `ACTIVE` session per table | `tableSessions` | partial unique | TABLE-014 |
| U6 | `(org, outlet, idempotencyOperation, idempotencyKey)` | `orders` | partial unique | ORD-006 — **Organization+Outlet+Operation+Key** |
| U7 | `(org, outlet, businessDayId, orderSeq)` | `orders` | partial unique | order number per outlet-day |
| U8 | `(org, outlet, orderId, lineNo)` | `orderItems` | unique | stable line numbering |
| U9 | `(org, outlet, orderId, idempotencyKey)` | `orderBatches` | unique | add-items dedupe |
| U10 | `(org, outlet, sourceKey)`; `(org, outlet, businessDayId, kotSeq)` | `kots` | unique | KOT-007 |
| U11 | `(org, outlet, target.type, target.id)` | `cancellationRecords` | unique | a target is cancelled once |
| U12 | one `OPEN` request per item | `cancellationRequests` | partial unique | TRD §15.4 |
| U13 | `(org, orderId)` | `bills` | unique | BILL-015 one bill per order |
| U14 | `(org, outlet, invoiceFy, invoiceSeq)`; `(org, outlet, invoiceNumber)` | `bills` | partial unique | invoice numbers never duplicate |
| U15 | `(org, billId, n)` | `billRevisions` | unique | one revision number per bill |
| U16 | `(org, billId, idempotencyKey)`; `(org, billId, reference)` partial on `type:'PAYMENT'`; `(org, billId, supersedes)` partial | `payments` | unique / partial unique | PAY-006; one provider reference per bill; one correction per entry |
| U17 | `(org, billId, idempotencyKey)` | `refunds` | unique | duplicate refund |
| U18 | one active day per outlet; `(org, outlet, dayNo)` | `businessDays` | partial unique / unique | DAY-015 |
| U19 | `(org, outlet, businessDayId, n)`; `(…, idempotencyKey)` | `dayCloseRevisions` | unique | EF-09 |
| U20 | `(org, outlet, businessDayId, revision)` | `cashReconciliations` | unique | one reconciliation per revision |
| U21 | `(org, phone)` | `customers` | unique | CUSTOMER-021 |
| U22 | `(org, outlet, customerId)` | `customerOutletProfiles` | unique | |
| U23 | `(org, orderId)`; `(tokenHash)` | `customerOrderLinks` | unique | one link per order; token lookup |
| U24 | `(org, orderId)` | `feedback` | unique | FEEDBACK-006 |
| U25 | `(org, outlet, signalType, periodKey)` | `attentionItems` | unique | idempotent detection |
| U26 | `(org, outlet, businessDayId, closeRevision)` | `dailyBriefs`, `dayRollups` | unique | job idempotency |
| U27 | `(org, outlet, menuItemId)` | `menuOutletOverrides` | unique | one override per item per outlet |
| U28 | scope=ROLE `(org, role)`; scope=USER `(org, userId)` | `permissionOverrides` | partial unique | one override doc per role/user |
| U29 | `(org, userId)` | `staffProfiles` | unique | one profile per person |
| U30 | exclusive active assignment per user; active `(org, outlet, userId)` | `staffAssignments` | partial unique | ORG-008 |
| U31 | `(tokenHash)` | `invitations` | unique | single-use token |
| U32 | `(refreshHash)` | `sessions` | unique | rotation |
| U33 | `(scopeKey, seq)`; `(eventId)` | `auditSeals` | unique | chain integrity |
| U34 | `(org, outlet, key, period)` | `counters` | unique | one counter per outlet-year |
| U35 | `(providerMessageId)`; `(objectKey)`; `(migrationId)`; `(org, outlet, draftKey)`; `(org, outlet, idempotencyKey)` on `tableOperationEvents`; `(org, importId, rowRef)` | `whatsappmessages`, `uploadedfiles`, `migrations`, `customerdrafts`, `tableoperationevents`, `menuimportcandidates` | unique | natural keys |

**Deliberately *not* unique** (uniqueness there would invent a rule): **table label (OD-DB-26)**, organization name, outlet name, GSTIN, category/item/modifier names, floor/station names, user `name`, **one-Owner-per-organization**, one active order per table (merge may create several, CON-03), one open occupancy claim per table (AMB-04/PB-11), customer name.

### 13.4 TTL and non-tenant-led indexes

| Index | Collection | Notes |
|---|---|---|
| **T** `absoluteExpiresAt` (+24 h grace, OTD-15e) | `sessions` | `[TRD §37.3]` TTL on absolute expiry |
| **T** `purgeAt` (0 s) | `customerOrderLinks` (active, `[TRD §37.3]`), `aiProposals` (active for non-executed terminal proposals only, `[TRD §31.3]`), `aiInteractions` and `whatsappMessages` (**inactive until a retention is configured**, OTD-15c/d) | TTL is **single-field only** and documents lacking the field never expire (§13.5). Full per-TTL audit: §22.3 |
| Non-tenant-led (public/auth/system lookups) | `users.email/phone`, `sessions.refreshHash/prevRefreshHash/(userId, revokedAt)`, `invitations (status, createdAt)` (system reconciler scans all tenants), `invitations.tokenHash`, `customerOrderLinks.tokenHash`, `tables.qrKey`, `outlets.*Key`, `whatsappMessages.providerMessageId`, `uploadedFiles.objectKey`, `auditEvents (action|actor|target …)`, `auditSeals`, `organizations (platform.status, createdAt)`, `migrations` | each justified in its definition |

### 13.5 Official-source verification  (source-driven)

| Claim used | Official source | Status |
|---|---|---|
| Unique constraint of a partial index applies only to documents matching the filter | MongoDB manual, *Partial Indexes* — `https://www.mongodb.com/docs/manual/core/index-partial/` | **verified** |
| `partialFilterExpression` supports equality, `$exists`, `$gt/$gte/$lt/$lte`, `$type`, `$and`, `$or`, `$in` | same page | **verified** (current docs); minimum server version for `$in`/`$or` **not verified** → equality/`$type` markers used |
| TTL index: single-field only, `expireAfterSeconds` 0…2147483647, documents without the date field never expire, array → lowest date, monitor ≈ every 60 s, ≤ 50 000 deletes per cycle per index | *TTL Indexes* — `https://www.mongodb.com/docs/manual/core/index-ttl/` | **verified** |
| Mongoose options `timestamps`, `versionKey`, `collection`, `autoIndex` (recommended `false` in production), `strict`, `optimisticConcurrency` | `https://mongoosejs.com/docs/guide.html` | **verified** (names); field-level `immutable`/`select:false` are SchemaType options — **not re-verified in this pass** |
| Multi-document transaction semantics, `readConcern: snapshot`, `TransientTransactionError` retry | MongoDB manual, *Transactions* | **not re-fetched**; relied on TRD §38.1 |

### 13.6 Growth, hot-spot and write-cost review (performance)

| Concern | Finding | Mitigation in the schema |
|---|---|---|
| **Unbounded arrays / 16 MB document limit** | Embedded arrays are all bounded: `orders.history[]` ≈ 10, `orderItems.history[]` ≈ 8, `bills.history[]`/`adjustments[]` small, `kots.lines[]`/`orderBatches.lines[]` ≤ 50 lines, `customerDrafts.lines[]` ≤ 50, `businessDays.reopenEvents[]` tiny (only the latest closed day, only while the running day is empty), `tableSessions.tableHistory[]` / `orders.tableAssociations[]` grow only with table operations. Candidate rows, audit, ledger and revisions are **separate collections** precisely because they are unbounded | §4.2 |
| **Hot document** | `businessDays` (active day) takes one `$inc txnCount`/`counters` per transaction and arbitrates Close vs Reopen. Expected rate is per outlet (≈ 5 orders/min peak, TRD §37.2), so contention is negligible; it is also what makes the reopen precondition exact and race-safe (TD-DAY-1). `orders.nextLineNo` and `counters (INVOICE)` are per-order / per-outlet-year | TD-DAY-1 |
| **Write amplification** | Every index taxes every write. Heaviest collections (`orders`, `orderItems`) carry 6–7 indexes each, each tied to a named screen/guard (§13.2); no speculative index exists; `orders.source` filter is deliberately left unindexed (§20) | IX-2 |
| **Large reads** | KDS = one indexed query capped at ~200 items; lists are cursor-paginated; aggregations start with an indexed `$match` that includes `organizationId`; analytics reads `dayRollups` from secondaries only | IX-6 |
| **Count/aggregate on Day Close** | O(orders in day) inside one transaction, served by `…businessDayId` indexes on `orders`, `orderItems`, `bills`, `billRevisions`, `payments`, `refunds` | §15 |
| **Unmeasured** | No load test has been run; targets are TRD engineering targets, not commitments. Index/shape choices should be re-validated with `explain()` against realistic volumes before production | TRD §37 |

---

## 14. Concurrency and Race Conditions

MongoDB provides single-document atomicity, unique-index enforcement and (on a replica set) multi-document transactions. **It does not solve business-level races**; each is closed by an explicit mechanism below. `[TRD §38]`

### 14.1 Mechanisms the schema provides

| Mechanism | Schema support |
|---|---|
| **Atomic conditional update** | Every state field is written with `findOneAndUpdate({_id, organizationId, outletId, <state>: from, rev: expectedRev}, {$set, $inc:{rev:1}, $push:{history}})` |
| **Optimistic concurrency** | Explicit integer **`rev`** on the aggregates listed in §6.2 (not Mongoose `__v`: `versionKey:false`, and clients must see/send `rev`). A mismatch returns `409 REV_MISMATCH` with the current object |
| **Additive-commutative operations** | Add-items and record-payment need **no** `rev`: safe by transaction + unique batch/payment keys (TRD §38.2) |
| **Unique & partial unique indexes** | §13.3 |
| **Idempotency** | §12 |
| **Day fence** | `$inc txnCount` on the active `businessDays` document inside every DAY-025 transaction (TD-DAY-1) |
| **Redis locks** | Contention reducers on multi-aggregate ops only — **never** relied upon for correctness |

### 14.2 Scenario analysis (Part 28)

| Scenario | Hazard | Protection in the schema | Loser experiences |
|---|---|---|---|
| **Two staff accept the same customer order** | double Confirmed, two initial KOTs | conditional write `{stage:'AWAITING_ACCEPTANCE', rev}` → `CONFIRMED`; unique `kots.sourceKey` | `ALREADY_IN_STATE` (converges) |
| **Two kitchen users on the same order/item** | lost update | per-**item** `rev`/`state` conditional write (items are separate documents precisely so different items do not conflict) | existing state returned |
| **Two users change table state** | double open; conflicting transitions | partial unique one `ACTIVE` session per table + conditional `tables.state` write with `rev` | existing session / `409 REV_MISMATCH` |
| **Two users add items** | duplicate or lost batch | unique `(orderId, idempotencyKey)` on `orderBatches`; `orders.nextLineNo` `$inc` + unique `(orderId, lineNo)`; bill recompute in the same transaction conditional on bill `rev` | same batch / `REV_MISMATCH` if finalize raced |
| **Concurrent bill/payment updates** | recompute race; total changes while paying | payment insert + `bills` recompute + `$inc rev` in **one transaction**; bill `rev` serializes | both distinct-key payments kept; `overpaymentPaise` shows excess |
| **Bill Reopen vs Finalize vs add-item** | edit of a finalized bill | conditional on bill `status`+`rev`; Finalized guard blocks every non-reopen edit | existing result / `409` |
| **Reopen Day vs Day Close vs new transaction** | transaction lost or mis-attributed | single transaction: running day `{status:'RUNNING', txnCount:0, rev}`→`ABSORBED` **and** target `CLOSED→REOPENED`; every business write fences the same day doc → write-conflict detection serializes | refused with state message, or the racing write retries into the reopened day |
| **Duplicate payment submission** | double entry | unique `(billId, idempotencyKey)` + partial `(billId, reference)` | existing payment (`Idempotent-Replay`) |
| **Duplicate order submission** | double order | unique `(org, outlet, 'ORDER_SUBMIT', key)` | existing order |
| **Concurrent staff availability changes** | torn attendance/availability pair | single document `staffProfiles`; `rev` conditional write; `ABSENT ⇒ UNAVAILABLE` set in the **same** `$set` | latest committed shown; no invalid pair stored |
| **Concurrent permission changes** | stale permissions in flight | override doc `rev`; `users.authzVersion` `$inc` **in the same transaction**; next request recomputes (version-keyed cache) | in-flight action may finish (ms window); next action refused (C-REVOKE) |
| **Staff reassignment vs action at old outlet** | access after move | assignment end+insert + `authzVersion` bump in one transaction; partial unique prevents a duplicate exclusive assignment | next action refused `factor:'outlet'` |
| **Refund over-refund** | refund > paid | in-transaction check `refundedPaise + new ≤ recordedPaymentsPaise` under bill `rev` (TN-2) | `STATE_INVALID` |
| **Cancellation request vs handoff** | cancel a served item | handoff transaction sets the `OPEN` request `NO_OP` in the same transaction (Served wins, ORD-093) | n/a |
| **Outlet toggle vs order** | order after close | gate reads state inside the order transaction; ms-scale tolerance accepted (TD-OUT-2) | latest committed |
| **Menu publish/override edits** | lost update | `rev`; versioned publish | `REV_MISMATCH` |
| **AI proposal double confirm** | double execution | conditional `PROPOSED→CONFIRMED`, `argsHash`, `ownerId`, TTL | existing result |

### 14.3 Versioning and retry

| Aspect | Rule |
|---|---|
| Versioned documents | §6.2 list. `rev` starts at 1 and only ever `$inc`s by 1 inside a conditional write. Append-only collections carry **no** `rev` (they never change). |
| Server retry | Only `TransientTransactionError` / `UnknownTransactionCommitResult` / write conflicts — ≤ 5 attempts with jitter. **Never** retries a business refusal. |
| Client retry | Network/5xx/timeout with the **same** `Idempotency-Key`; never auto-retries 4xx (409/403/400 need user/state resolution). |
| Strong vs eventual | Writes, money, Day Close, idempotency, audit, authorization = strong (primary). Realtime, rollups, public status caches, briefs, attention = eventual and **never the basis of a mutation**. |

---

## 15. MongoDB Transaction Boundaries

**Rule.** A multi-document transaction is used **only where an invariant spans documents**; a single-document conditional write is preferred. Transactions run with `readConcern: snapshot`, `writeConcern: majority`, are kept short (< 1 s), perform **no network I/O inside**, and the audit append is **inside** (P11). After-commit events (realtime, jobs) are **outside**. Indexes and collections must exist **before** the transaction (migration step, §13.1 IX-4). `[TRD §38.1, §32.5]`

| Operation | Atomic? | Documents written together | Why |
|---|---|---|---|
| Order creation (+items) | **Yes** | `orders`, `orderItems` (snapshots), `businessDays` (`$inc txnCount`, `counters.orderSeq`), `customerOrderLinks` (customer orders), `customers`/`customerOutletProfiles` upserts (when name+phone), `occupancyClaims` release; for staff commit also **initial `kots`** + items `PENDING→SENT` + `tables.state` | Order, lines, number, fence, link and KOT must exist together or not at all |
| Order acceptance / rejection | **Yes** | `orders` (stage), `orderBatches`/`orderItems`, **initial/additional `kots`**, items → `SENT`, day fence | KOT-001/007: Confirmed and KOT in one transaction |
| Add items | **Yes** | `orderBatches`, `orderItems`, `orders.nextLineNo`, additional `kots`, `bills` recompute (+`rev`), `tables.state` (Billing→Occupied), day fence | TD-ORD-2/ORD-080; bill totals must follow lines |
| Kitchen item transition | **Yes (small)** | `orderItems` (state/timestamps/history), `orders.stage` (`deriveOrderStage`) | label and items must never disagree |
| Item cancellation | **Yes** | `orderItems`, `cancellationRecords`, cancellation `kots` (if Sent), `cancellationRequests` (if accepted), `orders.stage`, `bills` recompute, `auditEvents`, day fence | ORD-082/090, AUDIT |
| Handoff (Served/Picked Up) | **Yes** | `orderItems`, `cancellationRequests` (`OPEN→NO_OP`), `orders.stage` (→`COMPLETED`), day fence | ORD-093: Served wins |
| Bill create | **Yes** | `bills`, `tables.state` (T5), day fence | |
| Bill finalization | **Yes** | `bills` (totals, invoice), `counters` (`$inc`), `billRevisions`, day fence | gap-free invoice numbering; frozen snapshot |
| Bill reopen | **Yes** | `bills`, `auditEvents`, day fence | BILL-013/014 |
| Bill cancel | **Yes** | `bills` (`status`, `cancellation`, `rev`), `billRevisions` (`CANCELLATION`, negative `deltaPaise`), `auditEvents`, day fence | PO-5; the K1 / status guard is read inside the transaction |
| **Payment application** | **Yes** | `payments`, `bills` (recomputed figures + `rev`), day fence | PAY-006/012 |
| **Refund** | **Yes** | `refunds` (`deductsFromNet`), `bills` (`refundedPaise`, `overpaymentPaise`, and `status` `FINALIZED→REFUNDED` on the first refund; `rev`), `auditEvents`, day fence | TN-2 integrity check; status flip must be atomic with the ledger insert |
| Table transfer / merge / split / move | **Yes** | involved `tables`, `tableSessions`, `orders`/`orderItems` (association/origin), `tableOperationEvents`, day fence | TABLE-016/017/018 |
| Table open / clear | **Yes** | `tableSessions`, `tables` (+`occupancyClaims`) | T1/T7 |
| **Day Close** | **Yes** | `businessDays` (close + insert next `RUNNING`), `dayCloseRevisions`, `cashReconciliations`, `auditEvents` | AF-052/DAY-010 atomicity |
| **Reopen Day / re-close** | **Yes** | two `businessDays`, `dayCloseRevisions`/`cashReconciliations` (re-close), `auditEvents` | DAY-015/021 |
| **Permission change** | **Yes** | `permissionOverrides`, `users.authzVersion` (one or many), `auditEvents` | next action must see the new version |
| Staff reassignment / deactivation | **Yes** | `staffAssignments` (end+insert), `users`, `sessions` (revoke), `auditEvents` | C-REVOKE |
| **Invitation redemption** | **Yes** | `invitations` (→`REDEEMED`), `users.passwordHash` | single use |
| Credential reset | **Yes** | `users`, `sessions` revoke, `auditEvents` | AUTH-003 |
| Menu publish / import publish | **Yes** | `menuItems`/categories, `organizations.menuVersion`, `menuImports`, `auditEvents` | TRD §20.5, §31.4 |
| Outlet Open/Closed toggle | **Yes (small)** | `outlets`, `outletStateEvents` | |
| Menu override change | **Yes (small)** | `menuOutletOverrides`, `outlets.overrideVersion`, `auditEvents` | |

**Not transactional (single-document or idempotent):** staff availability/attendance, menu item/category/modifier edits (single doc + `rev`), draft upsert, draft abandonment sweep, attention create/dismiss, feedback insert, customer upsert, link expiry updates, session rotation, AI interaction/brief inserts, import-candidate edits, rollup rebuilds.

---

## 16. Immutability, Snapshots and Historical Reconstruction

### 16.1 What is snapshotted, where, and what it is protected from

| Snapshot | Stored in | Captured when | Protected from |
|---|---|---|---|
| Item identity, price (after outlet override), modifier deltas, tax rate + components, station, prep time, versions | `orderItems.snapshot` (and `orderBatches.lines[].snapshot` until materialized) | When the line is added (any channel, any time) | Menu, price, tax, modifier, override and station edits (MENU-016/017) |
| Customer contact as entered | `orders.customerContact` | Submit | Later customer renames |
| Table label, order number, line text | `kots` | KOT issue | Later table transfer/rename/edit (ORD-090) |
| Finalized lines, adjustments, totals, tax breakdown, `calcVersion`, invoice number | `billRevisions` | Each finalization | Reopen, re-finalization, menu/charge/tax config changes (BILL-011) |
| Day totals (components, signed gross/net), warnings, confirmation flag | `dayCloseRevisions` | Day Close | Later corrections — never mutate a closed day (PO-6) |
| Each revision's sales contribution (`previousTotalPaise`, `deltaPaise`) and each refund's `deductsFromNet` | `billRevisions`, `refunds` | At finalization / cancellation / refund | Re-finalization, cancellation, later status changes |
| Cash inputs, expected, counted, variance | `cashReconciliations` | Day Close | Any later payment correction |
| Facts + metrics + model metadata | `dailyBriefs` | Brief generation | Later recomputation |
| Association history | `orders.tableAssociations[]`, `tableSessions.tableHistory[]` | Each table operation | Table operations rewriting ownership |
| Role at action time | `ActorRef.role` | Each action | Later role changes |

### 16.2 Reconstructability guarantee

> A historical financial figure is reconstructed **only** from `orderItems.snapshot`, `billRevisions`, `payments`, `refunds`, `dayCloseRevisions`, `cashReconciliations`. **No query that reconstructs history may read `menuItems`, `modifierGroups`, `menuCategories`, `menuOutletOverrides`, `outlets.charges`, `outlets.paymentModes` or any tax configuration.** Deleting (soft-deleting) any master record must leave every historical bill, KOT, day-close and report byte-for-byte reproducible. `[TRD §20.4, §25.4]`

Enforcement: ① `snapshot` subtree is `immutable:true`; ② append-only plugin on class 2/3/4 collections (§19.6); ③ a code-review/lint rule forbids importing menu/outlet-config models into `billing`, `day-close` and `analytics` historical paths; ④ a generated test mutates every master field and asserts bills/KOTs/day-closes are unchanged.

### 16.3 Corrections preserve history

| Case | Mechanism |
|---|---|
| Finalized/paid bill correction | Reopen (reason, audited) → edit → re-finalize ⇒ revision `n+1`; revisions `1…n` untouched |
| Payment correction | New `CORRECTION` entry with `supersedes`; original unchanged |
| Refund | New record; never edits payment or bill revision |
| Day Close correction | Reopen Day → re-close appends revision `n+1` + new cash reconciliation; earlier ones unchanged |
| Item changed after KOT | `CANCELLATION` KOT + `ADDITIONAL` KOT; issued KOT never edited |
| Table restructuring | `tableOperationEvents` + association history; bill ownership stays with the order |

---

## 17. Soft Delete, Retention and Archival (Part 30)

**Principle.** *Business records are never physically deleted.* Hard deletion exists only for **non-business bookkeeping** (TTL collections) and S3 objects. Soft delete (`status: DELETED` + `deletedAt`, the boilerplate/TRD C10 convention) applies to **configuration entities only**; history-bearing business records have no delete path (SD-18, TRD F9). **No regulatory retention period is invented**; every period below is either "indefinite" or a labelled **engineering default**. `[TRD §32.7, §22.5, OTD-9]`

| Entity | Policy | Notes |
|---|---|---|
| organizations, outlets | **Retained indefinitely**; no delete | Suspension/deactivation never deletes data (ONB-014) |
| users, staffAssignments, staffProfiles | **Retained**; users `INACTIVE` | History attributes actions to users; reassignment preserved |
| permissionOverrides | Retained (cleared = empty sets); history in audit | |
| menuCategories, menuItems, modifierGroups, kitchenStations, floors, tables | **Soft-deleted** (`status: DELETED`) | Orders keep their own snapshots, so deleting a config entity never alters history |
| menuOutletOverrides | Retained; never used for history | |
| menuImports / candidates | **Retained** (Phase 1 default); purge of discarded/failed drafts unspecified → OD-DB-12 | S3 sources/artifacts expire after **90 days** (engineering default; not business records); `uploadedFiles` records kept |
| orders, orderBatches, orderItems, cancellation*, kots | **Immutable/retained indefinitely** | Includes abandoned Drafts (INV-04, OTD-9) |
| customerDrafts, occupancyClaims | **Retained** | Archival is OTD-9 |
| bills, billRevisions, billPrintEvents | **Retained indefinitely**; revisions immutable | |
| payments, refunds | **Immutable, retained indefinitely** | |
| businessDays, dayCloseRevisions, cashReconciliations | **Immutable, retained indefinitely** | |
| auditEvents, auditSeals | **Immutable, retained indefinitely** | DB role has no `update/remove` |
| outletStateEvents, tableOperationEvents | **Immutable, retained** | |
| customers, customerOutletProfiles, feedback | **Retained** | PII; **data-subject erasure vs financial/audit retention is not defined upstream → OD-DB-25** |
| dayRollups | Derived — rebuildable; retained | |
| dailyBriefs, attentionItems | Retained | |
| **sessions** | **TTL** on `absoluteExpiresAt` `[TRD §37.3]` + 24 h grace (OTD-15e) | not a business record |
| **customerOrderLinks** | **TTL** `purgeAt = expiresAt + grace` `[TRD §37.3]` (expiry: terminal + 30 d, ≤ 90 d from creation `[TRD §30.2]`; grace = OTD-15a) | Order itself retained |
| **aiProposals** | **TTL** only for `EXPIRED`/`REJECTED`/`FAILED` proposals (grace OTD-15b); **`EXECUTED` proposals are retained** (SD-47) | Confirmation evidence stays explainable |
| **aiInteractions** | **Retained** until OTD-15c is decided (TTL index exists but inactive) | metadata only; period not defined upstream |
| **whatsappMessages** | **Retained** until OTD-15d is decided (TTL index exists but inactive) | contains PII; period and dedupe window not defined — see OD-DB-25 |
| invitations | Retained | token hash kept to enforce single use |
| counters, migrations | Retained | |

**Never allowed:** a destructive operation that erases financial, audit, order, payment, refund or day-close history — including cascade deletes, `deleteMany` on these collections, and dropping them. The append-only plugin and the audit DB role enforce this at the application and database layers respectively.

---

## 18. Security Review of the Stored Data

### 18.1 Isolation

Tenant/outlet isolation per §5 and TI-1. Schema-level support: immutable `organizationId`/`outletId`; tenancy-guard plugin (throws on a missing `organizationId` in any `find/update/delete/aggregate` and on save/insertMany); **all** compound indexes tenant-led except the justified public/auth lookups; customer link principals can address only their `orderId`; AI scope ≤ invoking Owner; SuperAdmin platform reads are `platform:true`-tagged read projections that never bypass S1–S5 for restaurant routes.

### 18.2 Sensitive-field register

| Field(s) | Class | Storage | Never exposed through |
|---|---|---|---|
| `users.passwordHash` | credential | bcrypt (cost 12, ≤ 72 bytes), **`select:false`** | any API, log, audit `before/after`, Sentry, `toJSON` |
| `sessions.refreshHash`, `prevRefreshHash` | credential | SHA-256 of a 256-bit token, `select:false`; raw token never stored | any API/log/audit |
| `invitations.tokenHash`, `customerOrderLinks.tokenHash` | credential | SHA-256, `select:false` | any API/log/audit; raw token only in the issuing response/email job |
| `tables.qrKey`, `outlets.tablelessQrKey`/`websiteKey` | public identifier | clear (printed on QR) — 128-bit, unguessable; rotation = revocation | non-privileged exposure is intended |
| `users.email/phone`, `customers.phone/name`, `orders.customerContact`, `whatsappMessages.phone/text`, `sessions.remoteAddress` | **PII** | Atlas encryption at rest | logs (masked: phone last 3 digits), Sentry, realtime to non-privileged rooms, audit (excluded unless action is customer-specific, then masked), customer-safe projection of *other* customers |
| `payments.reference`, `refunds.providerReference` | semi-sensitive | as supplied, ≤ 64 chars restricted charset | logs/audit show **last 4** only |
| `auditEvents.*` | restricted | insert/find-only role | Owners, Managers, customers — SuperAdmin only |
| `aiProposals.args` | restricted | validated schema; TTL | model-visible beyond the summary |

**Never stored anywhere:** plaintext passwords; raw refresh/invitation/link tokens; card numbers/CVV/UPI PINs (the API rejects any field outside the schema; `CARD` records only that a card was used); API keys; webhook secrets; model prompts (TD-AI-4); full payment references in audit.

### 18.3 Audit redaction

Each action code has a **field allow-list** for `before`/`after`; fields not listed cannot enter the record. Excluded categories: credentials/hashes, tokens/secrets, API keys, full card data, full payment references (last 4), webhook secrets, prompts; PII only for customer-specific actions and then masked. `[TRD §32.4]`

### 18.4 Serialization and exposure rules

| Rule | Statement |
|---|---|
| SE-1 | Every schema defines a `toJSON`/`toObject` transform that removes `__v` (absent anyway), converts `_id→id`, and **deletes** every `select:false` field. Services return **DTOs/projections**, never raw documents. |
| SE-2 | `select:false` fields: `passwordHash`, `refreshHash`, `prevRefreshHash`, `tokenHash` (×2). They are loaded only by the explicit auth/redemption service path (`.select('+passwordHash')`). |
| SE-3 | **Customer-safe projection** (link pages): order `stage`, item names/qty/status, Takeaway/handoff label, totals + bill view, rejection reason. **Excluded:** `createdBy`, `acceptedBy`, `history[].actor`, `hold`, internal notes, audit data, any other customer, `idempotency*`, `requestHash`, staff identities. |
| SE-4 | Strict schemas (`strict: true`; unknown paths dropped; request bodies are Joi-strict), `express-mongo-sanitize` at the edge; `Mixed` is allowed **only** for audit `before/after` and `aiProposals.args` (both validated/allow-listed). |
| SE-5 | A `409`/`403` response never carries cross-outlet object data (C-REFUSAL); `current`/`rev` in `409 REV_MISMATCH` is returned only for objects the caller may see. |

### 18.5 Database roles

| DB user | Rights |
|---|---|
| Application (`api`, `worker`, `socket`) | readWrite on business collections **except** `auditevents`/`auditseals` (insert+find only) and no index/collection administration |
| Audit sealer | insert+find on `auditseals`, find on `auditevents` |
| Migration task | `createIndex`/`createCollection`/`collMod` + data migration scripts; used only before rollout |
| Analytics reads | same application user with `readPreference: secondaryPreferred` on rollup collections only |


### 18.6 Observability support in the data model

The schema stores only what operation and audit need: `requestId` on every `HistoryEntry`, on `cancellationRecords`, `outletStateEvents` and `auditEvents` (and `idempotencyKey` where one exists), so one request is reconstructable across logs, Sentry, jobs and records (TRD C21, §36.3); `ActorRef.via` names the entry point (`WEB`/`AI`/`SYSTEM`). Metrics, logs and traces are **not** stored in MongoDB; `aiInteractions` is a TTL metadata log only. No telemetry field carries a secret or unmasked PII (§18.2). The TRD metric catalogue (`tenant_scope_violation_total`, queue depth, etc.) needs no collection.

---

## 19. Mongoose Implementation Mapping  (conventions only — no code)

### 19.1 Naming and layout

| Item | Contract |
|---|---|
| Schema/model file | `app/models/<module>/<noun>Model.js` (boilerplate `<noun>Model.js`, sub-folder per module — TRD C2); barrel `app/models/index.js` re-exports `<Noun>Model` |
| Exported name | singular noun + `Model` (`OrderItemModel`) — TRD §5.3 |
| Collection | explicit `collection: '<physical lowercase plural>'` schema option (§7) — never Mongoose's implicit pluralization |
| Constants | enums in `app/utils/constants/<area>.js` as frozen objects of **string** values (§6.4); state machines in `app/utils/constants/stateMachines.js` (TRD §15.12); permission catalogue in `permissionCatalogue.js` |
| Schema-version registry | boilerplate `DATABASE_VERSIONS` retained |

### 19.2 Schema options

`timestamps: true` (append-only: `{ createdAt: true, updatedAt: false }`; `auditEvents` uses `timestamps:false` with `occurredAt`) · `versionKey: false` · `strict: true` · `autoIndex: false` in production (index creation by the migration task) · **`optimisticConcurrency` is deliberately *not* used**: concurrency is the explicit `rev` conditional-filter protocol of TRD §38.2, which must include the state field and be visible to clients.

### 19.3 References and ids

`ObjectId` for every reference; field `<noun>Id`; `ref` = physical collection name (boilerplate style `ref: 'users'`). Public tokens are never ObjectIds. Re-pointing (`tableId`, `tableSessionId`) is allowed only where §11 marks the field mutable.

### 19.4 Types, validation, enums

| Topic | Rule |
|---|---|
| Money | one shared custom SchemaType/validator **`Paise`**: `Number`, `Number.isSafeInteger`, `min: 0` (signed variants `PaiseSigned` for `roundOffPaise`, `variancePaise`, `deltaPaise`, `correctionDeltaPaise`, `grossSalesPaise`, `netSalesPaise`, `priceDeltaPaise`). No `Decimal128`, no `Double` fractions |
| Rates / qty | `Bps` = safe integer ≥ 0; `qty` safe integer ≥ 1 |
| Enums | `enum: Object.values(CONST)` (string) — boilerplate idiom |
| Validators | Only **database-layer invariants**: `Paise`, `userType⇒organizationId`, `role` required iff restaurant user, `grants∩denies=∅`, `ABSENT⇒UNAVAILABLE`, variants-xor-`basePricePaise`, `TaxSnapshot` components sum, `min≤max`, ≥1 of email/phone. Everything else is Joi at the route layer (TRD C6) |
| Text | `maxlength` on every free-text field (§11) |
| Embedded types | `_id:false` sub-schemas shared from one file (ActorRef, Reason, HistoryEntry, TaxSnapshot, ModifierSnapshot, ItemSnapshot, BillTotals, Address, Contact) |
| Maps | `Map<String,Number>` only for `dayRollups.metrics`, `dailyBriefs.metrics`, `customerOutletProfiles.itemCounts` (keys never user-controlled) |

### 19.5 Immutability, plugins, hooks

| Mechanism | Applied to |
|---|---|
| `immutable: true` | `organizationId`, `outletId`, `orderItems.snapshot` subtree, `orders.source`, `orders.idempotency*`, `kots.*`, all ledger fields |
| **Tenancy-guard plugin** (TD-TENANT-2) | every collection with `organizationId` (`organizations` guards on `_id`; `users`/`sessions`/`auditEvents`/`auditSeals` accept `platform:true` only through registered platform functions); `migrations` exempt by registration |
| **Append-only plugin** (F9) | `outletstateevents`, `auditevents`, `auditseals`, `tableoperationevents`, `cancellationrecords`, `kots`, `billrevisions`, `billprintevents`, `payments`, `refunds`, `daycloserevisions`, `cashreconciliations`, `feedback`, `aiinteractions`, `dailybriefs`, `migrations` — hooks on `update*`, `delete*`, `replaceOne`, `findOneAndUpdate/Delete`, `bulkWrite` update/delete ops **throw** |
| Conditional-write helper | one shared `transition(model, scope, id, from, to, patch)` implementing M2 (filter on `_id`, tenant ids, state, `rev`; `$inc rev`; `$push history`) |
| Normalizers | setters for `email` (lower+trim), `phone` (E.164), `nameNormalized` |

### 19.6 Read patterns and population

`.lean()` with explicit projections for reads; `populate` is **not** used on hot paths (KDS, order lists): use batched `$in` loads or the denormalized snapshot fields already present; cursor pagination for large lists (`TD-API-1`); no unbounded `find`; aggregations start with an indexed `$match` containing `organizationId`. Virtuals (not persisted): `id`, `orders.isTakeaway` (`tableId == null`), `bills.isPartiallyPaid` (`recorded>0 && outstanding>0`), `bills.isUnresolved`; whether an outlet accepts orders is **not** a virtual — the operational gate reads live state.

### 19.7 Indexes and discriminators

Indexes are declared **only** with `schema.index({...}, options)` after the schema (no field-level `index:true`, avoiding the boilerplate's duplicate-index pattern), each with a comment naming its query (§11). **No discriminators**: `payments` uses a `type` field and `kots` a `kind` field in one collection because uniqueness, indexes and ledger aggregation span both; discriminators would split keys and complicate partial indexes without benefit.

### 19.8 Sessions and transactions

Models are written to receive an optional `session` through query/save options; no model opens its own transaction (services own boundaries, §15). Connection: `retryWrites=true&w=majority`, pool sizes per role (api 30 / worker 15 / socket 5, OTD-10), `readPreference: primary` except the analytics read helper.

### 19.9 Model → file → plugins

| Collection | Model export | File | Plugins |
|---|---|---|---|
| organizations | `OrganizationModel` | `models/tenancy/organizationModel.js` | T(_id) |
| outlets | `OutletModel` | `models/tenancy/outletModel.js` | T |
| outletStateEvents | `OutletStateEventModel` | `models/tenancy/outletStateEventModel.js` | T, A |
| users | `UserModel` | `models/identity/userModel.js` | T(platform-aware) |
| staffProfiles | `StaffProfileModel` | `models/staff/staffProfileModel.js` | T |
| staffAssignments | `StaffAssignmentModel` | `models/staff/staffAssignmentModel.js` | T |
| permissionOverrides | `PermissionOverrideModel` | `models/identity/permissionOverrideModel.js` | T |
| sessions | `SessionModel` | `models/identity/sessionModel.js` | T(platform-aware) |
| invitations | `InvitationModel` | `models/identity/invitationModel.js` | T |
| auditEvents / auditSeals | `AuditEventModel` / `AuditSealModel` | `models/audit/…` | T(platform-aware), A |
| menuCategories / menuItems / modifierGroups | `MenuCategoryModel` / `MenuItemModel` / `ModifierGroupModel` | `models/menu/…` | T |
| menuOutletOverrides | `MenuOutletOverrideModel` | `models/menu/menuOutletOverrideModel.js` | T |
| menuImports / menuImportCandidates | `MenuImportModel` / `MenuImportCandidateModel` | `models/aiMenuImport/…` | T |
| uploadedFiles | `UploadedFileModel` | `models/uploads/uploadedFileModel.js` | T |
| floors / tables / tableSessions / occupancyClaims | `FloorModel` … | `models/tables/…` | T |
| tableOperationEvents | `TableOperationEventModel` | `models/tables/…` | T, A |
| customerDrafts | `CustomerDraftModel` | `models/customerOrdering/customerDraftModel.js` | T |
| orders / orderBatches / orderItems | `OrderModel` … | `models/order/…` | T |
| cancellationRecords | `CancellationRecordModel` | `models/order/…` | T, A |
| cancellationRequests / kitchenStations | `CancellationRequestModel` / `KitchenStationModel` | `models/kitchen/…` | T |
| kots | `KotModel` | `models/kitchen/kotModel.js` | T, A |
| bills | `BillModel` | `models/billing/billModel.js` | T |
| billRevisions / billPrintEvents / payments / refunds | `…Model` | `models/billing/…` | T, A |
| businessDays | `BusinessDayModel` | `models/dayClose/businessDayModel.js` | T |
| dayCloseRevisions / cashReconciliations | `…Model` | `models/dayClose/…` | T, A |
| dayRollups | `DayRollupModel` | `models/analytics/dayRollupModel.js` | T |
| customers / customerOutletProfiles / customerOrderLinks | `…Model` | `models/customers/…` | T |
| feedback | `FeedbackModel` | `models/customers/feedbackModel.js` | T, A |
| aiProposals / aiInteractions / dailyBriefs | `…Model` | `models/ai/…` | T (A for the latter two) |
| whatsappMessages | `WhatsappMessageModel` | `models/whatsapp/whatsappMessageModel.js` | T |
| attentionItems | `AttentionItemModel` | `models/attention/attentionItemModel.js` | T |
| counters | `CounterModel` | `models/common/counterModel.js` | T |
| migrations | `MigrationModel` | `models/common/migrationModel.js` | A (exempt from T) |

`T` = tenancy-guard; `A` = append-only.

---

## 20. API / Data-Contract Compatibility Check (Part 38)

Checked against TRD §16 (conventions, error/`409` data, endpoint families, contracts) and §17.5 (event envelope). **No field was added solely because a hypothetical API might need it.**

| API need (TRD §16.2) | Schema support | Verdict |
|---|---|---|
| **Create** with `Idempotency-Key` | Durable keys on `orders`, `orderBatches`, `payments`, `refunds`, `dayCloseRevisions`, `tableOperationEvents`; natural keys elsewhere (§12) | ✔ |
| **Update/PATCH with `expectedRev` / `If-Match`**; `409 REV_MISMATCH` with `data:{current, rev}` | `rev` on every mutable aggregate (§6.2); full current document is loadable | ✔ |
| **State transitions** (`POST /orders/{id}/accept`, `/bills/{id}/finalize`, `/days/{id}/close` …) | State field + `rev` + `history[]` per machine (§10.2); `ALREADY_IN_STATE` decidable by re-read | ✔ |
| **Detail** reads returning `rev` and derived facts (`kot`, `paymentStatus`, `outstandingPaise`, closed-day record — C-POST) | `bills.paymentStatus/outstandingPaise/overpaymentPaise`, `kots`, `dayCloseRevisions` + `cashReconciliations` | ✔ |
| **List + cursor pagination** (`after`, `limit`, default newest-first with `_id` tiebreak) for orders, bills, audit, KDS history, feedback | Indexes end in `createdAt`/`occurredAt` (+`_id`): orders `(org,outlet,createdAt)`, bills `(org,outlet,createdAt)`, `auditEvents`, `feedback (org,outlet,createdAt)`, KDS `(org,outlet,state,priority,createdAt)` | ✔ |
| **Filtering** (`status`, `from`, `to`, `tableId`, `source`, `outletId`) | `status/stage` ✔ (indexed), `from/to` ✔ (`createdAt` range), `tableId` ✔ (`orders (…tableId, stage)`), `outletId` ✔ (`$in: allowedOutletIds`). **`source` has no dedicated index** — it filters on top of the `(org,outlet,createdAt)` range; add `(org,outlet,source,createdAt)` only if profiling shows a scan (IX-2: no speculative index) | ✔ (note) |
| **Sorting** (whitelisted `field:dir`) | Whitelist is bounded to indexed fields (`createdAt`, `orderSeq`, `stage`, `priority`) | ✔ |
| **Money** `…Paise` integers | §6.5 dictionary; Joi `integer().min(0).max(MAX_SAFE_INTEGER)` matches `Paise` validator | ✔ |
| **Ids / public identifiers** | ObjectId; opaque keys/tokens as specified (§6.6) | ✔ |
| **Errors with machine detail** (`factor`, `code`, `current`) | State, `rev`, outlet/platform status, activation and unique-constraint outcomes are all readable fields | ✔ |
| **Customer submit** (`qrKey`, `draftKey`, optional `customer`, items with `expectedUnitPricePaise`) | `tables.qrKey`/`outlets.tablelessQrKey`/`websiteKey` resolution; `customerDrafts.draftKey`; `orders.customerContact`/`customerId` only when no table; `expectedUnitPricePaise` is request-only (not stored) | ✔ |
| **Payment** `{amountPaise, mode, reference?}` → `bill:{paymentStatus, outstandingPaise, overpaymentPaise}` | `payments` + derived bill figures | ✔ |
| **Day Close** `{countedCashPaise, confirmUnresolved, notes}` → closed-day record + next day id | `dayCloseRevisions.warnings.confirmedUnresolved`, `cashReconciliations`, `businessDays` next row | ✔ |
| **Audit endpoint** filters: organization, outlet, actor, action, target, date range | `auditEvents` indexes (§11.10) | ✔ |
| **Realtime envelope** (`id`, `seq`, `rev`, `entity`, `patch`) | `rev` on entities ✔; `seq` is Redis per-outlet (**not persisted** — by design); `patch` data (`state`, `station`, `orderId`, `tableLabel`) are readable/joinable fields; `tableLabel` after a transfer is a live join of `orders.tableId → tables.label` | ✔ |
| **Soft DELETE for config entities** (TRD §16.2: "soft, status=3") | Config entities carry `status ∈ {ACTIVE, DELETED}` + `deletedAt`; API `DELETE` sets `status: DELETED` (value representation per UC-2) | ✔ aligned (UC-14 resolved) |
| **Enum spelling on the wire** (TRD examples show `KOT_Sent`, `AwaitingAcceptance`, `NotPaid`, `Ready`) | Persisted `UPPER_SNAKE` `[TRD §5.2 C9]`; wire spelling is fixed at OpenAPI generation as a 1:1 case transform of the same constant keys | ✔ resolved (UC-2) |

---

## 21. UI/UX Compatibility Check (Part 39)

The UI/UX Design Brief is used **only** to verify that the data model can support the approved presentation. **No field, state or rule was added because something "looks" like it needs one.** Derived UI labels (*Partial*, *Split*, *Outstanding*, *Overpaid*, *Takeaway*) are computed, never stored (brief inconsistency I6; TRD §46.2).

### 21.1 `StatusBadge` domains → persisted state

| Brief domain | Source of truth | Persisted? |
|---|---|---|
| order | `orders.stage` | ✔ |
| item | `orderItems.state` (+ `hold.isActive` as an adornment) | ✔ |
| cancellation-request | `cancellationRequests.status` | ✔ |
| bill | `bills.status` | ✔ (includes `REFUNDED`, R2) |
| payment | `bills.paymentStatus` (derived) + derived *outstanding/overpaid/partial/split* | ✔ derived |
| menu-availability | `menuOutletOverrides.availability` + `menuItems.publishState` | ✔ |
| staff-availability / attendance | `staffProfiles.availability` / `.attendance` | ✔ |
| table | `tables.state` | ✔ |
| outlet | `outlets.availability.state` + `outlets.activation.state` | ✔ |
| restaurant | `organizations.platform.status` | ✔ |
| day | `businessDays.status` | ✔ |
| attention | `attentionItems.status` | ✔ |
| priority | `orderItems.priority` | ✔ |
| import | `menuImports.status` | ✔ |
| submission (pending/failed/succeeded) | **client-only** offline-queue state (TRD §19.7) | ✘ not persisted (by design) |
| connection (connected/disconnected) | **client-only** realtime state | ✘ not persisted |

### 21.2 Screens/features → data

| UI need | Data support |
|---|---|
| Tables, filters, sort, pagination (`DataTable`) | §13.2/§20 indexes and cursor keys |
| KDS queue (grouped by order, timers, priority, station chip) | `orderItems` index; `sentAt/preparingAt/readyAt` timers (SD-10); station via `snapshot.stationId` join |
| Customer history (SCR-031) | `customers` + `customerOutletProfiles` (outlet-scoped) + `orders (org, customerId, createdAt)`; table-QR orders have no customer by design |
| Bill history & correction (SCR-026/027), unresolved bills (SCR-005) | `bills` indexes; `billRevisions` for correction history; `payments`/`refunds` ledger; **OD-UX-10 (past-bill discovery) is a UI access pattern over these — it creates no new rule** |
| Floor tiles (state, label, session summary) | `tables`, `tableSessions`, `orders` by session |
| Attention list / brief / what-changed | `attentionItems`, `dailyBriefs`; *What Changed?* computed on demand (not stored) |
| Dashboards (Owner/Manager) | `dayRollups` (secondary reads) + live running-day aggregations on indexed ledgers |
| Day Close / Reopen (SCR-028/029) | `businessDays`, `dayCloseRevisions.warnings`, `cashReconciliations`; close-preview is a read, no new store |
| Staff schedule/attendance/availability (SCR-015/017/018) | `staffProfiles`, `staffAssignments` |
| Permission customization (SCR-016) | `permissionOverrides` (grants/denies) + code-resident catalogue |
| Customer order tracking / feedback / reorder (link pages) | `customerOrderLinks` → customer-safe projection (§18.4 SE-3), `feedback`, `orders.reorderOfOrderId` |
| Suspended/closed/not-activated QR pages | `GET /public/qr` status derived from `organizations.platform.status`, `outlets.activation/availability` |
| **No notification centre, profile or settings page** (APP_FLOW §29.0, brief) | **No collection exists for them** (§7.1) |

---

## 22. Decision Classification Register (Part 40)

### 22.1 Schema decisions `[SCHEMA DECISION]` — implementation-driven, no product behaviour added

| ID | Decision | Reason |
|---|---|---|
| SD-1 | Logical camelCase vs physical lowercase plural collection names; explicit `collection` option | Boilerplate lowercase plural; avoid implicit Mongoose pluralization |
| SD-2 | Persisted enums are **UPPER_SNAKE strings** | Now canonical `[TRD §5.2 C9, amended 2026-10-08]` (UC-2 resolved) |
| SD-3 | `rev` also on `staffProfiles`, `attentionItems`, `aiProposals`, `menuImports`, `customerDrafts`, `cancellationRequests` | Their transitions are conditional writes (M2) |
| SD-4 | `Address` sub-document field set | ONB-021 names "address/location" only |
| SD-5 | `recordedPaymentsPaise` as the stored name of TRD `recordedTotal` | Avoids implying the `PAID` status; keeps the `…Paise` convention |
| SD-6 | No generic idempotency collection; `requestHash` persisted on durable records | One truth; detect key reuse after Redis loss |
| SD-7 | Tenancy guard uses `_id` for `organizations` | The organization *is* the tenant id |
| SD-8 | Customer Drafts in `customerDrafts`; the order `DRAFT` stage is staff-created only | Reconciles TRD §14 #28 with §15.1; selections-only cart needs no snapshot (UC-5) |
| SD-9 | `staffProfiles` per person; single schedule window; no availability history | STAFF-001…009; no history/payroll requirement |
| SD-10 | Denormalized item event timestamps (`sentAt…cancelledAt`) | KDS timers and kitchen-slowdown median without scanning `history[]` |
| SD-11 | `users.authzVersion` as the durable source of the Redis version | Version bump must be transactional with the change |
| SD-12 | `permissionOverrides.catalogueVersion` | Detect overrides validated against an older catalogue |
| SD-13 | `outlets.code` immutable, unique per organization | Invoice prefix must stay valid (PO-TRD-01 #5) |
| SD-14 | Public keys (QR/website) stored in clear | Printed identifiers; unguessable; rotation = revocation |
| SD-15 | `charges` configuration structure | PO-TRD-01 #3 names the concept, not the shape |
| SD-16 | `users.organizationId` conditional on `userType` | SuperAdmin is a platform principal |
| SD-17 | `staffAssignments.isExclusive`, `endReason` | ORG-008 single current outlet needs an indexable marker |
| SD-18 | Config-entity soft delete = `status: DELETED` + `deletedAt` `[TRD §16.2, C10]`; business records have no delete path `[TRD F9]` | Aligns with the adopted boilerplate convention; never delete history (INV-04) (UC-14) |
| SD-19 | `sessions.prevRefreshHash`, `revokedReason` enum | Refresh-reuse detection (TD-AUTH-3) |
| SD-20 | `invitations.purpose`; transactional resend instead of an index | ONB-010/013 |
| SD-21 | `Mixed` only for audit `before/after`; `action` is a free string | Allow-listed payloads; no migration to add a code |
| SD-22 | `auditSeals.scopeKey`; sealer trailing window | ObjectId order is not globally monotonic |
| SD-23 | `menuItems.nameNormalized` | AI-016 duplicate detection |
| SD-24 | `menuItems.availableFor {table, takeaway}` | MENU-007 naming |
| SD-25 | `modifierGroups.minSelect/maxSelect` | Order validation needs bounds |
| SD-26 | Import "Edited" is an event (`lastEditedAt`), not a state | TRD §15.11 `(Edited)*` is repeatable |
| SD-27 | ~~`tables (org, outlet, label)` partial unique~~ **withdrawn in R1** (replaced by OD-DB-26) | An unstated uniqueness rule could reject valid data; never invent a business rule |
| SD-28 | `isOpen` / `isActive` markers on `customerDrafts` / `occupancyClaims` | Version-independent partial indexes |
| SD-29 | `occupancyClaims.releaseReason` | Distinguish abandon vs convert |
| SD-30 | `orders.awaitingAcceptance` stored as the TRD §15.1 attribute, with the invariant `awaitingAcceptance ⇔ stage = AWAITING_ACCEPTANCE` enforced in the single conditional write that changes `stage` | TRD lists it as stored; redundancy is contained by the invariant (UC-4) |
| SD-31 | `orders.nextLineNo` | Race-free `lineNo` |
| SD-32 | Priority stored per item; order priority = max | TRD says "item/order attribute" |
| SD-33 | One invoice number per bill across all revisions | **Decided — PO-4** (OD-DB-18 resolved); TRD §25.9.5 |
| SD-34 | `businessDays.dayNo` | Contiguity checks |
| SD-35 | `businessDays.isActive` marker | Partial unique "one active day" |
| SD-36 | `customerOrderLinks.purgeAt` TTL anchor | Single-field TTL |
| SD-37 | No `lastUsedAt` on links | No requirement; avoids write amplification |
| SD-38 | `purgeAt` TTL anchors with **configuration-driven** length; inactive (null) for `aiInteractions`/`whatsappMessages` until OTD-15c/d | Bound non-business data without inventing retention periods (§22.3) |
| SD-45 | `billRevisions.header` snapshot | Reprint stability (§28.12) |
| SD-46 | MR-7 integer-only `Number` slots | No floating persisted values |
| SD-47 | `EXECUTED` proposals never get `purgeAt` | Preserve AUDIT-004 evidence |
| SD-48 | Table-label snapshots in association history | Rename/delete must not rewrite history |
| SD-49 | Nullable `outletId` semantics (null = organization-level) | Remove ambiguous tenant ownership |
| SD-50 | `billRevisions.kind` (`FINALIZATION`/`CANCELLATION`), `previousTotalPaise`, `deltaPaise` | Single insert-only ledger of sales contributions for PO-5/PO-6 (`[TRD §25.9.6–7]`) |
| SD-51 | `refunds.deductsFromNet` snapshot | Prevents a cancelled sale being reduced twice (PO-5 × DAY-026) |
| SD-52 | `orderItems.refireOfItemId` and its index removed | Re-fire is a KOT line only (PO-3, TRD §15.2); an order-item row would be a billable line |
| SD-39 | `aiInteractions.status` enum | Tool-result classification only |
| SD-40 | `whatsappMessages.status` enum | Processing state only |
| SD-41 | `orderBatches` collection | Idempotency anchor for add-items and container for pending customer add-batches (TRD §19.2, §21.6) |
| SD-42 | `cashReconciliations` as a separate insert-only collection referenced by the revision | Task inventory; TRD §14 #19; avoids embedding duplication |
| SD-43 | `dayRollups` and `customerOutletProfiles` as derived read models | Dashboards; outlet-scoped customer history |
| SD-44 | `uploadedFiles` metadata record | TRD §34.2 tenant binding of S3 objects |

### 22.2 Open decisions `[OPEN DECISION]` — reviewed one by one in reconciliation pass R1

R1 (and, for the financial rows, R2/R3) re-read the **actual** upstream text for every item (SPEC §ids, APP_FLOW §31/§29.12 AMB register, TRD §45.2/§45.3, PRD v1.2 §71.6) and classified each with the task's A–F scheme:

**A** already resolved upstream · **B** schema decision · **C** product decision · **D** technical architecture decision · **E** TRD amendment required · **F** still genuinely open.

Rules applied: an answered question is resolved here; a safe MongoDB/Mongoose choice is an `[SCHEMA DECISION]`; anything that changes product behaviour or technical architecture stays open and names its resolver; the count of open items is **not** reduced to look better — the only item that left the list (OD-DB-20) is the only one the upstream text actually answers, and one new item (OD-DB-26) was found by the index audit.

| ID | Decision | Source (exact upstream anchor) | Type | Status | Required artifact |
|---|---|---|---|---|---|
| OD-DB-1 | Suspended vs Deactivated: staff-side difference, reinstatement, adding items while suspended | AMB-06 / TRD PB-7. *Already resolved parts:* staff may sign in while suspended (ONB-014.1, APP_FLOW v1.2); customers see the blocked notice SCR-058 (PO-AF-03) | C (+A for the resolved parts) | **F — open** (non-blocking: both enum values exist, no transition out is built) | SPEC → PRD → APP_FLOW amendment |
| OD-DB-2 | Initial outlet Open/Closed value at activation; opening a table, discounts/charges, cancel/hold/void/re-fire of existing items while Closed | AMB-07 / PB-10. *Resolved part:* existing confirmed orders continue (PRD-ORG-025.1, ORG-025/027/034) | C (+A) | **F — open** (`availability.state` is nullable until first set) | SPEC/PRD/APP_FLOW |
| OD-DB-3 | Provisioning validation; duplicate organizations; one Owner across several organizations | AMB-20 / PB-2; TRD stance in TD-AUTH-2: login identifiers unique platform-wide, one user belongs to one organization | C. *The identifier-uniqueness and one-organization-per-user stance is `[TRD]` (A) and implemented; multi-organization Owner and duplicate-organization rules are not* | **F — open for the remainder** | SPEC/PRD |
| OD-DB-4 | Name, terminal state and reporting class of a **rejected** customer order | AMB-03 / PB-4; TRD §15.1 reserves a terminal pre-`CONFIRMED` outcome `Rejected*` | C | **F — open.** `REJECTED` is a neutral reserved value `[TRD §15.1]`, no analytics class encoded | SPEC/PRD |
| OD-DB-5 | Bill-level `Refunded` status (**5a**) · payment status / outstanding / overpayment after a refund (**5b**) | **5a:** SPEC BILL-002; PRD §39, PRD-BILL-002.1; APP_FLOW §16.1, AF-051. **5b:** APP_FLOW AMB-05 / TRD PB-8 → **PO-1** | A (5a) · C → decided (5b) | **RESOLVED** — §22.4.1; TRD §25.9.1–2 | — |
| OD-DB-6 | Attention auto-resolution; meaning of Dismissed vs Resolved; resolution reason; **severity** | AMB-18 / PB-9; ATTENTION-006 defines states + actor/time only; no severity vocabulary exists in SPEC/PRD/APP_FLOW/TRD | C | **F — open** (no `severity` field exists; `resolution` stored as given) | SPEC/PRD |
| OD-DB-7 | Content of "operating configuration" and "payment information" | ONB-022, ONB-028 ("Configure …") — no field list in any upstream document | C | **F — open** (only the three payment modes `UPI/CASH/CARD`, PAY-002, are stored) | PRD |
| OD-DB-8 | Service/packaging charge form, base and tax apportionment | PO-TRD-01 #3 / BILL-018 → **PO-2 (C + X)** | C → decided | **RESOLVED** — §22.4.1; TRD §25.9.3 | — |
| OD-DB-9 | Audit scope beyond AUDIT-002; whether reasons are mandatory for payment correction, bill cancel, discounts | AMB-21 / PB-19; KDS-015.1 "relevant void/correction actions" not enumerated | C | **F — open** (registry additive; `Reason` is stored, mandatory-ness is a guard) | SPEC/PRD |
| OD-DB-10 | Staff schedule recurrence/exceptions; initial attendance/availability of a new staff member | STAFF-002 "planned working period (e.g., 10:00–19:00)" — recurrence not stated | C. *Storing one window is `[SPEC]`; the fail-safe initial value `ABSENT/UNAVAILABLE` follows STAFF-008 and is an `[SCHEMA DECISION]` (B)* | **F — open** (non-blocking) | SPEC/PRD |
| OD-DB-11 | Temporary availability overrides across Reopen Day | AMB-12 / PB-14 (MENU-011.2, DAY-015.1 silent) | C | **F — open** (day-id equality, isolated) | SPEC/PRD |
| OD-DB-12 | Retention/purge of discarded or failed **import drafts** | TRD OTD-9 "Archival/retention for Drafts and audit — Indefinite in Phase 1" (order drafts named in R-16; import drafts not named) | D | **Open technical decision, non-blocking.** Default: retain (aligned with OTD-9) | TRD (OTD-9) |
| OD-DB-13 | Merge / split / move-items semantics (target order, order/bill effect) | AMB-09 / PB-13 | C | **F — open** (transfer is unblocked; merge/split/move build only the event envelope) | SPEC/PRD |
| OD-DB-14 | Table-QR acceptance when no session exists; concurrent pending submissions | AMB-04 / PB-11 | C | **F — open** (independent pending batches; claims deliberately non-unique) | SPEC/PRD |
| OD-DB-15 | Hold release authority and KDS effect (**15a**, non-financial) · bill effect of Re-fire and kitchen cancellation on a Finalized bill (**15b**) | AMB-02 / PB-5; APP_FLOW AF-035 → **PO-3 (A + K1)** for 15b | C | **15b RESOLVED** — §22.4.1; TRD §25.9.4. **15a hold release: open, non-financial, not blocking** | SPEC/PRD (15a) |
| OD-DB-16 | Order label for mixed item states; adding items to a Completed order | AMB-01 / PB-3; TRD TD-ORD-1 provisional | C | **F — open** (provisional least-advanced label is a TRD default, not a product decision) | SPEC/PRD |
| OD-DB-17 | Whether a cancellation-request **decline** needs a reason | ORD-093 silent; KDS-015.1 / AMB-21 family | C | **F — open.** Optional `declineReason` is stored `[B]`; mandatory-ness is a guard | SPEC/PRD |
| OD-DB-18 | Invoice number on re-finalization | SPEC BILL-018 / PO-TRD-01 #5 → **PO-4 (A)** | C → decided | **RESOLVED** — §22.4.1; TRD §25.9.5. GST review remains the accountant boundary of TRD §25.4 (advisory, not a schema blocker) | — |
| OD-DB-19 | Bill-cancel financial effects | SPEC BILL-007; APP_FLOW AF-047, AMB-11 → **PO-5 (A)** | C → decided | **RESOLVED** — §22.4.1; TRD §25.9.6 | — |
| OD-DB-20 | ~~Net sales when refunds exceed gross~~ | **SPEC DAY-026 / PO-TRD-01 #6: "net sales = gross sales − refunds recorded in that business day"** — a formula with no floor | **A** | **RESOLVED in R1.** `netSalesPaise` is a **signed** integer, never clamped (§6.5.1, §11.38) | — |
| OD-DB-21 | Gross sales after a post-close correction; stored Day Close | SPEC DAY-022/026; APP_FLOW AMB-14 → **PO-6 (B)** | C → decided | **RESOLVED** — §22.4.1; TRD §25.9.7 | — |
| OD-DB-22 | Definitions of visit count, AOV, preferred items | CUSTOMER-002 lists them without definitions. *Total spend is defined by `[TRD TD-CUS-2]`* | C (+A for total spend) | **F — open for the rest** (components stored; recomputation only) | PRD |
| OD-DB-23 | Owner-Agent permitted action catalogue | AMB-17 / PB-18 | C | **F — open** (proposal framework only; read-only tools in Phase 1) | SPEC/PRD + TRD tool catalogue |
| OD-DB-24 | WhatsApp ordering when AI is unavailable | AMB-15 / PB-16 | C | **F — open** (inbound persisted, no partial order) | SPEC/PRD |
| OD-DB-25 | Data-subject erasure vs financial/audit retention | **No upstream text:** a search of SPEC, PRD, APP_FLOW and TRD for erasure/right-to-be-forgotten/GDPR/DPDP/purge finds nothing | C (+ legal review) | **F — open** (customers/feedback/whatsapp PII retained; no erasure path exists) | SPEC/PRD + legal |
| OD-DB-26 *(new in R1)* | **Scope of table-label uniqueness** (outlet-wide / per floor / none) | PRD-ORD-020.AC2 "the table number"; TABLE-005; no uniqueness statement anywhere | C | **F — open.** The R1 index audit **withdrew** the outlet-wide unique index (SD-27) because it could reject valid data | SPEC/PRD |
| OD-DB-27 *(R2)* | Lifecycle after a bill becomes `Refunded`; definition of "full" refund | APP_FLOW §16.1; SPEC BILL-006 → product-owner delegation 2026-10-08 (most conservative rule) | C → decided | **RESOLVED** — §22.4.1; TRD §25.9.2 | — |

**Counts (after R3).** 27 items: **9 resolved** (OD-DB-5, 8, 15b, 18, 19, 20, 21, 27 and UC-2's enum rule) · **17 open, none blocking** — product OD-DB-1…4, 6, 7, 9…11, 13, 14, 15a (hold release), 16, 17, 22…26 and technical OD-DB-12; each is schema-neutral and names its resolver. **No PRODUCT OWNER DECISION REQUIRED item remains.**
**Mapping check.** All 18 open APP_FLOW AMBs map to a TRD PB: AMB-01→OD-16, 02→15, 03→4, 04→14, 05→5, 06→1, 07→2, 08→PB-12, 09→13, 11→19, 12→11, 14→21, 15→24, 16→PB-17, 17→23, 18→6, 20→3, 21→9. **PB-12** (what "new assignment" means for unavailable staff) and **PB-17** (reorder context; the multi-order link is *closed* by PO-TRD-02/CUSTOMER-022) have **no persistence consequence**, so they carry no OD-DB id.


### 22.3 Open technical decisions and the TTL / retention audit (Part 10)

**Why this matters.** A TTL index *destroys data*. R1 therefore checked every TTL for: the exact field; the retention length; its business purpose; whether upstream defines it; whether deleting is safe; whether audit/history could be lost; and whether the length is only an engineering default. **A length that no upstream document defines is not silently turned into a retention policy**: it is an `[OPEN TECHNICAL DECISION]`, and where the safe default is "keep", the schema keeps.

| # | Collection | TTL field / index | Length | Business purpose | Defined upstream? | Deletion safe? | Audit / history lost? | Classification |
|---|---|---|---|---|---|---|---|---|
| T1 | `sessions` | `absoluteExpiresAt`, `expireAfterSeconds: 86400` | session lifetime: 15 min access / 24 h idle / 7 d absolute (SA 10 min / 30 min / 8 h) **+ 24 h grace** | Auth session; reuse detection while the refresh family is valid | **TTL on absolute expiry: yes** `[TRD §37.3]`. Lifetimes: technical default `[TRD §12.1, OTD-2]`. **24 h grace: no** | Yes — a session past `absoluteExpiresAt` can no longer authenticate or be rotated; not a business or audit record | None (credential events are audited in `auditEvents`, not here) | `[TRD]` + grace = **OTD-15e** (engineering default; changing it needs `collMod`) |
| T2 | `customerOrderLinks` | `purgeAt = expiresAt + ORDER_LINK_PURGE_GRACE_DAYS` | link expiry = terminal + 30 d, ≤ 90 d from creation; grace 7 d (0 allowed) | Private order access | **TTL/expiry field: yes** `[TRD §37.3]`; expiry values `[TRD §30.2]` (engineering defaults, DF-12). **Grace: no** | Yes — read/reorder access is refused from `expiresAt` by an explicit check (TTL is not an access control); the order, bill and feedback are retained | None — the link holds only a hash and ids | `[TRD]` + grace = **OTD-15a** |
| T3 | `aiProposals` | `purgeAt`, set **only** when status becomes `EXPIRED`/`REJECTED`/`FAILED` | `purgeAt = that time + AI_PROPOSAL_PURGE_GRACE_DAYS` (suggested 30 d) | Single-use Owner confirmation | **"Mongo, TTL": yes** `[TRD §31.1/§31.3]`; proposal lifetime 10 min `[TRD]`. **Purge grace: no** | Yes **because `EXECUTED` proposals never receive `purgeAt`** — the exact summary and arguments the Owner confirmed stay as audit evidence (AUDIT-004) | Prevented by the exemption `[SD-47]` | `[TRD]` + exemption `[SCHEMA DECISION]` + grace = **OTD-15b** |
| T4 | `aiInteractions` | `purgeAt`, **populated only if** `AI_LOG_RETENTION_DAYS` is configured | **none by default** (engineering suggestion 90 d) | Observability / abuse control (metadata only, no prompts, no PII) | **No.** `TD-AI-4` says "minimal retention" without a period | Yes (metadata only) once a length is chosen | None — executed actions are in `auditEvents` | **`[OPEN TECHNICAL DECISION]` OTD-15c** — **retained until decided** (safe default) |
| T5 | `whatsappMessages` | `purgeAt`, **populated only if** `WA_RETENTION_DAYS` is configured | **none by default** (engineering suggestion 30 d) | Webhook dedupe by `providerMessageId`; integration-failure surfacing | **No** — TRD §33.4 only says "persist then 200" | Not decided: deleting a row also deletes its **dedupe memory**, so the length must exceed the provider's redelivery window (provider-specific, OTD-7). Contains PII (sender phone) — interacts with OD-DB-25 | None for orders (an order created from a message is independent) | **`[OPEN TECHNICAL DECISION]` OTD-15d** + **`[TECHNICAL VERIFICATION REQUIRED]`** (redelivery window) — **retained until decided** |

**No other Mongo TTL exists.** Everything else is "retained indefinitely" by design: audit and seals `[TRD §32.7, OTD-9]`, drafts `[TRD §22.5, OTD-9]`, every financial/operational ledger, customers, feedback, briefs. S3 lifecycle (`incoming/` 1 d; import sources 90 d `[TRD §34.2]`, engineering default, not business records) and Redis TTLs are **outside this schema**.

**What is and is not decided.** Decided upstream: *that* sessions, order links and proposals expire. **Not** decided upstream (all OTD-15*): the grace lengths (a, b, e) and the retention of AI logs and WhatsApp events (c, d). None of them changes a collection shape: each is a configuration value feeding a nullable `purgeAt`.

#### Open technical decisions raised or kept by the schema

| ID | Item | Default used | Blocking? |
|---|---|---|---|
| OTD-9 (TRD) | Archival/retention for Drafts and audit | Indefinite in Phase 1 | No |
| OD-DB-12 | Import-draft retention | Retain | No |
| OTD-15a | Order-link purge grace | 7 d (config; 0 allowed) | No |
| OTD-15b | Proposal purge grace (non-executed only) | 30 d (config) | No |
| OTD-15c | AI interaction log retention | **None** (retained) | No |
| OTD-15d | WhatsApp event retention | **None** (retained) | No — but decide before production (PII, OD-DB-25) |
| OTD-15e | Session purge grace | 24 h (index property) | No |


### 22.4 Product-owner decisions applied (closure pass R3, 2026-10-08)

On 2026-10-08 the product owner decided PO-1 … PO-6 and delegated OD-DB-27 (to be resolved by the most conservative rule that preserves financial integrity, auditability and Day Close correctness). **These are authoritative product decisions, not recommendations.** Their technical form is TRD §25.9 (PO-TRD-03); this section records the schema consequences and keeps the trace. *Governance note:* SPEC, PRD and APP_FLOW were deliberately not edited in this pass; they still list AMB-02/05/11/14 as "not defined" (silent, not contradictory). Recording PO-1 … PO-6 as a SPEC amendment (A4) is a follow-up for the product owner and is **not** a schema blocker.

#### 22.4.1 Results

| ID | Status | Final rule | Source / trace |
|---|---|---|---|
| **UC-2** | **RESOLVED** | Persisted enum values use `UPPER_SNAKE_CASE` strings; numeric enum identifiers are not persisted | TRD §5.2 C9 (amended 2026-10-08); §16.2 aligned (`status` = `DELETED`) |
| **OD-DB-5** (5a + 5b) | **RESOLVED** | **5a** — bill status `Refunded (partial/full)` exists, entered from `Finalized` on a refund against a bill with a payment. **5b / PO-1 (C)** — refunds net against **overpayment only**: `outstanding = max(0, T−P)`, `paymentStatus = PAID iff P ≥ T ∧ T>0`, `overpayment = max(0, P−T−F)`; a refund never reduces `P`, never changes `T`, never creates an outstanding balance. `refundKind` is derived: `FULL` iff `F = P`, `PARTIAL` iff `0 < F < P`. Invariant `F ≤ P` | SPEC BILL-002/006/012, PAY-010/012/013; PRD §39, PRD-BILL-002.1; APP_FLOW §16.1, AF-051; PO-1; TRD §15.5, §15.6, §25.9.1–2, §26.3, §26.6 |
| **OD-DB-8** | **RESOLVED** | **PO-2 (C + X).** Per outlet and per charge kind: `enabled` (default off), `basis ∈ {PERCENT, FLAT}`, `valueBps` or `valuePaise`. Staff apply the charge to a Draft/Reopened bill; the entry **snapshots** kind/basis/value at that moment, so later outlet-configuration changes never alter existing bills. PERCENT base = discounted item subtotal (tax-inclusive, other charges excluded); `amount = round_half_up(base × bps / 10 000)`; FLAT = `valuePaise` once per bill. The charge is tax-inclusive like menu prices and discounts and is apportioned across the bill's tax-rate groups **by taxable value** (largest remainder, integer-exact; ties by ascending `rateBps`); each part is taxed per-line half-up. Parts and tax are frozen in the finalized revision | SPEC BILL-018, PO-TRD-01 #1–#4; PRD-BILL-018.1; PO-2; TRD §25.9.3 |
| **OD-DB-15** | **RESOLVED** (15b) | **PO-3 (A + K1).** Re-fire is **kitchen-only**: an additional-KOT line referencing the original item; **no** order-item row, no item-state change, no bill line, no money field. Any cancellation or void that would change billable lines is **refused** while the bill is `Finalized`, `Refunded` or `Cancelled` (K1; Kitchen included) until the bill is Reopened. *Hold release (15a) is a separate, non-financial item and stays open (PB-5).* | SPEC ORD-073, ORD-087, KDS-006/013, BILL-004; APP_FLOW AF-035; PO-3; TRD §15.2, §23.7, §25.9.4 |
| **OD-DB-18** | **RESOLVED** | **PO-4 (A).** One invoice number per bill, allocated at first finalization and reused by every revision; printouts of revision `n ≥ 2` carry "Revised n" (derived, never stored). No second invoice identity. A cancelled bill keeps its number. Revisions remain auditable in `billRevisions`; GST review stays the accountant boundary | SPEC BILL-018 / PO-TRD-01 #5; PRD-BILL-018.AC1; PO-4; TRD §25.5, §25.9.5 |
| **OD-DB-19** | **RESOLVED** | **PO-5 (A).** Cancel only from `Finalized`, any payment state, **mandatory reason**, audited. Status change only: payments stay recorded and untouched, **no automatic refund**, order unchanged, **no replacement bill**, no further items. Sales effect: an insert-only `CANCELLATION` revision with `deltaPaise = −(latest finalized total)` on the day of cancellation. A refund recorded later against the cancelled bill is cash-relevant but stored with `deductsFromNet = false` | SPEC BILL-007/AC1, ACT-BIL-06, ANALYTICS-011, DAY-025; APP_FLOW AF-047; PRD §39; PO-5; TRD §25.9.6 |
| **OD-DB-21** | **RESOLVED** | **PO-6 (B).** A re-finalization contributes only its **delta** (`Tₙ − Tₙ₋₁`) to the day it **actually occurs**; original attribution (`attributedDayId`), actual timestamp and immutable revision totals are kept. `grossSales(D) = Σ deltaPaise (businessDayId = D)` (signed); `netSales(D) = grossSales(D) − Σ refunds(recordedDayId = D, deductsFromNet)` (signed, unclamped). A stored Day Close is **never mutated** by a later correction | SPEC DAY-015/022/025/026; PRD-DAY-022.1; APP_FLOW §18.3, AMB-14; PO-6; TRD §25.9.7, §27.5 |
| **OD-DB-27** | **RESOLVED** | Most conservative rule: `Finalized → Refunded` on the first refund (same transaction); further refunds allowed while `F < P` as ledger records, status stays `Refunded`; **no Reopen, no Cancel, no new payment, no edits** on a `Refunded` bill; a payment correction is allowed only if `P' ≥ F`; refunds on `Draft`/`Reopened`/`Cancelled` bills are ledger-only (no status change); "full" means `F = P` (all recorded payments), so refunding only an overpayment's excess is partial. Every other edge is forbidden (TRD §15.12) | APP_FLOW §16.1 (only `Finalized → Refunded` is named); SPEC BILL-006, PAY-012; PO delegation 2026-10-08; TRD §25.9.2 |
| **OD-UX-3 / OD-UX-9** (UI brief) | **RESOLVED** | Bill-level Refunded badge and the Cancel-bill control follow the canonical behaviour; the brief's register and screens were updated (no visual redesign). OD-UX-8 keeps only hold release open | UI brief §9.7, OD register |

#### 22.4.2 Schema consequences (all in the collection definitions)

| Change | Where |
|---|---|
| `bills.status` ∈ `DRAFT, FINALIZED, REOPENED, CANCELLED, REFUNDED`; cancel edge only `FINALIZED→CANCELLED`; `FINALIZED→REFUNDED` on first refund | §10.1, §10.2, §11.32 |
| `overpaymentPaise = max(0, P−T−F)`; `refundKind` derived | §11.32 |
| `billRevisions`: `kind ∈ {FINALIZATION, CANCELLATION}`, `previousTotalPaise`, `deltaPaise` (signed); one `invoiceNumber` for all revisions; `totals.charges[].allocations[]` | §11.33 |
| `refunds.deductsFromNet` (snapshot at recording) | §11.36 |
| `dayCloseRevisions.totals`: `finalizedTotalPaise` (first finalizations), `correctionDeltaPaise`, `grossSalesPaise` (signed), `refundsOnCancelledBillsPaise`, `netSalesPaise` (signed) | §11.38 |
| `orderItems.refireOfItemId` and its index **removed** (re-fire is a KOT line only); KOT line keeps `refireOfItemId` | §11.27, §11.31, §13 |
| Outlet charge configuration semantics; adjustment-entry snapshot | §11.2, §11.32 |

#### 22.4.3 Financial integrity check (R3)

| Link | Check | Result |
|---|---|---|
| Money storage | every field integer paise; signed: `roundOffPaise`, `variancePaise`, `netSalesPaise`, `grossSalesPaise`, `correctionDeltaPaise`, `deltaPaise`, `previousTotalPaise` is unsigned | ✔ |
| Order → Bill | bill lines read only non-cancelled, billable order items; re-fire adds none | ✔ |
| Bill totals / charges | `computeBill` over snapshots + adjustment snapshots; charge parts sum exactly to the charge | ✔ |
| Finalization → Reopen → re-finalization | revisions immutable; one invoice number; delta = `Tₙ − Tₙ₋₁` stored on the revision | ✔ |
| Payments (`P`) | ledger; corrections supersede; `P' ≥ F` enforced | ✔ |
| Refunds (`F`) | ledger; `F ≤ P`; never changes `T`, `P`, `outstanding` | ✔ |
| Outstanding / overpayment / paymentStatus | formulas of §25.9.1; refund cannot create an outstanding balance | ✔ |
| Partial / full / `Refunded` | derived from `F` vs `P`; status set once from `Finalized` | ✔ |
| Reopened bill | no sales effect while Reopened; Refunded and Cancelled bills cannot be reopened | ✔ |
| Cancelled bill | status only; `−T` revision; later refunds `deductsFromNet = false` — **no double reduction** | ✔ |
| Day Close attribution | each event stamped with its actual day and the original bill's day | ✔ |
| Gross / Net | signed; Σ over days = Σ current totals of non-cancelled bills; refunds deduct once | ✔ |
| Post-close corrections | never mutate a closed Day Close | ✔ |
| Additional payment / refund activity | payment refused on `Refunded`/`Cancelled`; refund ledger-only outside `Finalized`; each is a DAY-025 transaction | ✔ |
| Worked example | Bill ₹1,000 finalized day A (+1,000); reopened, re-finalized ₹1,100 on day B (+100); refund ₹300 on day B (deducts 300) → Gross A = 1,000, Gross B = 100, Net B = −200; Σ Gross = 1,100 = current total; refund counted once | ✔ |

**Open, non-financial, not blocking:** OD-DB-1…4, 6, 7, 9…11, 13, 14, 15a (hold release), 16, 17, 22…26, OD-DB-12 and OTD-15a–e. Each is schema-neutral, listed in §22.2 with its resolver.


---

## 23. Upstream Conflicts and Task-Statement Divergences (reported, not silently reconciled)

Reconciliation pass **R1** re-read each conflict in the **actual** current text of the upstream documents (TRD v1.0 line references below are to `docs/TRD.md`). Every item was tested with four questions: *(1) Where exactly is the wording? (2) Is the conflict real? (3) Does the TRD itself contain a later or more authoritative statement that resolves it? (4) If the TRD resolves it, is the schema aligned — and if it does not, is the choice made visible?* Result: **of the six conflicts that were flagged "TRD wording confirmation needed", five are resolved by the TRD's own text and the schema was aligned (two required schema changes); one (UC-2) was a genuine TRD-internal contradiction; the TRD was amended on 2026-10-08 and the conflict is RESOLVED (see UC-2 below).**

### 23.1 The six TRD wording conflicts

#### UC-2 — Enum representation: numeric vs string — **RESOLVED (TRD amended 2026-10-08)**

| | |
|---|---|
| **Original conflict** | TRD §5.2 C9 said *"Adopted: all domain enums as numeric constants"*, while the TRD's conditional writes, partial indexes, role enum (§13.2) and examples are string-valued |
| **Resolution** | TRD §5.2 C9 now reads: *"**Persisted enum values use `UPPER_SNAKE_CASE` strings. Numeric enum identifiers are not persisted.**"* State names in other casings in the TRD are names mapping one-to-one to the persisted value; API/wire spelling is unchanged. TRD §16.2 soft-delete wording aligned (`status` = `DELETED`). R2 re-verified both edits against the file and found no remaining contradiction (lines 107–108 describe the *existing* boilerplate and stay accurate) |
| **Schema treatment** | Canonical, no longer provisional: §6.4, SD-2. No enum value in this document changed |
| **TRD amendment** | **Done** — no further amendment required |

#### UC-3 — `supersededBy` on an append-only payment — **NOT A REAL CONFLICT — resolved by alignment**

| | |
|---|---|
| **Exact source** | TRD §26.2 (line 1910): *"`Payment entry` | Append-only? **Yes** | … `idempotencyKey`, `supersededBy?`"* and (line 1911) *"Payment correction … the original is **never edited or deleted** (PAY-007, PAY-012 …); effective payments = entries not superseded, plus correction entries"* |
| **Is it real?** | Only if `supersededBy` is a **stored** field. The column is headed *"Key fields (conceptual)"*; a derived attribute satisfies both sentences |
| **TRD resolution** | The TRD's own normative statement (never edited) governs its conceptual field list; "effective payments = entries not superseded" is computed from `supersedes` references |
| **Impact** | Whether the ledger row is ever updated (it must not be) |
| **Schema treatment** | `supersededBy` is a **derived read attribute** (the id of the entry whose `supersedes` points here), computed by the effective-payments query; **never stored**. The partial unique `(org, billId, supersedes)` guarantees at most one correction per entry (§11.35) |
| **TRD amendment** | **None required.** Optional editorial note in §26.2 that `supersededBy` is derived |

#### UC-4 — `stage` **and** `awaitingAcceptance` flag — **NOT A REAL CONFLICT — schema now aligned** *(schema changed)*

| | |
|---|---|
| **Exact source** | TRD §15.1 (line 827): *"Stored attributes: `stage` (lifecycle label below), `awaitingAcceptance` flag, `abandonedAt`, `rev`."* |
| **Is it real?** | No. The TRD does not contradict itself; it lists two stored attributes, one of which is redundant with a `stage` value. The v1.0 draft **overrode** the TRD ("flag not stored") — a silent upstream override, which this pass reverses |
| **Impact** | One boolean on `orders`; no index |
| **Schema treatment** | `orders.awaitingAcceptance` **is stored** (§11.25, SD-30) with the invariant `awaitingAcceptance ⇔ stage = AWAITING_ACCEPTANCE`, written **only** inside the single conditional write that writes `stage`, so the two can never disagree |
| **TRD amendment** | **None required** |

#### UC-5 — Customer drafts vs `Draft` as an order stage — **NOT A REAL CONFLICT — resolved by TRD §22.5 / TD-ORD-4**

| | |
|---|---|
| **Exact source** | §14 #28 (line 802): *"Public channel config, **customer drafts**"* under `customer-ordering`; §15.1 diagram (line 831–833): `[*] --> Draft`, `Draft --> AwaitingAcceptance: customer submits`; **but** line 852: *"Draft → AwaitingAcceptance … Order created in one transaction with items+snapshots"*; §22.5 (line 1686) `TD-ORD-4` *"Customer Draft … a **server-persisted cart keyed by a client-generated `draftKey`**, created on the first item added … **never offered back**"* listed in a table **separate** from *"Staff Draft — Persisted server-side from the first line"* (line 1685) |
| **Is it real?** | No. "Draft" names two different things: the staff **order** in stage `DRAFT`, and the customer **cart** (`TD-ORD-4`). The §15.1 diagram merges them for readability; line 852 says the **order is created at submit**, i.e. a customer cart is not an order |
| **TRD resolution** | `TD-ORD-4` + line 852 |
| **Impact** | Whether a customer Draft is an `orders` document |
| **Schema treatment** | Aligned (unchanged): customer carts live in `customerDrafts`; an order is **created** at `AWAITING_ACCEPTANCE`; the order stage `DRAFT` is staff-only. Both carry `abandonedAt` (line 864 applies to both) |
| **TRD amendment** | **None required.** Optional editorial note on the §15.1 diagram |

#### UC-9 — Indexes without `organizationId` leading — **NOT A REAL CONFLICT — TRD delegates definitions to the schema**

| | |
|---|---|
| **Exact source** | §11.4 (line 524): *"All compound indexes lead with `organizationId` then `outletId` (**conceptual; schema stage defines**)"*; §37.3 heading (line 2811): *"Index strategy (**conceptual — the schema document owns definitions**)"*; its table lists `(billId, idempotencyKey)`, `(billId, reference)`, `(tokenHash)`, `(refreshHash)`, `(userId)`, `(action, occurredAt)`, seal `(scope, seq)` without an org lead |
| **Is it real?** | No. (a) The rule is about **compound** indexes; `(tokenHash)`, `(refreshHash)` are single-field lookups that arrive with no tenant context. (b) The table is explicitly *conceptual* and hands the definitions to this document. (c) The remaining entries (`(billId, …)`) are business compounds the schema org-prefixes; `(action, occurredAt)` and `(scope, seq)` are SuperAdmin/platform-scope lookups |
| **Impact** | Index key lists |
| **Schema treatment** | Every business compound index is `organizationId`-led (and `outletId`-led where outlet-owned). The exceptions are enumerated and justified one by one (§13.4, §28.4): public/auth lookups, platform-scope audit filters and seals, and four platform lists. No exception exists for convenience |
| **TRD amendment** | **None required** |

#### UC-14 — Soft delete `status=3` vs `isArchived` — **REAL DEVIATION in the draft — schema now aligned** *(schema changed)*

| | |
|---|---|
| **Exact source** | §5.1 line 107: *"Soft delete = `status: 3`"*; §5.2 C10 (**"Adopted"**, deviations listed: `rev`, tenancy-guard — soft delete is **not** listed); §16.2 (line 1034): *"`DELETE` only for config entities (soft, status=3) — **never** for business records (F9)"* |
| **Is it real?** | The TRD is consistent; the **draft deviated** from an adopted convention (`isArchived`) without the TRD listing it as an intentional deviation |
| **Impact** | Six configuration collections: `menuCategories`, `menuItems`, `modifierGroups`, `floors`, `tables`, `kitchenStations` |
| **Schema treatment** | Aligned: these carry `status ∈ {ACTIVE, DELETED}` + `deletedAt`; API `DELETE` sets `status: DELETED` (the boilerplate `DEFAULT.STATUS.DELETED` convention). `INACTIVE` (boilerplate value 2) is deliberately unused — no upstream rule gives it meaning. Business records have **no** delete path at all (F9). Partial-unique and listing indexes use `status:'ACTIVE'` |
| **TRD amendment** | **None required.** The *value representation* of `DELETED` (number 3 vs string) follows UC-2 |

### 23.2 Task-statement divergences — retained upstream-compatible designs

**Excluded because upstream contract does not require/support it.** A divergence from the *task prompt* is not a schema defect when the canonical product/technical contract deliberately excludes the thing; each row below quotes the upstream text.

| # | Task asked for | Exact upstream text | Verdict | Schema treatment |
|---|---|---|---|---|
| **UC-1** | Staff invitations | SPEC AUTH-003: *"Staff credentials and recovery are handled by Owner/Manager"*; TRD §12.5: the authorized Owner/Manager *"sets a new password for the staff member"*; the invitation token is *"emailed to the Owner"* (TD-AUTH-7, ONB-006) | **Excluded because upstream contract does not require/support it.** | `invitations` is Owner onboarding/reissue only (`purpose` ∈ `OWNER_ONBOARDING`, `OWNER_RESET`); no `staffInvitations` |
| **UC-6** | Task asked for `REFUNDED` bill status and payment states | SPEC BILL-002; PRD-BILL-002.1; APP_FLOW §16.1, AF-051; SPEC PAY-010; TRD §26.1 | **Split verdict (corrected in R2).** `REFUNDED` **bill status** is canonical and is in the schema; **payment states** (Pending/Failed/Authorized): *Excluded because upstream contract does not require/support it* | `bills.status` includes `REFUNDED` (lifecycle: OD-DB-27, resolved); `paymentStatus` stays `NOT_PAID`/`PAID`, derived, and a refund never changes it (PO-1). TRD §15.5 was updated in R3 |
| **UC-7** | Customer as a stored role/user | TRD §13.2: `CUSTOMER` is in the closed role enum **and** *"Customer / link principal — a fixed, non-customizable allow-set"*; SPEC AUTH-009: *"No customer accounts in Phase 1"* | **Resolved by alignment (corrected in R1).** The draft said no `CUSTOMER` role value exists; the TRD enum **does** contain it | The shared `ROLE` enum has all six TRD values (used by `ActorRef.role`, where `CUSTOMER` appears only with `type: CUSTOMER`); `users.role` and `permissionOverrides.role` are validator **subsets** of the five restaurant roles; **no `users` row for a customer**; `customers` holds contact identity only |
| **UC-8** | Kitchen / preparation / ready state persistence | TRD §15.3 heading: *"KDS (**derived, not stored**)"*: *"it is computed from item state; there is no separate KDS state to drift"*; SPEC ORG-005: one kitchen context per outlet | **Excluded because upstream contract does not require/support it.** | No kitchen/KDS collection or state; state lives on `orderItems`; the activity record is `history[]` + the SD-10 timestamps |
| **UC-10** | Idempotency scope "Organization + Outlet + Operation + Key" everywhere | TRD §19.2 gives a **different key scope per operation** (e.g. `(orderId, key)` for add-items, `(billId, key)` for payments, `(outletId, dayId, 'CLOSE', key)` for Day Close, `(providerMessageId)` for WhatsApp); only order submit is `(org, outlet, 'ORDER_SUBMIT', key)` | **Excluded because upstream contract does not require/support it** (a uniform scope would be wrong for most operations) | §12.2 states the exact per-operation boundary; tenant scope is carried by the `organizationId`-led index, never by a global key |
| **UC-11** | Attention "severity/priority where defined" | ATTENTION-006 defines `Open → Dismissed/Resolved` with actor and time only; ATTENTION-007 defers thresholds (DF-02); no severity vocabulary exists in SPEC/PRD/APP_FLOW/TRD | **Excluded because upstream contract does not require/support it** (the task says "where defined"; it is not) | No `severity`; OD-DB-6 |
| **UC-12** | WhatsApp as a feedback/tracking channel | TRD §30.2 (line 2210): the link is *"**not sent to the customer** over WhatsApp: delivery of status/link on WhatsApp is deferred (DF-15, PO-AF-01)"*; §45.3 #8 | **Excluded because upstream contract does not require/support it** in Phase 1 | The data model carries eligibility (order link issued, `source` stored); no delivery state or WhatsApp-tracking collection |
| **UC-13** | Link "last-used timestamp if required" | TRD §30.2 (line 2204) storage list: *"`orderId`, `organizationId`, `outletId`, `createdAt`, `expiresAt`, `revokedAt?`"* — none required | **Excluded because upstream contract does not require/support it** | No `lastUsedAt` (SD-37) |

### 23.3 Inherited, already resolved upstream

| # | Item | Resolution |
|---|---|---|
| **UC-15** | SPEC RBAC-024 "station scope" vs KDS-001/008; the task's "Partial" payment status; the task's day names "Open/Closed/Reopened" | Resolved by TRD §45.3 #2, #1, #9 (stations are routing not authorization; two persisted payment statuses; day states `RUNNING/CLOSED/REOPENED/ABSORBED`). The schema follows the TRD resolution |

### 23.4 Findings made by R1 itself (not in the draft's conflict list)

| # | Finding | Treatment |
|---|---|---|
| **R1-F1** | The draft clamped **net sales** at ≥ 0, contradicting SPEC DAY-026's unfloored formula | Fixed: `netSalesPaise` signed (OD-DB-20 resolved) |
| **R1-F2** | A single re-finalized bill could be **double-counted** in Gross sales if the revision's finalization day and the original day were both selected (DAY-022 keeps both attributions) | Decided by **PO-6** (delta on the day it happens; OD-DB-21 resolved) |
| **R1-F3** | The outlet-wide unique table label (SD-27) was an invented rule that could reject valid data | Withdrawn; **OD-DB-26** |
| **R1-F4** | A `CORRECTION` payment repeating the superseded entry's `reference` would hit the `(billId, reference)` unique | Partial filter now includes `type:'PAYMENT'` |
| **R1-F5** | Finalized bills did not snapshot the outlet/table/customer header and the GST information printed on them, so a reprint after an outlet edit would change | `billRevisions.header` snapshot (SD-45) |
| **R1-F6** | Whether TTLs on AI logs / WhatsApp events were upstream-defined | They are not: retained by default, OTD-15c/d (§22.3) |
| **R1-F7** | `outletStateEvents` is a separate collection, whereas TRD §28.5 says the history entry is recorded *"on the outlet"* | Kept as a `[SCHEMA DECISION]` (bounded-array rule, §4.1 M-EMB: Open/Closed toggles are unbounded over years) and listed as a deliberate shape deviation in §28.9 |

---


## 24. Schema Quality Gates (Part 41)

| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | Every Phase 1 entity is represented | ✔ | §7 (51 collections); §7.1 lists rejected candidates |
| 2 | No Phase 2 entity introduced | ✔ | §2, §7.1 |
| 3 | Organization isolation explicit | ✔ | §5, TI-1, §9 |
| 4 | Outlet isolation explicit | ✔ | §5.2, `staffAssignments`, indexes |
| 5 | User/staff/RBAC model complete | ✔ | C-04…C-09 (default vs grant vs deny, §11.7) |
| 6 | Menu model complete | ✔ | C-12…C-18 |
| 7 | Historical menu snapshots preserved | ✔ | `orderItems.snapshot`, §16 |
| 8 | Table/session model complete | ✔ | C-19…C-24 |
| 9 | Order/order-item model complete | ✔ | C-25…C-29 |
| 10 | KOT model complete | ✔ | C-31 |
| 11 | Kitchen model complete | ✔ | C-29, C-30, items; UC-8 |
| 12 | Bill/payment/refund model complete | ✔ | C-32…C-36 |
| 13 | Integer paise for all money | ✔ | §6.5.1 |
| 14 | Business-day model complete | ✔ | C-37, C-38 |
| 15 | Cash reconciliation complete | ✔ | C-39 |
| 16 | Customer model respects Phase 1 limits | ✔ | C-41 (no auth fields) |
| 17 | Private order-access mechanism represented | ✔ | C-43 |
| 18 | Feedback represented | ✔ | C-44 |
| 19 | AI persistence constrained | ✔ | C-45…C-48 |
| 20 | Attention represented | ✔ | C-49 |
| 21 | Audit model complete | ✔ | C-10, C-11 |
| 22 | Invitations represented | ✔ | C-09 |
| 23 | Idempotency represented | ✔ | §12 |
| 24 | State transitions represented | ✔ | §10 |
| 25 | Snapshot strategy explicit | ✔ | §16 |
| 26 | Indexes justified | ✔ | §11 per collection, §13.2 |
| 27 | Unique constraints justified | ✔ | §13.3 |
| 28 | Concurrency addressed | ✔ | §14 |
| 29 | Transaction boundaries addressed | ✔ | §15 |
| 30 | Security addressed | ✔ | §18 |
| 31 | Retention/deletion addressed | ✔ | §17 |
| 32 | Mongoose mapping defined | ✔ | §19 |
| 33 | API compatibility checked | ✔ | §20 |
| 34 | UI compatibility checked | ✔ | §21 |
| 35 | No unsupported business behaviour invented | ✔ | §22.1 are implementation-only; §22.2 unresolved items stay neutral; two earlier inventions withdrawn in R1 (outlet-wide unique table label; day-attribution sentence) |
| 36 | No financial behaviour invented | ✔ | policy values only from PO-TRD-01 / DAY-026; every financial rule traces to SPEC/PRD/APP_FLOW or to a recorded product-owner decision PO-1…PO-6 / OD-DB-27 (§22.4, TRD §25.9) |
| 37 | No role/permission behaviour invented | ✔ | atoms from SPEC §9; only SPEC/TRD overrides |

*These gates assess the **document**; nothing here has been executed against a database.* See §26 for the verification log.

### 24.1 R1 final quality gates (reconciliation pass)

| # | Gate | Result | Evidence / note |
|---|---|---|---|
| R1 | All 51 collections reviewed | ✔ | §28.9 |
| R2 | Collection necessity justified | ✔ | §28.9 — 39 required, 10 derived, 1 provisional, 1 questionable (flagged, kept) |
| R3 | All fields reviewed | ✔ | §11; R1 changes in §28.13 |
| R4 | Tenant and outlet boundaries explicit | ✔ | §28.3 (51 rows) |
| R5 | RBAC data model aligned | ✔ | §11.7; UC-7 aligned with TRD §13.2 |
| R6 | Menu model / historical snapshots aligned | ✔ | §16, §28.2 |
| R7 | Order, item, KOT/KDS lifecycles aligned | ✔ | §10, §28.5 |
| R8 | Billing aligned | ✔ | charges (PO-2), invoice (PO-4), cancel (PO-5) decided; §22.4 |
| R9 | Payment aligned | ✔ | UC-3 resolved |
| R10 | Refund aligned | ✔ | `REFUNDED` status, netting (PO-1), lifecycle (OD-DB-27) decided |
| R11 | Day Close aligned | ✔ | delta rule (PO-6) decided; signed gross/net |
| R12 | Cash reconciliation aligned | ✔ | |
| R13 | Customer / feedback / AI / Attention / audit aligned | ✔ | open items neutral (OD-DB-6, 22, 23, 24, 25) |
| R14 | Idempotency aligned | ✔ | §12.2 |
| R15 | Concurrency aligned | ✔ | §28.6 |
| R16 | Transaction boundaries aligned | ✔ | §15 |
| R17 | Indexes justified | ✔ | §28.4 (118 rows) |
| R18 | Unique constraints justified | ✔ | §13.3 (U4 withdrawn) |
| R19 | TTL policies reviewed | ✔ | §22.3 |
| R20 | Retention reviewed | ✔ | §17; OD-DB-25 open |
| R21 | Financial precision verified | ✔ | §28.1, MR-7 |
| R22 | Historical truth verified | ✔ | §28.2 (gaps found and closed) |
| R23 | MongoDB compatibility reviewed | ✔ | §28.7 — items marked `[TECHNICAL VERIFICATION REQUIRED]` do not change the logical contract |
| R24 | Mongoose compatibility reviewed | ✔ | §28.7 — same |
| R25 | UI/UX compatibility reviewed | ✔ | §28.10 |
| R26 | All open decisions classified | ✔ | §22.2 (A–F) |
| R27 | All upstream conflicts classified | ✔ | §23 |
| R28 | No silent invention | ✔ | §28.11 |
| R29 | No implementation code created | ✔ | §26.2 |
| R30 | All known approval blockers closed (UC-2, OD-DB-5, 8, 15b, 18, 19, 21, 27; OD-UX-3/9) | ✔ | §22.4, §27 |

---

## 25. Final Cross-Reference Audit (Part 42)

| Area | SPEC | PRD | APP_FLOW | TRD | UI brief | Notes |
|---|---|---|---|---|---|---|
| Organization/outlet hierarchy | ORG-001/005 ✔ | ✔ | ✔ | §11 ✔ | n/a | `organizations`, `outlets`, TI-1 |
| Roles | RBAC-020/021 ✔ | ✔ | §3 ✔ | §13.2 ✔ | role matrix ✔ | UC-7 |
| Permissions | RBAC-004/005/010 ✔ | ✔ | AF-010 ✔ | §13.3 ✔ | n/a | `permissionOverrides` |
| Menu | MENU-001…017 ✔ | ✔ | AF-014…016 ✔ | §20 ✔ | ✔ | OD-DB-11 |
| Tables | TABLE-001…018 ✔ | ✔ | AF-017…022 ✔ | §21 ✔ | ✔ | OD-DB-13/14/26 |
| Orders | ORD-* ✔ | ✔ | ✔ | §22 ✔ | ✔ | UC-4/5; OD-DB-4/16/17 |
| KOT | KOT-* ✔ | ✔ | ✔ | §23 ✔ | ✔ | |
| Kitchen | KDS-* ✔ | ✔ | ✔ | §23 ✔ | ✔ | UC-8 |
| Billing | BILL-* ✔ | ✔ | ✔ | §25 ✔ | ✔ | UC-6; PO-1…PO-5 decided (§22.4) |
| Payment | PAY-* ✔ | ✔ | ✔ | §26 ✔ | ✔ | UC-3 |
| Day close | DAY-*, CASH-* ✔ | ✔ | AF-052/053 ✔ | §27 ✔ | ✔ | PO-6 decided; gross/net signed |
| Customer | CUSTOMER-* ✔ | ✔ | ✔ | §30 ✔ | ✔ | OD-DB-22; UC-12 |
| Feedback | FEEDBACK-* ✔ | ✔ | AF-055 ✔ | §30.3 ✔ | ✔ | |
| AI | AI-* ✔ | ✔ | AF-057…063 ✔ | §31 ✔ | ✔ | OD-DB-23/24 |
| Attention | ATTENTION-* ✔ | ✔ | AF-062 ✔ | §31.9 ✔ | ✔ | OD-DB-6 |
| Audit | AUDIT-* ✔ | ✔ | §26 ✔ | §32 ✔ | n/a | OD-DB-9 |
| Offline/idempotency | OFFLINE-*, ORD-006 ✔ | ✔ | AF-064 ✔ | §19 ✔ | ✔ | §12 |
| State machines | ✔ | ✔ | ✔ | §15 ✔ | ✔ | §10 |
| Financial precision | ✔ | ✔ | ✔ | TD-BILL-1 ✔ | ✔ | §6.5 |
| Historical snapshots | MENU-017 ✔ | ✔ | INV-04 ✔ | §20.4 ✔ | n/a | §16 |
| Suspension/closure | ONB-014/016, ORG-020… ✔ | ✔ | ✔ | §28 ✔ | ✔ | four independent dimensions kept separate (OD-DB-1/2) |
| Security | SEC-* ✔ | ✔ | ✔ | §35 ✔ | n/a | §18 |

---

## 26. TRD §46.1 Compliance and Verification Log

### 26.1 TRD §46.1 "The schema MUST…" → where satisfied

| TRD §46.1 requirement | Satisfied in |
|---|---|
| `organizationId` (+`outletId`) on every tenant record | §5, §6.2 TEN-O/TEN-OO, §9 |
| Compound indexes lead with them | IX-1, §13 |
| `rev` on §38.1 aggregates | §6.2 |
| Unique/partial-unique constraints of §37.3/§19.2/§21.3/§27.1 | §13.3 U5–U26 |
| `businessDayId` (+ `attributedDayId`/`recordedDayId`) stamps | `orders`, `orderItems`, `orderBatches`, `kots`, `bills`, `billRevisions`, `payments`, `refunds`, `tableOperationEvents`, `cancellation*` |
| `idempotencyKey` on every idempotent business document | §12.2 |
| Price/tax snapshots on order lines | `orderItems.snapshot` |
| Money as integer paise | §6.5 |
| Append-only collections: audit, payments, corrections, refunds, KOTs, cancellation records, bill revisions, table-operation events, print events, Day Close revisions | §19.5 append-only list |
| TTL for sessions, proposals, expired-link bookkeeping | §13.4 |
| Only hashes of refresh/invitation/order-link tokens | `sessions`, `invitations`, `customerOrderLinks` |
| History arrays for orders/items/bills/sessions | `history[]`, `tableHistory[]` |
| Never physically delete business records (F9) | §17 |
| Remove boilerplate 2FA/self-signup fields (C11) | §3.2 BC-1 |
| No state/field encoding a `PB-*` decision beyond reserved neutral forms | §22.2 stance column |

### 26.2 Verification actually performed

Re-run at the end of reconciliation pass R1 (2026-10-08) against the file as it stands.

| Check | Method | Result |
|---|---|---|
| Collection definitions complete | Script parsed every `### 11.n Collection:` section and required the 14 contract labels (Purpose, Scope, Lifecycle, Ownership, Indexes, Unique constraints, References, Embedded documents, Snapshots, State transitions, Audit, Concurrency, Retention, Security) | **51 / 51, 0 gaps** — the R1 run found 7 sections missing a *References* or *Snapshots* bullet; fixed |
| Inventory ↔ definitions | Script compared `C-01…C-51` in §7 with definition headings | **match (51)** |
| Decision cross-references | Script checked every `SD-n`, `OD-DB-n`, `UC-n` used is defined | **SD 49 / OD-DB 26 / UC 15 — none undefined** |
| Money fields | Script checked every `…Paise` token appears in the §6.5.1 dictionary | **all declared** (`paidPaise` appears only as the *rejected* name in MR-6/SD-5) |
| Index table | Script generated §28.4 from one data list | 118 rows; counts quoted in §28.4 are computed, not typed |
| No application code | Document contains only ASCII relationship diagrams in fenced blocks; `git status --short` shows no change outside `docs/` | **pass** |
| Official docs (re-fetched in R1) | MongoDB *Partial Indexes*, *Transactions*; Mongoose *Schema Types* | Findings in §28.7; `immutable` coverage of updates, custom SchemaTypes, `Map` value validators, retry-label semantics remain **`[TECHNICAL VERIFICATION REQUIRED]`** |
| Upstream reading | See §1.3 (R1 re-read row): TRD persistence sections and every cited SPEC/APP_FLOW/PRD id re-read at source; SPEC/PRD/APP_FLOW **not** read end to end | **limited — spot-check recommended** |
| Executed against a database | Not done: no schema instantiated, no index built, no query planned | **not verified at runtime** |
| R2 closure pass (2026-10-08) | Re-read at source: SPEC BILL-001…018, PAY-001…013, ORD-073/084/087, KDS-013, DAY-022/026, ANALYTICS-010/011, PO-TRD-01; PRD §39 (Bill Lifecycle), PRD-BILL-018.1/.AC1, PRD-DAY-022.1; APP_FLOW §16, AF-035/047/051, §18.3, AMB-02/05/11/14; TRD §5.2 C9, §15.5, §16.2, §25.4–25.6. Same script checks re-run after the edits | see §22.4 |
| R3 closure pass (2026-10-08) | Re-read at source: SPEC BILL-002/006/007/012/018, PAY-010/012/013, ORD-073/087, KDS-013, DAY-015/022/025/026, ANALYTICS-011; PRD §39, PRD-BILL-018.AC1, PRD-DAY-022.1; APP_FLOW §16, AF-035/047/051, §18.3, AMB-02/05/11/14; TRD §5.2, §15.2, §15.5–15.6, §25.4–25.9, §26.3–26.6, §27.3/27.5, PB register; UI brief §9.7 and OD register. All structural checks re-run after the edits (see below) | see §27.1 |
| Skills | Applied this pass: spec-driven, source-driven, context-engineering, constraint-driven, documentation-and-adrs, code-review, security-and-hardening, performance-optimization, api-and-interface-design, verification-before-completion, systematic-debugging. **Deliberately not used:** planning-and-task-breakdown (Implementation Plan is out of scope) |

---

## 27. Approval Status

| Item | Status |
|---|---|
| Document | **v1.0 — APPROVED FOR IMPLEMENTATION** |
| Basis | The product owner's decisions of 2026-10-08 (PO-1 … PO-6; delegation of OD-DB-27) and the closure gates of §27.1, all of which pass. The Implementation Plan may now be drafted; it has **not** been started and no code exists |
| Collections | 51 (39 required · 10 derived support · 1 provisional · 1 questionable — §28.9) |
| UC-2 | **RESOLVED** — TRD §5.2 C9 |
| OD-DB-5 · 8 · 15 (financial part) · 18 · 19 · 21 · 27 | **RESOLVED** — rules, sources and TRD sections in §22.4.1 |
| UI brief | OD-UX-3 and OD-UX-9 reconciled (`docs/UI_UX_DESIGN_BRIEF.md`) |
| Open, **not blocking** | OD-DB-1…4, 6, 7, 9…11, 13, 14, 15a (hold release), 16, 17, 22…26 and OD-DB-12; OTD-15a–e; 5 `[TECHNICAL VERIFICATION REQUIRED]` items (§28.7, one-hour spike with stated fallbacks) |
| Advisory boundary | GST compliance of TRD §25.4 items 1, 4, 5 (including the charge-tax reading of §25.9.3) is for the accountant, as the TRD already states; it changes configuration values, not the schema |
| Governance follow-up | SPEC, PRD and APP_FLOW still list AMB-02/05/11/14 as "not defined" (silent, not contradicted). Recording PO-1 … PO-6 as a SPEC amendment (A4) is recommended and is **not** a schema blocker |
| Code produced | **None** |
| Next artifact | Implementation Plan — **not started** |

### 27.1 Freeze gate (all must pass; verified in R3)

| Gate | Result | Evidence |
|---|---|---|
| UC-2 resolved | ✔ | TRD §5.2 C9 and §16.2 re-verified; schema §6.4, §23 |
| OD-DB-5, 8, 15b, 18, 19, 21, 27 resolved | ✔ | §22.2, §22.4.1; TRD §25.9 |
| No contradictory upstream/downstream rule | ✔ | stale-text search (see below) clean; SPEC/PRD/APP_FLOW silent, not contradicted; UI brief and TRD updated |
| Financial integrity | ✔ | §22.4.3 chain incl. worked example; no amount counted twice; no refund alters the bill total; no revision replaces history |
| Historical truth | ✔ | §28.2 (+ revision deltas, `deductsFromNet`) |
| Concurrency | ✔ | §28.6 (row 20 added: refund / cancel / payment on one bill) |
| Tenancy | ✔ | §28.3 unchanged |
| Security | ✔ | §18 unchanged; new fields carry no secrets |
| Indexes | ✔ | §28.4 regenerated (118 rows); re-fire index removed |
| TTL / retention | ✔ | §22.3 unchanged |
| 51 collection definitions structurally complete | ✔ | §26.2 script |
| No undefined decision / blocker remains | ✔ | no open product-owner-decision marker and no TRD-amendment marker remains; remaining open items are non-blocking and named |

*These gates assess the **document**; nothing here has been executed against a database.*

---

## 28. Reconciliation Pass R1 — Audit Evidence

This section records the audits run in the final reconciliation pass. It adds **no** product behaviour. Each audit lists what was checked, what was found, and what changed in the document. Changes made to the schema in R1 are summarized in §28.13.

### 28.1 Financial model audit (Part 6)

**Per-collection check.** "Integer paise" = every money field is a safe-integer `Paise`/`PaiseSigned` (MR-1, §6.5.1); class per MR-4.

| Collection | Money fields | Integer paise | Class | Immutability / append-only | R1 finding |
|---|---|---|---|---|---|
| `menuItems` (+ `variants[]`) | `basePricePaise` | ✔ | CONFIG | mutable master; never used to rebuild history | — |
| `menuOutletOverrides` | `priceOverridePaise`, `variantPrices[].…` | ✔ | CONFIG | mutable; not history | — |
| `modifierGroups` | `options[].priceDeltaPaise` (signed) | ✔ | CONFIG | mutable; not history | — |
| `outlets` | `charges.*.valuePaise` (flat basis) | ✔ | CONFIG | mutable; not history | charge basis decided (PO-2); bills snapshot it at application |
| `orderBatches` | `lines[].snapshot.unitPricePaise`, `lineTotalPaise` | ✔ | SNAPSHOT → materialized | pending batch only | — |
| `orderItems` | `snapshot.unitPricePaise`, `snapshot.modifiers[].priceDeltaPaise`, `lineTotalPaise` | ✔ | SNAPSHOT / LIVE-DERIVED until KOT | `snapshot` subtree `immutable:true` | — |
| `bills` | `totals.*`, `adjustments[].amountPaise/valuePaise`, `recordedPaymentsPaise`, `outstandingPaise`, `overpaymentPaise`, `refundedPaise` | ✔ | LIVE-DERIVED + LEDGER entries | adjustments `$push`/mark-removed only; bill is the only mutable money aggregate | `paymentStatus` unaffected by refunds; overpayment nets refunds (PO-1); `REFUNDED` status (OD-DB-27) |
| `billRevisions` | `lines[]`, `totals.*`, `adjustments[]` | ✔ | SNAPSHOT | insert-only; no update/delete path (F9) | **+ `header` snapshot (SD-45)** |
| `billPrintEvents` | none | n/a | LEDGER | insert-only | — |
| `payments` | `amountPaise` | ✔ | LEDGER | insert-only; correction = new entry with `supersedes` | `supersededBy` derived, never stored (UC-3); `reference` unique narrowed to `PAYMENT` |
| `refunds` | `amountPaise` | ✔ | LEDGER | insert-only; day attributions frozen | `deductsFromNet` snapshot (PO-5); mistaken-refund correction mechanism undefined upstream (OD-DB-9) |
| `dayCloseRevisions` | `totals.*` | ✔ | SNAPSHOT | insert-only; re-close appends `n+1` | **`netSalesPaise` signed** (OD-DB-20 resolved); gross = Σ `deltaPaise` of the day (PO-6); `grossSalesPaise` signed |
| `cashReconciliations` | `cashPaymentsPaise`, `cashRefundsPaise`, `expectedCashPaise`, `countedCashPaise`, `variancePaise` (signed) | ✔ | SNAPSHOT | insert-only per revision | — |
| `dayRollups`, `dailyBriefs`, `customerOutletProfiles` | `metrics`/`facts` map values | ✔ (MR-7) | DERIVED | rebuildable / generated | **MR-7 added**: integer-only `Number` slots |
| `attentionItems` | `evidence[].value/baselineValue` | ✔ (MR-7) | SNAPSHOT | insert-only evidence | **MR-7 added** |
| `counters` | `seq` (invoice/order numbers, not money) | n/a | CONFIG-like | `$inc` only | — |

**Checklist.**

| Check | Result |
|---|---|
| Every monetary persistence field uses integer paise | **PASS** — dictionary §6.5.1 lists each; custom `Paise` SchemaType with `Number.isSafeInteger` |
| No floating monetary field exists | **PASS** — R1 added MR-7 to close the generic `Number` map/evidence slots; `Decimal128`/`Double` forbidden |
| Snapshots immutable where required | **PASS** — `orderItems.snapshot` (`immutable`), `billRevisions`, `dayCloseRevisions`, `cashReconciliations` are insert-only collections or immutable subtrees |
| Payment records remain append-oriented | **PASS** — `payments` insert-only, plugin-enforced; DB role denies update/delete on append-only collections (§18.5) |
| Refund history remains auditable | **PASS** — ledger, `REFUNDED` status, `deductsFromNet`; refunds never alter `T`, `P` or `paymentStatus` (PO-1) |
| Bill state and payment state independent | **PASS** — two fields, `paymentStatus` derived in the same transaction as any payment/refund/total change |
| Reopen does not erase historical financial truth | **PASS** — Reopen appends a history entry; revision `n` is untouched; re-finalization appends `n+1` |
| Finalization does not destroy prior revisions | **PASS** — `(billId, n)` unique, insert-only |
| Overpayment preserved | **PASS** — `overpaymentPaise` stored, never clamped away (PAY-012) |
| Additional items after payment | **PASS** — allowed only while the bill is not Finalized (TABLE-010); totals recompute, existing payments are kept, `outstandingPaise`/`paymentStatus` recompute in the same transaction (PAY-012); a Finalized bill needs Reopen |
| Cash reconciliation preserved | **PASS** — one row per revision; never overwritten |
| Day Close reconstructable | **PASS** — components + warnings + cash row; Gross/Net recomputable from `billRevisions.deltaPaise` and `refunds.deductsFromNet`; closed days never mutated (PO-6) |
| Post-close correction behaviour not invented | **PASS** — nothing mutates a Day Close revision; both day attributions and every revision's totals are stored so any upstream policy is computable |

**Financial ambiguities that remain: none.** The six former blockers are decided (PO-1…PO-6) and OD-DB-27 is resolved (§22.4). The only advisory item is the accountant's GST review of TRD §25.4 items 1, 4 and 5 (existing boundary).

### 28.2 Historical-truth audit (Part 7)

For each historical value the test was: **"could this value change later because its source/master record changes?"**

| Chain link | Value | Could it change later? | Treatment |
|---|---|---|---|
| Menu → Order item | name, variant, unit price (after override), modifier names/deltas, tax rate + components, station, prep time | Yes — menu, override, modifier, tax edits | **Snapshotted** in `orderItems.snapshot` (immutable); reference ids are provenance only |
| Order → KOT | table label, order number, line text, notes, station | Yes — table rename/transfer, item edit | **Snapshotted** in `kots`; KOT is insert-only |
| Order → table history | table label at each association | Yes — table rename/delete | **Snapshotted in R1**: `tableLabel` / `fromTableLabel` in `orders.tableAssociations[]` and `tableSessions.tableHistory[]` (SD-48) |
| Order → customer | name, phone | Yes — customer record edit | **Snapshotted** in `orders.customerContact` |
| Order → Bill (Draft/Reopened) | lines | — | **Live reference to item snapshots** (which are immutable); totals LIVE-DERIVED and frozen at finalization |
| Bill → Bill revision | lines, adjustments, totals, tax breakdown, `calcVersion`, invoice number | Yes — pricing/tax/charge config, reopen | **Frozen** in `billRevisions` |
| Bill → Bill revision | outlet name/code, address, contact, GSTIN, table label or Takeaway, order number, customer contact | **Yes** — outlet/table/customer edits | **Gap found in R1 → snapshotted**: `billRevisions.header` (SD-45) |
| Bill → Payment ledger | amount, mode, reference, recorded day | No — insert-only ledger | Ledger row is the truth |
| Payment → Refund | amount, mode, reason, actor, `attributedDayId`, `recordedDayId` | No | Insert-only; both day attributions frozen |
| Business day → Day Close | components, warnings, confirmation, closing actor/time | No | `dayCloseRevisions` insert-only |
| Day Close → Cash reconciliation | cash payments/refunds, expected, counted, variance | No | `cashReconciliations` insert-only, inputs stored beside the result |
| Actor on any record | user id, **role at the time** | Role may change; **display name may change** | `ActorRef` freezes id + role-at-time. The display name is a **justified live reference**: it is PII, mutable, and identity is keyed by the immutable id; history screens resolve the current name |
| Outlet on any record | `outletId` | Outlet rename; staff reassignment | `outletId` immutable (outlet-at-time, ORG-010); outlet **name** on operational screens is a justified live display value; on financial documents it is snapshotted (`header`) |
| Customer feedback | rating/comment, order/outlet/customer context | No | Insert-only; `orderSource` stored |
| Daily brief | facts, metrics, model metadata | Recompute | Snapshotted at generation (`dailyBriefs`) |
| Day rollups | metrics | Rebuild | Derived read model, **rebuilt from the ledger, never from master data**; never authoritative |

**Reconstruction rule (unchanged, §16.2):** historical financial figures come only from `orderItems.snapshot`, `billRevisions`, `payments`, `refunds`, `dayCloseRevisions`, `cashReconciliations`; no query may read menu, modifier, override, outlet-charge, payment-mode or tax configuration to rebuild them.

### 28.3 Tenancy and authorization audit (Part 8)

**Nullable-outlet semantics (the only places `outletId` is optional).** `outletId = null` means *organization-level* (the record belongs to the organization as a whole); `outletId` set means *outlet-scoped*. In both cases `organizationId` is required and is the first predicate of every read; when `outletId` is set the actor must additionally hold that outlet. This removes the two-way reading the inventory used to hint at with "(+outlet?)" `[SCHEMA DECISION SD-49]`.

| # | Collection | Organization scope | Outlet scope | Global / platform scope | Access boundary |
|---|---|---|---|---|---|
| C-01 | `organizations` | `_id` **is** the tenant id | — | SuperAdmin list/filter | Owner: own org; SuperAdmin: all (`scope:'platform'`) |
| C-02 | `outlets` | required | `_id` is the outlet id | 3 public keys resolve platform-wide | Owner: org's outlets; others: `allowedOutletIds` |
| C-03 | `outletStateEvents` | required | required | — | outlet access |
| C-04 | `users` | required iff `RESTAURANT_USER` (null for SuperAdmin) | — (via `staffAssignments`) | `email`/`phone` unique platform-wide; SuperAdmin principal | Owner/Manager within org + outlets (ACT-STF) |
| C-05 | `staffProfiles` | required | `currentOutletId` is a **pointer**, not ownership | — | Owner; Manager own outlets; self (availability) |
| C-06 | `staffAssignments` | required | required | — | Owner; Manager own outlets |
| C-07 | `permissionOverrides` | required | — (outlet reach is separate, E5) | — | Owner (+ `ACT-STF-05`) |
| C-08 | `sessions` | required for restaurant users; null for SuperAdmin | — | `refreshHash` platform lookup | the session's own user; Owner/Manager revoke |
| C-09 | `invitations` | required | — | `tokenHash` platform lookup | SuperAdmin issues; holder of token redeems once |
| C-10 | `auditEvents` | = scope of the **audited action** (null for platform actions) | set for outlet-level actions, else null | platform actions | **SuperAdmin only** read (AUDIT-007, CON-01) |
| C-11 | `auditSeals` | one chain per scope | one chain per outlet scope | platform chain | system only (insert/find) |
| C-12–14 | `menuCategories`, `menuItems`, `modifierGroups` | required | — (variants live in `menuOutletOverrides`) | — | Owner/Manager with ACT-MNU |
| C-15 | `menuOutletOverrides` | required | required | — | outlet access |
| C-16–17 | `menuImports`, `menuImportCandidates` | required | — | — | Owner |
| C-18 | `uploadedFiles` | required | optional (SD-49) | `objectKey` platform-unique | presign only after tenancy check |
| C-19–20 | `floors`, `tables` | required | required | `tables.qrKey` platform lookup | outlet access |
| C-21–31 | `tableSessions`, `tableOperationEvents`, `customerDrafts`, `occupancyClaims`, `orders`, `orderBatches`, `orderItems`, `cancellationRecords`, `cancellationRequests`, `kitchenStations`, `kots` | required | required | — | outlet access + permission + state |
| C-32–39 | `bills`, `billRevisions`, `billPrintEvents`, `payments`, `refunds`, `businessDays`, `dayCloseRevisions`, `cashReconciliations` | required | required | — | outlet access + permission + state |
| C-40 | `dayRollups` | required | required | — | Owner (authorized outlets), Manager (assigned) |
| C-41 | `customers` | required (customer = per organization) | — (visibility is outlet-scoped through `customerOutletProfiles`/orders, S9; org-wide phone matching never widens visibility, CUSTOMER-021) | — | Owner: all outlets; others: own-outlet history only |
| C-42 | `customerOutletProfiles` | required | required | — | outlet access |
| C-43 | `customerOrderLinks` | required | required | `tokenHash` platform lookup | link principal: **exactly one order** (CUSTOMER-022) |
| C-44 | `feedback` | required | required | — | outlet access; customer by link |
| C-45 | `aiProposals` | required | optional (SD-49): null = org-wide action | — | **Owner only** (`ownerId`) |
| C-46 | `aiInteractions` | required | optional: working-outlet context | — | platform operations; Owners have no read route |
| C-47 | `dailyBriefs` | required | required | — | Owner (authorized outlets), Manager (assigned) |
| C-48 | `whatsappMessages` | required | required | `providerMessageId` platform-unique | outlet access |
| C-49 | `attentionItems` | required | required | — | Owner; Manager for assigned outlets (ATTENTION-008) |
| C-50 | `counters` | required | required | — | system |
| C-51 | `migrations` | — | — | platform | migration task DB user only |

**Verification.** All 51 rows have an explicit organization, outlet and platform answer; no collection leaves ownership ambiguous. The three documents the audit paid particular attention to resolve as follows: `customers` is **organization**-owned with outlet-scoped *visibility*; `staffProfiles` is **organization**-owned (per person) with an outlet pointer; `auditEvents` takes the scope of the action it records.

### 28.4 Index audit and rationale (Parts 9–10)

| # | Collection | Index (keys; filter) | Kind | Query it supports | Tenant-led? | Verdict / R1 finding |
|---|---|---|---|---|---|---|
| 1 | `organizations` | `(platform.status, createdAt)` | - | SuperAdmin restaurant list/filter (SCR-040/041) | N — platform list: the collection *is* the tenant list | Keep |
| 2 | `outlets` | `(organizationId, code)` | U | Invoice prefix unambiguous per organization (SD-13) | Y | Keep |
| 3 | `outlets` | `(organizationId, createdAt)` | - | Owner outlet list | Y | Keep |
| 4 | `outlets` | `(tablelessQrKey) · (websiteKey) · (whatsapp.businessNumberId)` | U P | Public key → outlet with no tenant context (TRD §21.5/§29.1) | N — public resolution, no tenant yet (§5.3) | Keep |
| 5 | `outletStateEvents` | `(organizationId, outletId, createdAt desc)` | - | Outlet Open/Closed timeline | Y | Keep |
| 6 | `users` | `(email) · (phone)` | U P | Login identifier, platform-wide (TD-AUTH-2, SCR-001 has no tenant selector) | N — login has no tenant context (§5.3) | Keep |
| 7 | `users` | `(organizationId, role, status)` | - | Staff list by role/status; prefix serves any org staff listing | Y | Keep — `(organizationId, status)` removed in R1 as redundant |
| 8 | `staffProfiles` | `(organizationId, userId)` | U | Profile per person (SD-9) | Y | Keep |
| 9 | `staffAssignments` | `(organizationId, userId) where `ACTIVE` ∧ `isExclusive`` | U P | Exactly one current outlet for Cashier/Waiter/Kitchen (ORG-008, SD-17) | Y | Keep |
| 10 | `staffAssignments` | `(organizationId, outletId, userId) where `ACTIVE`` | U P | No duplicate active row per outlet | Y | Keep |
| 11 | `staffAssignments` | `(organizationId, outletId, status, role)` | - | Outlet staff list (SCR-015) | Y | Keep |
| 12 | `staffAssignments` | `(organizationId, userId, status)` | - | `allowedOutletIds` at sign-in / authz recompute | Y | Keep |
| 13 | `permissionOverrides` | `(organizationId, role) where `ROLE`; (organizationId, userId) where `USER`` | U P | One override document per role/user (a second concurrent create becomes an update) | Y | Keep |
| 14 | `sessions` | `(refreshHash)` | U | Refresh lookup (no tenant context) | N — token lookup (§5.3) | Keep |
| 15 | `sessions` | `(prevRefreshHash) where string` | P | Reuse detection → revoke family (TD-AUTH-3) | N — token lookup | Keep |
| 16 | `sessions` | `(userId, revokedAt)` | - | Revoke-all-for-user on deactivation/reset (C-REVOKE) | N — keyed by globally unique `userId` | Keep |
| 17 | `sessions` | `(absoluteExpiresAt) expireAfterSeconds 86400` | T | Purge expired sessions `[TRD §37.3]` | N — TTL is single-field by MongoDB rule | Keep — TTL **safe** (expired session unusable; not a business/audit record); grace = OTD-15e |
| 18 | `invitations` | `(tokenHash)` | U | Redemption lookup (no tenant context) | N — token lookup | Keep |
| 19 | `invitations` | `(organizationId, userId, status)` | - | Current invitation of a user (resend revokes previous) | Y | Keep |
| 20 | `invitations` | `(status, createdAt) where `PENDING`` | P | Reconciler scan of unsent invitations (INTEG-003) | N — system reconciler scans all tenants | Keep |
| 21 | `auditEvents` | `(organizationId, outletId, occurredAt desc)` | - | SuperAdmin org/outlet timeline, cursor `(occurredAt,_id)` (TRD §32.6) | Y | Keep |
| 22 | `auditEvents` | `(organizationId, occurredAt desc)` | - | Organization-wide timeline (the outlet-led index cannot serve it) | Y | Keep |
| 23 | `auditEvents` | `(action, occurredAt desc)` | - | SuperAdmin action filter `[TRD §37.3]` | N — platform-wide filter, sole reader is the SuperAdmin route | Keep |
| 24 | `auditEvents` | `(actor.id, occurredAt desc)` | - | SuperAdmin per-actor filter | N — platform-wide filter | Keep |
| 25 | `auditEvents` | `(target.type, target.id, occurredAt desc)` | - | Per-entity trail | N — platform-wide filter | Keep — write tax accepted (audit is append-only, low volume, TRD §32.7); each index mirrors a TRD §32.6 filter |
| 26 | `auditSeals` | `(scopeKey, seq)` | U | Chain integrity: a gap/duplicate is detectable `[TRD §37.3]` | N — chain per scope (platform/org/outlet) | Keep |
| 27 | `auditSeals` | `(eventId)` | U | An event is sealed exactly once | N — keyed by globally unique id | Keep |
| 28 | `menuCategories` | `(organizationId, parentId, status, sortOrder)` | - | Render the category tree | Y | Keep |
| 29 | `menuItems` | `(organizationId, categoryId, status, sortOrder)` | - | Category listing | Y | Keep |
| 30 | `menuItems` | `(organizationId, publishState, status)` | - | `resolveOutletMenu` load of orderable items | Y | Keep — `nameNormalized` index removed in R1 (duplicate detection is in-memory over a bounded set) |
| 31 | `modifierGroups` | `(organizationId, status)` | - | Modifier group list | Y | Keep |
| 32 | `menuOutletOverrides` | `(organizationId, outletId, menuItemId)` | U | One override per item per outlet; `(org, outlet)` prefix loads all overrides | Y | Keep |
| 33 | `menuImports` | `(organizationId, status, createdAt desc)` | - | Owner import list + reconciler | Y | Keep |
| 34 | `menuImportCandidates` | `(organizationId, importId, rowRef)` | U | Candidate identity; prefix loads an import | Y | Keep — `flags.code` index removed in R1 (in-memory filter over a bounded draft) |
| 35 | `uploadedFiles` | `(objectKey)` | U | Presign/read binds an S3 key to exactly one tenant record | N — object key is globally unique (§5.3) | Keep |
| 36 | `uploadedFiles` | `(organizationId, purpose, createdAt desc)` | - | Latest file per purpose (logo, item images) | Y | Keep |
| 37 | `floors` | `(organizationId, outletId, status, sortOrder)` | - | Floor list | Y | Keep |
| 38 | `tables` | `(qrKey)` | U | Public QR → outlet+table (no tenant context) | N — public resolution (§5.3) | Keep |
| 39 | `tables` | `(organizationId, outletId, floorId, state)` | - | Table grid load (prefix `(org,outlet)`) + floor/state filter | Y | Keep — the earlier unique `(org,outlet,label)` was **withdrawn** (OD-DB-26) |
| 40 | `tableSessions` | `(organizationId, outletId, tableId) where `ACTIVE`` | U P | One active session per table (TABLE-014); also fails a transfer to an occupied table | Y | Keep |
| 41 | `tableSessions` | `(organizationId, outletId, status)` | - | Active sessions of an outlet; history by status | Y | Keep |
| 42 | `tableOperationEvents` | `(organizationId, outletId, idempotencyKey)` | U | Idempotent table operation (TRD §19.2) | Y | Keep |
| 43 | `tableOperationEvents` | `(organizationId, outletId, createdAt desc)` | - | Operations timeline | Y | Keep |
| 44 | `tableOperationEvents` | `(organizationId, outletId, orderIds)` | M | History of one order's table operations (TABLE-016) | Y | Keep |
| 45 | `customerDrafts` | `(organizationId, outletId, draftKey)` | U | Idempotent draft upsert (TD-ORD-4) | Y | Keep |
| 46 | `customerDrafts` | `(organizationId, outletId, lastActivityAt) where `isOpen`` | P | Abandonment sweep scans only open drafts (SD-28) | Y | Keep |
| 47 | `occupancyClaims` | `(organizationId, outletId, tableId) where `isActive`` | P | Find the active claim(s) of a table | Y | Keep — **deliberately non-unique** (AMB-04/OD-DB-14) |
| 48 | `orders` | `(organizationId, outletId, idempotencyOperation, idempotencyKey) where string` | U P | Duplicate order submit (ORD-006) — the one `Org+Outlet+Operation+Key` scope | Y | Keep |
| 49 | `orders` | `(organizationId, outletId, businessDayId, orderSeq) where number` | U P | Human order number unique per outlet-day | Y | Keep |
| 50 | `orders` | `(organizationId, outletId, stage, createdAt)` | - | Active orders, awaiting-acceptance queue, handoff lists | Y | Keep |
| 51 | `orders` | `(organizationId, outletId, tableSessionId, stage)` | - | Orders of a session | Y | Keep |
| 52 | `orders` | `(organizationId, outletId, tableId, stage)` | - | Orders of a table | Y | Keep |
| 53 | `orders` | `(organizationId, outletId, businessDayId, stage)` | - | Day Close warnings (non-terminal orders) + day reports | Y | Keep |
| 54 | `orders` | `(organizationId, customerId, createdAt desc) where objectId` | P | Customer history (outlet filter applied by S4; never widens, S9) | Y — org-led; outlet applied by guard because the Owner reads cross-outlet | Keep |
| 55 | `orders` | `(organizationId, outletId, createdAt desc)` | - | Outlet order history / bills lists (SCR-026/031) | Y | Keep |
| 56 | `orderBatches` | `(organizationId, outletId, orderId, idempotencyKey)` | U | Add-items batch dedupe (TRD §19.2) | Y | Keep |
| 57 | `orderBatches` | `(organizationId, outletId, status, createdAt) where `AWAITING_ACCEPTANCE`` | P | Pending add-batch queue | Y | Keep |
| 58 | `orderItems` | `(organizationId, outletId, state, priority, createdAt)` | - | **KDS queue** (≤ 200 active items) and ready/handoff lists | Y | Keep |
| 59 | `orderItems` | `(organizationId, outletId, orderId, lineNo)` | U | Stable line numbers; prefix loads an order's items | Y | Keep |
| 60 | `orderItems` | `(organizationId, orderId, state)` | - | `deriveOrderStage` roll-up inside transactions | Y | Keep — hot, transactional; org-led (orderId is globally unique) |
| 61 | `orderItems` | `(organizationId, outletId, businessDayId, state)` | - | Day Close warnings (items in progress) + day analytics | Y | Keep |
| 62 | `cancellationRecords` | `(organizationId, outletId, target.type, target.id)` | U | A target is cancelled at most once (terminal) | Y | Keep |
| 63 | `cancellationRecords` | `(organizationId, outletId, orderId, createdAt)` | - | Order timeline | Y | Keep |
| 64 | `cancellationRecords` | `(organizationId, outletId, businessDayId, kind)` | - | Cancellation analytics by reason/kind | Y | Keep |
| 65 | `cancellationRequests` | `(organizationId, outletId, orderItemId) where `OPEN`` | U P | At most one OPEN request per item (TRD §15.4) | Y | Keep |
| 66 | `cancellationRequests` | `(organizationId, outletId, status, requestedAt)` | - | Kitchen list + stale sweep | Y | Keep |
| 67 | `kitchenStations` | `(organizationId, outletId, status, sortOrder)` | - | Station list | Y | Keep |
| 68 | `kots` | `(organizationId, outletId, sourceKey)` | U | A KOT can never be created twice (KOT-007) | Y | Keep |
| 69 | `kots` | `(organizationId, outletId, businessDayId, kotSeq)` | U | KOT number unique per outlet-day; also lists a day's KOTs in order | Y | Keep — `(…businessDayId, createdAt)` removed in R1 as redundant |
| 70 | `kots` | `(organizationId, outletId, orderId, createdAt)` | - | KOT history on an order (KOT-008) | Y | Keep |
| 71 | `bills` | `(organizationId, orderId)` | U | One bill per order (BILL-015) | Y | Keep |
| 72 | `bills` | `(organizationId, outletId, invoiceFy, invoiceSeq) where number` | U P | Invoice sequence never duplicates (PO-TRD-01 #5) | Y | Keep |
| 73 | `bills` | `(organizationId, outletId, invoiceNumber) where string` | U P | Printed invoice number never duplicates | Y | Keep |
| 74 | `bills` | `(organizationId, outletId, status, paymentStatus)` | - | Unresolved bills, independent of day (ANALYTICS-010/011) | Y | Keep |
| 75 | `bills` | `(organizationId, outletId, businessDayId, status)` | - | Day views | Y | Keep |
| 76 | `bills` | `(organizationId, outletId, createdAt desc)` | - | Bill history/search | Y | Keep |
| 77 | `billRevisions` | `(organizationId, billId, n)` | U | One revision number per bill | Y | Keep |
| 78 | `billRevisions` | `(organizationId, outletId, businessDayId)` | - | Day Close gross sales = Σ `deltaPaise` of the day (PO-6) | Y | Keep |
| 79 | `billRevisions` | `(organizationId, outletId, attributedDayId)` | - | As-originally-attributed report: Σ `deltaPaise` by original day (PO-6); report only | Y | Keep — still needed: the PO-6 rule keeps original attribution as metadata |
| 80 | `billPrintEvents` | `(organizationId, billId, createdAt)` | - | Print/reprint log of a bill | Y | Keep |
| 81 | `payments` | `(organizationId, billId, idempotencyKey)` | U | Duplicate payment submission (PAY-006) | Y | Keep |
| 82 | `payments` | `(organizationId, billId, reference) where `PAYMENT` ∧ string` | U P | One provider reference per original payment `[TRD §37.3]` | Y | Keep — **R1 narrowed the filter to `type:'PAYMENT'`** (a CORRECTION may repeat the reference) |
| 83 | `payments` | `(organizationId, billId, supersedes) where objectId` | U P | An entry is superseded at most once (concurrent corrections) | Y | Keep |
| 84 | `payments` | `(organizationId, billId, recordedAt)` | - | Bill ledger | Y | Keep |
| 85 | `payments` | `(organizationId, outletId, businessDayId, mode, type)` | - | Day Close per-mode totals and expected cash | Y | Keep |
| 86 | `refunds` | `(organizationId, billId, idempotencyKey)` | U | Duplicate refund | Y | Keep |
| 87 | `refunds` | `(organizationId, billId, createdAt)` | - | Bill refund list | Y | Keep |
| 88 | `refunds` | `(organizationId, outletId, recordedDayId, mode)` | - | Day Close refunds / cash refunds (DAY-026, CASH-007) | Y | Keep |
| 89 | `refunds` | `(organizationId, outletId, attributedDayId)` | - | Attribution reports (DAY-022) | Y | Keep |
| 90 | `businessDays` | `(organizationId, outletId) where `isActive`` | U P | Never two active days per outlet (DAY-015) | Y | Keep |
| 91 | `businessDays` | `(organizationId, outletId, dayNo)` | U | Contiguity/monotonic day numbers | Y | Keep |
| 92 | `businessDays` | `(organizationId, outletId, status, closedAt desc)` | - | Most recent closed day (Reopen target) + history | Y | Keep |
| 93 | `dayCloseRevisions` | `(organizationId, outletId, businessDayId, n)` | U | One revision number per day | Y | Keep |
| 94 | `dayCloseRevisions` | `(organizationId, outletId, businessDayId, idempotencyKey)` | U | Retried Close returns the existing record (EF-09) | Y | Keep |
| 95 | `cashReconciliations` | `(organizationId, outletId, businessDayId, revision)` | U | One reconciliation per Day Close revision | Y | Keep |
| 96 | `dayRollups` | `(organizationId, outletId, businessDayId, closeRevision)` | U | Dashboard/brief reads; idempotent rebuild | Y | Keep |
| 97 | `customers` | `(organizationId, phone)` | U | One customer per phone per organization (CUSTOMER-021) | Y | Keep |
| 98 | `customerOutletProfiles` | `(organizationId, outletId, customerId)` | U | One profile per customer per outlet | Y | Keep |
| 99 | `customerOutletProfiles` | `(organizationId, outletId, lastOrderAt desc)` | - | Outlet customer list (SCR-031) | Y | Keep |
| 100 | `customerOrderLinks` | `(organizationId, orderId)` | U | One link per order (idempotent issuance) | Y | Keep |
| 101 | `customerOrderLinks` | `(tokenHash)` | U | Public lookup, no tenant context | N — token lookup (§5.3) | Keep |
| 102 | `customerOrderLinks` | `(purgeAt) expireAfterSeconds 0` | T | Purge expired link rows `[TRD §37.3]` | N — TTL is single-field | Keep — TTL **safe** (no business truth; access refused by explicit `expiresAt` check); grace = OTD-15a |
| 103 | `feedback` | `(organizationId, orderId)` | U | One feedback per order (FEEDBACK-006) | Y | Keep |
| 104 | `feedback` | `(organizationId, outletId, createdAt desc)` | - | Owner/Manager feedback list (SCR-032) | Y | Keep |
| 105 | `aiProposals` | `(organizationId, ownerId, status, createdAt desc)` | - | Owner's pending proposals | Y | Keep |
| 106 | `aiProposals` | `(purgeAt) expireAfterSeconds 0` | T | Purge non-executed terminal proposals `[TRD §31.3]` | N — TTL is single-field | Keep — TTL **safe only because EXECUTED proposals never get `purgeAt`** (SD-47); grace = OTD-15b |
| 107 | `aiInteractions` | `(organizationId, userId, createdAt desc)` | - | Per-user budget / abuse review | Y | Keep |
| 108 | `aiInteractions` | `(purgeAt) expireAfterSeconds 0` | T | Optional purge once OTD-15c is decided | N — TTL is single-field | Keep — **inactive by default**: no document has `purgeAt` until a retention is configured (OTD-15c) |
| 109 | `dailyBriefs` | `(organizationId, outletId, businessDayId, closeRevision)` | U | Brief job idempotency | Y | Keep |
| 110 | `dailyBriefs` | `(organizationId, outletId, generatedAt desc)` | - | Latest brief | Y | Keep |
| 111 | `whatsappMessages` | `(providerMessageId)` | U | Webhook dedupe across the platform (TRD §19.2) | N — provider ids are global (§5.3) | Keep |
| 112 | `whatsappMessages` | `(organizationId, outletId, receivedAt desc)` | - | Inbox / diagnostics by outlet | Y | Keep |
| 113 | `whatsappMessages` | `(organizationId, outletId, status) where `FAILED`` | P | Integration-failure surfacing | Y | Keep |
| 114 | `whatsappMessages` | `(purgeAt) expireAfterSeconds 0` | T | Optional purge once OTD-15d is decided | N — TTL is single-field | Keep — **inactive by default** (OTD-15d; dedupe-window verification required) |
| 115 | `attentionItems` | `(organizationId, outletId, signalType, periodKey)` | U | Idempotent detection; `periodKey` includes `requestId` for stale requests so distinct occurrences never collapse | Y | Keep |
| 116 | `attentionItems` | `(organizationId, outletId, status, detectedAt desc)` | - | Attention list | Y | Keep |
| 117 | `counters` | `(organizationId, outletId, key, period)` | U | One counter per outlet-year (invoice sequence) | Y | Keep |
| 118 | `migrations` | `(migrationId)` | U | Migration ledger | N — platform-scope | Keep |

**Reading the table.** *Kind*: **U** unique · **P** partial · **T** TTL · **M** multikey. *Tenant-led* is `Y` when the first key is `organizationId` (and `outletId` second for outlet-owned data); every `N` states why. Each index was tested against: the query it serves; field order; tenant boundary; whether uniqueness is really required; whether a partial filter is needed; whether it creates an unintended constraint; redundancy; TTL safety; conflict with retention; and the TRD access pattern.

**R1 index changes (all documented in the table; R3 adds one more removal, below):** removed 6 (`users(org,status)`, `menuItems(org,nameNormalized)`, `menuImportCandidates(…flags.code)`, `kots(…day,createdAt)`, `organizations(ownerUserId)`, and the invented **unique** `tables(org,outlet,label)`); **narrowed** `payments(org,billId,reference)` to `type:'PAYMENT'`; kept both `billRevisions` day selections until OD-DB-21; marked the AI-log and WhatsApp TTL indexes **inactive by default**. Final counts: 118 index rows (some rows bundle a pair of sibling indexes), of which 50 are unique (incl. partial), 5 are TTL (3 active by design, 2 inactive until decided), and 23 are non-tenant-led (each justified in the table). **R3:** `orderItems(org,outlet,refireOfItemId)` removed (re-fire is a KOT line only, PO-3); the two `billRevisions` day indexes are both kept for PO-6.

### 28.5 State-machine audit (Part 11)

| Entity | State field | States | Transition authority | Terminal | History | Reopen / correction | Audit | Consistent with TRD |
|---|---|---|---|---|---|---|---|---|
| Order | `orders.stage` (+ `awaitingAcceptance` invariant) | 11 (`DRAFT`…`REJECTED`†) | §10.2 atoms; `deriveOrderStage` | `COMPLETED`, `CANCELLED`, `REJECTED`† | `history[]` | none — terminal; billing corrections via bill Reopen | ORDER.* per AUDIT-002 | ✔ TRD §15.1 (name of †: OD-DB-4) |
| Order item | `orderItems.state` | 7 | KDS/handoff/cancel atoms | `SERVED`, `PICKED_UP`, `CANCELLED` | `history[]` | via bill Reopen / new KOTs | via `cancellationRecords` + audit | ✔ §15.2 |
| KOT | none | `kind` only | system | — | the record | new KOT | — | ✔ §23.1. **Insert-only, no state field:** a KOT is a historical issuance; a state would invite edits (ORD-090) |
| Bill | `bills.status` | `DRAFT/FINALIZED/REOPENED/CANCELLED/REFUNDED` | ACT-BIL-* | `CANCELLED`, `REFUNDED` (no exit — OD-DB-27) | `history[]` + revisions | Reopen → re-finalize (delta); no Reopen from `REFUNDED` | BILL.* | ✔ §15.5 (amended by PO-TRD-03) |
| Payment | none | `type` only | ACT-PAY-* | — | ledger | `CORRECTION` supersedes | PAYMENT.CORRECTED | ✔ §26.1 (**no payment states by TRD decision**) |
| Refund | none | — | ACT-PAY refund atom | — | ledger | audited correction (mechanism undefined) | REFUND.RECORDED | ✔ §26.6. Insert-only, no state |
| Business day | `businessDays.status` | 4 | Day Close/Reopen atoms; system | `ABSORBED`; `CLOSED` until reopened | `dayCloseRevisions`, `reopenEvents[]` | Reopen Day → re-close | DAY.* | ✔ §27 |
| Outlet | `activation.state`, `availability.state` | 2 + 2 (nullable) | Owner; Owner/Manager | `ACTIVATED` | `outletStateEvents` | reversible Open/Closed | AI-executed only (PB-19) | ✔ §28 |
| Staff availability | `staffProfiles.attendance`, `.availability` | 2 + 3 | Owner/Manager/self | none | none (SD-9, current state) | n/a | not required | ✔ STAFF-003…008 |
| Attention | `attentionItems.status` | 3 | ACT-ANL-04 | `DISMISSED`, `RESOLVED` | the record | none | none | ✔ §15.7 (meaning OD-DB-6) |
| Cancellation request | `cancellationRequests.status` | 4 | kitchen / handoff txn | all but `OPEN` | the record | none | via item cancel | ✔ §15.4 |
| Table | `tables.state` | 5 | T1–T10 matrix | none | session + events | n/a | operational | ✔ §21.2 |
| Table session | `tableSessions.status` | 2 | table atoms | `CLOSED` | `tableHistory[]` | n/a | operational | ✔ |
| Import | `menuImports.status` | 7 | Owner/system | `PUBLISHED/FAILED/DISCARDED` | timestamps + audit | none | on approval | ✔ §15.11 |
| AI proposal | `aiProposals.status` | 6 | Owner confirm; system | 4 | the record + audit | none | AI.ACTION_EXECUTED | ✔ §15.11 |
| Invitation | `invitations.status` | 5 | system; SuperAdmin | `REDEEMED/REVOKED` | the record + audit | reissue = new row | on reissue | ✔ §12.5 |
| Upload / Brief | `uploadedFiles.status`, `dailyBriefs.status` | 3 / 2 | worker / generator | terminal | the record | none | none | ✔ (schema-level operational flags) |

No state field was added for convenience: `kots`, `payments`, `refunds` are intentionally insert-only; `orderBatches.status` is a container lifecycle (SD-41) tied to ORD-080.

### 28.6 Concurrency audit (Part 12) — the exact database-level mechanism per race

| # | Race | Invalid outcome prevented | Mechanism that prevents it (document · condition · index · transaction) |
|---|---|---|---|
| 1 | Two staff accept the same order | double confirm / two initial KOTs | `orders` `findOneAndUpdate({_id, org, outlet, stage:'AWAITING_ACCEPTANCE', rev})`; second matches nothing → re-read → `ALREADY_IN_STATE`. Backstop: unique `kots(org,outlet,sourceKey)` |
| 2 | Two kitchen users, same item | lost update | `orderItems` is **one document per item**; conditional `{state:from, rev}`; different items never conflict |
| 3 | Two users change table state | double open | partial unique `tableSessions(org,outlet,tableId)` where `ACTIVE`; `tables {state, rev}` conditional write inside the session transaction |
| 4 | Two users add items | duplicate/lost batch | unique `orderBatches(org,outlet,orderId,idempotencyKey)`; `$inc orders.nextLineNo` + unique `orderItems(…orderId,lineNo)` inside the add-items transaction; bill recompute conditional on bill `rev` |
| 5 | Concurrent payment + bill change | wrong outstanding | one transaction: insert `payments` + conditional update `bills {_id, rev}` (`$inc rev`); a racing writer gets a write conflict / `rev` mismatch and retries |
| 6 | Reopen vs Finalize vs add-item | edit of a finalized bill | conditional `bills {status, rev}`; Finalized guard in the same predicate |
| 7 | Reopen Day vs Close vs new transaction | transaction lost to a closed day | single transaction conditional on running day `{status:'RUNNING', txnCount:0, rev}` and target `{status:'CLOSED', closedAt}`; every DAY-025 write `$inc txnCount` on the **same** day document → write-conflict detection serializes; partial unique `businessDays(org,outlet)` where `isActive` forbids two active days |
| 8 | Duplicate payment | double entry | unique `payments(org,billId,idempotencyKey)` (+ `requestHash` compare) |
| 9 | Duplicate order | double order | unique partial `orders(org,outlet,idempotencyOperation,idempotencyKey)` |
| 10 | Staff availability | torn pair | single document `staffProfiles`; `ABSENT ⇒ UNAVAILABLE` written in the same `$set`; `rev` |
| 11 | Permission change | stale permissions | `permissionOverrides {rev}` + `users.authzVersion $inc` in one transaction; unique partial per role/user prevents two override docs |
| 12 | Reassignment vs action | access after move | `staffAssignments` end+insert + `authzVersion` bump in one transaction; partial unique exclusive-assignment index |
| 13 | Over-refund | refund > paid | in-transaction check `refundedPaise + new ≤ recordedPaymentsPaise` under conditional bill `rev` (a concurrent refund conflicts on the same bill document) |
| 14 | Cancel-request vs handoff | cancel a served item | handoff transaction sets the `OPEN` request `NO_OP` (conditional `{status:'OPEN'}`) in the same transaction as `orderItems.state→SERVED`; partial unique allows one OPEN request per item |
| 15 | Outlet toggle vs order | order after close | outlet state read inside the order transaction snapshot; **ms tolerance accepted by TRD TD-OUT-2** (linearization at commit) — no DB fence by design |
| 16 | Menu publish / override | lost update | `rev` on the entity; `organizations.menuVersion` / `outlets.overrideVersion` `$inc` in the publish transaction |
| 17 | AI proposal double confirm | double execution | conditional `{status:'PROPOSED'→'CONFIRMED'}` with `ownerId` + `argsHash`; single-use |
| 18 | Concurrent payment corrections | two corrections of one entry | partial unique `payments(org,billId,supersedes)` — second insert fails and is converted to the existing result |
| 19 | Invoice number | duplicate / gap | `counters` `$inc` inside the finalization transaction (rollback rolls back the increment); partial uniques on `(invoiceFy,invoiceSeq)` and `invoiceNumber` |
| 20 | Refund vs cancel vs payment on one bill | status flip racing a cancel or payment; double reduction of sales | all three are conditional writes on `bills {_id, status, rev}` inside one transaction each; the `FINALIZED→REFUNDED` flip, `FINALIZED→CANCELLED` and a payment all `$inc rev`, so only one wins and the loser re-reads (`REFUNDED`/`CANCELLED` ⇒ refused or ledger-only); `refunds.deductsFromNet` is read from the same bill document inside the refund transaction |

(The draft's 18 scenarios are rows 1–17 and 19; row 18 was added by R1 and row 20 by R3.) Where a mechanism depends on a transaction, the document set and the invariant it protects are the ones in §15.

### 28.7 MongoDB / Mongoose compatibility audit (Part 13)

Stack facts from the repository: Mongoose `^8.8.0` (backend `package.json`); the MongoDB **server** version is **not** established by the repo (Atlas tier is TRD OTD-10).

| Feature used | Evidence | Status |
|---|---|---|
| Partial indexes; unique + partial applies only to matching documents; operators `$eq`, `$exists:true`, `$gt/$gte/$lt/$lte`, `$type`, `$and`, `$or`, `$in` | MongoDB manual *Partial Indexes* (re-fetched in R1): operator list, unique-partial semantics | **Verified** (current docs). *Per-operator server versions are not given on that page* → the schema uses only **equality and `$type`** (plus `$and` of those) in filters; **`$exists:false` is not allowed** and is not used |
| TTL single-field, documents without the field never expire | MongoDB manual *TTL Indexes* | **Verified** |
| Multi-document transactions on a replica set | MongoDB manual *Transactions* (re-fetched in R1): requires FCV ≥ 4.0; explicit collection/index creation inside a transaction only for a non-existent/new empty collection and with `readConcern` `local`; do not set write concern per operation inside a transaction; client default write concern `majority` from 5.0 | **Verified for FCV ≥ 4.0.** The **actual Atlas server version/FCV** is **`[TECHNICAL VERIFICATION REQUIRED]`**. The schema already requires all collections/indexes to exist before any transaction (IX-4), so it does not rely on in-transaction DDL |
| `readConcern: snapshot` + `writeConcern: majority` for transactions | Same page: snapshot guarantees apply only with `w:"majority"` commit | **Verified** |
| `TransientTransactionError` / `UnknownTransactionCommitResult` retry labels | **Not on the fetched page** | **`[TECHNICAL VERIFICATION REQUIRED]`** against the driver docs before implementing the retry wrapper |
| Mongoose `timestamps`, `versionKey`, `collection`, `autoIndex`, `strict` | `mongoosejs.com/docs/guide.html` (earlier pass) | **Verified** (names) |
| Mongoose `select: false` | Schema Types page (R1): "specifies default projections for queries" | **Verified** (default projection) |
| Mongoose `immutable` | Schema Types page (R1): "prevents you from changing immutable paths unless the parent document has `isNew: true`"; the page **does not state** whether this covers `updateOne`/`findOneAndUpdate` or how `strict` interacts | **`[TECHNICAL VERIFICATION REQUIRED]`** — the schema therefore does **not** rely on `immutable` alone: append-only collections are protected by the append-only plugin **and** by the DB role (no update/delete), and conditional-write helpers never `$set` immutable paths (§19.5) |
| Custom SchemaTypes (`Paise`, `PaiseSigned`) and validators | Schema Types page names the feature and defers detail to separate guides not fetched | **`[TECHNICAL VERIFICATION REQUIRED]`** — fallback with identical effect: a plain `Number` path with a shared `validate` function (`Number.isSafeInteger`) |
| `Map<String,Number>` with a value validator | not re-fetched | **`[TECHNICAL VERIFICATION REQUIRED]`** (used only in `dayRollups`, `dailyBriefs`, `customerOutletProfiles`; fallback: array of `{key, value}`) |
| ObjectId references with `ref` = physical collection name | Mongoose convention; schema sets `collection` explicitly | Compatible |
| Conditional updates (`findOneAndUpdate` with state+`rev` predicate, `$inc`, `$push`) | Core MongoDB operations; no version-specific features | Compatible |
| Unique-index duplicate-key → idempotent result | Driver error code `E11000` | Compatible |

**None of the `[TECHNICAL VERIFICATION REQUIRED]` items changes the logical schema contract**; each has a stated fallback that leaves collections, fields, indexes and invariants unchanged. They are non-blocking and must be closed by a one-hour spike at the start of implementation.

### 28.8 Normalization / denormalization review (Part 15)

| Relationship | Choice | Justification (the goal is correct MongoDB operational modeling, not maximal normalization) |
|---|---|---|
| Order → items | **Referenced** (`orderItems` separate documents) | Per-item `rev`/state so KDS actions do not contend; KDS queue is one indexed query over items; the order label is derived |
| Order item → menu | **Snapshot** (embedded `snapshot`) | History must not depend on master data |
| Order → KDS rows | none stored | KDS is a read model over items (§15.3) |
| Order → bill | **Referenced**, unique `orderId` | Bill has its own lifecycle, revisions, ledger; billing ownership boundary |
| Bill → revisions | **Referenced**, insert-only | Unbounded; immutability |
| Bill → payments/refunds | **Referenced ledgers** + **denormalized live-derived totals** on the bill (`recordedPaymentsPaise`, `outstandingPaise`, `overpaymentPaise`, `refundedPaise`, `paymentStatus`) | Unresolved-bills view and Day views read one document; consistency guaranteed by recomputation in the same transaction (never the sole truth — the ledger is) |
| Order/session → table history | **Embedded bounded arrays** (+ label snapshots) | Bounded by real table operations; read with the order |
| Day → Day Close | **Referenced** revisions (`dayCloseRevisions`, `cashReconciliations`) | Revisions accumulate; immutable |
| Day → fence/counters | **Embedded counters on the day document** | One hot document per outlet by design (arbiter) |
| Customer → outlet history | **Derived read model** `customerOutletProfiles` | Outlet-scoped history queries without scanning orders; rebuildable |
| Owner analytics (multi-outlet) | **`dayRollups`** derived per outlet-day; live ledger for the running day | Dashboards must not scan the ledger; rollups never authoritative |
| Audit | **Separate collection**, not `history[]` | Different readers, retention, immutability, redaction |
| Menu → outlet variants | **Separate overrides collection** | Avoid an optional `outletId` on one document (ambiguity guard §5.4) |

### 28.9 Collection necessity audit (Part 14)

*Which upstream requirement requires this collection?* Classes: **required** = an upstream requirement can only be met with persistent data of this shape; **derived implementation support** = required by a TRD mechanism, or a MongoDB necessity; **provisional** = depends on an undecided product/technical point; **questionable** = no clear upstream need — flagged, not removed.

| Collection | Requirement | Class |
|---|---|---|
| organizations, outlets, users, staffAssignments, staffProfiles, permissionOverrides | ORG-001/004/008, ONB-*, AUTH-*, STAFF-*, RBAC-004/005/010 | required |
| sessions | AUTH-006, C-REVOKE; TRD §12.2 | derived implementation support |
| invitations | ONB-006/013; TRD TD-AUTH-7 | required |
| outletStateEvents | ORG-020…; TRD §28.5 says the history entry is "on the outlet" | **derived** — separate collection instead of an embedded array (bounded-array rule); a deliberate shape deviation from the TRD wording |
| auditEvents | AUDIT-001…008 | required |
| auditSeals | TRD §32.5 tamper-evidence | derived implementation support |
| menuCategories, menuItems, modifierGroups, menuOutletOverrides, kitchenStations | MENU-001…014, ONB-027 | required |
| menuImports, menuImportCandidates | AI-010…016 (draft isolated from live menu, TRD §31.4) | required |
| uploadedFiles | TRD §34.2 (tenant binding of S3 objects) | derived implementation support |
| floors, tables | TABLE-004, ONB-026 | required |
| tableSessions | TABLE-014/015/017 | required |
| tableOperationEvents | TABLE-016 | required |
| customerDrafts | ORD-064/094; TD-ORD-4 | required |
| occupancyClaims | TABLE-007; TRD §21.6 | derived implementation support (could alternatively be fields on drafts; kept separate so release never deletes the draft) |
| orders, orderItems | ORD-* | required |
| orderBatches | ORD-080, TRD §19.2 add-items dedupe; pending customer add-batches | derived implementation support |
| cancellationRecords | ORD-082/088/089/092; TRD §22.7 | required |
| cancellationRequests | ORD-093 | required |
| kots | KOT-001…010 | required |
| bills, billRevisions | BILL-001…018, BILL-011 | required |
| billPrintEvents | BILL-009; TRD §25.7 | derived (TRD mechanism) — not strictly required by the SPEC |
| payments, refunds | PAY-*, BILL-006/012 | required |
| businessDays, dayCloseRevisions, cashReconciliations | DAY-*, CASH-* | required |
| dayRollups | ANALYTICS-*; TRD §14 #25 | derived implementation support (rebuildable read model) |
| customers | CUSTOMER-002/021 | required |
| customerOutletProfiles | CUSTOMER-002/004 | **derived / provisional** — derivable from orders; kept as an outlet-scoped read model; recompute-safe, may be dropped without data loss |
| customerOrderLinks | AUTH-009, CUSTOMER-005/022 | required |
| feedback | FEEDBACK-001…006 | required |
| aiProposals | AI-029 | required (framework; catalogue open OD-DB-23) |
| aiInteractions | TRD §31.2 / TD-AI-4; AI-042 | **questionable** — no product requirement; a TRD observability mechanism. Metadata only; inactive TTL (OTD-15c). Flagged for a keep/drop decision |
| dailyBriefs | AI-026/027 | required |
| whatsappMessages | AI-030…033, INTEG-002; TRD §33.4 (persist before 200) | required (inbound persistence); retention open |
| attentionItems | ATTENTION-001…008 | required |
| counters | TD-ORD-2, PO-TRD-01 #5 | derived implementation support |
| migrations | TRD §40.6 | derived implementation support (operational, not business) |

**Summary.** 51 reviewed: **39 required**, **10 derived implementation support**, **1 provisional** (`customerOutletProfiles`), **1 questionable** (`aiInteractions`). No collection was removed automatically.

### 28.10 UI / UX compatibility (Part 16)

Re-checked against the approved UI/UX brief's StatusBadge domains and screen data needs (§21). No database behaviour was added for a screen.

| Surface | Data source | Verdict |
|---|---|---|
| Status badges (order, item, bill, payment, table, outlet, attendance, import, attention, day) | state fields in §10.1 (+ derived `paymentStatus`) | ✔ — values map 1:1 to the brief's registry; wire spelling is a case mapping (UC-2, resolved). **UI brief reconciled (R3):** OD-UX-3 (Refunded badge) and OD-UX-9 (Cancel bill) were updated in `docs/UI_UX_DESIGN_BRIEF.md` to the canonical behaviour; no visual redesign |
| Order queues / awaiting acceptance | `orders (org,outlet,stage,createdAt)` (+ `awaitingAcceptance`) | ✔ |
| KDS | `orderItems (org,outlet,state,priority,createdAt)`; label snapshots on KOTs | ✔ |
| Bills, payments, historical bills | `bills`, `billRevisions` (with `header`), `payments`, `refunds` | ✔ — a reprinted historical bill is now stable (SD-45) |
| Customer history | `customerOutletProfiles`, `orders (org,customerId,…)` | ✔ |
| Attention | `attentionItems` | ✔ — no severity badge can be backed (OD-DB-6); the UI must not invent one |
| Day Close | `businessDays`, `dayCloseRevisions`, `cashReconciliations`, warnings | ✔ — net sales can render negative |
| Dashboards | `dayRollups` (+ live ledger for the running day) | ✔ |
| Menu / staff / table management | respective masters; soft delete via `status` | ✔ — table-label duplicates are possible (OD-DB-26) |

### 28.11 No-silent-invention check (Part 17)

Every non-trivial rule added or changed in R1 carries a tag: UC-3/UC-4/UC-5/UC-9/UC-14 `[TRD]`; UC-2 `[TRD]` (resolved); SD-45…SD-49 `[SCHEMA DECISION]`; OD-DB-21/26/27 `[OPEN DECISION]` (21 and 27 resolved in R3); OTD-15a–e `[OPEN TECHNICAL DECISION]`; §28.7 `[TECHNICAL VERIFICATION REQUIRED]`. Business rules that were found untagged and **withdrawn** rather than tagged: outlet-wide unique table label; "sales attribute to the revision's day".

### 28.12 Schema decisions added in R1

| ID | Decision | Reason |
|---|---|---|
| SD-45 | `billRevisions.header` snapshot (outlet identity/address/contact/GSTIN, table label or Takeaway, order number, customer contact) | Reprint must not change after outlet/table/customer edits (BILL-009, Part 7) |
| SD-46 | MR-7: integer-only `Number` in maps, facts, evidence | No floating value persisted anywhere |
| SD-47 | `EXECUTED` proposals never receive `purgeAt` | Preserve confirmation evidence (AUDIT-004) |
| SD-48 | `tableLabel`/`fromTableLabel` snapshots in table association history | Renamed/deleted tables must not rewrite history |
| SD-49 | Explicit nullable-`outletId` semantics (null = organization-level) | Remove ambiguous tenant ownership |

### 28.13 Summary of schema changes made in R1

1. Soft delete aligned to TRD C10/§16.2: `status ∈ {ACTIVE, DELETED}` + `deletedAt` on six config collections (UC-14).
2. `orders.awaitingAcceptance` stored with its invariant (UC-4).
3. `supersededBy` confirmed derived-only (UC-3); `payments` reference unique narrowed to `type:'PAYMENT'`.
4. `netSalesPaise` signed (OD-DB-20 resolved); Gross-sales selection decided (PO-6, R3).
5. `billRevisions.header` snapshot; table-label snapshots in history; MR-7.
6. Indexes: 6 removed, 1 narrowed, 1 invented unique withdrawn (OD-DB-26); full rationale §28.4.
7. TTL: AI-log and WhatsApp TTL inactive by default; executed proposals exempt; every TTL classified (§22.3).
8. `CUSTOMER` aligned with the TRD role enum (UC-7).
9. Tenancy: explicit matrix and nullable-outlet semantics (§28.3).
10. Open decisions re-classified A–F with exact upstream anchors (§22.2); conflicts re-examined at source (§23).

### 28.14 Summary of schema changes made in R3

1. `bills`: status `REFUNDED` lifecycle; cancel only from `FINALIZED` with mandatory reason; `overpaymentPaise = max(0, P−T−F)`; charge `allocations[]`; adjustment-entry snapshot; one invoice number per bill.
2. `billRevisions`: `kind` (`FINALIZATION`/`CANCELLATION`), `previousTotalPaise`, signed `deltaPaise`.
3. `refunds.deductsFromNet`; `dayCloseRevisions.totals`: `correctionDeltaPaise`, `refundsOnCancelledBillsPaise`, signed `grossSalesPaise`/`netSalesPaise`.
4. `orderItems.refireOfItemId` and its index removed (re-fire = KOT line only).
5. Outlet charge configuration semantics; money dictionary and signedness list.
6. Decision register: OD-DB-5, 8, 15b, 18, 19, 21, 27 and UC-2 RESOLVED with sources; TRD §25.9 (PO-TRD-03) and UI brief OD-UX-3/9 aligned.
