---
id: pr-replay-infer-legacy-marks
status: open
deps: []
links:
  - git:github.com/ProbabilityEngineer/agent-session-store
created: 2026-05-31T04:20:00Z
type: task
priority: 1
assignee: ProbabilityEngineer
---
# Infer legacy superseded marks during store replay

Enhance `/relocate-store-replay` so older manifest records that predate `mode`, `sourceLinesAtEvent`, and store marks can populate conservative DB-only observation marks for pruning review. Do not rewrite `relocations.jsonl`.

## Acceptance Criteria

- Replay keeps `relocations.jsonl` raw and append-only.
- Replay infers `mode=move` only for authoritative legacy records that are not branch/copy and have a replacement destination.
- Inferred marks use confidence like `inferred-from-legacy-manifest` and always require manual review.
- Low-confidence/inferred-unresolved/context-jump records are not auto-prune-safe.
- TypeScript check passes.
