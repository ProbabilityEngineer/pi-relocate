---
id: pr-55av
status: closed
deps: []
links: []
created: 2026-06-01T22:07:40Z
type: task
priority: 1
assignee: ProbabilityEngineer
tags: [rename, commands, session-move]
---
# Rename pi-relocate package to pi-session-move

Rename the extension/package/repo-facing identity from pi-relocate to pi-session-move. The package should describe session-context moves only, while filesystem repo moves remain in pi-repo-move.

## Design

Update package metadata, README wording, command descriptions, and docs from pi-relocate/relocate terminology to pi-session-move/session move terminology where it refers to the package identity. Keep raw relocation manifest compatibility and historical field names as needed; do not rewrite existing raw manifests.

## Acceptance Criteria

- package.json name and user-facing docs say pi-session-move.
- README describes /move as moving current Pi session context to a target cwd bucket, not moving repos.
- Docs point repo filesystem moves to pi-repo-move /repo-move <target>.
- Historical manifest compatibility remains intact.
- npx tsc --noEmit passes.

