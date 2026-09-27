/** SVG path for a small line chart of [[date, value], …], plus the x() scale for placing date bands. */
export function sparkline(points, width, height, pad = 2) {
	const xs = points.map(([d]) => Date.parse(d));
	const ys = points.map(([, v]) => v);
	const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
	const x = (date) => pad + ((Date.parse(date) - x0) / (x1 - x0 || 1)) * (width - 2 * pad);
	const y = (v) => height - pad - ((v - y0) / (y1 - y0 || 1)) * (height - 2 * pad);
	const d = points.length < 2 ? '' : points.map(([dt, v], i) => `${i ? 'L' : 'M'}${x(dt).toFixed(1)},${y(v).toFixed(1)}`).join('');
	return { d, x };
}
