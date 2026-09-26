// Fetches every series in scripts/series.json from FRED and writes src/data/<ID>.json.
// A failed series keeps its previous snapshot; the script exits 1 so CI flags it.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseFredCsv, toSnapshot } from './lib/fred.mjs';

const series = JSON.parse(await readFile(new URL('./series.json', import.meta.url), 'utf8'));
const outDir = new URL('../src/data/', import.meta.url);
await mkdir(outDir, { recursive: true });

let failed = 0;
for (const s of series) {
	try {
		const res = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${s.id}`, {
			signal: AbortSignal.timeout(30_000),
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const snap = toSnapshot(s, parseFredCsv(await res.text()));
		await writeFile(new URL(`${s.id}.json`, outDir), JSON.stringify(snap) + '\n');
		console.log(`ok   ${s.id}  ${snap.points.length} points, as of ${snap.as_of}`);
	} catch (err) {
		failed++;
		console.error(`FAIL ${s.id}: ${err.message}`);
	}
}
if (failed) {
	console.error(`${failed} series failed; their previous snapshots were kept.`);
	process.exit(1);
}
