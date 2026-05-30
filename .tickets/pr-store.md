---
id: pr-store
status: open
deps: []
links: []
created: 2026-05-30T01:00:00Z
type: feature
priority: 1
assignee: ProbabilityEngineer
---
# Append normalized relocation events to canonical lineage store

When a relocation succeeds, keep writing the raw append-only `~/.pi/agent/relocations.jsonl` record, and also append/update normalized records in the future canonical session lineage store used by `pi-session-graph` and import/reconstruction tooling.

The store write should include source/destination sessions, session ids, from/to cwd paths, timestamp, replacement count, parent/source relationship, provenance (`source = pi-relocate`), and authoritative confidence.

## Acceptance Criteria

- `/relocate` still writes `~/.pi/agent/relocations.jsonl` exactly as the raw fallback event log.
- `/relocate` also writes a normalized relocation event/edge to the canonical store when configured/available.
- Store write failures do not break the raw relocation operation; the user is warned and can replay later.
- TypeScript check passes.
