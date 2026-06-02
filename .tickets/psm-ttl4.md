---
id: psm-ttl4
status: closed
deps: []
links: []
created: 2026-06-02T06:30:07Z
type: feature
priority: 1
assignee: ProbabilityEngineer
---
# Make pil interactive

Plain `pil` should list lineage rows and let the user type a number to launch Pi for that lineage.

## Acceptance Criteria

- `pil` prompts for a row number by default when run in a TTY.
- Selected row launches `pi --session` in the row cwd.
- `pil --print <n>` or non-interactive numeric mode remains available for shell eval.
- Validation passes.

