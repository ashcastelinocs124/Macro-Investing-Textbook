import { useMemo, useState } from 'react';
import Chart, { type Line } from '../Chart.tsx';
import { yoy, since, recessionRanges } from '../../lib/series.js';

type Snapshot = { as_of: string; points: [string, number][] };
type Props = { gdp: Snapshot; cpi: Snapshot; unrate: Snapshot; usrec: Snapshot };

const SPANS = [
	{ label: '10Y', years: 10 },
	{ label: '25Y', years: 25 },
	{ label: 'All', years: 80 },
];

export default function EconomyExplorer({ gdp, cpi, unrate, usrec }: Props) {
	const [show, setShow] = useState({ growth: true, inflation: true, unemployment: false });
	const [years, setYears] = useState(25);

	const all = useMemo(
		() => ({
			growth: { label: 'Real GDP growth (% y/y)', points: yoy(gdp.points) },
			inflation: { label: 'CPI inflation (% y/y)', points: yoy(cpi.points) },
			unemployment: { label: 'Unemployment rate (%)', points: unrate.points },
		}),
		[gdp, cpi, unrate],
	);

	const from = `${new Date().getFullYear() - years}-01-01`;
	const lines: Line[] = (Object.keys(all) as (keyof typeof all)[])
		.filter((k) => show[k])
		.map((k) => ({ label: all[k].label, points: since(all[k].points, from) }));
	const ranges = useMemo(() => recessionRanges(since(usrec.points, from)), [usrec, from]);
	const asOf = [gdp.as_of, cpi.as_of, unrate.as_of].sort()[0]; // the oldest input sets how fresh the chart is

	return (
		<div className="not-content">
			<div className="macro-widget" style={{ marginBottom: 0 }}>
				<h3>Explore the US economy</h3>
				<p className="sub">Toggle measures and time spans. Shaded bands are recessions.</p>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
					{(Object.keys(all) as (keyof typeof all)[]).map((k) => (
						<label key={k} style={{ display: 'inline-flex', gap: '0.35rem' }}>
							<input type="checkbox" checked={show[k]} onChange={() => setShow((s) => ({ ...s, [k]: !s[k] }))} />
							{all[k].label}
						</label>
					))}
					<span role="group" aria-label="Time span" style={{ display: 'inline-flex', gap: '0.35rem' }}>
						{SPANS.map((s) => (
							<button key={s.label} type="button" aria-pressed={years === s.years} onClick={() => setYears(s.years)}>{s.label}</button>
						))}
					</span>
				</div>
			</div>
			{lines.length === 0 ? (
				<p className="macro-widget">Pick at least one measure to chart.</p>
			) : (
				<Chart title="Growth, inflation and jobs" units="%" lines={lines} ranges={ranges} source="FRED (BEA, BLS, NBER)" asOf={asOf} />
			)}
		</div>
	);
}
