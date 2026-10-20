// Turns a policy-rate change list into a chart line that holds each rate until the next change.
/** Step line: repeats the previous rate just before each change so the chart shows steps, not slopes. */
export function stepLine(points) {
	const out = [];
	for (const [date, value] of points) {
		if (out.length) out.push([date, out.at(-1)[1]]);
		out.push([date, value]);
	}
	return out;
}
