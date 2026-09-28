// Helpers for the "Five big economies" pages (data: src/data/worldbank/big-economies.json).

/** The three chart lines for one economy. */
export const economyLines = (e) => [
	{ label: 'Real GDP growth', points: e.growth },
	{ label: 'Inflation (consumer prices)', points: e.inflation },
	{ label: 'Unemployment rate', points: e.unemployment },
];

/** The four headline numbers, each with the year it is for. */
export function headline(e) {
	const last = (points) => ({ year: points.at(-1)[0].slice(0, 4), value: points.at(-1)[1] });
	const pct = (p) => ({ year: p.year, text: `${p.value.toFixed(1)}%` });
	const gdp = last(e.gdp_usd);
	return [
		{ label: 'GDP', year: gdp.year, text: `$${(gdp.value / 1e12).toFixed(1)} trillion` },
		{ label: 'Real growth', ...pct(last(e.growth)) },
		{ label: 'Inflation', ...pct(last(e.inflation)) },
		{ label: 'Unemployment', ...pct(last(e.unemployment)) },
	];
}

/** A flat goal line (e.g. the 2% target) spanning the same dates as `points`. */
export const goalLine = (label, value, points) => ({ label, points: [[points[0][0], value], [points.at(-1)[0], value]] });
