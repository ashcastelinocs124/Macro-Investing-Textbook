import { businessCycle, CYCLE } from '../../lib/business-cycle.js';

const { left: L, right: R } = CYCLE;
const TOP = 20;
const AXIS = 255;

// Static (no client JS): an idealized diagram, drawn at build time.
export default function BusinessCycle() {
	const { path, trend, turns, phases } = businessCycle();
	const label = { fontSize: 13, fontWeight: 700, textAnchor: 'middle' } as const;

	return (
		<section className="not-content macro-widget">
			<h3>The four phases of the business cycle</h3>
			<p className="sub">Output swings above and below its long-run trend. Shaded stretches are contractions (recessions).</p>
			<svg viewBox="0 0 640 290" width="100%" role="img" aria-label="Diagram: economic output rises and falls around an upward trend line, moving through expansion, peak, contraction and trough, then repeating.">
				{phases.map((p) => (
					<g key={p.from}>
						{p.kind === 'Contraction' && <rect x={p.from} y={TOP} width={p.to - p.from} height={AXIS - TOP} fill="currentColor" fillOpacity={0.08} />}
						<text x={(p.from + p.to) / 2} y={36} {...label} fill={p.kind === 'Expansion' ? 'var(--sl-color-accent-high)' : 'var(--sl-color-gray-3)'}>{p.kind}</text>
					</g>
				))}
				<line x1={L} y1={AXIS} x2={R + 6} y2={AXIS} stroke="var(--sl-color-gray-4)" />
				<line x1={L} y1={TOP} x2={L} y2={AXIS} stroke="var(--sl-color-gray-4)" />
				<text x={R} y={275} textAnchor="end" fontSize={12} fill="var(--sl-color-gray-3)">Time →</text>
				<text transform={`translate(${L - 14},140) rotate(-90)`} textAnchor="middle" fontSize={12} fill="var(--sl-color-gray-3)">Economic output (real GDP) →</text>
				<line {...trend} stroke="var(--sl-color-gray-4)" strokeDasharray="5 5" />
				<text x={L + 8} y={trend.y1 - 12} fontSize={12} fill="var(--sl-color-gray-4)">Long-run trend</text>
				<path d={path} fill="none" stroke="var(--sl-color-accent)" strokeWidth={3} />
				{turns.map((t) => (
					<g key={t.x}>
						<circle cx={t.x} cy={t.y} r={5} fill="var(--sl-color-accent)" stroke="var(--macro-widget-bg)" strokeWidth={2} />
						<text x={t.x} y={t.kind === 'Peak' ? t.y - 12 : t.y + 22} {...label} fill="var(--sl-color-white)">{t.kind}</text>
					</g>
				))}
			</svg>
			<small className="asof">Simplified model · real cycles vary in length and depth</small>
		</section>
	);
}
