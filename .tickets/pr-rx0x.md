---
id: pr-rx0x
status: closed
deps: []
links: []
created: 2026-06-01T22:07:40Z
type: task
priority: 2
assignee: ProbabilityEngineer
tags: [status, lineage, prune, boundary]
---
# Keep status lineage and prune self-contained

Keep status, lineage, lineage naming, and prune commands in pi-session-move so users do not need pi-session-store for operational session move workflows.

## Design

After command renaming, ensure /move-status, /move-lineage, and /move-prune remain implemented locally and documented as operational session-move commands. Store/report/export functionality remains outside this package.

## Acceptance Criteria

- /move-status works without pi-session-store installed.
- /move-lineage works without pi-session-store installed and supports --name.
- /move-prune works without pi-session-store installed and preserves existing safety flags.
- README clarifies that canonical rebuild/export/reporting belongs to pi-session-store/agent-session-store.
- npx tsc --noEmit passes.

