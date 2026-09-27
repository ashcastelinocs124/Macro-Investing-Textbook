// Fetches every series in scripts/series.json from FRED and writes src/data/<ID>.json.
// A failed series keeps its previous snapshot; the script exits 1 so CI flags it.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseFredCsv, toSnapshot } from './lib/fred.mjs';
import { parseWorldBank, realCountries, topEconomies } from './lib/worldbank.mjs';

const series = JSON.parse(await readFile(new URL('./series.json', import.meta.url), 'utf8'));
const outDir = new URL('../src/data/', import.meta.url);
await mkdir(outDir, { recursive: true });

let failed = 0;
for (const s of series) {
	try {
		const res = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${s.id}${s.query ?? ''}`, {
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
// World Bank: the 10 largest economies, and how consumption- or production-heavy each one is.
const WB = 'https://api.worldbank.org/v2';
const wb = async (path) => {
	const res = await fetch(`${WB}/${path}${path.includes('?') ? '&' : '?'}format=json&per_page=400`, { signal: AbortSignal.timeout(30_000) });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
};
try {
	const indicator = async (id) => parseWorldBank(await wb(`country/all/indicator/${id}?mrnev=1`));
	const rows = topEconomies(
		realCountries(await wb('country')),
		await indicator('NY.GDP.MKTP.CD'), // GDP, current US$
		await indicator('NE.CON.PRVT.ZS'), // household consumption, % of GDP
		await indicator('NV.IND.TOTL.ZS'), // industry incl. construction, % of GDP
		10,
	);
	if (rows.length < 10) throw new Error(`only ${rows.length} economies with complete data`);
	await mkdir(new URL('worldbank/', outDir), { recursive: true });
	const snap = { source: 'World Bank', as_of: String(Math.max(...rows.map((r) => r.year))), rows };
	await writeFile(new URL('worldbank/top-economies.json', outDir), JSON.stringify(snap, null, '\t') + '\n');
	console.log(`ok   World Bank top economies (${rows.map((r) => r.iso3).join(' ')})`);
} catch (err) {
	failed++;
	console.error(`FAIL World Bank top economies: ${err.message}`);
}

if (failed) {
	console.error(`${failed} series failed; their previous snapshots were kept.`);
	process.exit(1);
}
