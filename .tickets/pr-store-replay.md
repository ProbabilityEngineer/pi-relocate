---
id: pr-store-replay
status: open
deps: [pr-store-write]
links:
  - git:github.com/ProbabilityEngineer/agent-session-store
created: 2026-05-30T03:05:00Z
type: task
priority: 2
assignee: ProbabilityEngineer
---
# Replay relocations.jsonl into canonical store

Add or document a repair/replay path so `~/.pi/agent/relocations.jsonl` can repopulate canonical-store relocation events after DB rebuilds or schema upgrades.

## Acceptance Criteria

- Replay is idempotent.
- Replay does not mutate session JSONLs or relocations.jsonl.
- Store records preserve pi-relocate provenance.
- README documents raw manifest vs store responsibilities.
- TypeScript check passes.
