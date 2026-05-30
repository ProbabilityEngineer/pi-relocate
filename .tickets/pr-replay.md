---
id: pr-replay
status: open
deps: []
links: []
created: 2026-05-30T01:00:00Z
type: task
priority: 2
assignee: ProbabilityEngineer
---
# Add relocation manifest replay/repair into canonical store

Provide a repair/replay path that rebuilds canonical store relocation events from `~/.pi/agent/relocations.jsonl` if the store is missing, corrupted, unavailable, or upgraded.

This keeps `relocations.jsonl` as the durable raw source-of-truth fallback while allowing richer store projections.

## Acceptance Criteria

- A command/script can replay `relocations.jsonl` into the canonical store without mutating session JSONLs.
- Replay is idempotent and deduplicates by stable relocation event identity.
- Replay preserves provenance that records came from `pi-relocate` manifest entries.
- README documents raw manifest vs canonical store responsibilities.
- TypeScript check passes.
