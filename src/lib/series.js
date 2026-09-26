/** % change versus the value `periodsPerYear` points earlier. */
// ponytail: assumes no gaps in the series (true for the FRED series we use); switch to date-matching if a gappy series is added.
export function yoy(points, periodsPerYear) {
	const out = [];
	for (let i = periodsPerYear; i < points.length; i++) {
		const [date, value] = points[i];
		const base = points[i - periodsPerYear][1];
		if (base !== 0) out.push([date, (value / base - 1) * 100]);
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
