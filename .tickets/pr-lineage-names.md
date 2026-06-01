---
id: pr-lineage-names
status: closed
type: feature
priority: 2
created: 2026-06-01T15:45:00Z
---
# Name relocation lineages

Add a way to assign human-readable names to session lineage chains/families, separate from individual session names/files.

## Acceptance Criteria

- `/relocate-lineage --name <name>` stores a lineage label for the current chain/root.
- Lineage labels are stored outside raw `relocations.jsonl` so the movement manifest remains append-only evidence.
- `/relocate-status` and `/relocate-lineage` display the current lineage name when present.
- README documents lineage names vs session names.

## Closure

Implemented `/relocate-lineage --name <name>` using `~/.pi/agent/relocation-lineages.jsonl` metadata records. Status and lineage output now display the current lineage name when available. README documents the command and storage boundary.
