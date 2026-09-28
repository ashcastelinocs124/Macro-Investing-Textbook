// Idealized business cycle for the chapter 2 diagram: a sine wave around a rising trend, in SVG coordinates (y grows down).
export const CYCLE = { left: 50, right: 620, base: 200, slope: 0.14, amp: 44, period: 300, phase: 165 };

export function businessCycle({ left, right, base, slope, amp, period, phase } = CYCLE) {
	const trend = (x) => base - (x - left) * slope;
	const y = (x) => trend(x) - amp * Math.sin((2 * Math.PI * (x - phase)) / period);
	const xs = [];
	for (let x = left; x <= right; x += 2) xs.push(x);
	const path = `M${xs.map((x) => `${x},${y(x).toFixed(1)}`).join('L')}`;

	// Turning points found on the sampled curve itself, so the dots sit on the drawn line despite the trend's tilt.
	const turns = [];
	for (let i = 1; i < xs.length - 1; i++) {
		const [a, b, c] = [y(xs[i - 1]), y(xs[i]), y(xs[i + 1])];
		if (b < a && b <= c) turns.push({ kind: 'Peak', x: xs[i], y: b });
		if (b > a && b >= c) turns.push({ kind: 'Trough', x: xs[i], y: b });
	}

	// Phases run between turning points: trough -> peak is an expansion, peak -> next trough (or the edge) a contraction.
	const phases = turns.flatMap((t, i) => {
		if (t.kind === 'Trough') return turns[i + 1] ? [{ kind: 'Expansion', from: t.x, to: turns[i + 1].x }] : [];
		return [{ kind: 'Contraction', from: t.x, to: turns[i + 1]?.x ?? right }];
	});

	return { path, trend: { x1: left, y1: trend(left), x2: right, y2: trend(right) }, turns, phases };
}
