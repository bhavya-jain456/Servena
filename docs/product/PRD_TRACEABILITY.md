# SERVENA Phase 1 — PRD Traceability (SPEC v1.1 → PRD v1.0)

Regenerated from [SPEC.md](../../SPEC.md) (v1.2, amendments A1 and A2) and [PRD.md](PRD.md) (v1.1 — v1.0 APPROVED by product owner 2026-10-07; v1.1 records PO-AF-01…04) on 2026-10-07. Each PRD ID embeds its SPEC ID (`PRD-<SPEC-ID>.<n>`); acceptance criteria are `PRD-<SPEC-ID>.AC<n>`. "via X" = covered inside PRD requirement X (listed there as *also:*).

## 1. Validation Result

| # | Check | Result |
|---|---|---|
| 1 | Every CONFIRMED SPEC requirement (incl. SOT, PC), catalogue row and EXCLUDED item is covered by ≥1 PRD requirement | **0 uncovered** of 492 |
| 2 | Every PRD requirement / acceptance criterion has an existing upstream SPEC ID | **0 orphans** of 697 |
| 3 | Unresolved permission cells (`?`) in PRD §13.4 | **0** |
| 4 | OPEN or PROPOSED items in SPEC v1.2 | **0** |
| 5 | Unresolved OD-12…OD-47 (incl. OD-45.1) | **0** of 26 |
| 6 | Unresolved PQ-01…PQ-08 | **0** of 8 (PQ-04, PQ-07 DEFERRED) |
| 7 | A-PRD-01…A-PRD-12 remaining open | **0** of 12 (all resolved, §71.4) |
| 8 | C-PRD-01…C-PRD-04 unresolved | **0** of 4 (all resolved, §71.3) |
| 8a | PO-AF-01…PO-AF-04 (Application Flow review decisions, SPEC A2) recorded | **4** of 4 (PRD §71.5; PO-AF-01 DEFERRED as DF-15) |
| 9 | Deferred items explicitly DEFERRED | 15 DF items and 7 DEFERRED SPEC rows listed in §5 |
| 10 | Excluded items remain EXCLUDED | 19 EXCLUDED rows + NG items covered by PRD §6 |
| — | Stale markers in PRD (`[PROPOSED`, `[OPEN`, "awaiting product", "decision required", TBD, TODO) | **0** |

**Uncovered CONFIRMED SPEC items = 0 · Orphan PRD requirements = 0 · Unresolved product questions from this task = 0 · Unresolved permission cells = 0**

## 2. Summary

| Measure | Count |
|---|---|
| SPEC items traced | 500 |
| — CONFIRMED requirements (incl. SOT, PC) | 386 |
| — Action-catalogue rows (active) | 87 |
| — WITHDRAWN catalogue rows | 1 |
| — EXCLUDED (incl. NG) | 19 |
| — DEFERRED | 7 |
| — OPEN / PROPOSED | 0 |
| PRD requirements (all CONFIRMED) | 502 |
| PRD acceptance criteria (all CONFIRMED) | 195 |

## 3. Decision Index (all closed 2026-10-07)

| Decision | SPEC requirement(s) | PRD resolution | Status |
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
| PQ-01 | — | §54 (PRD-ORD-008.2, PRD-HANDOFF-001.2, PRD-ORD-088.2, PRD-ATTENTION-002.2, PRD-KOT-009.2, PRD-KDS-013.2, PRD-INTEG-002.… | CONFIRMED |
| PQ-02 | — | PRD-AI-026.1 | CONFIRMED |
| PQ-03 | — | PRD-AI-028.1 | CONFIRMED |
| PQ-04 | — | No numeric targets in Phase 1; goals remain qualitative | DEFERRED (DF-01) |
| PQ-05 | — | PRD-ONB-033.1 | CONFIRMED |
| PQ-06 | — | PRD-KDS-015.1 | CONFIRMED |
| PQ-07 | — | Not defined in the PRD; no PRD blocker | DEFERRED (DF-14) |
| PQ-08 | — | PRD-FEEDBACK-002.2 | CONFIRMED |
| PO-AF-01 | — (DF-15) | WhatsApp order tracking deferred (PRD §70) | DEFERRED |
| PO-AF-02 | ORD-021 (amended A2) | PRD-ORD-021.1 (amended), PRD-ORD-021.AC2 — details only on the no-table QR | CONFIRMED |
| PO-AF-03 | ONB-016 | PRD-ONB-016.1, PRD-ONB-016.AC1 — suspended/blocked page on QR scan | CONFIRMED |
| PO-AF-04 | ORD-094 | PRD-ORD-094.1, PRD-ORD-094.AC1 — no Draft resumption | CONFIRMED |
| C-PRD-01 | — | OD-14 — SPEC ORD-064 and TABLE-007 amended (A1); PRD-ORD-064.2, PRD-TABLE-007.1 | RESOLVED |
| C-PRD-02 | — | OD-24 — SPEC PAY-003 amended (A1); PRD-PAY-003.1, PRD-PAY-011.1 | RESOLVED |
| C-PRD-03 | — | OD-39 — SPEC BILL-005 amended, PAY-012 closed (A1); PRD-BILL-005.1, PRD-PAY-012.1 | RESOLVED |
| C-PRD-04 | — | OD-25 — SPEC MENU-011 amended (A1); PRD-MENU-011.2 | RESOLVED |
| A-PRD-01 | — | Becomes multi-outlet automatically (PRD-ONB-015.1) | RESOLVED |
| A-PRD-02 | — | Continue through kitchen, handoff and billing (PRD-ONB-014.1) | RESOLVED |
| A-PRD-03 | — | Void follows cancellation state-safety and preserves history (PRD-ORD-073.1) | RESOLVED |
| A-PRD-04 | — | Menu-item availability only (PRD-MENU-011.2) | RESOLVED |
| A-PRD-05 | — | No separate subsystem; only existing staff/table/order operations (PRD-STAFF-013.1) | RESOLVED |
| A-PRD-06 | — | Not allowed; pending until reopen (PRD-ORG-033.1) | RESOLVED |
| A-PRD-07 | — | Payments − current bill total, shown until resolved (PRD-PAY-012.1) | RESOLVED |
| A-PRD-08 | — | Most recent comparable completed business day (PRD-AI-028.1) | RESOLVED |
| A-PRD-09 | — | Original attribution and actual timestamp both kept; no further accounting treatment (PRD-DAY-022.1) | RESOLVED |
| A-PRD-10 | — | Request becomes a no-op, kept in audit (PRD-ORD-093.1) | RESOLVED |
| A-PRD-11 | — | Empty table open and uncommitted Draft do not count; order awaiting acceptance counts (PRD-DAY-025.1) | RESOLVED |
| A-PRD-12 | — | Not offered (PRD-FEEDBACK-002.2) | RESOLVED |

## 4. SPEC → PRD

| SPEC ID | SPEC status | SPEC statement (abridged) | PRD IDs | PRD section |
|---|---|---|---|---|
| SOT-001 | CONFIRMED | A lower-level document MUST NOT contradict a higher-level approved document. | PRD-SOT-001.1 | §0. How to Read This PRD |
| SOT-002 | CONFIRMED | When a conflict is found, the lower document is corrected; the higher document changes on… | PRD-SOT-002.1 | §0. How to Read This PRD |
| SOT-003 | CONFIRMED | Within explicit user decisions: OD answers and LD > H§44–45 > H body. Where H includes so… | PRD-SOT-003.1 | §0. How to Read This PRD |
| SOT-004 | CONFIRMED | PROPOSED, OPEN and DEFERRED items in this SPEC are not canonical for PRD/TRD until resolv… | PRD-SOT-004.1 | §0. How to Read This PRD |
| SOT-005 | CONFIRMED | A proposed resolution becomes an explicit user decision only when you explicitly approve … | PRD-SOT-005.1 | §0. How to Read This PRD |
| SOT-010 | CONFIRMED | Every downstream item MUST carry a `traces:` (or `verifies:` for tests) field naming ≥1 u… | PRD-SOT-010.1 | §0. How to Read This PRD |
| SOT-011 | CONFIRMED | Every CONFIRMED SPEC requirement MUST be covered by ≥1 PRD requirement and ≥1 test case; … | PRD-SOT-011.1 | §0. How to Read This PRD |
| SOT-012 | CONFIRMED | A downstream item with no upstream trace is an orphan and MUST be justified by a new expl… | PRD-SOT-012.1 | §0. How to Read This PRD |
| SOT-013 | CONFIRMED | Test cases follow the five H§40 categories: happy path · invalid transition · permission … | PRD-SOT-013.1 | §0. How to Read This PRD |
| RBAC-020 | CONFIRMED | Restaurant roles: Owner, Manager, Cashier, Waiter, Kitchen Staff, Customer. SuperAdmin is… | PRD-RBAC-020.1 | §7. Personas and User Roles |
| RBAC-021 | CONFIRMED | Admin, Supervisor, Support Agent and Delivery are not Phase 1 | PRD-RBAC-021.1, via PRD-NG-013.1 | §7. Personas and User Roles; §6. Phase 1 Non-Goals |
| RBAC-022 | CONFIRMED | Owner: all authorized outlets, cross-outlet visibility | PRD-RBAC-022.1 | §8. Role Responsibilities and Boundaries |
| RBAC-023 | CONFIRMED | Manager: assigned outlet(s) + permissions; no HQ view | PRD-RBAC-023.1, PRD-RBAC-023.AC1 | §8. Role Responsibilities and Boundaries |
| RBAC-024 | CONFIRMED | Cashier, Waiter: assigned outlet. Kitchen Staff: assigned outlet / station scope | PRD-RBAC-024.1 | §8. Role Responsibilities and Boundaries |
| RBAC-025 | CONFIRMED | Customer: own customer journey; sees only own order | PRD-RBAC-025.1, PRD-RBAC-025.AC1 | §8. Role Responsibilities and Boundaries |
| RBAC-026 | CONFIRMED | Cashier does not automatically gain Owner configuration access | PRD-RBAC-026.1 | §8. Role Responsibilities and Boundaries |
| ORG-001 | CONFIRMED | Organization/brand is the top-level tenant with ≥1 outlets; single-outlet restaurant = or… | PRD-ORG-001.1 | §9. Organization and Outlet Model |
| ORG-002 | CONFIRMED | Central configuration and outlet-specific overrides coexist | PRD-ORG-002.1 | §9. Organization and Outlet Model |
| ORG-003 | CONFIRMED | Every operational object remains associated with the correct organization and outlet | PRD-ORG-003.1 | §9. Organization and Outlet Model |
| ORG-004 | CONFIRMED | Cross-outlet access is permission-controlled | PRD-ORG-004.1 | §9. Organization and Outlet Model |
| ORG-005 | CONFIRMED | Exactly one kitchen operational context per outlet | PRD-ORG-005.1 | §9. Organization and Outlet Model |
| ORG-006 | CONFIRMED | Owner sees all authorized outlets, cross-outlet customer/history and benchmarking | PRD-ORG-006.1 | §9. Organization and Outlet Model |
| ORG-007 | CONFIRMED | Manager sees only assigned outlet(s), never a general HQ view | PRD-ORG-007.1, PRD-ORG-007.AC1 | §9. Organization and Outlet Model |
| ORG-008 | CONFIRMED | Cashier, Waiter, Kitchen Staff operate within one current outlet and can be reassigned | PRD-ORG-008.1, PRD-ORG-008.AC1, via PRD-STAFF-010.1 | §8. Role Responsibilities and Boundaries; §9. Organization and Outlet Model; §14. Staff Management |
| ORG-009 | CONFIRMED | Outlet staff see their own outlet history | PRD-ORG-009.1 | §8. Role Responsibilities and Boundaries |
| ORG-010 | CONFIRMED | After reassignment, past actions stay attributed to the outlet where they occurred | PRD-ORG-010.1, PRD-ORG-010.AC1 | §9. Organization and Outlet Model |
| ORG-011 | CONFIRMED | Business day, Day Close and cash reconciliation are per outlet; each outlet has its own a… | PRD-ORG-011.1, PRD-ORG-011.AC1 | §9. Organization and Outlet Model |
| ORG-020 | CONFIRMED | Each outlet has an operational availability state (Open / Closed) | PRD-ORG-020.1 | §9. Organization and Outlet Model |
| ORG-021 | CONFIRMED | Outlet Closed → **new customer ordering is unavailable for that outlet** (all customer ch… | PRD-ORG-021.1, PRD-ORG-021.AC1 | §9. Organization and Outlet Model |
| ORG-022 | CONFIRMED | Outlet Closed is an availability/control state; not a system start/end timer, not Day Clo… | PRD-ORG-022.1, PRD-ORG-022.AC1 | §9. Organization and Outlet Model |
| ORG-023 | CONFIRMED | Bill generation is not blocked by time of day | PRD-ORG-023.1 | §9. Organization and Outlet Model |
| ORG-024 | CONFIRMED | New staff-created orders are blocked while the outlet is Closed | PRD-ORG-024.1, PRD-ORG-024.AC1 | §9. Organization and Outlet Model |
| ORG-025 | CONFIRMED | Existing confirmed orders continue through kitchen, handoff and billing, and may be compl… | PRD-ORG-025.1, PRD-ORG-025.AC1 | §9. Organization and Outlet Model |
| ORG-026 | CONFIRMED | New items cannot be added to an existing order after the outlet is Closed | PRD-ORG-026.1, PRD-ORG-026.AC1 | §9. Organization and Outlet Model |
| ORG-027 | CONFIRMED | Existing bills may be finalized and their payment information recorded while the outlet i… | PRD-ORG-027.1 | §9. Organization and Outlet Model |
| ORG-028 | CONFIRMED | Kitchen continues processing existing confirmed orders while the outlet is Closed | PRD-ORG-028.1 | §9. Organization and Outlet Model |
| ORG-029 | CONFIRMED | Website shows that the outlet is closed and accepts no new orders | PRD-ORG-029.1 | §9. Organization and Outlet Model |
| ORG-030 | CONFIRMED | WhatsApp shows that the outlet is closed and accepts no new orders | PRD-ORG-030.1 | §9. Organization and Outlet Model |
| ORG-031 | CONFIRMED | Owner and Manager may change outlet Open/Closed state | PRD-ORG-031.1, PRD-ORG-031.AC1 | §9. Organization and Outlet Model |
| ORG-032 | CONFIRMED | No automatic Open/Closed transition from configured operating hours in Phase 1; Owner and… | PRD-ORG-032.1, PRD-ORG-032.AC1 | §9. Organization and Outlet Model |
| ORG-033 | CONFIRMED | A customer order awaiting acceptance when the outlet closes stays visible as awaiting acc… | PRD-ORG-033.1, PRD-ORG-033.AC1 | §9. Organization and Outlet Model |
| ORG-034 | CONFIRMED | Outlet Closed blocks new business, not authorized corrections to existing business: reope… | PRD-ORG-034.1, PRD-ORG-034.AC1 | §9. Organization and Outlet Model |
| ONB-001 | CONFIRMED | SuperAdmin creates the restaurant/organization | PRD-ONB-001.1 | §10. SuperAdmin Onboarding |
| ONB-002 | CONFIRMED | SuperAdmin selects single- or multi-outlet structure | PRD-ONB-002.1 | §10. SuperAdmin Onboarding |
| ONB-003 | CONFIRMED | SuperAdmin creates or assigns the Owner | PRD-ONB-003.1 | §10. SuperAdmin Onboarding |
| ONB-004 | CONFIRMED | SuperAdmin enters basic restaurant and outlet data | PRD-ONB-004.1 | §10. SuperAdmin Onboarding |
| ONB-005 | CONFIRMED | SuperAdmin provisions the restaurant | PRD-ONB-005.1 | §10. SuperAdmin Onboarding |
| ONB-006 | CONFIRMED | System sends onboarding email/invitation to Owner | PRD-ONB-006.1, PRD-ONB-006.AC1 | §10. SuperAdmin Onboarding |
| ONB-007 | CONFIRMED | SuperAdmin can view restaurant operational data | PRD-ONB-007.1 | §10. SuperAdmin Onboarding |
| ONB-008 | CONFIRMED | SuperAdmin can edit restaurant configuration after provisioning | PRD-ONB-008.1 | §10. SuperAdmin Onboarding |
| ONB-009 | CONFIRMED | SuperAdmin can deactivate/suspend a restaurant; this is not Day Close | PRD-ONB-009.1, PRD-ONB-009.AC1 | §10. SuperAdmin Onboarding |
| ONB-010 | CONFIRMED | SuperAdmin can reset Owner credentials | PRD-ONB-010.1 | §10. SuperAdmin Onboarding |
| ONB-011 | CONFIRMED | Provisioning does not replace Owner operational setup | PRD-ONB-011.1 | §10. SuperAdmin Onboarding |
| ONB-012 | CONFIRMED | No restaurant/Owner self-signup | PRD-ONB-012.1, PRD-ONB-012.AC1, via PRD-NG-016.1 | §10. SuperAdmin Onboarding; §6. Phase 1 Non-Goals |
| ONB-013 | CONFIRMED | Email unavailable → provisioned account remains recoverable; onboarding retry path exists | PRD-ONB-013.1, PRD-ONB-013.AC1 | §10. SuperAdmin Onboarding |
| ONB-014 | CONFIRMED | Suspension is a platform-level state: new business is blocked (no new order can be create… | PRD-ONB-014.1, PRD-ONB-014.AC1 | §10. SuperAdmin Onboarding |
| ONB-015 | CONFIRMED | The Owner may add outlets after provisioning; a Manager cannot create outlets. Adding a s… | PRD-ONB-015.1, PRD-ONB-015.AC1 | §10. SuperAdmin Onboarding |
| ONB-016 | CONFIRMED | Customer scanning a QR of a suspended/deactivated restaurant sees suspended/blocked page; no menu, no order (A2) | PRD-ONB-016.1, PRD-ONB-016.AC1 | §10. SuperAdmin Onboarding |
| ONB-020 | CONFIRMED | Configure restaurant identity: name, brand, logo, contact | PRD-ONB-020.1 | §11. Owner Onboarding |
| ONB-021 | CONFIRMED | Configure address/location and GST/tax information | PRD-ONB-021.1 | §11. Owner Onboarding |
| ONB-022 | CONFIRMED | Configure restaurant type / cuisine template and operating configuration | PRD-ONB-022.1 | §11. Owner Onboarding |
| ONB-023 | CONFIRMED | Configure outlet(s) | PRD-ONB-023.1 | §11. Owner Onboarding |
| ONB-024 | CONFIRMED | Import (AI) or manually create menu; review and approve AI-imported menu | PRD-ONB-024.1, PRD-ONB-024.AC1 | §11. Owner Onboarding |
| ONB-025 | CONFIRMED | Configure staff, roles, outlet assignment and permissions | PRD-ONB-025.1 | §11. Owner Onboarding |
| ONB-026 | CONFIRMED | Configure floor/tables and QR codes | PRD-ONB-026.1 | §11. Owner Onboarding |
| ONB-027 | CONFIRMED | Configure kitchen stations and routing | PRD-ONB-027.1 | §11. Owner Onboarding |
| ONB-028 | CONFIRMED | Configure payment information | PRD-ONB-028.1 | §11. Owner Onboarding |
| ONB-029 | CONFIRMED | Configure ordering channels | PRD-ONB-029.1 | §11. Owner Onboarding |
| ONB-030 | CONFIRMED | Verify onboarding checklist and activate operations | PRD-ONB-030.1, PRD-ONB-030.AC1 | §11. Owner Onboarding |
| ONB-031 | CONFIRMED | Guided onboarding with templates and QR generation | PRD-ONB-031.1 | §11. Owner Onboarding |
| ONB-032 | CONFIRMED | An outlet cannot accept orders before activation | PRD-ONB-032.1, PRD-ONB-032.AC1 | §11. Owner Onboarding |
| ONB-033 | DEFERRED | Mandatory checklist contents | PRD-ONB-033.1 | §11. Owner Onboarding |
| AUTH-001 | CONFIRMED | Restaurant users log in with email OR phone + password | PRD-AUTH-001.1, PRD-AUTH-001.AC1 | §12. Authentication |
| AUTH-002 | CONFIRMED | No 2FA | PRD-AUTH-002.1 | §12. Authentication |
| AUTH-003 | CONFIRMED | Staff credentials and recovery are handled by Owner/Manager | PRD-AUTH-003.1, PRD-AUTH-003.AC1 | §12. Authentication |
| AUTH-004 | CONFIRMED | Owner credentials are reset by SuperAdmin | PRD-AUTH-004.1, via PRD-ONB-010.1 | §12. Authentication; §10. SuperAdmin Onboarding |
| AUTH-005 | CONFIRMED | No self-service credential recovery | PRD-AUTH-005.1, PRD-AUTH-005.AC1 | §12. Authentication |
| AUTH-006 | CONFIRMED | Inactive staff/users cannot log in or act | PRD-AUTH-006.1, PRD-AUTH-006.AC1 | §12. Authentication |
| AUTH-007 | CONFIRMED | Credential/security actions are audited | PRD-AUTH-007.1, via PRD-AUDIT-002.1 | §12. Authentication; §53. Audit Trail |
| AUTH-008 | CONFIRMED | Users with access to several outlets choose a working outlet context | PRD-AUTH-008.1 | §12. Authentication |
| AUTH-009 | CONFIRMED | No customer accounts in Phase 1; tableless QR and website orders capture name + phone wit… | PRD-AUTH-009.1 | §12. Authentication |
| RBAC-001 | CONFIRMED | Access = Role + Outlet Access + Permission Set | PRD-RBAC-001.1 | §13. RBAC and Permissions |
| RBAC-002 | CONFIRMED | Authorization additionally evaluates Current State and Approval Requirement (five-factor … | PRD-RBAC-002.1 | §13. RBAC and Permissions |
| RBAC-003 | CONFIRMED | Every role has a default permission profile | PRD-RBAC-003.1 | §13. RBAC and Permissions |
| RBAC-004 | CONFIRMED | Owner can customize permissions where supported | PRD-RBAC-004.1 | §13. RBAC and Permissions |
| RBAC-005 | CONFIRMED | The Owner customizes permissions only within the predefined catalogue (§9): the Owner can… | PRD-RBAC-005.1, PRD-RBAC-005.AC1 | §13. RBAC and Permissions |
| RBAC-006 | CONFIRMED | Outlet assignment limits data and action scope | PRD-RBAC-006.1 | §13. RBAC and Permissions |
| RBAC-007 | CONFIRMED | Backend authorization is authoritative; UI hiding is not a security control | PRD-RBAC-007.1, PRD-RBAC-007.AC1 | §13. RBAC and Permissions |
| RBAC-008 | CONFIRMED | A denied action fails safely and leaves no partial mutation | PRD-RBAC-008.1 | §13. RBAC and Permissions |
| RBAC-009 | CONFIRMED | Technical design may split permissions into finer atoms but must not grant a role broader… | PRD-RBAC-009.1 | §13. RBAC and Permissions |
| RBAC-010 | CONFIRMED | Permission changes are audited | PRD-RBAC-010.1, PRD-RBAC-010.AC1, via PRD-AUDIT-002.1 | §13. RBAC and Permissions; §53. Audit Trail |
| RBAC-011 | CONFIRMED | Permission families: restaurant/outlet configuration · menu management · price/availabili… | PRD-RBAC-011.1 | §13. RBAC and Permissions |
| RBAC-012 | CONFIRMED | Default action matrix [LD-MX] (rows marked LD-MX in §9) | PRD-RBAC-012.1, PRD-RBAC-012.AC1 | §13. RBAC and Permissions |
| RBAC-013 | CONFIRMED | The default permission catalogue is the action inventory in §9 as set by OD-08 and OD-45 … | PRD-RBAC-013.1 | §13. RBAC and Permissions |
| RBAC-014 | CONFIRMED | Approval factor: Owner approval of AI-imported menu before it goes live is the only sourc… | PRD-RBAC-014.1 | §13. RBAC and Permissions |
| RBAC-015 | CONFIRMED | Current-state preconditions per action are those listed in §9; undefined preconditions ar… | PRD-RBAC-015.1 | §13. RBAC and Permissions |
| RBAC-016 | CONFIRMED | A denial tells the user which factor failed (permission / outlet / state / approval) with… | PRD-RBAC-016.1, PRD-RBAC-016.AC1 | §13. RBAC and Permissions |
| RBAC-017 | CONFIRMED | Missing permissions are never inferred from job titles beyond the explicit assignments in… | PRD-RBAC-017.1 | §13. RBAC and Permissions |
| RBAC-018 | CONFIRMED | The §9 matrix is a permission catalogue only; actual authorization is Role + Outlet Acces… | via PRD-RBAC-002.1 | §13. RBAC and Permissions |
| RBAC-019 | CONFIRMED | Every permission cell is decided: an action not explicitly granted to a role is denied, a… | PRD-RBAC-019.1 | §13. RBAC and Permissions |
| RBAC-027 | CONFIRMED | Viewing an object is implied by holding any action permission on that object | PRD-RBAC-027.1 | §13. RBAC and Permissions |
| RBAC-028 | CONFIRMED | "Manage tables" covers operational table actions: open, transfer, merge, split, move item… | PRD-RBAC-028.1 | §13. RBAC and Permissions |
| RBAC-029 | CONFIRMED | Managers do not by default manage Manager accounts or customize permissions; the Owner ma… | PRD-RBAC-029.1, PRD-RBAC-029.AC1 | §13. RBAC and Permissions |
| RBAC-030 | CONFIRMED | Permission cells not covered by an explicit assignment are decided cell by cell; no blank… | via PRD-RBAC-017.1 | §13. RBAC and Permissions |
| STAFF-001 | CONFIRMED | Schedule, attendance and availability are separate dimensions | PRD-STAFF-001.1 | §14. Staff Management |
| STAFF-002 | CONFIRMED | Schedule = planned working period (e.g., 10:00–19:00) | PRD-STAFF-002.1, PRD-STAFF-002.AC1 | §15. Staff Schedule |
| STAFF-003 | CONFIRMED | Attendance = Present / Absent | PRD-STAFF-003.1 | §16. Attendance |
| STAFF-004 | CONFIRMED | Availability = Available / On Break / Unavailable | PRD-STAFF-004.1 | §17. Availability |
| STAFF-005 | CONFIRMED | Availability can be changed by Owner, Manager and the staff member themselves | PRD-STAFF-005.1, PRD-STAFF-005.AC1 | §17. Availability |
| STAFF-006 | CONFIRMED | On Break = currently unavailable for operational assignment (all staff) | PRD-STAFF-006.1, PRD-STAFF-006.AC1 | §17. Availability |
| STAFF-007 | CONFIRMED | Invalid combinations (e.g., Absent + Available) are prevented or explicitly handled by st… | PRD-STAFF-007.1, PRD-STAFF-007.AC1 | §17. Availability |
| STAFF-008 | CONFIRMED | Handling of Absent + Available: setting Absent forces Unavailable | PRD-STAFF-008.1, PRD-STAFF-008.AC1 | §16. Attendance |
| STAFF-009 | CONFIRMED | Staff status is not payroll/overtime data; no payroll | PRD-STAFF-009.1, via PRD-NG-005.1 | §14. Staff Management; §6. Phase 1 Non-Goals |
| STAFF-010 | CONFIRMED | Outlet staff can be moved/reassigned to another outlet via staff management | PRD-STAFF-010.1, PRD-STAFF-010.AC1 | §14. Staff Management |
| STAFF-011 | CONFIRMED | Staff outlet reassignment is audited | PRD-STAFF-011.1, PRD-STAFF-011.AC1, via PRD-AUDIT-002.1 | §14. Staff Management; §53. Audit Trail |
| STAFF-012 | CONFIRMED | Manager staff management is limited to their authorized outlets | PRD-STAFF-012.1, PRD-STAFF-012.AC1 | §14. Staff Management |
| STAFF-013 | CONFIRMED | Setting a staff member On Break or Unavailable prevents new assignments, never silently c… | PRD-STAFF-013.1, PRD-STAFF-013.AC1 | §14. Staff Management |
| MENU-001 | CONFIRMED | Categories and subcategories | PRD-MENU-001.1 | §18. Menu Management |
| MENU-002 | CONFIRMED | Item: description, image, price, tax, veg/non-veg | PRD-MENU-002.1 | §18. Menu Management |
| MENU-003 | CONFIRMED | Variants / portion sizes | PRD-MENU-003.1 | §18. Menu Management |
| MENU-004 | CONFIRMED | Add-on / modifier groups: spice, preparation, dietary, add-on, packaging, free-form custo… | PRD-MENU-004.1 | §18. Menu Management |
| MENU-005 | CONFIRMED | Kitchen station mapping | PRD-MENU-005.1 | §18. Menu Management |
| MENU-006 | CONFIRMED | Preparation time | PRD-MENU-006.1 | §18. Menu Management |
| MENU-007 | CONFIRMED | Order-type availability | PRD-MENU-007.1 | §18. Menu Management |
| MENU-008 | CONFIRMED | Publish/activate approved menu data | PRD-MENU-008.1, PRD-MENU-008.AC1 | §18. Menu Management |
| MENU-009 | CONFIRMED | Outlet-specific price and availability overrides | PRD-MENU-009.1, PRD-MENU-009.AC1 | §19. Outlet Menu Overrides |
| MENU-010 | CONFIRMED | Overrides by Owner and authorized Manager | PRD-MENU-010.1 | §19. Outlet Menu Overrides |
| MENU-011 | CONFIRMED | A menu-item availability override for the authorized outlet is either temporary for the o… | PRD-MENU-011.1, PRD-MENU-011.2, PRD-MENU-011.AC1 | §19. Outlet Menu Overrides |
| MENU-012 | CONFIRMED | Edit menu / change price: Owner, Manager only | PRD-MENU-012.1, PRD-MENU-012.AC1 | §18. Menu Management |
| MENU-013 | CONFIRMED | Menu price and availability changes are audited | PRD-MENU-013.1, PRD-MENU-013.AC1, via PRD-AUDIT-002.1 | §18. Menu Management; §53. Audit Trail |
| MENU-014 | CONFIRMED | An item may be unavailable at one outlet and available at another | PRD-MENU-014.1, PRD-MENU-014.AC1 | §19. Outlet Menu Overrides |
| MENU-015 | CONFIRMED | Item sold out after it was added to a cart is not ordered silently; customer is told | PRD-MENU-015.1, PRD-MENU-015.AC1 | §18. Menu Management |
| MENU-016 | CONFIRMED | A modifier becoming unavailable after order creation does not alter that order | PRD-MENU-016.1 | §18. Menu Management |
| MENU-017 | CONFIRMED | When an item is added to an order, the order line captures its commercial values — item p… | PRD-MENU-017.1, PRD-MENU-017.AC1 | §18. Menu Management |
| TABLE-001 | CONFIRMED | Table states: Available, Occupied, Billing, Cleaning, Reserved | PRD-TABLE-001.1 | §20. Table and Floor Management |
| TABLE-002 | CONFIRMED | Typical flow Available → Occupied → Billing → Cleared → Available | PRD-TABLE-002.1 | §20. Table and Floor Management |
| TABLE-003 | CONFIRMED | No customer reservation-booking workflow | PRD-TABLE-003.1, via PRD-NG-016.1 | §20. Table and Floor Management; §6. Phase 1 Non-Goals |
| TABLE-004 | CONFIRMED | Operations: open, add items, transfer, merge, split, move items, reopen bill, clear | PRD-TABLE-004.1 | §20. Table and Floor Management |
| TABLE-005 | CONFIRMED | Table QR identifies outlet and table | PRD-TABLE-005.1 | §20. Table and Floor Management |
| TABLE-006 | CONFIRMED | A tableless QR contains no table information | PRD-TABLE-006.1 | §20. Table and Floor Management |
| TABLE-007 | CONFIRMED | An abandoned Draft never permanently occupies a table; releasing its occupancy claim does… | PRD-TABLE-007.1, PRD-TABLE-007.AC1 | §20. Table and Floor Management |
| TABLE-008 | CONFIRMED | Two staff modifying the same table/order: no lost update; second writer informed | PRD-TABLE-008.1, PRD-TABLE-008.AC1 | §20. Table and Floor Management |
| TABLE-009 | CONFIRMED | Table transfer during active KOT preserves KOT history and kitchen sees new table | PRD-TABLE-009.1, PRD-TABLE-009.AC1 | §20. Table and Floor Management |
| TABLE-010 | CONFIRMED | Items can be added to a table in Billing only while its bill is not Finalized | PRD-TABLE-010.1, PRD-TABLE-010.AC1 | §20. Table and Floor Management |
| TABLE-011 | CONFIRMED | A table's last bill stays reachable after it is paid | PRD-TABLE-011.1 | §20. Table and Floor Management |
| TABLE-012 | CONFIRMED | Transfer, merge, split and move-items remain in Phase 1 | via PRD-TABLE-004.1 | §20. Table and Floor Management |
| TABLE-013 | DEFERRED | Full table transition/actor matrix | — (DEFERRED, see §5) | — |
| TABLE-014 | CONFIRMED | One active table session per table | PRD-TABLE-014.1, PRD-TABLE-014.AC1 | §20. Table and Floor Management |
| TABLE-015 | CONFIRMED | One active order context per table session (= ORD-091) | PRD-TABLE-015.1, PRD-TABLE-015.AC1 | §20. Table and Floor Management |
| TABLE-016 | CONFIRMED | Move, merge and split operations create auditable operational events | PRD-TABLE-016.1, PRD-TABLE-016.AC1 | §20. Table and Floor Management |
| TABLE-017 | CONFIRMED | Historical table/order records are never rewritten to erase history; an operation may cha… | PRD-TABLE-017.1, PRD-TABLE-017.AC1 | §20. Table and Floor Management |
| TABLE-018 | CONFIRMED | The order is the billing ownership boundary: a bill belongs to its order. Transfer, merge… | PRD-TABLE-018.1, PRD-TABLE-018.AC1 | §20. Table and Floor Management |
| ORD-001 | CONFIRMED | All channels enter one internal order model | PRD-ORD-001.1 | §28. Unified Order Engine |
| ORD-002 | CONFIRMED | Channels: waiter, table QR, takeaway/walk-in, tableless QR, direct website, WhatsApp | PRD-ORD-002.1 | §28. Unified Order Engine |
| ORD-003 | CONFIRMED | Order retains organization, outlet, source, table (if any), customer (if known), staff (i… | PRD-ORD-003.1, PRD-ORD-003.AC1 | §28. Unified Order Engine |
| ORD-004 | CONFIRMED | Any order without an associated table is Takeaway, whatever its source | PRD-ORD-004.1, PRD-ORD-004.AC1 | §24. Takeaway |
| ORD-005 | CONFIRMED | Takeaway can originate from customer, Waiter or other authorized staff | PRD-ORD-005.1, PRD-ORD-005.AC1 | §24. Takeaway |
| ORD-006 | CONFIRMED | Submission is idempotent: one logical submission = one order; retry returns existing resu… | PRD-ORD-006.1, PRD-ORD-006.AC1 | §28. Unified Order Engine |
| ORD-007 | CONFIRMED | Order stays bound to the correct organization, outlet and table context | PRD-ORD-007.1, PRD-ORD-007.AC1 | §21. QR Ordering |
| ORD-008 | CONFIRMED | Customer-originated orders (table QR, tableless QR, website, WhatsApp) require staff acce… | PRD-ORD-008.1, PRD-ORD-008.AC1, PRD-ORD-008.AC2, PRD-ORD-008.2 | §28. Unified Order Engine; §54. Notifications |
| ORD-020 | CONFIRMED | Table QR flow as above, including staff acceptance before Confirmed | PRD-ORD-020.1, PRD-ORD-020.AC1, PRD-ORD-020.AC2 | §22. Table QR Ordering |
| ORD-021 | CONFIRMED | Table QR orders do not request customer details; details only on the no-table QR (amended A2) | PRD-ORD-021.1, PRD-ORD-021.AC1, PRD-ORD-021.AC2 | §22. Table QR Ordering |
| ORD-022 | CONFIRMED | Customer can track order status | PRD-ORD-022.1, PRD-ORD-022.AC1 | §21. QR Ordering |
| ORD-030 | CONFIRMED | Customer MUST provide name and phone before placing the order | PRD-ORD-030.1, PRD-ORD-030.AC1 | §23. Tableless QR Ordering |
| ORD-031 | CONFIRMED | No OTP / mandatory verification | PRD-ORD-031.1, PRD-ORD-031.AC1 | §23. Tableless QR Ordering |
| ORD-032 | CONFIRMED | Order is Takeaway | PRD-ORD-032.1, PRD-ORD-032.AC1 | §23. Tableless QR Ordering |
| ORD-033 | CONFIRMED | Name and phone are associated with order and customer history | PRD-ORD-033.1 | §23. Tableless QR Ordering |
| ORD-040 | CONFIRMED | Direct website is an ordering channel into the unified engine | PRD-ORD-040.1 | §25. Website Ordering |
| ORD-041 | CONFIRMED | Website orders have no table → Takeaway | PRD-ORD-041.1, PRD-ORD-041.AC1 | §25. Website Ordering |
| ORD-042 | CONFIRMED | Website orders require name + phone, no mandatory OTP, and staff acceptance (ORD-008) | PRD-ORD-042.1, PRD-ORD-042.AC1 | §25. Website Ordering |
| ORD-050 | CONFIRMED | Waiter workflow as above | PRD-ORD-050.1, PRD-ORD-050.AC1 | §27. Waiter Ordering |
| ORD-051 | CONFIRMED | Waiter may edit the current unpaid/current bill order per permission; this is an explicit… | PRD-ORD-051.1, PRD-ORD-051.AC1, PRD-ORD-051.AC2 | §27. Waiter Ordering |
| ORD-052 | CONFIRMED | Waiter may add items, trigger required KOT updates, request cancellation subject to kitch… | PRD-ORD-052.1 | §27. Waiter Ordering |
| ORD-053 | CONFIRMED | Waiter can cancel an item | PRD-ORD-053.1 | §27. Waiter Ordering |
| ORD-054 | CONFIRMED | Waiter can create takeaway orders | PRD-ORD-054.1, via PRD-ORD-005.1 | §27. Waiter Ordering; §24. Takeaway |
| ORD-060 | CONFIRMED | Order states and meanings as above | PRD-ORD-060.1 | §29. Order Lifecycle |
| ORD-061 | CONFIRMED | Valid/invalid transitions and actors are defined for every state; skipping a required sta… | PRD-ORD-061.1, PRD-ORD-061.AC1 | §29. Order Lifecycle |
| ORD-062 | CONFIRMED | Customer order awaiting acceptance is shown as a distinct "awaiting acceptance" sub-state… | PRD-ORD-062.1 | §21. QR Ordering |
| ORD-063 | CONFIRMED | An order becomes Completed only when every item has a terminal outcome (Served, Picked Up… | PRD-ORD-063.1, PRD-ORD-063.AC1, PRD-ORD-063.AC2 | §29. Order Lifecycle |
| ORD-064 | CONFIRMED | Abandoned (uncommitted) Draft: no KOT and no sale are created; the Draft remains identifi… | PRD-ORD-064.1, PRD-ORD-064.2, PRD-ORD-064.AC1, PRD-ORD-064.AC2 | §29. Order Lifecycle |
| ORD-065 | CONFIRMED | If every item of an order is cancelled before fulfillment, the order outcome is Cancelled… | PRD-ORD-065.1, PRD-ORD-065.AC1 | §29. Order Lifecycle |
| ORD-070 | CONFIRMED | Item-level state, KOT state, cancellation cutoff and void/hold/re-fire are defined before… | PRD-ORD-070.1 | §30. Order Item Lifecycle |
| ORD-071 | CONFIRMED | Item states: Pending → Sent → Preparing → Ready → Served / Picked Up; Cancelled | PRD-ORD-071.1 | §30. Order Item Lifecycle |
| ORD-072 | CONFIRMED | Partial readiness is recorded at item level | PRD-ORD-072.1, PRD-ORD-072.AC1 | §30. Order Item Lifecycle |
| ORD-073 | CONFIRMED | Hold temporarily pauses an item (primarily) or an entire, intentionally paused order from… | PRD-ORD-073.1, PRD-ORD-073.AC1, PRD-ORD-073.AC2 | §30. Order Item Lifecycle |
| ORD-080 | CONFIRMED | Add item after initial KOT: same order; original order/KOT history preserved; additional … | PRD-ORD-080.1, PRD-ORD-080.AC1 | §31. Order Modification |
| ORD-081 | CONFIRMED | Cancel KOT'd item: request → kitchen-state check → if operationally cancellable, cancella… | PRD-ORD-081.1 | §32. Order Cancellation |
| ORD-082 | CONFIRMED | Cancellation by item state: Pending → direct cancellation; Sent/KOT → cancellation produc… | PRD-ORD-082.1, PRD-ORD-082.AC1, PRD-ORD-082.AC2, PRD-ORD-082.AC3 | §32. Order Cancellation |
| ORD-083 | CONFIRMED | Cancellation after KOT creates a cancellation/operational trace; never a silent deletion | PRD-ORD-083.1 | §32. Order Cancellation |
| ORD-084 | CONFIRMED | Supported operations: modify quantity, modify modifiers/add-ons, customer notes, kitchen … | PRD-ORD-084.1 | §28. Unified Order Engine |
| ORD-085 | CONFIRMED | Cancelling an order requires a reason | PRD-ORD-085.1 | §32. Order Cancellation |
| ORD-086 | CONFIRMED | A post-KOT quantity/modifier change is represented as cancellation KOT + additional KOT | PRD-ORD-086.1, PRD-ORD-086.AC1 | §31. Order Modification |
| ORD-087 | CONFIRMED | Cancelled items are reflected in (excluded from) the bill | PRD-ORD-087.1, PRD-ORD-087.AC1 | §32. Order Cancellation |
| ORD-088 | CONFIRMED | Cancellation request: for a Preparing or Ready item, a non-kitchen cancellation creates a… | PRD-ORD-088.1, PRD-ORD-088.AC1, PRD-ORD-088.2 | §32. Order Cancellation; §54. Notifications |
| ORD-089 | CONFIRMED | Every cancellation (item or order, any actor) requires a reason — supplies the "cancellat… | PRD-ORD-089.1, PRD-ORD-089.AC1 | §32. Order Cancellation |
| ORD-090 | CONFIRMED | No cancellation may silently erase an already-issued KOT | PRD-ORD-090.1 | §32. Order Cancellation |
| ORD-091 | CONFIRMED | A table session has at most one active order context; additional items are added to the e… | PRD-ORD-091.1, via PRD-TABLE-015.1 | §31. Order Modification; §20. Table and Floor Management |
| ORD-092 | CONFIRMED | Every cancellation record preserves actor, reason, timestamp, previous state and resultin… | PRD-ORD-092.1, PRD-ORD-092.AC1 | §32. Order Cancellation |
| ORD-093 | CONFIRMED | Kitchen acknowledges a Preparing/Ready cancellation request by accepting (item → Cancelle… | PRD-ORD-093.1, PRD-ORD-093.AC1, PRD-ORD-093.AC2, PRD-ORD-093.AC3 | §32. Order Cancellation |
| ORD-094 | CONFIRMED | Abandoned customer Draft never offered back for resumption (A2) | PRD-ORD-094.1, PRD-ORD-094.AC1 | §29. Order Lifecycle |
| KOT-001 | CONFIRMED | Initial KOT is sent when the order is Confirmed | PRD-KOT-001.1 | §33. KOT |
| KOT-002 | CONFIRMED | Additional KOT for items added after the initial KOT | PRD-KOT-002.1, via PRD-ORD-080.1 | §33. KOT; §31. Order Modification |
| KOT-003 | CONFIRMED | Cancellation KOT/update when a sent item is cancelled | PRD-KOT-003.1 | §33. KOT |
| KOT-004 | CONFIRMED | KOT shows table/order number, items, modifiers and notes | PRD-KOT-004.1 | §33. KOT |
| KOT-005 | CONFIRMED | KOT identifies Takeaway when no table is associated | PRD-KOT-005.1, PRD-KOT-005.AC1, via PRD-HANDOFF-003.1 | §33. KOT; §24. Takeaway |
| KOT-006 | CONFIRMED | Items route to their mapped kitchen station | PRD-KOT-006.1, PRD-KOT-006.AC1, via PRD-MENU-005.1 | §33. KOT; §18. Menu Management |
| KOT-007 | CONFIRMED | Interrupted KOT submission → safe retry → one logical KOT | PRD-KOT-007.1, PRD-KOT-007.AC1 | §33. KOT |
| KOT-008 | CONFIRMED | KOT history preserved on the order | PRD-KOT-008.1 | §33. KOT |
| KOT-009 | CONFIRMED | KOTs are received on the KDS | PRD-KOT-009.1, PRD-KOT-009.2 | §33. KOT; §54. Notifications |
| KOT-010 | DEFERRED | Thermal KOT printing | — (DEFERRED, see §5) | — |
| KDS-001 | CONFIRMED | One kitchen operational context per outlet; all Kitchen-permission users share its queue … | PRD-KDS-001.1 | §34. Kitchen and KDS |
| KDS-002 | CONFIRMED | Stations (e.g., Tandoor) exist inside that single kitchen for routing and station work | PRD-KDS-002.1, PRD-KDS-002.AC1 | §35. Kitchen Stations |
| KDS-003 | CONFIRMED | KDS flow New → Preparing → Ready | PRD-KDS-003.1 | §34. Kitchen and KDS |
| KDS-004 | CONFIRMED | Order timer | PRD-KDS-004.1 | §34. Kitchen and KDS |
| KDS-005 | CONFIRMED | Priority default NORMAL; authorized Kitchen/Manager escalate to HIGH/URGENT; manual, not … | PRD-KDS-005.1, PRD-KDS-005.AC1 | §34. Kitchen and KDS |
| KDS-006 | CONFIRMED | Re-fire | PRD-KDS-006.1 | §34. Kitchen and KDS |
| KDS-007 | CONFIRMED | Delayed-order workflow is removed | PRD-KDS-007.1, via PRD-NG-014.1 | §34. Kitchen and KDS; §6. Phase 1 Non-Goals |
| KDS-008 | CONFIRMED | Any authorized Kitchen user may mark an order/item Ready | PRD-KDS-008.1 | §34. Kitchen and KDS |
| KDS-009 | CONFIRMED | Readiness depends on the order's required food, not on which user acted; the order is not… | PRD-KDS-009.1, PRD-KDS-009.AC1 | §34. Kitchen and KDS |
| KDS-010 | CONFIRMED | Owner and Manager may mark Ready in an oversight capacity | PRD-KDS-010.1, PRD-KDS-010.AC1 | §34. Kitchen and KDS |
| KDS-011 | CONFIRMED | Kitchen may cancel the whole order or part of it for unavailability or another valid oper… | PRD-KDS-011.1, PRD-KDS-011.AC1 | §36. Kitchen Cancellation |
| KDS-012 | CONFIRMED | Kitchen cancellation reason is mandatory | PRD-KDS-012.1, PRD-KDS-012.AC1 | §36. Kitchen Cancellation |
| KDS-013 | CONFIRMED | Kitchen cancellation updates affected order/bill state; never a silent deletion | PRD-KDS-013.1, PRD-KDS-013.2 | §36. Kitchen Cancellation; §54. Notifications |
| KDS-014 | CONFIRMED | Item and kitchen cancellations are audited | PRD-KDS-014.1, via PRD-AUDIT-002.1 | §36. Kitchen Cancellation; §53. Audit Trail |
| KDS-015 | DEFERRED | Format of reason capture (list, free text) | PRD-KDS-015.1 | §36. Kitchen Cancellation |
| KDS-016 | CONFIRMED | KDS disconnect → reconnect and recover current operational state | PRD-KDS-016.1, PRD-KDS-016.AC1 | §34. Kitchen and KDS |
| KDS-017 | CONFIRMED | Kitchen acknowledges cancellation requests for Preparing/Ready items (ORD-088) | PRD-KDS-017.1, via PRD-ORD-088.1 | §36. Kitchen Cancellation; §32. Order Cancellation |
| HANDOFF-001 | CONFIRMED | Table associated and waiter assigned/used: READY → waiter collects → Served (waiter confi… | PRD-HANDOFF-001.1, PRD-HANDOFF-001.AC1, PRD-HANDOFF-001.2 | §37. Food Handoff; §54. Notifications |
| HANDOFF-002 | CONFIRMED | No waiter / Takeaway: READY → handoff → Picked Up (customer/recipient pickup) | PRD-HANDOFF-002.1 | §37. Food Handoff |
| HANDOFF-003 | CONFIRMED | Kitchen and customer-facing flows clearly show Takeaway | PRD-HANDOFF-003.1 | §24. Takeaway |
| HANDOFF-004 | CONFIRMED | Picked Up is recorded by Waiter or Cashier | PRD-HANDOFF-004.1, PRD-HANDOFF-004.AC1 | §37. Food Handoff |
| BILL-001 | CONFIRMED | Bill finalization and payment status are separate concepts | PRD-BILL-001.1, PRD-BILL-001.AC1 | §39. Bill Lifecycle |
| BILL-002 | CONFIRMED | Bill workflow distinguishes Draft, Finalized, Paid/Not Paid, Reopened, Cancelled, Refunded | PRD-BILL-002.1 | §39. Bill Lifecycle |
| BILL-003 | CONFIRMED | Draft: customer not yet billed and can continue ordering | PRD-BILL-003.1 | §39. Bill Lifecycle |
| BILL-004 | CONFIRMED | Finalized: further modification requires the appropriate correction path | PRD-BILL-004.1, PRD-BILL-004.AC1 | §39. Bill Lifecycle |
| BILL-005 | CONFIRMED | Reopen: authorized correction path for a Finalized bill (paid or not) — Reopen → correcti… | PRD-BILL-005.1 | §39. Bill Lifecycle |
| BILL-006 | CONFIRMED | Refund records amount and authorizing user; partial vs full preserved | PRD-BILL-006.1, PRD-BILL-006.AC1 | §39. Bill Lifecycle |
| BILL-007 | CONFIRMED | Cancellation is an authorized correction and not automatically a refund | PRD-BILL-007.1, PRD-BILL-007.AC1 | §39. Bill Lifecycle |
| BILL-008 | CONFIRMED | Capabilities: bill generation, tax, discounts, service charge, packaging charge, round-of… | PRD-BILL-008.1 | §38. Billing |
| BILL-009 | CONFIRMED | Reprint never silently mutates financial data | PRD-BILL-009.1, PRD-BILL-009.AC1 | §38. Billing |
| BILL-010 | CONFIRMED | Refund/reopen/cancel are permissioned | PRD-BILL-010.1, PRD-BILL-010.AC1 | §38. Billing; §41. Cashier Workflow |
| BILL-011 | CONFIRMED | Correction/audit history is preserved | PRD-BILL-011.1 | §38. Billing |
| BILL-012 | CONFIRMED | Refund is recorded information only; no money movement | PRD-BILL-012.1 | §39. Bill Lifecycle |
| BILL-013 | CONFIRMED | Discounts, reopen, refund, cancellation, payment corrections are audited | PRD-BILL-013.1, PRD-BILL-013.AC1, via PRD-AUDIT-002.1 | §38. Billing; §53. Audit Trail |
| BILL-014 | CONFIRMED | Reopening a bill requires a reason | PRD-BILL-014.1, PRD-BILL-014.AC1 | §39. Bill Lifecycle |
| BILL-015 | CONFIRMED | One bill per order / customer transaction context: Table → Order → Bill; no table → Takea… | PRD-BILL-015.1, PRD-BILL-015.AC1 | §38. Billing |
| BILL-016 | CONFIRMED | Paid bill: Waiter direct edit denied unless the authorized correction workflow (reopen) i… | PRD-BILL-016.1, PRD-BILL-016.AC1 | §38. Billing |
| BILL-017 | CONFIRMED | Waiter may reopen bills, including paid ones (reopen is that correction workflow) | PRD-BILL-017.1 | §38. Billing |
| PAY-001 | CONFIRMED | Record Paid or Not Paid | PRD-PAY-001.1 | §40. Payment Information |
| PAY-002 | CONFIRMED | If paid, record payment mode: UPI, Cash, Card, Split | PRD-PAY-002.1 | §40. Payment Information |
| PAY-003 | CONFIRMED | If the payment flow/provider supplies an online payment reference or transaction ID, it i… | PRD-PAY-003.1 | §40. Payment Information |
| PAY-004 | CONFIRMED | Associate payment with bill, order, outlet | PRD-PAY-004.1 | §40. Payment Information |
| PAY-005 | CONFIRMED | Preserve split components; available for Day Close reconciliation | PRD-PAY-005.1, PRD-PAY-005.AC1 | §40. Payment Information |
| PAY-006 | CONFIRMED | Repeated submissions do not create duplicate payment records | PRD-PAY-006.1, PRD-PAY-006.AC1 | §40. Payment Information |
| PAY-007 | CONFIRMED | Payment corrections are audited | PRD-PAY-007.1, via PRD-AUDIT-002.1 | §40. Payment Information; §53. Audit Trail |
| PAY-008 | EXCLUDED | Payment execution / gateway integration not in Phase 1 | PRD-PAY-008.1, via PRD-NG-011.1 | §6. Phase 1 Non-Goals |
| PAY-009 | CONFIRMED | Payment belongs to the operational day in which it is recorded | PRD-PAY-009.1 | §40. Payment Information |
| PAY-010 | CONFIRMED | Payment status is independent of bill finalization; it stays Not Paid until recorded paym… | PRD-PAY-010.1, PRD-PAY-010.AC1, PRD-PAY-010.AC2 | §40. Payment Information |
| PAY-011 | CONFIRMED | If no provider/payment reference is supplied, the payment may still be recorded without o… | PRD-PAY-011.1, PRD-PAY-011.AC1 | §40. Payment Information |
| PAY-012 | CONFIRMED | A Draft bill may have payments recorded and may still receive items before finalization; … | PRD-PAY-012.1, PRD-PAY-012.AC1, PRD-PAY-012.AC2, PRD-PAY-012.AC3 | §39. Bill Lifecycle |
| PAY-013 | CONFIRMED | Every refund records, where applicable: amount, refund/payment mode, reason, actor, times… | PRD-PAY-013.1, PRD-PAY-013.AC1 | §39. Bill Lifecycle |
| CUSTOMER-001 | CONFIRMED | Customer journey as above | PRD-CUSTOMER-001.1 | §42. Customer Experience |
| CUSTOMER-002 | CONFIRMED | Customer record when captured: name/phone, order history, visit count, total spend, AOV, … | PRD-CUSTOMER-002.1, PRD-CUSTOMER-002.AC1 | §42. Customer Experience |
| CUSTOMER-003 | CONFIRMED | Customer sees only their own order | PRD-CUSTOMER-003.1, PRD-CUSTOMER-003.AC1, via PRD-RBAC-025.1 | §42. Customer Experience; §8. Role Responsibilities and Boundaries |
| CUSTOMER-004 | CONFIRMED | Outlet staff see own-outlet history; Owner sees cross-outlet customer/history | PRD-CUSTOMER-004.1 | §42. Customer Experience |
| CUSTOMER-005 | CONFIRMED | No customer accounts; name + phone for tableless QR and website; no mandatory OTP; order … | PRD-CUSTOMER-005.1, via PRD-AUTH-009.1 | §42. Customer Experience; §12. Authentication |
| CUSTOMER-006 | EXCLUDED | Public reviews are Phase 2 | PRD-CUSTOMER-006.1, via PRD-NG-008.1 | §6. Phase 1 Non-Goals |
| CUSTOMER-010 | CONFIRMED | Only one-tap reorder; no broader recovery/reorder assistant/loyalty | PRD-CUSTOMER-010.1, via PRD-NG-007.1 | §44. One-Tap Reorder; §6. Phase 1 Non-Goals |
| CUSTOMER-011 | CONFIRMED | Requires an eligible prior order | PRD-CUSTOMER-011.1 | §44. One-Tap Reorder |
| CUSTOMER-012 | CONFIRMED | System validates current item/menu availability and outlet context | PRD-CUSTOMER-012.1 | §44. One-Tap Reorder |
| CUSTOMER-013 | CONFIRMED | Reorder creates a new order through the unified engine | PRD-CUSTOMER-013.1 | §44. One-Tap Reorder |
| CUSTOMER-014 | CONFIRMED | Unavailable items are not silently substituted or hallucinated | PRD-CUSTOMER-014.1, PRD-CUSTOMER-014.AC1 | §44. One-Tap Reorder |
| CUSTOMER-015 | CONFIRMED | Customer sees the resulting order state | PRD-CUSTOMER-015.1, via PRD-ORD-022.1 | §42. Customer Experience; §21. QR Ordering |
| CUSTOMER-016 | CONFIRMED | The customer reaches eligible past orders through a private, non-guessable order-access l… | PRD-CUSTOMER-016.1 | §44. One-Tap Reorder |
| CUSTOMER-017 | CONFIRMED | Reorder applies current price, tax, availability and menu rules | PRD-CUSTOMER-017.1, PRD-CUSTOMER-017.AC1 | §44. One-Tap Reorder |
| CUSTOMER-018 | CONFIRMED | Reorder is unavailable while the outlet is Closed | PRD-CUSTOMER-018.1, PRD-CUSTOMER-018.AC1, via PRD-ORG-021.1 | §44. One-Tap Reorder; §9. Organization and Outlet Model |
| CUSTOMER-019 | CONFIRMED | Reorder never modifies the historical order | PRD-CUSTOMER-019.1, PRD-CUSTOMER-019.AC1 | §44. One-Tap Reorder |
| CUSTOMER-020 | CONFIRMED | One-tap reorder is available from the customer's private order-access link for a historic… | PRD-CUSTOMER-020.1, PRD-CUSTOMER-020.AC1, PRD-CUSTOMER-020.AC2 | §44. One-Tap Reorder |
| CUSTOMER-021 | CONFIRMED | Phone number is the primary customer matching key at organization scope; order/history vi… | PRD-CUSTOMER-021.1, PRD-CUSTOMER-021.AC1 | §42. Customer Experience |
| FEEDBACK-001 | CONFIRMED | Feedback is offered when the order reaches Completed | PRD-FEEDBACK-001.1, PRD-FEEDBACK-001.AC1 | §43. Customer Feedback |
| FEEDBACK-002 | CONFIRMED | Customer submits rating/comment where supported | PRD-FEEDBACK-002.1, PRD-FEEDBACK-002.2, PRD-FEEDBACK-002.AC1 | §43. Customer Feedback |
| FEEDBACK-003 | CONFIRMED | Feedback is associated with order, outlet and customer context | PRD-FEEDBACK-003.1 | §43. Customer Feedback |
| FEEDBACK-004 | CONFIRMED | Management uses feedback as operational insight | PRD-FEEDBACK-004.1 | §43. Customer Feedback |
| FEEDBACK-005 | EXCLUDED | Public review publishing/request workflows are not Phase 1 | PRD-FEEDBACK-005.1, via PRD-NG-008.1 | §6. Phase 1 Non-Goals |
| FEEDBACK-006 | CONFIRMED | Rating 1–5 + optional comment; one feedback per order | PRD-FEEDBACK-006.1, PRD-FEEDBACK-006.AC1 | §43. Customer Feedback |
| DAY-001 | CONFIRMED | Continuous running operational day; no midnight, fixed operating-hours or system start/en… | PRD-DAY-001.1, via PRD-NG-015.1 | §45. Business Day; §6. Phase 1 Non-Goals |
| DAY-002 | CONFIRMED | No Start Day action | PRD-DAY-002.1, PRD-DAY-002.AC1, via PRD-NG-015.1 | §45. Business Day; §6. Phase 1 Non-Goals |
| DAY-003 | CONFIRMED | The boundary is created only when Owner, Manager or Cashier marks the day Closed; the clo… | PRD-DAY-003.1, PRD-DAY-003.AC1 | §45. Business Day; §46. Day Close |
| DAY-004 | CONFIRMED | After closure the next operational period becomes the running day automatically | PRD-DAY-004.1 | §45. Business Day |
| DAY-005 | CONFIRMED | A transaction crossing midnight has no special boundary meaning | PRD-DAY-005.1, PRD-DAY-005.AC1 | §45. Business Day |
| DAY-006 | CONFIRMED | New transactions after closure belong to the newly active day | PRD-DAY-006.1, PRD-DAY-006.AC1 | §45. Business Day |
| DAY-007 | CONFIRMED | Day-close information: gross sales, refunds, discounts, net sales, UPI/cash/card sales, e… | PRD-DAY-007.1 | §46. Day Close |
| DAY-008 | CONFIRMED | Expenses excluded | PRD-DAY-008.1, via PRD-NG-005.1 | §46. Day Close; §6. Phase 1 Non-Goals |
| DAY-009 | CONFIRMED | Duplicate Day Close submission is safely rejected or treated as idempotent repeat | PRD-DAY-009.1, PRD-DAY-009.AC1 | §46. Day Close |
| DAY-010 | CONFIRMED | Lost connection during Day Close → final outcome recoverable; no duplicate closure; atomic | PRD-DAY-010.1, PRD-DAY-010.AC1 | §46. Day Close |
| DAY-011 | CONFIRMED | Unresolved bill at Day Close remains visible as unresolved and is surfaced in Owner/Manag… | PRD-DAY-011.1 | §46. Day Close |
| DAY-012 | CONFIRMED | Day Close is allowed with unresolved items; the closing user sees warnings for unresolved… | PRD-DAY-012.1, PRD-DAY-012.AC1 | §46. Day Close |
| DAY-013 | CONFIRMED | Owner, Manager, Cashier can Reopen Day | PRD-DAY-013.1 | §47. Reopen Day |
| DAY-014 | CONFIRMED | Day Close and Day Reopen are audited | PRD-DAY-014.1, via PRD-AUDIT-002.1 | §46. Day Close; §53. Audit Trail |
| DAY-015 | CONFIRMED | Reopen Day: only the outlet's most recently closed day; reason required; never two simult… | PRD-DAY-015.1, PRD-DAY-015.AC1, PRD-DAY-015.AC2 | §47. Reopen Day |
| DAY-016 | CONFIRMED | Business day and Day Close are per outlet (= ORG-011) | PRD-DAY-016.1, via PRD-ORG-011.1 | §45. Business Day; §9. Organization and Outlet Model |
| DAY-017 | CONFIRMED | Any "day" in the product (analytics "today", Daily AI Brief) means the business day bound… | PRD-DAY-017.1 | §45. Business Day |
| DAY-018 | CONFIRMED | Reopening a day requires a reason | PRD-DAY-018.1 | §47. Reopen Day |
| DAY-019 | CONFIRMED | Transactions retain their originating business-day association | PRD-DAY-019.1 | §45. Business Day |
| DAY-020 | CONFIRMED | Items warned about before Day Close: orders not Completed or Cancelled; customer orders a… | PRD-DAY-020.1 | §46. Day Close |
| DAY-021 | CONFIRMED | A previously closed day can be reopened only if the outlet's current running day has zero… | PRD-DAY-021.1, PRD-DAY-021.AC1 | §47. Reopen Day |
| DAY-022 | CONFIRMED | Day-close sales figures are based on bill finalization; payment status is reported separa… | PRD-DAY-022.1, PRD-DAY-022.AC1 | §46. Day Close |
| DAY-023 | CONFIRMED | Temporal invariant: an outlet's business days are contiguous, non-overlapping periods, ea… | PRD-DAY-023.1 | §45. Business Day |
| DAY-024 | CONFIRMED | On reopen, the empty running period is absorbed into the reopened day; the re-close times… | PRD-DAY-024.1 | §47. Reopen Day |
| DAY-025 | CONFIRMED | A transaction for DAY-021 is any persisted business operation that materially changes ope… | PRD-DAY-025.1, PRD-DAY-025.AC1 | §47. Reopen Day |
| CASH-001 | CONFIRMED | Reconciliation uses the same Day Close boundary; no midnight reset; no Start Day | PRD-CASH-001.1 | §48. Cash Reconciliation |
| CASH-002 | CONFIRMED | Expected cash = total cash with the responsible user at the moment the day is closed | PRD-CASH-002.1 | §48. Cash Reconciliation |
| CASH-003 | CONFIRMED | Actual/counted cash and variance are recorded | PRD-CASH-003.1 | §48. Cash Reconciliation |
| CASH-004 | CONFIRMED | Cash received before/after a prior close belongs to the day in which it was recorded | PRD-CASH-004.1, via PRD-PAY-009.1 | §48. Cash Reconciliation; §40. Payment Information |
| CASH-005 | CONFIRMED | Cash reconciliation is per outlet and business day; no opening float in Phase 1; expected… | PRD-CASH-005.1 | §48. Cash Reconciliation |
| CASH-006 | CONFIRMED | Cash variance does not block Day Close | PRD-CASH-006.1, PRD-CASH-006.AC1 | §48. Cash Reconciliation |
| CASH-007 | CONFIRMED | Expected cash = cash payments recorded in the business day − cash refunds recorded in it | PRD-CASH-007.1, PRD-CASH-007.AC1 | §48. Cash Reconciliation |
| ANALYTICS-010 | CONFIRMED | Unresolved bills remain traceable and visible in Owner and Manager analytics; never disap… | PRD-ANALYTICS-010.1, PRD-ANALYTICS-010.AC1 | §49. Unresolved Bills |
| ANALYTICS-011 | CONFIRMED | Unresolved bill = a bill whose status is Draft or Reopened, or Finalized with payment sta… | PRD-ANALYTICS-011.1 | §49. Unresolved Bills |
| AUDIT-001 | CONFIRMED | Sensitive actions record who, what, when, outlet, before state, after state, reason where… | PRD-AUDIT-001.1, PRD-AUDIT-001.AC1 | §53. Audit Trail |
| AUDIT-002 | CONFIRMED | Events: credential/security actions, permission changes, staff outlet reassignment, menu … | PRD-AUDIT-002.1 | §53. Audit Trail |
| AUDIT-003 | CONFIRMED | A sensitive action without its audit event is a defect | PRD-AUDIT-003.1 | §53. Audit Trail |
| AUDIT-004 | CONFIRMED | AI actions are auditable | PRD-AUDIT-004.1 | §53. Audit Trail |
| AUDIT-005 | CONFIRMED | Audit records are append-only | PRD-AUDIT-005.1, PRD-AUDIT-005.AC1 | §53. Audit Trail |
| AUDIT-006 | DEFERRED | Audit event payload design | — (DEFERRED, see §5) | — |
| AUDIT-007 | CONFIRMED | The audit trail is viewable by SuperAdmin only | PRD-AUDIT-007.1, PRD-AUDIT-007.AC1 | §53. Audit Trail |
| AUDIT-008 | CONFIRMED | Day lifecycle is audited as Closed → Reopened → Reclosed | PRD-AUDIT-008.1, PRD-AUDIT-008.AC1 | §47. Reopen Day |
| AI-001 | CONFIRMED | Phase 1 AI: AI Menu Import, Owner Agent, Daily AI Brief, What Changed?, WhatsApp Ordering… | PRD-AI-001.1 | §5. Phase 1 Scope |
| AI-002 | CONFIRMED | Broader customer-recovery automation is not reintroduced | PRD-AI-002.1, via PRD-NG-007.1 | §5. Phase 1 Scope; §6. Phase 1 Non-Goals |
| AI-003 | CONFIRMED | Core operations work without AI | PRD-AI-003.1 | §2. Product Vision |
| AI-004 | CONFIRMED | AI never silently alters operational ground truth | PRD-AI-004.1 | §2. Product Vision |
| AI-010 | CONFIRMED | Menu import accepts PDF, images, Excel/CSV | PRD-AI-010.1 | §57. AI Menu Import |
| AI-011 | CONFIRMED | Extracts a structured draft | PRD-AI-011.1 | §57. AI Menu Import |
| AI-012 | CONFIRMED | Flags low-confidence fields | PRD-AI-012.1, PRD-AI-012.AC1 | §57. AI Menu Import |
| AI-013 | CONFIRMED | Owner reviews and may edit the draft | PRD-AI-013.1 | §57. AI Menu Import |
| AI-014 | CONFIRMED | Owner approves; only approved content becomes live | PRD-AI-014.1, PRD-AI-014.AC1 | §57. AI Menu Import |
| AI-015 | CONFIRMED | Import approval is audited | PRD-AI-015.1, via PRD-AUDIT-002.1 | §57. AI Menu Import; §53. Audit Trail |
| AI-016 | CONFIRMED | Duplicate items in an import are flagged before approval | PRD-AI-016.1, PRD-AI-016.AC1 | §57. AI Menu Import |
| AI-020 | CONFIRMED | Owner Agent / Daily Brief / What Changed? use authorized restaurant data | PRD-AI-020.1 | §58. Owner AI Agent |
| AI-021 | CONFIRMED | They separate facts from recommendations | PRD-AI-021.1, PRD-AI-021.AC1 | §58. Owner AI Agent |
| AI-022 | CONFIRMED | They do not invent missing ground truth | PRD-AI-022.1, PRD-AI-022.AC1 | §58. Owner AI Agent |
| AI-023 | CONFIRMED | They do not bypass RBAC | PRD-AI-023.1 | §58. Owner AI Agent |
| AI-024 | CONFIRMED | They have no unrestricted production database access; controlled tools only | PRD-AI-024.1 | §58. Owner AI Agent |
| AI-025 | CONFIRMED | Owner Agent may answer, analyze, recommend, and execute explicitly permitted actions thro… | PRD-AI-025.1, PRD-AI-025.AC1 | §58. Owner AI Agent |
| AI-026 | CONFIRMED | The Daily AI Brief belongs to the outlet business-day lifecycle and summarizes sales, ord… | PRD-AI-026.1, PRD-AI-026.AC1 | §59. Daily AI Brief |
| AI-027 | CONFIRMED | Daily AI Brief covers a business day bounded by Day Close | PRD-AI-027.1, PRD-AI-027.AC1, via PRD-DAY-017.1 | §59. Daily AI Brief; §45. Business Day |
| AI-028 | CONFIRMED | What Changed? compares the current meaningful business/operational state with the most re… | PRD-AI-028.1, PRD-AI-028.AC1, PRD-AI-028.AC2 | §60. What Changed? |
| AI-029 | CONFIRMED | Owner Agent is read-only by default and executes only explicitly permitted business actio… | PRD-AI-029.1, PRD-AI-029.AC1 | §58. Owner AI Agent |
| AI-030 | CONFIRMED | WhatsApp orders enter the unified order engine under the same rules | PRD-AI-030.1 | §26. WhatsApp Ordering |
| AI-031 | CONFIRMED | WhatsApp orders carry no table and are Takeaway | PRD-AI-031.1, PRD-AI-031.AC1 | §26. WhatsApp Ordering |
| AI-032 | CONFIRMED | WhatsApp agent offers only published, currently available items; no invented items or pri… | PRD-AI-032.1, PRD-AI-032.AC1 | §61. WhatsApp Ordering Agent |
| AI-033 | CONFIRMED | WhatsApp orders require staff acceptance (ORD-008) | PRD-AI-033.1, PRD-AI-033.AC1 | §26. WhatsApp Ordering |
| AI-040 | CONFIRMED | AI unavailable does not stop ordering, KOT, kitchen, billing or Day Close | PRD-AI-040.1, via PRD-AI-003.1 | §62. AI Safety and Guardrails; §2. Product Vision |
| AI-041 | CONFIRMED | AI output failure degrades to deterministic product behavior | PRD-AI-041.1 | §62. AI Safety and Guardrails |
| AI-042 | CONFIRMED | AI actions are permissioned and auditable | PRD-AI-042.1, PRD-AI-042.AC1, via PRD-AUDIT-004.1 | §62. AI Safety and Guardrails; §53. Audit Trail |
| AI-043 | CONFIRMED | Deterministic business logic is separate from AI reasoning | PRD-AI-043.1 | §62. AI Safety and Guardrails |
| AI-044 | CONFIRMED | KDS priority is not AI-driven | PRD-AI-044.1, via PRD-KDS-005.1 | §62. AI Safety and Guardrails; §34. Kitchen and KDS |
| AI-045 | CONFIRMED | When an AI result conflicts with source data, source data prevails | PRD-AI-045.1, PRD-AI-045.AC1 | §62. AI Safety and Guardrails |
| ANALYTICS-001 | CONFIRMED | Dashboard answers business questions before exposing detailed reports | PRD-ANALYTICS-001.1 | §50. Owner Analytics |
| ANALYTICS-002 | CONFIRMED | Metrics: today's sales, orders, AOV, payment mix, top items, top categories, order-source… | PRD-ANALYTICS-002.1 | §50. Owner Analytics |
| ANALYTICS-003 | CONFIRMED | Owner: all outlets + cross-outlet comparison | PRD-ANALYTICS-003.1, PRD-ANALYTICS-003.AC1 | §50. Owner Analytics |
| ANALYTICS-004 | CONFIRMED | Manager: assigned outlets only; no HQ aggregate | PRD-ANALYTICS-004.1, PRD-ANALYTICS-004.AC1 | §51. Manager Analytics |
| ANALYTICS-005 | CONFIRMED | "Today" = current business day since last Day Close | PRD-ANALYTICS-005.1, PRD-ANALYTICS-005.AC1, via PRD-DAY-017.1 | §50. Owner Analytics; §45. Business Day |
| ANALYTICS-006 | CONFIRMED | Feedback used as operational insight | PRD-ANALYTICS-006.1, via PRD-FEEDBACK-004.1 | §50. Owner Analytics; §43. Customer Feedback |
| ATTENTION-001 | CONFIRMED | Attention Engine is in Phase 1 | PRD-ATTENTION-001.1 | §52. Attention Engine |
| ATTENTION-002 | CONFIRMED | Flow: Operational Data → Detect Exception → Validate Evidence → Create Attention → Owner … | PRD-ATTENTION-002.1, PRD-ATTENTION-002.2 | §52. Attention Engine; §54. Notifications |
| ATTENTION-003 | CONFIRMED | Signals: sales below baseline, cash variance, unusual discount usage, unusual cancellatio… | PRD-ATTENTION-003.1, PRD-ATTENTION-003.2, PRD-ATTENTION-003.AC1 | §52. Attention Engine |
| ATTENTION-004 | CONFIRMED | Surfaces evidence; never accuses an employee or claims a cause the data cannot establish | PRD-ATTENTION-004.1, PRD-ATTENTION-004.AC1 | §52. Attention Engine |
| ATTENTION-005 | CONFIRMED | Attention is an insight only: no KDS delayed alerts, no automated customer outreach | PRD-ATTENTION-005.1 | §52. Attention Engine |
| ATTENTION-006 | CONFIRMED | Lifecycle states Open → Dismissed / Resolved with actor and time | PRD-ATTENTION-006.1, PRD-ATTENTION-006.AC1 | §52. Attention Engine |
| ATTENTION-007 | DEFERRED | Detection thresholds and baselines | — (DEFERRED, see §5) | — |
| ATTENTION-008 | CONFIRMED | Attention items follow outlet authorization: the Owner for authorized outlets, a Manager … | PRD-ATTENTION-008.1, PRD-ATTENTION-008.AC1 | §52. Attention Engine |
| OFFLINE-001 | CONFIRMED | Network lost while creating an order → pending/error state shown; safe retry; no duplicat… | PRD-OFFLINE-001.1, PRD-OFFLINE-001.AC1 | §55. Offline and Reconnection Behavior |
| OFFLINE-002 | CONFIRMED | Frontend communicates whether submission succeeded, failed or is pending | PRD-OFFLINE-002.1, PRD-OFFLINE-002.AC1 | §55. Offline and Reconnection Behavior |
| OFFLINE-003 | CONFIRMED | Retry is safe and idempotent; operational records not partially duplicated | PRD-OFFLINE-003.1, via PRD-ORD-006.1 | §55. Offline and Reconnection Behavior; §28. Unified Order Engine |
| OFFLINE-004 | CONFIRMED | KOT interrupted → one logical KOT (= KOT-007) | PRD-OFFLINE-004.1, via PRD-KOT-007.1 | §55. Offline and Reconnection Behavior; §33. KOT |
| OFFLINE-005 | CONFIRMED | KDS disconnect → reconnect and recover (= KDS-016) | PRD-OFFLINE-005.1, via PRD-KDS-016.1 | §55. Offline and Reconnection Behavior; §34. Kitchen and KDS |
| OFFLINE-006 | CONFIRMED | Payment-information retry idempotent (= PAY-006) | PRD-OFFLINE-006.1, via PRD-PAY-006.1 | §55. Offline and Reconnection Behavior; §40. Payment Information |
| OFFLINE-007 | CONFIRMED | Day Close interrupted → atomic/idempotent (= DAY-010) | PRD-OFFLINE-007.1, via PRD-DAY-010.1 | §55. Offline and Reconnection Behavior; §46. Day Close |
| OFFLINE-008 | CONFIRMED | Offline behavior is limited to safe client-side resilience: preserve user-entered work lo… | PRD-OFFLINE-008.1, PRD-OFFLINE-008.AC1 | §55. Offline and Reconnection Behavior |
| INTEG-001 | CONFIRMED | AI unavailable → core workflow continues | PRD-INTEG-001.1, PRD-INTEG-001.AC1, via PRD-AI-040.1 | §56. External Integration Failure Behavior; §62. AI Safety and Guardrails |
| INTEG-002 | CONFIRMED | WhatsApp unavailable → unified order data not corrupted; failure surfaced | PRD-INTEG-002.2, PRD-INTEG-002.1, PRD-INTEG-002.AC1 | §54. Notifications; §56. External Integration Failure Behavior |
| INTEG-003 | CONFIRMED | Email unavailable → account recoverable; onboarding retry path | PRD-INTEG-003.1, via PRD-ONB-013.1 | §56. External Integration Failure Behavior; §10. SuperAdmin Onboarding |
| SEC-001 | CONFIRMED | Tenant isolation: every object bound to organization + outlet | PRD-SEC-001.1, via PRD-ORG-003.1 | §63. Security and Privacy Requirements; §9. Organization and Outlet Model |
| SEC-002 | CONFIRMED | Cross-outlet access attempts are denied unless permitted | PRD-SEC-002.1, PRD-SEC-002.AC1, via PRD-ORG-004.1 | §63. Security and Privacy Requirements; §9. Organization and Outlet Model |
| SEC-003 | CONFIRMED | Duplicate financial operations are prevented | PRD-SEC-003.1, PRD-SEC-003.AC1, via PRD-ORD-006.1 | §63. Security and Privacy Requirements; §28. Unified Order Engine |
| SEC-004 | CONFIRMED | Inactive users cannot act (= AUTH-006) | PRD-SEC-004.1, via PRD-AUTH-006.1 | §63. Security and Privacy Requirements; §12. Authentication |
| SEC-005 | CONFIRMED | Unauthorized AI tool actions are blocked (= AI-023, AI-042) | PRD-SEC-005.1, via PRD-AI-023.1 | §63. Security and Privacy Requirements; §58. Owner AI Agent |
| SEC-006 | DEFERRED | Baseline controls: rate limiting (login, public ordering), input validation, secure payme… | — (DEFERRED, see §5) | — |
| ACT-ORD-01 | CATALOGUE | Create dine-in (table) order | PRD-ACT-ORD-01.1 | §13. RBAC and Permissions |
| ACT-ORD-02 | CATALOGUE | Create takeaway order | PRD-ACT-ORD-02.1 | §13. RBAC and Permissions |
| ACT-ORD-03 | CATALOGUE | Capture customer name/phone | PRD-ACT-ORD-03.1 | §13. RBAC and Permissions |
| ACT-ORD-04 | CATALOGUE | View the outlet's active orders | PRD-ACT-ORD-04.1 | §13. RBAC and Permissions |
| ACT-ACC-01 | CATALOGUE | Accept a customer-originated order | PRD-ACT-ACC-01.1 | §13. RBAC and Permissions |
| ACT-ACC-02 | CATALOGUE | Reject a customer-originated order | PRD-ACT-ACC-02.1 | §13. RBAC and Permissions |
| ACT-MOD-01 | CATALOGUE | Add items to an existing order | PRD-ACT-MOD-01.1 | §13. RBAC and Permissions |
| ACT-MOD-02 | CATALOGUE | Edit quantity / modifiers / notes ("Edit order") | PRD-ACT-MOD-02.1 | §13. RBAC and Permissions |
| ACT-MOD-03 | CATALOGUE | Hold item | PRD-ACT-MOD-03.1 | §13. RBAC and Permissions |
| ACT-MOD-04 | CATALOGUE | Void item | PRD-ACT-MOD-04.1 | §13. RBAC and Permissions |
| ACT-MOD-05 | CATALOGUE | Move items between tables | PRD-ACT-MOD-05.1 | §13. RBAC and Permissions |
| ACT-MOD-06 | CATALOGUE | Hold order | PRD-ACT-MOD-06.1 | §13. RBAC and Permissions |
| ACT-MOD-07 | CATALOGUE | Void order | PRD-ACT-MOD-07.1 | §13. RBAC and Permissions |
| ACT-KOT-01 | CATALOGUE | Generate initial KOT | PRD-ACT-KOT-01.1 | §13. RBAC and Permissions |
| ACT-KOT-02 | CATALOGUE | Generate additional KOT | PRD-ACT-KOT-02.1 | §13. RBAC and Permissions |
| ACT-KOT-03 | CATALOGUE | Generate cancellation KOT/update | PRD-ACT-KOT-03.1 | §13. RBAC and Permissions |
| ACT-KOT-04 | CATALOGUE | Re-fire item | PRD-ACT-KOT-04.1 | §13. RBAC and Permissions |
| ACT-KDS-01 | CATALOGUE | Mark item/order Preparing | PRD-ACT-KDS-01.1 | §13. RBAC and Permissions |
| ACT-KDS-02 | CATALOGUE | Mark item/order Ready | PRD-ACT-KDS-02.1 | §13. RBAC and Permissions |
| ACT-KDS-03 | CATALOGUE | Escalate priority to HIGH/URGENT | PRD-ACT-KDS-03.1 | §13. RBAC and Permissions |
| ACT-KDS-04 | CATALOGUE | View the kitchen queue (KDS) | PRD-ACT-KDS-04.1 | §13. RBAC and Permissions |
| ACT-HND-01 | CATALOGUE | Mark item/order Served | PRD-ACT-HND-01.1 | §13. RBAC and Permissions |
| ACT-HND-02 | CATALOGUE | Mark takeaway Picked Up | PRD-ACT-HND-02.1 | §13. RBAC and Permissions |
| ACT-CAN-01 | CATALOGUE | Cancel item | PRD-ACT-CAN-01.1 | §13. RBAC and Permissions |
| ACT-CAN-02 | CATALOGUE | Cancel whole order | PRD-ACT-CAN-02.1 | §13. RBAC and Permissions |
| ACT-CAN-03 | CATALOGUE | Customer cancels own order before acceptance | PRD-ACT-CAN-03.1 | §13. RBAC and Permissions |
| ACT-CAN-04 | CATALOGUE | Kitchen operational cancellation of item(s) | PRD-ACT-CAN-04.1 | §13. RBAC and Permissions |
| ACT-CAN-05 | CATALOGUE | Kitchen operational cancellation of whole order | PRD-ACT-CAN-05.1 | §13. RBAC and Permissions |
| ACT-CAN-06 | CATALOGUE | Request cancellation of a Preparing/Ready item | PRD-ACT-CAN-06.1 | §13. RBAC and Permissions |
| ACT-CAN-07 | CATALOGUE | Acknowledge (accept or decline) a cancellation request | PRD-ACT-CAN-07.1 | §13. RBAC and Permissions |
| ACT-BIL-09 | CATALOGUE | Create bill | PRD-ACT-BIL-09.1 | §13. RBAC and Permissions |
| ACT-BIL-01 | CATALOGUE | Open/review active bill ("View bill") | PRD-ACT-BIL-01.1 | §13. RBAC and Permissions |
| ACT-BIL-02 | CATALOGUE | Apply discount | PRD-ACT-BIL-02.1 | §13. RBAC and Permissions |
| ACT-BIL-03 | CATALOGUE | Apply/adjust service or packaging charge | PRD-ACT-BIL-03.1 | §13. RBAC and Permissions |
| ACT-BIL-04 | CATALOGUE | Finalize bill | PRD-ACT-BIL-04.1 | §13. RBAC and Permissions |
| ACT-BIL-05 | CATALOGUE | Reopen bill | PRD-ACT-BIL-05.1 | §13. RBAC and Permissions |
| ACT-BIL-06 | CATALOGUE | Cancel bill | PRD-ACT-BIL-06.1 | §13. RBAC and Permissions |
| ACT-BIL-07 | CATALOGUE | Refund (partial/full) | PRD-ACT-BIL-07.1 | §13. RBAC and Permissions |
| ACT-BIL-08 | CATALOGUE | Print / provide digital bill / reprint | PRD-ACT-BIL-08.1 | §13. RBAC and Permissions |
| ACT-PAY-01 | CATALOGUE | Record payment information | PRD-ACT-PAY-01.1 | §13. RBAC and Permissions |
| ACT-PAY-02 | CATALOGUE | Correct payment information | PRD-ACT-PAY-02.1 | §13. RBAC and Permissions |
| ACT-TBL-01 | CATALOGUE | Open table (starts the table session) | PRD-ACT-TBL-01.1 | §13. RBAC and Permissions |
| ACT-TBL-02 | WITHDRAWN | Transfer / merge / split tables — **WITHDRAWN in v0.4**, split into ACT-TBL-06 and ACT-TB… | — (withdrawn in SPEC v0.4) | — |
| ACT-TBL-03 | CATALOGUE | Clear table / set Cleaning / Available | PRD-ACT-TBL-03.1 | §13. RBAC and Permissions |
| ACT-TBL-04 | CATALOGUE | Set table Reserved | PRD-ACT-TBL-04.1 | §13. RBAC and Permissions |
| ACT-TBL-05 | CATALOGUE | Configure floor, tables, QR ("Manage tables", "Manage QR") | PRD-ACT-TBL-05.1 | §13. RBAC and Permissions |
| ACT-TBL-06 | CATALOGUE | Transfer table | PRD-ACT-TBL-06.1 | §13. RBAC and Permissions |
| ACT-TBL-07 | CATALOGUE | Merge / split tables | PRD-ACT-TBL-07.1 | §13. RBAC and Permissions |
| ACT-MNU-01 | CATALOGUE | Edit menu | PRD-ACT-MNU-01.1 | §13. RBAC and Permissions |
| ACT-MNU-02 | CATALOGUE | Change price | PRD-ACT-MNU-02.1 | §13. RBAC and Permissions |
| ACT-MNU-03 | CATALOGUE | Change availability / outlet menu override | PRD-ACT-MNU-03.1 | §13. RBAC and Permissions |
| ACT-CFG-01 | CATALOGUE | Restaurant / outlet configuration | PRD-ACT-CFG-01.1 | §13. RBAC and Permissions |
| ACT-STF-01 | CATALOGUE | Create / edit / deactivate staff | PRD-ACT-STF-01.1 | §13. RBAC and Permissions |
| ACT-STF-02 | CATALOGUE | Manage Manager accounts | PRD-ACT-STF-02.1 | §13. RBAC and Permissions |
| ACT-STF-03 | CATALOGUE | Reset staff credentials | PRD-ACT-STF-03.1 | §13. RBAC and Permissions |
| ACT-STF-04 | CATALOGUE | Assign / reassign staff outlet | PRD-ACT-STF-04.1 | §13. RBAC and Permissions |
| ACT-STF-05 | CATALOGUE | Customize permissions | PRD-ACT-STF-05.1 | §13. RBAC and Permissions |
| ACT-STF-06 | CATALOGUE | View staff list and status | PRD-ACT-STF-06.1 | §13. RBAC and Permissions |
| ACT-ATT-01 | CATALOGUE | Record attendance | PRD-ACT-ATT-01.1 | §13. RBAC and Permissions |
| ACT-ATT-02 | CATALOGUE | Manage schedule | PRD-ACT-ATT-02.1 | §13. RBAC and Permissions |
| ACT-ATT-03 | CATALOGUE | View own attendance | PRD-ACT-ATT-03.1 | §13. RBAC and Permissions |
| ACT-ATT-04 | CATALOGUE | View staff attendance | PRD-ACT-ATT-04.1 | §13. RBAC and Permissions |
| ACT-AVL-01 | CATALOGUE | Change own availability | PRD-ACT-AVL-01.1 | §13. RBAC and Permissions |
| ACT-AVL-02 | CATALOGUE | Change another staff member's availability | PRD-ACT-AVL-02.1 | §13. RBAC and Permissions |
| ACT-DAY-01 | CATALOGUE | Review running-day totals before close | PRD-ACT-DAY-01.1 | §13. RBAC and Permissions |
| ACT-DAY-02 | CATALOGUE | Day Close | PRD-ACT-DAY-02.1 | §13. RBAC and Permissions |
| ACT-DAY-03 | CATALOGUE | Reopen Day | PRD-ACT-DAY-03.1 | §13. RBAC and Permissions |
| ACT-CSH-01 | CATALOGUE | Enter counted cash at close ("Cash reconciliation") | PRD-ACT-CSH-01.1 | §13. RBAC and Permissions |
| ACT-CSH-02 | CATALOGUE | View expected cash / variance ("View cash reconciliation") | PRD-ACT-CSH-02.1 | §13. RBAC and Permissions |
| ACT-AVA-01 | CATALOGUE | Change outlet Open/Closed | PRD-ACT-AVA-01.1 | §13. RBAC and Permissions |
| ACT-ANL-01 | CATALOGUE | View outlet dashboard | PRD-ACT-ANL-01.1 | §13. RBAC and Permissions |
| ACT-ANL-02 | CATALOGUE | View cross-outlet comparison | PRD-ACT-ANL-02.1 | §13. RBAC and Permissions |
| ACT-ANL-03 | CATALOGUE | View unresolved bills | PRD-ACT-ANL-03.1 | §13. RBAC and Permissions |
| ACT-ANL-04 | CATALOGUE | Review / act / dismiss / resolve Attention item | PRD-ACT-ANL-04.1 | §13. RBAC and Permissions |
| ACT-ANL-05 | CATALOGUE | View audit trail | PRD-ACT-ANL-05.1 | §13. RBAC and Permissions |
| ACT-AI-01 | CATALOGUE | Upload menu source for AI import | PRD-ACT-AI-01.1 | §13. RBAC and Permissions |
| ACT-AI-07 | CATALOGUE | Edit AI-imported draft before approval | PRD-ACT-AI-07.1 | §13. RBAC and Permissions |
| ACT-AI-02 | CATALOGUE | Approve AI-imported menu for publishing | PRD-ACT-AI-02.1 | §13. RBAC and Permissions |
| ACT-AI-03 | CATALOGUE | Use Owner Agent (answer, analyze, recommend) | PRD-ACT-AI-03.1 | §13. RBAC and Permissions |
| ACT-AI-08 | CATALOGUE | Owner Agent executes a permitted action | PRD-ACT-AI-08.1 | §13. RBAC and Permissions |
| ACT-AI-04 | CATALOGUE | Receive / view Daily AI Brief | PRD-ACT-AI-04.1 | §13. RBAC and Permissions |
| ACT-AI-05 | CATALOGUE | Use What Changed? | PRD-ACT-AI-05.1 | §13. RBAC and Permissions |
| ACT-AI-06 | CATALOGUE | Order via WhatsApp Ordering Agent | PRD-ACT-AI-06.1 | §13. RBAC and Permissions |
| ACT-CUS-01 | CATALOGUE | View customer history | PRD-ACT-CUS-01.1 | §13. RBAC and Permissions |
| ACT-CUS-02 | CATALOGUE | Track own order | PRD-ACT-CUS-02.1 | §13. RBAC and Permissions |
| ACT-CUS-03 | CATALOGUE | One-tap reorder | PRD-ACT-CUS-03.1 | §13. RBAC and Permissions |
| ACT-FB-01 | CATALOGUE | Submit feedback | PRD-ACT-FB-01.1 | §13. RBAC and Permissions |
| ACT-FB-02 | CATALOGUE | View feedback | PRD-ACT-FB-02.1 | §13. RBAC and Permissions |
| NG-001 | EXCLUDED | Inventory automation, raw-material stock | PRD-NG-001.1 | §6. Phase 1 Non-Goals |
| NG-002 | EXCLUDED | Purchasing/procurement, suppliers | PRD-NG-002.1 | §6. Phase 1 Non-Goals |
| NG-003 | EXCLUDED | Recipes/recipe costing, waste management | PRD-NG-003.1 | §6. Phase 1 Non-Goals |
| NG-004 | EXCLUDED | Central kitchen; multiple kitchens per outlet | PRD-NG-004.1, via PRD-ORG-005.1 | §6. Phase 1 Non-Goals; §9. Organization and Outlet Model |
| NG-005 | EXCLUDED | Full accounting/ERP, payroll, expenses | PRD-NG-005.1 | §6. Phase 1 Non-Goals |
| NG-006 | EXCLUDED | Advanced forecasting | PRD-NG-006.1 | §6. Phase 1 Non-Goals |
| NG-007 | EXCLUDED | Loyalty/campaigns; broader reorder assistant / customer recovery | PRD-NG-007.1 | §6. Phase 1 Non-Goals |
| NG-008 | EXCLUDED | Public review workflows | PRD-NG-008.1 | §6. Phase 1 Non-Goals |
| NG-009 | EXCLUDED | Delivery; franchise management | PRD-NG-009.1 | §6. Phase 1 Non-Goals |
| NG-010 | EXCLUDED | Advanced autonomous financial actions; broad autonomous restaurant management | PRD-NG-010.1 | §6. Phase 1 Non-Goals |
| NG-011 | EXCLUDED | Payment-execution / gateway workflow | PRD-NG-011.1 | §6. Phase 1 Non-Goals |
| NG-012 | EXCLUDED | 2FA; mandatory OTP for tableless QR | PRD-NG-012.1, via PRD-AUTH-002.1, via PRD-ORD-031.1 | §6. Phase 1 Non-Goals; §12. Authentication; §23. Tableless QR Ordering |
| NG-013 | EXCLUDED | Admin, Supervisor, Support Agent roles | PRD-NG-013.1 | §6. Phase 1 Non-Goals |
| NG-014 | EXCLUDED | Delayed KDS workflow | PRD-NG-014.1 | §6. Phase 1 Non-Goals |
| NG-015 | EXCLUDED | Midnight day boundary; Start Day action | PRD-NG-015.1 | §6. Phase 1 Non-Goals |
| NG-016 | EXCLUDED | Restaurant self-signup; customer reservation booking | PRD-NG-016.1 | §6. Phase 1 Non-Goals |
| PC-001 | CONFIRMED | Full loop runs with AI disabled: provision → setup → menu → staff → tables → table-QR ord… | PRD-PC-001.1 | §68. Product Completion Criteria |
| PC-002 | CONFIRMED | Tableless-QR order (name + phone, no OTP) → Takeaway → Picked Up | PRD-PC-002.1 | §68. Product Completion Criteria |
| PC-003 | CONFIRMED | Every Y/N cell in §9 is enforced server-side and has a permission test | PRD-PC-003.1 | §68. Product Completion Criteria |
| PC-004 | CONFIRMED | Every AUDIT-002 event produces a record with before/after | PRD-PC-004.1 | §68. Product Completion Criteria |
| PC-005 | CONFIRMED | Negative checks: none of NG-004, NG-011, NG-012, NG-013, NG-014, NG-015 exist | PRD-PC-005.1 | §68. Product Completion Criteria |
| PC-006 | CONFIRMED | All six AI capabilities respect AI-020…024 and degrade per AI-040/041 | PRD-PC-006.1 | §68. Product Completion Criteria |
| PC-007 | CONFIRMED | All OPEN items resolved; no requirement remains OPEN or PROPOSED | PRD-PC-007.1 | §68. Product Completion Criteria |

## 5. Deferred Items

| DF ID | Item | Deferred to |
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
| DF-13 | Technical thresholds and delivery mechanics: Draft inactivity threshold (ORD-064), stale cancellation-request threshold (ORD-093), Daily AI… | TRD / UI-UX brief |
| DF-14 | Billing calculation policies: GST/tax calculation, discount rules, service- and packaging-charge basis, rounding, invoice numbering, accoun… | Downstream specification (TRD / configuration) |
| DF-15 | WhatsApp customer order tracking (status, acceptance/rejection, order-access link) — deferred by product owner (PO-AF-01) | Later product decision |

DEFERRED SPEC rows: ONB-033, TABLE-013, KOT-010, KDS-015, AUDIT-006, ATTENTION-007, SEC-006. ONB-033 (DF-10) and KDS-015 (DF-08) were deferred *to the PRD* and are defined in PRD-ONB-033.1 and PRD-KDS-015.1.

## 6. Excluded Items

EXCLUDED SPEC rows and non-goals remain EXCLUDED and are stated as must-not-build requirements in PRD §6: PAY-008, CUSTOMER-006, FEEDBACK-005, NG-001, NG-002, NG-003, NG-004, NG-005, NG-006, NG-007, NG-008, NG-009, NG-010, NG-011, NG-012, NG-013, NG-014, NG-015, NG-016.

## 7. Orphan Check (PRD → SPEC)

All 692 PRD requirement and acceptance-criterion IDs resolve to an existing SPEC v1.1 ID. Orphans: none.
