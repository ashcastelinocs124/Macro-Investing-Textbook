import { useState } from 'react';
import Chart from '../Chart.tsx';
import { growthPath } from '../../lib/growth.js';

// Illustrative rates for teaching, not forecasts or historical averages.
const PROFILES = [
	{ label: 'Low risk, low return (2%/yr)', rate: 2 },
	{ label: 'Medium (5%/yr)', rate: 5 },
	{ label: 'Higher risk, higher return (8%/yr)', rate: 8 },
];

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export default function GrowthCalculator() {
	const [amount, setAmount] = useState(1000);
	const [years, setYears] = useState(30);
	const lines = PROFILES.map((p) => ({ label: p.label, points: growthPath(amount, p.rate, years) }));

	return (
		<div className="not-content">
			<div className="macro-widget" style={{ marginBottom: 0 }}>
				<h3>Watch money compound</h3>
				<p className="sub">Simplified model. Returns are fixed each year here; real returns jump around, and higher-return investments can also lose money.</p>
				<label>
					Starting amount: <strong>{money(amount)}</strong>
					<input type="range" min={100} max={10000} step={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
				</label>
				<label>
					Years invested: <strong>{years}</strong>
					<input type="range" min={1} max={50} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} />
				</label>
				<p aria-live="polite" style={{ margin: '0.5rem 0 0' }}>
					After {years} years: {lines.map((l, i) => `${money(l.points.at(-1)![1])} at ${PROFILES[i].rate}%`).join(' · ')}
				</p>
			</div>
			<Chart title="What your money grows to" units="$" lines={lines} source="Illustrative model" asOf="n/a (simulation)" note="x-axis: years" />
		</div>
	);
}
