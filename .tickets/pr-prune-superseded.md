---
id: pr-prune-superseded
status: open
deps: []
links:
  - git:github.com/ProbabilityEngineer/agent-session-store
created: 2026-05-31T04:20:00Z
type: feature
priority: 1
assignee: ProbabilityEngineer
---
# Prune superseded relocation source session files safely

Add `/relocate-prune` to move superseded/deletion-candidate source session files to Trash after review. Prune must use canonical store marks and relocation metadata, never delete permanently by default.

## Acceptance Criteria

- `/relocate-prune --dry-run` lists eligible, legacy-review, and unsafe/skipped candidates.
- `/relocate-prune` moves eligible candidates to Trash, not permanent delete.
- Candidates require replacement destination to exist and must not be the current live session.
- Modern candidates verify `sourceLinesAtEvent` / `sourceBytesAtEvent` against current file before pruning.
- Changed/grown sources are skipped unless a future explicit force mode is added.
- Prune writes DB records for trashed/skipped/failed operations.
- TypeScript check passes.
