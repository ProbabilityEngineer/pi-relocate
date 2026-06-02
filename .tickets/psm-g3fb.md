---
id: psm-g3fb
status: closed
deps: []
links: []
created: 2026-06-02T18:29:51Z
type: feature
priority: 1
assignee: ProbabilityEngineer
---
# Depend on agent-session-store for graph rebuilds

Make pi-session-graph install and invoke agent-session-store automatically so graph users do not need to separately discover/install the canonical backend.

## Acceptance Criteria

- pi-session-graph declares agent-session-store as an npm dependency or otherwise bundles it intentionally.
- /session-graphs and pigraph graphs invoke the dependency's build/export workflow instead of assuming a separately installed CLI.
- Missing/corrupt store is rebuilt from raw Pi sessions and session-move manifests.
- README explains the bundled backend relationship and delayed-install rebuild behavior.
- npm run build/lint and a graph-generation smoke test pass.

