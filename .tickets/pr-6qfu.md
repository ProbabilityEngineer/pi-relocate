---
id: pr-6qfu
status: closed
deps: []
links: []
created: 2026-06-01T22:07:40Z
type: task
priority: 1
assignee: ProbabilityEngineer
tags: [commands, bucket-relocation, cleanup]
---
# Remove bucket relocation command

Delete /relocate-bucket and do not replace it with /move-bucket. Bucket-wide repair is no longer part of the public session-move UX now that pi-repo-move relocates repo buckets during filesystem moves.

## Design

Remove the /relocate-bucket command registration and implementation paths that are only used by that command. Keep lower-level helpers only if still needed by /move or status/prune. Update README/docs to omit bucket relocation and direct normal repo moves to pi-repo-move /repo-move <target>.

## Acceptance Criteria

- /relocate-bucket is not registered.
- No /move-bucket or repair-bucket replacement is added.
- README command list omits bucket relocation.
- Existing /move current-session behavior remains unaffected.
- npx tsc --noEmit passes.

