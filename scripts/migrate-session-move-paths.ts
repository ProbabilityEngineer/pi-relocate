#!/usr/bin/env node
import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

const home = process.env.HOME ?? ".";
const agentDir = process.env.PI_CODING_AGENT_DIR ?? join(home, ".pi", "agent");
const legacyRoot = join(agentDir, "session-move", "legacy");
const manifestPath = join(legacyRoot, "migration-manifest.jsonl");

type MigrationMode = "copy" | "move";
type MigrationStatus = "copied" | "moved" | "already-present" | "skipped-destination-mismatch";
type CopyRecord = { ts: string; sourcePath: string; destinationPath: string; bytes: number; sha256: string; status: MigrationStatus; mode: MigrationMode };

async function exists(path: string) { try { await stat(path); return true; } catch { return false; } }
async function sha256(path: string) { return createHash("sha256").update(await readFile(path)).digest("hex"); }

async function copyEvidence(sourcePath: string, destinationPath: string, mode: MigrationMode): Promise<CopyRecord | undefined> {
	if (!(await exists(sourcePath))) return undefined;
	const st = await stat(sourcePath);
	if (!st.isFile()) return undefined;
	await mkdir(dirname(destinationPath), { recursive: true });
	const hash = await sha256(sourcePath);
	let status: MigrationStatus = "copied";
	if (await exists(destinationPath)) {
		if (await sha256(destinationPath) !== hash) status = "skipped-destination-mismatch";
		else status = "already-present";
	} else {
		await copyFile(sourcePath, destinationPath);
	}
	if (mode === "move" && status !== "skipped-destination-mismatch") {
		if (await sha256(destinationPath) !== hash) status = "skipped-destination-mismatch";
		else {
			await unlink(sourcePath);
			status = "moved";
		}
	}
	return { ts: new Date().toISOString(), sourcePath, destinationPath, bytes: st.size, sha256: hash, status, mode };
}

async function walkFiles(dir: string): Promise<string[]> {
	const out: string[] = [];
	const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
	for (const entry of entries) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...await walkFiles(path));
		else if (entry.isFile()) out.push(path);
	}
	return out;
}

function migrationMode(args: string[]): MigrationMode {
	if (args.includes("--move")) return "move";
	if (args.includes("--copy")) return "copy";
	return "copy";
}

async function main() {
	const mode = migrationMode(process.argv.slice(2));
	const copies: [string, string][] = [];
	copies.push([join(agentDir, "relocations.jsonl"), join(legacyRoot, "manifests", "relocations.jsonl")]);
	copies.push([join(agentDir, "relocation-lineages.jsonl"), join(legacyRoot, "manifests", "relocation-lineages.jsonl")]);
	for (const entry of await readdir(agentDir, { withFileTypes: true }).catch(() => [])) {
		if (entry.isFile() && /^relocations\.backup\..*\.jsonl$/.test(entry.name)) copies.push([join(agentDir, entry.name), join(legacyRoot, "manifests", "backups", entry.name)]);
	}
	for (const script of await walkFiles(join(agentDir, "relocations"))) copies.push([script, join(legacyRoot, "restart-scripts", relative(join(agentDir, "relocations"), script))]);
	const records: CopyRecord[] = [];
	for (const [source, dest] of copies) {
		const record = await copyEvidence(source, dest, mode);
		if (record) records.push(record);
	}
	await mkdir(legacyRoot, { recursive: true });
	if (records.length) await writeFile(manifestPath, records.map((record) => JSON.stringify(record)).join("\n") + "\n", { encoding: "utf8", flag: "a" });
	const verb = mode === "move" ? "Moved or verified" : "Copied or verified";
	console.log(`${verb} ${records.length} legacy session-move evidence files.`);
	console.log(`Migration manifest: ${manifestPath}`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exit(1); });
