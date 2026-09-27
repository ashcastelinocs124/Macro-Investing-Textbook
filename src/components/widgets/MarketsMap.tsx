import { sparkline } from '../../lib/sparkline.js';
import { since } from '../../lib/series.js';

type Snapshot = { as_of: string; points: [string, number][] };
type Props = { rates: Snapshot; dollar: Snapshot; oil: Snapshot; stocks: Snapshot };

const FROM = '2006-01-01'; // the broad dollar index starts in 2006
const W = 280;
const H = 70;

const yearAgo = (points: [string, number][]) => {
	const [date] = points.at(-1)!;
	return points.find(([d]) => d === `${Number(date.slice(0, 4)) - 1}${date.slice(4)}`)?.[1];
};

// Static (no client JS): this renders to plain HTML at build time.
export default function MarketsMap({ rates, dollar, oil, stocks }: Props) {
	const markets = [
		{ name: 'Interest rates & bonds', example: '10-year US Treasury yield', snap: rates, fmt: (v: number) => `${v.toFixed(2)}%`, change: (now: number, then: number) => `${now - then >= 0 ? '+' : ''}${(now - then).toFixed(2)} pts`, what: 'The price of borrowing money, set by bond markets and central banks.', moves: 'Inflation, central-bank decisions and government borrowing.' },
		{ name: 'Currencies', example: 'Broad US dollar index', snap: dollar, fmt: (v: number) => v.toFixed(1), what: 'The value of one country’s money against others.', moves: 'Interest-rate gaps between countries, trade and fear (money runs to the dollar in a crisis).' },
		{ name: 'Commodities', example: 'WTI crude oil, $ per barrel', snap: oil, fmt: (v: number) => `$${v.toFixed(2)}`, what: 'Raw materials: energy, metals and crops.', moves: 'Global growth, supply shocks, wars and weather.' },
		{ name: 'Stock indices', example: 'Nasdaq Composite', snap: stocks, fmt: (v: number) => Math.round(v).toLocaleString('en-US'), what: 'Whole markets of company shares, bought as one bet.', moves: 'Growth, profits and, above all, interest rates.' },
	];
	const asOf = [rates, dollar, oil, stocks].map((s) => s.as_of).sort()[0];

	return (
		<section className="not-content macro-widget">
			<h3>The four markets macro investors trade</h3>
			<p className="sub">Real data since 2006. The shaded band is 2022: interest rates and the dollar jumped, oil spiked after Russia invaded Ukraine, and stocks fell.</p>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem' }}>
				{markets.map((m) => {
					const pts = since(m.snap.points, FROM);
					const { d, x } = sparkline(pts, W, H);
					const now = pts.at(-1)![1];
					const then = yearAgo(pts);
					const pct = then === undefined ? '' : m.change ? m.change(now, then) : `${now >= then ? '+' : ''}${((now / then - 1) * 100).toFixed(1)}%`;
					return (
						<div key={m.name} style={{ border: '1px solid var(--sl-color-gray-5)', borderRadius: 8, padding: '0.75rem 0.9rem' }}>
							<div style={{ fontWeight: 600 }}>{m.name}</div>
							<div className="sub" style={{ margin: 0 }}>{m.example}</div>
							<div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.35rem 0 0.2rem' }}>
								<span style={{ fontSize: '1.35rem', fontWeight: 700 }}>{m.fmt(now)}</span>
								{pct && <span className="sub" style={{ margin: 0 }}>{pct} vs a year earlier</span>}
							</div>
							<svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" role="img" aria-label={`${m.example}, ${pts[0][0].slice(0, 4)} to ${pts.at(-1)![0].slice(0, 4)}`}>
								<rect x={x('2022-01-01')} y={0} width={x('2023-01-01') - x('2022-01-01')} height={H} fill="currentColor" fillOpacity={0.1} />
								<path d={d} fill="none" stroke="var(--sl-color-accent)" strokeWidth={1.8} vectorEffect="non-scaling-stroke" />
							</svg>
							<p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem' }}><strong>What it is:</strong> {m.what}</p>
							<p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}><strong>Moves when:</strong> {m.moves}</p>
						</div>
					);
				})}
			</div>
			<small className="asof">Data as of {asOf} · Source: FRED (Federal Reserve, Nasdaq, EIA)</small>
		</section>
	);
}
