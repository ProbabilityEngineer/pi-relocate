---
id: pr-kwcw
status: closed
deps: []
links: []
created: 2026-06-01T22:07:40Z
type: task
priority: 2
assignee: ProbabilityEngineer
tags: [commands, store-boundary, cleanup]
---
# Remove store replay command from session move extension

Delete /relocate-store-replay and do not add /move-replay. Replay/rebuild/export workflows belong in agent-session-store or pi-session-store, not pi-session-move.

## Design

Remove replay command registration and user-facing docs from this extension. If helper code is only used by replay, remove it; otherwise leave shared safe utilities in place. README should steer users to pi-session-store/agent-session-store for rebuild/export/report workflows.

## Acceptance Criteria

- /relocate-store-replay is not registered.
- No /move-replay command is added.
- README/docs refer store rebuild/export work to pi-session-store or agent-session-store.
- npx tsc --noEmit passes.

