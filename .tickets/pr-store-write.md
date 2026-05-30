---
id: pr-store-write
status: open
deps: []
links:
  - git:github.com/ProbabilityEngineer/agent-session-store
created: 2026-05-30T03:05:00Z
type: feature
priority: 1
assignee: ProbabilityEngineer
---
# Write normalized relocation events to canonical store

After successful relocation, keep appending the raw record to `~/.pi/agent/relocations.jsonl` and also write/update normalized store records in `~/.pi/agent/session-store/session-store.sqlite` when available.

## Acceptance Criteria

- Raw manifest append remains authoritative and unchanged.
- Store write adds/updates source, destination, observations, relocation edge, cwd labels, and provenance.
- Store write failure warns but does not fail relocation.
- TypeScript check passes.
