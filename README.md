# pi-relocate

Pi extension that copies the current session JSONL to another working directory by replacing the old absolute cwd with the new absolute cwd. It does **not** invoke the LLM and does **not** try to switch the live Pi process.

## Install

From this repository:

```bash
pi install git:github.com/ProbabilityEngineer/pi-relocate
```

Or load locally while testing:

```bash
pi -e ./index.ts
```

## Usage

Inside Pi:

```text
/relocate <target-directory>
/relocate-status
```

Example:

```text
/relocate ./my-new-repo
```

The command will:

1. resolve the target directory relative to Pi's current cwd,
2. confirm the relocation,
3. copy the current session file into the target cwd's Pi session bucket,
4. replace occurrences of the old absolute cwd with the new absolute cwd,
5. append a lineage record to `~/.pi/agent/relocations.jsonl`, and
6. print the restart command.

Restart with the printed command, which looks like:

```bash
cd /path/to/new/repo && pi --session /path/to/relocated.jsonl
```

Use `--force` to skip confirmation:

```text
/relocate --force ./my-new-repo
```

## Lineage

`/relocate` records each copy in:

```text
~/.pi/agent/relocations.jsonl
```

Each record includes the timestamp, source cwd, target cwd, source session file, destination session file, parent session, and replacement count.

Use `/relocate-status` to show the current session, recent recorded relocations, and relocated session files discovered under `~/.pi/agent/sessions` that are not yet in the manifest.

## Notes

- The original session file is never modified.
- The relocated session is a plain JSONL copy with string replacements.
- Treat relocated sessions like branches: continue from the newest intended descendant, not an older repo-local ancestor, unless you intentionally want to go back in time.
- This is intended for workflows where you started Pi in a parent directory, created or cloned a repo, and then want to continue from that repo's cwd.
