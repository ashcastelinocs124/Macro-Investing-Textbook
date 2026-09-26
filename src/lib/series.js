/** % change versus the value on the same date one year earlier (skips points with no such base). */
// Matching by date, not position: FRED series can have gaps (e.g. no Oct 2025 CPI, skipped during the shutdown).
export function yoy(points) {
	const byDate = new Map(points);
	const out = [];
	for (const [date, value] of points) {
		const base = byDate.get(`${Number(date.slice(0, 4)) - 1}${date.slice(4)}`);
		if (base) out.push([date, (value / base - 1) * 100]);
	}
	return out;
}

export function since(points, fromDate) {
	return points.filter(([date]) => date >= fromDate);
}

/** Spans where the indicator is 1 (e.g. FRED USREC). */
export function recessionRanges(points) {
	const ranges = [];
	let start = null;
	for (const [date, value] of points) {
		if (value === 1 && start === null) start = date;
		if (value !== 1 && start !== null) {
			ranges.push({ from: start, to: date });
			start = null;
		}
	}
	if (start !== null) ranges.push({ from: start, to: points.at(-1)[0] });
	return ranges;
}
