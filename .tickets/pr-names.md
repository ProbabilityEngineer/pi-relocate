---
id: pr-names
status: closed
deps: []
links:
  - https://github.com/earendil-works/pi/issues/5153
created: 2026-05-30T01:00:00Z
type: feature
priority: 2
assignee: ProbabilityEngineer
---
# Integrate Pi named startup sessions with relocation metadata

Pi now supports named startup sessions: `--name` / `-n` sets the session display name before startup across interactive, print, JSON, and RPC modes. See Pi issue #5153 and docs `docs/sessions.md#naming-sessions` / `docs/usage.md#session-options`.

Update relocation workflows to preserve or set useful display names when starting/resuming relocated sessions, and include session display names in raw/normalized relocation metadata where available.

## Acceptance Criteria

- Evaluate current Pi named-session CLI/API behavior for relocated session startup scripts.
- Restart scripts can optionally include `--name` / `-n` when appropriate.
- Relocation records or canonical store events can carry source/destination display names when available.
- Behavior remains backward compatible with Pi versions before named startup sessions.
- README documents interaction with Pi session naming.
- TypeScript check passes.
