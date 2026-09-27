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

const monthIndex = (date) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7));

/** Points within `before` months ahead of and `after` months after `date`. */
export function around(points, date, before, after) {
	const m = monthIndex(date);
	return points.filter(([d]) => monthIndex(d) >= m - before && monthIndex(d) <= m + after);
}

/** Monthly points with [date, null] filled in for missing months (charts draw nulls as a break). */
export function withGaps(points) {
	const out = [];
	for (const [date, value] of points) {
		const prev = out.at(-1);
		for (let m = prev ? monthIndex(prev[0]) + 1 : monthIndex(date); m < monthIndex(date); m++) {
			const y = Math.floor((m - 1) / 12);
			out.push([`${y}-${String(m - y * 12).padStart(2, '0')}-01`, null]);
		}
		out.push([date, value]);
	}
	return out;
}
