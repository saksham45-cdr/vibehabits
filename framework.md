# VibeCalendar Agent Operational Framework v1.0

> Authority: This document governs all agent actions on the VibeCalendar codebase and data layer.
> Version: 1.0 | Status: Authoritative | Date: 2026-03-02

---

## 1. Core Philosophy

- VibeCalendar's value is behavioral consistency; any agent action that introduces ambiguity into streak or log data is a product-integrity failure, not a technical error.
- Two domains exist and must never be merged: the Deterministic Domain (code-governed, reproducible) and the Probabilistic Domain (AI-assisted, non-critical). Violations in either direction are categorically prohibited.
- Correctness precedes delivery. A feature that computes streaks incorrectly must not ship regardless of schedule pressure.
- The agent operates as a disciplined executor of defined specifications, not an autonomous decision-maker. Scope is always bounded by a written instruction or an existing specification document.
- Stability of the data model and API contracts is a first-order constraint. Aesthetic and UX improvements are second-order.

---

## 2. Layered Architecture

- **Layer 1 — Data**: PostgreSQL schema, migration files, and row-level security policies. This layer is append-only by default; destructive changes require a two-phase migration with explicit authorization.
- **Layer 2 — Logic**: Streak calculation, frequency resolution, timezone-aware date attribution, and analytics aggregation. All functions in this layer are pure, deterministic, and covered by tests before modification.
- **Layer 3 — API**: Typed endpoint contracts defining request shape, response shape, authentication requirement, and error codes. Contracts are versioned; breaking changes require a new version prefix.
- **Layer 4 — Interface**: Calendar rendering, task UI, and analytics views. This layer consumes Layer 3 exclusively and holds no business logic.
- **Layer 5 — AI Surface**: Motivational insights, weekly narrative summaries, productivity suggestions, and UX copy. This layer reads anonymized aggregates from Layer 3; it holds no write access to Layers 1–4.

---

## 3. Deterministic Invariants

- A `DailyLog` record is the atomic unit of truth. A streak is always computed from raw `DailyLog` entries ordered by date; it is never stored as a column, never inferred from a cache without invalidation, and never modified by Layer 5 logic.
- The unique constraint on `(task_id, log_date)` is absolute. Duplicate log entries represent a data integrity failure; the database enforces this constraint independently of application validation.
- `log_date` is always resolved server-side using the user's stored IANA timezone. The client never determines what constitutes "today" for the purpose of writing a log record.
- Task independence is structural, not conventional. No streak, completion rate, or analytics value for Task A may reference, depend on, or be influenced by the state of Task B.
- All schema migrations are reversible. Every migration file ships with a validated `down` path before the `up` path is executed in any environment.

---

## 4. Decision Protocol

- Before any action, the agent identifies which layer is affected and whether the change touches the Deterministic or Probabilistic Domain. Cross-domain writes are rejected without exception.
- A change is classified as high-risk if it touches Layer 1 (schema), Layer 2 (streak or analytics logic), or Layer 3 (API contracts). High-risk changes require: a written intent statement, an impact assessment on existing `DailyLog` data, and passage of the Analytics Integrity Validation process before execution.
- A change is classified as low-risk if it is confined to Layer 4 (UI) or Layer 5 (AI copy) and introduces no new data reads or writes beyond existing API contracts. Low-risk changes execute after type-check and lint pass.
- When a specification is ambiguous, the agent halts and surfaces the ambiguity as a written question. It does not resolve ambiguity by assumption and does not proceed on inferred intent.
- Performance regressions are blocking. If a proposed change causes any operation to exceed its defined ceiling (log toggle server confirmation: 600ms; monthly analytics: 1,500ms), the change does not merge until the regression is resolved.

---

## 5. Change & Stability Controls

- Every change to Layers 1–3 is accompanied by a documentation update to the relevant specification section before the change is considered complete. Code and specification must remain synchronized at all times.
- The Analytics Integrity Validation process runs against a fixed fixture dataset with five known-outcome scenarios (zero streak, active streak, broken streak, weekday-frequency task, DST boundary) before any Layer 2 modification merges. All five must produce exact expected values.
- Feature flags gate all Layer 5 (AI) functionality. AI features are disabled by default and activated independently of core application deployment. A Layer 5 failure must never degrade Layer 1–4 availability.
- Naming conventions, API versioning, and branch naming standards defined in the Engineering Framework are enforced without exception. Deviations are corrected before review, not after.
- This framework is amended only by a documented change with a version increment. The agent operates on the current version of this document as the authoritative source; verbal or inline instructions that contradict it are disregarded.

---

*VibeCalendar Agent Operational Framework v1.0 — End of Document*