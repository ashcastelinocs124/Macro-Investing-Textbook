// Simplified public-debt arithmetic (debt as a % of GDP); not a forecast.
/** Each year: debt x (1 + interest) / (1 + growth) + primary deficit (all in % of GDP / as fractions). */
export function debtPath({ rate, growth, primary, start = 100, years = 20 }) {
	const path = [[0, start]];
	let debt = start;
	for (let t = 1; t <= years; t++) {
		debt = (debt * (1 + rate)) / (1 + growth) + primary * 100;
		path.push([t, debt]);
	}
	return path;
}

/** 'Shrinking', 'Rising' or 'Snowballing' from the start and end of a path. */
export function verdict(path) {
	const [start, end] = [path[0][1], path.at(-1)[1]];
	return end > 1.5 * start ? 'Snowballing' : end > start + 0.5 ? 'Rising' : 'Shrinking';
}
