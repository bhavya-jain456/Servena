# Capability Map: SERVENA Phase 1

Status: **APPROVED with SPEC v1.0 — 2026-10-07**
Source: [SPEC.md](SPEC.md) v1.0, derived solely from the Hardening v1.1 document + locked decisions.
Modules are referenced by stable requirement IDs (SPEC v1.0 §2.1). Cross-cutting: SOT-*, OFFLINE-*, INTEG-*, SEC-*.

Module ids are stable kebab-case and will not be renamed. Per-module specs, if needed, are saved as
`SPEC-<module-id>.md`. A module depends only on modules in its "Depends on" column. No cycles.

| # | Module id | Responsibility | Depends on | SPEC v1.0 requirement IDs | Decisions applied (CONFIRMED) | Open decisions |
|---|---|---|---|---|---|---|
| 1 | `tenancy` | SuperAdmin provisioning, org + outlet structure, Owner assignment, onboarding invite, suspend/deactivate, Owner credential reset | — | ONB-001…015, ORG-001…011 | OD-19 (ORG-011) | OD-16, OD-17 |
| 2 | `identity-access` | Email/phone + password login, users, five-factor authorization (Role + Outlet + Permission + State + Approval), Owner customization, staff credential reset, customer order-link access | `tenancy` | AUTH-*, RBAC-*, ACT-* | OD-08, OD-20 (AUTH-009), OD-28 (RBAC-014), OD-45.2–45.4 (RBAC-027…030) | OD-45.1 cells (RBAC-019), OD-12 |
| 3 | `audit` | Audit trail of sensitive actions (who/what/when/outlet/before/after/reason) | `identity-access` | AUDIT-* | OD-04 (AUDIT-008) | OD-45.1 (AUDIT-007: SuperAdmin only) |
| 4 | `outlet-setup` | Restaurant identity, GST/tax, charges, ordering channels, onboarding checklist + activation, Outlet Open/Closed | `identity-access`, `audit` | ONB-020…033, ORG-020…034 | OD-02 (ORG-024…031) | OD-31, OD-42, OD-43 |
| 5 | `staff` | Staff records, outlet reassignment, schedule, attendance, availability | `identity-access`, `audit` | STAFF-* | — | OD-25, OD-26 |
| 6 | `menu` | Catalog, variants, modifiers, tax, station mapping, publish, outlet price/availability overrides | `outlet-setup`, `audit` | MENU-* | — | OD-22 |
| 7 | `ai-menu-import` | PDF/image/Excel/CSV → draft → low-confidence flags → Owner approval → `menu` | `menu` | AI-010…016 | — | — |
| 8 | `tables` | Floor, table states, one active session per table, transfer / merge / split / move items as auditable events, clear, table QR + tableless QR | `outlet-setup`, `audit` | TABLE-* | OD-35 (TABLE-012, 014…017), OD-45.3 (RBAC-028) | OD-46 |
| 9 | `order-engine` | Unified order model (all channels), order + item lifecycle, idempotent submit, acceptance, modifications, cancellation, completion, Takeaway derivation | `menu`, `tables`, `staff`, `audit` | ORD-* | OD-01 (ORD-008), OD-06 (ORD-089), OD-30 (ORD-063), OD-34 (ORD-082, 088, 090, 092), OD-35 (ORD-091) | OD-14, OD-15, OD-40, OD-44 |
| 10 | `kitchen` | KOTs (initial/additional/cancellation), station routing, single-kitchen KDS, Ready roll-up, priority, re-fire, kitchen cancellation | `order-engine` | KOT-*, KDS-* | OD-34 (KDS-017) | OD-15, OD-44 |
| 11 | `customer-ordering` | Table QR, tableless QR, direct website: menu, cart, submit, tracking via private link, handoff display | `order-engine`, `menu`, `tables` | ORD-020…042, HANDOFF-* | OD-01, OD-11 (ORD-042), OD-20 | OD-45.1 (HANDOFF-004) |
| 12 | `billing` | One bill per order, bill lifecycle, charges, discounts, round-off, print/digital/reprint, payment information, split payment, refunds | `order-engine`, `audit` | BILL-*, PAY-* | OD-07 (BILL-015), OD-21 (PAY-010) | OD-45.1 (ACT-BIL-02/03, ACT-PAY-02); open: OD-24, OD-33, OD-39, OD-46 |
| 13 | `customers` | Customer records/history, feedback, one-tap reorder via private link | `order-engine`, `billing` | CUSTOMER-*, FEEDBACK-* | OD-09 (CUSTOMER-016, 017, 019), OD-20 (CUSTOMER-005) | OD-36, OD-38 |
| 14 | `day-close` | Per-outlet business day, Day Close with warnings, Reopen/Reclose, cash reconciliation | `billing`, `order-engine`, `audit` | DAY-*, CASH-* | OD-03 (DAY-012, 019, 020), OD-04 (DAY-015, 018, 024), OD-05 (CASH-005…007), OD-19 (DAY-016), OD-32 (DAY-021, 023) | OD-33, OD-41, OD-47 |
| 15 | `analytics` | Owner (cross-outlet) and Manager (assigned outlets) dashboards incl. unresolved bills | `day-close`, `billing`, `order-engine`, `customers`, `staff` | ANALYTICS-* | OD-03 (ANALYTICS-011) | OD-41 |
| 16 | `attention` | Attention Engine: detect → evidence → Attention item → review → dismiss/resolve | `analytics` | ATTENTION-* | — | OD-18 |
| 17 | `ai-insights` | Owner Agent (read + controlled actions), Daily AI Brief, What Changed? | `analytics`, `attention`, `identity-access` | AI-020…029 | OD-10 (AI-025) | OD-18, OD-29, OD-37 |
| 18 | `whatsapp-ordering` | WhatsApp Ordering Agent → unified order engine | `order-engine`, `menu`, `customers` | AI-030…033 | OD-01 (AI-033), OD-02 (ORG-030) | OD-38 |

Cross-cutting (specified once in TRD, not modules): realtime delivery to KDS/staff, idempotency, reconnect/recovery,
tenant isolation, rate limiting, observability.

All decisions in the "Decisions applied" column were approved on 2026-10-07 and are CONFIRMED in SPEC v1.0.

## Build order

```
L0  tenancy
L1  identity-access
L2  audit
L3  outlet-setup, staff
L4  menu, tables
L5  order-engine, ai-menu-import
L6  kitchen, customer-ordering, billing
L7  customers, day-close
L8  analytics, whatsapp-ordering
L9  attention
L10 ai-insights
```

The full operational loop (order → KOT → KDS → handoff → bill → payment info → Day Close) is complete at L7 with no AI
module, satisfying "core operations work without AI" [H§3].
