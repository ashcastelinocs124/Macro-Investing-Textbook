type Row = { iso3: string; country: string; year: number; gdp_usd: number; consumption_pct: number; industry_pct: number };
type Props = { data: { source: string; as_of: string; rows: Row[] } };

const SHORT: Record<string, string> = { 'Russian Federation': 'Russia', 'Korea, Rep.': 'South Korea' };

// Rule of thumb for teaching, stated on the chart.
// Uses the same rounded numbers the chart shows, so a displayed "30%" always matches its label.
const kind = (r: Row) => {
	const [c, i] = [Math.round(r.consumption_pct), Math.round(r.industry_pct)];
	return c >= 60 ? { label: 'Consumer-led', color: '#fd7e14' }
		: i >= 30 || c < 45 ? { label: 'Production-led', color: '#2563eb' }
		: { label: 'Mixed', color: '#94a3b8' };
};

const Bar = ({ pct, color, text }: { pct: number; color: string; text: string }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
		<div style={{ flex: 1, height: 10, background: 'var(--sl-color-gray-6)', borderRadius: 3, minWidth: 40 }}>
			<div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: color, borderRadius: 3 }} />
		</div>
		<span style={{ minWidth: '3.2rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{text}</span>
	</div>
);

// Static (no client JS): renders to plain HTML at build time.
export default function TopEconomies({ data }: Props) {
	const max = data.rows[0].gdp_usd;
	const head = { fontSize: '0.75rem', color: 'var(--sl-color-gray-3)', fontWeight: 600 } as const;
	return (
		<section className="not-content macro-widget">
			<h3>The world’s 10 largest economies, and what drives them</h3>
			<p className="sub">GDP in US dollars. A consumer-led economy runs on household spending; a production-led one leans on factories, construction and exports.</p>
			<div style={{ overflowX: 'auto' }}>
				<div style={{ display: 'grid', gridTemplateColumns: 'minmax(6.5rem,1fr) minmax(7rem,1.6fr) minmax(6.5rem,1.2fr) minmax(6.5rem,1.2fr) max-content', gap: '0.45rem 0.75rem', alignItems: 'center', minWidth: 600, fontSize: '0.85rem' }}>
					<span style={head}>Country</span><span style={head}>GDP</span><span style={head}>Household spending, % of GDP</span><span style={head}>Industry, % of GDP</span><span style={head}>Type</span>
					{data.rows.map((r) => {
						const k = kind(r);
						return [
							<span key={`${r.iso3}c`} style={{ fontWeight: 600 }}>{SHORT[r.country] ?? r.country}</span>,
							<Bar key={`${r.iso3}g`} pct={(r.gdp_usd / max) * 100} color="var(--sl-color-accent)" text={`$${(r.gdp_usd / 1e12).toFixed(1)}T`} />,
							<Bar key={`${r.iso3}h`} pct={r.consumption_pct} color="#fd7e14" text={`${Math.round(r.consumption_pct)}%`} />,
							<Bar key={`${r.iso3}i`} pct={r.industry_pct} color="#2563eb" text={`${Math.round(r.industry_pct)}%`} />,
							<span key={`${r.iso3}k`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
								<span style={{ width: 10, height: 10, borderRadius: '50%', background: k.color, flex: 'none' }} />{k.label}
							</span>,
						];
					})}
				</div>
			</div>
			<p className="sub" style={{ marginTop: '0.75rem' }}>
				Rule of thumb used for the labels: <strong>consumer-led</strong> if household spending is 60% of GDP or more; <strong>production-led</strong> if industry is 30% or more (or household spending is under 45%); otherwise <strong>mixed</strong>. Most big economies are a mix.
			</p>
			<small className="asof">Data as of {data.as_of} · Source: {data.source} (NY.GDP.MKTP.CD, NE.CON.PRVT.ZS, NV.IND.TOTL.ZS)</small>
		</section>
	);
}
