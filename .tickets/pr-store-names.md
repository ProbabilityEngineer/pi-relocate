---
id: pr-store-names
status: open
deps: [pr-store-write]
links:
  - https://github.com/earendil-works/pi/issues/5153
  - git:github.com/ProbabilityEngineer/agent-session-store
created: 2026-05-30T03:05:00Z
type: task
priority: 2
assignee: ProbabilityEngineer
---
# Preserve Pi named session display names in store writes

Pi supports named startup sessions via `--name` / `-n`. When relocation metadata has access to source/destination display names, preserve them as display-name labels in the canonical store, separate from cwd/project labels.

## Acceptance Criteria

- Store write supports display-name labels when available.
- Restart scripts/named startup interactions are reviewed for compatibility.
- Backward compatible with older Pi versions.
- README documents naming behavior.
- TypeScript check passes.
