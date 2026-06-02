---
id: psm-uv24
status: closed
deps: []
links: []
created: 2026-06-02T06:00:42Z
type: feature
priority: 2
assignee: ProbabilityEngineer
---
# Add move mode to path migration

Allow migrate-session-move-paths to move legacy evidence files instead of only copying them, for cleanup after verification.

## Acceptance Criteria

- migrate-paths supports an explicit move flag.
- Default behavior remains copy/verify.
- Move mode removes source files only after destination is present and hash verified.
- Manifest records whether each operation copied, moved, already present, or skipped.
- TypeScript check passes.

