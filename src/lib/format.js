// Plain-English labels for chart tooltips.

/** Dates → "Sep 2025"; model x-values → "Quarter 12" (or just the number). */
export function fmtWhen(x, xLabel) {
	if (x instanceof Date) return x.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
	return xLabel ? `${xLabel} ${x}` : String(x);
}

/** 3.02% · $83.90 per barrel · $10,063 · 26,494 index */
export function fmtValue(v, units) {
	const big = Math.abs(v) >= 1000;
	const n = v.toLocaleString('en-US', { minimumFractionDigits: big ? 0 : 2, maximumFractionDigits: big ? 0 : 2 });
	if (units === '% points') return `${n} pts`;
	if (units.startsWith('%')) return `${n}${units}`;
	if (units.startsWith('$')) return `$${n}${units.slice(1)}`;
	return `${n} ${units}`;
}
