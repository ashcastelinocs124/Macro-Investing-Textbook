import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';

export type X = string | number;
export type Line = { label: string; points: [X, number][] };
export type Range = { from: X; to: X; label?: string };
type Props = { title: string; units: string; lines: Line[]; ranges?: Range[]; source: string; asOf: string; note?: string };

const toX = (x: X) => (typeof x === 'string' ? new Date(x) : x);
// Accent orange first, then rlvrbook's domain-map colors (amber dropped: too close to orange).
const PALETTE = ['#fd7e14', '#2563eb', '#059669', '#7c3aed'];

export default function Chart({ title, units, lines, ranges = [], source, asOf, note }: Props) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		let lastWidth = -1;
		const draw = () => {
			// Redrawing can itself trigger the ResizeObserver; only redraw when the width really changed.
			if (el.clientWidth === lastWidth) return;
			lastWidth = el.clientWidth;
			const data = lines.flatMap((l) => l.points.map(([x, y]) => ({ series: l.label, x: toX(x), y })));
			const plot = Plot.plot({
				width: el.clientWidth || 640,
				height: 320,
				marginLeft: 48,
				style: { background: 'transparent', color: 'currentColor' },
				x: { label: null },
				y: { label: units, grid: true },
				color: { domain: lines.map((l) => l.label), range: PALETTE, legend: lines.length > 1 },
				marks: [
					Plot.rectX(ranges, { x1: (r: Range) => toX(r.from), x2: (r: Range) => toX(r.to), fill: 'currentColor', fillOpacity: 0.1 }),
					// Alternate labels between two rows so neighbouring bands don't overlap.
					...[0, 1].map((row) =>
						Plot.text(ranges.filter((r) => r.label).filter((_, i) => i % 2 === row), { x: (r: Range) => toX(r.from), text: 'label', frameAnchor: 'top', textAnchor: 'start', dx: 4, dy: 6 + row * 14 }),
					),
					Plot.lineY(data, { x: 'x', y: 'y', stroke: 'series', strokeWidth: 2, tip: true }),
				],
			});
			el.replaceChildren(plot);
		};
		draw();
		const ro = new ResizeObserver(draw);
		ro.observe(el);
		return () => ro.disconnect();
	}, [lines, ranges, units]);

	return (
		<figure className="not-content macro-widget">
			<h3>{title}</h3>
			{note && <p className="sub">{note}</p>}
			<div ref={ref} style={{ minHeight: 320 }} />
			<small className="asof">Data as of {asOf} · Source: {source}</small>
		</figure>
	);
}
