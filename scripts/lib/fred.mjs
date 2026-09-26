// Pure helpers for FRED's keyless CSV endpoint (fredgraph.csv).

export function parseFredCsv(csv) {
	const lines = csv.trim().split(/\r?\n/);
	const header = lines.shift();
	if (!header || !header.startsWith('observation_date,')) {
		throw new Error(`Unexpected FRED CSV header: ${String(header).slice(0, 80)}`);
	}
	const points = [];
	for (const line of lines) {
		const [date, raw] = line.split(',');
		if (raw === undefined || raw === '' || raw === '.') continue; // FRED marks missing observations as empty or "."
		const value = Number(raw);
		if (!Number.isFinite(value)) throw new Error(`Bad value "${raw}" on ${date}`);
		points.push([date, value]);
	}
	return points;
}

export function toSnapshot(meta, points) {
	if (points.length === 0) throw new Error(`${meta.id}: no data points`);
	return {
		series_id: meta.id,
		title: meta.title,
		units: meta.units,
		source: 'FRED',
		as_of: points.at(-1)[0],
		points,
	};
}
