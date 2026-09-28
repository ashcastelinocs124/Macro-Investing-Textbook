import { headline } from '../../lib/economies.js';

type Points = [string, number][];
type Economy = { name: string; gdp_usd: Points; growth: Points; inflation: Points; unemployment: Points };
type Props = { data: { source: string; economies: Record<string, Economy> }; iso3: string };

// Static (no client JS): the four headline numbers for one economy.
export default function EconomyStats({ data, iso3 }: Props) {
	const stats = headline(data.economies[iso3]);
	return (
		<section className="not-content macro-widget">
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(8.5rem, 1fr))', gap: '0.75rem' }}>
				{stats.map((s) => (
					<div key={s.label}>
						<div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--sl-color-white)' }}>{s.text}</div>
						<div className="sub" style={{ margin: 0 }}>{s.label}, {s.year}</div>
					</div>
				))}
			</div>
			<small className="asof">Source: {data.source} (unemployment is an ILO modelled estimate)</small>
		</section>
	);
}
