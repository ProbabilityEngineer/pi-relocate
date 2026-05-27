import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";

function shellQuote(value: string): string {
	return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function normalizeDir(value: string): string {
	return resolve(value);
}

function sessionBucketName(cwd: string): string {
	const normalized = normalizeDir(cwd).replace(/[/\\]+$/g, "");
	const withoutRoot = normalized.replace(/^[/\\]+/, "");
	return `--${withoutRoot.replace(/[/\\:]+/g, "-")}--`;
}

function defaultAgentDir(): string {
	return process.env.PI_CODING_AGENT_DIR ?? join(process.env.HOME ?? ".", ".pi", "agent");
}

function uniqueRelocatedName(originalFile: string): string {
	const parsed = basename(originalFile).replace(/\.jsonl$/i, "");
	const originalSessionId = parsed.split("_relocated_")[0] || "session";
	const safeSessionId = originalSessionId.slice(0, 96);
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	return `${safeSessionId}_relocated_${stamp}.jsonl`;
}

function manifestFile(): string {
	return join(defaultAgentDir(), "relocations.jsonl");
}

type RelocationRecord = {
	ts: string;
	fromCwd: string;
	toCwd: string;
	sourceSession: string;
	destinationSession: string;
	parent: string;
	replacements: number | null;
	inferred?: boolean;
	confidence?: string;
};

async function appendManifest(record: RelocationRecord): Promise<void> {
	const path = manifestFile();
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, `${JSON.stringify(record)}\n`, { encoding: "utf8", flag: "a" });
}

async function readManifest(): Promise<RelocationRecord[]> {
	try {
		const raw = await readFile(manifestFile(), "utf8");
		return raw
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => JSON.parse(line) as RelocationRecord);
	} catch {
		return [];
	}
}

async function findRelocatedSessions(root = join(defaultAgentDir(), "sessions")): Promise<string[]> {
	const found: string[] = [];
	async function walk(dir: string): Promise<void> {
		let entries: import("node:fs").Dirent[];
		try {
			entries = await readdir(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) await walk(path);
			else if (entry.isFile() && entry.name.includes("_relocated_") && entry.name.endsWith(".jsonl")) found.push(path);
		}
	}
	await walk(root);
	return found.sort();
}

function replaceAllLiteral(input: string, from: string, to: string): string {
	return input.split(from).join(to);
}

function parseArgs(args: string): { target?: string; force: boolean } {
	const parts = args.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
	const values = parts.map((part) => {
		if (
			(part.startsWith('"') && part.endsWith('"')) ||
			(part.startsWith("'") && part.endsWith("'"))
		) {
			return part.slice(1, -1);
		}
		return part;
	});

	let force = false;
	const positional: string[] = [];
	for (const value of values) {
		if (value === "--force" || value === "-f") force = true;
		else positional.push(value);
	}

	return { target: positional.join(" ") || undefined, force };
}

export default function (pi: ExtensionAPI) {
	pi.registerCommand("relocate", {
		description:
			"Copy this session to another cwd by replacing old path strings; restart Pi there with --session. Records lineage in relocations.jsonl. No LLM call.",
		handler: async (args, ctx) => {
			const { target, force } = parseArgs(args);
			if (!target) {
				ctx.ui.notify("Usage: /relocate [--force] <target-directory>", "error");
				return;
			}

			const sessionFile = ctx.sessionManager.getSessionFile();
			if (!sessionFile) {
				ctx.ui.notify("Cannot relocate an ephemeral session with no session file.", "error");
				return;
			}

			const oldCwd = normalizeDir(ctx.cwd);
			const targetCwd = normalizeDir(isAbsolute(target) ? target : resolve(ctx.cwd, target));
			const targetStat = await stat(targetCwd).catch(() => undefined);
			if (!targetStat?.isDirectory()) {
				ctx.ui.notify(`Not a directory: ${targetCwd}`, "error");
				return;
			}

			if (oldCwd === targetCwd) {
				ctx.ui.notify("Target directory is already the current Pi cwd.", "info");
				return;
			}

			await ctx.waitForIdle();

			if (!force) {
				const ok = await ctx.ui.confirm(
					"Relocate session?",
					[
						"This will copy the current session JSONL and replace path strings.",
						"It will not switch the live Pi process.",
						"",
						`From: ${oldCwd}`,
						`To:   ${targetCwd}`,
					].join("\n"),
				);
				if (!ok) return;
			}

			const original = await readFile(sessionFile, "utf8");
			let relocated = replaceAllLiteral(original, oldCwd, targetCwd);

			// Handle rare JSON produced with escaped slashes.
			relocated = replaceAllLiteral(
				relocated,
				oldCwd.replace(/\//g, "\\/"),
				targetCwd.replace(/\//g, "\\/"),
			);

			const replacements = original === relocated ? 0 : original.split(oldCwd).length - 1;
			const agentDir = defaultAgentDir();
			const destinationDir = join(agentDir, "sessions", sessionBucketName(targetCwd));
			await mkdir(destinationDir, { recursive: true });

			const destinationFile = join(destinationDir, uniqueRelocatedName(sessionFile));
			await writeFile(destinationFile, relocated, { encoding: "utf8", flag: "wx" });
			await appendManifest({
				ts: new Date().toISOString(),
				fromCwd: oldCwd,
				toCwd: targetCwd,
				sourceSession: sessionFile,
				destinationSession: destinationFile,
				parent: sessionFile,
				replacements,
			});

			const command = `cd ${shellQuote(targetCwd)} && pi --session ${shellQuote(destinationFile)}`;
			ctx.ui.notify(
				[
					`Relocated session written with ${replacements} direct path replacement${replacements === 1 ? "" : "s"}:`,
					destinationFile,
					"",
					"Restart Pi with:",
					command,
				].join("\n"),
				"info",
			);
		},
	});

	pi.registerCommand("relocate-status", {
		description: "Show recorded relocation lineage and discovered relocated session files.",
		handler: async (_args, ctx) => {
			const sessionFile = ctx.sessionManager.getSessionFile();
			const records = await readManifest();
			const discovered = await findRelocatedSessions();
			const byDestination = new Map(records.map((record) => [record.destinationSession, record]));
			const currentIndex = sessionFile ? records.findIndex((record) => record.destinationSession === sessionFile) : -1;
			const lines = [
				"Relocation status",
				"",
				`Current cwd: ${ctx.cwd}`,
				`Current session: ${sessionFile ?? "(ephemeral)"}`,
				`Manifest: ${manifestFile()}`,
				`Recorded relocations: ${records.length}`,
				`Discovered relocated sessions: ${discovered.length}`,
			];

			if (currentIndex >= 0) lines.push(`Current session is recorded relocation #${currentIndex + 1}.`);
			else if (sessionFile) lines.push("Current session is not recorded as a relocation destination.");

			lines.push("", "Recent recorded relocations:");
			for (const [index, record] of records.slice(-10).entries()) {
				const n = records.length - Math.min(10, records.length) + index + 1;
				lines.push(`${n}. ${record.ts}`);
				lines.push(`   ${record.fromCwd} -> ${record.toCwd}`);
				lines.push(`   dest: ${record.destinationSession}`);
			}
			if (records.length === 0) lines.push("(none)");

			const unrecorded = discovered.filter((path) => !byDestination.has(path));
			if (unrecorded.length) {
				lines.push("", "Discovered relocated sessions not in manifest:");
				for (const path of unrecorded.slice(-20)) lines.push(`- ${path}`);
			}

			ctx.ui.notify(lines.join("\n"), "info");
		},
	});
}
